#!/usr/bin/env python3
"""Subtitle-piece start times inside one voice clip, from speech-recognition timestamps (no mora lengths needed).

AivisSpeech (Style-Bert-VITS2) returns dummy mora lengths in its audio query, so tts.py's mora sidecar can't time the ｜
subtitle pieces. Here an offline Japanese ASR (sherpa-onnx ReazonSpeech zipformer, model from GitHub releases) gives
per-token times; expected text and recognised tokens are both turned into katakana and aligned, and each piece boundary
is mapped to the time of the first recognised token that belongs to the next piece.

  from asr_align import Aligner; starts, quality = Aligner(model_dir).piece_starts(audio, ["…、", "…。"])
  python3 asr_align.py <model_dir> <audio> "piece1｜piece2｜…"
Model: https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-ja-reazonspeech-2024-08-01.tar.bz2
Needs: pip install sherpa-onnx pykakasi. Validation vs VOICEVOX mora sidecars: README.md here.
"""
import difflib, re, subprocess, sys
import numpy as np

_kk = None
def kata(t):
    global _kk
    if _kk is None:
        import pykakasi; _kk = pykakasi.kakasi()
    s = "".join(i["kana"] for i in _kk.convert(t))
    s = re.sub(r"[^ァ-ヴー]", "", s).replace("ー", "")
    s = re.sub(r"([エケセテネヘメレゲゼデベペ])イ", r"\1エ", s); s = re.sub(r"([オコソトノホモヨロゴゾドボポョ])ウ", r"\1オ", s)
    return s.replace("ヅ", "ズ").replace("ヲ", "オ")

class Aligner:
    PAD = 0.25
    def __init__(self, model_dir, threads=4):
        import sherpa_onnx
        m = str(model_dir).rstrip("/") + "/"
        self.rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=m + "encoder-epoch-99-avg-1.int8.onnx", decoder=m + "decoder-epoch-99-avg-1.onnx",
            joiner=m + "joiner-epoch-99-avg-1.int8.onnx", tokens=m + "tokens.txt", num_threads=threads)
    def tokens(self, path):
        x = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
        x = np.concatenate([np.zeros(int(16000 * self.PAD), np.float32), np.frombuffer(x, np.float32), np.zeros(8000, np.float32)])
        st = self.rec.create_stream(); st.accept_waveform(16000, x); self.rec.decode_stream(st)
        return [(t, max(0.0, ts - self.PAD)) for t, ts in zip(st.result.tokens, st.result.timestamps)], st.result.text
    @staticmethod
    def onsets(path, min_gap=0.06):
        """speech onsets after silent gaps (s): [(gap_start, onset)] — candidate places where a new subtitle piece begins"""
        x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                                         capture_output=True, check=True).stdout, np.float32)
        w = 160; e = np.sqrt((x[: len(x) // w * w].reshape(-1, w) ** 2).mean(1) + 1e-12)
        db = 20 * np.log10(e / (e.max() + 1e-12)); sil = db < -38
        out, run = [], 0
        for i, q in enumerate(sil):
            if q: run += 1
            else:
                if run * w / 16000 >= min_gap: out.append(((i - run) * w / 16000, i * w / 16000))
                run = 0
        return out
    def piece_starts(self, path, pieces, expected_kana=None, snap=0.6):
        """expected_kana: optional reading of each piece from the TTS engine (better for numbers/Latin than pykakasi)"""
        toks, _ = self.tokens(path)
        hyp, owner = "", []
        for k, (t, _) in enumerate(toks):
            kt = kata(t); hyp += kt; owner += [k] * len(kt)
        exp = [kata(k) for k in expected_kana] if expected_kana else [kata(p) for p in pieces]; ref = "".join(exp)
        sm = difflib.SequenceMatcher(None, ref, hyp, autojunk=False); blocks = sm.get_matching_blocks()
        def ref2hyp(i):
            for a, b, n in blocks:
                if n and a + n > i: return b + max(0, i - a)
            return len(hyp) - 1
        starts, pos = [0.0], 0
        for e in exp[:-1]:
            pos += len(e)
            j = min(len(owner) - 1, ref2hyp(pos)) if owner else 0
            starts.append(round(toks[owner[j]][1], 3) if owner else 0.0)
        gaps = self.onsets(path)
        for i in range(1, len(starts)):            # a piece after 、/。 starts when speech resumes after the pause: snap there
            if pieces[i - 1].rstrip().endswith(("、", "。", "？", "！", "」", "…", ",")) and gaps:
                g = min(gaps, key=lambda g: abs(g[1] - starts[i]))
                if abs(g[1] - starts[i]) <= snap: starts[i] = round(g[1], 3)
        for i in range(1, len(starts)):            # keep order
            starts[i] = max(starts[i], starts[i - 1] + 0.2)
        return starts, round(sm.ratio(), 3)

if __name__ == "__main__":
    print(Aligner(sys.argv[1]).piece_starts(sys.argv[2], sys.argv[3].split("｜")))

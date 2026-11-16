#!/usr/bin/env python3
"""Map subtitle-piece start times from a reference clip (same words, known times) onto a new clip by DTW on MFCCs.

Used for AivisSpeech: the VOICEVOX clip of the same sentence has exact mora-timed piece starts (.parts.json); dynamic
time warping between the two recordings carries those times over to the AivisSpeech clip. Boundaries after 、。 are then
snapped to the speech onset after the nearest pause (asr_align.Aligner.onsets).
"""
import numpy as np, subprocess

SR = 16000; HOP = 160   # 10 ms frames

def load(path):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                        capture_output=True, check=True).stdout, np.float32)

def feats(x):
    import librosa
    m = librosa.feature.mfcc(y=x, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=512)[1:]          # drop c0 (loudness)
    m = (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)                    # per-utterance CMVN: speaker-neutral-ish
    d = np.vstack([m, librosa.feature.delta(m)])
    return d

def warp(ref_path, new_path):
    """returns f(t_ref) -> t_new (seconds)"""
    import librosa
    a, b = feats(load(ref_path)), feats(load(new_path))
    _, wp = librosa.sequence.dtw(X=a, Y=b, metric="cosine", subseq=False)
    wp = wp[::-1]
    def f(t):
        i = int(round(t * SR / HOP)); js = wp[wp[:, 0] == min(i, a.shape[1] - 1), 1]
        return float(np.median(js)) * HOP / SR if len(js) else t
    return f

def piece_starts(ref_path, ref_starts, new_path, pieces, snap=0.35):
    f = warp(ref_path, new_path); st = [0.0] + [round(f(t), 3) for t in ref_starts[1:]]
    try:
        from asr_align import Aligner
        gaps = Aligner.onsets(new_path)
    except Exception:
        gaps = []
    for i in range(1, len(st)):
        if gaps and pieces[i - 1].rstrip().endswith(("、", "。", "？", "！", "」", "…")):
            g = min(gaps, key=lambda g: abs(g[1] - st[i]))
            if abs(g[1] - st[i]) <= snap: st[i] = round(g[1], 3)
    for i in range(1, len(st)): st[i] = max(st[i], st[i - 1] + 0.2)
    return st

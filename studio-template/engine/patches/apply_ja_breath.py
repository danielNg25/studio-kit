#!/usr/bin/env python3
"""Idempotent patch for engine/build.py + engine/runtime.js (2026-10-07, japan-company long-form):
"breath groups" — one TTS clip per whole sentence / speaker turn, several subtitle cues inside it.

In episode.yaml a line may contain the subtitle-break marker ｜ (U+FF5C):
    lines: ["ノキアは携帯電話事業のほぼすべてを、｜売却すると発表します。"]
  - the TTS reads the line WITHOUT the marker, in one go (natural flow and accent; no fixed pause between pieces);
  - each piece between markers is its own subtitle cue (burned-in subtitles and the SRT);
  - cue times come from a sidecar <clip>.parts.json written by the TTS tool (VOICEVOX: exact mora timings);
    without it, cue times are shared out by character count (fallback, e.g. --silent previews or other providers).
The marker is part of the clip hash, so moving a break regenerates that clip (its timings change).
Lines without ｜ behave exactly as before.

Run from anywhere:  python3 studio-template/engine/patches/apply_ja_breath.py
Patches by anchor text, so other sessions' edits to build.py / runtime.js are kept."""
import sys
from pathlib import Path

ENG = Path(__file__).resolve().parent.parent
done, missing = [], []


def patch(path, key, old, new):
    s = path.read_text()
    if key in s:
        return
    if old not in s:
        missing.append(f"{path.name}: {key}")
        return
    path.write_text(s.replace(old, new, 1))
    done.append(f"{path.name}: {key}")


B = ENG / "build.py"
R = ENG / "runtime.js"

# 1. constant + helpers (after split_sentences)
patch(B, "BREAK_MARK = ",
      '''def split_sentences(line):
    return [s for s in re.split(r"(?<=[.?!])\\s+", line.strip()) if s]
''',
      '''def split_sentences(line):
    return [s for s in re.split(r"(?<=[.?!])\\s+", line.strip()) if s]


BREAK_MARK = "｜"   # subtitle break inside one TTS clip (breath group) — patches/apply_ja_breath.py


def parts_of(text):
    """subtitle pieces of a sentence (split at ｜); one piece when there is no marker"""
    return [p for p in text.split(BREAK_MARK) if p] or [text]


def trim_ab(x, thr_db=-42):
    """same cut as trim(), as sample indices (a, b) — used to shift sidecar timings"""
    import numpy as np
    win = int(0.01 * SR)
    if len(x) < win * 4:
        return 0, len(x)
    n = len(x) // win
    rms = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    idx = np.where(rms > max(rms.max() * 10 ** (thr_db / 20), 1e-4))[0]
    if len(idx) == 0:
        return 0, len(x)
    return max(0, idx[0] * win - int(0.02 * SR)), min(len(x), (idx[-1] + 1) * win + int(0.05 * SR))


def sent_parts(c, s, start, dur, raw_offset=0.0):
    """[{text, start, dur}] subtitle cues inside one clip: sidecar timings when present, else by characters"""
    pt = s.get("parts_text") or []
    if len(pt) < 2:
        return None
    f = c.clips / (str(s.get("file", "")) + ".parts.json")
    if s.get("file") and f.exists():
        try:
            side = json.load(open(f))
            if side.get("clip_sha256"):   # AivisSpeech sidecars carry the hash of the clip they were timed on (tools/align/aivis_parts.py)
                import hashlib
                if hashlib.sha256(open(c.clips / s["file"], "rb").read()).hexdigest() != side["clip_sha256"]:
                    sys.exit(f"stale subtitle timing for {s['file']} (clip was re-made) — run tools/align/aivis_parts.py {c.ep_dir}")
            st = [max(0.0, float(x) - raw_offset) for x in side["starts"]]
            if len(st) == len(pt):
                st[0] = 0.0
                out = []
                for i, p in enumerate(pt):
                    a = min(st[i], dur); b = min(st[i + 1], dur) if i + 1 < len(pt) else dur
                    out.append({"text": p, "start": round(start + a, 3), "dur": round(max(0.05, b - a), 3)})
                return out
        except Exception as e:
            print(f"  ! parts sidecar unreadable ({f.name}): {e}")
    tot = sum(len(p) for p in pt) or 1; t = start; out = []
    for p in pt:
        d = dur * len(p) / tot; out.append({"text": p, "start": round(t, 3), "dur": round(d, 3)}); t += d
    return out
''')

# 2. sentences(): spoken text without the marker, marker kept in the hash, pieces recorded
patch(B, 'spoken_parts = [p for p',
      '''                return {"spoken": spoken, "file": fname, "base": hashlib.sha1(base.encode()).hexdigest()[:12], "voice": sv or c.voice_id}''',
      '''                spoken_parts = [p for p in spoken.split(BREAK_MARK) if p]
                return {"spoken": spoken.replace(BREAK_MARK, ""), "file": fname, "base": hashlib.sha1(base.encode()).hexdigest()[:12],
                        "voice": sv or c.voice_id, **({"spoken_parts": spoken_parts} if len(spoken_parts) > 1 else {})}''')
patch(B, "ent[\"parts_text\"]",
      '''                ent = {"shot": shot["id"], "line": li, "sent": k, "text": CENSOR_RE.sub(r"\\1", sen)}''',
      '''                ent = {"shot": shot["id"], "line": li, "sent": k, "text": CENSOR_RE.sub(r"\\1", sen).replace(BREAK_MARK, "")}
                if BREAK_MARK in sen:
                    ent["parts_text"] = parts_of(CENSOR_RE.sub(r"\\1", sen))''')

# 3. cmd_audio: exact trim offset for clips with a sidecar, cues inside the sentence
patch(B, "trim_ab(raw)",
      '''                else:
                    x = trim(decode(f))
                for a, b in censor_spans(c, x, s, silent):''',
      '''                else:
                    raw = decode(f); a0, b0 = trim_ab(raw)
                    x = raw[a0:b0]
                for a, b in censor_spans(c, x, s, silent):''')
patch(B, "sent_parts(c, s, t,",
      '''                ss.append({"text": sen, "start": round(t, 3), "dur": round(len(x) / SR, 3)})''',
      '''                ent_t = {"text": sen, "start": round(t, 3), "dur": round(len(x) / SR, 3)}
                ps = sent_parts(c, s, t, len(x) / SR, (a0 / SR) if (not silent and f.exists()) else 0.0)
                if ps: ent_t["parts"] = ps
                ss.append(ent_t)''')
# trim offset must exist on the silent path too
patch(B, "a0, b0 = 0, 0  # breath",
      '''                if silent or not f.exists():
                    if not silent:''',
      '''                a0, b0 = 0, 0  # breath groups: trim offset of the raw clip
                if silent or not f.exists():
                    if not silent:''')

# 4. SRT: use the cues inside the sentence
patch(B, 'se.get("parts")',
      '''            for se in ln["sents"]:
                pieces = _chunks(se["text"])''',
      '''            for se in ln["sents"]:
                if se.get("parts"):   # breath group: cues already timed (patches/apply_ja_breath.py)
                    for p in se["parts"]:
                        cues.append([p["start"], p["start"] + p["dur"], p["text"]])
                    continue
                pieces = _chunks(se["text"])''')

# 5. burned-in subtitles (runtime.js)
patch(R, "se.parts",
      '''function chunk(se, maxc) {
''',
      '''function chunk(se, maxc) {
  if (se.parts && se.parts.length) return se.parts.map(p => ({ text: p.text, start: p.start, end: p.start + p.dur }));   // breath group (apply_ja_breath.py)
''')

# 6. line text in the timeline without the marker (scenes read ctx.lines)
patch(B, 'lines.append({"text": text.replace(BREAK_MARK',
      '''            lines.append({"text": text, "start": round(lstart, 3)''',
      '''            lines.append({"text": text.replace(BREAK_MARK, ""), "start": round(lstart, 3)''')

print("patched:", ", ".join(done) if done else "nothing (already applied)")
if missing:
    print("ANCHOR NOT FOUND (engine changed? patch by hand):", "; ".join(missing))
    sys.exit(1)

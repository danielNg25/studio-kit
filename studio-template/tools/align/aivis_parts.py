#!/usr/bin/env python3
"""<clip>.parts.json for AivisSpeech breath-group clips: subtitle piece starts mapped from the VOICEVOX reference clip
(<clip>.ref.mp3 + .ref.mp3.parts.json, made by tools/voicevox/tts.py --ref-for-aivis) onto the AivisSpeech clip by DTW,
then snapped to pause onsets after 、。. Same JSON shape as tts.py's mora sidecar, so build.py `audio` uses it unchanged.

  python3 tools/align/aivis_parts.py ../<channel>/episodes/<id> [--force] [--check]
A sidecar is reused only when its stored fingerprint (sha256 of the AivisSpeech clip and of the reference clip, the reference
mora starts, the subtitle pieces, the algorithm version) still matches — re-made clips (tts_aivis.py --redo) are re-timed
automatically (v6 review 2026-10-07). build.py `audio` refuses a sidecar whose clip_sha256 no longer matches the clip.
Validated 2026-10-07: VOICEVOX 玄野武宏 → 剣崎雌雄 (exact mora truth on both sides), 83 boundaries:
median |error| 0.018 s, p90 0.045 s, max 0.078 s.
"""
import json, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE.parents[1] / "engine"))
import build as B, dtw_align as D  # noqa: E402

import hashlib
ALGO = "dtw-mfcc19+d/cosine/onset-snap0.35/v1"   # change when dtw_align changes → every sidecar is recomputed

def sha(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()

def fingerprint(c, s):
    """everything the timing depends on: the AivisSpeech audio, the reference audio + its mora starts, the pieces, the algorithm"""
    ref = c.clips / (s["file"] + ".ref.mp3")
    return {"clip_sha256": sha(c.clips / s["file"]), "ref_sha256": sha(ref),
            "ref_starts": json.load(open(str(ref) + ".parts.json"))["starts"], "pieces": s["spoken_parts"], "algo": ALGO}

def is_fresh(c, s):
    f = c.clips / (s["file"] + ".parts.json")
    if not f.exists(): return False
    try: old = json.load(open(f))
    except Exception: return False
    fp = fingerprint(c, s)
    return all(old.get(k) == v for k, v in fp.items())

c = B.Ctx(sys.argv[1]); force = "--force" in sys.argv; check = "--check" in sys.argv
cand = [s for s in B.clips_of(B.sentences(c)) if str(s.get("voice") or "").startswith("aivis:") and s.get("spoken_parts")]
miss = [s["file"] for s in cand if not (c.clips / s["file"]).exists() or not (c.clips / (s["file"] + ".ref.mp3.parts.json")).exists()]
if miss:
    sys.exit(f"{len(miss)} clips lack the AivisSpeech clip or its VOICEVOX reference (run tools/aivis/run.sh and tts.py --ref-for-aivis): {miss[:5]}")
todo = [s for s in cand if force or not is_fresh(c, s)]
if check:
    print(f"aivis_parts: {len(cand) - len(todo)} up to date, {len(todo)} stale/missing"); sys.exit(1 if todo else 0)
for s in todo:
    ref = c.clips / (s["file"] + ".ref.mp3"); fp = fingerprint(c, s)
    st = D.piece_starts(ref, fp["ref_starts"], c.clips / s["file"], s["spoken_parts"])
    json.dump({"starts": st, "method": "dtw-from-voicevox-ref", **fp}, open(c.clips / (s["file"] + ".parts.json"), "w"), ensure_ascii=False)
print(f"aivis_parts: {len(todo)} clips timed, {len(cand) - len(todo)} reused (fingerprint unchanged)")

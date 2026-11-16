#!/usr/bin/env python3
"""AivisSpeech voice clips for an episode (cast codes  aivis:<style_id>@<speedScale>[@<intonationScale>]).

Runs INSIDE the AivisSpeech-Engine venv while the engine listens on localhost:10101 (use run.sh, which starts the engine,
calls this with a time budget and stops it). Clip names come from build.py sentences(), like tts.py for VOICEVOX.
Style-Bert-VITS2 output varies a little between runs: a clip with a blurred word can be re-made with --redo <file>[,<file>].
Stops cleanly when the time budget is used up (exit 3) — just run again; finished clips are kept.
Subtitle piece timing is NOT done here (no mora timings in AivisSpeech): afterwards run
  tools/voicevox/tts.py <ep> --ref-for-aivis     (Mac VM: VOICEVOX reference clips)
  tools/align/aivis_parts.py <ep>                 (DTW → <clip>.parts.json)
Re-split reuse (2026-10-08): audio/clips/aivis_spoken.json maps "<voice>|<speed>|<text without ｜>" → clip. A missing clip
whose words are already spoken by an existing clip (only the subtitle split ｜ moved) is COPIED, not re-synthesized, so the
voice stays identical; aivis_parts.py then re-times the new split. Run with --index-only BEFORE editing the script
(no engine needed) if aivis_spoken.json does not list the current clips yet.
"""
import json, os, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request
from pathlib import Path
STUDIO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(STUDIO / "engine"))
import build as B  # noqa: E402

URL = os.environ.get("AIVIS_URL", "http://localhost:10101")
T0 = time.time(); BUDGET = float(os.environ.get("BUDGET", "120"))

def parse(code):
    p = code.split(":", 1)[1].split("@")
    return int(p[0]), float(p[1]) if len(p) > 1 else 1.0, float(p[2]) if len(p) > 2 else 1.0

def synth(text, sid, speed, inton):
    q = json.load(urllib.request.urlopen(urllib.request.Request(f"{URL}/audio_query?" + urllib.parse.urlencode({"text": text, "speaker": sid}), method="POST")))
    q.update(speedScale=speed, intonationScale=inton, prePhonemeLength=0.1, postPhonemeLength=0.1)
    return urllib.request.urlopen(urllib.request.Request(f"{URL}/synthesis?speaker={sid}", data=json.dumps(q).encode(),
                                                         headers={"Content-Type": "application/json"})).read()

def spoken_key(c, s): return f"{s['voice']}|{c.speed}|{s['spoken']}"

def update_index(c, sents):
    p = c.clips / "aivis_spoken.json"; idx = json.load(open(p)) if p.exists() else {}
    for s in B.clips_of(sents):
        if str(s.get("voice") or "").startswith("aivis:") and (c.clips / s["file"]).exists(): idx[spoken_key(c, s)] = s["file"]
    json.dump(idx, open(p, "w"), ensure_ascii=False, indent=0, sort_keys=True); return idx

def main():
    c = B.Ctx(sys.argv[1]); sents_all = B.sentences(c)
    if "--index-only" in sys.argv:
        print(f"aivis: index has {len(update_index(c, sents_all))} clips"); return
    idx = update_index(c, sents_all)
    redo = set(sys.argv[sys.argv.index("--redo") + 1].split(",")) if "--redo" in sys.argv else set()   # re-synthesize (overwrite) these clips
    todo = [s for s in B.clips_of(sents_all) if str(s.get("voice") or "").startswith("aivis:") and (s["file"] in redo or not (c.clips / s["file"]).exists())]
    reuse = [s for s in todo if s["file"] not in redo and (c.clips / idx.get(spoken_key(c, s), "-")).exists()]
    for s in reuse:
        shutil.copyfile(c.clips / idx[spoken_key(c, s)], c.clips / s["file"]); print(f"  reused {idx[spoken_key(c, s)]} → {s['file']} (only the split moved)")
    todo = [s for s in todo if s not in reuse]
    print(f"aivis: {len(todo)} clips to make ({len(reuse)} reused)", flush=True)
    for n, s in enumerate(todo):
        if time.time() - T0 > BUDGET:
            B.save_index(c, sents_all); update_index(c, sents_all); print(f"aivis: time budget used, {len(todo) - n} left — run again"); sys.exit(3)
        sid, speed, inton = parse(s["voice"])
        w = synth(s["spoken"], sid, speed, inton)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f: f.write(w)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f.name, "-b:a", "160k", str(c.clips / s["file"])], check=True); os.unlink(f.name)
        print(f"  {n + 1}/{len(todo)} [{sid}] {s['spoken'][:40]}", flush=True)
    B.save_index(c, sents_all); update_index(c, sents_all); print("aivis: done")
    if redo: print("  re-made clips → their subtitle timing is now stale: run tools/align/aivis_parts.py (it re-times them by fingerprint)")

if __name__ == "__main__":
    main()

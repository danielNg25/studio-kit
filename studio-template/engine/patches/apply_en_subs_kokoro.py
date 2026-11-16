#!/usr/bin/env python3
"""Idempotent patch for engine/build.py (2026-10-06, ve_chuyen_ref goes English):
  1. voice provider `kokoro` — offline English TTS (sherpa-onnx, Kokoro v0.19 int8), no API key, no network after the model download.
  2. `subs` — export YouTube subtitles (SRT) from timeline.json; runs automatically at the end of `audio`.
Run from anywhere:  python3 studio-template/engine/patches/apply_en_subs_kokoro.py
Patches by anchor text, so other sessions' edits to build.py are kept."""
import re, sys
from pathlib import Path

P = Path(__file__).resolve().parent.parent / "build.py"
s = P.read_text()
changed = []

# 1a. dispatch
old = '''    if c.voice.get("provider", "vbee") != "vbee":
        sys.exit("voice providers: vbee | elevenlabs")'''
new = '''    if c.voice.get("provider", "vbee") == "kokoro":
        return cmd_voice_kokoro(c)
    if c.voice.get("provider", "vbee") != "vbee":
        sys.exit("voice providers: vbee | elevenlabs | kokoro")'''
if "cmd_voice_kokoro(c)" not in s and old in s:
    s = s.replace(old, new, 1); changed.append("dispatch")

# 1b. the provider
KOKORO = '''

# ---------------------------------------------------------------- voice: Kokoro (offline English TTS, sherpa-onnx)
KOKORO_SPEAKERS = {"af": 0, "af_bella": 1, "af_nicole": 2, "af_sarah": 3, "af_sky": 4, "am_adam": 5, "am_michael": 6,
                   "bf_emma": 7, "bf_isabella": 8, "bm_george": 9, "bm_lewis": 10}   # kokoro-int8-en-v0_19 (voices.bin order)


def cmd_voice_kokoro(c: Ctx):
    """voice.yaml: provider: kokoro, voice_id: kokoro:am_michael, speed: 0.95, model_dir: <dir with model.int8.onnx, voices.bin,
    tokens.txt, espeak-ng-data> (default studio-template/.cache/tts/kokoro-int8-en-v0_19; download once:
    https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-int8-en-v0_19.tar.bz2). pip install sherpa-onnx.
    Runs on the cloud container or the Mac (CPU, ~1.7x slower than real time on 2 cores)."""
    import numpy as np, soundfile as sf, sherpa_onnx as so
    d = Path(os.path.expanduser(c.voice.get("model_dir") or (STUDIO / ".cache/tts/kokoro-int8-en-v0_19")))
    if not (d / "voices.bin").exists():
        sys.exit(f"kokoro model not found in {d} (see cmd_voice_kokoro docstring)")
    sents_all = sentences(c)
    sents = clips_of(sents_all)
    todo = [s for s in sents if not (c.clips / s["file"]).exists()]
    print(f"voice: {len(sents) - len(todo)} cached, {len(todo)} to generate (kokoro {c.voice_id}, speed {c.speed})")
    if not todo:
        return
    cfg = so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(kokoro=so.OfflineTtsKokoroModelConfig(
        model=str(d / "model.int8.onnx") if (d / "model.int8.onnx").exists() else str(d / "model.onnx"),
        voices=str(d / "voices.bin"), tokens=str(d / "tokens.txt"), data_dir=str(d / "espeak-ng-data")),
        num_threads=int(c.voice.get("threads", 2))), max_num_sentences=1)
    tts = so.OfflineTts(cfg)
    for n, s in enumerate(todo):
        name = (s.get("voice") or c.voice_id or "kokoro:am_michael").split(":")[-1]
        sid = KOKORO_SPEAKERS.get(name, int(name) if str(name).isdigit() else 6)
        a = tts.generate(s["spoken"], sid=sid, speed=c.speed)
        wav = c.clips / (s["file"] + ".wav")
        sf.write(wav, np.asarray(a.samples, dtype=np.float32), a.sample_rate)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-b:a", "160k", str(c.clips / s["file"])], check=True)
        wav.unlink()
        if (n + 1) % 10 == 0:
            print(f"  {n + 1}/{len(todo)}", flush=True)
    save_index(c, sents_all)
    print("voice: done")
'''
if "def cmd_voice_kokoro" not in s:
    anchor = "\n# ---------------------------------------------------------------- audio\nSR = 44100"
    if anchor not in s:
        sys.exit("anchor for kokoro not found")
    s = s.replace(anchor, KOKORO + anchor, 1); changed.append("kokoro")

# 2a. SRT writer
SUBS = '''

# ---------------------------------------------------------------- subtitles for YouTube (SRT, not burned in)
def _wrap2(text, width=42):
    """one cue = at most 2 balanced lines of <= width chars"""
    words, best = text.split(), None
    if len(text) <= width:
        return text
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        if len(a) <= width and len(b) <= width:
            sc = abs(len(a) - len(b))
            if best is None or sc < best[0]:
                best = (sc, a + "\\n" + b)
    return best[1] if best else text


def _chunks(text, width=42):
    """split a sentence into pieces that fit 2 lines: prefer , ; : — breaks, then word breaks"""
    if len(text) <= 2 * width:
        return [text]
    parts = [p.strip() for p in re.split(r"(?<=[,;:—–])\\s+", text) if p.strip()]
    out, cur = [], ""
    for p in parts:
        if len(p) > 2 * width:   # still too long: break on words
            if cur: out.append(cur); cur = ""
            w, line = p.split(), ""
            for x in w:
                if len(line) + 1 + len(x) > 2 * width - 4 and line:
                    out.append(line); line = x
                else:
                    line = (line + " " + x).strip()
            if line: cur = line
            continue
        if cur and len(cur) + 1 + len(p) > 2 * width:
            out.append(cur); cur = p
        else:
            cur = (cur + " " + p).strip()
    if cur: out.append(cur)
    return out


def _ts(x):
    x = max(0.0, x); h = int(x // 3600); m = int(x % 3600 // 60); sec = x % 60
    return f"{h:02d}:{m:02d}:{int(sec):02d},{int(round((sec - int(sec)) * 1000)) % 1000:03d}"


def cmd_subs(c: Ctx):
    """timeline.json -> build/<id>.<lang>.srt and <channel>/out/<id>_<format>.<lang>.srt (upload as YouTube captions).
    lang = blueprint `language` (vi/en). Cue text = the sentence as written (pronunciation fixes are not shown)."""
    tl = json.load(open(c.build / "timeline.json"))
    if tl.get("silent"):
        print("subs: skipped (silent timing estimate)"); return
    lang = (c.blueprint.get("language") or "vi").split("-")[0]
    cues = []
    for sh in tl["shots"]:
        for ln in sh["lines"]:
            for se in ln["sents"]:
                pieces = _chunks(se["text"])
                tot = sum(len(p) for p in pieces) or 1; t = se["start"]
                for p in pieces:
                    d = se["dur"] * len(p) / tot
                    cues.append([t, t + d, _wrap2(p)]); t += d
    for i, cu in enumerate(cues):   # hold each cue a little into the pause, never past the next one; min 0.8 s on screen
        nxt = cues[i + 1][0] if i + 1 < len(cues) else tl["total"]
        cu[1] = min(max(cu[1] + 0.25, cu[0] + 0.8), nxt - 0.02) if nxt - 0.02 > cu[0] else cu[1]
    srt = "".join(f"{i + 1}\\n{_ts(a)} --> {_ts(b)}\\n{txt}\\n\\n" for i, (a, b, txt) in enumerate(cues))
    eid = c.ep.get("id", c.ep_dir.name)
    p1 = c.build / f"{eid}.{lang}.srt"; p1.write_text(srt, encoding="utf-8")
    p2 = c.renders / f"{eid}_{c.fmt['id']}.{lang}.srt"; p2.write_text(srt, encoding="utf-8")
    print(f"subs: {len(cues)} cues -> {p2}")
'''
if "def cmd_subs" not in s:
    anchor = "\n# ---------------------------------------------------------------- music + sfx"
    if anchor not in s:
        sys.exit("anchor for subs not found")
    s = s.replace(anchor, SUBS + anchor, 1); changed.append("subs")

# 2b. run subs at the end of audio (first write_youtube(c) after the 'audio: ' print)
old = '''    print(f"audio: {total:.1f}s{' (silent estimate)' if silent else ''}")
    write_youtube(c)'''
if old in s and "write_youtube(c)\n    cmd_subs(c)" not in s:
    s = s.replace(old, old + "\n    cmd_subs(c)", 1); changed.append("audio->subs")

# 2c. CLI
m = re.search(r'choices=\[("plan", "voice", "audio"[^\]]*)\]', s)
if m and '"subs"' not in m.group(1):
    s = s.replace(m.group(0), m.group(0).replace('"audio", ', '"audio", "subs", ', 1), 1); changed.append("cli choice")
old = '    elif a.command == "audio": cmd_audio(c, a.silent)'
if old in s and 'a.command == "subs"' not in s:
    s = s.replace(old, old + '\n    elif a.command == "subs": cmd_subs(c)', 1); changed.append("cli dispatch")
# docstring
old = "  audio    assemble narration.wav"
if old in s and "  subs     " not in s:
    s = s.replace(old, "  subs     timeline -> YouTube subtitles: build/<id>.<lang>.srt + <channel>/out/<id>_<format>.<lang>.srt (also run by audio)\n" + old, 1)
    changed.append("doc")

P.write_text(s)
print("patched:", ", ".join(changed) or "nothing (already applied)")

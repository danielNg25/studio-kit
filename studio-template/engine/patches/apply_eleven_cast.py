"""Patch build.py: ElevenLabs uses the per-sentence voice (episode `cast:` / shot `voice:` / `line_voices`) instead of one
voice for the whole episode. Idempotent; anchored on exact lines. Run: python3 patches/apply_eleven_cast.py (from engine/)."""
from pathlib import Path
p = Path(__file__).resolve().parent.parent / "build.py"
s = p.read_text(encoding="utf-8")
MARK = "# eleven-cast-patch"
if MARK in s:
    print("already patched"); raise SystemExit
a = '''    if not (key and c.voice_id):
        sys.exit("missing ELEVENLABS_API_KEY / voice_id (check the channel .env and voice.yaml)")'''
b = '''    if not key:   # eleven-cast-patch: per-sentence voice (cast / shot voice / line_voices), voice.yaml voice_id = default
        sys.exit("missing ELEVENLABS_API_KEY (check the channel .env)")'''
assert s.count(a) == 1, "anchor 1"
s = s.replace(a, b)
a = '''            r = urllib.request.Request(f"{ELEVEN}{c.voice_id}?output_format={fmt}", data=json.dumps(body).encode(), method="POST",'''
b = '''            vid = (s.get("voice") or c.voice_id or "").split(":")[-1]
            if not vid:
                sys.exit(f"no ElevenLabs voice for sentence {i} (set voice_id in voice.yaml or cast: in episode.yaml)")
            r = urllib.request.Request(f"{ELEVEN}{vid}?output_format={fmt}", data=json.dumps(body).encode(), method="POST",'''
assert s.count(a) == 1, "anchor 2"
s = s.replace(a, b)
a = '''                "previous_text": " ".join(x["spoken"] for x in sents[max(0, i - 2):i]) or None,'''
b = '''                "previous_text": " ".join(x["spoken"] for x in sents[max(0, i - 2):i] if x.get("voice") == s.get("voice")) or None,'''
assert s.count(a) == 1, "anchor 3"
s = s.replace(a, b)
p.write_text(s, encoding="utf-8")
print("patched")

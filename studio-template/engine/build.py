#!/usr/bin/env python3
"""Studio build tool — one episode.yaml in, one video out.

usage:  python3 build.py <episode_dir> <command> [--force] [--silent]

commands
  plan     split the script into sentences, show length vs. the format budget
  voice    generate missing voice clips — VBee (Vietnamese) or ElevenLabs (English), voice.yaml provider; one per sentence, unchanged sentences are reused
  subs     timeline -> YouTube subtitles: build/<id>.<lang>.srt + <channel>/out/<id>_<format>.<lang>.srt (also run by audio)
  audio    assemble narration.wav + timeline.json with the format's pauses   (--silent: estimate, no voice needed)
           also writes build/youtube.md (chapter timestamps + suggested mid-roll positions) when shots have `chapter:`
  mix      narration.wav + episode `music:` cues + `sfx:` hits -> build/mix.wav (render uses it when newer than narration)
           tracks in <channel>/music/ ; a cue gives `file:` or a `mood:` looked up in <channel>/music/library.yaml
           folders + names: blueprint `media:` (e.g. assets/music, assets/sfx) — see engine/media.py for every key
           (music bed default, shot-level sfx at a word, auto_sfx on card change, memes, background clips)
  remux    swap the finished mp4's audio for build/mix.wav (no re-render)
  qa       run the checks (banned words, length, anchors, stickers, facts, chapters, mid-roll) -> build/qa.md
  stills   render 2 frames per shot -> build/contact.jpg (quick visual review)
  render   render the final mp4 -> <channel>/out/<episode>_<format>.mp4   (blueprint output_dir, default out: all finished videos of a channel in one folder)
  all      plan + voice + audio + qa + render
  post     after the video is approved: post.md = caption + hashtags (paste-ready) + pinned comment
           --mode nguon : comment = sources used, with links        (default: blueprint publishing.comment_mode)
           --mode fact  : comment = one extra fun fact (episode.yaml post.bonus_fact) + its source
           --link URL   : adds the "support the channel" line with an affiliate/shop link (or set post.support_link)

layout it expects
  <channel>/blueprint.yaml, voice.yaml, .env, channel.yaml (studio: <path to studio-template>)
  <channel>/episodes/<episode>/episode.yaml  (+ optional scenes.js for template: custom)
"""
import argparse, hashlib, json, os, re, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

import yaml

STUDIO = Path(__file__).resolve().parent.parent
ENGINE = STUDIO / "engine"
sys.path.insert(0, str(ENGINE))
import media as M   # channel media: music beds, sfx, memes, background clips (engine/media.py)


# ---------------------------------------------------------------- loading
def load_yaml(p):
    with open(p, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def find_channel(ep_dir: Path) -> Path:
    for d in [ep_dir, *ep_dir.parents]:
        if (d / "blueprint.yaml").exists():
            return d
    sys.exit(f"no blueprint.yaml above {ep_dir}")


def load_env(path: Path):
    env = {}
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip().replace("\r", "")
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def expand(v, env):
    if isinstance(v, str):
        return re.sub(r"\$\{(\w+)\}", lambda m: env.get(m.group(1), os.environ.get(m.group(1), "")), v)
    return v


class Ctx:
    def __init__(self, ep_dir):
        self.ep_dir = Path(ep_dir).resolve()
        self.ch_dir = find_channel(self.ep_dir)
        self.blueprint = load_yaml(self.ch_dir / "blueprint.yaml")
        self.voice = load_yaml(self.ch_dir / "voice.yaml") if (self.ch_dir / "voice.yaml").exists() else {}
        env_file = self.ch_dir / self.blueprint.get("env_file", ".env")
        self.env = load_env(env_file)
        self.ep = load_yaml(self.ep_dir / "episode.yaml")
        fmt_id = self.ep.get("format") or self.blueprint.get("format", "short-60")
        self.fmt_dir = STUDIO / "templates" / "formats" / fmt_id
        self.fmt = load_yaml(self.fmt_dir / "format.yaml")
        # ghi đè thông số format theo kênh / tập (vd. fps: 30 cho kênh nhiều hiệu ứng)
        self.fmt.update(self.blueprint.get("format_overrides") or {}); self.fmt.update(self.ep.get("format_overrides") or {})
        self.build = self.ep_dir / "build"; self.build.mkdir(exist_ok=True)
        self.clips = self.ep_dir / "audio" / "clips"; self.clips.mkdir(parents=True, exist_ok=True)
        self.renders = self.ch_dir / self.blueprint.get("output_dir", "out"); self.renders.mkdir(exist_ok=True)   # finished videos: <channel>/out/
        v = dict(self.voice); v.update(self.ep.get("voice") or {})
        self.voice_id = expand(v.get("voice_id", ""), self.env)
        self.speed = float(v.get("speed", 1.0))
        self.pron = dict(v.get("pronounce") or {}); self.pron.update(self.ep.get("pronounce") or {})
        p = dict(self.fmt.get("pauses") or {}); p.update(v.get("pauses") or {}); p.update(self.ep.get("pauses") or {})
        self.pauses = {"sentence": 0.35, "line": 0.45, "shot": 0.6, **p}
        self.pauses.setdefault("chapter", self.pauses["shot"])


# ---------------------------------------------------------------- plan
def split_sentences(line):
    return [s for s in re.split(r"(?<=[.?!])\s+", line.strip()) if s]


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


_VOICES = None


def voice_catalog():
    """studio-template/voices/*.yaml: alias -> {code, name, gender, region, …} (VBee giọng tiếng Việt)"""
    global _VOICES
    if _VOICES is None:
        _VOICES = {}
        for f in sorted((STUDIO / "voices").glob("*.yaml")) if (STUDIO / "voices").exists() else []:
            _VOICES.update((load_yaml(f) or {}).get("voices") or {})
    return _VOICES


def voice_code(name):
    """alias from the catalog (nu-bac-ngochuyen) or a raw VBee code -> VBee code"""
    v = voice_catalog().get(str(name))
    return v["code"] if v else str(name)


def shot_voice(c, shot):
    """Per-shot voice (several people in one video): shot `voice:` > episode `cast:`[shot `speaker:` or params.card.user].
    None = the channel's default voice (voice.yaml)."""
    v = shot.get("voice")
    if not v:
        spk = shot.get("speaker") or (((shot.get("params") or {}).get("card") or {}).get("user"))
        v = (c.ep.get("cast") or {}).get(spk) if spk else None
    return voice_code(v) if v else None


def sentences(c: Ctx):
    out = []
    for shot in c.ep["shots"]:
        sv0 = shot_voice(c, shot)
        lv = shot.get("line_voices") or []   # several people inside one card: one voice per line (cast name or alias; empty = shot voice)
        for li, line in enumerate(shot.get("lines", [])):
            nm = lv[li] if li < len(lv) else None
            sv = voice_code((c.ep.get("cast") or {}).get(nm, nm)) if nm else sv0
            def clip(txt):
                spoken = txt
                for a, b in c.pron.items():
                    spoken = spoken.replace(a, b)
                if sv:   # cast voice: the code is not a secret, so the file name is the same on every machine
                    base = f"{sv}|{c.speed}|{spoken}"
                    fname = hashlib.sha1(base.encode()).hexdigest()[:12] + ".mp3"
                else:
                    base = f"{c.speed}|{spoken}"
                    if c.voice_id:
                        fname = hashlib.sha1(f"{c.voice_id}|{base}".encode()).hexdigest()[:12] + ".mp3"
                    else:  # no secrets on this machine: find the clip made earlier via the index
                        fname = clip_index(c).get(hashlib.sha1(base.encode()).hexdigest()[:12], "missing.mp3")
                spoken_parts = [p for p in spoken.split(BREAK_MARK) if p]
                return {"spoken": spoken.replace(BREAK_MARK, ""), "file": fname, "base": hashlib.sha1(base.encode()).hexdigest()[:12],
                        "voice": sv or c.voice_id, **({"spoken_parts": spoken_parts} if len(spoken_parts) > 1 else {})}
            for k, sen in enumerate(split_sentences(line)):
                ent = {"shot": shot["id"], "line": li, "sent": k, "text": CENSOR_RE.sub(r"\1", sen).replace(BREAK_MARK, "")}
                if BREAK_MARK in sen:
                    ent["parts_text"] = parts_of(CENSOR_RE.sub(r"\1", sen))
                if CENSOR_RE.search(sen):
                    # censored words {shown}: the TTS reads the WHOLE sentence in one go with "bíp" in place of each censored syllable
                    # (natural flow, nothing vulgar sent to VBee); `audio` finds those syllables (syllable segmentation) and mutes them,
                    # `mix` plays the beep there (blueprint `censor: {sfx, gain_db, say}`). {shown|…}: anything after | is ignored.
                    say = str((c.blueprint.get("censor") or {}).get("say", "bíp"))
                    nsyl = lambda w: max(1, len(re.findall(r"\w+", w)))
                    ent.update(clip(CENSOR_RE.sub(lambda m: " ".join([say] * nsyl(m.group(1))), sen).strip()))
                    ent["censor"] = [{"word": m.group(1), "n": nsyl(m.group(1)),
                                      "k0": len(re.findall(r"\w+", CENSOR_RE.sub(lambda q: " ".join([say] * nsyl(q.group(1))), sen[:m.start()])))}
                                     for m in CENSOR_RE.finditer(sen)]
                else:
                    ent.update(clip(sen))
                out.append(ent)
    return out


CENSOR_RE = re.compile(r"\{([^}|]*)(?:\|([^}]*))?\}")


def clips_of(sents):
    """the TTS clips behind the sentences"""
    return [s for s in sents if s.get("file")]


def _band_env(x, hop):
    import numpy as np
    h, w = int(hop * SR), int(0.02 * SR); n = max(1, len(x) // h)
    fr = np.lib.stride_tricks.as_strided(np.pad(x, (0, w)), shape=(n, w), strides=(x.strides[0] * h, x.strides[0]))
    sp = np.abs(np.fft.rfft(fr * np.hanning(w), axis=1)); f = np.fft.rfftfreq(w, 1 / SR)
    e = np.sqrt((sp[:, (f > 250) & (f < 4000)] ** 2).sum(1))
    k = np.hanning(7); e = np.convolve(e, k / k.sum(), "same")
    return 20 * np.log10(e + 1e-6)


def syllable_bounds(x, text, hop=0.005):
    """Vietnamese = one syllable per written word: place N-1 syllable boundaries on energy dips, keeping each syllable's
    length close to what its letters (+ a pause after punctuation) predict (dynamic programming). -> [(start_s, end_s)] per syllable."""
    import numpy as np
    toks = re.findall(r"\w+|[,.;:?!…]", text); w = []
    for i, t in enumerate(toks):
        if re.match(r"\w", t): w.append([len(t) + 2.0, 0.0])
        elif w and any(re.match(r"\w", u) for u in toks[i + 1:]): w[-1][1] += 1   # pause only between words (clip ends are trimmed)
    if not w:
        return []
    e = _band_env(x, hop); n = len(e)
    d = np.zeros(n)
    for i in range(2, n - 2):
        if e[i] <= e[i - 1] and e[i] <= e[i + 1]:
            d[i] = max(0.0, min(e[max(0, i - 20):i].max(), e[i + 1:i + 21].max()) - e[i])
    base = np.array([a for a, _ in w]); pz = np.array([p for _, p in w]); pause = 0.22 / hop
    exp = np.maximum(base / base.sum() * max(n - pause * pz.sum(), n * 0.5) + pause * pz, 4)
    bcost = np.where(d > 0, -d / 3.0, 1.0)
    prev = np.full(n + 1, 1e18); prev[0] = 0; back = []
    for k in range(len(w)):
        cur = np.full(n + 1, 1e18); arg = np.zeros(n + 1, int)
        lo, hi = max(1, int(0.3 * exp[k])), int(2.4 * exp[k]) + 20
        for b in range(1, n + 1):
            a0, a1 = max(0, b - hi), b - lo
            if a1 < a0: continue
            durs = b - np.arange(a0, a1 + 1)
            cst = prev[a0:a1 + 1] + ((durs - exp[k]) / (0.45 * exp[k])) ** 2
            j = int(np.argmin(cst)); cur[b] = cst[j] + (0 if b == n else bcost[b]); arg[b] = a0 + j
        back.append(arg); prev = cur
    b, bounds = n, [n]
    for k in range(len(w) - 1, -1, -1):
        b = back[k][b]; bounds.append(b)
    bounds = bounds[::-1]
    return [(bounds[i] * hop, bounds[i + 1] * hop) for i in range(len(w))], e


def censor_spans(c, x, s, silent):
    """[(start_sample, end_sample)] of each censored word inside the sentence audio x"""
    import numpy as np
    marks = s.get("censor") or []
    if not marks:
        return []
    nall = max(1, len(re.findall(r"\w+", s["spoken"])))
    if silent:
        return [(int(len(x) * m["k0"] / nall), int(len(x) * (m["k0"] + m["n"]) / nall)) for m in marks]
    sb, e = syllable_bounds(x, s["spoken"]); hop = 0.005; out = []
    say = str((c.blueprint.get("censor") or {}).get("say", "bíp")).lower()
    syl = [w.lower() for w in re.findall(r"\w+", s["spoken"])]          # the "bíp" syllables, after pronunciation fixes
    slots = [i for i, w in enumerate(syl) if w == say]
    for m in marks:
        k0 = slots.pop(0) if slots else m["k0"]
        for _ in range(m["n"] - 1):
            if slots: slots.pop(0)
        a, b = sb[k0][0], sb[min(len(sb), k0 + m["n"]) - 1][1]
        i0, i1 = int(a / hop), min(len(e), max(int(a / hop) + 1, int(b / hop)))   # drop a trailing pause inside the span
        loud = np.where(e[i0:i1] > e[i0:i1].max() - 15)[0]
        if len(loud): b = min(b, (i0 + loud[-1] + 1) * hop)
        b = min(b, a + 0.32 * m["n"])
        if b - a < 0.15 * m["n"]:                                          # too short: extend forward only (never into the word before)
            b = a + 0.15 * m["n"]
        out.append((max(0, int((a - 0.025) * SR)), min(len(x), int((b + 0.03) * SR))))
    return out


def clip_index(c):
    p = c.clips / "index.json"
    return json.load(open(p)) if p.exists() else {}


def save_index(c, sents):
    idx = clip_index(c)
    for s in clips_of(sents):
        if (c.clips / s["file"]).exists():
            idx[s["base"]] = s["file"]
    json.dump(idx, open(c.clips / "index.json", "w"), indent=1)


def cmd_plan(c: Ctx):
    sents = sentences(c)
    chars = sum(len(s["text"]) for s in sents)
    cps = c.fmt.get("chars_per_second", 20)
    n_sent = len(sents); n_lines = sum(len(s.get("lines", [])) for s in c.ep["shots"]); n_shots = len(c.ep["shots"])
    est = chars / cps + (n_sent - n_lines) * c.pauses["sentence"] + (n_lines - n_shots) * c.pauses["line"] + (n_shots - 1) * c.pauses["shot"] + 1.7 \
        + sum(1 for s in c.ep["shots"][1:] if s.get("chapter")) * (c.pauses["chapter"] - c.pauses["shot"])
    lo, hi = c.fmt.get("budget_chars", [0, 1e9])
    print(f"plan: {n_shots} shots, {n_sent} sentences, {chars} chars (budget {lo}-{hi}), est. {est:.1f}s (format {c.fmt.get('duration_s')})")
    if any(s.get("chapter") for s in c.ep["shots"]):
        per, cur = [], None
        for shot in c.ep["shots"]:
            if shot.get("chapter") or cur is None:
                cur = [shot.get("chapter") or (c.fmt.get("chapters") or {}).get("first_title", "Intro"), 0]; per.append(cur)
            cur[1] += sum(len(x["text"]) for x in sents if x["shot"] == shot["id"])
        for title, n in per:
            print(f"  · {title}: {n} chars ≈ {n / cps:.0f}s of speech")
    json.dump(sents, open(c.build / "sentences.json", "w"), ensure_ascii=False, indent=1)
    voices = {}
    for x in sents: voices.setdefault(x["voice"], set()).add(x["shot"])
    if len(voices) > 1 or c.ep.get("cast"):
        rev = {v["code"]: a for a, v in voice_catalog().items()}
        for v, shots in voices.items():
            print(f"  voice {rev.get(v, 'default' if v == c.voice_id else v)}: {len(shots)} shots")
    return sents


# ---------------------------------------------------------------- voice (VBee async API)
VBEE = "https://api.vbee.vn/v1/tts"


def vbee_call(c, method, url, body=None):
    h = {"Authorization": "Bearer " + c.env.get("VBEE_TOKEN", ""), "App-Id": c.env.get("VBEE_APP_ID", ""), "Content-Type": "application/json"}
    r = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, method=method, headers=h)
    try:
        with urllib.request.urlopen(r, timeout=30) as x:
            return x.status, x.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def cmd_voice(c: Ctx):
    if c.voice.get("provider", "vbee") == "elevenlabs":
        return cmd_voice_eleven(c)
    if c.voice.get("provider", "vbee") == "kokoro":
        return cmd_voice_kokoro(c)
    if c.voice.get("provider", "vbee") != "vbee":
        sys.exit("voice providers: vbee | elevenlabs | kokoro")
    sents = sentences(c)
    if not (c.env.get("VBEE_TOKEN") and c.env.get("VBEE_APP_ID") and all(s["voice"] for s in sents)):
        sys.exit("missing VBEE_APP_ID / VBEE_TOKEN / voice_id (check the channel .env and voice.yaml)")
    allc = clips_of(sents)
    todo = [s for s in allc if not (c.clips / s["file"]).exists()]
    print(f"voice: {len(allc) - len(todo)} cached, {len(todo)} to generate (voice speed {c.speed})")
    reqs, rejected = {}, []
    for s in todo:
        code, d = vbee_call(c, "POST", VBEE, {"text": s["spoken"], "mode": "async", "voiceCode": s["voice"], "outputFormat": "mp3",
                                              "bitrate": 128, "speed": c.speed, "webhookUrl": "https://example.com/vbee-callback"})
        if code == 400:   # content filter (e.g. "Request is a hate speech" on swear words): keep going, report the sentence
            rejected.append((s.get("shot"), s.get("text", s["spoken"]), d[:160].decode("utf-8", "replace"))); continue
        if code not in (200, 201, 202):
            sys.exit(f"VBee error {code}: {d[:200]!r}")
        reqs[s["file"]] = json.loads(d)["requestId"]
    deadline = time.time() + 300
    while reqs and time.time() < deadline:
        time.sleep(3)
        for f, rid in list(reqs.items()):
            code, d = vbee_call(c, "GET", f"{VBEE}/requests/{rid}")
            j = json.loads(d)
            if j.get("status") == "COMPLETED" and j.get("audioLink"):
                with urllib.request.urlopen(j["audioLink"], timeout=30) as x:
                    (c.clips / f).write_bytes(x.read())
                del reqs[f]
            elif j.get("status") == "FAILED" or "error" in j:
                sys.exit(f"VBee failed for {f}: {j}")
    save_index(c, sents)
    if reqs:
        sys.exit(f"VBee timed out on {len(reqs)} clips; run voice again to resume")
    if rejected:
        sys.exit("VBee từ chối (sửa lời đọc các câu này rồi chạy lại voice):\n" + "\n".join(f"  {sh}: {t}  <- {msg}" for sh, t, msg in rejected))
    print("voice: done")



# ---------------------------------------------------------------- voice: ElevenLabs (English narration)
ELEVEN = "https://api.elevenlabs.io/v1/text-to-speech/"


def cmd_voice_eleven(c: Ctx):
    """One mp3 per sentence (same cache/index scheme as VBee). previous_text/next_text keep the prosody continuous
    across sentence clips. voice.yaml: provider: elevenlabs, voice_id: ${ELEVENLABS_VOICE}, model, speed (0.7-1.2), settings {}."""
    key = c.env.get("ELEVENLABS_API_KEY") or os.environ.get("ELEVENLABS_API_KEY")
    if not key:   # eleven-cast-patch: per-sentence voice (cast / shot voice / line_voices), voice.yaml voice_id = default
        sys.exit("missing ELEVENLABS_API_KEY (check the channel .env)")
    sents_all = sentences(c)
    sents = clips_of(sents_all)
    todo = [i for i, s in enumerate(sents) if not (c.clips / s["file"]).exists()]
    print(f"voice: {len(sents) - len(todo)} cached, {len(todo)} to generate (elevenlabs, speed {c.speed})")
    model = c.voice.get("model", "eleven_multilingual_v2")
    vs = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}
    vs.update(c.voice.get("settings") or {})
    vs["speed"] = max(0.7, min(1.2, c.speed))
    fmt = c.voice.get("output_format", "mp3_44100_128")
    for n, i in enumerate(todo):
        s = sents[i]
        body = {"text": s["spoken"], "model_id": model, "voice_settings": vs,
                "previous_text": " ".join(x["spoken"] for x in sents[max(0, i - 2):i] if x.get("voice") == s.get("voice")) or None,
                "next_text": sents[i + 1]["spoken"] if i + 1 < len(sents) else None}
        body = {k: v for k, v in body.items() if v is not None}
        for attempt in range(6):
            vid = (s.get("voice") or c.voice_id or "").split(":")[-1]
            if not vid:
                sys.exit(f"no ElevenLabs voice for sentence {i} (set voice_id in voice.yaml or cast: in episode.yaml)")
            r = urllib.request.Request(f"{ELEVEN}{vid}?output_format={fmt}", data=json.dumps(body).encode(), method="POST",
                                       headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
            try:
                with urllib.request.urlopen(r, timeout=120) as x:
                    (c.clips / s["file"]).write_bytes(x.read())
                break
            except urllib.error.HTTPError as e:
                msg = e.read()[:300]
                if e.code in (429, 500, 502, 503) and attempt < 5:
                    time.sleep(3 * (attempt + 1))
                    continue
                save_index(c, sents_all)
                sys.exit(f"ElevenLabs error {e.code} on sentence {i}: {msg!r}")
        if (n + 1) % 10 == 0:
            print(f"  {n + 1}/{len(todo)}")
    save_index(c, sents_all)
    print("voice: done")


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

# ---------------------------------------------------------------- audio
SR = 44100


def decode(path):
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def trim(x, thr_db=-42):
    import numpy as np
    win = int(0.01 * SR)
    if len(x) < win * 4:
        return x
    n = len(x) // win
    rms = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    idx = np.where(rms > max(rms.max() * 10 ** (thr_db / 20), 1e-4))[0]
    if len(idx) == 0:
        return x
    return x[max(0, idx[0] * win - int(0.02 * SR)): min(len(x), (idx[-1] + 1) * win + int(0.05 * SR))]


def soften_narration(c):
    """Optional EQ/de-ess on the finished narration.wav (voice.yaml or episode `voice: {soften: "<ffmpeg -af chain>"}`)."""
    chain = (c.ep.get("voice") or {}).get("soften") or c.voice.get("soften")
    if not chain: return
    import subprocess, numpy as np, soundfile as sf
    src = c.build / "narration.wav"; tmp = c.build / "narration.soft.wav"
    r = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", str(src), "-af", chain, "-c:a", "pcm_f32le", str(tmp)])
    if r.returncode: sys.exit("soften: ffmpeg failed — check voice.soften")
    x, sr = sf.read(tmp, dtype="float32"); pk = float(np.max(np.abs(x))) or 1.0
    sf.write(src, x / pk * 0.89, sr); tmp.unlink()
    print("soften: applied voice filter")


def cmd_audio(c: Ctx, silent=False):
    import numpy as np, soundfile as sf
    sents = sentences(c)
    by_key = {(s["shot"], s["line"], s["sent"]): s for s in sents}
    cps = c.fmt.get("chars_per_second", 20)
    LEAD, TAIL = 0.35, 1.4
    it = M.intro_plan(c)   # intro sound: the voice waits for it
    if it and it.get("lead"): LEAD = max(LEAD, it["lead"])
    t, chunks, shots, beeps = LEAD, [], [], []
    for si, shot in enumerate(c.ep["shots"]):
        if si:
            gap = (c.pauses["chapter"] if shot.get("chapter") else c.pauses["shot"]) + float(c.ep["shots"][si - 1].get("hold", 0))   # hold: extra beat after a punchline
            t += gap
        s0 = t - (LEAD if si == 0 else gap / 2)   # shot cut sits in the middle of the silence
        lines = []
        for li, text in enumerate(shot.get("lines", [])):
            if li:
                t += c.pauses["line"]
            lstart, ss = t, []
            for k, sen in enumerate(split_sentences(text)):
                if k:
                    t += c.pauses["sentence"]
                s = by_key[(shot["id"], li, k)]
                f = c.clips / s["file"]
                a0, b0 = 0, 0  # breath groups: trim offset of the raw clip
                if silent or not f.exists():
                    if not silent:
                        sys.exit(f"missing clip for: {s['text']}  (run: voice, or use --silent for a preview)")
                    x = np.zeros(int(len(s["text"]) / cps * SR), dtype=np.float32)
                else:
                    raw = decode(f); a0, b0 = trim_ab(raw)
                    x = raw[a0:b0]
                for a, b in censor_spans(c, x, s, silent):   # censored word: voice muted there, `mix` plays the beep
                    fd = min(int(0.008 * SR), (b - a) // 2)
                    if fd: x[a - fd:a] *= np.linspace(1, 0, fd) if a >= fd else 1; x[b:b + fd] *= np.linspace(0, 1, len(x[b:b + fd]))
                    x[a:b] = 0
                    beeps.append([round(t + a / SR, 3), round((b - a) / SR, 3)])
                sen = s["text"]
                ent_t = {"text": sen, "start": round(t, 3), "dur": round(len(x) / SR, 3)}
                ps = sent_parts(c, s, t, len(x) / SR, (a0 / SR) if (not silent and f.exists()) else 0.0)
                if ps: ent_t["parts"] = ps
                ss.append(ent_t)
                chunks.append((t, x)); t += len(x) / SR
            lines.append({"text": text.replace(BREAK_MARK, ""), "start": round(lstart, 3), "dur": round(t - lstart, 3), "sents": ss})
        if not shot.get("lines") and shot.get("dur"):   # shot không lời (vd. mở đầu dồn cảnh): giữ đúng `dur` giây im lặng (2026-10-11, kênh mẫu)
            t += float(shot["dur"])
        shots.append({"id": shot["id"], "start": round(s0, 3), "lines": lines,
                      **({"chapter": shot["chapter"]} if shot.get("chapter") else {}),
                      **({"ad_break": True} if shot.get("ad_break") else {})})
    total = t + max(TAIL, float(c.ep["shots"][-1].get("hold", 0)) if c.ep["shots"] else TAIL)   # last shot's hold = end tail (2026-10-07, japan-animal)
    for i, s in enumerate(shots):
        s["dur"] = round((shots[i + 1]["start"] if i + 1 < len(shots) else total) - s["start"], 3)
    mix = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for st, x in chunks:
        i = int(st * SR); mix[i: i + len(x)] += x
    peak = float(np.max(np.abs(mix))) or 1.0
    sf.write(c.build / "narration.wav", (mix / peak * 0.89)[: int(total * SR)], SR)
    soften_narration(c)   # voice.yaml `soften:` = ffmpeg filter chain that tames harsh TTS (2026-10-20, kênh mẫu)
    W, H = c.fmt["size"]
    json.dump({"W": W, "H": H, "total": round(total, 3), "silent": silent, "shots": shots, **({"beeps": beeps} if beeps else {})},
              open(c.build / "timeline.json", "w"), ensure_ascii=False, indent=1)
    print(f"audio: {total:.1f}s{' (silent estimate)' if silent else ''}")
    write_youtube(c)
    cmd_subs(c)



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
                best = (sc, a + "\n" + b)
    return best[1] if best else text


def _chunks(text, width=42):
    """split a sentence into pieces that fit 2 lines: prefer , ; : — breaks, then word breaks"""
    if len(text) <= 2 * width:
        return [text]
    parts = [p.strip() for p in re.split(r"(?<=[,;:—–])\s+", text) if p.strip()]
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
                if se.get("parts"):   # breath group: cues already timed (patches/apply_ja_breath.py)
                    for p in se["parts"]:
                        cues.append([p["start"], p["start"] + p["dur"], p["text"]])
                    continue
                pieces = _chunks(se["text"])
                tot = sum(len(p) for p in pieces) or 1; t = se["start"]
                for p in pieces:
                    d = se["dur"] * len(p) / tot
                    cues.append([t, t + d, _wrap2(p)]); t += d
    for i, cu in enumerate(cues):   # hold each cue a little into the pause, never past the next one; min 0.8 s on screen
        nxt = cues[i + 1][0] if i + 1 < len(cues) else tl["total"]
        cu[1] = min(max(cu[1] + 0.25, cu[0] + 0.8), nxt - 0.02) if nxt - 0.02 > cu[0] else cu[1]
    srt = "".join(f"{i + 1}\n{_ts(a)} --> {_ts(b)}\n{txt}\n\n" for i, (a, b, txt) in enumerate(cues))
    eid = c.ep.get("id", c.ep_dir.name)
    p1 = c.build / f"{eid}.{lang}.srt"; p1.write_text(srt, encoding="utf-8")
    p2 = c.renders / f"{eid}_{c.fmt['id']}.{lang}.srt"; p2.write_text(srt, encoding="utf-8")
    print(f"subs: {len(cues)} cues -> {p2}")

# ---------------------------------------------------------------- music + sfx (after audio; no frame re-render needed)
def _t_of(ref, tl):
    """'s05_shed' -> start of that shot; 's06_nail#2' -> start of its 2nd sentence; 'p3@chưa có vợ' -> when that word is spoken;
    '+1.5'/'-0.3' shifts; 12.3 -> seconds; 'end' -> total."""
    if isinstance(ref, (int, float)):
        return float(ref)
    if ref in (None, "end"):
        return tl["total"]
    if "@" in str(ref):
        sid, w = str(ref).split("@", 1)
        sh = {s["id"]: s for s in tl["shots"]}.get(sid.strip())
        t = M.word_time(sh, w.strip()) if sh else None
        if t is None:
            sys.exit(f"music/sfx: '{ref}' — shot or word not found")
        return t
    m = re.match(r"^([\w-]+?)(?:#(\d+))?(?:([+-][\d.]+))?$", str(ref).strip())
    shots = {s["id"]: s for s in tl["shots"]}
    if not m or m.group(1) not in shots:
        sys.exit(f"music/sfx: unknown time reference '{ref}' (use a shot id, 'shot#2' for its 2nd sentence, 'shot+1.5', seconds or 'end')")
    sh = shots[m.group(1)]; t = sh["start"]
    if m.group(2):
        sents = [x for l in sh["lines"] for x in l["sents"]]
        k = int(m.group(2))
        if not 1 <= k <= len(sents):
            sys.exit(f"music/sfx: '{ref}' — shot has {len(sents)} sentences")
        t = sents[k - 1]["start"]
    return t + float(m.group(3) or 0)


def _load_stereo(path):
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def _rms_db(x):
    import numpy as np
    return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)


def cmd_mix(c: Ctx):
    """narration.wav + episode.yaml `music:` cues + `sfx:` hits -> build/mix.wav (stereo).
    Track files live in <channel>/music/ ; a cue names a `file`, or a `mood` resolved through <channel>/music/library.yaml."""
    import numpy as np, soundfile as sf
    tl = json.load(open(c.build / "timeline.json"))
    voice, _ = sf.read(c.build / "narration.wav", dtype="float32")
    n = len(voice)
    lib_p = M.media_dir(c, "music") / "library.yaml"
    if not lib_p.exists(): lib_p = c.ch_dir / "music" / "library.yaml"
    lib = load_yaml(lib_p) if lib_p.exists() else {}
    mcfg, cues = M.music_plan(c, lib)   # episode `music:` (cues or shorthand) or the blueprint default
    # voice activity -> gain curve: music sits `gain_db` under the voice while it speaks, lifts `gap_lift_db` in pauses
    win = int(0.02 * SR); nf = n // win
    env = np.sqrt(np.mean(voice[: nf * win].reshape(nf, win) ** 2, axis=1) + 1e-12)
    active = env > max(env.max() * 10 ** (-38 / 20), 1e-4)
    k = int(0.25 / 0.02)
    act = np.convolve(active.astype(float), np.ones(2 * k + 1), "same") > 0
    gap_min = int(float(mcfg.get("gap_min_s", 0.8)) / 0.02)
    lift = np.zeros(nf); i = 0
    while i < nf:
        if not act[i]:
            j = i
            while j < nf and not act[j]: j += 1
            if j - i >= gap_min: lift[i:j] = 1
            i = j
        else: i += 1
    a = np.exp(-1 / (0.35 / 0.02)); sm = np.zeros(nf); v = 0.0
    for i in range(nf): v = a * v + (1 - a) * lift[i]; sm[i] = v
    lift_curve = np.repeat(sm, win)[:n]; lift_curve = np.pad(lift_curve, (0, n - len(lift_curve)), "edge")
    voice_db = _rms_db(voice[: nf * win][np.repeat(active, win)]) if active.any() else -20.0
    base_db = float(mcfg.get("gain_db", -5)); lift_db = float(mcfg.get("gap_lift_db", 3))   # threads channel: blueprint music.gain_db
    gain_curve = 10 ** ((lift_db * lift_curve) / 20)
    music = np.zeros((n, 2), dtype=np.float32); report = []
    for ci, cue in enumerate(cues):
        t0 = _t_of(cue.get("from"), tl)
        nxt = cues[ci + 1].get("from") if ci + 1 < len(cues) else "end"
        t1 = _t_of(cue.get("to", nxt), tl)
        fp = cue.get("path")
        if not fp:
            report.append(f"  {t0:6.1f}-{t1:6.1f}  {cue.get('mood', ''):<20} {cue.get('note') or 'im lặng'}")
            continue
        f = fp.name
        tr = _load_stereo(fp)[int(float(cue.get("offset", 0)) * SR):]
        L = int((t1 - t0) * SR)
        if len(tr) < L:   # loop with a 1 s crossfade
            xf = SR; out = tr.copy()
            while len(out) < L:
                ramp = np.linspace(0, 1, xf, dtype=np.float32)[:, None]
                out = np.concatenate([out[:-xf], out[-xf:] * (1 - ramp) + tr[:xf] * ramp, tr[xf:]])
            tr = out
        seg = tr[:L].copy()
        lvl = _rms_db(seg) if len(seg) else -60
        g = 10 ** ((voice_db + base_db + float(cue.get("gain_db", 0)) - lvl) / 20)
        fi, fo = int(float(cue.get("fade_in", 0.6)) * SR), int(float(cue.get("fade_out", 0.8)) * SR)
        env_c = np.ones(L, dtype=np.float32)
        fi, fo = min(fi, L), min(fo, L)
        if fi: env_c[:fi] *= np.linspace(0, 1, fi)
        if fo: env_c[L - fo:] *= np.linspace(1, 0, fo)
        i0 = int(t0 * SR); i1 = min(n, i0 + L)
        music[i0:i1] += seg[: i1 - i0] * (g * env_c[: i1 - i0])[:, None]
        report.append(f"  {t0:6.1f}-{t1:6.1f}  {cue.get('mood', ''):<20} {f}")
    music *= gain_curve[:, None]
    sfx = np.zeros((n, 2), dtype=np.float32)
    for h in M.sfx_hits(c, tl, _t_of):   # episode sfx + shot sfx (at a word) + auto sfx on card change + meme sfx / meme clip audio
        t, fp, gdb, label, kind = h[:5]
        if not fp:
            report.append(f"  sfx {t:6.1f}  THIẾU FILE {label} -> bỏ qua"); continue
        x = M.trim_stereo(_load_stereo(fp))
        if kind == "intro" and not h[5].get("full"):   # long tail under the voice: fade it out once the voice starts
            a0, fl = int(h[5]["fade_at"] * SR), max(1, int(h[5]["fade"] * SR))
            if a0 < len(x):
                x = x[: a0 + fl].copy(); k = min(fl, len(x) - a0)
                x[a0:a0 + k] *= np.linspace(1, 0, k, dtype=np.float32)[:, None]
        if kind == "sfx" and len(h) > 5 and h[5]:   # `until` / `dur`: cut the sound and fade it out
            L = max(1, int(h[5]["len"] * SR)); fl = min(L, max(1, int(h[5]["fade"] * SR)))
            if len(x) < L: x = np.concatenate([x] * (L // max(1, len(x)) + 1))
            x = x[:L].copy(); x[-fl:] *= np.linspace(1, 0, fl, dtype=np.float32)[:, None]
        if kind == "meme-audio":
            x = x[: int(h[5] * SR)]
            fo = min(len(x), int(0.15 * SR))
            if fo: x[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
        if not len(x): continue
        i0 = max(0, int(t * SR)); i1 = min(n, i0 + len(x))
        g = 10 ** ((voice_db + gdb - M.active_rms_db(x)) / 20)
        sfx[i0:i1] += x[: i1 - i0] * g
        report.append(f"  sfx {t:6.1f}  {fp.name}" + {"meme-audio": " (âm thanh meme)", "intro": " (sound mở đầu)"}.get(kind, ""))
    if tl.get("beeps"):   # censored words: beep sound (blueprint/episode `censor: {sfx, gain_db}`), cut/looped to each gap
        cz = c.ep.get("censor") or c.blueprint.get("censor") or {}
        bp = M.find(c, "sfx", cz.get("sfx")) if cz.get("sfx") else None
        if bp: bx = M.trim_stereo(_load_stereo(bp))
        else:
            tt = np.arange(int(0.5 * SR)) / SR; bx = np.repeat((0.5 * np.sin(2 * np.pi * 1000 * tt)).astype(np.float32)[:, None], 2, axis=1)
        g = 10 ** ((voice_db + float(cz.get("gain_db", -6)) - M.active_rms_db(bx)) / 20)
        for st, du in tl["beeps"]:
            L = int(du * SR); x = np.concatenate([bx] * (L // len(bx) + 1))[:L].copy()
            f = min(int(0.006 * SR), L // 2)
            if f: x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]
            i0 = int(st * SR); i1 = min(n, i0 + L); sfx[i0:i1] += x[: i1 - i0] * g
        report.append(f"  bíp × {len(tl['beeps'])}  ({bp.name if bp else 'tiếng bíp tự tạo 1 kHz'})")
    mix = voice[:, None] + music + sfx
    peak = float(np.max(np.abs(mix))) or 1.0
    if peak > 0.97: mix *= 0.97 / peak
    sf.write(c.build / "mix.wav", mix, SR)
    print(f"mix: voice {voice_db:.1f} dB, music {base_db:+.0f} dB under voice (+{lift_db:.0f} dB in pauses) -> {c.build / 'mix.wav'}")
    print("\n".join(report) if report else "  (no music cues)")


def cmd_remux(c: Ctx):
    """Swap the audio of the finished mp4 for build/mix.wav (video stream copied, no re-render)."""
    name = f"{c.ep.get('id', c.ep_dir.name)}_{c.fmt['id']}.mp4"
    out = c.renders / name; mix = c.build / "mix.wav"
    if not out.exists() or not mix.exists():
        sys.exit("remux: needs the rendered mp4 and build/mix.wav (run: mix)")
    tmp = out.with_suffix(".remux.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out), "-i", str(mix), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(tmp)], check=True)
    os.replace(tmp, out)
    print(f"remux: {out}")


# ---------------------------------------------------------------- chapters + mid-roll (YouTube long formats)
def mmss(x):
    x = int(round(x)); h, m, s = x // 3600, x % 3600 // 60, x % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def chapters_of(c, tl):
    """[(start_s, title)] — first chapter always starts at 0:00 (YouTube rule)."""
    out = [(0.0 if i == 0 else s["start"], s["chapter"]) for i, s in enumerate(tl["shots"]) if s.get("chapter")]
    needs_intro = (out and out[0][0] > 0) or (not out and (c.fmt.get("chapters") or {}).get("required"))
    if needs_intro:
        out.insert(0, (0.0, (c.fmt.get("chapters") or {}).get("first_title", "Intro")))
    return out


def ad_breaks_of(c, tl):
    """Greedy pick of mid-roll positions at chapter starts (middle of the chapter pause) / shots marked ad_break."""
    m = c.fmt.get("monetization") or {}
    ab = m.get("ad_breaks") or {}
    if not m or tl["total"] < m.get("midroll_min_s", 480):
        return []
    cand = [s["start"] for i, s in enumerate(tl["shots"]) if i and (s.get("chapter") or s.get("ad_break"))]
    out, last = [], 0.0
    for x in cand:
        if x < ab.get("first_after_s", 90) or x > tl["total"] - ab.get("last_before_end_s", 45):
            continue
        if x - last >= ab.get("min_gap_s", 150):
            out.append(x); last = x
    return out


def write_youtube(c):
    tl_path = c.build / "timeline.json"
    if not tl_path.exists():
        return
    tl = json.load(open(tl_path))
    chs = chapters_of(c, tl)
    if not chs and not c.fmt.get("monetization"):
        return
    m = c.fmt.get("monetization") or {}
    rep = [f"# YouTube — {c.ep.get('id', c.ep_dir.name)}", "",
           f"Độ dài: {mmss(tl['total'])}" + (" (ước tính, chưa có giọng)" if tl.get("silent") else ""), ""]
    if chs:
        rep += ["## Chương (dán vào mô tả video)", "", "```"] + [f"{mmss(t)} {title}" for t, title in chs] + ["```", ""]
    if m:
        brk = ad_breaks_of(c, tl)
        rep += ["## Gợi ý vị trí quảng cáo giữa video (YouTube Studio → Kiếm tiền → Điểm chèn quảng cáo)", ""]
        if tl["total"] < m.get("midroll_min_s", 480):
            rep += [f"- Video ngắn hơn {mmss(m.get('midroll_min_s', 480))} → YouTube không cho chèn mid-roll."]
        elif not brk:
            rep += ["- Không có điểm phù hợp — thêm `chapter:` hoặc `ad_break: true` vào shot."]
        else:
            rep += [f"- {mmss(x)}  (khoảng lặng đầu chương)" for x in brk]
            rep += ["", "Đặt đúng các mốc này (đang có khoảng lặng) thay vì để YouTube tự chọn giữa câu."]
    (c.build / "youtube.md").write_text("\n".join(rep) + "\n", encoding="utf-8")
    print(f"youtube: {len(chs)} chapters" + (f", {len(ad_breaks_of(c, tl))} mid-roll slots" if m else "") + f" -> {c.build / 'youtube.md'}")


# ---------------------------------------------------------------- QA
def cmd_qa(c: Ctx):
    errs, warns, oks = [], [], []
    tone = c.blueprint.get("tone", {})
    banned = [w.lower() for w in tone.get("banned_words", [])]
    texts = [("title_box", c.ep.get("title_box", "")), ("hook", c.ep.get("hook", ""))]
    for s in c.ep["shots"]:
        texts += [(f"{s['id']} line", l) for l in s.get("lines", [])]
        texts += [(f"{s['id']} sticker", st.get("text", "")) for st in s.get("stickers", [])]
    hits = [(where, w) for where, txt in texts for w in banned if re.search(r"(?<!\w)" + re.escape(w) + r"(?!\w)", txt.lower())]
    (errs if hits else oks).append(f"banned words: {hits}" if hits else "no banned words")
    # templates exist
    scenes_src = (STUDIO / "templates" / "scenes" / "scenes.js").read_text()
    _pk = STUDIO / "packs" / "style" / c.blueprint.get("style", "doodle-v1") / "pack.yaml"
    if _pk.exists():
        scenes_src = "".join((STUDIO / x).read_text() for x in (load_yaml(_pk).get("scenes") or []))
    if (c.fmt_dir / "layout.js").exists():   # formats can ship their own scene templates (threads-60: threads_card)
        scenes_src += "\n" + (c.fmt_dir / "layout.js").read_text()
    ep_scenes = (c.ep_dir / "scenes.js").read_text() if (c.ep_dir / "scenes.js").exists() else ""
    cat = voice_catalog()
    for nm in list((c.ep.get("cast") or {}).values()) + [s.get("voice") for s in c.ep["shots"] if s.get("voice")] \
            + [v for s in c.ep["shots"] for v in (s.get("line_voices") or []) if v and v not in (c.ep.get("cast") or {})]:
        if nm not in cat and "_" not in str(nm) and not str(nm).startswith(("voicevox:", "aivis:")):   # local TTS engines carry their own style ids
            errs.append(f"voice '{nm}' is not in studio-template/voices/*.yaml (and does not look like a VBee code)")
    for s in c.ep["shots"]:
        tpl = s.get("template")
        if tpl == "custom":
            fn = (s.get("params") or {}).get("fn")
            if not fn or f"{fn}(" not in ep_scenes:
                errs.append(f"{s['id']}: custom fn '{fn}' not found in episode scenes.js")
        elif not re.search(r"\n  " + re.escape(str(tpl)) + r"\(t, ctx, p\)", scenes_src):
            errs.append(f"{s['id']}: unknown template '{tpl}'")
    # anchors: every `at` word must be spoken in that shot
    def ats(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "at" or k == "react_at":
                    yield v
                else:
                    yield from ats(v)
        elif isinstance(o, list):
            for v in o:
                yield from ats(v)
    bad = []
    for s in c.ep["shots"]:
        spoken = " ".join(s.get("lines", [])).lower()
        for a in ats({"p": s.get("params", {}), "st": s.get("stickers", []), "m": s.get("memes", []), "sx": s.get("sfx", [])}):
            if isinstance(a, str) and a.lower() not in spoken:
                bad.append(f"{s['id']}: '{a}'")
            if isinstance(a, dict) and a.get("word") and a["word"].lower() not in spoken:
                bad.append(f"{s['id']}: '{a['word']}'")
    (errs if bad else oks).append(f"anchor words not in the narration: {bad}" if bad else "all anchors found in the narration")
    me, mwarn, mok = M.qa_media(c); errs += me; warns += mwarn; oks += mok
    # stickers
    mw = (c.fmt.get("layout", {}).get("sticker") or {}).get("max_words", 6)
    long_st = [st["text"] for s in c.ep["shots"] for st in s.get("stickers", []) if len(st["text"].split()) > mw]
    (warns if long_st else oks).append(f"stickers over {mw} words: {long_st}" if long_st else f"stickers ≤ {mw} words")
    # facts: claims referenced must exist and have a source; numbers in lines should be backed by a claim
    facts = {f["id"]: f for f in c.ep.get("facts", [])}
    nosrc = [f["id"] for f in facts.values() if not f.get("source")]
    (errs if nosrc else oks).append(f"facts without source: {nosrc}" if nosrc else f"{len(facts)} facts, all sourced")
    missing = [f"{s['id']}:{cl}" for s in c.ep["shots"] for cl in s.get("claims", []) if cl not in facts]
    if missing: errs.append(f"claims not in facts list: {missing}")
    unbacked = [s["id"] for s in c.ep["shots"] if re.search(r"\d|một phần|phần trăm|lần", " ".join(s.get("lines", []))) and not s.get("claims")]
    (warns if unbacked else oks).append(f"shots with numbers but no claims: {unbacked}" if unbacked else "every number-bearing shot cites a claim")
    # length
    tl_path = c.build / "timeline.json"
    if tl_path.exists():
        tl = json.load(open(tl_path)); lo, hi = c.fmt.get("duration_s", [0, 1e9])
        msg = f"duration {tl['total']:.1f}s vs format {lo}-{hi}s" + (" (silent estimate)" if tl.get("silent") else "")
        if c.fmt.get("duration_hard", True) is False:      # format says the range is only a reference (e.g. short-60)
            oks.append(msg + " — chỉ tham khảo, ý đủ + không gấp là được")
        else:
            (oks if lo <= tl["total"] <= hi else warns).append(msg)
        mx = c.fmt.get("max_shot_s", 14)
        long_shots = [f"{s['id']} {s['dur']:.1f}s" for s in tl["shots"] if s["dur"] > mx]
        if long_shots: warns.append(f"shots longer than {mx}s (split them): {long_shots}")
        mon = c.fmt.get("monetization") or {}
        if mon:
            need = mon.get("midroll_min_s", 480)
            if tl["total"] < need:
                errs.append(f"{mmss(tl['total'])} < {mmss(need)}: YouTube will not allow mid-roll ads — add a real chapter, don't pad")
            else:
                oks.append(f"≥ {mmss(need)}: mid-roll eligible, {len(ad_breaks_of(c, tl))} suggested slots (build/youtube.md)")
        chc = c.fmt.get("chapters") or {}
        if chc.get("required"):
            chs = chapters_of(c, tl)
            ends = [x[0] for x in chs[1:]] + [tl["total"]]
            short = [f"{title} {e - st:.0f}s" for (st, title), e in zip(chs, ends) if e - st < chc.get("min_len_s", 10)]
            if len(chs) < chc.get("min_count", 3): errs.append(f"{len(chs)} chapters, need ≥ {chc.get('min_count', 3)} (add `chapter:` to shots)")
            elif short: errs.append(f"chapters shorter than {chc.get('min_len_s', 10)}s: {short}")
            else: oks.append(f"{len(chs)} chapters, all ≥ {chc.get('min_len_s', 10)}s")
        write_youtube(c)
    else:
        warns.append("no timeline yet (run audio)")
    # title box
    tb = c.ep.get("title_box", "")
    if c.fmt.get("layout", {}).get("title_box") and not tb: errs.append("format needs title_box")
    if tb and max(len(x) for x in tb.split("\n")) > 24: warns.append("title_box line longer than 24 chars")
    if (str(c.ep.get("status", "")).split() or [""])[0] in ("rendered", "approved", "posted") and not (c.ep.get("post") or {}).get("caption"):
        warns.append("no post.caption yet — write it, then run `post` (caption + hashtags + Nguồn comment)")
    rep = ["# QA — " + c.ep.get("id", c.ep_dir.name), ""] + [f"- ❌ {e}" for e in errs] + [f"- ⚠️ {w}" for w in warns] + [f"- ✅ {o}" for o in oks]
    (c.build / "qa.md").write_text("\n".join(rep) + "\n", encoding="utf-8")
    print("\n".join(rep[2:]))
    return len(errs) == 0


# ---------------------------------------------------------------- post (caption + hashtags + sources comment)
SOURCE_NAMES = {  # domain -> name shown in the "Nguồn:" comment; a channel can add/override in blueprint publishing.source_names
    "smithsonianmag.com": "Smithsonian Magazine", "scientificamerican.com": "Scientific American", "livescience.com": "Live Science",
    "sciencedaily.com": "ScienceDaily", "nhm.ac.uk": "Natural History Museum (London)", "wikipedia.org": "Wikipedia",
    "mongabay.com": "Mongabay", "elasmo-research.org": "ReefQuest Centre for Shark Research", "nationalgeographic.com": "National Geographic",
    "bbc.com": "BBC", "bbc.co.uk": "BBC", "nature.com": "Nature", "science.org": "Science", "noaa.gov": "NOAA", "nps.gov": "US National Park Service",
    "britannica.com": "Britannica", "newscientist.com": "New Scientist", "theguardian.com": "The Guardian", "nytimes.com": "The New York Times",
    "cnn.com": "CNN", "popsci.com": "Popular Science", "phys.org": "Phys.org", "sciencedirect.com": "ScienceDirect", "ncbi.nlm.nih.gov": "PubMed (NIH)",
}


def source_name(url, extra):
    m = re.match(r"\s*https?://([^/\s]+)", url)
    if not m:
        return url.strip()                      # already a name (e.g. a book)
    host = m.group(1).lower()
    if host.startswith("www."): host = host[4:]
    names = dict(SOURCE_NAMES); names.update(extra or {})
    for dom, name in sorted(names.items(), key=lambda kv: -len(kv[0])):
        if host == dom or host.endswith("." + dom):
            return name
    return host


def post_sources(c: Ctx):
    """names (and urls) of the sources behind the facts this episode actually cites, in order of first use"""
    pub = c.blueprint.get("publishing", {}) or {}
    facts = {f["id"]: f for f in c.ep.get("facts", [])}
    used = [cl for s in c.ep["shots"] for cl in s.get("claims", [])] or list(facts)
    names, urls = [], []
    for cl in dict.fromkeys(used):
        for u in re.split(r"\s*;\s*", str((facts.get(cl) or {}).get("source", ""))):
            if not u: continue
            n = source_name(u, pub.get("source_names"))
            if u not in urls: urls.append(u)
            if n not in names: names.append(n)
    return names, urls


def cmd_post(c: Ctx):
    pub = c.blueprint.get("publishing", {}) or {}
    post = c.ep.get("post") or {}
    if pub.get("platform") == "youtube":
        return cmd_post_youtube(c, pub, post)
    cap = (post.get("caption") or "").strip()
    if not cap:
        sys.exit("post: write `post.caption` (+ optional `post.hashtags`) in episode.yaml first — rule: blueprint publishing.caption")
    tags = []
    for h in list(pub.get("hashtags", [])) + list(post.get("hashtags", [])):
        h = "#" + str(h).lstrip("#").replace(" ", "")
        if h.lower() not in [x.lower() for x in tags]: tags.append(h)
    mx = pub.get("max_hashtags", 5)
    warn = []
    if len(tags) > mx: warn.append(f"{len(tags)} hashtags > {mx}: kept the first {mx}"); tags = tags[:mx]
    banned = [w for w in (c.blueprint.get("tone", {}) or {}).get("banned_words", []) if re.search(r"(?<!\w)" + re.escape(w.lower()) + r"(?!\w)", cap.lower())]
    if banned: warn.append(f"banned words in caption: {banned}")
    cm = pub.get("caption_max", 300)
    if len(cap) > cm: warn.append(f"caption {len(cap)} chars > {cm}")
    mode = (getattr(c, "post_mode", None) or post.get("comment_mode") or pub.get("comment_mode") or "nguon").lower()
    names, urls = post_sources(c)
    extra = pub.get("source_names")
    if mode == "none":   # caption only, no pinned comment
        comment = ""
    elif mode == "fact":
        bf = post.get("bonus_fact") or {}
        facts = {f["id"]: f for f in c.ep.get("facts", [])}
        f = facts.get(bf.get("fact", ""))
        if not bf.get("text") or not f or not f.get("source"):
            sys.exit("post --mode fact: need post.bonus_fact: {text: '…', fact: <id in facts with a source>} in episode.yaml")
        src = [source_name(u, extra) for u in re.split(r"\s*;\s*", f["source"]) if u]
        comment = pub.get("fact_prefix", "🧠 Fact thêm: ") + bf["text"].strip() + "\n(Nguồn: " + ", ".join(dict.fromkeys(src)) + ")"
    else:
        lines = []
        for u in urls:
            n = source_name(u, extra)
            lines.append(f"- {n}: {u}" if u.startswith("http") else f"- {u}")
        comment = (pub.get("source_comment", {}) or {}).get("prefix", "Nguồn: ").rstrip() + "\n" + "\n".join(lines)
    link = getattr(c, "post_link", None) or post.get("support_link")
    if link and mode != "none":
        comment += "\n\n" + pub.get("support_line", "Thấy hay thì ủng hộ kênh bằng cách bấm vào link này nha 👉 {link}").replace("{link}", link)
    out = c.ep_dir / "post.md"
    posted = ""
    if out.exists():
        m = re.search(r"\n## Đã đăng\n.*", out.read_text(encoding="utf-8"), re.S)
        posted = m.group(0).strip("\n") if m else ""
    md = [f"# Post — {c.ep.get('id', c.ep_dir.name)}", "",
          "## Caption (dán nguyên khối)", "", "```", cap, "", " ".join(tags), "```", "",
          *(["## Comment đầu tiên ngay sau khi đăng (FB Reels không ghim được; TikTok thì ghim)", "", "```", comment, "```", ""] if mode != "none" else [])]
    if post.get("cover_s") is not None: md += [f"Ảnh bìa: khung ở giây {post['cover_s']}", ""]
    md += [posted or "## Đã đăng\n\n| nền tảng | ngày | link |\n|---|---|---|"]
    out.write_text("\n".join(md) + "\n", encoding="utf-8")
    for w in warn: print("post: ⚠️ " + w)
    print(f"post: mode={mode}, {len(tags)} hashtags, {len(names)} sources{', support link' if link else ''} -> {out}")


def cmd_post_youtube(c: Ctx, pub, post):
    """post.md for a YouTube long video: title, description (hook + chapters + sources + hashtags), tags, pinned comment."""
    title = (post.get("title") or "").strip()
    desc = (post.get("description") or post.get("caption") or "").strip()
    if not title or not desc:
        sys.exit("post: write `post.title` and `post.description` in episode.yaml first — rules: blueprint publishing.title / description")
    warn = []
    if len(title) > pub.get("title_max", 70):
        warn.append(f"title {len(title)} chars > {pub.get('title_max', 70)} (cut off in search)")
    banned = [w for w in (c.blueprint.get("tone", {}) or {}).get("banned_words", []) if re.search(r"(?<!\w)" + re.escape(w.lower()) + r"(?!\w)", (title + " " + desc).lower())]
    if banned:
        warn.append(f"banned words in title/description: {banned}")
    tags = []
    for h in list(pub.get("hashtags", [])) + list(post.get("hashtags", [])):
        h = "#" + str(h).lstrip("#").replace(" ", "")
        if h.lower() not in [x.lower() for x in tags]:
            tags.append(h)
    tags = tags[: pub.get("max_hashtags", 3)]
    chs = []
    tl_path = c.build / "timeline.json"
    if tl_path.exists():
        tl = json.load(open(tl_path))
        if tl.get("silent"):
            warn.append("timeline is a silent estimate — re-run audio with the real voice before posting (chapter times will move)")
        chs = [f"{mmss(t)} {name}" for t, name in chapters_of(c, tl)]
    names, urls = post_sources(c)
    extra = pub.get("source_names")
    src_lines = [f"- {source_name(u, extra)}: {u}" if u.startswith("http") else f"- {u}" for u in urls]
    body = [desc, ""]
    if chs:
        body += [pub.get("chapters_label", "Chapters:")] + chs + [""]
    if src_lines:
        body += [pub.get("sources_label", "Sources:")] + src_lines + [""]
    if pub.get("description_footer"):
        body += [pub["description_footer"].strip(), ""]
    body += [" ".join(tags)]
    mode = (getattr(c, "post_mode", None) or post.get("comment_mode") or pub.get("comment_mode") or "fact").lower()
    if mode == "fact" and post.get("bonus_fact"):
        bf = post["bonus_fact"]
        facts = {f["id"]: f for f in c.ep.get("facts", [])}
        f = facts.get(bf.get("fact", ""))
        if not bf.get("text") or not f or not f.get("source"):
            sys.exit("post --mode fact: need post.bonus_fact: {text: '…', fact: <id in facts with a source>} in episode.yaml")
        src = [source_name(u, extra) for u in re.split(r"\s*;\s*", f["source"]) if u]
        comment = pub.get("fact_prefix", "Bonus fact: ") + bf["text"].strip() + "\n(Source: " + ", ".join(dict.fromkeys(src)) + ")"
    else:
        comment = (post.get("pinned_comment") or pub.get("pinned_comment") or "").strip() or ((pub.get("source_comment", {}) or {}).get("prefix", "Sources:").rstrip() + "\n" + "\n".join(src_lines))
    ytags = list(dict.fromkeys(list(pub.get("tags", [])) + list(post.get("tags", []))))
    out = c.ep_dir / "post.md"
    posted = ""
    if out.exists():
        m = re.search(r"\n## Đã đăng\n.*", out.read_text(encoding="utf-8"), re.S)
        posted = m.group(0).strip("\n") if m else ""
    md = [f"# Post (YouTube) — {c.ep.get('id', c.ep_dir.name)}", "",
          "## Title", "", "```", title, "```", "",
          "## Description (dán nguyên khối)", "", "```"] + body + ["```", "",
          "## Tags (YouTube Studio → Tags)", "", "```", ", ".join(ytags), "```", "",
          "## Pinned comment", "", "```", comment, "```", ""]
    if post.get("thumbnail"):
        md += [f"Thumbnail: {post['thumbnail']}", ""]
    if post.get("cover_s") is not None:
        md += [f"Khung gợi ý cho thumbnail: giây {post['cover_s']}", ""]
    md += ["Mid-roll: xem `build/youtube.md`.", "", posted or "## Đã đăng\n\n| nền tảng | ngày | link |\n|---|---|---|"]
    out.write_text("\n".join(md) + "\n", encoding="utf-8")
    for w in warn:
        print("post: ⚠️ " + w)
    print(f"post (youtube): {len(chs)} chapters, {len(urls)} sources, {len(tags)} hashtags, comment={mode} -> {out}")


# ---------------------------------------------------------------- render
def tag_chapters(shots):
    out, n, title = [], 0, None
    for s in shots:
        if s.get("chapter"):
            n, title = n + 1, s["chapter"]
        out.append({**s, "_chapter": {"n": n, "title": title}} if title else dict(s))
    return out


def render_json(c: Ctx):
    bp = c.blueprint
    style = STUDIO / "packs" / "style" / bp.get("style", "doodle-v1")
    pack = load_yaml(style / "pack.yaml") if (style / "pack.yaml").exists() else None
    font_base = None
    if pack:   # a style pack that declares its own scripts/fonts (flat-v1): doodle assets/scenes are not loaded
        scripts = [STUDIO / x for x in pack.get("scripts", [])]
        for ch in bp.get("characters", []) or []:
            scripts.append(STUDIO / "packs" / "characters" / ch / "character.js")
        scripts += [STUDIO / x for x in pack.get("scenes", [])] + [c.fmt_dir / "layout.js"]
        font_base = (STUDIO / pack["fonts"]).as_uri() + "/" if pack.get("fonts") else None
    else:
        scripts = [style / "core.js", STUDIO / "packs" / "characters" / "stick-figure" / "character.js"]
        narr = bp.get("narrator")
        if narr and narr != "stick-figure":
            scripts.append(STUDIO / "packs" / "characters" / narr / "character.js")
        scripts += [STUDIO / "packs" / "assets" / "animals.js", STUDIO / "packs" / "assets" / "props.js",
                    STUDIO / "templates" / "scenes" / "scenes.js", c.fmt_dir / "layout.js"]
    for extra in bp.get("extra_scripts", []):
        scripts.append((c.ch_dir / extra).resolve())
    if (c.ep_dir / "scenes.js").exists():
        scripts.append(c.ep_dir / "scenes.js")
    tl = json.load(open(c.build / "timeline.json"))
    rj = {"W": tl["W"], "H": tl["H"], "fps": c.fmt.get("fps", 30), "timeline": tl,
          "episode": {"title_box": c.ep.get("title_box"), "hook": c.ep.get("hook", ""), "shots": tag_chapters(c.ep["shots"])},
          "layout": c.fmt["layout"], "font": (style / "PatrickHand-Regular.ttf").as_uri(), "fontBase": font_base,
          "scripts": [str(s) for s in scripts], "colour": c.fmt.get("colour")}
    rj["episode"]["shots"], rj["preload"], _miss = M.resolve_srcs(c, rj["episode"]["shots"])   # pictures inside scenes (src:)
    med, rep = M.render_media(c, tl)   # background clip + memes from the channel's media folders (None = nothing to add)
    if med: rj["media"] = med
    for r in rep: print("  " + r)
    p = c.build / "render.json"
    json.dump(rj, open(p, "w"), ensure_ascii=False)
    return p, tl


def cmd_stills(c: Ctx):
    p, tl = render_json(c)
    ts = []
    for s in tl["shots"]:
        ts += [round(s["start"] + s["dur"] * 0.55, 2), round(s["start"] + s["dur"] * 0.95, 2)]
    out = c.build / "stills"
    if out.exists():
        for f in out.glob("t*.jpg"): f.unlink()
    subprocess.run(["node", str(ENGINE / "render.mjs"), str(p), str(out), "--stills", ",".join(map(str, ts))], check=True)
    from PIL import Image
    files = sorted(out.glob("t*.jpg"))
    ims = [Image.open(f) for f in files]
    W, H = ims[0].size
    tw = 270 if H > W else 480; th = int(tw * H / W)
    cols = min(len(ims), 8 if H > W else 4)
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (tw * cols, th * rows), "white")
    for i, im in enumerate(ims):
        sheet.paste(im.resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
    sheet.save(c.build / "contact.jpg", quality=88)
    print(f"stills: {len(files)} frames -> {c.build / 'contact.jpg'}")


def cmd_render(c: Ctx):
    p, tl = render_json(c)
    name = f"{c.ep.get('id', c.ep_dir.name)}_{c.fmt['id']}.mp4"
    out = c.renders / name
    args = ["node", str(ENGINE / "render.mjs"), str(p), str(out)]
    if not tl.get("silent"):
        if M.has_fx_audio(c): cmd_mix(c)   # music bed / sfx / meme audio: cheap, always rebuilt so it matches the episode
        mix = c.build / "mix.wav"
        use_mix = mix.exists() and mix.stat().st_mtime >= (c.build / "narration.wav").stat().st_mtime
        args += ["--audio", str(mix if use_mix else c.build / "narration.wav")]
    subprocess.run(args, check=True)
    print(f"render: {out}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("episode_dir"); ap.add_argument("command", choices=["plan", "voice", "audio", "subs", "mix", "qa", "stills", "render", "remux", "all", "post"])
    ap.add_argument("--silent", action="store_true", help="audio: estimate timing without voice clips")
    ap.add_argument("--force", action="store_true", help="render even if QA has errors")
    ap.add_argument("--mode", choices=["nguon", "fact", "none"], help="post: pinned comment = sources with links, one extra fun fact, or none (caption only)")
    ap.add_argument("--link", help="post: affiliate / shop link for the 'ủng hộ kênh' line")
    a = ap.parse_args()
    c = Ctx(a.episode_dir)
    c.post_mode, c.post_link = a.mode, a.link
    if a.command == "plan": cmd_plan(c)
    elif a.command == "voice": cmd_voice(c)
    elif a.command == "audio": cmd_audio(c, a.silent)
    elif a.command == "subs": cmd_subs(c)
    elif a.command == "qa": sys.exit(0 if cmd_qa(c) else 1)
    elif a.command == "stills": cmd_stills(c)
    elif a.command == "mix": cmd_mix(c)
    elif a.command == "render": cmd_render(c)
    elif a.command == "remux": cmd_remux(c)
    elif a.command == "post": cmd_post(c)
    elif a.command == "all":
        cmd_plan(c); cmd_voice(c); cmd_audio(c)
        if M.has_fx_audio(c): cmd_mix(c)
        if not cmd_qa(c) and not a.force:
            sys.exit("QA failed — fix the episode or pass --force")
        cmd_render(c)


if __name__ == "__main__":
    main()

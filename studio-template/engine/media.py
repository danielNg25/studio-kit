"""Channel media (music beds, sound effects, memes, background clips) for build.py.

Where the files live — blueprint `media:` (paths relative to the channel folder):
    media: {music: assets/music, sfx: assets/sfx, memes: assets/memes, backgrounds: assets/backgrounds}
  default (older channels): music -> music/, sfx -> music/ (so `sfx/whoosh.wav` keeps working), memes -> memes/, backgrounds -> backgrounds/

Files are named for what they are (`meo-ngac-nhien.png`, `whoosh-nhanh.mp3`); episode.yaml refers to them by name:
  exact file name  >  same name without extension  >  name starts with it  >  name contains it  (case-insensitive, accents ignored).
  Several matches (`whoosh` -> whoosh-01, whoosh-02) -> one is picked per episode/use, so videos don't all sound the same.

Episode keys (all optional; a blueprint key of the same name is the channel default):
  music:      {file | mood, gain_db, gap_lift_db, offset} · or {cues: [...]} (see build.py mix) · or `false` = no music
              blueprint `music: {pick: any}` = one track from the music folder per episode (rotates)
  sfx:        [{file, at: "shot", "shot#2", "shot@word", "shot+1.5", seconds, gain_db}]          (episode level)
  shot sfx:   shots[].sfx: [{file, at: "word in this shot" | seconds from shot start, gain_db, until: "word" | dur: s (cut + fade_out)}]
  auto_sfx:   {shot_change: whoosh, gain_db: -10, first: false}                                 (blueprint or episode)
  shot memes: shots[].memes: [{file, at: "word", dur: 1.6, pos: auto|top|bottom|center|tl|tr|bl|br, size: 460,
                               sfx: pop, sound: true (video memes: keep the clip's own audio), anim: pop|slide|shake}]
  background: {file | pick: any, dim: 0.15, blur: 0, speed: 1.0, start: 0}  · `false` = the format's drawn background
  intro_sfx:  sound as the first card appears; the voice waits for it (lead ≤ max_lead s), its long tail fades out
              blueprint {pick: any, gain_db: -2, max_lead: 1.2, skip_kinds: [tam-su]} · episode: a name, `false`, or the same dict
              episode `kind:` (e.g. tam-su) in skip_kinds -> no intro sound
"""
import hashlib, json, re, shutil, subprocess, unicodedata
from pathlib import Path

KINDS = {
    "music": {"default": "music", "ext": {".mp3", ".m4a", ".wav", ".aac", ".ogg", ".flac"}},
    "sfx": {"default": "music", "ext": {".mp3", ".m4a", ".wav", ".aac", ".ogg", ".flac"}},
    "memes": {"default": "memes", "ext": {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm", ".m4v"}},
    "backgrounds": {"default": "backgrounds", "ext": {".mp4", ".mov", ".webm", ".m4v", ".png", ".jpg", ".jpeg", ".webp"}},
}
VIDEO_EXT = {".mp4", ".mov", ".webm", ".m4v", ".gif"}


def _fold(s):
    s = unicodedata.normalize("NFD", str(s).lower()).replace("đ", "d")
    return "".join(ch for ch in s if unicodedata.category(ch) != "Mn")


def media_dir(c, kind):
    m = c.blueprint.get("media") or {}
    return (c.ch_dir / (m.get(kind) or KINDS[kind]["default"])).resolve()


def list_media(c, kind):
    d = media_dir(c, kind)
    if not d.exists():
        return []
    return sorted(p for p in d.rglob("*") if p.is_file() and p.suffix.lower() in KINDS[kind]["ext"] and not p.name.startswith("."))


_LIBS = {}


def library(c, kind):
    """<media dir>/library.yaml: {file name: {nghia, dung, tranh, intro, gain_db, …}} — what each file means and when to use it"""
    d = media_dir(c, kind)
    if d not in _LIBS:
        p = d / "library.yaml"
        try:
            import yaml
            _LIBS[d] = (yaml.safe_load(open(p, encoding="utf-8")) or {}) if p.exists() else {}
        except Exception:
            _LIBS[d] = {}
    return _LIBS[d]


def lib_entry(c, kind, path):
    e = library(c, kind).get(path.name) if path else None
    return e if isinstance(e, dict) else {}


def lib_gain(c, kind, path, default):
    """explicit gain in the episode wins; else the library's gain_db for that file; else the default"""
    g = lib_entry(c, kind, path).get("gain_db")
    return float(default if g is None else g)


def _pick(c, opts, salt):
    if not opts:
        return None
    h = int(hashlib.sha1(f"{c.ep.get('id', c.ep_dir.name)}|{salt}".encode()).hexdigest(), 16)
    return opts[h % len(opts)]


def find(c, kind, name, salt=""):
    """name -> Path (or None). See module doc for the matching rules."""
    if not name:
        return None
    d = media_dir(c, kind)
    p = (d / str(name))
    if p.is_file():
        return p
    files = list_media(c, kind)
    q = _fold(Path(str(name)).stem if Path(str(name)).suffix.lower() in KINDS[kind]["ext"] else name)
    rel = lambda f: _fold(f.relative_to(d).with_suffix("").as_posix())
    for test in (lambda f: _fold(f.stem) == q or rel(f) == q,
                 lambda f: _fold(f.stem).startswith(q) or rel(f).startswith(q),
                 lambda f: q in rel(f)):
        hit = [f for f in files if test(f)]
        if hit:
            return _pick(c, hit, f"{kind}|{name}|{salt}")
    return None


def _opt(c, key):
    """episode value > blueprint value; `False` in the episode switches a channel default off"""
    if key in c.ep:
        return c.ep[key]
    return c.blueprint.get(key)


# ---------------------------------------------------------------- word timing (same rule as runtime ctx.at)
def word_time(shot_tl, word, line=None):
    w = _fold(word)
    lines = shot_tl["lines"] if line is None else [shot_tl["lines"][line]] if line < len(shot_tl["lines"]) else []
    for l in lines:
        for se in l["sents"]:
            k = _fold(se["text"]).find(w)
            if k >= 0:
                return se["start"] + se["dur"] * (k / max(len(se["text"]), 1))
    return None


def shot_time(shot_tl, at):
    """`at` inside a shot: word (str) | {word, line} | seconds from the shot start | None (= when the shot starts)"""
    if at is None:
        return shot_tl["start"] if shot_tl is not None else 0.0
    if isinstance(at, (int, float)):
        return shot_tl["start"] + float(at)
    if isinstance(at, dict):
        return word_time(shot_tl, at.get("word", ""), at.get("line"))
    return word_time(shot_tl, at)


# ---------------------------------------------------------------- music
def music_plan(c, lib):
    """-> (settings, cues). cues: [{from, to, file(Path|None), mood, gain_db, offset, fade_in, fade_out, note}]"""
    m = _opt(c, "music")
    if m is False or m in ("none", "off"):
        return {}, []
    m = dict(m or {})
    if "cues" not in m and "music" in c.ep and isinstance(c.blueprint.get("music"), dict):   # episode shorthand inherits channel levels
        base = {k: v for k, v in c.blueprint["music"].items() if k in ("gain_db", "gap_lift_db", "gap_min_s", "fade_in", "fade_out")}
        m = {**base, **m}
    if "cues" in m:
        cues = [dict(x) for x in m["cues"] or []]
    elif m.get("file") or m.get("mood") or m.get("pick"):
        cues = [{"from": 0, "to": "end", **{k: m[k] for k in ("file", "mood", "offset", "fade_in", "fade_out") if k in m}}]
        cues[0].setdefault("fade_out", 2.0)
    else:
        return m, []
    for i, cue in enumerate(cues):
        f = None
        if cue.get("file"):
            f = find(c, "music", cue["file"], salt=f"cue{i}")
            cue["note"] = None if f else f"THIẾU FILE {cue['file']}"
        elif cue.get("mood") and cue["mood"] not in ("im-lang", "silence"):
            opts = lib.get(cue["mood"]) or []
            names = [o["file"] if isinstance(o, dict) else o for o in opts]
            f = find(c, "music", names[0]) if names else find(c, "music", cue["mood"], salt=f"cue{i}")
            cue["note"] = None if f else "(im lặng — chưa có bài cho mood này)"
        elif m.get("pick") or cue.get("pick"):
            f = _pick(c, list_media(c, "music"), f"cue{i}")
            cue["note"] = None if f else "(im lặng — folder nhạc trống)"
        cue["path"] = f
    return m, cues


# ---------------------------------------------------------------- sound effects
def sfx_hits(c, tl, t_of):
    """-> [(t, Path|None, gain_db, label, kind)]  kind: sfx | meme-audio"""
    shots_tl = {s["id"]: s for s in tl["shots"]}
    out = []
    it = intro_plan(c)
    if it:
        out.append((0.0, it["path"], it.get("gain_db", -2), it["label"], "intro", it))
    for h in c.ep.get("sfx") or []:
        t = t_of(h.get("at"), tl)
        p = find(c, "sfx", h.get("file"), salt=f"ep{t:.2f}")
        out.append((t, p, float(h["gain_db"]) if "gain_db" in h else lib_gain(c, "sfx", p, -6), h.get("file"), "sfx"))   # episode-level: old default kept
    auto = _opt(c, "auto_sfx") or {}
    for i, s in enumerate(c.ep["shots"]):
        st = shots_tl.get(s["id"])
        if st is None:
            continue
        if auto and auto.get("shot_change") and s.get("auto_sfx", True) is not False and (i > 0 or auto.get("first")):
            p = find(c, "sfx", auto["shot_change"], salt=f"auto{i}")
            out.append((st["start"], p, float(auto["gain_db"]) if "gain_db" in auto else lib_gain(c, "sfx", p, -10), auto["shot_change"], "sfx"))
        for h in s.get("sfx") or []:
            t = shot_time(st, h.get("at"))
            if t is None:
                out.append((st["start"], None, 0, f"{h.get('file')} (không thấy chữ '{h.get('at')}' trong {s['id']})", "sfx")); continue
            p = find(c, "sfx", h.get("file"), salt=f"{s['id']}{t:.2f}")
            cut = {}
            if h.get("until") is not None or h.get("dur") is not None:   # stop the sound at a word of this shot (or after dur s), short fade
                te = shot_time(st, h["until"]) if h.get("until") is not None else t + float(h["dur"])
                if te is not None and te > t:
                    cut = {"len": te - t - float(h.get("shift", 0)), "fade": float(h.get("fade_out", 0.25))}
            out.append((t + float(h.get("shift", 0)), p, float(h["gain_db"]) if "gain_db" in h else lib_gain(c, "sfx", p, -4), h.get("file"), "sfx", cut))
        for k, mm in enumerate(s.get("memes") or []):
            t = shot_time(st, mm.get("at"))
            if t is None:
                continue
            if mm.get("sfx"):
                p = find(c, "sfx", mm["sfx"], salt=f"{s['id']}m{k}")
                out.append((t, p, float(mm["sfx_gain_db"]) if "sfx_gain_db" in mm else lib_gain(c, "sfx", p, -4), mm["sfx"], "sfx"))
            p = find(c, "memes", mm.get("file"), salt=f"{s['id']}m{k}")
            if p is not None and p.suffix.lower() in VIDEO_EXT - {".gif"} and mm.get("sound", True) and has_audio(p):
                out.append((t, p, float(mm.get("sound_gain_db", -8)), f"âm thanh meme {p.name}", "meme-audio",
                            float(mm.get("dur", min(probe_duration(p), 3.0)))))
    return out


def has_audio(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


def probe_duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def intro_plan(c):
    """-> None or {path, lead, gain_db, fade_at, fade}. lead = seconds the narration waits for the sound."""
    v = c.ep.get("intro_sfx", None)
    bp = c.blueprint.get("intro_sfx")
    if v is False or v in ("none", "off"):
        return None
    cfg = dict(bp) if isinstance(bp, dict) else ({"file": bp} if isinstance(bp, str) else {})
    if v is None:
        if not cfg or str(c.ep.get("kind", "")).strip() in [str(k) for k in cfg.get("skip_kinds") or []]:
            return None
    elif isinstance(v, dict):
        cfg.update(v)
        if "file" in v: cfg.pop("pick", None)
    else:
        cfg["file"] = v; cfg.pop("pick", None)
    pool = [f for f in list_media(c, "sfx") if not any(_fold(x) in _fold(f.stem) for x in cfg.get("exclude") or [])
            and lib_entry(c, "sfx", f).get("intro", True) is not False]   # library intro: false -> never picked as the opening sound
    p = find(c, "sfx", cfg["file"], salt="intro") if cfg.get("file") else _pick(c, pool, "intro")
    if not p:
        return {"path": None, "label": cfg.get("file") or "(folder sfx trống)", "lead": 0}
    act = active_duration(p)
    lead = min(act, float(cfg.get("max_lead", 1.2)))
    return {"path": p, "label": p.name, "lead": round(lead, 2), "gain_db": float(cfg["gain_db"]) if "gain_db" in (v if isinstance(v, dict) else {}) else lib_gain(c, "sfx", p, cfg.get("gain_db", -2)),
            "fade_at": lead + float(cfg.get("tail", 0.25)), "fade": float(cfg.get("fade", 0.6)), "full": bool(cfg.get("full", False))}


def _decode_stereo(p, sr=44100):
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "2", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def trim_stereo(x, sr=44100, thr_db=-48):
    """cut leading/trailing silence of a sound effect (many sfx files carry seconds of silence)"""
    import numpy as np
    win = int(0.01 * sr)
    if len(x) < win * 3:
        return x
    m = np.abs(x).max(axis=1)
    n = len(m) // win
    pk = m[: n * win].reshape(n, win).max(axis=1)
    idx = np.where(pk > max(pk.max() * 10 ** (thr_db / 20), 1e-4))[0]
    if not len(idx):
        return x
    return x[max(0, idx[0] * win - int(0.005 * sr)): min(len(x), (idx[-1] + 1) * win + int(0.03 * sr))]


def active_rms_db(x, sr=44100):
    """loudness of the part that sounds (ignores quiet tails), for level-matching sfx to the voice"""
    import numpy as np
    win = int(0.05 * sr)
    if len(x) < win:
        return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)
    n = len(x) // win
    r = np.sqrt(np.mean(np.square(x[: n * win]).reshape(n, -1), axis=1) + 1e-12)
    keep = r[r > r.max() * 10 ** (-20 / 20)]
    return float(20 * np.log10(np.sqrt(np.mean(np.square(keep))) + 1e-9))


def active_duration(p):
    return len(trim_stereo(_decode_stereo(p))) / 44100


def has_fx_audio(c):
    m = _opt(c, "music")
    return bool((m not in (None, False, "none", "off") and m != {}) or c.ep.get("sfx") or _opt(c, "auto_sfx") or intro_plan(c)
                or any(s.get("sfx") or s.get("memes") or any("{" in l for l in s.get("lines", [])) for s in c.ep["shots"]))


# ---------------------------------------------------------------- visuals (render.json `media`)
def _cache_dir(c, kind, src, extra):
    st = src.stat()
    key = hashlib.sha1(f"{src.resolve()}|{st.st_mtime_ns}|{st.st_size}|{extra}".encode()).hexdigest()[:10]
    return c.build / "media" / kind / f"{src.stem[:40]}-{key}"


def _ff(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *map(str, args)], check=True)


def _has_alpha(p):
    from PIL import Image
    with Image.open(p) as im:
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            a = im.convert("RGBA").getchannel("A")
            return a.getextrema()[0] < 250
    return False


def prepare_background(c, tl):
    bg = _opt(c, "background")
    if not bg:
        return None, None
    bg = dict(bg)
    if bg.get("file"):
        src = find(c, "backgrounds", bg["file"])
        if not src:
            return None, f"nền: THIẾU FILE {bg['file']} -> dùng nền tự vẽ"
    else:
        src = _pick(c, list_media(c, "backgrounds"), "bg")
        if not src:
            return None, None          # channel default with an empty folder: drawn background, no warning
    if src.suffix.lower() in VIDEO_EXT and bg.get("start") is None:
        # long gameplay clip: each episode starts at its own (stable) point so videos don't open on the same seconds
        room = probe_duration(src) - (tl["total"] / max(float(bg.get("speed", 1.0)), 0.1) + 1)
        if room > 1:
            hsh = int(hashlib.sha1(str(c.ep.get("id", "")).encode()).hexdigest()[:8], 16)
            bg["start"] = round((hsh % 10000) / 10000 * room, 2)
    W, H, fps = tl["W"], tl["H"], int(c.fmt.get("fps", 30))
    blur = float(bg.get("blur", 0))
    vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}" + (f",boxblur={blur:g}:1" if blur else "")
    out = _cache_dir(c, "bg", src, f"{W}x{H}|{fps}|{blur}|{bg.get('start', 0)}")
    info = {"dim": float(bg.get("dim", 0.15)), "speed": float(bg.get("speed", 1.0)), "name": src.name}
    if src.suffix.lower() in VIDEO_EXT:
        need = min(probe_duration(src) - float(bg.get("start", 0)), tl["total"] / max(info["speed"], 0.1) + 1) or tl["total"]
        if not (out / "done").exists():
            if out.exists(): shutil.rmtree(out)
            out.mkdir(parents=True)
            _ff("-ss", bg.get("start", 0), "-i", src, "-t", f"{need:.2f}", "-vf", vf + f",fps={fps}", "-q:v", 4, out / "f%05d.jpg")
            (out / "done").write_text("ok")
        n = len(list(out.glob("f*.jpg")))
        info.update({"kind": "video", "pattern": out.as_uri() + "/f{n}.jpg", "n": n, "fps": fps})
    else:
        if not (out / "done").exists():
            if out.exists(): shutil.rmtree(out)
            out.mkdir(parents=True)
            # 8 % larger than the frame so the slow zoom never shows an edge
            _ff("-i", src, "-vf", f"scale={int(W * 1.08)}:{int(H * 1.08)}:force_original_aspect_ratio=increase,crop={int(W * 1.08)}:{int(H * 1.08)}"
                + (f",boxblur={blur:g}:1" if blur else ""), "-q:v", 3, out / "img.jpg")
            (out / "done").write_text("ok")
        info.update({"kind": "image", "uri": (out / "img.jpg").as_uri(), "zoom": float(bg.get("zoom", 0.06))})
    return info, f"nền: {src.name} ({info['kind']}, mờ {blur:g}, tối {info['dim']:.2f})"


def prepare_meme(c, src, dur):
    """-> {frames: [uri], fps, w, h, alpha, video}"""
    ext = src.suffix.lower()
    if ext not in VIDEO_EXT:
        out = _cache_dir(c, "memes", src, "img")
        if not (out / "done").exists():
            out.mkdir(parents=True, exist_ok=True)
            _ff("-i", src, "-vf", "scale='min(720,iw)':-2", out / "f00001.png")
            (out / "done").write_text("ok")
        frames = [out / "f00001.png"]
        fps = 1
    else:
        fps = 15
        out = _cache_dir(c, "memes", src, f"vid{fps}|{dur:.2f}")
        if not (out / "done").exists():
            if out.exists(): shutil.rmtree(out)
            out.mkdir(parents=True)
            _ff("-i", src, "-t", f"{dur + 0.5:.2f}", "-vf", f"fps={fps},scale='min(640,iw)':-2", out / "f%05d.png")
            (out / "done").write_text("ok")
        frames = sorted(out.glob("f*.png"))
    from PIL import Image
    with Image.open(frames[0]) as im:
        w, h = im.size
    return {"frames": [f.as_uri() for f in frames], "fps": fps, "w": w, "h": h, "alpha": _has_alpha(frames[0]), "video": ext in VIDEO_EXT}


def prepare_memes(c, tl):
    shots_tl = {s["id"]: s for s in tl["shots"]}
    events, report = [], []
    n = 0
    for s in c.ep["shots"]:
        st = shots_tl.get(s["id"])
        for k, mm in enumerate(s.get("memes") or []):
            t = shot_time(st, mm.get("at")) if st else None
            if t is None:
                report.append(f"meme {mm.get('file')}: không thấy chữ '{mm.get('at')}' trong {s['id']} -> bỏ qua"); continue
            src = find(c, "memes", mm.get("file"), salt=f"{s['id']}m{k}")
            if not src:
                report.append(f"meme {t:6.1f}  THIẾU FILE {mm.get('file')} -> bỏ qua"); continue
            is_vid = src.suffix.lower() in VIDEO_EXT
            dur = float(mm.get("dur") or (min(probe_duration(src), 3.0) if is_vid and src.suffix.lower() != ".gif" else 1.6))
            info = prepare_meme(c, src, dur)
            n += 1
            events.append({"t": round(t + float(mm.get("shift", 0)), 3), "dur": dur, "pos": mm.get("pos", "auto"), "size": mm.get("size", 460),
                           "rot": float(mm.get("rot", (-4 if n % 2 else 4))), "anim": mm.get("anim", "pop"), "loop": bool(mm.get("loop", not info["video"] or src.suffix.lower() == ".gif")),
                           "shot": s["id"], **info})
            report.append(f"meme {t:6.1f}  {src.name}  ({dur:.1f}s, {mm.get('pos', 'auto')})")
    return events, report


def render_media(c, tl):
    """render.json `media` block + report lines (missing files are reported, not fatal)"""
    bg, note = prepare_background(c, tl)
    memes, rep = prepare_memes(c, tl)
    if note: rep.insert(0, note)
    if not bg and not memes:
        return None, rep
    return {"bg": bg, "memes": memes, "safe": (c.fmt.get("layout") or {}).get("meme_safe") or {"top": 170, "bottom": 1480, "left": 50, "right": 1030}}, rep


def resolve_srcs(c, shots):
    """Pictures used inside scenes (e.g. threads card `media.src: anh-goc.png`, path relative to the episode folder):
    -> absolute file URIs (render page preloads them, so no frame is drawn before the picture is decoded). Returns (shots, uris, missing)."""
    import copy
    shots = copy.deepcopy(shots); uris, missing = [], []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "src" and isinstance(v, str) and not v.startswith(("file:", "data:", "http")):
                    p = (c.ep_dir / v).resolve()
                    if p.exists():
                        o[k] = p.as_uri(); uris.append(o[k])
                    else:
                        missing.append(v)
                else:
                    walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(shots)
    return shots, list(dict.fromkeys(uris)), missing


# ---------------------------------------------------------------- QA
def qa_media(c):
    """-> (errors, warnings, oks) about media references"""
    errs, warns, oks = [], [], []
    missing, used = [], 0
    def chk(kind, name, where):
        nonlocal used
        if not name: return
        used += 1
        if not find(c, kind, name): missing.append(f"{where}: {kind}/{name}")
    m = _opt(c, "music")
    if isinstance(m, dict):
        if m.get("file"): chk("music", m["file"], "music")
        for cue in m.get("cues") or []:
            if cue.get("file"): chk("music", cue["file"], "music cue")
        if m.get("pick") and not list_media(c, "music"): warns.append(f"music: pick nhưng folder {media_dir(c, 'music').relative_to(c.ch_dir)} trống -> không có nhạc nền")
    for h in c.ep.get("sfx") or []: chk("sfx", h.get("file"), "sfx")
    auto = _opt(c, "auto_sfx") or {}
    if auto.get("shot_change"): chk("sfx", auto["shot_change"], "auto_sfx")
    it = intro_plan(c)
    if it and not it["path"]: missing.append(f"intro_sfx: sfx/{it['label']}")
    elif it: oks.append(f"sound mở đầu: {it['label']} (giọng vào sau {it['lead']:.1f}s)")
    for s in c.ep["shots"]:
        for h in s.get("sfx") or []: chk("sfx", h.get("file"), s["id"])
        for mm in s.get("memes") or []:
            chk("memes", mm.get("file"), s["id"])
            if mm.get("sfx"): chk("sfx", mm["sfx"], s["id"] + " meme sfx")
    bg = _opt(c, "background")
    if isinstance(bg, dict) and bg.get("file"): chk("backgrounds", bg["file"], "background")
    _, _, miss_src = resolve_srcs(c, c.ep["shots"])
    if miss_src: errs.append(f"ảnh trong cảnh (src) không có trong folder tập: {miss_src}")
    if missing:
        warns.append(f"tài nguyên chưa có file (sẽ bỏ qua khi dựng): {missing}")
    elif used:
        oks.append(f"{used} tài nguyên (nhạc/sfx/meme/nền) đều có file")
    return errs, warns, oks

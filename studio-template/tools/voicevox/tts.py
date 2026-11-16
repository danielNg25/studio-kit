#!/usr/bin/env python3
"""Japanese voice clips with VOICEVOX core (offline) for an episode — the `voice` step for channels whose voice.yaml says
provider: voicevox (build.py has no such provider). Clip file names come from build.py itself (sentences()), so
`build.py <ep> audio|qa|stills|render` work unchanged afterwards (also on the cloud container: audio/clips/index.json).

Voice per shot: episode `cast: {name: "voicevox:<style_id>"}` + shot `speaker: name` (or the channel default voice_id).
Speed: voice.yaml / episode `speed` → VOICEVOX speedScale.

Breath groups (engine/patches/apply_ja_breath.py): a line may hold a whole sentence with subtitle breaks marked ｜
("ノキアは携帯電話事業のほぼすべてを、｜売却すると発表します。"). The line is read in ONE go (natural accent and flow);
for each such clip this tool also writes <clip>.parts.json = start time (s, in the raw clip) of every subtitle piece,
taken from VOICEVOX's own mora timings, so `audio` can time the burned-in subtitles and the SRT exactly.

Setup (once per machine/session; resources live in studio-template/.cache/tts/voicevox/, see README.md):
  pip3 install --user .cache/tts/voicevox/voicevox_core-*.whl
Usage:
  python3 tools/voicevox/tts.py ../<channel>/episodes/<id>           # make missing clips (+ .parts.json)
  python3 tools/voicevox/tts.py ../<channel>/episodes/<id> --kana    # only print how every line will be READ (katakana) → build/kana.txt
  python3 tools/voicevox/tts.py ../<channel>/episodes/<id> --index-only   # only record audio/clips/spoken.json (no VOICEVOX needed)
  python3 tools/voicevox/tts.py ../<channel>/episodes/<id> --ref-for-aivis  # timing reference clips for AivisSpeech lines (tools/aivis)

Re-splitting subtitles without new voice (2026-10-07): moving a ｜ changes the clip file name (the hash keeps the marker), but
the audio is the same. audio/clips/spoken.json maps "<style>|<speed>|<text without ｜>" → clip; a missing clip whose text is
already there is COPIED and only its .parts.json is recomputed from VOICEVOX's audio query (no synthesis, identical audio).
Run --index-only BEFORE editing the split if spoken.json does not exist yet.
Credit is REQUIRED when publishing: 「VOICEVOX:<キャラ名>」 (README_vvm.txt has each character's terms).
"""
import glob, json, os, subprocess, sys, tempfile, wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
STUDIO = HERE.parents[1]
sys.path.insert(0, str(STUDIO / "engine"))
import build as B  # noqa: E402


def load_synth(c, sents):
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
    vv = Path(os.environ.get("VOICEVOX_DIR", STUDIO / ".cache/tts/voicevox"))
    libs = sorted(glob.glob(str(vv / "voicevox_onnxruntime-*/lib/libvoicevox_onnxruntime.*")))
    libs = [l for l in libs if not l.endswith(".so") or len(libs) == 1] or libs
    ort = Onnxruntime.load_once(filename=libs[-1])
    syn = Synthesizer(ort, OpenJtalk(str(next(vv.glob("open_jtalk_dic_utf_8-*")))))
    need = {sid_of(c, s) for s in sents}
    for vvm in sorted((vv / "models").glob("*.vvm")):
        with VoiceModelFile.open(str(vvm)) as m:
            ids = {st.id for meta in m.metas for st in meta.styles}
            if ids & need:
                syn.load_voice_model(m)
    return syn


def sid_of(c, s):
    return int(str(s.get("voice") or c.voice_id).split(":")[-1].split("@")[0])


def tune(c, s, q):
    """per-line expression in the cast code: voicevox:<style>@<speed>@<pitch>@<intonation>@<volume> (empty = default).
    e.g. cast {shiba_hot: "voicevox:40@1.25@0.08@1.5@1.4"} + line_voices [shiba_hot] (2026-10-07, japan-animal)"""
    p = str(s.get("voice") or c.voice_id).split(":")[-1].split("@")[1:]
    for k, attr in enumerate(["speed_scale", "pitch_scale", "intonation_scale", "volume_scale"]):
        if k < len(p) and p[k] != "":
            setattr(q, attr, float(p[k]))
    return q


def _g(o, k):
    """field of a voicevox_core object or plain dict (0.17 returns pause_mora as a dict)"""
    return o.get(k) if isinstance(o, dict) else getattr(o, k, None)


def _len(m):
    return float(_g(m, "consonant_length") or 0.0) + float(_g(m, "vowel_length") or 0.0)


def part_starts(syn, q, parts, sid, wav_seconds):
    """start time (s) of each subtitle piece inside the synthesized clip, from the mora timeline of the WHOLE sentence.
    Pieces are located by counting their moras (each piece analysed alone); a pause after 、 belongs to the piece before,
    so the next cue appears when its first mora is spoken."""
    counts = [sum(len(_g(ap, "moras")) for ap in syn.create_accent_phrases(p, sid)) for p in parts]
    t, starts_m = q.pre_phoneme_length, []
    for ap in q.accent_phrases:
        for m in _g(ap, "moras"):
            starts_m.append(t); t += _len(m)
        if _g(ap, "pause_mora") is not None:
            t += _len(_g(ap, "pause_mora"))
    t += q.post_phoneme_length
    k = wav_seconds / t if t > 0 else 1.0          # speed scale (and any rounding) measured, not assumed
    M, tot = len(starts_m), max(1, sum(counts))
    out, cum = [0.0], 0
    for n in counts[:-1]:
        cum += n
        i = min(M - 1, max(0, round(cum * M / tot)))
        out.append(round(starts_m[i] * k, 3) if M else 0.0)
    return out, counts, M


def spoken_key(c, s):
    return f"{str(s.get('voice') or c.voice_id).split(':')[-1]}|{c.speed}|{s['spoken']}"   # = "<style>|..." for plain codes


def save_spoken(c, sents):
    p = c.clips / "spoken.json"
    idx = json.load(open(p)) if p.exists() else {}
    for s in sents:
        if (c.clips / s["file"]).exists():
            idx[spoken_key(c, s)] = s["file"]
    json.dump(idx, open(p, "w"), ensure_ascii=False, indent=1)
    return idx


def wav_seconds_of(c, fname):
    side = c.clips / (fname + ".parts.json")
    if side.exists():
        w = json.load(open(side)).get("wav_s")
        if w: return float(w)
    return len(B.decode(c.clips / fname)) / B.SR


REF_STYLE = 11   # 玄野武宏: reference voice for timing only (never published)


def make_refs(c, sents):
    """AivisSpeech clips have no mora timings → for every AivisSpeech breath-group clip, make a VOICEVOX reference clip of the
    SAME text with mora-timed piece starts (<clip>.ref.mp3 + <clip>.ref.mp3.parts.json). tools/align/aivis_parts.py maps those
    times onto the AivisSpeech clip by DTW. Reuses any existing VOICEVOX clip of the same text (spoken.json)."""
    todo = [s for s in sents if str(s.get("voice") or "").startswith("aivis:") and s.get("spoken_parts")
            and not (c.clips / (s["file"] + ".ref.mp3.parts.json")).exists()]
    p = c.clips / "spoken.json"
    spk = json.load(open(p)) if p.exists() else {}
    print(f"refs: {len(todo)} to make")
    syn = None
    for s in todo:
        dst = c.clips / (s["file"] + ".ref.mp3")
        old = next((spk[k] for k in (f"{REF_STYLE}|{c.speed}|{s['spoken']}", f"32|{c.speed}|{s['spoken']}") if k in spk and (c.clips / spk[k]).exists()), None)
        if old and (c.clips / (old + ".parts.json")).exists() and len(json.load(open(c.clips / (old + ".parts.json")))["starts"]) == len(s["spoken_parts"]):
            subprocess.run(["cp", str(c.clips / old), str(dst)], check=True)
            subprocess.run(["cp", str(c.clips / (old + ".parts.json")), str(dst) + ".parts.json"], check=True)
            continue
        if syn is None:
            syn = load_synth(c, [{"voice": f"voicevox:{REF_STYLE}"}])
        q = syn.create_audio_query(s["spoken"], REF_STYLE); q.speed_scale = c.speed
        wav = syn.synthesis(q, REF_STYLE)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(wav)
        with wave.open(f.name) as w:
            secs = w.getnframes() / w.getframerate()
        st, counts, M = part_starts(syn, q, s["spoken_parts"], REF_STYLE, secs)
        json.dump({"starts": st, "moras": counts, "moras_sentence": M, "wav_s": round(secs, 3)}, open(str(dst) + ".parts.json", "w"), ensure_ascii=False)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f.name, "-b:a", "160k", str(dst)], check=True); os.unlink(f.name)
        print(f"  ref {s['file']}: {s['spoken'][:30]}", flush=True)
    print("refs: done")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    c = B.Ctx(sys.argv[1])
    kana_only = "--kana" in sys.argv
    sents_all = B.sentences(c)
    sents_any = B.clips_of(sents_all)
    if "--ref-for-aivis" in sys.argv:
        return make_refs(c, sents_any)
    sents = [s for s in sents_any if str(s.get("voice") or c.voice_id).startswith("voicevox:")]   # other engines: own tools
    if not sents:
        print("voicevox: no VOICEVOX voices in this episode"); return
    if kana_only:
        syn = load_synth(c, sents)
        lines = []
        for s in sents:
            q = syn.create_audio_query(s["spoken"], sid_of(c, s))
            lines.append(f"{s['shot']}\t{s['text']}\t{q.kana}")
        (c.build / "kana.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
        print("\n".join(lines)); print(f"→ {c.build / 'kana.txt'}")
        return
    if "--index-only" in sys.argv:
        print(f"spoken.json: {len(save_spoken(c, sents))} entries"); return
    todo = [s for s in sents if not (c.clips / s["file"]).exists()
            or (s.get("spoken_parts") and not (c.clips / (s["file"] + ".parts.json")).exists())]
    spk = save_spoken(c, sents)
    reuse = [s for s in todo if not (c.clips / s["file"]).exists() and (c.clips / str(spk.get(spoken_key(c, s)))).exists()]
    if reuse:   # same words, new subtitle split: copy the clip, recompute only the cue starts
        syn = load_synth(c, reuse)
        for s in reuse:
            old = spk[spoken_key(c, s)]; secs = wav_seconds_of(c, old)
            subprocess.run(["cp", str(c.clips / old), str(c.clips / s["file"])], check=True)
            if s.get("spoken_parts"):
                sid = sid_of(c, s); q = syn.create_audio_query(s["spoken"], sid); q.speed_scale = c.speed; tune(c, s, q)
                st, counts, M = part_starts(syn, q, s["spoken_parts"], sid, secs)
                json.dump({"starts": st, "moras": counts, "moras_sentence": M, "wav_s": round(secs, 3), "reused_from": old},
                          open(c.clips / (s["file"] + ".parts.json"), "w"), ensure_ascii=False)
            print(f"  reused {old} → {s['file']} (new split, same audio): {' ｜ '.join(s.get('spoken_parts') or [s['spoken']])}")
        todo = [s for s in todo if s not in reuse]
    print(f"voicevox: {len(sents) - len(todo)} cached, {len(todo)} to generate (speed {c.speed})")
    if not todo:
        B.save_index(c, sents_all)
        return
    syn = load_synth(c, todo)
    for n, s in enumerate(todo):
        sid = sid_of(c, s)
        q = syn.create_audio_query(s["spoken"], sid)
        q.speed_scale = c.speed
        tune(c, s, q)
        wav = syn.synthesis(q, sid)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(wav)
        with wave.open(f.name) as w:
            secs = w.getnframes() / w.getframerate()
        if s.get("spoken_parts"):
            st, counts, M = part_starts(syn, q, s["spoken_parts"], sid, secs)
            json.dump({"starts": st, "moras": counts, "moras_sentence": M, "wav_s": round(secs, 3)},
                      open(c.clips / (s["file"] + ".parts.json"), "w"), ensure_ascii=False)
            if sum(counts) != M:
                print(f"  ! mora count differs (pieces {sum(counts)} vs sentence {M}) — cue times scaled: {s['spoken']}")
        if not (c.clips / s["file"]).exists():
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f.name, "-b:a", "160k", str(c.clips / s["file"])], check=True)
        os.unlink(f.name)
        print(f"  {n + 1}/{len(todo)} [{sid}] {s['spoken']}", flush=True)
    B.save_index(c, sents_all); save_spoken(c, sents)
    print("voicevox: done")


if __name__ == "__main__":
    main()

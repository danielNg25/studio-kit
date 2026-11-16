#!/usr/bin/env python3
"""Render một tập theo nhiều đoạn khung SONG SONG rồi ghép + mux tiếng (dùng trên máy local nhiều nhân).

usage:  python3 tools/local/render_parallel.py <episode_dir> [--jobs N] [--chunk KHUNG] [--keep]
        (thường gọi qua:  tools/local/run.sh <episode_dir> render)

Làm đúng như `build.py render` (render_json, mix, chọn mix.wav hay narration.wav, tên file ra <kênh>/out/<id>_<format>.mp4)
nhưng chia khung hình thành nhiều đoạn, mỗi đoạn một tiến trình `engine/render.mjs --frames a:b` (chỉ hình),
rồi `ffmpeg -f concat -c:v copy` + mux tiếng. Không sửa build.py: file này nạp build.py như một module.
Nếu sau này `cmd_render` trong build.py đổi cách chọn tiếng / tên file, sửa phần "giống cmd_render" bên dưới cho khớp.
"""
import argparse, importlib.util, json, math, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

HERE = Path(__file__).resolve().parent
STUDIO = HERE.parent.parent
ENGINE = STUDIO / "engine"


def load_build():
    sys.path.insert(0, str(ENGINE))          # build.py `import media` ... như khi chạy `python3 engine/build.py`
    spec = importlib.util.spec_from_file_location("studio_build", ENGINE / "build.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run_chunk(i, a, b, rj_path, chunk_path, log_path):
    t0 = time.time()
    with open(log_path, "w") as log:
        r = subprocess.run(["node", str(ENGINE / "render.mjs"), str(rj_path), str(chunk_path), "--frames", f"{a}:{b}"],
                           cwd=str(STUDIO), stdout=log, stderr=subprocess.STDOUT)
    return i, a, b, r.returncode, time.time() - t0


def probe_duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("episode_dir")
    ap.add_argument("--jobs", type=int, default=0, help="số tiến trình render song song (mặc định: nửa số nhân, tối đa 4)")
    ap.add_argument("--chunk", type=int, default=0, help="số khung mỗi đoạn (mặc định: tự chia ~3 đoạn mỗi tiến trình, 120–700 khung)")
    ap.add_argument("--keep", action="store_true", help="giữ lại build/chunks/ sau khi ghép")
    a = ap.parse_args()

    B = load_build()
    c = B.Ctx(a.episode_dir)
    p, tl = B.render_json(c)                       # build/render.json (giống cmd_render)
    rj = json.load(open(p, encoding="utf-8"))
    fps = rj.get("fps") or 30
    n = round(rj["timeline"]["total"] * fps)
    name = f"{c.ep.get('id', c.ep_dir.name)}_{c.fmt['id']}.mp4"
    out = c.renders / name

    # --- giống cmd_render: chọn tiếng
    audio = None
    if not tl.get("silent"):
        if B.M.has_fx_audio(c):
            B.cmd_mix(c)
        mix, narr = c.build / "mix.wav", c.build / "narration.wav"
        use_mix = mix.exists() and mix.stat().st_mtime >= narr.stat().st_mtime
        audio = mix if use_mix else narr

    jobs = a.jobs or min(4, max(1, (os.cpu_count() or 2) // 2))
    chunk = a.chunk or max(120, min(700, math.ceil(n / (jobs * 3))))
    ranges = [(s, min(n, s + chunk)) for s in range(0, n, chunk)]
    cdir = c.build / "chunks"
    cdir.mkdir(exist_ok=True)
    for f in list(cdir.glob("c*.mp4")) + list(cdir.glob("c*.log")):
        f.unlink()
    print(f"render song song: {n} khung ({n / fps:.1f}s) · {len(ranges)} đoạn ~{chunk} khung · {jobs} tiến trình -> {out}")

    t0 = time.time()
    failed = []
    with ThreadPoolExecutor(max_workers=jobs) as ex:
        futs = [ex.submit(run_chunk, i, s, e, p, cdir / f"c{i:03d}.mp4", cdir / f"c{i:03d}.log") for i, (s, e) in enumerate(ranges)]
        done = 0
        for fu in as_completed(futs):
            i, s, e, rc, dt = fu.result()
            done += 1
            print(f"  [{done}/{len(ranges)}] đoạn {i} (khung {s}-{e}) {'xong' if rc == 0 else 'LỖI'} {dt:.0f}s")
            if rc != 0:
                failed.append(i)
    if failed:
        for i in sorted(failed):
            lg = (cdir / f"c{i:03d}.log").read_text(errors="replace").strip().splitlines()[-8:]
            print(f"--- log đoạn {i} ---\n" + "\n".join(lg))
        sys.exit(f"{len(failed)} đoạn lỗi — xem build/chunks/*.log")

    lst = cdir / "list.txt"
    lst.write_text("".join("file '%s'\n" % str(cdir / f"c{i:03d}.mp4").replace("'", "'\\''") for i in range(len(ranges))))
    ff = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst)]
    if audio:
        ff += ["-i", str(audio)]
    ff += ["-c:v", "copy"]
    if audio:
        ff += ["-c:a", "aac", "-b:a", "160k", "-shortest"]
    ff += ["-movflags", "+faststart", str(out)]
    subprocess.run(ff, check=True)

    dur, want = probe_duration(out), n / fps
    if dur is None or abs(dur - want) > 0.25:
        print(f"CẢNH BÁO: video dài {dur}s, mong đợi ~{want:.2f}s — xem lại trước khi duyệt")
    if not a.keep:
        for f in list(cdir.glob("c*.mp4")) + list(cdir.glob("c*.log")) + [lst]:
            f.unlink()
    print(f"render: {out}  ({time.time() - t0:.0f}s, video {dur and round(dur, 2)}s)")


if __name__ == "__main__":
    main()

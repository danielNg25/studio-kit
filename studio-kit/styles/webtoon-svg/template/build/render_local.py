#!/usr/bin/env python3
# Render TẠI MÁY (không cần build.py, không cần file giọng): python3 build/render_local.py [-j N] [--redo shotid,...] [--only K]
# Cần: node + playwright của studio, ffmpeg; build/render_cloud.json (bản dựng sẵn từ cloud), build/narration.m4a (giọng đã ghép, CHƯA nhạc nền)
# → <kênh>/out/<id tập>_bio-long.mp4 (chưa nhạc nền / phụ đề) ; khúc 300 khung ở build/full_local/, đứt giữa chừng thì chạy lại lệnh là làm tiếp
import os, sys, subprocess, time, threading, json, argparse
from pathlib import Path
EP = Path(__file__).resolve().parent.parent; ROOT = Path(os.environ.get('STUDIO_ROOT') or EP.parents[2]); ENGINE = ROOT / 'studio-template' / 'engine'; CH = EP.parents[1]
FPS, SEG = 30, 300
ap = argparse.ArgumentParser(); ap.add_argument('-j', type=int, default=0); ap.add_argument('--redo', default=''); ap.add_argument('--only', type=int, default=0); a = ap.parse_args()
OUT = EP / 'build' / 'full_local_v6'; OUT.mkdir(parents=True, exist_ok=True)
def log(*x): print(time.strftime('%H:%M:%S'), *x, flush=True)
subprocess.run(['python3', 'build/mkjob.py'], cwd=EP, check=True, stdin=subprocess.DEVNULL)   # ghép cảnh + build/render_dev.json từ episode.yaml + timeline.json (không phụ đề cứng)
src = (EP / 'build' / 'render_dev.json').read_text(encoding='utf-8').replace('/home/claude/studio', str(ROOT).replace('\\', '/'))
p = EP / 'build' / 'render_local.json'; p.write_text(src, encoding='utf-8'); rj = json.loads(src); tl = rj['timeline']; total_f = round(tl['total'] * FPS)
miss = [s for s in rj.get('scripts', []) + rj.get('preload', []) if isinstance(s, str) and s.startswith('/') and not Path(s).exists()]
if miss: sys.exit('thiếu file: ' + ', '.join(miss[:5]))
aud = EP / 'build' / 'final_audio.m4a'
if not aud.exists(): aud = EP / 'build' / 'narration.m4a'
if not aud.exists(): sys.exit('thiếu build/final_audio.m4a')
jobs = [(x, min(x + SEG, total_f)) for x in range(0, total_f, SEG)]
path = lambda j: OUT / f'c{j[0]:06d}.mp4'
if a.redo:
    for s in tl['shots']:
        if s['id'] in a.redo.split(','):
            for j in jobs:
                if j[0] < (s['start'] + s['dur']) * FPS and j[1] > s['start'] * FPS: Path(str(path(j)) + '.ok').unlink(missing_ok=True)
todo = [j for j in jobs if not Path(str(path(j)) + '.ok').exists()]
if a.only: todo = todo[:a.only]
nw = a.j or max(2, min(6, (os.cpu_count() or 4) // 2))
log(f'render {len(todo)}/{len(jobs)} khúc, {nw} luồng'); lock = threading.Lock(); q = list(todo); done = [0]; fail = []
def worker():
    while True:
        with lock:
            if not q: return
            j = q.pop(0)
        pth = path(j); t0 = time.time()
        r = subprocess.run(['node', str(ENGINE / 'render.mjs'), str(p), str(pth), '--frames', f'{j[0]}:{j[1]}'], cwd=EP, stdin=subprocess.DEVNULL, stdout=open(str(pth) + '.log', 'w'), stderr=subprocess.STDOUT)
        with lock:
            if r.returncode == 0: Path(str(pth) + '.ok').write_text('ok'); done[0] += 1; log(f'xong {j[0]}–{j[1]} ({time.time() - t0:.0f}s) {done[0]}/{len(todo)}')
            else: fail.append(j); log('LỖI', j, '→ xem', str(pth) + '.log')
ths = [threading.Thread(target=worker) for _ in range(nw)]; [t.start() for t in ths]; [t.join() for t in ths]
if fail: sys.exit(f'lỗi {len(fail)} khúc, chạy lại lệnh này')
if a.only: sys.exit('chạy thử xong (--only), chưa ghép')
lst = OUT / 'list.txt'; lst.write_text(''.join(f"file '{path(j)}'\n" for j in jobs))
out = CH / 'out' / f'{EP.name}_bio-long.mp4'; out.parent.mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-i', str(aud), '-map', '0:v', '-map', '1:a', '-c', 'copy', '-t', f'{tl["total"]:.3f}', '-movflags', '+faststart', str(out)], check=True)
log('XONG', out)

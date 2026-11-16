#!/usr/bin/env python3
# Dò "nhân vật đứng yên mà nảy/nhảy lên một tí" trên clip đã render (13/11/2026).
# Vì sao có tool này: người dùng chê lỗi này 2 lần trong một ngày (tập chúa công + võ công hỏng người) mà ảnh mỗi giây và qa.py không bắt được.
#
#   python3 studio-kit/tools/hopcheck.py <clip.mp4> [--ep <thư mục tập>] [--min 18] [--out <thư mục>] [--no-images] [--from s --to s]
#
# Cách làm: giải mã clip xuống 320×180 xám, 15 khung/giây; mỗi cặp khung liền nhau đo độ dịch của từng ô 16×16 (so khớp khối, ±6 px dọc, ±1 px ngang);
# trừ đi chuyển động chung của máy quay (dịch + zoom, khớp bình phương tối thiểu); rồi tìm cụm ô (≥ 5 ô, cao ≥ 3 ô ≈ một thân người) cùng
# ĐI LÊN rồi TRỞ VỀ CHỖ CŨ trong ≤ 0,7 s mà gần như không đi ngang. Đó là dấu hiệu "nhảy tại chỗ". Ngưỡng --min = độ cao tối thiểu tính theo px ở 1080p.
# Bắt được: hop/pop/nhún ≥ ~18 px. Không phân biệt được nhảy có lý do (bước lên bậc, né đòn) với nảy lấp chỗ → mở ảnh dải khung nó sinh ra để xem.
# Vật đi lên rồi rơi xuống (dao bổ, đồ tung lên) cũng có thể bị báo: xem ảnh rồi bỏ qua.
# Mã thoát: 0 (chỉ là công cụ soát; số lượng in ở dòng cuối). Cần: ffmpeg, numpy, Pillow.
import sys, os, json, subprocess, argparse
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('clip'); ap.add_argument('--ep', default=''); ap.add_argument('--min', type=float, default=18.0); ap.add_argument('--out', default='')
ap.add_argument('--no-images', action='store_true'); ap.add_argument('--from', dest='t0', type=float, default=0.0); ap.add_argument('--to', dest='t1', type=float, default=0.0)
a = ap.parse_args()
W, H, FPS, B, PY, PX = 320, 176, 15, 16, 6, 1          # 176 = 11 ô × 16 (bỏ 4 px đáy)
K = 1920 / W                                            # px 1080p cho mỗi px ở cỡ soát
cmd = ['ffmpeg', '-nostdin', '-loglevel', 'error'] + (['-ss', str(a.t0)] if a.t0 else []) + (['-to', str(a.t1)] if a.t1 else []) + ['-i', a.clip, '-vf', f'fps={FPS},scale={W}:180,crop={W}:{H}:0:0,format=gray', '-f', 'rawvideo', '-']
p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
nby, nbx = H // B, W // B
ys, xs = np.mgrid[0:nby, 0:nbx]; cy, cx = (ys - (nby - 1) / 2) * B, (xs - (nbx - 1) / 2) * B
shifts = [(dy, dx) for dy in range(-PY, PY + 1) for dx in range(-PX, PX + 1)]
RY, RX, CUT = [], [], []
prev = None
def blocks(m): return m.reshape(nby, B, nbx, B)
while True:
    buf = p.stdout.read(W * H)
    if len(buf) < W * H: break
    cur = np.frombuffer(buf, np.uint8).reshape(H, W).astype(np.int16)
    if prev is None: prev = cur; continue
    cut = float(np.abs(cur - prev).mean()) > 22
    pp = np.pad(prev, ((PY, PY), (PX, PX)), mode='edge')
    sad = np.empty((len(shifts), nby, nbx), np.float32)
    for i, (dy, dx) in enumerate(shifts):      # nội dung dịch (dx, dy): cur(y, x) ≈ prev(y − dy, x − dx)
        ref = pp[PY - dy:PY - dy + H, PX - dx:PX - dx + W]
        sad[i] = blocks(np.abs(cur - ref)).sum(axis=(1, 3))
    best = sad.argmin(axis=0); zero = shifts.index((0, 0))
    vy = np.array([s[0] for s in shifts], np.float32)[best]; vx = np.array([s[1] for s in shifts], np.float32)[best]
    tex = blocks(cur).std(axis=(1, 3)) > 7
    still = sad[zero] <= sad.min(axis=0) * 1.15 + 40          # không rõ là có dịch → coi như đứng yên
    vy[still] = 0; vx[still] = 0
    ok = tex.copy()
    # chuyển động chung của máy: v = s·(p − tâm) + t  → trừ đi (2 vòng, bỏ ô lệch)
    ry, rx = vy.copy(), vx.copy()
    for _ in range(2):
        if ok.sum() < 12: break
        A1 = np.concatenate([np.stack([cx[ok], np.ones(ok.sum()), np.zeros(ok.sum())], 1), np.stack([cy[ok], np.zeros(ok.sum()), np.ones(ok.sum())], 1)])
        b1 = np.concatenate([vx[ok], vy[ok]])
        sol, *_ = np.linalg.lstsq(A1, b1, rcond=None); s_, tx, ty = sol
        rx = vx - (s_ * cx + tx); ry = vy - (s_ * cy + ty)
        ok = tex & (np.abs(rx) < 1.6) & (np.abs(ry) < 1.6)
    ry[~tex] = 0; rx[~tex] = 0
    RY.append(np.round(ry)); RX.append(np.round(rx)); CUT.append(cut)
    prev = cur
p.wait()
RY = np.array(RY); RX = np.array(RX); CUT = np.array(CUT); n = len(RY)
if n < 10: sys.exit('clip quá ngắn / không đọc được')
WIN = int(0.7 * FPS) + 1; need = a.min / K
ev = np.zeros((n, nby, nbx), np.float32)      # độ cao (px cỡ soát) tại khung đỉnh
for t in range(n - 3):
    hi = min(n, t + WIN)
    if CUT[t:hi].any(): continue
    start = (RY[t] <= -1) & ((RY[t - 1] > -1) if t else True)
    if not start.any(): continue
    cs = np.cumsum(RY[t:hi], axis=0); cxs = np.cumsum(RX[t:hi], axis=0)
    tmin = cs.argmin(axis=0); peak = -cs.min(axis=0)
    back = np.zeros_like(start)
    for k in range(1, hi - t):
        back |= (k > tmin) & (cs[k] >= -1.0)
    flat = np.abs(cxs).max(axis=0) <= 2
    hit = start & (peak >= need) & back & flat
    for (by, bx) in zip(*np.nonzero(hit)):
        tt = t + int(tmin[by, bx]); ev[tt, by, bx] = max(ev[tt, by, bx], peak[by, bx])
# gom cụm theo không gian (4 láng giềng) trong cửa sổ ±2 khung
found = []; used = np.zeros_like(ev, bool)
for t in range(n):
    if not ev[t].any(): continue
    lo, hi = max(0, t - 2), min(n, t + 3); m = (ev[lo:hi].max(axis=0) > 0) & ~used[lo:hi].all(axis=0)
    seen = np.zeros_like(m)
    for (by, bx) in zip(*np.nonzero(m & (ev[t] > 0))):
        if seen[by, bx]: continue
        st, comp = [(by, bx)], []; seen[by, bx] = True
        while st:
            y, x = st.pop(); comp.append((y, x))
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < nby and 0 <= xx < nbx and m[yy, xx] and not seen[yy, xx]: seen[yy, xx] = True; st.append((yy, xx))
        hgt = max(c[0] for c in comp) - min(c[0] for c in comp) + 1
        if len(comp) >= 5 and hgt >= 3:
            pk = max(float(ev[lo:hi, y, x].max()) for y, x in comp)
            found.append({'t': a.t0 + (t + 1) / FPS, 'x': round((np.mean([c[1] for c in comp]) + 0.5) * B * K), 'y': round((np.mean([c[0] for c in comp]) + 0.5) * B * K), 'px': round(pk * K), 'n': len(comp)})
            for y, x in comp: used[lo:hi, y, x] = True
# gộp sự kiện sát nhau (cùng chỗ, cách < 0,45 s)
found.sort(key=lambda e: e['t']); out = []
for e in found:
    if out and e['t'] - out[-1]['t'] < 0.45 and abs(e['x'] - out[-1]['x']) < 320: out[-1]['px'] = max(out[-1]['px'], e['px']); out[-1]['n'] = max(out[-1]['n'], e['n']); continue
    out.append(e)
shots = []
if a.ep:
    try: shots = json.load(open(os.path.join(a.ep, 'build', 'timeline.json')))['shots']
    except Exception: shots = []
def shot_of(t):
    for s in shots:
        if s['start'] <= t < s['start'] + s['dur']: return f"{s['id']} +{t - s['start']:.1f}s"
    return ''
print(f'Clip: {a.clip} · {n / FPS:.1f} s soát · ngưỡng {a.min:.0f} px (1080p)')
for e in out: print(f"  {int(e['t'] // 60):02d}:{e['t'] % 60:05.2f}  ~{e['px']:3d} px  tại x≈{e['x']} y≈{e['y']}  ({e['n']} ô)  {shot_of(e['t'])}")
if out and not a.no_images:
    from PIL import Image, ImageDraw
    od = a.out or os.path.join(os.path.dirname(os.path.abspath(a.clip)), 'qa_hop_' + os.path.splitext(os.path.basename(a.clip))[0]); os.makedirs(od, exist_ok=True)
    rows = []
    for e in out[:120]:
        f = os.path.join(od, '_t.jpg')
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-ss', f"{max(0, e['t'] - 0.4):.3f}", '-i', a.clip, '-vf', f'fps={FPS},scale=256:-1,tile=12x1', '-frames:v', '1', f], check=False)
        if os.path.exists(f): im = Image.open(f).convert('RGB'); rows.append((im.copy(), f"{int(e['t'] // 60):02d}:{e['t'] % 60:05.2f} ~{e['px']}px x{e['x']} {shot_of(e['t'])}")); os.remove(f)
    per = 10
    for i in range(0, len(rows), per):
        part = rows[i:i + per]; w = part[0][0].width; h = part[0][0].height + 18; S = Image.new('RGB', (w, h * len(part)), 'white'); d = ImageDraw.Draw(S)
        for j, (im, lab) in enumerate(part): S.paste(im, (0, j * h + 18)); d.rectangle([0, j * h, w, j * h + 17], fill='black'); d.text((4, j * h + 3), lab, fill='white')
        S.save(os.path.join(od, f'hop_{i // per + 1:02d}.jpg'), quality=80)
    print(f'Ảnh dải khung (12 khung, 0,8 s quanh mỗi chỗ): {od}/hop_*.jpg — MỞ RA XEM')
print(f'--- {len(out)} chỗ nghi nảy/nhảy tại chỗ')

# ảnh kiểm nhanh: mỗi shot 2 khung (40% và 85%), lưới 6 cột nhỏ → build/prev/smoke_<n>.jpg ; in shot lỗi nếu có
import json, os, subprocess, sys
from PIL import Image, ImageDraw
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(EP)
subprocess.run(['python3', 'build/mkjob.py'], check=True, capture_output=True)
tl = json.load(open('build/timeline.json'))['shots']; sel = [s for s in tl if not sys.argv[1:] or any(s['id'].startswith(p) for p in sys.argv[1:])]
want = [(s['id'], f, round(s['start'] + s['dur'] * f, 2)) for s in sel for f in (0.4, 0.85)]
out = 'build/prev/_smoke'; os.makedirs(out, exist_ok=True)
p = subprocess.run(['node', '../../../studio-template/engine/render.mjs', 'build/render_dev.json', out, '--stills', ','.join(str(w[2]) for w in want)], capture_output=True, text=True)
if p.returncode: print(p.stdout[-800:], p.stderr[-1800:]); sys.exit(1)
N = 36
for pg in range(0, len(want), N):
    part = want[pg:pg + N]; W = Image.new('RGB', (6 * 400, 225 * ((len(part) + 5) // 6)), 'white'); d = ImageDraw.Draw(W)
    for i, (sid, f, tt) in enumerate(part):
        im = Image.open(f'{out}/t{tt:07.2f}.jpg').resize((400, 225)); x, y = (i % 6) * 400, (i // 6) * 225; W.paste(im, (x, y)); d.rectangle([x, y, x + 110, y + 14], fill='black'); d.text((x + 3, y + 1), f'{sid} {int(f*100)}', fill='white')
    W.save(f'build/prev/smoke_{pg // N}.jpg', quality=72); print(f'build/prev/smoke_{pg // N}.jpg')

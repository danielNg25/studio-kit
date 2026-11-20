# dải khung liên tiếp để soát CHUYỂN ĐỘNG: mỗi shot một hàng n khung cách đều → build/prev/strip_<tên>.jpg ; python3 build/strip.py <tên> <n> <shot>…
import sys, json, os, subprocess
from PIL import Image, ImageDraw
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(EP)
name, n, ids = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
subprocess.run(['python3', 'build/mkjob.py'], check=True, capture_output=True)
T = {s['id']: s for s in json.load(open('build/timeline.json'))['shots']}
want = [(i, round(T[i]['start'] + T[i]['dur'] * (k + 0.5) / n, 2)) for i in ids for k in range(n)]
out = f'build/prev/_strip_{name}'; __import__('shutil').rmtree(out, ignore_errors=True); os.makedirs(out)
p = subprocess.run(['node', '../../../studio-template/engine/render.mjs', 'build/render_dev.json', out, '--stills', ','.join(str(w[1]) for w in want)], capture_output=True, text=True)
if p.returncode: print(p.stderr[-1500:]); sys.exit(1)
w, h = 2400 // n, int(2400 / n * 9 / 16); W = Image.new('RGB', (w * n, h * len(ids)), 'white'); d = ImageDraw.Draw(W)
for j, (i, tt) in enumerate(want):
    im = Image.open(f'{out}/t{tt:07.2f}.jpg').resize((w, h)); x, y = (j % n) * w, (j // n) * h; W.paste(im, (x, y))
    if j % n == 0: d.rectangle([x, y, x + 90, y + 14], fill='black'); d.text((x + 3, y + 1), i, fill='white')
W.save(f'build/prev/strip_{name}.jpg', quality=78); print(f'build/prev/strip_{name}.jpg')

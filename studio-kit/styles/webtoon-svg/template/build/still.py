# ảnh tĩnh: python3 build/still.py <tên ảnh ghép> shot:giây,giây shot2:… → build/prev/<tên>.jpg (lưới 2 cột, có nhãn)
import json, sys, subprocess, os
from PIL import Image, ImageDraw
name, args = sys.argv[1], sys.argv[2:]
tl = {s['id']: s for s in json.load(open('build/timeline.json'))['shots']}
want = []
for a in args:
    sid, offs = a.split(':') if ':' in a else (a, '')
    s = tl[sid]; offs = [float(x) for x in offs.split(',')] if offs else [0.5, round(s['dur'] / 2, 2), round(max(s['dur'] - 0.4, 0.6), 2)]
    want += [(sid, o, round(s['start'] + o, 2)) for o in offs]
out = os.environ.get('STILL_DIR', 'build/prev/_st'); os.makedirs(out, exist_ok=True)
subprocess.run(['node', os.path.abspath('../../../studio-template/engine/render.mjs'), os.environ.get('STILL_JSON', 'build/render_dev_main.json'), out, '--stills', ','.join(str(w[2]) for w in want)], check=True, capture_output=True)
ims = []
for sid, o, T in want: ims.append((Image.open(f'{out}/t{T:07.2f}.jpg').resize((800, 450)), f'{sid} +{o:g}s'))
W = Image.new('RGB', (1600, 450 * ((len(ims) + 1) // 2)), 'white'); d = ImageDraw.Draw(W)
for i, (im, lab) in enumerate(ims): x, y = (i % 2) * 800, (i // 2) * 450; W.paste(im, (x, y)); d.rectangle([x, y, x + 230, y + 24], fill='black'); d.text((x + 6, y + 5), lab, fill='white')
W.save(f'build/prev/{name}.jpg', quality=82); print(f'build/prev/{name}.jpg')

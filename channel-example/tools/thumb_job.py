#!/usr/bin/env python3
# Ảnh bìa bằng engine SVG cho tập dùng khuôn tb (sc_tq_*): python3 tools/thumb_job.py <thư mục tập> <thumb.js> <chữ cái…>
# Mỗi chữ cái X vẽ EPISODE_SCENES.s_thumb_x (khung 1920×1080) → branding/thumb_<id>_<X>.jpg (1280×720) + build/prev/thumb_xem.jpg (bản lớn + bản 320×180).
# Cần build/render_dev_main.json + build/scenes_dev_main.js đã ghép. Nạp thêm tools/thumb_kit.js trước thumb.js.
import json, sys, os, subprocess
from PIL import Image, ImageDraw
ep, tj, keys = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3:]
eid = os.path.basename(ep); root = os.path.dirname(os.path.dirname(ep)); kit = os.path.join(root, 'tools', 'thumb_kit.js')
j = json.load(open(os.path.join(ep, 'build', 'render_dev_main.json')))
outs = []
for k in keys:
    fn = 's_thumb_' + k.lower()
    jj = dict(j); jj['timeline'] = {'W': 1920, 'H': 1080, 'total': 1.0, 'silent': False, 'shots': [{'id': fn, 'start': 0, 'dur': 1.0, 'lines': [], 'chapter': None}]}
    jj['episode'] = {'title_box': None, 'hook': '', 'shots': [{'id': fn, 'template': 'custom', 'params': {'fn': fn}, 'dur': 1.0, 'lines': []}]}
    jj['scripts'] = j['scripts'] + [kit, os.path.join(ep, tj)]
    jp = os.path.join(ep, 'build', f'job_thumb_{k}.json'); json.dump(jj, open(jp, 'w'))
    od = os.path.join(ep, 'build', f'thumb_{k}')
    r = subprocess.run(['node', os.path.join(os.path.dirname(root), 'studio-template', 'engine', 'render.mjs'), jp, od, '--stills', '0.5'], capture_output=True, text=True)
    if r.returncode: print(r.stdout[-1500:], r.stderr[-1500:]); sys.exit(1)
    src = os.path.join(od, 't0000.50.jpg'); dst = os.path.join(root, 'branding', f'thumb_{eid}_{k.upper()}.jpg')
    Image.open(src).convert('RGB').resize((1280, 720), Image.LANCZOS).save(dst, quality=92); outs.append((k.upper(), dst)); print(dst)
# ảnh xem: mỗi hàng = bản 640×360 + bản 320×180 (cỡ trên điện thoại / trang chủ)
W = Image.new('RGB', (1000, 380 * len(outs)), 'white'); d = ImageDraw.Draw(W)
for i, (k, p) in enumerate(outs):
    im = Image.open(p); W.paste(im.resize((640, 360), Image.LANCZOS), (10, i * 380 + 10)); W.paste(im.resize((320, 180), Image.LANCZOS), (670, i * 380 + 10)); d.text((670, i * 380 + 200), f'{eid} {k}', fill='black')
os.makedirs(os.path.join(ep, 'build', 'prev'), exist_ok=True); W.save(os.path.join(ep, 'build', 'prev', 'thumb_xem.jpg'), quality=85); print(os.path.join(ep, 'build', 'prev', 'thumb_xem.jpg'))

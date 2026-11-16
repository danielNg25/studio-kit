"""Đặt chữ tiêu đề lên ảnh bìa đã có hình (vd ảnh Gemini đã bỏ chữ) — font Be Vietnam Pro Black, viền đậm, đổ bóng, nghiêng nhẹ.

  python3 studio-kit/tools/thumb_text.py <ảnh> <thư-mục-ra> --lines "SỰ SỤP ĐỔ CỦA" "JENSEN HUANG" "VÀ NVIDIA" \
      [--colors white yellow white] [--strip 0] [--x 110 --y 330 --maxw 1150] [--sizes 130 230 210] [--rot 3] [--erase 2632,1412]

Ra: <thư-mục-ra>/thumbnail_2k.png (cỡ gốc) + thumbnail_1280.jpg (1280×720 cho YouTube).
- Toạ độ theo pixel ảnh gốc. Chọn vùng tối/trống, tránh mặt nhân vật và góc dưới phải (khung thời lượng che).
- --strip i: dòng thứ i nằm trên băng giấy đỏ. --erase x,y: xoá dấu lấp lánh Gemini (chép mảng nền bên trái đè lên).
- Luật chữ ảnh bìa: 2–3 dòng, ≤ 5 từ mỗi khối, IN HOA, khớp tiêu đề; kiểm ở 320×180 (references/anh-bia.md).
Lần đầu dùng: tập Jensen (Hóng, 13/11/2026).
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '..', '..', 'studio-template', 'packs', 'style', 'cutout-v1', 'fonts', 'BeVietnamPro-Black.ttf')
COL = {'white': (255, 255, 255), 'yellow': (255, 214, 64), 'red': (232, 70, 58), 'green': (140, 220, 120), 'orange': (255, 160, 60)}
ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--lines', nargs='+', required=True); ap.add_argument('--colors', nargs='+'); ap.add_argument('--sizes', nargs='+', type=int)
ap.add_argument('--strip', type=int, default=-1); ap.add_argument('--x', type=int, default=110); ap.add_argument('--y', type=int, default=330)
ap.add_argument('--maxw', type=int, default=1150); ap.add_argument('--rot', type=float, default=3); ap.add_argument('--erase', action='append', default=[])
a = ap.parse_args()

im = Image.open(a.src).convert('RGB'); W, H = im.size
for e in a.erase:
    cx, cy = map(int, e.split(',')); r = 60
    patch = im.crop((cx - r - 150, cy - r, cx + r - 150, cy + r)); m = Image.new('L', (2 * r, 2 * r), 0)
    ImageDraw.Draw(m).ellipse((6, 6, 2 * r - 6, 2 * r - 6), 255); im.paste(patch, (cx - r, cy - r), m.filter(ImageFilter.GaussianBlur(8)))

def fit(txt, maxw, start):
    s = start
    while s > 40:
        f = ImageFont.truetype(FONT, s); bb = f.getbbox(txt)
        if bb[2] - bb[0] <= maxw: return f
        s -= 4
    return ImageFont.truetype(FONT, 40)

n = len(a.lines); sizes = a.sizes or ([130] + [220] * (n - 1) if n > 2 else [200] * n)
cols = [COL.get(c, (255, 255, 255)) for c in (a.colors or ['white'] + ['yellow'] + ['white'] * n)]
L = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(L); y = a.y
for i, txt in enumerate(a.lines):
    f = fit(txt, a.maxw, sizes[i]); bb = f.getbbox(txt); w, h = bb[2] - bb[0], bb[3] - bb[1]
    if i == a.strip: d.polygon([(a.x - 40, y - 28), (a.x + w + 50, y - 40), (a.x + w + 70, y + h + 34), (a.x - 30, y + h + 44)], fill=(200, 58, 48, 255))
    d.text((a.x - bb[0], y - bb[1]), txt, font=f, fill=cols[i] + (255,), stroke_width=16 if sizes[i] > 150 else 10, stroke_fill=(28, 22, 16, 255))
    y += h + (90 if i == a.strip else 60)
L = L.rotate(a.rot, resample=Image.BICUBIC, center=(a.x, a.y))
sh = Image.new('RGBA', (W, H), (10, 6, 2, 0)); sh.putalpha(L.split()[3].point(lambda v: int(v * 0.55)).filter(ImageFilter.GaussianBlur(10)))
base = im.convert('RGBA'); base.alpha_composite(sh, (18, 22)); base.alpha_composite(L); base = base.convert('RGB')
os.makedirs(a.out, exist_ok=True); base.save(os.path.join(a.out, 'thumbnail_2k.png'))
tw = 1280; th = round(H * tw / W); t = base.resize((tw, th), Image.LANCZOS)
if th != 720: t = t.resize((1280, 720), Image.LANCZOS)
t.save(os.path.join(a.out, 'thumbnail_1280.jpg'), quality=92)
print(os.path.join(a.out, 'thumbnail_1280.jpg'))

# ghép khung đã render của strip.py thành lưới to để nhìn rõ: python3 build/sheet.py <tên> [cột=5]
import sys, glob, os
from PIL import Image
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); n = sys.argv[1]; c = int(sys.argv[2]) if len(sys.argv) > 2 else 5
fs = sorted(glob.glob(f'{EP}/build/prev/_strip_{n}/t*.jpg')); w, h = 2000 // c, int(2000 / c * 9 / 16); r = -(-len(fs) // c)
W = Image.new('RGB', (w * c, h * r))
for i, f in enumerate(fs): W.paste(Image.open(f).resize((w, h)), ((i % c) * w, (i // c) * h))
W.save(f'{EP}/build/prev/sheet_{n}.jpg', quality=80); print(len(fs))

#!/usr/bin/env python3
"""CỔNG RIG — chặn lỗi "đầu lệch khỏi thân" và mọi khớp rối sai TRƯỚC khi dựng chương (cổng C2, và trước mọi bản gửi).

  python3 studio-kit/tools/rig_gate.py <thư mục dựng> [--hh 760] [--no-dump] [--quiet]
  (qa.py gọi lại lệnh này: `python3 studio-kit/tools/qa.py rig <thư mục dựng>`)

Việc nó làm:
  1. chạy tools/rig_dump.mjs → parts/rig.json: những con số khớp engine THẬT SỰ dùng (cùng engine/rig.js với trang dựng);
  2. dò lại ghim đồng trên từng mảnh PNG (engine/pins.py) và đo hình học bóng mảnh — không tin index.json;
  3. LỖI (thoát mã 1) khi: rối không ráp được · khớp nào lấy từ nguồn đoán (fallback/legacy/sil) · cổ không nằm giữa hai vai ·
     điểm xoay đầu nằm ngoài vùng cằm · các mặt của một rối không chung điểm xoay (đổi mặt đầu nhảy) · khớp lệch ghim thật · index.json cũ;
  4. ghi ảnh soát mắt qa/rig/<rối>.jpg (đầu ráp lên vai, cỡ lớn, mọi mặt + nghiêng ±10°, chữ thập ở cổ) và qa/rig_gate.json.
Người/agent dựng PHẢI mở ảnh qa/rig/*.jpg xem: cằm đè lên cổ áo, không hở cổ, không lệch trục, nghiêng đầu vẫn kín.

Lịch sử: 13/11/2026, tập Đài Loan – Trung Quốc — người dùng bác bản xem: "vẫn bị lỗi đầu lệch khỏi thân". Không cổng nào đo khớp; bộ dò ghim nhầm da nỉ
là ghim đồng (sót 11/12 ghim cằm), rig() lấy đốm da làm ghim cổ của Tưởng Giới Thạch (lệch 27 px màn hình). Xem
styles/comic-history/reference/analysis/06-khop-dau.md.
"""
import json, math, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.dirname(HERE); ROOT = os.path.dirname(KIT)
try:
    import numpy as np
    from PIL import Image, ImageDraw
    import scipy  # noqa: F401
except ImportError:                                            # python hệ thống không có numpy/scipy/Pillow → chạy lại bằng venv của thư viện
    vpy = os.path.join(ROOT, 'vendor', 'lemo-opuscar', '.venv', 'bin', 'python')
    if os.path.exists(vpy) and not os.environ.get('RIG_GATE_VENV'):      # (venv/bin/python là symlink tới cùng một file nhị phân → đánh dấu bằng biến môi trường)
        os.environ['RIG_GATE_VENV'] = '1'; os.execv(vpy, [vpy] + sys.argv)
    raise

TOL_CENTRE = 0.03      # |cổ.x − giữa hai vai| / bề rộng thân
TOL_SPREAD = 3.0       # px mảnh: độ tản điểm xoay giữa các mặt (đã chồng khít)
TOL_PIN = 6.0          # px mảnh: khớp lấy từ ghim so với ghim dò lại
TOL_CAST = 14.0        # px mảnh: khớp khai tay so với ghim thật gần đó (nếu có)
TOL_SCREEN = 1.5       # px màn hình ở --hh
OK_SRC = {'pin', 'cast', 'shared'}


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith('-'): print(__doc__); return 2
    B = os.path.abspath(args[0]); quiet = '--quiet' in args
    hh = float(args[args.index('--hh') + 1]) if '--hh' in args else 760.0
    eng = os.path.join(B, 'engine')
    sys.path.insert(0, eng if os.path.exists(os.path.join(eng, 'pins.py')) else os.path.join(KIT, 'styles', 'comic-history', 'engine'))
    from pins import find_pins
    errs, warns = [], []
    E = lambda rig, msg: errs.append(f'{rig}: {msg}')
    Wn = lambda rig, msg: warns.append(f'{rig}: {msg}')

    if '--no-dump' not in args:
        r = subprocess.run(['node', os.path.join(HERE, 'rig_dump.mjs'), B], capture_output=True, text=True)
        if r.returncode == 2: print(r.stderr.strip() or r.stdout.strip()); return 2
    rp = os.path.join(B, 'parts', 'rig.json')
    if not os.path.exists(rp): print('LỖI rig: không có parts/rig.json (rig_dump.mjs không chạy được — cần node)'); return 2
    RIG = json.load(open(rp, encoding='utf-8')); IDX = json.load(open(os.path.join(B, 'parts', 'index.json'), encoding='utf-8'))
    P = {q['name']: q for sh in IDX.values() for q in sh['parts']}
    cache = {}

    def img(n):
        if n not in cache:
            im = Image.open(os.path.join(B, 'parts', n + '.png')).convert('RGBA'); cache[n] = (im, find_pins(np.asarray(im)))
        return cache[n]

    def near(n, xy):
        pins = img(n)[1]
        if not pins: return None, None
        p = min(pins, key=lambda q: math.hypot(q[0] - xy[0], q[1] - xy[1])); return p, math.hypot(p[0] - xy[0], p[1] - xy[1])

    report = {}
    os.makedirs(os.path.join(B, 'qa', 'rig'), exist_ok=True)
    for name, R in RIG.items():
        if R.get('error'): E(name, f'không ráp được — {R["error"]}'); report[name] = {'error': R['error']}; continue
        s = hh / R['height']; rows = []; src = R['src']; T = P[R['torso']]; tw, th = T['bbox'][2], T['bbox'][3]

        def joint(label, part, used, source, tol_pin=TOL_PIN):
            p, d = near(part, used)
            row = {'khop': label, 'manh': part, 'dung': [round(used[0], 1), round(used[1], 1)], 'nguon': source,
                   'ghim': p[:2] if p else None, 'lech': None if d is None else round(d, 1), 'man_hinh': None if d is None else round(d * s, 2)}
            rows.append(row)
            if source not in OK_SRC:
                E(name, f'{label} ({part}) lấy từ nguồn ĐOÁN "{source}" — tấm thiếu ghim ở khớp này: soát ảnh qa/rig/{name}.jpg rồi khai tay trong chapters/cast.spec.js, hoặc tạo lại tấm có ghim'); return row
            if source == 'pin' and (d is None or d > tol_pin): E(name, f'{label} ({part}) lệch ghim thật {d if d is None else round(d, 1)} px mảnh')
            if source == 'cast' and d is not None and d < 60 and d > TOL_CAST: E(name, f'{label} ({part}) khai tay {row["dung"]} nhưng ghim thật ở {p[:2]} (lệch {d:.1f} px mảnh = {d * s:.1f} px màn hình)')
            return row

        # ---- index.json có còn khớp với ảnh mảnh không
        for n in R['parts']:
            a, b = len(P[n]['pins']), len(img(n)[1])
            if a != b: E(name, f'{n}: index.json ghi {a} ghim nhưng ảnh mảnh có {b} — chạy lại engine/extract.py')
        # ---- cổ
        joint('cổ', R['torso'], R['neck'], src['neck'], 4.0)
        arms = [R.get('armA'), R.get('armB')]
        if all(arms):
            mid = (arms[0]['anchor'][0] + arms[1]['anchor'][0]) / 2; off = (R['neck'][0] - mid) / tw
            rows.append({'khop': 'cổ so với giữa hai vai', 'lech': round(R['neck'][0] - mid, 1), 'ti_le': round(off, 4), 'man_hinh': round(abs(R['neck'][0] - mid) * s, 2)})
            if abs(off) > TOL_CENTRE: E(name, f'cổ lệch {R["neck"][0] - mid:+.1f} px mảnh ({off * 100:+.1f} % bề rộng thân = {abs(R["neck"][0] - mid) * s:.1f} px màn hình) so với giữa hai vai — ghim cổ sai')
            if abs(arms[0]['anchor'][1] - arms[1]['anchor'][1]) > 8: Wn(name, f'hai vai lệch cao {abs(arms[0]["anchor"][1] - arms[1]["anchor"][1]):.1f} px mảnh')
        if R['neck'][1] > th * 0.2: E(name, f'cổ ở y={R["neck"][1]:.0f} (> 20 % chiều cao thân) — không phải cổ áo')
        # ---- đầu
        regd = []
        for i, h in enumerate(R['heads']):
            q = P[h]; hw, hgt = q['bbox'][2], q['bbox'][3]; pv = R['headPivot'][i]; sil = q.get('sil')
            row = joint(f'đầu[{i}]', h, pv, src['head'][i], 6.0 if src['head'][i] == 'pin' else 1e9)
            if src['head'][i] == 'shared' and row['lech'] is not None and row['lech'] > 20: E(name, f'đầu[{i}] ({h}): điểm xoay chung cách ghim cằm của mặt này {row["lech"]} px mảnh (> 20) — mặt vẽ lệch khuôn, xem ảnh soát')
            if sil:
                below = sil['bottom'] - pv[1]; cx = sil['chin'][0] - 3 * IDX[R['sheet']].get('up', 2) / 2
                row.update({'duoi_cam': round(below, 1), 'lech_truc': round(pv[0] - cx, 1)})
                long_ok = (R.get('spec') or {}).get('longHair') and row['lech'] is not None and row['lech'] <= 6      # tóc dài phủ dưới cằm (cast khai longHair): đáy bóng mảnh là đuôi tóc → tin ghim đồng ở cằm (14/11/2026, rối Alice Huang)
                if long_ok: pass
                elif not (0.02 * hgt <= below <= 0.13 * hgt): E(name, f'đầu[{i}] ({h}): điểm xoay cách đáy cằm {below:.0f} px (ngoài 2–13 % chiều cao đầu) — không nằm ở cằm')
                if abs(pv[0] - cx) > 0.06 * hw: E(name, f'đầu[{i}] ({h}): điểm xoay lệch trục cằm {pv[0] - cx:+.1f} px mảnh (> 6 % bề rộng đầu)')
                if below + R.get('headDrop', 0) < 0.04 * hgt: Wn(name, f'đầu[{i}] ({h}): cằm chỉ đè cổ áo {below + R.get("headDrop", 0):.0f} px — dễ hở cổ')
            if len(img(h)[1]) > 1: Wn(name, f'{h}: {len(img(h)[1])} chấm vàng trên mặt (chỉ nên có 1 ghim cằm) — xem parts/{R["sheet"]}_debug.jpg')
            rg = q.get('reg'); regd.append([pv[0] + rg[0], pv[1] + rg[1]] if rg else None)
        if all(regd) and len(regd) > 1:
            a = np.array(regd); spread = float(np.hypot(*(a.max(0) - a.min(0))))
            rows.append({'khop': 'độ tản điểm xoay giữa các mặt', 'lech': round(spread, 1), 'man_hinh': round(spread * s, 2)})
            if spread > TOL_SPREAD: E(name, f'đổi mặt thì đầu nhảy {spread:.1f} px mảnh = {spread * s:.1f} px màn hình (các mặt không chung điểm xoay)')
        elif len(R['heads']) > 1: Wn(name, 'các mặt chưa được chồng khít (thiếu reg trong index.json) — không đo được đầu có nhảy khi đổi mặt')
        # ---- vai, khuỷu, cổ tay, hông, chân
        for side, L in zip('AB', arms):
            if not L: continue
            joint(f'vai {side}', R['torso'], L['anchor'], src['sh']); joint(f'bắp tay {side} (trên)', L['up'], L['upPin'], L['src'][0])
            if L.get('fo'): joint(f'khuỷu {side}', L['up'], L['elb'], L['src'][1]); joint(f'cẳng tay {side} (trên)', L['fo'], L['foPin'], L['src'][2])
        legs = [R.get('legA'), R.get('legB')]
        for side, G in zip('AB', legs):
            if not G: continue
            if all(legs): joint(f'hông {side}', R['torso'], G['anchor'], src['hip'])
            joint(f'chân {side} (trên)', G['n'], G['pin'], G['src'])
        if all(legs) and abs(legs[0]['anchor'][1] - legs[1]['anchor'][1]) > 8: Wn(name, f'hai hông lệch cao {abs(legs[0]["anchor"][1] - legs[1]["anchor"][1]):.1f} px mảnh')
        for r_ in rows:
            if r_.get('nguon') in OK_SRC and r_.get('man_hinh') is not None and r_['man_hinh'] > TOL_SCREEN and r_['khop'].startswith(('cổ', 'vai', 'hông', 'khuỷu', 'bắp', 'cẳng', 'chân')) and r_.get('nguon') == 'pin':
                E(name, f'{r_["khop"]}: lệch {r_["man_hinh"]} px màn hình ở rối cao {hh:.0f} px (> {TOL_SCREEN})')
        report[name] = {'cao': round(R['height'], 1), 's': round(s, 4), 'khop': rows}
        compose(B, name, R, P, img, s)
        if not quiet:
            print(f'\n== {name}: cao {R["height"]:.0f} px mảnh · tỉ lệ ở rối cao {hh:.0f} px = {s:.3f}')
            for r_ in rows: print('   %-30s %-10s %-16s %-10s ghim %-16s lệch %-6s màn hình %s' % (r_['khop'], r_.get('manh', ''), r_.get('dung', ''), r_.get('nguon', ''), r_.get('ghim', ''), r_.get('lech', ''), r_.get('man_hinh', '')))

    for w in warns: print('CẢNH BÁO rig — ' + w)
    for e in errs: print('LỖI rig — ' + e)
    ok = not errs
    json.dump({'ok': ok, 'hh': hh, 'when': time.strftime('%Y-%m-%d %H:%M:%S'), 'errors': errs, 'warnings': warns, 'rigs': report,
               'index_mtime': os.path.getmtime(os.path.join(B, 'parts', 'index.json')), 'cast_mtime': os.path.getmtime(os.path.join(B, 'chapters', 'cast.spec.js'))},
              open(os.path.join(B, 'qa', 'rig_gate.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'--- cổng rig: {len(RIG)} rối · {len(errs)} lỗi · {len(warns)} cảnh báo · ảnh soát mắt: qa/rig/*.jpg' + ('' if ok else ' · KHÔNG ĐẠT'))
    return 0 if ok else 1


def compose(B, name, R, P, img, s):
    """Ảnh soát: đầu ráp lên vai đúng như engine vẽ (thân trước, đầu sau, điểm xoay đầu đặt vào cổ + headDrop), cỡ 50 % px mảnh; chữ thập đỏ ở cổ."""
    torso = img(R['torso'])[0]; tw = torso.width; crop_h = int(torso.height * 0.42)
    tiles = [(i, 0) for i in range(len(R['heads']))] + [(0, -10), (0, 10)]
    hmax = max(P[h]['bbox'][3] for h in R['heads']); pad = 120
    Wt, Ht = tw + 2 * pad, hmax + crop_h + pad
    sheet = Image.new('RGB', (Wt * len(tiles) // 2, Ht // 2 + 34), (120, 112, 100)); d = ImageDraw.Draw(sheet)
    for k, (fi, ang) in enumerate(tiles):
        tile = Image.new('RGBA', (Wt, Ht), (233, 226, 208, 255))
        ox, oy = pad, hmax - int(R['neck'][1]) + pad // 2
        tile.alpha_composite(torso.crop((0, 0, tw, crop_h)), (ox, oy))
        head = img(R['heads'][fi])[0]; pv = R['headPivot'][fi]
        nx, ny = ox + R['neck'][0], oy + R['neck'][1] + R.get('headDrop', 0)
        if ang:
            big = Image.new('RGBA', (Wt, Ht), (0, 0, 0, 0)); big.alpha_composite(head, (int(round(nx - pv[0])), int(round(ny - pv[1]))))
            big = big.rotate(-ang, center=(nx, ny), resample=Image.BICUBIC); tile.alpha_composite(big)
        else: tile.alpha_composite(head, (int(round(nx - pv[0])), int(round(ny - pv[1]))))
        t = tile.convert('RGB').resize((Wt // 2, Ht // 2), Image.LANCZOS)
        sheet.paste(t, (k * (Wt // 2), 34)); cx, cy = k * (Wt // 2) + (ox + R['neck'][0]) / 2, 34 + (oy + R['neck'][1]) / 2
        d.line([cx - 22, cy, cx + 22, cy], fill=(255, 0, 0), width=2); d.line([cx, cy - 22, cx, cy + 22], fill=(255, 0, 0), width=2)
        d.text((k * (Wt // 2) + 8, 8), f'{name}  mat {fi}  ({R["src"]["head"][fi]})' + (f'  nghieng {ang:+d} do' if ang else ''), fill=(255, 255, 255))
    sheet.save(os.path.join(B, 'qa', 'rig', name + '.jpg'), quality=88)


if __name__ == '__main__':
    sys.exit(main())

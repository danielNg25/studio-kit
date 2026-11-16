#!/usr/bin/env python3
# Cắt Shorts của một tập theo episodes/<id>/build/shorts.json, bằng shorts_full.py (bố cục Shorts kênh đã duyệt).
#   cd <STUDIO>/channel-example && python3 tools/shorts_cut.py <id> [số clip, vd 1,3] [--video <mp4>] [--check]
# Ra: out/shorts_<id>/<NN>_<slug>.mp4 — trang web (bước Shorts) tự thấy file + tiêu đề trong shorts_post.md.
# shorts.json: {"video": "out/<id>_bio-long.mp4", "top": "DÒNG VÀNG {i}/{n}", "segs": [{"slug","t0","t1","title"}]}
#   title: "|" = xuống dòng. Cỡ chữ tự co cho vừa khung 1080 (đo bằng đúng font Be Vietnam Pro Black).
import json, os, subprocess, sys, time
from PIL import ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.normpath(os.path.join(ROOT, '..', 'studio-template', 'packs', 'style', 'chibi-v1', 'fonts', 'BeVietnamPro-Black.ttf'))
MAXW = 980


def fit(lines, start):
    fs = start
    while fs > 70 and max(ImageFont.truetype(FONT, fs).getlength(l) for l in lines) * 1.0 > MAXW: fs -= 4
    return fs


def main():
    a = [x for x in sys.argv[1:]]
    if not a: sys.exit(__doc__ or 'cần <id>')
    eid = a.pop(0); check = '--check' in a; a = [x for x in a if x != '--check']
    vid = None
    if '--video' in a: i = a.index('--video'); vid = a[i + 1]; del a[i:i + 2]
    only = {int(x) for x in a[0].split(',')} if a else None
    ed = os.path.join(ROOT, 'episodes', eid)
    cfg = json.load(open(os.path.join(ed, 'build', 'shorts.json'), encoding='utf-8'))
    vid = os.path.abspath(vid or os.path.join(ROOT, cfg.get('video') or f'out/{eid}_bio-long.mp4'))
    tl = os.path.join(ed, 'build', 'timeline.json')
    out = os.path.join(ROOT, 'out', f'shorts_{eid}'); os.makedirs(out, exist_ok=True)
    segs = cfg['segs']; n = len(segs)
    if not check and not os.path.exists(vid):
        sys.exit(f'Không thấy video gốc: {vid}\nKhôi phục từ Thùng rác (chuột phải → Đưa trở lại) hoặc chạy lại với --video <đường dẫn mp4>.')
    for i, s in enumerate(segs, 1):
        if only and i not in only: continue
        lines = s['title'].split('|'); top = cfg['top'].format(i=i, n=n)
        env = dict(os.environ)
        if len(lines) == 1:
            env['TITF'] = str(fit(lines, 136))
        else:
            fs = fit(lines, 124 if len(lines) == 2 else 100); env['TITF2'] = str(fs)
            if len(lines) == 3: env['TOPY2'], env['TITY2'] = '190', '380'
        tf = fit([top], 74); env['TOPF'] = str(tf)
        dst = os.path.join(out, f"{i:02d}_{s['slug']}.mp4")
        print(f"{i:2d}/{n} {s['t0']:7.1f}–{s['t1']:7.1f} ({s['t1'] - s['t0']:5.1f} s)  {s['title']}  [chữ {env.get('TITF2') or env.get('TITF')}, dòng vàng {tf}]")
        if check: continue
        t = time.time()
        subprocess.run([sys.executable, os.path.join(ROOT, 'shorts_full.py'), vid, tl, str(s['t0']), str(s['t1']), dst, s['title'], top], check=True, env=env)
        ass = dst + '.ass'
        if os.path.exists(ass):   # file phụ đề tạm: cất vào _to_delete thay vì để cạnh mp4
            bd = os.path.join(ROOT, '_to_delete', 'shorts_ass', eid); os.makedirs(bd, exist_ok=True); os.replace(ass, os.path.join(bd, os.path.basename(ass)))
        print(f'   xong sau {time.time() - t:.0f} s')
    print('Xem trên trang web: bước Shorts của tập', eid)


if __name__ == '__main__':
    main()

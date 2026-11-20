# Sinh build/render_dev.json (cả tập, đường dẫn máy này) + sc_tq_y_ids.js (danh sách shot để điền cảnh tạm cho shot chưa dựng) rồi ghép scenes.
# python3 build/mkjob.py            → build/render_dev.json
# python3 build/mkjob.py st <tên> <shot[:giây,giây]> …   → build/prev/<tên>.jpg (lưới ảnh tĩnh 2 cột)
# python3 build/mkjob.py clip <shotĐầu> <shotCuối> <tên>  → build/prev/<tên>.mp4 (không tiếng)
import json, os, sys, subprocess, yaml
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.abspath(os.path.join(EP, '..', '..', '..')); os.chdir(EP)
ep = yaml.safe_load(open('episode.yaml', encoding='utf-8')); tl = json.load(open('build/timeline.json')); base = json.load(open('build/render_base.json'))
open('sc_tq_y_ids.js', 'w').write('const TQ_IDS = ' + json.dumps([s['id'] for s in ep['shots']]) + ';\nfor (const id of TQ_IDS) if (!EPISODE_SCENES["s_" + id]) EPISODE_SCENES["s_" + id] = (t, ctx) => thFin(tqPanelBg(t, "#202430") + kText("CHƯA DỰNG: " + id, 960, 560, 70, { c: "#fff" }));\n')
subprocess.run(['sh', 'mkscenes.sh', 'dev', 'main'], check=True, capture_output=True)
fix = lambda s: s.replace('/home/claude/studio', R)
r = dict(base); r['scripts'] = [fix(s) for s in base['scripts'] if 'scenes_dev' not in s] + [EP + '/build/scenes_dev_main.js']; tl['W'], tl['H'] = 1920, 1080; r['timeline'] = tl
r['episode'] = {'title_box': None, 'hook': '', 'shots': ep['shots']}; r['layout'] = dict(base['layout']); r['layout']['subtitles'] = None
open('build/render_dev.json', 'w').write(json.dumps(r, ensure_ascii=False).replace('/home/claude/studio', R))  # font/preload cũng phải trỏ về máy này
import shutil; shutil.copy('build/render_dev.json', 'build/render_dev_main.json')
T = {s['id']: s for s in tl['shots']}; RM = R + '/studio-template/engine/render.mjs'
if len(sys.argv) > 1 and sys.argv[1] == 'st':
    from PIL import Image, ImageDraw
    name, want = sys.argv[2], []
    for a in sys.argv[3:]:
        sid, offs = a.split(':') if ':' in a else (a, ''); s = T[sid]
        offs = [float(x) for x in offs.split(',')] if offs else [round(s['dur'] * f, 2) for f in (0.12, 0.4, 0.68, 0.94)]
        want += [(sid, o, round(s['start'] + o, 2)) for o in offs]
    out = f'build/prev/_st_{name}'; os.makedirs(out, exist_ok=True)
    p = subprocess.run(['node', RM, 'build/render_dev.json', out, '--stills', ','.join(str(w[2]) for w in want)], capture_output=True, text=True)
    if p.returncode: print(p.stdout[-1500:], p.stderr[-2500:]); sys.exit(1)
    W = Image.new('RGB', (1600, 450 * ((len(want) + 1) // 2)), 'white'); d = ImageDraw.Draw(W)
    for i, (sid, o, tt) in enumerate(want):
        im = Image.open(f'{out}/t{tt:07.2f}.jpg').resize((800, 450)); x, y = (i % 2) * 800, (i // 2) * 450; W.paste(im, (x, y)); d.rectangle([x, y, x + 200, y + 22], fill='black'); d.text((x + 5, y + 5), f'{sid} +{o:g}s', fill='white')
    W.save(f'build/prev/{name}.jpg', quality=80); print(f'build/prev/{name}.jpg')
elif len(sys.argv) > 1 and sys.argv[1] == 'clip':
    a, b, name = T[sys.argv[2]], T[sys.argv[3]], sys.argv[4]; f0, f1 = int(a['start'] * 30), int((b['start'] + b['dur']) * 30)
    subprocess.run(['node', RM, 'build/render_dev.json', f'build/prev/{name}.mp4', '--frames', f'{f0}:{f1}'], check=True)
else:
    print('ok', len(ep['shots']), 'shot', tl['total'])

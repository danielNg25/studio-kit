# Một cảnh tự do (bảng nhân vật, ảnh thử): python3 build/job.py <fn> <giây> <t1,t2,…> [tên]  → build/prev/<tên|fn>_tXX.jpg ; cảnh <fn> phải có trong EPISODE_SCENES (sc_tq_*.js)
import json, sys, subprocess, os, shutil
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(EP)
fn, dur, ts = sys.argv[1], float(sys.argv[2]), sys.argv[3]; name = sys.argv[4] if len(sys.argv) > 4 else fn
subprocess.run(['python3', 'build/mkjob.py'], check=True, capture_output=True)
r = json.load(open('build/render_dev_main.json'))
r['timeline'] = {'W': 1920, 'H': 1080, 'total': dur, 'silent': True, 'shots': [{'id': 'job', 'start': 0, 'dur': dur, 'lines': []}]}
r['episode'] = {'title_box': None, 'hook': '', 'shots': [{'id': 'job', 'template': 'custom', 'params': {'fn': fn, 'bg': ''}, 'lines': []}]}
json.dump(r, open(f'build/job_{fn}.json', 'w'), ensure_ascii=False)
out = f'build/prev/_job_{fn}'; os.makedirs(out, exist_ok=True)
p = subprocess.run(['node', '../../../studio-template/engine/render.mjs', f'build/job_{fn}.json', out, '--stills', ts], capture_output=True, text=True)
if p.returncode: print(p.stdout[-800:], p.stderr[-2500:]); sys.exit(1)
for t in ts.split(','):
    src = f'{out}/t{float(t):07.2f}.jpg'; dst = f'build/prev/{name}_t{t}.jpg'; shutil.copy(src, dst); print(dst)

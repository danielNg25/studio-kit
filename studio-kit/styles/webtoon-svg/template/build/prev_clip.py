# Clip xem thử một đoạn (chưa có giọng: mốc ước lượng, phụ đề tạm in sẵn): python3 build/prev_clip.py <shot đầu> <shot cuối> <tên> [-j N]
# → build/prev/<tên>.mp4 (720p). Khúc 300 khung render song song trong build/prev/_clip_<tên>/.
import json, os, sys, subprocess, threading
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(EP)
a, b, name = sys.argv[1:4]; nj = int(sys.argv[5]) if len(sys.argv) > 5 else 5
subprocess.run(['python3', 'build/mkjob.py'], check=True, capture_output=True)
r = json.load(open('build/render_dev_main.json')); base = json.load(open('build/render_base.json'))
json.dump(r, open('build/render_prev.json', 'w'), ensure_ascii=False)
T = {s['id']: s for s in r['timeline']['shots']}; f0, f1 = int(T[a]['start'] * 30), int((T[b]['start'] + T[b]['dur']) * 30)
out = f'build/prev/_clip_{name}'; os.makedirs(out, exist_ok=True); jobs = [(x, min(x + 300, f1)) for x in range(f0, f1, 300)]; q = list(jobs); lock = threading.Lock(); bad = []
def w():
    while True:
        with lock:
            if not q: return
            j = q.pop(0)
        if os.path.exists(f'{out}/c{j[0]:06d}.ok'): continue   # chạy lại thì bỏ qua khúc đã xong (muốn render lại: dời thư mục _clip_<tên> đi)
        p = subprocess.run(['node', '../../../studio-template/engine/render.mjs', 'build/render_prev.json', f'{out}/c{j[0]:06d}.mp4', '--frames', f'{j[0]}:{j[1]}'], capture_output=True, text=True)
        if p.returncode: bad.append((j, p.stderr[-600:]))
        else: open(f'{out}/c{j[0]:06d}.ok', 'w').write('ok')
th = [threading.Thread(target=w) for _ in range(nj)]; [t.start() for t in th]; [t.join() for t in th]
if bad: print(bad); sys.exit(1)
def ts(x): x = max(0, x); return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(x*1000%1000):03d}"
n = 0; srt = ''
for sh in r['timeline']['shots']:
    for l in sh['lines']:
        for se in l['sents']:
            st, en = se['start'] - f0 / 30, se['start'] + se['dur'] - f0 / 30
            if en < 0 or st > (f1 - f0) / 30: continue
            parts = [x.strip() for x in se['text'].replace(':', ',').split(',') if x.strip()]; tot = sum(len(x) for x in parts); t = st
            for x in parts: d = (en - st) * len(x) / tot; n += 1; srt += f"{n}\n{ts(t)} --> {ts(t + d)}\n{x}\n\n"; t += d
open(f'{out}/sub.srt', 'w', encoding='utf-8').write(srt)
open(f'{out}/list.txt', 'w').write(''.join(f"file 'c{j[0]:06d}.mp4'\n" for j in jobs))
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{out}/list.txt', '-vf', f"scale=-2:720,subtitles={out}/sub.srt:force_style='FontSize=15,Outline=1.2,MarginV=14'", '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast', '-an', '-movflags', '+faststart', f'build/prev/{name}.mp4'], check=True)
print(f'build/prev/{name}.mp4', (f1 - f0) / 30, 's')

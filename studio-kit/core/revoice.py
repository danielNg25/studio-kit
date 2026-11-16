"""Ghép lại giọng từng chương từ các câu đã thu (voice/clips, không gọi VBee) theo nhịp nghỉ kênh mẫu, và ghi mốc câu.

  cd <thư mục dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/revoice.py [--ep <thư mục tập>] [--gap 0.65 --pad 0.7 --pad-ch 1.0]
  → <thư mục dựng>/audio/chNN.m4a + data/timeline.json. Thư mục tập mặc định = hai cấp trên thư mục dựng (episodes/<id>/build/<style>);
  cần <tập>/script.md và <tập>/voice/{voice.json,clips/}. Không đụng <tập>/audio (bản Remotion/khác).

Nhịp (người dùng 13/11 "học kênh mẫu, nhanh quá"; luật Kênh Mẫu 20/10): giữa câu 0,65 s · giữa đoạn (nhịp) 0,7 s · cuối chương 1,0 s
(giữa hai chương còn LEAD 1,0 + TAIL 1,4 s của trang). Bản cloud cũ: 0,32 / 0,5 / 0,7.
Câu tục ngữ mở đầu đọc chậm 0,9 (khoá "tempo" trong voice.json, so khớp không phân biệt hoa thường — trước đây "dù cho…" không khớp "Dù cho…").
[BEEP] = 0,3 lặng + 0,42 bíp + 0,35 lặng (voice_ep.py: 0,08/0,12) — câu tục ngữ có chỗ thở (người dùng 13/11).
"""
import hashlib, json, math, os, re, subprocess
import numpy as np

import argparse
ap = argparse.ArgumentParser(); ap.add_argument('--ep'); ap.add_argument('--gap', type=float, default=0.65); ap.add_argument('--pad', type=float, default=0.7); ap.add_argument('--pad-ch', type=float, default=1.0)
_a = ap.parse_args()
HERE = os.getcwd()                                                    # thư mục dựng của tập
EP = os.path.abspath(_a.ep or os.path.join(HERE, '..', '..'))
VD = os.path.join(EP, 'voice'); CL = os.path.join(VD, 'clips')
cfg = json.load(open(os.path.join(VD, 'voice.json')))
VOICE, SPEED = cfg['voice'], cfg.get('speed', 1.0)
GAP, PAD_END, PAD_CH, FPS, SR = _a.gap, _a.pad, _a.pad_ch, 30, 24000
PRON, TEMPO = cfg.get('pronounce', {}), {k.lower(): v for k, v in cfg.get('tempo', {}).items()}

raw = open(os.path.join(EP, 'script.md'), encoding='utf-8').read().split('\n---\n')[1].split('## Dữ kiện')[0].split('## Ghi chú')[0]
paras = []; ch = -1; k = 0
for l in raw.split('\n'):
    if l.startswith('## '): ch += 1; k = 0; continue
    if ch < 0 or not l.strip() or l.startswith('>') or l[0] in '#-': continue
    k += 1; paras.append((f'c{ch:02d}_{k}', ch, l.strip()))

def spoken(t):
    for a, b in PRON.items(): t = t.replace(a, b)
    return t.strip()
def sentences(p): return [s for s in re.split(r'(?<=[.?!])\s+', p) if s.strip()]
def parts(s):
    if '[BEEP]' not in s: return [('say', s)]
    out = []; segs = s.split('[BEEP]')
    for i, x in enumerate(segs):
        if x.strip(): out.append(('say', x.strip()))
        if i < len(segs) - 1: out.append(('beep', None))
    return out
def key(t): return hashlib.md5((VOICE + '|' + str(SPEED) + '|' + spoken(t)).encode()).hexdigest()[:16]
def tempo_of(t): return next((v for kk, v in TEMPO.items() if kk in t.lower()), 1.0)
def pcm(t):
    tp = tempo_of(t)
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(CL, key(t) + '.mp3'), '-af',
                          (f'atempo={tp},' if tp != 1.0 else '') + 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
                          '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(out, np.int16).astype(np.float32) / 32768
sil = lambda s: np.zeros(int(round(s * SR)), np.float32)
def beep(sec=0.42):
    n = int(sec * SR); i = np.arange(n); return (0.3 * np.sin(2 * np.pi * 1000 * i / SR) * np.minimum(1, np.minimum(i / 200, (n - i) / 200))).astype(np.float32)

res, bufs = {}, {}
for idx, (bid, c, p) in enumerate(paras):
    R = res.setdefault(c, {'dur': 0.0, 'beats': [], 'sents': []}); B = bufs.setdefault(c, [])
    off = R['dur']; buf = []
    for si, s in enumerate(sentences(p)):
        if si: buf.append(sil(GAP))
        t0 = sum(len(b) for b in buf) / SR
        marks = {}
        for kind, x in parts(s):
            if kind == 'beep': marks['l**'] = round(off + sum(len(q) for q in buf) / SR + 0.3, 3)
            buf += [sil(0.3), beep(), sil(0.35)] if kind == 'beep' else [pcm(x)]
        t1 = sum(len(b) for b in buf) / SR
        R['sents'].append({'text': s.replace('[BEEP]', 'l**'), 't0': round(off + t0, 3), 't1': round(off + t1, 3), 'beat': bid, **({'marks': marks} if marks else {})})
    talk = sum(len(b) for b in buf) / SR
    last = idx == len(paras) - 1 or paras[idx + 1][1] != c
    total = math.ceil((talk + (PAD_CH if last else PAD_END)) * FPS) / FPS
    n = int(round(total * SR)); seg = np.concatenate(buf); seg = np.pad(seg, (0, max(0, n - len(seg))))[:n]; B.append(seg)
    R['beats'].append({'id': bid, 't0': round(off, 3), 't1': round(off + total, 3), 'talk': round(off + talk, 3)})
    R['dur'] = round(off + total, 3)

os.makedirs(os.path.join(HERE, 'audio'), exist_ok=True); os.makedirs(os.path.join(HERE, 'data'), exist_ok=True)
old = os.path.join(HERE, 'data', 'timeline.json'); bak = os.path.join(HERE, 'data', 'timeline.cloud-v1.json')
if os.path.exists(old) and not os.path.exists(bak): os.rename(old, bak)        # giữ bản mốc theo giọng cloud cũ
json.dump(res, open(old, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
tot = 0
for c, segs in bufs.items():
    x = np.concatenate(segs); pcm16 = (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '160k',
                    os.path.join(HERE, 'audio', f'ch{c:02d}.m4a')], input=pcm16, check=True)
    tot += res[c]['dur']; print(f'ch{c:02d}: {len(res[c]["sents"]):2d} câu · {res[c]["dur"]:7.2f} s')
print(f'tổng giọng {tot / 60:.2f} phút')

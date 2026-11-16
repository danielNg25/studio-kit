"""Trộn tiếng một chương: giọng thật audio/chNN.m4a (đặt tại LEAD) + tiếng động giấy tổng hợp theo out/chNN.json.

  cd <thư mục dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/mix.py NN  → out/chNN_mix.wav (48 kHz stereo). Nhạc nền thêm ở core/assemble.py.
  Mặc định CHỈ giọng (người dùng 13/11: bỏ tiếng động); SFX=1 bật lại tiếng động giấy theo out/chNN.json.
Tiếng động theo STYLE.md §7 (dán giấy, kéo, xé, dấu, bước xylophone…) + tiếng đời thường của từng cảnh (bát đĩa, cọ, cửa, chuông…).
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

HERE = os.getcwd()                                                    # thư mục dựng của tập
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))   # shorts-claude/
LIB = os.environ.get('LIB', os.path.join(ROOT, 'vendor', 'lemo-opuscar'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, thump, whoosh, pop, creak, compress, limit   # noqa: E402

CH = sys.argv[1]
D = json.load(open(os.path.join(HERE, 'out', f'ch{CH}.json')))
DUR, LEAD = D['dur'], D['lead']
N = int(DUR * SR) + SR
L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
rng = np.random.default_rng(int(CH) + 11)


def put(x, at, gain=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x)[:max(0, N - i)] * gain
    if i < 0 or not len(x): return
    L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))


def mixn(*parts):
    n = max(len(p) for p, _ in parts); o = np.zeros(n)
    for p, g in parts: o[:len(p)] += p * g
    return o


def slap(size=1.0):
    return norm(mixn((hp(noise(.03), 2600) * env_exp(.03, .0025), .9), (bp(noise(.12), 350, 2600) * env_exp(.12, .028), .8), (thump(v=1.0, f=72), .35 + .5 * min(1.5, size)))) * (.35 + .45 * min(1.5, size))
def snip():
    o = np.zeros(int(.22 * SR))
    for k, at in enumerate((0, .07)): c = hp(noise(.012), 3500) * env_exp(.012, .0012); i = int(at * SR); o[i:i + len(c)] += c * (1 if k else .8)
    tt = t_(.2); ring = (np.sin(2 * np.pi * 5200 * tt) * .25 + np.sin(2 * np.pi * 7400 * tt) * .15) * env_exp(.2, .04); o[int(.07 * SR):int(.07 * SR) + len(ring)] += ring[:len(o) - int(.07 * SR)]
    return norm(o) * .5
def tear(size=1.0):
    d = .38 * size + .1; x = bp(noise(d), 900, 6500); g = np.convolve((rng.random(len(x)) < 0.012).astype(float), np.ones(160) / 160, 'same')
    return norm(x * (0.35 + g * 30) * np.minimum(1, t_(d) / .03) * np.exp(-t_(d) / (d * .7))) * .55 * size
def stamp(size=1.0): return norm(mixn((bp(noise(.05), 600, 2200) * env_exp(.05, .008), 1), (thump(v=1.0, f=60), .9))) * .7 * size
XYL = [523.25, 587.33, 659.25, 783.99, 880.0]
def xylo(i, v=.3):
    f = XYL[i % 5]; d = .35; tt = t_(d); return norm(np.sin(2 * np.pi * f * tt) * env_exp(d, .09) + .35 * np.sin(2 * np.pi * f * 3.93 * tt) * env_exp(d, .025)) * v
def bell(f=1046.5, v=.3, d=1.4):
    tt = t_(d); return norm(sum(a * np.sin(2 * np.pi * f * m * tt) * env_exp(d, d / (3 + m)) for m, a in [(1, 1), (2.01, .5), (3.02, .3), (4.1, .15)])) * v
def rustle(d, v=.06):
    x = bp(noise(d), 1200, 7000); return x * np.clip(0.3 + 0.7 * np.abs(np.sin(t_(d) * 9.0 + rng.random())), 0, 1) * v
def step(v=.4): return norm(mixn((lp(noise(.06), 900) * env_exp(.06, .012), 1), (thump(v=1, f=110), .4))) * .25 * v
def clink(n=5):
    o = np.zeros(int(.9 * SR))
    for k in range(n):
        f = 2400 + rng.random() * 2600; d = .25; tt = t_(d); c = np.sin(2 * np.pi * f * tt) * env_exp(d, .05) + .4 * np.sin(2 * np.pi * f * 2.7 * tt) * env_exp(d, .02)
        i = int(k * .13 * SR + rng.random() * 800); o[i:i + len(c)] += c[:len(o) - i]
    return norm(o) * .35
def scrub(d):
    x = bp(noise(d), 800, 4000); am = (np.sin(t_(d) * 2 * np.pi * 4.5) > 0).astype(float); am = np.convolve(am, np.ones(400) / 400, 'same'); return x * am * .08
def pen(): d = .45; return bp(noise(d), 2000, 6000) * np.sin(np.pi * t_(d) / d) * .07
def drum(d):
    o = np.zeros(int(d * SR) + SR)
    for k in range(int(d / .28)): x = thump(v=1, f=55 + rng.random() * 10); i = int(k * .28 * SR); o[i:i + len(x)] += x * (.5 + .5 * rng.random())
    return norm(o) * .45
def tremolo(d):
    tt = t_(d); return np.sin(2 * np.pi * 880 * tt) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * tt)) * np.minimum(1, np.minimum(tt / .4, (d - tt) / .4)) * .022


SFX = os.environ.get('SFX') == '1'                              # Người dùng 13/11: bỏ tiếng động (nghe không hay) — bật lại bằng SFX=1
hops = 0
for e in (D['ev'] if SFX else []):
    t, ty, sz = e['t'], e['type'], e.get('size', 1.0); pan = float(np.clip((rng.random() - .5) * .4, -.3, .3)); dur = e.get('dur', 1.0)
    if ty == 'slap': put(slap(sz), t, .9, pan)
    elif ty == 'scissors':
        k = 0
        while k * .28 < dur: put(snip(), t + k * .28, .8, pan); k += 1
    elif ty == 'tear': put(tear(sz), t, .9, pan)
    elif ty == 'stamp': put(stamp(sz), t, 1.0)
    elif ty == 'hop': put(xylo(hops, .22), t, 1.0, pan); put(slap(.18), t + .32, .5, pan); hops += 1
    elif ty in ('whoosh', 'whip'): put(whoosh(.4, v=.5), t - .1, .8, pan)
    elif ty == 'pop': put(pop(v=.4), t, .7, pan)
    elif ty in ('paper', 'cash'): put(rustle(dur), t, 1.0, .1)
    elif ty == 'page': put(rustle(.9, .09), t, 1.0, -.2); put(whoosh(.7, v=.3), t + .1, .7, -.2)
    elif ty == 'flip': put(rustle(.25, .12), t, 1.0, pan); put(slap(.15), t + .2, .5, pan)
    elif ty == 'lift': put(rustle(.5), t, 1.5, pan); put(whoosh(.6, v=.25), t + .1, .7, pan)
    elif ty == 'hush': put(tremolo(dur), t, 1.0)
    elif ty == 'step': put(step(sz), t, 1.0, pan)
    elif ty == 'dishes': put(clink(6), t, .8, pan)
    elif ty == 'scrub': put(scrub(dur), t, 1.0, pan)
    elif ty == 'pen': put(pen(), t, 1.0, pan)
    elif ty == 'chime': put(bell(1046.5, .22), t, 1.0, pan)
    elif ty == 'ding': put(bell(1568, .2, 1.0), t, 1.0, pan)
    elif ty == 'spot': put(thump(v=.8, f=50), t, .8); put(bell(220, .05, 1.5), t, 1.0)
    elif ty == 'door': put(creak(v=.4), t - .5, .6, pan); put(thump(v=.8, f=80), t, .8, pan)
    elif ty == 'creak': put(creak(v=.4), t, .6, pan)
    elif ty == 'drum': put(drum(dur), t, .8)

if SFX: room = lp(noise(N / SR), 900) * .0035; L += room[:N]; R += room[:N]
voice = os.path.join(HERE, 'audio', f'ch{CH}.m4a')                      # giọng ghép lại theo nhịp Kênh Mẫu (tools/revoice.py)
vo = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', voice, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
i = int(LEAD * SR); vo = vo[:N - i]
envv = np.convolve(np.abs(vo), np.ones(int(.12 * SR)) / int(.12 * SR), 'same')
duck = np.ones(N, np.float32); duck[i:i + len(vo)] = 1 - 0.3 * np.clip(envv / (envv.max() * .25 + 1e-9), 0, 1)
L *= duck; R *= duck; L[i:i + len(vo)] += vo; R[i:i + len(vo)] += vo
n = int(round(DUR * 30)) * SR // 30                             # đúng số khung × 1/30 s để ghép chương không lệch
mix = np.stack([L, R], 1)[:n]
mix = np.stack([limit(compress(mix[:, 0], thr=.5, ratio=2.0), .95), limit(compress(mix[:, 1], thr=.5, ratio=2.0), .95)], 1)
sf.write(os.path.join(HERE, 'out', f'ch{CH}_mix.wav'), mix.astype(np.float32), SR, subtype='FLOAT')
print(f'out/ch{CH}_mix.wav {len(mix) / SR:.2f} s · {len(D["ev"])} sự kiện')

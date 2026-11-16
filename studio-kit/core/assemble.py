"""Ghép các chương thành một video + nhạc nền thư viện kênh + phụ đề .srt (không in cứng — người dùng 13/11).

  cd <thư mục dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/assemble.py 00 01 02 --name xem-3-chuong
  Nhạc theo chương: <thư mục dựng>/music.json {"00": "The Thought of You - TrackTribe.mp3", "10": "Vespers on the Shore - Mini Vandals.mp3", "12": "…"}
  (tên file trong thư viện nhạc channel-example/music/; không có music.json → một bài "The Thought of You" cả tập).
     → out/<name>.mp4 (1080p30, −16 LUFS) + out/<name>.vi.srt

Nhạc: "The Thought of You" — TrackTribe (thư viện kênh, cần ghi credit), −28 dB so với file gốc, nâng +3 dB trong khoảng lặng
giọng ≥ 0,8 s (như build.py của kênh mẫu), vào 2 s, ra 3 s.
"""
import argparse, json, os, subprocess
import numpy as np
import soundfile as sf

HERE = os.getcwd()                                                    # thư mục dựng của tập
OUT = os.path.join(HERE, 'out')
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))   # shorts-claude/
MDIR = os.path.join(ROOT, 'channel-example', 'music')                 # thư viện nhạc chung (library.yaml ghi nghĩa từng bài)
MUSIC = os.path.join(MDIR, 'The Thought of You - TrackTribe.mp3')
SR = 48000
ap = argparse.ArgumentParser(); ap.add_argument('chs', nargs='+'); ap.add_argument('--name', default='full'); ap.add_argument('--music-db', type=float, default=-28)
a = ap.parse_args()

# 1. hình: nối video từng chương (cùng mã hoá → copy)
lst = os.path.join(OUT, f'{a.name}.txt')
open(lst, 'w').write(''.join(f"file '{os.path.join(OUT, f'ch{c}_video.mp4')}'\n" for c in a.chs))
vid = os.path.join(OUT, f'{a.name}_video.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', vid], check=True)

# 2. tiếng: nối mix từng chương, mốc bắt đầu từng chương (cho phụ đề)
mixes, offs, voice_on, t = [], [], [], 0.0
for c in a.chs:
    m, sr = sf.read(os.path.join(OUT, f'ch{c}_mix.wav'), dtype='float32'); assert sr == SR
    D = json.load(open(os.path.join(OUT, f'ch{c}.json'))); offs.append((c, t, D)); mixes.append(m); t += len(m) / SR
full = np.concatenate(mixes)

# 3. nhạc nền theo chương (đoạn bê bối ch10–11 dùng bài u ám), chuyển bài bằng giao nhau 2 s; lặp cho đủ, −28 dB, nâng nhẹ trong khoảng lặng
_mj = os.path.join(HERE, 'music.json')
CUES = {k: os.path.join(MDIR, v) for k, v in json.load(open(_mj)).items()} if os.path.exists(_mj) else {'00': MUSIC}
def track(path, n):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-stream_loop', '-1', '-i', path, '-t', f'{n / SR:.3f}', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()[:n]; return np.pad(x, ((0, n - len(x)), (0, 0)))
segs, cur = [], None                                         # [(bài, mẫu bắt đầu, mẫu kết thúc)]
for c, o, _ in offs:
    pth = CUES.get(c, cur if cur else MUSIC)
    if pth != cur: segs.append([pth, int(o * SR), None]); cur = pth
for i, s in enumerate(segs): s[2] = segs[i + 1][1] if i + 1 < len(segs) else len(full)
mus, X = np.zeros_like(full), int(1.0 * SR)
for i, (pth, a0, a1) in enumerate(segs):
    s0, s1 = max(0, a0 - (X if i else 0)), min(len(full), a1 + (X if i + 1 < len(segs) else 0)); m = track(pth, s1 - s0); env = np.ones(s1 - s0, np.float32)
    if i: env[:2 * X] = np.linspace(0, 1, 2 * X)
    if i + 1 < len(segs): env[-2 * X:] = np.linspace(1, 0, 2 * X)
    mus[s0:s1] += m * env[:, None]
print('nhạc: ' + ' → '.join(f'{os.path.basename(p)}@{a / SR:.0f}s' for p, a, _ in segs))
g = np.full(len(full), 10 ** (a.music_db / 20), np.float32)
lvl = np.convolve(np.abs(full.mean(1)), np.ones(int(.05 * SR)) / int(.05 * SR), 'same'); quiet = lvl < 0.01
run = np.convolve(quiet.astype(float), np.ones(int(.8 * SR)), 'same') >= int(.8 * SR) * 0.98
lift = np.convolve(run.astype(float), np.ones(int(.3 * SR)) / int(.3 * SR), 'same')
g *= 10 ** (3 * lift / 20)
fi, fo = int(2 * SR), int(3 * SR); g[:fi] *= np.linspace(0, 1, fi); g[-fo:] *= np.linspace(1, 0, fo)
full = full + mus * g[:, None]
wav = os.path.join(OUT, f'{a.name}_audio.wav'); sf.write(wav, full, SR, subtype='FLOAT')

# 4. ghép + chuẩn −16 LUFS (chuẩn kênh)
mp4 = os.path.join(OUT, f'{a.name}.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vid, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                '-ar', str(SR), '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4], check=True)

# 5. phụ đề .srt (mốc chương + mốc câu thật)
def stamp(s): ms = int(round(s * 1000)); return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'
cues = [(o + c0['t0'], o + c0['t1'], c0['text']) for _, o, D in offs for c0 in D['caps']]
open(os.path.join(OUT, f'{a.name}.vi.srt'), 'w', encoding='utf-8').write(''.join(f'{i + 1}\n{stamp(s)} --> {stamp(e)}\n{tx}\n\n' for i, (s, e, tx) in enumerate(cues)))
print(f'{mp4} · {len(full) / SR:.1f} s · {len(cues)} phụ đề · chương bắt đầu: ' + ', '.join(f'ch{c}@{o:.1f}s' for c, o, _ in offs))

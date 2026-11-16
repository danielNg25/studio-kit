#!/usr/bin/env python3
"""Cắt MP3 thu tay trên web VBee (nhiều câu một file) thành từng clip câu, đặt đúng tên script thu giọng cần (<voice>/clips/<khoá>.mp3).
Dùng khi API VBee hết hạn mức: người dùng dán <voice>/vbee_ui/<tên>.txt vào web VBee, tải về <tên>.mp3 cùng tên, chép vào vbee_ui/.

  python3 studio-kit/tools/vbee_ui_split.py <thư mục voice của tập> [--only <tên>] [--db -38] [--dry-run]

Gói đầu vào (do Claude tạo): vbee_ui/plan_<tên>.json = [{"key": "<md5 16 ký tự>", "text": "<câu đã phiên âm>"}, …] + vbee_ui/<tên>.txt.
Cách cắt (từ vbee_ui_split.py của Kênh Mẫu): ffmpeg silencedetect lấy mọi khoảng lặng, quy hoạch động chọn đúng (số câu − 1) điểm cắt
gần vị trí dự kiến theo tỉ lệ số chữ, ưu tiên khoảng lặng dài. In bảng giây/chữ — lệch nhiều (NGHI) = có thể cắt sai, nghe lại câu đó.
Không ghi đè clip đã có (câu thu bằng API) trừ khi thêm --force. Tạo 13/11/2026 cho tập Đài Loan – Trung Quốc (Hóng).
"""
import json, re, subprocess, sys, pathlib


def silences(mp3, db=-38, mind=0.18):
    r = subprocess.run(['ffmpeg', '-nostdin', '-i', str(mp3), '-af', f'silencedetect=noise={db}dB:d={mind}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)], capture_output=True, text=True).stdout)
    return list(zip(st, en)), dur


W = 8
def plan_cuts(sil, dur, texts):
    n = len(texts)
    if n == 1: return []
    s0 = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    s1 = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
    cand = [(a, b) for a, b in sil if a > s0 + 0.3 and b < s1 - 0.3]
    # web VBee nghỉ ~1 s ở mỗi xuống dòng (giữa câu), chỉ ~0,2–0,3 s ở dấu phẩy: đủ đúng số khoảng lặng dài thì cắt thẳng ở đó (13/11, tập Đài Loan)
    for gap in (0.8, 0.7, 0.6):
        longs = [(a, b) for a, b in cand if b - a >= gap]
        if len(longs) == n - 1: return longs
    w = [len(t) + 6 for t in texts]; tot = sum(w); acc = 0; exp = []
    for x in w[:-1]: acc += x; exp.append(s0 + (s1 - s0) * acc / tot)
    m, k = len(cand), n - 1
    if m < k: raise SystemExit(f'chỉ thấy {m} khoảng lặng, cần {k} — thử --db thấp hơn, hoặc thu lại theo từng chương')
    INF = 1e18
    cost = lambda j, i: abs((cand[i][0] + cand[i][1]) / 2 - exp[j]) / (s1 - s0) * 40 - min(cand[i][1] - cand[i][0], 1.2) * W
    dp = [[INF] * m for _ in range(k)]; bk = [[-1] * m for _ in range(k)]
    for i in range(m): dp[0][i] = cost(0, i)
    for j in range(1, k):
        best, bi = INF, -1
        for i in range(m):
            if i - 1 >= 0 and dp[j - 1][i - 1] < best: best, bi = dp[j - 1][i - 1], i - 1
            if bi >= 0: dp[j][i] = best + cost(j, i); bk[j][i] = bi
    i = min(range(m), key=lambda x: dp[k - 1][x]); cuts = []
    for j in range(k - 1, -1, -1): cuts.append(cand[i]); i = bk[j][i]
    return cuts[::-1]


def main():
    vd = pathlib.Path(sys.argv[1]).resolve(); args = sys.argv[2:]
    only = args[args.index('--only') + 1] if '--only' in args else None
    db = float(args[args.index('--db') + 1]) if '--db' in args else -38
    dry, force = '--dry-run' in args, '--force' in args
    ui, clips = vd / 'vbee_ui', vd / 'clips'; clips.mkdir(exist_ok=True)
    plans = sorted(ui.glob('plan_*.json'))
    names = [p.stem[5:] for p in plans]
    # có tat_ca.mp3 thì dùng nó, bỏ các file chương; ngược lại dùng các file chương có mp3
    use = [only] if only else (['tat_ca'] if (ui / 'tat_ca.mp3').exists() else [n for n in names if n != 'tat_ca'])
    done = 0
    for name in use:
        mp3 = ui / f'{name}.mp3'
        if not mp3.exists(): print('·', name, 'chưa có mp3'); continue
        plan = json.load(open(ui / f'plan_{name}.json', encoding='utf-8')); texts = [p['text'] for p in plan]
        sil, dur = silences(mp3, db); cuts = plan_cuts(sil, dur, texts)
        bounds = [0.0] + [(a + b) / 2 for a, b in cuts] + [dur]
        print(f'== {name}  {dur:.1f}s  {len(texts)} câu')
        for i, (p, t) in enumerate(zip(plan, texts)):
            a, b = bounds[i], bounds[i + 1]
            if i > 0: a = max(a, cuts[i - 1][1] - 0.08)
            if i < len(cuts): b = min(b, cuts[i][0] + 0.08)
            rate = (b - a) / max(1, len(t)); flag = '  <-- NGHI' if not (0.038 <= rate <= 0.11) else ''
            print(f'  {i:2d} {b - a:5.2f}s {rate * 1000:5.0f}ms/chữ  {t[:60]}{flag}')
            out = clips / f"{p['key']}.mp3"
            if dry or (out.exists() and not force): continue
            subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', str(mp3), '-af',
                            'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,adelay=60|60,apad=pad_dur=0.06,aresample=async=0,asetnsamples=n=1152:p=0',
                            '-c:a', 'libmp3lame', '-b:a', '128k', str(out)], check=True); done += 1
    print(f'xong: {done} clip mới trong {clips}')


if __name__ == '__main__':
    main()

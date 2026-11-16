#!/usr/bin/env python3
# Tách cue phụ đề nhiều dòng thành nhiều cue 1 dòng (chia thời gian theo số chữ). python3 tools/srt_one_line.py <file.srt> [file ra]
import sys, re
src = sys.argv[1]; dst = sys.argv[2] if len(sys.argv) > 2 else src
ts = lambda s: int(s[:2]) * 3600 + int(s[3:5]) * 60 + int(s[6:8]) + int(s[9:12]) / 1000
fm = lambda x: '%02d:%02d:%02d,%03d' % (x // 3600, x % 3600 // 60, x % 60, round((x % 1) * 1000) % 1000) if round((x % 1) * 1000) < 1000 else fm(round(x))
out = []
for b in re.split(r'\n\s*\n', open(src, encoding='utf-8').read().strip()):
    ls = b.strip().split('\n'); a, e = [ts(x.strip()) for x in ls[1].split('-->')]; txt = [l.strip() for l in ls[2:] if l.strip()]
    tot = sum(len(l) for l in txt) or 1; t = a
    for l in txt: d = (e - a) * len(l) / tot; out.append((t, t + d, l)); t += d
open(dst, 'w', encoding='utf-8').write(''.join(f'{i + 1}\n{fm(a)} --> {fm(e)}\n{l}\n\n' for i, (a, e, l) in enumerate(out)))
print(len(out), 'cue →', dst)

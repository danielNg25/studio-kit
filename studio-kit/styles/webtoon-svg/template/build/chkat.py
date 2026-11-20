# kiểm mọi mốc ctx.at('…') / tbA(ctx,'…') trong khối cảnh có nằm trong lời của shot đó không: python3 build/chkat.py
import re, json, os
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(EP)
T = {s['id']: ' '.join((l.get('text') or l.get('line') or '') if isinstance(l, dict) else l for l in (s.get('lines') or [])).lower() for s in json.load(open('build/timeline.json'))['shots']}
src = ''.join(open(f, encoding='utf-8').read() for f in sorted(os.listdir('.')) if f.startswith(('sc_tq_s', 'sc_tq_n', 'sc_tq_t')))
parts = re.split(r'\nSC\.s_([a-z0-9_]+) = ', src); last = {}
for i in range(1, len(parts), 2): last[parts[i]] = parts[i + 1]
bad = 0; tot = 0
for sid, body in last.items():
    if sid not in T: continue
    for w in set(re.findall(r"(?:ctx\.at\(|tbA\(ctx, )'([^']+)'", body) + re.findall(r"\[\['([^'\]]{4,})', \{", body)):
        tot += 1
        if w.lower() not in T[sid]: print('THIẾU', sid, repr(w)); bad += 1
print('xong', bad, '/', tot)

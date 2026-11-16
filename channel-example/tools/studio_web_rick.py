# studio_web_rick.py — phần đọc dữ liệu của kênh kiểu 'rick' (video dọc người que 3D, dự án video/rick-short) cho trang studio chung (studio_web.py).
# Người dùng 14/11/2026: "gộp chung vào trang của thằn lằn luôn". Một "tập" = một phim engine/films/<phim>/
# (script.md, film.json, words.json, narration.wav, review_log.md, episode.yaml); video và ảnh soát ở engine/out/<phim>/.
# Tiến độ: STATUS.md ở gốc dự án (Claude ghi một dòng có tên phim mỗi lần cập nhật). Bản chốt = tên .mp4 trên dòng có chữ "chốt" trong review_log.md.
# Mọi hàm nhận root (thư mục gốc rick-short) và trả đường dẫn tương đối với root, cùng quy ước với studio_web.py.
import json, os, re

IMG = {'.jpg', '.jpeg', '.png', '.webp'}
TRASHES = ['_to_delete', 'engine/_to_delete']        # hai chỗ cất đồ bỏ của dự án


def _rd(p):
    try: return open(p, encoding='utf-8', errors='replace').read()
    except OSError: return ''


def _fi(root, p): st = os.stat(p); return {'p': os.path.relpath(p, root), 'name': os.path.basename(p), 'mtime': st.st_mtime, 'size': st.st_size}


def _ls(root, d, exts, pat=None):
    if not os.path.isdir(d): return []
    out = [os.path.join(d, f) for f in os.listdir(d) if os.path.splitext(f)[1].lower() in exts and not f.startswith('.') and (pat is None or re.search(pat, f))]
    return sorted((_fi(root, p) for p in out if os.path.isfile(p)), key=lambda x: -x['mtime'])


def _dsize(p):
    if os.path.isfile(p): return os.path.getsize(p)
    t = 0
    for r, _, fs in os.walk(p):
        for f in fs:
            try: t += os.path.getsize(os.path.join(r, f))
            except OSError: pass
    return t


def films_dir(root): return os.path.join(root, 'engine', 'films')
def out_dir(root, fid=''): return os.path.join(root, 'engine', 'out', fid)
def valid(root, fid): return bool(fid) and '/' not in fid and not fid.startswith(('.', '_', 'zz')) and os.path.isdir(os.path.join(films_dir(root), fid))


def meta(root, fid):
    """title + status + note trong episode.yaml của phim; thiếu thì đoán từ file đang có"""
    d = os.path.join(films_dir(root), fid); y = {}
    for l in _rd(os.path.join(d, 'episode.yaml')).split('\n'):
        m = re.match(r'^(title|status|note):\s*(.*)$', l)
        if m: y[m.group(1)] = m.group(2).split(' #')[0].strip().strip('"\'')
    title = y.get('title')
    if not title:
        for l in _rd(os.path.join(d, 'script.md')).split('\n'):
            if l.startswith('# '): title = l[2:].strip(); break
    st = y.get('status')
    if not st:
        has = lambda f: os.path.exists(os.path.join(d, f))
        st = 'đã rà' if 'Bản chốt' in _rd(os.path.join(d, 'review_log.md')) else 'đang dựng' if _ls(root, out_dir(root, fid), {'.mp4'}) else 'kế hoạch cảnh' if has('film.json') else 'kịch bản' if has('script.md') else ''
    return title or fid, st, y.get('note', '')


def status_lines(root, fid, n=8):
    return [l.rstrip() for l in _rd(os.path.join(root, 'STATUS.md')).split('\n') if fid in l and len(l.strip()) > 3][-n:]


def say_lines(d):
    """lời từng câu từ film.json (mỗi dòng của phim một câu); chưa có film.json thì từ các nhịp **[TÊN]** của script.md"""
    try:
        f = json.load(open(os.path.join(d, 'film.json'), encoding='utf-8'))
        return [{'name': f"{ln.get('id', '')} · {ln.get('place', '')}", 'text': ln.get('say', ''), 'chars': len(ln.get('say', ''))} for ln in f.get('lines', [])]
    except Exception: pass
    return [{'name': m.group(1), 'text': m.group(2).strip(), 'chars': len(m.group(2).strip())} for m in re.finditer(r'^\*\*\[([^\]]+)\]\*\*\s*(.+)$', _rd(os.path.join(d, 'script.md')), re.M)]


def finals(root, fid):
    return set(re.findall(r'([\w.-]+\.mp4)', ' '.join(l for l in _rd(os.path.join(films_dir(root), fid, 'review_log.md')).split('\n') if 'chốt' in l.lower())))


def videos(root, fid):
    fin = finals(root, fid); res = []
    for v in _ls(root, out_dir(root, fid), {'.mp4', '.webm'}):
        if v['name'] == 'picture.mp4': continue
        g = os.path.join(root, v['p'] + '.gate-stick3d.json')
        if os.path.exists(g):
            try: j = json.load(open(g, encoding='utf-8')); v['gate'] = {'err': len(j.get('errors', [])), 'warn': len(j.get('warnings', [])), 'sha': (j.get('sha256') or '')[:8]}
            except Exception: pass
        v['cmp'] = v['name'].startswith('so-sanh'); v['final'] = v['name'] in fin; v['test'] = not v['final']
        res.append(v)
    return res


def images(root, fid, n=90):
    o = out_dir(root, fid); L = _ls(root, o, IMG)
    if os.path.isdir(o):
        for s in sorted(os.listdir(o)):
            if os.path.isdir(os.path.join(o, s)) and not s.startswith('.'): L += [dict(x, sub=s) for x in _ls(root, os.path.join(o, s), IMG)[:24]]
    return sorted(L, key=lambda x: -x['mtime'])[:n]


def film(root, fid):
    if not valid(root, fid): return None
    d = os.path.join(films_dir(root), fid); title, st, note = meta(root, fid); docs = {}
    for k, f in [('script', 'script.md'), ('plan', 'film.json'), ('review', 'review_log.md'), ('post', 'post.md'), ('yaml', 'episode.yaml'), ('edits', 'web_edits.log'), ('words', 'words.json')]:
        p = os.path.join(d, f)
        if os.path.exists(p): docs[k] = _fi(root, p)
    voice = None
    try:
        w = json.load(open(os.path.join(d, 'words.json'), encoding='utf-8')); nw = sum(len(l.get('words', [])) for l in w.get('lines', []))
        voice = {'dur': round(w.get('dur', 0), 2), 'words': nw, 'wpm': round(nw / max(.1, w.get('dur', 1)) * 60), 'placeholder': bool(w.get('placeholder', True))}
    except Exception: pass
    wav = os.path.join(d, 'narration.wav')
    return {'id': fid, 'kind': 'rick', 'title': title, 'status': st, 'note': note, 'docs': docs, 'lines': say_lines(d), 'voice': voice, 'wav': _fi(root, wav) if os.path.exists(wav) else None,
            'videos': videos(root, fid), 'images': images(root, fid), 'chars': _ls(root, out_dir(root, 'chars'), IMG),
            'thumbs': _ls(root, os.path.join(root, 'branding'), IMG, '^thumb_' + re.escape(fid)), 'status_lines': status_lines(root, fid), 'music_gain': None}


def films(root):
    res = []; F = films_dir(root)
    if not os.path.isdir(F): return res
    for e in sorted(os.listdir(F)):
        if not valid(root, e): continue
        d = os.path.join(F, e); title, st, note = meta(root, e)
        mt = max([os.path.getmtime(os.path.join(d, f)) for f in os.listdir(d) if not f.startswith('.')] + [v['mtime'] for v in _ls(root, out_dir(root, e), {'.mp4', '.jpg'})] or [0])
        th = _ls(root, os.path.join(root, 'branding'), IMG, '^thumb_' + re.escape(e)) or _ls(root, out_dir(root, e), IMG)
        res.append({'id': e, 'title': title, 'status': st + (' · ' + note if note else ''), 'mtime': mt, 'thumb': th[0]['p'] if th else None})
    return sorted(res, key=lambda x: -x['mtime'])


def recent(root, n=40):
    pool = _ls(root, root, {'.md'}); O = out_dir(root)
    if os.path.isdir(O):
        for s in os.listdir(O):
            if os.path.isdir(os.path.join(O, s)): pool += [v for v in _ls(root, os.path.join(O, s), {'.mp4', '.jpg', '.png'}) if v['name'] != 'picture.mp4']
    F = films_dir(root)
    for e in os.listdir(F) if os.path.isdir(F) else []:
        if valid(root, e): pool += _ls(root, os.path.join(F, e), {'.md'})
    for dd in ['docs', 'skill', 'skill/references']: pool += _ls(root, os.path.join(root, dd), {'.md'})
    for r, ds, fs in os.walk(os.path.join(root, 'research')):
        ds[:] = [x for x in ds if x != 'raw' and not x.startswith('.')]
        pool += _ls(root, r, {'.md', '.csv'})
    return sorted(pool, key=lambda x: -x['mtime'])[:n]


def doclist(root):
    """tài liệu của dự án theo nhóm: nghiên cứu kênh, bắt đầu, phân tích kênh mẫu, engine, skill"""
    G = []
    def grp(name, items):
        items = [i for i in items if i]
        if items: G.append({'name': name, 'items': items})
    res = []
    for r, ds, fs in os.walk(os.path.join(root, 'research')):
        ds[:] = sorted(x for x in ds if x != 'raw' and not x.startswith('.'))
        res += _ls(root, r, {'.md', '.csv'})
    grp('Nghiên cứu kênh', sorted(res, key=lambda x: -x['mtime']))
    grp('Bắt đầu', [_fi(root, os.path.join(root, f)) for f in ('STATUS.md', 'START_HERE.md', 'README.md') if os.path.exists(os.path.join(root, f))])
    grp('Phân tích kênh mẫu (docs/)', sorted(_ls(root, os.path.join(root, 'docs'), {'.md'}), key=lambda x: x['name']))
    grp('Engine', [_fi(root, os.path.join(root, 'engine', f)) for f in ('README.md', 'NAMES.md') if os.path.exists(os.path.join(root, 'engine', f))])
    grp('Skill rick-short-video', [_fi(root, os.path.join(root, 'skill', 'SKILL.md'))] if os.path.exists(os.path.join(root, 'skill', 'SKILL.md')) else [])
    grp('Skill: hướng dẫn từng bước', sorted(_ls(root, os.path.join(root, 'skill', 'references'), {'.md'}), key=lambda x: x['name']))
    return G


def heavy(root, fid):
    """file nặng có thể bỏ của một phim: hình ghép chưa có tiếng, bản cũ đã có bản mới hơn, thư mục khung rời. Không liệt kê film.json, kịch bản, giọng, bản chốt."""
    o = out_dir(root, fid); res = []; st = meta(root, fid)[1] if valid(root, fid) else ''
    if os.path.isdir(o):
        fin = finals(root, fid); vids = [v for v in _ls(root, o, {'.mp4'}) if v['name'] != 'picture.mp4' and not v['name'].startswith('so-sanh')]
        newest = vids[0]['name'] if vids else None
        for f in sorted(os.listdir(o)):
            p = os.path.join(o, f)
            if f == 'picture.mp4': res.append({'p': os.path.relpath(p, root), 'kind': 'build', 'note': 'hình ghép chưa có tiếng (render lại được)', 'warn': False})
            elif f.endswith('.mp4') and not f.startswith('so-sanh') and f not in fin and f != newest:
                res.append({'p': os.path.relpath(p, root), 'kind': 'video', 'note': 'bản cũ, đã có bản mới hơn', 'warn': False})
            elif os.path.isdir(p) and (f.startswith(('soi', 'reg', 'dbg', 'tong')) or f in ('a', 'b', 'c')):
                res.append({'p': os.path.relpath(p, root), 'kind': 'build', 'note': 'khung ảnh soát rời (bảng ghép .jpg vẫn giữ)', 'warn': False})
    for r in res:
        p = os.path.join(root, r['p']); r['size'] = _dsize(p); r['mtime'] = os.path.getmtime(p); r['dir'] = os.path.isdir(p)
    return {'id': fid, 'status': st, 'items': sorted(res, key=lambda x: -x['size'])}


def trash_size(root): return sum(_dsize(os.path.join(root, t)) for t in TRASHES if os.path.isdir(os.path.join(root, t)))

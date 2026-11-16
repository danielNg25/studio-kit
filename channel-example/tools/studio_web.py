#!/usr/bin/env python3
# Trang web studio — MỘT trang cho mọi kênh (mỗi kênh một tab), chỉ chạy trên máy Mac (127.0.0.1).
# Thiết kế: docs/2026-11-14-studio-web-design.md (mục "Gộp nhiều kênh", 14/11/2026 tối).
#   cd <STUDIO>/channel-example && python3 tools/studio_web.py
#   rồi mở http://127.0.0.1:8765
# Mỗi yêu cầu chỉ đọc file trong thư mục của kênh đang chọn (không .env). Không xoá file: lưu thì bản cũ chép sang <kênh>/_to_delete/web_bak/.
# Kênh kiểu 'yaml' (kênh mẫu): episode.yaml, backlog.csv, audio/vbee_ui, build/prev. Kênh kiểu 'kit' (Hóng, dựng bằng studio-kit):
#   script.md + voice/vbee_ui + build/<style>/{qa,out}. Kênh kiểu 'rick' (Người que 3D, gộp 14/11/2026 tối): mỗi tập là một phim engine/films/<phim>/, xem tools/studio_web_rick.py.
#   File GIAO của mọi kênh nằm cùng chỗ: out/<id>*.mp4, out/<id>*.srt, out/xem/<id>_*.mp4, branding/thumb_<id>*.jpg.
import json, os, re, csv, shutil, sys, time, mimetypes, html, threading
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
import studio_web_rick as RK      # kênh kiểu 'rick' (người que 3D, dự án video/rick-short): đọc dữ liệu phim của engine

STUDIO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))      # …/shorts-claude
CHANNELS = {   # thứ tự = thứ tự tab; thêm kênh mới: thêm một dòng (kind 'yaml' hoặc 'kit')
    'example': {'name': 'Kênh Mẫu', 'root': os.path.join(STUDIO, 'channel-example'), 'kind': 'yaml'},
    'hong': {'name': 'Hóng', 'root': os.path.join(STUDIO, 'channel-hong-su-remotion'), 'kind': 'kit'},
    'rick-short': {'name': 'Người que 3D', 'root': os.path.join(os.path.dirname(STUDIO), 'rick-short'), 'kind': 'rick'},
}
CHANNELS = {k: v for k, v in CHANNELS.items() if k == 'example' or os.path.isdir(v['root'])}   # chỉ hiện kênh có thư mục


class _Ctx(threading.local):
    """kênh của yêu cầu đang xử lý (mỗi kết nối một luồng) — mọi hàm dưới đây đọc thư mục gốc qua X.root"""
    ch = 'example'
    @property
    def root(self): return CHANNELS[self.ch]['root']
    @property
    def ep(self): return os.path.join(self.root, 'engine', 'films') if self.kind == 'rick' else os.path.join(self.root, 'episodes')
    @property
    def kind(self): return CHANNELS[self.ch]['kind']


X = _Ctx()
UI = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'studio_web', 'index.html')
PORT = int(os.environ.get('PORT', 8765))
TEXT_EXT = {'.md', '.yaml', '.yml', '.csv', '.txt', '.srt', '.log', '.json'}
MEDIA_EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3', '.m4a', '.wav', '.mp4', '.webm'}
AUDIO_EXT = {'.mp3', '.m4a', '.wav'}
try:
    import yaml
except Exception:
    yaml = None


def safe(rel):
    """đường dẫn tương đối trong X.root → tuyệt đối; chặn .., file .env, kiểu file lạ"""
    p = os.path.realpath(os.path.join(X.root, unquote(rel).lstrip('/')))
    if not (p == X.root or p.startswith(X.root + os.sep)): return None
    b = os.path.basename(p).lower()
    if b.startswith('.env') or '/.' in p[len(X.root):]: return None
    if os.path.splitext(b)[1] not in TEXT_EXT | MEDIA_EXT: return None
    return p


def rel(p): return os.path.relpath(p, X.root)


def finfo(p): st = os.stat(p); return {'p': rel(p), 'name': os.path.basename(p), 'mtime': st.st_mtime, 'size': st.st_size}


def ls(d, exts, pat=None):
    if not os.path.isdir(d): return []
    out = [os.path.join(d, f) for f in os.listdir(d) if os.path.splitext(f)[1].lower() in exts and not f.startswith('.') and (pat is None or re.search(pat, f))]
    return sorted((finfo(p) for p in out if os.path.isfile(p)), key=lambda x: -x['mtime'])


def load_yaml(p):
    if not yaml or not os.path.exists(p): return {}
    try: return yaml.safe_load(open(p, encoding='utf-8')) or {}
    except Exception as e: return {'_err': str(e)}


def status_lines(eid, n=6):
    L = []
    for f in (('backlog.md', 'STATUS.md') if X.kind == 'kit' else ('STATUS.md',)):
        p = os.path.join(X.root, f)
        if os.path.exists(p): L += [l.rstrip() for l in open(p, encoding='utf-8', errors='replace') if eid in l and len(l.strip()) > 3]
    return L[-n:]


def backlog_row(eid):
    p = os.path.join(X.root, 'backlog.csv')
    if not os.path.exists(p): return None
    for r in csv.DictReader(open(p, encoding='utf-8', errors='replace')):
        if r.get('id') == eid: return r
    return None


def chapters(y):
    """lời theo chương từ episode.yaml, đã áp pronounce (bản xem — gói thu chính thức là audio/vbee_ui/*.txt)"""
    pr = y.get('pronounce') or {}
    keys = sorted(pr, key=len, reverse=True)
    out, cur = [], None
    for s in y.get('shots') or []:
        ch = s.get('chapter')
        if ch or cur is None:
            cur = {'name': ch or 'Mở đầu', 'shots': [], 'text': []}; out.append(cur)
        for ln in s.get('lines') or []:
            t = ln if isinstance(ln, str) else (ln.get('text') if isinstance(ln, dict) else str(ln))
            if not t: continue
            for k in keys: t = t.replace(k, str(pr[k]))
            cur['text'].append(t)
        cur['shots'].append(s.get('id'))
    for c in out: c['text'] = '\n\n'.join(c['text']); c['chars'] = len(c['text'])
    return [c for c in out if c['text']]


# ---------------------------------------------------------------- kênh kiểu 'kit' (Hóng: studio-kit, không có episode.yaml)
def kit_builds(d):
    b = os.path.join(d, 'build')
    return [os.path.join(b, x) for x in sorted(os.listdir(b)) if os.path.isdir(os.path.join(b, x)) and not x.startswith(('.', '_'))] if os.path.isdir(b) else []


def ep_meta(d):
    """title + status trong episode.yaml (mọi kênh dùng chung quy ước này); đọc nhanh phần đầu file, không cần PyYAML"""
    yp = os.path.join(d, 'episode.yaml'); title, st = None, ''
    if os.path.exists(yp):
        for l in open(yp, encoding='utf-8', errors='replace'):
            if l.startswith('title:'): title = l[6:].strip().strip('"\'')
            elif l.startswith('status:'): st = l[7:].split('#')[0].strip()
            if l.startswith('shots:'): break
    return title, st


def kit_title(d, eid):
    p = os.path.join(d, 'post.md')
    if os.path.exists(p):
        m = re.search(r'^## Tiêu đề[^\n]*\n```[^\n]*\n([^\n]+)', open(p, encoding='utf-8', errors='replace').read(), re.M)
        if m: return m.group(1).strip()
    for f in ('script.md', 'outline.md'):
        p = os.path.join(d, f)
        if os.path.exists(p):
            for l in open(p, encoding='utf-8', errors='replace'):
                if l.startswith('# '): return l[2:].strip()
    return eid


def kit_status(d):
    """chỉ dùng khi tập CHƯA có episode.yaml (tập cũ): đoán trạng thái từ file đang có"""
    has = lambda f: os.path.exists(os.path.join(d, f))
    if has('post.md'): return 'post sẵn'
    if any(os.path.isdir(os.path.join(b, 'out')) and os.listdir(os.path.join(b, 'out')) for b in kit_builds(d)): return 'đang dựng'
    return 'kịch bản' if has('script.md') else 'dàn ý' if has('outline.md') else ''


def kit_chapters(d):
    """lời theo chương từ script.md (cùng cách tách với studio-kit/core/revoice.py), đã áp pronounce trong voice/voice.json"""
    p = os.path.join(d, 'script.md')
    if not os.path.exists(p): return []
    raw = open(p, encoding='utf-8', errors='replace').read(); parts = raw.split('\n---\n'); raw = parts[1] if len(parts) > 1 else raw
    raw = raw.split('## Dữ kiện')[0].split('## Ghi chú')[0]; pr = {}
    try: pr = json.load(open(os.path.join(d, 'voice', 'voice.json'), encoding='utf-8')).get('pronounce') or {}
    except Exception: pass
    keys = sorted(pr, key=len, reverse=True); out, cur = [], None
    for l in raw.split('\n'):
        if l.startswith('## '): cur = {'name': l[3:].strip(), 'shots': [], 'text': []}; out.append(cur); continue
        if cur is None or not l.strip() or l[0] in '>#-|': continue
        t = l.strip()
        for k in keys: t = t.replace(k, str(pr[k]))
        cur['text'].append(t)
    for c in out: c['text'] = '\n\n'.join(c['text']); c['chars'] = len(c['text'])
    return [c for c in out if c['text']]


def kit_thumbs(d, eid):
    return ls(os.path.join(X.root, 'branding'), {'.jpg', '.png'}, '^thumb_' + re.escape(eid)) + ls(d, {'.jpg', '.png'}, '^thumb')   # + kiểu cũ: ảnh bìa nằm ngay trong thư mục tập


def kit_videos(d, eid):
    out = os.path.join(X.root, 'out'); res = []
    for v in ls(os.path.join(out, 'xem'), {'.mp4', '.webm'}, '^' + re.escape(eid)): v['test'] = True; res.append(v)
    for v in ls(out, {'.mp4'}, '^' + re.escape(eid)): v['test'] = False; res.append(v)
    for b in kit_builds(d):       # bản xem / bản mẫu còn nằm trong thư mục dựng (chưa dời ra out/)
        for v in ls(os.path.join(b, 'out'), {'.mp4'}):
            if re.match(r'ch\d+_', v['name']) or v['name'].endswith('_video.mp4') or v['name'] == 'video.mp4': continue
            v['test'] = True; res.append(v)
    return res


def kit_episode(eid, d):
    docs = {}
    for k, f in [('outline', 'outline.md'), ('script', 'script.md'), ('post', 'post.md'), ('review', 'build/review_log.md'), ('edits', 'build/web_edits.log'), ('facts', 'research/facts.md')]:
        p = os.path.join(d, f)
        if os.path.exists(p): docs[k] = finfo(p)
    prev, sheets, subs = [], [], ls(os.path.join(X.root, 'out'), {'.srt'}, '^' + re.escape(eid)) + ls(d, {'.srt'})
    for b in kit_builds(d):
        for k, f in [('review', 'review_log.md'), ('plan', 'PLAN.md')]:
            p = os.path.join(b, f)
            if os.path.exists(p) and k not in docs: docs[k] = finfo(p)
        prev += ls(os.path.join(b, 'qa'), {'.jpg', '.png'}); sheets += ls(os.path.join(b, 'src'), {'.png', '.jpg'}, '^sheet-') + ls(os.path.join(b, 'qa', 'rig'), {'.jpg'}, '^[^_]')
        subs += ls(os.path.join(b, 'out'), {'.srt'})
    bl = os.path.join(X.root, 'backlog.md')
    if os.path.exists(bl): docs['backlog_md'] = finfo(bl)
    vd = os.path.join(d, 'voice'); vb = os.path.join(vd, 'vbee_ui'); pack = []; voice = None
    try: voice = json.load(open(os.path.join(vd, 'voice.json'), encoding='utf-8'))
    except Exception: pass
    if os.path.isdir(vb):
        for f in sorted(os.listdir(vb)):
            if f.endswith('.txt'):
                t = open(os.path.join(vb, f), encoding='utf-8', errors='replace').read(); stem = f[:-4]
                mp = [x for x in os.listdir(vb) if os.path.splitext(x)[0] == stem and os.path.splitext(x)[1] in AUDIO_EXT]
                pack.append({'name': stem, 'text': t, 'chars': len(t), 'mp3': [rel(os.path.join(vb, x)) for x in sorted(mp)]})
    y = load_yaml(os.path.join(d, 'episode.yaml')); t0, s0 = ep_meta(d); music = y.get('music') if isinstance(y.get('music'), dict) else {}
    if os.path.exists(os.path.join(d, 'episode.yaml')): docs['yaml'] = finfo(os.path.join(d, 'episode.yaml'))
    return {'id': eid, 'kind': 'kit', 'title': t0 or kit_title(d, eid), 'status': s0 or kit_status(d), 'voice': y.get('voice') or voice, 'music_gain': music.get('gain_db'),
            'docs': docs, 'chapters': kit_chapters(d), 'pack': pack, 'vbee_guide': sorted(rel(os.path.join(vb, f)) for f in os.listdir(vb) if f.startswith('HUONG_DAN') and f.endswith('.md')) if os.path.isdir(vb) else [], 'videos': kit_videos(d, eid), 'subs': subs, 'thumbs': kit_thumbs(d, eid),
            'prev': sorted(prev, key=lambda x: -x['mtime'])[:80], 'hops': [], 'sheets': sorted(sheets, key=lambda x: x['name']),
            'clips': len(ls(os.path.join(vd, 'clips'), AUDIO_EXT)), 'shorts_n': len(short_videos(eid)), 'shorts_post': bool(short_post_path(eid)), 'backlog': None, 'status_lines': status_lines(eid)}


def kit_heavy(eid):
    """file nặng có thể bỏ của một tập kiểu kit: mảnh render từng chương, ảnh soát, bản xem; KHÔNG liệt kê mã chương, tấm rối, giọng, kịch bản"""
    d = os.path.join(X.ep, eid); out = os.path.join(X.root, 'out'); res = []; st = ep_meta(d)[1]
    has_final = os.path.isdir(out) and any(f.startswith(eid) and f.endswith('.mp4') for f in os.listdir(out))
    for b in kit_builds(d):
        bo = os.path.join(b, 'out')
        for f in sorted(os.listdir(bo)) if os.path.isdir(bo) else []:
            p = os.path.join(bo, f)
            if os.path.isdir(p) and f.startswith('qa_'): res.append({'p': rel(p), 'kind': 'build', 'note': 'dải ảnh của cổng video', 'warn': False})
            elif os.path.isfile(p) and (re.match(r'ch\d+_(video\.mp4|mix\.wav)$', f) or f.endswith(('_video.mp4', '_audio.wav')) or f in ('video.mp4', 'mix.wav')):
                res.append({'p': rel(p), 'kind': 'build', 'note': 'mảnh render từng chương / bản ghép chưa nén (render lại được từ mã chương)', 'warn': not has_final, 'keep': st != 'posted'})
            elif f.endswith('.mp4'):   # bản ghép trong thư mục dựng: nếu out/ của kênh chưa có bản đăng thì đây có thể là bản duy nhất → cảnh báo
                res.append({'p': rel(p), 'kind': 'video', 'note': 'bản xem thử / bản mẫu trong thư mục dựng' + ('' if has_final or '_xem' in f else ' — chưa có bản đăng trong out/, có thể là bản duy nhất'), 'warn': not has_final and '_xem' not in f})
        q = os.path.join(b, 'qa')
        for f in sorted(os.listdir(q)) if os.path.isdir(q) else []:
            if f.startswith('peek') and os.path.isdir(os.path.join(q, f)): res.append({'p': rel(os.path.join(q, f)), 'kind': 'build', 'note': 'khung ảnh soát đầy đủ (bảng ghép vẫn còn trong qa/)', 'warn': False})
    for dd in [os.path.join(out, 'xem'), out]:
        for f in sorted(os.listdir(dd)) if os.path.isdir(dd) else []:
            p = os.path.join(dd, f)
            if not f.startswith(eid) or not os.path.isfile(p) or not f.endswith(('.mp4', '.mov', '.webm')): continue
            if dd == out: res.append({'p': rel(p), 'kind': 'final', 'note': 'BẢN ĐĂNG — chỉ bỏ khi đã đăng xong', 'warn': st != 'posted'})
            else: res.append({'p': rel(p), 'kind': 'video', 'note': 'bản xem thử', 'warn': False})
    for r in res:
        p = os.path.join(X.root, r['p']); r['size'] = dsize(p); r['mtime'] = os.path.getmtime(p); r['dir'] = os.path.isdir(p)
    return {'id': eid, 'status': st, 'items': sorted(res, key=lambda x: -x['size'])}


def episode(eid):
    if X.kind == 'rick': return RK.film(X.root, eid)
    d = os.path.join(X.ep, eid)
    if not os.path.isdir(d) or '/' in eid or eid.startswith('.'): return None
    if X.kind == 'kit': return kit_episode(eid, d)
    y = load_yaml(os.path.join(d, 'episode.yaml'))
    docs = {}
    for k, f in [('outline', 'outline.md'), ('script', 'script.md'), ('post', 'post.md'), ('yaml', 'episode.yaml'), ('review', 'build/review_log.md'), ('edits', 'build/web_edits.log')]:
        p = os.path.join(d, f)
        if os.path.exists(p): docs[k] = finfo(p)
    vb = os.path.join(d, 'audio', 'vbee_ui'); pack = []
    if os.path.isdir(vb):
        for f in sorted(os.listdir(vb)):
            if f.endswith('.txt'):
                t = open(os.path.join(vb, f), encoding='utf-8', errors='replace').read(); stem = f[:-4]
                mp = [x for x in os.listdir(vb) if x.startswith(stem) and os.path.splitext(x)[1] in AUDIO_EXT]
                pack.append({'name': stem, 'text': t, 'chars': len(t), 'mp3': [rel(os.path.join(vb, x)) for x in sorted(mp)]})
    out = os.path.join(X.root, 'out')
    vids = ls(os.path.join(out, 'xem'), {'.mp4', '.webm'}, '^' + re.escape(eid)) + ls(out, {'.mp4'}, '^' + re.escape(eid))
    for v in vids: v['test'] = '/xem/' in v['p']
    subs = ls(out, {'.srt'}, '^' + re.escape(eid))
    thumbs = ls(os.path.join(X.root, 'branding'), {'.jpg', '.png'}, '^thumb_' + re.escape(eid))
    prev = ls(os.path.join(d, 'build', 'prev'), {'.jpg', '.png'})[:80]
    hops = []
    for root in [out, os.path.join(out, 'xem'), os.path.join(d, 'build')]:
        if os.path.isdir(root):
            for sub in os.listdir(root):
                if sub.startswith('qa_hop_') and eid in sub: hops += ls(os.path.join(root, sub), {'.jpg'})
    music = (y.get('music') or {}) if isinstance(y.get('music'), dict) else {}
    return {'id': eid, 'title': y.get('title') or eid, 'status': y.get('status') or '', 'voice': y.get('voice'), 'music_gain': music.get('gain_db'),
            'docs': docs, 'chapters': chapters(y), 'pack': pack, 'vbee_guide': sorted(rel(os.path.join(vb, f)) for f in os.listdir(vb) if f.startswith('HUONG_DAN') and f.endswith('.md')) if os.path.isdir(vb) else [], 'videos': vids, 'subs': subs, 'thumbs': thumbs, 'prev': prev, 'hops': hops,
            'clips': len(ls(os.path.join(d, 'audio', 'clips'), AUDIO_EXT)), 'shorts_n': len(short_videos(eid)), 'shorts_done': sum(1 for v in short_videos(eid) if all(k in short_marks(eid).get(v['name'], {}) for k in ('YouTube', 'TikTok'))), 'shorts_post': bool(short_post_path(eid)), 'backlog': backlog_row(eid), 'status_lines': status_lines(eid)}


def episodes():
    if X.kind == 'rick': return RK.films(X.root)
    res = []
    for e in sorted(os.listdir(X.ep)):
        d = os.path.join(X.ep, e)
        if not os.path.isdir(d) or e.startswith(('_', '.')): continue
        t0, st = ep_meta(d); title = t0 or e
        if X.kind == 'kit' and not os.path.exists(os.path.join(d, 'episode.yaml')): title, st = kit_title(d, e), kit_status(d)
        mt = max([os.path.getmtime(os.path.join(d, f)) for f in os.listdir(d) if not f.startswith('.')] or [0])
        th = os.path.join(X.root, 'branding', f'thumb_{e}.jpg')
        if not os.path.exists(th):
            c = ls(os.path.join(X.root, 'branding'), {'.jpg', '.png'}, '^thumb_' + re.escape(e) + r'(_|\.)') or (ls(d, {'.jpg', '.png'}, '^thumb') if X.kind == 'kit' else [])
            th = os.path.join(X.root, c[0]['p']) if c else None
        res.append({'id': e, 'title': title, 'status': st, 'mtime': mt, 'thumb': rel(th) if th else None})
    return sorted(res, key=lambda x: -x['mtime'])


def recent(n=40):
    if X.kind == 'rick': return RK.recent(X.root, n)
    pool = []
    for d, exts in [(os.path.join(X.root, 'out'), {'.mp4', '.srt'}), (os.path.join(X.root, 'out', 'xem'), {'.mp4', '.jpg', '.png'}), (os.path.join(X.root, 'branding'), {'.jpg', '.png'})]:
        pool += ls(d, exts)
    for e in os.listdir(X.ep):
        d = os.path.join(X.ep, e)
        if not os.path.isdir(d) or e.startswith(('_', '.')): continue
        pool += ls(os.path.join(d, 'build', 'prev'), {'.jpg', '.png'})[:10]
        if X.kind == 'kit':
            for b in kit_builds(d): pool += ls(os.path.join(b, 'qa'), {'.jpg', '.png'})[:6]
        pool += ls(d, {'.md'})
    return sorted(pool, key=lambda x: -x['mtime'])[:n]


def dsize(p):
    if os.path.isfile(p): return os.path.getsize(p)
    t = 0
    for r, _, fs in os.walk(p):
        for f in fs:
            try: t += os.path.getsize(os.path.join(r, f))
            except OSError: pass
    return t


def heavy(eid):
    """file/thư mục nặng có thể bỏ của một tập (không bao giờ liệt kê mã cảnh, kịch bản, giọng, nhạc)"""
    if X.kind == 'kit': return kit_heavy(eid)
    if X.kind == 'rick': return RK.heavy(X.root, eid)
    d = os.path.join(X.ep, eid); out = os.path.join(X.root, 'out'); res = []
    st = ''
    yp = os.path.join(d, 'episode.yaml')
    if os.path.exists(yp):
        m = re.search(r'^status:\s*(.*)$', open(yp, encoding='utf-8').read(), re.M); st = m.group(1).strip() if m else ''
    final = os.path.join(out, f'{eid}_bio-long.mp4'); has_final = os.path.exists(final)
    b = os.path.join(d, 'build')
    if os.path.isdir(b):
        for f in sorted(os.listdir(b)):
            p = os.path.join(b, f)
            if os.path.isdir(p) and (f.startswith('full_local') or f.startswith('chunks') or f.startswith('thumb_') or f.startswith('prev_') or f.startswith('bak_') or f.startswith('_st')):
                note = 'mảnh render (đã ghép thành video)' if f.startswith(('full_local', 'chunks')) else 'file tạm'
                res.append({'p': rel(p), 'kind': 'build', 'note': note, 'warn': f.startswith(('full_local', 'chunks')) and not has_final})
            elif f == 'prev' and os.path.isdir(p):
                res.append({'p': rel(p), 'kind': 'build', 'note': 'ảnh soát + clip xem chương (mất thì bước Hình trống)', 'warn': False})
            elif f.startswith('qa_hop_') and os.path.isdir(p):
                res.append({'p': rel(p), 'kind': 'build', 'note': 'ảnh dò nảy', 'warn': False})
    for dd in [os.path.join(out, 'xem'), out]:
        if os.path.isdir(dd):
            for f in sorted(os.listdir(dd)):
                p = os.path.join(dd, f)
                if not f.startswith(eid + '_') and not (f.startswith('qa_hop_') and eid in f): continue
                if p == final:
                    sj = os.path.join(d, 'build', 'shorts.json'); need = 0
                    if os.path.exists(sj):
                        try: need = len(json.load(open(sj, encoding='utf-8')).get('segs', [])) - len(short_videos(eid))
                        except Exception: need = 0
                    note = 'BẢN ĐĂNG — chỉ bỏ khi đã đăng xong' + (f' và cắt xong Shorts (còn {need} clip chưa cắt)' if need > 0 else '')
                    res.append({'p': rel(p), 'kind': 'final', 'note': note, 'warn': st != 'posted' or need > 0})
                elif f.endswith(('.mp4', '.mov', '.webm')) or (os.path.isdir(p) and f.startswith('qa_hop_')):
                    res.append({'p': rel(p), 'kind': 'video', 'note': 'bản xem thử / bản cũ' if '/xem/' in p or not f.endswith('_bio-long.mp4') else '', 'warn': False})
    # Shorts: cả thư mục out/shorts_<id>/ (an toàn khi mọi clip đã tích đăng), hoặc từng clip đã đăng
    sv = short_videos(eid); mk = short_marks(eid)
    if sv:
        posted = [v for v in sv if mk.get(v['name'])]
        sd = os.path.join(out, f'shorts_{eid}')
        if len(posted) == len(sv):
            for x in ([sd] if os.path.isdir(sd) else []) + [os.path.join(X.root, v['p']) for v in sv if not v['p'].startswith(rel(sd) + '/')]:
                res.append({'p': rel(x), 'kind': 'shorts', 'note': f'Shorts — {len(sv)} clip đều đã đăng', 'warn': False})
        else:
            if os.path.isdir(sd):
                res.append({'p': rel(sd), 'kind': 'shorts', 'note': f'cả thư mục Shorts — còn {len(sv) - len(posted)}/{len(sv)} clip chưa tích đã đăng', 'warn': True})
            for v in posted:
                res.append({'p': v['p'], 'kind': 'shorts', 'note': 'Short đã đăng (' + ', '.join(mk[v['name']]) + ')' + ('' if len(mk[v['name']]) >= 2 else ' — chưa tích đủ YouTube + TikTok'), 'warn': len(mk[v['name']]) < 2})
    for r in res:
        p = os.path.join(X.root, r['p']); r['size'] = dsize(p); r['mtime'] = os.path.getmtime(p); r['dir'] = os.path.isdir(p)
    fl = sorted([r for r in res if os.path.basename(r['p']).startswith(('full_local', 'chunks'))], key=lambda x: -x['mtime'])
    if fl: fl[0]['note'] = 'mảnh render MỚI NHẤT — giữ nếu còn định sửa vài cảnh (render lại nhanh); đăng xong thì bỏ'; fl[0]['keep'] = st != 'posted'
    for r in res:
        if r['p'].endswith('/build/prev'): r['keep'] = st != 'posted'
    return {'id': eid, 'status': st, 'items': sorted(res, key=lambda x: -x['size'])}


DEEP_KEEP_EXT = ('.md', '.yaml', '.yml', '.txt')
DEEP_KEEP_DIR = ('research',)


def deep(eid):
    """dọn sâu một tập ĐÃ ĐĂNG: bỏ hết (mã cảnh, giọng, build, video, Shorts), chỉ giữ chữ ở gốc tập (kịch bản, dàn ý, bài đăng, episode.yaml, research) và ảnh bìa trong branding/"""
    if X.kind in ('kit', 'rick'): return {'id': eid, 'status': '', 'ok': False, 'why': 'kênh này chưa hỗ trợ dọn sâu', 'items': [], 'keep': []}
    d = os.path.join(X.ep, eid); out = os.path.join(X.root, 'out'); st = ''
    yp = os.path.join(d, 'episode.yaml')
    if os.path.exists(yp):
        m = re.search(r'^status:\s*(.*)$', open(yp, encoding='utf-8').read(), re.M); st = m.group(1).strip() if m else ''
    items, keep = [], []
    for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        p = os.path.join(d, f)
        if f == 'DON_SAU.md' or (os.path.isfile(p) and f.lower().endswith(DEEP_KEEP_EXT)) or (os.path.isdir(p) and f in DEEP_KEEP_DIR): keep.append(rel(p)); continue
        items.append(p)
    for dd in [out, os.path.join(out, 'xem')]:
        if os.path.isdir(dd):
            for f in sorted(os.listdir(dd)):
                if f.startswith((eid + '_', 'qa_' + eid + '_')) or f == 'shorts_' + eid: items.append(os.path.join(dd, f))
    items += [os.path.join(X.root, v['p']) for v in short_videos(eid) if not v['p'].startswith(f'out/shorts_{eid}/')]
    bd = os.path.join(X.root, 'branding')
    if os.path.isdir(bd): keep += [rel(os.path.join(bd, f)) for f in sorted(os.listdir(bd)) if f.startswith(('thumb_' + eid + '_', 'thumb_' + eid + '.'))]
    res = [{'p': rel(p), 'size': dsize(p), 'dir': os.path.isdir(p)} for p in items if os.path.exists(p)]
    mk = short_marks(eid); sv = short_videos(eid)
    return {'id': eid, 'status': st, 'ok': st == 'posted', 'why': '' if st == 'posted' else 'chỉ dọn sâu tập đã đánh dấu "đã đăng"',
            'items': sorted(res, key=lambda x: -x['size']), 'size': sum(x['size'] for x in res), 'keep': keep,
            'shorts_unposted': sum(1 for v in sv if not mk.get(v['name']))}


def deep_clean(eid):
    D = deep(eid)
    if not D['ok']: return {'err': D['why']}
    done, freed = [], 0
    for it in D['items']:
        p = os.path.join(X.root, it['p'])
        if not os.path.exists(p): continue
        how = to_trash(p); done.append(it['p']); freed += it['size']
        log_action(f"{eid}: dọn sâu → Thùng rác ({how}) {it['p']} ({it['size'] / 1e6:.0f} MB)")
    day = time.strftime('%Y-%m-%d')
    with open(os.path.join(X.ep, eid, 'DON_SAU.md'), 'a', encoding='utf-8') as fh:
        fh.write(f"# Đã dọn sâu {day}\n\nTập đã đăng; người dùng bấm \"Dọn sâu\" trên trang web. Chỉ còn chữ (kịch bản, dàn ý, bài đăng, episode.yaml, research) và ảnh bìa trong branding/.\n"
                 f"Mọi thứ khác ({freed / 1e9:.2f} GB) đã chuyển vào Thùng rác macOS — muốn dựng lại tập này phải lấy lại từ Thùng rác trước khi dọn Thùng rác.\n\n"
                 + ''.join(f'- {x}\n' for x in done) + '\n')
    with open(os.path.join(X.root, 'STATUS.md'), 'a', encoding='utf-8') as fh:
        fh.write(f"\n- {day} {eid}: DỌN SÂU trên trang web — {len(done)} mục, {freed / 1e9:.2f} GB vào Thùng rác; chỉ còn chữ + ảnh bìa (danh sách: episodes/{eid}/DON_SAU.md)\n")
    return {'ok': True, 'trashed': done, 'freed': freed}


def short_videos(eid):
    out = os.path.join(X.root, 'out')
    return ls(os.path.join(out, f'shorts_{eid}'), {'.mp4'}) + ls(os.path.join(out, 'shorts'), {'.mp4'}, '^' + re.escape(eid) + '_short_')


def short_post_path(eid):
    for f in ('shorts_post.md', 'build/shorts_post.md'):
        p = os.path.join(X.ep, eid, f)
        if os.path.exists(p): return p
    return None


def short_marks_path(eid): return os.path.join(X.ep, eid, 'build', 'shorts_posted.json')


def short_marks(eid):
    p = short_marks_path(eid)
    try: return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    except Exception: return {}


def shorts(eid):
    """danh sách Shorts của tập: mỗi mục (## N. …) trong shorts_post.md + file mp4 tương ứng + đánh dấu đã đăng"""
    if not eid or '/' in eid or not os.path.isdir(os.path.join(X.ep, eid)): return None
    vids = sorted(short_videos(eid), key=lambda x: x['name']); pp = short_post_path(eid); items, intro = [], ''
    if pp:
        txt = open(pp, encoding='utf-8', errors='replace').read()
        parts = re.split(r'^## ', txt, flags=re.M); intro = parts[0]
        for sec in parts[1:]:
            head, _, body = sec.partition('\n'); m = re.match(r'\s*(\d+)[.)]?\s*(.*)', head)
            if not m: intro += '\n## ' + sec if not items else ''; continue
            n = int(m.group(1)); fm = re.search(r'`([^`\n]+\.mp4)`', body); blocks = []; label = ''
            for chunk in re.split(r'(```[^\n]*\n[\s\S]*?```)', body):
                if chunk.startswith('```'):
                    blocks.append({'label': label or 'Khối', 'text': re.sub(r'^```[^\n]*\n|```$', '', chunk).rstrip('\n')}); label = ''
                else:
                    ln = [l.strip() for l in chunk.strip().split('\n') if l.strip() and not re.fullmatch(r'`[^`]+`', l.strip())]
                    if ln: label = re.sub(r'[*_#>]', '', ln[-1]).strip().rstrip(':')
            extra = [l.strip() for l in re.sub(r'```[\s\S]*?```', '', body).split('\n') if l.strip() and not l.strip().startswith('`')]
            items.append({'n': n, 'name': m.group(2).strip(), 'file': fm.group(1) if fm else None, 'blocks': blocks,
                          'notes': [l for l in extra if not any(l.rstrip(':') .endswith(b['label']) for b in blocks)][:3]})
    used = set()
    for it in items:
        v = None
        if it['file']: v = next((x for x in vids if x['name'] == os.path.basename(it['file'])), None)
        if not v: v = next((x for x in vids if re.match(rf"^(0?{it['n']}_|.*_short_0?{it['n']}_)", x['name']) and x['p'] not in used), None)
        if v: used.add(v['p'])
        it['video'] = v
    for v in vids:   # mp4 chưa có mục trong shorts_post.md
        if v['p'] not in used: items.append({'n': None, 'name': v['name'], 'file': v['p'], 'blocks': [], 'notes': [], 'video': v})
    mk = short_marks(eid)
    for it in items:
        it['key'] = os.path.basename(it['video']['p'] if it['video'] else (it['file'] or f"muc_{it['n']}"))
        it['posted'] = mk.get(it['key'], {})
    return {'id': eid, 'post': rel(pp) if pp else None, 'intro': intro.strip(), 'items': items}


def shorts_all():
    res = []
    for e in sorted(os.listdir(X.ep)):
        if e.startswith(('_', '.')) or not os.path.isdir(os.path.join(X.ep, e)): continue
        if not short_post_path(e) and not short_videos(e): continue
        if os.path.exists(os.path.join(X.ep, e, 'DON_SAU.md')) and not short_videos(e): continue   # tập đã dọn sâu
        S = shorts(e); mk = short_marks(e)
        res.append({'id': e, 'n': len(S['items']), 'cut': sum(1 for i in S['items'] if i['video']),
                    'posted': sum(1 for i in S['items'] if i['posted']), 'mtime': max([v['video']['mtime'] for v in S['items'] if v['video']] or [0])})
    return sorted(res, key=lambda x: (x['posted'] >= x['n'] and x['n'] > 0, -x['mtime']))


def log_action(msg):
    open(os.path.join(X.root, 'web_actions.log'), 'a', encoding='utf-8').write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}\n")


def to_trash(p):
    """chuyển vào Thùng rác macOS (khôi phục được tới khi dọn Thùng rác)"""
    tr = os.path.expanduser('~/.Trash'); name = os.path.basename(p); dst = os.path.join(tr, name)
    if os.path.exists(dst): dst = os.path.join(tr, f"{name} {time.strftime('%H-%M-%S')}")
    try:
        shutil.move(p, dst); return 'trash'
    except (PermissionError, OSError):
        import subprocess
        r = subprocess.run(['osascript', '-e', f'tell application "Finder" to delete (POSIX file "{p}")'], capture_output=True, text=True)
        if r.returncode: raise RuntimeError('không chuyển được vào Thùng rác: ' + (r.stderr or '').strip()[:200])
        return 'finder'


def set_status(eid, status, link='', platform='YouTube'):
    d = os.path.join(X.ep, eid); yp = os.path.join(d, 'episode.yaml'); stamp = time.strftime('%Y%m%d-%H%M%S'); day = time.strftime('%Y-%m-%d')
    if X.kind in ('kit', 'rick') and not os.path.exists(yp):   # tập cũ của kênh kit chưa có episode.yaml: tạo bản tối thiểu rồi ghi như mọi kênh
        open(yp, 'w', encoding='utf-8').write(f'# Tạo bởi trang web studio {day} (tập cũ chưa có episode.yaml). Lời đọc: script.md · giọng: voice/voice.json\nid: {eid}\ntitle: "{kit_title(d, eid)}"\nstatus: {kit_status(d) or "draft"}\n')
    if not os.path.exists(yp): raise RuntimeError('tập chưa có episode.yaml')
    bd = os.path.join(X.root, '_to_delete', 'web_bak', 'episodes', eid); os.makedirs(bd, exist_ok=True)
    shutil.copy2(yp, os.path.join(bd, f'episode.yaml.{stamp}'))
    y = open(yp, encoding='utf-8').read()
    y = re.sub(r'^status:.*$', f'status: {status}', y, count=1, flags=re.M) if re.search(r'^status:', y, re.M) else re.sub(r'^(title:.*)$', rf'\1\nstatus: {status}', y, count=1, flags=re.M)
    open(yp, 'w', encoding='utf-8').write(y)
    if status == 'posted' and link:
        pp = os.path.join(d, 'post.md')
        if os.path.exists(pp):
            shutil.copy2(pp, os.path.join(bd, f'post.md.{stamp}'))
            open(pp, 'a', encoding='utf-8').write(f'| {platform} | {day} | {link} |\n')
    bp = os.path.join(X.root, 'backlog.csv')
    if os.path.exists(bp):
        lines = open(bp, encoding='utf-8').read().split('\n'); hdr = next(csv.reader([lines[0]])); si = hdr.index('status') if 'status' in hdr else -1
        for i, l in enumerate(lines[1:], 1):
            if l.startswith(eid + ',') and si >= 0:
                row = next(csv.reader([l])); row[si] = {'approved': 'approved', 'posted': 'posted'}.get(status, status) + (f' {day}' if status == 'posted' else '')
                import io; s = io.StringIO(); csv.writer(s, lineterminator='').writerow(row)
                shutil.copy2(bp, os.path.join(X.root, '_to_delete', 'web_bak', f'backlog.csv.{stamp}')); lines[i] = s.getvalue()
                open(bp, 'w', encoding='utf-8').write('\n'.join(lines)); break
    word = {'approved': 'đã duyệt', 'posted': 'đã đăng'}.get(status, status)
    open(os.path.join(X.root, 'STATUS.md'), 'a', encoding='utf-8').write(f"- {day} {eid}: người dùng đánh dấu {word} trên trang web{(' — ' + platform + ' ' + link) if link else ''}.\n")
    log_action(f'{eid}: status → {status} {link}')


class H(BaseHTTPRequestHandler):
    def log_message(self, fmt, *a): pass

    def send_json(self, obj, code=200):
        b = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code); self.send_header('Content-Type', 'application/json; charset=utf-8'); self.send_header('Content-Length', str(len(b))); self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(b)

    def body(self):
        n = int(self.headers.get('Content-Length') or 0); return json.loads(self.rfile.read(n) or b'{}')

    def do_GET(self):
        u = urlparse(self.path); q = parse_qs(u.query); path = u.path
        c = q.get('ch', [''])[0]; X.ch = c if c in CHANNELS else 'example'
        try:
            if path == '/api/channels': return self.send_json([{'id': k, 'name': v['name'], 'kind': v['kind']} for k, v in CHANNELS.items() if os.path.isdir(v['root'])])
            if path in ('/', '/index.html'):
                b = open(UI, 'rb').read(); self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(b))); self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(b); return
            if path == '/api/episodes': return self.send_json(episodes())
            if path == '/api/recent': return self.send_json(recent())
            if path == '/api/ep':
                r = episode(q.get('id', [''])[0]); return self.send_json(r) if r else self.send_json({'err': 'không có tập này'}, 404)
            if path == '/api/text':
                p = safe(q.get('p', [''])[0])
                if not p or not os.path.isfile(p) or os.path.splitext(p)[1] not in TEXT_EXT: return self.send_json({'err': 'không mở được file này'}, 403)
                return self.send_json({'p': rel(p), 'text': open(p, encoding='utf-8', errors='replace').read(), 'mtime': os.path.getmtime(p)})
            if path == '/api/lsaudio':   # liệt kê file giọng trong thư mục người dùng chọn (ví dụ ~/Downloads) — chỉ tên + cỡ, không đọc nội dung
                d = os.path.realpath(os.path.expanduser(q.get('dir', [''])[0] or '~/Downloads'))
                if not os.path.isdir(d): return self.send_json({'err': f'không thấy thư mục {d}'}, 404)
                fs = [{'name': f, 'size': os.path.getsize(os.path.join(d, f)), 'mtime': os.path.getmtime(os.path.join(d, f))} for f in os.listdir(d) if os.path.splitext(f)[1].lower() in AUDIO_EXT and os.path.isfile(os.path.join(d, f))]
                return self.send_json({'dir': d, 'files': sorted(fs, key=lambda x: -x['mtime'])[:200]})
            if path == '/api/shorts':
                r = shorts(q.get('id', [''])[0]); return self.send_json(r) if r else self.send_json({'err': 'không có tập này'}, 404)
            if path == '/api/shortsall': return self.send_json(shorts_all())
            if path == '/api/docs': return self.send_json(RK.doclist(X.root) if X.kind == 'rick' else [])   # trang Tài liệu của kênh người que 3D
            if path == '/api/heavy': return self.send_json(heavy(q.get('id', [''])[0]))
            if path == '/api/deep':
                e = q.get('id', [''])[0]
                return self.send_json(deep(e)) if e and '/' not in e and os.path.isdir(os.path.join(X.ep, e)) else self.send_json({'err': 'không có tập này'}, 404)
            if path == '/api/heavyall':
                res = []
                for e in sorted(os.listdir(X.ep)):
                    if os.path.isdir(os.path.join(X.ep, e)) and not e.startswith(('_', '.')):
                        h = heavy(e); it = h['items']
                        res.append({'id': e, 'status': h['status'], 'size': sum(i['size'] for i in it), 'n': len(it),
                                    'safe': sum(i['size'] for i in it if not i['warn'] and not i.get('keep') and i['kind'] != 'final'),
                                    'final': sum(i['size'] for i in it if i['kind'] == 'final' and not i['warn']),
                                    'deep': deep(e).get('size', 0) if h['status'] == 'posted' and X.kind not in ('kit', 'rick') else 0})
                td = os.path.join(X.root, '_to_delete')
                return self.send_json({'eps': sorted(res, key=lambda x: -x['size']), 'to_delete': RK.trash_size(X.root) if X.kind == 'rick' else dsize(td) if os.path.isdir(td) else 0})
            if path.startswith('/f/'):   # /f/<kênh>/<đường dẫn trong kênh>  (không có tên kênh = Kênh Mẫu, giữ link cũ)
                r = path[3:]; first = unquote(r.split('/', 1)[0])
                if first in CHANNELS: X.ch = first; r = r.split('/', 1)[1] if '/' in r else ''
                return self.send_file(r)
            self.send_json({'err': 'không có'}, 404)
        except Exception as e:
            self.send_json({'err': str(e)}, 500)

    def send_file(self, r):
        p = safe(r)
        if not p or not os.path.isfile(p): return self.send_json({'err': 'không mở được file này'}, 403)
        size = os.path.getsize(p); ctype = mimetypes.guess_type(p)[0] or 'application/octet-stream'
        if ctype.startswith('text/') or p.endswith(('.srt', '.md', '.yaml', '.log')): ctype = 'text/plain; charset=utf-8'
        rng = self.headers.get('Range'); start, end = 0, size - 1
        m = re.match(r'bytes=(\d*)-(\d*)', rng or '')
        if m:
            if m.group(1): start = int(m.group(1)); end = int(m.group(2)) if m.group(2) else size - 1
            elif m.group(2): start = size - int(m.group(2))
            end = min(end, size - 1)
            self.send_response(206); self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        else: self.send_response(200)
        self.send_header('Content-Type', ctype); self.send_header('Accept-Ranges', 'bytes'); self.send_header('Content-Length', str(end - start + 1))
        if 'dl' in self.path: self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(p)}"')
        self.end_headers()
        with open(p, 'rb') as f:
            f.seek(start); left = end - start + 1
            try:
                while left > 0:
                    b = f.read(min(1 << 20, left))
                    if not b: break
                    self.wfile.write(b); left -= len(b)
            except (BrokenPipeError, ConnectionResetError): pass

    def do_POST(self):
        u = urlparse(self.path)
        try:
            b = self.body(); c = b.get('ch') or parse_qs(u.query).get('ch', [''])[0]; X.ch = c if c in CHANNELS else 'example'
            if u.path == '/api/save':
                p = safe(b.get('p', ''))
                if not p or os.path.splitext(p)[1] not in {'.md', '.yaml', '.txt', '.csv'}: return self.send_json({'err': 'không được sửa file này'}, 403)
                if os.path.exists(p) and abs(os.path.getmtime(p) - float(b.get('mtime') or 0)) > 0.001:
                    return self.send_json({'err': 'conflict', 'msg': 'File đã bị sửa (có thể Claude vừa sửa) từ lúc bạn mở. Tải lại rồi sửa tiếp — bản của bạn chưa ghi.'}, 409)
                stamp = time.strftime('%Y%m%d-%H%M%S')
                if os.path.exists(p):
                    bd = os.path.join(X.root, '_to_delete', 'web_bak', os.path.dirname(rel(p))); os.makedirs(bd, exist_ok=True)
                    shutil.copy2(p, os.path.join(bd, f'{os.path.basename(p)}.{stamp}'))
                old = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
                open(p, 'w', encoding='utf-8').write(b.get('text', ''))
                m = re.match(r'episodes/([^/]+)/', rel(p)); mr = re.match(r'engine/films/([^/]+)/', rel(p)) if X.kind == 'rick' else None
                if mr: open(os.path.join(X.ep, mr.group(1), 'web_edits.log'), 'a', encoding='utf-8').write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} người dùng sửa {rel(p)} trên trang web ({len(old)} → {len(b.get('text', ''))} ký tự; bản cũ: _to_delete/web_bak/{rel(p)}.{stamp})\n")
                if m:
                    lp = os.path.join(X.ep, m.group(1), 'build', 'web_edits.log'); os.makedirs(os.path.dirname(lp), exist_ok=True)
                    open(lp, 'a', encoding='utf-8').write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} người dùng sửa {rel(p)} trên trang web ({len(old)} → {len(b.get('text', ''))} ký tự; bản cũ: _to_delete/web_bak/{rel(p)}.{stamp})\n")
                return self.send_json({'ok': True, 'mtime': os.path.getmtime(p)})
            if u.path == '/api/trash':   # chuyển vào Thùng rác macOS — chỉ những mục có trong danh sách heavy() của tập, hoặc cả thư mục _to_delete
                eid = b.get('id', ''); done, freed = [], 0
                allowed = ({'_to_delete'} | set(RK.TRASHES) if X.kind == 'rick' else {'_to_delete'}) if eid == '_to_delete' else {i['p'] for i in heavy(eid)['items']} if eid and '/' not in eid and os.path.isdir(os.path.join(X.ep, eid)) else set()
                paths = b.get('paths', []) + (['engine/_to_delete'] if X.kind == 'rick' and eid == '_to_delete' and b.get('paths') == ['_to_delete'] else [])   # dự án người que 3D có hai chỗ cất đồ bỏ
                for r in paths:
                    if r not in allowed: continue
                    p = os.path.join(X.root, r)
                    if not os.path.exists(p): continue
                    sz = dsize(p); how = to_trash(p); done.append(r); freed += sz
                    if r in ('_to_delete', 'engine/_to_delete'): os.makedirs(p, exist_ok=True)
                    log_action(f'{eid}: chuyển vào Thùng rác ({how}) {r} ({sz / 1e6:.0f} MB)')
                return self.send_json({'ok': True, 'trashed': done, 'freed': freed})
            if u.path == '/api/deepclean':   # dọn sâu tập đã đăng: chỉ giữ chữ + ảnh bìa
                eid = b.get('id', '')
                if not eid or '/' in eid or not os.path.isdir(os.path.join(X.ep, eid)): return self.send_json({'err': 'không có tập này'}, 400)
                r = deep_clean(eid); return self.send_json(r, 400 if r.get('err') else 200)
            if u.path == '/api/shortmark':   # đánh dấu một Short đã đăng trên nền tảng nào (ghi build/shorts_posted.json)
                eid, key, plat = b.get('id', ''), os.path.basename(b.get('key', '')), b.get('platform', '')
                if b.get('all') and eid and '/' not in eid and os.path.isdir(os.path.join(X.ep, eid)):   # tích / bỏ tích cả YouTube + TikTok cho mọi Short đã cắt của tập
                    mk = short_marks(eid); day = time.strftime('%Y-%m-%d'); keys = [v['name'] for v in short_videos(eid)]
                    for k in keys:
                        cur = mk.get(k, {})
                        for pl in ('YouTube', 'TikTok'):
                            if b.get('on'): cur.setdefault(pl, day)
                            else: cur.pop(pl, None)
                        if cur: mk[k] = cur
                        else: mk.pop(k, None)
                    p = short_marks_path(eid); os.makedirs(os.path.dirname(p), exist_ok=True)
                    json.dump(mk, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
                    log_action(f"{eid}: {'đánh dấu' if b.get('on') else 'bỏ đánh dấu'} cả {len(keys)} Short đã đăng YouTube + TikTok")
                    return self.send_json({'ok': True, 'n': len(keys)})
                if not eid or '/' in eid or not os.path.isdir(os.path.join(X.ep, eid)) or not key or plat not in ('YouTube', 'TikTok', 'Facebook'): return self.send_json({'err': 'không hợp lệ'}, 400)
                mk = short_marks(eid); cur = mk.get(key, {})
                if b.get('on'): cur[plat] = time.strftime('%Y-%m-%d')
                else: cur.pop(plat, None)
                if cur: mk[key] = cur
                else: mk.pop(key, None)
                p = short_marks_path(eid); os.makedirs(os.path.dirname(p), exist_ok=True)
                json.dump(mk, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
                log_action(f"{eid}: Short {key} {'đã đăng' if b.get('on') else 'bỏ đánh dấu'} {plat}")
                return self.send_json({'ok': True, 'posted': cur})
            if u.path == '/api/mark':
                st = b.get('status'); eid = b.get('id', '')
                if st not in ('approved', 'posted') or not eid or '/' in eid or not os.path.isdir(os.path.join(X.ep, eid)): return self.send_json({'err': 'không hợp lệ'}, 400)
                set_status(eid, st, (b.get('link') or '').strip(), b.get('platform') or 'YouTube'); return self.send_json({'ok': True})
            if u.path == '/api/copyvoice':   # chép (không di chuyển) file giọng từ thư mục người dùng chọn vào audio/vbee_ui/ của tập
                eid = b.get('id', ''); d = os.path.join(X.ep, eid)
                if not eid or '/' in eid or not os.path.isdir(d): return self.send_json({'err': 'không có tập này'}, 404)
                src = os.path.realpath(os.path.expanduser(b.get('dir', ''))); dst = os.path.join(d, 'voice' if X.kind == 'kit' else 'audio', 'vbee_ui'); os.makedirs(dst, exist_ok=True)
                done = []
                for it in b.get('files', []):
                    name, to = os.path.basename(it.get('name', '')), os.path.basename(it.get('to') or it.get('name', ''))
                    if os.path.splitext(name)[1].lower() not in AUDIO_EXT or os.path.splitext(to)[1].lower() not in AUDIO_EXT: continue
                    sp, tp = os.path.join(src, name), os.path.join(dst, to)
                    if not os.path.isfile(sp): continue
                    if os.path.exists(tp):
                        bd = os.path.join(X.root, '_to_delete', 'web_bak', rel(dst)); os.makedirs(bd, exist_ok=True)
                        shutil.copy2(tp, os.path.join(bd, f"{to}.{time.strftime('%Y%m%d-%H%M%S')}"))
                    shutil.copy2(sp, tp); done.append(to)
                if done:
                    lp = os.path.join(d, 'build', 'web_edits.log'); os.makedirs(os.path.dirname(lp), exist_ok=True)
                    open(lp, 'a', encoding='utf-8').write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} người dùng chép giọng vào {rel(dst)}/: {', '.join(done)} (từ {src}) — chờ Claude cắt bằng vbee_ui_split.py\n")
                return self.send_json({'ok': True, 'copied': done})
            self.send_json({'err': 'không có'}, 404)
        except Exception as e:
            self.send_json({'err': str(e)}, 500)


if __name__ == '__main__':
    print(f"Studio ({', '.join(v['name'] for v in CHANNELS.values())}): http://127.0.0.1:{PORT}  (Ctrl+C để tắt)")
    ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()

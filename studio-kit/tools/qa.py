#!/usr/bin/env python3
"""Kiểm tra máy móc dùng chung mọi kênh (studio-kit; gốc: kênh mẫu 13/11/2026). Không thay mắt người soát: chỉ bắt lỗi đo được
và sinh sẵn ảnh để soát. Luật gốc: studio-kit/DIRECTOR.md, TECHNIQUE.md, references/tu-soat.md. Chạy từ thư mục kênh
(hoặc đặt QA_CHANNEL=<thư mục kênh>): python3 ../studio-kit/tools/qa.py …

  python3 tools/qa.py script <tập|script.md>
  python3 tools/qa.py rig    <thư mục dựng> [--hh 760] [--no-dump] [--quiet]       → chạy tools/rig_gate.py (cùng mã thoát)
  python3 tools/qa.py video  <clip.mp4> [--style <slug>] [--starts 0,44,141.7] [--chapters 00,01,02]
                             [--ep <tập>] [--offset GIÂY | --shot ID] [--at t1,t2] [--no-images] [--out DIR] [--metrics file.json]
  python3 tools/qa.py gate   <clip.mp4> [--no-page] [+ mọi cờ của video]           → cổng gửi bản xem, ghi <clip>.gate.json
  python3 tools/qa.py gate   <tập> --chapter N [--clip clip.mp4]                   → kiểu cũ: chỉ kiểm review_log
  python3 tools/qa.py full   <tập> [--file out/<id>_bio-long.mp4]
  python3 tools/qa.py srt    <file.srt>

<tập> = thư mục episodes/<id> hoặc chỉ <id>. Mã thoát: 0 = không có LỖI (có thể có CẢNH BÁO / MIỄN), 1 = có LỖI.
Chỉ cần python3 + numpy + ffmpeg/ffprobe (gate thêm node cho rig/pagecheck); không gọi mạng, không gọi VBee.

VIDEO (13/11/2026, sau khi người dùng bác bản xem Đài Loan: "chất lượng chưa đạt") — đứng im và khung trống giờ là LỖI, thêm thước chuyển động,
chi tiết, màu; ngưỡng theo style ở studio-kit/styles/<slug>/qa.json (tự nhận từ đường dẫn clip có /build/<slug>/, hoặc --style).
Clip KHÔNG thuộc style nào có qa.json (vd kênh mẫu): V1, V2, V6, V7 chỉ là CẢNH BÁO như trước — mức chặn chỉ áp cho style đã hiệu chuẩn.
Hiệu chuẩn: phim mẫu Lemo phải 0 lỗi, bản bị bác xem-3-chuong-v2 phải hỏng. Mỗi phát hiện in: mã · mốc · chương · số đo · ngưỡng · cách sửa.
  V1 đứng im (freezedetect vùng giữa)   V2 đoạn gần như không động   V3 cửa sổ 10 s ít khung động · V3C tỉ lệ khung động cả chương
  V4 trung vị điểm ảnh đổi/chương   V5 sự kiện động mạnh/phút · V5G khoảng hở giữa chúng   V6 vùng phẳng trung bình chương · V6B mảng phẳng liền lớn nhất
  V7 đoạn ≥ 3 s khung trống   V8 mật độ nét trung bình · V8P p10   V9 bão hoà · V10 độ sáng (chỉ cảnh báo)
  V11 khung đen / chèn khung tối / chớp sáng / không tiếng   V12 cắt giữa câu (cảnh báo, cần --ep)
Chương: --starts (giây) hoặc file <tên>.txt mà core/assemble.py ghi cạnh clip (danh sách chNN_video.mp4); không có → cả clip là một chương.

MIỄN TRỪ: một phát hiện chỉ được bỏ qua bằng một dòng trong <thư mục dựng>/review_log.md dưới đề mục "## Miễn trừ"
(hoặc "## Miễn trừ — <tên clip>" nếu mốc chỉ đúng cho một clip):
    - V7 02:41–02:46: bản đồ eo biển toàn cảnh, tàu đang vào khung
Khớp khi cùng mã và khoảng miễn phủ ≥ 50 % khoảng của phát hiện (mốc theo giây của clip). MỖI DÒNG CHỈ MIỄN MỘT phát hiện (cái trùng nhiều
giây nhất) — một dòng "00:00–04:00" không xoá được cả loạt. Tối đa 3 dòng mỗi chương — hơn là LỖI M1; dòng không khớp gì là cảnh báo M2.
Không miễn được: V11, R1, P0, P8, P9, G1, M1. Phát hiện được miễn in là MIỄN và không làm hỏng cổng.

GATE <clip> (cổng C5 — core/preview.sh từ chối nén bản gửi khi chưa qua): chạy lần lượt
  1. cổng rig (R1) nếu thư mục dựng có parts/index.json + chapters/cast.spec.js;
  2. mọi kiểm tra của `video`;
  3. cổng trang core/pagecheck.mjs (P1–P9; P0 = không kiểm được, vd engine cũ thiếu window.QA) cho các chương của clip, khi thư mục
     dựng có index.html + chapters/ch<khoá>.js (style có ngưỡng "page" mà thư mục dựng thiếu index.html → P0, không phải bỏ qua). --no-page bỏ bước này để xem nhanh (vd trong sandbox) nhưng khi đó cổng KHÔNG ĐẠT (P0);
     chapters/ch<khoá>.js sửa SAU khi clip render → cảnh báo P0 (số đo trang không còn là của clip này);
  4. yêu cầu review_log (G1, giữ từ cổng cũ): có review_log.md; mỗi chương của clip có vòng soát "## Chương N … (YYYY-MM-DD HH:MM)";
     vòng cuối có dòng "Điểm:" mọi mục ≥ 8 HOẶC dòng "Soát mắt…" không có chữ HỎNG; vòng cuối ghi "sha256 <≥ 8 ký tự đầu>" của clip,
     nếu không ghi thì file hình của chương (out/ch<khoá>_video.mp4, không có thì chính clip) không được mới hơn lần soát quá 60 s;
  5. áp miễn trừ, ghi <clip>.gate.json {sha256, ok, errors, warnings, waived, when, thresholds: {file, sha256}}; thoát 1 nếu chưa ok.
Kiểu cũ `gate <tập> --chapter N [--clip]` vẫn chạy như trước (chỉ bước review_log với thang điểm 1–10, thiếu "Lỗi nặng nhất" = cảnh báo).

KHÔNG bắt được (phải soát bằng mắt trên dải ảnh): nhân vật giật/reset tư thế trong cùng bối cảnh, zoom thay cho
hành động (thước chuyển động đếm cả đẩy máy và mờ chồng — là điều kiện cần, không đủ), nền chỉ có hoa văn lặp (đo 'khung trống' chỉ bắt
vùng phẳng), hình không đúng lời, biểu cảm, bố cục, cảnh đánh có đẹp như mẫu không.
"""
import argparse, hashlib, json, os, re, shutil, subprocess, sys, tempfile, time

HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.dirname(HERE)
CH = os.path.abspath(os.environ.get('QA_CHANNEL') or os.getcwd())   # thư mục kênh (chạy từ đó, hoặc QA_CHANNEL)
ERR, WARN = [], []
FIND = []                                                            # phát hiện có mã (video/gate): xem find()


def err(msg): ERR.append(msg)
def warn(msg): WARN.append(msg)


def ep_dir(arg):
    for p in (arg, os.path.join(CH, 'episodes', arg)):
        if os.path.isdir(p): return os.path.abspath(p)
    sys.exit(f'Không thấy tập: {arg}')


def mmss(t):
    t = max(0.0, t); return f'{int(t // 60):02d}:{t % 60:05.2f}'


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def report(title):
    print(f'\n=== {title} ===')
    for m in ERR: print(f'LỖI      {m}')
    for m in WARN: print(f'CẢNH BÁO {m}')
    print(f'--- {len(ERR)} lỗi, {len(WARN)} cảnh báo')
    sys.exit(1 if ERR else 0)


# ---------------------------------------------------------------- script
SHORT_NAMES = {'Tháo': ('Tào',), 'Vũ': ('Quan',), 'Lượng': ('Cát',), 'Bị': ('Lưu',), 'Bố': ('Lữ', 'Lã')}  # hanh-van §2.5 — Lữ Bố/Lã Bố đều là tên đủ
SHORT_OK_AFTER = {'Vũ': (' Đế', ' Hầu', ' Vương')}  # Ngụy Vũ Đế, Hán Vũ Đế, Vũ Hầu… không phải gọi tắt (sửa 13/11)
BANNED = [  # (regex, lời nhắc) — hanh-van §3
    (r'\blúc nãy\b', 'nhắc chuyện đã kể ("lúc nãy") — mỗi mục phải tự đủ nghĩa'),
    (r'\bnhư (tôi|mình) đã hứa\b', '"như tôi đã hứa"'),
    (r'\bbạn còn nhớ\b', '"bạn còn nhớ… không"'),
    (r'\b(tập|video) trước\b', 'nhắc tập trước'),
    (r'\btrận thứ (hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|\d+)\b', 'bộ đếm "trận thứ N" (chỉ được khi là chuyện trong truyện, không phải đếm mục)'),
    (r'\b(nhìn|xem) (lên |vào )?(trên )?màn hình\b', 'bảo người xem nhìn màn hình'),
    (r'\bnếu bạn (đã )?từng (xem|đọc)\b', 'mở bằng "Nếu bạn từng xem/đọc" (cau-truc: dùng cold open)'),
    (r'\b(boss|combat|buff|nerf|combo|noob|let\'?s go)\b', 'từ game/tiếng Anh'),
    (r'(?<![\w])OP(?![\w])', 'từ game "OP"'),
    (r'\b(giật lấy|đập nhau|gan dạ|đoan trang|phận mỏng)\b', 'từ văn viết (hanh-van §2.3 → dùng từ đời thường)'),
]
CONJ = re.compile(r'\b(thì|nên là|thế là|nhưng mà|tại vì|tức là|luôn|đấy|thôi|rồi|xong)\b', re.I)
NOTE = re.compile(r'\*\[[^\]]*\]\*|\[hình[^\]]*\]')


def narration(path):
    """[(số dòng, đề mục, câu đọc)] — bỏ đề mục, ghi chú > và [hình]."""
    out, head = [], ''
    for i, raw in enumerate(open(path, encoding='utf-8'), 1):
        s = raw.strip()
        if s.startswith('#'): head = s.lstrip('#').strip(); continue
        if re.search(r'không đọc|ghi chú', head, re.I): continue      # mục ghi chú cho người duyệt
        if not s or s.startswith('>') or s.startswith('---') or s.startswith('|'): continue
        s = NOTE.sub('', s).strip()
        s = re.sub(r'^\*\*[^*]+\*\*\s*[:：]?\s*', '', s)  # "**Tào Tháo:** …" → lời thoại
        if s and not s.startswith('*'): out.append((i, head, s))
    return out


def cmd_script(a):
    p = a.target if a.target.endswith('.md') else os.path.join(ep_dir(a.target), 'script.md')
    lines = narration(p)
    if not lines: sys.exit(f'Không đọc được lời nào trong {p}')
    total_syl, chars, sec, longs = 0, 0, {}, []
    for n, head, s in lines:
        for rx, why in BANNED:
            for m in re.finditer(rx, s, re.I if not rx.startswith('(?<') else 0):
                err(f'dòng {n}: {why}: "…{s[max(0, m.start() - 25):m.end() + 25]}…"')
        for short, sur in SHORT_NAMES.items():
            for m in re.finditer(rf'(?<![\w]){short}(?![\w])', s):
                before = s[:m.start()].rstrip()
                if any(before.endswith(x) for x in sur): continue          # Tào Tháo, Gia Cát Lượng, Lã Bố…
                if s[m.end():].startswith(SHORT_OK_AFTER.get(short, ())): continue  # Ngụy Vũ Đế…
                if short in ('Bị', 'Bố') and (not before or before[-1] in '.?!:"“'): continue  # "Bị…" đầu câu = động từ
                err(f'dòng {n}: gọi tắt "{short}" (đọc đủ tên): "…{s[max(0, m.start() - 25):m.end() + 25]}…"')
        if re.search(r'\d+\s*[–-]\s*\d+', s):
            warn(f'dòng {n}: khoảng số "{re.search(r"[0-9]+ *[–-] *[0-9]+", s).group()}" — đọc bằng chữ cho tự nhiên ("khoảng bảy năm")')
        for sent in re.split(r'(?<=[.?!…])\s+', s):
            k = len(sent.split())
            if k > 35: longs.append((k, n, sent))
        syl = len(s.split()); total_syl += syl; chars += len(s)
        sec.setdefault(head, [0, 0, 0])
        sec[head][0] += syl; sec[head][1] += len(CONJ.findall(s)); sec[head][2] += 1
    print(f'Kịch bản: {p}\nLời đọc: {total_syl} tiếng · ~{chars} ký tự VBee (trước pronounce) · '
          f'ước {total_syl / 205 * 1.06:.1f} phút (tiếng/205 × 1,06)')
    print(f'{"mục":38} {"tiếng":>6} {"ước giây":>8} {"từ nối":>7}')
    for head, (syl, conj, _) in sec.items():
        secs = syl / 205 * 60 * 1.06
        print(f'{head[:38]:38} {syl:6d} {secs:8.0f} {conj:7d}')
        h = head.lower()
        for key, lim in (('mở đầu', 30), ('kết', 40)):
            if h.startswith(key) and secs > lim * 1.1: err(f'mục "{head}": ước ~{secs:.0f} s > {lim} s (cau-truc)')
            elif h.startswith(key) and secs > lim: warn(f'mục "{head}": ước ~{secs:.0f} s, sát giới hạn {lim} s — đo lại khi có giọng')
        if syl >= 80 and conj == 0: warn(f'mục "{head}": không có từ nối văn nói nào (hanh-van §2.1) — dễ nghe như văn viết')
    if longs:
        longs.sort(reverse=True)
        warn(f'{len(longs)} câu dài > 35 tiếng (VBee: câu ngắn ~9–12 tiếng, gom 2–3 câu một ý). Dài nhất: '
             + ' · '.join(f'dòng {n} ({k} tiếng)' for k, n, _ in longs[:3]))
    n_cham = sum(len(re.findall(r'chấm điểm', s, re.I)) for _, _, s in lines)
    if n_cham > 2: warn(f'"chấm điểm" xuất hiện {n_cham} lần — không mở mọi mục giống nhau (cau-truc)')
    report('script')


# ---------------------------------------------------------------- video
def probe(f):
    p = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames',
             '-of', 'json', f])
    if p.returncode: sys.exit(f'ffprobe không đọc được {f} (file hỏng/chưa render xong?):\n{p.stderr.strip()}')
    j = json.loads(p.stdout); v = next((s for s in j['streams'] if s['codec_type'] == 'video'), None)
    n, d = (v['r_frame_rate'].split('/') if v else ('0', '1'))
    return {'dur': float(j['format']['duration']), 'w': v and v['width'], 'h': v and v['height'],
            'fps': float(n) / float(d or 1), 'audio': any(s['codec_type'] == 'audio' for s in j['streams']),
            'frames': v and v.get('nb_frames')}


def analyse(f, info, tmp, phone=None):
    """MỘT lượt giải mã cho mọi thước: khung đen, đứng im ở vùng giữa, độ sáng từng khung, điểm cắt cảnh (480 px), và hai luồng thô ghi ra
    file tạm: xám 12 khung/giây 320 px (chuyển động) + RGB 2 khung/giây 480 px (chi tiết, màu). phone = mẫu tên ảnh ghép 360 px (hoặc None)."""
    ar = (info['h'] or 9) / (info['w'] or 16)
    w1, h1 = 480, max(2, round(480 * ar / 2) * 2); w2, h2 = 320, max(2, round(320 * ar / 2) * 2)
    yf, sf, mf, rf = (os.path.join(tmp, n) for n in ('y.txt', 's.txt', 'm.raw', 'r.raw'))
    n = 7 if phone else 6
    g = (f'[0:v]scale={w1}:{h1},split={n}[a][b][c][d][e][f]' + ('[p0];' if phone else ';') +
         '[a]blackdetect=d=0.03:pix_th=0.10:pic_th=0.98,nullsink;'
         f'[b]crop=iw*0.6:ih*0.6,freezedetect=n=0.002:d={Q["do"]["freeze_s"]},nullsink;'
         f'[c]signalstats,metadata=print:key=lavfi.signalstats.YAVG:file={yf},nullsink;'
         f'[d]scdet=t=12,metadata=print:key=lavfi.scd.score:file={sf}[o];'
         f'[e]fps=12,scale={w2}:{h2},format=gray[m];[f]fps=2,format=rgb24[r]' +
         (';[p0]fps=1/2,scale=360:-1,tile=4x4[p]' if phone else ''))
    cmd = ['ffmpeg', '-v', 'info', '-nostats', '-nostdin', '-y', '-i', f, '-filter_complex', g, '-map', '[o]', '-f', 'null', '-',
           '-map', '[m]', '-f', 'rawvideo', mf, '-map', '[r]', '-f', 'rawvideo', rf] + (['-map', '[p]', '-q:v', '4', phone] if phone else [])
    p = run(cmd)
    if p.returncode: sys.exit('ffmpeg phân tích lỗi:\n' + p.stderr[-1500:])
    black = [(float(a), float(b)) for a, b in re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', p.stderr)]
    fz_s = [float(x) for x in re.findall(r'freeze_start: ([\d.]+)', p.stderr)]
    fz_e = [float(x) for x in re.findall(r'freeze_end: ([\d.]+)', p.stderr)]
    freeze = list(zip(fz_s, fz_e + [None] * (len(fz_s) - len(fz_e))))

    def series(path, key):
        out, t = [], None
        for line in open(path):
            m = re.search(r'pts_time:([\d.]+)', line)
            if m: t = float(m.group(1)); continue
            m = re.search(key + r'=([\d.]+)', line)
            if m and t is not None: out.append((t, float(m.group(1))))
        return out
    cuts = []
    for t, sc in series(sf, 'lavfi.scd.score'):
        if sc >= 12 and (not cuts or t - cuts[-1] > 0.25): cuts.append(t)   # mờ chồng bị đếm 2 lần → gộp
    return black, freeze, series(yf, 'YAVG'), cuts, (mf, w2, h2), (rf, w1, h1)


def boundaries(ep, offset):
    tl = json.load(open(os.path.join(ep, 'build', 'timeline.json')))
    b = []
    for s in tl['shots']:
        b.append(s['start'])
        for ln in s.get('lines', []):
            for se in ln.get('sents', []) or [ln]:
                b += [se['start'], se['start'] + se['dur']]
    return tl, sorted(x - offset for x in b)


def images(f, times, outdir):
    """Dải 12 khung (từ −0,2 s) tại mỗi mốc: điểm cắt, --at, đầu chương, sự kiện động mạnh — để soát động tác ở mức từng khung."""
    os.makedirs(outdir, exist_ok=True)
    made = []
    for t in sorted(set(round(c, 2) for c in times))[:40]:
        o = os.path.join(outdir, f'strip_{t:07.2f}.jpg')
        run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, t - 0.2):.3f}', '-i', f,
             '-vf', 'scale=320:-1,tile=12x1', '-frames:v', '1', o]); made.append(o)
    return made


# ---- ngưỡng theo style: studio-kit/styles/<slug>/qa.json đè lên bảng mặc định này (xem _ghi_chu trong file đó để biết nghĩa từng khoá)
Q = {
    'do': {'freeze_s': 2.5, 'px': 12, 'dong': 0.01, 'manh': 0.10, 'manh_gap_s': 0.5, 'win_s': 10, 'flat_sd': 4.5, 'flat_block': 24,
           'flat_bot': 0.18, 'edge': 14, 'flat_min_s': 3},
    # Bảng MẶC ĐỊNH (clip không thuộc style nào có qa.json, vd kênh mẫu): CHỈ CẢNH BÁO, như trước 13/11 — ngưỡng chặn phải được hiệu chuẩn trên
    # phim mẫu của chính style đó rồi mới đặt 'err' trong styles/<slug>/qa.json (comic-history đã có). Không đổi thành 'err' ở đây: sẽ làm hỏng cổng của kênh khác.
    'video': {'V1': {'warn': 0}, 'V2': {'warn': 3.5}, 'V6': {'warn': 0.32}, 'V7': {'warn': 0.40}},
    'page': {},
    'mien_tru': {'toi_da_moi_chuong': 3, 'khong_mien': ['V11', 'R1', 'P0', 'P8', 'P9', 'G1', 'M1']},
}
Q_FILE, Q_SHA = None, None
LOW_BAD = {'V3', 'V3C', 'V4', 'V5', 'V8', 'V8P', 'V9', 'P1', 'P3', 'P7'}                 # mã mà số THẤP là hỏng (còn lại: số cao là hỏng)
HINT = {
    'V1': 'cảnh tĩnh: cho rối/đồ vật DIỄN (lấy đà → hành động → dư đà), đổi tư thế theo câu lời; đẩy máy chậm không tính là diễn',
    'V2': 'chia đoạn này thành các nhịp hành động: rối đổi tư thế/đi/giơ tay, vật giấy rơi-dán-đóng dấu; thêm phản ứng của nhân vật kia',
    'V3': '10 s này gần như chỉ có hình đứng: thêm ít nhất 2–3 hành động rối + 1 hiệu ứng giấy (vụn, vệt, rung) trong đoạn',
    'V3C': 'quá nửa thời lượng chương là hình đứng: mỗi câu lời cần một hành động của rối/đồ vật; bỏ các đoạn chỉ có phiếu chữ nằm im',
    'V4': 'cả chương ít chuyển động: dùng nhịp hai cho rối (twos), giữ tư thế có run/thở, thêm lớp nền động (mây, cờ giấy, bụi giấy)',
    'V5': 'thiếu khoảnh khắc mạnh: mỗi ý chính cần một cú (đóng dấu, dán, xé, rơi, đổi cảnh có lực) kèm rung máy/vụn giấy',
    'V5G': 'khoảng dài không có cú mạnh nào: đặt một hành động lớn của vật giấy/tay giấy hoặc đổi cảnh có lực vào giữa đoạn',
    'V6': 'khung thưa: thêm đồ vật/lớp cảnh (≥ 3 lớp sâu), phóng rối to hơn, đưa chủ thể vào giữa; đừng để tường/biển/giấy trơn',
    'V6B': 'một mảng phẳng liền quá lớn: chia mảng đó bằng đồ vật, hoạ tiết giấy, bóng đổ, hoặc đẩy máy vào chủ thể',
    'V7': 'khung trống ≥ 3 s: đưa nhân vật/đồ vật vào vùng trống, thêm chi tiết nền, hoặc cắt cỡ cảnh chặt hơn',
    'V8': 'ít nét: thêm vân giấy, đường khâu, hoạ tiết, đồ vật nhỏ; kiểm tra rối có đủ lớn để thấy chi tiết',
    'V8P': 'có những khung gần như không có nét (tường/biển trơn): rà các cảnh thưa nhất của chương và lấp đầy',
    'V9': 'màu nhạt hơn mẫu nhiều: thêm mảng màu đậm (áo, đồ vật, bản đồ, giấy màu) — chỉ cảnh báo, bảng màu là lựa chọn của kênh',
    'V10': 'độ sáng trung bình lệch khỏi khoảng của style — kiểm tra nền quá tối hoặc quá bạc',
    'V11': 'luật cứng: không khung đen, không chớp trắng, clip phải có tiếng — sửa ở khâu dựng/ghép',
    'V12': 'mở dải ảnh xem từng chỗ cắt có lý do theo lời không (dung-canh §2)',
    'R1': 'chạy `qa.py rig <thư mục dựng>`, mở qa/rig/*.jpg, sửa ghim/khai tay trong chapters/cast.spec.js',
    'P0': 'cổng trang không chạy được — không tính là đạt: xem thông báo, sửa trang/engine (window.QA) rồi chạy lại',
    'G1': 'soát mắt theo references/tu-soat.md rồi ghi vòng soát vào review_log.md (ngày giờ, điểm/soát mắt, sha256 của clip)',
    'M1': 'sửa hình thay vì miễn: tối đa 3 dòng miễn trừ mỗi chương, đúng dạng "- <mã> mm:ss–mm:ss: lý do"',
    'M2': 'dòng miễn trừ không còn khớp phát hiện nào — xoá khỏi review_log.md cho gọn',
}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        for blk in iter(lambda: fh.read(1 << 20), b''): h.update(blk)
    return h.hexdigest()


def load_style(path, slug=None):
    """Nạp ngưỡng: --style <slug> hoặc tự nhận từ đường dẫn có /build/<slug>/. Không có file → dùng bảng mặc định (V1, V2, V6, V7)."""
    global Q_FILE, Q_SHA
    auto = re.search(r'/build/([^/]+)/', os.path.abspath(path) + '/')
    slug = slug or (auto.group(1) if auto else None)
    if not slug: return None
    qf = os.path.join(KIT, 'styles', slug, 'qa.json')
    if not os.path.exists(qf): return None
    j = json.load(open(qf, encoding='utf-8'))
    for k in ('do', 'video', 'page', 'mien_tru'):
        if k in j: Q[k] = {**Q.get(k, {}), **j[k]} if k in ('do', 'mien_tru') else j[k]
    Q_FILE, Q_SHA = qf, sha256(qf)
    return slug


def num(v):
    if v is None: return '?'
    if isinstance(v, int): return str(v)
    v = float(v); a = abs(v)
    return f'{v:.0f}' if a >= 100 else f'{v:.1f}' if a >= 10 else f'{v:.2f}' if a >= 1 else f'{v:.3f}' if a >= 0.01 or a == 0 else f'{v:.4f}'


def find(code, lvl, t0, t1, val, thr, msg, ch=None, unit='', hint=None):
    """Một phát hiện: mã, mức ('err'/'warn'), khoảng thời gian trong clip (giây), chương, số đo, ngưỡng, lời, cách sửa."""
    FIND.append({'code': code, 'lvl': lvl, 't0': round(float(t0), 2), 't1': round(float(t1), 2), 'ch': ch, 'val': val, 'thr': thr,
                 'unit': unit, 'msg': msg, 'hint': hint or HINT.get(code, ''), 'waived': None})


def check(code, val, t0, t1, msg, ch=None, unit='', lim=None):
    """So một số đo với Q['video'][code] = {err, warn}; chiều so theo LOW_BAD. Trả mức ('err'/'warn'/None)."""
    lim = lim if lim is not None else Q['video'].get(code)
    if not lim or val is None: return None
    low = code in LOW_BAD
    for lvl in ('err', 'warn'):
        th = lim.get(lvl)
        if th is None: continue
        if (val < th) if low else (val > th):
            find(code, lvl, t0, t1, val, th, msg, ch, unit); return lvl
    return None


def runs_of(mask, fps, t_off=0.0):
    """[(giây bắt đầu, giây kết thúc)] của các đoạn True liền nhau."""
    out, st = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and st is None: st = i
        elif not v and st is not None: out.append((st / fps + t_off, i / fps + t_off)); st = None
    return out


def motion_profile(raw, total):
    """12 khung/giây, xám 320 px. ch[i] = tỉ lệ điểm ảnh đổi > px mức xám giữa khung i và i+1 (mốc (i+1)/12 s)."""
    import numpy as np
    mf, w, h = raw; D = Q['do']
    y = np.memmap(mf, np.uint8, 'r').reshape(-1, h, w) if os.path.getsize(mf) >= w * h else np.zeros((0, h, w), np.uint8)
    ch = np.zeros(max(0, len(y) - 1), np.float32)
    for i in range(0, len(y) - 1, 600):                              # theo lô, không nạp cả phim vào RAM
        blk = y[i:i + 601].astype(np.int16)
        ch[i:i + len(blk) - 1] = (np.abs(np.diff(blk, axis=0)) > D['px']).mean(axis=(1, 2))
    low = runs_of(ch < D['dong'], 12, 1 / 12)                        # V2: đoạn gần như không động
    mv = (ch > D['dong']).astype(np.float32); W = int(D['win_s'] * 12)   # V3: cửa sổ trượt 10 s, bước 1 s
    if len(mv) >= W:
        cs = np.concatenate([[0], np.cumsum(mv)]); k = np.arange(0, len(mv) - W + 1, 12)
        wins = [(float(i / 12), float(i / 12 + D['win_s']), float((cs[i + W] - cs[i]) / W)) for i in k]
    else: wins = [(0.0, total, float(mv.mean()) if len(mv) else 0.0)]
    strong, last = [], None                                           # V5: sự kiện động mạnh, cách nhau ≥ manh_gap_s
    for i in np.where(ch > D['manh'])[0]:
        if last is None or (i - last) / 12 >= D['manh_gap_s']: strong.append((i + 1) / 12)
        last = i
    return {'ch': ch, 'low': low, 'wins': wins, 'strong': strong}


def detail_profile(raw):
    """2 khung/giây, RGB 480 px. flat = tỉ lệ ô 24 px có độ lệch chuẩn < 4,5 (bỏ 18 % dưới = dải phụ đề); big = mảng ô phẳng LIỀN nhau
    lớn nhất / số ô; edge = tỉ lệ điểm ảnh |dx|+|dy| > 14; sat = S trung bình (HSV); lum = độ sáng trung bình 0–1."""
    import numpy as np
    rf, w, h = raw; D = Q['do']; B = D['flat_block']
    n = os.path.getsize(rf) // (w * h * 3)
    rgb = np.memmap(rf, np.uint8, 'r')[:n * w * h * 3].reshape(n, h, w, 3) if n else np.zeros((0, h, w, 3), np.uint8)
    flat, big, edge, sat, lum = [], [], [], [], []
    hc = int(h * (1 - D['flat_bot'])); hb, wb = hc // B, w // B
    for i in range(0, n, 40):
        x = rgb[i:i + 40].astype(np.float32); g = x @ np.array([.299, .587, .114], np.float32)
        fm = g[:, :hb * B, :wb * B].reshape(len(g), hb, B, wb, B).std(axis=(2, 4)) < D['flat_sd']
        flat += fm.mean(axis=(1, 2)).tolist()
        for m in fm:                                                   # mảng liền lớn nhất (loang 4 hướng trên lưới ô, lưới nhỏ nên vòng lặp thường là đủ)
            seen = np.zeros_like(m); best = 0
            for r0, c0 in zip(*np.nonzero(m)):
                if seen[r0, c0]: continue
                st, k = [(r0, c0)], 0; seen[r0, c0] = True
                while st:
                    r, c = st.pop(); k += 1
                    for rr, cc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= rr < hb and 0 <= cc < wb and m[rr, cc] and not seen[rr, cc]: seen[rr, cc] = True; st.append((rr, cc))
                best = max(best, k)
            big.append(best / (hb * wb))
        gx = np.abs(np.diff(g, axis=2))[:, :-1]; gy = np.abs(np.diff(g, axis=1))[:, :, :-1]
        edge += ((gx + gy) > D['edge']).mean(axis=(1, 2)).tolist()
        mx, mn = x.max(-1), x.min(-1)
        sat += ((mx - mn) / np.maximum(mx, 1)).mean(axis=(1, 2)).tolist(); lum += (g.mean(axis=(1, 2)) / 255).tolist()
    return {k: np.array(v, np.float32) for k, v in (('flat', flat), ('big', big), ('edge', edge), ('sat', sat), ('lum', lum))}


def chapters_of(a, f, dur):
    """[(khoá, bắt đầu, kết thúc)] — --starts, hoặc file <tên>.txt của core/assemble.py (dòng "file '…/chNN_video.mp4'"; độ dài lấy
    từ out/chNN.json 'dur' hoặc ffprobe), hoặc clip một chương chNN(_video).mp4, hoặc cả clip là một chương (khoá None)."""
    keys = a.chapters.split(',') if getattr(a, 'chapters', None) else []
    base = os.path.splitext(os.path.abspath(f))[0]; txt = base + '.txt'; files = []
    if os.path.exists(txt): files = re.findall(r"^file '([^']+)'", open(txt, encoding='utf-8').read(), re.M)
    fkeys = [(re.search(r'ch([0-9A-Za-z]+?)(?:_video)?\.mp4$', os.path.basename(x)) or [None, None])[1] for x in files]
    if getattr(a, 'starts', None):
        st = [float(x) for x in a.starts.split(',')]
        if not keys: keys = fkeys if len(fkeys) == len(st) and all(fkeys) else [f'{i:02d}' for i in range(len(st))]
    elif files:
        st, t = [], 0.0
        for x in files:
            st.append(t); j = re.sub(r'_video\.mp4$', '.json', x)
            if os.path.exists(j): t += json.load(open(j))['dur']
            elif os.path.exists(x): t += probe(x)['dur']
            else: st = None; break
        if st and abs(t - dur) > 1.0: print(f'(bỏ {os.path.basename(txt)}: tổng độ dài các chương {t:.1f} s ≠ clip {dur:.1f} s)'); st = None
        if not st: st = [0.0]; keys = keys or [None]
        elif not keys: keys = fkeys if all(fkeys) else [f'{i:02d}' for i in range(len(st))]
    else:
        m1 = re.match(r'ch([0-9A-Za-z]+?)(?:_video)?$', os.path.basename(base))
        st = [0.0]; keys = keys or [m1.group(1) if m1 else None]
    if len(keys) != len(st): sys.exit(f'--chapters có {len(keys)} khoá nhưng có {len(st)} mốc chương')
    return [(k, s, (st[i + 1] if i + 1 < len(st) else dur)) for i, (k, s) in enumerate(zip(keys, st))]


def chname(k): return 'cả clip' if k is None else f'ch{k}'


def video_checks(a):
    """Mọi kiểm tra trên file video → FIND. Trả (info, chương, bảng số đo theo chương)."""
    import numpy as np
    f = a.target; info = probe(f); load_style(f, a.style)
    print(f'Clip: {f}\n{info["w"]}×{info["h"]} · {info["fps"]:.2f} fps · {info["dur"]:.2f} s · tiếng: {"có" if info["audio"] else "KHÔNG"}'
          f' · ngưỡng: {os.path.relpath(Q_FILE, KIT) if Q_FILE else "mặc định (không có qa.json của style)"}')
    if Q_FILE and (info['h'] or 0) < 1000:                           # ngưỡng style hiệu chuẩn trên bản gốc 1080p; bản nén làm V5/V6/V8 xấu đi (xem 'bien' trong qa.json)
        print(f'CHÚ Ý: clip cao {info["h"]} px — ngưỡng hiệu chuẩn trên bản gốc 1080p; bản nén nhỏ làm sự kiện mạnh và nét tụt. Chấm bản gốc, không chấm bản _xem.')
    dur = info['dur']; chs = chapters_of(a, f, dur)
    which = lambda t: next((k for k, s, e in chs if s <= t < e), chs[-1][0])
    if not info['audio']: find('V11', 'err', 0, dur, None, None, 'clip không có track tiếng')
    out = a.out or os.path.join(os.path.dirname(os.path.abspath(f)), 'qa_' + os.path.splitext(os.path.basename(f))[0])
    if not a.no_images: os.makedirs(out, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix='qa_'); t0 = time.time()
    try:
        black, freeze, yavg, cuts, mraw, rraw = analyse(f, info, tmp, None if a.no_images else os.path.join(out, 'phone_%02d.jpg'))
        M = motion_profile(mraw, dur); Dt = detail_profile(rraw)
    finally: shutil.rmtree(tmp, ignore_errors=True)                  # chỉ là file tạm của chính lượt đo này
    ch = M['ch']; D = Q['do']; V = Q['video']
    # ---- V11: khung đen, chèn khung tối, chớp sáng (luật cứng, không miễn)
    for s, e in black: find('V11', 'err', s, e, (e - s) * 1000, 0, 'khung đen — luật: không chèn khung đen', which(s), ' ms')
    run_s, last = None, None                      # dự phòng: chuỗi khung tối hẳn (≤ 0,5 s) chen giữa hai khung sáng
    for t, y in yavg:
        if y <= 20 and run_s is None and last is not None and last > 35: run_s = t
        elif y > 20 and run_s is not None:
            if t - run_s <= 0.5 and not any(abs(run_s - b) < 0.1 for b, _ in black):
                find('V11', 'err', run_s, t, round((t - run_s) * info['fps']), 0, 'chèn khung tối hẳn — luật: không chèn khung đen', which(run_s), ' khung')
            run_s = None
        last = y
    for i in range(1, len(yavg)):                 # chớp = sáng vọt lên rồi tụt lại trong ≤ 0,3 s (cắt sang cảnh sáng thì không tính)
        (_, y0), (t, y) = yavg[i - 1], yavg[i]
        if y - y0 > 70 and y > 200 and any(yy < y0 + 30 for _, yy in yavg[i + 1:i + 10]):
            find('V11', 'err', t, t, y - y0, 70, f'chớp sáng (độ sáng {y0:.0f}→{y:.0f} rồi tụt lại) — luật: không chớp trắng', which(t))
    tail = None                                   # bản full có màn hình kết 20 s đứng yên đúng luật → bỏ các thước "đứng im" ở đuôi
    if a.ep and not a.shot and not a.offset:
        tl0 = json.load(open(os.path.join(ep_dir(a.ep), 'build', 'timeline.json')))
        if abs(dur - tl0['total']) < 1.5: tail = tl0['total'] - 21
    live = lambda s: tail is None or s < tail
    mid = lambda s, e: which((s + e) / 2)
    # ---- V1: đứng im (freezedetect, 60 % giữa khung)
    lv = 'err' if 'err' in V.get('V1', {}) else 'warn' if 'V1' in V else None
    for s, e in freeze:
        e = dur if e is None else e
        if lv and live(s): find('V1', lv, s, e, e - s, D['freeze_s'], 'vùng giữa khung không đổi', mid(s, e), ' s')
    # ---- V2: đoạn gần như không động (< 1 % điểm ảnh đổi)
    wn = {}
    for s, e in M['low']:
        if not live(s): continue
        k = mid(s, e)
        if check('V2', e - s, s, e, 'gần như không động (< %g %% điểm ảnh đổi)' % (D['dong'] * 100), k, ' s') == 'warn':
            FIND.pop(); wn.setdefault(k, []).append((e - s, s, e))    # cảnh báo V2: gộp một dòng mỗi chương (đoạn dài nhất)
    for k, lst in wn.items():
        d, s, e = max(lst); find('V2', 'warn', s, e, d, V['V2']['warn'], f'gần như không động — {len(lst)} đoạn trên mức cảnh báo trong chương, dài nhất ở đây', k, ' s')
    # ---- V3: cửa sổ 10 s có quá ít khung động — gộp các cửa sổ hỏng liền nhau thành một khoảng
    for lvl in ('err', 'warn'):
        th = V.get('V3', {}).get(lvl)
        if th is None: continue
        bad = [(s, e, v) for s, e, v in M['wins'] if v < th and live(s)]; grp = []
        for s, e, v in bad:
            if grp and s <= grp[-1][1]: grp[-1] = (grp[-1][0], e, min(grp[-1][2], v))
            else: grp.append((s, e, v))
        for s, e, v in grp:
            if lvl == 'warn' and any(x['code'] == 'V3' and x['t0'] < e and s < x['t1'] for x in FIND): continue
            find('V3', lvl, s, e, v, th, 'tỉ lệ khung có động trong cửa sổ %g s' % D['win_s'], mid(s, e))
    # ---- V7: đoạn ≥ 3 s khung trống
    fl = Dt['flat']; need = D['flat_min_s']
    for lvl in ('err', 'warn'):
        th = V.get('V7', {}).get(lvl)
        if th is None: continue
        for s, e in runs_of(fl > th, 2):
            if e - s < need or not live(s): continue
            if lvl == 'warn' and any(x['code'] == 'V7' and x['t0'] < e and s < x['t1'] for x in FIND): continue
            find('V7', lvl, s, e, float(fl[int(s * 2):int(e * 2)].max()), th, f'khung trống {e - s:.0f} s liền (giấy trơn/biển/tường không vật)', mid(s, e))
    # ---- theo chương: V4, V5, V5G, V6, V6B, V8, V8P, V9, V10
    rows = []
    for k, s, e in chs:
        e2 = min(e, tail) if tail is not None and e > tail > s else e
        c = ch[int(s * 12):max(int(s * 12) + 1, int(e2 * 12) - 1)]; d = {x: Dt[x][int(s * 2):max(int(s * 2) + 1, int(e2 * 2))] for x in Dt}
        ev = [t for t in M['strong'] if s <= t < e2]; pts = [s] + ev + [e2]
        gaps = [(pts[i + 1] - pts[i], pts[i], pts[i + 1]) for i in range(len(pts) - 1)]; gap = max(gaps)
        lows = [b - a_ for a_, b in M['low'] if s <= (a_ + b) / 2 < e2]; wins = [v for a_, b, v in M['wins'] if s <= (a_ + b) / 2 < e2]
        fl3 = 0.0; n3 = int(need * 2); seg = Dt['flat'][int(s * 2):int(e2 * 2)]          # mức phẳng tệ nhất giữ được ≥ 3 s (min trượt)
        if len(seg) >= n3: fl3 = float(max(seg[i:i + n3].min() for i in range(len(seg) - n3 + 1)))
        r = {'ch': chname(k), 't0': round(s, 2), 't1': round(e, 2), 'dur': round(e - s, 2),
             'dong_tb': float(c.mean()) if len(c) else 0.0, 'dong_trung_vi': float(np.median(c)) if len(c) else 0.0,
             'ty_le_khung_dong': float((c > D['dong']).mean()) if len(c) else 0.0,
             'gan_tinh_dai_nhat': max(lows, default=0.0), 'cua_so_min': min(wins, default=None),
             'manh_moi_phut': len(ev) / max(e2 - s, 1e-6) * 60, 'ho_dai_nhat': gap[0],
             'phang_tb': float(d['flat'].mean()), 'phang_3s': fl3, 'mang_phang_tb': float(d['big'].mean()), 'mang_phang_p90': float(np.percentile(d['big'], 90)),
             'net_tb': float(d['edge'].mean()), 'net_p10': float(np.percentile(d['edge'], 10)),
             'bao_hoa': float(d['sat'].mean()), 'do_sang': float(d['lum'].mean())}
        rows.append(r); nm = chname(k)
        check('V3C', r['ty_le_khung_dong'], s, e, f'tỉ lệ khung có động của {"cả " * (k is not None)}{nm}', k)
        check('V4', r['dong_trung_vi'], s, e, f'trung vị tỉ lệ điểm ảnh đổi của {nm}', k)
        if e2 - s >= 20: check('V5', r['manh_moi_phut'], s, e, f'sự kiện động mạnh (> {D["manh"]:.0%} điểm ảnh) mỗi phút của {nm}', k, '/phút')
        for g_, a_, b in gaps: check('V5G', g_, a_, b, 'khoảng hở không có sự kiện động mạnh nào', k, ' s')
        check('V6', r['phang_tb'], s, e, f'vùng phẳng trung bình của {nm}', k)
        check('V6B', r['mang_phang_tb'], s, e, f'mảng phẳng liền lớn nhất, trung bình của {nm}', k)
        check('V8', r['net_tb'], s, e, f'mật độ nét trung bình của {nm}', k)
        check('V8P', r['net_p10'], s, e, f'mật độ nét p10 của {nm} (các khung thưa nhất)', k)
        check('V9', r['bao_hoa'], s, e, f'bão hoà màu trung bình của {nm}', k)
        lim = V.get('V10')
        if lim:
            if r['do_sang'] < lim['warn'][0]: find('V10', 'warn', s, e, r['do_sang'], lim['warn'][0], f'{nm} tối hơn khoảng của style', k)
            elif r['do_sang'] > lim['warn'][1]: find('V10', 'warn', s, e, r['do_sang'], lim['warn'][1], f'{nm} sáng/bạc hơn khoảng của style', k)
    print(f'Cắt cảnh phát hiện: {len(cuts)} · sự kiện động mạnh: {len(M["strong"])} · phân tích {time.time() - t0:.0f} s ({(time.time() - t0) / max(dur, 1):.2f}× thời lượng)')
    cols = [('dur', 'dài s', 7), ('dong_trung_vi', 'động tr.vị', 11), ('ty_le_khung_dong', 'khung động', 11), ('gan_tinh_dai_nhat', 'gần tĩnh s', 11),
            ('cua_so_min', 'cửa sổ min', 11), ('manh_moi_phut', 'mạnh/phút', 10), ('ho_dai_nhat', 'hở max s', 9), ('phang_tb', 'phẳng tb', 9),
            ('phang_3s', 'phẳng 3s', 9), ('mang_phang_tb', 'mảng liền', 10), ('net_tb', 'nét tb', 7), ('net_p10', 'nét p10', 8),
            ('bao_hoa', 'bão hoà', 8), ('do_sang', 'độ sáng', 8)]
    print('\n' + f'{"chương":8}' + ''.join(f'{h:>{w}}' for _, h, w in cols))
    for r in rows: print(f'{r["ch"]:8}' + ''.join(f'{("—" if r[c] is None else num(r[c]) if c != "dong_trung_vi" else f"{r[c]:.4f}"):>{w}}' for c, _, w in cols))
    # ---- V12: cắt giữa câu (chỉ khi có --ep)
    if a.ep:
        ep = ep_dir(a.ep); offset = a.offset
        if a.shot:
            tl = json.load(open(os.path.join(ep, 'build', 'timeline.json')))
            offset = next((s['start'] for s in tl['shots'] if s['id'] == a.shot), None)
            if offset is None: sys.exit(f'Không có shot {a.shot} trong timeline')
        tl, bd = boundaries(ep, offset or 0)
        off = [(c, min((abs(c - b) for b in bd), default=99)) for c in cuts]
        off = [(c, d) for c, d in off if d > 0.45]
        if off:
            find('V12', 'warn', off[0][0], off[-1][0], len(off), 0, f'{len(off)}/{len(cuts)} lần cắt cảnh nằm giữa câu (cách ranh giới câu > 0,45 s): '
                 + ', '.join(f'{mmss(c + (offset or 0))}' for c, _ in off[:10]) + (' …' if len(off) > 10 else ''), None, ' lần')
    if not a.no_images:
        extra = [float(x) for x in a.at.split(',')] if a.at else []
        made = images(f, cuts[:40] + extra + [s for _, s, _ in chs[1:]] + M['strong'], out)
        print(f'Ảnh soát: {out}/ ({len(made)} dải 12 khung tại chỗ cắt/--at/đầu chương/sự kiện động mạnh + phone_*.jpg cỡ 360 px) — MỞ RA XEM, script không chấm thay được')
    if getattr(a, 'metrics', None): json.dump({'clip': os.path.abspath(f), 'chapters': rows}, open(a.metrics, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return info, chs, rows


# ---- miễn trừ + in kết quả
def build_dir(clip):
    d = os.path.dirname(os.path.abspath(clip))
    return os.path.dirname(d) if os.path.basename(d) == 'out' else d


def review_log(B):
    for p in (os.path.join(B, 'review_log.md'), os.path.join(os.path.dirname(B), 'review_log.md') if os.path.basename(os.path.dirname(B)) == 'build' else None):
        if p and os.path.exists(p): return p
    return None


WAIVE = re.compile(r'^[-*]\s*([A-Z]\d+[A-Z]?)\s+(\d+):(\d\d(?:[.,]\d+)?)\s*[–—-]\s*(\d+):(\d\d(?:[.,]\d+)?)\s*(?:\([^)]*\))?\s*:\s*(\S.*)$')


def waivers(B, clip):
    """Đọc các dòng dưới "## Miễn trừ" (hoặc "## Miễn trừ — <tên clip>") của review_log.md → [{code, t0, t1, why}], [dòng sai dạng]."""
    p = review_log(B)
    if not p: return [], []
    out, bad, on = [], [], False; name = os.path.splitext(os.path.basename(clip))[0]
    for ln in open(p, encoding='utf-8').read().splitlines():
        s = ln.strip()
        if s.startswith('#'):
            m = re.match(r'^##\s+Miễn trừ\s*(?:[—–:-]\s*(.+))?$', s)
            on = bool(m) and (not m.group(1) or os.path.splitext(m.group(1).strip().strip('`'))[0] == name); continue
        if not on or not s.startswith(('-', '*')): continue
        m = WAIVE.match(s)
        if not m: bad.append(s); continue
        sec = lambda a_, b: int(a_) * 60 + float(b.replace(',', '.'))
        out.append({'code': m.group(1), 't0': sec(m.group(2), m.group(3)), 't1': sec(m.group(4), m.group(5)), 'why': m.group(6).strip(), 'used': 0})
    return out, bad


def apply_waivers(B, clip, chs, dur):
    ws, bad = waivers(B, clip); M = Q['mien_tru']; cap = M['toi_da_moi_chuong']
    for s in bad: find('M1', 'err', 0, dur, None, None, f'dòng miễn trừ sai dạng: "{s[:80]}"')
    per = {}
    for w in ws:
        # xếp dòng vào chương theo ĐIỂM GIỮA khoảng (15/11/2026, người dùng đồng ý): mốc mm:ss làm tròn xuống làm dòng của đầu chương rơi sang chương trước → M1 oan
        mid = (w['t0'] + w['t1']) / 2; k = next((k for k, s, e in chs if s <= mid < e), chs[-1][0]); per.setdefault(k, []).append(w)
        if w['code'] in M['khong_mien']: find('M1', 'err', w['t0'], w['t1'], None, None, f'mã {w["code"]} không được miễn trừ', k); continue
        best = None                                                   # mỗi dòng chỉ miễn MỘT phát hiện: cái trùng nhiều giây nhất (không thì một dòng rộng xoá cả loạt)
        for x in FIND:
            if x['code'] != w['code'] or x['waived']: continue
            span = x['t1'] - x['t0']; ov = min(x['t1'], w['t1']) - max(x['t0'], w['t0'])
            if ((ov >= 0.5 * span and ov > 0) if span > 0 else (w['t0'] <= x['t0'] <= w['t1'])) and (best is None or ov > best[0]): best = (ov, x)
        if best: best[1]['waived'] = w['why']; w['used'] += 1
        if not w['used']: find('M2', 'warn', w['t0'], w['t1'], None, None, f'miễn trừ {w["code"]} không khớp phát hiện nào', k)
    for k, lst in per.items():
        if len(lst) > cap:
            s, e = next(((s, e) for kk, s, e in chs if kk == k), (0, dur))
            find('M1', 'err', s, e, len(lst), cap, f'{chname(k)} có {len(lst)} dòng miễn trừ', k, ' dòng')


def summarise(title, exit_now=True):
    """In mọi phát hiện theo chương: mã · mốc · chương · số đo · ngưỡng · lời · cách sửa. Trả (lỗi, cảnh báo, miễn)."""
    order = {'err': 0, 'warn': 1}
    E = [x for x in FIND if x['lvl'] == 'err' and not x['waived']]; Wn = [x for x in FIND if x['lvl'] == 'warn' and not x['waived']]
    Wv = [x for x in FIND if x['waived']]
    print(f'\n=== {title} ===')
    for x in sorted(FIND, key=lambda x: (x['ch'] is None, str(x['ch']), bool(x['waived']), order[x['lvl']], x['code'], x['t0'])):
        tag = 'MIỄN    ' if x['waived'] else 'LỖI     ' if x['lvl'] == 'err' else 'CẢNH BÁO'
        op = '≥' if x['code'] in LOW_BAD else '≤'
        meas = f'đo {num(x["val"])}{x["unit"]} · ngưỡng {op} {num(x["thr"])}{x["unit"]} · ' if x['val'] is not None and x['thr'] is not None else ''
        print(f'{tag} {x["code"]:4} {mmss(x["t0"])}–{mmss(x["t1"])}  {chname(x["ch"]):8} {meas}{x["msg"]}'
              + (f' · MIỄN: {x["waived"]}' if x['waived'] else f' · SỬA: {x["hint"]}' if x['hint'] else ''))
    by = {}
    for x in E: by.setdefault(chname(x['ch']), {}).setdefault(x['code'], 0); by[chname(x['ch'])][x['code']] += 1
    for k, d in by.items(): print(f'    {k}: ' + ' · '.join(f'{c}×{n}' for c, n in sorted(d.items())))
    print(f'--- {len(E)} lỗi, {len(Wn)} cảnh báo, {len(Wv)} miễn' + ('' if not E else ' · KHÔNG ĐẠT'))
    if exit_now: sys.exit(1 if E else 0)
    return E, Wn, Wv


def cmd_video(a):
    info, chs, _ = video_checks(a)
    apply_waivers(build_dir(a.target), a.target, chs, info['dur'])
    summarise('video')


def cmd_rig(a, extra):
    """Cổng rig: gọi tools/rig_gate.py, giữ nguyên mã thoát (0 đạt, 1 hỏng, 2 không chạy được)."""
    sys.exit(subprocess.run([sys.executable, os.path.join(HERE, 'rig_gate.py'), a.target] + extra).returncode)


# ---------------------------------------------------------------- srt / full / gate
def cmd_srt(a, path=None):
    path = path or a.target
    blocks = re.split(r'\n\s*\n', open(path, encoding='utf-8-sig').read().strip())
    multi = 0
    for b in blocks:
        ls = [x for x in b.splitlines() if x.strip()]
        if len(ls) >= 2 and '-->' in ls[1] and len(ls) > 3:
            multi += 1
            if multi <= 10: err(f'{os.path.basename(path)} cue {ls[0]} ({ls[1][:12]}): {len(ls) - 2} dòng — phụ đề luôn 1 dòng')
    if multi > 10: err(f'… và {multi - 10} cue nhiều dòng nữa')
    print(f'SRT: {path} · {len(blocks)} cue')
    if path == a.target: report('srt')


def cmd_full(a):
    ep = ep_dir(a.target); eid = os.path.basename(ep)
    f = a.file or os.path.join(CH, 'out', f'{eid}_bio-long.mp4')
    if not os.path.exists(f): sys.exit(f'Không thấy bản full: {f}')
    info = probe(f); tl = json.load(open(os.path.join(ep, 'build', 'timeline.json')))
    print(f'Bản full: {f}\n{info["w"]}×{info["h"]} · {info["fps"]:.2f} fps · {info["dur"]:.2f} s · timeline {tl["total"]:.2f} s')
    if (info['w'], info['h']) != (1920, 1080): err(f'kích thước {info["w"]}×{info["h"]}, cần 1920×1080')
    if abs(info['fps'] - 30) > 0.01: err(f'{info["fps"]:.2f} fps, cần 30')
    if not info['audio']: err('không có track tiếng')
    want = round(tl['total'] * 30)
    if info['frames'] and abs(int(info['frames']) - want) > 2: err(f'số khung {info["frames"]} ≠ timeline × 30 = {want}')
    elif abs(info['dur'] - tl['total']) > 0.2: err(f'độ dài {info["dur"]:.2f} s ≠ timeline {tl["total"]:.2f} s')
    p = run(['ffmpeg', '-nostats', '-i', f, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'])
    I = re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr); TP = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', p.stderr)
    if I:
        i = float(I[-1]); print(f'Âm lượng: {i:.1f} LUFS · đỉnh {TP[-1] if TP else "?"} dBTP')
        if abs(i + 16) > 1: err(f'âm lượng {i:.1f} LUFS, cần −16 ±1 (lenh.md)')
        if TP and float(TP[-1]) > -1.0: err(f'đỉnh {TP[-1]} dBTP > −1 (dễ vỡ tiếng)')
    p = run(['ffmpeg', '-nostats', '-ss', f'{max(0, info["dur"] - 17):.2f}', '-i', f, '-vn', '-af', 'ebur128', '-f', 'null', '-'])
    I2 = re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr)
    if I2 and float(I2[-1]) > -35: warn(f'17 s cuối còn âm lượng {I2[-1]} LUFS — màn hình kết thúc phải im nhạc (giong-am-thanh)')
    srt = os.path.join(CH, 'out', f'{eid}_bio-long.vi.srt')
    if os.path.exists(srt): cmd_srt(a, srt)
    else: err(f'thiếu phụ đề {srt}')
    report('full')


def cmd_gate_legacy(a):
    """Kiểu cũ: gate <tập> --chapter N [--clip] — chỉ kiểm review_log (thang điểm 1–10)."""
    ep = ep_dir(a.target); log = os.path.join(ep, 'build', 'review_log.md')
    if not os.path.exists(log): err(f'chưa có {log} — chưa soát (tu-soat.md)'); report('gate')
    rounds = re.findall(rf'^## Chương {a.chapter}\b.*?\((\d{{4}}-\d\d-\d\d \d\d:\d\d)\)\s*\n(.*?)(?=^## |\Z)',
                        open(log, encoding='utf-8').read(), re.M | re.S)
    if not rounds: err(f'review_log.md chưa có vòng nào cho chương {a.chapter}'); report('gate')
    when, body = rounds[-1]
    m = re.search(r'Điểm:(.*)', body)
    scores = [int(x) for x in re.findall(r'(\d+)', m.group(1))] if m else []
    print(f'Chương {a.chapter}: {len(rounds)} vòng, vòng cuối {when}, điểm {scores or "?"}')
    if not scores: err('vòng cuối không có dòng "Điểm:"')
    elif min(scores) < 8: err(f'còn mục dưới 8 điểm ({min(scores)}) — sửa và soát thêm vòng')
    if not re.search(r'Lỗi nặng nhất:', body): warn('vòng cuối không ghi "Lỗi nặng nhất"')
    if a.clip:
        t_log = time.mktime(time.strptime(when, '%Y-%m-%d %H:%M'))
        if os.path.getmtime(a.clip) > t_log + 60:
            err(f'clip {os.path.basename(a.clip)} render SAU lần soát cuối ({time.strftime("%Y-%m-%d %H:%M", time.localtime(os.path.getmtime(a.clip)))}) — soát lại bản mới')
    report('gate')


def review_rounds(B, clip, chs, dur, digest):
    """G1 — yêu cầu review_log của cổng cũ, áp cho từng chương của clip (xem docstring mục GATE bước 4)."""
    p = review_log(B)
    if not p: find('G1', 'err', 0, dur, None, None, f'chưa có {os.path.join(B, "review_log.md")} — chưa soát mắt'); return
    txt = open(p, encoding='utf-8').read()
    for k, s, e in chs:
        n = int(k) if k is not None and str(k).isdigit() else None
        pat = rf'^## Chương {n}\b' if n is not None else r'^## Chương\b'
        rounds = re.findall(pat + r'[^\n]*?\((\d{4}-\d\d-\d\d \d\d:\d\d)\)([^\n]*)\n(.*?)(?=^## |\Z)', txt, re.M | re.S)
        if not rounds: find('G1', 'err', s, e, None, None, f'review_log.md chưa có vòng soát nào cho {chname(k)} ("## Chương {n if n is not None else "N"} — vòng … (YYYY-MM-DD HH:MM)")', k); continue
        when, head, body = rounds[-1]; body = head + '\n' + body
        m = re.search(r'Điểm:(.*)', body); eye = re.search(r'Soát mắt[^\n]*', body)
        scores = [int(x) for x in re.findall(r'(\d+)', m.group(1))] if m else []
        if scores and min(scores) < 8: find('G1', 'err', s, e, min(scores), 8, f'{chname(k)}: vòng soát cuối ({when}) còn mục dưới 8 điểm', k, ' điểm')
        elif eye and 'HỎNG' in eye.group(0): find('G1', 'err', s, e, None, None, f'{chname(k)}: vòng soát cuối ({when}) còn mục HỎNG', k)
        elif not scores and not (eye and 'ĐẠT' in eye.group(0)): find('G1', 'err', s, e, None, None, f'{chname(k)}: vòng soát cuối ({when}) không có dòng "Điểm:" hay "Soát mắt: … ĐẠT"', k)
        hx = re.search(r'sha256[:\s]+([0-9a-f]{8,64})', body)
        if hx:
            if not digest.startswith(hx.group(1)): find('G1', 'err', s, e, None, None, f'{chname(k)}: vòng soát cuối ghi sha256 {hx.group(1)[:12]}… khác clip này ({digest[:12]}…) — soát lại bản mới', k)
        else:
            src = os.path.join(os.path.dirname(os.path.abspath(clip)), f'ch{k}_video.mp4'); src = src if k is not None and os.path.exists(src) else clip
            t_log = time.mktime(time.strptime(when, '%Y-%m-%d %H:%M'))
            if os.path.getmtime(src) > t_log + 60:
                find('G1', 'err', s, e, None, None, f'{chname(k)}: {os.path.basename(src)} render SAU lần soát cuối {when} '
                     f'({time.strftime("%Y-%m-%d %H:%M", time.localtime(os.path.getmtime(src)))}) — soát lại bản mới', k)


def cmd_gate(a):
    if not os.path.isfile(a.target):
        if a.chapter is None: sys.exit('gate <clip.mp4> (cổng mới) hoặc gate <tập> --chapter N (kiểu cũ)')
        return cmd_gate_legacy(a)
    clip = os.path.abspath(a.target); B = build_dir(clip); digest = sha256(clip); checks = {}
    # 1. rig
    if os.path.exists(os.path.join(B, 'parts', 'index.json')) and os.path.exists(os.path.join(B, 'chapters', 'cast.spec.js')):
        print('--- cổng rig'); r = subprocess.run([sys.executable, os.path.join(HERE, 'rig_gate.py'), B, '--quiet'], capture_output=True, text=True)
        tail = [x for x in (r.stdout + r.stderr).strip().splitlines() if x.strip()]
        print('\n'.join(tail[-12:])); checks['rig'] = r.returncode
    else: checks['rig'] = 'bỏ qua (không có parts/index.json + chapters/cast.spec.js)'
    # 2. video
    print('--- video'); info, chs, rows = video_checks(a); dur = info['dur']
    if checks['rig'] not in (0, ) and isinstance(checks['rig'], int):
        find('R1', 'err', 0, dur, None, None, f'cổng rig không đạt (mã thoát {checks["rig"]}): ' + ' | '.join(x for x in tail if x.startswith('LỖI'))[:400])
    # 3. trang
    keys = [k for k, _, _ in chs]
    if not os.path.exists(os.path.join(B, 'index.html')):
        checks['page'] = 'bỏ qua (thư mục dựng không có index.html)'
        if Q.get('page'):                                             # style có ngưỡng trang mà clip nằm ngoài thư mục dựng → không được coi là đạt
            checks['page'] = 'không kiểm được'
            find('P0', 'err', 0, dur, None, None, f'style này có cổng trang nhưng {B} không có index.html — để clip trong <thư mục dựng>/out/ rồi chấm (clip chép ra chỗ khác không qua được cổng)')
    elif a.no_page:                                                   # bỏ cổng trang thì không được tính là đạt (không thì --no-page là lối tắt qua P1–P9)
        checks['page'] = 'bỏ qua (--no-page)'
        find('P0', 'err', 0, dur, None, None, 'cổng trang bị bỏ bằng --no-page: kết quả chỉ để xem nhanh, không tính là đạt — chạy lại không có cờ này (ngoài sandbox)')
    elif any(k is None or not os.path.exists(os.path.join(B, 'chapters', f'ch{k}.js')) for k in keys):
        checks['page'] = 'không kiểm được'
        find('P0', 'err', 0, dur, None, None, 'không biết clip gồm chương nào của trang (thiếu <tên>.txt / --chapters, hoặc thiếu chapters/ch<khoá>.js)')
    else:
        print('--- cổng trang (pagecheck.mjs)'); tmp = tempfile.mkdtemp(prefix='qa_'); jf = os.path.join(tmp, 'page.json')
        r = subprocess.run(['node', os.path.join(KIT, 'core', 'pagecheck.mjs'), B] + keys + ['--json', jf, '--quiet'] +
                           (['--qa', Q_FILE] if Q_FILE else []), capture_output=True, text=True)
        checks['page'] = r.returncode; res = json.load(open(jf, encoding='utf-8')) if os.path.exists(jf) else None
        shutil.rmtree(tmp, ignore_errors=True); msg = (r.stderr.strip() or r.stdout.strip()).splitlines()
        if r.returncode == 2 or res is None:
            find('P0', 'err', 0, dur, None, None, 'pagecheck không kiểm được: ' + (' | '.join(msg[-3:])[:300] if msg else f'mã thoát {r.returncode}')
                 + (' (cần chạy ngoài sandbox: server 127.0.0.1)' if 'EPERM' in r.stderr or 'not permitted' in r.stderr else ''))
        else:
            off = {k: s for k, s, _ in chs}
            for k, s, e in chs:                                       # trang đo mã HIỆN TẠI, clip có thể dựng từ mã cũ hơn
                src = os.path.join(B, 'chapters', f'ch{k}.js')
                if os.path.getmtime(src) > os.path.getmtime(clip) + 60:
                    find('P0', 'warn', s, e, None, None, f'chapters/ch{k}.js sửa SAU khi clip render — số đo trang (P1–P9) là của mã mới, không phải của clip này: render lại rồi chấm', k)
            for c in res['chapters']:
                print(f'{chname(c["key"])}: ' + ' · '.join(f'{k} {num(v) if isinstance(v, (int, float)) else v}' for k, v in c['metrics'].items()))
                for x in c['findings']:
                    o = off.get(c['key'], 0.0)
                    FIND.append({**x, 't0': round(x['t0'] + o, 2), 't1': round(x['t1'] + o, 2), 'ch': c['key'], 'unit': x.get('unit', ''), 'waived': None})
            checks['page_metrics'] = {c['key']: c['metrics'] for c in res['chapters']}
    # 4. review_log   5. miễn trừ + ghi kết quả
    review_rounds(B, clip, chs, dur, digest); apply_waivers(B, clip, chs, dur)
    E, Wn, Wv = summarise('gate', exit_now=False)
    slim = lambda xs: [{k: x[k] for k in ('code', 't0', 't1', 'ch', 'val', 'thr', 'msg', 'hint', 'waived') if x.get(k) is not None} for x in xs]
    gj = clip + '.gate.json'
    json.dump({'clip': clip, 'sha256': digest, 'ok': not E, 'when': time.strftime('%Y-%m-%d %H:%M:%S'), 'errors': slim(E), 'warnings': slim(Wn),
               'waived': slim(Wv), 'thresholds': {'file': Q_FILE, 'sha256': Q_SHA}, 'checks': checks, 'chapters': rows},
              open(gj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'Cổng: {"ĐẠT" if not E else "KHÔNG ĐẠT"} → {gj}' + ('' if E else f'\nGửi bản xem: sh {os.path.join(KIT, "core", "preview.sh")} {clip}'))
    sys.exit(1 if E else 0)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('mode', choices=['script', 'rig', 'video', 'full', 'srt', 'gate']); ap.add_argument('target')
    ap.add_argument('--ep'); ap.add_argument('--offset', type=float); ap.add_argument('--shot')
    ap.add_argument('--at'); ap.add_argument('--out'); ap.add_argument('--no-images', action='store_true')
    ap.add_argument('--file'); ap.add_argument('--chapter', type=int); ap.add_argument('--clip')
    ap.add_argument('--style'); ap.add_argument('--starts'); ap.add_argument('--chapters'); ap.add_argument('--metrics')
    ap.add_argument('--no-page', action='store_true')
    a, extra = ap.parse_known_args()
    if a.mode == 'rig': return cmd_rig(a, extra)
    if extra: ap.error('không hiểu: ' + ' '.join(extra))
    {'script': cmd_script, 'video': cmd_video, 'full': cmd_full, 'srt': cmd_srt, 'gate': cmd_gate}[a.mode](a)


if __name__ == '__main__':
    main()

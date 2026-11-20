# Gói thu tay trên WEB VBee (API hết credit): mỗi chương một hoặc vài file .txt (≤ 1500 ký tự/file) + plan_<tên>.json cho studio-kit/tools/vbee_ui_split.py
# Chạy trong thư mục tập: ../../../studio-template/.venv/bin/python3 build/vbee_pack.py   → audio/vbee_ui/
import sys, json, pathlib, os
sys.path.insert(0, '../../../studio-template/engine')
import build as B
c = B.Ctx('.'); LIM = 1580
ch, title, CH = -1, '', {}
for s in c.ep['shots']:
    if s.get('chapter') and s['id'] != 'kt_end' and s['id'] != 'lk_cta': ch += 1; title = s['chapter']
    CH[s['id']] = (ch, title)
out = pathlib.Path('audio/vbee_ui'); out.mkdir(parents=True, exist_ok=True); (pathlib.Path('audio/clips')).mkdir(exist_ok=True)
seen, by = set(), {}
for s in B.sentences(c):
    if not s.get('file') or s['file'] in seen or s['shot'] in ('lk_cta', 'kt_end'): continue
    if (pathlib.Path('audio/clips') / s['file']).exists(): continue
    seen.add(s['file']); by.setdefault(CH[s['shot']], []).append(s)
rows, tot = [], 0
for (n, t), its in sorted(by.items()):
    parts, cur, k = [], [], 0
    for s in its:
        L = len(s['spoken']) + 2
        if cur and k + L > LIM: parts.append(cur); cur, k = [], 0
        cur.append(s); k += L
    parts.append(cur)
    for i, p in enumerate(parts, 1):
        tag = f'c{n:02d}_SUNG_{i}'
        (out / f'{tag}.txt').write_text('\n\n'.join(s['spoken'] for s in p) + '\n', encoding='utf-8')
        json.dump([{'key': pathlib.Path(s['file']).stem, 'text': s['spoken']} for s in p], open(out / f'plan_{tag}.json', 'w'), ensure_ascii=False, indent=1)
        nc = sum(len(s['spoken']) for s in p); tot += nc; rows.append(f'| {tag}.txt | {t} | {len(p)} | {nc} |')
ID = os.path.basename(os.getcwd())
(out / 'HUONG_DAN.md').write_text(f"""# Thu giọng trên web VBee — {c.ep.get('title', ID)}

Mỗi file .txt = một lần tạo trên web VBee. Giọng **Quốc Huy (Hà Nội) Pro**, tốc độ **{c.speed}**, xuất **MP3**.
Dán NGUYÊN nội dung file (giữ dòng trống giữa các câu; nếu web có "khoảng nghỉ giữa đoạn" thì đặt ~1 giây).
Tải về, đặt tên MP3 TRÙNG tên file txt (vd `c00_SUNG_1.mp3`), chép vào thư mục này (`episodes/{ID}/audio/vbee_ui/`). Không cần cắt.
Lời kêu gọi like/subscribe KHÔNG có trong các file: dùng lại clip chung `shared/loi_keu_goi/`.
Chữ hạng đã viết sẵn thành "ét / a / bê / xê / đê". Nghe thấy đọc sai tên riêng thì báo mình mốc mm:ss trong file.

| file | chương | số câu | số ký tự |
|---|---|---|---|
""" + '\n'.join(rows) + f"\n\nTổng: {len(rows)} file, {tot} ký tự.\n", encoding='utf-8')
print(len(rows), 'file', tot, 'ký tự'); print('\n'.join(rows))

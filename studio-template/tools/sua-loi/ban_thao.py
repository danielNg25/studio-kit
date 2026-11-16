#!/usr/bin/env python3
"""Tạo trang "Bản Thảo" (sửa thẳng trên lời đọc, từng chương một) cho một tập có script.md.

  python3 tools/sua-loi/ban_thao.py <thư-mục-tập> [--tsv lines_vN.tsv] [--version "bản 9"] [--name "Bản Thảo …"] [--sub "…"] [--key tdp3v9] [--out FILE]

- Chương = các dòng `## …` trong script.md (đuôi `(~m:ss)` là thời lượng dự kiến); bỏ từ mục `## Ghi chú…` trở xuống.
- Mỗi dòng văn bản thường = một câu lời đọc; `*[hình: …]*` và `*[nguồn: …]*` thành gợi ý bật/tắt (không sửa được).
- Mã câu lấy từ lines_vN.tsv (cột: mã, chương, loại, người nói, lời, tiếng); mặc định lấy bản vN cao nhất trong build/script_review/*/.
  Không có tsv thì tự đánh mã L001… và ghi build/ban-thao/lines_auto.tsv.
- Ra build/ban-thao/{ban-thao.html, data.json}. Publish bằng Artifact với capabilities {db:{}} (xem skill gen-web-sua-loi).
- --key đổi mỗi bản (vd tdp3v9 → tdp3v10) để nháp cũ trong trình duyệt người dùng không lẫn sang bản mới.
"""
import argparse, csv, glob, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent


def latest_tsv(ep):
    best = None
    for p in glob.glob(str(ep / 'build' / 'script_review' / '*' / 'lines_v*.tsv')):
        m = re.search(r'lines_v(\d+)\.tsv$', p)
        if m and (best is None or int(m.group(1)) > best[0]):
            best = (int(m.group(1)), p)
    return best[1] if best else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ep')
    ap.add_argument('--tsv')
    ap.add_argument('--version')
    ap.add_argument('--name')
    ap.add_argument('--sub')
    ap.add_argument('--key')
    ap.add_argument('--out')
    a = ap.parse_args()
    ep = pathlib.Path(a.ep).resolve()
    if ep.is_file():
        ep = ep.parent
    script = ep / 'script.md'
    tsv = a.tsv or latest_tsv(ep)
    ver = a.version
    if not ver:
        m = re.search(r'lines_v(\d+)\.tsv$', tsv or '') or re.search(r'bản\s*(\d+)', script.read_text(encoding='utf-8')[:400])
        ver = 'bản ' + m.group(1) if m else 'bản nháp'
    key = a.key or (re.sub(r'[^a-z0-9]', '', ep.name.lower()) + re.sub(r'[^0-9]', '', ver))
    name = a.name or ('Bản Thảo · ' + ep.name)
    sub = a.sub or f'kịch bản {ver} · sửa thẳng trên lời đọc'

    txt = script.read_text(encoding='utf-8').split('\n')
    rows = list(csv.reader(open(tsv, encoding='utf-8'), delimiter='\t'))[1:] if tsv else None
    start = next(i for i, l in enumerate(txt) if l.startswith('## '))
    secs, cur, k = [], None, 0
    auto = []
    for l in txt[start:]:
        s = l.strip()
        if not s:
            continue
        if s.startswith('## '):
            h = s[3:].strip()
            if h.lower().startswith('ghi chú'):
                break
            m = re.search(r'\(~?([0-9]+:[0-9]+)\)\s*$', h)
            title = re.sub(r'\s*\(.*?\)\s*$', '', h).strip()
            cur = {'title': title, 'target': m.group(1) if m else '', 'items': [], 'key': 's%d' % len(secs)}
            secs.append(cur)
            continue
        if s.startswith('*[hình:'):
            cur['items'].append({'t': 'hint', 'x': re.sub(r'^\*\[hình:\s*|\]\*$', '', s)}); continue
        if s.startswith('*[nguồn:'):
            cur['items'].append({'t': 'src', 'x': re.sub(r'^\*\[nguồn:\s*|\]\*$', '', s)}); continue
        if s.startswith(('*[', '>', '---', '#', '**')):
            continue
        if rows is not None:
            if k >= len(rows) or rows[k][4] != s:
                sys.exit(f'script.md và {tsv} lệch ở câu thứ {k + 1}: {s[:60]!r} ≠ {rows[k][4][:60] if k < len(rows) else None!r}')
            i = rows[k][0]
        else:
            i = 'L%03d' % (k + 1)
            auto.append((i, cur['title'], 'lời kể', 'MC', s, len(s.split())))
        cur['items'].append({'t': 'line', 'id': i, 'x': s})
        k += 1
    if rows is not None and k != len(rows):
        sys.exit(f'{tsv} có {len(rows)} câu, script.md có {k}')
    bt = ep / 'build' / 'ban-thao'
    bt.mkdir(parents=True, exist_ok=True)
    if auto:
        with open(bt / 'lines_auto.tsv', 'w', encoding='utf-8', newline='') as f:
            w = csv.writer(f, delimiter='\t', lineterminator='\n')
            w.writerow(['mã', 'chương', 'loại', 'người nói', 'lời', 'tiếng'])
            w.writerows(auto)
    data = {'sections': secs, 'version': ver, 'name': name, 'sub': sub, 'key': key, 'wpm': 205}
    (bt / 'data.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    tpl = (HERE / 'template_banthao.html').read_text(encoding='utf-8')
    html = tpl.replace('__PAGE_TITLE__', re.sub(r'[<>&]', '', name)[:60]).replace('__DATA__', js)
    out = pathlib.Path(a.out) if a.out else bt / 'ban-thao.html'
    out.write_text(html, encoding='utf-8')
    print(out, '|', len(secs), 'chương,', k, 'câu |', ver, '| key', key, '| tsv', tsv or '(tự đánh mã)')


if __name__ == '__main__':
    main()

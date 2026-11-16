#!/usr/bin/env python3
"""Áp bản sửa xuất từ trang "Bản Thảo" (ban_thao.py) vào script.md + bảng câu lines_vN.tsv → sinh bản N+1.

  python3 tools/sua-loi/apply_banthao.py <export.txt | -> <thư-mục-tập> [--tsv lines_vN.tsv] [--dry-run] [--notes <kênh>/voice_notes.md]

Định dạng mỗi khối:   [mã] (chương) / cũ: … / mới: …
  - mới: "(BỎ CÂU NÀY)" = xoá câu; " ⏎ " trong câu mới = tách thành nhiều câu (câu đầu giữ mã, các câu sau thêm hậu tố a, b, c…).
  - Dòng "GHI CHÚ <chương>: …" = ghi chú theo chương (script chỉ in ra, Claude xử lý).
Việc làm: kiểm "cũ" khớp bảng câu → lưu build/script.v<N>.md → ghi script.md mới (mỗi câu một dòng, sửa đúng chỗ) →
  ghi lines_v<N+1>.tsv + edits_v<N+1>.json cạnh bảng câu cũ. Câu "cũ" không khớp (trang dựng từ bản khác) thì dừng, không ghi gì.
Sau khi áp: tăng số bản ở dòng đầu script.md, viết CHANGELOG-v<N>-v<N+1>.md, chạy lại ban_thao.py với --key mới.
"""
import argparse, csv, datetime, glob, json, pathlib, re, sys


def tok(t):
    return len(t.split())


def parse(text):
    text = text.replace('\r', '')
    blocks = re.finditer(r'^\[(?P<id>[^\]\s]+)\]\s*\((?P<ch>[^\n]*)\)\s*\n\s*cũ:\s*(?P<old>[^\n]+)\n\s*mới:\s*(?P<new>[^\n]+)', text, re.M)
    edits = [m.groupdict() for m in blocks]
    notes = re.findall(r'^GHI CHÚ ([^:\n]+):\s*(.+)$', text, re.M)
    return edits, notes


def latest_tsv(ep):
    best = None
    for p in glob.glob(str(ep / 'build' / 'script_review' / '*' / 'lines_v*.tsv')):
        m = re.search(r'lines_v(\d+)\.tsv$', p)
        if m and (best is None or int(m.group(1)) > best[0]):
            best = (int(m.group(1)), p)
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('export')
    ap.add_argument('ep')
    ap.add_argument('--tsv')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--notes')
    a = ap.parse_args()
    ep = pathlib.Path(a.ep).resolve()
    text = sys.stdin.read() if a.export == '-' else open(a.export, encoding='utf-8').read()
    edits, notes = parse(text)
    if a.tsv:
        n = int(re.search(r'lines_v(\d+)\.tsv$', a.tsv).group(1)); tsv = pathlib.Path(a.tsv)
    else:
        n, p = latest_tsv(ep); tsv = pathlib.Path(p)
    rows = list(csv.reader(open(tsv, encoding='utf-8'), delimiter='\t'))
    head, rows = rows[0], rows[1:]
    byid = {r[0]: r for r in rows}
    norm = lambda s: re.sub(r'\s+', ' ', s).strip()
    SET, bad = {}, []
    for e in edits:
        r = byid.get(e['id'])
        if not r:
            bad.append((e['id'], 'không có mã này trong ' + tsv.name)); continue
        if norm(r[4]) != norm(e['old']):
            bad.append((e['id'], f'câu cũ không khớp bản hiện tại: {r[4][:50]!r} ≠ {e["old"][:50]!r}')); continue
        nw = e['new'].strip()
        SET[e['id']] = [] if nw.upper().startswith('(BỎ CÂU') else [norm(x) for x in re.split(r'\s*⏎\s*', nw) if norm(x)]
    if bad:
        for b in bad:
            print('  !', b[0], b[1])
        sys.exit('Dừng, chưa ghi gì: có câu không áp được (trang có thể dựng từ bản khác).')
    if not SET:
        sys.exit('Không thấy khối [mã] (chương) / cũ: / mới: nào.')
    new, used = [], {r[0] for r in rows}
    for r in rows:
        i = r[0]
        if i not in SET:
            new.append(tuple(r[:5])); continue
        base = re.sub(r'[a-z]+$', '', i)
        for k, t in enumerate(SET[i]):
            if k == 0:
                nid = i
            else:
                c = 'a'
                while base + c in used:
                    c = chr(ord(c) + 1)
                nid = base + c; used.add(nid)
            new.append((nid, r[1], r[2], r[3], t))
    script = ep / 'script.md'
    src = script.read_text(encoding='utf-8').split('\n')
    out, j = [], 0
    for ln in src:
        if j < len(rows) and ln.strip() == rows[j][4] and ln.strip() != '':
            i = rows[j][0]
            out.extend(SET[i]) if i in SET else out.append(ln)
            j += 1
        else:
            out.append(ln)
    if j != len(rows):
        sys.exit(f'script.md chỉ khớp {j}/{len(rows)} câu của {tsv.name}: dừng, chưa ghi gì.')
    old_t = sum(tok(r[4]) for r in rows); new_t = sum(tok(x[4]) for x in new)
    print(f'Áp {len(SET)} câu: {len(rows)} → {len(new)} câu · {old_t} → {new_t} tiếng ({new_t - old_t:+d}) ≈ {new_t / 205:.1f} phút')
    for e in edits:
        s = SET[e['id']]
        print(f'  [{e["id"]}] {e["old"][:46]}… → ' + ('(bỏ)' if not s else ' ⏎ '.join(x[:46] for x in s)))
    for ch, t in notes:
        print(f'GHI CHÚ {ch}: {t}')
    if a.dry_run:
        return
    bak = ep / 'build' / f'script.v{n}.md'
    bak.parent.mkdir(parents=True, exist_ok=True)
    if not bak.exists():
        bak.write_text('\n'.join(src), encoding='utf-8')
    script.write_text('\n'.join(out), encoding='utf-8')
    d = tsv.parent
    with open(d / f'lines_v{n + 1}.tsv', 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f, delimiter='\t', lineterminator='\n')
        w.writerow(head)
        for x in new:
            w.writerow(list(x) + [tok(x[4])])
    json.dump(SET, open(d / f'edits_v{n + 1}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'Đã ghi script.md (bản cũ: {bak}), {d}/lines_v{n + 1}.tsv, edits_v{n + 1}.json')
    if a.notes:
        np_ = pathlib.Path(a.notes)
        h = '' if np_.exists() else '# Ghi chú giọng kể\n'
        with open(np_, 'a', encoding='utf-8') as f:
            f.write(h + f'\n## Người dùng tự sửa ({datetime.date.today()}, {ep.name})\n')
            for e in edits:
                s = SET[e['id']]
                f.write(f'- cũ: {e["old"]}\n  mới: ' + ('(bỏ)' if not s else ' ⏎ '.join(s)) + '\n')
            for ch, t in notes:
                f.write(f'- ghi chú {ch}: {t}\n')
        print('Đã thêm vào', np_)


if __name__ == '__main__':
    main()

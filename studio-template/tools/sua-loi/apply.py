#!/usr/bin/env python3
"""Áp kết quả "Bàn Sửa Lời" (định dạng "Chỉ câu đã sửa") vào file kịch bản YAML của tập.

  python3 tools/sua-loi/apply.py <export.txt | -> <shots_body.yaml | episode.yaml> [--dry-run] [--notes <kênh>/voice_notes.md]

- Mỗi khối:  [id] (người nói) / cũ: … / mới: …   ("mới: (BỎ CÂU NÀY)" = xoá câu).
- Tìm câu cũ theo đúng chữ trong `lines` của các shot (phải xuất hiện đúng 1 lần), thay bằng câu mới.
  Sửa thẳng trên chữ của file (giữ chú thích, thứ tự); nếu file không còn đọc được thì ghi lại bằng yaml.safe_dump và báo.
- Câu bị xoá làm dòng thành rỗng → xoá dòng đó cùng mục line_voices tương ứng (báo shot nào để canh lại cảnh).
- Luôn lưu bản cũ: <file>.bak-sualoi-<giờ>.
- --notes: chép các cặp cũ → mới vào file ghi chú giọng kênh (để lần sau viết theo giọng người dùng).
Sau khi áp: chạy lại bước dựng episode.yaml / script.md của kênh (vd mkyaml.py, mkscript.py) và rà các at(ctx,'từ') của cảnh.
"""
import argparse, datetime, pathlib, re, shutil, sys
import yaml

BLOCK = re.compile(r'^\[(?P<id>[\d.]+)\]\s*\((?P<who>[^)]*)\)\s*\n\s*cũ:\s*(?P<old>.+?)\s*\n\s*mới:\s*(?P<new>.+?)\s*$', re.M)


def parse(text):
    return [m.groupdict() for m in BLOCK.finditer(text.replace('\r', ''))]


def yq(s):
    return yaml.safe_dump(s, allow_unicode=True, width=100000, default_style=None).strip().removesuffix('...').strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('export')
    ap.add_argument('target')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--notes')
    a = ap.parse_args()
    text = sys.stdin.read() if a.export == '-' else open(a.export, encoding='utf-8').read()
    edits = parse(text)
    gnote = re.search(r'^GHI CHÚ CHUNG:\s*(.+)$', text, re.M)
    if not edits:
        sys.exit('Không thấy khối [id] cũ:/mới: nào — hãy xuất ở chế độ "Chỉ câu đã sửa".')
    tp = pathlib.Path(a.target)
    raw = tp.read_text(encoding='utf-8')
    data = yaml.safe_load(raw)
    shots = data['shots'] if isinstance(data, dict) else data
    done, miss, emptied = [], [], []
    for e in edits:
        old, new = e['old'].strip(), e['new'].strip()
        cut = new.upper().startswith('(BỎ CÂU')
        hits = [(s, i) for s in shots for i, l in enumerate(s.get('lines', [])) if old in str(l)]
        if len(hits) != 1:
            miss.append((e['id'], old, len(hits)))
            continue
        s, i = hits[0]
        line = str(s['lines'][i])
        nl = re.sub(r'\s{2,}', ' ', line.replace(old, '' if cut else new)).strip()
        s['lines'][i] = nl
        done.append((e['id'], s.get('id'), i, old, '(bỏ)' if cut else new))
        if not nl:
            emptied.append((s, i))
    for s, i in sorted(emptied, key=lambda x: -x[1]):
        del s['lines'][i]
        if s.get('line_voices') and len(s['line_voices']) > i:
            del s['line_voices'][i]
    print(f'Áp {len(done)}/{len(edits)} câu.')
    for d in done:
        print(f'  [{d[0]}] {d[1]}[{d[2]}]  {d[3][:50]}… → {d[4][:60]}')
    for m in miss:
        print(f'  ! [{m[0]}] tìm thấy {m[2]} lần (cần đúng 1): {m[1][:70]}')
    for s, i in emptied:
        print(f'  - shot {s.get("id")} mất dòng {i} → rà lại cảnh (L(ctx,i) dịch chỉ số)')
    if gnote:
        print('GHI CHÚ CHUNG:', gnote.group(1))
    if a.dry_run or not done:
        return
    bak = tp.with_name(tp.name + '.bak-sualoi-' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
    shutil.copy2(tp, bak)
    # sửa trên chữ để giữ chú thích; kiểm lại bằng cách đọc file mới
    out, ok = raw, not emptied
    if ok:
        for d in done:
            pats = [(d[3] + ' ', ''), (' ' + d[3], ''), (d[3], '')] if d[4] == '(bỏ)' else [(d[3], d[4])]
            for o, n in pats:
                if out.count(o) == 1:
                    out = out.replace(o, n)
                    break
            else:
                ok = False
                break
    if ok:
        try:
            chk = yaml.safe_load(out)
            cs = chk['shots'] if isinstance(chk, dict) else chk
            ok = [str(l) for x in cs for l in x.get('lines', [])] == [str(l) for x in shots for l in x.get('lines', [])]
        except Exception:
            ok = False
    if not ok:
        out = yaml.safe_dump(data, allow_unicode=True, sort_keys=False, width=10000)
        print('(ghi lại toàn file bằng yaml.safe_dump — chú thích trong file có thể mất; bản cũ:', bak.name + ')')
    tp.write_text(out, encoding='utf-8')
    print('Đã ghi', tp, '· bản cũ', bak.name)
    if a.notes:
        np_ = pathlib.Path(a.notes)
        head = '' if np_.exists() else '# Ghi chú giọng kể\n'
        with open(np_, 'a', encoding='utf-8') as f:
            f.write(head + f'\n## Người dùng tự sửa ({datetime.date.today()}, {tp.parent.name})\n')
            for d in done:
                f.write(f'- cũ: {d[3]}\n  mới: {d[4]}\n')
            if gnote:
                f.write(f'- ghi chú chung: {gnote.group(1)}\n')
        print('Đã thêm', len(done), 'cặp vào', np_)


if __name__ == '__main__':
    main()

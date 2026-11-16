#!/usr/bin/env python3
"""Tạo trang "Bàn Sửa Lời" cho một tập (mọi kênh): mỗi câu lời đọc + một ô để người dùng viết lại, bấm Xuất để lấy kết quả dán vào chat.

  python3 tools/sua-loi/build.py <thư-mục-tập | episode.yaml | script.md | file.txt> [--out FILE] [--stamp "TÊN KÊNH"]

- Đầu vào ưu tiên episode.yaml (có chương, người nói); script.md / văn bản thường cũng được.
- Ra: <tập>/build/sua-loi/sua-loi.html (một file tự đủ, mở thẳng bằng trình duyệt, hoặc publish thành Artifact).
- Kết quả người dùng dán lại → áp vào kịch bản bằng tools/sua-loi/apply.py.
"""
import argparse, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent


def from_episode(p):
    import yaml
    d = yaml.safe_load(open(p, encoding='utf-8'))
    out = [f"# {d.get('title') or p.parent.name}"]
    ch = None
    for s in d.get('shots', []):
        c = s.get('chapter')
        if c and c != ch:
            ch = c
            out.append(f"\n## {c}")
        elif ch is None:
            ch = ''
            out.append('\n## Mở đầu')
        lv = s.get('line_voices') or [''] * len(s.get('lines', []))
        for l, v in zip(s.get('lines', []), lv):
            l = str(l).replace('｜', '').strip()
            if not l:
                continue
            out.append(f"**{v}:** {l}" if v and v not in ('Người dẫn',) else l)
    return '\n\n'.join(out), d.get('title') or p.parent.name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('--out')
    ap.add_argument('--stamp', help='chữ trên con dấu (mặc định: tên kênh trong channel.yaml / blueprint.yaml hoặc tên thư mục kênh)')
    a = ap.parse_args()
    src = pathlib.Path(a.src).resolve()
    ep = src if src.is_dir() else src.parent
    if src.is_dir():
        src = ep / 'episode.yaml' if (ep / 'episode.yaml').exists() else ep / 'script.md'
    if src.suffix in ('.yaml', '.yml'):
        text, title = from_episode(src)
    else:
        text = src.read_text(encoding='utf-8')
        m = re.search(r'^#\s+(.+)$', text, re.M)
        title = m.group(1).strip() if m else src.stem
    stamp = a.stamp
    if not stamp:
        ch = ep.parent.parent if ep.parent.name == 'episodes' else ep
        stamp = None
        for f in ('channel.yaml', 'blueprint.yaml'):
            try:
                import yaml
                stamp = stamp or ((yaml.safe_load(open(ch / f, encoding='utf-8')) or {}).get('name') if (ch / f).exists() else None)
            except Exception:
                pass
        stamp = stamp or ch.name
    tpl = (HERE / 'template.html').read_text(encoding='utf-8')
    js = lambda v: json.dumps(v, ensure_ascii=False).replace('</', '<\\/')
    html = (tpl.replace('__PAGE_TITLE__', 'Sửa Lời · ' + re.sub(r'[<>&]', '', title)[:60])
               .replace('__STAMP__', re.sub(r'[<>&]', '', str(stamp)).upper()[:24])
               .replace('__SAMPLE__', js(text))
               .replace('__NS__', js('sualoi:' + ep.name)))
    out = pathlib.Path(a.out) if a.out else ep / 'build' / 'sua-loi' / 'sua-loi.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8')
    print(out)


if __name__ == '__main__':
    main()

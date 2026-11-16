#!/usr/bin/env python3
"""Tạo tập mới / ghi trạng thái tập cho các kênh dựng bằng studio-kit (vd Hóng) — theo cùng quy ước episode.yaml với kênh mẫu.

  python3 studio-kit/tools/new_ep.py new <thư mục kênh> <id> "<tiêu đề làm việc>" [--style comic-history] [--status idea]
      → <kênh>/episodes/<id>/episode.yaml (+ research/, voice/). Không ghi đè file đã có.
  python3 studio-kit/tools/new_ep.py status <thư mục tập> <trạng thái> ["<tiêu đề mới>"]
      → sửa dòng status: (và title: nếu đưa) trong episode.yaml; tập cũ chưa có file thì tạo.

Vì sao: người dùng 14/11/2026 — "sao bạn ko follow theo episode.yaml như bên kia luôn, cần cập nhật skill để tạo tập mới là tự biết".
Trang web studio (channel-example/tools/studio_web.py, mỗi kênh một tab) đọc title + status ở file này cho MỌI kênh, và nút
"Đánh dấu đã duyệt / đã đăng" ghi vào đúng dòng status: của nó.

episode.yaml của kênh kit CHỈ giữ thông tin tập. Lời đọc ở script.md, giọng + cách đọc ở voice/voice.json, hình ở build/<style>/ — không chép sang đây.
Thang trạng thái: idea → outline (C0) → script (C1) → voice → build (C2–C5) → preview (C6, chờ người dùng xem) → approved → posted.
"""
import datetime, json, os, re, sys

LADDER = 'idea → outline (C0) → script (C1) → voice → build (C2–C5) → preview (C6, chờ người dùng xem) → approved → posted'
TEMPLATE = '''# Thông tin tập — trang web studio (tab của kênh) và Claude đọc file này.
# KHÔNG chép lời đọc vào đây: lời ở script.md · giọng + cách đọc ở voice/voice.json · hình ở {build}/.
# status đi theo cổng: {ladder}
id: {id}
title: {title}
status: {status}
format: long-16x9
style: {style}
build: {build}
created: {day}
'''


def write_new(ep_dir, eid, title, style='comic-history', status='idea'):
    yp = os.path.join(ep_dir, 'episode.yaml')
    if os.path.exists(yp): print(f'đã có {yp} — không ghi đè'); return yp
    for sub in ('', 'research', 'voice'): os.makedirs(os.path.join(ep_dir, sub), exist_ok=True)
    open(yp, 'w', encoding='utf-8').write(TEMPLATE.format(id=eid, title=json.dumps(title, ensure_ascii=False), status=status, style=style,
                                                           build=f'build/{style}', day=datetime.date.today().isoformat(), ladder=LADDER))
    print(f'đã tạo {yp} (status: {status})'); return yp


def set_status(ep_dir, status, title=None):
    yp = os.path.join(ep_dir, 'episode.yaml'); eid = os.path.basename(os.path.normpath(ep_dir))
    if not os.path.exists(yp): write_new(ep_dir, eid, title or eid, status=status); return
    y = open(yp, encoding='utf-8').read()
    y = re.sub(r'^status:.*$', f'status: {status}', y, count=1, flags=re.M) if re.search(r'^status:', y, re.M) else y.rstrip('\n') + f'\nstatus: {status}\n'
    if title: y = re.sub(r'^title:.*$', lambda m: 'title: ' + json.dumps(title, ensure_ascii=False), y, count=1, flags=re.M)
    open(yp, 'w', encoding='utf-8').write(y); print(f'{yp}: status → {status}' + (f' · title → {title}' if title else ''))


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) >= 4 and a[0] == 'new':
        opt = {'--style': 'comic-history', '--status': 'idea'}
        for k in list(opt):
            if k in a: i = a.index(k); opt[k] = a[i + 1]; del a[i:i + 2]
        write_new(os.path.join(os.path.abspath(a[1]), 'episodes', a[2]), a[2], a[3], opt['--style'], opt['--status'])
    elif len(a) >= 3 and a[0] == 'status': set_status(os.path.abspath(a[1]), a[2], a[3] if len(a) > 3 else None)
    else: print(__doc__); sys.exit(1)

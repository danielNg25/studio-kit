#!/usr/bin/env python3
"""Tạo tập mới theo đúng cấu trúc mà trang web studio đọc (xem CAU_TRUC.md).

  python3 tools/tao_tap.py <id> "<tiêu đề làm việc>"          (chạy trong thư mục kênh)
  python3 tools/tao_tap.py <id> "<tiêu đề>" --kenh ../channel-abc

- Chép episodes/_mau/ thành episodes/<id>/, điền id, title, status: idea.
- Tạo các thư mục chung của kênh nếu chưa có: out/, out/xem/, branding/.
- Thêm một dòng vào backlog.csv và STATUS.md (tạo file nếu chưa có).
Không ghi đè tập đã có.
"""
import csv, datetime, os, re, shutil, sys

HEADER = ['id', 'topic', 'question_hook', 'angle', 'curiosity_1to5', 'local_relevance_1to5', 'shareable_1to5',
          'easy_to_draw_1to5', 'sources_1to5', 'score', 'status', 'source_ref', 'notes']


def main():
    a = sys.argv[1:]
    kenh = os.getcwd()
    if '--kenh' in a:
        i = a.index('--kenh'); kenh = os.path.abspath(a[i + 1]); del a[i:i + 2]
    if len(a) < 2:
        print(__doc__); sys.exit(1)
    eid, title = a[0], a[1]
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', eid):
        sys.exit(f'id "{eid}" không hợp lệ: chỉ chữ thường không dấu, số, nối bằng "-" (vd xep-hang-cao-thu)')
    ep_root = os.path.join(kenh, 'episodes')
    mau = os.path.join(ep_root, '_mau')
    dst = os.path.join(ep_root, eid)
    if not os.path.isdir(mau):
        sys.exit(f'không thấy tập mẫu {mau} — chạy lệnh trong thư mục kênh hoặc thêm --kenh')
    if os.path.exists(dst):
        sys.exit(f'đã có {dst} — không ghi đè')
    shutil.copytree(mau, dst, ignore=shutil.ignore_patterns('.gitkeep', '.DS_Store'))
    for sub in ('research', 'audio/vbee_ui', 'audio/clips', 'build/prev'):
        os.makedirs(os.path.join(dst, sub), exist_ok=True)
    yp = os.path.join(dst, 'episode.yaml')
    y = open(yp, encoding='utf-8').read()
    y = re.sub(r'^id: .*$', f'id: {eid}', y, count=1, flags=re.M)
    y = re.sub(r'^title: .*$', 'title: "' + title.replace('"', '\\"') + '"', y, count=1, flags=re.M)
    y = re.sub(r'^status: .*$', 'status: idea', y, count=1, flags=re.M)
    open(yp, 'w', encoding='utf-8').write(y)
    for f in ('outline.md', 'script.md'):
        p = os.path.join(dst, f)
        if os.path.exists(p):
            open(p, 'w', encoding='utf-8').write(open(p, encoding='utf-8').read().replace('<tiêu đề>', title))

    for d in ('out', 'out/xem', 'branding'):
        os.makedirs(os.path.join(kenh, d), exist_ok=True)
    bl = os.path.join(kenh, 'backlog.csv')
    new = not os.path.exists(bl)
    with open(bl, 'a', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        if new: w.writerow(HEADER)
        w.writerow([eid, title] + [''] * 8 + ['idea', '', ''])
    day = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    st = os.path.join(kenh, 'STATUS.md')
    with open(st, 'a', encoding='utf-8') as f:
        if os.path.getsize(st) == 0: f.write('# STATUS — nhật ký tiến độ (chỉ ghi thêm)\n\n')
        f.write(f'- {day} {eid}: tạo tập "{title}" (status idea).\n')
    print(f'đã tạo {os.path.relpath(dst, kenh)}/ — mở trang web studio là thấy tập mới')


if __name__ == '__main__':
    main()

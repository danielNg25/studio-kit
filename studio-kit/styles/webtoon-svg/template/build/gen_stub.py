# Sinh episode.yaml từ script.md: mỗi đoạn lời = 1 shot (id cNN_pMM), ghi chú *[hình]* đi kèm vào params.note. Chạy trong thư mục tập: python3 build/gen_stub.py
import re, yaml, pathlib, os
ID = os.path.basename(os.getcwd())
CTA = 'Nếu bạn thấy hay thì like và subscribe kênh để không bỏ lỡ những câu chuyện hấp dẫn khác nhé.'
shots = []; ci = -1; title = None; n = 0
for l in open('script.md', encoding='utf-8').read().split('\n'):
    l = l.strip()
    if l.startswith('## '):
        if 'Ghi chú' in l: break
        title = re.sub(r'\s*\((?!hạng)[^)]*\)', '', l[3:]).strip()
        if 'Lời kêu gọi' in title:
            shots.append({'id': 'lk_cta', 'chapter': 'Lời kêu gọi', 'template': 'custom', 'params': {'fn': 's_lk_cta', 'bg': ''}, 'lines': [CTA]}); title = None
        else: ci += 1; n = 0
        continue
    if l.startswith('*[Lời kêu gọi'):
        shots.append({'id': 'lk_cta', 'chapter': 'Lời kêu gọi', 'template': 'custom', 'params': {'fn': 's_lk_cta', 'bg': ''}, 'lines': [CTA]}); title = None; continue
    if l.startswith('*[Bảng giữa'):
        shots[-1]['params']['note'] = (shots[-1]['params'].get('note', '') + ' [SAU SHOT NÀY: bảng giữa video, im 3 giây]').strip(); continue
    if ci < 0 or not l or l.startswith('>') or l.startswith('#'): continue
    m = re.match(r'\*\[hình:\s*(.*)\]\*$', l)
    if m:
        if shots and shots[-1]['id'] != 'lk_cta': shots[-1]['params']['note'] = (shots[-1]['params'].get('note', '') + ' ' + m.group(1)).strip()
        continue
    n += 1; sid = f'c{ci:02d}_p{n:02d}'
    sh = {'id': sid}
    if n == 1 and title: sh['chapter'] = title
    sh.update({'template': 'custom', 'params': {'fn': 's_' + sid, 'bg': ''}, 'lines': [l]})
    shots.append(sh)
shots.append({'id': 'kt_end', 'chapter': 'Kết', 'template': 'custom', 'params': {'fn': 's_kt_end', 'bg': ''}, 'lines': [], 'dur': 20})
# Nhạc: sau khi có giọng thật, sửa 'to: end' trong episode.yaml thành (mốc kt_end − 3) để nhạc tắt trước màn hình kết thúc.
ttl = re.match(r'# Kịch bản — (.*?) \(', open('script.md', encoding='utf-8').readline()).group(1)
ep = {'id': ID, 'status': 'c4-build', 'format': 'bio-long', 'title': 'Vũ Trụ Kiếm Hiệp Cổ Long Trong 12 Phút', 'voice': {'speed': 0.95},
      'pronounce': {'Hạng S': 'Hạng ét', 'hạng S': 'hạng ét', 'Hạng A': 'Hạng a', 'hạng A': 'hạng a', 'Hạng B': 'Hạng bê', 'hạng B': 'hạng bê', 'Hạng C': 'Hạng xê', 'hạng C': 'hạng xê', 'Hạng D': 'Hạng đê', 'hạng D': 'hạng đê'},
      'music': {'gain_db': -31, 'gap_lift_db': 3, 'gap_min_s': 0.8, 'cues': [{'from': 0, 'to': 'end', 'file': 'The Thought of You - TrackTribe.mp3', 'fade_in': 2, 'fade_out': 3}]},
      'shots': shots}
pathlib.Path('episode.yaml').write_text('# Khung cảnh sinh từ script.md bằng build/gen_stub.py: mỗi đoạn lời một shot. Giọng CHƯA thu (dựng hình trước, timeline ước lượng --silent).\n' + yaml.safe_dump(ep, allow_unicode=True, sort_keys=False, width=1000), encoding='utf-8')
print(len(shots), 'shot')

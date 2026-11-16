#!/bin/sh
# Bản xem 540p để gửi người dùng (≤ 30 MB, TECHNIQUE §6) — CHỈ nén khi clip đã qua cổng:
#   sh studio-kit/core/preview.sh <clip.mp4>            → <tên>_xem.mp4 cạnh clip
# Điều kiện: có <clip>.gate.json (do `python3 studio-kit/tools/qa.py gate <clip>` ghi), "ok": true, sha256 trong đó khớp đúng file clip này,
# và file ngưỡng (styles/<slug>/qa.json) chưa đổi từ lúc chấm. Thiếu một điều → từ chối, in lý do, thoát 1.
# HQ=1 sh … preview.sh <clip>     bản nét 1080p (<tên>_xem-net.mp4) cho clip ngắn — dùng khi người dùng cần duyệt chất lượng hình (chương mẫu C4); cùng điều kiện cổng.
# FORCE=1 sh … preview.sh <clip>  vẫn nén nhưng đặt tên <tên>_CHUA-QUA-CONG_xem.mp4 và in cảnh báo to — chỉ dùng khi người dùng bảo gửi bản chưa đạt.
# Lịch sử: 13/11/2026 bản xem-3-chuong-v2 được gửi dù chưa từng qua cổng nào ("không công cụ nào gọi cổng" — reference/analysis/04-cong-qa.md mục D).
f=$1
if [ -z "$f" ] || [ ! -f "$f" ]; then echo "cách dùng: sh preview.sh <clip.mp4>   (không thấy file: $f)"; exit 2; fi
dir=$(cd "$(dirname "$f")" && pwd); base=$(basename "$f"); f="$dir/$base"; name=${base%.*}; g="$f.gate.json"
why=""
if [ ! -f "$g" ]; then why="chưa có $g — chạy: python3 studio-kit/tools/qa.py gate $f"
else
  sum=$(shasum -a 256 "$f" | cut -d' ' -f1)
  why=$(python3 - "$g" "$sum" <<'EOF'
import hashlib, json, os, sys
try: j = json.load(open(sys.argv[1], encoding='utf-8'))
except Exception as e: print(f'không đọc được {sys.argv[1]}: {e}'); sys.exit()
if j.get('sha256') != sys.argv[2]: print(f'clip đã đổi sau lần chấm {j.get("when", "?")} (sha256 {sys.argv[2][:12]}… ≠ {str(j.get("sha256"))[:12]}…) — chạy lại qa.py gate')
elif not j.get('ok'):
    es = j.get('errors', []); codes = {}
    for e in es: codes[e.get('code', '?')] = codes.get(e.get('code', '?'), 0) + 1
    print(f'cổng KHÔNG ĐẠT lúc {j.get("when", "?")}: {len(es)} lỗi (' + ' · '.join(f'{c}×{n}' for c, n in sorted(codes.items())) + ') — sửa hoặc ghi miễn trừ vào review_log.md rồi chạy lại qa.py gate')
else:
    t = j.get('thresholds') or {}; qf = t.get('file')
    if qf and not os.path.exists(qf): print(f'không còn file ngưỡng {qf} của lần chấm — chạy lại qa.py gate')
    elif qf and hashlib.sha256(open(qf, 'rb').read()).hexdigest() != t.get('sha256'): print(f'ngưỡng {qf} đã đổi sau lần chấm — chạy lại qa.py gate')
    else: print('OK')
EOF
)
  # chỉ chữ "OK" mới là đạt: python hỏng / không in gì cũng là từ chối (không thì lỗi của chính bước kiểm lại thành lối qua cổng)
  if [ "$why" = "OK" ]; then why=""; elif [ -z "$why" ]; then why="không kiểm được $g (python3 lỗi?)"; fi
fi
out="$dir/${name}_xem.mp4"
if [ -n "$why" ]; then
  if [ "$FORCE" != "1" ]; then echo "TỪ CHỐI nén bản xem: $why"; echo "(ép gửi bản chưa đạt: FORCE=1 sh $0 $f → tên file sẽ ghi CHUA-QUA-CONG)"; exit 1; fi
  out="$dir/${name}_CHUA-QUA-CONG_xem.mp4"
  echo "################################################################################"
  echo "## CẢNH BÁO: ÉP NÉN BẢN XEM CHƯA QUA CỔNG CHẤT LƯỢNG (FORCE=1)"
  echo "## Lý do chưa đạt: $why"
  echo "## File ra: $out — nói rõ với người dùng đây là bản CHƯA ĐẠT và liệt kê lỗi còn lại."
  echo "################################################################################"
fi
if [ "$HQ" = "1" ]; then
  # HQ=1: bản NÉT 1080p để người dùng duyệt CHẤT LƯỢNG HÌNH (chương mẫu, cổng C4) — tốc độ bit tính theo độ dài sao cho ≤ ~27 MB (giới hạn gửi 30 MB), trần 6 Mb/s
  out=$(echo "$out" | sed 's/_xem\.mp4$/_xem-net.mp4/')
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"); kb=$(python3 -c "import sys; d=float(sys.argv[1]); print(int(max(600, min(6000, 27*8192/d - 96))))" "$dur")
  if [ "$kb" -lt 1500 ]; then echo "clip dài ${dur}s: bản 1080p chỉ còn ${kb} kb/s — dùng bản 540p thường (bỏ HQ=1) hoặc gửi từng chương"; exit 1; fi
  ffmpeg -v error -y -i "$f" -c:v libx264 -preset medium -b:v ${kb}k -maxrate $((kb * 13 / 10))k -bufsize $((kb * 2))k -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$out" || exit 1
else
  ffmpeg -v error -y -i "$f" -vf scale=-2:540 -c:v libx264 -preset veryfast -b:v 200k -maxrate 260k -bufsize 520k -c:a aac -b:a 64k -ac 1 -movflags +faststart "$out" || exit 1
fi
echo "$out · $(du -h "$out" | cut -f1)"

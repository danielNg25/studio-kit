#!/bin/sh
# Dựng các chương của một tập theo "page contract" Lemo (window.READY/render(t)/DUR/EV/TEXTS) — dùng cho comic-history và mọi style cùng contract.
#   sh studio-kit/core/build_par.sh <thư mục dựng> 03 04 05 …      (song song 2 chương một lúc, 4 worker mỗi chương)
#   PAR=1 sh studio-kit/core/build_par.sh <thư mục dựng> 00 01 02  (tuần tự: chương sau dùng ảnh trang cuối của chương trước)
# Bước: xuất sự kiện/phụ đề → chụp trang cuối mọi chương trước (cú lật trang đầu chương sau cần ảnh này) → render video → trộn tiếng (core/mix.py).
# Ghép cả tập sau đó: cd <thư mục dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/assemble.py 00 01 … --name <tên>
# Cần tắt sandbox (server 127.0.0.1). Không xoá gì.
set -e
KIT=$(cd "$(dirname "$0")/.." && pwd); ROOT=$(cd "$KIT/.." && pwd)
H=$(cd "$1" && pwd); shift
export LIB=${LIB:-$ROOT/vendor/lemo-opuscar}
mkdir -p "$H/out" "$H/pages"
cd "$LIB"
for c in "$@"; do
  node "$KIT/core/export.mjs" "$H" "$c"
  D=$(python3 -c "import json;print(round(json.load(open('$H/out/ch$c.json'))['dur']-0.02,2))")
  node core/render/still.mjs "$H" "$D" --q "ch=$c" --out "$H/pages" --prefix "ch${c}_" >/dev/null && mv "$H/pages/ch${c}_$D.jpg" "$H/pages/ch$c.jpg"
done
one() { node core/render/video.mjs "$H" --q "ch=$1" --fps 30 --workers 4 --out "$H/out/ch$1_video.mp4" 2>&1 | grep -iE "error" | head -3; (cd "$H" && "$LIB/.venv/bin/python" "$KIT/core/mix.py" "$1"); }
while [ $# -gt 0 ]; do
  if [ "${PAR:-2}" = "1" ]; then one "$1"; shift; continue; fi
  one "$1" & P1=$!
  if [ $# -gt 1 ]; then one "$2" & P2=$!; wait $P2; shift; fi
  wait $P1; shift
done
echo "xong: $(ls "$H"/out/ch*_video.mp4 | wc -l | tr -d ' ') video chương trong $H/out"

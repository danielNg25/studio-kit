#!/bin/sh
# Ảnh tĩnh soát nhanh một chương (page contract Lemo):  sh studio-kit/core/peek.sh <thư mục dựng> 05 2.5 6 11 …  → <dựng>/qa/peek_05.jpg
# Mỗi lần ghi một thư mục ảnh mới (không xoá gì). Cần tắt sandbox (server 127.0.0.1).
KIT=$(cd "$(dirname "$0")/.." && pwd); ROOT=$(cd "$KIT/.." && pwd); LIB=${LIB:-$ROOT/vendor/lemo-opuscar}
H=$(cd "$1" && pwd); c=$2; shift 2
OUT="$H/qa/peek$c-$(date +%H%M%S)"; mkdir -p "$H/qa"
cd "$LIB" && node core/render/still.mjs "$H" "$@" --q "ch=$c" --out "$OUT" 2>&1 | grep -iE "error|không thấy" | head -5
cd "$H" && "$LIB/.venv/bin/python" "$LIB/core/render/sheet.py" "qa/peek_$c.jpg" $(ls "$OUT"/t_*.jpg | sort -t_ -k2 -g) --cols 4 --w 480 | tail -1

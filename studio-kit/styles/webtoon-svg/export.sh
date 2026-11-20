#!/bin/sh
# Đóng gói engine webtoon-svg để làm ở máy khác.
#   sh studio-kit/styles/webtoon-svg/export.sh [file ra.tgz] [--channel <thư mục kênh>]
# Gói giữ NGUYÊN bố cục thư mục so với gốc studio, nên các đường dẫn ../../../studio-template trong tập vẫn chạy:
#   studio-kit/ (luật chung, core, tools, workflow dung-tap; trong styles/ chỉ lấy webtoon-svg kèm template tập)
#   studio-template/ engine + package.json + requirements.txt + templates + tools + voices + packs/style/{webtoon-code-v1, chibi-v1, cutout-v1}
#   --channel <thư mục kênh>: thêm phần dùng chung của kênh (skill, tools, shared, music, *.yaml, *.md ở gốc kênh) — KHÔNG có episodes/, out/, branding/
# Không bao giờ đóng .env, .venv, node_modules, __pycache__, _to_delete.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$HERE/../../.." && pwd)
OUT=""; CH=""
while [ $# -gt 0 ]; do case "$1" in --channel) CH=$2; shift 2;; *) OUT=$1; shift;; esac; done
[ -n "$OUT" ] || OUT="$PWD/webtoon-kit_$(date +%Y%m%d).tgz"
case "$OUT" in /*) ;; *) OUT="$PWD/$OUT";; esac
cd "$ROOT"
LIST=$(mktemp)
for p in studio-kit/*; do [ "$p" = studio-kit/styles ] || echo "$p" >> "$LIST"; done   # trong styles/ chỉ lấy webtoon-svg
for p in studio-kit/.claude studio-kit/styles/README.md studio-kit/styles/webtoon-svg; do [ -e "$p" ] && echo "$p" >> "$LIST"; done
for p in engine package.json package-lock.json requirements.txt README.md START_HERE.md templates tools voices skills \
         packs/style/webtoon-code-v1 packs/style/chibi-v1 packs/style/cutout-v1; do
  [ -e "studio-template/$p" ] && echo "studio-template/$p" >> "$LIST"; done
if [ -n "$CH" ]; then CH=${CH%/}; CH=${CH#./}
  [ -d "$CH" ] || { echo "Không thấy kênh $CH"; exit 1; }
  for p in skill tools shared music; do [ -e "$CH/$p" ] && echo "$CH/$p" >> "$LIST"; done
  for f in "$CH"/*.yaml "$CH"/*.md "$CH"/.env.example; do [ -f "$f" ] && echo "$f" >> "$LIST"; done
fi
COPYFILE_DISABLE=1 tar -czf "$OUT" --exclude '.env' --exclude '.venv' --exclude 'node_modules' --exclude '__pycache__' \
  --exclude '_to_delete' --exclude '*.bak*' --exclude '*.pre-*' --exclude '.DS_Store' --exclude '*.tgz' -T "$LIST"
rm -f "$LIST"
echo "Đã đóng gói: $OUT ($(du -h "$OUT" | cut -f1))"
echo "Máy mới: đọc studio-kit/styles/webtoon-svg/INSTALL.md trong gói."

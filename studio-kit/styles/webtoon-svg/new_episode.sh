#!/bin/sh
# Tạo tập mới dùng style webtoon-svg:  sh studio-kit/styles/webtoon-svg/new_episode.sh <thư mục kênh> <id> "<tiêu đề>"
# Chép template/ (đồ nghề cảnh + script build) vào <kênh>/episodes/<id>/. Không ghi đè tập đã có.
# Kênh phải nằm ngay dưới gốc studio (cùng cấp studio-kit/ và studio-template/) vì script build trỏ ../../../studio-template.
set -e
K=${1:?thiếu thư mục kênh}; ID=${2:?thiếu id tập}; TITLE=${3:-$2}
HERE=$(cd "$(dirname "$0")" && pwd); D="$K/episodes/$ID"
[ -e "$D/mkscenes.sh" ] && { echo "Đã có $D — không ghi đè"; exit 1; }
mkdir -p "$D" && cp -R "$HERE/template/." "$D/"
for f in episode.yaml script.md; do sed -i.bak "s|__ID__|$ID|g; s|__TITLE__|$TITLE|g" "$D/$f" && rm -f "$D/$f.bak"; done
mkdir -p "$D/build/prev" "$D/audio"
echo "Đã tạo $D"
echo "Thử nhanh: cd \"$D\" && python3 ../../../studio-template/engine/build.py . audio --silent && python3 build/mkjob.py && python3 build/still.py thu c00_p01:1,3"

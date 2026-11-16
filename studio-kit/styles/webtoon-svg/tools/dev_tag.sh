#!/bin/sh
# Ghép cảnh + file render riêng cho một agent/tag, để nhiều agent dựng song song không ghi đè nhau (13/11/2026).
# Chạy TRONG thư mục tập:  sh <studio-kit>/styles/webtoon-svg/tools/dev_tag.sh <tag>
set -e
T=${1:?thieu tag}
[ -f mkscenes.sh ] || { echo "Chạy trong thư mục tập (cần mkscenes.sh)"; exit 1; }
[ -f build/render_dev_main.json ] || { echo "Thiếu build/render_dev_main.json"; exit 1; }
sh mkscenes.sh dev "$T"
python3 -c "import json,sys;t=sys.argv[1];j=json.load(open('build/render_dev_main.json'));j['scripts']=[s.replace('scenes_dev_main.js','scenes_dev_'+t+'.js') for s in j['scripts']];json.dump(j,open('build/render_dev_'+t+'.json','w'))" "$T"
mkdir -p "build/prev/_st_$T"
echo "OK tag $T → ảnh tĩnh: STILL_JSON=build/render_dev_$T.json STILL_DIR=build/prev/_st_$T python3 build/still.py <tên> <shot:giây,…>"

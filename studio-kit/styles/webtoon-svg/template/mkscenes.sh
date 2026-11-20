#!/bin/sh
# Ghép cảnh của tập → scenes.js (hoặc build/scenes_dev_<tag>.js với: sh mkscenes.sh dev <tag>)
# Thứ tự: phần mở rộng khung xương của pack (chars_*.js: mũ, giáp, đồ cầm… — đã bỏ dàn nhân vật) → nhân vật của bạn (build/design/chars_*.js) → đồ nghề cảnh (sc_*.js, tqlib/, td/)
#         → nền riêng bg/*.js → lời kêu gọi chung của kênh (../../shared/loi_keu_goi/scene_lk_cta.js nếu có) → cảnh của tập sc_tq_*.js
# Pack chars.js / fx.js / fx_moves.js nạp sẵn qua build/render_base.json, không cần cat ở đây.
cd "$(dirname "$0")" && R=${STUDIO_ROOT:-../../..} && P=$R/studio-template/packs/style/webtoon-code-v1
OUT=scenes.js; [ "$1" = dev ] && OUT=build/scenes_dev_${2:-main}.js
CTA=../../shared/loi_keu_goi/scene_lk_cta.js; [ -f $CTA ] || CTA=
cat $P/chars_tnk.js $P/chars_tdk.js $P/chars_kd2.js $P/chars_kd3.js $P/chars_pd.js $P/chars_tq.js $P/chars_tdk2.js $P/chars_hl.js $P/chars_hl2.js $P/chars_ct.js $(LC_ALL=C ls build/design/chars_*.js 2>/dev/null | LC_ALL=C sort) \
  sc_bgkit.js sc_sets.js sc_kit.js sc_bg.js sc_tdk.js sc_fight.js sc_fx2.js tqlib/sc_tqkit.js tqlib/sc_bg_b.js tqlib/sc_bg_c.js tqlib/sc_bg_e.js tqlib/sc_bg_z.js tqlib/c4ease.js tqlib/sc_tq_lib.js \
  $(LC_ALL=C ls bg/*.js 2>/dev/null | LC_ALL=C sort) sc_th_kit.js sc_xh_a_bg.js sc_xh_kit.js sc_xh_kit_intro.js sc_xh_kit_fight.js td/sc_animals.js td/sc_extra.js td/sc_animals3.js td/sc_chars3.js td/sc_animals_dd.js $CTA \
  $(LC_ALL=C ls sc_tq_*.js 2>/dev/null | LC_ALL=C sort) > $OUT && node --check $OUT && echo OK $OUT

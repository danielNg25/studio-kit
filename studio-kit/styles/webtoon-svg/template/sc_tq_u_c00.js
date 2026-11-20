// Cảnh thử (xoá khi dựng tập thật): hai nhân vật mẫu của pack (am = ăn mày, su = nhà sư) trên nền đồng trống 5 lớp lúc hoàng hôn.
// Nhân vật của bạn: thêm CHAR.<id> = { ... } trong build/design/chars_<tập>.js (xem packs/style/webtoon-code-v1/STYLE.md), rồi dùng id đó trong cast.
// Nền: bg: { mode: 'dawn'|'day'|'dusk'|'night', feat: 'plain'|… } (tqbg, sc_tq_c_bg.js) · trong nhà: bg: { in: 'tent'|'hall'|… } (tbIn, sc_tq_m_bg5.js).
EPISODE_SCENES.s_c00_p01 = (T, ctx) => tb(T, ctx, { bg: { mode: 'dusk', feat: 'plain' },
  cast: [['am', 640, { f: 1, k: 1.2, ex: T < 2 ? 'calm' : 'smug' }], ['su', 1280, { f: -1, k: 1.2, ex: T < 2 ? 'calm' : 'shock' }]],
  props: (S, t) => { S.over += kText('ENGINE WEBTOON OK', 960, 160, 80, { c: '#FFF4DC' }); } });

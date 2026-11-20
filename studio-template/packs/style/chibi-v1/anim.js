// chibi-v1 — chuyển động + nạp font. Nạp SAU cutout-v1/core.js + rt.js (dùng talk/tilt/blink/pop/speakingLine) và chibi.js.
// Ghi đè loadPackFonts của rt.js (khai báo function → bản nạp sau thắng) để thêm Pangolin (chữ tay, có dấu tiếng Việt).
async function loadPackFonts(base) {
  const L = [['Bangers', 'Bangers-Regular.ttf', '400', null], ['Be Vietnam Pro', 'BeVietnamPro-Bold.ttf', '700', null], ['Be Vietnam Pro', 'BeVietnamPro-ExtraBold.ttf', '800', null], ['Be Vietnam Pro', 'BeVietnamPro-Black.ttf', '900', null],
    ['Pangolin', 'pangolin-latin-400-normal.woff2', '400', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'],
    ['Pangolin', 'pangolin-vietnamese-400-normal.woff2', '400', 'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB']];
  await Promise.all(L.map(([fam, file, w, ur]) => new FontFace(fam, `url(${base}${file})`, ur ? { weight: w, unicodeRange: ur } : { weight: w }).load().then(f => document.fonts.add(f))));
  return true;
}
// người nói: miệng mở theo talk() khi câu thứ i (trong `lines`) đang được đọc; chớp mắt; nghiêng nhẹ theo nhịp giữ pose
// o.seed: lệch pha để mỗi người chớp/nghiêng khác nhau
var ANIM_T = null, NARR_ON = false;   // NARR_ON: đang phát lời người dẫn (Hóng kể) — tập đặt mỗi khung   // thời gian toàn cục cho chuyển động sống (tập đặt trước mỗi cảnh); null = tĩnh như cũ
// cử chỉ khi nói: tay phải (đang khoanh/buông/chống hông) vung lên mở bàn tay theo nhịp
const GEST_BASE = { fold: [0.08, 0.5], down: [0.6, 0.66], hip: [0.55, 0.44] };
function gestArms(arms, T, sd) {
  arms = arms || {}; const r = arms.r ?? 'down', bp = Array.isArray(r) ? null : GEST_BASE[r]; if (!bp) return arms;
  const gk = Math.pow(Math.max(0, Math.sin(T * 3.1 + sd * 1.7)), 2); if (gk < 0.02) return arms;
  return { ...arms, r: [bp[0] + (0.85 - bp[0]) * gk, bp[1] + (0.12 - bp[1]) * gk] };
}
// đi vào khung: trả {x, walk} — dùng {...NV, ...walkIn(t, t0, x0, x1, dur)}
function walkIn(t, t0, x0, x1, dur = 0.9) { const k = clamp((t - t0) / dur); return { x: x0 + (x1 - x0) * (1 - Math.pow(1 - k, 2)), walk: k < 1 ? Math.max(0, t - t0) * 2.8 : null }; }
function chibiIn(ctx, o, lines = []) {
  const T = ctx.T, i = speakingLine(ctx), on = lines.includes(i), sd = o.seed || 0;
  if (on && !o.noGest) o = { ...o, arms: gestArms(o.arms, T, sd) };
  if (o.enter !== undefined && ctx.lt !== undefined) o = { ...o, ...walkIn(ctx.lt, o.enter, o.x + (o.x < 960 ? -520 : 520), o.x, 1.0) };
  const mouth = on ? (talk(T, true, sd + 3) > 0.4 ? 'open' : (o.mouth === 'open' ? 'flat' : (o.mouth || 'flat'))) : o.mouth;
  const eyes = o.eyes !== 'wide' && o.eyes !== 'happy' && blink(T, 3.1 + (sd % 3) * 0.4, sd * 0.7) ? 'closed' : o.eyes;
  return chibi({ ...o, mouth, eyes, rot: (o.rot || 0) + (on ? tilt(T, 1.6, sd + 5) : tilt(T, 0.5, sd + 9, 1.2)) });
}
function hongIn2(ctx, o, lines = []) {
  const T = ctx.T, i = speakingLine(ctx), on = lines.includes(i);
  if (on && !o.noGest && !o.prop) o = { ...o, arms: gestArms(o.arms, T, 4) };
  if (o.enter !== undefined && ctx.lt !== undefined) o = { ...o, ...walkIn(ctx.lt, o.enter, o.x + (o.x < 960 ? -520 : 520), o.x, 1.0) };
  return hong2({ ...o, mouth: on ? talk(T, true, 11) : undefined, rot: (o.rot || 0) + (on ? tilt(T, 2, 13) : tilt(T, 0.6, 17, 1.3)) });
}
// thẻ tên rơi xuống + đung đưa nhẹ
function plaqueIn(t, t0, name, sub, x, y, o = {}) { if (t < t0) return ''; const k = clamp((t - t0) / 0.35), dy = (1 - easeBack(k)) * -160, sw = Math.sin((t - t0) * 3) * 1.2 * Math.exp(-(t - t0) * 0.8);
  return `<g opacity="${f1(clamp(k * 2))}" transform="translate(0 ${f1(dy)})">${plaque(name, sub, x, y, { ...o, rot: (o.rot ?? -2) + sw })}</g>`; }
const ribbonIn = (t, t0, s, x, y, o) => t < t0 ? '' : `<g opacity="${f1(clamp((t - t0) / 0.3))}" transform="translate(${f1((1 - easeOut(clamp((t - t0) / 0.4))) * -80)} 0)">${placeRibbon(s, x, y, o)}</g>`;
// con dấu đỏ kiểu ấn triện (khác stamp() của cutout-v1: viền đôi, chữ tay)
function sealIn(s, x, y, t, t0, o = {}) { if (t < t0) return ''; const k = clamp((t - t0) / 0.18), sc = 1.8 - 0.8 * easeOut(k), sz = o.size || 60, w = s.length * sz * 0.6 + 60, c = o.color || '#B32B22';
  return `<g transform="translate(${x} ${y}) rotate(${o.rot ?? -7}) scale(${sc.toFixed(3)})" opacity="${f1(k)}">${o.bg === false ? '' : `<rect x="${-w / 2}" y="${-sz * 0.85}" width="${w}" height="${sz * 1.6}" rx="8" fill="${o.bg || (c === '#F2D16B' ? '#2A211C' : '#F7EFDC')}" opacity="0.93"/>`}<rect x="${-w / 2}" y="${-sz * 0.85}" width="${w}" height="${sz * 1.6}" rx="8" fill="none" stroke="${c}" stroke-width="8"/><rect x="${-w / 2 + 10}" y="${-sz * 0.85 + 10}" width="${w - 20}" height="${sz * 1.6 - 20}" rx="4" fill="none" stroke="${c}" stroke-width="3"/><text x="0" y="${sz * 0.3}" font-family="${FH}" font-size="${sz}" text-anchor="middle" fill="${c}">${s}</text></g>`; }
// camera: đẩy/kéo + trượt (Ken Burns) quanh tâm cx,cy
const cam = (content, k, s0, s1, cx = 960, cy = 540, dx = 0, dy = 0) => { const s = lerp(s0, s1, ease(k)); return `<g transform="translate(${f1(cx + dx * ease(k))} ${f1(cy + dy * ease(k))}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})">${content}</g>`; };

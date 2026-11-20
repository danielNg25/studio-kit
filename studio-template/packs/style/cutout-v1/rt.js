// cutout-v1 — hàm nền cho engine (runtime.js cần: NS, rect, tx, ease, S, loadPackFonts) + hoạt hình giới hạn (pose giữ 0,25–0,7 s).
// Nạp SAU core.js (dùng txt, INK, F của core.js).
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = k => { k = clamp(k); return 1 - Math.pow(1 - k, 3); };
const easeBack = k => { k = clamp(k); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const f1 = v => (Math.round(v * 10) / 10).toString();
function rnd(...a) { let h = 2166136261; for (const v of a) { h ^= Math.floor(v * 1000) | 0; h = Math.imul(h, 16777619); } h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) / 4294967296; }
const step = (t, hold = 0.42, ph = 0) => Math.floor((t + ph) / hold);
function talk(t, on = true, seed = 0) { if (!on) return 0; const r = rnd(Math.floor(t / 0.1), seed); return r < 0.22 ? 0 : r < 0.55 ? 0.45 : r < 0.85 ? 0.8 : 1; }
const tilt = (t, amp = 3, seed = 0, hold = 0.55) => (rnd(step(t, hold), seed + 7) - 0.5) * 2 * amp;
const blink = (t, per = 3.3, ph = 0) => (((t + ph) % per + per) % per) < 0.12;
// bật vào: tỉ lệ 0→1 có nảy, bắt đầu ở t0
const pop = (t, t0, dur = 0.3) => t < t0 ? 0 : easeBack((t - t0) / dur);
const rect = (x, y, w, h, fill, o = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${o}/>`;
// tx(str, x, y, {size, fill, outline, ow, font:'Title'|'Sans', anchor}) — cho runtime + cảnh; dùng txt của core.js
function tx(str, x, y, o = {}) { return txt(str, x, y + (o.size || 48) * 0.35, { size: o.size, fill: o.fill || INK, stroke: o.outline, sw: o.ow, font: o.font === 'Title' ? F.title : F.bold, anchor: o.anchor, weight: o.weight }); }
function S(pts, closed = false) { if (!pts.length) return ''; let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`; for (let i = 1; i < pts.length; i++) d += ` L${f1(pts[i][0])} ${f1(pts[i][1])}`; return d + (closed ? 'Z' : ''); }
async function loadPackFonts(base) {
  const L = [['Bangers', 'Bangers-Regular.ttf', '400'], ['Be Vietnam Pro', 'BeVietnamPro-Bold.ttf', '700'], ['Be Vietnam Pro', 'BeVietnamPro-ExtraBold.ttf', '800'], ['Be Vietnam Pro', 'BeVietnamPro-Black.ttf', '900']];
  await Promise.all(L.map(([fam, file, w]) => new FontFace(fam, `url(${base}${file})`, { weight: w }).load().then(f => document.fonts.add(f))));
  return true;
}
// lời đang nói trong shot: ctx.lines[i].sents[{start,dur}] (giờ tuyệt đối) → câu nào đang nói ở thời điểm T
function speakingLine(ctx) { for (let i = 0; i < (ctx.lines || []).length; i++) for (const se of ctx.lines[i].sents || []) if (ctx.T >= se.start && ctx.T < se.start + se.dur) return i; return -1; }
// thời điểm (giờ trong shot) bắt đầu câu thứ i
const lineAt = (ctx, i) => { const l = (ctx.lines || [])[i]; return l && l.sents && l.sents[0] ? l.sents[0].start - (ctx.T - (ctx.lt || 0)) : 0; };
// rung máy nhẹ / đẩy cảnh chậm (Ken Burns)
const push = (content, t, dur, amt = 0.05, cx = 960, cy = 540) => { const k = 1 + amt * ease(t / Math.max(dur, 0.01)); return `<g transform="translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy})">${content}</g>`; };
// bóng thoại có đuôi; xuất hiện bằng pop
function say(s, x, y, tx_, ty_, t, t0, size = 40) { const k = pop(t, t0, 0.22); if (k <= 0) return ''; return `<g transform="translate(${tx_} ${ty_}) scale(${k.toFixed(3)}) translate(${-tx_} ${-ty_})">${bubble(s, x, y, tx_, ty_, size)}</g>`; }
// con dấu đóng xuống
function stamp(s, x, y, t, t0, o = {}) { if (t < t0) return ''; const k = clamp((t - t0) / 0.18), sc = 1.8 - 0.8 * easeOut(k), sz = o.size || 64, w = s.length * sz * 0.62 + 50;
  return `<g transform="translate(${x} ${y}) rotate(${o.rot ?? -8}) scale(${sc.toFixed(3)})" opacity="${k.toFixed(2)}"><rect x="${-w / 2}" y="${-sz * 0.85}" width="${w}" height="${sz * 1.5}" rx="10" fill="none" stroke="${o.color || '#C2361F'}" stroke-width="9"/>${txt(s, 0, sz * 0.22, { font: F.title, size: sz, fill: o.color || '#C2361F' })}</g>`; }

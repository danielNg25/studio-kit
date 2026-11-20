// ===== NỀN TẬP TÂY DU KÝ PHẦN 1 (2026-10-13) — bối cảnh chi tiết theo luật nền của kênh (VISUAL_RULES: nhiều lớp, cây/cỏ/đồ đạc đúng thời, cảnh tối vẫn nhìn rõ)
// Dùng đồ nghề sc_bgkit.js + sc_sets.js (chép từ tập 1). Mọi nền: bg_<tên>(t, o) trả SVG khung 1920×1080, nhân vật đứng ở ground ≈ 1075.
// Bảng màu: hạ giới xanh lá/đá ấm; thiên giới vàng nhạt–tím hồng, mây dày làm nền đất, ngọc trắng + cột đỏ + ngói vàng; âm phủ đỏ–tím than; Long Cung xanh ngọc.

// ======================= ĐỒ NGHỀ RIÊNG =======================
const tdC = { ink: INK2, jade: '#EDEBE2', jade2: '#D6D2C2', gold: '#E2B23A', gold2: '#B8862A', red: '#B03A2E', red2: '#8E2A22', roofG: '#D9A52E' };
const f2 = (v) => R1(v * 100) / 100;

// mây tường vân (đầu xoắn ốc) — x,y tâm, s cỡ, c màu
function tdXiang(x, y, s = 1, c = '#FFF6E6', flip = false) {
  const b = `<path d="M-150 30 Q-170 -10 -130 -24 Q-128 -66 -84 -64 Q-60 -100 -14 -84 Q20 -112 62 -86 Q110 -96 118 -50 Q160 -44 156 -6 Q176 26 140 34Z" fill="${c}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M-120 14 q-6 -26 18 -30 q22 -2 22 18 q-2 14 -16 12" stroke="${INK2}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M40 -40 q4 -28 30 -24 q22 6 14 26 q-8 12 -20 4" stroke="${INK2}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    `<path d="M-40 6 q30 -18 60 0 q30 18 60 0" stroke="${dk(c, 0.12)}" stroke-width="5" fill="none" opacity="0.8"/><path d="M-150 30 Q-40 50 140 34" stroke="${dk(c, 0.18)}" stroke-width="7" fill="none" opacity="0.5"/>`;
  return `<g transform="translate(${R1(x)} ${R1(y)}) scale(${flip ? -s : s} ${s})">${b}</g>`;
}
// khối mây phồng: list [[x, y, r]] — viền mực chỉ ở mép ngoài (vẽ viền dày trước, phủ nền sau), có đường xoắn nhỏ bên trong
function tdPuffs(list, c = '#FFF6EA', sw = 4, o = {}) {
  let a = '', sh = '', b = '', h = '';
  const cs = dk(c, 0.1);
  for (const [x, y, r] of list) { a += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${INK2}" stroke="${INK2}" stroke-width="${sw * 2}"/>`; sh += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${cs}"/>`; b += `<circle cx="${R1(x - r * 0.04)}" cy="${R1(y - r * 0.14)}" r="${R1(r * 0.88)}" fill="${c}"/>`; }
  list.forEach(([x, y, r], i) => { if (r > 30) h += `<path d="M${R1(x - r * 0.55)} ${R1(y - r * 0.25)} Q${R1(x - r * 0.42)} ${R1(y - r * 0.72)} ${R1(x + r * 0.05)} ${R1(y - r * 0.7)}" stroke="#FFFFFF" stroke-width="${R1(Math.max(3, r * 0.08))}" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    if (o.curl && i % 3 === 1 && r > 40) h += `<path d="M${R1(x - r * 0.3)} ${R1(y + r * 0.2)} q${R1(r * 0.05)} ${R1(-r * 0.3)} ${R1(r * 0.3)} ${R1(-r * 0.22)} q${R1(r * 0.2)} ${R1(r * 0.1)} ${R1(r * 0.05)} ${R1(r * 0.26)} q${R1(-r * 0.12)} ${R1(r * 0.05)} ${R1(-r * 0.12)} ${R1(-r * 0.08)}" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none" stroke-linecap="round"/>`; });
  return a + (o.base ? `<rect x="-50" y="${R1(o.base)}" width="2020" height="${R1(1130 - o.base)}" fill="${cs}"/>` : '') + sh + b + h;
}
// biển mây làm nền đất trên trời: các lớp mây phồng, trôi chậm — y = mép trên lớp xa nhất
function tdCloudSea(y, T, o = {}) {
  const cs = o.cols || ['#E6D8EC', '#F2E6F0', '#FFF8EE'], sp = o.sp ?? 10;
  let s = '';
  cs.forEach((c, L) => {
    const yy = y + L * (o.gap || 90), r0 = (o.r || 56) + L * 26, step = r0 * 1.25, span = 1920 + step * 4, off = (T * sp * (L + 1)) % step;
    const list = [];
    for (let i = 0, x = -step * 2 - off; x < 1920 + step * 2; x += step, i++) { const k = Math.floor((x + off) / step) + 50; const r = r0 * (0.8 + 0.45 * hrnd(k, L + 3)); list.push([x, yy + r0 * 0.5 - r * 0.55 + 14 * hrnd(k, L + 4), r]); if (hrnd(k, L + 5) > 0.45) list.push([x + step * 0.5, yy + r0 * 0.6, r * 0.7]); }
    s += tdPuffs(list, c, 3 + L * 0.8, { base: yy + r0 * 0.55, curl: o.curl !== false });
    s += `<rect x="0" y="${R1(yy + r0 * 0.9)}" width="1920" height="${R1(r0 * 0.5)}" fill="${dk(c, 0.07)}" opacity="0.5"/>`;
  });
  return s;
}
// tia sáng toả từ (cx, cy)
function tdRays(cx, cy, n = 14, c = '#FFF0C0', op = 0.22, T = AT_(), len = 1600) {
  let s = ''; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + T * 0.04, w = 0.07 + 0.04 * hrnd(i, 4); s += `<path d="M${cx} ${cy} L${R1(cx + Math.cos(a - w) * len)} ${R1(cy + Math.sin(a - w) * len)} L${R1(cx + Math.cos(a + w) * len)} ${R1(cy + Math.sin(a + w) * len)}Z" fill="${c}" opacity="${f2(op * (0.6 + 0.4 * Math.sin(T * 0.8 + i)))}"/>`; }
  return s;
}
// hạc bay (nhìn nghiêng), vỗ cánh
function tdCrane(x, y, s = 1, T = AT_(), flip = false) {
  const fl = Math.sin(T * 5 + x * 0.01) * 26;
  return `<g transform="translate(${R1(x)} ${R1(y)}) scale(${flip ? -s : s} ${s})"><path d="M-70 0 Q-20 -10 40 -4 Q70 -2 96 -14" stroke="${INK2}" stroke-width="5" fill="none"/><path d="M96 -14 l22 4 l-22 4Z" fill="#E8A030" stroke="${INK2}" stroke-width="2"/><circle cx="92" cy="-16" r="6" fill="#C0392B"/>` +
    `<ellipse cx="0" cy="0" rx="46" ry="16" fill="#FAFAF4" stroke="${INK2}" stroke-width="3.5"/><path d="M-10 -4 Q-30 ${R1(-60 - fl)} -90 ${R1(-70 - fl)} Q-40 -30 20 -6Z" fill="#FAFAF4" stroke="${INK2}" stroke-width="3.5"/><path d="M-60 ${R1(-58 - fl)} q-20 -2 -30 ${R1(-12)}" stroke="${INK2}" stroke-width="6"/>` +
    `<path d="M-46 4 L-110 22 M-46 8 L-108 30" stroke="${INK2}" stroke-width="3"/><path d="M-44 2 l-14 8 l10 4Z" fill="${INK2}"/></g>`;
}
// lan can ngọc trắng (phối cảnh thẳng): từ x0 đến x1 tại chân y, cao h
function tdRail(x0, x1, y, h = 90, c = tdC.jade) {
  let s = `<rect x="${x0}" y="${R1(y - h * 0.28)}" width="${x1 - x0}" height="${R1(h * 0.28)}" fill="${dk(c, 0.06)}" stroke="${INK2}" stroke-width="4"/>`;
  s += `<rect x="${x0}" y="${R1(y - h * 0.86)}" width="${x1 - x0}" height="${R1(h * 0.14)}" rx="6" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  const n = Math.max(2, Math.round((x1 - x0) / 120));
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; s += `<rect x="${R1(x - 11)}" y="${R1(y - h)}" width="22" height="${h}" fill="${c}" stroke="${INK2}" stroke-width="4"/><circle cx="${R1(x)}" cy="${R1(y - h - 8)}" r="14" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><path d="M${R1(x - 9)} ${R1(y - h - 12)} q9 -10 18 0" stroke="${dk(c, 0.2)}" stroke-width="2.5" fill="none"/>`;
    if (i < n) { const xm = x + (x1 - x0) / n / 2; s += `<path d="M${R1(xm - 30)} ${R1(y - h * 0.5)} q15 -16 30 0 q15 16 30 0" stroke="${dk(c, 0.18)}" stroke-width="3" fill="none"/><rect x="${R1(x + 16)}" y="${R1(y - h * 0.7)}" width="${R1((x1 - x0) / n - 32)}" height="${R1(h * 0.4)}" fill="none" stroke="${dk(c, 0.12)}" stroke-width="2.5"/>`; } }
  return s;
}
// vách núi đá vôi dựng đứng kiểu Trương Gia Giới: chân (x, g), rộng w, cao h
function tdCrag(x, g, w, h, c = '#8E9A8A', seed = 1, o = {}) {
  const pts = [], n = 9, top = g - h;
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x - w / 2 + 8 * (hrnd(i, seed) - 0.5) * (i % 2 ? 2 : 1) + w * 0.06 * u, g - (h * 0.92) * u]); }
  const L = pts, R = pts.map(([px, py], i) => [x + (x - px) + w * 0.04 * (hrnd(i, seed + 5) - 0.5) * 4, py]);
  const tw = w * 0.42;
  let d = `M${R1(L[0][0])} ${g}`; for (const p of L) d += ` L${R1(p[0])} ${R1(p[1])}`;
  d += ` Q${R1(x - tw * 0.6)} ${R1(top - 30)} ${R1(x)} ${R1(top - 26)} Q${R1(x + tw * 0.6)} ${R1(top - 30)} ${R1(R[n][0])} ${R1(R[n][1])}`;
  for (let i = n; i >= 0; i--) d += ` L${R1(R[i][0])} ${R1(R[i][1])}`;
  d += 'Z';
  let s = `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4.5}" stroke-linejoin="round"/>`;
  // mặt tối bên phải + vân đá ngang
  s += `<path d="M${R1(x + w * 0.12)} ${g} L${R1(x + w * 0.16)} ${R1(top + 40)} Q${R1(x + w * 0.3)} ${R1(top)} ${R1(R[n][0] - 4)} ${R1(R[n][1] + 8)} L${R1(R[0][0] - 4)} ${g}Z" fill="${dk(c, 0.16)}" opacity="0.75"/>`;
  for (let k = 1; k < 9; k++) { const yy = g - h * k / 9 + hrnd(k, seed + 2) * 20, xa = x - w * 0.45, xb = x + w * 0.45; s += `<path d="M${R1(xa + hrnd(k, seed + 3) * 30)} ${R1(yy)} q${R1(w * 0.2)} ${R1(-8 + hrnd(k, seed) * 16)} ${R1(w * 0.42)} 0" stroke="${dk(c, 0.28)}" stroke-width="3" fill="none" opacity="0.7"/><path d="M${R1(xa + w * 0.1)} ${R1(yy - 12)} h${R1(w * 0.18)}" stroke="${lt_(c, 0.3)}" stroke-width="3" opacity="0.7"/>`; }
  // cây bám vách
  if (o.trees !== false) for (let k = 0; k < (o.nt || 4); k++) { const yy = top + 20 + (h * 0.75) * hrnd(k, seed + 7), xx = x + (hrnd(k, seed + 8) > 0.5 ? 1 : -1) * w * (0.32 + 0.12 * hrnd(k, seed + 9)), sc = 0.22 + 0.16 * hrnd(k, seed + 10);
    s += hrnd(k, seed + 11) > 0.45 ? pineD(xx, yy, sc, o.tree || '#4E6E4A') : bushD(xx, yy, sc * 1.1, o.tree || '#5E8A4A'); }
  if (o.cap !== false) s += `<path d="M${R1(x - tw * 0.85)} ${R1(top + 6)} Q${R1(x - tw * 0.3)} ${R1(top - 40)} ${R1(x + tw * 0.1)} ${R1(top - 22)} Q${R1(x + tw * 0.6)} ${R1(top - 34)} ${R1(x + tw * 0.9)} ${R1(top + 8)} Q${R1(x)} ${R1(top + 26)} ${R1(x - tw * 0.85)} ${R1(top + 6)}Z" fill="${o.capC || '#6E9A56'}" stroke="${INK2}" stroke-width="3.5"/>`;
  return s;
}
// cây ăn quả (tán tròn + quả)
function tdFruitTree(x, g, s = 1, fc = '#F08A3A', o = {}) {
  let b = treeD(0, 0, 1, { c: o.c || '#5E8A44', noShadow: o.noShadow });
  for (let i = 0; i < (o.n || 16); i++) { const a = hrnd(i, 21 + (o.seed || 0)) * 6.28, r = 30 + hrnd(i, 22) * 95; b += `<circle cx="${R1(Math.cos(a) * r * 1.1)}" cy="${R1(-275 + Math.sin(a) * r * 0.65)}" r="${R1(11 + hrnd(i, 23) * 5)}" fill="${fc}" stroke="${INK2}" stroke-width="2.5"/><path d="M${R1(Math.cos(a) * r * 1.1 - 3)} ${R1(-275 + Math.sin(a) * r * 0.65 - 8)} l-4 -6" stroke="#4E6E30" stroke-width="3"/>`; }
  return _g(x, g, s, b);
}
// cây chuối
function tdBanana(x, g, s = 1, T = AT_()) {
  const sw = Math.sin(T * 1.3 + x * 0.02) * 4;
  let b = `<path d="M-14 0 Q-18 -140 -6 -260 L10 -260 Q18 -140 16 0Z" fill="#8A9A5A" stroke="${INK2}" stroke-width="4.5"/><path d="M-4 -40 v-40 M4 -120 v-50 M-2 -190 v-40" stroke="#6E7E44" stroke-width="3"/>`;
  const lv = [[-160, -300, -20], [150, -320, 15], [-110, -380, -45], [120, -390, 40], [0, -420, 0], [-170, -230, -5], [170, -250, 8]];
  for (const [lx, ly, r] of lv) { const ex = lx + sw, ey = ly; b += `<path d="M2 -255 Q${R1(ex * 0.4)} ${R1(ey - 70)} ${R1(ex)} ${R1(ey)} Q${R1(ex * 0.55)} ${R1(ey + 40)} 2 -250Z" fill="#7FB04A" stroke="${INK2}" stroke-width="4"/><path d="M2 -253 Q${R1(ex * 0.5)} ${R1(ey - 18)} ${R1(ex * 0.96)} ${R1(ey + 2)}" stroke="#5E8A34" stroke-width="3" fill="none"/>` + [0.35, 0.55, 0.75].map(u => `<path d="M${R1(ex * u)} ${R1(-255 + (ey + 255) * u - 6)} l${R1(lx > 0 ? -8 : 8)} 22" stroke="#5E8A34" stroke-width="2.5"/>`).join(''); }
  b += `<path d="M6 -250 q24 30 18 70" stroke="#6E5A2A" stroke-width="5" fill="none"/>` + [0, 1, 2, 3].map(i => `<path d="M${R1(14 + i * 4)} ${R1(-226 + i * 12)} q16 2 22 -14" stroke="${INK2}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M${R1(14 + i * 4)} ${R1(-226 + i * 12)} q16 2 22 -14" stroke="#E4C640" stroke-width="7" stroke-linecap="round" fill="none"/>`).join('');
  return _g(x, g, s, b);
}
// dây leo rủ
function tdVines(x, y, n = 5, len = 260, T = AT_(), c = '#5E8A3A', seed = 1) {
  let s = ''; for (let i = 0; i < n; i++) { const xx = x + i * 26 + hrnd(i, seed) * 20, L = len * (0.6 + 0.6 * hrnd(i, seed + 1)), sw = Math.sin(T * 1.1 + i) * 10;
    s += `<path d="M${R1(xx)} ${y} Q${R1(xx + sw)} ${R1(y + L * 0.5)} ${R1(xx + sw * 0.6)} ${R1(y + L)}" stroke="${INK2}" stroke-width="7" fill="none"/><path d="M${R1(xx)} ${y} Q${R1(xx + sw)} ${R1(y + L * 0.5)} ${R1(xx + sw * 0.6)} ${R1(y + L)}" stroke="${c}" stroke-width="4" fill="none"/>`;
    for (let k = 1; k < 6; k++) { const u = k / 6, lx = xx + sw * u, ly = y + L * u; s += `<path d="M${R1(lx)} ${R1(ly)} q${k % 2 ? 14 : -14} -4 ${k % 2 ? 18 : -18} 10 q${k % 2 ? -10 : 10} 2 ${k % 2 ? -18 : 18} -10Z" fill="${lt_(c, 0.15)}" stroke="${INK2}" stroke-width="2"/>`; } }
  return s;
}
// thác nước: từ (x, y0) xuống y1, rộng w; o.plunge: bọt dưới chân
function tdFall(x, y0, y1, w, T = AT_(), o = {}) {
  const c = o.c || '#CFE8F4', c2 = o.c2 || '#9CCBE0';
  let s = `<path d="M${R1(x - w / 2)} ${y0} Q${R1(x - w / 2 - 10)} ${R1((y0 + y1) / 2)} ${R1(x - w / 2 - 22)} ${y1} H${R1(x + w / 2 + 22)} Q${R1(x + w / 2 + 10)} ${R1((y0 + y1) / 2)} ${R1(x + w / 2)} ${y0}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M${R1(x - w * 0.3)} ${y0} Q${R1(x - w * 0.32)} ${R1((y0 + y1) / 2)} ${R1(x - w * 0.36)} ${y1} H${R1(x - w * 0.18)} Q${R1(x - w * 0.16)} ${R1((y0 + y1) / 2)} ${R1(x - w * 0.14)} ${y0}Z" fill="#FFFFFF" opacity="0.45"/>`;
  const H = y1 - y0, n = Math.max(5, Math.round(w / 26));
  for (let i = 0; i < n; i++) { const xx = x - w / 2 + 10 + (w - 20) * i / (n - 1), L = 50 + hrnd(i, 3) * 90, sp = 260 + hrnd(i, 4) * 160;
    for (let k = 0; k < 3; k++) { const yy = y0 + ((T * sp + hrnd(i, 5 + k) * H + k * H / 3) % H); s += `<path d="M${R1(xx + (yy - y0) / H * (xx - x) * 0.06)} ${R1(yy)} v${R1(Math.min(L, y1 - yy))}" stroke="${k === 1 ? '#FFFFFF' : c2}" stroke-width="${k === 1 ? 5 : 4}" stroke-linecap="round" opacity="0.85"/>`; } }
  s += `<path d="M${R1(x - w / 2)} ${y0} Q${x} ${y0 + 18} ${R1(x + w / 2)} ${y0}" stroke="#FFFFFF" stroke-width="8" fill="none" opacity="0.8"/>`;
  if (o.plunge !== false) { const L = []; for (let i = 0; i < 14; i++) { const u = i / 13, r = (18 + 22 * hrnd(i, 9)) * (1 - 0.35 * Math.abs(u - 0.5)) + 6 * Math.sin(T * 3 + i); L.push([x - w / 2 - 40 + (w + 80) * u, y1 - 6 - 14 * hrnd(i, 10), r]); if (i % 2) L.push([x - w / 2 - 20 + (w + 40) * u, y1 - 30 - 10 * hrnd(i, 11), r * 0.7]); }
    s += `<ellipse cx="${x}" cy="${R1(y1 - 20)}" rx="${R1(w * 0.95)}" ry="70" fill="#FFFFFF" opacity="0.3"/>` + tdPuffs(L, '#FFFFFF', 2.5); }
  return s;
}
// mặt nước phẳng (hồ/suối) có gợn: đa giác pts, màu c
function tdWater(pts, c = '#7FB6CC', T = AT_(), seed = 1) {
  let s = _q(pts, c, 4);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  for (let i = 0; i < 16; i++) { const yy = y0 + 20 + hrnd(i, seed) * (y1 - y0 - 30), k = 0.5 + (yy - y0) / Math.max(1, y1 - y0), xx = x0 + hrnd(i, seed + 1) * (x1 - x0) + Math.sin(T * 1.4 + i) * 16; s += `<path d="M${R1(xx)} ${R1(yy)} q${R1(16 * k)} ${R1(-7 * k)} ${R1(32 * k)} 0 q${R1(16 * k)} ${R1(7 * k)} ${R1(32 * k)} 0" stroke="#FFFFFF" stroke-width="${R1(2 + 1.5 * k)}" fill="none" opacity="0.6"/>`; }
  return s;
}
// tảng đá lớn kiểu đá núi (nhiều mặt)
function tdBoulder(x, g, s = 1, c = '#9A9488', seed = 1) {
  const b = `<path d="M-120 0 Q-138 -60 -96 -104 Q-50 -150 20 -140 Q96 -128 124 -66 Q140 -24 126 0Z" fill="${c}" stroke="${INK2}" stroke-width="5"/><path d="M20 -140 Q30 -80 0 -40 Q-10 -20 -30 0" stroke="${dk(c, 0.2)}" stroke-width="4" fill="none"/><path d="M20 -140 Q96 -128 124 -66 Q140 -24 126 0 H-28 Q-8 -24 2 -44 Q30 -84 20 -140Z" fill="${dk(c, 0.14)}" opacity="0.7"/><path d="M-80 -90 q30 -26 66 -26" stroke="${lt_(c, 0.32)}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-110 -10 q26 -8 46 6" stroke="#6E8A4A" stroke-width="8" stroke-linecap="round"/>`;
  return _g(x, g, s, b);
}
// bờ cỏ có rìa đất (để làm mép nền)
function tdBank(pts, c = '#86A85A', edge = '#A88C62') { return _q(pts, c, 4) + `<path d="M${pts.slice(0, -2).map(p => `${R1(p[0])} ${R1(p[1] + 10)}`).join(' L')}" stroke="${edge}" stroke-width="12" fill="none" opacity="0.6" stroke-linejoin="round"/>`; }

// ======================= BỐI CẢNH =======================

// ---------- Hoa Quả Sơn (bên ngoài, bãi trước động) — o.flag: cờ Tề Thiên trên đỉnh; o.ruin: bị đánh phá (khói, cây gãy); o.camp: bãi tập (giá binh khí)
function bg_hqs(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('hqsSk', '#8EC4E8', '#FBEFD8');
  s += `<circle cx="1620" cy="150" r="66" fill="#FFF0B8"/><circle cx="1620" cy="150" r="140" fill="#FFF0B8" opacity="0.25"/>` + cloudsDrift([[160, 120, 1.1, '#FFF8EE'], [780, 70, 0.8, '#FFF8EE'], [1300, 140, 1.0, '#FFF8EE']], 7);
  // biển + đảo xa
  s += `<rect y="430" width="1920" height="200" fill="#86BCD4"/><path d="M0 430 H1920" stroke="${INK2}" stroke-width="3"/>` + [...Array(14)].map((_, i) => `<path d="M${R1((hrnd(i, 2) * 2000 + T * 18) % 2000 - 40)} ${R1(446 + hrnd(i, 3) * 120)} q14 -6 28 0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.7"/>`).join('');
  s += tdGreenPeak(140, 470, 220, 70, '#A8C4B4', 41, { cliff: false, dots: 6, sw: 3 }) + tdGreenPeak(1800, 470, 260, 80, '#A8C4B4', 42, { cliff: false, dots: 6, sw: 3 });
  // dãy núi Hoa Quả Sơn: lớp xa nhạt → lớp gần đậm, hoa điểm xuyết
  s += tdGreenPeak(420, 640, 620, 330, '#9CBC8C', 43, { cliff: false, dots: 18, bloom: 6, sw: 3.5 }) + tdGreenPeak(1500, 640, 680, 360, '#9CBC8C', 44, { cliffX: -0.18, dots: 20, bloom: 7, rock: '#B4B0A4', sw: 3.5 });
  s += wxMist(560, 0.4, '#FFFFFF', T);
  s += tdGreenPeak(960, 700, 900, 560, '#7FAA58', 45, { cliff: false, dots: 30, bloom: 12, sharp: 0.7 });
  // vách đá giữa núi có thác Thủy Liêm + miệng hang tối sau màn nước
  s += `<path d="M780 700 L800 300 Q880 250 960 248 Q1050 250 1130 300 L1150 700Z" fill="#A8A08E" stroke="${INK2}" stroke-width="5"/><path d="M960 248 Q1050 250 1130 300 L1150 700 H1040 Q1060 480 960 248Z" fill="#948C7A" opacity="0.6"/>`;
  for (let k = 0; k < 7; k++) s += `<path d="M${R1(800 + hrnd(k, 7) * 40)} ${R1(320 + k * 55)} q50 -8 80 4 M${R1(1060 + hrnd(k, 8) * 30)} ${R1(330 + k * 52)} q40 -6 70 6" stroke="#7E7666" stroke-width="3.5" fill="none"/>`;
  s += tdVines(800, 290, 4, 260, T, '#5E8A3A', 21) + tdVines(1050, 290, 4, 280, T, '#5E8A3A', 22);
  s += `<path d="M800 300 Q880 230 960 236 Q1050 230 1130 300 Q1040 270 960 272 Q880 270 800 300Z" fill="#6E9A4A" stroke="${INK2}" stroke-width="3.5"/>` + bushD(820, 300, 0.5, '#5E8A3A') + bushD(1110, 300, 0.5, '#5E8A3A');
  s += `<path d="M900 690 Q900 560 960 540 Q1020 560 1020 690Z" fill="#3A4652" opacity="0.6"/>`;
  s += tdFall(960, 270, 690, 190, T);
  // hồ dưới thác
  s += tdWater([[640, 690], [1280, 690], [1360, 730], [1180, 770], [740, 770], [560, 730]], '#7EBAD0', T, 13) + [0, 1].map(i => `<ellipse cx="960" cy="704" rx="${R1(130 + ((T * 50 + i * 90) % 200))}" ry="${R1(12 + ((T * 50 + i * 90) % 200) * 0.06)}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.55"/>`).join('');
  if (o.flag) { const fx = 1500, fy = 300, wv = Math.sin(T * 4) * 14; s += `<path d="M${fx} ${fy} V${fy - 230}" stroke="${INK2}" stroke-width="10"/><path d="M${fx} ${fy - 228} Q${fx + 120} ${R1(fy - 250 + wv)} ${fx + 250} ${R1(fy - 228 - wv)} L${fx + 250} ${R1(fy - 40 - wv)} Q${fx + 120} ${R1(fy - 60 + wv)} ${fx} ${fy - 40}Z" fill="#C0392B" stroke="${INK2}" stroke-width="5"/><text x="${fx + 125}" y="${fy - 120}" font-family="${FH}" font-size="40" fill="#F2D16B" text-anchor="middle" stroke="${INK2}" stroke-width="1.5">TỀ THIÊN</text><text x="${fx + 125}" y="${fy - 70}" font-family="${FH}" font-size="40" fill="#F2D16B" text-anchor="middle" stroke="${INK2}" stroke-width="1.5">ĐẠI THÁNH</text>`; }
  // cây hoa + cây trái giữa cảnh
  s += tdBlossom(560, 720, 0.6, '#F4B8C8', T) + tdBlossom(1380, 720, 0.55, '#FFFFFF', T) + tdFruitTree(700, 740, 0.45, '#F08A3A', { seed: 5 }) + tdFruitTree(1240, 745, 0.45, '#E8564A', { seed: 6 });
  // đồng hoa tiền cảnh + lối đất ra hồ
  s += `<path d="M0 760 Q480 730 760 770 H1160 Q1440 730 1920 760 V1080 H0Z" fill="#94BC62" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M600 1080 Q760 900 860 772 H1060 Q1160 900 1320 1080Z" fill="#D2C08E" stroke="${INK2}" stroke-width="3.5"/>` + pebbles(30, 680, 790, 560, 280, '#B09C70', 4) + [...Array(6)].map((_, i) => { const y = 800 + i * i * 9 + i * 14, w = 200 + (y - 772) * 1.4; return `<ellipse cx="${R1(960 + Math.sin(i * 1.7) * w * 0.12)}" cy="${y}" rx="${R1(30 + (y - 772) * 0.12)}" ry="${R1(8 + (y - 772) * 0.03)}" fill="#C0AE7E" stroke="${INK2}" stroke-width="2"/>`; }).join('');   // đá bước
  s += tdBanana(110, 920, 1.05, T) + tdFruitTree(360, 860, 0.85, '#F08A3A', { seed: 1 }) + tdBlossom(1600, 880, 0.95, '#F4B8C8', T) + tdBanana(1840, 940, 1.0, T) + tdFruitTree(1450, 1010, 0.6, '#E8564A', { seed: 2 });
  s += tdBoulder(280, 1020, 0.85, '#A09A8C', 1) + tdBoulder(1720, 1050, 0.95, '#A09A8C', 2) + tdBoulder(560, 880, 0.4, '#A09A8C', 3);
  for (const [x, g, sd] of [[40, 1080, 1], [1880, 1080, -1], [500, 1080, 1]]) for (let k = 0; k < 5; k++) { const a = (-70 + k * 30) * sd, L = 150 + (k % 2) * 40, ex = x + Math.sin(a * Math.PI / 180) * L, ey = g - Math.cos(a * Math.PI / 180) * L; s += `<path d="M${x} ${g} Q${R1((x + ex) / 2)} ${R1(ey - 30)} ${R1(ex)} ${R1(ey)}" stroke="${INK2}" stroke-width="8" fill="none"/><path d="M${x} ${g} Q${R1((x + ex) / 2)} ${R1(ey - 30)} ${R1(ex)} ${R1(ey)}" stroke="#4E7A34" stroke-width="5" fill="none"/>` + [0.3, 0.5, 0.7, 0.9].map(u => `<ellipse cx="${R1(x + (ex - x) * u)}" cy="${R1(g + (ey - g) * u - 18 * Math.sin(u * Math.PI))}" rx="16" ry="7" fill="#6E9A44" stroke="${INK2}" stroke-width="2" transform="rotate(${R1(a * 0.6)} ${R1(x + (ex - x) * u)} ${R1(g + (ey - g) * u - 18 * Math.sin(u * Math.PI))})"/>`).join(''); }
  s += vGrass(170, 0, 780, 1920, 300, '#5E8A3A', 15, { c2: '#86A85A', skip: (x, y) => x > 640 + (y - 780) * -0.3 && x < 1280 + (y - 780) * 0.3 && y < 1060 });
  s += flowers(70, 0, 790, 1920, 290, 16, ['#F2D16B', '#FFFFFF', '#E58AA6', '#F49A6A', '#B9A2E0']);
  for (let i = 0; i < 10; i++) s += `<circle cx="${R1(200 + hrnd(i, 31) * 1500)}" cy="${R1(920 + hrnd(i, 32) * 140)}" r="10" fill="${i % 2 ? '#F08A3A' : '#E8564A'}" stroke="${INK2}" stroke-width="2.5"/>`;
  s += wxPetals(14, T, 4);
  if (o.camp) for (const x of [250, 1680]) s += `<g><rect x="${x - 90}" y="840" width="180" height="16" fill="#8A5A34" stroke="${INK2}" stroke-width="3"/><rect x="${x - 90}" y="900" width="180" height="16" fill="#8A5A34" stroke="${INK2}" stroke-width="3"/>${[-70, -35, 0, 35, 70].map((d, i) => `<path d="M${x + d} 960 V${780 - (i % 2) * 30}" stroke="${INK2}" stroke-width="9"/><path d="M${x + d} 960 V${780 - (i % 2) * 30}" stroke="#8A6A3A" stroke-width="5"/><path d="M${x + d - 10} ${790 - (i % 2) * 30} l10 -40 l10 40Z" fill="#C8CCD0" stroke="${INK2}" stroke-width="3"/>`).join('')}<path d="M${x - 100} 960 H${x + 100}" stroke="${INK2}" stroke-width="12"/></g>`;
  if (o.ruin) s += `<rect width="1920" height="1080" fill="#5A3A30" opacity="0.2"/>` + smoke(700, 640, 360, 0.6) + smoke(1240, 640, 420, 0.6) + smoke(1500, 820, 300, 0.5) + flames(1500, 840, 0.5, T, 1) + flames(420, 830, 0.4, T, 2) + flames(1180, 700, 0.3, T, 3);
  s += birds(240, 2);
  return s;
}

// ---------- Đỉnh núi có tảng đá tiên giữa biển mây — o.stone=false: bỏ tảng đá (cảnh tự vẽ đá nứt); o.dawn: bình minh
function bg_dinh_da(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('ddSk', '#8DB4DA', '#FBE3C2');
  s += `<circle cx="960" cy="430" r="130" fill="#FFE7A8" opacity="0.85"/>` + tdRays(960, 430, 18, '#FFF2C8', 0.2, T);
  s += cloudsDrift([[200, 140, 1.2, '#FFF6E6'], [700, 90, 0.9, '#FFF6E6'], [1300, 160, 1.3, '#FFF6E6'], [1750, 110, 1.0, '#FFF6E6']], 8);
  s += tdCrag(220, 640, 160, 330, '#9AA2B2', 21, { nt: 2, capC: '#7E9A6A' }) + tdCrag(470, 640, 120, 240, '#A6ACBA', 22, { nt: 1, capC: '#7E9A6A' }) + tdCrag(1520, 640, 150, 300, '#9AA2B2', 23, { nt: 2, capC: '#7E9A6A' }) + tdCrag(1760, 640, 190, 380, '#A6ACBA', 24, { nt: 2, capC: '#7E9A6A' });
  s += tdCloudSea(590, T, { cols: ['#EADCEC', '#F8E8EE', '#FFF6EC'], gap: 70, sp: 6, r: 60 });
  // khối đá đỉnh: nhiều tầng đá, rêu, bậc
  s += `<path d="M200 1080 Q240 900 420 830 Q560 790 700 770 L760 740 Q960 716 1160 740 L1230 770 Q1380 790 1520 830 Q1690 900 1730 1080Z" fill="#9C9284" stroke="${INK2}" stroke-width="5"/>`;
  s += `<path d="M960 724 Q1160 732 1230 770 Q1380 790 1520 830 Q1690 900 1730 1080 H1120 Q1110 900 960 724Z" fill="#877C70" opacity="0.55"/>`;
  s += `<path d="M330 960 Q520 900 700 900 Q800 930 780 1080 M1200 1080 Q1180 930 1300 900 Q1460 900 1620 960" stroke="${dk('#9C9284', 0.3)}" stroke-width="5" fill="none"/>`;
  for (let k = 0; k < 9; k++) { const x = 360 + k * 140, y = 860 + hrnd(k, 3) * 160; s += `<path d="M${R1(x)} ${R1(y)} q50 -14 110 4" stroke="${dk('#9C9284', 0.3)}" stroke-width="4" fill="none"/><path d="M${R1(x + 20)} ${R1(y - 30)} q40 -10 70 0" stroke="${lt_('#9C9284', 0.3)}" stroke-width="4" fill="none"/>`; }
  s += `<path d="M380 860 Q560 790 960 780 Q1360 790 1540 860 Q1300 820 960 822 Q620 820 380 860Z" fill="#7FA45A" stroke="${INK2}" stroke-width="3.5"/>`;
  s += vGrass(70, 380, 790, 1160, 120, '#5E8A3A', 41, { c2: '#86A85A', size: 12 }) + flowers(18, 440, 800, 1040, 90, 42, ['#F2D16B', '#FFFFFF', '#E58AA6']);
  s += pineD(330, 900, 0.6, '#4E6E4A') + pineD(1600, 920, 0.65, '#4E6E4A') + pineD(1690, 980, 0.45, '#5A7A50') + bushD(500, 840, 0.6, '#5E8A4A') + bushD(1430, 840, 0.6, '#5E8A4A') + tdBoulder(270, 1060, 0.7, '#8E8478', 4) + tdBoulder(1530, 1070, 0.6, '#8E8478', 5);
  if (o.stone !== false) {
    s += `<ellipse cx="960" cy="560" rx="260" ry="250" fill="#FFF2C0" opacity="${f2(0.25 + 0.08 * Math.sin(T * 1.5))}"/>`;
    s += `<path d="M770 790 Q740 600 820 470 Q900 360 980 370 Q1080 380 1130 480 Q1190 610 1150 790Z" fill="#B8AE9E" stroke="${INK2}" stroke-width="6"/>`;
    s += `<path d="M980 370 Q1080 380 1130 480 Q1190 610 1150 790 H1030 Q1090 640 1040 500 Q1010 410 980 370Z" fill="#A0968A" opacity="0.8"/>`;
    s += `<path d="M830 520 q40 -50 100 -40 M820 620 q70 -40 150 -10 q40 14 80 -6 M850 720 q60 -30 130 -6" stroke="${dk('#B8AE9E', 0.3)}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M860 470 q30 -30 70 -36" stroke="#F4EEE0" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    s += [[880, 560], [1060, 640], [940, 700], [1000, 470]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${5 + i % 2 * 3}" fill="#8A8072"/>`).join('');
    s += `<path d="M740 800 Q960 760 1180 800 L1200 830 H720Z" fill="#8A8072" stroke="${INK2}" stroke-width="4"/>` + `<path d="M760 800 q20 -20 50 -10 M1120 796 q24 -16 50 0" stroke="#6E9A4A" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    s += motes(18, 760, 330, 400, 460, '#FFF4C8', 0.8, 5);
  }
  return s;
}

// ---------- Thác nước lớn và suối (ngoài Thủy Liêm Động)
function bg_thac(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A4CFE2', c2: '#EEF2E2', id: 'thSk', birds: true });
  s += wxPeaks(420, '#A2B4B0', 31, 0.9) + wxMist(400, 0.5);
  // vách đá hai bên khép vào
  s += tdCrag(170, 760, 420, 720, '#8A9482', 32, { nt: 6, capC: '#6E9A56' }) + tdCrag(1760, 760, 440, 760, '#8A9482', 33, { nt: 6, capC: '#6E9A56' });
  // vách sau có thác
  s += `<path d="M560 700 L590 160 Q760 100 960 110 Q1170 100 1330 160 L1360 700Z" fill="#7E8878" stroke="${INK2}" stroke-width="5"/>`;
  for (let k = 0; k < 8; k++) s += `<path d="M${R1(600 + hrnd(k, 6) * 80)} ${R1(200 + k * 62)} q${R1(60 + hrnd(k, 7) * 60)} -10 ${R1(120 + hrnd(k, 8) * 40)} 4" stroke="#5E6858" stroke-width="4" fill="none"/><path d="M${R1(1180 + hrnd(k, 9) * 60)} ${R1(220 + k * 58)} q60 -8 100 6" stroke="#5E6858" stroke-width="4" fill="none"/>`;
  s += tdVines(600, 150, 6, 280, T, '#5E8A3A', 3) + tdVines(1200, 150, 6, 300, T, '#5E8A3A', 4);
  s += `<path d="M560 160 Q760 80 960 96 Q1170 82 1360 160 Q1300 120 960 130 Q640 120 560 160Z" fill="#6E9A56" stroke="${INK2}" stroke-width="4"/>`;
  s += tdFall(960, 120, 690, 420, T, {});
  // hang tối thấp thoáng sau màn nước
  s += `<path d="M860 690 Q860 520 960 500 Q1060 520 1060 690Z" fill="#3A4A56" opacity="0.28"/>`;
  // hồ + suối chảy ra
  s += tdWater([[420, 700], [1500, 700], [1560, 760], [1300, 800], [1220, 1080], [700, 1080], [620, 800], [360, 760]], '#78B4CC', T, 3);
  s += [0, 1, 2].map(i => `<ellipse cx="960" cy="712" rx="${R1(150 + ((T * 50 + i * 80) % 240))}" ry="${R1(16 + ((T * 50 + i * 80) % 240) * 0.08)}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.55"/>`).join('');
  // bờ trái phải
  s += tdBank([[0, 760], [360, 760], [620, 800], [700, 1080], [0, 1080]], '#8DB05E') + tdBank([[1920, 770], [1560, 760], [1300, 800], [1220, 1080], [1920, 1080]], '#8DB05E');
  s += tdBoulder(560, 840, 0.75, '#9A948A', 3) + tdBoulder(1380, 850, 0.8, '#9A948A', 4) + tdBoulder(820, 1000, 0.55, '#8A8478', 5) + tdBoulder(1140, 960, 0.5, '#8A8478', 6);
  s += [[700, 900], [1240, 900], [960, 1050]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="70" ry="14" fill="#FFFFFF" opacity="0.4"/>`).join('');
  s += tdFruitTree(200, 900, 0.8, '#F08A3A', { seed: 3 }) + tdBanana(420, 860, 0.75, T) + tdFruitTree(1720, 920, 0.85, '#E8564A', { seed: 4 }) + tdBanana(1520, 880, 0.7, T);
  s += vGrass(90, 0, 780, 700, 300, '#5E8A3A', 17, { c2: '#86A85A' }) + vGrass(90, 1260, 780, 660, 300, '#5E8A3A', 18, { c2: '#86A85A' }) + flowers(20, 0, 820, 640, 240, 19) + flowers(20, 1300, 820, 620, 240, 20);
  s += motes(30, 560, 500, 800, 300, '#FFFFFF', 0.6, 4);   // bụi nước
  return s;
}

// ---------- Trong Thủy Liêm Động — o.feast: bày tiệc (mâm quả, vò rượu); o.night: đuốc
function bg_dong(t, o = {}) {
  const T = _T(t), rk = '#6E6878', rk2 = '#7E788A';
  let s = `<rect width="1920" height="1080" fill="#5A5464"/>`;
  // cửa hang vòm tròn phía sau: màn thác sáng
  const ap = 'M640 760 V500 A320 330 0 0 1 1280 500 V760Z';
  s += `<path d="${ap}" fill="#DCEFF7"/>` + tdFall(960, 170, 760, 640, T, { plunge: false, c: '#E0F2FA', c2: '#A8D4E6' }) + `<path d="${ap}" fill="#FFFFFF" opacity="${f2(0.12 + 0.05 * Math.sin(T))}"/>`;
  // vách đá: khối đá hữu cơ nhiều lớp quanh cửa hang
  s += `<path d="M0 0 H1920 V1080 H1280 V500 A320 330 0 0 0 640 500 V1080 H0Z" fill="${rk}" stroke="${INK2}" stroke-width="5" fill-rule="evenodd"/>`;
  const lumps = [[520, 420, 160, 230], [440, 160, 220, 190], [250, 560, 260, 300], [120, 260, 200, 260], [1400, 420, 170, 240], [1480, 170, 220, 200], [1680, 560, 260, 300], [1800, 280, 200, 260], [700, 110, 200, 120], [1220, 110, 200, 120], [960, 40, 260, 110]];
  lumps.forEach(([x, y, rx, ry], i) => { const c = i % 2 ? rk2 : dk(rk, 0.05); s += `<path d="M${x - rx} ${y + ry * 0.2} Q${x - rx * 0.9} ${y - ry} ${x + rx * 0.1} ${y - ry * 0.9} Q${x + rx * 1.05} ${y - ry * 0.7} ${x + rx} ${y + ry * 0.3} Q${x + rx * 0.6} ${y + ry} ${x - rx * 0.2} ${y + ry * 0.85} Q${x - rx * 0.95} ${y + ry * 0.75} ${x - rx} ${y + ry * 0.2}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>` +
    `<path d="M${x - rx * 0.6} ${y - ry * 0.5} q${rx * 0.4} ${-ry * 0.3} ${rx * 0.9} -${ry * 0.1}" stroke="${lt_(c, 0.22)}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x - rx * 0.2} ${y + ry * 0.55} q${rx * 0.4} ${ry * 0.1} ${rx * 0.8} -${ry * 0.2}" stroke="${dk(c, 0.25)}" stroke-width="4" fill="none"/>`; });
  // viền vòm cửa hang (đá ướt sáng)
  s += `<path d="M640 760 V500 A320 330 0 0 1 1280 500 V760" stroke="#9AA8B8" stroke-width="18" fill="none"/><path d="M640 760 V500 A320 330 0 0 1 1280 500 V760" stroke="${INK2}" stroke-width="5" fill="none"/>`;
  // thạch nhũ (giọt tròn đầu, dài ngắn khác nhau)
  for (let i = 0; i < 26; i++) { const x = 30 + i * 74 + hrnd(i, 2) * 30, L = 40 + hrnd(i, 3) * 150, w = 14 + hrnd(i, 4) * 16, y0 = 0; if (x > 620 && x < 1300 && L > 80) continue; s += `<path d="M${R1(x - w)} ${y0} Q${R1(x - w * 0.6)} ${R1(L * 0.6)} ${R1(x - 3)} ${R1(L)} Q${R1(x)} ${R1(L + 8)} ${R1(x + 3)} ${R1(L)} Q${R1(x + w * 0.6)} ${R1(L * 0.6)} ${R1(x + w)} ${y0}Z" fill="${i % 2 ? '#8E889A' : '#9A94A6'}" stroke="${INK2}" stroke-width="3"/><path d="M${R1(x - w * 0.4)} 10 Q${R1(x - w * 0.3)} ${R1(L * 0.4)} ${R1(x - 2)} ${R1(L * 0.7)}" stroke="#B8B2C4" stroke-width="3" fill="none"/>`; }
  s += tdVines(560, 140, 4, 300, T, '#5E8A3A', 7) + tdVines(1290, 140, 4, 320, T, '#5E8A3A', 8) + tdVines(80, 0, 3, 200, T, '#5E8A3A', 9) + tdVines(1780, 0, 3, 220, T, '#5E8A3A', 10);
  // đuốc trên vách
  for (const x of [470, 1450]) s += `<path d="M${x} 560 l-14 70 h28Z" fill="#6B4A30" stroke="${INK2}" stroke-width="3"/><rect x="${x - 22}" y="540" width="44" height="22" rx="4" fill="#4A3A2A" stroke="${INK2}" stroke-width="3"/>` + flames(x, 546, 0.22, T, x) + `<circle cx="${x}" cy="510" r="130" fill="#FFC870" opacity="0.13"/>`;
  // sàn đá không phẳng: phiến đá lớn, khe nứt
  s += `<path d="M0 770 Q300 740 640 760 H1280 Q1620 740 1920 770 V1080 H0Z" fill="#8A8496" stroke="${INK2}" stroke-width="4"/>`;
  const slabs = [[[80, 820], [380, 800], [430, 880], [120, 910]], [[1500, 800], [1840, 820], [1860, 900], [1520, 890]], [[480, 1000], [800, 980], [840, 1080], [460, 1080]], [[1150, 990], [1500, 1000], [1540, 1080], [1120, 1080]], [[860, 860], [1080, 860], [1110, 930], [840, 930]]];
  for (const P of slabs) s += _q(P, '#9C96A8', 3) + `<path d="M${R1(P[0][0] + 20)} ${R1(P[0][1] + 10)} L${R1(P[1][0] - 30)} ${R1(P[1][1] + 8)}" stroke="#B4AEC0" stroke-width="4"/>`;
  for (let i = 0; i < 14; i++) { const x = hrnd(i, 12) * 1920, y = 800 + hrnd(i, 13) * 270; s += `<path d="M${R1(x)} ${R1(y)} l${R1(20 + hrnd(i, 14) * 30)} ${R1(6)} l${R1(14)} ${R1(-8)} l${R1(22)} ${R1(4)}" stroke="#6A6476" stroke-width="3" fill="none"/>`; }
  s += pebbles(40, 0, 790, 1920, 280, '#6E6880', 15);
  s += `<ellipse cx="960" cy="800" rx="420" ry="70" fill="#E8F4FA" opacity="0.22"/>`;   // ánh sáng từ cửa hang hắt xuống sàn
  // rãnh nước từ chân thác chảy sang trái + cầu sắt
  s += tdWater([[640, 770], [760, 770], [520, 860], [0, 900], [0, 840], [380, 800]], '#6EA2BC', T, 7);
  const br = (u) => [140 + 400 * u, 860 - 110 * 4 * u * (1 - u) - 60 * u];
  let rail = '', deck = ''; for (let i = 0; i <= 10; i++) { const [x, y] = br(i / 10); rail += (i ? ' L' : 'M') + `${R1(x)} ${R1(y - 60)}`; deck += (i ? ' L' : 'M') + `${R1(x)} ${R1(y)}`; }
  s += `<path d="${deck}" stroke="${INK2}" stroke-width="20" fill="none"/><path d="${deck}" stroke="#5A5E6A" stroke-width="13" fill="none"/>`;
  for (let i = 0; i <= 10; i++) { const [x, y] = br(i / 10); s += `<path d="M${R1(x)} ${R1(y)} v-60" stroke="${INK2}" stroke-width="8"/><path d="M${R1(x)} ${R1(y)} v-60" stroke="#767A86" stroke-width="4"/>`; }
  s += `<path d="${rail}" stroke="${INK2}" stroke-width="10" fill="none"/><path d="${rail}" stroke="#767A86" stroke-width="5" fill="none"/>` + [0.15, 0.85].map(u => { const [x, y] = br(u); return `<path d="M${R1(x)} ${R1(y - 60)} q-6 30 4 60 M${R1(x + 6)} ${R1(y - 60)} q8 30 -2 60" stroke="#4A4E5A" stroke-width="3" fill="none"/>`; }).join('');
  // bếp đá + nồi niêu bát đĩa
  s += `<path d="M180 1000 V900 Q180 880 200 880 H400 Q420 880 420 900 V1000Z" fill="#7A7482" stroke="${INK2}" stroke-width="5"/><path d="M220 1000 V950 Q260 920 300 950 V1000Z" fill="#2E2226" stroke="${INK2}" stroke-width="3"/>` + flames(260, 1000, 0.17, T, 3);
  s += `<path d="M240 880 Q230 830 300 820 Q370 830 360 880Z" fill="#4A4A54" stroke="${INK2}" stroke-width="4"/><path d="M226 840 h-20 M374 840 h20" stroke="${INK2}" stroke-width="6"/>` + smoke(300, 820, 170, 0.45) + smoke(320, 820, 140, 0.3);
  s += `<path d="M120 1040 h80 v-10 h-80Z M126 1030 h68 v-10 h-68Z M132 1020 h56 v-10 h-56Z" fill="#E8DCC8" stroke="${INK2}" stroke-width="2.5"/>` + [[470, 1030, '#B8704A'], [540, 1050, '#8A6A9A']].map(([x, y, c]) => `<path d="M${x - 34} ${y - 40} Q${x - 40} ${y} ${x} ${y} Q${x + 40} ${y} ${x + 34} ${y - 40}Z" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><path d="M${x - 34} ${y - 40} h68" stroke="${lt_(c, 0.3)}" stroke-width="5"/>`).join('');
  // bàn đá tròn + ghế đá
  s += `<path d="M770 960 Q760 900 840 900 H1080 Q1160 900 1150 960 Q1100 990 960 992 Q820 990 770 960Z" fill="#8A8494" stroke="${INK2}" stroke-width="4"/><ellipse cx="960" cy="900" rx="210" ry="44" fill="#ACA6B8" stroke="${INK2}" stroke-width="5"/><ellipse cx="930" cy="892" rx="120" ry="18" fill="#BEB8CA" opacity="0.7"/>`;
  s += [[700, 1010], [1220, 1010], [960, 1062]].map(([x, y]) => `<path d="M${x - 50} ${y} v30 Q${x} ${y + 46} ${x + 50} ${y + 30} v-30" fill="#8A8494" stroke="${INK2}" stroke-width="4"/><ellipse cx="${x}" cy="${y}" rx="50" ry="16" fill="#ACA6B8" stroke="${INK2}" stroke-width="4"/>`).join('');
  // giường đá có chiếu rơm
  s += `<g transform="translate(30 120)"><path d="M1440 900 L1470 830 H1840 L1880 900Z" fill="#A49EAC" stroke="${INK2}" stroke-width="4"/><rect x="1440" y="900" width="440" height="60" fill="#8A8494" stroke="${INK2}" stroke-width="4"/><path d="M1500 848 L1520 836 H1780 L1800 848 L1790 880 H1510Z" fill="#D8C078" stroke="${INK2}" stroke-width="3"/>` + [...Array(10)].map((_, i) => `<path d="M${1525 + i * 27} 840 l-6 38" stroke="#B89A4A" stroke-width="3"/>`).join('') + '</g>';
  // tấm bia khắc
  s += `<rect x="1540" y="440" width="190" height="350" rx="10" fill="#B4AEBA" stroke="${INK2}" stroke-width="5"/><path d="M1528 440 Q1635 390 1742 440Z" fill="#9A94A2" stroke="${INK2}" stroke-width="4"/><rect x="1520" y="786" width="230" height="30" fill="#8A8494" stroke="${INK2}" stroke-width="4"/><path d="M1560 460 v300" stroke="#C8C2CE" stroke-width="6"/>`;
  s += `<g font-family="${FH}" font-size="23" fill="#3A3442" text-anchor="middle">${['HOA QUẢ SƠN', 'PHÚC ĐỊA'].map((w, i) => `<text x="1640" y="${520 + i * 42}">${w}</text>`).join('')}<path d="M1580 608 h120" stroke="#8A8494" stroke-width="3"/>${['THỦY LIÊM ĐỘNG', 'ĐỘNG THIÊN'].map((w, i) => `<text x="1640" y="${660 + i * 42}">${w}</text>`).join('')}</g>`;
  if (o.feast) s += [[880, 892], [960, 884], [1040, 892]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="46" ry="12" fill="#C8B488" stroke="${INK2}" stroke-width="3"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${x - 24 + k * 12}" cy="${y - 12 - (k % 2) * 10}" r="12" fill="${['#F08A3A', '#E8564A', '#F2C14E', '#8AB84A', '#E8564A'][(k + i) % 5]}" stroke="${INK2}" stroke-width="2.5"/>`).join('')}`).join('') + [[1340, 1040], [1280, 1066]].map(([x, y]) => `<path d="M${x - 40} ${y} Q${x - 56} ${y - 70} ${x - 26} ${y - 90} H${x + 26} Q${x + 56} ${y - 70} ${x + 40} ${y}Z" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/><rect x="${x - 24}" y="${y - 104}" width="48" height="16" fill="#C0392B" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += `<path d="M840 0 L640 1080 H1280 L1080 0Z" fill="#FFF4D6" opacity="0.07"/>` + motes(26, 640, 200, 640, 700, '#FFFFFF', 0.5, 6);
  return s;
}

// ---------- Núi Ngũ Hành: năm đỉnh như năm ngón tay — o.bua (mặc định có): lá bùa trên tảng đá vuông; o.dusk (mặc định) / o.day; o.road: đường mòn có người tới
function bg_ngu_hanh(t, o = {}) {
  const T = _T(t), day = !!o.day;
  let s = skyGrad('nhSk', day ? '#A8CBE0' : '#7A6AA6', day ? '#F2EAD6' : '#F8BC8C');
  if (!day) s += `<circle cx="1700" cy="520" r="90" fill="#FFD48A" opacity="0.95"/><circle cx="1700" cy="520" r="180" fill="#FFD48A" opacity="0.2"/>`;
  s += cloudsDrift([[160, 140, 1.1, day ? '#FFF6E6' : '#F4C8B8'], [900, 80, 0.8, day ? '#FFF6E6' : '#E8B8C0'], [1560, 170, 1.0, day ? '#FFF6E6' : '#F4C8B8']], 6);
  const G1 = day ? '#9AB0A0' : '#8E80A0', G2 = day ? '#7E9E70' : '#6E7A6A', G3 = day ? '#6E9058' : '#5E6E54';
  // dãy núi rừng bao quanh (2 lớp)
  s += tdGreenPeak(150, 760, 600, 360, G1, 61, { cliff: false, dots: 10, sw: 3 }) + tdGreenPeak(1780, 760, 640, 380, G1, 62, { cliff: false, dots: 10, sw: 3 });
  s += wxMist(640, 0.35, day ? '#F4F2EA' : '#F2C8C0', T);
  // khối núi lớn: thân rộng, vai hai bên, năm ngọn tách ra ở trên
  const rc = day ? '#9A9282' : '#857A7E', g = 900;
  s += `<path d="M200 ${g} Q260 700 420 620 Q520 560 560 470 L1380 470 Q1420 560 1520 620 Q1680 700 1740 ${g}Z" fill="${rc}" stroke="${INK2}" stroke-width="5"/>`;
  const F = [[470, 360, 220], [700, 170, 220], [950, 90, 240], [1200, 150, 220], [1440, 300, 200]];
  for (let i = F.length - 1; i >= 0; i--) { const [x, top, w] = F[i], c = i % 2 ? rc : dk(rc, 0.05);
    const n = 7, Lp = [], Rp = [];
    for (let k = 0; k <= n; k++) { const u = k / n, yy = 640 - (640 - top - 50) * u, ww = w / 2 * (1.12 - 0.16 * u); Lp.push([x - ww + (hrnd(k, i * 7 + 1) - 0.5) * 26, yy]); Rp.push([x + ww + (hrnd(k, i * 7 + 2) - 0.5) * 26, yy]); }
    let d = `M${R1(Lp[0][0])} 660`; for (const p of Lp) d += ` L${R1(p[0])} ${R1(p[1])}`;
    d += ` Q${R1(x - w * 0.4)} ${R1(top + 6)} ${R1(x - w * 0.12)} ${R1(top)} L${R1(x)} ${R1(top - 12)} L${R1(x + w * 0.12)} ${R1(top + 2)} Q${R1(x + w * 0.4)} ${R1(top + 6)} ${R1(Rp[n][0])} ${R1(Rp[n][1])}`;
    for (let k = n; k >= 0; k--) d += ` L${R1(Rp[k][0])} ${R1(Rp[k][1])}`;
    s += `<path d="${d} L${R1(Rp[0][0])} 660Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<path d="M${R1(x + w * 0.1)} ${R1(top + 4)} Q${R1(x + w * 0.42)} ${R1(top + 20)} ${R1(Rp[n][0])} ${R1(Rp[n][1])} ${Rp.slice().reverse().map(p => `L${R1(p[0] - 4)} ${R1(p[1])}`).join(' ')} L${R1(x + w * 0.16)} 660 Q${R1(x + w * 0.24)} ${R1((660 + top) / 2)} ${R1(x + w * 0.1)} ${R1(top + 4)}Z" fill="${dk(c, 0.2)}" opacity="0.65"/>`;
    for (let k = 1; k < n; k++) { const [lx, ly] = Lp[k], [rx2] = Rp[k]; s += `<path d="M${R1(lx + 10)} ${R1(ly)} q${R1((rx2 - lx) * 0.3)} ${R1(-8 + hrnd(k, i) * 16)} ${R1((rx2 - lx) * 0.6)} 2" stroke="${dk(c, 0.3)}" stroke-width="3.5" fill="none"/>`; }
    s += `<path d="M${R1(x - w * 0.3)} ${R1(top + 40)} q${R1(w * 0.18)} -28 ${R1(w * 0.36)} -22" stroke="${lt_(c, 0.32)}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    // cây bám gờ, rêu, chỏm cây trên đỉnh
    s += pineD(Lp[2][0] + 34, Lp[2][1], 0.24, '#4E6A52') + pineD(Rp[4][0] - 40, Rp[4][1], 0.2, '#4E6A52') + bushD(Lp[5][0] + 40, Lp[5][1], 0.28, '#5E7A4A') + bushD(Rp[1][0] - 44, Rp[1][1], 0.32, '#5E7A4A');
    s += `<path d="M${R1(x - w * 0.34)} ${R1(top + 22)} Q${R1(x - w * 0.1)} ${R1(top - 8)} ${R1(x + w * 0.1)} ${R1(top + 2)}" stroke="#6E8A4A" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    for (let k = 2; k < n; k += 2) { const [lx, ly] = Lp[k], [rx2] = Rp[k]; s += `<path d="M${R1(lx + 6)} ${R1(ly - 2)} q${R1((rx2 - lx) * 0.2)} -10 ${R1((rx2 - lx) * 0.4)} 0" stroke="#6E8A4A" stroke-width="9" stroke-linecap="round" fill="none"/>`; } }
  // thân núi: rừng phủ, vách, thác nhỏ
  s += tdGreenPeak(560, g, 760, 330, G2, 63, { cliffX: 0.15, dots: 22, rock: rc }) + tdGreenPeak(1360, g, 760, 320, G2, 64, { cliffX: -0.2, dots: 22, rock: rc });
  s += tdFall(1200, 560, 820, 34, T, { plunge: false }) + tdFall(720, 600, 830, 28, T, { plunge: false });
  s += `<path d="M560 470 L1380 470 L1360 520 Q960 560 580 520Z" fill="${dk(rc, 0.08)}" opacity="0.6"/>` + wxMist(720, 0.35, day ? '#F4F2EA' : '#F2D0C8', T);
  if (o.bua !== false) { s += `<rect x="912" y="40" width="96" height="70" fill="#9A8E86" stroke="${INK2}" stroke-width="4"/><path d="M912 40 l14 -14 h96 l-14 14Z" fill="#B0A49A" stroke="${INK2}" stroke-width="3.5"/>`;
    s += `<ellipse cx="960" cy="80" rx="90" ry="90" fill="#FFE39A" opacity="${f2(0.2 + 0.08 * Math.sin(T * 2))}"/><rect x="938" y="46" width="44" height="76" fill="#F2D16B" stroke="${INK2}" stroke-width="3"/><path d="M946 56 h28 M960 56 v56 M948 72 q12 8 24 0 M948 88 h24 M952 100 q8 6 16 0" stroke="#C0392B" stroke-width="3" fill="none"/>`; }
  // chân núi: tảng đá đè, khe nơi con khỉ ló đầu
  s += `<path d="M0 880 Q300 860 620 872 Q960 852 1300 872 Q1620 860 1920 880 V1080 H0Z" fill="${day ? '#9AB46E' : '#86885E'}" stroke="${INK2}" stroke-width="4"/>`;
  s += tdBoulder(720, 900, 1.3, rc, 31) + tdBoulder(1200, 900, 1.35, dk(rc, 0.04), 32) + tdBoulder(960, 850, 1.6, rc, 33) + tdBoulder(860, 905, 0.8, dk(rc, 0.06), 34) + tdBoulder(1070, 908, 0.85, dk(rc, 0.06), 35);
  s += `<path d="M830 900 Q880 846 960 844 Q1040 846 1090 900 Q1040 892 960 894 Q880 892 830 900Z" fill="#2E2630" stroke="${INK2}" stroke-width="4"/>`;
  s += tdBoulder(600, 930, 0.6, rc, 7) + tdBoulder(1330, 935, 0.66, rc, 8) + tdBoulder(270, 990, 0.85, dk(rc, 0.04), 9) + tdBoulder(1720, 1010, 0.95, dk(rc, 0.04), 10);
  s += tdBigTree(90, 1080, 0.8, { c: G3, lean: 6 }) + pineD(1840, 1060, 1.0, '#3E5E44') + pineD(1700, 900, 0.5, '#4E6A52') + pineD(420, 890, 0.45, '#4E6A52');
  s += `<path d="M1920 930 Q1600 950 1440 985 Q1320 1015 1260 1080 H1480 Q1560 1015 1920 990Z" fill="${day ? '#C8B488' : '#A8946C'}" stroke="${INK2}" stroke-width="3.5"/>` + pebbles(20, 1320, 950, 600, 120, '#8A7A5E', 11);
  s += vGrass(170, 0, 890, 1920, 190, day ? '#6E8A3A' : '#5E6A3A', 21, { c2: day ? '#8EA85A' : '#7A7A4A', skip: (x, y) => (x > 820 && x < 1100 && y < 950) }) + flowers(24, 0, 900, 1920, 170, 23, day ? ['#F2D16B', '#FFFFFF', '#E58AA6'] : ['#E8C86A', '#D8D0E0', '#C88AA0']);
  if (!day) s += `<rect width="1920" height="1080" fill="#3A2A5A" opacity="0.08"/>`;
  s += birds(240, 4);
  return s;
}

// ---------- Màn tựa: trời mây cuộn vàng, thiên cung thấp thoáng trên mây, Hoa Quả Sơn xa bên dưới
function bg_tua(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('tuSk', '#5E7EC0', '#F8D8A8');
  s += tdRays(960, 150, 22, '#FFF0C0', 0.16, T, 1800);
  // thiên cung trên đảo mây phía trên
  s += '<g transform="translate(0 70)">';
  s += tdPuffs([[560, 250, 70], [660, 230, 90], [800, 240, 80], [960, 220, 110], [1120, 240, 80], [1260, 230, 90], [1360, 250, 70]], '#F6E6EE', 3.5, { curl: true });
  s += `<rect x="760" y="120" width="400" height="90" fill="${tdC.red}" stroke="${INK2}" stroke-width="4"/>` + [800, 880, 1040, 1120].map(x => `<rect x="${x - 10}" y="120" width="20" height="90" fill="${tdC.red2}" stroke="${INK2}" stroke-width="3"/>`).join('') + `<rect x="920" y="140" width="80" height="70" fill="#7A3A22" stroke="${INK2}" stroke-width="3"/>` + wxRoof(960, 120, 520, 90, { c: tdC.roofG, tip: '#F2D16B', ridge: '#B8862A' }) + wxRoof(960, 40, 300, 60, { c: tdC.roofG, tip: '#F2D16B', ridge: '#B8862A', pearl: true });
  s += tdRail(600, 1320, 228, 46);
  for (const [x, sc] of [[470, 0.7], [1450, 0.7]]) s += `<g opacity="0.85">${tdPuffs([[x - 70, 300, 50 * sc + 10], [x, 285, 70 * sc + 10], [x + 70, 300, 50 * sc + 10]], '#F2E2EC', 3)}<rect x="${x - 60}" y="${200}" width="120" height="80" fill="${tdC.red}" stroke="${INK2}" stroke-width="3"/>${wxRoof(x, 200, 200, 60, { c: tdC.roofG, tip: '#F2D16B', pearl: true })}</g>`;
  s += '</g>';
  s += tdCrane(300, 160, 0.8, T) + tdCrane(1600, 120, 0.65, T, true) + tdCrane(1700, 190, 0.5, T, true);
  // Hoa Quả Sơn dưới cùng, giữa biển mây
  s += `<rect y="800" width="1920" height="280" fill="#8EC0D4"/>` + tdCrag(780, 1000, 170, 300, '#8E9C88', 61, { nt: 3 }) + tdCrag(1000, 1010, 220, 380, '#9AA690', 62, { nt: 3 }) + tdCrag(1210, 1010, 150, 260, '#8E9C88', 63, { nt: 2 }) + tdFall(1000, 700, 960, 40, T, { plunge: false });
  s += tdCloudSea(900, T, { cols: ['#F4E0E6', '#FFF4EE'], gap: 70, sp: 7, r: 60 });
  s += [[180, 520, 1.1], [1720, 560, 1.0], [420, 720, 0.8], [1500, 740, 0.85]].map(([x, y, sc], i) => tdXiang(x + Math.sin(T * 0.4 + i) * 20, y, sc, '#FFF6EA', i % 2 === 1)).join('');
  return s;
}

// cột đỏ có rồng vàng quấn (rồng cách điệu chung chung) — x tâm, y0 đỉnh, y1 chân, w rộng
function tdDragonCol(x, y0, y1, w = 70, T = AT_(), o = {}) {
  const col = o.col || tdC.red, gold = o.gold || tdC.gold;
  let s = columnD(x, y0, y1, w, col);
  const H = y1 - y0, n = Math.max(3, Math.round(H / (w * 3.2)));
  for (let i = 0; i < n; i++) { const ya = y0 + 160 + i * (H - 320) / n, yb = ya + w * 1.1;
    s += `<path d="M${R1(x - w / 2)} ${R1(ya + w * 0.5)} L${R1(x + w / 2)} ${R1(ya)} L${R1(x + w / 2)} ${R1(ya + w * 0.36)} L${R1(x - w / 2)} ${R1(ya + w * 0.86)}Z" fill="${gold}" stroke="${INK2}" stroke-width="3"/>`;
    s += `<path d="M${R1(x - w * 0.2)} ${R1(ya + w * 0.5)} q${R1(w * 0.08)} ${R1(-w * 0.16)} ${R1(w * 0.2)} ${R1(-w * 0.1)} q${R1(w * 0.1)} ${R1(w * 0.1)} ${R1(-w * 0.04)} ${R1(w * 0.16)}" stroke="${tdC.gold2}" stroke-width="2.5" fill="none"/>`;
    if (w > 60) s += `<circle cx="${R1(x + w * 0.18)}" cy="${R1(ya + w * 0.3)}" r="${R1(w * 0.06)}" fill="${tdC.gold2}"/>`; }
  // đầu cột: đấu củng vàng; chân cột: đế sen
  s += `<path d="M${R1(x - w / 2 - 14)} ${R1(y0 + 40)} H${R1(x + w / 2 + 14)} L${R1(x + w / 2)} ${R1(y0 + 90)} H${R1(x - w / 2)}Z" fill="${gold}" stroke="${INK2}" stroke-width="3.5"/>` + [-0.3, 0, 0.3].map(k => `<path d="M${R1(x + k * w - w * 0.12)} ${R1(y0 + 50)} q${R1(w * 0.12)} 20 ${R1(w * 0.24)} 0" stroke="${tdC.gold2}" stroke-width="3" fill="none"/>`).join('');
  s += `<path d="M${R1(x - w / 2 - 18)} ${R1(y1 - 30)} Q${R1(x - w / 2 - 10)} ${R1(y1 - 80)} ${R1(x - w / 2)} ${R1(y1 - 76)} H${R1(x + w / 2)} Q${R1(x + w / 2 + 10)} ${R1(y1 - 80)} ${R1(x + w / 2 + 18)} ${R1(y1 - 30)}Z" fill="${gold}" stroke="${INK2}" stroke-width="3.5"/>` + [-0.35, 0, 0.35].map(k => `<path d="M${R1(x + k * w)} ${R1(y1 - 34)} q${R1(-w * 0.12)} -26 0 -38 q${R1(w * 0.12)} 12 0 38Z" fill="${tdC.gold2}" stroke="${INK2}" stroke-width="2"/>`).join('');
  return s;
}

// ngai vàng trên bệ ba bậc, sau lưng bình phong + hai quạt nghi trượng
function tdThrone(x, g, s = 1, T = AT_()) {
  let b = '';
  b += `<rect x="-330" y="-560" width="660" height="400" rx="10" fill="#7A2A22" stroke="${INK2}" stroke-width="6"/><rect x="-300" y="-530" width="600" height="340" fill="${pat('cloud', tdC.gold, null, 1.3)}" opacity="0.75"/>` + [-150, 0, 150].map(dx => `<path d="M${dx} -560 V-160" stroke="${tdC.gold}" stroke-width="7"/>`).join('') + `<path d="M-340 -566 H340" stroke="${INK2}" stroke-width="18" stroke-linecap="round"/><path d="M-340 -566 H340" stroke="${tdC.gold}" stroke-width="11" stroke-linecap="round"/>`;
  // quạt nghi trượng hình lá đề (lông công), cán dài
  for (const sd of [-1, 1]) { const fx = sd * 430; b += `<path d="M${fx} -40 V-480" stroke="${INK2}" stroke-width="14"/><path d="M${fx} -40 V-480" stroke="#8A5A2A" stroke-width="8"/>`;
    b += `<path d="M${fx} -470 Q${fx - 110} -520 ${fx - 90} -620 Q${fx - 50} -700 ${fx} -720 Q${fx + 50} -700 ${fx + 90} -620 Q${fx + 110} -520 ${fx} -470Z" fill="#2E7A6A" stroke="${INK2}" stroke-width="5"/>`;
    b += [...Array(11)].map((_, i) => { const a = -Math.PI / 2 + (i - 5) * 0.2; return `<path d="M${fx} -480 L${R1(fx + Math.cos(a) * 200)} ${R1(-480 + Math.sin(a) * 220)}" stroke="#5EA88A" stroke-width="3" opacity="0.8"/>`; }).join('');
    b += [[-40, -620], [40, -620], [0, -670], [-55, -560], [55, -560], [0, -580]].map(([dx, dy]) => `<ellipse cx="${fx + dx}" cy="${dy}" rx="14" ry="18" fill="#F2D16B" stroke="${INK2}" stroke-width="2.5"/><ellipse cx="${fx + dx}" cy="${dy + 2}" rx="7" ry="9" fill="#2A4AA0"/>`).join('');
    b += `<path d="M${fx} -470 Q${fx - 110} -520 ${fx - 90} -620 Q${fx - 50} -700 ${fx} -720 Q${fx + 50} -700 ${fx + 90} -620 Q${fx + 110} -520 ${fx} -470Z" fill="none" stroke="${tdC.gold}" stroke-width="8"/><path d="M${fx} -470 Q${fx - 110} -520 ${fx - 90} -620 Q${fx - 50} -700 ${fx} -720 Q${fx + 50} -700 ${fx + 90} -620 Q${fx + 110} -520 ${fx} -470Z" fill="none" stroke="${INK2}" stroke-width="2.5"/>`; }
  for (let i = 0; i < 3; i++) b += `<rect x="${-360 + i * 50}" y="${-40 - i * 40}" width="${720 - i * 100}" height="42" fill="${i % 2 ? tdC.jade : tdC.jade2}" stroke="${INK2}" stroke-width="4"/><path d="M${-340 + i * 50} ${-20 - i * 40} h${680 - i * 100}" stroke="${dk(tdC.jade, 0.15)}" stroke-width="3" stroke-dasharray="24 14"/>`;
  b += `<rect x="-120" y="-40" width="240" height="40" fill="#C0392B" stroke="${INK2}" stroke-width="3"/><rect x="-100" y="-120" width="200" height="80" fill="#C0392B" opacity="0.8"/>`;
  b += `<g transform="translate(0 -120) scale(0.85)">${bigThrone(0, 0, 1)}</g>`;
  return _g(x, g, s, b);
}

// mặt tiền cung điện trời: bệ ngọc trắng, cột đỏ, ngói vàng
function tdPalace(x, g, w, o = {}) {
  let s = wxTempleFront(x, g, w, { roof: tdC.roofG, tip: '#F2D16B', col: tdC.red, wall: '#C04A3A', base: tdC.jade, name: o.name, h: o.h, cols: o.cols, two: o.two, lanterns: o.lanterns });
  if (o.rail !== false) s += tdRail(x - w / 2 - 40, x - 140, g - 56, 50) + tdRail(x + 140, x + w / 2 + 40, g - 56, 50);
  return s;
}

// cờ phướn trời (dải dài đuôi nheo)
function tdPennant(x, g, h = 420, c = '#C0392B', T = AT_(), o = {}) {
  const wv = Math.sin(T * 3 + x * 0.01) * 16;
  let s = `<path d="M${x} ${g} V${g - h}" stroke="${INK2}" stroke-width="10"/><path d="M${x} ${g} V${g - h}" stroke="#8A5A2A" stroke-width="5"/><circle cx="${x}" cy="${g - h - 10}" r="12" fill="${tdC.gold}" stroke="${INK2}" stroke-width="3"/>`;
  s += `<path d="M${x} ${g - h + 10} Q${R1(x + 50 + wv)} ${g - h + 20} ${R1(x + 70 + wv)} ${g - h + 30} L${R1(x + 66 + wv * 1.6)} ${g - h + 250} L${R1(x + 40 + wv * 1.4)} ${g - h + 220} L${R1(x + 16 + wv)} ${g - h + 252} L${x + 4} ${g - h + 40}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M${x + 8} ${g - h + 48} L${R1(x + 60 + wv)} ${g - h + 40}" stroke="${tdC.gold}" stroke-width="5"/>`;
  if (o.txt) s += `<text x="${R1(x + 38 + wv)}" y="${g - h + 110}" font-family="${FH}" font-size="30" fill="#F2D16B" text-anchor="middle" stroke="${INK2}" stroke-width="1">${o.txt}</text>`;
  return s;
}

// bầu trời thiên giới (vàng hồng – tím nhạt) + mây + hạc
function tdHeavenSky(t, o = {}) {
  const T = _T(t);
  let s = skyGrad(o.id || 'hvSk', o.c1 || '#9AB4E6', o.c2 || '#FBE6CE');
  if (o.rays !== false) s += tdRays(o.rx ?? 960, o.ry ?? 260, 20, '#FFF2C8', 0.13, T);
  s += cloudsDrift([[160, 120, 1.1, '#FFF4EA'], [760, 70, 0.8, '#FFF4EA'], [1360, 130, 1.2, '#FFF4EA'], [1800, 90, 0.9, '#FFF4EA']], 7);
  if (o.cranes !== false) s += tdCrane(320 + (T * 30) % 400, 210, 0.6, T) + tdCrane(1500 - (T * 24) % 300, 170, 0.5, T, true);
  return s;
}

// ---------- Điện Linh Tiêu (trong điện): ngai vàng trên bệ, bình phong mây, cột rồng, sàn ngọc, mây lượn dưới chân — o.dark: tối lại (khi hoảng sợ)
function bg_linh_tieu(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 300, bx1: 1620, by0: 60, by1: 700, wall: '#B8463A', wall2: '#A23A30', fc: '#E6E2D4', floor: 'tile', paper: false, wain: '#7A2A22', wainH: 110, beams: '#7A4A22', vy: 470 };
  let s = room1p(R);
  s += `<rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 110}" fill="${pat('cloud', '#D8963A', null, 1.5)}" opacity="0.35"/>`;
  for (const x of [520, 1400]) s += `<circle cx="${x}" cy="330" r="110" fill="#BFD8F2" stroke="${INK2}" stroke-width="6"/>` + inkCloud(x - 20, 350, 0.6, '#FFF6EA') + `<circle cx="${x}" cy="330" r="110" fill="none" stroke="${tdC.gold}" stroke-width="14"/><circle cx="${x}" cy="330" r="110" fill="none" stroke="${INK2}" stroke-width="3"/>` + [0, 45, 90, 135].map(a => `<path d="M${x} 330 m${R1(Math.cos(a * Math.PI / 180) * -104)} ${R1(Math.sin(a * Math.PI / 180) * -104)} l${R1(Math.cos(a * Math.PI / 180) * 208)} ${R1(Math.sin(a * Math.PI / 180) * 208)}" stroke="#8A3A22" stroke-width="5"/>`).join('');
  s += tdThrone(960, 700, 0.9, T);
  s += `<rect x="800" y="96" width="320" height="70" rx="8" fill="#2A2A30" stroke="${tdC.gold}" stroke-width="7"/><text x="960" y="146" font-family="${FH}" font-size="38" fill="${tdC.gold}" text-anchor="middle">ĐIỆN LINH TIÊU</text>`;
  s += `<path d="M860 700 H1060 L1260 1080 H660Z" fill="#B03A2E" stroke="${INK2}" stroke-width="4"/><path d="M880 720 H1040 L1210 1080 H710Z" fill="${pat('cloud', tdC.gold, null, 1.1)}" opacity="0.45"/><path d="M875 700 L690 1080 M1045 700 L1230 1080" stroke="${tdC.gold}" stroke-width="6"/>`;
  s += [[230, 1010, 1.1], [1700, 1020, 1.2], [520, 1070, 0.8], [1430, 1070, 0.8]].map(([x, y, sc], i) => tdXiang(x + Math.sin(T * 0.5 + i) * 30, y, sc, '#FFF8F0', i % 2 === 1)).join('');
  s += wxCauldron(600, 760, 0.7) + wxCauldron(1320, 760, 0.7);
  // quan văn võ đứng hầu (bóng mờ hai bên thềm, không chi tiết mặt)
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) { const x = 960 + sd * (330 + i * 70), y = 700 + i * 14, h = 150 + i * 14; s += `<g opacity="0.35"><path d="M${x - 26} ${y} Q${x - 30} ${y - h * 0.6} ${x} ${y - h * 0.7} Q${x + 30} ${y - h * 0.6} ${x + 26} ${y}Z" fill="#5A3A6A"/><circle cx="${x}" cy="${y - h * 0.78}" r="${h * 0.1}" fill="#5A3A6A"/><rect x="${x - 4}" y="${y - h * 0.62}" width="8" height="${h * 0.3}" fill="#E8D9B0"/></g>`; }
  for (const [x, w] of [[420, 60]]) s += tdDragonCol(x, 0, 1080, w, T) + tdDragonCol(1920 - x, 0, 1080, w, T);
  s += tdDragonCol(120, 0, 1080, 130, T) + tdDragonCol(1800, 0, 1080, 130, T);
  s += `<path d="M0 0 H1920 V40 Q1700 110 1500 40 Q1300 110 1100 40 Q960 90 820 40 Q620 110 420 40 Q220 110 0 40Z" fill="${tdC.gold}" stroke="${INK2}" stroke-width="4"/><path d="M0 40 Q220 110 420 40 Q620 110 820 40 Q960 90 1100 40 Q1300 110 1500 40 Q1700 110 1920 40" stroke="#C0392B" stroke-width="6" fill="none"/>`;
  s += wxLantern(700, 230, 0.9, '#C0392B', T) + wxLantern(1220, 230, 0.9, '#C0392B', T) + `<path d="M700 30 V170 M1220 30 V170" stroke="${INK2}" stroke-width="3"/>`;
  s += motes(30, 300, 100, 1320, 700, '#FFF1C8', 0.55, 2);
  if (o.dark) s += `<rect width="1920" height="1080" fill="#1A1030" opacity="0.35"/>`;
  return s;
}

// ---------- Cửa Nam Thiên Môn trên mây: lầu cổng lớn, biển tên, bậc ngọc, tượng thần giữ cửa, cờ phướn
function bg_nam_thien_mon(t, o = {}) {
  const T = _T(t);
  let s = tdHeavenSky(t, { ry: 300 });
  // cung điện xa sau cổng
  s += `<g opacity="0.6">${[[420, 520, 260], [1500, 520, 300]].map(([x, g, w]) => `<rect x="${x - w * 0.3}" y="${g - 110}" width="${w * 0.6}" height="110" fill="#D89A8A" stroke="${INK2}" stroke-width="3"/>` + wxRoof(x, g - 110, w, 80, { c: '#E2BE66', tip: '#F2D16B', pearl: true })).join('')}</g>`;
  s += tdCloudSea(560, T, { cols: ['#EADCEE', '#F6E8F0'], gap: 60, sp: 5, r: 50 });
  // lầu cổng: tường thành ngọc + ba cửa vòm + lầu hai tầng mái vàng
  const gx = 960, g = 760;
  s += `<path d="M${gx - 560} ${g} V${g - 330} H${gx + 560} V${g}Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${gx - 560} ${g - 30 - i * 34} H${gx + 560}" stroke="${tdC.jade2}" stroke-width="3"/>`;
  for (let i = 0; i < 18; i++) s += `<rect x="${gx - 556 + i * 62}" y="${g - 360}" width="40" height="30" fill="${tdC.jade}" stroke="${INK2}" stroke-width="3"/>`;
  for (const [dx, w, h] of [[0, 240, 280], [-360, 150, 190], [360, 150, 190]]) s += `<path d="M${gx + dx - w / 2} ${g} V${g - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${gx + dx + w / 2} ${g - h + w / 2} V${g}Z" fill="#FFE8B8" stroke="${INK2}" stroke-width="5"/><path d="M${gx + dx - w / 2} ${g} V${g - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${gx + dx + w / 2} ${g - h + w / 2} V${g}" stroke="${tdC.gold}" stroke-width="10" fill="none"/>` + tdRays(gx + dx, g - 40, 8, '#FFFFFF', 0.25, T, h * 0.8);
  // lầu trên
  s += `<rect x="${gx - 380}" y="${g - 470}" width="760" height="110" fill="${tdC.red}" stroke="${INK2}" stroke-width="5"/>` + [...Array(9)].map((_, i) => `<rect x="${gx - 370 + i * 92}" y="${g - 470}" width="20" height="110" fill="${tdC.red2}" stroke="${INK2}" stroke-width="3"/>`).join('') + [...Array(8)].map((_, i) => `<rect x="${gx - 340 + i * 92}" y="${g - 450}" width="56" height="70" fill="#E8D9B0" stroke="${INK2}" stroke-width="3"/><path d="M${gx - 312 + i * 92} ${g - 450} v70 M${gx - 340 + i * 92} ${g - 415} h56" stroke="#8A5A34" stroke-width="3"/>`).join('');
  s += tdRail(gx - 420, gx + 420, g - 360, 44);
  s += wxRoof(gx, g - 470, 960, 130, { c: tdC.roofG, tip: '#F2D16B', ridge: tdC.gold2 }) + `<rect x="${gx - 260}" y="${g - 680}" width="520" height="90" fill="${tdC.red}" stroke="${INK2}" stroke-width="4"/>` + wxRoof(gx, g - 600, 700, 120, { c: tdC.roofG, tip: '#F2D16B', ridge: tdC.gold2, pearl: true });
  // biển tên
  s += `<rect x="${gx - 150}" y="${g - 355}" width="300" height="70" rx="8" fill="#2A3A6A" stroke="${tdC.gold}" stroke-width="7"/><text x="${gx}" y="${g - 306}" font-family="${FH}" font-size="38" fill="${tdC.gold}" text-anchor="middle">NAM THIÊN MÔN</text>`;
  // bậc ngọc xuống quảng trường mây
  for (let i = 0; i < 6; i++) s += `<rect x="${gx - 160 - i * 26}" y="${g + i * 22}" width="${320 + i * 52}" height="22" fill="${i % 2 ? tdC.jade : tdC.jade2}" stroke="${INK2}" stroke-width="3"/>`;
  s += tdRail(380, 720, g + 10, 56) + tdRail(1200, 1540, g + 10, 56);
  // quảng trường ngọc trên mây
  s += `<path d="M0 900 Q480 880 960 892 Q1440 880 1920 900 V1080 H0Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="4"/>` + wxPaving(900, tdC.jade, { vy: 700 }).replace(/<rect[^>]*\/>/, '');
  // tượng thần giữ cửa (giáp đá trắng, cầm giáo — dáng chung)
  for (const sd of [-1, 1]) { const x = gx + sd * 640; s += `<rect x="${x - 80}" y="${g - 20}" width="160" height="60" fill="${tdC.jade2}" stroke="${INK2}" stroke-width="4"/><path d="M${x - 50} ${g - 20} V${g - 220} Q${x} ${g - 260} ${x + 50} ${g - 220} V${g - 20}Z" fill="#D8D4C8" stroke="${INK2}" stroke-width="4"/><circle cx="${x}" cy="${g - 266}" r="34" fill="#D8D4C8" stroke="${INK2}" stroke-width="4"/><path d="M${x - 36} ${g - 280} Q${x} ${g - 330} ${x + 36} ${g - 280}" fill="#C8C4B8" stroke="${INK2}" stroke-width="3"/><path d="M${x - 50} ${g - 180} H${x + 50} M${x - 50} ${g - 120} H${x + 50}" stroke="#B8B4A8" stroke-width="5"/><path d="M${x + sd * 70} ${g - 10} V${g - 380}" stroke="${INK2}" stroke-width="10"/><path d="M${x + sd * 70 - 12} ${g - 380} l12 -46 l12 46Z" fill="#E8E4D8" stroke="${INK2}" stroke-width="3"/>`; }
  s += tdPennant(260, 1010, 520, '#C0392B', T) + tdPennant(1660, 1010, 520, '#2A5AA0', T);
  s += [[140, 1050, 1.0], [1790, 1050, 1.0], [960, 1100, 1.3]].map(([x, y, sc], i) => tdXiang(x + Math.sin(T * 0.6 + i) * 24, y, sc, '#FFF8F0', i === 1)).join('');
  return s;
}

// ---------- Ngự Mã Giám: chuồng ngựa trời trên mây — dãy chuồng gỗ mái vàng, ngựa trời thò đầu, máng cỏ, yên cương treo, biển tên
function bg_ma_giam(t, o = {}) {
  const T = _T(t);
  let s = tdHeavenSky(t, { ry: 200, c1: '#A8C4EA' });
  s += tdCloudSea(520, T, { cols: ['#ECE0EE', '#F6ECF0'], gap: 50, sp: 5, r: 46 });
  // nền sân lát gỗ trên mây
  s += `<path d="M0 760 H1920 V1080 H0Z" fill="#D8C49A" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = -16; i <= 16; i++) { const xb = 960 + i * 130, xt = 960 + (xb - 960) * 0.45; s += _ln(xt, 760, xb, 1080, '#B8A27A', 3); }
  for (const y of [790, 830, 885, 960, 1050]) s += _ln(0, y, 1920, y, '#B8A27A', 3);
  // dãy chuồng: tường gỗ, các ô chuồng có cửa nửa, ngựa thò đầu
  const g = 760, x0 = 120, x1 = 1800;
  s += `<rect x="${x0}" y="${g - 330}" width="${x1 - x0}" height="330" fill="#B07A4A" stroke="${INK2}" stroke-width="5"/>`;
  for (let x = x0 + 10; x < x1; x += 34) s += `<path d="M${x} ${g - 330} V${g}" stroke="#946238" stroke-width="3"/>`;
  const nS = 7, sw = (x1 - x0) / nS;
  for (let i = 0; i < nS; i++) { const cx = x0 + sw * (i + 0.5);
    if (i === 3) { // cổng giữa có biển
      s += `<rect x="${cx - 110}" y="${g - 300}" width="220" height="300" fill="#5A3A24" stroke="${INK2}" stroke-width="5"/><rect x="${cx - 96}" y="${g - 286}" width="192" height="286" fill="#3A2A1E"/>` + [0, 1].map(k => `<path d="M${cx - 96 + k * 96} ${g - 286} h96 v286" fill="none" stroke="#6B4A30" stroke-width="5"/>`).join('');
      continue; }
    s += `<rect x="${cx - sw * 0.38}" y="${g - 290}" width="${sw * 0.76}" height="290" fill="#4A3426" stroke="${INK2}" stroke-width="4"/>`;
    // đầu ngựa trời (trắng, bờm xanh nhạt) thò ra
    const hx = cx + (i % 2 ? 14 : -14), hy = g - 250, nod = Math.sin(T * 1.4 + i) * 6;
    s += `<g transform="translate(${R1(hx)} ${R1(hy + nod)})"><path d="M-46 30 Q-56 -40 -20 -70 Q10 -88 30 -60 Q50 -20 44 40Z" fill="#F4F2EC" stroke="${INK2}" stroke-width="4"/><path d="M-20 -70 l-10 -26 l18 16 M10 -78 l4 -26 l10 22" fill="#F4F2EC" stroke="${INK2}" stroke-width="3.5"/><path d="M-24 -66 Q-50 -30 -50 20" stroke="${['#9AC8E8', '#E8A8C8', '#C8B8E8'][i % 3]}" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="10" cy="44" rx="34" ry="22" fill="#E8E2D8" stroke="${INK2}" stroke-width="3.5"/><circle cx="0" cy="44" r="4" fill="${INK2}"/><circle cx="20" cy="44" r="4" fill="${INK2}"/><circle cx="16" cy="-30" r="6" fill="${INK2}"/><circle cx="18" cy="-32" r="2" fill="#FFF"/></g>`;
    // cửa nửa dưới
    s += `<rect x="${cx - sw * 0.38}" y="${g - 150}" width="${sw * 0.76}" height="150" fill="#9A6A3A" stroke="${INK2}" stroke-width="4"/><path d="M${cx - sw * 0.38} ${g - 150} L${cx + sw * 0.38} ${g} M${cx + sw * 0.38} ${g - 150} L${cx - sw * 0.38} ${g}" stroke="#7A4E2A" stroke-width="7"/>`;
    s += `<text x="${cx}" y="${g - 300}" font-family="${FH}" font-size="22" fill="${INK2}" text-anchor="middle"></text>`; }
  s += `<rect x="${x0 - 20}" y="${g - 350}" width="${x1 - x0 + 40}" height="24" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/>` + wxRoof(960, g - 350, x1 - x0 + 120, 120, { c: tdC.roofG, tip: '#F2D16B', ridge: tdC.gold2, up: 0.4 });
  s += `<rect x="790" y="${g - 440}" width="340" height="70" rx="8" fill="#2A2A30" stroke="${tdC.gold}" stroke-width="6"/><text x="960" y="${g - 392}" font-family="${FH}" font-size="38" fill="${tdC.gold}" text-anchor="middle">NGỰ MÃ GIÁM</text>`;
  // đồ nghề: máng cỏ, đống cỏ khô, xô nước, bàn chải, yên cương treo trên cọc
  s += `<path d="M200 900 L230 850 H560 L590 900Z" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/><path d="M230 850 Q395 820 560 850" fill="#D8B84A" stroke="${INK2}" stroke-width="3"/>` + [...Array(14)].map((_, i) => `<path d="M${240 + i * 23} 852 l${-6 + (i % 3) * 6} -22" stroke="#B89A3A" stroke-width="3"/>`).join('') + `<rect x="200" y="900" width="390" height="30" fill="#6B4A30" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M1450 960 Q1440 880 1520 860 Q1620 850 1640 940 Q1640 970 1450 960Z" fill="#E2C25A" stroke="${INK2}" stroke-width="4"/>` + [...Array(12)].map((_, i) => `<path d="M${1470 + i * 14} 950 q4 -50 ${-10 + i * 2} -80" stroke="#B89A3A" stroke-width="3" fill="none"/>`).join('');
  s += `<path d="M1720 1010 L1730 940 H1810 L1820 1010Z" fill="#8A6A44" stroke="${INK2}" stroke-width="4"/><ellipse cx="1770" cy="940" rx="40" ry="10" fill="#9CCBE0" stroke="${INK2}" stroke-width="3"/><path d="M1730 970 h90" stroke="#5A4A3A" stroke-width="5"/>`;
  s += `<path d="M700 1000 V830 M660 840 H740" stroke="${INK2}" stroke-width="10"/><path d="M700 1000 V830 M660 840 H740" stroke="#8A5A34" stroke-width="5"/><path d="M670 846 Q700 900 730 846" fill="#8E2A22" stroke="${INK2}" stroke-width="4"/><path d="M676 846 q-10 50 0 80 M724 846 q10 50 0 80" stroke="#6B4A30" stroke-width="4" fill="none"/>`;
  s += `<rect x="1160" y="1000" width="80" height="22" rx="8" fill="#8A5A34" stroke="${INK2}" stroke-width="3"/>` + [...Array(8)].map((_, i) => `<path d="M${1166 + i * 10} 1022 v14" stroke="#D8C49A" stroke-width="3"/>`).join('');
  s += pebbles(20, 0, 960, 1920, 120, '#B8A27A', 4);
  for (let i = 0; i < 6; i++) s += `<path d="M${R1(300 + hrnd(i, 7) * 1400)} ${R1(980 + hrnd(i, 8) * 80)} q10 -16 20 0" stroke="#B89A3A" stroke-width="3" fill="none"/>`;   // cỏ rơi vãi
  s += [[60, 1050, 0.9], [1880, 1050, 0.9]].map(([x, y, sc], i) => tdXiang(x, y, sc, '#FFF8F0', i === 1)).join('');
  return s;
}

// ---------- Phủ Tề Thiên Đại Thánh trên trời: cổng phủ có biển, sư tử, đèn lồng, sân, cây cảnh — nhỏ hơn cung điện, nhìn "hoành tráng mà trống"
function bg_phu_te_thien(t, o = {}) {
  const T = _T(t);
  let s = tdHeavenSky(t, { ry: 240, c1: '#A4BEE8' });
  s += tdCloudSea(560, T, { cols: ['#ECE0EE', '#F6ECF0'], gap: 60, sp: 5, r: 50 });
  // tường phủ hai bên + cổng giữa
  s += `<rect x="0" y="470" width="1920" height="300" fill="#C8564A" stroke="${INK2}" stroke-width="5"/><rect x="0" y="470" width="1920" height="300" fill="${pat('damask', '#B04A3E', null, 1.1)}" opacity="0.4"/>` + wxRoof(480, 470, 1100, 70, { c: tdC.roofG, tip: '#F2D16B', up: 0.3 }) + wxRoof(1440, 470, 1100, 70, { c: tdC.roofG, tip: '#F2D16B', up: 0.3 });
  for (const x of [300, 1620]) s += `<rect x="${x - 70}" y="560" width="140" height="140" rx="70" fill="#BFD8F2" stroke="${INK2}" stroke-width="5"/>` + [0, 1, 2, 3].map(k => `<path d="M${x - 70 + k * 46} 562 v136 M${x - 70} ${562 + k * 46} h140" stroke="#8A3A22" stroke-width="5"/>`).join('');   // cửa sổ hoa
  s += tdPalace(960, 860, 620, { name: 'PHỦ TỀ THIÊN ĐẠI THÁNH', h: 300, cols: 4, two: true });
  // (biển chữ Hán nhỏ bỏ — đè lên mái)
  // sân + sư tử đá + lư hương + cây tùng cảnh
  s += `<path d="M0 860 H1920 V1080 H0Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="4"/>` + wxPaving(860, tdC.jade, { vy: 650 }).replace(/<rect[^>]*\/>/, '');
  s += wxLion(560, 960, 0.9) + wxLion(1360, 960, 0.9, true) + wxCauldron(960, 1000, 0.6);
  for (const x of [190, 1730]) s += `<path d="M${x - 90} 1010 L${x - 70} 940 H${x + 70} L${x + 90} 1010Z" fill="#6E8AA6" stroke="${INK2}" stroke-width="4"/>` + pineD(x, 945, 0.62, '#4E6E4A') + bushD(x + 50, 945, 0.4, '#5E8A4A');
  s += wxLantern(700, 600, 0.9, '#C0392B', T) + wxLantern(1220, 600, 0.9, '#C0392B', T);
  // người hầu không có việc: chổi dựng góc, ghế trống
  s += `<path d="M1520 1000 L1600 800" stroke="${INK2}" stroke-width="9"/><path d="M1520 1000 L1600 800" stroke="#8A6A3A" stroke-width="5"/><path d="M1490 1010 Q1510 960 1530 990 Q1546 950 1556 1000Z" fill="#D8B84A" stroke="${INK2}" stroke-width="3"/>`;
  return s;
}

// ---------- Đường mây giữa trời: đảo mây, cung điện xa, cầu vồng mờ, sao ban ngày lấp lánh — o.dusk
function bg_may(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('mySk', o.dusk ? '#6E7AC0' : '#7EA6E4', o.dusk ? '#F6C8A8' : '#FBEAD8');
  s += tdRays(1500, 120, 18, '#FFF2C8', 0.12, T);
  s += `<path d="M-100 760 A1100 900 0 0 1 2020 760" stroke="#F4A0A0" stroke-width="26" fill="none" opacity="0.3"/><path d="M-80 780 A1080 880 0 0 1 2000 780" stroke="#F4E08A" stroke-width="26" fill="none" opacity="0.3"/><path d="M-60 800 A1060 860 0 0 1 1980 800" stroke="#9AD0F0" stroke-width="26" fill="none" opacity="0.3"/>`;
  for (let i = 0; i < 26; i++) { const x = hrnd(i, 3) * 1920, y = 40 + hrnd(i, 4) * 360, r = 3 + hrnd(i, 5) * 5, tw = 0.4 + 0.6 * Math.abs(Math.sin(T * 1.5 + i)); s += `<path d="M${R1(x)} ${R1(y - r * 2)} L${R1(x + r * 0.5)} ${R1(y - r * 0.5)} L${R1(x + r * 2)} ${R1(y)} L${R1(x + r * 0.5)} ${R1(y + r * 0.5)} L${R1(x)} ${R1(y + r * 2)} L${R1(x - r * 0.5)} ${R1(y + r * 0.5)} L${R1(x - r * 2)} ${R1(y)} L${R1(x - r * 0.5)} ${R1(y - r * 0.5)}Z" fill="#FFF6D0" opacity="${f2(tw)}"/>`; }
  // đảo mây xa có cung điện (có bệ ngọc, cột, mái)
  for (const [x, y, w] of [[330, 400, 260], [1560, 340, 300], [960, 270, 180]]) s += `<g opacity="0.85">${tdPuffs([[x - w * 0.45, y + 34, w * 0.2], [x - w * 0.15, y + 24, w * 0.28], [x + w * 0.2, y + 26, w * 0.26], [x + w * 0.48, y + 36, w * 0.18]], '#F4E6EE', 3)}<rect x="${x - w * 0.3}" y="${y - 6}" width="${w * 0.6}" height="16" fill="${tdC.jade}" stroke="${INK2}" stroke-width="3"/>${[-0.22, -0.07, 0.07, 0.22].map(k => `<rect x="${R1(x + k * w - 5)}" y="${y - 70}" width="10" height="64" fill="${tdC.red}" stroke="${INK2}" stroke-width="2"/>`).join('')}<rect x="${x - w * 0.18}" y="${y - 60}" width="${w * 0.36}" height="44" fill="#E8D9B0" stroke="${INK2}" stroke-width="2"/>${wxRoof(x, y - 70, w * 0.8, 56, { c: tdC.roofG, tip: '#F2D16B', pearl: true })}</g>`;
  s += tdCrane(640 + (T * 40) % 300, 200, 0.55, T) + tdCrane(1260, 470, 0.45, T, true) + tdCrane(1340, 520, 0.38, T, true);
  s += tdCloudSea(700, T, { cols: ['#E8DCF0', '#F4E8F2', '#FFF8F0'], gap: 100, sp: 9, r: 60 });
  // khối mây lớn tiền cảnh hai bên
  s += tdPuffs([[-20, 760, 140], [120, 700, 120], [220, 820, 110], [60, 900, 150]], '#FFFFFF', 4, { curl: true }) + tdPuffs([[1940, 740, 150], [1800, 690, 110], [1720, 820, 120], [1880, 900, 150]], '#FFFFFF', 4, { curl: true });
  s += [[480, 600, 0.7], [1440, 620, 0.7]].map(([x, y, sc], i) => tdXiang(x + Math.sin(T * 0.5 + i) * 30, y, sc, '#FFFFFF', i === 1)).join('');
  return s;
}

// ---------- Sân trước điện Thông Minh: thềm ngọc nhiều bậc dẫn lên điện, cung điện hai bên, mây giông + sét — o.calm: không có giông (cảnh Như Lai)
function bg_thong_minh(t, o = {}) {
  const T = _T(t), storm = !o.calm;
  let s = skyGrad('tmSk', storm ? '#4A4A7A' : '#9AB4E6', storm ? '#B898B8' : '#FBE6CE');
  if (storm) { s += cloudsDrift([[200, 120, 1.6, '#6A6A8E'], [800, 80, 1.4, '#7A7A9E'], [1400, 130, 1.7, '#6A6A8E'], [1850, 90, 1.3, '#7A7A9E']], 12);
    const fl = (Math.sin(T * 7) > 0.85) ? 1 : 0.0; s += `<path d="M1520 0 L1480 120 L1520 130 L1460 280" stroke="#FFF6C0" stroke-width="8" fill="none" opacity="${0.3 + fl * 0.7}"/><path d="M380 0 L420 100 L380 110 L440 240" stroke="#FFF6C0" stroke-width="7" fill="none" opacity="${0.25 + fl * 0.6}"/>`; }
  else s += tdRays(960, 200, 20, '#FFF2C8', 0.14, T) + cloudsDrift([[200, 120, 1.1, '#FFF4EA'], [1400, 100, 1.2, '#FFF4EA']], 7);
  // điện Thông Minh ở cuối thềm (trên cao)
  s += tdPuffs([[720, 470, 70], [960, 450, 100], [1200, 470, 70]], storm ? '#C8B8D0' : '#F4E6EE', 3.5);
  s += tdPalace(960, 470, 560, { name: 'ĐIỆN THÔNG MINH', h: 200, cols: 6, two: true, lanterns: true });
  // cung điện hai bên (phối cảnh)
  for (const sd of [-1, 1]) { const x = 960 + sd * 640; s += `<path d="M${x - sd * 140} 700 V420 L${x + sd * 260} 380 V760Z" fill="#C04A3A" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2, 3].map(k => `<path d="M${R1(x - sd * 140 + sd * k * 100)} ${R1(420 - k * 10)} V${R1(700 + k * 15)}" stroke="${INK2}" stroke-width="3"/><rect x="${R1(x - sd * 140 + sd * k * 100 + (sd > 0 ? 18 : -78))}" y="${R1(470 - k * 10)}" width="60" height="120" fill="#E8D9B0" stroke="${INK2}" stroke-width="3"/>`).join('') + `<path d="M${x - sd * 180} 430 L${x + sd * 300} 370 L${x + sd * 300} 330 L${x - sd * 160} 380Z" fill="${tdC.roofG}" stroke="${INK2}" stroke-width="4"/>`; }
  // thềm bậc ngọc lớn ở giữa, lan can
  for (let i = 0; i < 12; i++) { const y = 470 + i * 26, w = 360 + i * 60; s += `<rect x="${960 - w / 2}" y="${y}" width="${w}" height="26" fill="${i % 2 ? tdC.jade : tdC.jade2}" stroke="${INK2}" stroke-width="3"/>`; }
  s += `<path d="M780 470 L590 782 M1140 470 L1330 782" stroke="${INK2}" stroke-width="12"/><path d="M780 470 L590 782 M1140 470 L1330 782" stroke="${tdC.jade}" stroke-width="7"/>`;
  s += `<path d="M900 470 H1020 L1060 782 H860Z" fill="#E0D2B8" stroke="${INK2}" stroke-width="3"/>` + [...Array(4)].map((_, i) => tdXiang(960, 540 + i * 66, 0.22 + i * 0.05, '#D8C49A')).join('');   // dải chạm mây giữa thềm (ngự đạo)
  // quảng trường dưới
  s += `<path d="M0 780 H1920 V1080 H0Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="4"/>` + wxPaving(780, tdC.jade, { vy: 560 }).replace(/<rect[^>]*\/>/, '');
  s += tdRail(0, 560, 800, 70) + tdRail(1360, 1920, 800, 70);
  s += wxCauldron(420, 900, 0.8) + wxCauldron(1500, 900, 0.8) + tdPennant(160, 1060, 560, '#2A5AA0', T) + tdPennant(1760, 1060, 560, '#C0392B', T);
  // dấu vết giao chiến: gạch vỡ, mây cháy xém (khi giông)
  if (storm) s += [[680, 960], [1260, 1000], [900, 1050]].map(([x, y]) => `<path d="M${x - 40} ${y} l20 -18 l26 6 l22 -10 l14 22Z" fill="${tdC.jade2}" stroke="${INK2}" stroke-width="3"/>`).join('') + `<rect width="1920" height="1080" fill="#2A2050" opacity="0.12"/>`;
  return s;
}

// ---------- đồ nghề dưới nước
function tdCoral(x, g, s = 1, c = '#E8806A', seed = 1) {
  let b = ''; const br = (x0, y0, a, L, d) => { if (d > 3 || L < 14) return; const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L; b += `<path d="M${R1(x0)} ${R1(y0)} L${R1(x1)} ${R1(y1)}" stroke="${INK2}" stroke-width="${R1(20 - d * 4)}" stroke-linecap="round"/><path d="M${R1(x0)} ${R1(y0)} L${R1(x1)} ${R1(y1)}" stroke="${c}" stroke-width="${R1(13 - d * 3)}" stroke-linecap="round"/>`; br(x1, y1, a - 0.45 - hrnd(d, seed) * 0.3, L * 0.72, d + 1); br(x1, y1, a + 0.45 + hrnd(d, seed + 1) * 0.3, L * 0.72, d + 1); };
  br(0, 0, -Math.PI / 2, 90, 0);
  return _g(x, g, s, b);
}

function tdKelp(x, g, h = 400, T = AT_(), c = '#4E8A5A', seed = 1) {
  let d = `M${x} ${g}`; const pts = []; for (let i = 1; i <= 10; i++) { const y = g - h * i / 10, xx = x + Math.sin(T * 1.2 + i * 0.7 + seed) * 18 * (i / 10) * 2; pts.push([xx, y]); d += ` L${R1(xx)} ${R1(y)}`; }
  let s = `<path d="${d}" stroke="${INK2}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  pts.forEach(([px, py], i) => { if (i % 2) s += `<path d="M${R1(px)} ${R1(py)} q${i % 4 === 1 ? 30 : -30} -10 ${i % 4 === 1 ? 40 : -40} -40 q${i % 4 === 1 ? -26 : 26} 10 ${i % 4 === 1 ? -40 : 40} 40Z" fill="${lt_(c, 0.1)}" stroke="${INK2}" stroke-width="2.5"/>`; });
  return s;
}

function tdBubbles(n, x0, y0, w, h, T = AT_(), seed = 1) { let s = ''; for (let i = 0; i < n; i++) { const sp = 30 + hrnd(i, seed) * 60, x = x0 + hrnd(i, seed + 1) * w + Math.sin(T * 2 + i) * 8, y = y0 + h - ((hrnd(i, seed + 2) * h + T * sp) % h), r = 4 + hrnd(i, seed + 3) * 10; s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="#E8F8FF" fill-opacity="0.35" stroke="#FFFFFF" stroke-width="2.5" opacity="0.8"/><path d="M${R1(x - r * 0.4)} ${R1(y - r * 0.3)} q${R1(r * 0.2)} ${R1(-r * 0.3)} ${R1(r * 0.5)} ${R1(-r * 0.3)}" stroke="#FFFFFF" stroke-width="2" fill="none"/>`; } return s; }
function tdFish(x, y, s = 1, c = '#F2A03A', T = AT_(), flip = false) { const w = Math.sin(T * 6 + x) * 6; return `<g transform="translate(${R1(x)} ${R1(y)}) scale(${flip ? -s : s} ${s})"><path d="M-40 0 Q-10 -24 30 -8 Q44 0 30 8 Q-10 24 -40 0Z" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><path d="M-36 0 L-62 ${R1(-16 + w)} L-58 0 L-62 ${R1(16 + w)}Z" fill="${dk(c, 0.15)}" stroke="${INK2}" stroke-width="3"/><circle cx="20" cy="-4" r="4" fill="${INK2}"/><path d="M-6 -12 q6 12 0 24" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none"/></g>`; }
// tia sáng mặt nước hắt xuống (caustics)
function tdCaustics(T = AT_(), c = '#E8FFFF', op = 0.16) { let s = ''; for (let i = 0; i < 9; i++) { const x = 100 + i * 220 + Math.sin(T * 0.6 + i) * 40; s += `<path d="M${R1(x - 40)} 0 L${R1(x + 40)} 0 L${R1(x + 140 + i * 6)} 1080 L${R1(x - 10 + i * 6)} 1080Z" fill="${c}" opacity="${f2(op * (0.6 + 0.4 * Math.sin(T + i * 1.7)))}"/>`; } return s; }

// ---------- Long Cung dưới biển Đông: điện ngọc trai–san hô, cột ngọc bích, rong rêu, cá, bọt nước
function bg_long_cung(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('lcSk', '#3E9AB0', '#1E5A78');
  s += tdCaustics(T);
  // điện phía sau: mái ngói xanh ngọc, cột ngọc bích, cửa tròn vỏ sò
  const R = { bx0: 330, bx1: 1590, by0: 120, by1: 690, wall: '#4A8AA0', wall2: '#3E7A90', fc: '#5E9AA8', floor: 'tile', paper: false, wain: '#2E6A80', wainH: 100, vy: 470, ceil: '#2E6A80', side: '#3A7A90' };
  s += room1p(R).replace(/<rect width="1920" height="1080"[^>]*\/>/, '');
  s += `<rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 100}" fill="${pat('cloud', '#6AB4C4', null, 1.6)}" opacity="0.4"/>`;
  // vỏ sò khổng lồ sau ngai Long Vương
  s += `<g transform="translate(960 560)"><path d="M-260 0 Q-280 -300 0 -340 Q280 -300 260 0Z" fill="#F4D8C8" stroke="${INK2}" stroke-width="6"/>${[...Array(9)].map((_, i) => { const a = -Math.PI + (i + 1) * Math.PI / 10; return `<path d="M0 0 L${R1(Math.cos(a) * 270)} ${R1(Math.sin(a) * 320)}" stroke="#D8B0A0" stroke-width="5"/>`; }).join('')}<path d="M-80 0 Q0 -60 80 0Z" fill="#E8C0B0" stroke="${INK2}" stroke-width="4"/><circle cx="0" cy="-40" r="34" fill="#FFFFFF" stroke="${INK2}" stroke-width="4"/><circle cx="-10" cy="-50" r="10" fill="#FFFFFF" opacity="0.9"/><circle cx="0" cy="-40" r="60" fill="#FFFFFF" opacity="${f2(0.2 + 0.1 * Math.sin(T * 2))}"/></g>`;
  s += `<rect x="800" y="560" width="320" height="50" fill="#2E6A80" stroke="${INK2}" stroke-width="4"/><rect x="760" y="610" width="400" height="40" fill="#3E8098" stroke="${INK2}" stroke-width="4"/><rect x="720" y="650" width="480" height="40" fill="#4A90A8" stroke="${INK2}" stroke-width="4"/>`;
  s += `<rect x="790" y="20" width="340" height="70" rx="10" fill="#1E4A60" stroke="#F2D16B" stroke-width="6"/><text x="960" y="70" font-family="${FH}" font-size="36" fill="#F2D16B" text-anchor="middle">THỦY TINH CUNG</text>`;
  // sàn: thảm đỏ san hô, đá cuội ngọc
  s += `<path d="M860 690 H1060 L1240 1080 H680Z" fill="#B8463A" stroke="${INK2}" stroke-width="4"/><path d="M875 690 L700 1080 M1045 690 L1220 1080" stroke="#F2D16B" stroke-width="5"/>`;
  s += pebbles(40, 0, 800, 1920, 280, '#8ACBD6', 14);
  // cột ngọc bích bọc san hô
  for (const [x, w] of [[400, 60], [200, 96], [40, 130]]) for (const sd of [-1, 1]) { const xx = sd < 0 ? x : 1920 - x; s += columnD(xx, 0, 1080, w, '#5EB8A8') + `<path d="M${xx - w / 2} 300 q${w / 2} 30 ${w} 0 M${xx - w / 2} 600 q${w / 2} 30 ${w} 0" stroke="#F2D16B" stroke-width="6" fill="none"/>`; }
  // san hô, rong, cá, ngọc trai
  s += tdCoral(560, 760, 1.0, '#E8806A', 1) + tdCoral(640, 780, 0.7, '#F2B05A', 2) + tdCoral(1360, 770, 1.0, '#E86A8A', 3) + tdCoral(1280, 790, 0.6, '#F2B05A', 4);
  s += tdKelp(300, 1080, 520, T, '#4E8A5A', 1) + tdKelp(350, 1080, 420, T, '#5E9A5A', 2) + tdKelp(1600, 1080, 560, T, '#4E8A5A', 3) + tdKelp(1650, 1080, 440, T, '#5E9A5A', 4);
  s += tdFish(520 + (T * 40) % 300, 300, 0.9, '#F2A03A', T) + tdFish(1500 - (T * 30) % 300, 380, 0.8, '#E86A8A', T, true) + tdFish(700, 460, 0.6, '#F2D16B', T) + tdFish(1250, 240, 0.6, '#8AD0E0', T, true);
  s += [[480, 1000], [1440, 1010]].map(([x, y]) => `<path d="M${x - 60} ${y} Q${x - 70} ${y - 50} ${x} ${y - 60} Q${x + 70} ${y - 50} ${x + 60} ${y}Z" fill="#E8D0C8" stroke="${INK2}" stroke-width="4"/><circle cx="${x}" cy="${y - 30}" r="18" fill="#FFFFFF" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += tdBubbles(36, 0, 0, 1920, 1080, T, 3);
  s += `<rect width="1920" height="1080" fill="#1E6A8A" opacity="0.1"/>`;
  return s;
}

// ---------- Đáy biển: cột sắt thần phát sáng giữa bãi cát, đá ngầm, rong, cá — o.pillar=false: bỏ cột (cảnh vẽ cột co lại)
function bg_day_bien(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('dbSk', '#2E7E9A', '#0E3A52');
  s += tdCaustics(T, '#D8FFFF', 0.12);
  // đá ngầm xa
  s += `<path d="M0 640 Q200 520 380 600 Q520 480 700 580 L760 700 H0Z M1180 700 Q1260 540 1440 590 Q1600 470 1760 560 Q1860 520 1920 560 V700Z" fill="#2E5A6E" stroke="${INK2}" stroke-width="4"/>`;
  s += tdKelp(120, 720, 300, T, '#2E6A5A', 5) + tdKelp(1820, 720, 320, T, '#2E6A5A', 6);
  // bãi cát + gợn
  s += `<path d="M0 700 Q480 670 960 690 Q1440 670 1920 700 V1080 H0Z" fill="#C8B888" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 14; i++) { const y = 740 + i * 24, x = hrnd(i, 4) * 1700; s += `<path d="M${R1(x)} ${y} q40 -10 80 0 q40 10 80 0" stroke="#A8986A" stroke-width="3" fill="none" opacity="0.7"/>`; }
  s += pebbles(30, 0, 720, 1920, 340, '#9A8A64', 7) + [[300, 900], [1600, 880], [700, 1020]].map(([x, y]) => `<path d="M${x - 30} ${y} l30 -36 l30 36 l-30 -8Z" fill="#E86A5A" stroke="${INK2}" stroke-width="3"/>`).join('');   // sao biển
  s += tdBoulder(220, 860, 1.1, '#4E6A78', 2) + tdBoulder(1720, 880, 1.2, '#4E6A78', 3) + tdCoral(420, 820, 0.8, '#E8806A', 5) + tdCoral(1520, 830, 0.8, '#E86A8A', 6);
  s += tdKelp(560, 1080, 420, T, '#3E7A5A', 7) + tdKelp(1380, 1080, 460, T, '#3E7A5A', 8);
  // cột sắt thần
  if (o.pillar !== false) {
    s += `<ellipse cx="960" cy="400" rx="220" ry="440" fill="#FFE39A" opacity="${f2(0.18 + 0.08 * Math.sin(T * 2.2))}"/>` + tdRays(960, 300, 16, '#FFF2C0', 0.12, T, 900);
    s += `<rect x="900" y="-40" width="120" height="770" fill="#2A2A30" stroke="${INK2}" stroke-width="6"/><rect x="912" y="-40" width="24" height="770" fill="#4A4A54"/><rect x="886" y="660" width="148" height="70" rx="6" fill="${tdC.gold}" stroke="${INK2}" stroke-width="5"/><path d="M890 690 h140" stroke="${tdC.gold2}" stroke-width="4"/>`;
    s += [...Array(5)].map((_, i) => `<path d="M900 ${100 + i * 120} h120" stroke="#3A3A44" stroke-width="3"/>`).join('');
    s += `<path d="M930 720 Q880 760 820 750 M990 720 Q1060 770 1120 740" stroke="#C8B888" stroke-width="10" fill="none" stroke-linecap="round"/>`;   // cát dồn chân cột
  }
  s += tdFish(400 + (T * 30) % 400, 380, 0.8, '#F2D16B', T) + tdFish(1500, 300, 0.7, '#8AD0E0', T, true) + tdFish(1380, 480, 0.5, '#F2A03A', T, true);
  s += tdBubbles(26, 0, 0, 1920, 1000, T, 9) + motes(30, 700, 0, 520, 760, '#FFF6C8', 0.6, 3);
  return s;
}

// ---------- Âm phủ, điện Sâm La: điện tối đỏ tím, án thư Diêm Vương, sổ sinh tử, lửa ma trơi, xích, cột đá đầu quỷ
function bg_am_phu(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 330, bx1: 1590, by0: 100, by1: 690, wall: '#4A2A3A', wall2: '#3E2232', fc: '#3A2E3A', floor: 'tile', paper: false, wain: '#2A1A24', wainH: 110, beams: '#2A1A24', vy: 470, ceil: '#2A1A26', side: '#3A2232' };
  let s = room1p(R);
  s += `<rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 110}" fill="${pat('thunder', '#5E3A4A', null, 1.3)}" opacity="0.6"/>`;
  // bức hoành + án thư lớn + sổ sinh tử
  s += `<rect x="760" y="130" width="400" height="80" rx="8" fill="#1A0E14" stroke="#B8463A" stroke-width="6"/><text x="960" y="186" font-family="${FH}" font-size="42" fill="#E85A4A" text-anchor="middle">ĐIỆN SÂM LA</text>`;
  s += `<rect x="700" y="250" width="520" height="300" fill="#2A1A24" stroke="${INK2}" stroke-width="5"/><rect x="720" y="270" width="480" height="260" fill="${pat('cloud', '#6A2A3A', null, 1.2)}" opacity="0.8"/>`;   // bình phong
  s += `<path d="M640 690 V560 H1280 V690Z" fill="#5A2A2A" stroke="${INK2}" stroke-width="5"/><rect x="620" y="540" width="680" height="30" fill="#7A3A30" stroke="${INK2}" stroke-width="4"/><rect x="660" y="590" width="600" height="80" fill="${pat('thunder', '#9A5A3A', null, 0.9)}" opacity="0.5"/>`;
  s += `<path d="M840 540 l10 -40 h120 l-6 40Z" fill="#E8DCC0" stroke="${INK2}" stroke-width="3"/><path d="M856 506 h110 M856 518 h110 M856 528 h110" stroke="#A89878" stroke-width="2"/><text x="910" y="500" font-family="${FH}" font-size="15" fill="${INK2}" text-anchor="middle">SỔ SINH TỬ</text>`;
  s += `<rect x="1030" y="500" width="40" height="40" fill="#2A2A30" stroke="${INK2}" stroke-width="3"/><path d="M1060 500 L1090 430" stroke="${INK2}" stroke-width="8"/><path d="M1060 500 L1090 430" stroke="#8A6A3A" stroke-width="4"/><path d="M1086 436 l10 -16 l2 20Z" fill="${INK2}"/>`;   // nghiên mực + bút
  s += `<path d="M1150 540 v-60 l40 -20 l40 20 v60Z" fill="#2A1A24" stroke="${INK2}" stroke-width="3"/>` + [0, 1, 2].map(i => `<path d="M${1170 + i * 20} 480 v-70" stroke="#8A6A3A" stroke-width="5"/>`).join('');   // ống thẻ lệnh
  // cột đá đầu quỷ (cách điệu, không đáng sợ quá) + xích
  for (const [x, w] of [[420, 60], [250, 90], [80, 130]]) for (const sd of [-1, 1]) { const xx = sd < 0 ? x : 1920 - x; s += columnD(xx, 0, 1080, w, '#4A3A44') + `<g transform="translate(${xx} 200) scale(${f2(w / 100)})"><path d="M-40 -30 Q0 -60 40 -30 Q50 20 0 40 Q-50 20 -40 -30Z" fill="#6A5A60" stroke="${INK2}" stroke-width="4"/><path d="M-30 -40 l-14 -26 l24 14 M30 -40 l14 -26 l-24 14" fill="#6A5A60" stroke="${INK2}" stroke-width="3.5"/><circle cx="-14" cy="-6" r="7" fill="#E85A4A"/><circle cx="14" cy="-6" r="7" fill="#E85A4A"/><path d="M-16 18 l8 -6 l8 6 l8 -6 l8 6" stroke="${INK2}" stroke-width="3" fill="none"/></g>`; }
  s += [380, 1540].map(x => `<path d="M${x} 0 Q${x + 30} 200 ${x - 10} 380" stroke="${INK2}" stroke-width="10" fill="none" stroke-dasharray="18 8"/><path d="M${x} 0 Q${x + 30} 200 ${x - 10} 380" stroke="#6A6A72" stroke-width="5" fill="none" stroke-dasharray="18 8"/>`).join('');
  // lửa ma trơi xanh lơ lửng
  for (let i = 0; i < 9; i++) { const x = 200 + hrnd(i, 3) * 1520, y = 200 + hrnd(i, 4) * 500 + Math.sin(T * 1.5 + i) * 20, r = 14 + hrnd(i, 5) * 10; s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r * 3)}" fill="#7AE8D8" opacity="0.12"/><path d="M${R1(x - r)} ${R1(y)} Q${R1(x - r)} ${R1(y + r)} ${R1(x)} ${R1(y + r)} Q${R1(x + r)} ${R1(y + r)} ${R1(x + r)} ${R1(y)} Q${R1(x + r * 0.4)} ${R1(y - r * 0.6)} ${R1(x + Math.sin(T * 4 + i) * 6)} ${R1(y - r * 2.4)} Q${R1(x - r * 0.4)} ${R1(y - r * 0.6)} ${R1(x - r)} ${R1(y)}Z" fill="#9AF4E4" stroke="${INK2}" stroke-width="2.5" opacity="0.9"/>`; }
  // chậu lửa đỏ hai bên thềm
  for (const x of [560, 1360]) s += `<path d="M${x - 60} 760 L${x - 40} 700 H${x + 40} L${x + 60} 760Z" fill="#3A2A2A" stroke="${INK2}" stroke-width="4"/>` + flames(x, 705, 0.32, T, x) + `<circle cx="${x}" cy="640" r="160" fill="#FF7A4A" opacity="0.12"/>`;
  // thảm + sương đáy
  s += `<path d="M860 690 H1060 L1240 1080 H680Z" fill="#3A1A22" stroke="${INK2}" stroke-width="4"/><path d="M875 690 L700 1080 M1045 690 L1220 1080" stroke="#8A2A2A" stroke-width="5"/>`;
  s += wxMist(1000, 0.25, '#B8A0C8', T) + wxMist(1040, 0.3, '#B8A0C8', T);
  s += `<defs><radialGradient id="apV" cx="0.5" cy="0.5" r="0.7"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#14060E" stop-opacity="0.55"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#apV)"/>`;
  return s;
}

// ---------- Vườn bàn đào: hàng cây đào trĩu quả, lối đá, cổng tròn, suối nhỏ, sương tiên — o.zone: 1|2|3 (khu ngoài/giữa/trong — quả to dần, ánh vàng); o.picked: khu trong đã bị ăn sạch (chỉ còn cuống)
function tdPeachTree(x, g, s = 1, T = AT_(), o = {}) {
  const fr = o.fruit ?? 12, big = o.big || 1, lf = o.leaf || '#5E8A44';
  let b = `<path d="M-18 0 Q-24 -100 -50 -170 Q-80 -230 -150 -250 M-6 0 Q6 -120 30 -190 Q56 -250 140 -270 M14 -130 Q70 -170 96 -168 M-40 -170 Q-30 -230 -4 -280" stroke="${INK2}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-18 0 Q-24 -100 -50 -170 Q-80 -230 -150 -250 M-6 0 Q6 -120 30 -190 Q56 -250 140 -270 M14 -130 Q70 -170 96 -168 M-40 -170 Q-30 -230 -4 -280" stroke="#7A5038" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-12 -20 q-4 -30 -14 -60" stroke="#9A6A4A" stroke-width="5" fill="none"/>`;
  for (const [cx, cy, r] of [[-150, -280, 74], [-60, -330, 90], [50, -340, 88], [150, -290, 74], [0, -260, 70], [-210, -230, 50], [210, -240, 50]]) b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${lf}" stroke="${INK2}" stroke-width="4.5"/>`;
  for (const [cx, cy, r] of [[-150, -280, 74], [-60, -330, 90], [50, -340, 88], [150, -290, 74], [0, -260, 70]]) b += `<path d="M${cx - r * 0.6} ${cy + r * 0.35} q${r * 0.6} ${r * 0.35} ${r * 1.2} 0" stroke="${dk(lf, 0.22)}" stroke-width="6" fill="none" opacity="0.7"/><path d="M${cx - r * 0.4} ${cy - r * 0.5} q${r * 0.3} -${r * 0.2} ${r * 0.6} -${r * 0.05}" stroke="${lt_(lf, 0.3)}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  for (let i = 0; i < 18; i++) { const a = hrnd(i, 31) * 6.28, rr = 40 + hrnd(i, 32) * 140; b += `<path d="M${R1(Math.cos(a) * rr * 1.25)} ${R1(-300 + Math.sin(a) * rr * 0.55)} q10 -10 22 -4 q-8 10 -22 4Z" fill="#8AB84A" stroke="${INK2}" stroke-width="1.8"/>`; }
  if (o.bloom) for (let i = 0; i < 26; i++) { const a = hrnd(i, 71 + (o.seed || 0)) * 6.28, rr = 20 + hrnd(i, 72) * 150, px = Math.cos(a) * rr * 1.25, py = -295 + Math.sin(a) * rr * 0.55, r = 9 + hrnd(i, 73) * 5;
    b += `<g transform="translate(${R1(px)} ${R1(py)})">${[0, 1, 2, 3, 4].map(k => `<circle cx="${R1(Math.cos(k * 1.257) * r * 0.7)}" cy="${R1(Math.sin(k * 1.257) * r * 0.7)}" r="${R1(r * 0.55)}" fill="#F7B8CA" stroke="${INK2}" stroke-width="1.5"/>`).join('')}<circle r="${R1(r * 0.3)}" fill="#E8607A"/></g>`; }
  for (let i = 0; i < fr; i++) { const a = hrnd(i, 41 + (o.seed || 0)) * 6.28, rr = 30 + hrnd(i, 42) * 125, px = Math.cos(a) * rr * 1.2, py = -280 + Math.sin(a) * rr * 0.55, r = (20 + hrnd(i, 43) * 6) * big;
    if (o.picked) { b += `<path d="M${R1(px)} ${R1(py - 8)} v16 M${R1(px - 4)} ${R1(py + 8)} h8" stroke="#5A3A2A" stroke-width="4"/>`; continue; }
    if (o.glow) b += `<circle cx="${R1(px)}" cy="${R1(py)}" r="${R1(r * 1.9)}" fill="#FFF2B0" opacity="0.3"/>`;
    b += `<path d="M${R1(px)} ${R1(py + r)} Q${R1(px - r * 1.1)} ${R1(py + r * 0.5)} ${R1(px - r * 0.8)} ${R1(py - r * 0.4)} Q${R1(px - r * 0.3)} ${R1(py - r * 1.05)} ${R1(px + r * 0.15)} ${R1(py - r * 1.25)} Q${R1(px + r * 1.15)} ${R1(py - r * 0.5)} ${R1(px)} ${R1(py + r)}Z" fill="#F8C0A8" stroke="${INK2}" stroke-width="3"/><path d="M${R1(px - r * 0.5)} ${R1(py)} Q${R1(px)} ${R1(py - r * 0.9)} ${R1(px + r * 0.15)} ${R1(py - r * 1.2)} Q${R1(px + r * 0.9)} ${R1(py - r * 0.4)} ${R1(px + r * 0.2)} ${R1(py + r * 0.7)}Z" fill="#F2786A" opacity="0.75"/><path d="M${R1(px + r * 0.15)} ${R1(py - r * 1.2)} Q${R1(px - r * 0.25)} ${R1(py)} ${R1(px)} ${R1(py + r)}" stroke="#D8604A" stroke-width="2.5" fill="none"/><path d="M${R1(px + r * 0.1)} ${R1(py - r * 1.2)} q${R1(-r * 0.6)} ${R1(-r * 0.3)} ${R1(-r * 0.9)} ${R1(r * 0.05)} q${R1(r * 0.4)} ${R1(r * 0.25)} ${R1(r * 0.9)} ${R1(-r * 0.05)}Z" fill="#7AA84A" stroke="${INK2}" stroke-width="2"/><ellipse cx="${R1(px - r * 0.45)}" cy="${R1(py - r * 0.1)}" rx="${R1(r * 0.12)}" ry="${R1(r * 0.25)}" fill="#FFFFFF" opacity="0.6"/>`; }
  return _g(x, g, s, b + `<ellipse cx="0" cy="6" rx="160" ry="20" fill="#20140A" opacity="0.12"/>`);
}

function bg_vuon_dao(t, o = {}) {
  // vẽ lại 2026-10-13 (người dùng: 'vườn đào nên xây cảnh đẹp hơn, 2 cái mái nhà nhìn lạ… có 2 cái sừng lệch ra ngoài'):
  // tường liền một dải có diềm ngói (không đầu đao giữa chừng), cổng tròn có lầu cổng mái cong cân đối ở giữa, rặng đào hồng nhiều lớp phía sau tường,
  // cây đào gần có cả hoa lẫn quả, suối + cầu đá, đèn đá, hồ sen nhỏ, tia nắng tiên và cánh hoa bay
  const T = _T(t), z = o.zone || 2;
  let s = tdHeavenSky(t, { ry: 160, c1: '#A8C8EC', c2: '#FBEEDC', cranes: true });
  s += tdCloudSea(440, T, { cols: ['#F0E2F0', '#F8EEF2'], gap: 40, sp: 4, r: 40 });
  // núi tiên xa + rặng đào hồng phía sau tường (nhiều lớp, mờ dần)
  s += `<path d="M0 470 Q160 360 320 430 Q470 320 640 420 Q800 350 960 410 Q1130 330 1290 420 Q1460 340 1620 430 Q1780 360 1920 440 V520 H0Z" fill="#B8C8D8" stroke="${INK2}" stroke-width="3" opacity="0.7"/>`;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 16; i++) { const x = i * 128 + (r ? 64 : 0) + hrnd(i, 61 + r) * 30, y = 486 + r * 14, rr = 46 + hrnd(i, 62 + r) * 20;
    s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(rr)}" fill="${r ? '#F2B8C8' : '#E8C4D4'}" stroke="${INK2}" stroke-width="3" opacity="${r ? 1 : 0.8}"/>` + [0, 1, 2, 3].map(k => `<circle cx="${R1(x + Math.cos(k * 1.7 + i) * rr * 0.55)}" cy="${R1(y + Math.sin(k * 1.7 + i) * rr * 0.45)}" r="5" fill="#FFF0F4"/>`).join(''); }
  // tường vườn liền một dải: thân trắng ngà, chân đá, diềm ngói xanh chạy suốt (không đầu đao giữa chừng)
  s += `<rect x="0" y="512" width="1920" height="112" fill="#EFE4D6" stroke="${INK2}" stroke-width="4"/><rect x="0" y="600" width="1920" height="24" fill="#C8BCAA" stroke="${INK2}" stroke-width="3"/>`;
  for (let x = 40; x < 1920; x += 160) if (Math.abs(x - 960) > 190) s += `<path d="M${x} 540 h60 v40 h-60Z" fill="none" stroke="#C8B8A2" stroke-width="4"/><path d="M${x + 30} 540 v40 M${x} 560 h60" stroke="#C8B8A2" stroke-width="3"/>`;   // ô hoa văn
  s += `<path d="M-10 512 L-10 494 Q960 486 1930 494 L1930 512Z" fill="#4E7A5C" stroke="${INK2}" stroke-width="4"/>` + [...Array(48)].map((_, i) => `<path d="M${i * 40 + 10} 494 v18" stroke="#3A5E46" stroke-width="3"/>`).join('') + `<path d="M-10 488 H1930" stroke="#3A5E46" stroke-width="8" stroke-linecap="round"/>`;
  // lầu cổng giữa: 2 cột đỏ, mái cong cân đối (đầu đao ở đúng 2 góc mái), biển nhỏ, cổng tròn
  s += `<rect x="790" y="430" width="340" height="194" fill="#F4EADC" stroke="${INK2}" stroke-width="4"/>` + [800, 1100].map(x => `<rect x="${x}" y="440" width="20" height="184" fill="#B8322A" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += `<circle cx="960" cy="548" r="78" fill="#BFE0C8" stroke="${INK2}" stroke-width="6"/><circle cx="960" cy="548" r="78" fill="none" stroke="#D8C8B4" stroke-width="12"/><circle cx="960" cy="548" r="84" fill="none" stroke="${INK2}" stroke-width="3"/>` + tdPeachTree(960, 620, 0.22, T, { fruit: 6 });
  s += wxRoof(960, 432, 420, 70, { c: '#4E7A5C', tip: '#F2D16B', up: 0.45 });
  s += `<rect x="900" y="446" width="120" height="30" rx="5" fill="#2A2A30" stroke="${TK.gold}" stroke-width="3"/>` + kText('BÀN ĐÀO', 960, 468, 20, { c: '#F2D16B' });
  // cỏ, lối đá phối cảnh
  s += `<path d="M0 624 H1920 V1080 H0Z" fill="#9AC07A" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M905 624 H1015 L1240 1080 H680Z" fill="#E2D6B8" stroke="${INK2}" stroke-width="3.5"/>` + [...Array(8)].map((_, i) => { const y = 650 + i * i * 7 + i * 20, w = 110 + (y - 624) * 0.95; return `<path d="M${R1(960 - w / 2 + 6)} ${y} h${R1(w - 12)}" stroke="#C8BA98" stroke-width="3"/>`; }).join('');
  // suối nhỏ + cầu đá vòm bên trái, hồ sen nhỏ bên phải
  s += tdWater([[0, 700], [360, 680], [420, 720], [200, 790], [0, 800]], '#8CC8DA', T, 4) + `<path d="M120 760 Q240 690 360 740" stroke="${INK2}" stroke-width="22" fill="none"/><path d="M120 760 Q240 690 360 740" stroke="#D8D2C2" stroke-width="15" fill="none"/>`;
  s += `<ellipse cx="1500" cy="742" rx="170" ry="34" fill="#8CC8DA" stroke="${INK2}" stroke-width="4"/>` + [[1420, 740], [1520, 750], [1590, 736]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="8" fill="#6EA85A" stroke="${INK2}" stroke-width="2.5"/>` + (i !== 1 ? `<path d="M${x} ${y - 4} q-12 -22 0 -32 q12 10 0 32Z" fill="#F4A8C0" stroke="${INK2}" stroke-width="2.5"/>` : '')).join('');
  // đèn đá hai bên lối
  for (const [x, y, k] of [[820, 700, 0.5], [1100, 700, 0.5]]) s += `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-16" y="-60" width="32" height="60" fill="#C8C2B2" stroke="${INK2}" stroke-width="4"/><rect x="-36" y="-110" width="72" height="50" fill="#D8D2C2" stroke="${INK2}" stroke-width="4"/><rect x="-18" y="-100" width="36" height="30" fill="#FFE39A" stroke="${INK2}" stroke-width="3"/><path d="M-50 -110 L0 -150 L50 -110Z" fill="#8A8476" stroke="${INK2}" stroke-width="4"/></g>`;
  // hàng cây đào: xa → gần (hoa + quả)
  const glow = z === 3, big = [0.85, 1, 1.25][z - 1];
  s += [[200, 690, 0.45], [560, 670, 0.4], [1360, 670, 0.4], [1740, 690, 0.45]].map(([x, g, sc], i) => tdPeachTree(x, g, sc, T, { fruit: 10, seed: i, big, glow, bloom: 1, picked: o.picked && z === 3 })).join('');
  s += [[360, 830, 0.75], [1560, 830, 0.75]].map(([x, g, sc], i) => tdPeachTree(x, g, sc, T, { fruit: 14, seed: i + 5, big, glow, bloom: 1, picked: o.picked && z === 3 })).join('');
  s += [[60, 1060, 1.05], [1860, 1060, 1.05]].map(([x, g, sc], i) => tdPeachTree(x, g, sc, T, { fruit: 18, seed: i + 9, big, glow, bloom: 1, picked: o.picked && z === 3 })).join('');
  // bàn đá, giỏ hái
  s += `<path d="M1180 920 Q1180 890 1240 890 H1380 Q1440 890 1440 920 Q1400 940 1310 940 Q1220 940 1180 920Z" fill="#C8C2B2" stroke="${INK2}" stroke-width="4"/><path d="M1290 940 V1000 h40 V940" fill="#B8B2A2" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M560 980 Q560 920 620 920 Q680 920 680 980Z" fill="#C89A5A" stroke="${INK2}" stroke-width="4"/><path d="M570 950 h100 M576 966 h88" stroke="#A87A3A" stroke-width="3"/><path d="M580 920 Q620 860 660 920" stroke="${INK2}" stroke-width="6" fill="none"/>` + [0, 1, 2].map(i => `<circle cx="${590 + i * 30}" cy="916" r="16" fill="#F8C0A8" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += vGrass(150, 0, 640, 1920, 440, '#6E9A3A', 51, { c2: '#8EB85A', skip: (x, y) => x > 800 && x < 1120 }) + flowers(60, 0, 660, 1920, 420, 52, ['#F5C2D2', '#FFF0F4', '#F2D16B', '#B9A2E0']);
  // tia nắng tiên chéo + cánh hoa bay + sương
  s += `<g opacity="0.16">${[0, 1, 2, 3].map(i => `<path d="M${300 + i * 260} 0 L${420 + i * 260} 0 L${760 + i * 300} 1080 L${560 + i * 300} 1080Z" fill="#FFF4C8"/>`).join('')}</g>`;
  s += wxPetals(30, T, 3) + wxMist(990, 0.22, '#FFFFFF', T);
  if (z === 3) s += motes(40, 0, 300, 1920, 700, '#FFF2B0', 0.7, 7);
  return s;
}

// ---------- Dao Trì: hồ ngọc, bàn tiệc dài trải lụa, mâm đào, chén ngọc, đèn, rèm lụa — o.after: tan tiệc (đổ vỡ, ghế lệch); o.anthien: tiệc An Thiên (thêm cờ, đông khách)
function bg_dao_tri(t, o = {}) {
  const T = _T(t);
  let s = tdHeavenSky(t, { ry: 200, c1: '#B0C4EC', c2: '#FCEADB' });
  // hồ ngọc xa có đình
  s += `<path d="M0 520 Q960 490 1920 520 V640 H0Z" fill="#9AD4D8" stroke="${INK2}" stroke-width="4"/>` + [...Array(10)].map((_, i) => `<path d="M${R1((hrnd(i, 3) * 2000 + T * 16) % 2000 - 40)} ${R1(540 + hrnd(i, 4) * 80)} q16 -6 32 0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.7"/>`).join('');
  s += [[260, 530], [1660, 530]].map(([x, g]) => `<path d="M${x - 100} ${g} h200 v-16 h-200Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="3"/>${[-70, 0, 70].map(d => `<rect x="${x + d - 7}" y="${g - 110}" width="14" height="96" fill="${tdC.red}" stroke="${INK2}" stroke-width="3"/>`).join('')}` + wxRoof(x, g - 110, 260, 80, { c: tdC.roofG, tip: '#F2D16B', pearl: true })).join('');
  s += [...Array(7)].map((_, i) => `<g transform="translate(${300 + i * 220} ${600 + (i % 2) * 14})"><ellipse rx="40" ry="10" fill="#6EA85A" stroke="${INK2}" stroke-width="2.5"/>${i % 2 ? `<path d="M0 -6 q-14 -24 0 -36 q14 12 0 36Z" fill="#F4A8C0" stroke="${INK2}" stroke-width="2.5"/>` : ''}</g>`).join('');   // lá sen, hoa sen
  // sàn ngọc trắng
  s += `<path d="M0 640 H1920 V1080 H0Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="4"/>` + wxPaving(640, tdC.jade, { vy: 420 }).replace(/<rect[^>]*\/>/, '');
  s += tdRail(0, 1920, 652, 46);
  // bàn tiệc dài phối cảnh hai bên + lụa đỏ
  for (const sd of [-1, 1]) { const xa = 960 + sd * 300, xb = 960 + sd * 900;
    s += `<path d="M${xa} 720 L${xb} 980 L${xb} 1040 L${xa} 760Z" fill="#B03A2E" stroke="${INK2}" stroke-width="4"/><path d="M${xa} 720 L${xb} 980 L${xb + sd * 120} 940 L${xa + sd * 50} 704Z" fill="#E8D9B0" stroke="${INK2}" stroke-width="4"/>`;
    for (let k = 0; k < 6; k++) { const u = (k + 0.5) / 6, x = xa + (xb - xa) * u + sd * 30, y = 712 + 236 * u, sc = 0.6 + 0.6 * u;
      if (o.after && k % 2) { s += `<path d="M${R1(x - 16 * sc)} ${R1(y)} l${R1(14 * sc)} ${R1(-8 * sc)} l${R1(20 * sc)} ${R1(6 * sc)}" stroke="#C8D8E0" stroke-width="${R1(6 * sc)}"/>`; continue; }
      s += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(30 * sc)}" ry="${R1(9 * sc)}" fill="#F4F0E4" stroke="${INK2}" stroke-width="2.5"/>` + [0, 1, 2].map(m => `<path d="M${R1(x - 14 * sc + m * 12 * sc)} ${R1(y - 2)} q${R1(-8 * sc)} ${R1(-14 * sc)} ${R1(4 * sc)} ${R1(-22 * sc)} q${R1(12 * sc)} ${R1(10 * sc)} ${R1(-4 * sc)} ${R1(22 * sc)}Z" fill="#F7B0A0" stroke="${INK2}" stroke-width="2"/>`).join('') + `<path d="M${R1(x + 34 * sc)} ${R1(y - 4)} h${R1(14 * sc)} l${R1(-3 * sc)} ${R1(12 * sc)} h${R1(-8 * sc)}Z" fill="#BCE0D8" stroke="${INK2}" stroke-width="2"/>`; }
    for (let k = 0; k < 5; k++) { const u = (k + 0.5) / 5, x = xa + (xb - xa) * u - sd * 40 * (0.5 + u), y = 790 + 250 * u, sc = 0.6 + 0.7 * u; s += `<rect x="${R1(x - 26 * sc)}" y="${R1(y - 30 * sc)}" width="${R1(52 * sc)}" height="${R1(30 * sc)}" rx="6" fill="#8E2A22" stroke="${INK2}" stroke-width="3" transform="${o.after && k % 2 ? `rotate(${sd * 25} ${R1(x)} ${R1(y)})` : ''}"/>`; } }
  // vò rượu tiên + lư hương giữa
  s += [[880, 760], [1040, 760]].map(([x, y]) => `<path d="M${x - 36} ${y} Q${x - 50} ${y - 60} ${x - 22} ${y - 80} H${x + 22} Q${x + 50} ${y - 60} ${x + 36} ${y}Z" fill="#5A8A9A" stroke="${INK2}" stroke-width="4"/><rect x="${x - 20}" y="${y - 94}" width="40" height="16" fill="#C0392B" stroke="${INK2}" stroke-width="3"/>`).join('') + wxCauldron(960, 830, 0.5);
  // rèm lụa, đèn lồng
  s += tdDrapes('#E8A8B8', T) + wxLantern(420, 170, 0.9, '#C0392B', T) + wxLantern(1500, 170, 0.9, '#C0392B', T) + `<path d="M420 30 V110 M1500 30 V110" stroke="${INK2}" stroke-width="3"/>`;
  if (o.anthien) s += tdPennant(120, 1000, 440, '#F2D16B', T) + tdPennant(1800, 1000, 440, '#F2D16B', T);
  s += [[150, 1050, 0.9], [1780, 1060, 0.9]].map(([x, y, sc], i) => tdXiang(x, y, sc, '#FFF8F0', i === 1)).join('') + wxPetals(10, T, 6);
  return s;
}

// ---------- Cung Đâu Suất: phòng luyện đan, lò Bát Quái lớn ở giữa, kệ hồ lô, tranh Thái Cực, khói thuốc — o.empty: không có lò (sau khi lò bị đạp đổ); o.noFurnace
function tdFurnace(x, g, s = 1, T = AT_(), o = {}) {
  let b = `<path d="M-200 0 L-170 -60 H170 L200 0Z" fill="#5A4A3A" stroke="${INK2}" stroke-width="5"/>`;
  for (const dx of [-130, 0, 130]) b += `<path d="M${dx - 26} -60 L${dx - 34} -150 H${dx + 34} L${dx + 26} -60Z" fill="#7A6040" stroke="${INK2}" stroke-width="4"/>`;
  b += `<path d="M-230 -150 Q-250 -420 0 -450 Q250 -420 230 -150Z" fill="#9A7A4A" stroke="${INK2}" stroke-width="6"/><path d="M0 -450 Q250 -420 230 -150 H90 Q140 -300 0 -450Z" fill="#7A5E36" opacity="0.6"/>`;
  b += `<rect x="-240" y="-170" width="480" height="30" rx="8" fill="#B8925A" stroke="${INK2}" stroke-width="4"/><rect x="-200" y="-420" width="400" height="24" rx="8" fill="#B8925A" stroke="${INK2}" stroke-width="4"/>`;
  // bát quái trên thân lò
  b += `<g transform="translate(0 -290)"><circle r="96" fill="#C8A86A" stroke="${INK2}" stroke-width="4"/>${[...Array(8)].map((_, i) => `<g transform="rotate(${i * 45})"><path d="M-24 -84 h48 M-24 -72 h${i % 2 ? 20 : 48} ${i % 2 ? 'M4 -72 h20' : ''} M-24 -60 h48" stroke="${INK2}" stroke-width="6"/></g>`).join('')}<circle r="44" fill="#F4F0E4" stroke="${INK2}" stroke-width="4"/><path d="M0 -44 A44 44 0 0 1 0 44 A22 22 0 0 1 0 0 A22 22 0 0 0 0 -44Z" fill="${INK2}"/><circle cy="-22" r="7" fill="${INK2}"/><circle cy="22" r="7" fill="#F4F0E4"/></g>`;
  // cửa lò + lửa
  b += `<path d="M-70 -150 V-200 Q0 -240 70 -200 V-150Z" fill="#2A1A10" stroke="${INK2}" stroke-width="4"/>` + flames(0, -150, 0.35, T, 1).replace(/<path d="M-120 0 L120 0"[^>]*\/>/, '');
  // nắp + chóp
  b += `<path d="M-120 -440 Q0 -540 120 -440Z" fill="#B8925A" stroke="${INK2}" stroke-width="5"/><circle cy="-548" r="22" fill="${tdC.gold}" stroke="${INK2}" stroke-width="4"/>`;
  for (const sd of [-1, 1]) b += `<path d="M${sd * 230} -320 q${sd * 50} -20 ${sd * 50} 30 q0 30 ${-sd * 30} 30" stroke="${INK2}" stroke-width="16" fill="none"/><path d="M${sd * 230} -320 q${sd * 50} -20 ${sd * 50} 30 q0 30 ${-sd * 30} 30" stroke="#B8925A" stroke-width="9" fill="none"/>`;
  return _g(x, g, s, b) + smoke(x - 20, g - 560 * s, 260, 0.45) + smoke(x + 30, g - 560 * s, 220, 0.35);
}

function tdGourd(x, y, s = 1, c = '#E2B23A') { return _g(x, y, s, `<path d="M0 -70 q-6 -12 4 -16" stroke="#5A6A2A" stroke-width="5" fill="none"/><circle cy="-50" r="20" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><circle cy="-6" r="32" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><path d="M-14 -32 h28" stroke="#C0392B" stroke-width="6"/><path d="M-14 -16 q6 -10 14 -8" stroke="#FFF2C0" stroke-width="5" fill="none" stroke-linecap="round"/>`); }
function bg_dau_suat(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 330, bx1: 1590, by0: 90, by1: 700, wall: '#C8B898', wall2: '#B8A888', fc: '#8A7A6A', floor: 'tile', paper: false, wain: '#6B4A30', wainH: 120, beams: '#6B4A30', vy: 470 };
  let s = room1p(R);
  // tranh Thái Cực + câu đối
  s += `<rect x="830" y="140" width="260" height="300" fill="#EFE2C0" stroke="${INK2}" stroke-width="6"/><rect x="816" y="130" width="288" height="14" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/><g transform="translate(960 290)"><circle r="90" fill="#FFF" stroke="${INK2}" stroke-width="5"/><path d="M0 -90 A90 90 0 0 1 0 90 A45 45 0 0 1 0 0 A45 45 0 0 0 0 -90Z" fill="${INK2}"/><circle cy="-45" r="14" fill="${INK2}"/><circle cy="45" r="14" fill="#FFF"/></g>`;
  for (const x of [770, 1150]) s += `<rect x="${x - 26}" y="150" width="52" height="300" fill="#B03A2E" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<g transform="translate(${x} ${200 + i * 90})"><circle r="18" fill="none" stroke="#F2D16B" stroke-width="4"/><path d="M-10 4 q0 -14 10 -12 q10 2 6 10 q-4 6 -8 0" stroke="#F2D16B" stroke-width="3" fill="none"/><path d="M0 -30 v-12 M0 30 v12" stroke="#F2D16B" stroke-width="3"/></g>`).join('');
  // kệ hồ lô hai bên tường sau
  for (const [x0, x1] of [[360, 700], [1220, 1560]]) { s += `<rect x="${x0}" y="160" width="${x1 - x0}" height="420" fill="#7A5234" stroke="${INK2}" stroke-width="5"/>`; for (let r = 0; r < 4; r++) { const y = 260 + r * 100; s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="16" fill="#5A3A24" stroke="${INK2}" stroke-width="3"/>`; for (let k = 0; k < 5; k++) { const gx = x0 + 40 + k * (x1 - x0 - 80) / 4; s += tdGourd(gx, y, 0.75, ['#E2B23A', '#C89A3A', '#E8C060', '#D8A040', '#E2B23A'][(k + r) % 5]); } } }
  // lò Bát Quái
  if (!o.empty) s += tdFurnace(960, 760, 0.95, T);
  else s += `<path d="M700 760 L760 740 L820 770 L900 744 L1000 776 L1100 742 L1200 772 L1240 760" stroke="${INK2}" stroke-width="6" fill="none"/>` + [[800, 820], [1100, 840], [940, 900]].map(([x, y]) => `<path d="M${x - 40} ${y} l20 -30 l40 6 l26 24Z" fill="#9A7A4A" stroke="${INK2}" stroke-width="3"/>`).join('');
  // bàn thuốc: cối giã, cân, sách
  s += `<path d="M1300 860 H1640 L1680 900 H1260Z" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/><rect x="1270" y="900" width="400" height="22" fill="#6B4A30" stroke="${INK2}" stroke-width="3"/><path d="M1290 922 v100 M1650 922 v100" stroke="${INK2}" stroke-width="12"/>`;
  s += `<path d="M1360 860 l-10 -50 h70 l-10 50Z" fill="#9A9488" stroke="${INK2}" stroke-width="3"/><path d="M1386 812 l30 -60" stroke="${INK2}" stroke-width="10"/><path d="M1386 812 l30 -60" stroke="#B8B0A0" stroke-width="5"/>`;
  s += `<path d="M1520 860 v-90 M1470 780 h100 M1478 780 l-12 40 h40 l-12 -40 M1562 780 l-12 30 h40 l-12 -30" stroke="${INK2}" stroke-width="4" fill="#C8A86A"/>`;
  s += `<path d="M260 860 H560 L590 890 H230Z" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${290 + i * 4}" y="${846 - i * 14}" width="120" height="14" fill="${['#C8B488', '#B8A478', '#D8C498'][i]}" stroke="${INK2}" stroke-width="2.5"/>`).join('') + tdGourd(480, 860, 0.9);
  // bồ đoàn + sàn gạch
  s += `<ellipse cx="960" cy="960" rx="90" ry="24" fill="${tdC.gold}" stroke="${INK2}" stroke-width="4"/>`;
  for (const [x, w] of [[400, 50], [250, 76], [80, 110]]) s += columnD(x, 0, 1080, w, '#8E3A2A') + columnD(1920 - x, 0, 1080, w, '#8E3A2A');
  s += motes(30, 400, 200, 1120, 600, '#FFE8B0', 0.6, 5);
  return s;
}

// rèm lụa vén hai bên (có nếp gấp, dây buộc tua)
function tdDrapes(c = '#E8A8B8', T = AT_()) {
  let s = '';
  for (const sd of [-1, 1]) { const X = (v) => sd < 0 ? v : 1920 - v; const sw = Math.sin(T * 0.8) * 6;
    s += `<path d="M${X(0)} 0 H${X(300)} Q${X(250 + sw)} 160 ${X(130)} 300 Q${X(90)} 340 ${X(110)} 420 Q${X(60)} 640 ${X(40 + sw)} 1080 H${X(0)}Z" fill="${c}" stroke="${INK2}" stroke-width="5"/>`;
    s += [60, 120, 190].map((v, i) => `<path d="M${X(v + 40)} 0 Q${X(v + 10)} 180 ${X(110 - i * 10)} 330" stroke="${dk(c, 0.15)}" stroke-width="5" fill="none"/>`).join('') + [30, 70].map(v => `<path d="M${X(100)} 420 Q${X(v)} 700 ${X(v - 10)} 1080" stroke="${dk(c, 0.15)}" stroke-width="5" fill="none"/>`).join('');
    s += `<path d="M${X(70)} 330 Q${X(130)} 300 ${X(160)} 350" stroke="${tdC.gold}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${X(158)} 352 v80 M${X(150)} 352 v70 M${X(166)} 352 v66" stroke="${tdC.gold}" stroke-width="4"/><circle cx="${X(158)}" cy="352" r="12" fill="#C0392B" stroke="${INK2}" stroke-width="3"/>`; }
  s += `<path d="M0 0 H1920 V30 Q1760 90 1600 30 Q1440 90 1280 30 Q1120 90 960 30 Q800 90 640 30 Q480 90 320 30 Q160 90 0 30Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  return s;
}

// ---------- Chiến trường trên mây trước Hoa Quả Sơn: thiên binh dàn trận trên các đảo mây, cờ hiệu, trời khói lửa; o.net: lưới trời úp xuống; o.calm=false
function tdTroops(x, g, n = 8, s = 1, c = '#5A6A9A', seed = 1, T = AT_()) {
  let b = '';
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 46 + (hrnd(i, seed) - 0.5) * 10, row = i % 2, yy = -row * 16, bob = Math.sin(T * 2 + i) * 2;
    b += `<g transform="translate(${R1(dx)} ${R1(yy + bob)})"><path d="M0 -150 V-60" stroke="${INK2}" stroke-width="6"/><path d="M-6 -150 l6 -26 l6 26Z" fill="#D8D8DC" stroke="${INK2}" stroke-width="2.5"/><path d="M-22 0 Q-24 -50 0 -58 Q24 -50 22 0Z" fill="${c}" stroke="${INK2}" stroke-width="3"/><circle cy="-70" r="15" fill="#E8C8A8" stroke="${INK2}" stroke-width="3"/><path d="M-17 -74 Q0 -100 17 -74Z" fill="#B8A040" stroke="${INK2}" stroke-width="2.5"/><path d="M0 -94 v-12" stroke="#C0392B" stroke-width="5"/><path d="M-22 -34 h44" stroke="#B8A040" stroke-width="5"/></g>`; }
  return _g(x, g, s, b);
}

function tdFlag(x, g, h = 300, c = '#C0392B', txt = 'THIÊN', T = AT_(), s = 1) {
  const wv = Math.sin(T * 3.5 + x * 0.02) * 12;
  return _g(x, g, s, `<path d="M0 0 V${-h}" stroke="${INK2}" stroke-width="9"/><path d="M0 0 V${-h}" stroke="#8A5A2A" stroke-width="4"/><path d="M0 ${-h + 6} Q60 ${R1(-h - 4 + wv)} 120 ${R1(-h + 6 - wv)} L120 ${R1(-h + 116 - wv)} Q60 ${R1(-h + 108 + wv)} 0 ${-h + 116}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M0 ${-h + 6} Q60 ${R1(-h - 4 + wv)} 120 ${R1(-h + 6 - wv)}" stroke="${tdC.gold}" stroke-width="6" fill="none"/><text x="60" y="${-h + 72}" font-family="${FH}" font-size="${txt.length > 4 ? 24 : 30}" fill="#F2D16B" text-anchor="middle" stroke="${INK2}" stroke-width="1">${txt}</text>`);
}

function bg_tran_may(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('tmmSk', '#7A6AA0', '#F4B07A');
  s += tdRays(960, 1000, 16, '#FFE0A0', 0.12, T, 1400);
  s += cloudsDrift([[200, 110, 1.4, '#E8C8C0'], [900, 70, 1.1, '#E8C8C0'], [1600, 120, 1.5, '#E8C8C0']], 10);
  // Hoa Quả Sơn bên dưới qua khe mây
  s += `<rect y="640" width="1920" height="440" fill="#7EAAC0"/>` + tdCrag(760, 1000, 200, 420, '#7E8C78', 71, { nt: 3 }) + tdCrag(980, 1010, 260, 520, '#8A967E', 72, { nt: 4 }) + tdCrag(1200, 1000, 200, 400, '#7E8C78', 73, { nt: 3 });
  s += smoke(900, 640, 300, 0.5) + smoke(1080, 600, 260, 0.45);
  // đảo mây hai bên có thiên binh dàn trận + cờ
  for (const sd of [-1, 1]) { const cx = 960 + sd * 620;
    s += tdTroops(cx + sd * 40, 470, 8, 0.85, sd < 0 ? '#5A6A9A' : '#7A4A5A', sd + 5, T) + tdFlag(cx - sd * 230, 520, 300, '#C0392B', 'THIÊN', T, 0.95) + tdFlag(cx + sd * 250, 500, 280, '#2A5AA0', 'TƯỚNG', T, 0.85);
    s += tdPuffs([[cx - sd * 300, 590, 70], [cx - sd * 160, 570, 90], [cx, 560, 110], [cx + sd * 170, 575, 95], [cx + sd * 320, 590, 80], [cx - sd * 80, 620, 80], [cx + sd * 100, 625, 80]], '#EADCEC', 3.5, { curl: true });
    s += tdTroops(cx - sd * 40, 560, 10, 1.1, sd < 0 ? '#5A6A9A' : '#7A4A5A', sd + 3, T); }
  // lưới trời
  if (o.net) { let d = ''; for (let i = -10; i <= 30; i++) d += `M${i * 80} -20 L${i * 80 - 600} 1100 M${i * 80 - 600} -20 L${i * 80} 1100 `; s += `<path d="${d}" stroke="#F2D16B" stroke-width="3" opacity="0.4"/>`; }
  // nền mây gần (đất đứng)
  s += tdCloudSea(900, T, { cols: ['#E2D2E4', '#F2E4EE'], gap: 80, sp: 8, r: 64 });
  return s;
}

// ---------- Pháp trường trên mây (Trảm Yêu Đài): đài ngọc, cột trói, giá đao, trống, cờ đen đỏ, trời u ám
function bg_phap_truong(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('ptSk', '#5A5A78', '#C8A8A8');
  s += cloudsDrift([[200, 120, 1.6, '#8A8AA0'], [880, 80, 1.3, '#9A96AA'], [1500, 130, 1.7, '#8A8AA0']], 8);
  s += tdCloudSea(560, T, { cols: ['#C8BCD0', '#D8CCDA'], gap: 60, sp: 4, r: 50 });
  // đài bát giác bằng ngọc, bậc
  s += `<path d="M160 1080 L300 760 H1620 L1760 1080Z" fill="${tdC.jade2}" stroke="${INK2}" stroke-width="5"/><path d="M300 760 H1620 L1640 800 H280Z" fill="${tdC.jade}" stroke="${INK2}" stroke-width="4"/>` + wxPaving(800, '#CCC8BA', { vy: 600 }).replace(/<rect[^>]*\/>/, '').replace(/M0 800 H1920/, '');
  s += tdRail(300, 760, 770, 60) + tdRail(1160, 1620, 770, 60);
  // biển tên + cột trói giữa
  s += `<rect x="900" y="300" width="120" height="480" fill="#5A3A2A" stroke="${INK2}" stroke-width="5"/><rect x="912" y="300" width="20" height="480" fill="#7A5A3A"/><path d="M880 300 H1040" stroke="${INK2}" stroke-width="18" stroke-linecap="round"/><path d="M880 300 H1040" stroke="#8A6A4A" stroke-width="10" stroke-linecap="round"/>` + [480, 560, 640].map(y => `<path d="M900 ${y} q60 20 120 0" stroke="#C8A86A" stroke-width="7" fill="none"/>`).join('');
  s += `<rect x="790" y="180" width="340" height="80" rx="8" fill="#1A1A22" stroke="#B03A2E" stroke-width="6"/><text x="960" y="236" font-family="${FH}" font-size="40" fill="#E85A4A" text-anchor="middle">TRẢM YÊU ĐÀI</text>`;
  // giá binh khí + trống trận
  s += `<g><rect x="380" y="640" width="200" height="14" fill="#5A3A2A" stroke="${INK2}" stroke-width="3"/><rect x="380" y="700" width="200" height="14" fill="#5A3A2A" stroke="${INK2}" stroke-width="3"/>${[400, 450, 500, 550].map((x, i) => `<path d="M${x} 760 V${560 - (i % 2) * 20}" stroke="${INK2}" stroke-width="8"/><path d="M${x} 760 V${560 - (i % 2) * 20}" stroke="#7A5A3A" stroke-width="4"/><path d="M${x} ${560 - (i % 2) * 20} q30 10 30 50 q-20 -10 -30 -10Z" fill="#D8D8DC" stroke="${INK2}" stroke-width="3"/>`).join('')}</g>`;
  s += `<g transform="translate(1460 700)"><path d="M-90 60 L-60 -10 M90 60 L60 -10" stroke="${INK2}" stroke-width="10"/><ellipse cx="0" cy="-70" rx="90" ry="34" fill="#E8D8B8" stroke="${INK2}" stroke-width="4"/><path d="M-90 -70 V0 Q0 34 90 0 V-70" fill="#B03A2E" stroke="${INK2}" stroke-width="4"/>${[-60, -20, 20, 60].map(dx => `<circle cx="${dx}" cy="${-34 + Math.abs(dx) * 0.1}" r="5" fill="${tdC.gold}" stroke="${INK2}" stroke-width="1.5"/>`).join('')}<path d="M50 -120 l40 -60 M70 -110 l46 -48" stroke="${INK2}" stroke-width="7"/></g>`;
  s += tdPennant(220, 1000, 560, '#2A2A30', T) + tdPennant(1700, 1000, 560, '#8E2A22', T) + tdPennant(120, 1050, 520, '#8E2A22', T) + tdPennant(1800, 1050, 520, '#2A2A30', T);
  s += `<rect width="1920" height="1080" fill="#2A2040" opacity="0.1"/>`;
  return s;
}

// ---------- Mặt cắt lò Bát Quái: tám cung (Càn Khảm Cấn Chấn Tốn Ly Khôn Đoài), lửa khắp nơi trừ cung Tốn (gió) — o.hi: tô sáng cung Tốn
function bg_lo_bq(t, o = {}) {
  const T = _T(t);
  let s = `<rect width="1920" height="1080" fill="#2A1A14"/>` + `<circle cx="960" cy="560" r="620" fill="#5A2A14" opacity="0.6"/>`;
  const cx = 960, cy = 560, R = 470, r0 = 120;
  // tên cung theo hậu thiên bát quái: Ly (nam, trên), Khảm (bắc, dưới), Chấn đông (trái), Đoài tây (phải), Tốn đông nam, Khôn tây nam, Càn tây bắc, Cấn đông bắc
  const names = [['LY', '101'], ['KHÔN', '000'], ['ĐOÀI', '110'], ['CÀN', '111'], ['KHẢM', '010'], ['CẤN', '001'], ['CHẤN', '100'], ['TỐN', '011']];   // vạch quẻ từ dưới lên (1 = liền, 0 = đứt)
  const P = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  for (let i = 0; i < 8; i++) { const a0 = -Math.PI / 2 - Math.PI / 8 + i * Math.PI / 4, a1 = a0 + Math.PI / 4, ton = i === 7;
    const pts = [P(a0, r0), P(a0, R), P(a1, R), P(a1, r0)];
    s += _q(pts, ton ? (o.hi ? '#8ACBE0' : '#5A8AA0') : '#8A3A1E', 5);
    if (!ton) { const [mx, my] = P((a0 + a1) / 2, (R + r0) / 2); for (let k = 0; k < 3; k++) { const [fx, fy] = P(a0 + (k + 0.7) * Math.PI / 4 / 3.4, R * 0.55 + k * 40); s += flames(fx, fy + 60, 0.28, T, i * 3 + k).replace(/<path d="M-120 0 L120 0"[^>]*\/>/, ''); } }
    else { const [mx, my] = P((a0 + a1) / 2, (R + r0) / 2); for (let k = 0; k < 4; k++) { const ph = T * 2 + k; s += `<path d="M${R1(mx - 120 + k * 20)} ${R1(my - 80 + k * 50)} q40 -30 80 0 t80 0" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="${f2(0.4 + 0.3 * Math.sin(ph))}" stroke-linecap="round"/>`; } }
    const [lx, ly] = P((a0 + a1) / 2, R + 60); s += `<text x="${R1(lx)}" y="${R1(ly + 16)}" font-family="${FH}" font-size="40" fill="${ton ? '#BFF0FF' : '#F2D16B'}" text-anchor="middle" stroke="${INK2}" stroke-width="1.5">${names[i][0]}</text>`;
    const [gx, gy] = P((a0 + a1) / 2, R - 50); const qc = ton ? '#1A3A4A' : '#F8D8A0'; s += [...names[i][1]].map((b, k) => { const yy = gy + 22 - k * 20; return b === '1' ? `<rect x="${R1(gx - 34)}" y="${R1(yy - 6)}" width="68" height="12" rx="3" fill="${qc}" stroke="${INK2}" stroke-width="2"/>` : `<rect x="${R1(gx - 34)}" y="${R1(yy - 6)}" width="28" height="12" rx="3" fill="${qc}" stroke="${INK2}" stroke-width="2"/><rect x="${R1(gx + 6)}" y="${R1(yy - 6)}" width="28" height="12" rx="3" fill="${qc}" stroke="${INK2}" stroke-width="2"/>`; }).join(''); }
  // vòng ngoài thành lò + đinh tán
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK2}" stroke-width="22"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#9A7A4A" stroke-width="14"/>` + [...Array(24)].map((_, i) => { const [x, y] = P(i * Math.PI / 12, R); return `<circle cx="${R1(x)}" cy="${R1(y)}" r="6" fill="#C8A86A" stroke="${INK2}" stroke-width="2"/>`; }).join('');
  s += `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="#3A2A1E" stroke="${INK2}" stroke-width="6"/><g transform="translate(${cx} ${cy})"><circle r="70" fill="#FFF" stroke="${INK2}" stroke-width="4"/><path d="M0 -70 A70 70 0 0 1 0 70 A35 35 0 0 1 0 0 A35 35 0 0 0 0 -70Z" fill="${INK2}"/><circle cy="-35" r="11" fill="${INK2}"/><circle cy="35" r="11" fill="#FFF"/></g>`;
  s += motes(40, 300, 0, 1320, 1080, '#FFB060', 0.7, 3);
  return s;
}

// ---------- Hạ giới: đồng khô nứt nẻ, núi lửa Hoả Diệm Sơn bốc cháy, trời đỏ cam, khói — o.fresh: lửa vừa bùng (to hơn)
function bg_hoa_diem(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('hdSk', '#C8604A', '#F8C878');
  s += `<circle cx="1500" cy="260" r="90" fill="#FFE0A0" opacity="0.7"/>` + cloudsDrift([[200, 120, 1.3, '#E8A88A'], [900, 90, 1.0, '#E8A88A'], [1400, 140, 1.2, '#E8A88A']], 6);
  s += wxPeaks(620, '#B07A5A', 81, 0.6) + `<rect y="600" width="1920" height="40" fill="#F8C878" opacity="0.4"/>`;
  // dãy núi lửa: núi đỏ có ngọn lửa trên sườn
  const M = [[560, 300, 520], [960, 220, 640], [1380, 320, 500]];
  for (const [x, top, w] of M) { s += `<path d="M${x - w / 2} 760 Q${x - w * 0.3} ${top + 120} ${x - w * 0.12} ${top} L${x + w * 0.1} ${top + 10} Q${x + w * 0.32} ${top + 140} ${x + w / 2} 760Z" fill="#A8402A" stroke="${INK2}" stroke-width="5"/><path d="M${x + w * 0.02} ${top + 6} Q${x + w * 0.3} ${top + 140} ${x + w / 2} 760 H${x + w * 0.1} Q${x + w * 0.15} ${top + 300} ${x + w * 0.02} ${top + 6}Z" fill="#7E2E1E" opacity="0.6"/>`;
    for (let k = 0; k < 5; k++) { const fx = x - w * 0.3 + k * w * 0.15, fy = top + 140 + (k % 2) * 80 + Math.abs(k - 2) * 50; s += flames(fx, fy, (o.fresh ? 0.42 : 0.3) + 0.05 * (k % 2), T, k + x).replace(/<path d="M-120 0 L120 0"[^>]*\/>/, ''); } }
  s += smoke(560, 300, 320, 0.6) + smoke(960, 220, 360, 0.6) + smoke(1380, 320, 300, 0.6);
  // đồng khô nứt nẻ
  s += `<path d="M0 760 Q480 740 960 752 Q1440 740 1920 760 V1080 H0Z" fill="#C89A6A" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 40; i++) { const x = hrnd(i, 5) * 1920, y = 780 + hrnd(i, 6) * 290, k = 0.5 + (y - 760) / 320; s += `<path d="M${R1(x)} ${R1(y)} l${R1(30 * k)} ${R1(8 * k)} l${R1(14 * k)} ${R1(-14 * k)} m${R1(-14 * k)} ${R1(14 * k)} l${R1(10 * k)} ${R1(18 * k)}" stroke="#8A5A3A" stroke-width="${R1(2 + 2 * k)}" fill="none"/>`; }
  s += tdBoulder(260, 960, 0.9, '#A8705A', 3) + tdBoulder(1660, 990, 1.0, '#A8705A', 4);
  s += `<path d="M140 1080 Q150 980 120 920 M140 980 q-30 -20 -50 -10 M1800 1080 Q1790 990 1820 930 M1796 1000 q30 -16 48 -6" stroke="#5A3A2A" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 5; i++) s += `<path d="M0 ${R1(700 + i * 20 + Math.sin(T * 3 + i) * 6)} Q480 ${R1(690 + i * 20)} 960 ${R1(700 + i * 20 + Math.sin(T * 3 + i + 1) * 6)} T1920 ${R1(700 + i * 20)}" stroke="#FFE0B0" stroke-width="3" fill="none" opacity="0.25"/>`;   // hơi nóng
  s += motes(30, 300, 200, 1320, 600, '#FFB060', 0.8, 9);
  return s;
}

// ---------- Lòng bàn tay Phật khổng lồ giữa mây: mặt bàn tay làm nền đứng, vân tay, các ngón dựng lên phía xa như cột, hào quang
function bg_ban_tay(t, o = {}) {
  const T = _T(t), sk = '#F4CA8C', sk2 = '#E2AC6C', nail = '#FBE2C8';
  let s = skyGrad('btSk', '#8EA8E0', '#FCE6C8');
  s += `<circle cx="960" cy="320" r="520" fill="#FFF0C0" opacity="0.28"/>` + tdRays(960, 320, 26, '#FFF2C0', 0.17, T, 1600);
  s += tdCloudSea(600, T, { cols: ['#EEDDEC', '#FAEEF0'], gap: 60, sp: 5, r: 52 });
  // bốn ngón (trỏ → út) đứng ở xa, ngón cái chéo bên trái
  const F = [[720, 140, 150], [960, 90, 160], [1190, 140, 150], [1400, 270, 136]];
  for (const [x, top, w] of F) { const bot = 740, tw = w * 0.86;
    s += `<path d="M${x - w / 2} ${bot} L${x - tw / 2} ${top + tw / 2} A${tw / 2} ${tw / 2} 0 0 1 ${x + tw / 2} ${top + tw / 2} L${x + w / 2} ${bot}Z" fill="${sk}" stroke="${INK2}" stroke-width="5"/>`;
    s += `<path d="M${x + tw * 0.12} ${top + tw * 0.2} A${tw / 2} ${tw / 2} 0 0 1 ${x + tw / 2} ${top + tw / 2} L${x + w / 2} ${bot} H${x + w * 0.16} Z" fill="${sk2}" opacity="0.55"/>`;
    s += `<ellipse cx="${x}" cy="${R1(top + tw * 0.5)}" rx="${R1(tw * 0.3)}" ry="${R1(tw * 0.36)}" fill="${dk(sk, 0.06)}"/><path d="M${R1(x - tw * 0.2)} ${R1(top + tw * 0.32)} q${R1(tw * 0.1)} -${R1(tw * 0.08)} ${R1(tw * 0.22)} -${R1(tw * 0.05)}" stroke="#FFF0D8" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;   // NGỬA tay: thấy đệm ngón, không thấy móng (người dùng 2026-10-14)
    for (const u of [0.38, 0.41, 0.64, 0.67]) { const yy = top + (bot - top) * u; s += `<path d="M${R1(x - w * 0.34)} ${R1(yy)} q${R1(w * 0.34)} 12 ${R1(w * 0.68)} 0" stroke="${dk(sk, 0.25)}" stroke-width="3" fill="none"/>`; }
    s += `<path d="M${x - w / 2 + 6} ${bot} L${x - tw / 2 + 4} ${top + tw / 2}" stroke="#FFE8C0" stroke-width="6" opacity="0.8"/>`; }
  { const w = 150, tw = 128, top = 380, bot = 760; s += `<g transform="rotate(-38 520 760)"><path d="M${520 - w / 2} ${bot} L${520 - tw / 2} ${top + tw / 2} A${tw / 2} ${tw / 2} 0 0 1 ${520 + tw / 2} ${top + tw / 2} L${520 + w / 2} ${bot}Z" fill="${sk}" stroke="${INK2}" stroke-width="5"/><ellipse cx="520" cy="${R1(top + tw * 0.5)}" rx="${R1(tw * 0.3)}" ry="${R1(tw * 0.36)}" fill="${dk(sk, 0.06)}"/>${[0.45, 0.49].map(u => `<path d="M${520 - w * 0.34} ${R1(top + (bot - top) * u)} q${w * 0.34} 12 ${w * 0.68} 0" stroke="${dk(sk, 0.25)}" stroke-width="3" fill="none"/>`).join('')}<path d="M${520 + tw * 0.12} ${top + tw * 0.2} A${tw / 2} ${tw / 2} 0 0 1 ${520 + tw / 2} ${top + tw / 2} L${520 + w / 2} ${bot} H${520 + w * 0.16}Z" fill="${sk2}" opacity="0.5"/></g>`; }
  // lòng bàn tay (nền đứng) + chỉ tay
  s += `<path d="M-40 1080 Q0 780 300 740 Q960 680 1620 740 Q1920 780 1960 1080Z" fill="${sk}" stroke="${INK2}" stroke-width="6"/><path d="M-40 1080 Q0 780 300 740 Q960 680 1620 740 Q1920 780 1960 1080" stroke="#FFE2A8" stroke-width="18" fill="none" opacity="0.5"/>`;
  s += `<path d="M180 840 Q700 770 1340 820 M260 930 Q760 870 1560 900 M780 1080 Q840 900 1140 780" stroke="${dk(sk, 0.3)}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M520 980 Q700 960 900 1000 M1320 970 q120 -10 220 20 M460 880 q40 -20 90 -10 M1240 860 q60 -10 120 4" stroke="${dk(sk, 0.18)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 14; i++) { const x = 200 + hrnd(i, 9) * 1500, y = 800 + hrnd(i, 10) * 250; s += `<path d="M${R1(x)} ${R1(y)} q14 -4 28 0" stroke="${dk(sk, 0.12)}" stroke-width="2.5" fill="none"/>`; }
  s += tdPuffs([[-40, 1000, 110], [80, 1060, 90], [1960, 990, 120], [1840, 1060, 90]], '#FFF8F0', 4, { curl: true });
  s += motes(40, 200, 100, 1520, 700, '#FFF2C0', 0.7, 4);
  return s;
}

// ---------- Năm cột hồng khổng lồ chống trời trong mây (con khỉ tưởng là tận cùng trời đất) — cột giữa trơn để viết chữ
function bg_nam_cot(t, o = {}) {
  const T = _T(t), pc = '#F2B8A0';
  let s = skyGrad('ncSk', '#6E7EC4', '#F8DCE0');
  s += `<ellipse cx="960" cy="420" rx="900" ry="420" fill="#FFE8C0" opacity="0.35"/>` + tdRays(960, 300, 24, '#FFF0D0', 0.14, T, 1500);
  s += tdCloudSea(470, T, { cols: ['#C8B8DC', '#D8C8E4'], gap: 50, sp: 3, r: 40 });
  const C = [[300, 120, 0.62], [620, 150, 0.88], [960, 176, 1.3], [1300, 150, 0.88], [1620, 120, 0.62]];
  for (const [x, w, k] of C) { const c = k > 1 ? pc : mixC(pc, '#C8B8D8', 0.3 * (1.3 - k)), H = R1(840 + 60 * k);
    s += `<g opacity="${f2(0.72 + 0.28 * k / 1.3)}"><rect x="${x - w / 2}" y="-20" width="${w}" height="${H}" fill="${c}" stroke="${INK2}" stroke-width="${R1(4 + 2 * k)}"/><rect x="${x + w * 0.12}" y="-20" width="${w * 0.38}" height="${H}" fill="${dk(c, 0.12)}" opacity="0.7"/><rect x="${x - w * 0.38}" y="-20" width="${w * 0.1}" height="${H}" fill="#FFF2EA" opacity="0.7"/>`;
    for (let j = 0; j < 7; j++) { const xx = x - w * 0.3 + j * w * 0.1; s += `<path d="M${R1(xx)} 0 V${H}" stroke="${dk(c, 0.08)}" stroke-width="2" opacity="0.6"/>`; }
    s += [0.22, 0.26, 0.5, 0.54].map(u => `<path d="M${R1(x - w * 0.46)} ${R1(820 * u)} q${R1(w * 0.46)} 16 ${R1(w * 0.92)} 0" stroke="${dk(c, 0.24)}" stroke-width="${u % 0.04 < 0.03 ? 4 : 3}" fill="none" opacity="0.75"/>`).join('');
    s += `</g>`;
    // mây quấn thân cột
    s += tdPuffs([[x - w * 0.6, 640 + 20 * k, 30 * k + 10], [x - w * 0.2, 630 + 20 * k, 36 * k + 12], [x + w * 0.3, 640 + 20 * k, 32 * k + 10], [x + w * 0.7, 650 + 20 * k, 26 * k + 8]], '#FBEFF4', 3); }
  s += wxMist(380, 0.3, '#FFF4F4', T) + wxMist(560, 0.35, '#FFF4F4', T);
  s += tdCloudSea(800, T, { cols: ['#EADCEE', '#F6EAF2', '#FFF8F4'], gap: 80, sp: 6, r: 58 });
  s += [[180, 760, 1.0], [1740, 780, 1.0]].map(([x, y, sc], i) => tdXiang(x + Math.sin(T * 0.5 + i) * 24, y, sc, '#FFFFFF', i === 1)).join('');
  for (let i = 0; i < 30; i++) { const x = hrnd(i, 3) * 1920, y = 60 + hrnd(i, 4) * 700, r = 3 + hrnd(i, 5) * 5, tw = 0.3 + 0.7 * Math.abs(Math.sin(T * 1.6 + i)); s += `<path d="M${R1(x)} ${R1(y - r * 2)} L${R1(x + r * 0.5)} ${R1(y - r * 0.5)} L${R1(x + r * 2)} ${R1(y)} L${R1(x + r * 0.5)} ${R1(y + r * 0.5)} L${R1(x)} ${R1(y + r * 2)} L${R1(x - r * 0.5)} ${R1(y + r * 0.5)} L${R1(x - r * 2)} ${R1(y)} L${R1(x - r * 0.5)} ${R1(y - r * 0.5)}Z" fill="#FFF6D8" opacity="${f2(tw)}"/>`; }
  return s;
}

// sóng biển cách điệu (ngọn sóng cuộn) — hàng sóng tại y, biên độ a, màu c
function tdWaveRow(y, a, c, T, seed = 1, sp = 30, step = 220) {
  const off = (T * sp) % step; let d = `M-300 1080 V${y}`;
  for (let x = -300 - off; x < 2200; x += step) d += ` Q${R1(x + step * 0.25)} ${R1(y - a)} ${R1(x + step * 0.55)} ${R1(y - a * 0.7)} q${R1(step * 0.12)} ${R1(-a * 0.2)} ${R1(step * 0.1)} ${R1(a * 0.25)} Q${R1(x + step * 0.8)} ${R1(y + a * 0.15)} ${R1(x + step)} ${y}`;
  d += ' V1080Z';
  let s = `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let x = -300 - off; x < 2200; x += step) s += `<path d="M${R1(x + step * 0.3)} ${R1(y - a * 0.6)} Q${R1(x + step * 0.5)} ${R1(y - a * 0.95)} ${R1(x + step * 0.62)} ${R1(y - a * 0.62)}" stroke="#FFFFFF" stroke-width="${R1(3 + a * 0.06)}" fill="none" stroke-linecap="round" opacity="0.85"/><path d="M${R1(x + step * 0.2)} ${R1(y + a * 0.5)} q${R1(step * 0.15)} -8 ${R1(step * 0.3)} 0" stroke="${dk(c, 0.18)}" stroke-width="3" fill="none"/>`;
  return s;
}

function tdGull(x, y, s = 1, T = AT_()) { const w = Math.sin(T * 6 + x) * 8; return `<path d="M${R1(x - 22 * s)} ${R1(y - (8 + w) * s)} Q${R1(x - 8 * s)} ${R1(y - 4 * s)} ${R1(x)} ${R1(y)} Q${R1(x + 8 * s)} ${R1(y - 4 * s)} ${R1(x + 22 * s)} ${R1(y - (8 + w) * s)}" stroke="${INK2}" stroke-width="${R1(3.5 * s)}" fill="none" stroke-linecap="round"/>`; }

// ---------- Biển khơi: chân trời, đảo xa, nhiều lớp sóng cuộn, mòng biển (bè gỗ do cảnh vẽ)
function bg_bien(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('bnSk', '#7EB8E6', '#FBEFD8');
  s += `<circle cx="1480" cy="200" r="72" fill="#FFF0B8"/><circle cx="1480" cy="200" r="160" fill="#FFF0B8" opacity="0.22"/>` + tdRays(1480, 200, 14, '#FFF2C8', 0.1, T, 900);
  s += cloudsDrift([[160, 140, 1.3, '#FFF8EE'], [700, 90, 0.9, '#FFF8EE'], [1180, 170, 1.1, '#FFF8EE'], [1800, 110, 1.0, '#FFF8EE']], 8);
  // đảo xa có vách + cây
  s += tdGreenPeak(230, 452, 300, 110, '#8EAEA0', 71, { cliff: false, dots: 8, sw: 3 }) + tdGreenPeak(420, 452, 140, 60, '#9AB8AA', 72, { cliff: false, dots: 4, sw: 3 }) + tdGreenPeak(1700, 452, 220, 90, '#8EAEA0', 73, { cliff: false, dots: 6, sw: 3 });
  s += `<rect y="450" width="1920" height="630" fill="#74B0D0"/><path d="M0 450 H1920" stroke="${INK2}" stroke-width="3"/>`;
  // vệt nắng lấp lánh dưới mặt trời
  for (let i = 0; i < 26; i++) { const y = 470 + hrnd(i, 4) * 200, x = 1480 + (hrnd(i, 5) - 0.5) * (80 + (y - 450) * 1.4), a = 0.3 + 0.7 * Math.abs(Math.sin(T * 3 + i)); s += `<path d="M${R1(x - 16)} ${R1(y)} h32" stroke="#FFF6D0" stroke-width="4" stroke-linecap="round" opacity="${f2(a)}"/>`; }
  s += tdWaveRow(560, 26, '#6AA8C8', T, 1, 16, 160) + tdWaveRow(650, 38, '#5E9EC0', T, 2, 22, 210) + tdWaveRow(760, 54, '#5292B6', T, 3, 30, 280) + tdWaveRow(900, 74, '#4886AC', T, 4, 40, 360) + tdWaveRow(1050, 96, '#3E7AA2', T, 5, 52, 460);
  // bọt tung trên đỉnh sóng
  for (let i = 0; i < 40; i++) { const y = 600 + hrnd(i, 8) * 440, x = (hrnd(i, 9) * 2000 + T * (20 + y * 0.03)) % 2000 - 40, r = 2 + (y - 600) * 0.012 + hrnd(i, 10) * 3; s += `<circle cx="${R1(x)}" cy="${R1(y + Math.sin(T * 3 + i) * 6)}" r="${R1(r)}" fill="#FFFFFF" opacity="0.8"/>`; }
  // sóng cuộn lớn hai góc tiền cảnh
  for (const sd of [-1, 1]) { const X = (v) => sd < 0 ? v : 1920 - v, ph = Math.sin(T * 1.5 + sd) * 10;
    s += `<path d="M${X(-20)} 1080 V${R1(900 + ph)} Q${X(80)} ${R1(820 + ph)} ${X(200)} ${R1(830 + ph)} Q${X(300)} ${R1(850 + ph)} ${X(290)} ${R1(920 + ph)} Q${X(250)} ${R1(890 + ph)} ${X(220)} ${R1(910 + ph)} Q${X(200)} ${R1(960 + ph)} ${X(260)} ${R1(980 + ph)} Q${X(330)} 1000 ${X(420)} 1080Z" fill="#3A729A" stroke="${INK2}" stroke-width="5"/>`;
    s += `<path d="M${X(40)} ${R1(880 + ph)} Q${X(120)} ${R1(840 + ph)} ${X(200)} ${R1(846 + ph)} Q${X(260)} ${R1(856 + ph)} ${X(270)} ${R1(890 + ph)}" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/>` + tdPuffs([[X(280), 900 + ph, 16], [X(300), 884 + ph, 12], [X(262), 884 + ph, 10]], '#FFFFFF', 2); }
  s += tdGull(500, 260, 1.3, T) + tdGull(560, 290, 1.0, T) + tdGull(610, 250, 0.8, T) + tdGull(1200, 330, 1.0, T) + tdGull(1100, 300, 0.7, T);
  return s;
}

// ---------- Phố chợ loài người (cổ đại): đường đất phối cảnh, nhà mái ngói hai bên có biển hiệu, sạp hàng, dây đèn lồng, người xa — o.fled: chợ vỡ (đồ đổ, không người); o.capital: kinh thành (cổng thành ở cuối đường)
function tdShop(x, g, w, h, sd, o = {}) {
  // nhà mặt phố nhìn chéo: sd = -1 bên trái (mặt quay sang phải), 1 bên phải
  const c = o.wall || '#E8D8B8', roof = o.roof || '#5A5A5E';
  const fx = x, bx = x - sd * w * 0.55, top = g - h, k = 0.82;
  let s = `<path d="M${fx} ${g} V${top} L${bx} ${R1(top + (g - top) * (1 - k) * 0.5 + 10)} V${R1(g - 18)}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  // cửa hàng mở + quầy
  const d0 = fx - sd * w * 0.1, d1 = fx - sd * w * 0.42;
  s += `<path d="M${R1(d0)} ${R1(g - 4)} V${R1(top + h * 0.35)} L${R1(d1)} ${R1(top + h * 0.37 + 6)} V${R1(g - 14)}Z" fill="#5A3A26" stroke="${INK2}" stroke-width="3"/>`;
  s += `<path d="M${R1(d0)} ${R1(g - h * 0.25)} L${R1(d1)} ${R1(g - h * 0.25 - 4)} L${R1(d1 + sd * 20)} ${R1(g - h * 0.2)} L${R1(d0 + sd * 26)} ${R1(g - h * 0.2 + 4)}Z" fill="#8A5A34" stroke="${INK2}" stroke-width="3"/>`;
  // mái
  s += `<path d="M${R1(fx + sd * 40)} ${R1(top + 20)} L${R1(fx + sd * 10)} ${R1(top - h * 0.28)} L${R1(bx - sd * 10)} ${R1(top - h * 0.2 + 14)} L${R1(bx - sd * 30)} ${R1(top + 26)}Z" fill="${roof}" stroke="${INK2}" stroke-width="4"/>` + [0.25, 0.5, 0.75].map(u => `<path d="M${R1(fx + sd * 25 + (bx - fx - sd * 40) * u)} ${R1(top + 22 + 6 * u)} L${R1(fx + sd * 10 + (bx - fx - sd * 20) * u)} ${R1(top - h * 0.28 + 6 * u + h * 0.08 * u)}" stroke="${dk(roof, 0.2)}" stroke-width="3"/>`).join('');
  // biển hiệu treo
  if (o.sign) { const fs = Math.max(14, h * 0.085), bw = o.sign.length * fs * 0.62 + fs, bh = fs * 1.6, sx = bx - sd * (bw / 2 + 8), sy = top + h * 0.14;
    s += `<path d="M${R1(bx)} ${R1(sy - 8)} h${R1(-sd * (bw + 16))}" stroke="${INK2}" stroke-width="6"/><path d="M${R1(sx - bw * 0.35)} ${R1(sy - 8)} v8 M${R1(sx + bw * 0.35)} ${R1(sy - 8)} v8" stroke="${INK2}" stroke-width="3"/><rect x="${R1(sx - bw / 2)}" y="${R1(sy)}" width="${R1(bw)}" height="${R1(bh)}" rx="4" fill="#2A2A30" stroke="${tdC.gold}" stroke-width="3"/><text x="${R1(sx)}" y="${R1(sy + bh * 0.7)}" font-family="${FH}" font-size="${R1(fs)}" fill="#F2D16B" text-anchor="middle">${o.sign}</text>`; }
  // cờ quán (rượu) cắm chéo
  if (o.flag) s += `<path d="M${R1(fx + sd * 10)} ${R1(top + 40)} l${sd * 90} -60" stroke="${INK2}" stroke-width="6"/><path d="M${R1(fx + sd * 60)} ${R1(top + 8)} l${sd * 40} -26 l${sd * 14} 70 l${-sd * 40} 26Z" fill="#E8D8B8" stroke="${INK2}" stroke-width="3"/><text x="${R1(fx + sd * 86)}" y="${R1(top + 30)}" font-family="${FH}" font-size="15" fill="#C0392B" text-anchor="middle" transform="rotate(${sd * -30} ${R1(fx + sd * 86)} ${R1(top + 30)})">${o.flag}</text>`;
  return s;
}

function bg_cho(t, o = {}) {
  const T = _T(t), fled = !!o.fled;
  let s = wxSky(t, { c1: '#AACCE2', c2: '#F2EAD8', id: 'chSk' });
  s += wxPeaks(470, '#A6B2BC', 91, 0.5) + farTrees(16, 470, '#7A9A6A', 92, 760, 400);
  // cổng thành cuối đường
  if (o.capital !== false) s += `<rect x="760" y="300" width="400" height="190" fill="#9A9488" stroke="${INK2}" stroke-width="4"/>` + [...Array(10)].map((_, i) => `<rect x="${762 + i * 40}" y="284" width="26" height="18" fill="#9A9488" stroke="${INK2}" stroke-width="2.5"/>`).join('') + `<path d="M900 490 V420 A60 60 0 0 1 1020 420 V490Z" fill="#3A2A22" stroke="${INK2}" stroke-width="4"/><rect x="820" y="230" width="280" height="56" fill="#B03A2E" stroke="${INK2}" stroke-width="3"/>` + wxRoof(960, 230, 380, 70, { c: '#4E4E54', tip: '#C9A227' });
  // đường đất phối cảnh
  s += `<path d="M0 490 H1920 V1080 H0Z" fill="#C8B488" stroke="${INK2}" stroke-width="3"/><path d="M860 490 H1060 L1500 1080 H420Z" fill="#D8C69A"/>` + pebbles(40, 300, 520, 1320, 540, '#A8946C', 3);
  for (let i = 0; i < 8; i++) { const y = 520 + i * i * 9; s += `<path d="M${R1(880 - i * 50)} ${y} q30 6 60 0 M${R1(1000 + i * 50)} ${y + 10} q30 6 60 0" stroke="#B8A47A" stroke-width="3" fill="none"/>`; }
  // dãy nhà hai bên (xa → gần)
  const L = [[700, 500, 180, 170, 'QUÁN RƯỢU', 1], [560, 560, 240, 230, 'TRÀ'], [380, 660, 320, 320, 'VẢI LỤA'], [130, 820, 420, 430, 'THUỐC BẮC']], Rr = [[1220, 500, 180, 170, 'CƠM'], [1360, 560, 240, 230, 'GẠO', 1], [1540, 660, 320, 320, 'DẦU ĐÈN'], [1790, 820, 420, 430, 'CẦM ĐỒ']];
  for (const [x, g, w, h, sg, fl] of L) s += tdShop(x, g, w, h, -1, { sign: sg, flag: fl ? 'RƯỢU' : '', wall: '#E8D8B8' });
  for (const [x, g, w, h, sg, fl] of Rr) s += tdShop(x, g, w, h, 1, { sign: sg, flag: fl ? 'RƯỢU' : '', wall: '#E2D2B0' });
  // dây đèn lồng ngang đường
  for (const [y, xa, xb] of [[380, 700, 1220], [440, 560, 1360]]) { s += `<path d="M${xa} ${y} Q960 ${y + 50} ${xb} ${y}" stroke="${INK2}" stroke-width="3" fill="none"/>`; for (let k = 1; k < 6; k++) { const u = k / 6, x = xa + (xb - xa) * u, yy = y + 50 * 4 * u * (1 - u) * 0.5 + 18; s += wxLantern(x, yy, 0.45, k % 2 ? '#C0392B' : '#E2A23A', T); } }
  // sạp hàng: rau, vải, gốm
  const stall = (x, g, sc, kind, tip) => { let b = `<path d="M-120 0 V-90 M120 0 V-90" stroke="${INK2}" stroke-width="8"/><rect x="-140" y="-100" width="280" height="24" fill="#8A5A34" stroke="${INK2}" stroke-width="3"/><path d="M-160 -170 L160 -170 L140 -230 L-140 -230Z" fill="${kind === 1 ? '#C8564A' : '#5A8AA6'}" stroke="${INK2}" stroke-width="4"/>` + [...Array(7)].map((_, i) => `<path d="M${-160 + i * 46} -170 l46 0 l0 18 q-23 12 -46 0Z" fill="${i % 2 ? '#F2E8D8' : (kind === 1 ? '#C8564A' : '#5A8AA6')}" stroke="${INK2}" stroke-width="2.5"/>`).join('') + `<path d="M-150 -170 V-100 M150 -170 V-100" stroke="${INK2}" stroke-width="6"/>`;
    if (kind === 1) b += [...Array(9)].map((_, i) => `<circle cx="${-110 + i * 27}" cy="-112" r="13" fill="${['#8AB84A', '#E8564A', '#F2C14E'][i % 3]}" stroke="${INK2}" stroke-width="2"/>`).join('');
    else b += [...Array(4)].map((_, i) => `<path d="M${-110 + i * 60} -100 Q${-110 + i * 60} -140 ${-90 + i * 60} -140 Q${-70 + i * 60} -140 ${-70 + i * 60} -100Z" fill="${['#B8704A', '#D8CCB8', '#7A8AA6', '#C8A86A'][i]}" stroke="${INK2}" stroke-width="2.5"/>`).join('');
    return _g(x, g, sc, b, tip ? 14 : 0); };
  s += stall(560, 940, 0.9, 1, fled) + stall(1380, 960, 0.95, 2, fled);
  // người xa (bóng) hoặc đồ đổ vỡ
  if (!fled) for (let i = 0; i < 8; i++) { const x = 820 + hrnd(i, 5) * 280, y = 560 + hrnd(i, 6) * 60, h = 70 + (y - 540) * 0.8; s += `<g opacity="0.55"><path d="M${R1(x - h * 0.16)} ${R1(y)} Q${R1(x - h * 0.18)} ${R1(y - h * 0.6)} ${R1(x)} ${R1(y - h * 0.68)} Q${R1(x + h * 0.18)} ${R1(y - h * 0.6)} ${R1(x + h * 0.16)} ${R1(y)}Z" fill="${['#5A6A8A', '#8A5A4A', '#6A7A5A'][i % 3]}"/><circle cx="${R1(x)}" cy="${R1(y - h * 0.78)}" r="${R1(h * 0.11)}" fill="#6A5A50"/></g>`; }
  else s += [[760, 1010, 30], [1180, 1030, -20], [980, 990, 60]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-50 0 Q-60 -50 0 -54 Q60 -50 50 0Z" fill="#C89A5A" stroke="${INK2}" stroke-width="4"/></g>`).join('') + [...Array(10)].map((_, i) => `<circle cx="${R1(700 + hrnd(i, 8) * 560)}" cy="${R1(1000 + hrnd(i, 9) * 60)}" r="11" fill="${['#8AB84A', '#E8564A', '#F2C14E'][i % 3]}" stroke="${INK2}" stroke-width="2"/>`).join('') + `<path d="M420 980 q40 -30 120 -10 q60 20 100 -6" stroke="#5A8AA6" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  return s;
}

// ---------- Đường rừng núi: rừng thông nhiều lớp, đường mòn lên núi, gốc cây có rìu, bó củi, suối nhỏ — o.dust: bụi mù (con khỉ chạy ngang)
function bg_rung(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A8CCE0', c2: '#F0EEDC', id: 'rgSk' });
  s += wxPeaks(420, '#A2B0BC', 101, 1.1) + wxMist(400, 0.5) + tdCrag(1500, 560, 200, 380, '#9AA2A8', 102, { nt: 3, capC: '#7A9A6A' });
  s += rollingHills(560, '#8EA87A', '#7E9A6A', '#6E8A5A');
  s += `<path d="M0 700 Q480 670 960 690 Q1440 670 1920 700 V1080 H0Z" fill="#8DB05E" stroke="${INK2}" stroke-width="4"/>`;
  s += farTrees(30, 540, '#5E7A5A', 103) + farTrees(26, 610, '#4E6E4E', 104);
  // đường mòn ngoằn ngoèo
  s += `<path d="M1060 560 Q1000 600 1040 640 Q1120 700 980 760 Q820 830 900 920 Q980 1000 860 1080 H1160 Q1260 990 1140 910 Q1060 840 1180 780 Q1300 720 1140 650 Q1080 610 1100 560Z" fill="#C8B488" stroke="${INK2}" stroke-width="3.5"/>` + pebbles(24, 860, 640, 380, 440, '#A8946C', 5);
  // thông lớn hai bên + gốc cây
  s += pineD(160, 960, 1.3, '#3E5E44') + pineD(380, 900, 0.9, '#4E6E4A') + pineD(620, 760, 0.6, '#4E6E4A') + pineD(1760, 980, 1.35, '#3E5E44') + pineD(1530, 900, 0.95, '#4E6E4A') + pineD(1330, 760, 0.6, '#4E6E4A');
  s += treeD(760, 680, 0.45, { c: '#5E8A44' }) + treeD(1260, 690, 0.42, { c: '#5E8A44' });
  s += `<path d="M560 980 L566 920 H664 L670 980Z" fill="#8A6A44" stroke="${INK2}" stroke-width="4"/><ellipse cx="615" cy="920" rx="50" ry="16" fill="#C8A878" stroke="${INK2}" stroke-width="4"/><ellipse cx="615" cy="920" rx="30" ry="9" fill="none" stroke="#A88858" stroke-width="3"/><path d="M590 920 L640 860" stroke="${INK2}" stroke-width="9"/><path d="M590 920 L640 860" stroke="#8A6A3A" stroke-width="5"/><path d="M628 848 l30 -6 l-8 34Z" fill="#C8CCD0" stroke="${INK2}" stroke-width="3"/>`;   // gốc cây + rìu
  s += `<g transform="translate(1340 980)">${[...Array(7)].map((_, i) => `<path d="M-90 ${-i * 10 - 10} L90 ${-i * 12 - 20}" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M-90 ${-i * 10 - 10} L90 ${-i * 12 - 20}" stroke="${['#9A7A54', '#8A6A44', '#A88A5A'][i % 3]}" stroke-width="11" stroke-linecap="round"/>`).join('')}<path d="M-40 0 Q-50 -90 0 -96 Q50 -90 40 0" stroke="#6E5A3A" stroke-width="6" fill="none"/></g>`;   // bó củi
  s += bushD(300, 1040, 0.9, '#5E8A4A') + bushD(1640, 1050, 0.95, '#5E8A4A') + tdBoulder(470, 1060, 0.6, '#9A948A', 6);
  s += vGrass(160, 0, 640, 1920, 440, '#5E8A3A', 105, { c2: '#86A85A', skip: (x, y) => x > 880 && x < 1160 }) + flowers(30, 0, 700, 1920, 380, 106);
  if (o.dust) s += tdPuffs([[700, 940, 60], [800, 900, 80], [920, 920, 70], [1040, 950, 60]], '#E8DCC0', 3);
  s += birds(220, 6);
  return s;
}

// ---------- Trời đêm: trăng nghiêng, sao, dãy núi bóng tối, sương — dùng cho thẻ chữ 心
function bg_dem(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('dmSk', '#141A44', '#4A3E72');
  s += `<path d="M-100 700 Q500 300 1000 260 Q1500 220 2020 -40 L2020 120 Q1500 380 1000 420 Q500 460 -100 860Z" fill="#8A7AC8" opacity="0.18"/><path d="M-100 740 Q500 340 1000 320 Q1500 300 2020 40" stroke="#C8B8F0" stroke-width="40" fill="none" opacity="0.12"/>`;
  s += starsD(160, 760, 11);
  for (let i = 0; i < 12; i++) { const x = hrnd(i, 21) * 1920, y = 40 + hrnd(i, 22) * 520, r = 5 + hrnd(i, 23) * 6, tw = 0.4 + 0.6 * Math.abs(Math.sin(T * 1.2 + i * 2)); s += `<path d="M${R1(x)} ${R1(y - r * 2)} L${R1(x + r * 0.4)} ${R1(y - r * 0.4)} L${R1(x + r * 2)} ${R1(y)} L${R1(x + r * 0.4)} ${R1(y + r * 0.4)} L${R1(x)} ${R1(y + r * 2)} L${R1(x - r * 0.4)} ${R1(y + r * 0.4)} L${R1(x - r * 2)} ${R1(y)} L${R1(x - r * 0.4)} ${R1(y - r * 0.4)}Z" fill="#FFF6D8" opacity="${f2(tw)}"/>`; }
  s += `<circle cx="700" cy="330" r="240" fill="#FFF0C0" opacity="0.07"/><g transform="translate(700 330) rotate(-35)"><path d="M0 -150 A150 150 0 1 1 0 150 A110 150 0 1 0 0 -150Z" fill="#FFF0C0" stroke="${INK2}" stroke-width="4"/><circle cx="90" cy="-40" r="12" fill="#E8D8A0" opacity="0.6"/><circle cx="110" cy="40" r="8" fill="#E8D8A0" opacity="0.6"/></g>`;
  s += wxPeaks(760, '#3E3E66', 111, 0.9) + wxMist(740, 0.22, '#9A9AC8', T);
  // núi giữa có chùa nhỏ sáng đèn + thông
  s += tdGreenPeak(1400, 900, 760, 330, '#2E3458', 113, { cliff: false, dots: 18, sw: 3.5 });
  s += `<g transform="translate(1480 610)"><rect x="-50" y="-40" width="100" height="40" fill="#3A3048" stroke="${INK2}" stroke-width="3"/><rect x="-12" y="-30" width="24" height="24" fill="#FFD27A"/><circle cx="0" cy="-18" r="50" fill="#FFD27A" opacity="0.18"/>${wxRoof(0, -40, 150, 40, { c: '#22243A', tip: '#5A5A4A', up: 0.25 })}</g>`;
  s += tdGreenPeak(380, 940, 900, 280, '#262A48', 114, { cliff: false, dots: 14, sw: 3.5 });
  for (let i = 0; i < 9; i++) s += pineD(120 + i * 210 + hrnd(i, 5) * 60, 1000 + hrnd(i, 6) * 40, 0.4 + hrnd(i, 7) * 0.2, '#1A1E34');
  s += `<path d="M0 1000 Q480 970 960 990 Q1440 970 1920 1000 V1080 H0Z" fill="#14182C"/>` + wxMist(960, 0.18, '#8A8AB8', T);
  s += motes(22, 0, 760, 1920, 300, '#D8FF9A', 0.8, 9);
  return s;
}

// ---------- Động Tà Nguyệt Tam Tinh: đạo quán trong núi — cổng có biển, điện chính với cửa giữa, đài giảng bên trái, thông, hạc đá, sân đá
function bg_tam_tinh(t, o = {}) {
  const T = _T(t), night = !!o.night;
  let s = wxSky(t, { c1: night ? '#2A3060' : '#A8C8DC', c2: night ? '#5A5A8A' : '#EEF0E2', id: 'ttSk', birds: !night });
  if (night) s += starsD(60, 400, 4);
  s += wxPeaks(430, night ? '#4A4E72' : '#9AAAB4', 121, 1.1) + wxMist(420, night ? 0.2 : 0.5) + tdCrag(260, 600, 260, 460, night ? '#5A5E7A' : '#8E9888', 122, { nt: 4 }) + tdCrag(1700, 600, 280, 520, night ? '#5A5E7A' : '#8E9888', 123, { nt: 4 });
  // điện chính (cửa giữa đóng/mở)
  s += wxTempleFront(960, 640, 760, { name: '', roof: '#3E5A4E', col: '#8E3A2A', wall: '#B8A07A', base: '#C8C0B0', h: 230, cols: 5, lanterns: false });
  s += `<rect x="740" y="300" width="440" height="56" rx="6" fill="#2A2A30" stroke="#C9A227" stroke-width="5"/><text x="960" y="340" font-family="${FH}" font-size="30" fill="#E4B83A" text-anchor="middle">ĐỘNG TÀ NGUYỆT TAM TINH</text>`;
  // sân đá
  s += wxPaving(640, night ? '#8A8AA0' : '#D8D0BC', { vy: 470 });
  // đài giảng bên trái: bệ đá ba bậc, bàn hương, bồ đoàn
  s += `<path d="M120 900 L160 760 H560 L600 900Z" fill="#B8B0A0" stroke="${INK2}" stroke-width="5"/><rect x="120" y="900" width="480" height="40" fill="#9A9284" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${300 - i * 10}" y="${940 + i * 22}" width="${120 + i * 20}" height="22" fill="#A8A090" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += `<ellipse cx="360" cy="800" rx="80" ry="22" fill="#C9A227" stroke="${INK2}" stroke-width="4"/><rect x="430" y="740" width="120" height="16" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/><path d="M440 756 v30 M540 756 v30" stroke="${INK2}" stroke-width="6"/><rect x="474" y="716" width="34" height="24" fill="#8A7440" stroke="${INK2}" stroke-width="3"/>` + smoke(491, 716, 140, 0.45) + `<path d="M150 760 V560 M570 760 V560" stroke="${INK2}" stroke-width="12"/><path d="M150 760 V560 M570 760 V560" stroke="#8E3A2A" stroke-width="7"/>` + wxRoof(360, 560, 520, 80, { c: '#3E5A4E', tip: '#C9A227' });
  // biển núi bên phải + hạc đá + thông + đèn đá
  s += `<rect x="1410" y="760" width="170" height="190" rx="8" fill="#C8C0B0" stroke="${INK2}" stroke-width="4"/><path d="M1398 760 Q1495 716 1592 760Z" fill="#9A9284" stroke="${INK2}" stroke-width="3"/><g font-family="${FH}" font-size="22" fill="#3A3A40" text-anchor="middle">${['NÚI', 'LINH ĐÀI', 'PHƯƠNG THỐN'].map((w, i) => `<text x="1495" y="${812 + i * 40}">${w}</text>`).join('')}</g><rect x="1396" y="946" width="198" height="20" fill="#9A9284" stroke="${INK2}" stroke-width="3"/>`;
  s += `<g transform="translate(1680 960)"><rect x="-60" y="-30" width="120" height="30" fill="#B8B0A0" stroke="${INK2}" stroke-width="4"/><path d="M0 -30 V-110" stroke="${INK2}" stroke-width="8"/><path d="M-40 -150 Q-10 -190 40 -150 Q20 -110 -40 -150Z" fill="#E8E4DA" stroke="${INK2}" stroke-width="4"/><path d="M30 -160 Q40 -230 20 -260 l24 -6" stroke="${INK2}" stroke-width="6" fill="none"/><circle cx="22" cy="-262" r="6" fill="#C0392B"/></g>`;
  s += pineD(70, 1000, 1.25, '#3E5E44') + pineD(1860, 1010, 1.2, '#3E5E44') + wxStoneLamp(760, 760, 0.7) + wxStoneLamp(1160, 760, 0.7) + wxCauldron(960, 820, 0.6);
  s += wxBamboo(1300, 700, 300, 0.9, T) + wxBamboo(1340, 700, 340, 0.9, T) + wxBamboo(640, 700, 280, 0.9, T);
  s += vGrass(60, 0, 980, 500, 100, '#6E8A4A', 124, { c2: '#86A060' }) + vGrass(60, 1420, 980, 500, 100, '#6E8A4A', 125, { c2: '#86A060' });
  if (night) s += `<circle cx="1600" cy="160" r="60" fill="#FFF0C0"/><rect width="1920" height="1080" fill="#1A1A40" opacity="0.25"/>`;
  return s;
}

// ---------- Cửa sau đạo quán dưới trăng (đêm canh ba): tường hậu, cửa gỗ hé có ánh đèn, bậc đá, trúc, trăng tròn
function bg_cua_sau(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('csSk', '#1E2858', '#4E4A7E') + starsD(90, 500, 13);
  s += `<circle cx="1480" cy="200" r="90" fill="#FFF2C8"/><circle cx="1480" cy="200" r="190" fill="#FFF2C8" opacity="0.12"/><path d="M1440 180 q20 -10 30 6 M1500 230 q14 -4 20 8" stroke="#E8D8A8" stroke-width="4" fill="none"/>`;
  s += wxPeaks(560, '#3A3E62', 131, 0.8);
  // tường hậu điện + mái
  s += `<rect x="0" y="380" width="1920" height="460" fill="#7A6E78" stroke="${INK2}" stroke-width="5"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 26; c++) s += `<rect x="${c * 76 + (r % 2) * 38 - 38}" y="${400 + r * 36}" width="72" height="32" fill="none" stroke="#6A5E68" stroke-width="2.5"/>`;
  s += wxRoof(960, 380, 2100, 110, { c: '#2E3A44', tip: '#8A8A6A', up: 0.3 });
  // cửa sau: cánh hé, ánh đèn vàng hắt ra
  s += `<rect x="820" y="470" width="280" height="370" fill="#3A2A20" stroke="${INK2}" stroke-width="6"/><rect x="960" y="480" width="128" height="350" fill="#FFD27A"/><path d="M960 480 L900 470 V850 L960 830Z" fill="#6B4A30" stroke="${INK2}" stroke-width="4"/>` + [520, 600, 680, 760].map(y => `<path d="M906 ${y} l50 4" stroke="#4A3220" stroke-width="4"/>`).join('');
  s += `<rect x="830" y="482" width="122" height="350" fill="#6B4A30" stroke="${INK2}" stroke-width="4"/>` + [540, 640, 740].map(y => `<path d="M836 ${y} h110" stroke="#4A3220" stroke-width="5"/>`).join('') + `<circle cx="938" cy="660" r="7" fill="#C9A227" stroke="${INK2}" stroke-width="2"/>`;
  s += `<path d="M1000 840 L1200 1080 H860 L960 840Z" fill="#FFD27A" opacity="0.28"/><rect x="800" y="440" width="320" height="34" fill="#4A3A30" stroke="${INK2}" stroke-width="4"/>` + wxLantern(1180, 520, 0.7, '#C0392B', T);
  // bậc đá + sân
  s += `<path d="M0 840 H1920 V1080 H0Z" fill="#6E6A82" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${780 - i * 30}" y="${840 + i * 26}" width="${360 + i * 60}" height="26" fill="${i % 2 ? '#8A86A0' : '#7E7A94'}" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += wxBamboo(160, 1000, 640, 1, T, '#5E8A5A') + wxBamboo(240, 1000, 560, 1, T, '#6E9A5A') + wxBamboo(1700, 1000, 640, 1, T, '#5E8A5A') + wxBamboo(1790, 1000, 520, 1, T, '#6E9A5A');
  s += bushD(420, 1000, 0.8, '#3E5E4A') + bushD(1500, 1010, 0.8, '#3E5E4A') + wxStoneLamp(600, 980, 0.6);
  s += `<rect width="1920" height="1080" fill="#1A1A48" opacity="0.15"/>` + motes(14, 300, 300, 1300, 500, '#D8FF9A', 0.8, 8);   // đom đóm
  return s;
}

// ---------- Suối núi: dòng suối chảy chéo, bờ đá, lau sậy, cành cây chìa ra, vách núi — dùng cho biến cá, rắn, bói cá
function bg_suoi(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A4CCE0', c2: '#EEF2E2', id: 'suSk' });
  s += wxPeaks(400, '#A8B4BC', 141, 1.0) + wxMist(390, 0.5) + tdCrag(1660, 600, 360, 560, '#8A9482', 142, { nt: 5 }) + tdCrag(1380, 560, 160, 260, '#9AA290', 146, { nt: 2 });
  s += rollingHills(560, '#9AB47E', '#88A66E', null) + farTrees(26, 560, '#5E7A5A', 147, 0, 1300);
  s += tdFall(1560, 300, 600, 64, T);
  s += `<path d="M0 600 Q500 580 1000 610 Q1500 590 1920 615 V1080 H0Z" fill="#8DB05E" stroke="${INK2}" stroke-width="4"/>`;
  // suối uốn cong từ xa tới gần
  s += `<path d="M1500 600 Q1420 640 1360 650 Q1100 690 1080 760 Q1060 840 820 900 Q560 970 520 1080 H1300 Q1300 980 1420 900 Q1560 810 1470 740 Q1420 690 1600 620Z" fill="#78B4CC" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M1440 660 Q1200 700 1170 770 Q1150 850 950 920 Q760 990 740 1080" stroke="#A8D4E4" stroke-width="30" fill="none" opacity="0.6"/>` + [...Array(14)].map((_, i) => { const u = i / 14, x = 1400 - 760 * u + Math.sin(T * 1.5 + i) * 14, y = 660 + 400 * u; return `<path d="M${R1(x)} ${R1(y)} q${R1(16 + u * 20)} -8 ${R1(32 + u * 40)} 0" stroke="#FFFFFF" stroke-width="${R1(2.5 + u * 2)}" fill="none" opacity="0.7"/>`; }).join('');
  // bờ: dải đá cuội viền suối
  s += pebbles(40, 520, 640, 1100, 440, '#9A9488', 148);
  s += tdBoulder(1300, 760, 0.55, '#9A948A', 8) + tdBoulder(920, 960, 0.7, '#8A8478', 9) + tdBoulder(1380, 1000, 0.85, '#9A948A', 10) + tdBoulder(1180, 860, 0.4, '#8A8478', 11);
  // lau sậy hai bờ
  for (let i = 0; i < 22; i++) { const left = i < 12, x = left ? 640 + hrnd(i, 3) * 260 - (hrnd(i, 4) * 120) : 1380 + hrnd(i, 3) * 200, g = left ? 860 + hrnd(i, 4) * 200 : 820 + hrnd(i, 4) * 160, h = 130 + hrnd(i, 5) * 130, sw = Math.sin(T * 1.4 + i) * 8;
    s += `<path d="M${R1(x)} ${R1(g)} Q${R1(x + sw)} ${R1(g - h * 0.6)} ${R1(x + sw * 1.5)} ${R1(g - h)}" stroke="${INK2}" stroke-width="6" fill="none"/><path d="M${R1(x)} ${R1(g)} Q${R1(x + sw)} ${R1(g - h * 0.6)} ${R1(x + sw * 1.5)} ${R1(g - h)}" stroke="#8A9A4A" stroke-width="3" fill="none"/><ellipse cx="${R1(x + sw * 1.5)}" cy="${R1(g - h - 14)}" rx="6" ry="18" fill="#8A6A3A" stroke="${INK2}" stroke-width="2"/><path d="M${R1(x)} ${R1(g - h * 0.3)} q${i % 2 ? 30 : -30} -20 ${i % 2 ? 40 : -40} -70" stroke="#7A8A3A" stroke-width="4" fill="none"/>`; }
  // cây cổ thụ bên trái nghiêng ra suối
  s += tdBigTree(220, 1000, 1.05, { c: '#5E8A44', lean: 14 });
  s += vGrass(150, 0, 620, 1920, 460, '#5E8A3A', 143, { c2: '#86A85A', skip: (x, y) => (x > 560 + (1080 - y) * 0.9 && x < 1320 + (1080 - y) * 0.3) }) + flowers(26, 0, 700, 600, 380, 145) + flowers(14, 1480, 760, 440, 320, 149);
  s += birds(260, 8);
  return s;
}

// ---------- Chân núi có bãi đất trống (ngôi miếu thổ địa do con khỉ biến thành vẽ trong cảnh): sườn núi, rừng thưa, đường mòn, đá
function bg_mieu_td(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A8CCE0', c2: '#F2ECDA', id: 'mtSk' });
  s += wxPeaks(420, '#9EAAB6', 151, 1.0) + wxMist(400, 0.45);
  // sườn núi lớn sau lưng (bên phải lên cao)
  s += `<path d="M0 640 Q400 600 800 520 Q1200 380 1500 300 Q1760 240 1920 260 V1080 H0Z" fill="#8EA478" stroke="${INK2}" stroke-width="5"/><path d="M800 520 Q1200 380 1500 300 Q1760 240 1920 260 V500 Q1600 470 1300 560 Q1000 620 800 520Z" fill="#7E9468" opacity="0.6"/>`;
  s += farTrees(26, 420, '#5E7A4A', 152, 1200, 700) + farTrees(18, 540, '#4E6E44', 153, 700, 600);
  s += tdBoulder(1480, 560, 1.0, '#9A948A', 12) + tdBoulder(1650, 520, 0.7, '#9A948A', 13);
  // bãi đất trống ở giữa (cho miếu), đường mòn
  s += `<path d="M0 720 Q600 690 960 700 Q1400 690 1920 720 V1080 H0Z" fill="#9AB46E" stroke="${INK2}" stroke-width="4"/><ellipse cx="960" cy="860" rx="460" ry="110" fill="#C8B488" stroke="${INK2}" stroke-width="3.5"/>` + pebbles(30, 560, 780, 800, 160, '#A8946C', 14);
  s += `<path d="M0 960 Q300 900 560 880" stroke="#C8B488" stroke-width="90" fill="none" stroke-linecap="round"/><path d="M1360 880 Q1600 900 1920 860" stroke="#C8B488" stroke-width="80" fill="none" stroke-linecap="round"/>`;
  s += treeD(220, 860, 0.85, { c: '#5E8A44' }) + pineD(420, 760, 0.6, '#4E6E4A') + treeD(1700, 880, 0.9, { c: '#5E8A44' }) + pineD(1500, 760, 0.6, '#4E6E4A');
  s += bushD(560, 1040, 0.8, '#5E8A4A') + bushD(1380, 1050, 0.8, '#5E8A4A') + tdBoulder(140, 1060, 0.7, '#8A8478', 15);
  s += vGrass(170, 0, 720, 1920, 360, '#5E8A3A', 154, { c2: '#86A85A', skip: (x, y) => ((x - 960) / 460) ** 2 + ((y - 860) / 110) ** 2 < 1 }) + flowers(30, 0, 740, 1920, 340, 155);
  s += birds(240, 7);
  return s;
}

// ---------- Trong miếu Nhị Lang ở Quán Giang Khẩu: bàn thờ, ghế thần (để trống cho con khỉ ngồi), lư hương, nến, phướn, hoành phi, cửa miếu nhìn ra
function bg_mieu_nl(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 340, bx1: 1580, by0: 110, by1: 700, wall: '#9A4A3A', wall2: '#8A3E30', fc: '#8A7464', floor: 'tile', paper: false, wain: '#5A3A24', wainH: 120, beams: '#5A3A24', vy: 470 };
  let s = room1p(R);
  s += `<rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 120}" fill="${pat('cloud', '#B8663A', null, 1.4)}" opacity="0.4"/>`;
  // khám thờ: mái nhỏ, rèm vàng vén, ghế thần trống
  s += `<rect x="700" y="230" width="520" height="350" fill="#5A2A22" stroke="${INK2}" stroke-width="5"/>` + wxRoof(960, 230, 640, 90, { c: '#3E4A44', tip: '#C9A227', pearl: true });
  s += `<path d="M700 236 Q760 400 730 580 L700 580Z M1220 236 Q1160 400 1190 580 L1220 580Z" fill="#E2B23A" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M840 580 V380 Q840 350 870 350 H1050 Q1080 350 1080 380 V580" fill="#8E2A22" stroke="${INK2}" stroke-width="5"/><rect x="860" y="380" width="200" height="190" fill="${pat('cloud', '#C9A227', null, 1)}" opacity="0.6"/><rect x="820" y="520" width="280" height="40" fill="#B8862A" stroke="${INK2}" stroke-width="4"/>`;
  s += `<rect x="790" y="130" width="340" height="70" rx="8" fill="#2A2A30" stroke="#C9A227" stroke-width="6"/><text x="960" y="180" font-family="${FH}" font-size="38" fill="#E4B83A" text-anchor="middle">MIẾU NHỊ LANG</text>`;
  // bàn thờ dài + đồ lễ
  s += `<path d="M620 700 V610 H1300 V700Z" fill="#7A2A22" stroke="${INK2}" stroke-width="5"/><rect x="600" y="590" width="720" height="30" fill="#9A4A2A" stroke="${INK2}" stroke-width="4"/><rect x="640" y="630" width="640" height="56" fill="${pat('thunder', '#C9A227', null, 0.9)}" opacity="0.45"/>`;
  s += `<rect x="920" y="550" width="80" height="40" fill="#8A7440" stroke="${INK2}" stroke-width="3"/>` + [0, 1, 2].map(i => `<path d="M${945 + i * 15} 550 v-50" stroke="#8A3A22" stroke-width="3"/>`).join('') + smoke(945, 500, 180, 0.45) + smoke(975, 500, 160, 0.35);
  for (const dx of [-260, 260]) s += `<rect x="${960 + dx - 10}" y="530" width="20" height="60" fill="#E8DCC8" stroke="${INK2}" stroke-width="3"/><path d="M${960 + dx} 530 q-8 -14 0 -26 q8 12 0 26Z" fill="#FFB43A" stroke="${INK2}" stroke-width="2"/><circle cx="${960 + dx}" cy="514" r="34" fill="#FFD27A" opacity="0.25"/>`;
  s += [[760, 590], [1160, 590]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="50" ry="12" fill="#E8DCC8" stroke="${INK2}" stroke-width="3"/>${[0, 1, 2, 3].map(k => `<circle cx="${x - 24 + k * 16}" cy="${y - 12 - (k % 2) * 10}" r="12" fill="${['#F08A3A', '#E8564A', '#F2C14E', '#8AB84A'][k]}" stroke="${INK2}" stroke-width="2"/>`).join('')}`).join('');
  // phướn treo + cột
  s += tdPennant(520, 700, 520, '#C0392B', T) + tdPennant(1400, 700, 520, '#2A5AA0', T);
  for (const [x, w] of [[400, 50], [240, 76], [70, 110]]) s += columnD(x, 0, 1080, w, '#8E3A2A') + columnD(1920 - x, 0, 1080, w, '#8E3A2A');
  // thảm + đệm quỳ
  s += rugD(960, 860, 760, 180, '#8E2A22', '#C9A227') + [-1, 1].map(k => `<ellipse cx="${960 + k * 140}" cy="800" rx="56" ry="18" fill="#C9A227" stroke="${INK2}" stroke-width="4"/>`).join('');
  s += motes(24, 500, 200, 920, 500, '#FFF1C8', 0.5, 9);
  return s;
}

// ---------- Nền thẻ chữ: cuộn giấy mở trên nền hoa văn mây tối — vùng giữa trống cho chữ/sơ đồ
function bg_the(t, o = {}) {
  const T = _T(t);
  let s = `<rect width="1920" height="1080" fill="#3A2E3E"/><rect width="1920" height="1080" fill="${pat('cloud', '#4E4052', null, 1.6)}" opacity="0.9"/>`;
  s += `<defs><radialGradient id="thV" cx="0.5" cy="0.5" r="0.7"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#thV)"/>`;
  // cuộn giấy
  s += `<rect x="190" y="110" width="1540" height="860" fill="#F2E6C8" stroke="${INK2}" stroke-width="6"/><rect x="190" y="110" width="1540" height="860" fill="${pat('weave', '#E2D2AE', null, 1.2)}" opacity="0.35"/>`;
  s += `<rect x="230" y="150" width="1460" height="780" fill="none" stroke="#B8463A" stroke-width="4"/><rect x="244" y="164" width="1432" height="752" fill="none" stroke="#B8463A" stroke-width="2"/>` + [[230, 150], [1690, 150], [230, 930], [1690, 930]].map(([x, y]) => `<path d="M${x - 14} ${y} h28 M${x} ${y - 14} v28" stroke="#B8463A" stroke-width="5"/>`).join('');
  s += `<path d="M190 940 q300 -20 600 6 q400 30 940 -10 V970 H190Z" fill="#E2D2AE" opacity="0.6"/>`;
  // hai trục gỗ
  for (const x of [170, 1750]) s += `<rect x="${x - 26}" y="80" width="52" height="920" rx="20" fill="#6B3E26" stroke="${INK2}" stroke-width="5"/><rect x="${x - 14}" y="90" width="12" height="900" fill="#8A5A3A"/><rect x="${x - 34}" y="60" width="68" height="40" rx="10" fill="${tdC.gold}" stroke="${INK2}" stroke-width="4"/><rect x="${x - 34}" y="980" width="68" height="40" rx="10" fill="${tdC.gold}" stroke="${INK2}" stroke-width="4"/>`;
  // dấu son góc
  s += `<rect x="1580" y="820" width="80" height="80" rx="6" fill="#C0392B" opacity="0.85" stroke="${INK2}" stroke-width="2"/><text x="1620" y="854" font-family="${FH}" font-size="24" fill="#F2E6C8" text-anchor="middle">TÂY</text><text x="1620" y="884" font-family="${FH}" font-size="24" fill="#F2E6C8" text-anchor="middle">DU</text>`;
  s += motes(16, 0, 0, 1920, 1080, '#FFE8B0', 0.4, 12);
  return s;
}

// cây cổ thụ tán xoè không đều (nhiều cụm lá, vân lá) — x gốc, g chân; o.lean: nghiêng (độ), o.c màu lá
function tdBigTree(x, g, s = 1, o = {}) {
  const c = o.c || '#5E8A44', tr = o.trunk || '#7A5A3A', L = o.lean || 0;
  let b = `<path d="M-40 0 Q-30 -120 -20 -220 Q-60 -300 -160 -330 M-20 -220 Q10 -320 80 -380 M-24 -160 Q40 -220 150 -250 M-22 -260 Q-20 -340 -40 -420" stroke="${INK2}" stroke-width="54" fill="none" stroke-linecap="round"/><path d="M-40 0 Q-30 -120 -20 -220 Q-60 -300 -160 -330 M-20 -220 Q10 -320 80 -380 M-24 -160 Q40 -220 150 -250 M-22 -260 Q-20 -340 -40 -420" stroke="${tr}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M-30 -20 q-6 -50 -2 -110 M-12 -60 q6 -40 0 -80" stroke="${dk(tr, 0.25)}" stroke-width="5" fill="none"/><path d="M-80 0 Q-50 -20 -40 0 M0 0 Q-10 -20 30 -4" stroke="${tr}" stroke-width="18" stroke-linecap="round"/>`;
  const cl = [[-180, -350, 90], [-90, -420, 110], [20, -460, 120], [120, -400, 100], [190, -300, 80], [-40, -330, 90], [80, -300, 80], [-230, -280, 64]];
  for (const [cx, cy, r] of cl) { let d = ''; const n = 9; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr = r * (0.86 + 0.18 * hrnd(i, cx + cy)); d += (i ? ' Q' : 'M') + (i ? `${R1(cx + Math.cos(a - 0.35) * rr * 1.15)} ${R1(cy + Math.sin(a - 0.35) * rr * 1.15)} ` : '') + `${R1(cx + Math.cos(a) * rr)} ${R1(cy + Math.sin(a) * rr)}`; } b += `<path d="${d}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`; }
  for (const [cx, cy, r] of cl) b += `<path d="M${cx - r * 0.6} ${cy + r * 0.35} q${r * 0.3} ${r * 0.25} ${r * 0.6} ${r * 0.1} q${r * 0.3} ${r * 0.15} ${r * 0.6} -${r * 0.1}" stroke="${dk(c, 0.22)}" stroke-width="6" fill="none" opacity="0.75"/><path d="M${cx - r * 0.4} ${cy - r * 0.45} q${r * 0.3} -${r * 0.2} ${r * 0.6} -${r * 0.05}" stroke="${lt_(c, 0.3)}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  for (let i = 0; i < 30; i++) { const a = hrnd(i, 77) * 6.28, rr = 60 + hrnd(i, 78) * 200; b += `<path d="M${R1(Math.cos(a) * rr * 1.1)} ${R1(-370 + Math.sin(a) * rr * 0.5)} q8 -8 18 -2" stroke="${dk(c, 0.3)}" stroke-width="3" fill="none"/>`; }
  return _g(x, g, s, b, L);
}

// núi xanh phủ rừng (đỉnh tròn, mép rừng răng cưa, vách đá lộ một bên, chấm cây) — chân (x, g), rộng w, cao h
function tdGreenPeak(x, g, w, h, c = '#7FA858', seed = 1, o = {}) {
  const top = g - h, n = 14, P = [];
  for (let i = 0; i <= n; i++) { const u = i / n, xx = x - w / 2 + w * u, k = Math.pow(Math.sin(Math.PI * u), o.sharp || 0.85), yy = g - h * k + (hrnd(i, seed) - 0.5) * h * 0.06; P.push([xx, yy]); }
  // mép trên: các ngọn cây tròn nối nhau
  let d = `M${R1(P[0][0])} ${g}`;
  for (let i = 0; i < n; i++) { const [xa, ya] = P[i], [xb, yb] = P[i + 1], mx = (xa + xb) / 2, my = Math.min(ya, yb) - (w / n) * 0.35; d += ` L${R1(xa)} ${R1(ya)} Q${R1(mx)} ${R1(my)} ${R1(xb)} ${R1(yb)}`; }
  d += ` L${R1(P[n][0])} ${g}Z`;
  let s = `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4.5}" stroke-linejoin="round"/>`;
  // mặt khuất
  s += `<path d="M${R1(x + w * 0.04)} ${R1(top + h * 0.04)} Q${R1(x + w * 0.2)} ${R1(top + h * 0.5)} ${R1(x + w * 0.12)} ${g} H${R1(x + w / 2)} Q${R1(x + w * 0.36)} ${R1(top + h * 0.3)} ${R1(x + w * 0.04)} ${R1(top + h * 0.04)}Z" fill="${dk(c, 0.16)}" opacity="0.65"/>`;
  // vách đá lộ (khối đá lởm chởm, không vuông)
  if (o.cliff !== false) { const cx = x + w * (o.cliffX ?? -0.12), cy = top + h * 0.3, cw = w * 0.17, ch = h * 0.4, rc = o.rock || '#A8A496';
    const pts = [[-0.5, 0.1], [-0.2, -0.05], [0.1, 0.05], [0.45, -0.02], [0.55, 0.4], [0.4, 0.75], [0.48, 1.0], [0.1, 0.9], [-0.25, 1.02], [-0.45, 0.7], [-0.58, 0.4]].map(([u, v], i) => [cx + u * cw + (hrnd(i, seed + 20) - 0.5) * cw * 0.15, cy + v * ch + (hrnd(i, seed + 21) - 0.5) * ch * 0.08]);
    s += _q(pts, rc, 3.5) + `<path d="M${R1(cx - cw * 0.1)} ${R1(cy)} L${R1(cx - cw * 0.05)} ${R1(cy + ch * 0.45)} L${R1(cx - cw * 0.2)} ${R1(cy + ch * 0.9)} M${R1(cx + cw * 0.25)} ${R1(cy + ch * 0.1)} L${R1(cx + cw * 0.3)} ${R1(cy + ch * 0.6)}" stroke="${dk(rc, 0.3)}" stroke-width="3" fill="none"/>` + `<path d="M${R1(pts[0][0])} ${R1(pts[0][1])} L${R1(pts[1][0])} ${R1(pts[1][1])} L${R1(pts[2][0])} ${R1(pts[2][1])} L${R1(pts[3][0])} ${R1(pts[3][1])}" stroke="#6E9A4A" stroke-width="8" fill="none" stroke-linecap="round"/>`; }
  // vân rừng: cụm tán cây nhỏ (không viền), vệt bóng
  for (let i = 0; i < (o.dots ?? 26); i++) { const u = 0.08 + 0.84 * hrnd(i, seed + 3), yy = g - h * Math.pow(Math.sin(Math.PI * u), 0.85) * (0.15 + 0.75 * hrnd(i, seed + 4)), xx = x - w / 2 + w * u, r = 9 + hrnd(i, seed + 5) * 10, cc = dk(c, 0.1 + 0.1 * hrnd(i, seed + 6));
    s += `<path d="M${R1(xx - r * 1.2)} ${R1(yy + r * 0.4)} q${R1(r * 0.1)} ${R1(-r)} ${R1(r * 0.8)} ${R1(-r * 0.7)} q${R1(r * 0.5)} ${R1(-r * 0.7)} ${R1(r * 1.1)} ${R1(-r * 0.05)} q${R1(r * 0.6)} ${R1(r * 0.1)} ${R1(r * 0.5)} ${R1(r * 0.75)}Z" fill="${cc}"/><path d="M${R1(xx - r * 0.6)} ${R1(yy - r * 0.35)} q${R1(r * 0.3)} ${R1(-r * 0.3)} ${R1(r * 0.6)} ${R1(-r * 0.15)}" stroke="${lt_(c, 0.25)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; }
  for (let i = 0; i < 6; i++) { const u = 0.15 + 0.7 * hrnd(i, seed + 8), yy = top + h * (0.25 + 0.6 * hrnd(i, seed + 9)), xx = x - w / 2 + w * u; s += `<path d="M${R1(xx - 26)} ${R1(yy)} q13 -12 26 0 q13 -12 26 0" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none"/>`; }
  // cây hoa (hồng/trắng) điểm xuyết
  if (o.bloom) for (let i = 0; i < o.bloom; i++) { const u = 0.12 + 0.76 * hrnd(i, seed + 12), yy = g - h * Math.pow(Math.sin(Math.PI * u), 0.85) * (0.2 + 0.6 * hrnd(i, seed + 13)), xx = x - w / 2 + w * u; s += `<circle cx="${R1(xx)}" cy="${R1(yy)}" r="${R1(10 + hrnd(i, seed + 14) * 8)}" fill="${i % 3 ? '#F4B8C8' : '#FFF4F0'}" stroke="${INK2}" stroke-width="2"/>`; }
  return s;
}

// cây hoa (anh đào/đào nở) — tán hồng nhiều cụm
function tdBlossom(x, g, s = 1, c = '#F4B8C8', T = AT_()) {
  let b = `<path d="M-16 0 Q-20 -90 -40 -160 Q-70 -210 -130 -230 M-6 0 Q4 -110 30 -180 Q60 -230 130 -250 M-30 -150 Q-20 -210 0 -260" stroke="${INK2}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-16 0 Q-20 -90 -40 -160 Q-70 -210 -130 -230 M-6 0 Q4 -110 30 -180 Q60 -230 130 -250 M-30 -150 Q-20 -210 0 -260" stroke="#6E4A36" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  b += tdPuffs([[-140, -250, 62], [-60, -300, 80], [40, -310, 78], [130, -260, 64], [-10, -240, 60], [-190, -210, 44], [190, -220, 44]], c, 3.5);
  for (let i = 0; i < 30; i++) { const a = hrnd(i, 51) * 6.28, rr = 30 + hrnd(i, 52) * 150; b += `<circle cx="${R1(Math.cos(a) * rr * 1.2)}" cy="${R1(-270 + Math.sin(a) * rr * 0.5)}" r="5" fill="${i % 3 ? '#FFFFFF' : '#E87A9A'}"/>`; }
  return _g(x, g, s, b + `<ellipse cx="0" cy="4" rx="130" ry="16" fill="#20140A" opacity="0.12"/>`);
}

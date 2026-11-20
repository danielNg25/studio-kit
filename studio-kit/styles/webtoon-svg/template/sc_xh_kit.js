// BỘ CÔNG CỤ tập xep-hang-cao-thu-thuy-hu (C4): dữ liệu 15 người, bảng xếp hạng toàn khung, huy hiệu "HẠNG ?", thẻ chấm,
// cảnh đấu trên ngựa (hai kỵ sĩ + bộ đếm hiệp). Không chớp trắng màn hình, không máu (luật kênh).

// ---- 15 người: key → nhân vật, tên, hạng, thứ tự trong hàng (trái = cao hơn), màu nền huy hiệu
const XH_P = {
  db: ['yq_db', 'Đại Bằng', 'S', 0, '#F6E2A8'], bc: ['bc1', 'Bạch Cốt Tinh', 'D', 0, '#E8F0F4'], hhn: ['hhn', 'Hồng Hài Nhi', 'B', 0, '#F6C8B8'], qs: ['yq_hl', 'Ba quốc sư Xa Trì', 'D', 1, '#E8DCC0'],
  kg: ['kgd', 'Kim Giác và Ngân Giác', 'C', 0, '#F4E2B0'], nmv: ['nmv', 'Ngưu Ma Vương', 'A', 0, '#D8D0D4'], bcap: ['yq_bc', 'Bọ cạp tinh', 'B', 1, '#E8D0E8'], hb: ['hb', 'Hoàng Bào quái', 'C', 1, '#F2E0A8'],
  hm: ['hoang_mi', 'Hoàng Mi', 'A', 1, '#F2E6C0'], lnmh: ['yq_lnmh', 'Lục Nhĩ Mi Hầu', 'A', 2, '#E0D4C8'], cl: ['yq_cl', 'Cửu Linh Nguyên Thánh', 'S', 1, '#E0E8F4'], dg: ['dgh', 'Độc Giác Đại Vương', 'S', 2, '#D0DCEC'],
};
const XH_ORDER = ['db', 'bc', 'hhn', 'qs', 'kg', 'nmv', 'bcap', 'hb', 'hm', 'lnmh', 'cl', 'dg'];   // thứ tự xuất hiện
const XH_GROUP = {};
const TB_TITLE = 'XẾP HẠNG YÊU QUÁI TÂY DU KÝ';
const XH_TIERS = [['S', '#C0392B'], ['A', '#D9822B'], ['B', '#C9A227'], ['C', '#5E9A4F'], ['D', '#4A77A8']];
const XH_TI = { S: 0, A: 1, B: 2, C: 3, D: 4 };
// các người đã vào bảng TRƯỚC người key (theo thứ tự xuất hiện; lx/dc/hd vào cùng lúc)
const xhBefore = (key) => XH_ORDER.slice(0, XH_ORDER.indexOf(key));
// slot trong hàng theo thứ tự ưu tiên, chỉ tính những người đã có mặt
function xhSlot(key, present) { const tier = XH_P[key][2]; return XH_ORDER.filter(k => XH_P[k][2] === tier && present.includes(k)).sort((a, b) => XH_P[a][3] - XH_P[b][3]).indexOf(key); }

// huy hiệu chân dung
function xhChip(key, x, y, r, o = {}) {
  const [id, , , , bg] = XH_P[key];
  const sc = o.sc ?? 1;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)}) translate(${f1(-x)} ${f1(-y)})" opacity="${f1(o.op ?? 1)}">` + kIcon(id, x, y, r, o.ex || 'neutral', o.T || 0, { bg, grey: o.ghost }) +
    `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="none" stroke="${INK2}" stroke-width="${f1(Math.max(4, r * 0.09))}"/></g>`;
}

// ---- BẢNG TOÀN KHUNG. o.placed = [keys], o.drop = {key, t0}, o.lit = 'S'…, o.wait (mặc định true): hàng chờ bên phải
const XB_RY = (ti) => 150 + ti * 170;
const xbSlotXY = (ti, k) => [330 + k * 160, XB_RY(ti) + 62];
function xhBoardW(t, o = {}) {
  let s = xhbg_board(t) + kText('XẾP HẠNG CAO THỦ TAM QUỐC', 760, 110, 64, { c: K_RED });
  XH_TIERS.forEach(([L, c], ti) => {
    const y = XB_RY(ti), lit = o.lit === L ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    s += `<rect x="90" y="${y}" width="110" height="150" rx="12" fill="${c}" stroke="${INK2}" stroke-width="6"/>` + kText(L, 145, y + 106, 92, { font: `'Bangers', ${FH}`, c: '#fff' });
    s += `<rect x="215" y="${y}" width="1060" height="150" rx="12" fill="${K_P1}" stroke="${INK2}" stroke-width="5"/>`;
    if (L === 'S') s += `<rect x="215" y="${y}" width="1060" height="150" rx="12" fill="#FFD25A" opacity="${f1(0.16 + 0.08 * Math.sin(t * 2.2) + lit * 0.3)}"/>`;
    else if (lit) s += `<rect x="215" y="${y}" width="1060" height="150" rx="12" fill="#fff" opacity="${f1(lit * 0.35)}"/>`;
  });
  const placed = o.placed || [], all = [...placed, ...(o.drop ? [o.drop.key] : [])];
  const draw = (key, extra = {}) => { const ti = XH_TI[XH_P[key][2]], [x, y] = xbSlotXY(ti, xhSlot(key, all)); return xhChip(key, x, y - 6, 50, extra) + kText(XH_P[key][1], x, y + 68, 22); };
  placed.forEach(k => { s += draw(k); });
  if (o.wait !== false) {
    const done = new Set(all);
    s += kText('CHỜ XẾP', 1600, 190, 30, { c: '#8A7A62' });
    XH_ORDER.forEach((k, i) => { if (done.has(k)) return; const x = 1380 + (i % 4) * 138, y = 262 + Math.floor(i / 4) * 150; s += xhChip(k, x, y, 42, { ghost: true, op: 0.6 }) + kText(XH_P[k][1], x, y + 64, 18, { c: '#7A6A52' }); });
  }
  if (o.drop) {
    const d = o.drop, ti = XH_TI[XH_P[d.key][2]], [tx, ty] = xbSlotXY(ti, xhSlot(d.key, all)), u = clamp((t - d.t0) / 0.55);
    if (t >= d.t0 && u < 1) { const e = EZ.quartOut(u), x = lerp(960, tx, e), y = lerp(560, ty - 6, e) - Math.sin(u * Math.PI) * 140, sc = lerp(2.6, 1, e); s += xhChip(d.key, x, y, 50, { sc }); }
    else if (t >= d.t0 + 0.55) { s += draw(d.key, { sc: 1 + 0.2 * Math.exp(-(t - d.t0 - 0.55) * 12) }) + shockRing(t, d.t0 + 0.55, tx, ty - 6, { r: XH_P[d.key][2] === 'S' ? 230 : 140, c: XH_P[d.key][2] === 'S' ? '#FFD25A' : '#FFFFFF', dur: 0.5 }); if (XH_P[d.key][2] === 'S') s += glowSparks(t, d.t0 + 0.55, tx, ty - 6, { n: 16, c: '#FFD25A' }); }
  }
  return s;
}

// ---- huy hiệu "HẠNG ?" mở mỗi người: chân dung to giữa, tên, ô hạng lắc
function xhIntro(t, key, o = {}) {
  let s = xhbg_board(t);
  const k = EZ.backOut(clamp((t - 0.1) / 0.45)), [id, name] = XH_P[key];
  s += xhChip(key, 960, 470, 230, { sc: k, ex: o.ex || 'calm', T: t });
  s += `<g opacity="${f1(clamp((t - 0.35) / 0.3))}">` + kText(name.toUpperCase(), 960, 820, 96, { c: K_RED, stroke: '#FFF8E6', sw: 12 }) + `</g>`;
  const w = Math.sin(t * 7) * 6, qk = EZ.backOut(clamp((t - 0.6) / 0.4));
  s += `<g transform="translate(1340 300) rotate(${f1(w)}) scale(${f1(qk)})"><rect x="-80" y="-80" width="160" height="160" rx="18" fill="#8A7A62" stroke="${INK2}" stroke-width="7"/>` + kText('?', 0, 46, 130, { font: `'Bangers', ${FH}`, c: '#fff' }) + `</g>` + kText('HẠNG', 1340, 190, 44, { op: qk });
  if (o.tag) s += `<g opacity="${f1(clamp((t - 0.9) / 0.3))}">` + kText(o.tag, 960, 900, 46, { c: '#5A4A3A' }) + `</g>`;
  return s;
}

// ---- THẺ CHẤM: trái = nhân vật đứng to; phải = hai dòng (nhãn màu + nội dung), rồi dấu hạng đóng
// o = { lines: [[t, nhãn, chữ, màu]], tTier }
function xhCard(t, key, o = {}) {
  let s = xhbg_board(t);
  const [id, name, tier] = XH_P[key], tc = XH_TIERS[XH_TI[tier]][1];
  const ex = t > (o.tTier ?? 99) ? (tier === 'D' ? 'shock' : tier === 'S' ? 'smile' : 'calm') : 'calm';
  s += thC(id, { x: 420, ground: 1010, scale: o.scale || 0.66, ex }, t);
  s += kText(name.toUpperCase(), 420, 120, 62, { c: K_RED });
  (o.lines || []).forEach(([tl, lab, txt, col], i) => {
    const u = clamp((t - tl) / 0.35); if (u <= 0) return;
    const y = 250 + i * 230, x = 820;
    s += `<g opacity="${f1(u)}" transform="translate(${f1((1 - EZ.expoOut(u)) * 60)} 0)"><rect x="${x}" y="${y}" width="1000" height="190" rx="18" fill="#FFFBF0" stroke="${INK2}" stroke-width="6"/>` +
      `<rect x="${x}" y="${y}" width="260" height="190" rx="18" fill="${col || '#2E5F8A'}" stroke="${INK2}" stroke-width="6"/>` + kText(lab, x + 130, y + 110, lab.length > 8 ? 34 : 44, { c: '#fff' });
    const lines2 = tpWrapX(txt, 40, 700); lines2.forEach((ln, j) => { s += kText(ln, x + 290, y + 92 + (j - (lines2.length - 1) / 2) * 50, 40, { anchor: 'start' }); });
    s += `</g>`;
  });
  if (o.tTier != null && t >= o.tTier) {
    const d = t - o.tTier, kk = d < 0.16 ? 1 + (1 - d / 0.16) * 1.5 : 1 + 0.1 * Math.exp(-(d - 0.16) * 8) * Math.sin((d - 0.16) * 30);
    s += `<g transform="translate(1320 870) rotate(-8) scale(${f1(kk)})"><rect x="-210" y="-90" width="420" height="180" rx="22" fill="${tc}" stroke="${INK2}" stroke-width="9"/>` + kText('HẠNG ' + tier, 0, 40, 112, { font: `'Bangers', ${FH}`, c: '#fff' }) + `</g>`;
    if (tier === 'S') s += glowSparks(t, o.tTier, 1320, 870, { n: 18, c: '#FFD25A' });
  }
  return s;
}
function tpWrapX(txt, size, width) { const maxc = Math.max(8, Math.floor(width / (size * 0.5))), out = []; let cur = ''; txt.split(' ').forEach(w => { if ((cur + ' ' + w).trim().length > maxc && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); return out; }

// ---- KỴ SĨ: ngựa + người ngồi (legs: 'kneel'). st thêm cho nhân vật (ex, arm…). Trả {back, front} để xếp lớp.
function xhRider(id, x, g, s, t, o = {}) {
  const H = thHorse(x, g, s, t, { run: o.run ?? 0.6, c: o.horse || '#8A5A3A', flip: o.flip });
  const st = Object.assign({ x: x + (o.flip ? 20 : -20) * s, ground: g - s * (typeof XF_SEAT === 'number' ? XF_SEAT : 300) + (H.bob || 0), scale: o.cs || s * 0.5, legs: 'stand', shadow: false, flip: o.flip }, o.st || {});
  return { back: H.back, front: H.front + (typeof xfHalfH === 'function' ? xfHalfH(thC(id, st, t * (o.tk || 1)), x, g + (H.bob || 0), s) : thC(id, st, t * (o.tk || 1))) };
}
// ---- BỘ ĐẾM HIỆP góc phải trên. n = số hiệp đang hiện; o.done = chữ kết (HÒA/THẮNG…) từ t0
function xhCounter(t, n, o = {}) {
  let s = `<g transform="translate(1660 120)"><rect x="-190" y="-70" width="380" height="140" rx="20" fill="#20140A" opacity="0.82"/><rect x="-190" y="-70" width="380" height="140" rx="20" fill="none" stroke="#E2C25A" stroke-width="5"/>`;
  s += kText('HIỆP', -95, 22, 52, { c: '#E2C25A' }) + kText(String(Math.floor(n)), 80, 34, 92, { font: `'Bangers', ${FH}`, c: '#FFFFFF' }) + `</g>`;
  if (o.label && t >= o.t0) { const d = t - o.t0, k = d < 0.15 ? 1 + (1 - d / 0.15) * 1.4 : 1; s += `<g transform="translate(1660 290) rotate(-6) scale(${f1(k)})"><rect x="-150" y="-62" width="300" height="124" rx="16" fill="${o.col || '#5A6A7A'}" stroke="${INK2}" stroke-width="7"/>` + kText(o.label, 0, 34, 88, { font: `'Bangers', ${FH}`, c: '#fff' }) + `</g>`; }
  return s;
}
// ---- tia lửa nhỏ khi binh khí chạm nhau (không phủ màn hình)
function xhClash(t, t0, x, y, o = {}) {
  const d = t - t0; if (d < 0 || d > 0.35) return '';
  let s = ''; const n = o.n || 8, R = (o.r || 70) * EZ.expoOut(d / 0.35), op = 1 - d / 0.35;
  for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + t0; s += `<path d="M${f1(x + Math.cos(a) * R * 0.3)} ${f1(y + Math.sin(a) * R * 0.3)} L${f1(x + Math.cos(a) * R)} ${f1(y + Math.sin(a) * R)}" stroke="#FFC24A" stroke-width="6" stroke-linecap="round" opacity="${f1(op)}"/>`; }
  return s + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 * op + 4)}" fill="#FFF2C0" opacity="${f1(op)}"/>`;
}
// ---- CẢNH ĐẤU TAY ĐÔI TRÊN NGỰA: hai kỵ sĩ áp sát – tách ra theo nhịp, binh khí vung, tia lửa ở mỗi lần chạm
// a, b = id nhân vật (a bên trái nhìn phải, b bên phải nhìn trái). o.period = giây một lần áp sát; o.b2 = bộ 2 (đánh bộ: legs thường, không ngựa)
function xhDuel(t, a, b, o = {}) {
  const P = o.period || 1.1, ph = (t % P) / P, close = Math.pow(Math.sin(ph * Math.PI), 2);
  const cx = o.cx || 960, g = o.g || 1010, sc = o.s || (o.foot ? 0.6 : 0.9), gap = o.foot ? lerp(o.far || 420, o.near || 150, close) : lerp(o.far || 560, o.near || 300, close);
  const swing = Math.sin(ph * Math.PI * 2) * 40;
  let s = '';
  if (o.foot) {
    s += thC(a, Object.assign({ x: cx - gap, ground: g, scale: sc * 0.95, ex: 'fierce', arm: -40 + swing, legs: 'stance' }, o.stA || {}), t) +
      thC(b, Object.assign({ x: cx + gap, ground: g, scale: sc * 0.95, ex: 'fierce', flip: true, arm: -40 - swing, legs: 'stance' }, o.stB || {}), t);
  } else {
    const A = xhRider(a, cx - gap, g, sc, t, { horse: o.hA || '#8A5A3A', st: Object.assign({ ex: 'fierce', arm: -40 + swing }, o.stA || {}) });
    const B = xhRider(b, cx + gap, g + 6, sc, t, { flip: true, horse: o.hB || '#5A4A44', st: Object.assign({ ex: 'fierce', arm: -40 - swing }, o.stB || {}) });
    s += A.back + B.back + A.front + B.front;
  }
  // tia lửa ở đỉnh áp sát
  const k = Math.floor(t / P), tc = k * P + P / 2;
  if (o.clash !== false) s += xhClash(t, tc, cx, g - (o.foot ? sc * 520 : sc * 560), { r: 80 });
  return s;
}
// số hiệp chạy theo thời gian: từ n0 tới n1 trong [t0, t1]
const xhRound = (t, t0, t1, n0, n1) => lerp(n0, n1, EZ.quadOut(clamp((t - t0) / Math.max(0.1, t1 - t0))));

// ---- cảnh chấm: thẻ chấm → (sau khi đóng dấu hạng 1,2 s) chuyển sang bảng, huy hiệu bay vào hàng
function xhCham(t, ctx, key, lines, o = {}) {
  const tT = o.tT ?? AT(ctx, o.tierWord || ('hạng ' + XH_P[key][2].toLowerCase()));
  const tB = tT + 1.3;
  if (t < tB || ctx.dur - tB < 1.2) return thFin(xhCard(t, key, { lines, tTier: tT, scale: o.scale }) + cineFrame(0.3));
  const group = XH_GROUP[key] || [key];
  const placed = xhBefore(key);
  let s = xhBoardW(t, { placed, drop: { key: group[0], t0: tB + 0.1 }, lit: XH_P[key][2] });
  group.slice(1).forEach((k, i) => { s = xhBoardW(t, { placed: [...placed, ...group.slice(0, i + 1)], drop: { key: k, t0: tB + 0.1 + (i + 1) * 0.35 }, lit: XH_P[key][2] }); });
  return thFin(s + cineFrame(0.3));
}
// ---- hòn đá bay (Trương Thanh): từ (x0,y0) tới (x1,y1) theo u∈[0,1], vệt trắng phía sau
function xhStone(x0, y0, x1, y1, u, o = {}) {
  if (u <= 0 || u > 1) return '';
  const e = EZ.quadIn(u), x = lerp(x0, x1, e), y = lerp(y0, y1, e) - Math.sin(u * Math.PI) * (o.arc ?? 40), tx = lerp(x0, x1, Math.max(0, e - 0.25)), ty = lerp(y0, y1, Math.max(0, e - 0.25));
  return `<path d="M${f1(tx)} ${f1(ty)} L${f1(x)} ${f1(y)}" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.7"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="14" ry="11" fill="#D8D4CC" stroke="${INK2}" stroke-width="4"/>`;
}

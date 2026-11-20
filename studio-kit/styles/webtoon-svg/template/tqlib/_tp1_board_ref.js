// BẢNG XẾP HẠNG TRẬN PHÁP (dải phải 450 px) + khung R/V + thẻ tên + thẻ chấm CÔNG/THỦ. Dùng cả tập.
// Khung R: sân khấu 1470 px bên trái (cắt từ cảnh 1920, lệch -225) + bảng bên phải. Khung V: cảnh gần toàn khung, dải hạng mỏng 90 px.
const TPB_X = 1470, TPB_W = 450;
const TPB_TIERS = [['S', '#C0392B'], ['A', '#D9822B'], ['B', '#C9A227'], ['C', '#5E9A4F'], ['D', '#4A77A8']];
const TPB_TI = { S: 0, A: 1, B: 2, C: 3, D: 4 };
const TPB_RY = (ti) => 112 + ti * 140;
const TPB_ORDER = ['lh', 'sc', 'bd', 'lm', 'ln', 'cv', 'kc'];
const TPB_NAME = { kc: 'Kim Cương', lm: 'Lục Mạch', sc: 'Sát Cẩu', lh: 'La Hán', ln: 'Lưỡng Nghi', cv: 'Chân Vũ', bd: 'Bắc Đẩu' };
const TPB_BG = { kc: '#2A2438', lm: '#CFEFEA', sc: '#E8C58A', lh: '#E9B26A', ln: '#DCE8F2', cv: '#BFD8C4', bd: '#26305A' };

// huy hiệu: vẽ trong hệ toạ độ r=100 (phóng theo r/100), tâm (0,0)
const TPB_ICON = {
  kc: () => `<circle r="56" fill="none" stroke="#14101C" stroke-width="20"/><circle r="56" fill="none" stroke="#6C6A98" stroke-width="4" opacity="0.8"/>` + [0, 1, 2].map(i => { const a = (-90 + i * 120) * Math.PI / 180; return `<circle cx="${f1(Math.cos(a) * 56)}" cy="${f1(Math.sin(a) * 56)}" r="13" fill="#FFD25A" stroke="${INK2}" stroke-width="4"/>`; }).join('') + `<circle r="18" fill="#FFE9A0" opacity="0.8"/>`,
  lm: () => [0, 1, 2, 3, 4, 5].map(i => { const a = (-75 + i * 30) * Math.PI / 180; return `<path d="M${f1(Math.cos(a) * 20)} ${f1(Math.sin(a) * 20 + 18)} L${f1(Math.cos(a) * 74)} ${f1(Math.sin(a) * 74 + 18)}" stroke="#1F9AAA" stroke-width="9" stroke-linecap="round"/>`; }).join('') + `<circle cy="18" r="19" fill="#F7DEC8" stroke="${INK2}" stroke-width="5"/>`,
  sc: () => `<path d="M-66 8 Q-66 62 0 62 Q66 62 66 8Z" fill="#8A5A34" stroke="${INK2}" stroke-width="6"/><ellipse cy="8" rx="66" ry="14" fill="#B07A48" stroke="${INK2}" stroke-width="6"/><path d="M-50 -10 Q0 -86 66 -56 Q40 -52 20 -34 Q-10 -18 -50 -10Z" fill="#E4EAF0" stroke="${INK2}" stroke-width="5"/>`,
  lh: () => `<circle cy="4" r="44" fill="#F7DEC8" stroke="${INK2}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5].map(i => { const a = (-150 + i * 24) * Math.PI / 180; return `<circle cx="${f1(Math.cos(a) * 28)}" cy="${f1(Math.sin(a) * 28 - 14)}" r="3.6" fill="#8A4A2E"/>`; }).join('') + `<path d="M-22 10 q8 6 16 0 M6 10 q8 6 16 0" stroke="${INK2}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-14 28 q14 8 28 0" stroke="${INK2}" stroke-width="5" fill="none" stroke-linecap="round"/><circle r="64" fill="none" stroke="#C9A24A" stroke-width="7" stroke-dasharray="14 9"/>`,
  ln: () => `<circle r="58" fill="#fff" stroke="${INK2}" stroke-width="6"/><path d="M0 -58 A58 58 0 0 1 0 58 A29 29 0 0 1 0 0 A29 29 0 0 0 0 -58Z" fill="${INK2}"/><circle cy="-29" r="9" fill="#fff"/><circle cy="29" r="9" fill="${INK2}"/>` + [...Array(8)].map((_, i) => `<path d="M0 -68 v12" stroke="${INK2}" stroke-width="7" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join(''),
  cv: () => `<ellipse cy="12" rx="52" ry="38" fill="#3E6A5A" stroke="${INK2}" stroke-width="6"/><path d="M-26 -8 l16 -12 l20 0 l16 12 M-26 -8 v34 M26 -8 v34 M-10 -20 v52 M10 -20 v52" stroke="#9CC8AE" stroke-width="3.5" fill="none"/><circle cx="-56" cy="6" r="15" fill="#4E8070" stroke="${INK2}" stroke-width="5"/><path d="M40 20 q26 -6 14 -34 q-8 -16 8 -22" stroke="#6AA86A" stroke-width="10" fill="none" stroke-linecap="round"/>`,
  bd: () => { const P = [[-64, 30], [-38, 12], [-10, 16], [18, -2], [24, -34], [56, -48], [66, -14]]; return `<path d="${P.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ')}Z" fill="none" stroke="#FFD25A" stroke-width="4" opacity="0.8"/>` + P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 4 ? 9 : 8}" fill="#FFF3C8" stroke="#FFD25A" stroke-width="3.5"/>`).join(''); },
};
// huy hiệu trận pháp id, tâm (x,y), bán kính r
function tpChip(id, x, y, r, o = {}) {
  const sc = o.sc ?? 1;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${(sc).toFixed(3)})" opacity="${f1(o.op ?? 1)}"${o.ghost ? ' style="filter:grayscale(1)"' : ''}><circle r="${r}" fill="${TPB_BG[id]}" stroke="${INK2}" stroke-width="${f1(r * 0.1)}"/><g transform="scale(${f1(r / 100 * 0.84)})">${TPB_ICON[id]()}</g></g>`;
}
const tpSlotXY = (ti, k) => [1625 + k * 105, TPB_RY(ti) + 52];

// bảng (khung R). o.placed = [{id, tier, slot, note}], o.slide = t0 trượt vào (undefined = có sẵn), o.drop = {id,tier,slot,t0,note} đang rơi, o.lit = hạng sáng, o.ghost = hiện hàng chờ, o.star = hiện chú thích dấu *
function tpBoard(t, o = {}) {
  const k = o.slide == null ? 1 : EZ.expoOut(FIN(t, o.slide, 0.7)), ox = (1 - k) * 470;
  let s = `<g transform="translate(${f1(ox)} 0)"><rect x="${TPB_X}" y="0" width="${TPB_W}" height="1080" fill="${K_P2}"/><rect x="${TPB_X}" y="0" width="8" height="1080" fill="${INK2}"/>`;
  s += kText('XẾP HẠNG', TPB_X + 235, 66, 50) + kText('TRẬN PHÁP · PHẦN 1', TPB_X + 235, 100, 26, { c: K_RED });
  TPB_TIERS.forEach(([L, c], ti) => {
    const y = TPB_RY(ti), lit = o.lit === L ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    s += `<rect x="${TPB_X + 20}" y="${y}" width="74" height="126" rx="10" fill="${c}" stroke="${INK2}" stroke-width="5"/>` + kText(L, TPB_X + 57, y + 90, 66, { font: `'Bangers', ${FH}`, c: '#fff' }) +
      `<rect x="${TPB_X + 102}" y="${y}" width="${TPB_W - 120}" height="126" rx="10" fill="${K_P1}" stroke="${INK2}" stroke-width="4"/>`;
    if (L === 'S') s += `<rect x="${TPB_X + 102}" y="${y}" width="${TPB_W - 120}" height="126" rx="10" fill="#FFD25A" opacity="${f1(0.18 + 0.1 * Math.sin(t * 2.2) + lit * 0.3)}"/>`;
    else if (lit) s += `<rect x="${TPB_X + 102}" y="${y}" width="${TPB_W - 120}" height="126" rx="10" fill="#fff" opacity="${f1(lit * 0.35)}"/>`;
  });
  const draw = (p, extra = {}) => { const [x, y] = tpSlotXY(TPB_TI[p.tier], p.slot); return tpChip(p.id, x, y, 36, extra) + kText(TPB_NAME[p.id] + (p.star ? '*' : ''), x, y + 58, 16) + (p.note ? kText(p.note, x, y + 74, 14, { c: K_RED }) : ''); };
  (o.placed || []).forEach(p => { s += draw(p); });
  // hàng chờ (mờ, tên tiếng Việt)
  if (o.ghost !== false) {
    const done = new Set([...(o.placed || []).map(p => p.id), ...(o.drop ? [o.drop.id] : [])]);
    s += kText('CHỜ XẾP', TPB_X + 235, 846, 22, { c: '#8A7A62' });
    TPB_ORDER.forEach((id, i) => { if (done.has(id)) return; const col = i % 2, row = Math.floor(i / 2), x = TPB_X + 64 + col * 214, y = 884 + row * 46; s += tpChip(id, x, y, 21, { ghost: true, op: 0.55 }) + `<text x="${x + 32}" y="${y + 8}" font-family="${FH}" font-size="22" fill="#8A7A62">${TPB_NAME[id]}</text>`; });
  }
  if (o.star) s += kText('* = chưa có cảnh để chấm, xếp tạm', TPB_X + 235, 1062, 17, { c: K_RED });
  s += `</g>`;
  // ô đang rơi vào bảng (vẽ ngoài nhóm trượt)
  if (o.drop) {
    const d = o.drop, u = clamp((t - d.t0) / 0.5), [tx, ty] = tpSlotXY(TPB_TI[d.tier], d.slot);
    if (t >= d.t0 && u < 1) { const e = EZ.quartOut(u), x = lerp(1180, tx, e), y = lerp(520, ty, e) - Math.sin(u * Math.PI) * 120, sc = lerp(3.2, 1, e); s += `<g ${GL.add} opacity="0.6">` + bloom(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(60 * sc)}" fill="#fff" opacity="0.3"/>`, '#FFE9A0', 0.8) + `</g>` + tpChip(d.id, x, y, 36, { sc, rot: (1 - e) * -14 }); }
    else if (t >= d.t0 + 0.5) { s += draw(d, { sc: 1 + 0.18 * Math.exp(-(t - d.t0 - 0.5) * 14) }) + shockRing(t, d.t0 + 0.5, tx, ty, { r: d.tier === 'S' ? 260 : 150, c: d.tier === 'S' ? '#FFD25A' : '#FFFFFF', dur: 0.5 }); if (d.tier === 'S') s += glowSparks(t, d.t0 + 0.5, tx, ty, { n: 26, speed: 420, c: '#FFE9A0', dur: 0.8 }); }
  }
  return s;
}
// dải hạng mỏng (khung V)
function tpRail(t, o = {}) {
  let s = `<rect x="1830" y="0" width="90" height="1080" fill="${K_P2}"/><rect x="1830" y="0" width="6" height="1080" fill="${INK2}"/>`;
  TPB_TIERS.forEach(([L, c], ti) => { const y = 30 + ti * 202; s += `<rect x="1842" y="${y}" width="68" height="188" rx="9" fill="${c}" stroke="${INK2}" stroke-width="4"/>` + kText(L, 1876, y + 56, 50, { font: `'Bangers', ${FH}`, c: '#fff' }); (o.placed || []).filter(p => TPB_TI[p.tier] === ti).forEach((p, i) => { s += tpChip(p.id, 1876, y + 100 + i * 48, 20); }); });
  return s;
}
// khung R: stage = cảnh vẽ 1920 (lấy giữa, lệch -225), bảng bên phải
// TOÀN KHUNG (người dùng 21:06: bảng không được nằm một bên mãi; video đầu chỉ hiện bảng ở cảnh bảng). Cảnh truyện/đánh = full 1920×1080, không bảng, không dải.
function tpFrameR(stage, t, board) { return `<defs><clipPath id="tpClipF"><rect width="1920" height="1080"/></clipPath></defs><g clip-path="url(#tpClipF)">${stage}</g>`; }
function tpFrameV(stage, t, o) { return tpFrameR(stage, t); }

// thẻ tên trận: dải dưới sân khấu 2,5 s
function tpStrap(t, t0, name, sub, dur = 2.5) {
  const d = t - t0; if (d < 0 || d > dur) return '';
  const k = EZ.expoOut(clamp(d / 0.4)) * (d > dur - 0.4 ? clamp((dur - d) / 0.4) : 1), y = lerp(1100, 850, k);
  return `<g transform="translate(0 ${f1(y - 850)})" opacity="${f1(Math.min(1, k * 1.4))}"><rect x="0" y="850" width="1920" height="150" fill="#14101C" opacity="0.88"/><rect x="0" y="850" width="14" height="150" fill="#FFD25A"/>` +
    `<text x="48" y="920" font-family="${FH}" font-size="58" fill="#FFFFFF">${name}</text><text x="48" y="968" font-family="${FH}" font-size="30" fill="#FFD25A">${sub}</text></g>`;
}
// tự xuống dòng theo bề rộng (ước 0,5 × cỡ chữ mỗi ký tự); giữ \n có sẵn
function tpWrap(txt, size, width) { const maxc = Math.max(8, Math.floor(width / (size * 0.46))), out = []; txt.split('\n').forEach(par => { let cur = ''; par.split(' ').forEach(w => { if ((cur + ' ' + w).trim().length > maxc && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); }); return out; }
// thẻ chấm CÔNG/THỦ (nền giấy trơn, người dẫn trái): o.cong = {t, lines:[[t, text]...], head}, o.thu = {…}
function tpCardCD(t, o = {}) {
  let s = `<rect width="1920" height="1080" fill="${K_P1}"/><rect x="70" y="40" width="1780" height="1000" rx="24" fill="${K_P2}" opacity="0.35"/>`;
  const col = (key, x, color, title, icon) => {
    const c = o[key]; if (!c) return '';
    const lit = clamp((t - c.t) / 0.35), on = t >= c.t, w = 500, y = 160;
    let g = `<g opacity="${f1(on ? 1 : 0.28)}"><rect x="${x}" y="${y}" width="${w}" height="700" rx="20" fill="${K_P1}" stroke="${on ? color : '#8A7A62'}" stroke-width="${on ? 9 : 5}"/>`;
    g += `<rect x="${x}" y="${y}" width="${w}" height="120" rx="20" fill="${on ? color : '#B8AA8A'}"/><rect x="${x}" y="${y + 90}" width="${w}" height="30" fill="${on ? color : '#B8AA8A'}"/>` + kText(title, x + w / 2 + 30, y + 88, 74, { font: `'Bangers', ${FH}`, c: '#fff' }) + icon(x + 70, y + 60);
    (c.lines || []).forEach(([tl, tx, st], i) => { const ky = clamp((t - tl) / 0.3); if (ky <= 0) return; const yy = y + 200 + i * (c.step || 150); g += `<g opacity="${f1(ky)}" transform="translate(0 ${f1((1 - ky) * 14)})">` + (st && st.icon ? st.icon(x + 62, yy + 30) : `<circle cx="${x + 56}" cy="${yy + 18}" r="10" fill="${color}"/>`) + tpWrap(tx, (st && st.size) || 34, w - 130).map((ln, j) => `<text x="${x + 108}" y="${yy + 26 + j * ((((st && st.size) || 34)) * 1.2)}" font-family="${FH}" font-size="${(st && st.size) || 34}" fill="${INK2}">${ln}</text>`).join('') + `</g>`; });
    return g + `</g>`;
  };
  const sword = (x, y) => `<g transform="translate(${x} ${y}) rotate(-45) scale(0.5)"><path d="M-70 -7 L60 -6 L88 0 L60 6 L-70 7Z" fill="#fff" stroke="${INK2}" stroke-width="6"/><rect x="-92" y="-18" width="22" height="36" fill="#C9A24A" stroke="${INK2}" stroke-width="5"/></g>`;
  const shield = (x, y) => `<g transform="translate(${x} ${y}) scale(0.5)"><path d="M0 -56 L50 -38 L44 20 Q36 50 0 66 Q-36 50 -44 20 L-50 -38Z" fill="#fff" stroke="${INK2}" stroke-width="7"/><path d="M0 -36 V44 M-26 0 H26" stroke="${INK2}" stroke-width="6"/></g>`;
  s += col('cong', 560, '#2E5F8A', 'CÔNG', sword) + col('thu', 1090, '#3E7A4E', 'THỦ', shield);
  return s;
}

// ===== BẢNG TOÀN KHUNG (chỉ dùng ở cảnh bảng: mo_luat, vào bảng, giữa video, kết) =====
const TPW_RY = (ti) => 150 + ti * 150;
const tpSlotWXY = (ti, k) => [372 + 92 + k * 190, TPW_RY(ti) + 46];   // tâm huy hiệu cách đỉnh hàng 46; nhãn tên nằm dưới huy hiệu, trong hàng cao 130
function tpBoardW(t, o = {}) {
  let s = `<rect width="1920" height="1080" fill="${K_P1}"/><rect x="40" y="30" width="1840" height="1020" rx="26" fill="${K_P2}" opacity="0.3"/>`;
  s += kText('XẾP HẠNG TRẬN PHÁP · PHẦN 1', 1040, 106, 62, { c: K_RED });
  TPB_TIERS.forEach(([L, c], ti) => {
    const y = TPW_RY(ti), lit = o.lit === L ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    s += `<rect x="250" y="${y}" width="112" height="130" rx="12" fill="${c}" stroke="${INK2}" stroke-width="6"/>` + kText(L, 306, y + 94, 88, { font: `'Bangers', ${FH}`, c: '#fff' }) + `<rect x="372" y="${y}" width="1440" height="130" rx="12" fill="${K_P1}" stroke="${INK2}" stroke-width="5"/>`;
    if (lit) s += `<rect x="372" y="${y}" width="1440" height="130" rx="12" fill="#fff" opacity="${f1(lit * 0.35)}"/>`;
  });
  const draw = (p, extra = {}) => { let [x, y] = tpSlotWXY(TPB_TI[p.tier], p.slot); if (p.from !== undefined) x = lerp(tpSlotWXY(TPB_TI[p.tier], p.from)[0], x, EZ.quartOut(clamp((t - p.mt) / 0.4))); return tpChip(p.id, x, y, 38, extra) + kText(TPB_NAME[p.id] + (p.star ? '*' : ''), x, y + 70, 22) + (p.note ? kText(p.note, x + 96, y + 8, 24, { c: K_RED }) : ''); };
  (o.placed || []).forEach(p => { s += draw(p); });
  if (o.ghost !== false) {
    const done = new Set([...(o.placed || []).map(p => p.id), ...(o.drop ? [o.drop.id] : [])]);
    const t0 = o.showAt ?? 0;
    TPB_ORDER.forEach((id, i) => { if (done.has(id)) return; const k = EZ.backOut(clamp((t - t0 - i * 0.13) / 0.3)); if (k <= 0) return; const x = 560 + i * 150, y = 968 + Math.sin(t * 1.6 + i) * 4; s += tpChip(id, x, y, 38, { sc: k }) + kText(TPB_NAME[id], x, y + 62, 22, { op: clamp(k) }); });
  }
  if (o.star) s += kText('* = chưa có cảnh để chấm, xếp tạm', 1500, 1036, 24, { c: K_RED });
  if (o.drop) {
    const d = o.drop, u = clamp((t - d.t0) / 0.5), [tx, ty] = tpSlotWXY(TPB_TI[d.tier], d.slot);
    if (t >= d.t0 && u < 1) { const e = EZ.quartOut(u), x = lerp(960, tx, e), y = lerp(540, ty, e) - Math.sin(u * Math.PI) * 140, sc = lerp(3.0, 1, e); s += `<g ${GL.add} opacity="0.6">` + bloom(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(60 * sc)}" fill="#fff" opacity="0.3"/>`, '#FFE9A0', 0.8) + `</g>` + tpChip(d.id, x, y, 38, { sc, rot: (1 - e) * -14 }); }
    else if (t >= d.t0 + 0.5) { s += draw(d, { sc: 1 + 0.18 * Math.exp(-(t - d.t0 - 0.5) * 14) }) + shockRing(t, d.t0 + 0.5, tx, ty, { r: d.tier === 'S' ? 320 : 190, c: d.tier === 'S' ? '#FFD25A' : '#FFFFFF', dur: 0.5 }); if (d.tier === 'S') s += glowSparks(t, d.t0 + 0.5, tx, ty, { n: 30, speed: 480, c: '#FFE9A0', dur: 0.8 }); }
  }
  return s;
}

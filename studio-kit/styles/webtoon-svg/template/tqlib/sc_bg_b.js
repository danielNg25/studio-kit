// ===== NỀN TẬP GIA CÁT LƯỢNG — nhóm B (2026-10-17): tua, bo_song, thuy_trai, dan_gio, xich_bich, thuyen_du
// Mọi nền: bg_<tên>(t, o) trả SVG 1920×1080; nhân vật đứng ở ground ≈ 1075. Helper riêng tiền tố tqB_.
// Dùng sc_tqkit.js + sc_tdkit.js + sc_bgkit.js + sc_sets.js.

// ---------- helper chung nhóm B ----------
const tqB_lg = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => `<defs><linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient></defs>`;
const tqB_rg = (id, cx, cy, r, stops) => `<defs><radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient></defs>`;
// quầng sáng tròn mềm (gradient, không blur)
const tqB_glow = (id, cx, cy, r, c, op = 0.5) => tqB_rg(id, cx, cy, r, [[0, c, op], [0.45, c, op * 0.4], [1, c, 0]]) + `<circle cx="${R1(cx)}" cy="${R1(cy)}" r="${r}" fill="url(#${id})"/>`;

// cờ có sóng: ghim ở (x, y); len = chiều dài vải; fh = chiều cao vải; wind 0..1 (0 rủ xuống, 1 bay thẳng phải)
function tqB_flag(x, y, len, fh, c, T, wind = 1, o = {}) {
  const th = (1 - wind) * 1.36 + 0.04 + Math.sin(T * 0.9 + x * 0.01) * 0.05 * (1 - wind) + (o.droop || 0);
  const d = [Math.cos(th), Math.sin(th)], a = [-Math.sin(th), Math.cos(th)], nr = [-d[1], d[0]], sh0 = fh * Math.sin(th);
  const amp = (3 + 15 * wind) * (o.amp || 1), ph = T * (1.6 + 3.4 * wind) + x * 0.02;
  const P = (u, v) => { const w = Math.sin(ph - u * (4.5 + 3 * wind)) * amp * (0.15 + u); return [x + sh0 + d[0] * len * u + a[0] * fh * v + nr[0] * w, y + d[1] * len * u + a[1] * fh * v + nr[1] * w]; };
  const N = 14, pt = (u, v) => P(u, v).map(R1).join(' ');
  let top = [], bot = [];
  for (let i = 0; i <= N; i++) { top.push(pt(i / N, 0)); bot.push(pt(1 - i / N, 1)); }
  const tail = o.tail ? `L${pt(0.8, 0.5)} ` : '';
  let s = `<path d="M${top.join(' L')} ${tail}L${bot.join(' L')}Z" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/>`;
  // dải bóng dưới + viền vàng
  const sh = []; for (let i = 0; i <= N; i++) sh.push(pt(i / N, 0.78)); for (let i = N; i >= 0; i--) sh.push(pt(i / N, 1));
  s += `<path d="M${sh.join(' L')}Z" fill="${dk(c, 0.25)}" opacity="0.55"/>`;
  if (o.trim !== false) { const tr = []; for (let i = 1; i < N; i++) tr.push(pt(i / N, 0.1)); s += `<path d="M${tr.join(' L')}" stroke="${o.trim || TQ.gold}" stroke-width="${R1(Math.max(2.5, fh * 0.05))}" fill="none"/>`; }
  if (o.stars) { // bảy sao (Bắc Đẩu) trên nền cờ
    const st = [[0.16, 0.34], [0.3, 0.44], [0.44, 0.4], [0.56, 0.5], [0.58, 0.74], [0.8, 0.72], [0.82, 0.5]];
    const pp = st.map(([u, v]) => P(u, v)); s += `<path d="M${pp.map(p => p.map(R1).join(' ')).join(' L')}" stroke="${TQ.gold}" stroke-width="2.5" fill="none" opacity="0.8"/>` + pp.map(p => `<circle cx="${R1(p[0])}" cy="${R1(p[1])}" r="${R1(Math.max(4, fh * 0.055))}" fill="#FFF1B8" stroke="${INK2}" stroke-width="2"/>`).join('');
  }
  if (o.txt) { const p = P(0.5, 0.58), ang = Math.atan2(d[1], d[0]) * 180 / Math.PI; s += `<text x="${R1(p[0])}" y="${R1(p[1])}" transform="rotate(${R1(ang)} ${R1(p[0])} ${R1(p[1])})" font-family="${FH}" font-size="${o.fs || fh * 0.42}" fill="#F6E7B8" stroke="${INK2}" stroke-width="2" text-anchor="middle" paint-order="stroke">${o.txt}</text>`; }
  return s;
}
// cột cờ + cờ: chân (x, g), cao h
function tqB_flagPole(x, g, h, c, T, wind, o = {}) {
  const pw = o.pw || 9;
  return `<path d="M${x} ${g} V${g - h}" stroke="${INK2}" stroke-width="${pw + 5}" stroke-linecap="round"/><path d="M${x} ${g} V${g - h}" stroke="${TQ.wood}" stroke-width="${pw}" stroke-linecap="round"/><circle cx="${x}" cy="${g - h - 6}" r="${R1(pw * 0.85)}" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>` + tqB_flag(x + 2, g - h + 6, o.len || 110, o.fh || 80, c, T, wind, o);
}
// sóng cuộn (dải lượn đầy phía dưới), y = mép trên, amp biên độ, wl bước sóng
function tqB_wave(y, amp, wl, T, fill, o = {}) {
  const ph = (T * (o.sp ?? 18) + (o.seed || 0) * 97) % wl, x0 = -wl * 2 + ph * (o.dir || 1);
  const n = Math.ceil((1920 + wl * 4) / wl);
  let seg, crests = '';
  if (o.peaky) {
    const sd = o.seed || 1;
    seg = (yy) => { let d = `M${R1(x0)} ${R1(yy)}`; for (let k = 0; k < n; k++) { const x = x0 + k * wl, a = amp * (0.65 + 0.7 * hrnd(k, sd)); d += ` C${R1(x + wl * 0.34)} ${R1(yy - a * 0.15)} ${R1(x + wl * 0.5)} ${R1(yy - a * 1.5)} ${R1(x + wl * 0.6)} ${R1(yy - a)} C${R1(x + wl * 0.7)} ${R1(yy - a * 0.5)} ${R1(x + wl * 0.86)} ${R1(yy + a * 0.12)} ${R1(x + wl)} ${R1(yy)}`; } return d; };
    for (let k = 0; k < n; k++) { const x = x0 + k * wl, a = amp * (0.65 + 0.7 * hrnd(k, sd)); crests += `<path d="M${R1(x + wl * 0.42)} ${R1(y - a * 0.95)} Q${R1(x + wl * 0.54)} ${R1(y - a * 1.5)} ${R1(x + wl * 0.62)} ${R1(y - a * 1.0)}" stroke="${o.foam || '#FFF0D8'}" stroke-width="${R1(o.cw || 4)}" fill="none" stroke-linecap="round" opacity="0.85"/><path d="M${R1(x + wl * 0.64)} ${R1(y - a * 0.9)} q${R1(wl * 0.05)} ${R1(a * 0.2)} ${R1(wl * 0.12)} ${R1(a * 0.5)}" stroke="${o.foam || '#FFF0D8'}" stroke-width="${R1((o.cw || 4) * 0.7)}" fill="none" stroke-linecap="round" opacity="0.55"/>`; }
  } else seg = (yy) => `M${R1(x0)} ${R1(yy)} q${R1(wl / 4)} ${R1(-amp)} ${R1(wl / 2)} 0` + ` t${R1(wl / 2)} 0`.repeat(n * 2);
  let s = `<path d="${seg(y)} V1100 H${R1(x0)}Z" fill="${fill}" stroke="${INK2}" stroke-width="${o.sw ?? 3.5}" stroke-linejoin="round"/>`;
  if (o.crest) s += `<path d="${seg(y + 10)}" stroke="${o.crest}" stroke-width="${o.cw || 3.5}" fill="none" stroke-linecap="round" opacity="${o.cop ?? 0.7}"/>`;
  return s + crests;
}
// mây dải dẹt kiểu hoàng hôn: (x, y) mép dưới trái; w rộng; h cao
function tqB_streak(x, y, w, h, c, c2, T, i = 0, o = {}) {
  const dx = Math.sin(T * 0.12 + i * 1.9) * 24, X = x + dx;
  const d = `M${R1(X)} ${y} Q${R1(X)} ${R1(y - h * 0.55)} ${R1(X + w * 0.14)} ${R1(y - h * 0.5)} Q${R1(X + w * 0.24)} ${R1(y - h * 1.2)} ${R1(X + w * 0.44)} ${R1(y - h * 0.88)} Q${R1(X + w * 0.62)} ${R1(y - h * 1.15)} ${R1(X + w * 0.78)} ${R1(y - h * 0.5)} Q${R1(X + w)} ${R1(y - h * 0.5)} ${R1(X + w)} ${y}Z`;
  return `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/><path d="M${R1(X + w * 0.02)} ${R1(y - h * 0.28)} Q${R1(X + w * 0.5)} ${R1(y - h * 0.12)} ${R1(X + w * 0.98)} ${R1(y - h * 0.3)} L${R1(X + w)} ${y} L${R1(X)} ${y}Z" fill="${c2}" opacity="0.75"/><path d="M${R1(X + w * 0.16)} ${R1(y - h * 0.58)} Q${R1(X + w * 0.26)} ${R1(y - h * 1.05)} ${R1(X + w * 0.42)} ${R1(y - h * 0.82)}" stroke="${o.hi || '#FFFFFF'}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${o.hiOp ?? 0.45}"/>`;
}
// thuyền buồm nan (junk) bóng đổ/ngược sáng: (x, g) giữa thân ở mực nước
function tqB_junk(x, g, s, col, T, o = {}) {
  const bob = Math.sin(T * 1.1 + x * 0.01) * 2.5, sail = o.sail || '#7A3448', lit = o.lit || '#FFB45C';
  let b = `<ellipse cx="0" cy="16" rx="200" ry="7" fill="${col}" opacity="0.4"/>`;
  b += `<path d="M20 -26 V-340" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/>`;
  b += `<path d="M-150 -312 Q-10 -326 128 -306 L112 -70 Q-10 -52 -128 -76Z" fill="${sail}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 6; i++) { const yy = -312 + i * 40; b += `<path d="M${-146 + i * 3} ${yy + 4 - i * 1.6} Q-10 ${yy - 8 + i * 2} ${126 - i * 3} ${yy + 2 + i * 3.4}" stroke="${INK2}" stroke-width="4" fill="none" opacity="0.85"/>`; }
  b += `<path d="M126 -306 L110 -74" stroke="${lit}" stroke-width="6" fill="none" opacity="0.85"/><path d="M-148 -312 Q-10 -326 126 -306" stroke="${lit}" stroke-width="4" fill="none" opacity="0.6"/>`;
  b += `<path d="M-212 -66 Q-196 -6 -120 8 H110 Q196 6 226 -34 L246 -90 Q214 -60 160 -58 H-176Z" fill="${col}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  b += `<path d="M-176 -58 H160" stroke="${lit}" stroke-width="3" opacity="0.5"/><rect x="118" y="-112" width="82" height="56" fill="${col}" stroke="${INK2}" stroke-width="4"/><path d="M106 -112 H212 L196 -136 H122Z" fill="${col}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`;
  const wv = Math.sin(T * 3 + x * 0.02) * 6;
  b += `<path d="M20 -340 L${R1(86 + wv)} -330 L${R1(70 + wv)} -318 L${R1(88 + wv)} -306 L20 -312Z" fill="${col}" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/>`;
  return `<g transform="translate(${R1(x)} ${R1(g + bob)}) scale(${o.flip ? -s : s} ${s})">${b}</g>`;
}
// liễu rủ: (x, g) chân; s tỉ lệ
function tqB_willow(x, g, s, T, c = '#86AE52') {
  const c2 = dk(c, 0.2), c3 = lt_(c, 0.22), tr = '#6B4A30';
  let b = `<path d="M-26 0 Q-18 -90 -34 -170 Q-56 -226 -24 -268 L30 -272 Q62 -222 40 -160 Q22 -90 28 0Z" fill="${tr}" stroke="${INK2}" stroke-width="5"/><path d="M-6 -20 q4 -60 -4 -120 M12 -40 q-6 -50 4 -100" stroke="${dk(tr, 0.3)}" stroke-width="3" fill="none"/><path d="M-30 -230 Q-90 -270 -130 -250 M30 -240 Q86 -290 136 -270" stroke="${INK2}" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M-30 -230 Q-90 -270 -130 -250 M30 -240 Q86 -290 136 -270" stroke="${tr}" stroke-width="9" stroke-linecap="round" fill="none"/>`;
  b += [[-110, -268, 62], [0, -318, 74], [118, -290, 64], [-40, -290, 58], [60, -306, 56]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${INK2}" stroke-width="5"/>`).join('');
  const N = 22;
  for (let i = 0; i < N; i++) {
    const sx = -190 + i * (380 / (N - 1)), sy = -250 - 40 * Math.sin(Math.PI * i / (N - 1)) + (i % 2) * 8, len = 150 + hrnd(i, 4) * 110 - Math.abs(i - N / 2) * 4, dxo = Math.sin(T * 1.3 + i * 0.8 + x * 0.01) * (8 + len * 0.05);
    const dd = `M${R1(sx)} ${R1(sy)} Q${R1(sx + dxo * 0.2)} ${R1(sy + len * 0.55)} ${R1(sx + dxo)} ${R1(sy + len)}`;
    b += `<path d="${dd}" stroke="${INK2}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${dd}" stroke="${i % 3 ? c : c3}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  b += [[-110, -268], [118, -290], [0, -318]].map(([cx, cy]) => `<path d="M${cx - 30} ${cy - 10} q14 -14 28 0" stroke="${c3}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>`).join('');
  return _g(x, g, s, b + `<ellipse cx="0" cy="6" rx="120" ry="14" fill="#20140A" opacity="0.14"/>`);
}

// ---------- 1. Màn tựa: Trường Giang chiều tà
// bg_tua(t): mặt trời lớn thấp đỏ cam, sóng cuộn, thuyền chiến bóng đổ xa, mây dày lớp. Giữa khung thoáng cho tiêu đề (không nhân vật, ~3,5 s). o: sunX (mặc định 1390)
function bg_tua(t, o = {}) {
  const T = _T(t), HZ = 612, SX = o.sunX ?? 1390, SY = HZ - 26;
  let s = tqB_lg('tqBtSk', [[0, '#221846'], [0.2, '#5A2A5C'], [0.38, '#B03E3E'], [0.5, '#EE7430'], [0.575, '#FFB65C']]) + `<rect width="1920" height="1080" fill="url(#tqBtSk)"/>`;
  s += starsD(18, 150, 21);
  // quầng nắng
  s += tqB_glow('tqBtG1', SX, SY, 640, '#FFC060', 0.55) + tqB_glow('tqBtG2', SX, SY, 330, '#FFE08A', 0.55);
  s += tdRays(SX, SY, 18, '#FFE0A0', 0.07, T, 2000);
  // mặt trời lớn
  s += tqB_rg('tqBtSun', SX, SY, 190, [[0, '#FFF6C8'], [0.7, '#FFD46A'], [1, '#FFB444']]) + `<circle cx="${SX}" cy="${SY}" r="190" fill="url(#tqBtSun)"/>`;
  // mây lớn phía trên (tím sẫm, dày, trôi chậm)
  const dr = T * 3;
  s += tdPuffs([[60 + dr, 20, 130], [210 + dr, 0, 150], [380 + dr, 30, 118], [520 + dr, -6, 100], [130 + dr, 110, 92], [300 + dr, 118, 100], [440 + dr, 96, 70]], '#74386A', 4, { curl: true });
  s += tdPuffs([[1500 - dr, 10, 120], [1650 - dr, -10, 150], [1810 - dr, 20, 140], [1930 - dr, 60, 110], [1580 - dr, 104, 90], [1740 - dr, 112, 98]], '#8A4268', 4, { curl: true });
  // mây dải giữa trời (sáng ở trên, bụng đỏ)
  s += tqB_streak(120, 345, 460, 70, '#E8785A', '#A8404C', T, 1, { hi: '#FFE2B0' });
  s += tqB_streak(1250, 330, 520, 86, '#F69A5C', '#C24E46', T, 2, { hi: '#FFE9B8', hiOp: 0.6 });
  s += tqB_streak(620, 232, 330, 44, '#C85A58', '#7E3856', T, 3, { hi: '#FFC890' });
  s += tqB_streak(-30, 470, 380, 52, '#F28C54', '#B8484A', T, 4, { hi: '#FFE2B0' });
  s += tqB_streak(1560, 468, 420, 56, '#F8A864', '#C8564A', T, 5, { hi: '#FFEBC0', hiOp: 0.6 });
  // núi thấp xa ở hai mép + dải bờ xa
  s += `<path d="M0 ${HZ} V548 Q60 540 110 520 Q160 496 200 520 Q260 548 330 538 Q420 528 480 ${HZ - 6}Z" fill="#6E2E58" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/><path d="M1560 ${HZ} Q1640 566 1700 544 Q1760 522 1810 540 Q1860 556 1920 530 V${HZ}Z" fill="#7A3250" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += `<path d="M0 ${HZ - 8} Q480 ${HZ - 18} 960 ${HZ - 8} T1920 ${HZ - 10} V${HZ + 6} H0Z" fill="#7C3454" stroke="${INK2}" stroke-width="3"/>`;
  // dải mây thấp trên đường chân trời (che chân núi), vắt ngang mặt trời
  s += tqB_streak(1090, 568, 640, 46, '#8E3248', '#5A2448', T, 6, { hi: '#FFA860', hiOp: 0.5 }) + tqB_streak(180, 584, 420, 36, '#9A3A4E', '#602850', T, 7, { hi: '#FFA860', hiOp: 0.4 });
  // mặt nước
  s += tqB_lg('tqBtSea', [[0, '#F58A3C'], [0.1, '#D4583A'], [0.34, '#7C3058'], [1, '#2A1C48']]) + `<rect x="0" y="${HZ}" width="1920" height="${1090 - HZ}" fill="url(#tqBtSea)"/>`;
  // vệt nắng trên nước
  for (let i = 0; i < 16; i++) { const y = HZ + 6 + Math.pow(i, 1.35) * 9.5, w = (300 - i * 12) * (0.75 + 0.25 * Math.sin(T * 2 + i * 1.3)), x = SX + Math.sin(T * 1.4 + i) * (4 + i); s += `<rect x="${R1(x - w / 2)}" y="${R1(y)}" width="${R1(w)}" height="${R1(5 + i * 0.9)}" rx="4" fill="${i < 8 ? '#FFE49A' : '#FFC264'}" opacity="${R1(0.8 - i * 0.032)}"/>`; }
  // thuyền chiến xa (bóng đổ ngược sáng)
  s += tqB_junk(256, 690, 0.62, '#3A1E3E', T, { sail: '#6E2E52', lit: '#FF9A50' }) + tqB_junk(770, 640, 0.3, '#44223F', T, { sail: '#7A3452', flip: true, lit: '#FF9A50' }) + tqB_junk(1048, 664, 0.46, '#3A1E3E', T, { sail: '#7A3448' });
  s += tqB_junk(1690, 712, 0.64, '#331A38', T, { sail: '#682A4C', flip: true }) + tqB_junk(1500, 648, 0.34, '#44223F', T, { sail: '#7A3452' }) + tqB_junk(470, 636, 0.26, '#4A2642', T, { sail: '#824058' });
  // sóng cuộn nhiều lớp (xa → gần)
  const WV = [[666, 9, 200, '#B84A46', '#FFB070'], [716, 15, 250, '#8E3A56', '#F29A62'], [778, 22, 320, '#6A2E58', '#E88A66'], [858, 30, 400, '#4E2858', '#C8706A'], [950, 40, 500, '#3A2250', '#A85C70'], [1040, 52, 620, '#2A1A44', '#8A4C6E']];
  WV.forEach(([y, a, wl, f, cr], i) => { s += tqB_wave(y, a * (i > 1 ? 1.5 : 1), wl, T, f, { sp: 14 + i * 5, seed: i + 1, dir: i % 2 ? 1 : -1, crest: cr, cw: 3 + i * 0.5, sw: 3.5, peaky: i > 0, foam: i > 3 ? '#F2C0A8' : '#FFE8C8' }); });
  // phản chiếu cam trên đỉnh sóng quanh mặt trời
  s += tqB_rg('tqBtRf', SX, 700, 520, [[0, '#FFB45C', 0.35], [1, '#FFB45C', 0]]) + `<ellipse cx="${SX}" cy="720" rx="520" ry="150" fill="url(#tqBtRf)"/>`;
  // chim
  s += tdGull(1210, 410, 1.1, T) + tdGull(1262, 376, 0.9, T) + tdGull(1322, 436, 0.8, T) + birds(130, 2);
  // tối hai mép (điện ảnh)
  s += tqB_rg('tqBtVg', 960, 560, 1250, [[0.55, '#120824', 0], [1, '#120824', 0.55]]) + `<rect width="1920" height="1080" fill="url(#tqBtVg)"/>`;
  return s;
}

// ---------- 2. Bến thuyền Giang Đông ban ngày (thuyền cỏ neo sát nhau, bờ cỏ rộng phía trước)
// bg_bo_song(t, {arrows}): o.arrows = số mũi tên cắm vào MỖI thuyền (mặc định 0); khi >0 cắm thêm vài mũi tên xuống sàn cầu tàu. Mặt đất bằng rộng y 860–1075.
function bg_bo_song(t, o = {}) {
  const T = _T(t), AR = o.arrows | 0, PY = 792; // PY = mép trên mặt cầu tàu
  let s = wxSky(t, { id: 'tqBbSk', c1: '#7DBEE4', c2: '#EAF5F0', sun: [1560, 170, 54], sunC: '#FFF6D0', birds: true });
  // núi xa + sương
  s += wxPeaks(470, '#A6C6CE', 3, 0.9) + wxMist(440, 0.5, '#F2F6F0', T) + wxPeaks(520, '#86AEA4', 7, 0.5) + wxMist(500, 0.45, '#F2F6F0', T + 3);
  // bờ xa: dải đất xanh, rừng, mái nhà, tháp
  s += `<path d="M0 548 Q320 526 700 544 T1360 538 T1920 546 V576 H0Z" fill="#86A468" stroke="${INK2}" stroke-width="3.5"/>` + farTrees(40, 538, '#5E8A4E', 12);
  s += [[260, 544], [700, 540], [1640, 544]].map(([x, y]) => `<rect x="${x - 34}" y="${y - 24}" width="68" height="24" fill="#E0D2AA" stroke="${INK2}" stroke-width="3"/><path d="M${x - 46} ${y - 24} L${x - 22} ${y - 52} H${x + 22} L${x + 46} ${y - 24}Z" fill="#6A5E52" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/><rect x="${x - 8}" y="${y - 16}" width="16" height="16" fill="#5A4632" stroke="${INK2}" stroke-width="2"/>`).join('');
  s += wxPagoda(1230, 548, 0.32, 5, '#EADCC0');
  // mặt sông
  s += tqRiver(550, T, { id: 'bs', c1: '#9CCBD6', c2: '#4F8FA8', refl: [[1560, '#FFF6D0', 50]], rows: 14, rip: '#FFFFFF', ripOp: 0.5 });
  // thuyền xa
  for (let i = 0; i < 4; i++) s += tqBoatD(210 + i * 150, 616, 0.22, T, {});
  s += tqShipD(1490, 604, 0.3, T, { col: TQ.wu, sail: true, flagTxt: '', roof: '#3E4A44', bob: 2 }) + tqShipD(1000, 590, 0.24, T, { col: TQ.wu, sail: 'furled', flagTxt: '', roof: '#3E4A44', oars: false, bob: 2 });
  s += tqFog([[640, 70, 0.2]], T, '#F2F6F0', { wisps: false });
  // hàng thuyền cỏ neo sát nhau (8 chiếc) dọc cầu tàu
  const BX = [120, 330, 540, 750, 960, 1170, 1380, 1590, 1800];
  const bo = (x, i) => { const g = 744 + (i % 3 === 1 ? 4 : 0) - (i % 2 ? 2 : 0), sc = 0.62 + (i % 2) * 0.02; let b = tqBoatD(x, g, sc, T, { tilt: (i % 3 - 1) * 0.5 }); if (AR) { const bob = Math.sin(T * 1.6 + x * 0.011) * 3, tl = (i % 3 - 1) * 0.5 + Math.sin(T * 1.3 + x * 0.02); let a = ''; for (let k = 0; k < AR; k++) { const ax = -150 + hrnd(k, i, 8) * 300, ay = -78 - hrnd(k, i, 9) * 150, ang = 18 + hrnd(k, i, 10) * 32, fl = hrnd(k, i, 11) > 0.5 ? -1 : 1; a += `<g transform="translate(${R1(ax)} ${R1(ay)}) rotate(${R1(ang * fl)}) scale(${fl} 1)"><path d="M0 0 H-66" stroke="${INK2}" stroke-width="5.5"/><path d="M0 0 H-66" stroke="#E8D8B0" stroke-width="2.6"/><path d="M-66 0 l-14 -7 M-66 0 l-14 7 M-56 0 l-12 -6 M-56 0 l-12 6" stroke="${TQ.shu}" stroke-width="3.2"/></g>`; } b += `<g transform="translate(${R1(x)} ${R1(g + bob)}) rotate(${R1(tl)}) scale(${sc} ${sc})">${a}</g>`; } return b; };
  BX.forEach((x, i) => { s += bo(x, i); });
  // dây thừng buộc thuyền vào cọc
  const POSTS = [90, 300, 510, 720, 930, 1140, 1350, 1560, 1770];
  POSTS.forEach((px, i) => { const bx = BX[i] - 40; s += `<path d="M${bx} 712 Q${R1((bx + px) / 2)} 770 ${px} ${PY - 34}" stroke="${INK2}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${bx} 712 Q${R1((bx + px) / 2)} 770 ${px} ${PY - 34}" stroke="#D8C28A" stroke-width="3" fill="none" stroke-linecap="round"/>`; });
  // cầu tàu gỗ dài
  s += `<rect x="-20" y="${PY + 28}" width="1960" height="30" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/>`;
  s += `<path d="M-20 ${PY} H1940 V${PY + 30} H-20Z" fill="#B88A58" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 44; i++) { const x = -10 + i * 46; s += `<path d="M${x} ${PY} L${x - 8} ${PY + 30}" stroke="${TQ.wood2}" stroke-width="3" opacity="0.8"/>`; if (i % 3 === 0) s += `<path d="M${x + 14} ${PY + 12} h20" stroke="${dk('#B88A58', 0.25)}" stroke-width="3" opacity="0.7"/>`; }
  s += `<path d="M-20 ${PY + 8} H1940" stroke="#D8AE78" stroke-width="4" opacity="0.6"/>`;
  for (let i = 0; i < 12; i++) { const x = 40 + i * 168; s += `<path d="M${x} ${PY + 28} V${PY + 58}" stroke="${INK2}" stroke-width="4"/><rect x="${x - 12}" y="${PY + 58}" width="24" height="22" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="4"/>`; }
  // cọc neo thuyền
  POSTS.forEach(px => { s += `<rect x="${px - 12}" y="${PY - 44}" width="24" height="56" rx="6" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="4.5"/><path d="M${px - 12} ${PY - 26} H${px + 12} M${px - 12} ${PY - 14} H${px + 12}" stroke="#D8C28A" stroke-width="4"/><ellipse cx="${px}" cy="${PY - 44}" rx="12" ry="5" fill="${lt_(TQ.wood3, 0.2)}" stroke="${INK2}" stroke-width="3"/>`; });
  // mũi tên cắm xuống sàn cầu tàu
  if (AR) for (let i = 0; i < 5 + AR * 2; i++) { const px = 60 + hrnd(i, 31) * 1800, py = PY + 8 + hrnd(i, 32) * 16, k = (hrnd(i, 33) - 0.5) * 24; s += `<g transform="translate(${R1(px)} ${R1(py)}) rotate(${R1(k)})"><path d="M0 0 V-54" stroke="${INK2}" stroke-width="6"/><path d="M0 0 V-54" stroke="#E8D8B0" stroke-width="3"/><path d="M0 -54 l-7 -14 M0 -54 l7 -14 M0 -44 l-6 -12 M0 -44 l6 -12" stroke="${TQ.shu}" stroke-width="3.4"/></g>`; }
  // nước ven bờ + bọt
  s += `<path d="M-20 ${PY - 2} H1940" stroke="#FFFFFF" stroke-width="5" opacity="0.55"/>`;
  // bờ cỏ rộng phía trước
  s += tqGroundD(868, '#9DBB6A', '#5E8E3E', 7, { grass: 190, path: [960, 960, 380, 1080] });
  s += `<path d="M0 886 Q480 876 960 884 T1920 880 V900 H0Z" fill="${dk('#9DBB6A', 0.12)}" opacity="0.35"/>`;
  s += flowers(26, 0, 930, 1920, 140, 5) + pebbles(26, 0, 900, 1920, 170, '#A8A078', 4);
  // liễu ven bờ, đá, cờ Ngô
  s += tqB_willow(190, 884, 0.8, T) + tqB_willow(1760, 884, 0.86, T, '#7FA84C');
  s += wxRock(120, 1000, 0.55) + wxRock(1790, 1010, 0.5) + bushD(560, 906, 0.5, '#6E9A44') + bushD(1420, 904, 0.46, '#6E9A44');
  s += tqFlagD(60, 900, 440, TQ.wu, T, { txt: 'NGÔ', w: 140, fh: 170, tail: true }) + tqFlagD(1850, 900, 440, TQ.wu, T, { txt: 'NGÔ', w: 140, fh: 170, tail: true });
  s += wxGrassSides(1000, '#6E9A44', '#86B058', 8, [420, 1500]) + motes(10, 0, 560, 1920, 400, '#FFFFFF', 0.4, 4);
  return s;
}

// ---------- giá cung (trại quân): (x, g) chân; s tỉ lệ
function tqB_bowRack(x, g, s = 1) {
  let b = `<path d="M-100 0 L-84 -230 M100 0 L84 -230" stroke="${INK2}" stroke-width="15" stroke-linecap="round"/><path d="M-100 0 L-84 -230 M100 0 L84 -230" stroke="${TQ.wood}" stroke-width="8" stroke-linecap="round"/>`;
  b += `<path d="M-96 -200 H96 M-92 -110 H92" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M-96 -200 H96 M-92 -110 H92" stroke="${TQ.wood3}" stroke-width="7" stroke-linecap="round"/>`;
  for (let i = 0; i < 4; i++) { const bx = -62 + i * 41; b += `<path d="M${bx} -222 Q${bx + 34} -150 ${bx} -78" stroke="${INK2}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${bx} -222 Q${bx + 34} -150 ${bx} -78" stroke="${i % 2 ? TQ.wood3 : '#7A4E2C'}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${bx} -222 L${bx} -78" stroke="#E8DCC0" stroke-width="2" opacity="0.9"/>`; }
  // ống tên
  for (let i = 0; i < 2; i++) { const qx = -50 + i * 100; b += `<path d="M${qx - 14} 0 L${qx - 18} -90 H${qx + 18} L${qx + 14} 0Z" fill="${i ? TQ.wei : TQ.shu}" stroke="${INK2}" stroke-width="4"/><path d="M${qx - 12} -90 l-4 -34 M${qx} -90 v-40 M${qx + 12} -90 l4 -34" stroke="${INK2}" stroke-width="3.5"/><path d="M${qx - 12} -90 l-4 -34 M${qx} -90 v-40 M${qx + 12} -90 l4 -34" stroke="#E8DCC0" stroke-width="1.6"/><path d="M${qx - 16} -118 l8 -10 M${qx - 2} -128 l8 -10 M${qx + 14} -118 l8 -10" stroke="${TQ.gold}" stroke-width="3.5"/>`; }
  return _g(x, g, s, b);
}
// bia/cọc nhọn nhỏ & bao cát: trang trí tiền cảnh trại
function tqB_sandbags(x, g, s = 1) {
  let b = ''; for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) { const bx = -90 + r * 30 + i * 60, by = -r * 30; b += `<path d="M${bx - 28} ${by} Q${bx - 32} ${by - 26} ${bx - 14} ${by - 28} H${bx + 14} Q${bx + 32} ${by - 26} ${bx + 28} ${by}Z" fill="${(i + r) % 2 ? '#BBA77C' : '#A8946A'}" stroke="${INK2}" stroke-width="3.5"/><path d="M${bx - 10} ${by - 16} h20" stroke="${dk('#A8946A', 0.3)}" stroke-width="3"/>`; }
  return _g(x, g, s, b);
}

// ---------- 3. Thủy trại Tào Tháo trong sương lúc gần sáng (bờ Bắc)
// bg_thuy_trai(t): hàng cọc cao + cột buồm thuyền Tào sau cọc, 3 tháp canh có đèn, đài chỉ huy gỗ có mái ở giữa phía sau, đuốc/đèn lồng, cờ Ngụy; sàn đất phẳng y 780–1075. Cho: Tào Tháo nghe trống rồi ra lệnh bắn tên.
function bg_thuy_trai(t, o = {}) {
  const T = _T(t), PG = 748;
  let s = tqB_lg('tqBzSk', [[0, '#27325A'], [0.28, '#5A6A94'], [0.44, '#A89CB4'], [0.54, '#F0CDB2']]) + `<rect width="1920" height="1080" fill="url(#tqBzSk)"/>`;
  s += starsD(22, 280, 41) + tqB_glow('tqBzG', 1400, 585, 620, '#FFCBA0', 0.5);
  s += `<circle cx="330" cy="180" r="38" fill="#EFE8D4" opacity="0.8"/><circle cx="330" cy="180" r="76" fill="#EFE8D4" opacity="0.1"/>`;
  // núi + sương xa
  s += wxPeaks(560, '#5A6890', 4, 0.75) + tqFog([[540, 100, 0.55]], T, '#D8D2D8', { wisps: false }) + wxPeaks(604, '#6E7AA0', 9, 0.4) + tqFog([[590, 80, 0.5]], T, '#D8D2D8', { wisps: false });
  // sông sau cọc
  s += tqRiver(600, T, { id: 'tz', c1: '#8590AC', c2: '#3E4C6C', rip: '#DDE2EE', ripOp: 0.3, rows: 8 });
  // cột buồm thuyền Tào nhô lên sau cọc (xa, mờ)
  const mastX = [90, 330, 560, 800, 1090, 1330, 1580, 1820];
  s += `<g opacity="0.9">` + mastX.map((x, i) => tqShipD(x, 712 - (i % 2) * 8, 0.55 + (i % 3) * 0.04, T, { col: TQ.wei, sail: i % 3 === 1 ? true : 'furled', sailC: '#B9B6BA', flagTxt: i % 2 ? 'TÀO' : '', roof: '#3E4A5C', oars: false, bob: 1.5, cabin: i % 2 === 0 })).join('') + `</g>`;
  s += tqFog([[600, 230, 0.8], [520, 120, 0.5]], T, '#D8D6DE') + tqFog([[690, 110, 0.55]], T, '#D8D6DE', { wisps: false });
  // tháp canh xa nhất (mờ)
  s += `<g opacity="0.78">` + tqTowerD(1195, 742, 0.6, T, { lamp: true }) + `</g>`;
  s += tqFog([[640, 110, 0.35]], T, '#CFCFD8', { wisps: false });
  // hàng cọc nhọn cao
  s += tqPalisade(-20, 1940, PG, 200, { c: '#6A5640', gap: 34 });
  s += `<rect x="0" y="${PG - 10}" width="1920" height="22" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="4"/>`;
  s += `<rect x="0" y="${PG - 190}" width="1920" height="180" fill="#9AA6C8" opacity="0.1"/>`;
  // đèn lồng dọc hàng cọc
  [[160, 560], [470, 600], [760, 600], [1170, 600], [1450, 600], [1770, 560]].forEach(([x, y]) => { s += tqB_glow('tqBzL' + x, x, y + 10, 70, '#FFC866', 0.5) + wxLantern(x, y - 20, 0.7, '#D8573A', T); });
  // sàn đất của trại
  s += tqGroundD(PG + 6, '#6C6458', '#55644A', 4, { grass: 70, path: [960, 960, 250, 760] });
  s += `<path d="M0 ${PG + 20} H1920" stroke="${INK2}" stroke-width="3" opacity="0.35"/>`;
  // lều hai bên phía sau
  // đài chỉ huy (giữa, phía sau)
  const DX = 960, DY = 600; // DY = mặt sàn đài
  s += `<g>`;
  for (const dx of [-250, -120, 120, 250]) s += `<path d="M${DX + dx} ${DY + 12} V${PG + 52}" stroke="${INK2}" stroke-width="26"/><path d="M${DX + dx} ${DY + 12} V${PG + 52}" stroke="${TQ.wood}" stroke-width="16"/>`;
  s += `<path d="M${DX - 250} ${DY + 90} L${DX - 120} ${PG + 20} M${DX + 250} ${DY + 90} L${DX + 120} ${PG + 20} M${DX - 120} ${DY + 90} L${DX - 250} ${PG + 20} M${DX + 120} ${DY + 90} L${DX + 250} ${PG + 20}" stroke="${INK2}" stroke-width="10" opacity="0.8"/>`;
  // cầu thang giữa
  s += `<path d="M${DX - 100} ${PG + 52} L${DX - 70} ${DY + 28} H${DX + 70} L${DX + 100} ${PG + 52}Z" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5"/>` + [...Array(6)].map((_, i) => { const y = DY + 28 + (PG + 52 - DY - 28) * (i + 1) / 6.2; return `<path d="M${R1(DX - 70 - 30 * (i + 1) / 6)} ${R1(y)} H${R1(DX + 70 + 30 * (i + 1) / 6)}" stroke="${TQ.wood2}" stroke-width="4"/>`; }).join('');
  // sàn đài
  s += `<rect x="${DX - 300}" y="${DY - 4}" width="600" height="40" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5"/><rect x="${DX - 300}" y="${DY + 22}" width="600" height="14" fill="${TQ.wood2}" opacity="0.7"/>` + [...Array(13)].map((_, i) => `<path d="M${DX - 276 + i * 46} ${DY - 4} v26" stroke="${TQ.wood2}" stroke-width="3"/>`).join('');
  // nội thất tối + màn
  s += `<rect x="${DX - 230}" y="${DY - 210}" width="460" height="206" fill="#3A2C38"/>` + [...Array(9)].map((_, i) => `<path d="M${DX - 200 + i * 50} ${DY - 150} V${DY - 4}" stroke="#2A2030" stroke-width="5" opacity="0.7"/>`).join('') + `<circle cx="${DX}" cy="${DY - 76}" r="54" fill="${TQ.wei2}" stroke="${INK2}" stroke-width="4"/><circle cx="${DX}" cy="${DY - 76}" r="32" fill="none" stroke="${TQ.gold}" stroke-width="5"/>`;
  s += `<path d="M${DX - 230} ${DY - 210} H${DX + 230} V${DY - 150} Q${DX + 150} ${DY - 120} ${DX + 80} ${DY - 150} Q${DX} ${DY - 112} ${DX - 80} ${DY - 150} Q${DX - 150} ${DY - 120} ${DX - 230} ${DY - 150}Z" fill="${TQ.wei}" stroke="${INK2}" stroke-width="4"/>`; s += '';
  // cột mái
  for (const dx of [-236, 236]) s += `<path d="M${DX + dx} ${DY} V${DY - 214}" stroke="${INK2}" stroke-width="24"/><path d="M${DX + dx} ${DY} V${DY - 214}" stroke="${TQ.shu}" stroke-width="14"/>`;
  s += `<rect x="${DX - 250}" y="${DY - 236}" width="500" height="26" fill="${TQ.shu2}" stroke="${INK2}" stroke-width="5"/>`;
  s += wxRoof(DX, DY - 236, 600, 130, { c: '#3E4A5C', tip: TQ.gold, ridge: '#2A323E', lip: 14, pearl: true });
  // lan can trước
  s += `<path d="M${DX - 300} ${DY - 4} V${DY - 46} H${DX + 300} V${DY - 4}" stroke="${INK2}" stroke-width="10" fill="none"/><path d="M${DX - 300} ${DY - 46} H${DX + 300}" stroke="${TQ.wood3}" stroke-width="5"/>` + [...Array(14)].map((_, i) => `<path d="M${DX - 292 + i * 45} ${DY - 4} v-42" stroke="${INK2}" stroke-width="7"/>`).join('');
  s += `</g>`;
  s += wxLantern(DX - 200, DY - 150, 0.8, '#D8573A', T) + wxLantern(DX + 200, DY - 150, 0.8, '#D8573A', T) + tqB_glow('tqBzDG', DX, DY - 120, 260, '#FFC866', 0.25);
  s += chairD(DX, DY - 4, 0.62, '#6B3E26') + tqDrumD(DX + 190, DY - 6, 0.62, TQ.shu);
  // tháp canh hai bên (gần hơn)
  s += tqB_glow('tqBzT1', 210, 560, 240, '#FFC866', 0.25) + tqTowerD(210, 786, 0.92, T, { lamp: true, col: TQ.wei }) + tqB_glow('tqBzT2', 1715, 560, 240, '#FFC866', 0.25) + tqTowerD(1715, 786, 0.92, T, { lamp: true, col: TQ.wei });
  // sương thấp quanh chân đài
  s += tqFog([[790, 120, 0.4]], T, '#CFCFD8', { wisps: false });
  // giá giáo, giá cung, bao cát, đuốc
  s += tqSpearRack(190, 1000, 0.72) + tqB_bowRack(390, 1010, 0.9) + tqB_bowRack(1500, 1010, 0.9) + tqSpearRack(1650, 1000, 0.72) + tqB_sandbags(70, 1008, 0.8) + tqB_sandbags(1850, 1008, 0.8);
  s += tqB_glow('tqBzF1', 600, 960, 190, '#FFC866', 0.22) + tqTorchD(600, 1000, 1.0, T, { r: 120 }) + tqB_glow('tqBzF2', 1330, 960, 190, '#FFC866', 0.22) + tqTorchD(1330, 1000, 1.0, T, { r: 120 });
  s += tqFlagD(36, 1010, 600, TQ.wei, T, { txt: 'TÀO', w: 130, fh: 170, tail: true }) + tqFlagD(1780, 1010, 600, TQ.wei, T, { txt: 'TÀO', w: 130, fh: 170, tail: true });
  s += motes(14, 0, 560, 1920, 480, '#FFD890', 0.45, 2);
  s += `<rect width="1920" height="1080" fill="#101A30" opacity="0.1"/>`;
  return s;
}

// ---------- 4. Đàn Thất Tinh trên núi Nam Bình (chiều tối/đêm)
// bg_dan_gio(t, {wind}): wind 0..1 (mặc định 0.5): 0 lặng gió (cờ rủ, khói thẳng, mây đứng), 1 gió Đông Nam mạnh (cờ bay thẳng phải, mây/lá bay, khói ngả).
// Mặt bệ trên cùng phẳng rộng y ≈ 820–1075; bệ ba tầng đá xếp bậc, cờ bảy sao, cờ bốn phương, lư hương, trống.
function tqB_peak(x, g, w, h, c, seed = 1, o = {}) {
  const n = 8, L = [], R = [];
  for (let i = 0; i <= n; i++) { const u = i / n, k = Math.pow(u, o.sharp || 1.25); L.push([x - w / 2 * (1 - u) + (hrnd(i, seed) - 0.5) * w * 0.05 * (i > 0 && i < n), g - h * k + (hrnd(i, seed + 1) - 0.5) * h * 0.05 * (i < n)]); R.push([x + w / 2 * (1 - u) + (hrnd(i, seed + 2) - 0.5) * w * 0.05 * (i > 0 && i < n), g - h * k + (hrnd(i, seed + 3) - 0.5) * h * 0.05 * (i < n)]); }
  const ap = [x, g - h], pts = [...L.slice(0, n), ap, ...R.slice(0, n).reverse()];
  let s = `<path d="M${pts.map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}Z" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/>`;
  // mặt tối bên phải + sống núi
  const rr = R.slice(0, n).reverse();
  s += `<path d="M${R1(ap[0])} ${R1(ap[1])} L${R1(x + w * 0.04)} ${R1(g - h * 0.55)} L${R1(x - w * 0.02)} ${g} L${R1(rr[0][0])} ${g} ${rr.map(p => `L${R1(p[0])} ${R1(p[1])}`).join(' ')}Z` .replace(/L\S+ \S+ L/, 'L') + `" fill="${dk(c, 0.28)}" opacity="0.55"/>`;
  s += `<path d="M${R1(ap[0])} ${R1(ap[1])} L${R1(x + w * 0.04)} ${R1(g - h * 0.55)} L${R1(x - w * 0.02)} ${g}" stroke="${dk(c, 0.35)}" stroke-width="3.5" fill="none" opacity="0.8"/>`;
  if (o.rim) s += `<path d="${L.slice(Math.floor(n * 0.5)).map((p, i) => `${i ? 'L' : 'M'}${R1(p[0] - 3)} ${R1(p[1])}`).join(' ')} L${R1(ap[0])} ${R1(ap[1])}" stroke="${o.rim}" stroke-width="4" fill="none" opacity="0.7"/>`;
  return s;
}
function tqB_censer(x, g, s, T, wind) {
  let b = `<path d="M-52 0 L-60 -40 M52 0 L60 -40 M0 0 V-40" stroke="${INK2}" stroke-width="14" stroke-linecap="round"/><path d="M-52 0 L-60 -40 M52 0 L60 -40 M0 0 V-40" stroke="#8A6A32" stroke-width="7" stroke-linecap="round"/>`;
  b += `<path d="M-80 -40 Q-92 -110 -64 -126 H64 Q92 -110 80 -40Z" fill="#9A7A3A" stroke="${INK2}" stroke-width="5"/><path d="M-86 -126 H86" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M-86 -126 H86" stroke="#C8A850" stroke-width="7" stroke-linecap="round"/><path d="M-70 -86 H70" stroke="${dk('#9A7A3A', 0.3)}" stroke-width="4"/><path d="M-60 -106 q16 10 30 0 q16 10 30 0 q16 10 30 0 q16 10 30 0" stroke="${dk('#9A7A3A', 0.35)}" stroke-width="3" fill="none"/>`;
  b += `<path d="M-64 -126 q-26 -22 -4 -40 M64 -126 q26 -22 4 -40" stroke="${INK2}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-64 -126 q-26 -22 -4 -40 M64 -126 q26 -22 4 -40" stroke="#9A7A3A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  b += `<ellipse cx="0" cy="-128" rx="64" ry="10" fill="#E85A28" opacity="0.7"/>`;
  // khói: ngả theo gió
  for (let k = 0; k < 3; k++) { let d = `M${(k - 1) * 14} -130`; for (let j = 1; j <= 7; j++) { const u = j / 7; d += ` L${R1((k - 1) * 14 + wind * 360 * Math.pow(u, 1.5) + Math.sin(T * 1.7 + j * 0.9 + k) * (6 + 12 * u))} ${R1(-130 - 330 * u)}`; } b += `<path d="${d}" stroke="${k === 1 ? '#DDD6E4' : '#C8C0D4'}" stroke-width="${k === 1 ? 9 : 5}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${k === 1 ? 0.55 : 0.35}"/>`; }
  return _g(x, g, s, b);
}
function bg_dan_gio(t, o = {}) {
  const T = _T(t), W = Math.max(0, Math.min(1, o.wind ?? 0.5)), CX = 960;
  let s = tqB_lg('tqBdSk', [[0, '#0E1434'], [0.3, '#28295A'], [0.5, '#5C3A6A'], [0.6, '#C2543E']]) + `<rect width="1920" height="1080" fill="url(#tqBdSk)"/>`;
  s += starsD(80, 520, 5) + tqB_glow('tqBdG', 1280, 690, 720, '#F0782E', 0.5);
  s += `<circle cx="300" cy="170" r="42" fill="#F2EBD0" opacity="0.92"/><circle cx="300" cy="170" r="92" fill="#F2EBD0" opacity="0.1"/><circle cx="286" cy="158" r="9" fill="#D8D0B4" opacity="0.5"/>`;
  // núi xa (tím) + biển mây xa
  s += tqB_peak(130, 720, 560, 330, '#403A72', 3, { rim: '#9A7AB0' }) + tqB_peak(560, 720, 420, 200, '#4A4278', 5, { rim: '#9A7AB0' }) + tqB_peak(1180, 720, 380, 150, '#4A4278', 8) + tqB_peak(1540, 720, 560, 340, '#403A72', 11, { rim: '#B88AA0' }) + tqB_peak(1850, 720, 440, 250, '#4A4278', 14, { rim: '#B88AA0' });
  const cloudSea = (y, cols, sp, o2 = {}) => { const g = tdCloudSea(y, T, { cols, sp, gap: o2.gap || 58, r: o2.r || 50, curl: false }); return W > 0.05 ? `<g transform="translate(1920 0) scale(-1 1)">${g}</g>` : g; };
  s += cloudSea(640, ['#5A4A82', '#7A5C94'], 3 + 38 * W);
  // núi gần hơn nhô khỏi mây
  s += tqB_peak(-10, 800, 520, 420, '#2C2858', 21, { rim: '#C87A6A', sharp: 1.1 }) + tqB_peak(1930, 800, 560, 400, '#2C2858', 23, { rim: '#C87A6A', sharp: 1.1 }) + tqB_peak(330, 800, 360, 230, '#332E62', 27) + tqB_peak(1640, 800, 400, 250, '#332E62', 29);
  s += cloudSea(738, ['#8A6A9E', '#B08AA8', '#D4A8B0'], 5 + 52 * W, { gap: 52, r: 54 });
  // ---- bệ đàn ba tầng (vẽ từ tầng dưới lên)
  const CY = [992, 986, 980], RX = [1620, 1330, 1080], RY = [288, 222, 158];
  const stone = ['#5A5272', '#756C8C', '#948BA6'], edge = ['#463E5C', '#5A5272', '#756C8C'];
  const arcY = (k, x) => CY[k] - RY[k] * Math.sqrt(Math.max(0, 1 - Math.pow((x - CX) / RX[k], 2)));
  for (let k = 0; k < 3; k++) {
    s += `<ellipse cx="${CX}" cy="${CY[k]}" rx="${RX[k]}" ry="${RY[k]}" fill="${stone[k]}" stroke="${INK2}" stroke-width="6"/>`;
    // dải vành sáng ở mép sau + gạch đá xếp
    s += `<path d="M${CX - RX[k] + 14} ${CY[k] - 6} A${RX[k] - 14} ${RY[k] - 12} 0 0 1 ${CX + RX[k] - 14} ${CY[k] - 6}" stroke="${lt_(stone[k], 0.25)}" stroke-width="6" fill="none" opacity="0.6"/>`;
    const rx2 = k < 2 ? RX[k + 1] : 0, ry2 = k < 2 ? RY[k + 1] : 0, cy2 = k < 2 ? CY[k + 1] : 0;
    if (k < 2) for (let i = 0; i <= 40; i++) { const a = Math.PI + Math.PI * i / 40, xo = CX + RX[k] * Math.cos(a), yo = CY[k] + RY[k] * Math.sin(a), xi = CX + rx2 * Math.cos(a), yi = cy2 + ry2 * Math.sin(a); s += `<path d="M${R1(xo)} ${R1(yo)} L${R1(xi)} ${R1(yi)}" stroke="${edge[k]}" stroke-width="3.5" opacity="0.7"/>`; }
    // vòng chỉ giữa mỗi tầng
    s += `<ellipse cx="${CX}" cy="${CY[k] - 2}" rx="${RX[k] - (k < 2 ? (RX[k] - rx2) / 2 : 70)}" ry="${RY[k] - (k < 2 ? (RY[k] - ry2) / 2 : 22)}" fill="none" stroke="${edge[k]}" stroke-width="4" opacity="0.6"/>`;
  }
  // lát đá mặt bệ trên: vòng đồng tâm + đường nan toả
  for (const f of [0.82, 0.62, 0.42]) s += `<ellipse cx="${CX}" cy="${CY[2] + 8}" rx="${R1(RX[2] * f)}" ry="${R1(RY[2] * f)}" fill="none" stroke="${edge[2]}" stroke-width="3" opacity="0.4"/>`;
  for (let i = 0; i < 34; i++) { const a = Math.PI + Math.PI * (i + 0.5) / 34; s += `<path d="M${R1(CX + RX[2] * 0.42 * Math.cos(a))} ${R1(CY[2] + 8 + RY[2] * 0.42 * Math.sin(a))} L${R1(CX + RX[2] * 0.98 * Math.cos(a))} ${R1(CY[2] + RY[2] * 0.98 * Math.sin(a))}" stroke="${edge[2]}" stroke-width="2.5" opacity="0.3"/>`; }
  // hoa văn mặt bệ trên: vòng bát quái mờ + bảy sao khắc
  s += `<ellipse cx="${CX}" cy="${CY[2]}" rx="${RX[2] - 70}" ry="${RY[2] - 18}" fill="none" stroke="${lt_(stone[2], 0.3)}" stroke-width="3" stroke-dasharray="26 18" opacity="0.5"/>`;
  { const ST = [[740, 872], [820, 890], [900, 884], [980, 868], [1000, 926], [1100, 934], [1124, 880]]; s += `<path d="M${ST.map(p => p.join(' ')).join(' L')} L${ST[3].join(' ')}" stroke="#F6E7B8" stroke-width="3" fill="none" opacity="0.35"/>` + ST.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#F6E7B8" opacity="0.25"/><circle cx="${x}" cy="${y}" r="6.5" fill="#FFF6D0" opacity="0.8"/>`).join(''); }
  // lan can đá + cột nhỏ dọc mép sau từng tầng
  for (let k = 0; k < 3; k++) for (let x = CX - RX[k] * 0.9; x <= CX + RX[k] * 0.9; x += (k === 2 ? 130 : 160)) { const y = arcY(k, x); if (y > 1060 || x < -10 || x > 1930) continue; if (k === 2 && Math.abs(x - CX) < 250) continue; const hh = k === 2 ? 46 : 40; s += `<rect x="${R1(x - 8)}" y="${R1(y - hh)}" width="16" height="${hh}" fill="${lt_(stone[k], 0.2)}" stroke="${INK2}" stroke-width="3.5"/><circle cx="${R1(x)}" cy="${R1(y - hh - 7)}" r="9" fill="${lt_(stone[k], 0.3)}" stroke="${INK2}" stroke-width="3"/>`; }
  // cờ bốn phương (xanh Đông, đỏ Nam, trắng Tây, đen Bắc) trên tầng 3 và tầng 2
  const FC = ['#2E8A60', '#C0452E', '#ECE6D4', '#2A2A3A'];
  [[130, 0], [380, 1]].forEach(([x, i]) => { s += tqB_flagPole(x, arcY(0, x) + 6, 190, FC[i], T, W, { len: 92, fh: 62, pw: 7, sw: 3.2, tail: true }); });
  [[1540, 2], [1790, 3]].forEach(([x, i]) => { s += tqB_flagPole(x, arcY(0, x) + 6, 190, FC[i], T, W, { len: 92, fh: 62, pw: 7, sw: 3.2, tail: true }); });
  [[470, 1], [660, 0]].forEach(([x, i]) => { s += tqB_flagPole(x, arcY(1, x) + 6, 190, FC[i], T, W, { len: 84, fh: 58, pw: 7, sw: 3.2, tail: true }); });
  [[1260, 3], [1450, 2]].forEach(([x, i]) => { s += tqB_flagPole(x, arcY(1, x) + 6, 190, FC[i], T, W, { len: 84, fh: 58, pw: 7, sw: 3.2, tail: true }); });
  // cờ bảy sao lớn + cờ tương phong (lông gà)
  s += tqB_flagPole(560, arcY(2, 560) + 12, 580, '#1C2C66', T, W, { len: 250, fh: 160, pw: 11, sw: 4.5, stars: true, tail: true, trim: '#E2C25A' });
  s += tqB_flagPole(1340, arcY(2, 1340) + 12, 430, '#C23C2C', T, W, { len: 190, fh: 34, pw: 9, sw: 4, tail: true, amp: 1.3 });
  // lư hương + trống + hai đài lửa
  s += tqB_censer(330, 936, 0.95, T, W) + tqDrumD(1640, 922, 0.9, TQ.shu);
  s += tqB_glow('tqBdF1', 120, 930, 260, '#FFC866', 0.25) + tqTorchD(120, 1010, 1.15, T, { r: 130 }) + tqB_glow('tqBdF2', 1810, 930, 260, '#FFC866', 0.25) + tqTorchD(1810, 1010, 1.15, T, { r: 130 });
  // gió: vệt gió + lá bay
  if (W > 0.25) for (let i = 0; i < 9; i++) { const sp = 300 + 600 * W * (0.6 + 0.8 * hrnd(i, 61)), x = ((hrnd(i, 62) * 2400 + T * sp) % 2400) - 300, y = 160 + hrnd(i, 63) * 560, ln = 140 + hrnd(i, 64) * 160; s += `<path d="M${R1(x)} ${R1(y)} q${R1(ln * 0.5)} -10 ${R1(ln)} ${R1(Math.sin(i) * 8)}" stroke="#F4EEFF" stroke-width="3" fill="none" stroke-linecap="round" opacity="${R1((W - 0.2) * 0.45 * 100) / 100}"/>`; }
  const NL = 3 + Math.round(18 * W);
  for (let i = 0; i < NL; i++) { const sp = 70 + 420 * W * (0.6 + 0.8 * hrnd(i, 71)), x = ((hrnd(i, 72) * 2300 + T * sp) % 2300) - 190, y = 300 + hrnd(i, 73) * 620 + Math.sin(T * 2.2 + i) * 26, rot = (T * (60 + 160 * W) + i * 70) % 360; s += `<g transform="translate(${R1(x)} ${R1(y)}) rotate(${R1(rot)})"><path d="M-12 0 Q0 -9 12 0 Q0 9 -12 0Z" fill="${i % 3 ? '#7C9A4A' : '#C8943C'}" stroke="${INK2}" stroke-width="2.2"/><path d="M-12 0 H12" stroke="${INK2}" stroke-width="1.6"/></g>`; }
  // tối hai mép
  s += tqB_rg('tqBdVg', 960, 560, 1300, [[0.6, '#0A0E24', 0], [1, '#0A0E24', 0.5]]) + `<rect width="1920" height="1080" fill="url(#tqBdVg)"/>`;
  return s;
}

// ---------- 5. Xích Bích đêm hỏa công
// bg_xich_bich(t): vách Xích Bích bên phải, đoàn thuyền Tào xích nhau đang cháy, khói đen, tàn lửa, thuyền lửa Hoàng Cái ở gần bờ Nam. Vùng giữa-dưới (y 800–1075) để mặt nước/bờ dễ đọc cho hiệu ứng vẽ thêm. o.ships (mặc định 5: số thuyền hàng gần), o.fireBoats (mặc định 3).
function tqB_cliffPts() { return [[1920, -10], [1420, -10], [1450, 90], [1360, 170], [1410, 260], [1330, 350], [1380, 440], [1330, 520], [1360, 610], [1440, 640], [1920, 640]]; }
function tqB_cliff(T) {
  const P = tqB_cliffPts(), d = `M${P.map(p => p.join(' ')).join(' L')}Z`;
  let s = `<defs><clipPath id="tqBxCl"><path d="${d}"/></clipPath></defs><path d="${d}" fill="#5A2830" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<g clip-path="url(#tqBxCl)">`;
  // địa tầng + khe nứt đứng + mảng đá (vách dựng đứng)
  for (let k = 0; k < 16; k++) { const y = 10 + k * 42 + hrnd(k, 3) * 16; s += `<path d="M1320 ${y} Q1500 ${y + 10 * (k % 3) - 6} 1700 ${y + 3} T1940 ${y + 10}" stroke="${k % 2 ? '#4A2024' : '#9A4A38'}" stroke-width="${5 + hrnd(k, 4) * 8}" fill="none" opacity="0.5"/>`; }
  for (let k = 0; k < 11; k++) { const x = 1390 + k * 52 + hrnd(k, 5) * 24, y0 = hrnd(k, 6) * 260 - 40, ln = 220 + hrnd(k, 7) * 300; s += `<path d="M${R1(x)} ${R1(y0)} q${R1((hrnd(k, 8) - 0.5) * 50)} ${R1(ln * 0.5)} ${R1((hrnd(k, 9) - 0.5) * 36)} ${R1(ln)}" stroke="#2A1218" stroke-width="${R1(6 + hrnd(k, 2) * 6)}" fill="none" opacity="0.55" stroke-linecap="round"/><path d="M${R1(x + 9)} ${R1(y0 + 6)} q${R1((hrnd(k, 8) - 0.5) * 50)} ${R1(ln * 0.5)} ${R1((hrnd(k, 9) - 0.5) * 36)} ${R1(ln)}" stroke="#E0784A" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>`; }
  for (let k = 0; k < 9; k++) { const x = 1380 + hrnd(k, 12) * 380, y = 40 + hrnd(k, 13) * 560, w = 60 + hrnd(k, 14) * 110, h = 30 + hrnd(k, 15) * 60; s += `<path d="M${R1(x)} ${R1(y)} L${R1(x + w)} ${R1(y - h * 0.3)} L${R1(x + w * 0.9)} ${R1(y + h)} L${R1(x + 6)} ${R1(y + h * 0.8)}Z" fill="#3A1A24" opacity="0.28" stroke="${INK2}" stroke-width="2" stroke-opacity="0.4"/>`; }
  // cột đá đứng (mặt sáng/tối xen kẽ)
  for (let k = 0; k < 7; k++) { const x = 1330 + k * 92 + hrnd(k, 41) * 20, w = 70 + hrnd(k, 42) * 50; s += `<path d="M${R1(x)} ${R1(hrnd(k, 43) * 90 - 40)} L${R1(x + w)} -40 L${R1(x + w + 10)} 700 L${R1(x - 6)} 700Z" fill="${k % 2 ? '#2A1218' : '#C8683C'}" opacity="${k % 2 ? 0.28 : 0.2}"/><path d="M${R1(x)} ${R1(hrnd(k, 43) * 90 - 40)} L${R1(x - 6)} 700" stroke="${INK2}" stroke-width="4" opacity="0.5"/>`; }
  // mặt sáng bên trái (đón lửa) + tối bên phải
  s += tqB_lg('tqBxCg', [[0, '#FF9A40', 0.5], [0.45, '#C84E2C', 0.22], [1, '#7A2A30', 0.0]], 0, 0, 1, 0) + `<rect x="1320" y="0" width="560" height="660" fill="url(#tqBxCg)"/>`;
  s += `<rect x="1700" y="0" width="240" height="660" fill="#2A1428" opacity="0.4"/>`;
  s += `</g><path d="${d}" fill="none" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>`;
  // mép sáng
  s += `<path d="${P.slice(1, -1).map((p, i) => `${i ? 'L' : 'M'}${p[0] + 7} ${p[1]}`).join(' ')}" stroke="#FFB060" stroke-width="5" fill="none" opacity="0.7"/>`;
  // cây bám đỉnh/mỏm đá (bóng tối)
  [[1470, 70, 0.34], [1560, 24, 0.4], [1760, 8, 0.44], [1640, 18, 0.36], [1400, 262, 0.26], [1340, 352, 0.24]].forEach(([x, y, k], i) => { s += pineD(x, y + 10, k, i % 2 ? '#2A2038' : '#3A2438'); });
  return s;
}
// khối khói đen (puff có viền, đáy ánh cam)
function tqB_smokeMass(list, c, glow = '#F0662A') {
  let s = list.map(([x, y, r]) => `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r + 4)}" fill="${INK2}"/>`).join('') + list.map(([x, y, r]) => `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${c}"/>`).join('');
  s += list.map(([x, y, r]) => `<path d="M${R1(x - r * 0.8)} ${R1(y + r * 0.45)} Q${R1(x)} ${R1(y + r * 1.02)} ${R1(x + r * 0.8)} ${R1(y + r * 0.45)}" stroke="${glow}" stroke-width="${R1(Math.max(4, r * 0.1))}" fill="none" opacity="0.28" stroke-linecap="round"/>`).join('');
  return s;
}
// cột khói bốc lên từ (x, y): các cụm tròn to dần, trôi sang phải
function tqB_plume(x, y, T, h = 520, n = 14, seed = 1, c = '#2C1832') {
  let s = '';
  for (let i = 0; i < n; i++) { const u = ((i / n) + T * 0.07) % 1, yy = y - u * h, xx = x + Math.sin(u * 4 + i + seed) * (16 + 40 * u) + u * u * 120, r = 26 + u * 80; s += `<circle cx="${R1(xx)}" cy="${R1(yy)}" r="${R1(r)}" fill="${mixC('#4A2640', c, Math.min(1, u * 1.6))}" opacity="${R1(Math.min(0.96, (1 - u) * 3) * 100) / 100}"/>`; }
  return s;
}
// thuyền lửa nhỏ của Hoàng Cái (mũi quay trái)
function tqB_fireBoat(x, g, s, T) {
  let b = tqBoatD(x, g, s, T, { heavy: true });
  b += tqB_glow('tqBxfb' + R1(x), x, g - 90 * s, 150 * s + 40, '#FFB040', 0.5);
  b += tqFlame(x - 36 * s, g - 150 * s, 0.34, T, { seed: x }) + tqFlame(x + 36 * s, g - 168 * s, 0.38, T, { seed: x + 1 }) + tqFlame(x, g - 190 * s, 0.46, T, { seed: x + 2 });
  b += tqB_plume(x + 10 * s, g - 230 * s, T, 150, 6, x, '#3A2430').replace(/r="([\d.]+)"/g, (m, r) => `r="${R1(r * 0.45)}"`);
  // vệt lửa/nước tạt phía sau (bên phải)
  b += `<path d="M${R1(x + 200 * s)} ${R1(g - 6)} q${R1(120 * s)} -10 ${R1(260 * s)} 2" stroke="#FFD88A" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>`;
  return b;
}
function bg_xich_bich(t, o = {}) {
  const T = _T(t), HZ = 586, NS = o.ships ?? 5, NB = o.fireBoats ?? 3, B = o.burn ?? 1, ig = (i, d = 0.2, w = 0.3) => Math.max(0, Math.min(1, (B * 1.4 - Math.abs(i - 2) * d) / w));   // B 0..1: lửa lan từ thuyền số 2 ra hai bên
  let s = tqB_lg('tqBxSk', [[0, '#1C1032'], [0.22, '#4A1E4C'], [0.4, '#A8363A'], [0.52, '#F0742A'], [0.56, '#FFA040']]) + `<rect width="1920" height="1080" fill="url(#tqBxSk)"/>`;
  s += starsD(14, 120, 33);
  s += tqB_glow('tqBxG1', 700, 560, 900, '#FF8A30', 0.55 * (0.2 + 0.8 * B)) + tqB_glow('tqBxG2', 700, 520, 440, '#FFD070', 0.4 * B);
  if (B < 1) s += `<rect width="1920" height="${HZ}" fill="#120C26" opacity="${R1(0.5 * (1 - B) * 100) / 100}"/>`;
  // khói đen cuộn trên trời (lớp dày, tối, viền sáng cam bên dưới)
  const dr = Math.sin(T * 0.2) * 14;
  s += `<g opacity="${R1(Math.min(1, Math.max(0, B * 1.5 - 0.25)) * 100) / 100}">` + tqB_smokeMass([[100 + dr, 80, 170], [300 + dr, 30, 190], [520 + dr, 80, 160], [730 + dr, 10, 180], [940 + dr, 60, 150], [1150 + dr, 20, 150], [240 + dr, 200, 120], [620 + dr, 190, 130], [880 + dr, 170, 110], [60 + dr, 240, 100], [430 + dr, 250, 90], [1090 + dr, 160, 100]], '#2C1832') + tqB_glow('tqBxSmG', 600, 300, 520, '#FF7A30', 0.22) + `</g>`;
  // núi xa phía bờ Bắc thấp + trại lửa
  s += `<path d="M0 ${HZ} V548 Q120 530 260 546 T520 540 T820 548 T1100 538 L1330 550 V${HZ}Z" fill="#4A2040" stroke="${INK2}" stroke-width="3.5"/>`;
  s += [[160, 556], [380, 548], [900, 552], [1150, 548]].map(([x, y], i) => B > 0.35 ? tqFlame(x, y, 0.18 * Math.min(1, (B - 0.35) * 3), T, { seed: x }) : '').join('');
  // vách Xích Bích
  s += tqB_cliff(T);
  // mặt sông
  s += tqRiver(HZ, T, { id: 'xb', c1: '#C0502E', c2: '#22142C', rip: '#FFB868', ripOp: 0.5, rows: 15 });
  s += `<rect x="0" y="${HZ}" width="1920" height="40" fill="#FF9A44" opacity="0.18"/>`;
  // chân vách + đá
  s += wxRock(1470, 640, 0.9, '#6A3030') + wxRock(1640, 636, 0.7, '#5A2A2E') + wxRock(1790, 650, 1.0, '#6A3030');
  // thuyền Tào xa (hàng 2, nhỏ) đang cháy
  const X2 = [220, 470, 720, 970, 1220], G2 = 606, S2 = 0.4;
  X2.forEach((x, i) => { s += tqShipD(x, G2, S2, T, { col: TQ.wei, sail: i % 2 ? true : 'furled', sailC: '#B8582A', bob: 2, cabin: i % 2 === 0, oars: false, roof: '#3A2A3A', lit: true }); });
  X2.forEach((x, i) => { [[-40, -330, 0.42], [170, -250, 0.32], [-130, -140, 0.36]].forEach(([lx, ly, fs], k) => { if (ig(i, 0.18, 0.4) > 0.03) s += tqFlame(x + lx * S2, G2 + ly * S2 * 0.6, fs * ig(i, 0.18, 0.4), T, { seed: i * 3 + k }); }); });
  // hàng thuyền Tào gần, xích vào nhau
  const X1 = [80, 400, 720, 1040, 1360, 1680].slice(0, NS + 1), G1 = 700, S1 = 0.56;
  for (let i = 0; i + 1 < X1.length; i++) { const ax = X1[i] + 0.52 * 318 * S1 * 1.1, bx = X1[i + 1] - 0.52 * 318 * S1 * 1.1, yy = G1 - 44 * S1; s += `<path d="M${R1(ax)} ${R1(yy)} Q${R1((ax + bx) / 2)} ${R1(yy + 30)} ${R1(bx)} ${R1(yy)}" stroke="${INK2}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${R1(ax)} ${R1(yy)} Q${R1((ax + bx) / 2)} ${R1(yy + 30)} ${R1(bx)} ${R1(yy)}" stroke="#9A9AA2" stroke-width="4" fill="none" stroke-dasharray="8 5"/>`; }
  // phản chiếu lửa trên nước dưới các thuyền
  X1.forEach((x, i) => { for (let k = 0; k < 8; k++) { const w = (330 - k * 30) * (0.8 + 0.2 * Math.sin(T * 3 + k + i)); s += `<rect x="${R1(x - w / 2 + Math.sin(T * 2 + k * 1.3 + i) * 10)}" y="${R1(G1 + 14 + k * 17)}" width="${R1(w)}" height="${R1(7 + k * 0.5)}" rx="4" fill="${k < 4 ? '#FFC060' : '#F0762A'}" opacity="${R1(0.62 - k * 0.06)}"/>`; } });
  X1.forEach((x, i) => { s += tqB_glow('tqBxSg' + i, x, G1 - 70, 300, '#FFA840', 0.35) + tqShipD(x, G1, S1, T, { col: TQ.wei, sail: i % 3 === 1 ? 'furled' : true, sailC: '#D4682E', lit: true, bob: 3, flagTxt: '', roof: '#3A2A3A' }); });
  X1.forEach((x, i) => { [[-40, -330, 0.62], [180, -250, 0.5], [-130, -160, 0.55], [60, -170, 0.42], [-230, -140, 0.4]].forEach(([lx, ly, fs], k) => { const gk = ig(i, 0.2, 0.3) * Math.min(1, Math.max(0, (B * 1.6 - Math.abs(i - 2) * 0.2 - k * 0.04))); if (gk > 0.03) s += tqFlame(x + lx * S1, G1 + ly * S1 * 0.62, fs * Math.min(1, gk * 1.2), T, { seed: i * 5 + k + 11 }); }); });
  // khói đen cao từ đoàn thuyền
  [160, 520, 880, 1200, 1520].forEach((x, i) => { if (B > 0.3) s += `<g opacity="${R1(Math.min(1, (B - 0.3) * 2) * 100) / 100}">` + tqB_plume(x, 470, T + i * 1.7, 580, 15, i + 3) + `</g>`; });
  // thuyền lửa Hoàng Cái lao tới (nhỏ, phía bờ Nam)
  const FB = [[1050, 786, 0.3], [1260, 812, 0.33], [1470, 780, 0.27], [840, 772, 0.24]].slice(0, NB);
  FB.forEach(([x, g, k]) => { s += tqB_fireBoat(x, g, k, T); });
  // quầng sáng lửa lên mặt nước
  s += tqB_rg('tqBxWg', 700, 820, 760, [[0, '#FF8A30', 0.3], [1, '#FF8A30', 0]]) + `<ellipse cx="700" cy="820" rx="760" ry="200" fill="url(#tqBxWg)"/>`;
  // bờ Nam phía trước (tối, đọc rõ): mép trên có viền sáng cam
  s += `<path d="M0 978 Q260 962 520 974 T1060 968 T1600 972 T1920 962 V1090 H0Z" fill="#2A1626" stroke="${INK2}" stroke-width="5"/><path d="M0 984 Q260 968 520 980 T1060 974 T1600 978 T1920 968" stroke="#E0702E" stroke-width="5" fill="none" opacity="0.6"/>`;
  s += vGrass(110, 0, 990, 1920, 90, '#4A2A34', 9, { c2: '#7A3A34' }) + pebbles(28, 0, 1000, 1920, 70, '#5A3238', 6);
  // lau sậy tối hai góc
  const reed = (x0, x1, seed) => { let r = ''; for (let i = 0; i < 18; i++) { const x = x0 + (x1 - x0) * hrnd(i, seed), h = 120 + hrnd(i, seed + 1) * 150, sw = Math.sin(T * 1.5 + i) * 7; r += `<path d="M${R1(x)} 1000 Q${R1(x + sw)} ${R1(1000 - h * 0.6)} ${R1(x + sw * 1.5 + 8)} ${R1(1000 - h)}" stroke="${INK2}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${R1(x)} 1000 Q${R1(x + sw)} ${R1(1000 - h * 0.6)} ${R1(x + sw * 1.5 + 8)} ${R1(1000 - h)}" stroke="#4A2C36" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="${R1(x + sw * 1.5 + 8)}" cy="${R1(1000 - h - 14)}" rx="5" ry="18" fill="#5A3228" stroke="${INK2}" stroke-width="2.5"/>`; } return r; };
  s += reed(-20, 300, 4) + reed(1620, 1940, 12);
  // tàn lửa bay
  s += motes(34, 80, 40, 1500, 620, '#FFB44A', 0.9, 7) + motes(22, 100, 160, 1300, 560, '#FFE08A', 0.8, 17);
  s += tqB_rg('tqBxVg', 800, 560, 1300, [[0.6, '#14081E', 0], [1, '#14081E', 0.45]]) + `<rect width="1920" height="1080" fill="url(#tqBxVg)"/>`;
  return s;
}

// ---------- 6. Boong thuyền chiến Ngô chiều tà
// bg_thuyen_du(t, {bed}): sàn gỗ phối cảnh (ván dọc) nửa dưới, lan can, cột buồm lớn bên phải, lầu thuyền bên trái, cờ Ngô, sau lan can là sông vàng cam + hoàng hôn.
// o.bed (mặc định 1): vẽ sạp bệnh thấp kiểu Hán lệch trái-giữa (mặt sạp y ≈ 820–900, đầu gối ở trái) cho Chu Du nằm; bed:0 để bỏ.
function tqB_blanket(x, y) { // chăn riêng (vẽ SAU nhân vật nằm), cùng toạ độ tqB_bed
  const W = 620, BX = x - W / 2, TOP = y - 82; let b = '';
  // chăn (đỏ sẫm, viền vàng) phủ nửa phải, rủ qua mép trước
  b += `<path d="M${BX + 250} ${TOP + 6} H${BX + W - 40} L${BX + W + 6} ${y + 6} Q${BX + W + 4} ${y + 40} ${BX + W - 24} ${y + 34} Q${BX + 480} ${y + 52} ${BX + 330} ${y + 30} Q${BX + 250} ${y + 38} ${BX + 214} ${y + 4} Z" fill="#8E3A34" stroke="${INK2}" stroke-width="5.5" stroke-linejoin="round"/>`;
  b += `<path d="M${BX + 214} ${y + 4} Q${BX + 250} ${y + 36} ${BX + 330} ${y + 28} Q${BX + 480} ${y + 50} ${BX + W - 24} ${y + 32}" stroke="${TQ.gold}" stroke-width="6" fill="none" opacity="0.9"/>`;
  b += `<path d="M${BX + 270} ${TOP + 22} Q${BX + 300} ${y - 24} ${BX + 286} ${y + 10} M${BX + 380} ${TOP + 18} Q${BX + 420} ${y - 30} ${BX + 400} ${y + 20} M${BX + 500} ${TOP + 20} Q${BX + 520} ${y - 20} ${BX + 534} ${y + 24}" stroke="#6A2622" stroke-width="5" fill="none" opacity="0.8"/><path d="M${BX + 330} ${TOP + 12} H${BX + 480}" stroke="#B85A4C" stroke-width="4" opacity="0.7"/>`;
  return b;
}
function tqB_bed(x, y, nocover = 0) { // (x, y) = giữa mép trước của mặt sạp
  const W = 620, BX = x - W / 2, TOP = y - 82; // TOP: mép sau mặt sạp
  let b = `<ellipse cx="${x}" cy="${y + 96}" rx="${W * 0.56}" ry="18" fill="#20100A" opacity="0.22"/>`;
  // chân sạp
  for (const lx of [BX + 22, BX + W - 22]) b += `<rect x="${lx - 16}" y="${y + 20}" width="32" height="62" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/>`;
  for (const lx of [BX + 60, BX + W - 60]) b += `<rect x="${lx - 12}" y="${TOP + 14}" width="24" height="40" fill="${dk(TQ.wood2, 0.2)}" stroke="${INK2}" stroke-width="4"/>`;
  // thành trước (hộp gỗ)
  b += `<path d="M${BX - 10} ${y} H${BX + W + 10} V${y + 42} H${BX - 10}Z" fill="${TQ.wood}" stroke="${INK2}" stroke-width="5.5"/><path d="M${BX + 10} ${y + 14} H${BX + W - 10} M${BX + 10} ${y + 30} H${BX + W - 10}" stroke="${TQ.wood2}" stroke-width="3.5" opacity="0.8"/>` + [0, 1, 2, 3].map(i => `<rect x="${BX + 40 + i * 150}" y="${y + 8}" width="90" height="26" rx="6" fill="none" stroke="${TQ.wood3}" stroke-width="4"/>`).join('');
  // mặt sạp (chiếu tre) hình thang
  b += `<path d="M${BX + 26} ${TOP} H${BX + W - 26} L${BX + W + 10} ${y} H${BX - 10}Z" fill="#CDB070" stroke="${INK2}" stroke-width="5.5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 12; i++) { const u = i / 12; b += `<path d="M${R1(BX + 26 + (W - 52) * u)} ${TOP} L${R1(BX - 10 + (W + 20) * u)} ${y}" stroke="#A8904C" stroke-width="2.5" opacity="0.7"/>`; }
  for (let r = 1; r < 5; r++) { const yy = TOP + 82 * r / 5; b += `<path d="M${R1(BX + 26 - 36 * r / 5)} ${R1(yy)} H${R1(BX + W - 26 + 36 * r / 5)}" stroke="#A8904C" stroke-width="2" opacity="0.5"/>`; }
  // gối (trụ gỗ bọc vải) bên trái
  b += `<path d="M${BX + 40} ${TOP + 22} Q${BX + 36} ${TOP + 62} ${BX + 54} ${y - 6} H${BX + 170} Q${BX + 190} ${TOP + 62} ${BX + 176} ${TOP + 22}Z" fill="#EFE2C4" stroke="${INK2}" stroke-width="5"/><path d="M${BX + 40} ${TOP + 22} Q${BX + 108} ${TOP + 6} ${BX + 176} ${TOP + 22}" stroke="${INK2}" stroke-width="4" fill="none"/><path d="M${BX + 48} ${TOP + 40} Q${BX + 108} ${TOP + 52} ${BX + 170} ${TOP + 38}" stroke="#C8B890" stroke-width="3" fill="none"/><path d="M${BX + 52} ${y - 8} Q${BX + 108} ${y + 8} ${BX + 172} ${y - 10}" stroke="${TQ.shu}" stroke-width="7" fill="none" opacity="0.9"/>`;
  if (!nocover) { b += tqB_blanket(x, y); }
  return b;
}
function bg_thuyen_du(t, o = {}) {
  const T = _T(t), BED = o.bed ?? 1, HZ = 442, RT = 548, DY = 664, VP = [960, 330]; // HZ chân trời, RT mép trên lan can, DY mép sau boong
  let s = tqB_lg('tqBuSk', [[0, '#7C6AA6'], [0.18, '#C8726C'], [0.32, '#F29A5C'], [0.41, '#FFCE82']]) + `<rect width="1920" height="1080" fill="url(#tqBuSk)"/>`;
  const SX = 900;
  s += tqB_glow('tqBuG1', SX, HZ - 30, 560, '#FFD890', 0.55) + tqB_rg('tqBuSun', SX, HZ - 56, 124, [[0, '#FFF8D0'], [1, '#FFD060']]) + `<circle cx="${SX}" cy="${HZ - 56}" r="124" fill="url(#tqBuSun)"/>`;
  s += tqB_streak(180, 250, 520, 60, '#F6A070', '#C85A56', T, 1, { hi: '#FFE6B8' }) + tqB_streak(1180, 210, 560, 66, '#F8B084', '#CC6058', T, 2, { hi: '#FFEBC4' }) + tqB_streak(760, 330, 300, 34, '#FFC48C', '#E07A58', T, 3, { hi: '#FFF2D0' }) + tqB_streak(-40, 392, 340, 38, '#E88866', '#B04E58', T, 4, { hi: '#FFD8A8' }) + tqB_streak(1500, 380, 460, 44, '#F4A074', '#C05C58', T, 5, { hi: '#FFE6B8' });
  s += birds(110, 4);
  // núi xa + bờ xa
  s += wxPeaks(HZ + 8, '#B2707E', 6, 0.2) + `<path d="M0 ${HZ + 8} Q480 ${HZ - 6} 960 ${HZ + 4} T1920 ${HZ + 2} V${HZ + 22} H0Z" fill="#8A5470" stroke="${INK2}" stroke-width="3"/>` + farTrees(26, HZ + 6, '#7A4A68', 14);
  // sông vàng cam
  s += tqRiver(HZ + 14, T, { id: 'tdu', c1: '#FFC878', c2: '#E8804A', rip: '#FFF2C8', ripOp: 0.6, rows: 9, refl: [[SX, '#FFF2C0', 80]] });
  // thuyền xa
  s += tqB_junk(1220, HZ + 56, 0.26, '#8A4A60', T, { sail: '#C0606A', lit: '#FFD090' }) + tqB_junk(400, HZ + 74, 0.34, '#7A3E58', T, { sail: '#B85868', flip: true, lit: '#FFD090' }) + tqShipD(1640, HZ + 52, 0.2, T, { col: TQ.wu, sail: true, flagTxt: '', roof: '#5A4A50', oars: false, bob: 1.5 }) + tqB_junk(1020, HZ + 38, 0.17, '#9A5468', T, { sail: '#C8707A' });
  // ---- lan can (phía xa của boong)
  s += `<rect x="-10" y="${DY - 28}" width="1940" height="40" fill="${TQ.wood}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 46; i++) { const x = 16 + i * 42; s += `<path d="M${x} ${RT + 14} V${DY - 28}" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/><path d="M${x} ${RT + 14} V${DY - 28}" stroke="${TQ.wood3}" stroke-width="5.5" stroke-linecap="round"/>`; }
  s += `<path d="M-10 ${RT + 70} H1930" stroke="${INK2}" stroke-width="12"/><path d="M-10 ${RT + 70} H1930" stroke="${TQ.wood3}" stroke-width="6"/>`;
  s += `<rect x="-10" y="${RT - 8}" width="1940" height="26" rx="8" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5.5"/><path d="M0 ${RT + 2} H1920" stroke="#D8A870" stroke-width="4" opacity="0.7"/>`;
  for (let k = 0; k < 8; k++) { const x = 100 + k * 270; s += `<rect x="${x - 17}" y="${RT - 42}" width="34" height="${DY - RT + 14}" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5.5"/><circle cx="${x}" cy="${RT - 46}" r="19" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5"/><circle cx="${x}" cy="${RT - 46}" r="8" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`; }
  // ---- sàn boong phối cảnh
  s += `<path d="M-10 ${DY} H1930 V1090 H-10Z" fill="#B07C4A" stroke="${INK2}" stroke-width="5"/>`;
  const xb = (xt) => VP[0] + (xt - VP[0]) * (1090 - VP[1]) / (DY - VP[1]);
  for (let j = -18; j < 18; j++) { const xt0 = VP[0] + j * 64, xt1 = xt0 + 64; s += `<path d="M${R1(xt0)} ${DY} L${R1(xt1)} ${DY} L${R1(xb(xt1))} 1090 L${R1(xb(xt0))} 1090Z" fill="${(j & 1) ? '#B58250' : '#A87644'}"/>`; }
  for (let k = 0; k < 8; k++) { const y0 = VP[1] + (DY - VP[1]) * Math.pow(1.24, k), y1 = VP[1] + (DY - VP[1]) * Math.pow(1.24, k + 1); for (let j = -18; j < 18; j++) { if (((j * 7 + k * 3) % 5 + 5) % 5 !== 0) continue; const f0 = (y0 - VP[1]) / (DY - VP[1]); const xa = VP[0] + j * 64 * f0, xe = VP[0] + (j + 1) * 64 * f0; s += `<path d="M${R1(xa)} ${R1(y0)} L${R1(xe)} ${R1(y0)}" stroke="${dk('#A87644', 0.4)}" stroke-width="${R1(2 + k * 0.5)}" opacity="0.8"/>`; } }
  for (let j = -18; j <= 18; j++) { const xt = VP[0] + j * 64; s += `<path d="M${R1(xt)} ${DY} L${R1(xb(xt))} 1090" stroke="${INK2}" stroke-width="${j % 3 === 0 ? 3.5 : 2.5}" opacity="0.55"/>`; }
  s += tqB_lg('tqBuDs', [[0, '#FFB070', 0.34], [0.5, '#FFB070', 0.08], [1, '#401810', 0.18]]) + `<rect x="0" y="${DY}" width="1920" height="${1090 - DY}" fill="url(#tqBuDs)"/>`;
  s += `<path d="M-10 ${DY + 4} H1930" stroke="${INK2}" stroke-width="6"/>`;
  // ---- lầu thuyền bên trái
  const CW = 470, CT = 330, CB = 706;
  s += `<rect x="-20" y="${CT}" width="${CW + 20}" height="${CB - CT}" fill="#B8814E" stroke="${INK2}" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${i * 86 - 6} ${CT} V${CB}" stroke="${dk('#B8814E', 0.3)}" stroke-width="3" opacity="0.7"/>`;
  s += `<rect x="-20" y="${CT}" width="${CW + 20}" height="34" fill="${TQ.wu}" stroke="${INK2}" stroke-width="5"/><rect x="-20" y="${CB - 30}" width="${CW + 20}" height="30" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/>`;
  // cửa sổ lưới + cửa chính
  [[20, 400], [330, 400]].forEach(([x, y]) => { s += `<rect x="${x}" y="${y}" width="110" height="120" fill="#FFD890" stroke="${INK2}" stroke-width="5.5"/><path d="M${x + 37} ${y} V${y + 120} M${x + 74} ${y} V${y + 120} M${x} ${y + 40} H${x + 110} M${x} ${y + 80} H${x + 110}" stroke="${INK2}" stroke-width="4.5"/><rect x="${x - 8}" y="${y - 8}" width="126" height="136" fill="none" stroke="${TQ.wood2}" stroke-width="7"/>`; });
  s += `<path d="M150 ${CB - 30} V470 Q150 440 190 440 H270 Q310 440 310 470 V${CB - 30}Z" fill="#3A2A22" stroke="${INK2}" stroke-width="6"/><path d="M230 440 V${CB - 30}" stroke="${INK2}" stroke-width="4"/><rect x="${160}" y="${450}" width="62" height="226" fill="#5A3A24" opacity="0.4"/>` + `<rect x="150" y="${CB - 34}" width="160" height="10" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="3"/>`;
  s += wxRoof(220, CT, 640, 160, { c: '#4A5A52', tip: TQ.gold, ridge: '#2E3A36', lip: 14, pearl: true });
  s += tqB_glow('tqBuLg', 400, 420, 150, '#FFC866', 0.3) + wxLantern(420, CT + 66, 0.8, '#D8573A', T) + wxLantern(30, CT + 66, 0.7, '#D8573A', T);
  // cờ Ngô trên nóc lầu
  s += `<path d="M300 ${CT - 168} V${CT - 262}" stroke="${INK2}" stroke-width="12"/><path d="M300 ${CT - 168} V${CT - 262}" stroke="${TQ.wood}" stroke-width="6"/>` + tqB_flag(304, CT - 258, 130, 80, TQ.wu, T, 0.9, { tail: true, txt: 'NGÔ', fs: 34 });
  // ---- cột buồm lớn bên phải
  const MX = 1566, MB = 806;
  s += `<path d="M${MX - 30} ${MB} L${MX - 24} -20 H${MX + 24} L${MX + 30} ${MB}Z" fill="${TQ.wood}" stroke="${INK2}" stroke-width="6"/><path d="M${MX + 8} ${MB} L${MX + 10} -20 H${MX + 24} L${MX + 30} ${MB}Z" fill="${TQ.wood2}" opacity="0.6"/><path d="M${MX - 18} ${MB - 20} V0" stroke="${TQ.wood3}" stroke-width="5" opacity="0.7"/>`;
  for (let k = 0; k < 7; k++) { const y = 120 + k * 92; s += `<path d="M${MX - 30} ${y} Q${MX} ${y + 14} ${MX + 30} ${y}" stroke="${INK2}" stroke-width="9" fill="none"/><path d="M${MX - 30} ${y} Q${MX} ${y + 14} ${MX + 30} ${y}" stroke="#D8C08A" stroke-width="4.5" fill="none"/>`; }
  // xà ngang + buồm cuộn
  s += `<path d="M${MX - 280} 190 H${MX + 280}" stroke="${INK2}" stroke-width="22" stroke-linecap="round"/><path d="M${MX - 280} 190 H${MX + 280}" stroke="${TQ.wood3}" stroke-width="13" stroke-linecap="round"/>`;
  s += `<path d="M${MX - 266} 196 Q${MX - 270} 240 ${MX - 230} 252 Q${MX} 276 ${MX + 230} 252 Q${MX + 270} 240 ${MX + 266} 196Z" fill="${TQ.sail}" stroke="${INK2}" stroke-width="5"/>` + [...Array(7)].map((_, i) => `<path d="M${MX - 210 + i * 70} 200 q4 26 -2 52" stroke="${dk(TQ.sail, 0.3)}" stroke-width="3.5" fill="none"/>`).join('') + [-170, 0, 170].map(dx => `<path d="M${MX + dx - 8} 192 V262" stroke="#8A6A3A" stroke-width="8"/>`).join('');
  s += `<path d="M${MX - 266} 196 Q${MX} 214 ${MX + 266} 196" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.4"/>`;
  // dây thừng giằng cột
  for (const [ex, ey] of [[1320, DY - 20], [1230, DY + 90], [1860, DY - 14], [1900, DY + 110]]) s += `<path d="M${MX + (ex < MX ? -10 : 10)} 214 L${ex} ${ey}" stroke="${INK2}" stroke-width="6" fill="none"/><path d="M${MX + (ex < MX ? -10 : 10)} 214 L${ex} ${ey}" stroke="#D8C28A" stroke-width="2.6" fill="none"/>`;
  // chân cột: ống bao + cuộn dây + thùng
  s += `<path d="M${MX - 56} ${MB + 6} Q${MX - 56} ${MB - 70} ${MX - 40} ${MB - 74} H${MX + 40} Q${MX + 56} ${MB - 70} ${MX + 56} ${MB + 6}Z" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5.5"/><path d="M${MX - 52} ${MB - 40} H${MX + 52}" stroke="${INK2}" stroke-width="4"/>`;
  s += `<ellipse cx="${MX + 150}" cy="${MB + 52}" rx="82" ry="22" fill="#C8AA6A" stroke="${INK2}" stroke-width="5"/><ellipse cx="${MX + 150}" cy="${MB + 46}" rx="58" ry="14" fill="#A8884C" stroke="${INK2}" stroke-width="4"/><ellipse cx="${MX + 150}" cy="${MB + 42}" rx="30" ry="7" fill="${dk('#A8884C', 0.3)}"/>`;
  s += barrelD(MX - 200, MB + 30, 0.62) + barrelD(MX - 138, MB + 44, 0.56) + footShadow(MX, MB + 6, 130);
  s += tqFlagD(1740, DY + 50, 360, TQ.wu, T, { txt: 'NGÔ', w: 110, fh: 140, tail: true, pw: 9 });
  // ---- sạp bệnh
  if (BED) s += tqB_bed(560, 900, BED === 2 ? 1 : 0);
  // ánh hoàng hôn phủ nhẹ + tối mép
  s += tqB_rg('tqBuVg', 900, 520, 1300, [[0.6, '#3A1A20', 0], [1, '#3A1A20', 0.35]]) + `<rect width="1920" height="1080" fill="url(#tqBuVg)"/>` + motes(10, 0, 300, 1920, 600, '#FFE0A0', 0.45, 3);
  return s;
}

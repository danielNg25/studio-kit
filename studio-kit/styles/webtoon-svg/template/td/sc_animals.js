// ===== THÚ + ĐẠO CỤ TẬP TÂY DU KÝ PHẦN 2 (2026-10-19, CHỜ DUYỆT C3) — chibi cùng tông nhân vật C2: viền mực dày, tô phẳng 2 tông.
// an_<tên>(x, y, k, T, o)  — (x,y) = điểm chân/đáy, k = tỉ lệ, o.flip = quay trái (mặc định nhìn sang phải). Cờ riêng ghi ở từng hàm.
// pr_<tên>(x, y, k, T, o)  — đạo cụ, (x,y) = tâm đáy (cầm tay: tâm vật), o.rot xoay (độ).
// Dùng chT/chL/CH_INK (chars.js), mixC/R1 (chibi.js). Nạp sau chars_tdk2.js.
const AN_I = '#2A1A14', AN_G = '#E0B048', AN_GS = '#B08428', AN_BL = '#F4A08E';
const anW = (x, y, k, o, inner) => `<g transform="translate(${R1(x)} ${R1(y)}) scale(${o.flip ? -k : k} ${k})${o.rot ? ` rotate(${o.rot})` : ''}">${inner}</g>`;
const anSh = (x, y, rx, op = 0.22) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${R1(rx * 0.12)}" fill="#000" opacity="${op}"/>`;
const anBl = (x, y, rx = 12, ry = 8) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${AN_BL}" opacity="0.7"/>`;
function anSpiral(x, y, r, turns = 2.2, w = 3.5, c = AN_I) {
  let d = ''; for (let i = 0; i <= 28; i++) { const u = i / 28, a = u * turns * Math.PI * 2, rr = r * u; d += (i ? 'L' : 'M') + R1(x + Math.cos(a) * rr) + ' ' + R1(y + Math.sin(a) * rr); }
  return chL(d, w, c);
}
// mắt chibi: kind 'dot' | 'closed' | 'swirl' | 'sad' | 'angry' | 'x' | 'happy'
function anEye(x, y, r = 10, kind = 'dot', iris = null) {
  if (kind === 'closed') return chL(`M${x - r} ${y} Q${x} ${y + r * 0.9} ${x + r} ${y}`, 4);
  if (kind === 'happy') return chL(`M${x - r} ${y + 3} Q${x} ${y - r} ${x + r} ${y + 3}`, 4);
  if (kind === 'swirl') return `<circle cx="${x}" cy="${y}" r="${r * 1.15}" fill="#fff" stroke="${AN_I}" stroke-width="3"/>` + anSpiral(x, y, r * 0.95, 2.2, 2.6);
  if (kind === 'x') return chL(`M${x - r * 0.8} ${y - r * 0.8} L${x + r * 0.8} ${y + r * 0.8} M${x + r * 0.8} ${y - r * 0.8} L${x - r * 0.8} ${y + r * 0.8}`, 4);
  const ir = iris ? `<ellipse cx="${x}" cy="${y + r * 0.1}" rx="${r * 0.78}" ry="${r * 0.95}" fill="${iris}"/><ellipse cx="${x}" cy="${y + r * 0.15}" rx="${r * 0.4}" ry="${r * 0.62}" fill="${AN_I}"/>` : `<ellipse cx="${x}" cy="${y}" rx="${r * 0.82}" ry="${r}" fill="${AN_I}"/>`;
  return (iris ? `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.08}" fill="#FFF8E8" stroke="${AN_I}" stroke-width="3"/>` : '') + ir + `<circle cx="${R1(x + r * 0.28)}" cy="${R1(y - r * 0.32)}" r="${R1(r * 0.3)}" fill="#fff"/><circle cx="${R1(x - r * 0.25)}" cy="${R1(y + r * 0.35)}" r="${R1(r * 0.14)}" fill="#fff" opacity="0.8"/>` + (kind === 'angry' ? chL(`M${x - r * 1.3} ${y - r * 1.5} L${x + r * 1.1} ${y - r * 0.6}`, 5) : kind === 'sad' ? chL(`M${x - r * 1.2} ${y - r * 0.7} L${x + r * 1.2} ${y - r * 1.6}`, 4) : '');
}
const anDrop = (x, y, s = 1, c = '#CDEBFF') => `<path d="M${x} ${y - 14 * s} Q${x + 11 * s} ${y + 2 * s} ${x} ${y + 8 * s} Q${x - 11 * s} ${y + 2 * s} ${x} ${y - 14 * s}Z" fill="${c}" stroke="${AN_I}" stroke-width="2.5"/>`;
const anStar = (x, y, r, c = '#FFE27A') => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + R1(x + Math.cos(a) * rr) + ' ' + R1(y + Math.sin(a) * rr); } return `<path d="${d}Z" fill="${c}" stroke="${AN_I}" stroke-width="2.5" stroke-linejoin="round"/>`; };
function anLeg(x0, top, bot, w, dx, C, CS, hoof = '#5A4A40', hh = 14) {
  return chT(`M${x0 - w} ${top} L${x0 + w} ${top} L${R1(x0 + w * 0.85 + dx)} ${bot - hh} L${R1(x0 - w * 0.85 + dx)} ${bot - hh}Z`, C, CS, { sx: 5, sy: 0, lw: 4 }) +
    chT(`M${R1(x0 - w * 0.95 + dx)} ${bot - hh} L${R1(x0 + w * 0.95 + dx)} ${bot - hh} L${R1(x0 + w * 1.05 + dx)} ${bot} L${R1(x0 - w * 1.05 + dx)} ${bot}Z`, hoof, mixC(hoof, '#000000', 0.3), { sx: 3, sy: 0, lw: 3.5 });
}

// ---------------------------------------------------------------- NGỰA TRẮNG (an_ngua): o.walk bước đi · o.hurt bị thương (băng chân trước, mắt buồn) · o.noSaddle
function an_ngua(x, y, k, T, o = {}) {
  const C = '#FBF8F2', CS = '#D4CEC2', M = '#E8E2D4', MS = '#BDB6A6', ph = T * 6, wk = o.walk ? 1 : 0.12;
  const sw = (p) => Math.sin(ph + p) * 18 * wk, lift = (p) => (o.walk ? Math.max(0, Math.cos(ph + p)) * 12 : 0);
  let s = anSh(0, 2, 150);
  s += anLeg(-84, -112, -lift(1), 17, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#6A5A50') + anLeg(86, -112, -lift(0), 17, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#6A5A50');   // chân xa
  const tl = Math.sin(T * 2.2) * 10;
  s += chT(`M-116 -176 Q${-172 + tl} -170 ${-186 + tl} -112 Q${-196 + tl} -66 ${-160 + tl} -48 Q${-154 + tl} -92 ${-128 + tl} -112 Q-108 -132 -108 -150Z`, M, MS, { sx: 6, sy: 4, lw: 4 });   // đuôi
  s += chT('M-122 -148 Q-128 -204 -62 -208 Q20 -216 92 -204 Q132 -194 130 -144 Q126 -100 70 -96 Q0 -90 -70 -96 Q-118 -100 -122 -148Z', C, CS, { sx: 10, sy: 8, lw: 4.5 });
  s += anLeg(-62, -108, -lift(0), 18, sw(0), C, CS, '#6A5A50') + anLeg(62, -108, -lift(1), 18, sw(Math.PI), C, CS, '#6A5A50');   // chân gần
  if (o.hurt) { const bx = 62 + sw(Math.PI) * 0.5, by = -60; s += `<path d="M${bx - 22} ${by - 14} L${bx + 20} ${by - 22} L${bx + 22} ${by + 10} L${bx - 20} ${by + 18}Z" fill="#FFFFFF" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/>` + chL(`M${bx - 20} ${by - 4} L${bx + 21} ${by - 10} M${bx - 19} ${by + 6} L${bx + 21} ${by}`, 2.5, '#C8B8A0') + `<circle cx="${bx + 4}" cy="${by}" r="5" fill="#D8483A"/>`; }
  if (!o.noSaddle) {
    s += chT('M-50 -206 Q10 -218 66 -204 L60 -150 Q10 -138 -44 -150Z', '#C8452E', '#8E2A22', { sx: 6, sy: 5, lw: 4 });
    s += chT('M-44 -150 Q10 -138 60 -150 L58 -134 Q10 -122 -42 -134Z', AN_G, AN_GS, { sx: 3, sy: 3, lw: 3.5 }) + chL('M-40 -176 Q10 -188 56 -176', 3, AN_GS) + `<circle cx="10" cy="-186" r="7" fill="${AN_G}" stroke="${AN_I}" stroke-width="2.5"/>`;
  }
  const hd = o.hurt ? 14 : 0;   // đầu cúi khi bị thương
  s += `<g transform="translate(0 ${hd}) rotate(${o.hurt ? 8 : 0} 100 -190)">`;
  s += chT(`M94 -280 Q60 -276 56 -226 Q52 -186 84 -170 Q80 -204 100 -226 Q94 -250 110 -266Z`, M, MS, { sx: 6, sy: 4, lw: 4 });   // bờm
  s += chT('M96 -196 Q90 -278 142 -300 Q192 -304 208 -264 L266 -240 Q288 -224 274 -200 Q256 -182 228 -188 Q200 -174 160 -174 Q118 -168 96 -196Z', C, CS, { sx: 12, sy: 8, lw: 4.5 });
  s += chT('M128 -292 Q124 -336 148 -344 Q164 -322 162 -292Z', C, CS, { sx: 4, sy: 3, lw: 4 }) + `<path d="M138 -300 Q136 -324 148 -330 Q154 -316 152 -300Z" fill="#F4B8B0"/>`;
  s += chT('M140 -302 Q172 -318 182 -284 Q164 -296 148 -288Z', M, MS, { sx: 3, sy: 2, lw: 3.5 });   // mái
  s += `<ellipse cx="254" cy="-214" rx="24" ry="18" fill="#F4D8CC" opacity="0.7"/><ellipse cx="266" cy="-222" rx="4.5" ry="3.5" fill="${AN_I}"/>` + chL('M232 -202 Q248 -196 262 -202', 3);
  s += anEye(176, -238, 12, o.hurt ? 'sad' : 'dot') + anBl(196, -210, 14, 9);
  if (!o.noSaddle) s += chL('M208 -264 L180 -244 M214 -236 L250 -196', 5, '#C8452E') + chL('M206 -262 Q214 -240 226 -222', 4, '#C8452E') + `<circle cx="230" cy="-208" r="5" fill="${AN_G}" stroke="${AN_I}" stroke-width="2"/>`;
  if (o.hurt) s += anDrop(206, -280, 1) + chL('M150 -332 L158 -312 L142 -312Z', 0);   // mồ hôi
  s += '</g>';
  if (!o.noSaddle) s += chL(`M${232} ${-206 + hd} Q150 ${-150 + hd} 40 -184`, 4, '#C8452E');   // dây cương
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- ĐẦU RỒNG (dùng chung) + RỒNG
// c: {col, sh, bell, horn, mane, eye}   o: eye 'dot'|'closed'|'swirl'|'sad'|'angry' · open miệng mở · tongue
function anDragHead(c, T, o = {}) {
  const sw = Math.sin(T * 2.4), ey = o.eye || 'dot';
  let s = '';
  for (const [dy, l, ph] of [[-44, 66, 0], [-14, 82, 1.2], [18, 64, 2.4]]) { const w = Math.sin(T * 3 + ph) * 7; s += chT(`M-24 ${dy - 12} Q${-24 - l * 0.5} ${dy - 22 + w} ${-24 - l} ${dy + 6 + w} Q${-24 - l * 0.55} ${dy + 6} -24 ${dy + 14}Z`, c.mane, mixC(c.mane, '#000000', 0.22), { sx: 3, sy: 3, lw: 3.4 }); }   // bờm
  const hr = `M12 -62 Q-8 -112 -48 -124 M-8 -92 Q-4 -116 -24 -134`; s += chL(hr, 13) + chL(hr, 7, c.horn);   // sừng
  s += chT('M-50 -4 Q-54 -64 4 -70 Q58 -72 76 -38 Q106 -40 128 -22 Q142 -6 132 10 Q114 24 82 24 Q62 56 6 56 Q-48 54 -50 -4Z', c.col, c.sh, { sx: 12, sy: 9, lw: 4.5 });
  s += chT('M80 8 Q112 16 132 6 Q132 22 108 28 Q84 32 70 26Z', c.bell, mixC(c.bell, '#000000', 0.12), { sx: 3, sy: 3, lw: 0 });   // mõm dưới sáng
  if (o.open) s += `<path d="M130 6 Q92 -2 52 6 Q76 46 126 24Z" fill="#7A2228" stroke="${AN_I}" stroke-width="3.5" stroke-linejoin="round"/><path d="M80 22 Q104 20 118 28 Q104 38 84 34Z" fill="#EE8E8E"/><path d="M124 8 l-6 12 l-6 -11Z M104 5 l-5 11 l-6 -10Z" fill="#fff" stroke="${AN_I}" stroke-width="2"/>`;
  else s += chL('M130 8 Q90 20 46 10', 3.6) + `<path d="M118 14 l-4 8 l-5 -7Z" fill="#fff" stroke="${AN_I}" stroke-width="2"/>`;
  s += `<ellipse cx="122" cy="-10" rx="5" ry="4" fill="${AN_I}"/><ellipse cx="104" cy="-14" rx="4" ry="3" fill="${AN_I}"/>`;
  s += anEye(26, -22, 13, ey, c.eye || null) + anBl(36, 14, 14, 9);
  s += chL(`M2 -50 Q26 ${-62 - (o.angry ? -10 : 0)} 50 ${-50 + (o.angry ? 14 : 0)}`, 5, c.mane2 || mixC(c.mane, '#000000', 0.4));
  if (o.angry) s += chL('M0 -58 L50 -36', 6);
  for (const [x0, y0, dy] of [[112, 2, -26], [102, 14, 34]]) { const w = Math.sin(T * 3 + dy) * 9, d = `M${x0} ${y0} Q${x0 + 54} ${y0 + dy * 0.2 + w} ${x0 + 100} ${y0 + dy + w}`; s += chL(d, 5.5) + chL(d, 2.6, c.horn); }   // râu
  s += chT('M-34 30 L-72 38 L-40 50Z', c.mane, mixC(c.mane, '#000000', 0.2), { sx: 3, sy: 3, lw: 3 });
  if (o.pearl) s += `<circle cx="-6" cy="60" r="13" fill="#BFF0F0" stroke="${AN_I}" stroke-width="3.5"/><circle cx="-10" cy="55" r="4" fill="#fff"/>`;
  return s;
}
function anDragon(x, y, k, T, o, c) {
  const n = c.n || 36, L = c.len, pts = [];
  const leap = o.leap ? 1 : 0, spd = c.spd || 2.2;
  for (let i = 0; i <= n; i++) {
    const u = i / n; let px, py;
    if (leap) { px = -L * 0.34 + u * L * 0.5 + Math.sin(T * 6 + u * 4) * 3; py = -Math.pow(u, 1.25) * c.leapH + Math.sin(u * 7 + T * 5) * 10 * (1 - u) + 4; }
    else { px = -L * 0.5 + u * L; py = -c.base - u * u * c.rise - Math.sin(u * c.waves * Math.PI * 2 + T * spd) * c.amp * (0.3 + 0.7 * Math.sin(Math.PI * Math.min(1, u * 1.1))); }
    pts.push([px, py, c.r0 + (c.r1 - c.r0) * Math.pow(u, 0.6)]);
  }
  const tg = (i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const up = (i, f = 1) => { const [tx, ty] = tg(i); return [pts[i][0] + ty * pts[i][2] * f, pts[i][1] - tx * pts[i][2] * f]; };
  const edge = (f) => pts.map((_, i) => up(i, f));
  const poly = (A) => A.map(([px, py], i) => (i ? 'L' : 'M') + R1(px) + ' ' + R1(py)).join('');
  let s = '';
  if (!leap) s += anSh(0, 2, L * 0.55, 0.18);
  // đuôi vẫy (phía sau thân)
  { const [px, py] = pts[0], [tx, ty] = tg(0), a = Math.atan2(-ty, -tx), wv = Math.sin(T * 5) * 0.25; s += `<g transform="translate(${R1(px)} ${R1(py)}) rotate(${R1((a + wv) * 180 / Math.PI)})">` + chT('M0 0 Q26 -36 66 -32 Q54 -12 80 6 Q42 8 50 32 Q20 24 0 6Z', c.mane, mixC(c.mane, '#000000', 0.22), { sx: 4, sy: 3, lw: 3.6 }) + '</g>'; }
  // vây lưng: gai nhọn có sừng
  for (let i = 3; i < n - 1; i += 3) { const [px, py] = up(i, 0.95), [tx, ty] = tg(i); s += chT(`M${R1(px - tx * 9)} ${R1(py - ty * 9)} L${R1(px + ty * 17)} ${R1(py - tx * 17)} L${R1(px + tx * 9)} ${R1(py + ty * 9)}Z`, c.mane, mixC(c.mane, '#000000', 0.2), { sx: 0, sy: 0, lw: 3 }); }
  // chân nhỏ
  if (!leap) for (const i of [Math.round(n * 0.34), Math.round(n * 0.74)]) { const [px, py, r] = pts[i]; s += chT(`M${R1(px - 10)} ${R1(py + r * 0.5)} L${R1(px + 10)} ${R1(py + r * 0.5)} L${R1(px + 10)} ${R1(py + r + 24)} L${R1(px - 10)} ${R1(py + r + 24)}Z`, c.col, c.sh, { sx: 3, sy: 0, lw: 3.5 }) + `<path d="M${R1(px - 13)} ${R1(py + r + 24)} h26 l2 8 h-30Z" fill="${c.horn}" stroke="${AN_I}" stroke-width="2.5"/>`; }
  // thân: ống liền, 2 tông + bụng sáng
  const U = edge(1), D = edge(-1), body = poly(U) + D.slice().reverse().map(([px, py]) => 'L' + R1(px) + ' ' + R1(py)).join('') + 'Z';
  s += chT(body, c.col, c.sh, { sx: 3, sy: 7, lw: 5 });
  const belly = poly(edge(-1)) + edge(-0.15).reverse().map(([px, py]) => 'L' + R1(px) + ' ' + R1(py)).join('') + 'Z';
  s += `<path d="${belly}" fill="${c.bell}" opacity="0.9"/>`;
  for (let i = 3; i < n - 2; i += 2) { const [px, py, r] = pts[i], [tx, ty] = tg(i); s += chL(`M${R1(px + ty * r * 0.35 - tx * 5)} ${R1(py - tx * r * 0.35 - ty * 5)} q${R1(-ty * 5 + tx * 7)} ${R1(tx * 5 + ty * 7)} ${R1(tx * 14)} ${R1(ty * 14)}`, 2.6, c.sh, 0.9); }
  s += chL(poly(U) + D.slice().reverse().map(([px, py]) => 'L' + R1(px) + ' ' + R1(py)).join('') + 'Z', 5);
  // đầu
  const [hx, hy] = pts[n], [tx, ty] = tg(n), ha = Math.atan2(ty, tx), hs = c.hs || 1, hr = Math.max(-0.9, Math.min(0.5, ha * 0.9));
  s += `<g transform="translate(${R1(hx - 6)} ${R1(hy)}) rotate(${R1(hr * 180 / Math.PI)}) scale(${hs})">${anDragHead(c, T, o)}</g>`;
  return s;
}
// RỒNG TRẮNG NHỎ (an_rong_trang): con trai Tây Hải Long Vương — o.leap nhảy lên khỏi nước (có bọt) · o.pearl=false bỏ viên châu cổ · o.eye · o.open · o.hurt
function an_rong_trang(x, y, k, T, o = {}) {
  const c = { col: '#FBF8F0', sh: '#D6D0C6', bell: '#FFF0C8', horn: '#E8C060', mane: '#8EC4E4', eye: '#3AA0C8', len: 300, n: 22, r0: 9, r1: 34, base: 40, rise: 70, waves: 1.3, amp: 22, hs: 1.0, leapH: 200 };
  const oo = Object.assign({ pearl: o.pearl !== false, eye: 'dot' }, o);
  let s = anDragon(0, 0, 1, T, oo, c);
  if (o.leap) { for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r = 22 + (i % 3) * 20, u = (T * 1.6 + i * 0.13) % 1; s += `<circle cx="${R1(-120 + Math.cos(a) * 70 + i * 14)}" cy="${R1(-10 - u * 110 * (1 - u) * 2.6 - (i % 3) * 18)}" r="${R1(7 - (i % 3) * 1.5)}" fill="#BFE6F6" stroke="${AN_I}" stroke-width="2.5"/>`; }
    s += `<ellipse cx="-110" cy="6" rx="110" ry="16" fill="#8FC8E4" stroke="${AN_I}" stroke-width="4"/><path d="M-190 4 q20 -22 40 0 q20 -26 44 0 q20 -22 44 0" fill="#fff" stroke="${AN_I}" stroke-width="3.5"/>`; }
  return anW(x, y, k, o, s);
}
// KINH HÀ LONG VƯƠNG nguyên hình (an_rong_kinh): rồng dài xanh trắng cuộn trên mây — o.angry · o.eye · o.open · o.cloud=false · o.leap
function an_rong_kinh(x, y, k, T, o = {}) {
  const c = { col: '#C4E0EE', sh: '#8EB6CE', bell: '#F6FAFC', horn: '#F0D070', mane: '#2E6AA0', mane2: '#1E3E6A', eye: '#E8B830', len: 460, n: 40, r0: 10, r1: 40, base: 78, rise: 110, waves: 1.9, amp: 44, hs: 1.05, leapH: 280 };
  let s = '';
  if (o.cloud !== false) s += `<g transform="translate(0 40)">` + [[-170, 0, 70], [-70, 14, 86], [40, 6, 80], [140, 16, 72], [-110, 34, 60], [90, 38, 58]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${AN_I}" stroke="${AN_I}" stroke-width="8"/>`).join('') + [[-170, 0, 70], [-70, 14, 86], [40, 6, 80], [140, 16, 72], [-110, 34, 60], [90, 38, 58]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF2F8"/>`).join('') + `<path d="M-230 56 Q0 84 220 56 Q200 30 0 40 Q-200 30 -230 56Z" fill="#D2DAE8"/></g>`;
  s += anDragon(0, 0, 1, T, Object.assign({ eye: 'dot', angry: o.angry }, o), c);
  return anW(x, y, k, o, s);
}
// ĐẦU RỒNG BỊ CHÉM (an_rong_dau): hoạt hình, không máu me — mắt ngất xoáy, sao quay, vài giọt đỏ cách điệu, cuộn mây ở cổ; o.col đổi màu (mặc định rồng sông Kinh)
function an_rong_dau(x, y, k, T, o = {}) {
  const c = { col: '#C4E0EE', sh: '#8EB6CE', bell: '#F6FAFC', horn: '#F0D070', mane: '#2E6AA0', mane2: '#1E3E6A', eye: '#E8B830' };
  let s = anSh(10, 4, 150, 0.25);
  s += `<g transform="translate(0 -52) rotate(${o.tilt ?? -14})">`;
  s += [[-70, 30, 30], [-44, 46, 34], [-100, 52, 24]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="${AN_I}"/>`).join('') + [[-70, 30, 30], [-44, 46, 34], [-100, 52, 24]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF2F8"/>`).join('');
  s += `<g transform="scale(1.25)">${anDragHead(c, T, { eye: o.eye || 'swirl', open: o.open !== false, pearl: false })}</g>`;
  for (let i = 0; i < 3; i++) { const a = T * 2.2 + i * 2.1; s += anStar(Math.cos(a) * 80 + 20, -118 + Math.sin(a) * 14, 12); }
  s += '</g>';
  if (o.drops !== false) s += [[-88, -8, 0.9], [-120, 6, 0.7], [-56, 2, 0.6]].map(([dx, dy, sc]) => anDrop(dx, dy - 4, sc, '#E0524A')).join('');
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- HẠC TRẮNG (an_hac): o.fly bay (dang cánh vỗ) · chỗ ngồi cho người cưỡi: an_hac_seat(x,y,k,o) → [sx, sy]
function an_hac_seat(x, y, k, o = {}) { return [x + (o.flip ? -1 : 1) * k * -4, y + k * -226]; }
function an_hac(x, y, k, T, o = {}) {
  const C = '#FDFBF6', CS = '#D8D6D0', B = '#2A2630', R = '#D8483A', fly = !!o.fly, fl = Math.sin(T * 5) * 28, bob = fly ? Math.sin(T * 3) * 6 : 0;
  let s = fly ? '' : anSh(0, 2, 120);
  s += `<g transform="translate(0 ${R1(bob)})">`;
  // chân dài (đứng) / duỗi ra sau (bay)
  if (fly) s += chL('M-30 -126 Q-90 -110 -150 -96 M-14 -122 Q-80 -96 -140 -78', 8, AN_I) + chL('M-30 -126 Q-90 -110 -150 -96 M-14 -122 Q-80 -96 -140 -78', 4, '#C86A50');
  else for (const dx of [-14, 26]) s += chL(`M${dx} -130 L${dx + 2} -14`, 11, AN_I) + chL(`M${dx} -130 L${dx + 2} -14`, 6, '#C86A50') + chT(`M${dx - 4} -12 L${dx + 28} -12 L${dx + 20} 0 L${dx - 6} 0Z`, '#9A5A48', '#6E3A2E', { sx: 2, sy: 2, lw: 3 });
  // cánh sau (xa) khi bay
  if (fly) s += `<g transform="rotate(${R1(-fl - 20)} -10 -190)">` + chT('M-10 -196 Q-40 -300 -140 -330 Q-120 -280 -150 -250 Q-100 -250 -130 -210 Q-60 -214 -10 -190Z', CS, mixC(CS, '#000000', 0.15), { sx: 6, sy: 6, lw: 4 }) + '</g>';
  // đuôi đen
  s += chT('M-98 -176 Q-150 -190 -176 -160 Q-146 -164 -126 -150 Q-160 -140 -168 -112 Q-122 -124 -92 -148Z', B, '#12101A', { sx: 4, sy: 4, lw: 3.5 });
  // thân
  s += chT('M-104 -176 Q-110 -240 -20 -246 Q60 -248 98 -214 Q112 -180 70 -140 Q10 -112 -60 -126 Q-104 -138 -104 -176Z', C, CS, { sx: 10, sy: 8, lw: 4.5 });
  // cổ cong S + đầu
  const nk = Math.sin(T * 2.2) * 4;
  s += chL(`M72 -214 Q${126 + nk} -240 ${112 + nk} -290 Q${100 + nk} -330 ${128 + nk} -352`, 36, AN_I) + chL(`M72 -214 Q${126 + nk} -240 ${112 + nk} -290 Q${100 + nk} -330 ${128 + nk} -352`, 28, C);
  s += chL(`M${96 + nk} -250 Q${112 + nk} -280 ${106 + nk} -312`, 8, CS, 0.9);
  const hx = 134 + nk, hy = -362;
  s += `<path d="M${hx + 6} ${hy - 8} L${hx + 92} ${hy + 6} L${hx + 8} ${hy + 22}Z" fill="#E8A850" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/><path d="M${hx + 8} ${hy + 6} L${hx + 90} ${hy + 6}" stroke="${AN_I}" stroke-width="2.5"/>`;
  s += `<circle cx="${hx}" cy="${hy}" r="30" fill="${C}" stroke="${AN_I}" stroke-width="4.5"/><path d="M${hx - 28} ${hy - 12} Q${hx - 6} ${hy - 44} ${hx + 24} ${hy - 20} Q${hx} ${hy - 22} ${hx - 28} ${hy - 12}Z" fill="${R}" stroke="${AN_I}" stroke-width="3.5"/>`;
  s += `<path d="M${hx - 26} ${hy + 12} Q${hx - 20} ${hy + 2} ${hx - 6} ${hy + 4} L${hx - 10} ${hy + 14}Z" fill="${B}"/>` + anEye(hx + 8, hy - 2, 7) + anBl(hx + 18, hy + 14, 8, 5);
  // cánh gần
  if (fly) s += `<g transform="rotate(${R1(fl)} -10 -190)">` + chT('M-10 -196 Q10 -330 -110 -350 Q-90 -300 -126 -266 Q-70 -270 -100 -224 Q-40 -226 0 -190Z', C, CS, { sx: 8, sy: 8, lw: 4.5 }) + chT('M-110 -350 Q-90 -300 -126 -266 Q-100 -270 -116 -300Z', B, '#12101A', { sx: 2, sy: 2, lw: 3 }) + '</g>';
  else s += chT('M-84 -190 Q-70 -232 -10 -226 Q40 -222 60 -190 Q20 -170 -40 -170 Q-80 -170 -84 -190Z', C, CS, { sx: 6, sy: 6, lw: 4 }) + chT('M-84 -190 Q-100 -168 -150 -166 Q-120 -178 -112 -192Z', B, '#12101A', { sx: 2, sy: 2, lw: 3 });
  s += '</g>';
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- GẤU ĐEN HẮC PHONG (an_gau): o.ring bị đội vòng vàng trên đầu, ôm đầu lăn lộn (mắt xoáy, nước mắt) · o.roll ép góc lăn (độ)
function an_gau(x, y, k, T, o = {}) {
  const C = '#463C42', CS = '#2A2228', M = '#E8D8B8', ring = !!o.ring, worn = !!o.worn, fierce = !!o.fierce;   // fierce: mặt dữ tợn (lúc ăn trộm/đánh nhau) · worn: đã đội vòng, mặt hiền
  const rot = ring ? (o.roll ?? Math.sin(T * 5) * 22) : 0;
  let s = anSh(0, 2, 120, ring ? 0.2 : 0.25);
  s += `<g transform="rotate(${R1(rot)} 0 -90)">`;
  for (const dx of [-52, 52]) s += chT(`M${dx - 34} -40 Q${dx - 38} 0 ${dx} 0 Q${dx + 38} 0 ${dx + 34} -40Z`, C, CS, { sx: 6, sy: 4, lw: 4.5 }) + `<ellipse cx="${dx}" cy="-12" rx="17" ry="10" fill="${M}" stroke="${AN_I}" stroke-width="3"/>`;
  s += chT('M-96 -80 Q-100 -190 0 -196 Q100 -190 96 -80 Q80 -30 0 -28 Q-80 -30 -96 -80Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chT('M-34 -168 Q0 -130 34 -168 Q24 -120 0 -108 Q-24 -120 -34 -168Z', '#F4ECDC', '#D6CBB6', { sx: 3, sy: 3, lw: 3.5 });   // mảng ngực
  if (!ring) for (const sg of [-1, 1]) s += chT(`M${sg * 86} -150 Q${sg * 130} -120 ${sg * 118} -76 Q${sg * 98} -60 ${sg * 82} -90Z`, C, CS, { sx: 4, sy: 4, lw: 4 });   // tay buông
  // đầu
  s += chT('M-58 -312 Q-76 -350 -48 -358 Q-22 -358 -16 -332Z', C, CS, { sx: 3, sy: 3, lw: 4 }) + chT('M58 -312 Q76 -350 48 -358 Q22 -358 16 -332Z', C, CS, { sx: 3, sy: 3, lw: 4 });
  s += `<circle cx="-48" cy="-336" r="10" fill="#C89A8A"/><circle cx="48" cy="-336" r="10" fill="#C89A8A"/>`;
  s += chT('M-90 -246 Q-92 -334 0 -338 Q92 -334 90 -246 Q86 -176 0 -172 Q-86 -176 -90 -246Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += `<ellipse cx="0" cy="-216" rx="44" ry="34" fill="${M}" stroke="${AN_I}" stroke-width="4"/><ellipse cx="0" cy="-230" rx="15" ry="11" fill="${AN_I}"/><circle cx="-4" cy="-234" r="3.5" fill="#fff"/>` + (fierce ? chL('M0 -219 V-210', 3.4) : chL('M0 -219 V-206 M-18 -202 Q0 -190 18 -202', 3.4));
  const ek = ring ? 'swirl' : 'dot';
  if (fierce) {   // trừng mắt, mày chéo xuống, nhe răng nanh
    for (const sg of [-1, 1]) s += `<ellipse cx="${sg * 40}" cy="-262" rx="15" ry="11" fill="#FFF4D8" stroke="${AN_I}" stroke-width="4"/><circle cx="${sg * 36}" cy="-261" r="6.5" fill="${AN_I}"/>` + chL(`M${sg * 70} -296 L${sg * 16} -272`, 10);
    s += `<path d="M-30 -203 Q0 -216 30 -203 Q0 -186 -30 -203Z" fill="#5A1E24" stroke="${AN_I}" stroke-width="3.5"/><path d="M-22 -205 l6 15 l7 -13Z M10 -205 l7 13 l6 -15Z" fill="#FFFFFF" stroke="${AN_I}" stroke-width="2.5" stroke-linejoin="round"/>` + chL('M-60 -240 Q-52 -226 -44 -236 M60 -240 Q52 -226 44 -236', 3);
  } else s += anEye(-40, -262, ring ? 13 : 9, ek) + anEye(40, -262, ring ? 13 : 9, ek) + anBl(-62, -226, 12, 8) + anBl(62, -226, 12, 8);
  if (worn && !ring) { const band = 'M-88 -286 Q0 -322 88 -286'; s += chL(band, 22) + chL(band, 14, AN_G) + chL('M-80 -290 Q0 -324 80 -290', 4, '#FFF0B0'); if (typeof tdk2Cloud === 'function') s += tdk2Cloud(0, -336, 28, AN_G, 1.1); }
  if (ring) {   // vòng kim cô: đai vàng + mây xoắn vàng như vòng trên đầu Ngộ Không
    const band = 'M-88 -286 Q0 -322 88 -286'; s += chL(band, 22) + chL(band, 14, AN_G) + chL('M-80 -290 Q0 -324 80 -290', 4, '#FFF0B0');
    if (typeof tdk2Cloud === 'function') s += tdk2Cloud(0, -336, 28, AN_G, 1.1);
    s += anDrop(-76, -240 + Math.sin(T * 6) * 4, 1, '#CDEBFF') + anDrop(78, -236 + Math.cos(T * 6) * 4, 0.9, '#CDEBFF');
    for (const sg of [-1, 1]) s += chT(`M${sg * 100} -150 Q${sg * 120} -220 ${sg * 90} -296 Q${sg * 60} -270 ${sg * 74} -190 Q${sg * 76} -160 ${sg * 100} -150Z`, C, CS, { sx: 4, sy: 4, lw: 4 }) + `<ellipse cx="${sg * 86}" cy="-300" rx="20" ry="16" fill="${C}" stroke="${AN_I}" stroke-width="4"/>`;   // hai tay ôm đầu
    s += anStar(-100 + Math.cos(T * 4) * 10, -370, 13) + anStar(96, -376 + Math.sin(T * 4) * 8, 11);
  }
  s += '</g>';
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- SƯ TỬ XANH NƯỚC Ô KÊ (an_thanh_su): o.roar há miệng gầm · o.collar=false bỏ vòng vàng cổ · o.walk
function an_thanh_su(x, y, k, T, o = {}) {
  const C = '#6AA0D8', CS = '#4A78B0', MN = '#2E5AA8', MN2 = '#4C7AC8', F = '#9CC4EC', ph = T * 6, wk = o.walk ? 1 : 0.1, br = Math.sin(T * 2.4) * 3;
  let s = anSh(0, 2, 150);
  const sw = (p) => Math.sin(ph + p) * 16 * wk;
  s += anLeg(-80, -104, 0, 18, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#F0E4C8', 16) + anLeg(86, -104, 0, 18, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#F0E4C8', 16);
  const tl = Math.sin(T * 2.6) * 10;
  s += chL(`M-112 -150 Q${-170 + tl} -150 ${-190 + tl} -112`, 12) + chL(`M-112 -150 Q${-170 + tl} -150 ${-190 + tl} -112`, 7, C) + chT(`M${-206 + tl} -126 Q${-214 + tl} -92 ${-190 + tl} -78 Q${-166 + tl} -92 ${-174 + tl} -124Z`, MN, mixC(MN, '#000000', 0.25), { sx: 3, sy: 3, lw: 3.6 });
  s += chT(`M-118 -148 Q-124 ${-206 + br} -50 ${-208 + br} Q40 ${-214 + br} 100 ${-198 + br} Q134 -176 120 -140 Q100 -98 40 -94 Q-30 -88 -86 -96 Q-116 -104 -118 -148Z`, C, CS, { sx: 10, sy: 8, lw: 4.5 });
  s += `<path d="M-60 -126 Q-10 -112 40 -124" stroke="${F}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  s += anLeg(-52, -104, 0, 19, sw(0), C, CS, '#F0E4C8', 16) + anLeg(66, -100, 0, 19, sw(Math.PI), C, CS, '#F0E4C8', 16);
  // bờm: vòng lửa xanh
  const mx = 150, my = -212; let mane = ''; const spikes = 14;
  for (let r = 0; r < 2; r++) for (let i = 0; i < spikes; i++) { const a = (i + r * 0.5) / spikes * Math.PI * 2, w = Math.sin(T * 3 + i) * 5, R0 = r ? 70 : 92, R1_ = r ? 108 : 138 + w; const a2 = a + Math.PI / spikes * 0.9; mane += `<path d="M${R1(mx + Math.cos(a - 0.2) * R0)} ${R1(my + Math.sin(a - 0.2) * R0)} L${R1(mx + Math.cos(a + 0.06) * R1_)} ${R1(my + Math.sin(a + 0.06) * R1_)} L${R1(mx + Math.cos(a2) * R0)} ${R1(my + Math.sin(a2) * R0)}Z" fill="${r ? MN2 : MN}" stroke="${AN_I}" stroke-width="3.5" stroke-linejoin="round"/>`; }
  s += mane + `<circle cx="${mx}" cy="${my}" r="94" fill="${MN2}" stroke="${AN_I}" stroke-width="4"/>`;
  // vòng vàng ở cổ
  if (o.collar !== false) s += chT(`M96 -150 Q112 -110 160 -104 Q208 -110 218 -150 L204 -156 Q190 -128 160 -126 Q128 -128 112 -158Z`, AN_G, AN_GS, { sx: 3, sy: 4, lw: 4 }) + `<circle cx="160" cy="-106" r="12" fill="${AN_G}" stroke="${AN_I}" stroke-width="3.5"/><path d="M154 -102 h12" stroke="${AN_I}" stroke-width="3"/>`;
  // mặt
  s += chT(`M${mx - 76} ${my + 8} Q${mx - 82} ${my - 70} ${mx} ${my - 74} Q${mx + 82} ${my - 70} ${mx + 76} ${my + 8} Q${mx + 66} ${my + 66} ${mx} ${my + 68} Q${mx - 66} ${my + 66} ${mx - 76} ${my + 8}Z`, F, mixC(F, '#000000', 0.14), { sx: 8, sy: 6, lw: 4.5 });
  s += chT(`M${mx - 60} ${my - 66} Q${mx - 66} ${my - 100} ${mx - 40} ${my - 96} Q${mx - 26} ${my - 82} ${mx - 28} ${my - 70}Z`, CS, mixC(CS, '#000000', 0.2), { sx: 2, sy: 2, lw: 3.5 }) + chT(`M${mx + 60} ${my - 66} Q${mx + 66} ${my - 100} ${mx + 40} ${my - 96} Q${mx + 26} ${my - 82} ${mx + 28} ${my - 70}Z`, CS, mixC(CS, '#000000', 0.2), { sx: 2, sy: 2, lw: 3.5 });
  s += `<ellipse cx="${mx + 2}" cy="${my + 28}" rx="40" ry="30" fill="#F4ECD8" stroke="${AN_I}" stroke-width="3.5"/><path d="M${mx - 12} ${my + 12} h28 l-14 16Z" fill="#4A3040" stroke="${AN_I}" stroke-width="3"/>`;
  if (o.roar) s += `<path d="M${mx - 26} ${my + 38} Q${mx + 2} ${my + 76} ${mx + 30} ${my + 38}Z" fill="#7A2228" stroke="${AN_I}" stroke-width="3.5"/><path d="M${mx - 20} ${my + 40} l6 12 l6 -10 M${mx + 8} ${my + 40} l6 12 l6 -12" fill="#fff" stroke="${AN_I}" stroke-width="2"/>`;
  else s += chL(`M${mx + 2} ${my + 28} V${my + 40} M${mx - 20} ${my + 38} Q${mx + 2} ${my + 52} ${mx + 22} ${my + 38}`, 3.4);
  s += anEye(mx - 32, my - 22, 11, o.roar ? 'angry' : 'dot') + anEye(mx + 34, my - 22, 11, o.roar ? 'angry' : 'dot') + anBl(mx - 56, my + 14, 12, 8) + anBl(mx + 58, my + 14, 12, 8);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- TRÂU XANH ĐỘC GIÁC (an_thanh_nguu): một sừng trắng · o.ring Kim Cương Trác xỏ mũi + dây lưng buộc làm dây dắt (o.leashX/o.leashY điểm tay Lão Quân, toạ độ cục bộ) · o.tired thè lưỡi, mệt · o.walk
function an_thanh_nguu(x, y, k, T, o = {}) {
  const C = '#6A8AA8', CS = '#4E6E8C', M = '#9CB6CE', HN = '#F2ECD8', ph = T * 5, wk = o.walk ? 1 : 0.1, br = Math.sin(T * 2.2) * 3, sw = (p) => Math.sin(ph + p) * 14 * wk;
  const hoof = (x0, dx) => `<path d="M${R1(x0 - 24 + dx)} -18 h48 l4 18 h-56Z" fill="#2E3A4A" stroke="${AN_I}" stroke-width="3.5" stroke-linejoin="round"/>`;
  let s = anSh(0, 2, 190);
  s += anLeg(-110, -100, -16, 24, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#2E3A4A', 16) + anLeg(104, -100, -16, 24, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#2E3A4A', 16);
  const tl = Math.sin(T * 2.4) * 10;
  s += chL(`M-156 -170 Q${-210 + tl} -150 ${-206 + tl} -96`, 12) + chL(`M-156 -170 Q${-210 + tl} -150 ${-206 + tl} -96`, 7, C) + chT(`M${-222 + tl} -110 Q${-232 + tl} -66 ${-206 + tl} -54 Q${-182 + tl} -68 ${-190 + tl} -108Z`, '#1E2A3A', '#101822', { sx: 3, sy: 3, lw: 3.6 });
  s += chT(`M-158 -150 Q-170 ${-228 + br} -86 ${-234 + br} Q-20 ${-240 + br} 40 ${-262 + br} Q110 ${-290 + br} 150 ${-240 + br} Q186 ${-206 + br} 168 -150 Q150 -92 80 -88 Q0 -82 -90 -90 Q-150 -98 -158 -150Z`, C, CS, { sx: 12, sy: 9, lw: 5 });
  s += `<path d="M-90 -150 Q0 -130 100 -148" stroke="${M}" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.55"/>`;
  s += anLeg(-72, -100, -16, 25, sw(0), C, CS, '#2E3A4A', 16) + anLeg(142, -100, -16, 25, sw(Math.PI), C, CS, '#2E3A4A', 16);
  s += chT('M-40 -200 Q10 -170 -30 -120 Q-60 -140 -60 -180Z', CS, mixC(CS, '#000000', 0.2), { sx: 2, sy: 2, lw: 0 }) ;
  // đầu (phóng 1.2)
  const hx = 206, hy = -172, Z = 1.2, rx = hx + 92 * Z, ry = hy + 54 * Z;
  s += `<g transform="translate(${hx} ${hy}) scale(${Z}) translate(${-hx} ${-hy})">`;
  s += chT(`M${hx - 40} ${hy - 50} Q${hx - 30} ${hy - 124} ${hx + 36} ${hy - 138} Q${hx + 62} ${hy - 142} ${hx + 70} ${hy - 126} Q${hx + 20} ${hy - 118} ${hx + 20} ${hy - 44}Z`, HN, '#CFC6A8', { sx: 3, sy: 3, lw: 4.5 });   // sừng độc nhất, cong về trước
  s += chT(`M${hx - 44} ${hy - 30} Q${hx - 112} ${hy - 62} ${hx - 96} ${hy - 6} Q${hx - 70} ${hy - 22} ${hx - 40} ${hy - 6}Z`, CS, mixC(CS, '#000000', 0.2), { sx: 2, sy: 2, lw: 3.6 }) + `<path d="M${hx - 50} ${hy - 26} Q${hx - 88} ${hy - 38} ${hx - 84} ${hy - 14}" fill="#C89A8A" opacity="0.6"/>`;
  s += chT(`M${hx - 54} ${hy - 2} Q${hx - 62} ${hy - 76} ${hx} ${hy - 84} Q${hx + 62} ${hy - 84} ${hx + 72} ${hy - 34} Q${hx + 108} ${hy - 10} ${hx + 98} ${hy + 36} Q${hx + 80} ${hy + 64} ${hx + 20} ${hy + 62} Q${hx - 44} ${hy + 54} ${hx - 54} ${hy - 2}Z`, C, CS, { sx: 10, sy: 8, lw: 5 });
  s += `<ellipse cx="${hx + 68}" cy="${hy + 24}" rx="40" ry="32" fill="${M}" stroke="${AN_I}" stroke-width="4"/><ellipse cx="${hx + 86}" cy="${hy + 14}" rx="6" ry="8" fill="${AN_I}"/><ellipse cx="${hx + 54}" cy="${hy + 22}" rx="5" ry="7" fill="${AN_I}"/>`;
  if (o.tired) s += chT(`M${hx + 36} ${hy + 46} Q${hx + 52} ${hy + 90} ${hx + 70} ${hy + 48}Z`, '#EE8E8E', '#CC6A70', { sx: 2, sy: 2, lw: 3.5 }) + anDrop(hx + 6, hy - 70, 1.1);
  else s += chL(`M${hx + 32} ${hy + 46} Q${hx + 62} ${hy + 56} ${hx + 88} ${hy + 42}`, 3.6);
  s += anEye(hx + 14, hy - 22, 12, o.tired ? 'sad' : 'angry', o.tired ? null : '#D8A838') + anBl(hx + 8, hy + 18, 12, 8);
  s += '</g>';
  if (o.ring) {
    const lx = o.leashX ?? 400, ly = o.leashY ?? -120;
    const rope = `M${rx} ${ry + 14} Q${(rx + lx) / 2} ${Math.max(ry, ly) + 60} ${lx} ${ly}`;
    s += chL(rope, 11) + chL(rope, 6, '#7A4E96') + `<g transform="translate(${lx} ${ly})"><path d="M0 0 l-6 24 h12Z" fill="#7A4E96" stroke="${AN_I}" stroke-width="3"/></g>`;
    s += `<circle cx="${rx}" cy="${ry}" r="24" fill="none" stroke="${AN_I}" stroke-width="16"/><circle cx="${rx}" cy="${ry}" r="24" fill="none" stroke="#FFFFFF" stroke-width="9"/><circle cx="${rx}" cy="${ry}" r="32" fill="#FFFFFF" opacity="0.25"/>`;
  }
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- RÙA LỚN SÔNG THÔNG THIÊN (an_rua): o.head ngoi đầu lên chờ câu trả lời · o.water gợn nước quanh · mai đủ rộng cho năm thầy trò (mặt mai y ≈ -230)
function an_rua(x, y, k, T, o = {}) {
  const C = '#9CC088', CS = '#74A06A', SH = '#5C9A78', SHS = '#3E7658', PL = '#EADFAE', br = Math.sin(T * 1.8) * 3;
  let s = o.water ? `<ellipse cx="0" cy="4" rx="330" ry="26" fill="#8EC8E0" stroke="${AN_I}" stroke-width="4" opacity="0.9"/><path d="M-250 4 q20 -10 40 0 M180 8 q22 -10 44 0" stroke="#fff" stroke-width="4" fill="none"/>` : anSh(0, 2, 300);
  for (const dx of [-170, 150]) s += chT(`M${dx - 44} -60 Q${dx - 50} -6 ${dx} -4 Q${dx + 50} -6 ${dx + 44} -60Z`, C, CS, { sx: 6, sy: 4, lw: 4.5 }) + `<path d="M${dx - 22} -8 v10 M${dx} -6 v12 M${dx + 22} -8 v10" stroke="${AN_I}" stroke-width="3.5"/>`;
  s += chT('M-262 -66 Q-300 -66 -318 -40 Q-290 -36 -262 -46Z', C, CS, { sx: 3, sy: 3, lw: 3.6 });   // đuôi
  // đầu + cổ
  const up = o.head ? 1 : 0, hx = 320 + up * 18, hy = -92 - up * 118;
  s += chL(`M240 -100 Q${280 + up * 20} ${-100 - up * 40} ${hx - 10} ${hy + 20}`, 62) + chL(`M240 -100 Q${280 + up * 20} ${-100 - up * 40} ${hx - 10} ${hy + 20}`, 52, C);
  s += chT(`M${hx - 52} ${hy + 4} Q${hx - 54} ${hy - 52} ${hx + 6} ${hy - 54} Q${hx + 62} ${hy - 52} ${hx + 66} ${hy - 4} Q${hx + 64} ${hy + 46} ${hx + 6} ${hy + 46} Q${hx - 50} ${hy + 42} ${hx - 52} ${hy + 4}Z`, C, CS, { sx: 9, sy: 7, lw: 4.5 });
  s += anEye(hx + 28, hy - 8, 9, 'happy') + anEye(hx - 14, hy - 8, 9, 'happy') + anBl(hx + 44, hy + 16, 11, 7) + anBl(hx - 32, hy + 16, 11, 7);
  s += chL(`M${hx + 4} ${hy + 18} Q${hx + 18} ${hy + 30} ${hx + 36} ${hy + 18}`, 3.4) + `<ellipse cx="${hx + 52}" cy="${hy + 4}" rx="3" ry="4" fill="${AN_I}"/>`;
  s += chL(`M${hx + 18} ${hy - 26} Q${hx + 40} ${hy - 16} ${hx + 60} ${hy + 4}`, 3.2, '#F4F0E4') + chL(`M${hx - 24} ${hy - 26} Q${hx - 40} ${hy - 12} ${hx - 44} ${hy + 8}`, 3.2, '#F4F0E4');   // lông mày bạc (rùa già)
  // mai
  s += chT(`M-270 -62 Q-282 ${-230 + br} 0 ${-244 + br} Q282 ${-230 + br} 270 -62 Q130 -36 0 -40 Q-130 -36 -270 -62Z`, SH, SHS, { sx: 12, sy: 10, lw: 5.5 });
  s += chT('M-270 -62 Q0 -36 270 -62 L262 -36 Q0 -8 -262 -36Z', PL, '#C8BC88', { sx: 3, sy: 4, lw: 4.5 });
  const hexes = [[0, -150, 66], [-110, -130, 54], [110, -130, 54], [-190, -102, 40], [190, -102, 40], [-52, -204, 40], [52, -204, 40]];
  for (const [hx_, hy_, r] of hexes) { let d = ''; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? 'L' : 'M') + R1(hx_ + Math.cos(a) * r) + ' ' + R1(hy_ + Math.sin(a) * r * 0.78 + br); } s += chL(d + 'Z', 4, SHS) + `<path d="M${R1(hx_ - r * 0.5)} ${R1(hy_ - r * 0.2 + br)} q${R1(r * 0.4)} ${R1(-r * 0.3)} ${R1(r * 0.8)} 0" stroke="#A8D8B8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>`; }
  s += chL('M-232 -80 Q-120 -48 0 -52', 3.4, SHS, 0.6);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- CÁ VÀNG LINH CẢM (an_ca_vang): o.big dạng yêu đứng hai chân, tay cầm chùy đồng (nụ sen) · o.angry
function an_ca_vang(x, y, k, T, o = {}) {
  const C = '#F2A93B', CS = '#D9781E', FN = '#F8C860', FNS = '#E89A38', sw = Math.sin(T * 4), big = !!o.big;
  let s = anSh(0, 2, big ? 130 : 110, 0.2);
  const oy = big ? -42 : 0;
  if (big) for (const dx of [-30, 30]) s += chT(`M${dx - 14} -84 L${dx + 14} -84 L${dx + 12} -18 L${dx - 12} -18Z`, C, CS, { sx: 3, sy: 0, lw: 3.8 }) + chT(`M${dx - 20} -18 h40 l6 14 h-52Z`, FN, FNS, { sx: 3, sy: 3, lw: 3.4 });
  s += `<g transform="translate(0 ${oy})">`;
  // đuôi quạt lượn
  s += chT(`M-86 -124 Q${-150 + sw * 6} -216 ${-230 + sw * 10} -190 Q${-190 + sw * 8} -150 ${-210 + sw * 10} -116 Q${-176 + sw * 8} -96 ${-220 + sw * 10} -50 Q${-150 + sw * 6} -34 -86 -96Z`, FN, FNS, { sx: 6, sy: 4, lw: 4 });
  for (const [a, b] of [[-190, -170], [-182, -130], [-186, -88]]) s += chL(`M-92 -112 Q${-140 + sw * 4} ${(a + b) / 2 * 0.6 - 40} ${a + sw * 8} ${b + 12}`, 2.6, FNS, 0.9);
  s += chT('M-40 -200 Q-4 -270 56 -226 Q20 -226 22 -194Z', FN, FNS, { sx: 4, sy: 4, lw: 4 });   // vây lưng
  s += chT('M-4 -52 Q-8 -8 -50 0 Q-30 -30 -42 -60Z', FN, FNS, { sx: 3, sy: 3, lw: 3.6 });   // vây bụng
  s += chT('M-100 -122 Q-104 -218 8 -224 Q116 -218 118 -120 Q114 -48 4 -40 Q-96 -48 -100 -122Z', C, CS, { sx: 10, sy: 9, lw: 5 });
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - (r % 2); i++) { const sx_ = -50 + i * 30 + (r % 2) * 15, sy_ = -150 + r * 34; s += chL(`M${sx_} ${sy_} q10 8 20 0`, 2.6, CS, 0.9); }
  s += chT('M-14 -138 Q16 -110 -4 -86 Q-34 -92 -34 -118Z', FN, FNS, { sx: 3, sy: 3, lw: 3.6 });   // vây ngực
  s += `<path d="M96 -130 q28 4 30 26 q-20 -2 -34 -10Z" fill="#E2792C" stroke="${AN_I}" stroke-width="3.5"/>` + `<ellipse cx="116" cy="-122" rx="8" ry="6" fill="${AN_I}" opacity="0.8"/>`;   // miệng bĩu
  s += `<circle cx="64" cy="-166" r="26" fill="#FFF8E8" stroke="${AN_I}" stroke-width="4"/>` + anEye(66, -166, 15, 'dot', '#6A3A10') + anBl(80, -118, 14, 9);
  if (big || o.angry) s += chL('M36 -204 L96 -184', 6);
  s += '</g>';
  if (big) {   // tay cầm chùy đồng: nụ sen chưa nở
    const hy = -118 + Math.sin(T * 3) * 4;
    s += chL(`M70 ${hy} Q140 ${hy - 20} 190 ${hy - 70}`, 16) + chL(`M70 ${hy} Q140 ${hy - 20} 190 ${hy - 70}`, 10, C);
    s += `<g transform="translate(196 ${hy - 76}) rotate(24)">` + chL('M0 40 V-30', 16) + chL('M0 40 V-30', 8, '#8A5A34') + chT('M-28 -28 Q-34 -86 0 -118 Q34 -86 28 -28 Q0 -14 -28 -28Z', '#C8843E', '#8A5420', { sx: 5, sy: 3, lw: 4.5 }) + chL('M0 -112 Q-12 -70 -8 -26 M0 -112 Q14 -70 10 -26', 3, '#8A5420') + '</g>';
  }
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- HỔ BỊ NGỘ KHÔNG ĐÁNH CHẾT (an_ho): nằm ngửa, bốn chân chổng, lưỡi thè, sao quay (không máu) · o.skin=1 mảnh da quấn eo (dây leo + lá) · o.skin='rug' tấm da trải phẳng
function an_ho(x, y, k, T, o = {}) {
  const C = '#F0A030', CS = '#C87414', BL = '#FBE9C4', ST = '#3A2A1E';
  const stripes = (list) => list.map(([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2 + 6} ${(b + d) / 2 - 8} ${c} ${d} Q${(a + c) / 2 - 2} ${(b + d) / 2 + 6} ${a} ${b}Z" fill="${ST}"/>`).join('');
  if (o.skin) {
    let s = '';
    if (o.skin === 'rug') {
      s += anSh(0, 2, 150, 0.12) + chT('M-100 -140 Q-136 -170 -150 -130 Q-120 -110 -110 -90 Q-150 -76 -140 -36 Q-100 -40 -90 -50 Q0 -30 90 -50 Q100 -40 140 -36 Q150 -76 110 -90 Q120 -110 150 -130 Q136 -170 100 -140 Q0 -170 -100 -140Z', C, CS, { sx: 8, sy: 6, lw: 5 });
      s += stripes([[-70, -150, -64, -110], [-30, -154, -24, -100], [14, -154, 18, -100], [56, -150, 62, -110], [-100, -80, -70, -70], [70, -70, 100, -80]]);
      s += chT('M-38 -146 Q-44 -190 0 -192 Q44 -190 38 -146 Q22 -124 0 -124 Q-22 -124 -38 -146Z', C, CS, { sx: 4, sy: 4, lw: 4.5 }) + anEye(-14, -160, 6, 'closed') + anEye(14, -160, 6, 'closed') + chL('M-8 -146 q8 6 16 0', 3);
      return anW(x, y, k, o, s);
    }
    s += `<path d="M-64 -150 Q-70 -110 -76 -60 Q0 -40 76 -60 Q70 -110 64 -150Z" fill="${CS}" stroke="${AN_I}" stroke-width="5" stroke-linejoin="round"/>` + chT('M-64 -150 Q-72 -110 -78 -66 Q-50 -50 -20 -52 L-18 -150Z', C, CS, { sx: 6, sy: 6, lw: 0 });
    s += stripes([[-44, -148, -48, -100], [-8, -150, -10, -90], [30, -148, 32, -96], [58, -146, 58, -104], [-70, -86, -44, -76], [44, -74, 72, -84]]);
    s += chL('M-64 -150 Q-70 -110 -76 -60 Q0 -40 76 -60 Q70 -110 64 -150', 5);
    s += chT('M-76 -60 Q-80 -34 -60 -26 Q-40 -42 -44 -54Z M-8 -50 Q-10 -24 10 -18 Q30 -30 22 -50Z M46 -54 Q50 -30 68 -28 Q84 -44 76 -60Z', C, CS, { sx: 3, sy: 3, lw: 3.6 });   // tua vạt
    s += chL('M76 -150 Q130 -120 124 -60 Q116 -30 96 -40', 12) + chL('M76 -150 Q130 -120 124 -60 Q116 -30 96 -40', 7, C) + chT('M90 -50 l14 -4 l6 20 l-18 6Z', ST, '#12100E', { sx: 2, sy: 2, lw: 3 });   // đuôi hổ
    s += `<path d="M-82 -156 Q0 -178 82 -156 L82 -138 Q0 -158 -82 -138Z" fill="#6A9A44" stroke="${AN_I}" stroke-width="4.5"/>` + [-50, -10, 30, 60].map((dx, i) => `<path d="M${dx} -168 q-6 -26 ${i % 2 ? 14 : -10} -34 q16 14 -4 34Z" fill="#7DB04E" stroke="${AN_I}" stroke-width="3" transform="rotate(${(i - 1.5) * 10} ${dx} -150)"/>`).join('') + chL('M-60 -152 q-6 14 6 22 M20 -150 q-4 12 6 18', 3, '#4A7A30');
    return anW(x, y, k, o, s);
  }
  let s = anSh(0, 2, 170, 0.22);
  // thân ngửa
  s += chT('M-132 -52 Q-140 -128 0 -132 Q140 -128 130 -52 Q120 -10 0 -10 Q-120 -10 -132 -52Z', C, CS, { sx: 8, sy: 8, lw: 5 });
  s += `<ellipse cx="0" cy="-66" rx="92" ry="44" fill="${BL}" stroke="${AN_I}" stroke-width="3.5"/>` + stripes([[-128, -70, -100, -54], [-122, -100, -96, -86], [128, -70, 100, -54], [120, -100, 94, -86], [-30, -112, -28, -94], [30, -112, 28, -94]]);
  // bốn chân chổng
  for (const [dx, a] of [[-92, -16], [-40, -8], [40, 8], [92, 16]]) { const w = Math.sin(T * 3 + dx) * 3; s += `<g transform="rotate(${a + w} ${dx} -100)">` + chT(`M${dx - 16} -100 L${dx + 16} -100 L${dx + 14} -178 L${dx - 14} -178Z`, C, CS, { sx: 4, sy: 0, lw: 4 }) + chT(`M${dx - 20} -178 Q${dx} -210 ${dx + 20} -178 Q${dx} -170 ${dx - 20} -178Z`, BL, '#E0CDA0', { sx: 2, sy: 2, lw: 3.5 }) + `</g>`; }
  s += chL('M-130 -40 Q-190 -30 -186 -64', 12) + chL('M-130 -40 Q-190 -30 -186 -64', 7, C) + chT('M-198 -66 l8 -16 l14 12 l-10 14Z', ST, '#12100E', { sx: 2, sy: 2, lw: 3 });
  // đầu nghiêng bên phải, lưỡi thè
  s += `<g transform="translate(150 -56) rotate(14)">` + chT('M-8 -12 Q-14 -76 44 -80 Q104 -80 110 -22 Q112 30 48 38 Q-8 38 -8 -12Z', C, CS, { sx: 8, sy: 7, lw: 5 }) + chT('M0 -64 Q-12 -96 16 -96 Q32 -84 28 -70Z', C, CS, { sx: 2, sy: 2, lw: 3.8 }) + chT('M84 -66 Q96 -96 70 -94 Q56 -82 58 -70Z', C, CS, { sx: 2, sy: 2, lw: 3.8 });
  s += `<ellipse cx="60" cy="8" rx="32" ry="22" fill="${BL}" stroke="${AN_I}" stroke-width="3.5"/><ellipse cx="60" cy="-4" rx="10" ry="7" fill="#4A3040"/>` + chL('M60 3 V12 M44 14 Q60 22 76 14', 3.2) + chT('M62 14 Q74 54 90 22Z', '#EE8E8E', '#CC6A70', { sx: 2, sy: 2, lw: 3.5 });
  s += stripes([[32, -76, 34, -52], [58, -80, 58, -54], [4, -50, 22, -40]]) + anEye(30, -34, 9, 'swirl') + anEye(86, -34, 9, 'swirl') + anBl(14, 0, 10, 6) + anBl(104, 0, 10, 6) + '</g>';
  s += anStar(150 + Math.cos(T * 3) * 40, -150, 12) + anStar(150 + Math.cos(T * 3 + 2.1) * 40, -156, 10) + anStar(150 + Math.cos(T * 3 + 4.2) * 40, -146, 11);
  return anW(x, y, k, o, s);
}

// ================================================================ ĐẠO CỤ  (x,y) = tâm đáy (vòng: tâm vòng) · o.rot xoay độ
const prSwirl = (x, y, r, T, c = '#CFEFFF') => { let s = ''; for (let i = 0; i < 3; i++) { const a = T * 6 + i * 2.09, u = ((T * 1.4 + i / 3) % 1); s += `<circle cx="${R1(x + Math.cos(a) * r * (0.4 + u * 0.7))}" cy="${R1(y - u * r * 1.6 + Math.sin(a) * 8)}" r="${R1(8 - u * 5)}" fill="${c}" stroke="${AN_I}" stroke-width="2.5" opacity="${R1(1 - u * 0.6)}"/>`; } return anSpiral(x, y - r * 0.3, r * 0.55, 2, 3.2, '#8EC8E0') + s; };
// HỒ LÔ ĐỎ (pr_hu_lo): o.open mở nắp + xoáy hút · o.down úp miệng xuống · o.fake bản giả (méo, nhạt, vá chỉ) · o.eyes mặt mũi bối rối
function pr_hu_lo(x, y, k, T, o = {}) {
  const fake = !!o.fake, C = fake ? '#E48A6C' : '#D8402E', CS = fake ? '#B8604A' : '#A02A1E', sk = fake ? -6 : 0;
  let s = '';
  s += `<g transform="rotate(${o.down ? 180 : 0} 0 -108) skewX(${sk})${fake ? ' scale(0.94 1)' : ''}">`;
  s += chT('M-22 -208 Q-46 -192 -40 -160 Q-72 -140 -64 -80 Q-58 -4 0 -4 Q58 -4 64 -80 Q72 -140 40 -160 Q46 -192 22 -208Z', C, CS, { sx: 10, sy: 6, lw: 5 });
  s += chL('M-52 -92 Q-48 -40 -20 -28', 6, '#FFD8C8', 0.8) + chL('M-26 -176 Q-30 -168 -28 -160', 5, '#FFD8C8', 0.8) + chL('M-52 -128 Q-28 -140 -4 -134 M34 -128 Q18 -140 -4 -134', 3, CS, 0.7);
  s += chL('M-38 -158 Q0 -142 38 -158', 5, AN_GS) + `<path d="M-38 -158 Q0 -142 38 -158" stroke="${AN_G}" stroke-width="2.5" fill="none"/>`;   // dây thắt eo
  if (fake) s += chL('M26 -96 l16 12 M42 -96 l-16 12', 3.2, '#FFF4E0') + chL('M-50 -50 l12 -8 M-48 -58 l10 14', 3, '#FFF4E0');
  if (o.open) s += `<g transform="translate(${R1(40 + Math.sin(T * 4) * 3)} ${R1(-262 + Math.sin(T * 5) * 4)}) rotate(24)">` + chT('M-16 0 h32 v-18 q-16 -12 -32 0Z', AN_G, AN_GS, { sx: 3, sy: 3, lw: 3.5 }) + '</g>' + `<ellipse cx="0" cy="-208" rx="24" ry="7" fill="#4A1210" stroke="${AN_I}" stroke-width="3.5"/>`;
  else s += chT('M-17 -208 h34 v-18 q-17 -12 -34 0Z', AN_G, AN_GS, { sx: 3, sy: 3, lw: 3.6 }) + chL('M-17 -214 h34', 2.5, AN_GS);
  s += chL('M0 -226 q14 -22 30 -12', 4) + chL('M0 -226 q14 -22 30 -12', 2, '#C8452E');
  s += '</g>';
  if (o.open) s += `<g transform="translate(0 ${o.down ? -60 : -230})">${prSwirl(0, 0, 52, T)}</g>`;
  if (o.eyes) { const wob = Math.sin(T * 6) * 2.5; s += anEye(-20, -84 + wob, 11, 'dot') + anEye(20, -84 - wob, 11, 'dot') + chL('M-34 -108 L-10 -102 M34 -108 L10 -102', 4) + chL(`M-16 -52 q8 ${-8 + wob} 16 0 q8 ${8 - wob} 16 0`, 3.4) + anBl(-34, -62, 9, 6) + anBl(34, -62, 9, 6) + anDrop(52, -126, 1.1) + `<text x="70" y="-150" font-size="30" font-weight="700" fill="${AN_I}" font-family="sans-serif">?</text>`; }
  return anW(x, y, k, o, s);
}
function pr_ho_lo_gia(x, y, k, T, o = {}) { return pr_hu_lo(x, y, k, T, Object.assign({ fake: 1 }, o)); }
// BÌNH NGỌC (pr_binh_ngoc): o.open mở nắp + xoáy hút · o.down úp miệng
function pr_binh_ngoc(x, y, k, T, o = {}) {
  const C = '#8EE0B8', CS = '#4EB088';
  let s = `<g transform="rotate(${o.down ? 180 : 0} 0 -104)">`;
  s += chT('M-20 -196 Q-26 -170 -50 -140 Q-78 -100 -62 -50 Q-50 -4 0 -2 Q50 -4 62 -50 Q78 -100 50 -140 Q26 -170 20 -196Z', C, CS, { sx: 10, sy: 6, lw: 5 });
  s += chL('M-50 -98 Q-48 -50 -24 -30', 6, '#E8FFF2', 0.9) + chL('M-26 -164 Q-30 -150 -34 -140', 4, '#E8FFF2', 0.9);
  s += chT('M-24 -168 Q0 -156 24 -168 L22 -152 Q0 -142 -22 -152Z', AN_G, AN_GS, { sx: 2, sy: 3, lw: 3.4 });
  s += chT('M-44 -20 Q0 -4 44 -20 L40 -6 Q0 6 -40 -6Z', AN_G, AN_GS, { sx: 2, sy: 3, lw: 3.4 });
  if (o.open) s += `<g transform="translate(${R1(36 + Math.sin(T * 4) * 3)} ${R1(-254 + Math.sin(T * 5) * 4)}) rotate(20)">` + chT('M-18 0 h36 v-14 q-18 -12 -36 0Z', AN_G, AN_GS, { sx: 3, sy: 3, lw: 3.4 }) + `<circle cx="0" cy="-22" r="6" fill="${AN_G}" stroke="${AN_I}" stroke-width="3"/></g><ellipse cx="0" cy="-198" rx="22" ry="7" fill="#1E5A44" stroke="${AN_I}" stroke-width="3.5"/>`;
  else s += chT('M-22 -198 h44 v-12 q-22 -18 -44 0Z', AN_G, AN_GS, { sx: 3, sy: 3, lw: 3.6 }) + `<circle cx="0" cy="-218" r="7" fill="${AN_G}" stroke="${AN_I}" stroke-width="3"/>`;
  s += '</g>';
  if (o.open) s += `<g transform="translate(0 ${o.down ? -50 : -214})">${prSwirl(0, 0, 50, T)}</g>`;
  return anW(x, y, k, o, s);
}
// KIM CƯƠNG TRÁC (pr_kim_cuong_trac): vòng trắng sáng, tâm = tâm vòng · o.glow quầng sáng · o.fly vệt bay
function pr_kim_cuong_trac(x, y, k, T, o = {}) {
  let s = '';
  if (o.glow) s += `<circle r="${R1(120 + Math.sin(T * 6) * 8)}" fill="#FFFFFF" opacity="0.35"/><circle r="84" fill="#FFFFFF" opacity="0.4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4 + T; return `<path d="M${R1(Math.cos(a) * 76)} ${R1(Math.sin(a) * 76)} L${R1(Math.cos(a) * 128)} ${R1(Math.sin(a) * 128)}" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`; }).join('');
  if (o.fly) s += [0, 1, 2].map(i => `<ellipse cx="${-90 - i * 46}" cy="0" rx="${R1(30 - i * 6)}" ry="${R1(64 - i * 8)}" fill="none" stroke="#FFFFFF" stroke-width="${6 - i}" opacity="${R1(0.8 - i * 0.2)}"/>`).join('') + chL('M-260 -40 H-110 M-250 40 H-110', 6, '#FFFFFF');
  const d = 'M0 -60 A60 60 0 1 1 -0.1 -60Z M0 -34 A34 34 0 1 0 0.1 -34Z';
  s += `<path d="${d}" fill="#F4F8FC" fill-rule="evenodd" stroke="${AN_I}" stroke-width="5.5"/><path d="M-48 -26 A56 56 0 0 1 26 -52" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M36 30 A50 50 0 0 1 -30 44" stroke="#C4D4E2" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  if (o.glow) s += anStar(52, -52, 14, '#FFFFFF');
  return anW(x, y, k, o, s);
}
// KIM CÔ (pr_kim_co): vòng vàng + mây xoắn như trên đầu Ngộ Không · o.tight siết, tia sáng đồng tâm · o.crest=false
function pr_kim_co(x, y, k, T, o = {}) {
  const t = o.tight ? 1 : 0, rx = 78 - t * 22, ry = 30 - t * 8;
  let s = '';
  if (t) s += [0, 1, 2].map(i => { const u = ((T * 2 + i / 3) % 1); return `<ellipse rx="${R1((rx + 26) * (1 + u * 0.6))}" ry="${R1((ry + 12) * (1 + u * 0.6))}" fill="none" stroke="#FFF0A0" stroke-width="5" opacity="${R1(0.9 - u * 0.9)}"/>`; }).join('') + `<path d="M-120 -4 l30 0 l-10 -8 M120 -4 l-30 0 l10 -8 M0 -70 v22 l-8 -8 M0 70 v-22 l-8 8" stroke="${AN_I}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>` + anStar(-70, -50, 12) + anStar(84, -40, 10);
  s += `<ellipse rx="${rx + 10}" ry="${ry + 10}" fill="none" stroke="${AN_I}" stroke-width="22"/><ellipse rx="${rx}" ry="${ry}" fill="none" stroke="${AN_G}" stroke-width="14"/><path d="M${-rx} 0 A${rx} ${ry} 0 0 1 ${rx} 0" stroke="#FFF0B0" stroke-width="4" fill="none" opacity="0.85" transform="translate(0 -3)"/>`;
  if (o.crest !== false && typeof tdk2Cloud === 'function') s += tdk2Cloud(0, -ry - 30, 30 - t * 6, AN_G, 1.1);
  return anW(x, y, k, o, s);
}
// TÍCH TRƯỢNG CHÍN KHOEN (pr_tich_truong): (x,y) = chân gậy, cao ≈ 440
function pr_tich_truong(x, y, k, T, o = {}) {
  let s = anSh(0, 2, 34);
  s += chT('M-8 0 L8 0 L7 -340 L-7 -340Z', '#B88A4A', '#8A5E2A', { sx: 4, sy: 0, lw: 4.5 });
  s += chT('M-14 -340 h28 v14 h-28Z', AN_G, AN_GS, { sx: 2, sy: 2, lw: 3.6 });
  s += chL('M-46 -332 Q-52 -410 0 -440 Q52 -410 46 -332', 14) + chL('M-46 -332 Q-52 -410 0 -440 Q52 -410 46 -332', 8, AN_G);
  s += chT('M-14 -420 Q0 -450 14 -420 Q0 -396 -14 -420Z', '#F0E4C8', '#CFC2A0', { sx: 2, sy: 2, lw: 3.4 });
  const sw = Math.sin(T * 4) * 1.5;
  for (let i = 0; i < 9; i++) { const side = i < 4 ? -1 : i < 8 ? 1 : 0, j = i < 4 ? i : i < 8 ? i - 4 : 0, ax = side * (46 - Math.abs(Math.sin(j * 0.6 + 0.4)) * 6 + 0), ay = -332 - j * 28 - (side ? 0 : 0); const px = side ? ax : 0, py = side ? -338 - j * 24 : -446; s += `<circle cx="${R1(px + (side ? side * 10 : 0))}" cy="${R1(py + 12 + sw * (i % 2 ? 1 : -1))}" r="9" fill="none" stroke="${AN_I}" stroke-width="7"/><circle cx="${R1(px + (side ? side * 10 : 0))}" cy="${R1(py + 12 + sw * (i % 2 ? 1 : -1))}" r="9" fill="none" stroke="#F0F0F0" stroke-width="3.4"/>`; }
  return anW(x, y, k, o, s);
}
// ÁO CÀ SA (pr_ca_sa): xếp gọn trên khay · o.tray=false bỏ khay · o.open trải ra
function pr_ca_sa(x, y, k, T, o = {}) {
  let s = '';
  if (o.tray !== false) s += `<ellipse cx="0" cy="-28" rx="178" ry="34" fill="#6A3E22" stroke="${AN_I}" stroke-width="4.5"/><ellipse cx="0" cy="-34" rx="160" ry="26" fill="#8A5630" stroke="${AN_I}" stroke-width="3"/><path d="M-176 -26 Q0 14 176 -26 L170 -4 Q0 40 -170 -4Z" fill="#6A3E22" stroke="${AN_I}" stroke-width="4.5"/>`;
  const y0 = o.tray !== false ? -34 : 0;
  s += `<g transform="translate(0 ${y0})">` + chT('M-124 -6 Q-130 -78 -44 -92 Q40 -98 100 -88 Q134 -78 128 -6 Q0 12 -124 -6Z', '#C8452E', '#8E2A22', { sx: 8, sy: 8, lw: 5 });
  s += chL('M-110 -34 Q0 -22 116 -34 M-114 -62 Q0 -50 118 -62', 3.6, AN_G) + [-84, -38, 8, 54, 96].map((dx) => chL(`M${dx} -88 Q${dx + 4} -48 ${dx} -8`, 3.4, AN_G)).join('');
  s += chT('M-124 -6 Q0 12 128 -6 L126 8 Q0 26 -122 8Z', AN_G, AN_GS, { sx: 2, sy: 3, lw: 3.8 });
  s += `<circle cx="100" cy="-52" r="8" fill="#5AB08A" stroke="${AN_I}" stroke-width="3"/><circle cx="-92" cy="-52" r="8" fill="#5AB08A" stroke="${AN_I}" stroke-width="3"/>` + '</g>';
  return anW(x, y, k, o, s);
}
// GIẤY VÀNG SÁU CHỮ (pr_giay_vang): tờ giấy của Phật Tổ dán trên đỉnh núi · o.glow toả sáng · o.fly bay lên
function pr_giay_vang(x, y, k, T, o = {}) {
  let s = '';
  if (o.glow) s += `<circle cy="-130" r="170" fill="#FFE27A" opacity="0.35"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4 + T * 0.6; return `<path d="M${R1(Math.cos(a) * 110)} ${R1(-130 + Math.sin(a) * 110)} L${R1(Math.cos(a) * 190)} ${R1(-130 + Math.sin(a) * 190)}" stroke="#FFE27A" stroke-width="6" stroke-linecap="round"/>`; }).join('');
  const fl = o.fly ? Math.sin(T * 6) * 8 : 0;
  s += `<g transform="rotate(${fl} 0 -130)">` + chT('M-52 0 L52 0 Q58 -130 52 -262 L-52 -262 Q-58 -130 -52 0Z', '#FFE9A0', '#E8C860', { sx: 6, sy: 6, lw: 5 });
  s += `<path d="M-40 -10 L40 -10 L40 -252 L-40 -252Z" fill="none" stroke="#C8882A" stroke-width="3.5"/>`;
  [...'唵嘛呢叭咪吽'].forEach((ch, i) => { s += `<text x="0" y="${-218 + i * 34}" text-anchor="middle" font-size="38" font-weight="700" fill="#C8301E" stroke="${AN_I}" stroke-width="0.8" font-family="'Noto Serif CJK SC','Noto Sans CJK SC',serif">${ch}</text>`; });
  s += '</g>';
  return anW(x, y, k, o, s);
}
// THƯ ĐUỔI ĐỆ TỬ (pr_thu_duoi): tờ giấy viết vội, nét bút, dấu đỏ · o.flap lật phấp phới
function pr_thu_duoi(x, y, k, T, o = {}) {
  const fl = o.flap ? Math.sin(T * 5) * 4 : 0;
  let s = `<g transform="rotate(${fl} 0 -100)">` + chT('M-80 0 L80 0 Q86 -100 80 -200 L-80 -200 Q-86 -100 -80 0Z', '#F8F0D8', '#E0D2A8', { sx: 6, sy: 6, lw: 5 });
  for (let i = 0; i < 6; i++) s += chL(`M-60 ${-170 + i * 26} q16 -10 30 0 q16 10 30 0 q14 -8 ${i % 2 ? 40 : 26} 0`, 4.4, '#3A2A24');
  s += `<circle cx="42" cy="-26" r="20" fill="#D8402E" stroke="${AN_I}" stroke-width="3.5"/><path d="M32 -26 h20 M42 -38 v24" stroke="#FFE8D8" stroke-width="3.4"/>` + `<path d="M-80 -200 q40 -14 80 0 q40 14 80 0" fill="none" stroke="${AN_I}" stroke-width="0"/>` + '</g>';
  return anW(x, y, k, o, s);
}
// ĐỐNG XƯƠNG TRẮNG (pr_xuong): sọ ngộ nghĩnh, xương sườn, xương sống khắc chữ "Bạch Cốt Phu Nhân" — không ghê · o.text=false bỏ chữ
function pr_xuong(x, y, k, T, o = {}) {
  const B = '#FBF6E8', BS = '#D8CFB4';
  let s = anSh(0, 2, 190, 0.2);
  s += chL('M-150 -20 Q-60 -34 40 -20 Q110 -10 150 -22', 30) + chL('M-150 -20 Q-60 -34 40 -20 Q110 -10 150 -22', 22, BS);
  s += chT('M-170 -30 Q-170 -6 -146 -8 Q-132 -20 -142 -38Z', B, BS, { sx: 2, sy: 2, lw: 3.6 });
  for (let i = 0; i < 4; i++) { const cx = -90 + i * 64; s += chL(`M${cx} -30 Q${cx - 34} -96 ${cx - 6} -122`, 14) + chL(`M${cx} -30 Q${cx - 34} -96 ${cx - 6} -122`, 8, B); }
  s += chT('M-160 -26 L150 -26 L150 -4 L-160 -4Z', '#F0E6CA', '#D4C8A4', { sx: 3, sy: 3, lw: 4.5 });   // tấm xương sống có khắc
  if (o.text !== false) s += `<text x="-4" y="-8" text-anchor="middle" font-size="21" font-weight="700" fill="#8A3A24" font-family="'Noto Serif CJK SC',serif" letter-spacing="14">白骨夫人</text>`;
  s += chL('M80 -4 L180 -26', 14) + chL('M80 -4 L180 -26', 8, B) + chL('M80 -26 L180 -6', 14) + chL('M80 -26 L180 -6', 8, B);
  s += `<g transform="translate(-10 -150)">` + chT('M-52 6 Q-60 -62 0 -66 Q60 -62 52 6 Q50 36 28 40 L22 58 L-22 58 L-28 40 Q-50 36 -52 6Z', B, BS, { sx: 6, sy: 6, lw: 5 }) + `<ellipse cx="-22" cy="0" rx="14" ry="16" fill="#3A2A24"/><ellipse cx="22" cy="0" rx="14" ry="16" fill="#3A2A24"/><path d="M0 22 l-7 12 h14Z" fill="#3A2A24"/>` + chL('M-14 46 v12 M0 46 v12 M14 46 v12', 3.2) + `<circle cx="-18" cy="-6" r="4" fill="#fff"/><circle cx="26" cy="-6" r="4" fill="#fff"/></g>`;
  return anW(x, y, k, o, s);
}
// BÌNH CƠM (pr_binh_com): bình sứ xanh-trắng · o.mo mở nắp: cơm toàn giòi trắng cách điệu (nhỏ, có mắt chấm)
function pr_binh_com(x, y, k, T, o = {}) {
  const C = '#F4F8FA', CS = '#C4D4DE', BL = '#3E7AB8';
  let s = anSh(0, 2, 70, 0.2);
  s += chL('M-50 -118 Q-90 -110 -88 -64 Q-84 -40 -62 -38', 11) + chL('M-50 -118 Q-90 -110 -88 -64 Q-84 -40 -62 -38', 5, BL);   // quai
  s += chT('M-34 -156 Q-70 -126 -60 -70 Q-54 -4 0 -2 Q54 -4 60 -70 Q70 -126 34 -156Z', C, CS, { sx: 8, sy: 6, lw: 5 });
  s += chL('M-46 -92 q16 -26 34 -6 q18 18 34 -8 q14 -14 26 4 M-44 -52 q18 -22 36 -4 q16 16 34 -4 q14 -12 22 4', 4.2, BL);
  s += chL('M-40 -126 H40', 4, BL);
  if (o.mo) {
    s += `<ellipse cx="0" cy="-158" rx="36" ry="10" fill="#FFFFFF" stroke="${AN_I}" stroke-width="4"/>` + `<path d="M-30 -160 Q-20 -196 0 -192 Q22 -198 30 -160Z" fill="#FFFDF4" stroke="${AN_I}" stroke-width="3.6"/>`;
    for (let i = 0; i < 6; i++) { const wx = -34 + i * 14 + Math.sin(T * 5 + i) * 3, wy = -186 + (i % 3) * 10 - ((T * 0.7 + i * 0.17) % 1) * 6; s += `<g transform="translate(${R1(wx)} ${R1(wy)}) rotate(${i * 36 + 20})"><rect x="-9" y="-4.5" width="18" height="9" rx="4.5" fill="#FFFFFF" stroke="${AN_I}" stroke-width="2.4"/><circle cx="5" cy="-1" r="1.5" fill="${AN_I}"/><path d="M-3 -4.5 v9" stroke="#D8D0C0" stroke-width="1.6"/></g>`; }
    s += `<g transform="translate(${R1(54 + Math.sin(T * 4) * 3)} -170) rotate(24)">` + chT('M-26 0 Q0 -28 26 0Z', '#F4F8FA', CS, { sx: 3, sy: 3, lw: 3.8 }) + `<circle cx="0" cy="-26" r="6" fill="${BL}" stroke="${AN_I}" stroke-width="2.5"/></g>`;
  } else s += chT('M-38 -154 Q0 -170 38 -154 L34 -142 Q0 -134 -34 -142Z', C, CS, { sx: 3, sy: 3, lw: 4 }) + chT('M-26 -154 Q0 -192 26 -154Z', C, CS, { sx: 3, sy: 3, lw: 4.5 }) + `<circle cx="0" cy="-188" r="7" fill="${BL}" stroke="${AN_I}" stroke-width="3"/>`;
  return anW(x, y, k, o, s);
}
// QUẢ NHÂN SÂM (pr_nhan_sam): quả hình em bé ngủ, cuống lá trên đầu · o.hang treo lủng lẳng (có cuống dài)
function pr_nhan_sam(x, y, k, T, o = {}) {
  const C = '#FBE3A8', CS = '#E8C27A', br = Math.sin(T * 2) * 1.5;
  let s = o.hang ? chL('M0 -150 Q10 -190 -4 -230', 8) + chL('M0 -150 Q10 -190 -4 -230', 4, '#5E8A3A') : '';
  s += `<g transform="translate(0 ${br})">` + chT('M-26 -66 Q-48 -52 -42 -26 Q-24 -2 0 -2 Q24 -2 42 -26 Q48 -52 26 -66Z', C, CS, { sx: 5, sy: 4, lw: 4.2 });
  s += chT('M-44 -38 Q-62 -36 -58 -20 Q-44 -14 -34 -26Z', C, CS, { sx: 3, sy: 3, lw: 3.4 }) + chT('M44 -38 Q62 -36 58 -20 Q44 -14 34 -26Z', C, CS, { sx: 3, sy: 3, lw: 3.4 });
  s += chT('M-16 -8 Q-24 6 -8 8 Q0 2 -2 -8Z', C, CS, { sx: 2, sy: 2, lw: 3.2 }) + chT('M16 -8 Q24 6 8 8 Q0 2 2 -8Z', C, CS, { sx: 2, sy: 2, lw: 3.2 });
  s += chT('M-40 -112 Q-46 -158 0 -160 Q46 -158 40 -112 Q36 -62 0 -60 Q-36 -62 -40 -112Z', C, CS, { sx: 6, sy: 5, lw: 4.5 });
  s += anEye(-16, -108, 7, 'happy') + anEye(16, -108, 7, 'happy') + anBl(-26, -92, 8, 5) + anBl(26, -92, 8, 5) + chL('M-5 -86 q5 5 10 0', 2.8);
  s += chL('M0 -160 Q-4 -176 6 -186', 5) + chL('M0 -160 Q-4 -176 6 -186', 2.6, '#5E8A3A') + chT('M6 -186 Q30 -204 40 -184 Q22 -176 6 -186Z', '#7DB04E', '#4E8A34', { sx: 2, sy: 2, lw: 3 }) + '</g>';
  if (o.zzz) s += `<text x="46" y="-130" font-size="30" font-weight="700" font-family="sans-serif" fill="${AN_I}" opacity="0.8">z</text><text x="62" y="-152" font-size="22" font-weight="700" font-family="sans-serif" fill="${AN_I}" opacity="0.6">z</text>`;
  return anW(x, y, k, o, s);
}
// QUẠT BA TIÊU (pr_quat_ba_tieu): quạt lá chuối khổng lồ của Lão Quân · o.fan quạt (xoay, vệt gió)
function pr_quat_ba_tieu(x, y, k, T, o = {}) {
  const a = o.fan ? Math.sin(T * 5) * 16 : 0;
  let s = `<g transform="rotate(${R1(a)} 0 0)">`;
  s += chT('M-8 0 L8 0 L6 -110 L-6 -110Z', '#B88A4A', '#8A5E2A', { sx: 3, sy: 0, lw: 4 });
  s += chT('M0 -104 Q-110 -150 -96 -270 Q-60 -350 6 -340 Q70 -350 98 -270 Q112 -150 0 -104Z', '#8CC05A', '#5E9A3C', { sx: 10, sy: 8, lw: 5 });
  s += chL('M0 -108 V-336', 5, '#4E8A34') + [-1, 1].map(sg => [0, 1, 2, 3, 4].map(i => chL(`M0 ${-130 - i * 40} Q${sg * 40} ${-136 - i * 40} ${sg * (80 - i * 8)} ${-170 - i * 40}`, 3, '#4E8A34', 0.9)).join('')).join('');
  s += chL('M-70 -250 L-52 -230 M64 -200 L82 -180', 4, '#5E9A3C', 0.6) + '</g>';
  if (o.fan) s += chL('M120 -200 Q170 -190 180 -150 M130 -250 Q190 -250 210 -210', 5, '#CFEFFF') + chL('M-120 -200 Q-170 -190 -180 -150', 5, '#CFEFFF');
  return anW(x, y, k, o, s);
}
// GIỎ TRE (pr_gio_tre): giỏ Quan Âm tự đan · o.fish đuôi cá vàng thò ra
function pr_gio_tre(x, y, k, T, o = {}) {
  const C = '#E0BC78', CS = '#B08848';
  let s = anSh(0, 2, 86, 0.2);
  if (o.fish) s += chT(`M-8 -108 Q${-30 + Math.sin(T * 6) * 6} -170 ${-44 + Math.sin(T * 6) * 8} -176 Q-10 -150 24 -176 Q40 -150 12 -108Z`, '#F8C860', '#E89A38', { sx: 3, sy: 3, lw: 3.6 });
  s += chL('M-70 -110 Q0 -230 70 -110', 12) + chL('M-70 -110 Q0 -230 70 -110', 7, C);
  s += chT('M-84 -112 Q-92 -28 -52 -6 Q0 8 52 -6 Q92 -28 84 -112Z', C, CS, { sx: 8, sy: 6, lw: 5 });
  for (let i = 0; i < 4; i++) s += chL(`M${-70 + i * 46} -112 Q${-76 + i * 48} -50 ${-52 + i * 34} -8`, 3, CS, 0.9);
  for (let j = 0; j < 4; j++) s += chL(`M-84 ${-96 + j * 24} Q0 ${-84 + j * 24} 84 ${-96 + j * 24}`, 3, CS, 0.9);
  s += chT('M-90 -116 Q0 -132 90 -116 L88 -100 Q0 -116 -88 -100Z', '#C89C58', '#9A7238', { sx: 2, sy: 3, lw: 4.2 });
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- HỔ SỐNG (an_hoS), nhìn sang phải (o.flip quay trái)
// o.pose: 'prowl' (rình, bước) | 'crouch' (nép xuống chực vồ) | 'leap' (bay người, chân vươn, nhe móng) | 'hit' (bị đấm: chân dang, mắt xoáy, lưỡi thè) · o.roar: há miệng gầm
function an_hoS(x, y, k, T, o = {}) {
  const C = '#F0A030', CS = '#C87414', BL = '#FBE9C4', ST = '#3A2A1E', pose = o.pose || 'prowl', crouch = pose === 'crouch', leap = pose === 'leap', hit = pose === 'hit';
  const air = leap || hit, ph = T * 6, dy = crouch ? 38 : 0, roar = !!o.roar || leap || crouch;
  const limb = (x1, y1, x2, y2, far) => {
    const c = far ? CS : C, d = `M${R1(x1)} ${R1(y1)} L${R1(x2)} ${R1(y2)}`;
    let r = chL(d, 42, AN_I) + chL(d, 33, c) + `<ellipse cx="${R1(x2 + (air ? 8 : 6))}" cy="${R1(y2 - (air ? 0 : 2))}" rx="26" ry="16" fill="${BL}" stroke="${AN_I}" stroke-width="4"/>`;
    if (leap && x2 > 0) r += [-9, 3, 15].map((q) => `<path d="M${R1(x2 + 26)} ${R1(y2 + q - 4)} l18 ${q > 0 ? 6 : -2} l-18 6Z" fill="#fff" stroke="${AN_I}" stroke-width="2.5" stroke-linejoin="round"/>`).join('');
    return r;
  };
  const w = (p) => Math.sin(ph + p) * 24, lf = (p) => Math.max(0, Math.cos(ph + p)) * 14;
  let s = air ? '' : anSh(0, 2, 175, 0.22);
  // chân xa (tối hơn)
  if (leap) s += limb(-60, -96, -176, -44, 1) + limb(110, -96, 226, -108, 1);
  else if (hit) s += limb(-60, -96, -150, -170, 1) + limb(110, -96, 210, -176, 1);
  else if (crouch) s += limb(-52, -66, -40, 0, 1) + limb(104, -64, 118, 0, 1);
  else s += limb(-52, -78, -52 + w(Math.PI), -lf(Math.PI), 1) + limb(104, -78, 104 + w(0), -lf(0), 1);
  // đuôi
  const tw = Math.sin(T * 4) * 14, tp = `M-132 ${-110 + dy} Q-210 ${-120 + dy} ${-206 + tw} ${-196 + dy} Q${-204 + tw} ${-236 + dy} ${-176 + tw} ${-250 + dy}`;
  s += chL(tp, 28, AN_I) + chL(tp, 20, C) + chL(`M${-206 + tw} ${-196 + dy} Q${-204 + tw} ${-236 + dy} ${-176 + tw} ${-250 + dy}`, 20, ST);
  // thân
  s += `<g transform="translate(0 ${dy})">` + chT('M-140 -70 Q-148 -170 0 -178 Q150 -172 142 -80 Q120 -36 0 -32 Q-120 -36 -140 -70Z', C, CS, { sx: 9, sy: 8, lw: 5 });
  s += `<ellipse cx="6" cy="-56" rx="92" ry="15" fill="${BL}" opacity="0.9"/>`;
  s += [[-104, -162, -96, -112], [-62, -172, -54, -118], [-18, -176, -12, -122], [28, -176, 34, -122], [72, -170, 82, -118], [112, -156, 120, -112]].map(([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2 + 7} ${(b + d) / 2 - 6} ${c} ${d} Q${(a + c) / 2 - 3} ${(b + d) / 2 + 5} ${a} ${b}Z" fill="${ST}"/>`).join('') + `</g>`;
  // chân gần
  if (leap) s += limb(-98, -92, -214, -70, 0) + limb(74, -96, 196, -134, 0);
  else if (hit) s += limb(-98, -92, -190, -150, 0) + limb(74, -96, 186, -190, 0);
  else if (crouch) s += limb(-96, -66, -80, 0, 0) + limb(62, -64, 78, 0, 0);
  else s += limb(-96, -78, -96 + w(0), -lf(0), 0) + limb(62, -78, 62 + w(Math.PI), -lf(Math.PI), 0);
  // đầu
  const hy = crouch ? -112 : -140, tilt = hit ? -16 : leap ? 6 : 0;
  s += `<g transform="translate(150 ${hy}) rotate(${tilt})">`;
  s += chT('M-46 -64 Q-62 -110 -28 -106 Q-6 -98 -4 -76Z', C, CS, { sx: 3, sy: 3, lw: 4 }) + chT('M26 -78 Q36 -118 68 -104 Q80 -86 62 -64Z', C, CS, { sx: 3, sy: 3, lw: 4 });
  s += chT('M-62 0 Q-66 -74 2 -80 Q74 -82 78 -4 Q80 58 2 64 Q-58 60 -62 0Z', C, CS, { sx: 9, sy: 8, lw: 5 });
  s += chT('M-60 24 L-88 32 L-66 44 L-82 58 L-52 56Z', BL, '#E4CC9C', { sx: 2, sy: 2, lw: 3.5 });
  s += `<ellipse cx="44" cy="24" rx="40" ry="31" fill="${BL}" stroke="${AN_I}" stroke-width="4"/>` + `<path d="M36 4 q14 -9 28 0 q-6 15 -14 15 q-8 0 -14 -15Z" fill="#4A3040" stroke="${AN_I}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (roar && !hit) s += `<path d="M14 32 Q46 24 80 32 Q76 66 46 72 Q18 66 14 32Z" fill="#5A1E24" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/><path d="M22 34 l8 18 l8 -17Z M62 34 l8 17 l8 -18Z" fill="#fff" stroke="${AN_I}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="46" cy="60" rx="15" ry="8" fill="#E8707A"/>`;
  else if (hit) s += `<path d="M20 34 Q46 28 76 34 Q72 58 46 62 Q24 58 20 34Z" fill="#5A1E24" stroke="${AN_I}" stroke-width="4"/><path d="M34 56 Q46 92 60 58Z" fill="#F08A96" stroke="${AN_I}" stroke-width="3.5"/>`;
  else s += chL('M47 18 V32 M22 38 Q47 50 72 38', 3.4);
  if (hit) s += anEye(-8, -22, 11, 'swirl') + anEye(38, -24, 11, 'swirl') + anStar(-20 + Math.cos(T * 8) * 20, -112, 11) + anStar(40 + Math.cos(T * 8 + 2) * 20, -118, 9);
  else s += [[-8, -22], [40, -24]].map(([ex, ey]) => `<ellipse cx="${ex}" cy="${ey}" rx="14" ry="12" fill="#FFF4D8" stroke="${AN_I}" stroke-width="4"/><circle cx="${ex + 4}" cy="${ey + 1}" r="6.5" fill="${AN_I}"/>`).join('') + chL('M-26 -48 L12 -34', 8) + chL('M26 -36 L62 -52', 8);
  s += chL('M-8 -72 v16 M16 -74 v18 M40 -70 v16', 7, ST);
  s += `</g>`;
  return anW(x, y, k, o, s);
}

// CHÉP từ tập xep-hang-vo-cong (2026-10-13) — đồ nghề dùng chung, không sửa ở đây trừ khi cần.
// CHÉP từ kênh Hóng Sử (channel-vi-nhan/episodes/nikola-tesla/sc_01_kit.js, 2026-10-11) theo VISUAL_RULES.md — bộ đồ nghề nền chi tiết dùng chung. Không sửa ở đây trừ khi cần; nền võ hiệp riêng ở sc_sets.js.
// ===== BỘ ĐỒ NGHỀ VẼ NỀN CHI TIẾT (bản 4, 2026-10-11): cỏ chữ v, cây, núi, mây, phòng phối cảnh 1 điểm tụ, mặt tiền phố, đồ đạc
// Quy ước: khung 1920x1080, điểm tụ (960, VPY). Mọi hàm trả chuỗi SVG.
const VPY = 470;
const _q = (pts, fill, sw = 4, extra = '') => `<path d="M${pts.map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}Z" fill="${fill}" stroke="${INK2}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const _ln = (x1, y1, x2, y2, c = INK2, w = 3, extra = '') => `<path d="M${R1(x1)} ${R1(y1)} L${R1(x2)} ${R1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const dk = (c, k = 0.2) => mixC(c, '#000000', k), lt_ = (c, k = 0.2) => mixC(c, '#FFFFFF', k);

// ---------- cỏ chữ v, hoa, sỏi
function vGrass(n, x0, y0, w, h, c = '#6E8A4A', seed = 1, o = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + hrnd(i, seed) * w, y = y0 + hrnd(i, seed + 1) * h;
    if (o.skip && o.skip(x, y)) continue;
    const k = o.persp === false ? 1 : 0.5 + 0.9 * (y - y0) / Math.max(1, h), sz = (o.size || 15) * k * (0.75 + 0.5 * hrnd(i, seed + 2));
    const sway = typeof ANIM_T === 'number' ? Math.sin(ANIM_T * 1.6 + x * 0.02) * sz * 0.12 : 0;
    s += `<path d="M${R1(x - sz * 0.55 + sway)} ${R1(y - sz)} L${R1(x)} ${R1(y)} L${R1(x + sz * 0.62 + sway)} ${R1(y - sz * 1.12)}" stroke="${o.c2 && i % 3 === 0 ? o.c2 : c}" stroke-width="${R1(2 + 1.7 * k)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${o.op ?? 0.9}"/>`;
  }
  return s;
}
function flowers(n, x0, y0, w, h, seed = 3, cols = ['#F2D16B', '#F4F1EA', '#E58A8A', '#B9A2E0']) {
  let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + hrnd(i, seed) * w, y = y0 + hrnd(i, seed + 1) * h, k = 0.6 + 0.8 * (y - y0) / Math.max(1, h), c = cols[i % cols.length];
    s += `<g transform="translate(${R1(x)} ${R1(y)}) scale(${R1(k * 10) / 10})"><path d="M0 0 V14" stroke="#5E7A44" stroke-width="2.5"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${R1(Math.cos(a * Math.PI / 180) * 5)}" cy="${R1(Math.sin(a * Math.PI / 180) * 5)}" r="4" fill="${c}" stroke="${INK2}" stroke-width="1.2"/>`).join('')}<circle r="2.6" fill="#E8A030"/></g>`; }
  return s;
}
function pebbles(n, x0, y0, w, h, c = '#A89A80', seed = 5) {
  let s = ''; for (let i = 0; i < n; i++) { const x = x0 + hrnd(i, seed) * w, y = y0 + hrnd(i, seed + 1) * h, k = 0.5 + (y - y0) / Math.max(1, h);
    s += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1((4 + hrnd(i, seed + 2) * 7) * k)}" ry="${R1((2 + hrnd(i, seed + 3) * 3) * k)}" fill="${c}" opacity="0.7"/>`; } return s;
}
// ---------- cây
function treeD(x, g, s = 1, o = {}) {
  const c = o.c || '#6E8A4A', c2 = dk(c, 0.22), c3 = lt_(c, 0.28), tr = o.trunk || '#6B4A30', sw = o.night ? 0 : 1;
  let b = `<path d="M-16 0 Q-10 -110 -6 -190 L6 -190 Q12 -110 18 0Z" fill="${tr}" stroke="${INK2}" stroke-width="5"/><path d="M-2 -150 Q-40 -190 -70 -200 M4 -170 Q40 -210 66 -214" stroke="${tr}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-4 -30 q4 -30 0 -60 M6 -80 q-3 -26 2 -50" stroke="${dk(tr, 0.3)}" stroke-width="3" fill="none"/>`;
  const cl = [[-80, -230, 70], [80, -240, 74], [0, -300, 92], [-46, -330, 64], [54, -338, 62], [0, -220, 70]];
  for (const [cx, cy, r] of cl) b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${INK2}" stroke-width="5"/>`;
  for (const [cx, cy, r] of cl) b += `<path d="M${cx - r * 0.7} ${cy + r * 0.35} Q${cx} ${cy + r * 0.85} ${cx + r * 0.7} ${cy + r * 0.35}" stroke="${c2}" stroke-width="6" fill="none" opacity="0.7"/>`;
  b += [[-40, -330], [30, -350], [-90, -250], [70, -260], [10, -280]].map(([a, bb], i) => `<path d="M${a} ${bb} q8 -10 16 0" stroke="${c3}" stroke-width="5" fill="none" stroke-linecap="round" opacity="${sw ? 0.9 : 0.3}"/>`).join('');
  return _g(x, g, s, b + (o.noShadow ? '' : `<ellipse cx="0" cy="4" rx="110" ry="16" fill="#20140A" opacity="0.12"/>`));
}
function pineD(x, g, s = 1, c = '#4E6E4A') {
  let b = `<rect x="-10" y="-50" width="20" height="54" fill="#5A3A24" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) { const y = -40 - i * 70, w = 110 - i * 22; b += `<path d="M${-w} ${y} L0 ${y - 120} L${w} ${y}Q0 ${y + 18} ${-w} ${y}Z" fill="${i % 2 ? c : dk(c, 0.08)}" stroke="${INK2}" stroke-width="4.5"/><path d="M${-w * 0.5} ${y - 8} q${w * 0.25} 8 ${w * 0.5} 0" stroke="${lt_(c, 0.25)}" stroke-width="4" fill="none" opacity="0.6"/>`; }
  return _g(x, g, s, b);
}
function bushD(x, g, s = 1, c = '#6E8A4A') { return _g(x, g, s, `<path d="M-80 0 Q-96 -50 -50 -56 Q-40 -96 0 -84 Q40 -100 56 -58 Q96 -50 82 0Z" fill="${c}" stroke="${INK2}" stroke-width="4.5"/><path d="M-40 -40 q10 -10 20 0 M20 -60 q10 -10 20 0" stroke="${lt_(c, 0.3)}" stroke-width="4" fill="none"/>`); }
// ---------- trời, núi
function skyGrad(id, c1, c2) { return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`; }
function starsD(n = 60, h = 520, seed = 7) { let s = ''; const T = AT_(); for (let i = 0; i < n; i++) s += `<circle cx="${R1(hrnd(i, seed) * 1920)}" cy="${R1(hrnd(i, seed + 1) * h)}" r="${R1(1.2 + hrnd(i, seed + 2) * 2.4)}" fill="#FFF4D6" opacity="${R1((0.35 + 0.6 * Math.abs(Math.sin(T * 1.3 + i))) * 100) / 100}"/>`; return s; }
function mountains(y, c, snow = true, seed = 1, amp = 1) {
  const pts = []; for (let i = 0; i <= 12; i++) pts.push([i * 160, y - (i % 2 ? 150 + 110 * hrnd(i, seed) : 40 + 60 * hrnd(i, seed + 1)) * amp]);
  let s = `<path d="M0 ${y + 200} L${pts.map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')} L1920 ${y + 200}Z" fill="${c}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 1; i < 12; i += 2) { const [px, py] = pts[i]; s += `<path d="M${px} ${py} L${px - 30} ${py + 120} M${px} ${py} L${px + 40} ${py + 90}" stroke="${dk(c, 0.15)}" stroke-width="4" fill="none" opacity="0.7"/>`;
    if (snow) s += `<path d="M${px - 46} ${py + 50} L${px} ${py} L${px + 50} ${py + 46} L${px + 26} ${py + 40} L${px + 6} ${py + 58} L${px - 18} ${py + 40}Z" fill="#F4F4F8" stroke="${INK2}" stroke-width="3"/>`; }
  return s;
}
function rollingHills(y, c1, c2, c3) {
  return `<path d="M0 ${y} Q240 ${y - 110} 520 ${y - 30} Q760 ${y - 130} 1040 ${y - 40} Q1320 ${y - 140} 1600 ${y - 50} Q1800 ${y - 100} 1920 ${y - 40} V${y + 200} H0Z" fill="${c1}" stroke="${INK2}" stroke-width="3.5"/>` +
    `<path d="M0 ${y + 50} Q300 ${y - 30} 640 ${y + 40} Q980 ${y - 40} 1300 ${y + 40} Q1620 ${y - 20} 1920 ${y + 30} V${y + 220} H0Z" fill="${c2}" stroke="${INK2}" stroke-width="3.5"/>` +
    (c3 ? `<path d="M0 ${y + 110} Q400 ${y + 60} 900 ${y + 110} Q1400 ${y + 70} 1920 ${y + 100} V${y + 260} H0Z" fill="${c3}" stroke="${INK2}" stroke-width="3.5"/>` : '');
}
// hàng cây nhỏ phía xa trên đồi
function farTrees(n, y, c = '#5E7A4A', seed = 9, x0 = 0, w = 1920) { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + hrnd(i, seed) * w, yy = y + hrnd(i, seed + 1) * 30, r = 14 + hrnd(i, seed + 2) * 12; s += `<path d="M${R1(x)} ${R1(yy)} V${R1(yy - r * 0.6)}" stroke="#5A3A24" stroke-width="3"/><circle cx="${R1(x)}" cy="${R1(yy - r * 1.3)}" r="${R1(r)}" fill="${hrnd(i, seed + 3) > 0.5 ? c : dk(c, 0.12)}" stroke="${INK2}" stroke-width="2.5"/>`; } return s; }
// hàng rào gỗ
function fenceD(x0, x1, g, h = 90, c = '#9C7A54') { let s = `<path d="M${x0} ${g - h * 0.7} H${x1} M${x0} ${g - h * 0.3} H${x1}" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M${x0} ${g - h * 0.7} H${x1} M${x0} ${g - h * 0.3} H${x1}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`; for (let x = x0; x <= x1; x += 70) s += `<path d="M${x - 9} ${g} V${g - h} L${x} ${g - h - 14} L${x + 9} ${g - h} V${g}Z" fill="${c}" stroke="${INK2}" stroke-width="3.5"/>`; return s; }

// ---------- PHÒNG PHỐI CẢNH 1 ĐIỂM TỤ
// o: wall, side, ceil, floor ('wood'|'tile'|'carpet'|'stone'), fc (màu sàn), wain (màu ốp gỗ | false), paper (kiểu giấy dán: 'damask'|'stripe'|'dots'|false), bx0,bx1,by0,by1
function room1p(o = {}) {
  const bx0 = o.bx0 ?? 300, bx1 = o.bx1 ?? 1620, by0 = o.by0 ?? 100, by1 = o.by1 ?? 700, vx = 960, vy = o.vy ?? VPY;
  const ext = (px, py, X) => py + (py - vy) * (X - px) / (px - vx);
  const lb = ext(bx0, by1, 0), lt = ext(bx0, by0, 0), rb = ext(bx1, by1, 1920), rt = ext(bx1, by0, 1920);
  const wall = o.wall || '#D9C9A8', side = o.side || dk(wall, 0.12), ceil = o.ceil || lt_(wall, 0.1), fc = o.fc || '#A9784E';
  let s = `<rect width="1920" height="1080" fill="${ceil}"/>`;
  s += _q([[0, lt], [bx0, by0], [bx1, by0], [1920, rt], [1920, 0], [0, 0]], ceil, 4);
  if (o.beams) for (let i = 0; i < 5; i++) { const u = (i + 0.5) / 5, x = bx0 + (bx1 - bx0) * u; s += _q([[x - 14, by0], [x + 14, by0], [vx + (x + 14 - vx) * ((0 - vy) / (by0 - vy)), 0], [vx + (x - 14 - vx) * ((0 - vy) / (by0 - vy)), 0]], o.beams, 3); }
  s += _q([[0, lt], [bx0, by0], [bx0, by1], [0, lb]], side, 4) + _q([[1920, rt], [bx1, by0], [bx1, by1], [1920, rb]], dk(side, 0.04), 4);
  s += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${by1 - by0}" fill="${wall}" stroke="${INK2}" stroke-width="4"/>`;
  if (o.paper !== false) { const pk = o.paper || 'damask'; s += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${by1 - by0}" fill="${pat(pk === 'stripe' ? 'damask' : pk, o.wall2 || dk(wall, 0.1), null, o.pscale || 0.9)}" opacity="${pk === 'stripe' ? 0 : 0.55}"/>`;
    if (pk === 'stripe') for (let x = bx0 + 20; x < bx1; x += 44) s += `<rect x="${x}" y="${by0}" width="16" height="${by1 - by0}" fill="${o.wall2 || dk(wall, 0.08)}" opacity="0.6"/>`; }
  // phào trần + chân tường + ốp gỗ (lưng tường và hai vách)
  const wh = o.wainH ?? 200;
  if (o.wain !== false) { const wc = o.wain || '#7A5234'; s += `<rect x="${bx0}" y="${by1 - wh}" width="${bx1 - bx0}" height="${wh}" fill="${wc}" stroke="${INK2}" stroke-width="4"/>`;
    for (let x = bx0 + 24; x + 120 <= bx1 - 10; x += 150) s += `<rect x="${x}" y="${by1 - wh + 26}" width="120" height="${wh - 52}" rx="5" fill="none" stroke="${dk(wc, 0.3)}" stroke-width="4"/><path d="M${x + 4} ${by1 - wh + 30} h112" stroke="${lt_(wc, 0.2)}" stroke-width="3"/>`;
    s += `<rect x="${bx0}" y="${by1 - wh - 12}" width="${bx1 - bx0}" height="14" fill="${dk(wc, 0.15)}" stroke="${INK2}" stroke-width="3"/>`;
    const f = (bx, X) => [X, ext(bx, by1 - wh, X)], g = (bx, X) => [X, ext(bx, by1, X)];
    s += _q([f(bx0, 0), f(bx0, bx0), g(bx0, bx0), g(bx0, 0)], dk(wc, 0.1), 4) + _q([f(bx1, 1920), f(bx1, bx1), g(bx1, bx1), g(bx1, 1920)], dk(wc, 0.14), 4); }
  s += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="16" fill="${dk(ceil, 0.1)}" stroke="${INK2}" stroke-width="3"/>`;
  // sàn
  s += _q([[0, lb], [bx0, by1], [bx1, by1], [1920, rb], [1920, 1080], [0, 1080]], fc, 4);
  const fk = o.floor || 'wood';
  if (fk !== 'carpet') {
    const n = fk === 'wood' ? 22 : 12, X = i => bx0 + (bx1 - bx0) * i / n, at_ = (Xb, z) => vx + (Xb - vx) / z, yz = z => vy + (by1 - vy) / z;
    for (let i = -14; i <= n + 14; i++) s += _ln(X(i), by1, at_(X(i), (by1 - vy) / (1080 - vy)), 1080, dk(fc, 0.22), fk === 'wood' ? 2.5 : 3);
    const zs = []; for (let z = 1, j = 0; yz(z) < 1085 && j < 30; j++) { zs.push(z); z *= fk === 'wood' ? 0.8 : 0.78; }
    zs.forEach((z, j) => { const y = yz(z);
      if (fk === 'wood') { for (let i = -14; i < n + 14; i++) if ((i + j) % 3 === 0) { const xa = at_(X(i), z), xb = at_(X(i + 1), z); if (xb > 0 && xa < 1920) s += _ln(xa, y, xb, y, dk(fc, 0.28), 2.5); } }
      else s += _ln(0, y, 1920, y, dk(fc, 0.25), 3);
      if (fk === 'tile' && j + 1 < zs.length) { const z2 = zs[j + 1], y2 = yz(z2); for (let i = -14; i < n + 14; i++) if ((i + j) % 2 === 0) s += _q([[at_(X(i), z), y], [at_(X(i + 1), z), y], [at_(X(i + 1), z2), y2], [at_(X(i), z2), y2]], dk(fc, 0.12), 0); } });
  } else { for (let i = 0; i < 40; i++) s += `<path d="M${R1(hrnd(i, 3) * 1920)} ${R1(by1 + 20 + hrnd(i, 4) * (1080 - by1))} q10 -6 20 0" stroke="${dk(fc, 0.2)}" stroke-width="3" fill="none"/>`; }
  s += _ln(0, lb, bx0, by1, INK2, 4) + _ln(bx1, by1, 1920, rb, INK2, 4) + `<path d="M${bx0} ${by1} H${bx1}" stroke="${INK2}" stroke-width="5"/>`;
  if (o.light !== false) s += `<defs><radialGradient id="rmL" cx="0.5" cy="0.35" r="0.65"><stop offset="0" stop-color="#FFF4D8" stop-opacity="${o.night ? 0.08 : 0.22}"/><stop offset="1" stop-color="#20140A" stop-opacity="${o.night ? 0.45 : 0.18}"/></radialGradient></defs>`;
  return s;
}
const roomShade = (night) => `<rect width="1920" height="1080" fill="url(#rmL)"/>`;
// tứ giác trên vách bên (cửa sổ, cửa, tranh) — side 'L'|'R', xA..xB là toạ độ màn hình, f0..f1 là tỉ lệ chiều cao tường (0 = trần, 1 = sàn)
function wallQuad(o, side, xA, xB, f0, f1) {
  const bx = side === 'L' ? (o.bx0 ?? 300) : (o.bx1 ?? 1620), by0 = o.by0 ?? 100, by1 = o.by1 ?? 700, vy = o.vy ?? VPY;
  const ext = (py, X) => py + (py - vy) * (X - bx) / (bx - 960);
  const P = (X, f) => [X, ext(by0, X) + (ext(by1, X) - ext(by0, X)) * f];
  return [P(xA, f0), P(xB, f0), P(xB, f1), P(xA, f1)];
}
function sideWindow(o, side, xA, xB, f0, f1, view = '#BFD8E2', frame = '#6B4A30') {
  const q = wallQuad(o, side, xA, xB, f0, f1), m = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  let s = _q(q, frame, 5) + _q([m(q[0], q[1], 0.08), m(q[1], q[0], 0.08), m(q[2], q[3], 0.08), m(q[3], q[2], 0.08)].map((p, i) => [p[0], p[1] + (i < 2 ? 12 : -12)]), view, 3);
  const t1 = m(q[0], q[1], 0.5), b1 = m(q[3], q[2], 0.5), l1 = m(q[0], q[3], 0.5), r1 = m(q[1], q[2], 0.5);
  return s + _ln(t1[0], t1[1] + 10, b1[0], b1[1] - 10, frame, 9) + _ln(l1[0], l1[1], r1[0], r1[1], frame, 9) + _ln(q[0][0] + (q[1][0] - q[0][0]) * 0.2, q[0][1] + 30, q[3][0] + (q[2][0] - q[3][0]) * 0.2, q[3][1] - 30, '#FFFFFF', 4, 'opacity="0.35"');
}
function sideDoor(o, side, xA, xB, f0, c = '#6B3E26', num = '') {
  const q = wallQuad(o, side, xA, xB, f0, 1), m = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  let s = _q(q, dk(c, 0.25), 5) + _q([m(q[0], q[1], 0.12), m(q[1], q[0], 0.12), m(q[2], q[3], 0.12), m(q[3], q[2], 0.12)].map((p, i) => [p[0], p[1] + (i < 2 ? 14 : 0)]), c, 3);
  const pA = m(m(q[0], q[1], 0.25), m(q[3], q[2], 0.25), 0.12), pB = m(m(q[0], q[1], 0.75), m(q[3], q[2], 0.75), 0.42);
  const kn = m(m(q[0], q[1], 0.78), m(q[3], q[2], 0.78), 0.58);
  s += `<circle cx="${R1(kn[0])}" cy="${R1(kn[1])}" r="${R1(Math.abs(q[1][0] - q[0][0]) * 0.05 + 3)}" fill="#C9A227" stroke="${INK2}" stroke-width="2.5"/>`;
  if (num) { const p = m(m(q[0], q[1], 0.5), m(q[3], q[2], 0.5), 0.2), w = Math.abs(q[1][0] - q[0][0]); s += `<rect x="${R1(p[0] - w * 0.2)}" y="${R1(p[1] - w * 0.08)}" width="${R1(w * 0.4)}" height="${R1(w * 0.16)}" fill="#C9A227" stroke="${INK2}" stroke-width="2"/><text x="${R1(p[0])}" y="${R1(p[1] + w * 0.05)}" font-family="'Be Vietnam Pro', serif" font-weight="900" font-size="${R1(w * 0.13)}" text-anchor="middle" fill="${INK2}">${num}</text>`; }
  return s;
}
function sideFrame(o, side, xA, xB, f0, f1, inner = '#9DB894', fc = '#C9A227') { const q = wallQuad(o, side, xA, xB, f0, f1), m = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; return _q(q, fc, 4) + _q([m(q[0], q[2], 0.1), m(q[1], q[3], 0.1), m(q[2], q[0], 0.1), m(q[3], q[1], 0.1)], inner, 2.5); }

// ---------- đồ đạc (chính diện, có mặt trên xiên nhẹ)
// tranh khung: kind 'land'|'portrait'|'sea'|'map'
function frameD(x, y, w, h, kind = 'land', fc = '#B8902A') {
  let inner = '';
  if (kind === 'land') inner = `<rect width="${w}" height="${h}" fill="#CFE0E4"/><path d="M0 ${h * 0.65} Q${w * 0.3} ${h * 0.4} ${w * 0.55} ${h * 0.6} Q${w * 0.8} ${h * 0.45} ${w} ${h * 0.55} V${h} H0Z" fill="#9DB894"/><path d="M0 ${h * 0.8} Q${w * 0.5} ${h * 0.65} ${w} ${h * 0.8} V${h} H0Z" fill="#7E9A6E"/><circle cx="${w * 0.75}" cy="${h * 0.28}" r="${h * 0.1}" fill="#F2D16B"/>`;
  else if (kind === 'sea') inner = `<rect width="${w}" height="${h}" fill="#D8E4EA"/><rect y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="#6E9AB0"/><path d="M${w * 0.3} ${h * 0.6} l${w * 0.12} ${-h * 0.3} v${h * 0.3}Z" fill="#F4F1EA" stroke="${INK2}" stroke-width="2"/>`;
  else if (kind === 'portrait') inner = `<rect width="${w}" height="${h}" fill="#5A4A3A"/><ellipse cx="${w / 2}" cy="${h * 0.42}" rx="${w * 0.2}" ry="${h * 0.18}" fill="#E8C8A8"/><path d="M${w * 0.15} ${h} Q${w / 2} ${h * 0.55} ${w * 0.85} ${h}Z" fill="#2A2228"/><path d="M${w * 0.3} ${h * 0.3} Q${w / 2} ${h * 0.18} ${w * 0.7} ${h * 0.3}" stroke="#2A2228" stroke-width="${w * 0.08}" fill="none"/>`;
  else if (kind === 'map') inner = `<rect width="${w}" height="${h}" fill="#E8DCC0"/><path d="M${w * 0.1} ${h * 0.3} Q${w * 0.3} ${h * 0.1} ${w * 0.45} ${h * 0.35} Q${w * 0.4} ${h * 0.7} ${w * 0.2} ${h * 0.8}Z M${w * 0.55} ${h * 0.2} Q${w * 0.9} ${h * 0.15} ${w * 0.85} ${h * 0.6} Q${w * 0.7} ${h * 0.9} ${w * 0.6} ${h * 0.6}Z" fill="#C9B48A" stroke="${INK2}" stroke-width="2"/><path d="M0 ${h * 0.5} H${w} M${w * 0.5} 0 V${h}" stroke="#B8A07A" stroke-width="1.5"/>`;
  return `<g transform="translate(${R1(x - w / 2)} ${R1(y - h / 2)})"><rect x="-12" y="-12" width="${w + 24}" height="${h + 24}" fill="${fc}" stroke="${INK2}" stroke-width="4"/><rect x="-5" y="-5" width="${w + 10}" height="${h + 10}" fill="none" stroke="${dk(fc, 0.3)}" stroke-width="2"/>${inner}<rect width="${w}" height="${h}" fill="none" stroke="${INK2}" stroke-width="2.5"/></g>`;
}
const archD = (x, y, w, h) => `M${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} H${x}Z`;
function windowD(x, y, w, h, o = {}) {   // cửa sổ chính diện trên tường sau: o.view 'sky'|'night'|'city'|'cityNight'|'field'|'snow'|'nycSky', o.arch, o.curtain
  const id = `wv${Math.round(x)}_${Math.round(y)}`;
  let view = '';
  const v = o.view || 'sky';
  if (v === 'night' || v === 'cityNight' || v === 'nycNight') view = `<rect width="${w}" height="${h}" fill="#1E2A44"/>${[[0.2, 0.15], [0.7, 0.1], [0.45, 0.3], [0.85, 0.4], [0.1, 0.45]].map(([a, b]) => `<circle cx="${w * a}" cy="${h * b}" r="2.5" fill="#FFF4D6"/>`).join('')}<circle cx="${w * 0.72}" cy="${h * 0.22}" r="${Math.min(w, h) * 0.07}" fill="#F2E6B8"/>`;
  else view = `<rect width="${w}" height="${h}" fill="${v === 'snow' ? '#DDE4EA' : '#BFD8E2'}"/><path d="M${w * 0.1} ${h * 0.25} q${w * 0.08} -${h * 0.06} ${w * 0.16} 0 q${w * 0.06} -${h * 0.04} ${w * 0.1} ${h * 0.02}" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (v === 'city' || v === 'cityNight' || v === 'nycSky' || v === 'nycNight') { const night = v.includes('Night') || v === 'nycNight'; for (let i = 0; i < 9; i++) { const bw = w / 7, bh = h * (0.25 + 0.45 * hrnd(i, 4)) * (v.startsWith('nyc') && i === 4 ? 1.6 : 1), bx = i * bw * 0.8 - bw * 0.3; view += `<rect x="${R1(bx)}" y="${R1(h - bh)}" width="${R1(bw)}" height="${R1(bh)}" fill="${night ? '#2A3150' : '#9AA8B4'}" stroke="${INK2}" stroke-width="2"/>`; for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) if (h - bh + 10 + r * 18 < h - 6) view += `<rect x="${R1(bx + 5 + c * bw * 0.45)}" y="${R1(h - bh + 10 + r * 18)}" width="${R1(bw * 0.25)}" height="8" fill="${night ? (hrnd(i * 9 + r * 3 + c, 2) > 0.4 ? '#F6D77A' : '#1E2440') : '#D8E4EA'}"/>`; }
    if (v.startsWith('nyc')) { const ex = w * 0.52, eb = h; view += `<path d="M${ex - w * 0.05} ${eb} V${eb - h * 0.62} L${ex - w * 0.03} ${eb - h * 0.62} V${eb - h * 0.75} H${ex + w * 0.03} V${eb - h * 0.62} L${ex + w * 0.05} ${eb - h * 0.62} V${eb}Z" fill="${night ? '#3A4160' : '#B8C4CC'}" stroke="${INK2}" stroke-width="2"/><path d="M${ex} ${eb - h * 0.75} V${eb - h * 0.9}" stroke="${INK2}" stroke-width="2.5"/>`; } }
  if (v === 'field') view += `<path d="M0 ${h * 0.6} Q${w * 0.4} ${h * 0.45} ${w} ${h * 0.58} V${h} H0Z" fill="#9DB894"/>`;
  let s = `<g transform="translate(${R1(x - w / 2)} ${R1(y - h / 2)})"><clipPath id="${id}">${o.arch ? `<path d="${archD(0, 0, w, h)}"/>` : `<rect width="${w}" height="${h}"/>`}</clipPath>`;
  s += `${o.arch ? `<path d="${archD(-18, -18, w + 36, h + 36)}" fill="${o.frame || '#6B4A30'}" stroke="${INK2}" stroke-width="5"/>` : `<rect x="-18" y="-18" width="${w + 36}" height="${h + 36}" fill="${o.frame || '#6B4A30'}" stroke="${INK2}" stroke-width="5"/>`}<g clip-path="url(#${id})">${view}</g>`;
  s += `<path d="M${w / 2} 0 V${h} M0 ${h * 0.5} H${w}" stroke="${o.frame || '#6B4A30'}" stroke-width="10"/>${o.panes ? `<path d="M0 ${h * 0.25} H${w} M0 ${h * 0.75} H${w}" stroke="${o.frame || '#6B4A30'}" stroke-width="6"/>` : ''}${o.arch ? `<path d="${archD(0, 0, w, h)}" fill="none" stroke="${INK2}" stroke-width="3"/>` : `<rect width="${w}" height="${h}" fill="none" stroke="${INK2}" stroke-width="3"/>`}<rect x="-26" y="${h + 10}" width="${w + 52}" height="18" rx="4" fill="${dk(o.frame || '#6B4A30', 0.1)}" stroke="${INK2}" stroke-width="4"/>`;
  if (o.curtain) s += `<path d="M-40 -40 Q-10 ${h * 0.5} -50 ${h + 50} L-100 ${h + 50} L-100 -40Z M${w + 40} -40 Q${w + 10} ${h * 0.5} ${w + 50} ${h + 50} L${w + 100} ${h + 50} L${w + 100} -40Z" fill="${o.curtain}" stroke="${INK2}" stroke-width="4"/><path d="M-70 -30 Q-60 ${h * 0.5} -80 ${h + 40} M${w + 70} -30 Q${w + 60} ${h * 0.5} ${w + 80} ${h + 40}" stroke="${dk(o.curtain, 0.25)}" stroke-width="5" fill="none"/><rect x="-120" y="-56" width="${w + 240}" height="22" rx="10" fill="${o.rod || '#8A6A2A'}" stroke="${INK2}" stroke-width="4"/>`;
  return s + `</g>`;
}
function bookshelfD(x, y, w, h, rows = 4, wood = '#6B3E26', seed = 1) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wood}" stroke="${INK2}" stroke-width="5"/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" fill="${dk(wood, 0.35)}"/>`;
  const rh = (h - 24) / rows, cols = ['#9E2F25', '#3E6E66', '#C9A227', '#5A4A7A', '#2E4A6A', '#8A5A34', '#6E8A4A', '#B8A07A'];
  for (let r = 0; r < rows; r++) { const yy = y + 12 + (r + 1) * rh; let xx = x + 16; let i = 0;
    while (xx < x + w - 30) { const bw = 14 + hrnd(i, seed + r) * 16, bh = rh * (0.62 + 0.3 * hrnd(i, seed + r + 7)); if (hrnd(i, seed + r + 3) > 0.9 && xx < x + w - 70) { s += `<rect x="${R1(xx)}" y="${R1(yy - bh * 0.4)}" width="${R1(bh * 0.9)}" height="${R1(bh * 0.4 - 4)}" fill="${cols[(i + r) % 8]}" stroke="${INK2}" stroke-width="2.5"/>`; xx += bh * 0.9 + 4; i++; continue; }
      s += `<rect x="${R1(xx)}" y="${R1(yy - bh - 4)}" width="${R1(bw)}" height="${R1(bh)}" fill="${cols[(i * 3 + r) % 8]}" stroke="${INK2}" stroke-width="2.5"/><path d="M${R1(xx + 3)} ${R1(yy - bh + 8)} h${R1(bw - 6)}" stroke="#F2E6C8" stroke-width="2" opacity="0.7"/>`; xx += bw + 1.5; i++; }
    s += `<rect x="${x + 6}" y="${R1(yy - 4)}" width="${w - 12}" height="12" fill="${wood}" stroke="${INK2}" stroke-width="3"/>`; }
  return s;
}
function deskD(x, g, w = 520, o = {}) {   // bàn gỗ chính diện: mặt trên xiên + ngăn kéo; o.top màu mặt (da xanh), o.legs
  const h = o.h || 170, d = o.d || 40, wood = o.wood || '#6B3E26';
  let s = _q([[x - w / 2, g - h], [x + w / 2, g - h], [x + w / 2 - d, g - h - d * 0.9], [x - w / 2 + d, g - h - d * 0.9]], o.top || lt_(wood, 0.08), 4);
  if (o.top) s += _q([[x - w / 2 + 14, g - h - 4], [x + w / 2 - 14, g - h - 4], [x + w / 2 - d - 8, g - h - d * 0.9 + 6], [x - w / 2 + d + 8, g - h - d * 0.9 + 6]], o.top, 0);
  s += `<rect x="${x - w / 2}" y="${g - h}" width="${w}" height="26" fill="${wood}" stroke="${INK2}" stroke-width="4"/>`;
  if (o.legs) s += `<rect x="${x - w / 2 + 10}" y="${g - h + 26}" width="22" height="${h - 26}" fill="${dk(wood, 0.15)}" stroke="${INK2}" stroke-width="4"/><rect x="${x + w / 2 - 32}" y="${g - h + 26}" width="22" height="${h - 26}" fill="${dk(wood, 0.15)}" stroke="${INK2}" stroke-width="4"/>`;
  else { s += `<rect x="${x - w / 2 + 8}" y="${g - h + 26}" width="${w * 0.3}" height="${h - 26}" fill="${dk(wood, 0.08)}" stroke="${INK2}" stroke-width="4"/><rect x="${x + w / 2 - 8 - w * 0.3}" y="${g - h + 26}" width="${w * 0.3}" height="${h - 26}" fill="${dk(wood, 0.08)}" stroke="${INK2}" stroke-width="4"/>`;
    for (const xx of [x - w / 2 + 8, x + w / 2 - 8 - w * 0.3]) for (let k = 0; k < 3; k++) s += `<rect x="${xx + 10}" y="${g - h + 36 + k * (h - 46) / 3}" width="${w * 0.3 - 20}" height="${(h - 46) / 3 - 8}" rx="3" fill="none" stroke="${dk(wood, 0.35)}" stroke-width="3"/><circle cx="${xx + w * 0.15}" cy="${g - h + 36 + k * (h - 46) / 3 + (h - 46) / 6 - 4}" r="4" fill="#C9A227"/>`; }
  return s + `<ellipse cx="${x}" cy="${g + 4}" rx="${w * 0.55}" ry="14" fill="#20140A" opacity="0.15"/>`;
}
const lampD = (x, y, s = 1, on = 1, c = '#3E6E66') => _g(x, y, s, `${on ? `<ellipse cx="0" cy="-40" rx="120" ry="90" fill="#FFE39A" opacity="${0.25 * on}"/>` : ''}<path d="M-6 0 V-60" stroke="#8A6A2A" stroke-width="8"/><ellipse cx="0" cy="2" rx="40" ry="10" fill="#8A6A2A" stroke="${INK2}" stroke-width="3"/><path d="M-50 -60 L-34 -110 H34 L50 -60Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>${on ? `<path d="M-46 -60 H46" stroke="#FFF1B0" stroke-width="5"/>` : ''}`);
const inkwell = (x, y, s = 1) => _g(x, y, s, `<rect x="-16" y="-24" width="32" height="24" rx="5" fill="#2A3A5A" stroke="${INK2}" stroke-width="3"/><path d="M6 -24 L30 -80" stroke="#F4F1EA" stroke-width="5"/><path d="M28 -78 q10 -10 4 -24 q-10 8 -4 24Z" fill="#F4F1EA" stroke="${INK2}" stroke-width="2"/>`);
const paperStack = (x, y, s = 1, n = 5, rot = 0) => _g(x, y, s, Array.from({ length: n }, (_, i) => `<rect x="${-50 + (i % 2) * 4}" y="${-i * 5 - 8}" width="100" height="8" fill="#F4F1EA" stroke="${INK2}" stroke-width="2"/>`).join(''), rot);
const globeD = (x, g, s = 1) => _g(x, g, s, `<path d="M-40 0 H40 M0 0 V-60" stroke="#6B4A30" stroke-width="10"/><circle cx="0" cy="-130" r="70" fill="#7FA9BF" stroke="${INK2}" stroke-width="5"/><path d="M-40 -170 Q-10 -190 10 -160 Q0 -130 -30 -120Z M10 -110 Q40 -120 50 -90 Q30 -70 10 -80Z" fill="#C9B48A" stroke="${INK2}" stroke-width="2.5"/><path d="M-80 -130 A80 80 0 0 1 80 -130" stroke="#C9A227" stroke-width="6" fill="none"/>`);
const plantD = (x, g, s = 1, c = '#5E8A4A') => _g(x, g, s, `<path d="M-46 0 L-56 -90 H56 L46 0Z" fill="#B8704A" stroke="${INK2}" stroke-width="4"/><rect x="-62" y="-104" width="124" height="20" rx="5" fill="#9E5A3A" stroke="${INK2}" stroke-width="4"/>${[-70, -40, -10, 20, 50, 80].map((a, i) => `<path d="M0 -100 Q${a * 1.2} ${-180 - (i % 2) * 40} ${a * 2.4} ${-150 - (i % 3) * 50}" stroke="${c}" stroke-width="5" fill="none"/><path d="M${a * 1.2} ${-180 - (i % 2) * 40} q${a > 0 ? 30 : -30} -10 ${a * 1.2} ${30 - (i % 3) * 50}" stroke="${INK2}" stroke-width="0" fill="none"/><ellipse cx="${R1(a * 2.2)}" cy="${R1(-152 - (i % 3) * 50)}" rx="34" ry="12" fill="${i % 2 ? c : dk(c, 0.12)}" stroke="${INK2}" stroke-width="3" transform="rotate(${a * 0.5} ${R1(a * 2.2)} ${R1(-152 - (i % 3) * 50)})"/>`).join('')}`);
const sconceD = (x, y, on = 1) => `<g transform="translate(${x} ${y})">${on ? `<circle cx="0" cy="-10" r="70" fill="#FFE39A" opacity="${0.28 * on}"/>` : ''}<path d="M0 30 Q-20 10 -8 -10 H8 Q20 10 0 30Z" fill="#B8902A" stroke="${INK2}" stroke-width="3"/><path d="M-16 -10 L-10 -40 H10 L16 -10Z" fill="#F7EBD3" stroke="${INK2}" stroke-width="3"/>${on ? `<circle cx="0" cy="-26" r="8" fill="#FFF1B0"/>` : ''}</g>`;
const chandelierD = (x, y, s = 1, on = 1) => _g(x, y, s, `<path d="M0 -200 V-40" stroke="#8A6A2A" stroke-width="5"/>${on ? `<ellipse cx="0" cy="10" rx="220" ry="120" fill="#FFE39A" opacity="${0.18 * on}"/>` : ''}<ellipse cx="0" cy="0" rx="120" ry="26" fill="#C9A227" stroke="${INK2}" stroke-width="4"/><path d="M-120 0 Q0 60 120 0" stroke="${INK2}" stroke-width="3" fill="#B8902A"/>${[-100, -60, -20, 20, 60, 100].map(xx => `<path d="M${xx} -4 V-30" stroke="#F4F1EA" stroke-width="7"/><path d="M${xx} -32 q-5 -10 0 -18 q5 8 0 18Z" fill="#FFB35A"/>`).join('')}${[-90, -45, 0, 45, 90].map(xx => `<path d="M${xx} 20 l-6 24 l6 10 l6 -10Z" fill="#E8F2FF" stroke="${INK2}" stroke-width="2"/>`).join('')}`);
const rugD = (cx, cy, w, h, c = '#8E2A22', c2 = '#C9A227') => `<path d="M${cx - w * 0.42} ${cy - h / 2} H${cx + w * 0.42} L${cx + w / 2} ${cy + h / 2} H${cx - w / 2}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M${cx - w * 0.36} ${cy - h * 0.36} H${cx + w * 0.36} L${cx + w * 0.42} ${cy + h * 0.36} H${cx - w * 0.42}Z" fill="none" stroke="${c2}" stroke-width="5"/><ellipse cx="${cx}" cy="${cy}" rx="${w * 0.16}" ry="${h * 0.22}" fill="none" stroke="${c2}" stroke-width="4"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${R1(cx - w / 2 + (i + 0.5) * w / 14)} ${cy + h / 2} v12" stroke="${c2}" stroke-width="3"/>`).join('')}`;
const clockWall = (x, y, s, T) => _g(x, y, s, `<rect x="-60" y="-110" width="120" height="260" rx="14" fill="#6B3E26" stroke="${INK2}" stroke-width="4"/><circle cy="-40" r="46" fill="#F7F0DE" stroke="${INK2}" stroke-width="4"/>${Array.from({ length: 12 }, (_, i) => `<path transform="translate(0 -40) rotate(${i * 30})" d="M0 -40 V-34" stroke="${INK2}" stroke-width="3"/>`).join('')}<path transform="translate(0 -40) rotate(${R1(T * 6)})" d="M0 4 V-34" stroke="${INK2}" stroke-width="3"/><path transform="translate(0 -40) rotate(${R1(T * 0.5 + 100)})" d="M0 4 V-22" stroke="${INK2}" stroke-width="5"/><rect x="-30" y="30" width="60" height="100" rx="6" fill="${dk('#6B3E26', 0.3)}"/><g transform="translate(0 34) rotate(${R1(Math.sin(T * 3) * 14)})"><path d="M0 0 V70" stroke="#C9A227" stroke-width="4"/><circle cy="74" r="12" fill="#C9A227" stroke="${INK2}" stroke-width="3"/></g>`);
const columnD = (x, y0, y1, w = 70, c = '#EDE6D6') => `<rect x="${x - w / 2 - 14}" y="${y1 - 26}" width="${w + 28}" height="26" fill="${dk(c, 0.06)}" stroke="${INK2}" stroke-width="4"/><rect x="${x - w / 2}" y="${y0 + 30}" width="${w}" height="${y1 - y0 - 56}" fill="${c}" stroke="${INK2}" stroke-width="4"/>${[-0.3, 0, 0.3].map(u => `<path d="M${x + u * w} ${y0 + 36} V${y1 - 32}" stroke="${dk(c, 0.15)}" stroke-width="3"/>`).join('')}<rect x="${x - w / 2 - 16}" y="${y0}" width="${w + 32}" height="32" fill="${dk(c, 0.04)}" stroke="${INK2}" stroke-width="4"/><path d="M${x - w / 2 - 16} ${y0 + 10} q-12 10 0 20 M${x + w / 2 + 16} ${y0 + 10} q12 10 0 20" stroke="${INK2}" stroke-width="3" fill="none"/>`;
const crateD = (x, g, s = 1, c = '#B8925E') => _g(x, g, s, `<rect x="-70" y="-120" width="140" height="120" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M-70 -120 L70 0 M70 -120 L-70 0" stroke="${dk(c, 0.25)}" stroke-width="5"/><rect x="-70" y="-120" width="140" height="120" fill="none" stroke="${dk(c, 0.3)}" stroke-width="10"/><rect x="-70" y="-120" width="140" height="120" fill="none" stroke="${INK2}" stroke-width="4"/>`);
const barrelD = (x, g, s = 1, c = '#8A5A34') => _g(x, g, s, `<path d="M-50 0 Q-64 -70 -50 -140 H50 Q64 -70 50 0Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>${[-120, -70, -20].map(y => `<path d="M-58 ${y + 10} Q0 ${y + 22} 58 ${y + 10}" stroke="#5A5A62" stroke-width="7" fill="none"/>`).join('')}<path d="M-20 -136 Q-26 -70 -20 -4 M20 -136 Q26 -70 20 -4" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none"/>`);
const chairD = (x, g, s = 1, c = '#6B3E26', flip = false) => _g(x, g, s, `<g transform="scale(${flip ? -1 : 1} 1)"><path d="M-40 -90 L-46 -230 Q0 -250 40 -230 L40 -90" fill="${c}" stroke="${INK2}" stroke-width="4"/><rect x="-30" y="-210" width="60" height="100" rx="8" fill="#8E2A22" stroke="${INK2}" stroke-width="3"/><path d="M-56 -100 H50 L44 -76 H-50Z" fill="${dk(c, 0.1)}" stroke="${INK2}" stroke-width="4"/><path d="M-46 -76 L-50 0 M38 -76 L42 0" stroke="${INK2}" stroke-width="9"/></g>`);
// đèn khí đường phố
const streetLampD = (x, g, s = 1, on = 0) => _g(x, g, s, `<path d="M-14 0 H14 L8 -30 H-8Z" fill="#2A2A30" stroke="${INK2}" stroke-width="3"/><path d="M0 -30 V-260" stroke="#2A2A30" stroke-width="10"/><path d="M-30 -270 H30" stroke="#2A2A30" stroke-width="5"/><path d="M-22 -270 L-28 -330 H28 L22 -270Z" fill="${on ? '#F6D77A' : '#E8EEF2'}" stroke="${INK2}" stroke-width="4"/><path d="M-34 -330 L0 -352 L34 -330Z" fill="#2A2A30" stroke="${INK2}" stroke-width="3"/>${on ? `<circle cx="0" cy="-300" r="90" fill="#FFE39A" opacity="0.28"/>` : ''}`);
// xe ngựa thế kỷ 19 (nhìn ngang)
function hansomD(x, g, s = 1, T = 0, c = '#2A2A34') {
  const wh = (cx, r) => `<g transform="translate(${cx} ${-r})"><circle r="${r}" fill="none" stroke="${INK2}" stroke-width="7"/><circle r="${r}" fill="none" stroke="#8A6A2A" stroke-width="3"/><g transform="rotate(${R1(T * 200)})">${[0, 30, 60, 90, 120, 150].map(a => `<path transform="rotate(${a})" d="M-${r} 0 H${r}" stroke="#8A6A2A" stroke-width="3"/>`).join('')}</g><circle r="7" fill="${INK2}"/></g>`;
  const leg = Math.sin(T * 10) * 12;
  return _g(x, g, s, `<path d="M-60 -60 L-260 -120" stroke="#5A3A24" stroke-width="7"/><g transform="translate(-330 0)"><path d="M-80 -160 Q-40 -200 40 -180 Q70 -170 60 -130 L60 -100 Q0 -96 -70 -110Z" fill="#6B4A34" stroke="${INK2}" stroke-width="4"/><path d="M40 -180 L80 -240 L100 -232 L76 -170Z" fill="#6B4A34" stroke="${INK2}" stroke-width="4"/><circle cx="88" cy="-232" r="5" fill="${INK2}"/><path d="M-60 -110 L${-70 + leg} 0 M-40 -108 L${-34 - leg} 0 M30 -110 L${40 + leg} 0 M50 -112 L${56 - leg} 0" stroke="#5A3A2A" stroke-width="12" stroke-linecap="round"/><path d="M-80 -150 q-30 20 -24 60" stroke="#3A2A20" stroke-width="10" fill="none" stroke-linecap="round"/></g><path d="M-80 -60 H120 V-230 Q40 -260 -40 -230 Q-80 -180 -80 -60Z" fill="${c}" stroke="${INK2}" stroke-width="5"/><rect x="-30" y="-200" width="90" height="70" rx="8" fill="#BFD8E2" stroke="${INK2}" stroke-width="3"/><path d="M120 -230 H170 V-200" stroke="${INK2}" stroke-width="5" fill="none"/>${wh(40, 70)}`);
}
// mặt tiền nhà phố New York thế kỷ 19
function facadeD(x, top, w, g, o = {}) {
  const c = o.c || '#A8644C', night = o.night; const cc = night ? mixC(c, '#1A2030', 0.55) : c;
  let s = `<rect x="${x}" y="${top}" width="${w}" height="${g - top}" fill="${cc}" stroke="${INK2}" stroke-width="5"/>`;
  for (let r = 0; r * 18 < g - top; r++) for (let k = 0; k < w / 60; k++) if (hrnd(r * 13 + k, x) > 0.72) s += `<path d="M${R1(x + 10 + k * 60 + (r % 2) * 30)} ${top + 10 + r * 18} h26" stroke="${dk(cc, 0.18)}" stroke-width="3"/>`;
  s += `<rect x="${x - 10}" y="${top - 30}" width="${w + 20}" height="30" fill="${dk(cc, 0.3)}" stroke="${INK2}" stroke-width="4"/>${Array.from({ length: Math.floor(w / 30) }, (_, i) => `<rect x="${x - 6 + i * 30}" y="${top - 6}" width="16" height="12" fill="${dk(cc, 0.3)}" stroke="${INK2}" stroke-width="2"/>`).join('')}`;
  const shopH = o.shop ? 170 : 0, nw = Math.max(1, Math.floor(w / 100)), gap = w / nw;
  for (let r = 0; ; r++) { const wy = top + 30 + r * 120; if (wy + 80 > g - shopH - 10) break;
    for (let k = 0; k < nw; k++) { const wx = x + gap * k + gap / 2 - 26; const lit = night && hrnd(r * 7 + k, x + 3) > 0.45;
      s += `<rect x="${R1(wx - 6)}" y="${wy - 12}" width="64" height="12" fill="${dk(cc, 0.32)}" stroke="${INK2}" stroke-width="2.5"/><rect x="${R1(wx)}" y="${wy}" width="52" height="80" fill="${lit ? '#F2D27A' : night ? '#2A3448' : '#DCE6EC'}" stroke="${INK2}" stroke-width="3"/><path d="M${R1(wx + 26)} ${wy} V${wy + 80} M${R1(wx)} ${wy + 40} H${R1(wx + 52)}" stroke="${dk(cc, 0.2)}" stroke-width="3"/><rect x="${R1(wx - 6)}" y="${wy + 80}" width="64" height="9" fill="${lt_(cc, 0.25)}" stroke="${INK2}" stroke-width="2.5"/>`; } }
  if (o.fire) { const fx = x + w * 0.62; for (let r = 0; ; r++) { const wy = top + 30 + r * 120 + 92; if (wy > g - shopH - 20) break; s += `<path d="M${fx - 60} ${wy} H${fx + 90} M${fx - 60} ${wy - 34} H${fx + 90}" stroke="#2A2A30" stroke-width="4"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${fx - 60 + i * 25} ${wy} V${wy - 34}" stroke="#2A2A30" stroke-width="2.5"/>`).join('')}<path d="M${fx - 40} ${wy} L${fx + 60} ${wy + 86}" stroke="#2A2A30" stroke-width="4"/>`; } }
  if (o.shop) { const sy = g - shopH; s += `<rect x="${x}" y="${sy}" width="${w}" height="${shopH}" fill="${dk(cc, 0.15)}" stroke="${INK2}" stroke-width="4"/><rect x="${x + 20}" y="${sy + 60}" width="${w * 0.55}" height="${shopH - 60}" fill="${night ? '#F2D27A' : '#BFD8E2'}" stroke="${INK2}" stroke-width="4"/><rect x="${x + w * 0.65}" y="${sy + 50}" width="${w * 0.22}" height="${shopH - 50}" fill="#4A2E20" stroke="${INK2}" stroke-width="4"/>`;
    const aw = o.awning || '#9E2F25'; s += `<path d="M${x + 10} ${sy + 10} H${x + w - 10} L${x + w + 10} ${sy + 60} H${x - 10}Z" fill="${aw}" stroke="${INK2}" stroke-width="4"/>${Array.from({ length: Math.floor(w / 40) }, (_, i) => i % 2 ? `<path d="M${x + 10 + i * 40} ${sy + 10} L${x + i * 40 - 4} ${sy + 60} H${x + i * 40 + 36} L${x + 10 + (i + 1) * 40} ${sy + 10}Z" fill="#F4F1EA" opacity="0.8"/>` : '').join('')}`;
    if (o.sign) s += `<rect x="${x + w / 2 - o.sign.length * 11 - 14}" y="${sy - 50}" width="${o.sign.length * 22 + 28}" height="44" rx="4" fill="#1E1A1C" stroke="#C9A227" stroke-width="4"/><text x="${x + w / 2}" y="${sy - 18}" font-family="'Be Vietnam Pro', serif" font-weight="900" font-size="28" text-anchor="middle" fill="#F2E6C8">${o.sign}</text>`; }
  return s;
}
// mặt đường đá lát phối cảnh + vỉa hè
function streetGround(y, night, o = {}) {
  let s = `<rect y="${y}" width="1920" height="${1080 - y}" fill="${night ? '#3A3A44' : '#8E8A82'}"/><rect y="${y}" width="1920" height="${o.walk || 70}" fill="${night ? '#4A4A52' : '#A8A296'}" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 26; i++) s += `<path d="M${i * 80 + 20} ${y} V${y + (o.walk || 70)}" stroke="${INK2}" stroke-width="2" opacity="0.35"/>`;
  const y2 = y + (o.walk || 70); s += `<rect y="${y2}" width="1920" height="10" fill="#6E6A62" stroke="${INK2}" stroke-width="3"/>`;
  for (let r = 0; r < 8; r++) { const yy = y2 + 20 + r * r * 4 + r * 18, sz = 22 + r * 7; for (let k = -1; k < 1920 / sz + 1; k++) { const xx = k * sz * 1.4 + (r % 2) * sz * 0.7; s += `<rect x="${R1(xx)}" y="${R1(yy)}" width="${R1(sz * 1.25)}" height="${R1(sz * 0.6)}" rx="${R1(sz * 0.2)}" fill="${night ? '#44444E' : mixC('#9A958A', '#7E7A72', hrnd(k, r))}" stroke="${INK2}" stroke-width="1.6" opacity="0.85"/>`; } }
  return s;
}
// dây điện/điện thoại chằng chịt kiểu New York 1880s giữa các cột
function wireTangle(poles, y0, n = 6, sag = 50) { let s = ''; for (let j = 0; j < n; j++) for (let i = 0; i + 1 < poles.length; i++) { const a = poles[i], b = poles[i + 1], y = y0 + j * 16; s += `<path d="M${a} ${y} Q${(a + b) / 2} ${y + sag + j * 4} ${b} ${y}" stroke="${INK2}" stroke-width="2.2" fill="none" opacity="0.85"/>`; } return s; }
function telePole(x, g, top = 90, arms = 4) { let s = `<path d="M${x} ${g} V${top}" stroke="#4A3A2C" stroke-width="16"/>`; for (let i = 0; i < arms; i++) { const y = top + 16 + i * 32; s += `<path d="M${x - 90} ${y} H${x + 90}" stroke="#4A3A2C" stroke-width="9"/>` + [-80, -50, -20, 20, 50, 80].map(dx => `<rect x="${x + dx - 4}" y="${y - 12}" width="8" height="10" fill="#8AB8A0" stroke="${INK2}" stroke-width="1.5"/>`).join(''); } return s; }
// bóng đổ dưới chân (đặt trước nhân vật nếu cần)
const footShadow = (x, g, w = 140) => `<ellipse cx="${x}" cy="${g}" rx="${w}" ry="${w * 0.14}" fill="#20140A" opacity="0.16"/>`;

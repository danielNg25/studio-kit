// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT KIM DUNG — TẬP xep-hang-vo-cong-p2 (kênh kênh mẫu, 2026-10-15, CHỜ DUYỆT).
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js. Cùng kiểu webtoon-code-v1: tô phẳng 2 tông + viền mực, mặt/tóc không chi tiết hơn áo.
// Thuộc tính mới: faceVeil (khăn lụa che nửa dưới mặt — Lý Thu Thủy), lamaHat (mũ sư Tây Tạng), kid (đầu to/thân nhỏ — Đồng Lão),
// tiara (cài tóc ngọc); đồ cầm tay: 'wheel' (bánh xe vàng của Kim Luân), 'bamboo' (gậy trúc thường của A Thanh), 'shears' (kéo cá sấu).
// Đạo cụ: kd2Wheels(cx, cy, k, T) — 5 bánh xe vàng/bạc/đồng/sắt/chì xoay quanh Kim Luân.

const KD2_METAL = [['#E8BE48', '#B88A22'], ['#DCE0E6', '#A8B0BA'], ['#D08A4A', '#A0622E'], ['#7A7E86', '#55585E'], ['#9AA0A8', '#70767E']];
function kd2Wheel(r, c, cs, spin) {
  let s = chT(`M${-r} 0 a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 ${-2 * r} 0Z M${-r * 0.62} 0 a${r * 0.62} ${r * 0.62} 0 1 0 ${r * 1.24} 0 a${r * 0.62} ${r * 0.62} 0 1 0 ${-r * 1.24} 0Z`, c, cs, { sx: 0, sy: 3, lw: 4 });
  let sp = '';
  for (let i = 0; i < 8; i++) { const a = spin + i * Math.PI / 4; sp += `M${f1(Math.cos(a) * r * 0.18)} ${f1(Math.sin(a) * r * 0.18)} L${f1(Math.cos(a) * r * 0.64)} ${f1(Math.sin(a) * r * 0.64)} `; }
  s += chL(sp, 5, cs) + `<circle r="${f1(r * 0.2)}" fill="${c}" stroke="${CH_INK}" stroke-width="3.5"/>`;
  let th = '';   // răng cưa quanh vành (bánh xe pháp khí, không phải bánh lái tàu)
  for (let i = 0; i < 12; i++) { const a = spin + i * Math.PI / 6, a1 = a - 0.16, a2 = a + 0.16, R2 = r * 1.24;
    th += `M${f1(Math.cos(a1) * r * 0.98)} ${f1(Math.sin(a1) * r * 0.98)} L${f1(Math.cos(a + 0.1) * R2)} ${f1(Math.sin(a + 0.1) * R2)} L${f1(Math.cos(a2) * r * 0.98)} ${f1(Math.sin(a2) * r * 0.98)}Z `; }
  return chT(th, c, cs, { sx: 0, sy: 2, lw: 3.5 }) + s;
}
function kd2Wheels(cx, cy, k, T, o = {}) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = T * (o.speed || 0.9) + i * 2 * Math.PI / 5, rx = (o.rx || 300) * k, ry = (o.ry || 120) * k;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, sc = 0.82 + 0.18 * Math.sin(a);
    s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * sc)})">${kd2Wheel(52, KD2_METAL[i][0], KD2_METAL[i][1], T * 6 + i)}</g>`;
  }
  return s;
}

// ---------- đầu: khăn che mặt, mũ sư Tây Tạng, cài tóc ----------
function kd2HeadX(c, ex, T, o = {}) {
  let b = '', f = '';
  const sw = Math.sin(T * 2 + (o.seed || 0));
  if (c.faceVeil) {   // khăn lụa trắng mỏng che từ sống mũi xuống cằm, hai mép vắt ra sau tai, đuôi khăn bay nhẹ
    const V = typeof c.faceVeil === 'string' ? c.faceVeil : '#F4F0FA';
    f += `<g opacity="0.9">` + chT(`M-112 40 Q14 62 140 40 Q146 120 ${128 + sw * 3} 210 Q${96 + sw * 3} 196 ${70 + sw * 3} 222 Q${40 + sw * 2} 200 ${14 + sw * 2} 230 Q${-12 + sw * 2} 200 ${-42 + sw} 222 Q${-68 + sw} 196 ${-100 + sw} 210 Q-118 120 -112 40Z`, V, mixC(V, '#5A4A70', 0.18), { sx: 8, sy: 0, lw: 3.5 }) + `</g>`;
    f += chL(`M-60 70 Q${-64 + sw} 140 ${-58 + sw} 196 M14 72 Q${14 + sw} 150 ${14 + sw * 2} 210 M88 70 Q${92 + sw} 140 ${86 + sw * 2} 196`, 2, mixC(V, '#5A4A70', 0.25), 0.8);
    f += chL('M-112 40 Q14 62 140 40', 3, '#B8A8D0') + [-80, -40, 14, 68, 108].map(x => `<circle cx="${x}" cy="${f1(48 + (x === 14 ? 6 : 3))}" r="4.5" fill="#E8D8F6" stroke="${CH_INK}" stroke-width="1.6"/>`).join('');
    b += chT(`M-112 40 Q-170 70 ${-196 + sw * 8} 140 L${-176 + sw * 8} 156 Q-150 90 -104 66Z`, '#FBFAF6', '#DEDCD2', { lw: 3.5 });
  }
  if (c.lamaHat) {   // mũ sư Tây Tạng: vòm vàng cao, vành dày, mào lông phía trên
    const H = typeof c.lamaHat === 'string' ? c.lamaHat : TDK_G, HS = mixC(H, '#000000', 0.25);
    f += chT('M-116 -150 Q-118 -210 -60 -236 Q14 -262 88 -236 Q146 -210 144 -150 Q14 -176 -116 -150Z', H, HS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-124 -160 Q14 -196 152 -160 L156 -136 Q14 -170 -128 -136Z', '#8E2C1E', '#6A1E14', { lw: 4 });
    f += chT('M-30 -246 Q-20 -320 14 -336 Q48 -320 58 -246 Q14 -258 -30 -246Z', H, HS, { sx: 4, sy: 4, lw: 4 });
    for (let i = 0; i < 5; i++) f += chL(`M${-18 + i * 16} -252 Q${-14 + i * 16} -300 ${-6 + i * 14} -322`, 2, HS, 0.9);
  }
  if (c.tiara) f += chT('M-70 -178 Q14 -206 98 -178 L92 -166 Q14 -192 -64 -166Z', c.tiara, mixC(c.tiara, '#000000', 0.25), { lw: 3 }) + `<circle cx="14" cy="-196" r="9" fill="#7FC8C0" stroke="${CH_INK}" stroke-width="2.5"/>`;
  return [b, f];
}
const _kd2Head0 = chHead;
function _kd2HeadN(c, ex, T, o) { const [hb, hf] = _kd2Head0(c, ex, T, o); if (!(c.faceVeil || c.lamaHat || c.tiara)) return [hb, hf]; const [xb, xf] = kd2HeadX(c, ex, T, o); return [xb + hb, hf + xf]; }
chHead = function (c, ex, T, o = {}) {
  if (c && c.kid) { const [b0, f0] = _kd2HeadN(c, ex, T, o), K = `<g transform="translate(14 150) scale(1.22) translate(-14 -150)">`; return [K + b0 + '</g>', K + f0 + '</g>']; }
  const [hb, hf] = _kd2Head0(c, ex, T, o);
  if (!c || !(c.faceVeil || c.lamaHat || c.tiara)) return [hb, hf];
  const [xb, xf] = kd2HeadX(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- đồ cầm tay ----------
const _kd2Hand0 = chHand;
chHand = function (kind, c) {
  if (kind === 'wheel') return _kd2Hand0('fist', c) + `<g transform="translate(0 70)">${kd2Wheel(70, KD2_METAL[0][0], KD2_METAL[0][1], 0.3)}</g>`;
  if (kind === 'bamboo') return `<g transform="rotate(${TDK_ROT}) rotate(90)">` + chT('M-120 -7 L320 -7 Q330 0 320 7 L-120 7Z', '#B8B068', '#8E8640', { sx: 0, sy: 3, lw: 3.5 }) + [-40, 60, 160, 260].map(x => chL(`M${x} -7 V7`, 3, '#6E6830')).join('') + `</g>` + _kd2Hand0('fist', c);
  if (kind === 'shears') return _kd2Hand0('fist', c) + `<g transform="rotate(${TDK_ROT})">` + chT('M-8 -20 L8 -20 L8 90 L-8 90Z', '#4A3A2A', '#2E241A', { lw: 3 }) + chT('M-30 90 L4 90 L-10 260 Q-34 200 -30 90Z M4 90 L36 90 Q36 200 14 260Z', '#5E7A5A', '#42583E', { sx: 2, sy: 0, lw: 3.5 }) + chL('M-22 120 l8 8 M-18 160 l8 8 M-14 200 l8 8 M26 120 l-8 8 M22 160 l-8 8 M18 200 l-8 8', 3, '#E8E4D2') + `</g>`;
  return _kd2Hand0(kind, c);
};

// ---------- nhân vật ----------

// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// TÔN NGỘ KHÔNG — bản 2 (2026-10-12). Người dùng: "trang phục chưa đạt… tham khảo bản Văn Vở… nhưng mình vẫn thích kiểu có mắt mũi của chúng ta, nên cân đối".
// Cân đối = khung đầu giống Văn Vở (đầu tròn lông xù, mặt nạ kem hình 2 thuỳ ôm mắt + mõm, 2 tai tròn chìa ra) + mắt/lông mày/mũi/miệng của pack webtoon-code-v1.
// Trang phục theo Văn Vở + truyện gốc:
//   look 'da'  — khỉ đá / Mỹ Hầu Vương: trần, toàn thân lông, ngực lông sáng (hồi 1–2)
//   look 'tt'  — Tề Thiên Đại Thánh: giáp đỏ, huy hiệu vuông vàng giữa ngực, giáp vai + vạt dưới vảy cá vàng, đai xanh, áo choàng đỏ, mũ vàng 2 sợi lông trĩ dài (hồi 3–7)
//   look 'hg'  — Hành Giả đi thỉnh kinh (xem trước cho phần sau): áo vàng, khăn đỏ thắt cổ, đai xanh, váy da hổ, vòng kim cô
// Gậy Như Ý theo truyện: thân sắt đen, hai đầu bịt vàng.
const TNK = { fur: '#C98A44', furS: '#9E6430', mask: '#F6E2C4', maskS: '#E2C49C', ink: CH_INK };
const tnkChar = (look, extra) => Object.assign({ male: 1, name: 'Tôn Ngộ Không', monkey: 1, look, iris: ['#7A4A10', '#E6A830'], skin: TNK.mask, skinS: TNK.maskS,
  handSkin: TNK.mask, handSkinS: TNK.maskS, hair: TNK.fur, hairS: TNK.furS, brow: '#6A3A16', bulk: 0.92, tail: 1, pants: '#8A3A2A', shoe: '#5A3A2A' }, extra);

// biểu cảm riêng của Ngộ Không (lém lỉnh): [mắt, góc mày, miệng, phụ, {bNear, bFar, look, wink}]
const TNK_EX = {
  lem: ['half', 4, 'mgrin', '', { bNear: -26, bFar: 16, look: 1 }],    // liếc ngang, nhếch mép, một bên mày nhướn cao
  nhay: ['open', 0, 'mgrin2', '', { wink: 1, bNear: -8, bFar: 8 }],    // nháy mắt, cười toe
  hihi: ['happy', -6, 'mgrin2', '', { bNear: -12, bFar: -2 }],         // cười híp mắt lộ răng
};
function tnkTuft(cx, cy, rx, ry, a0, a1, n, depth) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n, am = a0 + (a1 - a0) * (i - 0.5) / n, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (!i) { d += `M${f1(x)} ${f1(y)}`; continue; }
    d += ` Q${f1(cx + Math.cos(am) * rx * (1 + depth))} ${f1(cy + Math.sin(am) * ry * (1 + depth))} ${f1(x)} ${f1(y)}`;
  }
  return d;
}
// vòng (hoặc cung a0..a1, khép về tâm) lông nhọn so le, đung đưa nhẹ
function tnkTufts(cx, cy, rx, ry, n, depth, seed = 0, T = 0, a0 = 0, a1 = Math.PI * 2) {
  const full = a1 - a0 >= Math.PI * 2 - 1e-6; let d = '';
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (!i) { d += `M${f1(x)} ${f1(y)}`; continue; }
    // chỏm lông mềm: cong lên tới ngọn rồi cong xuống (không phải gai thẳng)
    const am = a0 + (a1 - a0) * (i - 0.5) / n, k = 1 + depth * (0.75 + 0.25 * Math.sin(i * 2.3 + seed)) + 0.01 * Math.sin(T * 3 + i);
    const tx = cx + Math.cos(am) * rx * k, ty = cy + Math.sin(am) * ry * k, a1_ = a0 + (a1 - a0) * (i - 0.85) / n, a2_ = a0 + (a1 - a0) * (i - 0.15) / n;
    d += ` Q${f1(cx + Math.cos(a1_) * rx * (1 + depth * 0.55))} ${f1(cy + Math.sin(a1_) * ry * (1 + depth * 0.55))} ${f1(tx)} ${f1(ty)} Q${f1(cx + Math.cos(a2_) * rx * (1 + depth * 0.2))} ${f1(cy + Math.sin(a2_) * ry * (1 + depth * 0.2))} ${f1(x)} ${f1(y)}`;
  }
  return d + (full ? 'Z' : ` L${f1(cx)} ${f1(cy - ry * 0.3)}Z`);
}
// vảy cá vàng trong một vùng (cắt theo path)
function tnkScales(clipD, x0, y0, w, h, r, base = '#E0B048', sh = '#B08428') {
  const id = 'tks' + (CHN++); let s = `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})"><path d="${clipD}" fill="${base}"/>`;
  for (let row = 0, y = y0; y < y0 + h + r; row++, y += r * 0.9) for (let x = x0 - (row % 2) * r; x < x0 + w + r; x += r * 2)
    s += `<path d="M${f1(x - r)} ${f1(y)} A${r} ${r} 0 0 0 ${f1(x + r)} ${f1(y)}" fill="${base}" stroke="${sh}" stroke-width="3"/>`;
  return s + `</g><path d="${clipD}" fill="none" stroke="${CH_INK}" stroke-width="4" stroke-linejoin="round"/>`;
}

// ---------- ĐẦU ----------
function tnkHead(c, ex, T, o = {}) {
  const E = TNK_EX[ex] || CH_EXPR[ex] || CH_EXPR.neutral, EO = E[4] || {}, seed = o.seed || 0, F = c.hair, FS = c.hairS, M = TNK.mask, MS = TNK.maskS;
  let eyeEx = E[0];
  if (((T + seed * 1.37) % 3.4) < 0.11 && ['open', 'half', 'angry'].includes(eyeEx)) eyeEx = 'closed';
  const look = o.look ?? EO.look ?? 0, ba = E[1];
  let back = '', s = '', front = '';
  const ear = (x, y, r, fl) => chT(`M${x} ${y - r} Q${x + fl * r * 1.45} ${y - r * 1.05} ${x + fl * r * 1.4} ${y + r * 0.1} Q${x + fl * r * 1.25} ${y + r * 1.1} ${x} ${y + r * 0.9}Z`, M, MS, { sx: -fl * 5, sy: 0, lw: 4.5 })
    + chL(`M${x + fl * r * 0.25} ${y - r * 0.45} Q${x + fl * r * 1.0} ${y - r * 0.45} ${x + fl * r * 0.9} ${y + r * 0.2} Q${x + fl * r * 0.75} ${y + r * 0.55} ${x + fl * r * 0.25} ${y + r * 0.45}`, 3, '#C79A70');
  // cổ lông
  s += chT('M-34 70 L-30 150 L40 150 L42 70Z', F, FS, { sx: -14, sy: 0, lw: 4 });
  // 2 tai tròn chìa ra hai bên (vẽ sau khối lông)
  // (người dùng 23:35 'cho thêm lông') vòng lông xù ngoài cùng, nhọn hơn — tai vẽ đè lên
  back += ear(-128, -6, 44, -1) + ear(158, -6, 42, 1);
  // khối đầu lông xù + chỏm lông trên đỉnh
  s += chT(tnkTufts(16, -36, 160, 168, 24, 0.13, seed, 0) , F, FS, { sx: 18, sy: 4, lw: 5 });
  s += chT('M-40 -192 Q-34 -236 -6 -222 Q4 -262 34 -232 Q64 -248 64 -196 Q14 -214 -40 -192Z', F, FS, { sx: 5, sy: 5, lw: 4.5 });
  // mặt nạ kem: 2 thuỳ ôm mắt, lõm giữa trán (lông chữ V), thắt nhẹ ở má, mõm tròn tới cằm
  const mask = 'M18 -66 Q-4 -98 -46 -88 Q-98 -72 -100 -16 Q-100 22 -84 44 Q-96 80 -70 112 Q-34 148 20 148 Q78 148 112 112 Q136 80 122 44 Q140 20 138 -18 Q134 -76 82 -90 Q42 -98 18 -66Z';
  s += chT(mask, M, MS, { sx: 14, sy: 2, lw: 5 });
  s += chL('M-60 50 Q20 30 100 50', 2.6, MS, 0.9);   // gờ mõm
  // (bỏ bờm lông dưới cằm — người dùng 23:43)
  // mắt + lông mày (bộ mặt nam của pack, mắt vàng)
  s += chEyeM(-30, 6, 30, 34, c, eyeEx, true, look) + chEyeM(68, 6, 30, 34, c, EO.wink ? 'happy' : eyeEx, false, look);
  const bY = -30 + (EO.bY || 0);
  front += chBrow(70, bY + ((EO.bNear ?? ba) < -8 ? -6 : 0), 34, -(EO.bNear ?? ba) * 1.2, c.brow, 14) + chBrow(-32, bY, 34, (EO.bFar ?? ba) * 1.2, c.brow, 14, true);
  // mũi khỉ 2 lỗ + miệng
  s += `<ellipse cx="12" cy="66" rx="4.5" ry="6.5" fill="#5A3420"/><ellipse cx="30" cy="66" rx="4.5" ry="6.5" fill="#5A3420"/>`;
  if (E[2] === 'mgrin') {   // nhếch mép một bên, lộ chút răng, có lúm ở khoé
    s += `<path d="M-6 100 Q22 112 54 94 L60 84 Q30 102 -6 100Z" fill="#fff" stroke="${CH_INK}" stroke-width="3.5" stroke-linejoin="round"/>` + chL('M-10 98 Q24 116 56 92 Q62 86 64 78', 4) + chL('M62 92 q6 4 10 0', 2.6);
  } else if (E[2] === 'mgrin2') {   // cười toe lộ răng, lệch lên bên phải
    s += `<path d="M-16 92 Q22 104 62 84 Q58 122 24 128 Q-6 128 -16 92Z" fill="#6E2228" stroke="${CH_INK}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<path d="M-13 94 Q22 105 59 87 L57 97 Q22 113 -10 103Z" fill="#fff"/>` + `<path d="M4 118 Q22 108 42 116 Q24 128 4 118Z" fill="#EE8E8E"/>` + chL('M60 86 q8 2 10 -4', 2.6);
  } else s += `<g transform="translate(21 106) scale(1.2) translate(-21 -106)">${chMZ(E[2], 21, 106)}</g>`;
  if (ex === 'awkward' || ex === 'shock') s += `<ellipse cx="94" cy="58" rx="18" ry="8" fill="${CH_BLUSH}" opacity="0.45"/><ellipse cx="-56" cy="58" rx="16" ry="8" fill="${CH_BLUSH}" opacity="0.35"/>`;
  // mũ theo dáng
  const hg = o.headgear ?? (c.look === 'tt' ? 'crown' : c.look === 'hg' ? 'kimco' : '');
  if (hg === 'crown') {   // mũ vàng nhỏ + 2 sợi lông trĩ dài cong ra sau
    const sw = Math.sin(T * 2.2 + seed) * 10;
    for (const [x0, cx1, ex1, ey1] of [[-6, -120, -230 + sw, -330], [40, 40, -80 + sw * 0.7, -380]]) {
      const d = `M${x0} -214 Q${cx1} -330 ${f1(ex1)} ${ey1}`;
      back += chL(d, 10) + chL(d, 5.5, '#8A3A22');
    }
    front += chT('M-50 -186 Q-46 -246 18 -252 Q82 -246 86 -186 Q18 -206 -50 -186Z', '#E0B048', '#B08428', { sx: 6, sy: 6, lw: 4.5 })
      + chL('M-44 -200 Q18 -220 80 -200', 3, '#B08428') + `<circle cx="18" cy="-228" r="12" fill="#C0392B" stroke="${CH_INK}" stroke-width="3.5"/>`;
  } else if (hg === 'kimco') {   // vòng kim cô ôm trán
    front += chT('M-122 -96 Q18 -150 156 -96 L154 -72 Q18 -124 -120 -70Z', '#E0B048', '#B08428', { sx: 0, sy: -4, lw: 4 }) + `<circle cx="-118" cy="-84" r="11" fill="#E0B048" stroke="${CH_INK}" stroke-width="3.5"/>`;
  }
  if (E[3] === 'sweat') { const u = (T * 1.2 + seed) % 1; front += `<path d="M164 ${-60 + u * 30} q18 28 0 42 q-18 -14 0 -42Z" fill="#CDEBFF" stroke="${CH_INK}" stroke-width="3"/>`; }
  if (E[3] === 'vein') front += `<g transform="translate(130 -132) rotate(10)" fill="none" stroke="#D03A2E" stroke-width="5" stroke-linecap="round"><path d="M-16 -4 Q-6 -6 -4 -16"/><path d="M4 -16 Q6 -6 16 -4"/><path d="M16 4 Q6 6 4 16"/><path d="M-4 16 Q-6 6 -16 4"/></g>`;
  if (E[3] === 'tear') { const u = (T * 0.9 + seed) % 1; front += `<path d="M100 ${36 + u * 40} q10 16 0 24 q-10 -8 0 -24Z M-60 ${36 + u * 36} q9 14 0 22 q-9 -8 0 -22Z" fill="#BFE6FF" stroke="${CH_INK}" stroke-width="2.5"/>`; }
  if (E[3] === 'gloom') front += chL('M180 -160 l22 -22 M194 -128 l28 -6 M164 -186 l6 -28', 4.5);
  if (ex === 'fierce') front += chL('M180 -150 l16 -12 M188 -128 l18 -4 M178 -170 l8 -16', 4.5, '#C0392B');
  return [back, s + front];
}
const _tnkHead0 = chHead;
chHead = function (c, ex, T, o) { return c && c.monkey ? tnkHead(c, ex, T, o) : _tnkHead0(c, ex, T, o); };

// ---------- THÂN theo dáng ----------
const TNK_BD = 'M-124 0 Q-136 -112 -108 -186 Q-74 -228 0 -236 Q74 -228 110 -186 Q138 -112 124 0 Q0 30 -124 0Z';
const _tnkBody0 = chBody;
chBody = function (c, T, o = {}) {
  if (!c || !c.monkey) return _tnkBody0(c, T, o);
  const G = '#E0B048', GS = '#B08428';
  let s = '';
  if (c.look === 'da') {   // toàn thân lông, mép dưới xù, ngực lông sáng
    s += chT('M-124 0 Q-136 -112 -108 -186 Q-74 -228 0 -236 Q74 -228 110 -186 Q138 -112 124 0 L110 14 L96 2 L80 18 L62 4 L44 20 L24 6 L4 22 L-16 6 L-36 20 L-56 4 L-74 18 L-92 2 L-108 16Z', c.robe, c.robeS, { sx: 22, sy: 0, lw: 5 });
    s += chT('M-44 -170 Q-62 -110 -40 -54 Q0 -38 40 -54 Q62 -110 44 -170 Q0 -190 -44 -170Z', TNK.mask, TNK.maskS, { sx: 8, sy: 0, lw: 3.5 });
    s += chL('M-100 -60 l-10 14 M-96 -120 l-12 10 M100 -70 l12 12 M104 -130 l10 10', 3, c.robeS, 0.9);
    return s;
  }
  let hd = 'M-122 -14'; for (let i = 0; i < 12; i++) { const xa = -122 + i * 20.4, xb = xa + 20.4, dy = 22 + 6 * Math.sin(i * 1.9); hd += ` Q${f1(xa + 4)} ${f1(dy * 0.6)} ${f1(xa + 10)} ${f1(dy)} Q${f1(xb - 2)} ${f1(dy * 0.5)} ${f1(xb)} 4`; }
  const hem = chT(hd + ' L122 -14Z', c.hair, c.hairS, { sx: 6, sy: 0, lw: 4 });   // lông ló dưới gấu áo   // lông ló dưới gấu áo
  if (c.look === 'tt') {
    const sw = Math.sin(T * 2.2) * 5;
    // áo choàng đỏ sau lưng, xoè ra hai bên
    s += chT(`M-96 -214 Q-176 -110 ${-182 + sw} 18 Q0 46 ${182 - sw} 18 Q176 -110 96 -214Z`, '#A82E24', '#7E2018', { sx: 14, sy: 0, lw: 4.5 });
    s += chT(TNK_BD, c.robe, c.robeS, { sx: 24, sy: 0, lw: 5 });
    // vạt dưới vảy vàng hai bên + giữa đỏ
    s += tnkScales('M-122 -40 L-30 -40 L-26 6 Q-80 12 -124 0Z', -124, -40, 100, 50, 13);
    s += tnkScales('M30 -40 L122 -40 L124 0 Q80 12 26 6Z', 26, -40, 100, 50, 13);
    // giáp vai vảy vàng
    s += tnkScales('M-112 -150 Q-138 -170 -118 -204 Q-80 -236 -40 -222 Q-60 -186 -112 -150Z', -140, -240, 110, 100, 12);
    s += tnkScales('M112 -150 Q138 -170 118 -204 Q80 -236 40 -222 Q60 -186 112 -150Z', 30, -240, 120, 100, 12);
    // cổ khăn đỏ sẫm + huy hiệu vuông vàng giữa ngực
    s += chT('M-56 -236 Q0 -206 56 -236 L50 -214 Q0 -188 -50 -214Z', '#8E2018', '#6A160F', { lw: 4 });
    s += chT('M-34 -168 h68 v62 h-68Z', G, GS, { sx: 4, sy: 4, lw: 4.5 }) + `<rect x="-20" y="-154" width="40" height="34" fill="none" stroke="#8E2018" stroke-width="5"/><rect x="-6" y="-142" width="12" height="10" fill="#8E2018"/>`;
    // đai xanh + khoá vàng
    s += chT('M-132 -80 Q0 -60 132 -80 L133 -44 Q0 -24 -133 -44Z', c.sash, mixC(c.sash, '#000000', 0.3), { sx: 0, sy: -5, lw: 4 }) + chT('M-18 -76 h36 v32 h-36Z', G, GS, { lw: 3.5 });
    return s;
  }
  // 'hg' — áo vàng, khăn đỏ thắt cổ, đai xanh, váy da hổ
  s += chT(TNK_BD, c.robe, c.robeS, { sx: 24, sy: 0, lw: 5 });
  s += chT('M-124 -44 L124 -44 L124 0 Q0 30 -124 0Z', '#E8963A', '#C27424', { sx: 10, sy: 0, lw: 4.5 });
  for (const x of [-100, -64, -26, 12, 50, 88]) s += `<path d="M${x} -40 Q${x + 12} -22 ${x + 4} -6 Q${x + 18} -22 ${x + 12} -40Z" fill="#2A1A14"/>`;
  s += chT('M-132 -82 Q0 -62 132 -82 L133 -46 Q0 -26 -133 -46Z', c.sash, mixC(c.sash, '#000000', 0.3), { sx: 0, sy: -5, lw: 4 });
  const sw = Math.sin(T * 2.4) * 4;
  s += chT('M-70 -236 Q0 -196 70 -236 L76 -206 Q0 -160 -76 -206Z', '#C0392B', '#93281E', { sx: 4, sy: 0, lw: 4 });
  s += chT(`M-6 -196 Q-36 -150 ${-44 + sw} -112 L${-22 + sw} -110 Q-14 -150 4 -186Z M10 -196 Q34 -150 ${46 - sw} -116 L${24 - sw} -112 Q16 -150 0 -186Z`, '#C0392B', '#93281E', { sx: 3, sy: 0, lw: 3.5 });
  s += `<ellipse cx="2" cy="-198" rx="18" ry="14" fill="#C0392B" stroke="${CH_INK}" stroke-width="3.5"/>`;
  return s;
};
// đuôi khỉ
const _tnkTail0 = chTail;
chTail = function (c, T, seed = 0, lag = 0) {
  if (!c.monkey) return _tnkTail0(c, T, seed, lag);
  const a = Math.sin(T * 1.8 + seed) * 8 + lag * 10;
  const tip = chT(tnkTufts(-150, -252, 22, 18, 9, 0.6, 5, T), c.hair, c.hairS, { sx: 3, sy: 3, lw: 4 });
  return `<g transform="rotate(${f1(a)} -90 -50)">` + chT('M-90 -60 Q-180 -40 -220 -120 Q-250 -200 -206 -250 Q-170 -284 -140 -256 Q-128 -240 -144 -232 Q-170 -250 -190 -224 Q-218 -186 -196 -132 Q-164 -72 -92 -36Z', c.hair, c.hairS, { sx: -6, sy: 6, lw: 4.5 }) + '</g>';
};
// gậy Như Ý: thân sắt đen, hai đầu bịt vàng
let TNK_STAFF_ROT = -20;
const _tnkHand0 = chHand;
chHand = function (kind, c) {
  const cuff = c && c.monkey ? chT(tnkTufts(0, -2, 32, 14, 10, 0.55, 1, 0), c.hair, c.hairS, { sx: 3, sy: 0, lw: 3.5 }) : '';
  if (kind !== 'gstaff') return c && c.monkey && kind !== 'none' ? _tnkHand0(kind, c) : _tnkHand0(kind, c);
  const L = 240, G = '#E0B048', GS = '#B08428';
  return `<g transform="rotate(${TNK_STAFF_ROT})">` + chT(`M${-L} -11 L${L} -11 L${L} 11 L${-L} 11Z`, '#3A3438', '#221E22', { sx: 0, sy: 5, lw: 4 })
    + chT(`M${-L - 6} -15 L${-L + 54} -15 L${-L + 54} 15 L${-L - 6} 15Z`, G, GS, { lw: 4 }) + chT(`M${L - 54} -15 L${L + 6} -15 L${L + 6} 15 L${L - 54} 15Z`, G, GS, { lw: 4 })
    + chL(`M${-L + 20} -15 V15 M${L - 20} -15 V15`, 2.5, GS) + `</g>` + _tnkHand0('fist', c);
};

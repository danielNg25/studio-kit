// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT TÂY DU KÝ — PHẦN 1 (2026-10-13, CHỜ DUYỆT). Nạp SAU chars.js + chars_tnk.js.
// Cùng kiểu webtoon-code-v1: tô phẳng 2 tông + viền mực, mặt/tóc không chi tiết hơn áo. Không giống phim 1986 / hoạt hình nào.
// Mở rộng bằng cách bọc chHead / chBody / chHand: thuộc tính mới trong CHAR (mian, phoenix, twinBuns, horns, whiskers, thirdEye,
// bigEyes, bigEars, buddha, veil, halo, helmet, toDia, offHat, plate, longBrow, lotus, noseRing, monkeyBeard, armor, sashLoop, bagua, cape).
const TDK_G = '#E0B048', TDK_GS = '#B08428';
let TDK_ROT = 0;   // xoay đồ cầm tay (độ) — đặt trước khi gọi chChar

function tdkHeadX(c, ex, T, o = {}) {
  const seed = o.seed || 0, sw = Math.sin(T * 2.2 + seed);
  let b = '', f = '';
  const hy = c.hatY || 0;   // dời mũ theo đầu (khỉ: +30)
  if (c.halo) b = `<circle cx="14" cy="-40" r="${c.halo === 2 ? 250 : 215}" fill="${c.haloC || '#FFE7A0'}" opacity="0.55" stroke="#E8B848" stroke-width="6"/>` + `<circle cx="14" cy="-40" r="${c.halo === 2 ? 220 : 188}" fill="none" stroke="#FFF6D6" stroke-width="4" opacity="0.8"/>` + b;
  if (c.veil) {   // khăn choàng trắng của Quan Âm: phủ sau vai + vành ôm đầu
    b += chT(`M-150 -150 Q-210 60 ${-196 + sw * 6} 330 L${-120 + sw * 6} 330 Q-150 80 -110 -40Z M178 -150 Q238 60 ${224 + sw * 6} 330 L${148 + sw * 6} 330 Q178 80 138 -40Z`, '#FBFBF6', '#DADAD0', { sx: 6, sy: 0, lw: 4 });
    f += chT('M-128 20 Q-160 -210 14 -250 Q188 -210 156 20 Q150 -60 128 -120 Q14 -176 -100 -120 Q-122 -60 -128 20Z', '#FBFBF6', '#DADAD0', { sx: 10, sy: 6, lw: 4.5 });
    f += chT('M-30 -224 Q14 -266 58 -224 Q14 -210 -30 -224Z', TDK_G, TDK_GS, { lw: 3.5 }) + `<circle cx="14" cy="-232" r="8" fill="#5AB08A" stroke="${CH_INK}" stroke-width="2.5"/>`;
  }
  if (c.buddha) {   // tóc xoắn ốc + nhục kế; dái tai dài
    f += `<ellipse cx="16" cy="-128" rx="62" ry="34" fill="${c.skin}"/>`;   // che chấm giới (đầu trọc của sư) — Phật không có
    f += chT('M-112 -60 Q-124 -214 14 -230 Q152 -214 140 -60 Q132 -130 96 -150 Q14 -172 -68 -150 Q-104 -130 -112 -60Z', '#34406E', '#232C52', { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-44 -222 a58 50 0 1 1 116 0Z', '#34406E', '#232C52', { sx: 6, sy: 6, lw: 4.5 });
    for (let i = 0; i < 26; i++) { const a = Math.PI * (1.05 + 0.9 * (i % 13) / 12), r = i < 13 ? 150 : 110, x = 14 + Math.cos(a) * r * 0.92, y = -80 + Math.sin(a) * r * (i < 13 ? 0.95 : 1.05); if (y < -120 || i < 13) f += `<circle cx="${f1(x)}" cy="${f1(y)}" r="7" fill="#4A5890" stroke="#1A2244" stroke-width="2"/>`; }
    f += `<circle cx="14" cy="-28" r="6" fill="#F6EAD0" stroke="${CH_INK}" stroke-width="2"/>`;
    b += chT('M-108 -10 Q-150 -16 -150 30 L-146 120 Q-140 150 -118 150 Q-102 140 -104 110 L-100 40Z', c.skin, c.skinS, { sx: 6, sy: 0, lw: 4 });
  }
  if (c.mian) {   // mũ miện Ngọc Hoàng: mũ vàng + tấm bản đen phẳng + rèm hạt ngọc phía trước
    f += chT('M-104 -150 Q-100 -246 14 -252 Q128 -246 132 -150 Q14 -184 -104 -150Z', TDK_G, TDK_GS, { sx: 8, sy: 6, lw: 4.5 }) + chL('M-96 -170 Q14 -200 126 -170', 3, TDK_GS);
    f += chT('M-170 -272 L190 -272 L204 -248 L-156 -248Z', '#2A2630', '#16141C', { sx: 0, sy: 4, lw: 4 }) + chL('M-166 -268 L192 -268', 3, TDK_G);
    for (let i = 0; i < 9; i++) { const x = -150 + i * 41, sx = Math.sin(T * 2 + i) * 2; let s2 = chL(`M${x} -248 L${f1(x + sx)} -176`, 2, '#3A3440');
      for (let k = 0; k < 4; k++) s2 += `<circle cx="${f1(x + sx * k / 3)}" cy="${-236 + k * 18}" r="5.5" fill="${k % 2 ? '#C0392B' : '#5AB08A'}" stroke="${CH_INK}" stroke-width="1.6"/>`; f += s2; }
  }
  if (c.phoenix) {   // mũ phượng Tây Vương Mẫu
    f += chT('M-96 -196 Q14 -232 126 -196 L130 -172 Q14 -206 -100 -172Z', TDK_G, TDK_GS, { lw: 4 });
    f += chT('M14 -214 Q-30 -268 -96 -282 Q-50 -250 -40 -232 Q-90 -246 -120 -232 Q-60 -220 -20 -206Z M14 -214 Q58 -268 124 -282 Q78 -250 68 -232 Q118 -246 148 -232 Q88 -220 48 -206Z', TDK_G, TDK_GS, { sx: 3, sy: 4, lw: 3.5 });
    f += `<circle cx="14" cy="-226" r="13" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/>`;
    for (const x of [-98, 128]) { let s2 = chL(`M${x} -186 L${f1(x + sw * 4)} -110`, 2.2, TDK_GS); for (let k = 0; k < 3; k++) s2 += `<circle cx="${f1(x + sw * 4 * (k + 1) / 3)}" cy="${-160 + k * 22}" r="5" fill="${TDK_G}" stroke="${CH_INK}" stroke-width="1.6"/>`; f += s2; }
  }
  if (c.twinBuns) {   // 2 búi tóc (Na Tra, tiên nữ)
    for (const [x, y] of [[-74, -224], [104, -224]]) {
      f += chT(`M${x - 40} ${y} a40 36 0 1 1 80 0 a40 36 0 1 1 -80 0Z`, c.hair, c.hairS, { sx: 8, sy: 6, lw: 4 });
      if (c.bunRibbon) { f += chT(`M${x - 40} ${y + 14} Q${x} ${y + 28} ${x + 40} ${y + 14} L${x + 38} ${y + 26} Q${x} ${y + 40} ${x - 38} ${y + 26}Z`, c.bunRibbon, mixC(c.bunRibbon, '#000000', 0.25), { lw: 3 });
        b += chT(`M${x - 30} ${y + 24} Q${x - 70 + sw * 8} ${y + 70} ${x - 90 + sw * 12} ${y + 140} L${x - 74 + sw * 12} ${y + 144} Q${x - 56 + sw * 8} ${y + 76} ${x - 14} ${y + 30}Z`, c.bunRibbon, mixC(c.bunRibbon, '#000000', 0.25), { sx: 3, sy: 0, lw: 3 }); }
      if (c.bunFlower) f += [0, 72, 144, 216, 288].map(a => { const px = x + 20 + Math.cos(a * Math.PI / 180) * 10, py = y - 22 + Math.sin(a * Math.PI / 180) * 10; return `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="9" ry="6" transform="rotate(${a} ${f1(px)} ${f1(py)})" fill="${c.bunFlower}" stroke="${CH_INK}" stroke-width="1.8"/>`; }).join('') + `<circle cx="${x + 20}" cy="${y - 22}" r="5" fill="#F4D06A" stroke="${CH_INK}" stroke-width="1.6"/>`;
    }
  }
  if (c.helmet) {   // mũ trụ võ tướng: vòm + vành + tua đỏ trên đỉnh + 2 tấm che tai
    const H = c.helmet, HS = mixC(H, '#000000', 0.25);
    b += chT(`M10 ${-262 + hy} Q${-60 + sw * 10} ${-300 + hy} ${-110 + sw * 14} ${-250 + hy} Q${-50 + sw * 8} ${-270 + hy} 6 ${-246 + hy}Z`, '#C0392B', '#8E2418', { sx: 3, sy: 3, lw: 3.5 });
    f += chT(`M-132 ${-40 + hy} Q-150 ${-250 + hy} 14 ${-266 + hy} Q178 ${-250 + hy} 160 ${-40 + hy} L132 ${-48 + hy} Q140 ${-150 + hy} 112 ${-150 + hy} Q14 ${-170 + hy} -84 ${-150 + hy} Q-110 ${-150 + hy} -104 ${-48 + hy}Z`, H, HS, { sx: 10, sy: 6, lw: 4.5 });
    f += chT(`M-108 ${-150 + hy} Q14 ${-186 + hy} 136 ${-150 + hy} L136 ${-128 + hy} Q14 ${-164 + hy} -108 ${-128 + hy}Z`, mixC(H, '#ffffff', 0.25), HS, { lw: 3.5 });
    f += chT(`M-4 ${-262 + hy} L14 ${-300 + hy} L32 ${-262 + hy}Z`, TDK_G, TDK_GS, { lw: 3 }) + `<circle cx="14" cy="${-306 + hy}" r="14" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/>`;
    if (c.helmetGem) f += `<circle cx="14" cy="${-176 + hy}" r="11" fill="${c.helmetGem}" stroke="${CH_INK}" stroke-width="3"/>`;
  }
  if (c.lotus) {   // mão hoa sen vàng trên búi (đạo sĩ)
    f += chT('M-26 -244 Q-20 -276 0 -268 Q14 -296 28 -268 Q48 -276 54 -244 Q14 -232 -26 -244Z', TDK_G, TDK_GS, { sx: 3, sy: 3, lw: 3.5 }) + chL('M0 -268 L4 -248 M28 -268 L24 -248', 2, TDK_GS);
  }
  if (c.toDia) {   // mũ mềm thổ địa
    f += chT('M-106 -156 Q-100 -262 14 -268 Q128 -262 134 -156 Q14 -190 -106 -156Z', '#7A4A2A', '#5A3420', { sx: 8, sy: 6, lw: 4.5 }) + chT('M-116 -160 Q14 -196 144 -160 L146 -140 Q14 -174 -118 -140Z', '#A86A3A', '#7A4A2A', { lw: 3.5 }) + `<circle cx="14" cy="-270" r="14" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/>`;
  }
  if (c.offHat) {   // mũ quan nhỏ (thuộc hạ, Bật Mã Ôn): chóp đen + 2 cánh ngắn
    const W = c.offHat === 2 ? 70 : 54, y0 = hy;
    b += chT(`M-104 ${-182 + y0} L${-104 - W} ${-188 + y0} Q${-114 - W} ${-180 + y0} ${-104 - W} ${-172 + y0} L-104 ${-164 + y0}Z M132 ${-182 + y0} L${132 + W} ${-188 + y0} Q${142 + W} ${-180 + y0} ${132 + W} ${-172 + y0} L132 ${-164 + y0}Z`, '#1E1C24', '#0E0C12', { sx: 0, sy: 3, lw: 3.5 });
    f += chT(`M-44 ${-226 + y0} Q-40 ${-276 + y0} 14 ${-280 + y0} Q68 ${-276 + y0} 72 ${-226 + y0}Z`, '#1E1C24', '#0E0C12', { sx: 5, sy: 4, lw: 4 }) + chT(`M-104 ${-150 + y0} Q-96 ${-232 + y0} 14 ${-238 + y0} Q124 ${-232 + y0} 132 ${-150 + y0} Q14 ${-178 + y0} -104 ${-150 + y0}Z`, '#1E1C24', '#0E0C12', { sx: 8, sy: 6, lw: 4 });
  }
  if (c.plate) f += chT('M-12 -196 h52 v34 h-52Z', TDK_G, TDK_GS, { lw: 3 }) + `<text x="14" y="-170" font-size="26" font-weight="900" text-anchor="middle" font-family="serif" fill="${CH_INK}">王</text>`;
  if (c.horns) {
    const HC = c.hornC || '#EFE6CC', HCS = mixC(HC, '#000000', 0.18);
    if (c.horns === 'ox') b += chT('M-96 -150 Q-170 -150 -214 -214 Q-232 -256 -206 -282 Q-210 -230 -170 -206 Q-130 -186 -86 -186Z M124 -150 Q198 -150 242 -214 Q260 -256 234 -282 Q238 -230 198 -206 Q158 -186 114 -186Z', HC, HCS, { sx: 6, sy: 4, lw: 4.5 });
    if (c.horns === 'one') f += chT('M-6 -226 Q4 -300 26 -332 Q30 -290 38 -226Z', HC, HCS, { sx: 4, sy: 0, lw: 4 });
    if (c.horns === 'imp') f += chT('M-70 -210 Q-96 -262 -84 -292 Q-60 -258 -40 -222Z M98 -210 Q124 -262 112 -292 Q88 -258 68 -222Z', HC, HCS, { sx: 3, sy: 0, lw: 4 });
    if (c.horns === 'dragon') { const d = (s) => `M${s * 46 + 14} -214 Q${s * 70 + 14} -262 ${s * 92 + 14} -300 M${s * 64 + 14} -246 Q${s * 98 + 14} -256 ${s * 118 + 14} -282 M${s * 80 + 14} -272 Q${s * 60 + 14} -294 ${s * 66 + 14} -320`;
      for (const s of [-1, 1]) { f += chL(d(s), 15, CH_INK) + chL(d(s), 9, HC); } }
    if (c.horns === 'small') for (const s of [-1, 1]) f += chT(`M${14 + s * 60} -214 Q${14 + s * 78} -250 ${14 + s * 70} -272 Q${14 + s * 54} -248 ${14 + s * 40} -220Z`, HC, HCS, { lw: 3 });
  }
  if (c.whiskers) {   // râu rồng: 2 sợi dài đung đưa
    for (const [x0, x1, x2] of [[-6, -90, -150], [36, 120, 180]]) { const d = `M${x0} 80 Q${x1} ${70 + sw * 8} ${f1(x2 + sw * 10)} ${f1(150 + sw * 12)}`; f += chL(d, 9) + chL(d, 5, c.beard || '#5A8A7A'); }
  }
  if (c.noseRing) f += `<circle cx="22" cy="74" r="13" fill="none" stroke="${CH_INK}" stroke-width="8"/><circle cx="22" cy="74" r="13" fill="none" stroke="${TDK_G}" stroke-width="4.5"/>`;
  if (c.fangs) f += `<path d="M-6 102 L-2 82 L6 102Z M32 100 L36 80 L44 100Z" fill="#FFFDF2" stroke="${CH_INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (c.redEyes) for (const [x, y] of [[-36, 20], [66, 20]]) f += `<g opacity="0.85">${bloom(`<circle cx="${x}" cy="${y}" r="9" fill="#FF3A2A"/>`, '#FF2A1A', 0.8)}</g><circle cx="${x}" cy="${y}" r="5" fill="#FFD0C0"/>`;
  if (c.buddhaStache) f += chL('M-16 82 Q2 70 18 80 Q34 70 52 82', 4, c.brow) + chL('M-16 82 q-8 2 -10 10 M52 82 q8 2 10 10', 3, c.brow) + `<path d="M10 124 Q18 140 26 124Z" fill="${c.brow}" stroke="${CH_INK}" stroke-width="2"/>`;
  if (c.mature) f += chL('M-20 60 Q-34 84 -22 104 M54 58 Q70 82 58 104', 2.6, c.skinS, 0.95) + chL('M-56 46 q14 8 30 4 M50 46 q16 6 30 -2', 2.2, c.skinS, 0.9) + chL('M-10 136 Q20 146 50 136', 2.6, c.skinS, 0.9);
  if (c.bushyBrow) for (const [x, s2] of [[-40, 1], [66, -1]]) f += `<path d="M${x - 44} -24 L${x - 30} -40 L${x - 14} -30 L${x} -46 L${x + 14} -32 L${x + 30} -44 L${x + 44} -20 Q${x} -6 ${x - 44} -24Z" fill="${c.brow}" stroke="${CH_INK}" stroke-width="2.6" transform="rotate(${s2 * -14} ${x} -24)"/>`;
  if (c.thirdEye) f += `<g transform="translate(14 -82)"><path d="M0 -24 Q14 0 0 24 Q-14 0 0 -24Z" fill="#fff" stroke="${CH_INK}" stroke-width="3.5"/><ellipse cx="0" cy="0" rx="5" ry="9" fill="#C0392B"/></g>`;
  if (c.bigEyes) for (const x of [-38, 64]) { const r = 36; f += `<circle cx="${x}" cy="16" r="${r}" fill="#fff" stroke="${CH_INK}" stroke-width="5"/><circle cx="${x + 4}" cy="18" r="${r * 0.42}" fill="#2A1E16"/><circle cx="${x - 3}" cy="10" r="5" fill="#fff"/>`; }
  if (c.bigEars) b += chT('M-110 -40 Q-260 -150 -300 -40 Q-290 90 -110 70Z', c.skin, c.skinS, { sx: 10, sy: 0, lw: 5 }) + chL('M-130 -20 Q-240 -90 -262 -30 Q-250 40 -140 46', 3.5, '#C98F78') + chT('M150 -40 Q300 -150 340 -40 Q330 90 150 70Z', c.skin, c.skinS, { sx: -10, sy: 0, lw: 5 });
  if (c.longBrow) for (const [x, s] of [[-40, -1], [66, 1]]) { const d = `M${x} -22 Q${x + s * 46} -10 ${x + s * 70} ${f1(40 + sw * 4)}`; f += chL(d, 11) + chL(d, 7, c.brow); }
  if (c.monkeyBeard) f += chT('M-30 128 Q20 150 72 128 Q66 176 20 196 Q-26 176 -30 128Z', '#F2EEE6', '#CFC8BA', { sx: 0, sy: -3, lw: 4 });
  return [b, f];
}

// ---------- đầu rồng (Long Vương phương án B: mặt rồng) — nhìn 3/4 sang phải, mõm dài ----------
function tdkDragonHead(c, ex, T, o = {}) {
  const E = CH_EXPR[ex] || CH_EXPR.neutral, sw = Math.sin(T * 2.2 + (o.seed || 0)), SK = c.skin, SS = c.skinS, B = c.beard, BS = c.beardS;
  let back = '', s = '', front = '';
  // bờm sau gáy
  back += chT(`M-90 -150 Q-200 -120 ${-230 + sw * 8} 0 Q${-200 + sw * 8} 40 ${-240 + sw * 10} 120 Q-160 110 -120 60 Q-150 150 ${-110 + sw * 6} 200 Q-60 120 -40 60Z`, B, BS, { sx: 8, sy: 0, lw: 4.5 });
  // sừng hươu
  for (const [x0, k] of [[-40, 1], [40, 0.85]]) { const d = `M${x0} -170 Q${x0 - 40 * k} -250 ${x0 - 70 * k} -320 M${x0 - 22 * k} -226 Q${x0 + 10 * k} -262 ${x0 + 6 * k} -300 M${x0 - 50 * k} -276 Q${x0 - 92 * k} -282 ${x0 - 112 * k} -300`; back += chL(d, 15) + chL(d, 9, c.hornC || '#E8D8A8'); }
  // cổ
  s += chT('M-50 60 L-40 150 L50 150 L56 60Z', SK, SS, { sx: -14, sy: 0, lw: 4 });
  // đầu + mõm dài
  const jaw = ex === 'yell' || ex === 'shock' ? 34 : 0;
  s += chT(`M-120 -40 Q-130 -190 0 -196 Q110 -196 140 -110 Q200 -90 236 -40 Q252 -6 236 20 Q200 40 150 44 L${150} ${60 + jaw} Q90 ${110 + jaw} 0 ${110 + jaw * 0.6} Q-100 100 -120 -40Z`, SK, SS, { sx: 18, sy: 4, lw: 5.5 });
  if (jaw) s += `<path d="M150 44 Q100 50 40 52 L60 ${80 + jaw * 0.6} Q110 ${74 + jaw} 150 ${60 + jaw}Z" fill="#6E2228" stroke="${CH_INK}" stroke-width="3"/>`;
  s += chL('M150 44 Q90 54 30 50', 3.5);   // khoé miệng dài
  s += `<path d="M150 44 l-8 12 l-6 -12 M120 48 l-6 11 l-6 -11" fill="#fff" stroke="${CH_INK}" stroke-width="2"/>`;   // răng nanh
  // vảy mờ trên trán + gờ mũi
  for (const [x, y] of [[-40, -120], [-6, -140], [30, -128], [-70, -80], [60, -150]]) s += chL(`M${x - 12} ${y} q12 10 24 0`, 2.6, SS, 0.9);
  s += `<ellipse cx="226" cy="-22" rx="8" ry="5" fill="#2A1A14"/><ellipse cx="198" cy="-34" rx="7" ry="4" fill="#2A1A14"/>`;
  // mắt (bộ mắt nam của pack, to hơn, tròng vàng) + gờ mày rậm
  const eyeEx = E[0];
  s += chEyeM(0, -60, 32, 34, Object.assign({}, c, { iris: ['#8A5A10', '#E8B830'] }), eyeEx, true) + chEyeM(96, -66, 30, 32, Object.assign({}, c, { iris: ['#8A5A10', '#E8B830'] }), eyeEx, false);
  front += chBrow(98, -102 + (E[1] < -8 ? -6 : 0), 40, -E[1] * 1.2, B, 18) + chBrow(-4, -98, 40, E[1] * 1.2, B, 18, true);
  // râu cằm + 2 sợi râu rồng từ mõm
  front += chT(`M10 ${100 + jaw * 0.6} Q60 ${120 + jaw} 110 ${80 + jaw} Q120 ${150 + jaw} ${70 + sw * 6} ${230 + jaw} Q50 ${180 + jaw} 20 ${200 + jaw} Q20 ${150 + jaw} 10 ${100 + jaw * 0.6}Z`, B, BS, { sx: -6, sy: 0, lw: 4 });
  for (const [x0, y0, x1, y1] of [[214, -10, 330, 60], [180, -30, 300, -100]]) { const d = `M${x0} ${y0} Q${x0 + 60} ${y0 + 10 + sw * 10} ${f1(x1 + sw * 10)} ${f1(y1 + sw * 12)}`; front += chL(d, 9) + chL(d, 5, B); }
  if (c.crownDragon) front += chT('M-40 -186 Q-36 -236 20 -240 Q76 -236 80 -186 Q20 -204 -40 -186Z', TDK_G, TDK_GS, { sx: 5, sy: 5, lw: 4 }) + `<circle cx="20" cy="-216" r="10" fill="#3A8AC0" stroke="${CH_INK}" stroke-width="3"/>`;
  if (E[3] === 'sweat' || o.sweat) { const u = (T * 1.1 + (o.seed || 0)) % 1;   // mồ hôi lăn trên má/thái dương, không nằm trên đỉnh đầu (người dùng 2026-10-13)
    front += `<path d="M150 ${f1(-70 + u * 70)} q18 28 0 42 q-18 -14 0 -42Z" fill="#CDEBFF" stroke="${CH_INK}" stroke-width="3" opacity="${f1(1 - u * 0.5)}"/><path d="M-96 ${f1(-40 + ((u + 0.5) % 1) * 60)} q14 22 0 32 q-14 -10 0 -32Z" fill="#CDEBFF" stroke="${CH_INK}" stroke-width="3" opacity="${f1(1 - ((u + 0.5) % 1) * 0.5)}"/>`; }
  return [back, s + front];
}
const _tdkHead0 = chHead;
chHead = function (c, ex, T, o = {}) {
  if (c && c.dragonFace) return tdkDragonHead(c, ex, T, o);
  const [hb, hf] = _tdkHead0(c, ex, T, o);
  if (!c) return [hb, hf];
  const [xb, xf] = tdkHeadX(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- thân: giáp, khăn vòng (Na Tra), áo choàng, bát quái ----------
const _tdkBody0 = chBody;
chBody = function (c, T, o = {}) {
  if (c && c.monkey && (c.look === 'hoc' || c.look === 'bmo')) return _tnkBody0(c, T, o) + (c.look === 'bmo' ? chT('M-34 -150 h68 v52 h-68Z', '#E8D8A8', '#C8B884', { lw: 3.5 }) + chL('M-20 -136 h40 M-20 -122 h40 M-20 -108 h40', 2.5, '#8A7A4A') : '');
  let pre = '', post = '';
  const sw = Math.sin(T * 2.2);
  if (c.cape) pre += chT(`M-100 -212 Q-176 -110 ${-184 + sw * 5} 18 Q0 46 ${184 - sw * 5} 18 Q176 -110 100 -212Z`, c.cape, mixC(c.cape, '#000000', 0.25), { sx: 14, sy: 0, lw: 4.5 });
  if (c.sashLoop) {   // hỗn thiên lăng: dải lụa đỏ vòng sau lưng, hai đầu bay
    const R = c.sashLoop, RS = mixC(R, '#000000', 0.25);
    pre += chT(`M-120 -190 Q-260 ${-250 + sw * 10} ${-300 + sw * 14} -110 Q${-270 + sw * 10} -40 ${-330 + sw * 18} 40 L${-300 + sw * 18} 50 Q${-240 + sw * 10} -40 ${-270 + sw * 12} -110 Q-240 -220 -110 -170Z`, R, RS, { sx: 4, sy: 0, lw: 3.5 });
    pre += chT(`M120 -190 Q260 ${-250 - sw * 10} ${300 - sw * 14} -110 Q${270 - sw * 10} -40 ${330 - sw * 18} 40 L${300 - sw * 18} 50 Q${240 - sw * 10} -40 ${270 - sw * 12} -110 Q240 -220 110 -170Z`, R, RS, { sx: -4, sy: 0, lw: 3.5 });
  }
  let s = _tdkBody0(c, T, o);
  if (c.armor) {   // giáp ngực 2 tấm + giáp vai + vạt giáp dưới
    const A = c.armor, AS = mixC(A, '#000000', 0.25);
    post += tnkScales('M-96 -176 Q-60 -200 -4 -186 L-6 -98 Q-56 -86 -100 -104Z', -110, -210, 120, 130, 12, A, AS);
    post += tnkScales('M100 -176 Q64 -200 8 -186 L10 -98 Q60 -86 104 -104Z', 0, -210, 120, 130, 12, A, AS);
    post += chT('M-122 -150 Q-150 -176 -118 -210 Q-78 -240 -36 -222 Q-60 -184 -122 -150Z M126 -150 Q154 -176 122 -210 Q82 -240 40 -222 Q64 -184 126 -150Z', mixC(A, '#ffffff', 0.15), AS, { sx: 6, sy: 4, lw: 4 });
    post += tnkScales('M-124 -38 L-24 -38 L-20 6 Q-80 12 -126 0Z', -126, -40, 110, 50, 12, A, AS) + tnkScales('M24 -38 L124 -38 L126 0 Q80 12 20 6Z', 20, -40, 110, 50, 12, A, AS);
    post += `<circle cx="2" cy="-150" r="20" fill="${A}" stroke="${CH_INK}" stroke-width="4"/><circle cx="2" cy="-150" r="9" fill="${c.armorGem || '#C0392B'}" stroke="${CH_INK}" stroke-width="2.5"/>`;
  }
  if (c.bagua) post += `<g transform="translate(-58 -150)"><circle r="26" fill="#F6F2E6" stroke="${CH_INK}" stroke-width="3.5"/><path d="M0 -26 A13 13 0 0 1 0 0 A13 13 0 0 0 0 26 A26 26 0 0 1 0 -26Z" fill="#2A2630"/><circle cy="-13" r="4" fill="#F6F2E6"/><circle cy="13" r="4" fill="#2A2630"/></g>`;
  return pre + s + post;
};

// ---------- đồ cầm tay (xoay theo TDK_ROT) ----------
const _tdkHand0 = chHand;
chHand = function (kind, c) {
  const fist = _tdkHand0('fist', c), R = `rotate(${TDK_ROT})`;
  const g = (inner, under = 0) => under ? `<g transform="${R}">${inner}</g>` + fist : fist + `<g transform="${R}">${inner}</g>`;
  switch (kind) {
    case 'whisk': return g(chT('M-5 -40 L5 -40 L5 110 L-5 110Z', '#8A5A2A', '#6A4220', { lw: 3 }) + chT('M-14 106 Q-40 180 -26 250 Q-4 200 0 150 Q6 210 26 250 Q40 180 14 106Z', '#FBFBF6', '#DADAD0', { sx: 3, sy: 0, lw: 3 }) + chL('M-8 140 Q-20 190 -16 230 M8 140 Q18 190 14 230', 2, '#CFC9BC'), 1);
    case 'ruler': return g(chT('M-11 -30 L11 -30 L11 200 L-11 200Z', '#B8865A', '#8A6038', { lw: 3.5 }) + [0, 40, 80, 120, 160].map(y => chL(`M-11 ${y} h10`, 2, '#6A4220')).join(''), 1);
    case 'pagoda': { let s = ''; for (let i = 0; i < 5; i++) { const y = 40 + i * 30, w = 40 - i * 6; s += chT(`M${-w} ${y} L${w} ${y} L${w - 8} ${y + 24} L${-w + 8} ${y + 24}Z`, TDK_G, TDK_GS, { lw: 3 }) + chT(`M${-w - 10} ${y + 2} Q0 ${y - 12} ${w + 10} ${y + 2} Q0 ${y - 4} ${-w - 10} ${y + 2}Z`, '#C0392B', '#8E2418', { lw: 2.5 }); }
      return g(s + `<circle cx="0" cy="200" r="10" fill="${TDK_G}" stroke="${CH_INK}" stroke-width="3"/>` + `<g opacity="0.5">${bloom('<circle cx="0" cy="120" r="60" fill="#FFE6A0"/>', '#FFC860', 0.5)}</g>`); }
    // (2026-10-14) lưỡi búa lật sang phía trước: cầm dựng thì lưỡi hướng về đối thủ, bổ xuống thì lưỡi chém xuống (người dùng: 'búa bị ngược, đầu búa ngẩng lên trời')
    case 'axe': return g(chT('M-8 -60 L8 -60 L8 230 L-8 230Z', '#6A4A2A', '#4A321C', { lw: 3.5 }) + chT('M-8 170 Q-90 150 -110 230 Q-90 300 -8 280Z', '#C8CCD2', '#8E96A0', { sx: 0, sy: 4, lw: 4 }) + chL('M-14 186 Q-82 176 -96 230', 3, '#FFFFFF', 0.7), 1);
    case 'woodaxe': return g(chT('M-6 -20 L6 -20 L6 150 L-6 150Z', '#8A6038', '#6A4220', { lw: 3 }) + chT('M6 110 Q50 100 58 140 Q50 180 6 166Z', '#B8BEC6', '#8E96A0', { lw: 3.5 }), 1);
    case 'trident': { const L = 250, head = `M${L} -10 L${L + 70} -10 L${L + 110} 0 L${L + 70} 10 L${L} 10Z M${L + 10} -10 L${L + 40} -40 L${L + 60} -40 L${L + 30} -10Z M${L + 10} 10 L${L + 40} 40 L${L + 60} 40 L${L + 30} 10Z`;
      return g(chT(`M${-L} -8 L${L} -8 L${L} 8 L${-L} 8Z`, '#5A4A3A', '#3A2E24', { sx: 0, sy: 4, lw: 3.5 }) + chT(head, '#DCE2EA', '#A6B0BC', { sx: 0, sy: 3, lw: 3.5 }) + `<circle cx="${L - 6}" cy="0" r="12" fill="#C0392B" stroke="${CH_INK}" stroke-width="2.5"/>`, 1); }
    case 'spear': { const L = 230; return g(chT(`M${-L} -7 L${L} -7 L${L} 7 L${-L} 7Z`, '#7A5A3A', '#5A402A', { sx: 0, sy: 3, lw: 3.5 }) + chT(`M${L} -12 L${L + 70} 0 L${L} 12Z`, '#DCE2EA', '#A6B0BC', { lw: 3.5 }) + chT(`M${L - 6} -10 Q${L - 40} -30 ${L - 60} -10 Q${L - 40} 10 ${L - 6} 10Z`, '#C0392B', '#8E2418', { lw: 2.5 }), 1); }
    case 'whip': { let s = ''; for (let i = 0; i < 8; i++) s += chT(`M-9 ${20 + i * 26} h18 v22 h-18Z`, TDK_G, TDK_GS, { lw: 3 }); return g(s + `<circle cx="0" cy="234" r="11" fill="${TDK_G}" stroke="${CH_INK}" stroke-width="3"/>`, 1); }
    case 'blade': return g(chT('M-6 -40 L6 -40 L6 50 L-6 50Z', '#4A3A2A', null, { lw: 3.5 }) + chT('M-12 50 L22 50 Q48 180 10 290 Q-10 200 -12 50Z', '#CDD3DA', '#98A2AE', { sx: 0, sy: 4, lw: 4 }) + chT('M-20 44 h44 v12 h-44Z', TDK_G, TDK_GS, { lw: 3 }), 1);
    case 'cane': return g(chT('M-7 -40 Q-20 -60 -6 -76 Q12 -84 18 -64 L8 -60 Q6 -70 -2 -66 Q-8 -58 6 -40 L8 230 L-6 230Z', '#8A5A2A', '#6A4220', { lw: 3.5 }), 1);
    case 'rope': return g(`<ellipse cx="0" cy="50" rx="34" ry="22" fill="none" stroke="${CH_INK}" stroke-width="12"/><ellipse cx="0" cy="50" rx="34" ry="22" fill="none" stroke="#B89A6A" stroke-width="7"/>` + chL('M20 64 Q40 140 10 200', 12) + chL('M20 64 Q40 140 10 200', 7, '#B89A6A'), 1);
    case 'vase': return g(chT('M-16 30 Q-30 60 -24 90 Q-20 120 0 124 Q20 120 24 90 Q30 60 16 30 L10 10 L-10 10Z', '#FBFBF6', '#DADAD0', { lw: 3.5 }) + chL('M2 10 Q-10 -40 -30 -70 M-6 -20 Q-34 -24 -50 -10 M-14 -44 Q8 -60 14 -84', 3, '#5A8A4A') + [[-30, -70], [-50, -10], [14, -84], [-34, -24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="4" fill="#7CC48A" stroke="${CH_INK}" stroke-width="1.6"/>`).join(''));
    case 'qkring': return g(`<circle cx="0" cy="40" r="44" fill="none" stroke="${CH_INK}" stroke-width="16"/><circle cx="0" cy="40" r="44" fill="none" stroke="${TDK_G}" stroke-width="10"/>` + chL('M-30 14 A40 40 0 0 1 20 4', 3, '#FFF2C0'));
  }
  return _tdkHand0(kind, c);
};

// ---------- chó săn của Nhị Lang (vẽ riêng, nhìn ngang, quay phải) ----------
function tdkDog(x, y, k, T, o = {}) {
  // chó săn (細犬): ngực sâu, eo thóp, chân dài, mõm dài, tai cụp — nhìn ngang quay phải
  const C = o.c || '#E8E2D6', CS = mixC(C, '#000000', 0.22), L = mixC(C, '#ffffff', 0.12), ph = T * 10, run = o.run ? 1 : 0.12;
  const leg = (hx, hy, a1, a2, len1, len2, w, col) => { const r = Math.PI / 180, kx = hx + Math.sin(a1 * r) * len1, ky = hy + Math.cos(a1 * r) * len1, fx = kx + Math.sin(a2 * r) * len2, fy = ky + Math.cos(a2 * r) * len2;
    return chT(`M${f1(hx - w)} ${hy} L${f1(hx + w)} ${hy} L${f1(kx + w * 0.55)} ${f1(ky)} L${f1(fx + w * 0.4)} ${f1(fy - 4)} L${f1(fx + w * 0.4 + 16)} ${f1(fy + 2)} L${f1(fx - w * 0.5)} ${f1(fy + 4)} L${f1(kx - w * 0.55)} ${f1(ky)}Z`, col, mixC(col, '#000000', 0.2), { sx: 2, sy: 0, lw: 4 }); };
  const sA = Math.sin(ph) * 30 * run, sB = Math.cos(ph) * 30 * run;
  let s = `<g transform="translate(${x} ${y}) scale(${o.flip ? -k : k} ${k})">`;   // o.flip: quay trái; o.bite: há mõm cắn (người dùng 2026-10-13)
  s += leg(-96, -96, -6 - sA, 14, 70, 70, 13, CS) + leg(66, -110, 6 + sB, -8, 66, 66, 12, CS);   // chân xa
  s += chT(`M-118 -128 Q-176 ${-150 + Math.sin(T * 3) * 6} -196 -214 Q-180 -160 -128 -112Z`, C, CS, { sx: 2, sy: 3, lw: 4 });   // đuôi cong
  s += chT('M-130 -136 Q-120 -168 -60 -160 Q0 -150 40 -176 Q92 -196 112 -150 Q118 -106 84 -88 Q40 -78 20 -100 Q-30 -116 -70 -96 Q-118 -84 -132 -110Z', C, CS, { sx: 0, sy: 8, lw: 4.5 });   // thân: ngực sâu, eo thóp
  s += chL('M-40 -140 Q0 -130 30 -150', 2.6, CS, 0.8);
  s += leg(-108, -104, 4 + sA, 16, 74, 72, 14, C) + leg(76, -100, -4 - sB, -6, 70, 70, 14, C);   // chân gần
  s += chT('M80 -168 Q90 -224 132 -236 Q176 -244 214 -214 L246 -198 Q252 -186 238 -182 L200 -180 Q164 -170 132 -150 Q104 -128 92 -140Z', C, CS, { sx: 0, sy: 5, lw: 4.5 });   // cổ dài + đầu + mõm
  s += chT('M126 -232 Q112 -262 136 -270 Q150 -244 150 -226Z', CS, mixC(CS, '#000000', 0.2), { lw: 3.5 });   // tai cụp
  s += `<ellipse cx="162" cy="-214" rx="7" ry="6" fill="${o.c ? '#F2D27A' : CH_INK}"/><circle cx="160" cy="-216" r="2.5" fill="#fff"/><ellipse cx="246" cy="-194" rx="7" ry="5" fill="${CH_INK}"/>`;
  s += chT('M96 -168 Q110 -146 134 -150 L132 -136 Q104 -132 88 -152Z', '#C0392B', '#8E2418', { lw: 3 });   // vòng cổ đỏ
  if (o.bite) { const j = 16 + 10 * Math.abs(Math.sin(T * 14));   // hàm dưới há ra + răng nanh + khoang miệng
    s += `<path d="M196 -186 L250 -196 L246 ${f1(-190 + j)} L200 ${f1(-176 + j * 0.6)}Z" fill="#7A1E1E" stroke="${CH_INK}" stroke-width="3.5"/>`;
    s += chT(`M198 -178 Q222 ${f1(-170 + j)} 246 ${f1(-186 + j)} L244 ${f1(-176 + j)} Q220 ${f1(-160 + j)} 192 -166Z`, C, CS, { lw: 4 });
    s += [[214, -192, 1], [236, -195, 1], [222, f1(-178 + j), -1], [240, f1(-184 + j), -1]].map(([tx, ty, d]) => `<path d="M${tx - 5} ${ty} L${tx} ${ty + d * 11} L${tx + 5} ${ty}Z" fill="#fff" stroke="${CH_INK}" stroke-width="2"/>`).join(''); }
  return s + '</g>';
}

// ---------- 3 đầu 6 tay (Na Tra, Ngộ Không): vẽ thêm 2 đầu + 4 tay quanh nhân vật ----------
function tdkThreeHeads(id, st, T, extraArms) {
  const c = CHAR[id], sc = st.scale || 1, fl = st.flip ? -1 : 1, bk = c.bulk || 1, gy = st.ground ?? 1090;
  let back = '', front = '';
  for (const [dx, dy, rot] of [[-190, 30, -18], [200, 30, 18]]) { const [hb, hf] = chHead(c, st.ex2 || st.ex || 'fierce', T + 0.4, { seed: dx });
    back += `<g transform="translate(${f1(st.x + fl * (CH_HEAD[0] + dx) * sc)} ${f1(gy + (CH_HEAD[1] + CH_HEAD[2] + dy) * sc)}) scale(${f1(fl * sc * 0.82)} ${f1(sc * 0.82)}) rotate(${rot})">${hb}${hf}</g>`; }
  extraArms.forEach(([ang, hand, wr], i) => { TDK_ROT = wr || 0; TNK_STAFF_ROT = wr || 0;
    const side = i % 2 ? 1 : -1;   // xen kẽ trái / phải
    back += `<g transform="translate(${st.x} ${gy}) scale(${side * fl * sc} ${sc})"><g transform="scale(${CH_BS}) translate(${CH_SH[0] * bk + 6} ${CH_SH[1] + 10})">${chArm(c, ang, hand, false, T)}</g></g>`; });
  return [back, front];
}
// ---------- DANH SÁCH NHÂN VẬT ----------
const tdkOld = (o) => Object.assign({ male: 1, old: 1, hair: '#EDEAE2', hairS: '#C8C2B4', brow: '#F4F1EA', beard: '#F4F1EA', beardS: '#CFC9BC', iris: ['#3A2418', '#8A6A4A'] }, o);

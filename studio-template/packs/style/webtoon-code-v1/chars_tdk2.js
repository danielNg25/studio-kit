// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT TÂY DU KÝ — PHẦN 2 + PHẦN 3 (dùng chung; 2026-10-19, CHỜ DUYỆT C2).
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js. Cùng kiểu webtoon-code-v1: tô phẳng 2 tông + viền mực, mặt/tóc không chi tiết hơn áo.
// Không sửa chars_tdk.js (dùng chung với phần 1): chỉ bọc chHead / chBody / chHand thêm thuộc tính mới.
// Thuộc tính mới: pigEars + pigSnout (Bát Giới), monkCap (mũ Tỳ Lư của Đường Tăng), skulls (chuỗi 9 đầu lâu của Sa Tăng),
// flameTuft (chỏm lửa Hồng Hài Nhi), pale (mặt tái, mắt đỏ sẫm — Bạch Cốt), cheekMark.
// Đạo cụ cầm tay mới: rake (bừa chín răng), crescent (thiền trượng nguyệt nha), khakkhara (tích trượng), redgourd (hồ lô đỏ), jadebottle (bình ngọc), fan (quạt ba tiêu).
// vân mây xoắn đôi (tường vân): hai vòng xoắn đối xứng nối ở đáy — nét dày viền mực, tô màu
function tdk2Cloud(cx, cy, R, col, sc = 1) {
  const spiral = (sg) => { let d = ''; const N = 36, turns = 1.55;
    for (let k = 0; k <= N; k++) { const u = k / N, a = (Math.PI * 0.5 + u * turns * Math.PI * 2) * -sg, r = R * (0.1 + 0.9 * (1 - u));   // từ ngoài (đáy) cuộn vào tâm
      d += (k ? 'L' : 'M') + f1(sg * (R * 0.78) + r * Math.cos(a)) + ' ' + f1(-R * 0.55 + r * Math.sin(a) * -1); }
    return d; };
  const dl = spiral(-1), dr = spiral(1), w = R * 0.42;
  return `<g transform="translate(${cx} ${cy}) scale(${sc})" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${dl}" stroke="${CH_INK}" stroke-width="${f1(w + 8)}"/><path d="${dr}" stroke="${CH_INK}" stroke-width="${f1(w + 8)}"/><path d="${dl}" stroke="${col}" stroke-width="${f1(w)}"/><path d="${dr}" stroke="${col}" stroke-width="${f1(w)}"/></g>`;
}
function tdk2HeadX(c, ex, T, o = {}) {
  const sw = Math.sin(T * 2.2 + (o.seed || 0));
  let b = '', f = '';
  if (c.pigEars) {   // hai tai heo to, cụp xuống như cánh quạt
    b += chT(`M-98 -118 Q-214 -150 ${-238 + sw * 4} -26 Q-214 50 -108 16Z`, c.skin, c.skinS, { sx: 8, sy: 0, lw: 5 }) + chL(`M-122 -86 Q-190 -96 ${-208 + sw * 3} -30`, 3, '#C98F78');
    b += chT(`M142 -118 Q258 -150 ${282 - sw * 4} -26 Q258 50 152 16Z`, c.skin, c.skinS, { sx: -8, sy: 0, lw: 5 }) + chL(`M166 -86 Q234 -96 ${252 - sw * 3} -30`, 3, '#C98F78');
  }
  if (c.pigSnout) {   // mõm heo: đĩa mũi hồng hơn mặt, hai lỗ mũi to; miệng nằm ngay dưới
    f += chT('M-30 54 Q-34 22 16 20 Q66 22 62 54 Q60 86 16 88 Q-28 86 -30 54Z', c.snout || '#EDA09A', c.snoutS || '#CC7A76', { sx: 6, sy: 4, lw: 4.5 });
    f += `<ellipse cx="0" cy="54" rx="7" ry="11" fill="#7A3A38" stroke="${CH_INK}" stroke-width="2.4"/><ellipse cx="32" cy="54" rx="7" ry="11" fill="#7A3A38" stroke="${CH_INK}" stroke-width="2.4"/>`;
  }
  if (c.monkCap) {   // mũ Tỳ Lư của Đường Tăng: vòm đỏ thẫm + vành vàng, năm cánh sen vàng phía trước
    f += chT('M-108 -128 Q-104 -246 14 -252 Q132 -246 136 -128 Q14 -156 -108 -128Z', c.monkCap, mixC(c.monkCap, '#000000', 0.25), { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-116 -132 Q14 -168 144 -132 L146 -108 Q14 -146 -118 -108Z', TDK_G, TDK_GS, { lw: 3.5 });
    f += [-64, -32, 0, 32, 64].map((dx, i) => `<path d="M${14 + dx - 14} ${-176 - Math.abs(dx) * 0.08} Q${14 + dx} ${-214 + Math.abs(dx) * 0.22} ${14 + dx + 14} ${-176 - Math.abs(dx) * 0.08}Z" fill="${i === 2 ? '#F6EEDC' : TDK_G}" stroke="${CH_INK}" stroke-width="2.6"/>`).join('');
  }
  if (c.flameTuft) {   // chỏm lửa trên đỉnh đầu (Hồng Hài Nhi): ba lưỡi lửa đung đưa
    const F = c.flameTuft, FS = mixC(F, '#FFD060', 0.5);
    f += `<g opacity="0.95">` + chT(`M-40 -214 Q${-70 + sw * 6} -280 ${-30 + sw * 10} -330 Q${-6 + sw * 4} -280 6 -230Z`, F, mixC(F, '#000000', 0.25), { lw: 3.5 })
      + chT(`M-4 -226 Q${-12 + sw * 8} -310 ${28 + sw * 12} -372 Q${60 + sw * 6} -300 52 -226Z`, F, mixC(F, '#000000', 0.25), { lw: 3.5 })
      + chT(`M40 -216 Q${74 + sw * 6} -272 ${116 + sw * 10} -302 Q${108 + sw * 4} -250 82 -206Z`, F, mixC(F, '#000000', 0.25), { lw: 3.5 })
      + `<path d="M4 -240 Q${2 + sw * 6} -290 ${24 + sw * 8} -326 Q${40 + sw * 4} -286 32 -240Z" fill="${FS}"/></g>`;
  }
  if (c.bigForehead) f += chT('M-98 -136 Q-108 -268 14 -280 Q136 -268 126 -136 Q14 -170 -98 -136Z', c.skin || CH_SKIN, c.skinS || CH_SKIN_S, { sx: 8, sy: 6, lw: 4.5 }) + chL('M-60 -176 Q14 -200 88 -176', 2.4, c.skinS || CH_SKIN_S, 0.9);   // trán cao của Thọ Tinh
  if (c.futou) {   // mũ phốc đầu triều Đường: chóp tròn + dải vàng + hai cánh ngắn rủ nhẹ
    b += chT('M-120 -150 L-190 -138 Q-200 -126 -190 -118 L-120 -128Z M148 -150 L218 -138 Q228 -126 218 -118 L148 -128Z', '#1E1C24', '#0E0C12', { sx: 0, sy: 3, lw: 3.5 });
    f += chT('M-110 -150 Q-100 -250 14 -258 Q128 -250 138 -150 Q14 -180 -110 -150Z', '#1E1C24', '#0E0C12', { sx: 8, sy: 6, lw: 4.5 }) + chT('M-50 -228 Q-46 -286 14 -290 Q74 -286 78 -228Z', '#1E1C24', '#0E0C12', { sx: 5, sy: 4, lw: 4 });
    f += chT('M-112 -154 Q14 -186 140 -154 L140 -138 Q14 -170 -112 -138Z', TDK_G, TDK_GS, { lw: 3 });
  }
  if (c.monkCrown) {   // mão Ngũ Phật của Đường Tăng: dải vàng + năm cánh sen vàng nhọn, ngọc đỏ giữa
    const MC = c.monkCrown, MS = mixC(MC, '#000000', 0.25);
    b += chT('M-100 -150 L-130 -126 L-100 -110Z M128 -150 L158 -126 L128 -110Z', '#C0392B', '#8E2418', { lw: 3 });
    f += chT('M-110 -134 Q-104 -190 14 -196 Q132 -190 138 -134 Q14 -160 -110 -134Z', '#8E2A22', '#5E1A14', { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-116 -138 Q14 -172 144 -138 L146 -112 Q14 -148 -118 -112Z', MC, MS, { lw: 4 });
    f += [[-84, 44], [-44, 62], [14, 84], [72, 62], [112, 44]].map(([x, h], i) => `<path d="M${x - 30} ${-146 + Math.abs(x - 14) * 0.06} Q${x - 32} ${-150 - h * 0.8} ${x} ${-150 - h - 34 + (i === 2 ? -6 : 0)} Q${x + 32} ${-150 - h * 0.8} ${x + 30} ${-146 + Math.abs(x - 14) * 0.06}Z" fill="#B8322A" stroke="${CH_INK}" stroke-width="4" stroke-linejoin="round"/>`).join('');
    f += [[-84, 44], [-44, 62], [14, 84], [72, 62], [112, 44]].map(([x, h], i) => `<path d="M${x - 20} ${-150 + Math.abs(x - 14) * 0.06} Q${x - 22} ${-150 - h * 0.7} ${x} ${-150 - h - 14 + (i === 2 ? -6 : 0)} Q${x + 22} ${-150 - h * 0.7} ${x + 20} ${-150 + Math.abs(x - 14) * 0.06}Z" fill="${MC}" stroke="${CH_INK}" stroke-width="3.6" stroke-linejoin="round"/>`).join('');
    f += `<circle cx="14" cy="-138" r="11" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/><circle cx="11" cy="-141" r="3.4" fill="#FFB0A0"/>`;
  }
  if (c.crescent) f += tdk2Cloud(14, -146, 34, TDK_G, 1.15);   // Ngộ Không bản chibi: cùng kiểu kim cô vân mây với Sa Tăng + Bát Giới
  if (c.pigHat) {   // mũ Thiên Bồng đen viền vàng, hoa văn mây vàng giữa trán, hai cánh nhỏ hai bên
    b += chT('M-104 -150 L-168 -136 Q-178 -122 -166 -114 L-104 -126Z M132 -150 L196 -136 Q206 -122 194 -114 L132 -126Z', '#363A56', '#24273E', { lw: 3.5 });
    f += `<ellipse cx="14" cy="-128" rx="70" ry="34" fill="${c.skin || CH_SKIN}"/>`;
    f += chT('M-104 -128 Q-100 -250 14 -256 Q128 -250 134 -128 Q14 -156 -104 -128Z', '#363A56', '#24273E', { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-110 -132 Q14 -166 140 -132 L142 -108 Q14 -142 -112 -108Z', TDK_G, TDK_GS, { lw: 3.5 });
    f += tdk2Cloud(14, -150, 34, TDK_G, 1.15);
  }
  if (c.bandBald) {   // khăn trắng buộc ngang trán cho đầu hói (chars.js chỉ vẽ khăn khi có tóc) + hai đuôi khăn rủ sau
    const sw2 = Math.sin(T * 2.6 + (o.seed || 0)) * 8, BC = c.bandBald, BCS = mixC(BC, '#000000', 0.18);
    f += chT('M-134 -96 Q10 -146 158 -98 L160 -78 Q10 -128 -136 -76Z', BC, BCS, { sx: 0, sy: -4, lw: 3.5 });
    f += tdk2Cloud(14, -124, 34, BC, 1.15);
  }
  if (c.bushBeard) {   // râu rậm tròn phủ nửa mặt dưới + tóc mai xù hai bên; chừa ô miệng để vẫn mấp máy khi nói
    const BB = c.bushBeard, BS = c.bushBeardS || mixC(BB, '#000000', 0.25), E = CH_EXPR[ex] || CH_EXPR.neutral;
    b += chT('M-100 -70 Q-176 -64 -158 10 Q-170 50 -130 66 Q-104 70 -100 20Z M130 -70 Q206 -64 188 10 Q200 50 160 66 Q134 70 130 20Z', BB, BS, { sx: 6, sy: 4, lw: 4.2 });
    f += '<g transform="translate(14 30) scale(1.14 1.12) translate(-14 -30)">';
    f += chT('M-112 6 Q-136 80 -102 132 Q-76 172 -22 180 Q14 190 54 180 Q112 170 138 126 Q166 74 140 2 Q124 56 92 66 Q52 52 14 62 Q-30 52 -70 66 Q-104 58 -112 6Z', BB, BS, { sx: 10, sy: 4, lw: 4.5 });
    f += chL('M-92 96 q10 14 24 10 M-60 130 q12 14 28 8 M-18 150 q14 12 28 6 M30 152 q14 10 28 2 M72 132 q12 10 26 2 M104 96 q8 12 22 6', 3.2, BS, 0.95) + '</g>';
    f += `<ellipse cx="13" cy="102" rx="30" ry="15" fill="${c.skin || CH_SKIN}" stroke="${CH_INK}" stroke-width="3"/>` + chMZ(E[2], 13, 102);
    f += chT('M-46 82 Q-14 56 14 66 Q44 56 78 82 Q60 100 38 90 Q14 76 -10 90 Q-30 100 -46 82Z', BB, BS, { sx: 0, sy: -3, lw: 3.5 });
  }
  if (c.scar) {   // sẹo chém chéo qua mắt trái, có mũi khâu
    const d = 'M-82 -58 L-14 82'; f += chL(d, 8.5) + chL(d, 4.2, c.scarC || '#C04848') + [[-66, -28], [-48, 6], [-30, 40]].map(([x, y]) => chL(`M${x - 9} ${y + 5} l18 -10`, 2.6, CH_INK)).join('');
  }
  if (c.eyepatch) f += chL('M-130 -70 L-60 -14 M-6 14 L150 -34', 6) + `<ellipse cx="-38" cy="20" rx="42" ry="38" fill="#241A18" stroke="${CH_INK}" stroke-width="4"/><path d="M-60 6 q22 -14 42 0" fill="none" stroke="#5A4A44" stroke-width="3"/>`;
  if (c.earring) f += `<circle cx="-136" cy="58" r="13" fill="none" stroke="${CH_INK}" stroke-width="8"/><circle cx="-136" cy="58" r="13" fill="none" stroke="${TDK_G}" stroke-width="4"/>`;
  if (c.glasses) f += [[-38, 20], [64, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="44" fill="#2A241E" opacity="0.82" stroke="${CH_INK}" stroke-width="6"/><circle cx="${x - 12}" cy="${y - 14}" r="9" fill="#FFFFFF" opacity="0.5"/>`).join('') + chL('M6 14 Q14 6 22 14', 5) + chL('M-82 14 L-130 4 M108 14 L148 4', 4);
  if (c.tusks) f += `<path d="M-24 106 Q-40 70 -22 48 Q-14 74 -6 104Z M52 104 Q74 68 58 44 Q44 72 36 102Z" fill="#FFFDF2" stroke="${CH_INK}" stroke-width="3.2" stroke-linejoin="round"/>`;
  if (c.kidEyes) for (const x of [-38, 64]) { const r = 33; f += `<circle cx="${x}" cy="20" r="${r}" fill="#fff" stroke="${CH_INK}" stroke-width="4.5"/><circle cx="${x + 4}" cy="22" r="${r * 0.62}" fill="${c.kidEyes}"/><circle cx="${x + 4}" cy="22" r="${r * 0.3}" fill="#1A0E0A"/><circle cx="${x - 4}" cy="10" r="7" fill="#fff"/><circle cx="${x + 12}" cy="30" r="3.4" fill="#fff"/>`; }
  if (c.cheeks) f += `<ellipse cx="-58" cy="66" rx="24" ry="15" fill="${c.cheeks}" opacity="0.7"/><ellipse cx="96" cy="66" rx="24" ry="15" fill="${c.cheeks}" opacity="0.7"/>`;
  if (c.aged) {   // già thật: trán nhăn, chân chim, bọng mắt, rãnh mũi–má, má võng, đốm đồi mồi
    const K = c.aged, A = mixC(c.skinS || CH_SKIN_S, '#3A2418', 0.5);
    f += chL('M-70 -96 q82 -12 160 -2 M-58 -78 q72 -10 142 -2 M-40 -62 q56 -8 108 -2', 4, A, 1);
    f += chL('M-98 4 l-26 -10 M-100 20 l-30 2 M-98 36 l-26 12 M130 4 l26 -10 M134 22 l30 2 M130 38 l26 12', 3.4, A, 1);
    f += chL('M-72 58 q32 22 62 2 M34 58 q32 22 62 2', 4, A, 1);
    f += chL('M-44 70 q-26 40 -2 86 M74 70 q26 40 2 86', 4.2, A, 1);
    if (K > 1) f += chL('M-86 100 q8 32 36 40 M118 100 q-8 32 -36 40 M-10 150 q24 10 46 0', 3, A, 0.9) + [[-76, -40], [112, -30], [-90, 70], [100, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="#A8785A" opacity="0.8"/>`).join('');
  }
  if (c.pale) for (const [x, y] of [[-36, 20], [66, 20]]) f += `<circle cx="${x}" cy="${y}" r="5" fill="#B83A3A" opacity="0.8"/>`;   // con ngươi đỏ sẫm: ánh nhìn của yêu
  if (c.cheekMark) f += chL('M-70 70 q16 8 34 2 M70 70 q16 -4 30 -14', 3, c.cheekMark, 0.9);
  return [b, f];
}
const _tdk2Head0 = chHead;
chHead = function (c, ex, T, o = {}) {
  let [hb, hf] = _tdk2Head0(c, ex, T, o);
  if (!c || c.dragonFace) return [hb, hf];
  const [xb, xf] = tdk2HeadX(c, ex, T, o);
  if (c.noDots) hf = hf.replace(/<circle cx="[^"]*" cy="[^"]*" r="5" fill="#E9B48C"[^>]*\/>/g, '');
  if (c.headK) { const w = (x) => `<g transform="translate(14 132) scale(${c.headK}) translate(-14 -132)">${x}</g>`; return [w(xb + hb), w(hf + xf)]; }   // đầu to theo tỉ lệ trẻ con
  return [xb + hb, hf + xf];
};

// ---------- thân: chuỗi 9 đầu lâu (Sa Tăng) ----------
const _tdk2Body0 = chBody;
chBody = function (c, T, o = {}) {
  let s = _tdk2Body0(c, T, o);
  if (c && c.hunch) s = chT(`M-118 -190 Q-190 -214 -184 -110 Q-178 -40 -126 0 L-110 -60Z`, c.robe, c.robeS, { sx: 10, sy: 0, lw: 4.5 }) + s;   // lưng gù nhô ra sau cổ
  if (c && c.patchKasaya) {   // cà sa ô ruộng: khoác chéo cả thân, viền vàng, lưới ô vuông, khuy vàng ở vai
    const K = c.patchKasaya, KS = mixC(K, '#000000', 0.28);
    s += chT('M-132 -196 Q-70 -232 18 -214 Q96 -206 128 -168 Q142 -84 132 4 L-132 4 Q-146 -90 -132 -196Z', K, KS, { sx: 12, sy: 0, lw: 5 });
    s += chT('M-34 -216 L16 -146 L66 -212 Q16 -230 -34 -216Z', c.inner || '#F2E6C8', mixC(c.inner || '#F2E6C8', '#000000', 0.12), { lw: 3.5 });
    let g = ''; for (let y = -176; y <= -10; y += 46) g += `M${-136 + (y % 92 ? 0 : 0)} ${y} Q0 ${y - 16} 140 ${y} `; for (let k = 0; k < 4; k++) for (let y = -190 + k * 46, j = 0; j < 2; j++) g += `M${-76 + j * 90 + (k % 2) * 40} ${y} L${-76 + j * 90 + (k % 2) * 40} ${y + 46} `;
    s += `<path d="${g}" fill="none" stroke="${TDK_G}" stroke-width="3.4" opacity="0.9"/>`;
    s += chL('M-132 -196 Q-146 -90 -132 4 M128 -168 Q142 -84 132 4', 7, TDK_G);
    s += `<circle cx="-98" cy="-186" r="15" fill="${TDK_G}" stroke="${CH_INK}" stroke-width="3.5"/><circle cx="-98" cy="-186" r="6" fill="${KS}"/>`;
  }
  if (c && c.bigBeads) {   // chuỗi hạt đen to
    for (let i = 0; i < 7; i++) { const u = i / 6, x = -92 + u * 184, y = -178 + 96 * Math.sin(u * Math.PI), r = 24 + 4 * Math.sin(u * Math.PI);
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#2E2E3C" stroke="${CH_INK}" stroke-width="3.5"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.2)}" fill="#7A7A92"/>`; }
  }
  if (c && c.skulls) {
    for (let i = 0; i < 9; i++) {
      const u = i / 8, x = -86 + u * 172, y = -176 + 74 * Math.sin(u * Math.PI);
      s += `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="15" fill="#F2EEE2" stroke="${CH_INK}" stroke-width="3"/><circle cx="-5" cy="-2" r="3.2" fill="${CH_INK}"/><circle cx="5" cy="-2" r="3.2" fill="${CH_INK}"/><path d="M-6 8 h12" stroke="${CH_INK}" stroke-width="2.2"/></g>`;
    }
  }
  return s;
};

// ---------- đồ cầm tay ----------
const _tdk2Hand0 = chHand;
chHand = function (kind, c) {
  const fist = _tdk2Hand0('fist', c), R = `rotate(${TDK_ROT})`;
  const g = (inner, under = 0) => under ? `<g transform="${R}">${inner}</g>` + fist : fist + `<g transform="${R}">${inner}</g>`;
  switch (kind) {
    case 'rake': {   // bừa chín răng: cán gỗ + thanh ngang sắt + răng chĩa xuống
      let teeth = ''; for (let i = 0; i < 5; i++) teeth += chT(`M${-52 + i * 26} 262 l-7 52 l14 0Z`, '#C8CCD2', '#8E96A0', { lw: 3 });
      return g(chT('M-8 -60 L8 -60 L8 250 L-8 250Z', '#7A5A38', '#5A4028', { sx: 0, sy: 3, lw: 3.5 }) + chT('M-66 236 L66 236 L66 266 L-66 266Z', '#B8BEC6', '#8E96A0', { sx: 0, sy: 4, lw: 4 }) + teeth, 1); }
    case 'crescent': {   // thiền trượng nguyệt nha: cán dài + lưỡi trăng khuyết ở một đầu, xẻng ở đầu kia
      return g(chT('M-7 -150 L7 -150 L7 230 L-7 230Z', '#6A4A2A', '#4A321C', { sx: 0, sy: 3, lw: 3.5 })
        + chT('M-60 250 Q-70 190 0 180 Q70 190 60 250 Q50 214 0 208 Q-50 214 -60 250Z', '#DCE2EA', '#A6B0BC', { sx: 0, sy: 3, lw: 4 }) + `<circle cx="0" cy="226" r="9" fill="${TDK_G}" stroke="${CH_INK}" stroke-width="3"/>`
        + chT('M-26 -150 L26 -150 L16 -206 L-16 -206Z', '#B8BEC6', '#8E96A0', { lw: 3.5 }), 1); }
    case 'khakkhara': {   // tích trượng: đầu gậy có vòng vàng + sáu vòng nhỏ
      let rings = ''; for (let i = 0; i < 6; i++) { const a = Math.PI * (0.15 + i * 0.14); rings += `<circle cx="${f1(Math.cos(a) * -38 + 0)}" cy="${f1(Math.sin(a) * -30 + 200)}" r="8" fill="none" stroke="${CH_INK}" stroke-width="6"/><circle cx="${f1(Math.cos(a) * -38)}" cy="${f1(Math.sin(a) * -30 + 200)}" r="8" fill="none" stroke="${TDK_G}" stroke-width="3.2"/>`; }
      return g(chT('M-6 -80 L6 -80 L6 250 L-6 250Z', '#B89A6A', '#8A7048', { sx: 0, sy: 3, lw: 3.2 }) + `<circle cx="0" cy="250" r="34" fill="none" stroke="${CH_INK}" stroke-width="13"/><circle cx="0" cy="250" r="34" fill="none" stroke="${TDK_G}" stroke-width="7"/>` + chT('M-14 280 h28 v12 h-28Z', TDK_G, TDK_GS, { lw: 3 }), 1); }
    case 'redgourd': return g(chT('M-22 -2 Q-34 -40 -8 -50 Q0 -64 10 -50 Q34 -40 22 -2 Q40 22 34 56 Q26 98 0 100 Q-26 98 -34 56 Q-40 22 -22 -2Z', '#C8402E', '#9A2A1C', { sx: 4, sy: 4, lw: 4 }) + chT('M-8 -62 h16 v14 h-16Z', TDK_G, TDK_GS, { lw: 3 }) + chL('M-18 24 Q-22 50 -14 74', 3, '#FFD0B0', 0.7));
    case 'jadebottle': return g(chT('M-14 -12 Q-30 20 -26 60 Q-22 100 0 104 Q22 100 26 60 Q30 20 14 -12 L10 -34 L-10 -34Z', '#BFE4D6', '#8CC0AE', { sx: 4, sy: 3, lw: 4 }) + chT('M-12 -48 h24 v16 h-24Z', TDK_G, TDK_GS, { lw: 3 }) + chL('M-14 12 Q-18 46 -10 76', 3, '#F2FFFA', 0.8));
    case 'porcelain': return g(chT('M-14 -12 Q-34 24 -28 62 Q-24 100 0 104 Q24 100 28 62 Q34 24 14 -12 L10 -36 L-10 -36Z', '#F4F6F8', '#CDD6DE', { sx: 4, sy: 3, lw: 4 }) + chT('M-30 38 Q0 50 30 38 L28 62 Q0 74 -28 62Z', '#3A6AA8', '#2A4E80', { lw: 3 }) + chL('M-10 -14 Q0 -6 10 -14', 3, '#3A6AA8') + chT('M-12 -48 h24 v14 h-24Z', '#3A6AA8', '#2A4E80', { lw: 3 }));
    case 'brush': return g(chT('M-5 -40 L5 -40 L5 150 L-5 150Z', '#4A3220', '#2E2016', { lw: 3 }) + chT('M-10 146 Q0 230 0 250 Q0 230 10 146Z', '#B8322A', '#8E2418', { lw: 3 }) + chL('M0 150 L0 236', 2, '#E8806A', 0.8), 1);
    case 'peach': return g(chT('M0 -20 Q-50 -12 -46 38 Q-40 90 0 96 Q40 90 46 38 Q50 -12 0 -20Z', '#F8B0A0', '#E08478', { sx: 5, sy: 4, lw: 4 }) + chL('M0 -18 Q10 60 0 94', 3, '#E08478', 0.9) + chT('M4 -22 Q26 -52 58 -40 Q44 -18 8 -18Z', '#6AB05A', '#4A8A40', { lw: 3 }));
    case 'fan': return g('<g transform="scale(0.66) translate(0 30)">' + chT('M-4 -30 L4 -30 L4 80 L-4 80Z', '#8A5A2A', '#6A4220', { lw: 3 }) + chT('M0 70 Q-120 20 -110 -90 Q-70 -170 0 -156 Q70 -170 110 -90 Q120 20 0 70Z', '#6AA85A', '#4A8040', { sx: 6, sy: 4, lw: 4.5 }) + chL('M0 66 L0 -150 M0 60 Q-60 20 -84 -80 M0 60 Q60 20 84 -80', 2.6, '#3A6A32', 0.8) + '</g>', 1);
  }
  return _tdk2Hand0(kind, c);
};

// ---------- DANH SÁCH NHÂN VẬT ----------
const tdk2Old = (o) => Object.assign({ male: 1, old: 1, hair: '#EDEAE2', hairS: '#C8C2B4', brow: '#F4F1EA', beard: '#F4F1EA', beardS: '#CFC9BC', iris: ['#3A2418', '#8A6A4A'] }, o);
// Lục tặc (sáu tên cướp) — cùng khuôn, khác màu khăn/áo để phân biệt trong cảnh
const _lt = (name, band, robe, robeS, x = {}) => Object.assign({ male: 1, name, hair: '#1E1A18', hairS: '#0E0C0A', messy: 1, headband: band, stubble: 1, rags: 1, brow: '#141010', iris: ['#2A1E16', '#6A4A30'], skin: '#D6A47E', skinS: '#B4805C', robe, robeS, trim: '#C8B88A', sash: '#3A2E22', inner: '#E0D4B8', jaw: 'square', bulk: 1.1 }, x);

// ---------- TẠO HÌNH "CHIBI" cho cả dàn Tây Du Ký (2026-10-19: người dùng muốn gần gũi như Vui Vẻ — đầu to, thân nhỏ, má hồng, mặt giản dị) ----------
const _chibiVar = (id, nid, o) => { CHAR[nid] = Object.assign({}, CHAR[id], o || {}); };

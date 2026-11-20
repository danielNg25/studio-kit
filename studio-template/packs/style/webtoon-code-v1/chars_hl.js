// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT HY LẠP (kênh kênh mẫu, tập fact-lmao-hy-lap) — 2026-10-23, CHỜ DUYỆT C2.
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js + narrator_sung.js + chars_tdk2.js. Cùng kiểu webtoon-code-v1:
// tô phẳng 2 tông + viền mực, mặt/tóc không chi tiết hơn áo. Không sửa file cũ: chỉ bọc chBody / chArm / chHead / chHand.
// Thuộc tính thân (greek:1): chiton/peplos (robe, robeS, trim), himation (khăn choàng chéo), overfold (dải gấp ngực), belt/beltHigh,
//   cuirass (giáp đồng trơn + pter = vạt da), exomis (áo thợ một vai), apron (tạp dề da), cape, ren (áo choàng học giả Phục Hưng),
//   collarE (vòng cổ Ai Cập), noMeander (bỏ viền chữ triện), neckLow, sleeve (ống tay ngắn).
// Thuộc tính đầu: laurel, diadem (+crownTall), ghelm {c, plume, cheek}, petasos, phrygian, pilos, nemes, curly, veilG, eyeBand, bandHair.
// Đồ cầm tay mới (xoay theo TDK_ROT): lightning, hspear, aspis, scroll, bowl, lyre, caduceus, chains, hammer, xiphos, scales, sceptre, torch.
const HL_GOLD = '#E0B048', HL_GOLDS = '#B08428', HL_BRONZE = '#C98E4A', HL_BRONZES = '#9A6A32';

function hlMeander(x0, x1, yOf, col, step = 24, w = 2.8) {   // viền chữ triện Hy Lạp theo mép dưới áo
  let s = '';
  for (let x = x0; x <= x1 - step + 1; x += step) {
    const yb = yOf(x + step / 2);
    s += `<path d="M${x + 3} ${f1(yb - 3)} L${x + 3} ${f1(yb - 14)} L${x + 19} ${f1(yb - 14)} L${x + 19} ${f1(yb - 6)} L${x + 10} ${f1(yb - 6)} L${x + 10} ${f1(yb - 10)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  return s;
}

function hlBody(c, T, o = {}) {
  const SK = c.skin || CH_SKIN, SS = c.skinS || CH_SKIN_S, R = c.robe, RS = c.robeS, TR = c.trim || HL_GOLD, TRS = mixC(TR, '#000000', 0.28);
  const sw = Math.sin(T * 2.2);
  const F = c.fem && !c.cuirass, HW = F ? 119 : 124;   // nữ: eo thắt nhẹ, tà áo xoè; nam: thân thẳng
  const bd = F ? 'M-118 0 Q-108 -52 -100 -108 Q-96 -150 -106 -186 Q-74 -228 0 -236 Q74 -228 108 -186 Q98 -150 102 -108 Q110 -52 120 0 Q0 28 -118 0Z'
    : 'M-124 0 Q-136 -112 -108 -186 Q-74 -228 0 -236 Q74 -228 110 -186 Q138 -112 124 0 Q0 30 -124 0Z';
  let s = '';
  if (c.wings) {   // đôi cánh lông sau lưng (Nike…)
    const W = c.wings, WS = mixC(W, '#000000', 0.18), flap = Math.sin(T * 3) * 10;
    for (const k of [-1, 1]) {
      s += chT(`M${k * 70} -200 Q${k * 190} ${f1(-330 + flap)} ${k * 330} ${f1(-250 + flap)} Q${k * 300} ${f1(-236 + flap)} ${k * 306} ${f1(-196 + flap)} Q${k * 270} ${f1(-206 + flap)} ${k * 262} ${f1(-150 + flap * 0.6)} Q${k * 232} ${f1(-170 + flap * 0.6)} ${k * 216} -110 Q${k * 170} -150 ${k * 120} -110 Q${k * 96} -150 ${k * 70} -130Z`, W, WS, { sx: k * 8, sy: 6, lw: 4.5 });
      s += chL(`M${k * 110} -200 Q${k * 220} ${f1(-250 + flap)} ${k * 300} ${f1(-230 + flap)} M${k * 100} -170 Q${k * 200} ${f1(-200 + flap * 0.8)} ${k * 262} ${f1(-170 + flap * 0.6)} M${k * 100} -140 Q${k * 170} -150 ${k * 214} -120`, 2.6, mixC(WS, '#000000', 0.25), 0.8);
    }
  }
  if (c.cape) s += chT(`M-100 -212 Q-176 -110 ${f1(-184 + sw * 5)} 18 Q0 46 ${f1(184 - sw * 5)} 18 Q176 -110 100 -212Z`, c.cape, mixC(c.cape, '#000000', 0.25), { sx: 14, sy: 0, lw: 4.5 });
  // nền da (vai trần, ngực) rồi áo phủ lên
  s += chT(bd, SK, SS, { sx: 24, sy: 0, lw: 5 });
  if (c.ren) {   // áo choàng học giả Phục Hưng: đen, cổ áo trắng, viền lông
    s += chT(bd, R, RS, { sx: 24, sy: 0, lw: 5 });
    s += chT('M-44 -234 L2 -176 L50 -234 L30 -238 L2 -204 L-24 -238Z', c.inner || '#F2EEE6', mixC(c.inner || '#F2EEE6', '#000000', 0.14), { sx: 3, sy: 0, lw: 3.5 });
    s += chT('M-52 -232 L-16 -130 L-6 -132 L-42 -236Z M56 -232 L22 -130 L12 -132 L48 -236Z', c.fur || '#B9B0A0', mixC(c.fur || '#B9B0A0', '#000000', 0.25), { sx: 2, sy: 0, lw: 3 });
    s += chL('M-100 -24 Q-90 -90 -104 -150 M100 -20 Q92 -90 106 -150', 3, mixC(RS, '#000000', 0.3), 0.7);
    return s;
  }
  // áo chiton / peplos: cổ khoét tròn (nữ cao hơn, nam sâu hơn)
  const nk = c.neckLow != null ? c.neckLow : (c.fem ? -190 : -176);
  let cloth;
  if (c.exomis) cloth = `M-124 0 Q-136 -112 -112 -170 L-60 -112 Q-10 -150 40 -200 L56 -232 Q86 -226 108 -196 L112 -176 Q138 -112 124 0 Q0 30 -124 0Z`;   // áo thợ: một vai (vai phải màn hình có dây), vai kia trần
  else if (F) cloth = `M-118 0 Q-108 -52 -100 -108 Q-96 -150 -104 -178 L-92 -196 Q-52 ${f1(nk + 14)} 0 ${nk} Q52 ${f1(nk + 14)} 92 -196 L106 -178 Q98 -150 102 -108 Q110 -52 120 0 Q0 28 -118 0Z`;
  else cloth = `M-124 0 Q-136 -112 -112 -176 L-94 -196 Q-52 ${f1(nk + 14)} 0 ${nk} Q52 ${f1(nk + 14)} 94 -196 L112 -176 Q138 -112 124 0 Q0 30 -124 0Z`;
  s += chT(cloth, R, RS, { sx: 24, sy: 0, lw: 5 });
  if (c.overfold) s += chT(`M-96 -196 Q-52 ${f1(nk + 14)} 0 ${nk} Q52 ${f1(nk + 14)} 96 -196 L100 -146 Q0 -124 -100 -146Z`, c.overfold, mixC(c.overfold, '#000000', 0.2), { sx: 8, sy: 2, lw: 4 })
    + chL('M-96 -160 Q0 -138 98 -160', 2.4, mixC(c.overfold, '#000000', 0.35), 0.8);
  // nếp vải dọc
  s += chL('M-92 -30 Q-100 -60 -96 -110 M-44 -24 Q-50 -60 -46 -100 M40 -22 Q46 -60 42 -104 M86 -28 Q94 -60 92 -112', 3, mixC(RS, '#000000', 0.28), 0.7);
  // viền chữ triện ở gấu
  if (!c.noMeander) {
    s += chT(`M-${HW} -19 Q0 11 ${HW + 1} -19 L${HW + 1} 0 Q0 ${F ? 28 : 30} -${HW} 0Z`, TR, TRS, { sx: 0, sy: -4, lw: 3.5 });
    s += hlMeander(-(HW - 12), HW - 12, (x) => 15 * (1 - (x / 124) * (x / 124)), mixC(TR, '#2A1A14', 0.55));
  }
  // đai
  if (!c.noBelt) {
    const by = c.beltHigh ? -112 : -66, bw = F ? (c.beltHigh ? 104 : 110) : 130;
    s += chT(`M-${bw} ${by - 8} Q0 ${by + 14} ${bw} ${by - 8} L${bw + 2} ${by + 8} Q0 ${by + 30} -${bw + 2} ${by + 8}Z`, c.sash || TR, mixC(c.sash || TR, '#000000', 0.3), { sx: 0, sy: -5, lw: 4 });
    if (!c.cuirass) s += `<circle cx="10" cy="${by + 10}" r="11" fill="${HL_GOLD}" stroke="${CH_INK}" stroke-width="3"/><circle cx="8" cy="${by + 7}" r="4" fill="#FFF2C0"/>`;
  }
  // ghim vai
  if (!c.exomis && !c.noBrooch) for (const x of [-96, 96]) s += `<circle cx="${x}" cy="-194" r="12" fill="${HL_GOLD}" stroke="${CH_INK}" stroke-width="3.2"/><circle cx="${x - 3}" cy="-197" r="4" fill="#FFF2C0"/>`;
  // himation: khăn choàng chéo, phủ nửa dưới bên trái
  if (c.himation) {
    const H = c.himation, HS = mixC(H, '#000000', 0.25);
    s += chT('M-112 -184 Q-60 -222 -10 -214 L128 -58 Q130 -20 122 6 Q0 34 -124 4 Q-138 -100 -112 -184Z', H, HS, { sx: 22, sy: 4, lw: 5 });
    s += chL('M-86 -186 Q-40 -196 -6 -190 M-100 -150 Q-50 -156 0 -130 M-112 -100 Q-40 -108 40 -60 M-118 -50 Q-30 -62 90 -22', 3, HS, 0.85);
    s += chL('M-8 -214 L128 -58', 5, mixC(H, '#ffffff', 0.35), 0.9);
    if (c.himTrim) s += chL('M-6 -210 L126 -58 L122 4', 6, c.himTrim, 1);
  }
  // áo thợ (Hephaestus): tạp dề da
  if (c.apron) s += chT('M-90 -150 Q0 -164 90 -150 L104 0 Q0 30 -104 0Z', c.apron, mixC(c.apron, '#000000', 0.3), { sx: 12, sy: 0, lw: 4.5 }) + chL('M-60 -150 L-46 -224 M60 -150 L50 -224', 6, mixC(c.apron, '#000000', 0.2)) + chL('M-52 -100 l26 4 M10 -74 l30 -4', 2.4, mixC(c.apron, '#000000', 0.45), 0.8);
  // giáp đồng trơn (cuirass) + vạt da (pteruges)
  if (c.cuirass) {
    const A = c.cuirass, AS = mixC(A, '#000000', 0.28), AH = mixC(A, '#ffffff', 0.4), pc = c.pter || '#8A5A36', pcs = mixC(pc, '#000000', 0.3);
    let tabs = '';
    for (let i = 0; i < 9; i++) { const x0 = -124 + i * 27.6; tabs += chT(`M${f1(x0)} -66 L${f1(x0 + 27.6)} -66 L${f1(x0 + 25)} -10 Q${f1(x0 + 13)} 6 ${f1(x0 + 2)} -10Z`, pc, pcs, { sx: 3, sy: 0, lw: 3 }); }
    s += tabs;
    s += chT('M-104 -192 Q-78 -228 0 -234 Q78 -228 106 -192 Q116 -120 98 -64 Q0 -38 -98 -64 Q-116 -120 -104 -192Z', A, AS, { sx: 16, sy: 0, lw: 5 });
    s += chL('M-72 -152 Q-36 -128 -4 -152 M8 -152 Q42 -128 78 -152', 3, AS) + chL('M2 -150 L2 -64', 2.8, AS, 0.9) + chL('M-62 -112 Q2 -94 66 -112 M-56 -86 Q2 -70 60 -86', 2.6, AS, 0.8);
    s += chL('M-90 -196 Q-70 -212 -40 -216', 4.5, AH, 0.85);
    s += chT('M-122 -190 Q-138 -166 -114 -134 L-86 -158 Q-92 -184 -122 -190Z M124 -190 Q140 -166 116 -134 L88 -158 Q94 -184 124 -190Z', mixC(A, '#ffffff', 0.12), AS, { sx: 5, sy: 3, lw: 4 });
    if (c.cuirassGem) s += `<circle cx="2" cy="-100" r="13" fill="${c.cuirassGem}" stroke="${CH_INK}" stroke-width="3.2"/>`;
    s += chT(`M-130 -78 Q0 -52 130 -78 L132 -56 Q0 -30 -132 -56Z`, c.sash || '#6A3A22', mixC(c.sash || '#6A3A22', '#000000', 0.3), { sx: 0, sy: -4, lw: 3.5 });
  }
  if (c.collarE) {   // vòng cổ Ai Cập (usekh): ba hàng chuỗi hạt hình bán nguyệt
    const rows = [['#2E6FB0', 62], ['#E0B048', 82], ['#C0392B', 102]];
    rows.forEach(([col, r], i) => { s += `<path d="M${-r} -226 A${r} ${r * 0.92} 0 0 0 ${r} -226" fill="none" stroke="${CH_INK}" stroke-width="${i === 2 ? 17 : 16}" stroke-linecap="butt"/><path d="M${-r} -226 A${r} ${r * 0.92} 0 0 0 ${r} -226" fill="none" stroke="${col}" stroke-width="11" stroke-dasharray="9 5"/>`; });
  }
  return s;
}
const _hlBody0 = chBody;
chBody = function (c, T, o = {}) {
  if (c && c.greek) return hlBody(c, T, o);
  return _hlBody0(c, T, o);
};

// ---------- tay trần, ống tay ngắn ----------
const _hlArm0 = chArm;
chArm = function (c, ang, hand, front, T, o = {}) {
  if (!c || !c.greek) return _hlArm0(c, ang, hand, front, T, o);
  const SK = c.skin || CH_SKIN, SS = c.skinS || CH_SKIN_S, col = front ? SK : mixC(SK, SS, 0.5), sh = front ? SS : mixC(SS, '#000000', 0.12);
  const L = CH_AL;
  let s = `<g transform="rotate(${f1(ang)})">`;
  s += chT(`M-33 -22 Q-36 ${f1(L * 0.5)} -22 ${L + 6} L24 ${L + 6} Q38 ${f1(L * 0.5)} 35 -22Z`, col, sh, { sx: -9, sy: 0, lw: 4.5 });
  s += chL(`M-4 ${f1(L * 0.42)} Q2 ${f1(L * 0.5)} -2 ${f1(L * 0.62)}`, 2.4, mixC(sh, '#000000', 0.3), 0.7);   // nếp khuỷu
  if (c.bracer) s += chT(`M-26 ${L - 40} L28 ${L - 40} L26 ${L + 6} L-24 ${L + 6}Z`, c.bracer, mixC(c.bracer, '#000000', 0.28), { sx: 4, sy: 0, lw: 3.5 });
  if (c.greave) { /* bảo vệ cẳng tay (không dùng) */ }
  // ống tay ngắn (chiton) phủ bắp tay
  const sleeve = c.sleeve !== 0 && !c.exomis && !c.cuirass && !c.ren;
  if (sleeve) s += chT('M-40 -28 Q-44 26 -30 48 L34 52 Q48 20 44 -28Z', front ? c.robe : mixC(c.robe, c.robeS, 0.5), c.robeS, { sx: -8, sy: 0, lw: 4 }) + chL('M-30 40 L34 44', 5, c.trim || HL_GOLD);
  if (c.cuirass) s += chT('M-40 -28 Q-46 14 -34 40 L36 44 Q50 14 44 -28Z', c.pter || '#8A5A36', mixC(c.pter || '#8A5A36', '#000000', 0.3), { sx: -6, sy: 0, lw: 3.8 }) + chL('M-34 12 L40 14', 2.4, mixC(c.pter || '#8A5A36', '#000000', 0.5), 0.8);
  if (c.ren) s += chT(`M-44 -28 Q-52 ${f1(L * 0.5)} -40 ${L + 8} L40 ${L + 8} Q54 ${f1(L * 0.5)} 46 -28Z`, front ? c.robe : mixC(c.robe, c.robeS, 0.5), c.robeS, { sx: -10, sy: 0, lw: 4.5 });
  s += `<g transform="translate(0 ${L + 10}) scale(1.25)">` + (hand === 'sword' || hand === 'woodsword' ? `<g transform="rotate(${f1(o.wpn ?? 0)})">${chSword(o.glow || 0, hand === 'woodsword')}</g>` + chHand('fist', c) : chHand(hand, c)) + `</g>`;
  return s + '</g>';
};

// ---------- đầu: vòng nguyệt quế, vương miện, mũ, khăn ----------
function hlHeadX(c, ex, T, o = {}) {
  let b = '', f = '';
  const sw = Math.sin(T * 2.2 + (o.seed || 0));
  const lf = (col, n, pts) => pts.map(([x, y, a], i) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="14" ry="6.2" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${col}" stroke="${CH_INK}" stroke-width="2.4"/>`).join('');
  if (c.curly) {   // tóc xoăn: các cụm tròn dọc viền tóc
    const cols = [c.hair, c.hairS];
    for (let k = 0; k <= 12; k++) {
      const th = (188 - k * 15.5) * Math.PI / 180, x = 14 + 142 * Math.cos(th), y = -112 + 128 * Math.sin(th) * -1;
      if (y > -96) continue;
      f += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${k % 2 ? 23 : 27}" fill="${cols[k % 2 ? 0 : 0]}" stroke="${CH_INK}" stroke-width="4"/>`;
      f += chL(`M${f1(x - 8)} ${f1(y + 4)} q8 -14 16 -2`, 2.4, c.hairS, 0.9);
    }
    f += `<path d="M-60 -226 Q14 -246 96 -222" fill="none" stroke="${c.hair}" stroke-width="30" stroke-linecap="round"/>`;
    f += `<path d="M-60 -226 Q14 -246 96 -222" fill="none" stroke="${CH_INK}" stroke-width="3" opacity="0"/>`;
  }
  if (c.veilG) {   // khăn trùm đầu (Hera, bà mẹ…)
    const V = c.veilG, VS = mixC(V, '#000000', 0.22);
    b += chT(`M-120 -120 Q-176 20 ${f1(-168 + sw * 3)} 190 L-60 190 Q-90 60 -40 -60Z`, V, VS, { sx: 12, sy: 0, lw: 4 });
    f += chT(`M-134 -14 Q-156 -250 14 -258 Q176 -250 164 -14 Q154 -82 108 -112 Q14 -146 -78 -112 Q-122 -84 -134 -14Z`, V, VS, { sx: 12, sy: 8, lw: 4.5 });
    f += chL('M-80 -196 Q-40 -226 20 -226', 2.6, VS, 0.8);
  }
  if (c.laurel) {
    const LC = c.laurel, pts = [];
    for (let k = 0; k <= 14; k++) { const th = (193 - k * 14.4) * Math.PI / 180, x = 14 + 134 * Math.cos(th), y = -118 - 112 * Math.sin(th); if (y > -100) continue; pts.push([x, y, (k % 2 ? 1 : -1) * 28 + (90 - th * 180 / Math.PI) * -1 + 90]); }
    f += lf(LC, pts.length, pts);
    f += chL('M-114 -108 Q-110 -218 14 -228 Q128 -218 134 -112', 3, mixC(LC, '#000000', 0.45), 0.9);
  }
  if (c.diadem) {
    const D = c.diadem, DS = mixC(D, '#000000', 0.28);
    f += chT('M-114 -136 Q14 -176 140 -136 L142 -118 Q14 -158 -116 -118Z', D, DS, { sx: 0, sy: -3, lw: 3.8 });
    if (c.crownTall) f += chT('M-96 -150 L-84 -214 L-56 -170 L-30 -234 L-2 -176 L24 -246 L50 -176 L78 -232 L98 -168 L112 -210 L124 -146 Q14 -176 -96 -150Z', D, DS, { sx: 4, sy: 4, lw: 3.8 });
    f += `<circle cx="14" cy="-150" r="9" fill="${c.diademGem || '#C0392B'}" stroke="${CH_INK}" stroke-width="2.6"/>`;
  }
  if (c.ghelm) {   // mũ trận Hy Lạp: vòm đồng + dải trán + má + mào lông
    const g = c.ghelm, H = g.c || HL_BRONZE, HS = mixC(H, '#000000', 0.3), P = g.plume;
    if (P) {
      f += chT(`M-76 -250 Q-70 -332 ${f1(30 + sw * 4)} -338 Q132 -330 164 -236 L150 -218 Q112 -286 ${f1(30 + sw * 3)} -278 Q-16 -278 -52 -226Z`, P, mixC(P, '#000000', 0.28), { sx: 5, sy: 6, lw: 4 });
      f += chL(`M-52 -262 Q-40 -312 ${f1(30 + sw * 3)} -314 M-28 -250 Q-4 -296 ${f1(52 + sw * 3)} -298 M0 -244 Q36 -284 ${f1(86 + sw * 3)} -282`, 2.4, mixC(P, '#000000', 0.45), 0.8);
    }
    f += chT('M-128 -112 Q-138 -262 14 -270 Q168 -262 154 -112 Q154 -124 150 -134 Q14 -172 -124 -134Z', H, HS, { sx: 14, sy: 8, lw: 5 });
    f += chL('M-90 -226 Q-30 -258 40 -250', 3.6, mixC(H, '#ffffff', 0.5), 0.9);
    f += chT('M-132 -140 Q14 -184 156 -140 L158 -116 Q14 -160 -134 -116Z', mixC(H, '#ffffff', 0.12), HS, { sx: 0, sy: -3, lw: 4 });
    if (g.cheek !== 0) f += chT('M-132 -118 L-138 -14 Q-116 6 -100 -8 L-106 -112Z M158 -114 L162 -14 Q140 6 124 -8 L130 -108Z', H, HS, { sx: 6, sy: 0, lw: 4 });
    if (g.cheek !== 0) f += chL('M-122 -100 L-124 -30 M146 -96 L148 -30', 2.4, mixC(H, '#ffffff', 0.4), 0.8);
  }
  if (c.petasos) {   // mũ rộng vành có cánh nhỏ (Hermes)
    const P = c.petasos, PS = mixC(P, '#000000', 0.25);
    if (!c.pNoWing) b += chT(`M-124 -130 Q-196 -190 ${f1(-214 + sw * 2)} -226 Q-170 -176 -110 -156Z`, '#FBFBF6', '#D8D8CE', { sx: 4, sy: 0, lw: 3.5 }) + chT(`M-120 -112 Q-200 -140 ${f1(-232 + sw * 2)} -170 Q-176 -118 -114 -96Z`, '#FBFBF6', '#D8D8CE', { sx: 4, sy: 0, lw: 3.5 });
    f += chT('M-118 -132 Q-104 -262 14 -270 Q132 -262 148 -132 Q14 -168 -118 -132Z', P, PS, { sx: 12, sy: 8, lw: 5 });
    f += chT('M-182 -142 Q14 -208 204 -142 L196 -120 Q14 -176 -176 -120Z', mixC(P, '#ffffff', 0.12), PS, { sx: 0, sy: -3, lw: 4.5 });
  }
  if (c.phrygian) {   // mũ Phrygia (người Troy): chóp mềm gập về trước
    const P = c.phrygian, PS = mixC(P, '#000000', 0.25);
    f += chT('M-122 -126 Q-132 -250 -10 -276 Q60 -292 128 -262 Q172 -240 186 -196 Q146 -224 108 -214 Q132 -170 146 -128 Q14 -166 -122 -126Z', P, PS, { sx: 14, sy: 8, lw: 5 });
    f += chL('M-100 -182 Q-20 -226 90 -200 M-90 -150 Q0 -190 120 -160', 2.6, PS, 0.8);
    f += chT('M-128 -138 Q14 -176 152 -138 L154 -116 Q14 -154 -130 -116Z', c.phryBand || HL_GOLD, mixC(c.phryBand || HL_GOLD, '#000000', 0.28), { sx: 0, sy: -3, lw: 3.8 });
  }
  if (c.pilos) {   // mũ nỉ hình chóp của Odysseus
    const P = c.pilos, PS = mixC(P, '#000000', 0.28);
    f += chT('M-124 -128 Q-112 -264 10 -312 Q22 -318 30 -310 Q144 -262 150 -128 Q14 -168 -124 -128Z', P, PS, { sx: 14, sy: 8, lw: 5 });
    f += chT('M-132 -142 Q14 -186 160 -142 L162 -118 Q14 -164 -134 -118Z', mixC(P, '#ffffff', 0.1), PS, { sx: 0, sy: -3, lw: 4 });
    f += chL('M-70 -220 Q-20 -250 20 -296', 2.4, PS, 0.8);
  }
  if (c.nemes) {   // khăn pharaoh sọc xanh–vàng + rắn hổ mang trán
    const N1 = c.nemes, N2 = HL_GOLD;
    b += chT('M-118 -120 Q-176 -30 -168 96 L-96 84 L-98 -40Z M140 -120 Q198 -30 190 96 L118 84 L120 -40Z', N1, mixC(N1, '#000000', 0.3), { sx: 8, sy: 0, lw: 4 });
    b += [-150, -130, -110, 150, 170, 130].map((x, i) => '').join('');
    f += chT('M-130 -20 Q-150 -250 14 -258 Q178 -250 158 -20 Q146 -90 112 -118 Q14 -150 -84 -118 Q-120 -90 -130 -20Z', N1, mixC(N1, '#000000', 0.28), { sx: 14, sy: 8, lw: 4.5 });
    for (let k = -3; k <= 3; k++) f += chL(`M${14 + k * 34} -246 L${14 + k * 46} -142`, 5, N2, 0.95);
    f += chT('M-124 -140 Q14 -178 152 -140 L154 -122 Q14 -160 -126 -122Z', N2, HL_GOLDS, { sx: 0, sy: -3, lw: 3.5 });
    f += chT('M4 -158 Q14 -200 24 -158 Q14 -146 4 -158Z', '#2E8B57', '#1E6A3E', { lw: 3 });
  }
  if (c.beret) {   // mũ nồi dẹt của học giả Phục Hưng
    const B = c.beret, BS = mixC(B, '#000000', 0.3);
    f += chT('M-134 -128 Q-160 -250 14 -266 Q190 -250 164 -128 Q14 -164 -134 -128Z', B, BS, { sx: 12, sy: 8, lw: 5 });
    f += chT('M-158 -154 Q14 -204 188 -154 L178 -130 Q14 -178 -150 -130Z', mixC(B, '#ffffff', 0.08), BS, { sx: 0, sy: -3, lw: 4.2 });
  }
  if (c.eyeBand) {   // khăn bịt mắt (người hát rong mù, Stesichorus bị mù)
    const B = c.eyeBand;
    b += chT(`M-108 -2 Q-148 ${f1(20 + sw * 3)} ${f1(-170 + sw * 6)} 70 L-146 78 Q-124 40 -104 40Z`, B, mixC(B, '#000000', 0.2), { sx: 3, sy: 0, lw: 3 });
    f += chT('M-110 -4 Q14 -22 136 -6 L136 50 Q14 40 -112 56Z', B, mixC(B, '#000000', 0.16), { sx: 0, sy: -4, lw: 4 });
    f += chL('M-70 12 Q14 6 98 12', 2.2, mixC(B, '#000000', 0.3), 0.7);
  }
  if (c.bandHair) {   // dải buộc tóc (fillet) quanh đầu
    f += chT('M-128 -118 Q14 -164 156 -118 L158 -102 Q14 -148 -130 -102Z', c.bandHair, mixC(c.bandHair, '#000000', 0.25), { sx: 0, sy: -3, lw: 3.2 });
  }
  return [b, f];
}
const _hlHead0 = chHead;
chHead = function (c, ex, T, o = {}) {
  const [hb, hf] = _hlHead0(c, ex, T, o);
  if (!c) return [hb, hf];
  const [xb, xf] = hlHeadX(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- đồ cầm tay ----------
const _hlHand0 = chHand;
chHand = function (kind, c) {
  const fist = _hlHand0('fist', c), R = `rotate(${TDK_ROT})`;
  const g = (inner, under = 0) => under ? `<g transform="${R}">${inner}</g>` + fist : fist + `<g transform="${R}">${inner}</g>`;
  switch (kind) {
    case 'lightning': {   // tia sét của Zeus: zigzag vàng–trắng, tỏa sáng
      const d = 'M0 -10 L26 60 L6 66 L34 130 L10 134 L40 200 L-14 120 L8 116 L-18 56 L4 52Z';
      return g(bloom(`<path d="${d}" fill="#FFF6B0"/>`, '#FFE060', 0.7) + chT(d, '#FFE45A', '#E0B030', { sx: 4, sy: 0, lw: 4 }) + chL('M8 24 L20 62 M12 98 L28 132', 3, '#FFFFFF', 0.9), 1);
    }
    case 'hspear': { const L = 250;
      return g(chT(`M${-L} -8 L${L} -8 L${L} 8 L${-L} 8Z`, '#8A6038', '#6A4220', { sx: 0, sy: 4, lw: 3.5 }) + chT(`M${L} -16 Q${L + 52} -22 ${L + 96} 0 Q${L + 52} 22 ${L} 16Z`, '#DCE2EA', '#A6B0BC', { sx: 0, sy: 3, lw: 3.8 }) + chL(`M${L + 6} 0 L${L + 80} 0`, 2.2, '#8E96A0', 0.8) + chT(`M${-L} -10 L${-L - 30} 0 L${-L} 10Z`, '#9AA0A8', '#6A7078', { lw: 3 }), 1); }
    case 'aspis': { // khiên tròn hoplite
      const A = (c && c.shield) || HL_BRONZE, AS = mixC(A, '#000000', 0.28);
      return fist + `<g transform="translate(70 80) ${R}">` + chT('M-100 0 a100 100 0 1 1 200 0 a100 100 0 1 1 -200 0Z', A, AS, { sx: 12, sy: 10, lw: 6 }) + `<circle r="74" fill="none" stroke="${AS}" stroke-width="4"/>` + (c && c.shieldEmblem ? c.shieldEmblem : `<circle r="26" fill="${mixC(A, '#ffffff', 0.25)}" stroke="${CH_INK}" stroke-width="3.5"/>`) + chL('M-60 -60 Q-70 -20 -60 20', 5, mixC(A, '#ffffff', 0.55), 0.8) + `</g>`;
    }
    case 'scroll': return g(chT('M-46 10 h92 v72 h-92Z', '#F2E8CC', '#D8C9A0', { sx: 5, sy: 4, lw: 4 }) + chT('M-52 4 h104 v16 h-104Z M-52 74 h104 v16 h-104Z', '#B8865A', '#8A6038', { lw: 3.5 }) + chL('M-34 36 h68 M-34 52 h68 M-34 66 h44', 2.6, '#8A6A40', 0.9), 0);
    case 'bowl': return g(chT('M-48 20 h96 q-4 56 -48 62 q-44 -6 -48 -62Z', '#8A9098', '#5E646C', { sx: 6, sy: 0, lw: 4.2 }) + chT('M-48 20 h96 v10 h-96Z', '#B0B6BE', '#7A8088', { lw: 3 }) + `<ellipse cx="0" cy="22" rx="42" ry="7" fill="#B02A2A" stroke="${CH_INK}" stroke-width="2.5"/>`, 0);
    case 'lyre': return g(chT('M-60 20 Q-70 110 0 124 Q70 110 60 20 L40 20 Q36 90 0 98 Q-36 90 -40 20Z', '#B8865A', '#8A6038', { sx: 6, sy: 0, lw: 4 }) + chT('M-66 14 h132 v12 h-132Z', '#D9B45A', '#B08428', { lw: 3.5 }) + chL('M-26 26 V96 M-8 26 V100 M10 26 V100 M28 26 V96', 2.2, '#F2E8CC', 0.95) + chT('M-60 20 Q-100 -30 -66 -64 L-52 -56 Q-72 -26 -46 14Z M60 20 Q100 -30 66 -64 L52 -56 Q72 -26 46 14Z', '#B8865A', '#8A6038', { lw: 3.5 }), 0);
    case 'caduceus': return g(chT('M-5 -60 L5 -60 L5 240 L-5 240Z', '#8A6038', '#6A4220', { lw: 3.5 }) + chL('M0 20 Q-30 50 0 80 Q30 110 0 140 Q-30 170 0 196', 5, '#3A8A4A') + chT('M-4 -60 Q-70 -100 -92 -60 Q-60 -64 -4 -40Z M4 -60 Q70 -100 92 -60 Q60 -64 4 -40Z', '#FBFBF6', '#D8D8CE', { lw: 3.5 }) + `<circle cx="0" cy="-66" r="9" fill="${HL_GOLD}" stroke="${CH_INK}" stroke-width="3"/>`, 1);
    case 'chains': return g([0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${i % 2 ? 8 : -8}" cy="${30 + i * 34}" rx="14" ry="20" fill="none" stroke="${CH_INK}" stroke-width="12"/><ellipse cx="${i % 2 ? 8 : -8}" cy="${30 + i * 34}" rx="14" ry="20" fill="none" stroke="#9AA0A8" stroke-width="6"/>`).join(''), 1);
    case 'hammer': return g(chT('M-7 -40 L7 -40 L7 240 L-7 240Z', '#7A5A36', '#5A402A', { lw: 3.5 }) + chT('M-60 -90 h120 v56 h-120Z', '#6A7078', '#3E444C', { sx: 4, sy: 5, lw: 4.5 }) + chL('M-50 -80 h100', 3, '#B0B6BE', 0.7), 1);
    case 'xiphos': return g(chT('M-6 -30 L6 -30 L6 30 L-6 30Z', '#4A3A2A', null, { lw: 3.5 }) + chT('M-30 28 h60 v12 h-60Z', HL_GOLD, HL_GOLDS, { lw: 3.2 }) + chT('M-14 40 Q-34 130 -10 220 L0 250 L10 220 Q34 130 14 40Z', '#E4EAF0', '#AEB8C4', { sx: 0, sy: 4, lw: 4 }) + chL('M0 48 L0 236', 2.2, '#FFFFFF', 0.8), 1);
    case 'scales': return g(chL('M0 -30 L0 40 M-70 56 L70 56', 5, '#8A6038') + [-70, 70].map(x => chL(`M${x} 56 L${x - 22} 130 M${x} 56 L${x + 22} 130`, 2.4, '#8A6038') + chT(`M${x - 34} 130 h68 q-6 22 -34 24 q-28 -2 -34 -24Z`, HL_GOLD, HL_GOLDS, { lw: 3.4 })).join(''), 1);
    case 'sceptre': return g(chT('M-6 -30 L6 -30 L6 250 L-6 250Z', '#8A6038', '#6A4220', { lw: 3.5 }) + chT('M-16 -52 a16 16 0 1 1 32 0 a16 16 0 1 1 -32 0Z', HL_GOLD, HL_GOLDS, { lw: 3.5 }) + chT('M-12 8 h24 l-4 16 h-16Z', HL_GOLD, HL_GOLDS, { lw: 3 }), 1);
    case 'torch': return g(chT('M-6 -20 L6 -20 L6 200 L-6 200Z', '#7A5A36', '#5A402A', { lw: 3.5 }) + bloom(chT('M-26 -20 Q-36 -90 0 -130 Q36 -90 26 -20Z', '#FF9A30', '#E05A20', { lw: 3.5 }), '#FFB040', 0.6) + chT('M-12 -24 Q-14 -70 0 -92 Q14 -70 12 -24Z', '#FFE07A', null, { lw: 0 }), 1);
  }
  return _hlHand0(kind, c);
};

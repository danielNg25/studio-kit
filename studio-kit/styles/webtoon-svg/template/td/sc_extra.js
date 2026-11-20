// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT PHỤ MỚI — TÂY DU KÝ PHẦN 2 (2026-10-19, CHỜ DUYỆT C3). Nạp SAU chars_tdk2.js.
// Cùng kiểu chibi đã duyệt C2: đầu to (headK 1.38; trẻ con 1.55), má hồng, tô phẳng 2 tông + viền mực.
// Không sửa chars_tdk2.js: bọc thêm chHead / chBody / chHand với thuộc tính riêng của file này:
//   animalEars('tiger'|'bear') · stripes · cheekFur · hunterCap · finHat · scaleCheek · pointEars · bigNose · sleepZ · plaster (đầu)
//   furVest · waveRobe (thân) · tay cầm: bundle, tray, bow, crutch
function exHeadX(c, ex, T, o = {}) {
  const sw = Math.sin(T * 2.2 + (o.seed || 0));
  let b = '', f = '';
  if (c.animalEars) {   // tai tròn trên đỉnh đầu (hổ / gấu)
    const SK = c.skin, SS = c.skinS, IN = c.earIn || '#F2B0A0';
    for (const [x, y] of [[-84, -168], [124, -170]]) {
      b += `<circle cx="${x}" cy="${y}" r="42" fill="${SK}" stroke="${CH_INK}" stroke-width="5"/><circle cx="${x + (x < 0 ? 6 : -6)}" cy="${y + 6}" r="22" fill="${IN}"/>`;
      if (c.animalEars === 'tiger') b += chL(`M${x - 22} ${y - 30} q10 -8 24 -4`, 3, SS, 0.9);
    }
  }
  if (c.pointEars) {   // tai nhọn dài của tiểu yêu
    const SK = c.skin, SS = c.skinS;
    b += chT(`M-106 -30 Q-190 -96 ${-240 + sw * 5} -120 Q-200 -40 -112 40Z`, SK, SS, { sx: 8, sy: 0, lw: 4.5 }) + chL(`M-130 -20 Q-182 -62 ${-208 + sw * 3} -96`, 3, '#C98F78');
    b += chT(`M148 -30 Q232 -96 ${282 - sw * 5} -120 Q242 -40 154 40Z`, SK, SS, { sx: -8, sy: 0, lw: 4.5 }) + chL(`M172 -20 Q224 -62 ${250 - sw * 3} -96`, 3, '#C98F78');
  }
  if (c.hunterCap) {   // mũ da thú thợ săn: vòm nâu + viền lông xù + lông chim
    const H = c.hunterCap, HS = mixC(H, '#000000', 0.28);
    f += chT('M-108 -128 Q-104 -246 14 -252 Q132 -246 136 -128 Q14 -156 -108 -128Z', H, HS, { sx: 8, sy: 6, lw: 4.5 });
    let fur = 'M-120 -130 '; for (let i = 0; i <= 8; i++) fur += `Q${-120 + i * 33 + 16} ${-110 + (i % 2 ? 0 : 20)} ${-120 + (i + 1) * 33} ${-130 + Math.sin(i) * 3} `;
    f += chT(fur + 'L148 -150 Q14 -184 -120 -150Z', '#EDE4D0', '#C8BCA2', { sx: 0, sy: 4, lw: 3.8 });
    f += chT(`M60 -230 Q${96 + sw * 4} -292 ${150 + sw * 6} -300 Q${120 + sw * 4} -260 84 -222Z`, '#C0392B', '#8E2418', { lw: 3.2 }) + chL(`M72 -226 Q${110 + sw * 4} -270 ${140 + sw * 5} -292`, 2.4, '#F2A090');
  }
  if (c.finHat) {   // nón vây thuỷ thần: vòm xanh + ba vây nhọn + vây tai
    const H = c.finHat, HS = mixC(H, '#000000', 0.28);
    b += chT('M-106 -90 L-180 -120 L-168 -60 L-110 -50Z M134 -90 L208 -120 L196 -60 L138 -50Z', mixC(H, '#ffffff', 0.25), HS, { lw: 3.5 });
    f += chT('M-110 -134 Q-106 -226 14 -232 Q134 -226 138 -134 Q14 -164 -110 -134Z', H, HS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-70 -206 Q-84 -272 -40 -296 Q-36 -250 -16 -222Z M-20 -226 Q-18 -300 14 -336 Q46 -300 48 -226Z M52 -222 Q72 -250 76 -296 Q120 -270 98 -206Z', mixC(H, '#ffffff', 0.3), HS, { sx: 4, sy: 4, lw: 3.8 });
    f += chT('M-114 -138 Q14 -172 142 -138 L144 -114 Q14 -150 -116 -114Z', '#E8F4F8', '#B8D4DC', { lw: 3.5 });
    f += [-70, -20, 30, 80].map((x, i) => chL(`M${x} ${-150 + (i % 2) * 4} q10 8 20 0`, 2.6, '#6AA0B8', 0.95)).join('');
  }
  if (c.scaleCheek) f += [[-92, 52], [-76, 74], [-98, 82], [124, 54], [108, 76], [130, 84]].map(([x, y]) => `<path d="M${x - 9} ${y} q9 -12 18 0 q-9 12 -18 0Z" fill="${c.scaleCheek}" opacity="0.75" stroke="${CH_INK}" stroke-width="1.6"/>`).join('');
  if (c.stripes) {   // vằn hổ: chữ 王 trên trán + vằn má
    const S = c.stripes;
    f += chL('M-34 -150 q50 -14 96 0 M-22 -126 q40 -10 72 0 M-10 -102 q30 -6 48 0 M14 -170 v86', 7, S) + chL('M-100 40 l36 8 M-104 66 l38 2 M-96 92 l32 -6 M128 40 l-36 8 M132 66 l-38 2 M124 92 l-32 -6', 5.5, S);
  }
  if (c.cheekFur) {   // lông má xù hai bên (mõm hổ)
    const M = c.cheekFur, MS = mixC(M, '#000000', 0.18);
    f += chT('M-96 44 Q-150 52 -138 84 Q-142 100 -110 106 Q-100 122 -70 112 Q-50 100 -64 72Z', M, MS, { sx: 4, sy: 3, lw: 4 });
    f += chT('M128 40 Q184 52 172 84 Q176 100 144 106 Q134 122 104 112 Q84 100 98 72Z', M, MS, { sx: -4, sy: 3, lw: 4 });
    f += `<path d="M10 50 L26 50 L18 62Z" fill="#D8584A" stroke="${CH_INK}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  if (c.bigNose) {   // mũi củ hành của tiểu yêu
    const N = c.bigNose, NS = mixC(N, '#000000', 0.2);
    f += chT('M2 28 Q-14 50 6 70 Q30 80 44 62 Q42 36 22 28Z', N, NS, { sx: 5, sy: 4, lw: 4 }) + `<circle cx="14" cy="42" r="5" fill="#FFFFFF" opacity="0.55"/>`;
  }
  if (c.sores) {   // ghẻ lở: mảng đỏ có đầu vàng trên da đầu + má + cổ (nhà sư ghẻ lở)
    const R = c.sores, Y = '#F0D070', sc = (x, y, rx, ry, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><ellipse rx="${rx}" ry="${ry}" fill="${R}" stroke="${CH_INK}" stroke-width="2.6"/><ellipse cx="${f1(-rx * 0.18)}" cy="${f1(-ry * 0.2)}" rx="${f1(rx * 0.45)}" ry="${f1(ry * 0.42)}" fill="${Y}"/><circle cx="${f1(-rx * 0.3)}" cy="${f1(-ry * 0.35)}" r="${f1(Math.min(rx, ry) * 0.16)}" fill="#fff" opacity="0.7"/></g>`;
    f += sc(-46, -130, 20, 14, -20) + sc(26, -152, 17, 12, 10) + sc(68, -112, 13, 10, 25) + sc(-8, -96, 11, 8, 0);   // da đầu trọc (vòm đầu hẹp dần lên đỉnh: giữ trong x -60..90, y -165..-85)
    f += sc(-58, 58, 16, 12, 15) + sc(92, 66, 13, 10, -10) + sc(-30, -62, 9, 7, 0) + sc(62, -62, 9, 7, 0);   // má + trán
    f += `<path d="M-56 -124 l12 8 M32 -148 l8 8 M72 -108 l8 6" stroke="${CH_INK}" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  }
  if (c.plaster) f += `<g transform="rotate(-18 -64 70)"><rect x="-96" y="58" width="64" height="26" rx="6" fill="#F4E4C0" stroke="${CH_INK}" stroke-width="3.5"/><path d="M-72 58 v26 M-56 58 v26" stroke="#D8C498" stroke-width="3"/></g>`;
  if (c.sleepZ) {   // ngủ gật: bong bóng mũi phồng xẹp + chữ z bay lên
    const u = (Math.sin(T * 1.6) + 1) / 2, r = 10 + u * 20;
    f += `<circle cx="${f1(40 + r * 0.6)}" cy="${f1(66 + r * 0.2)}" r="${f1(r)}" fill="#DDF2FF" opacity="0.8" stroke="${CH_INK}" stroke-width="3"/><circle cx="${f1(40 + r * 0.2)}" cy="${f1(60)}" r="${f1(r * 0.22)}" fill="#fff"/>`;
    for (let k = 0; k < 3; k++) { const ph = ((T * 0.7 + k / 3) % 1); f += `<text x="${f1(170 + ph * 40)}" y="${f1(-140 - ph * 130)}" font-size="${f1(46 + k * 6)}" font-weight="900" font-family="${typeof FH !== 'undefined' ? FH : 'sans-serif'}" fill="#FFFFFF" stroke="${CH_INK}" stroke-width="6" paint-order="stroke" opacity="${f1(1 - ph * 0.7)}">z</text>`; }
  }
  return [b, f];
}
const _exHead0 = chHead;
chHead = function (c, ex, T, o = {}) {
  const r = _exHead0(c, ex, T, o);
  if (!c || c.dragonFace || !(c.animalEars || c.pointEars || c.hunterCap || c.finHat || c.scaleCheek || c.stripes || c.cheekFur || c.bigNose || c.plaster || c.sleepZ || c.sores)) return r;
  let [hb, hf] = r;
  const [xb, xf] = exHeadX(c, ex, T, o);
  if (c.headK) { const w = (x) => `<g transform="translate(14 132) scale(${c.headK}) translate(-14 -132)">${x}</g>`; return [w(xb) + hb, hf + w(xf)]; }
  return [xb + hb, hf + xf];
};

// ---------- thân ----------
const _exBody0 = chBody;
chBody = function (c, T, o = {}) {
  let s = _exBody0(c, T, o);
  if (c && c.furVest) {   // áo gi-lê da thú vằn, viền lông
    const F = c.furVest, FS = mixC(F, '#000000', 0.28);
    s += chT('M-132 -196 Q-70 -232 18 -214 Q96 -206 128 -168 Q142 -84 132 4 L-132 4 Q-146 -90 -132 -196Z', F, FS, { sx: 12, sy: 0, lw: 5 });
    s += chT('M-34 -216 L16 -146 L66 -212 Q16 -230 -34 -216Z', c.inner || '#E8D8B8', mixC(c.inner || '#E8D8B8', '#000000', 0.12), { lw: 3.5 });
    s += chL('M-110 -170 l34 20 M-96 -120 l40 12 M-100 -66 l40 8 M-92 -20 l36 0 M110 -160 l-34 22 M104 -110 l-40 12 M108 -56 l-40 8 M100 -12 l-36 2', 9, c.furStripe || CH_INK, 0.9);
    s += chL('M-132 -196 Q-146 -90 -132 4 M128 -168 Q142 -84 132 4', 6, '#EDE4D0');
  }
  if (c && c.waveRobe) {   // sóng vỗ trên áo + gấu áo lượn
    const W = c.waveRobe;
    for (let k = 0; k < 4; k++) s += chL(`M-110 ${-150 + k * 36} q22 -16 44 0 q22 16 44 0 q22 -16 44 0 q22 16 44 0 q22 -16 44 0`, 4, W, 0.9);
  }
  return s;
};

// ---------- tay cầm ----------
const _exHand0 = chHand;
chHand = function (kind, c) {
  const fist = _exHand0('fist', c), R = `rotate(${TDK_ROT})`;
  const g = (inner, under = 0) => under ? `<g transform="${R}">${inner}</g>` + fist : fist + `<g transform="${R}">${inner}</g>`;
  switch (kind) {
    case 'bundle':   // gậy gánh hành lý: bọc vải buộc ở đầu
      return g(chT('M-6 -40 L6 -40 L6 250 L-6 250Z', '#8A6A3A', '#6A4E28', { sx: 0, sy: 3, lw: 3.5 })
        + chT('M-62 236 Q-82 300 -34 322 Q16 338 56 314 Q96 286 66 236 Q0 220 -62 236Z', '#B8A27A', '#8E7A58', { sx: 8, sy: 4, lw: 4 })
        + chL('M-56 262 Q0 286 62 262 M-30 240 Q-24 290 -34 318', 3, '#6A5638', 0.9) + `<path d="M-14 232 q14 -16 28 0 q-14 8 -28 0Z" fill="#8A5A3A" stroke="${CH_INK}" stroke-width="3"/>`, 1);
    case 'tray':   // khay tròn bưng ngang
      return g(chT('M-86 -6 Q0 18 86 -6 L74 10 Q0 34 -74 10Z', '#D8A858', '#A87A34', { sx: 0, sy: 4, lw: 4 }) + chT('M-86 -6 Q0 -24 86 -6 Q0 14 -86 -6Z', '#F2D698', '#C8A458', { lw: 3.5 }) + chL('M-50 -6 Q0 6 50 -6', 2.4, '#C8A458', 0.9), 1);
    case 'bow':   // cung vác: thân cung cong + dây
      return g(chT('M-10 -150 Q-96 30 -10 210 L2 204 Q-72 30 2 -144Z', '#8A5A34', '#5E3A1E', { sx: 0, sy: 3, lw: 3.8 }) + chL('M-4 -150 L-4 208', 2.2, '#F2EEE2') + chT('M-6 40 h12 v24 h-12Z', '#C0392B', '#8E2418', { lw: 2.8 }), 1);
    case 'crutch':   // nạng gỗ chữ T
      return g(chT('M-6 -20 L6 -20 L6 250 L-6 250Z', '#8A5A2A', '#6A4220', { sx: 0, sy: 3, lw: 3.5 }) + chT('M-40 -34 Q0 -50 40 -34 L38 -18 Q0 -34 -38 -18Z', '#A06A34', '#7A4E24', { lw: 3.5 }) + chT('M-10 56 Q0 70 10 56 L10 70 Q0 82 -10 70Z', '#EDE4D0', '#C8BCA2', { lw: 2.5 }), 1);
  }
  return _exHand0(kind, c);
};

// ---------- DANH SÁCH NHÂN VẬT PHỤ ----------
const _exKid = (o) => Object.assign({ male: 1, headK: 1.55, bulk: 0.7, chubby: 1, cheeks: '#F4A08E', skin: '#F8DCC6', skinS: '#E2B898', hair: '#1E1A1E', hairS: '#0E0C10', brow: '#1E1A1E', kidEyes: '#5A3A22', iris: ['#2A1E16', '#6A4A30'], trim: TDK_G, inner: '#FFF6E6' }, o);

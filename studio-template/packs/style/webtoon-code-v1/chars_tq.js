// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT TAM QUỐC — TẬP gia-cat-luong (kênh kênh mẫu, 2026-10-17, CHỜ DUYỆT bước C2).
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js + chars_kd2.js + chars_kd3.js. Cùng kiểu webtoon-code-v1: tô phẳng 2 tông + viền mực,
// mặt/tóc không chi tiết hơn áo, nửa thân không chân, đứng yên KHÔNG hiện tay (tay chỉ hiện khi cầm đồ / làm động tác).
// Tái dùng sẵn có: armor/armorGem, helmet/helmetGem, cape, bagua, bushyBrow (chars_tdk.js), moustache (chars_kd3.js), scholar, headband, knot, bun, chubby, jaw, sharp, old (chars.js).
// Thuộc tính mới (chỉ là mũ/tóc/phụ kiện, thêm vào đầu/thân như chars_kd3.js — KHÔNG sửa file chung):
//   luanCan: '#màu'   khăn Luân cân (mũ vải mềm đỉnh phồng, đai ở trán, 2 dải rủ sau gáy); luanTrim = màu đai/viền
//   kimQuan: '#vàng'  mũ kim quan nhỏ trên búi tóc (Chu Du, Tôn Quyền, Lưu Bị); kimFeather: '#màu' = hai chiếc lông trĩ dài cong ra sau (chỉ Chu Du)
//   quanMao: '#màu'   mũ quan Tào Tháo (nền đen + tấm bản ngang vểnh + đai vàng + ngọc trước trán)
//   phacDau: '#màu'   mũ phác đầu (mũ vải đen quấn, nút trên đỉnh); phacTails = 1 → hai dải cánh sau gáy (Tư Mã Ý, văn thần)
//   namMan: '#màu'    tóc xù Nam Man (bờm gai dựng quanh đầu) + khuyên tai vàng; manBand = màu đai trán, bandFangs = răng nanh trên đai
//   earBig: 1        tai to rủ dái (Lưu Bị)
//   hairPin: '#vàng'  trâm cài tóc + chuỗi hạt rủ (nữ)
//   leopard: '#màu'   hoa văn da báo trên áo (Mạnh Hoạch)
// Đồ cầm tay mới (hand kind): 'fan' = quạt lông vũ trắng (羽扇) · 'pouch' = túi gấm.

function tqHeadX(c, ex, T, o = {}) {
  const seed = o.seed || 0, sw = Math.sin(T * 2.2 + seed);
  let b = '', f = '';
  const dk = (col, k = 0.25) => mixC(col, '#000000', k), lt = (col, k = 0.25) => mixC(col, '#ffffff', k);
  if (c.earBig) {   // tai to rủ dái, thò ra ngoài mặt trái
    b += chT('M-96 -26 Q-176 -66 -186 8 Q-190 70 -150 112 Q-116 124 -100 70Z', c.skin || CH_SKIN, c.skinS || CH_SKIN_S, { sx: 8, sy: 2, lw: 4.5 });
    b += chL('M-112 -4 Q-150 -16 -150 24 Q-148 60 -126 74', 3, '#C98F78', 0.8);
  }
  if (c.namMan) {   // tóc xù Nam Man: bờm gai dựng quanh đỉnh đầu + khuyên tai vàng
    const H = c.namMan, HS = dk(H, 0.4);
    const N = 11, cx0 = 4, cy0 = -96, A = 150, Bv = 146;
    for (let i = 0; i < N; i++) {
      const th = (172 - i * (164 / (N - 1))) * Math.PI / 180, d = 0.17, L = (i % 2 ? 64 : 104) + (i === 5 ? 20 : 0), k = sw * (i % 2 ? 5 : -5);
      const P = (t, r) => `${f1(cx0 + (A + r) * Math.cos(t))} ${f1(cy0 - (Bv + r) * Math.sin(t))}`;
      f += chT(`M${P(th - d, -20)} L${f1(cx0 + (A + L) * Math.cos(th) + k)} ${f1(cy0 - (Bv + L) * Math.sin(th) + k * 0.6)} L${P(th + d, -20)}Z`, H, HS, { sx: 4, sy: 3, lw: 3.8 });
    }
    f += chT('M-128 -10 Q-150 -200 6 -234 Q152 -246 158 -90 Q160 -50 146 -14 Q140 -84 104 -116 Q72 -138 26 -128 Q20 -150 12 -158 Q2 -136 -24 -130 Q-66 -132 -94 -102 Q-110 -72 -110 -10 Q-118 -14 -128 -10Z', H, HS, { sx: 14, sy: 10, lw: 4.5 });
    f += `<circle cx="-136" cy="64" r="22" fill="none" stroke="${CH_INK}" stroke-width="11"/><circle cx="-136" cy="64" r="22" fill="none" stroke="#E2C25A" stroke-width="6"/>`;
    const MB = c.manBand || '#8E3A24';
    f += chT('M-132 -100 Q14 -150 158 -100 L160 -72 Q14 -122 -134 -72Z', MB, dk(MB, 0.3), { sx: 0, sy: -4, lw: 3.8 });
    if (c.bandFangs) for (const x of [-70, -22, 28, 78]) f += chT(`M${x - 11} -118 L${x} -78 L${x + 11} -118Z`, '#F6F0DC', '#D6CDB0', { sx: 2, sy: 2, lw: 2.8 });
    // dải da buộc sau gáy
    b += chT(`M-130 -90 Q${f1(-186 + sw * 7)} -80 ${f1(-214 + sw * 10)} -20 L${f1(-196 + sw * 10)} -14 Q${f1(-170 + sw * 7)} -62 -126 -72Z`, MB, dk(MB, 0.3), { sx: 3, sy: 0, lw: 3.2 });
  }
  if (c.luanCan) {   // khăn Luân cân: nền mềm + đỉnh phồng + đai trán + 2 dải sau gáy
    const L = c.luanCan, LS = dk(L, 0.28), TR = c.luanTrim || lt(L, 0.55);
    b += chT(`M-104 -150 Q${f1(-170 + sw * 6)} -110 ${f1(-186 + sw * 9)} -30 L${f1(-166 + sw * 9)} -24 Q${f1(-146 + sw * 6)} -96 -92 -128Z M-96 -160 Q${f1(-150 + sw * 5)} -150 ${f1(-190 + sw * 8)} -90 L${f1(-172 + sw * 8)} -80 Q${f1(-138 + sw * 5)} -126 -86 -138Z`, L, LS, { sx: 3, sy: 0, lw: 3.4 });
    f += chT('M-120 -140 Q-126 -236 14 -252 Q152 -236 146 -140 Q14 -174 -120 -140Z', L, LS, { sx: 10, sy: 6, lw: 4.5 });
    f += chT('M-80 -232 Q-90 -300 14 -306 Q120 -300 110 -232 Q14 -258 -80 -232Z', lt(L, 0.14), LS, { sx: 8, sy: 5, lw: 4.2 });
    f += chL('M-34 -250 Q-30 -278 -26 -298 M24 -252 Q26 -278 30 -298', 2.6, LS, 0.8);
    f += chT('M-128 -150 Q14 -192 154 -150 L152 -122 Q14 -164 -126 -122Z', TR, dk(TR, 0.25), { sx: 0, sy: -4, lw: 3.8 });
  }
  if (c.kimQuan) {   // mũ kim quan nhỏ trên búi tóc; Chu Du thêm hai lông trĩ dài
    const K = c.kimQuan, KS = dk(K, 0.28);
    f += chT('M-36 -226 a50 40 0 1 1 100 0 a50 40 0 1 1 -100 0Z', c.hair, c.hairS, { sx: 8, sy: 6, lw: 4 });
    if (c.kimFeather) {
      const F = c.kimFeather, FS = dk(F, 0.3), s1 = sw * 8;
      b += chT(`M10 -262 Q${f1(-70 + s1)} -360 ${f1(-190 + s1 * 1.6)} -340 Q${f1(-100 + s1)} -318 ${f1(-30 + s1 * 0.6)} -238Z`, F, FS, { sx: 4, sy: 4, lw: 3.6 });
      b += chL(`M4 -258 Q${f1(-70 + s1)} -330 ${f1(-170 + s1 * 1.5)} -334`, 2.4, lt(F, 0.55), 0.9);
      b += chT(`M30 -266 Q${f1(-30 + s1)} -392 ${f1(-136 + s1 * 1.6)} -420 Q${f1(-50 + s1)} -352 ${f1(10 + s1 * 0.6)} -240Z`, F, FS, { sx: 4, sy: 4, lw: 3.6 });
      b += chL(`M26 -262 Q${f1(-24 + s1)} -370 ${f1(-120 + s1 * 1.5)} -412`, 2.4, lt(F, 0.55), 0.9);
    }
    f += chT('M-34 -238 Q14 -262 66 -238 L60 -212 Q14 -230 -28 -212Z', K, KS, { sx: 5, sy: 3, lw: 3.8 });
    f += chT('M-6 -250 L14 -306 L36 -250Z', lt(K, 0.1), KS, { sx: 3, sy: 3, lw: 3.4 });
    f += `<circle cx="14" cy="-226" r="9" fill="#C0392B" stroke="${CH_INK}" stroke-width="2.6"/>`;
    f += chT('M-110 -150 Q14 -188 138 -150 L136 -130 Q14 -168 -108 -130Z', K, KS, { lw: 3.4 });   // đai trán vàng
  }
  if (c.quanMao) {   // mũ quan Tào Tháo
    const Q = c.quanMao, QS = dk(Q, 0.4);
    f += chT('M-110 -150 Q-114 -250 14 -262 Q142 -250 138 -150 Q14 -178 -110 -150Z', Q, QS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-96 -240 L-70 -312 Q14 -330 98 -312 L124 -240 Q14 -262 -96 -240Z', lt(Q, 0.1), QS, { sx: 8, sy: 5, lw: 4.5 });
    f += chL('M-40 -246 L-28 -304 M14 -250 L14 -318 M68 -246 L58 -304', 2.8, QS, 0.9);
    f += chT('M-116 -158 Q14 -194 144 -158 L142 -134 Q14 -172 -114 -134Z', '#D8B24A', '#A8842A', { lw: 3.8 });
    f += `<circle cx="14" cy="-160" r="11" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/><circle cx="11" cy="-163" r="3.2" fill="#fff" opacity="0.7"/>`;
  }
  if (c.phacDau) {   // mũ phác đầu: mũ vải quấn + nút đỉnh + (tuỳ chọn) 2 dải cánh sau gáy
    const P = c.phacDau, PS = dk(P, 0.45);
    if (c.phacTails) {
      b += chT(`M-96 -178 Q${f1(-176 + sw * 5)} -196 ${f1(-222 + sw * 6)} -146 Q${f1(-246 + sw * 7)} -108 ${f1(-232 + sw * 8)} -64 Q${f1(-200 + sw * 6)} -104 ${f1(-150 + sw * 4)} -124 L-96 -136Z`, P, PS, { sx: 6, sy: 4, lw: 3.6 });
      b += chL(`M-110 -166 Q${f1(-180 + sw * 5)} -170 ${f1(-214 + sw * 6)} -120`, 2.6, lt(P, 0.25), 0.8);
    }
    f += chT('M-112 -150 Q-116 -240 14 -250 Q144 -240 140 -150 Q14 -178 -112 -150Z', P, PS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-30 -246 a36 28 0 1 1 72 0 a36 28 0 1 1 -72 0Z', lt(P, 0.06), PS, { sx: 5, sy: 4, lw: 3.8 });
    f += chL('M-92 -196 Q14 -224 120 -196 M-100 -176 Q14 -206 128 -176', 2.8, PS, 0.9);
    f += chT('M-118 -152 Q14 -188 146 -152 L144 -132 Q14 -168 -116 -132Z', lt(P, 0.14), PS, { lw: 3.6 });
  }
  if (c.hairPin) {   // trâm cài tóc + chuỗi hạt rủ
    const K = c.hairPin;
    f += chL('M20 -262 L-70 -216', 7, CH_INK) + chL('M20 -262 L-70 -216', 4.2, K) + `<circle cx="-72" cy="-214" r="10" fill="${K}" stroke="${CH_INK}" stroke-width="2.8"/>`;
    f += [0, 1, 2].map(i => `<circle cx="${f1(-80 + sw * 3 * (i + 1) * 0.4)}" cy="${-190 + i * 18}" r="6" fill="#E8786A" stroke="${CH_INK}" stroke-width="2.2"/>`).join('');
  }
  return [b, f];
}
const _tqHead0 = chHead;
chHead = function (c, ex, T, o = {}) {
  const [hb, hf] = _tqHead0(c, ex, T, o);
  if (!c || !(c.luanCan || c.kimQuan || c.quanMao || c.phacDau || c.namMan || c.earBig || c.hairPin)) return [hb, hf];
  const [xb, xf] = tqHeadX(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- thân: hoa văn da báo ----------
const _tqBody0 = chBody;
chBody = function (c, T, o = {}) {
  const s = _tqBody0(c, T, o);
  if (!c || !(c.leopard || c.fangNeck)) return s;
  const L = c.leopard || '#000', id = 'tqLeo' + (CHN++);
  let sp = '';
  for (const [x, y, r] of [[-96, -150, 15], [-52, -176, 13], [-70, -108, 16], [-20, -132, 14], [24, -176, 12], [38, -100, 15], [82, -152, 14], [96, -102, 13], [-92, -50, 13], [-30, -60, 12], [62, -48, 14], [104, -34, 10]]) {
    const a0 = (x * 11) % 360, pa = (an) => `${f1(x + r * Math.cos(an * Math.PI / 180))} ${f1(y + r * 0.8 * Math.sin(an * Math.PI / 180))}`;
    sp += `<path d="M${pa(a0)} A${r} ${f1(r * 0.8)} 0 1 1 ${pa(a0 + 250)}" fill="none" stroke="${L}" stroke-width="7" stroke-linecap="round"/><circle cx="${f1(x + 1)}" cy="${y}" r="3.6" fill="${L}"/>`;
  }
  if (c.fangNeck) for (let i = 0; i < 9; i++) { const u = i / 8, x = -62 + u * 124, y = -226 + Math.sin(u * Math.PI) * 78 - 0;
    sp += `<path d="M${f1(x - 8)} ${f1(y)} L${f1(x)} ${f1(y + 26 + Math.sin(u * Math.PI) * 10)} L${f1(x + 8)} ${f1(y)}Z" fill="#F6F0DC" stroke="${CH_INK}" stroke-width="2.6" stroke-linejoin="round"/>`; }
  return s + `<clipPath id="${id}"><path d="M-124 0 Q-136 -112 -108 -186 Q-74 -228 0 -236 Q74 -228 110 -186 Q138 -112 124 0 Q0 30 -124 0Z"/></clipPath><g clip-path="url(#${id})">${sp}</g>`;
};

// ---------- đồ cầm tay: quạt lông vũ, túi gấm ----------
const _tqHand0 = chHand;
chHand = function (kind, c) {
  if (kind === 'fan') {   // quạt lông vũ trắng: cán + 5 lông xòe; cả bộ nghiêng 28° so với cánh tay cho tự nhiên
    let s = `<g transform="rotate(-28) scale(0.8)">`;
    for (const a of [-46, 46, -23, 23, 0]) s += `<g transform="rotate(${a} 0 66)">` + chT('M0 62 Q-30 120 -8 230 Q0 244 8 230 Q30 120 0 62Z', '#F6F3EA', '#D2CCBC', { sx: 5, sy: 3, lw: 3.6 }) + chL('M0 80 L0 222', 2, '#B8B2A0', 0.8) + '</g>';
    s += chT('M-8 14 h16 v64 h-16Z', '#B07E4A', '#8A5A2A', { lw: 3.4 }) + chT('M-14 62 h28 v12 h-28Z', '#C0392B', '#8E2418', { lw: 3 }) + '</g>';
    return s + _tqHand0('fist', c);
  }
  if (kind === 'pouch') {   // túi gấm thêu, cầm trong nắm tay
    return chT('M-34 24 Q-44 80 -30 112 Q0 126 30 112 Q44 80 34 24Z', '#B8402E', '#8E2A20', { sx: 6, sy: 4, lw: 4 }) + chL('M-30 40 Q0 52 30 40', 5, '#E2C25A') + `<circle cx="0" cy="84" r="14" fill="none" stroke="#E2C25A" stroke-width="4"/><path d="M-6 84 h12 M0 78 v12" stroke="#E2C25A" stroke-width="3"/>`
      + chT('M-6 22 q-10 -14 6 -22 q16 8 6 22Z', '#E2C25A', '#B8942A', { lw: 3 }) + _tqHand0('fist', c);
  }
  return _tqHand0(kind, c);
};

// ---------- nhân vật ----------

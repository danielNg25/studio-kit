// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT KIM DUNG — TẬP vo-cong-dong-thoi-gian (kênh kênh mẫu, 2026-10-16, CHỜ DUYỆT bước C2).
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js + chars_kd2.js. Cùng kiểu webtoon-code-v1: tô phẳng 2 tông + viền mực,
// mặt/tóc không chi tiết hơn áo, nửa thân không chân, đứng yên KHÔNG hiện tay (tay chỉ hiện khi dùng chiêu / cầm đồ).
// Thuộc tính mới (chỉ là mũ/tóc, thêm vào đầu như chars_kd2.js):
//   furCap: '#màu'   mũ lông Nữ Chân (vòm + vành lông dày + hai tai mũ); furBand: '#vàng' = đai vàng quanh mũ (khi xưng đế)
//   mongolCap: '#màu' mũ nỉ Mông Cổ (chóp nhọn + vành lông + núm đỏ); mongolBrim = màu vành lông
//   qingCourt: '#màu' mũ quan nhà Thanh (vòm tròn + vành vểnh + chỏm tua đỏ + hạt trên đỉnh)
//   kingHat: '#vàng'  mũ vua Đại Lý (đai vàng + mào lửa + hai cánh); kingGem = màu ngọc
//   queue: '#màu'     bím tóc đuôi sam nhà Thanh buông sau lưng (lòi ra bên phải khung)
//   moustache: '#màu' ria mép mảnh
//   sideBraids: '#màu' hai bím tóc rủ hai bên tai (Nữ Chân, Mông Cổ)
// Không sửa chars.js / chars_kd2.js / chars_tdk.js: chỉ bọc chHead một lớp nữa.

function kd3HeadX(c, ex, T, o = {}) {
  const seed = o.seed || 0, sw = Math.sin(T * 2.2 + seed);
  let b = '', f = '';
  const dk = (col, k = 0.25) => mixC(col, '#000000', k), lt = (col, k = 0.25) => mixC(col, '#ffffff', k);
  if (c.moustache) {   // ria mép mảnh (Càn Long)
    const R = c.moustache;
    f += chT('M-28 82 Q-8 66 14 78 Q36 66 56 82 Q36 90 14 84 Q-8 90 -28 82Z', R, mixC(R, '#000000', 0.3), { sx: 0, sy: 3, lw: 3 });
  }
  if (c.queue) {   // đuôi sam: từ sau gáy vòng ra bên phải rồi buông xuống, buộc dây đỏ + chỏm tua
    const Q = c.queue, d = `M118 -96 Q226 -56 204 70 Q186 170 ${f1(190 + sw * 6)} 262`;
    b += chL(d, 34, CH_INK) + chL(d, 26, Q) + chL(`M120 -88 Q216 -52 198 66`, 5, lt(Q, 0.28), 0.8);
    b += chT(`M${f1(172 + sw * 6)} 252 h42 l-8 22 h-26Z`, '#C0392B', '#8E2A20', { lw: 3 });
    b += chT('M176 168 h30 v14 h-30Z', '#C0392B', '#8E2A20', { lw: 3 });
  }
  if (c.furCap) {   // mũ lông Nữ Chân: vòm tròn + vành lông dày (rìa lượn) + hai tai mũ rủ xuống
    const F = c.furCap, FS = dk(F, 0.28), FL = lt(F, 0.22);
    f += chT('M-132 -140 Q-152 -92 -140 -42 Q-118 -36 -106 -54 Q-110 -100 -104 -140Z', FL, dk(FL, 0.25), { sx: 5, sy: 3, lw: 3.5 });
    f += chT('M160 -140 Q180 -92 168 -42 Q146 -36 134 -54 Q138 -100 132 -140Z', FL, dk(FL, 0.25), { sx: 5, sy: 3, lw: 3.5 });
    f += chT('M-118 -150 Q-122 -246 14 -256 Q152 -246 148 -150 Q14 -178 -118 -150Z', F, FS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-136 -148 Q-140 -178 -104 -186 Q14 -208 132 -186 Q168 -178 164 -148 Q154 -124 132 -134 Q104 -110 76 -132 Q46 -110 18 -132 Q-12 -110 -40 -132 Q-76 -110 -104 -134 Q-128 -124 -136 -148Z', FL, dk(FL, 0.22), { sx: 6, sy: 6, lw: 4.5 });
    f += chL('M-100 -164 Q-90 -148 -78 -160 M-30 -176 Q-20 -158 -8 -172 M50 -178 Q60 -160 72 -174 M112 -166 Q122 -150 132 -162', 3, FS, 0.7);
    if (c.furBand) f += chT('M-114 -210 Q14 -244 142 -210 L140 -176 Q14 -212 -112 -176Z', c.furBand, dk(c.furBand, 0.28), { lw: 4 }) + chL('M-90 -196 Q14 -224 118 -196', 2.5, dk(c.furBand, 0.35), 0.8) + `<circle cx="14" cy="-206" r="13" fill="#C0392B" stroke="${CH_INK}" stroke-width="3.2"/><circle cx="10" cy="-210" r="4" fill="#fff" opacity="0.6"/>`;
  }
  if (c.mongolCap) {   // mũ nỉ Mông Cổ: chóp hơi nhọn, vành lông vểnh, núm đỏ trên đỉnh
    const M = c.mongolCap, MS = dk(M, 0.28), BR = c.mongolBrim || '#5A3A22';
    f += chT('M-98 -150 Q-96 -232 -34 -270 Q14 -304 62 -270 Q124 -232 128 -150 Q14 -178 -98 -150Z', M, MS, { sx: 8, sy: 6, lw: 4.5 });
    f += chL('M-40 -246 Q14 -222 68 -246 M-70 -200 Q14 -176 100 -200', 2.5, MS, 0.8);
    f += chT('M-134 -152 Q14 -194 162 -152 L168 -122 Q14 -162 -140 -122Z', BR, dk(BR, 0.28), { sx: 6, sy: 5, lw: 4.5 });
    f += chL('M-110 -146 Q-100 -130 -88 -142 M-40 -158 Q-30 -142 -18 -154 M44 -158 Q54 -142 66 -154 M112 -146 Q122 -130 134 -142', 3, dk(BR, 0.45), 0.7);
    f += `<circle cx="14" cy="-300" r="13" fill="#C0392B" stroke="${CH_INK}" stroke-width="3.2"/><circle cx="10" cy="-304" r="4" fill="#fff" opacity="0.6"/>`;
  }
  if (c.qingCourt) {   // mũ quan nhà Thanh: vòm tròn tối, vành vểnh, chỏm tua đỏ dày, hạt vàng trên đỉnh
    const Q = c.qingCourt, QS = dk(Q, 0.3);
    f += chT('M-104 -150 Q-106 -234 14 -246 Q138 -234 134 -150 Q14 -176 -104 -150Z', Q, QS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-134 -152 Q14 -194 162 -152 L156 -122 Q14 -158 -128 -122Z', lt(Q, 0.12), QS, { lw: 4.5 });
    f += chT(`M-62 -232 Q14 -264 90 -232 Q${f1(64 + sw * 3)} -204 14 -208 Q${f1(-36 + sw * 3)} -204 -62 -232Z`, '#C0392B', '#8E2A20', { sx: 5, sy: 4, lw: 3.5 });
    f += chL('M-30 -230 Q-26 -214 -22 -208 M14 -236 Q14 -220 14 -208 M58 -230 Q54 -214 50 -208', 2.5, '#E8786A', 0.9);
    f += `<circle cx="14" cy="-258" r="13" fill="#E8C86A" stroke="${CH_INK}" stroke-width="3"/><circle cx="14" cy="-258" r="5" fill="#FFF6D6"/>`;
  }
  if (c.kingHat) {   // mũ vua Đại Lý: thân mũ vàng + mào lửa giữa + hai cánh + đai
    const K = c.kingHat, KS = dk(K, 0.28), KG = c.kingGem || '#C0392B';
    f += chT('M-106 -190 Q-158 -212 -178 -168 Q-136 -178 -102 -160Z', K, KS, { sx: 4, sy: 4, lw: 3.5 });
    f += chT('M134 -190 Q186 -212 206 -168 Q164 -178 130 -160Z', K, KS, { sx: 4, sy: 4, lw: 3.5 });
    f += chT('M-104 -150 Q-108 -222 -52 -236 Q14 -250 80 -236 Q136 -222 132 -150 Q14 -176 -104 -150Z', K, KS, { sx: 8, sy: 6, lw: 4.5 });
    f += chT('M-26 -240 Q-38 -292 14 -336 Q66 -292 54 -240 Q14 -252 -26 -240Z', lt(K, 0.18), KS, { sx: 5, sy: 4, lw: 4 });
    f += chL('M14 -318 Q4 -290 14 -262 M14 -318 Q24 -290 14 -262', 2.5, KS, 0.8);
    f += `<circle cx="14" cy="-244" r="11" fill="${KG}" stroke="${CH_INK}" stroke-width="3"/><circle cx="11" cy="-247" r="3.4" fill="#fff" opacity="0.7"/>`;
    f += chT('M-106 -162 Q14 -190 134 -162 L134 -146 Q14 -174 -106 -146Z', lt(K, 0.3), KS, { lw: 3.5 });
  }
  if (c.sideBraids) {   // hai bím tóc rủ hai bên tai: các đốt tròn nối nhau, buộc chỉ đỏ ở đầu
    const H = c.sideBraids, HS = dk(H, 0.3);
    for (const [x0, dir] of [[-118, -1], [150, 1]]) {
      for (let i = 0; i < 6; i++) {
        const y = -38 + i * 32, x = x0 + dir * (4 + i * 2.5) + sw * dir * i * 0.7;
        f += chT(`M${f1(x - 15)} ${y} a15 19 0 1 1 30 0 a15 19 0 1 1 -30 0Z`, H, HS, { sx: 3, sy: 3, lw: 3.5 });
      }
      const xe = x0 + dir * 17 + sw * dir * 3.5;
      f += chT(`M${f1(xe - 16)} 146 h32 v14 h-32Z`, '#C0392B', '#8E2A20', { lw: 3 });
    }
  }
  return [b, f];
}
const _kd3Head0 = chHead;
chHead = function (c, ex, T, o = {}) {
  const [hb, hf] = _kd3Head0(c, ex, T, o);
  if (!c || !(c.furCap || c.mongolCap || c.qingCourt || c.kingHat || c.queue || c.sideBraids || c.moustache)) return [hb, hf];
  const [xb, xf] = kd3HeadX(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- nhân vật ----------

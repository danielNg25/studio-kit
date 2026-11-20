// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT KIM DUNG — TẬP phan-dien-kim-dung (kênh kênh mẫu, 2026-10-19, CHỜ DUYỆT bước C2).
// Nạp SAU chars.js + chars_tnk.js + chars_tdk.js + narrator_sung.js + chars_kd2.js + chars_kd3.js. Cùng kiểu webtoon-code-v1 (không chibi):
// tô phẳng 2 tông + viền mực, mặt/tóc không chi tiết hơn áo, nửa thân không chân, đứng yên không hiện tay.
// Tất cả id có tiền tố pd_ để không đụng id của tập khác (vd 'nl' = Nhị Lang bên Tây Du).
// Đồ cầm tay mới (bọc chHand như chars_kd2.js): 'ironstaff' (trượng sắt — Đoạn Diên Khánh), 'mirror' (gương đồng — A Tử),
// 'broom' (chổi tre — lão tăng quét lá), 'whisk' (phất trần — Lý Mạc Sầu). Không thêm thuộc tính đầu mới: dùng lại những cái có sẵn.

const _pdHand0 = chHand;
chHand = function (kind, c) {
  if (kind === 'ironstaff') {   // trượng sắt: thân đen xám, ba đai sắt sáng, đầu trên có vòng
    return `<g transform="rotate(90)">` + chT('M-150 -10 L330 -10 L338 0 L330 10 L-150 10Z', '#6C707A', '#42464E', { sx: 0, sy: 4, lw: 4 })
      + [-90, 40, 170, 280].map(x => chT(`M${x} -14 h16 v28 h-16Z`, '#9A9EA8', '#6C707A', { sx: 2, sy: 2, lw: 3 })).join('')
      + chT('M-150 -16 h26 v32 h-26Z', '#9A9EA8', '#6C707A', { sx: 2, sy: 2, lw: 3.5 }) + `</g>` + _pdHand0('fist', c);
  }
  if (kind === 'broom') {   // chổi tre: cán dài (đầu trên vượt qua tay), bó rơm xòe ở đầu dưới, dây buộc — cầm thẳng đứng thì rơm chạm đất
    return `<g transform="rotate(${TDK_ROT}) rotate(90)">` + chT('M-330 -6 L190 -6 L190 6 L-330 6Z', '#B08C54', '#8A6A38', { sx: 0, sy: 3, lw: 3.5 })
      + chT('M184 -12 L216 -12 L216 12 L184 12Z', '#6A4A2E', '#4A3220', { lw: 3 })
      + chT('M212 -16 L330 -46 Q352 -22 346 0 Q352 24 330 46 L212 16Z', '#D4B870', '#B09248', { sx: 0, sy: 5, lw: 4 })
      + chL('M222 -8 L334 -30 M222 0 L342 0 M222 8 L334 30', 2.4, '#8A6E3A', 0.9) + `</g>` + _pdHand0('fist', c);
  }
  if (kind === 'mirror') {   // gương đồng nhỏ: tay cầm, vành đồng, mặt gương chỉ là ánh sáng trắng
    return _pdHand0('fist', c) + `<g transform="rotate(${TDK_ROT}) translate(0 30)">` + chT('M-6 0 h12 v58 h-12Z', '#8A6A34', '#684C22', { sx: 2, sy: 0, lw: 3 })
      + chT('M0 58 m-62 0 a62 62 0 1 0 124 0 a62 62 0 1 0 -124 0Z', '#C8A24A', '#9C7A2A', { sx: 5, sy: 4, lw: 4.5 })
      + `<circle cx="0" cy="58" r="46" fill="#F6F4EA" stroke="${CH_INK}" stroke-width="3"/>` + chL('M-26 38 Q-8 24 10 28', 7, '#FFFFFF', 0.95) + chL('M-30 66 l10 10', 4, '#FFFFFF', 0.8) + `</g>`;
  }
  if (kind === 'whisk') {   // phất trần đạo cô: cán ngắn + chùm lông trắng buông xuống
    return _pdHand0('fist', c) + `<g transform="rotate(${TDK_ROT})">` + chT('M-5 -10 h10 v100 h-10Z', '#8A5A34', '#684122', { sx: 2, sy: 0, lw: 3 })
      + chT('M-12 88 Q-52 150 -34 260 Q-14 320 0 330 Q16 320 34 260 Q52 150 12 88Z', '#F4F2EC', '#CFCAC0', { sx: 6, sy: 0, lw: 3.5 })
      + chL('M0 100 Q-8 200 -4 320 M-14 106 Q-30 190 -22 290 M14 106 Q30 190 22 290', 2.2, '#B8B2A6', 0.9) + chT('M-12 80 h24 v14 h-24Z', '#C0392B', '#8E2A20', { lw: 3 }) + `</g>`;
  }
  return _pdHand0(kind, c);
};


// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// ĐIỂM ĐẶC TRƯNG RIÊNG TỪNG NHÂN VẬT HY LẠP (kênh kênh mẫu, tập fact-lmao-hy-lap) — 2026-10-23, CHỜ DUYỆT C2.
// Nạp SAU chars_hl.js + chars_hl_cast.js. Nguyên tắc (học từ cách các kênh hoạt hình lịch sử làm cho mỗi nhân vật nhận ra từ xa, KHÔNG sao chép hình nào):
// mỗi người có MỘT dấu hiệu ở đường viền ngoài (mũ/vầng sáng/thú trên vai) + MỘT đồ vật gắn với tính cách + MỘT nét trên mặt. Mọi hình tự thiết kế, lấy từ chi tiết trong chính thần thoại Hy Lạp.
// Thuộc tính mới (đặt trong cast):
//   thân: pet {k,side} (thú trên vai: eagle owl dove swan lamb rock flame peak), aegis, lionSkin, rope, leopard, mask, bag, spikes, nameplate, soot, ribbons,
//         chainCollar, pearls, shellS, shellC, vines, hem {k:'wave'|'torn'|'vine', c}
//   đầu: halo, peacock, wingBig, fins, seaweed, bolt, scar, freckles, mole, blush, sootF, specs, sapling, flameHair, acorns, garland, crownFruit
//   tay: asclepius, pithos, apple, cane, quill
function hlPet(kind, T, side) {
  const bob = Math.sin(T * 2.6) * 2.4, I = CH_INK;
  let s = '';
  switch (kind) {
    case 'owl':
      s += `<g transform="translate(0 ${f1(bob)})">` + chT('M-8 -4 L-12 8 M12 -4 L16 8', '#E8A030', null, { lw: 0 }) + chL('M-8 -2 L-14 10 M12 -2 L18 10', 5, '#E8A030', 1);
      s += chT('M-36 -8 Q-44 -70 -22 -92 L-24 -112 L-6 -98 Q10 -102 26 -98 L40 -112 L38 -90 Q56 -64 38 -8 Q0 8 -36 -8Z', '#8A6E54', '#68503A', { sx: 8, sy: 6, lw: 4.5 });
      s += chT('M-16 -20 Q-26 -50 -4 -68 Q22 -66 22 -42 Q18 -18 -16 -20Z', '#E4D2B0', '#C4AC86', { sx: 4, sy: 4, lw: 0 });
      s += chL('M-12 -34 q6 4 12 0 M-2 -24 q6 4 12 0', 2.4, '#8A6E54', 0.8);
      s += `<circle cx="-10" cy="-78" r="17" fill="#F8F2DC" stroke="${I}" stroke-width="3.5"/><circle cx="22" cy="-78" r="17" fill="#F8F2DC" stroke="${I}" stroke-width="3.5"/><circle cx="-6" cy="-78" r="9" fill="#E8B030"/><circle cx="18" cy="-78" r="9" fill="#E8B030"/><circle cx="-4" cy="-78" r="5" fill="${I}"/><circle cx="16" cy="-78" r="5" fill="${I}"/>`;
      s += chT('M2 -70 L12 -70 L7 -58Z', '#E8A030', null, { lw: 2.6 }) + `</g>`;
      return s;
    case 'eagle':
      s += `<g transform="translate(0 ${f1(bob)})">` + chL('M-10 0 L-16 12 M14 0 L20 12', 5, '#E8C040', 1);
      s += chT('M-40 -30 Q-86 -22 -92 4 Q-60 -8 -34 -16Z', '#5A3E28', '#3E2A1A', { sx: 4, sy: 4, lw: 3.6 });
      s += chT('M-34 -8 Q-44 -64 -14 -90 Q22 -98 40 -66 Q54 -40 38 -8 Q0 6 -34 -8Z', '#6A4A30', '#4A321E', { sx: 8, sy: 6, lw: 4.5 });
      s += chT('M-20 -34 Q-34 -62 -8 -78 Q14 -70 12 -40Z', '#8A6240', '#6A4A30', { sx: 4, sy: 3, lw: 3 });
      s += chL('M-24 -40 q8 8 14 0 M-18 -54 q8 8 14 0 M-8 -66 q6 6 12 0', 2.2, '#4A321E', 0.9);
      s += chT('M-4 -84 Q-6 -118 20 -122 Q46 -118 40 -86 Q18 -74 -4 -84Z', '#FAF6EE', '#D6D0C2', { sx: 5, sy: 5, lw: 4 });
      s += chT('M34 -108 Q62 -110 64 -92 Q50 -96 38 -90Z', '#F0C030', '#C8981E', { sx: 2, sy: 3, lw: 3.4 });
      s += `<ellipse cx="26" cy="-104" rx="5" ry="6" fill="${I}"/>` + chL('M14 -116 L36 -110', 3.4, I, 0.95) + `</g>`;
      return s;
    case 'dove':
      s += `<g transform="translate(0 ${f1(bob)})">` + chL('M-4 -4 L-8 6 M8 -4 L12 6', 3.4, '#E8907A', 1);
      s += chT('M-30 -26 Q-72 -22 -80 -4 Q-52 -8 -26 -14Z', '#FBFBF6', '#DCDCD2', { sx: 3, sy: 3, lw: 3.4 });
      s += chT('M-34 -20 Q-34 -62 4 -64 Q40 -62 38 -26 Q26 0 -4 2 Q-24 0 -34 -20Z', '#FBFBF6', '#DCDCD2', { sx: 6, sy: 5, lw: 4.2 });
      s += chT('M-22 -34 Q-6 -52 22 -42 Q8 -22 -16 -22Z', '#EEEEE6', '#CFCFC4', { sx: 2, sy: 3, lw: 2.8 });
      s += chT('M16 -72 Q16 -94 36 -92 Q50 -86 44 -66 Q30 -58 16 -72Z', '#FBFBF6', '#DCDCD2', { sx: 4, sy: 4, lw: 3.8 });
      s += chT('M44 -80 L58 -76 L44 -72Z', '#F29A5A', null, { lw: 2.6 }) + `<circle cx="34" cy="-80" r="3.6" fill="${I}"/>` + `</g>`;
      return s;
    case 'swan':
      s += `<g transform="translate(0 ${f1(bob)})">` + chT('M-52 -14 Q-58 -52 -14 -50 Q36 -48 46 -22 Q34 -2 -12 0 Q-44 0 -52 -14Z', '#FBFBF6', '#D8D8CE', { sx: 6, sy: 5, lw: 4.4 });
      s += chT('M-48 -28 Q-70 -48 -66 -66 Q-48 -44 -30 -38Z', '#FBFBF6', '#D8D8CE', { sx: 3, sy: 3, lw: 3.4 });
      s += `<path d="M30 -30 Q58 -52 36 -84 Q24 -104 40 -112" fill="none" stroke="${I}" stroke-width="22" stroke-linecap="round"/><path d="M30 -30 Q58 -52 36 -84 Q24 -104 40 -112" fill="none" stroke="#FBFBF6" stroke-width="15" stroke-linecap="round"/>`;
      s += chT('M26 -120 Q26 -138 42 -138 Q56 -134 54 -118 Q42 -108 26 -120Z', '#FBFBF6', '#D8D8CE', { sx: 3, sy: 3, lw: 3.6 });
      s += chT('M52 -128 L72 -122 L52 -116Z', '#F29A3A', '#C86E1E', { lw: 2.8 }) + `<circle cx="44" cy="-128" r="3.4" fill="${I}"/>` + `</g>`;
      return s;
    case 'lamb': {
      const cl = [[-26, -34, 22], [-4, -50, 24], [22, -38, 22], [-14, -16, 20], [14, -16, 20], [-36, -14, 16]];
      s += `<g transform="translate(0 ${f1(bob * 0.6)})">` + chL('M-18 -2 L-18 12 M16 -2 L16 12', 6, '#4A3A32', 1);
      s += cl.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="${I}"/>`).join('') + cl.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FBF6EA"/>`).join('');
      s += `<circle cx="-4" cy="-18" r="14" fill="#EFE6D2"/>` + chT('M26 -50 Q22 -80 44 -76 Q62 -66 54 -40 Q40 -30 26 -50Z', '#5A463C', '#3E2E26', { sx: 3, sy: 3, lw: 3.8 });
      s += chT('M22 -66 Q8 -76 10 -58Z M52 -72 Q66 -80 62 -58Z', '#5A463C', null, { lw: 2.8 }) + `<circle cx="40" cy="-60" r="3.4" fill="#FBF6EA"/><circle cx="54" cy="-56" r="3" fill="${I}"/>` + `</g>`;
      return s;
    }
    case 'rock':
      s += chT('M-62 0 Q-76 -60 -40 -96 Q-4 -122 40 -96 Q78 -64 66 0Z', '#A2A8B0', '#6E7482', { sx: 12, sy: 10, lw: 5.5 });
      s += chL('M-18 -70 L-4 -48 L-16 -28 M24 -84 L16 -56 L34 -36', 3, '#5A6070', 0.9) + chL('M-46 -70 Q-30 -88 -4 -92', 4, '#D2D6DC', 0.8);
      s += `<ellipse cx="-70" cy="6" rx="14" ry="8" fill="#D8CDB6" opacity="0.7"/><ellipse cx="74" cy="4" rx="12" ry="7" fill="#D8CDB6" opacity="0.7"/>`;
      return s;
    case 'flame': {
      const w = Math.sin(T * 7) * 5;
      s += bloom(chT(`M0 0 Q-38 -26 -16 -70 Q-8 -50 0 -46 Q4 -82 ${f1(20 + w)} -102 Q50 -46 30 -16 Q16 6 0 0Z`, '#FF9A30', '#E05A20', { sx: 6, sy: 4, lw: 4 }), '#FFB040', 0.6);
      s += chT(`M2 -4 Q-14 -18 -4 -40 Q4 -30 6 -44 Q22 -24 14 -10Z`, '#FFE07A', null, { lw: 0 });
      return s;
    }
    case 'peak':
      s += chT('M-4 0 L40 -62 L76 0Z', '#8A8478', '#645E54', { sx: 8, sy: 4, lw: 4.6 }) + chT('M-62 0 L-10 -96 L46 0Z', '#A29A8A', '#766E60', { sx: 10, sy: 6, lw: 5 });
      s += chT('M-10 -96 L-30 -60 L-20 -64 L-10 -52 L0 -66 L12 -58Z', '#FBFBF6', '#D6DCE6', { sx: 3, sy: 3, lw: 3 }) + chT('M40 -62 L28 -40 L36 -42 L42 -34 L50 -44Z', '#FBFBF6', '#D6DCE6', { lw: 2.6 });
      return s;
  }
  return '';
}
function hlBodyOver(c, T) {
  let s = '';
  const F = c.fem && !c.cuirass, HW = F ? 119 : 124, I = CH_INK;
  // đường viền gấu đặc biệt (sóng nước / rách / dây leo) đè lên viền chữ triện
  if (c.hem) {
    const h = c.hem, col = h.c || '#6AB0D8', cs = mixC(col, '#000000', 0.3), yb = F ? 28 : 30;
    if (h.k === 'torn') {
      let d = `M-${HW} -4`; const n = 12, w = (2 * HW) / n;
      for (let i = 0; i < n; i++) { const x0 = -HW + i * w; d += ` L${f1(x0 + w * 0.5)} ${f1(14 + (i % 3) * 12 + 18 * (1 - ((x0 + w / 2) / HW) ** 2))} L${f1(x0 + w)} -2`; }
      s += chT(d + 'Z', c.robe, c.robeS, { sx: 6, sy: -3, lw: 4 }) + chL(`M-${HW - 10} -22 L${f1(-HW + 40)} -10 M30 -20 L60 -8`, 2.4, mixC(c.robeS, '#000000', 0.4), 0.8);
    } else {
      s += chT(`M-${HW} -26 Q0 4 ${HW + 1} -26 L${HW + 1} 0 Q0 ${yb} -${HW} 0Z`, col, cs, { sx: 0, sy: -4, lw: 3.5 });
      if (h.k === 'wave') for (let x = -HW + 8; x < HW - 16; x += 26) s += chL(`M${x} ${f1(-8 + 14 * (1 - (x / 124) ** 2))} q6.5 -12 13 0 q6.5 12 13 0`, 3, mixC(col, '#ffffff', 0.55), 0.95);
      if (h.k === 'vine') for (let x = -HW + 14; x < HW - 10; x += 30) s += `<ellipse cx="${x}" cy="${f1(-6 + 12 * (1 - (x / 124) ** 2))}" rx="13" ry="6.5" transform="rotate(${x % 60 ? -24 : 24} ${x} -6)" fill="#6FB04A" stroke="${I}" stroke-width="2.4"/>`;
    }
  }
  if (c.vines) {
    const V = c.vines;
    s += `<path d="M-112 -204 Q-90 -150 -112 -100 Q-84 -60 -98 -14" fill="none" stroke="${I}" stroke-width="12" stroke-linecap="round"/><path d="M-112 -204 Q-90 -150 -112 -100 Q-84 -60 -98 -14" fill="none" stroke="${V}" stroke-width="7" stroke-linecap="round"/>`;
    for (const [x, y, a] of [[-92, -164, -30], [-110, -120, 28], [-92, -76, -26], [-102, -36, 24]]) s += `<ellipse cx="${x}" cy="${y}" rx="15" ry="7" transform="rotate(${a} ${x} ${y})" fill="#7FBE56" stroke="${I}" stroke-width="2.6"/>`;
    s += `<circle cx="-104" cy="-142" r="9" fill="#F2A0B0" stroke="${I}" stroke-width="2.6"/><circle cx="-100" cy="-56" r="8" fill="#F6D86A" stroke="${I}" stroke-width="2.4"/>`;
  }
  if (c.aegis) {   // áo choàng vảy của Athena (aegis) + mặt Gorgon trên ngực
    const A = c.aegis, AS = mixC(A, '#000000', 0.28);
    s += chT('M-116 -196 Q-96 -112 -2 -126 Q96 -112 118 -196 Q114 -226 0 -236 Q-112 -226 -116 -196Z', A, AS, { sx: 12, sy: 6, lw: 5 });
    for (let r = 0; r < 3; r++) for (let k = 0; k < 7 - r; k++) { const x = -78 + r * 13 + k * 26, y = -208 + r * 20 - 8 * Math.sin(k / 6 * Math.PI); s += chL(`M${x - 11} ${y} q11 14 22 0`, 2.6, AS, 0.8); }
    for (let k = 0; k < 9; k++) { const an = (k * 40 + 10) * Math.PI / 180, x0 = 2 + 22 * Math.cos(an), y0 = -140 + 22 * Math.sin(an), x1 = 2 + 44 * Math.cos(an + 0.35), y1 = -140 + 44 * Math.sin(an + 0.35); s += `<path d="M${f1(x0)} ${f1(y0)} Q${f1((x0 + x1) / 2 + 8 * Math.sin(an))} ${f1((y0 + y1) / 2 - 8 * Math.cos(an))} ${f1(x1)} ${f1(y1)}" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round"/><path d="M${f1(x0)} ${f1(y0)} Q${f1((x0 + x1) / 2 + 8 * Math.sin(an))} ${f1((y0 + y1) / 2 - 8 * Math.cos(an))} ${f1(x1)} ${f1(y1)}" fill="none" stroke="#4E9A4A" stroke-width="5" stroke-linecap="round"/>`; }
    s += `<circle cx="2" cy="-140" r="25" fill="#C9A24A" stroke="${I}" stroke-width="3.8"/><circle cx="2" cy="-140" r="18" fill="#DDBA66"/>`;
    s += `<path d="M-11 -154 L-1 -148 M15 -154 L5 -148" stroke="${I}" stroke-width="3.6" stroke-linecap="round"/><circle cx="-6" cy="-146" r="3.4" fill="${I}"/><circle cx="10" cy="-146" r="3.4" fill="${I}"/>`;
    s += `<path d="M-10 -130 Q2 -138 14 -130 L11 -124 L7 -129 L2 -123 L-3 -129 L-7 -124Z" fill="#7A2A22" stroke="${I}" stroke-width="2.6" stroke-linejoin="round"/>`;
  }
  if (c.lionSkin) {   // da sư tử vắt vai (Diomedes, Iliad 10): bờm quanh cổ, hai chân trước thắt trước ngực
    const L = c.lionSkin, LS = mixC(L, '#000000', 0.26);
    let d = 'M-124 -192'; const n = 9;
    for (let i = 0; i <= n; i++) { const x = -124 + (248 * i) / n; d += ` L${f1(x)} ${f1(-232 + 10 * Math.sin(i * 2.1) + (i % 2 ? 12 : 0))}`; }
    d += ' L128 -170'; for (let i = 0; i <= n; i++) { const x = 128 - (256 * i) / n; d += ` L${f1(x)} ${f1(-166 + 12 * (i % 2 ? 1 : -1) + 6 * Math.sin(i))}`; }
    const MN = c.lionMane || '#7A4A22';
    s += chT(d + 'Z', MN, mixC(MN, '#000000', 0.3), { sx: 10, sy: 8, lw: 4.6 });
    s += chT('M-104 -196 Q0 -238 106 -196 L112 -156 Q0 -112 -112 -156Z', L, LS, { sx: 10, sy: 8, lw: 4 });
    s += chL('M-80 -190 l12 12 M-30 -204 l6 18 M30 -204 l-4 18 M76 -190 l-10 14', 3, LS, 0.85);
    for (const k of [-1, 1]) s += chT(`M${k * 22} -168 Q${k * 52} -150 ${k * 40} -108 Q${k * 22} -96 ${k * 8} -112 Q${k * 14} -140 ${k * 22} -168Z`, mixC(L, '#ffffff', 0.12), LS, { sx: 4, sy: 3, lw: 4 }) + chL(`M${k * 30} -110 l${k * 4} 12 M${k * 22} -108 l${k * 2} 13 M${k * 14} -108 l0 13`, 2.4, I, 0.9);
    s += `<circle cx="0" cy="-166" r="10" fill="${LS}" stroke="${I}" stroke-width="3"/>`;
  }
  if (c.sailRope) {   // dây thừng thuỷ thủ chéo ngực (Odysseus)
    const d = 'M-100 -200 Q-10 -150 112 -74';
    s += `<path d="${d}" fill="none" stroke="${I}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c.sailRope}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${mixC(c.sailRope, '#000000', 0.4)}" stroke-width="15" stroke-dasharray="3 9" transform="translate(0 -1)"/>`;
    s += `<circle cx="104" cy="-82" r="15" fill="${c.sailRope}" stroke="${I}" stroke-width="3.6"/><circle cx="104" cy="-82" r="6" fill="${mixC(c.sailRope, '#000000', 0.4)}"/>`;
  }
  if (c.leopard) {   // da báo thầy tế Ai Cập vắt chéo
    const d = 'M-100 -212 L-60 -226 L116 -70 L84 -34Z';
    s += chT(d, '#E0AA50', '#B88434', { sx: 8, sy: 6, lw: 4.4 });
    for (const [x, y] of [[-70, -196], [-34, -170], [-8, -140], [20, -116], [48, -92], [78, -62], [-46, -204], [2, -168], [34, -140], [66, -108]]) s += `<circle cx="${x}" cy="${y}" r="6.4" fill="#4A2E1A" opacity="0.85"/>`;
  }
  if (c.drama) {   // mặt nạ bi kịch + hài kịch treo trước ngực (Euripides)
    s += `<path d="M-40 -222 L-2 -150 M40 -222 L-2 -150" fill="none" stroke="${I}" stroke-width="5" stroke-linecap="round"/>`;
    s += chT('M-34 -158 Q-36 -92 -2 -86 Q32 -92 30 -158Z', '#EFE6D2', '#CFC2A6', { sx: 6, sy: 4, lw: 4 });
    s += `<path d="M-22 -136 q8 -10 16 0 M8 -136 q8 -10 16 0" fill="none" stroke="${I}" stroke-width="3.6" stroke-linecap="round"/><path d="M-14 -108 q12 -14 24 0 q-12 -6 -24 0" fill="${I}" stroke="${I}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += chT('M44 -130 Q44 -80 66 -76 Q92 -80 90 -130Z', '#F2E4C4', '#D6C298', { sx: 5, sy: 3, lw: 3.6 }) + `<path d="M54 -112 q6 -8 12 0 M72 -112 q6 -8 12 0" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/><path d="M56 -98 q14 16 28 0" fill="none" stroke="${I}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  if (c.bag) {   // dây đeo + túi đồ (Hermes — túi tin, Herodotus — túi đi đường)
    const B = c.bag, BS = mixC(B, '#000000', 0.3);
    s += `<path d="M92 -200 Q0 -130 -100 -64" fill="none" stroke="${I}" stroke-width="18" stroke-linecap="round"/><path d="M92 -200 Q0 -130 -100 -64" fill="none" stroke="${B}" stroke-width="11" stroke-linecap="round"/>`;
    s += chT('M-132 -74 Q-148 -22 -124 6 L-58 4 Q-44 -30 -66 -76Z', B, BS, { sx: 8, sy: 4, lw: 4.4 }) + chT('M-136 -78 L-62 -80 L-64 -42 Q-98 -30 -134 -42Z', mixC(B, '#ffffff', 0.1), BS, { sx: 4, sy: 3, lw: 4 }) + `<circle cx="-98" cy="-42" r="9" fill="${HL_GOLD}" stroke="${I}" stroke-width="3"/>`;
  }
  if (c.spikes) {   // gai đồng trên vai giáp (Ares)
    const S = c.spikes, SS = mixC(S, '#000000', 0.32);
    for (const [x, y, a] of [[-122, -190, -28], [-100, -214, -10], [124, -190, 28], [102, -214, 10]]) s += `<g transform="translate(${x} ${y}) rotate(${a})">` + chT('M-16 4 L0 -50 L16 4Z', S, SS, { sx: 4, sy: 3, lw: 4 }) + '</g>';
  }
  if (c.nameplate) s += `<text x="2" y="-128" font-size="25" text-anchor="middle" font-family="${FH}" font-weight="bold" letter-spacing="2" fill="${mixC(c.cuirass || '#8E959C', '#000000', 0.55)}">${c.nameplate}</text>`;
  if (c.soot) {   // vết khói than trên tạp dề + tia lửa bắn quanh
    s += `<ellipse cx="-30" cy="-100" rx="26" ry="14" fill="#1E1410" opacity="0.28"/><ellipse cx="38" cy="-60" rx="20" ry="11" fill="#1E1410" opacity="0.26"/><path d="M-6 -56 l8 -6 l4 8z" fill="#2A1A14" opacity="0.5"/>`;
    for (let i = 0; i < 5; i++) { const u = (T * 1.1 + i * 0.21) % 1, x = -150 + i * 22 + Math.sin(T * 3 + i) * 6, y = -120 - u * 130; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(5 - u * 3)}" fill="${i % 2 ? '#FFC04A' : '#FF7A30'}" opacity="${f1(1 - u)}"/>`; }
  }
  if (c.ribbons) {   // dải ruy-băng mỗi màu là một món quà của một vị thần (Pandora)
    c.ribbons.forEach((col, i) => { const x = -84 + i * 40, sw = Math.sin(T * 2.4 + i) * 5; s += `<path d="M${x} -190 Q${f1(x - 14 + sw)} -130 ${f1(x + 6 + sw)} -80 L${f1(x + 22 + sw)} -86 Q${f1(x + 4 + sw)} -136 ${x + 16} -190Z" fill="${col}" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`; });
  }
  if (c.chainCollar) s += `<path d="M-70 -226 Q0 -166 74 -226" fill="none" stroke="${I}" stroke-width="15" stroke-linecap="round"/><path d="M-70 -226 Q0 -166 74 -226" fill="none" stroke="#AEB4BC" stroke-width="8" stroke-dasharray="12 5"/>`;
  if (c.pearls) { for (let i = 0; i <= 8; i++) { const u = i / 8, x = -62 + 124 * u, y = -218 + 52 * Math.sin(u * Math.PI); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="8" fill="#FBF6F0" stroke="${I}" stroke-width="2.8"/><circle cx="${f1(x - 2)}" cy="${f1(y - 2)}" r="2.4" fill="#fff"/>`; } }
  const shell = (x, y, r, a, col) => { const cs = mixC(col, '#000000', 0.22); let t = `<g transform="translate(${x} ${y}) rotate(${a})">` + chT(`M0 0 L${-r} ${-r * 0.55} Q${-r * 0.9} ${-r * 1.4} 0 ${-r * 1.5} Q${r * 0.9} ${-r * 1.4} ${r} ${-r * 0.55}Z`, col, cs, { sx: 4, sy: 3, lw: 3.6 }); for (const k of [-0.55, -0.2, 0.2, 0.55]) t += chL(`M0 -4 L${f1(r * k * 1.5)} ${f1(-r * 1.3)}`, 2.2, cs, 0.8); return t + `<rect x="-9" y="-2" width="18" height="9" rx="3" fill="${cs}" stroke="${I}" stroke-width="2.6"/></g>`; };
  if (c.shellS) s += shell(-108, -196, 36, -24, c.shellS) + shell(110, -196, 36, 24, c.shellS);
  if (c.shellC) s += shell(2, -112, 26, 0, c.shellC);
  if (c.pet) {
    const p = typeof c.pet === 'string' ? { k: c.pet } : c.pet, side = p.side || -1, sc = p.s || 1;
    s += `<g transform="translate(${side * (p.x ?? 150)} ${p.y ?? -196}) scale(${side * -sc} ${sc})">${hlPet(p.k, T, side)}</g>`;
    if (p.k === 'peak' && p.two) s += `<g transform="translate(${-side * 150} -196) scale(${side * sc} ${sc})">${hlPet('peak', T, -side)}</g>`;
  }
  return s;
}
const _hlBody1 = chBody;
chBody = function (c, T, o = {}) { const b = _hlBody1(c, T, o); return c && c.greek ? b + hlBodyOver(c, T) : b; };

// ---------- đầu: vầng sáng, lông công, cánh mũ, vây, rong biển, tia chớp, sẹo, tàn nhang, kính… ----------
function hlHeadX2(c, ex, T, o = {}) {
  let b = '', f = '';
  const I = CH_INK, sw = Math.sin(T * 2.2 + (o.seed || 0));
  if (c.aura) {   // vầng sáng thần linh phía sau đầu
    const H = c.aura;
    b += `<g opacity="0.9"><circle cx="14" cy="-96" r="${f1(176 + sw * 4)}" fill="${H}" opacity="0.4"/><circle cx="14" cy="-96" r="150" fill="${H}" opacity="0.5"/></g>`;
    for (let k = 0; k < 12; k++) { const a = (k * 30 + T * 8) * Math.PI / 180; b += chL(`M${f1(14 + 168 * Math.cos(a))} ${f1(-96 + 168 * Math.sin(a))} L${f1(14 + 196 * Math.cos(a))} ${f1(-96 + 196 * Math.sin(a))}`, 5, H, 0.85); }
  }
  if (c.peacock) {   // quạt lông công sau vương miện (Hera)
    for (const [a, len] of [[-58, 190], [-32, 224], [-8, 240], [18, 226], [44, 196]]) {
      const r = a * Math.PI / 180, x = 14 + Math.sin(r) * len, y = -150 - Math.cos(r) * len;
      b += `<path d="M14 -140 Q${f1(14 + Math.sin(r) * len * 0.5)} ${f1(-150 - Math.cos(r) * len * 0.5)} ${f1(x)} ${f1(y)}" fill="none" stroke="${I}" stroke-width="12" stroke-linecap="round"/><path d="M14 -140 Q${f1(14 + Math.sin(r) * len * 0.5)} ${f1(-150 - Math.cos(r) * len * 0.5)} ${f1(x)} ${f1(y)}" fill="none" stroke="#4A8A6A" stroke-width="6" stroke-linecap="round"/>`;
      b += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="26" ry="34" transform="rotate(${a} ${f1(x)} ${f1(y)})" fill="#2E9A8A" stroke="${I}" stroke-width="4"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="16" ry="22" transform="rotate(${a} ${f1(x)} ${f1(y)})" fill="#2E5AA8"/><ellipse cx="${f1(x)}" cy="${f1(y + 2)}" rx="7" ry="10" transform="rotate(${a} ${f1(x)} ${f1(y)})" fill="#E0B048"/>`;
    }
  }
  if (c.wingBig) {   // cánh lớn hai bên mũ (Hermes)
    for (const k of [-1, 1]) {
      const bx = 14 + k * 168, by = -160;
      b += chT(`M${bx - k * 10} ${by} Q${bx + k * 90} ${by - 90} ${bx + k * 150} ${by - 70} Q${bx + k * 124} ${by - 52} ${bx + k * 140} ${by - 28} Q${bx + k * 104} ${by - 30} ${bx + k * 114} ${by + 2} Q${bx + k * 80} ${by - 2} ${bx + k * 82} ${by + 30} Q${bx + k * 40} ${by + 8} ${bx - k * 10} ${by + 22}Z`, '#FBFBF6', '#D2D8E0', { sx: k * 6, sy: 6, lw: 4.2 });
      b += chL(`M${bx + k * 10} ${by + 4} Q${bx + k * 80} ${by - 50} ${bx + k * 130} ${by - 50} M${bx + k * 10} ${by + 16} Q${bx + k * 70} ${by - 14} ${bx + k * 104} ${by - 16}`, 2.4, '#AEB6C4', 0.85);
    }
  }
  if (c.fins) {   // vây tai (Thetis, nữ thần biển)
    const FC = c.fins, FS = mixC(FC, '#000000', 0.25);
    for (const k of [-1, 1]) {
      const x = 14 + k * 128;
      b += chT(`M${x} -64 Q${x + k * 70} -120 ${x + k * 76} -34 Q${x + k * 50} -52 ${x + k * 52} -8 Q${x + k * 30} -30 ${x + k * 4} -8Z`, FC, FS, { sx: k * 5, sy: 5, lw: 4 }) + chL(`M${x + k * 8} -44 L${x + k * 56} -70 M${x + k * 8} -30 L${x + k * 46} -34`, 2.4, FS, 0.85);
    }
  }
  if (c.seaweed) {   // dải rong biển rủ từ khăn (Proteus, ông già của biển)
    const SW = c.seaweed;
    for (const [x, y0, L, a] of [[-132, -50, 150, 0], [-118, -24, 170, 1], [150, -40, 160, 2], [164, -12, 140, 3]]) {
      const w = Math.sin(T * 2 + a) * 8;
      b += `<path d="M${x} ${y0} q${f1(-14 + w)} 40 0 ${f1(L * 0.5)} q${f1(16 + w)} 40 0 ${f1(L * 0.5)}" fill="none" stroke="${I}" stroke-width="17" stroke-linecap="round"/><path d="M${x} ${y0} q${f1(-14 + w)} 40 0 ${f1(L * 0.5)} q${f1(16 + w)} 40 0 ${f1(L * 0.5)}" fill="none" stroke="${SW}" stroke-width="10" stroke-linecap="round"/>`;
    }
  }
  if (c.bolt) {   // ghim tia sét vàng cài tóc + tia điện nhỏ (Zeus)
    const d = 'M0 -22 L14 -2 L4 -2 L16 22 L-10 -6 L0 -6Z';
    f += `<g transform="translate(158 -206) rotate(16) scale(1.7)">` + chT(d, '#FFE45A', '#E0B030', { sx: 2, sy: 0, lw: 3.4 }) + chL('M2 -14 L8 -2', 2, '#FFFFFF', 0.9) + '</g>';
    for (const [x, y, a] of [[-110, -176, 0], [150, -172, 1], [-96, -226, 2]]) { const t = (Math.sin(T * 9 + a * 2) + 1) / 2; f += `<path d="M${x} ${y} l9 -14 l-6 0 l10 -16" fill="none" stroke="#FFF6B0" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(0.35 + t * 0.6)}"/>`; }
  }
  if (c.blush) f += `<ellipse cx="-62" cy="60" rx="32" ry="17" fill="${c.blush}" opacity="0.5"/><ellipse cx="102" cy="60" rx="32" ry="17" fill="${c.blush}" opacity="0.5"/>`;
  if (c.freckles) for (const [x, y] of [[-78, 54], [-58, 62], [-40, 52], [78, 52], [98, 62], [116, 52]]) f += `<circle cx="${x}" cy="${y}" r="3.4" fill="${c.freckles}" opacity="0.8"/>`;
  if (c.mole) f += `<circle cx="${c.mole[0]}" cy="${c.mole[1]}" r="4.4" fill="#3A241A"/>`;
  if (c.cheekScar) f += `<path d="M84 18 L118 70" fill="none" stroke="${I}" stroke-width="9" stroke-linecap="round" opacity="0.8"/><path d="M84 18 L118 70" fill="none" stroke="${c.cheekScar}" stroke-width="5" stroke-linecap="round"/><path d="M92 42 l-14 7 M104 58 l-14 7" fill="none" stroke="${I}" stroke-width="3.2" stroke-linecap="round" opacity="0.8"/>`;
  if (c.sootF) f += `<ellipse cx="-60" cy="56" rx="30" ry="14" fill="#1A100C" opacity="0.28"/><ellipse cx="100" cy="46" rx="26" ry="12" fill="#1A100C" opacity="0.26"/><path d="M-4 -58 q14 -10 30 0" fill="none" stroke="#1A100C" stroke-width="9" stroke-linecap="round" opacity="0.3"/><ellipse cx="14" cy="100" rx="10" ry="5" fill="#1A100C" opacity="0.2"/>`;
  if (c.specs) f += `<circle cx="-38" cy="20" r="46" fill="#DDF0FF" opacity="0.18" stroke="${c.specs}" stroke-width="7"/><circle cx="64" cy="20" r="46" fill="#DDF0FF" opacity="0.18" stroke="${c.specs}" stroke-width="7"/><path d="M8 18 Q13 8 18 18" fill="none" stroke="${c.specs}" stroke-width="6"/><path d="M-84 14 L-118 8 M110 14 L146 8" stroke="${c.specs}" stroke-width="6" stroke-linecap="round"/><path d="M-60 -2 q10 -10 22 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`;
  if (c.sapling) {   // cây non nảy trên đầu (Gaia — Mẹ Đất)
    const SP = c.sapling, g = Math.sin(T * 2) * 3;
    f += `<path d="M14 -240 Q${f1(12 + g)} -280 ${f1(20 + g)} -310" fill="none" stroke="${I}" stroke-width="12" stroke-linecap="round"/><path d="M14 -240 Q${f1(12 + g)} -280 ${f1(20 + g)} -310" fill="none" stroke="#8A6A3A" stroke-width="6" stroke-linecap="round"/>`;
    for (const [x, y, a, r] of [[-12, -270, -38, 24], [44, -284, 34, 26], [4, -306, -12, 22], [36, -320, 26, 20]]) f += `<ellipse cx="${f1(x + g)}" cy="${y}" rx="${r}" ry="${r * 0.46}" transform="rotate(${a} ${f1(x + g)} ${y})" fill="${SP}" stroke="${I}" stroke-width="3.2"/>`;
  }
  if (c.flameHair) {   // tóc bốc lửa (Zelos — Tranh Đua)
    for (const [x, h, w] of [[-70, 80, 40], [-20, 116, 46], [36, 130, 46], [90, 96, 40]]) { const sh = Math.sin(T * 6 + x) * 5; f += chT(`M${x - w / 2} -186 Q${f1(x - w / 2 - 8)} ${-186 - h * 0.55} ${f1(x + sh)} ${-186 - h} Q${f1(x + w / 2 + 10)} ${-186 - h * 0.4} ${x + w / 2} -186Z`, '#FF8A30', '#E04A20', { sx: 4, sy: 5, lw: 3.8 }); f += chT(`M${x - w / 5} -188 Q${x - w / 4} ${-188 - h * 0.35} ${f1(x + sh * 0.6)} ${-188 - h * 0.6} Q${x + w / 4} ${-188 - h * 0.3} ${x + w / 5} -188Z`, '#FFE070', null, { lw: 0 }); }
  }
  if (c.acorns) for (const [x, y] of [[-100, -150], [14, -196], [128, -146]]) f += `<g transform="translate(${x} ${y}) scale(1.5)"><ellipse cx="0" cy="6" rx="9" ry="11" fill="#B07A3A" stroke="${I}" stroke-width="2.8"/><path d="M-11 -2 Q0 -14 11 -2Z" fill="#6A4A26" stroke="${I}" stroke-width="2.6"/></g>`;
  if (c.garland) for (let k = 0; k < 9; k++) { const th = (190 - k * 17.5) * Math.PI / 180, x = 14 + 140 * Math.cos(th), y = -118 - 116 * Math.sin(th); if (y > -100) continue; f += `<circle cx="${f1(x)}" cy="${f1(y)}" r="11" fill="${k % 2 ? c.garland : '#FFF4D8'}" stroke="${I}" stroke-width="2.6"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3.6" fill="#E8B030"/>`; }
  if (c.crownFruit) for (const [x, y] of [[-84, -208], [-30, -230], [24, -240], [78, -226]]) f += `<circle cx="${x}" cy="${y}" r="10" fill="${c.crownFruit}" stroke="${I}" stroke-width="2.8"/><path d="M${x} ${y - 10} l4 -8" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`;
  return [b, f];
}
const _hlHead1 = chHead;
chHead = function (c, ex, T, o = {}) {
  const [hb, hf] = _hlHead1(c, ex, T, o);
  if (!c || !c.greek) return [hb, hf];
  const [xb, xf] = hlHeadX2(c, ex, T, o);
  return [xb + hb, hf + xf];
};

// ---------- đồ cầm tay mới ----------
const _hlHand1 = chHand;
chHand = function (kind, c) {
  const fist = _hlHand1('fist', c), R = `rotate(${TDK_ROT})`;
  const g = (inner, under = 0) => under ? `<g transform="${R}">${inner}</g>` + fist : fist + `<g transform="${R}">${inner}</g>`;
  switch (kind) {
    case 'asclepius': {   // gậy rắn quấn của thầy thuốc (Paieon)
      const sn = 'M0 30 Q-34 56 0 84 Q34 112 0 140 Q-34 168 0 196';
      return g(chT('M-6 -50 L6 -50 L6 250 L-6 250Z', '#8A6038', '#6A4220', { lw: 3.5 }) + `<path d="${sn}" fill="none" stroke="${CH_INK}" stroke-width="17" stroke-linecap="round"/><path d="${sn}" fill="none" stroke="#5AA84A" stroke-width="10" stroke-linecap="round"/>` + chT('M-16 14 Q-30 -4 -14 -18 Q6 -22 14 -8 Q14 12 -16 14Z', '#5AA84A', '#3E8434', { lw: 3.4 }) + `<circle cx="-4" cy="-4" r="3" fill="${CH_INK}"/>` + chL('M10 -8 l16 -8 M10 -4 l16 4', 2.4, '#C0392B', 1), 1);
    }
    case 'pithos': return g(chT('M-34 40 Q-58 90 -46 140 Q-30 168 0 170 Q30 168 46 140 Q58 90 34 40Z', '#C77C4A', '#9A5A32', { sx: 8, sy: 6, lw: 4.5 }) + chT('M-30 28 h60 v18 h-60Z', '#B06A3A', '#8A4E2A', { lw: 3.8 }) + chT('M-24 22 Q0 0 24 22Z', '#B06A3A', null, { lw: 3.4 }) + chL('M-48 88 h96 M-44 112 h88', 3, '#3A2418', 0.8) + chL('M-32 96 l10 -8 l10 8 l10 -8 l10 8 l10 -8', 2.4, '#3A2418', 0.8), 0);
    case 'apple': return g(`<g transform="translate(0 44)">` + chT('M0 -34 Q-44 -40 -38 0 Q-34 40 0 38 Q34 40 38 0 Q44 -40 0 -34Z', '#F2C23A', '#C8941E', { sx: 8, sy: 6, lw: 4.6 }) + chL('M0 -34 q2 -14 12 -20', 4.5, '#6A4A26') + chT('M6 -48 Q24 -62 34 -46 Q16 -38 6 -48Z', '#6FB04A', '#4E8A34', { lw: 3 }) + chL('M-22 -16 Q-26 0 -18 14', 4, '#FFF2B0', 0.9) + `</g>`, 0);
    case 'cane': return g(chT('M-6 -30 L6 -30 L6 280 L-6 280Z', '#8A6038', '#6A4220', { lw: 3.5 }) + `<path d="M0 -26 Q0 -66 34 -66 Q62 -60 58 -30" fill="none" stroke="${CH_INK}" stroke-width="20" stroke-linecap="round"/><path d="M0 -26 Q0 -66 34 -66 Q62 -60 58 -30" fill="none" stroke="#8A6038" stroke-width="13" stroke-linecap="round"/>`, 1);
    case 'quill': return g(chT('M0 10 Q-34 -40 -10 -110 Q4 -170 62 -196 Q70 -130 40 -66 Q22 -20 6 10Z', '#FBF6EA', '#D8D0BC', { sx: 6, sy: 4, lw: 3.8 }) + chL('M2 4 Q14 -60 56 -190', 4, '#8A6A40', 0.95) + chL('M-6 -40 l26 -14 M-2 -80 l32 -18 M6 -120 l34 -20', 2, '#BDB39A', 0.8) + chT('M-5 6 L5 6 L1 40Z', '#3A3A44', null, { lw: 2.8 }), 0);
  }
  return _hlHand1(kind, c);
};

// ---------- gán đặc trưng cho từng nhân vật ----------
const hlStar = (r1, r2, n = 8) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a = (i * Math.PI) / n - Math.PI / 2, r = i % 2 ? r2 : r1; d += (i ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1); } return d + 'Z'; };
const HL_TRAITS = {
  zeus: { aura: '#FFF3B8', bolt: 1, pet: { k: 'eagle', side: -1, s: 0.85, x: 146 } },
  hera: { peacock: 1 },
  athena: { aegis: '#9AA6C0', pet: { k: 'owl', side: -1 } },
  ares: { spikes: '#B8864A', cheekScar: '#F0A898' },
  aphrodite: { pet: { k: 'dove', side: -1 }, pearls: 1, blush: '#F08AA0' },
  hermes: { pNoWing: 1, wingBig: 1, bag: '#8A5A36' },
  hephaestus: { soot: 1, sootF: 1 },
  paieon: { bag: '#7A9A5A' },
  helen: { pet: { k: 'swan', side: -1 }, blush: '#D9674A' },
  paris: { blush: '#E8907A' },
  menelaus: { freckles: '#9A4A22' },
  pandora: { ribbons: ['#B8C4E0', '#F6A0BC', '#2E8B7A', '#4E9A5A', '#E0B048'] },
  euripides: { drama: 1 },
  herodotus: { petasos: '#C8A060', pNoWing: 1, bag: '#8A6A44' },
  proteus: { seaweed: '#3E9A6A' },
  ai_priest: { leopard: 1 },
  hesiod: { pet: { k: 'lamb', side: -1 } },
  erasmus: { specs: '#6A5A44' },
  alcinous: { crownFruit: '#C0392B' },
  odysseus: { sailRope: '#C8AA6E', hem: { k: 'wave', c: '#2E6FB0' } },
  diomedes: { lionSkin: '#E8B454', lionMane: '#7A4A22', cuirass: '#7D8EA6', bracer: '#7D8EA6' },
  achilles: { shieldEmblem: `<path d="${hlStar(70, 32)}" fill="#F6E08A" stroke="${CH_INK}" stroke-width="4" stroke-linejoin="round"/><circle r="16" fill="#C0392B" stroke="${CH_INK}" stroke-width="3.5"/>` },
  sisyphus: { pet: { k: 'rock', side: -1, x: 140, y: -150, s: 1.1 } },
  kratos_g: { nameplate: 'ΚΡΑΤΟΣ' },
  bia: { chainCollar: 1 },
  prometheus: { pet: { k: 'flame', side: -1, x: 130, y: -190, s: 1.2 } },
  dione: { acorns: 1 },
  styx: { hem: { k: 'wave', c: '#5AA8D8' } },
  eris: { hem: { k: 'torn' } },
  thetis: { fins: '#5ABAC8', shellS: '#F6D8E0', pearls: 1 },
  peleus: { garland: '#F2A0B8' },
  gaia: { sapling: '#5A9A4A', vines: '#4A8A3A', hem: { k: 'vine' } },
  muse: { aura: '#FFF0A8' },
  otus: { pet: { k: 'peak', side: -1 } },
  ephialtes: { pet: { k: 'peak', side: 1 } },
  kid_zelos: { flameHair: 1 },
  kid_bia: { chainCollar: 1 },
  kid_kratos: { cape: '#2E5A52', cuirassGem: '#2E8B7A' },
};
for (const k of Object.keys(HL_TRAITS)) if (CHAR[k]) Object.assign(CHAR[k], HL_TRAITS[k]);

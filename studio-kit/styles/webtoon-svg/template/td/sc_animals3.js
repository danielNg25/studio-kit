// ===== THÚ MỚI TẬP TÂY DU KÝ PHẦN 3 (2026-11-01, CHỜ DUYỆT) — chibi cùng tông ngựa / rồng / rùa P2: viền mực dày, tô phẳng 2 tông, mặt giản dị, má hồng.
// Nạp SAU sc_animals.js (dùng anW, anSh, anBl, anEye, anLeg, anSpiral, anDrop, anStar, AN_*).
// an_<tên>(x, y, k, T, o) — (x,y) = điểm chân / đáy, k = tỉ lệ, o.flip = quay trái (mặc định nhìn sang phải).
// Dùng lại, không vẽ lại: an_ngua, an_rong_trang, an_rua (an_rua_gia và an_su_tu_xanh chỉ bọc thêm chi tiết lên bản có sẵn).

const A3_IV = '#F4ECD6', A3_IVS = '#CDBF9C';   // ngà / sừng
const a3Plume = (d, w, c, T = 0) => chL(d, w + 7) + chL(d, w, c);   // lông đuôi dài: nét mực dày + nét màu
const a3Eyespot = (x, y, r, c1 = '#2E78A8', c2 = '#3E9A6A', c3 = '#E8B838') => `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r)}" ry="${R1(r * 1.25)}" fill="${c3}" stroke="${AN_I}" stroke-width="2.6"/><ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r * 0.7)}" ry="${R1(r * 0.9)}" fill="${c2}"/><ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r * 0.4)}" ry="${R1(r * 0.55)}" fill="${c1}"/>`;
const a3Foot = (dx, col = '#E8A838', cs = '#B8761E') => chT(`M${dx - 40} 0 Q${dx - 22} -22 ${dx + 6} -14 L${dx + 12} -26 L${dx + 20} -12 L${dx + 40} -2 L${dx + 44} 0Z`, col, cs, { sx: 3, sy: 3, lw: 3.6 });

// ---------------------------------------------------------------- GÀ TRỐNG KHỔNG LỒ (an_ga_trong): hình thật của Mão Nhật Tinh Quân · o.peck mổ gật đầu · o.crow ngẩng gáy
function an_ga_trong(x, y, k, T, o = {}) {
  const C = '#F2B63C', CS = '#C98A1E', RD = '#D8402E', RDS = '#A02A1C', OR = '#F08A2E', ORS = '#C4601C', sw = Math.sin(T * 2.4);
  const dip = o.peck ? Math.abs(Math.sin(T * 5)) * 26 : 0, up = o.crow ? -14 : 0, hx = 132 + (o.peck ? dip * 0.7 : 0), hy = -296 + dip + up;
  let s = anSh(0, 2, 150);
  // đuôi: bốn lông cong, màu xen kẽ
  const feat = [['#3E8A7A', -262, -402], ['#C8402E', -324, -346], ['#E8802A', -348, -270], ['#F2B63C', -214, -430]];
  for (const [c, ex, ey] of feat) {
    const tx = ex + sw * 8, ty = ey;
    s += chT(`M-92 -190 Q${R1(ex * 0.55 - 70)} ${R1(ey * 0.5 - 130)} ${R1(tx)} ${R1(ty)} Q${R1(ex * 0.9)} ${R1(ey * 0.35 - 60)} -104 -134Z`, c, mixC(c, '#000000', 0.25), { sx: 5, sy: 4, lw: 4.2 });
    s += chL(`M-100 -170 Q${R1(ex * 0.6 - 50)} ${R1(ey * 0.5 - 90)} ${R1(tx - 8)} ${R1(ty + 22)}`, 2.6, mixC(c, '#000000', 0.35), 0.8);
  }
  // chân + móng
  for (const dx of [-8, 52]) s += chT(`M${dx - 12} -96 L${dx + 12} -96 L${dx + 9} -10 L${dx - 7} -10Z`, '#F0B848', '#C48A28', { sx: 4, sy: 0, lw: 3.8 }) + a3Foot(dx + 8);
  // thân
  s += chT('M-114 -178 Q-124 -92 -14 -84 Q84 -78 136 -150 Q158 -226 112 -258 Q46 -280 -34 -248 Q-106 -226 -114 -178Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chT('M-70 -198 Q-14 -240 70 -202 Q50 -116 -34 -120 Q-72 -140 -70 -198Z', OR, ORS, { sx: 6, sy: 5, lw: 4 });   // cánh
  s += chL('M-50 -190 Q-12 -208 30 -192 M-52 -164 Q-8 -186 40 -164 M-44 -140 Q-6 -158 34 -138', 3, ORS, 0.9);
  // cổ + yếm lông
  s += chT(`M60 -250 Q${R1(hx - 30)} ${R1(hy + 20)} ${R1(hx - 30)} ${R1(hy + 36)} L${R1(hx + 40)} ${R1(hy + 46)} Q150 -230 146 -190 Q120 -218 60 -250Z`, C, CS, { sx: 6, sy: 4, lw: 4.4 });
  let col = ''; for (let i = 0; i < 5; i++) col += `<path d="M${50 + i * 24} -240 q${8} 22 ${22} 14" fill="${OR}" stroke="${AN_I}" stroke-width="3"/>`;
  s += col;
  // đầu: mào, mỏ, yếm
  s += chT(`M${hx - 54} ${hy + 4} Q${hx - 56} ${hy - 52} ${hx} ${hy - 54} Q${hx + 56} ${hy - 52} ${hx + 56} ${hy + 4} Q${hx + 52} ${hy + 46} ${hx} ${hy + 48} Q${hx - 50} ${hy + 46} ${hx - 54} ${hy + 4}Z`, C, CS, { sx: 9, sy: 7, lw: 4.8 });
  s += chT(`M${hx - 40} ${hy - 44} Q${hx - 62} ${hy - 96} ${hx - 28} ${hy - 90} Q${hx - 22} ${hy - 124} ${hx + 10} ${hy - 104} Q${hx + 34} ${hy - 128} ${hx + 44} ${hy - 90} Q${hx + 72} ${hy - 84} ${hx + 40} ${hy - 44} Q${hx} ${hy - 62} ${hx - 40} ${hy - 44}Z`, RD, RDS, { sx: 5, sy: 4, lw: 4.4 });
  s += chT(`M${hx + 46} ${hy - 8} L${hx + 100} ${hy + 8} L${hx + 48} ${hy + 22}Z`, OR, ORS, { sx: 2, sy: 3, lw: 3.8 }) + chL(`M${hx + 48} ${hy + 8} L${hx + 90} ${hy + 8}`, 2.4);
  s += chT(`M${hx + 30} ${hy + 22} Q${hx + 46} ${hy + 72} ${hx + 18} ${hy + 64} Q${hx + 6} ${hy + 52} ${hx + 10} ${hy + 28}Z`, RD, RDS, { sx: 2, sy: 3, lw: 3.6 });
  s += anEye(hx + 14, hy - 12, 9, 'angry') + chL(`M${hx - 8} ${hy - 30} L${hx + 38} ${hy - 20}`, 4.6) + anBl(hx - 24, hy + 18, 12, 8);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- KIM TINH THÚ (an_thu_cuoi): thú cưỡi của Ngưu Ma Vương, thân vàng, một sừng mũi, yên đỏ · o.walk · o.roar
function an_thu_cuoi(x, y, k, T, o = {}) {
  const C = '#E8B840', CS = '#B88A24', MN = '#E0782C', MNS = '#B05818', ph = T * 5, wk = o.walk ? 1 : 0.1, br = Math.sin(T * 2.4) * 3, sw = (p) => Math.sin(ph + p) * 14 * wk;
  let s = anSh(0, 2, 180);
  s += anLeg(-96, -110, 0, 21, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#5A3A24', 16) + anLeg(100, -110, 0, 21, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#5A3A24', 16);
  const tl = Math.sin(T * 2.6) * 10;
  s += chL(`M-136 -170 Q${-190 + tl} -170 ${-196 + tl} -110`, 12) + chL(`M-136 -170 Q${-190 + tl} -170 ${-196 + tl} -110`, 7, C) + chT(`M${-214 + tl} -126 Q${-226 + tl} -84 ${-196 + tl} -70 Q${-170 + tl} -86 ${-178 + tl} -124Z`, MN, MNS, { sx: 3, sy: 3, lw: 3.6 });
  s += chT(`M-134 -156 Q-140 ${-236 + br} -50 ${-240 + br} Q50 ${-246 + br} 112 ${-226 + br} Q150 -200 140 -150 Q124 -96 50 -92 Q-30 -86 -100 -94 Q-132 -102 -134 -156Z`, C, CS, { sx: 10, sy: 9, lw: 5 });
  s += `<path d="M-80 -128 Q0 -108 90 -126" stroke="#F8E0A0" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.6"/>`;
  s += anLeg(-52, -108, 0, 22, sw(0), C, CS, '#5A3A24', 16) + anLeg(62, -106, 0, 22, sw(Math.PI), C, CS, '#5A3A24', 16);
  // yên đỏ + tua vàng
  s += chT(`M-52 ${-236 + br} Q10 ${-262 + br} 76 ${-232 + br} L72 -178 Q10 -198 -56 -178Z`, '#C8402E', '#8E2418', { sx: 5, sy: 5, lw: 4.4 }) + chL(`M-54 -184 Q10 -204 74 -184`, 5, AN_G) + [-40, -8, 24, 56].map((dx) => `<path d="M${dx} -190 v26" stroke="${AN_G}" stroke-width="5" stroke-linecap="round"/>`).join('');
  // bờm cam cuộn quanh cổ
  let mane = ''; for (let i = 0; i < 7; i++) { const a = -3.0 + i * 0.34, mx = 132 + Math.cos(a) * 84, my = -196 + Math.sin(a) * 84; mane += `<path d="M${R1(mx - 22)} ${R1(my - 14)} Q${R1(mx + Math.cos(a) * 30)} ${R1(my + Math.sin(a) * 34)} ${R1(mx + 22)} ${R1(my + 16)}Z" fill="${i % 2 ? MN : '#F29A44'}" stroke="${AN_I}" stroke-width="3.6" stroke-linejoin="round"/>`; }
  s += mane;
  // đầu: tròn vuông, mõm to, sừng mũi
  const hx = 192, hy = -196;
  s += chT(`M${hx - 56} ${hy + 2} Q${hx - 62} ${hy - 62} ${hx + 4} ${hy - 66} Q${hx + 66} ${hy - 64} ${hx + 72} ${hy - 8} Q${hx + 84} ${hy + 20} ${hx + 70} ${hy + 50} Q${hx + 20} ${hy + 64} ${hx - 28} ${hy + 50} Q${hx - 54} ${hy + 36} ${hx - 56} ${hy + 2}Z`, C, CS, { sx: 9, sy: 8, lw: 5 });
  s += `<circle cx="${hx - 40}" cy="${hy - 58}" r="20" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/><circle cx="${hx - 38}" cy="${hy - 56}" r="10" fill="#F2B0A0"/><circle cx="${hx + 36}" cy="${hy - 62}" r="20" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/><circle cx="${hx + 34}" cy="${hy - 60}" r="10" fill="#F2B0A0"/>`;
  s += chT(`M${hx + 40} ${hy - 4} Q${hx + 56} ${hy - 62} ${hx + 82} ${hy - 78} Q${hx + 86} ${hy - 34} ${hx + 76} ${hy - 4}Z`, A3_IV, A3_IVS, { sx: 3, sy: 3, lw: 4 });   // sừng mũi
  s += `<ellipse cx="${hx + 40}" cy="${hy + 28}" rx="36" ry="26" fill="#F8E4B0" stroke="${AN_I}" stroke-width="3.6"/><ellipse cx="${hx + 60}" cy="${hy + 20}" rx="5" ry="6" fill="${AN_I}"/><ellipse cx="${hx + 28}" cy="${hy + 20}" rx="5" ry="6" fill="${AN_I}"/>`;
  if (o.roar) s += `<path d="M${hx + 8} ${hy + 38} Q${hx + 40} ${hy + 76} ${hx + 70} ${hy + 38}Z" fill="#7A2228" stroke="${AN_I}" stroke-width="3.5"/><path d="M${hx + 14} ${hy + 40} l6 12 l6 -10 M${hx + 46} ${hy + 40} l6 12 l6 -12" fill="#fff" stroke="${AN_I}" stroke-width="2"/>`;
  else s += chL(`M${hx + 14} ${hy + 40} Q${hx + 40} ${hy + 52} ${hx + 64} ${hy + 40}`, 3.4) + `<path d="M${hx + 18} ${hy + 42} l5 10 l5 -9Z" fill="#fff" stroke="${AN_I}" stroke-width="2"/>`;
  s += anEye(hx - 16, hy - 20, 11, 'angry', '#F2C23A') + anEye(hx + 40, hy - 22, 11, 'angry', '#F2C23A') + anBl(hx - 30, hy + 22, 12, 8);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- BẠCH NGƯU KHỔNG LỒ (an_bach_nguu): hình thật của Ngưu Ma Vương — trâu trắng, hai sừng cong, vòng mũi vàng, đứng hung dữ (không máu) · o.snort phun hơi mũi · o.walk
function an_bach_nguu(x, y, k, T, o = {}) {
  const C = '#F6F3EA', CS = '#CFC8B6', M = '#FFFFFF', HN = '#E8D8A8', HNS = '#B8A468', ph = T * 5, wk = o.walk ? 1 : 0.1, br = Math.sin(T * 2.2) * 3, sw = (p) => Math.sin(ph + p) * 14 * wk;
  let s = anSh(0, 2, 200);
  s += anLeg(-112, -100, -16, 25, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#3A2E2A', 16) + anLeg(100, -100, -16, 25, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#3A2E2A', 16);
  const tl = Math.sin(T * 2.4) * 10;
  s += chL(`M-160 -170 Q${-214 + tl} -150 ${-210 + tl} -96`, 12) + chL(`M-160 -170 Q${-214 + tl} -150 ${-210 + tl} -96`, 7, C) + chT(`M${-228 + tl} -110 Q${-238 + tl} -66 ${-210 + tl} -54 Q${-184 + tl} -68 ${-194 + tl} -108Z`, '#3A3438', '#201C1E', { sx: 3, sy: 3, lw: 3.6 });
  s += chT(`M-162 -150 Q-174 ${-232 + br} -90 ${-240 + br} Q-20 ${-244 + br} 30 ${-290 + br} Q90 ${-312 + br} 140 ${-262 + br} Q190 -216 172 -150 Q150 -92 80 -88 Q0 -82 -92 -90 Q-152 -98 -162 -150Z`, C, CS, { sx: 12, sy: 9, lw: 5 });   // lưng có bướu vai
  s += `<path d="M-90 -156 Q0 -134 100 -152" stroke="${M}" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  s += anLeg(-72, -100, -16, 26, sw(0), C, CS, '#3A2E2A', 16) + anLeg(142, -100, -16, 26, sw(Math.PI), C, CS, '#3A2E2A', 16);
  // đầu thấp, chúc xuống như sắp húc
  const hx = 214, hy = -156, Z = 1.2;
  s += `<g transform="translate(${hx} ${hy}) scale(${Z}) translate(${-hx} ${-hy})">`;
  s += chT(`M${hx - 24} ${hy - 62} Q${hx - 96} ${hy - 90} ${hx - 70} ${hy - 168} Q${hx - 62} ${hy - 126} ${hx - 6} ${hy - 90}Z`, HN, HNS, { sx: 3, sy: 3, lw: 4.6 });   // sừng sau
  s += chT(`M${hx - 44} ${hy - 26} Q${hx - 112} ${hy - 50} ${hx - 94} ${hy + 2} Q${hx - 70} ${hy - 12} ${hx - 40} ${hy + 4}Z`, CS, mixC(CS, '#000000', 0.2), { sx: 2, sy: 2, lw: 3.6 }) + `<path d="M${hx - 50} ${hy - 22} Q${hx - 88} ${hy - 32} ${hx - 84} ${hy - 8}" fill="#F0B8A8" opacity="0.7"/>`;
  s += chT(`M${hx - 54} ${hy - 2} Q${hx - 62} ${hy - 76} ${hx} ${hy - 84} Q${hx + 62} ${hy - 84} ${hx + 72} ${hy - 34} Q${hx + 108} ${hy - 10} ${hx + 98} ${hy + 36} Q${hx + 80} ${hy + 64} ${hx + 20} ${hy + 62} Q${hx - 44} ${hy + 54} ${hx - 54} ${hy - 2}Z`, C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chT(`M${hx + 28} ${hy - 72} Q${hx + 40} ${hy - 150} ${hx + 110} ${hy - 150} Q${hx + 76} ${hy - 114} ${hx + 58} ${hy - 62}Z`, HN, HNS, { sx: 3, sy: 3, lw: 4.6 });   // sừng trước, cong ra trước
  s += `<ellipse cx="${hx + 68}" cy="${hy + 24}" rx="40" ry="32" fill="#E6DCCB" stroke="${AN_I}" stroke-width="4"/><ellipse cx="${hx + 86}" cy="${hy + 14}" rx="6" ry="8" fill="${AN_I}"/><ellipse cx="${hx + 54}" cy="${hy + 22}" rx="5" ry="7" fill="${AN_I}"/>`;
  s += chL(`M${hx + 30} ${hy + 46} Q${hx + 60} ${hy + 54} ${hx + 86} ${hy + 44}`, 3.6);
  s += `<circle cx="${hx + 70}" cy="${hy + 46}" r="20" fill="none" stroke="${AN_I}" stroke-width="13"/><circle cx="${hx + 70}" cy="${hy + 46}" r="20" fill="none" stroke="${AN_G}" stroke-width="7"/>`;   // vòng mũi vàng
  s += anEye(hx + 14, hy - 24, 12, 'angry', '#D8402E') + chL(`M${hx - 12} ${hy - 44} L${hx + 38} ${hy - 30}`, 4.4) + anBl(hx + 4, hy + 18, 12, 8);
  s += '</g>';
  if (o.snort) { const p = (T * 3) % 1; for (let i = 0; i < 2; i++) s += `<ellipse cx="${R1(300 + p * 40 + i * 22)}" cy="${R1(-120 - i * 12 - p * 10)}" rx="${R1(14 + p * 14)}" ry="${R1(10 + p * 8)}" fill="#fff" stroke="${AN_I}" stroke-width="3" opacity="${R1(1 - p)}"/>`; }
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- SƯ TỬ XANH (an_su_tu_xanh): yêu Sư Đà — dùng lại hình sư tử xanh, bỏ vòng cổ vàng, mặc định gầm · o.roar:false để ngậm miệng
function an_su_tu_xanh(x, y, k, T, o = {}) { return an_thanh_su(x, y, k, T, Object.assign({ roar: 1, collar: false }, o)); }

// ---------------------------------------------------------------- VOI TRẮNG (an_voi_trang): yêu Sư Đà — thân trắng ngà, ngà dài, tai to hồng, vòi cuộn · o.walk · o.trumpet vòi giơ cao
function an_voi_trang(x, y, k, T, o = {}) {
  const C = '#F6F2EA', CS = '#CFC8B8', EAR = '#F4B8AC', ph = T * 4.4, wk = o.walk ? 1 : 0.1, br = Math.sin(T * 2.2) * 3, sw = (p) => Math.sin(ph + p) * 12 * wk;
  const leg = (dx, d, c, cs) => chT(`M${dx - 34} -138 L${dx + 34} -138 L${R1(dx + 32 + d)} -16 L${R1(dx - 32 + d)} -16Z`, c, cs, { sx: 8, sy: 0, lw: 5 }) + chT(`M${R1(dx - 34 + d)} -16 L${R1(dx + 34 + d)} -16 L${R1(dx + 38 + d)} 0 L${R1(dx - 38 + d)} 0Z`, '#E8E0CC', '#BDB39A', { sx: 3, sy: 0, lw: 3.8 });
  let s = anSh(0, 2, 210);
  s += leg(-104, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2)) + leg(108, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2));
  s += chT('M-150 -190 Q-170 -190 -176 -150 Q-150 -158 -144 -140Z', C, CS, { sx: 3, sy: 3, lw: 3.6 }) + chL('M-158 -176 q-20 18 -14 44', 8) + chL('M-158 -176 q-20 18 -14 44', 4, CS);   // đuôi
  s += chT(`M-158 -190 Q-166 ${-306 + br} -30 ${-312 + br} Q110 ${-312 + br} 150 ${-230 + br} Q166 -130 90 -112 L-90 -112 Q-152 -116 -158 -190Z`, C, CS, { sx: 12, sy: 10, lw: 5.5 });
  s += leg(-46, sw(0), C, CS) + leg(60, sw(Math.PI), C, CS);
  // chăn yên đỏ
  s += chT(`M-76 ${-308 + br} Q-10 ${-326 + br} 62 ${-304 + br} L60 -236 Q-10 -254 -80 -236Z`, '#C8402E', '#8E2418', { sx: 5, sy: 5, lw: 4.6 }) + chL(`M-80 -240 Q-10 -258 60 -240`, 6, AN_G) + [-66, -34, -2, 30, 54].map((dx) => `<circle cx="${dx}" cy="-228" r="5.4" fill="${AN_G}" stroke="${AN_I}" stroke-width="2.2"/>`).join('');
  // đầu + tai + ngà + vòi
  const hx = 176, hy = -222, up = o.trumpet ? 1 : 0;
  s += chT(`M${hx - 88} ${hy - 4} Q${hx - 92} ${hy - 96} ${hx} ${hy - 98} Q${hx + 92} ${hy - 96} ${hx + 86} ${hy - 4} Q${hx + 82} ${hy + 64} ${hx} ${hy + 66} Q${hx - 84} ${hy + 64} ${hx - 88} ${hy - 4}Z`, C, CS, { sx: 12, sy: 9, lw: 5.2 });
  const ex = hx - 28, ey = hy - 10;
  s += chT(`M${ex - 4} ${ey - 78} Q${ex - 84} ${ey - 100} ${ex - 90} ${ey - 10} Q${ex - 88} ${ey + 72} ${ex - 6} ${ey + 62} Q${ex + 32} ${ey + 20} ${ex + 24} ${ey - 40}Z`, C, CS, { sx: 8, sy: 6, lw: 5 }) + `<path d="M${ex - 14} ${ey - 56} Q${ex - 64} ${ey - 66} ${ex - 66} ${ey - 8} Q${ex - 64} ${ey + 44} ${ex - 12} ${ey + 40} Q${ex + 10} ${ey + 8} ${ex + 6} ${ey - 30}Z" fill="${EAR}" opacity="0.85"/>`;   // tai
  const trunk = up ? `M${hx + 70} ${hy + 22} Q${hx + 120} ${hy + 20} ${hx + 120} ${hy - 50} Q${hx + 122} ${hy - 110} ${hx + 84} ${hy - 150}` : `M${hx + 62} ${hy + 14} Q${hx + 112} ${hy + 40} ${hx + 100} ${hy + 110} Q${hx + 94} ${hy + 160} ${hx + 128} ${hy + 168} Q${hx + 156} ${hy + 170} ${hx + 150} ${hy + 140}`;
  s += chL(trunk, 54) + chL(trunk, 44, C) + chL(trunk, 2.6, CS, 0.7);
  if (!up) s += chL(`M${hx + 90} ${hy + 60} q16 -4 26 8 M${hx + 86} ${hy + 90} q16 -4 24 8 M${hx + 90} ${hy + 120} q14 -2 20 8`, 3, CS, 0.9);
  s += chT(`M${hx + 36} ${hy + 40} Q${hx + 110} ${hy + 64} ${hx + 140} ${hy - 6} Q${hx + 118} ${hy + 22} ${hx + 50} ${hy + 20}Z`, A3_IV, A3_IVS, { sx: 3, sy: 3, lw: 4.4 });   // ngà
  s += anEye(hx + 20, hy - 18, 10, 'dot') + anBl(hx + 4, hy + 20, 14, 9) + chL(`M${hx - 2} ${hy - 38} Q${hx + 20} ${hy - 44} ${hx + 40} ${hy - 36}`, 3.4);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- ĐẠI BÀNG CÁNH VÀNG (an_dai_bang): mặc định đậu xếp cánh · o.fly sải cánh lượn (toạ độ y = chân thả xuống, thân ở giữa không trung) · o.fold ép về dáng đậu
function an_dai_bang(x, y, k, T, o = {}) {
  const C = '#F0B030', CS = '#C48A18', WG = '#D89A20', WGS = '#A87414', TIP = '#5E3E18', HD = '#F6D060', fly = o.fly && !o.fold, fl = Math.sin(T * 6) * (fly ? 9 : 0);
  let s = anSh(0, 2, fly ? 120 : 90, fly ? 0.12 : 0.22);
  if (fly) {
    const cy = -250 + Math.sin(T * 3) * 8;
    const wing = (sh, ang0, c, cs, back) => {
      let w = ''; const n = 7;
      for (let i = 0; i < n; i++) { const a = ang0 + i * 16 + (back ? 0 : fl * (0.5 + i * 0.08)), len = (back ? 250 : 300) - i * 14, wd = 52 - i * 3;
        w += `<g transform="translate(${sh[0]} ${sh[1]}) rotate(${R1(a)})">` + chT(`M0 -${wd * 0.4} Q${len * 0.5} -${wd} ${len} -4 Q${len * 0.55} ${wd * 0.6} 0 ${wd * 0.4}Z`, i > 3 ? c : mixC(c, TIP, 0.1 * i), cs, { sx: 2, sy: 4, lw: 3.8 }) + `</g>`; }
      return w;
    };
    s += chT(`M-86 ${cy + 10} Q-190 ${cy - 6} -230 ${cy + 56} Q-170 ${cy + 56} -130 ${cy + 74} Q-100 ${cy + 56} -86 ${cy + 34}Z`, WG, WGS, { sx: 4, sy: 4, lw: 4 });   // đuôi xoè
    s += wing([-6, cy - 20], -200, WG, WGS, true);
    s += chT(`M-104 ${cy} Q-110 ${cy - 56} 10 ${cy - 60} Q100 ${cy - 56} 110 ${cy - 10} Q96 ${cy + 52} 0 ${cy + 54} Q-96 ${cy + 52} -104 ${cy}Z`, C, CS, { sx: 9, sy: 8, lw: 5 });
    s += chT(`M-20 ${cy + 40} L-8 ${cy + 76} L8 ${cy + 40}Z M24 ${cy + 40} L34 ${cy + 76} L48 ${cy + 40}Z`, '#E8A838', '#B8761E', { lw: 3.4 });   // chân thu
    s += wing([-4, cy - 30], -172, C, CS, false);
    s += chT(`M${86} ${cy - 12} Q80 ${cy - 74} 140 ${cy - 78} Q190 ${cy - 70} 190 ${cy - 28} Q184 ${cy + 14} 130 ${cy + 16} Q92 ${cy + 14} 86 ${cy - 12}Z`, HD, '#D8AE38', { sx: 8, sy: 6, lw: 4.8 });
    s += chT(`M178 ${cy - 44} Q226 ${cy - 40} 222 ${cy + 4} Q214 ${cy - 6} 192 ${cy - 8}Z`, '#F29A2A', '#C4601C', { sx: 2, sy: 3, lw: 3.8 });
    s += anEye(150, cy - 40, 9, 'angry', '#E8802A') + chL(`M128 ${cy - 56} L170 ${cy - 46}`, 4.4) + anBl(128, cy - 10, 11, 7);
    return anW(x, y, k, o, s);
  }
  // dáng đậu
  s += chT('M-30 -110 L-130 -22 L-86 -8 L-8 -86Z', WG, WGS, { sx: 4, sy: 4, lw: 4.4 }) + chL('M-60 -86 L-108 -30', 2.6, WGS, 0.9);   // đuôi chúc xuống
  for (const dx of [-12, 38]) s += chT(`M${dx - 11} -86 L${dx + 11} -86 L${dx + 9} -12 L${dx - 9} -12Z`, '#F0B848', '#C48A28', { sx: 4, sy: 0, lw: 3.8 }) + a3Foot(dx + 6);
  s += chT('M-84 -196 Q-98 -104 -8 -88 Q82 -84 98 -172 Q104 -276 12 -296 Q-72 -286 -84 -196Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chT('M-78 -252 Q-30 -296 36 -262 Q46 -176 -14 -114 Q-60 -82 -142 -64 Q-112 -112 -98 -156 Q-84 -204 -78 -252Z', WG, WGS, { sx: 8, sy: 6, lw: 4.6 });   // cánh xếp dài tới đuôi
  for (let i = 0; i < 4; i++) s += chL(`M${-56 + i * 18} ${-236 + i * 14} Q${-62 + i * 14} ${-170 + i * 8} ${-96 + i * 8} ${-96 + i * 4}`, 2.8, WGS, 0.9);
  s += chT('M-142 -64 Q-100 -76 -58 -100 L-76 -78 L-100 -54Z', TIP, '#2E1C08', { lw: 3.2 });   // mút cánh sẫm
  s += chT('M-26 -92 Q-34 -66 4 -62 Q40 -66 32 -94Z', '#E8A838', '#B8761E', { lw: 3.4 });   // quần lông đùi
  const hx = 50, hy = -326;
  s += chT(`M${hx - 40} ${hy + 4} Q${hx - 44} ${hy - 50} ${hx + 6} ${hy - 52} Q${hx + 56} ${hy - 50} ${hx + 54} ${hy} Q${hx + 50} ${hy + 44} ${hx} ${hy + 46} Q${hx - 38} ${hy + 44} ${hx - 40} ${hy + 4}Z`, HD, '#D8AE38', { sx: 8, sy: 6, lw: 4.8 });
  s += chT(`M${hx - 24} ${hy - 44} Q${hx - 40} ${hy - 82} ${hx - 10} ${hy - 72} Q${hx - 4} ${hy - 94} ${hx + 12} ${hy - 66}Z`, WG, WGS, { lw: 3.6 });   // chỏm lông
  s += chT(`M${hx + 34} ${hy - 18} Q${hx + 104} ${hy - 24} ${hx + 98} ${hy + 34} Q${hx + 84} ${hy + 8} ${hx + 54} ${hy + 8}Z`, '#F29A2A', '#C4601C', { sx: 2, sy: 3, lw: 4 }) + chL(`M${hx + 52} ${hy + 6} Q${hx + 80} ${hy - 4} ${hx + 96} ${hy + 26}`, 2.4);   // mỏ quặp
  s += anEye(hx + 18, hy - 14, 9, 'angry', '#E8802A') + chL(`M${hx - 4} ${hy - 32} L${hx + 38} ${hy - 20}`, 4.6) + anBl(hx - 16, hy + 20, 11, 7);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- PHƯỢNG HOÀNG (an_phuong_hoang): đứng, mào ba chùm, đuôi dài nhiều màu có mắt lông · o.fly dang cánh
function an_phuong_hoang(x, y, k, T, o = {}) {
  const C = '#E8503A', CS = '#B4301E', G = '#F2B63C', GS = '#C48A1E', BL = '#3E78C0', GR = '#3E9A6A', sw = Math.sin(T * 2.2);
  let s = anSh(0, 2, 120);
  // ba lông đuôi dài
  const plume = [[-60, -150, -270 + sw * 12, -190, -330, -330, BL], [-70, -128, -300 + sw * 14, -90, -360, -210, G], [-60, -110, -230 + sw * 10, -20, -300, -60, GR]];
  for (const [bx, by, cx, cy, ex, ey, c] of plume) {
    const d = `M${bx} ${by} C${cx} ${cy} ${cx - 40} ${ey + 70} ${ex + sw * 6} ${ey}`;
    s += a3Plume(d, 14, c) + chL(d, 3, mixC(c, '#ffffff', 0.5), 0.7) + a3Eyespot(ex + sw * 6, ey - 4, 16, BL, GR, G);
  }
  for (const dx of [-8, 40]) s += chT(`M${dx - 9} -86 L${dx + 9} -86 L${dx + 7} -12 L${dx - 7} -12Z`, G, GS, { sx: 3, sy: 0, lw: 3.6 }) + a3Foot(dx + 6, G, GS);
  s += chT('M-86 -170 Q-98 -92 -2 -84 Q86 -80 104 -164 Q110 -244 22 -262 Q-76 -256 -86 -170Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chT('M-24 -150 Q40 -150 80 -170 Q70 -108 0 -92 Q-40 -102 -24 -150Z', '#F8D890', '#E0B060', { sx: 4, sy: 4, lw: 3.6 });   // ngực sáng
  // cánh nhiều lớp màu
  s += chT('M-84 -202 Q-60 -262 20 -246 Q-8 -164 -40 -112 Q-78 -126 -84 -202Z', BL, mixC(BL, '#000000', 0.28), { sx: 7, sy: 5, lw: 4.4 }) + chT('M-76 -186 Q-52 -236 8 -226 Q-14 -160 -38 -120 Q-66 -134 -76 -186Z', GR, mixC(GR, '#000000', 0.25), { sx: 6, sy: 4, lw: 3.8 }) + chT('M-66 -172 Q-44 -208 -6 -200 Q-24 -156 -40 -128 Q-58 -138 -66 -172Z', G, GS, { sx: 4, sy: 3, lw: 3.4 });
  // cổ + đầu + mào
  const hx = 96, hy = -290;
  s += chT(`M30 -250 Q${hx - 40} ${hy + 20} ${hx - 36} ${hy + 40} L${hx + 40} ${hy + 40} Q100 -230 96 -190 Q70 -222 30 -250Z`, C, CS, { sx: 6, sy: 4, lw: 4.4 });
  s += chT(`M${hx - 40} ${hy + 4} Q${hx - 44} ${hy - 48} ${hx + 4} ${hy - 50} Q${hx + 54} ${hy - 48} ${hx + 52} ${hy + 2} Q${hx + 48} ${hy + 42} ${hx} ${hy + 44} Q${hx - 38} ${hy + 42} ${hx - 40} ${hy + 4}Z`, C, CS, { sx: 8, sy: 6, lw: 4.8 });
  for (const [dx, h, c] of [[-26, 70, G], [-4, 100, BL], [20, 76, GR]]) { const d = `M${hx + dx} ${hy - 44} Q${hx + dx - 22} ${hy - 44 - h * 0.6} ${hx + dx - 30 + sw * 6} ${hy - 44 - h}`; s += a3Plume(d, 8, c) + `<circle cx="${R1(hx + dx - 30 + sw * 6)}" cy="${hy - 44 - h}" r="9" fill="${c}" stroke="${AN_I}" stroke-width="3"/>`; }
  s += chT(`M${hx + 38} ${hy - 12} L${hx + 84} ${hy + 6} L${hx + 40} ${hy + 20}Z`, G, GS, { sx: 2, sy: 3, lw: 3.8 }) + anEye(hx + 14, hy - 12, 9, 'dot', '#E8802A') + anBl(hx - 16, hy + 16, 11, 7);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- KHỔNG TƯỚC (an_khong_tuoc): Phật Mẫu — thân xanh lam, cổ cong, mào chấm tròn · o.open xoè đuôi hình quạt đầy mắt lông · mặc định đuôi dài rủ phía sau
function an_khong_tuoc(x, y, k, T, o = {}) {
  const B = '#2E78B0', BS = '#1E5688', TL = '#3E9A6A', TLS = '#2A7048', GD = '#E8B838', sw = Math.sin(T * 2.4);
  let s = anSh(0, 2, o.open ? 160 : 140);
  const bx = -10, by = -126;
  if (o.open) {
    const n = 15;
    for (let i = 0; i < n; i++) { const a = (-168 + i * (156 / (n - 1))) * Math.PI / 180, len = 250 + (i % 2) * 20 + Math.sin(T * 2 + i) * 4, ex = bx + Math.cos(a) * len, ey = by - 24 + Math.sin(a) * len;
      s += chL(`M${bx} ${by - 24} L${R1(ex)} ${R1(ey)}`, 14) + chL(`M${bx} ${by - 24} L${R1(ex)} ${R1(ey)}`, 8, i % 2 ? TL : '#4AAA7A'); }
    for (let i = 0; i < n; i++) { const a = (-168 + i * (156 / (n - 1))) * Math.PI / 180, len = 250 + (i % 2) * 20, ex = bx + Math.cos(a) * len, ey = by - 24 + Math.sin(a) * len;
      s += a3Eyespot(ex, ey, 17); }
  } else {
    for (let i = 0; i < 5; i++) { const sy_ = -30 + i * 10, d = `M-60 ${-86 + i * 6} Q${-150 - i * 10} ${-80 + i * 6 + sw * 4} ${-230 - i * 24 + sw * 8} ${sy_ - 10}`;
      s += a3Plume(d, 10, i % 2 ? TL : '#4AAA7A') + a3Eyespot(-230 - i * 24 + sw * 8, sy_ - 10, 13); }
  }
  for (const dx of [-6, 40]) s += chT(`M${dx - 8} -80 L${dx + 8} -80 L${dx + 6} -10 L${dx - 6} -10Z`, '#C8A070', '#8E6C44', { sx: 3, sy: 0, lw: 3.4 }) + a3Foot(dx + 6, '#C8A070', '#8E6C44');
  s += chT(`M-96 -118 Q-98 -190 -10 -196 Q84 -194 104 -126 Q100 -66 0 -62 Q-92 -62 -96 -118Z`, B, BS, { sx: 9, sy: 8, lw: 5 });
  s += chT('M-70 -130 Q-14 -160 60 -132 Q30 -86 -26 -84 Q-62 -94 -70 -130Z', TL, TLS, { sx: 4, sy: 4, lw: 3.8 });   // cánh
  s += chL('M-50 -130 Q-14 -146 30 -130 M-44 -108 Q-10 -122 24 -110', 2.8, TLS, 0.9);
  // cổ cong chữ S
  const nk = `M70 -150 Q124 -190 100 -250 Q88 -282 112 -304`;
  s += chL(nk, 44) + chL(nk, 34, B) + chL('M84 -168 Q132 -200 112 -250', 3, '#6AB0E0', 0.8);
  const hx = 126, hy = -318;
  s += chT(`M${hx - 30} ${hy + 2} Q${hx - 32} ${hy - 34} ${hx + 4} ${hy - 36} Q${hx + 38} ${hy - 34} ${hx + 36} ${hy + 2} Q${hx + 32} ${hy + 32} ${hx} ${hy + 33} Q${hx - 28} ${hy + 32} ${hx - 30} ${hy + 2}Z`, B, BS, { sx: 6, sy: 5, lw: 4.6 });
  s += `<ellipse cx="${hx + 6}" cy="${hy - 2}" rx="20" ry="22" fill="#F4F0E4" stroke="${AN_I}" stroke-width="3.4"/>` + chT(`M${hx + 30} ${hy - 8} L${hx + 64} ${hy + 4} L${hx + 30} ${hy + 14}Z`, '#E8A838', '#B8761E', { lw: 3.4 });
  for (const [dx, h] of [[-14, 52], [4, 64], [22, 50]]) s += chL(`M${hx + dx} ${hy - 32} L${hx + dx + (dx - 4) * 0.5} ${hy - 32 - h}`, 3.6) + `<circle cx="${R1(hx + dx + (dx - 4) * 0.5)}" cy="${hy - 32 - h}" r="8" fill="${TL}" stroke="${AN_I}" stroke-width="3"/>`;
  s += anEye(hx + 12, hy - 4, 8, 'dot') + anBl(hx - 8, hy + 16, 9, 6);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- HƯƠU TRẮNG (an_huou_trang): yêu ở Tỳ Kheo — lông trắng chấm kem, sừng cành vàng ngà, mắt hiền · o.sit nằm gập chân · o.walk
function an_huou_trang(x, y, k, T, o = {}) {
  const C = '#FBF8F0', CS = '#D8D0BE', SP = '#EEDFC4', ph = T * 5, wk = o.walk ? 1 : 0.1, sw = (p) => Math.sin(ph + p) * 12 * wk, H = o.sit ? 78 : 0, br = Math.sin(T * 2.2) * 2;
  let s = anSh(0, 2, o.sit ? 150 : 140);
  if (!o.sit) s += anLeg(-84, -112, 0, 11, sw(Math.PI) * 0.6, CS, mixC(CS, '#000000', 0.2), '#5A4A40', 14) + anLeg(88, -112, 0, 11, sw(0) * 0.6, CS, mixC(CS, '#000000', 0.2), '#5A4A40', 14);
  s += `<g transform="translate(0 ${H})">`;
  s += chT(`M-122 -168 Q-130 ${-218 + br} -40 ${-222 + br} Q50 ${-226 + br} 112 ${-206 + br} Q132 -190 126 -152 Q108 -102 40 -100 Q-40 -96 -100 -108 Q-124 -122 -122 -168Z`, C, CS, { sx: 10, sy: 8, lw: 4.8 });
  s += [[-70, -180], [-20, -196], [30, -190], [70, -172], [-48, -150], [4, -160], [50, -140], [-86, -146]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy + br}" r="7" fill="${SP}"/>`).join('');
  s += chT('M-122 -170 Q-150 -176 -154 -148 Q-134 -150 -124 -138Z', C, CS, { lw: 3.4 });   // đuôi nhỏ
  // cổ + đầu
  s += chT('M70 -206 Q130 -250 116 -316 L172 -318 Q160 -240 126 -170Z', C, CS, { sx: 6, sy: 4, lw: 4.4 });
  const hx = 166, hy = -318;
  // sừng
  const ant = (sg) => { const bx = hx + sg * 6, by = hy - 40; return a3Plume(`M${bx} ${by} Q${bx + sg * 6} ${by - 60} ${bx + sg * 30} ${by - 104}`, 7, '#F0DCA0') + a3Plume(`M${bx + sg * 6} ${by - 40} Q${bx + sg * 36} ${by - 50} ${bx + sg * 54} ${by - 82}`, 6, '#F0DCA0') + a3Plume(`M${bx + sg * 20} ${by - 74} Q${bx + sg * 4} ${by - 100} ${bx + sg * 8} ${by - 120}`, 5, '#F0DCA0'); };
  s += ant(-1) + chT(`M${hx - 58} ${hy - 30} Q${hx - 100} ${hy - 50} ${hx - 80} ${hy - 4} Q${hx - 56} ${hy - 16} ${hx - 40} ${hy - 6}Z`, C, CS, { lw: 3.6 }) + `<path d="M${hx - 58} ${hy - 26} Q${hx - 88} ${hy - 38} ${hx - 76} ${hy - 10}" fill="#F4B8AC" opacity="0.8"/>`;
  s += chT(`M${hx - 44} ${hy + 4} Q${hx - 48} ${hy - 50} ${hx + 6} ${hy - 52} Q${hx + 60} ${hy - 48} ${hx + 66} ${hy - 6} Q${hx + 96} ${hy + 14} ${hx + 82} ${hy + 40} Q${hx + 50} ${hy + 54} ${hx} ${hy + 50} Q${hx - 42} ${hy + 44} ${hx - 44} ${hy + 4}Z`, C, CS, { sx: 8, sy: 6, lw: 4.8 });
  s += ant(1) + chT(`M${hx + 36} ${hy - 32} Q${hx + 84} ${hy - 56} ${hx + 70} ${hy - 6} Q${hx + 50} ${hy - 20} ${hx + 36} ${hy - 14}Z`, C, CS, { lw: 3.6 }) + `<path d="M${hx + 44} ${hy - 28} Q${hx + 72} ${hy - 40} ${hx + 64} ${hy - 12}" fill="#F4B8AC" opacity="0.8"/>`;
  s += `<ellipse cx="${hx + 78}" cy="${hy + 22}" rx="9" ry="7" fill="#5A3A3A"/>` + chL(`M${hx + 30} ${hy + 34} Q${hx + 58} ${hy + 44} ${hx + 78} ${hy + 34}`, 3) + anEye(hx + 14, hy - 8, 10, 'dot', '#6A4A30') + anBl(hx - 6, hy + 24, 11, 7);
  s += '</g>';
  if (o.sit) {   // chân gập: hai đùi bẹt trên đất
    s += chT('M-100 -26 Q-110 -80 -40 -78 Q30 -78 40 -34 Q34 0 -40 0 Q-98 0 -100 -26Z', C, CS, { sx: 8, sy: 6, lw: 4.6 }) + chT('M50 -30 Q50 -62 108 -58 Q150 -50 146 -22 Q140 0 100 0 Q54 0 50 -30Z', C, CS, { sx: 6, sy: 5, lw: 4.4 }) + `<ellipse cx="136" cy="-8" rx="14" ry="9" fill="#5A4A40" stroke="${AN_I}" stroke-width="3"/>`;
  }
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- THỎ NGỌC (an_tho_ngoc): giã thuốc ở cung trăng — thỏ ngồi, tai dài, má hồng · o.pound cầm chày giã vào cối (chày nhấc lên hạ xuống theo T)
function an_tho_ngoc(x, y, k, T, o = {}) {
  const C = '#F8FAF6', CS = '#D3DCD6', PK = '#F4B0B0', ph = (o.pound ? Math.abs(Math.sin(T * 3.4)) : 0), earw = Math.sin(T * 2.4) * 4;
  let s = anSh(0, 2, o.pound ? 150 : 90);
  s += chT('M-70 0 Q-96 -64 -42 -132 Q8 -170 64 -132 Q106 -64 78 0Z', C, CS, { sx: 9, sy: 7, lw: 5 });
  s += chT('M62 -34 Q92 -22 90 0 L52 0Z', C, CS, { sx: 4, sy: 3, lw: 4 }) + chT('M-86 -30 Q-64 -4 -50 0 L-84 0Z', C, CS, { sx: 4, sy: 3, lw: 4 });   // bàn chân
  s += `<circle cx="-70" cy="-60" r="16" fill="${C}" stroke="${AN_I}" stroke-width="4"/>`;   // đuôi bông
  const hx = 20, hy = -190;
  // tai: một dựng, một cúp
  s += chT(`M${hx - 28} ${hy - 40} Q${hx - 62 + earw} ${hy - 120} ${hx - 36 + earw} ${hy - 192} Q${hx - 4 + earw} ${hy - 170} ${hx + 6} ${hy - 44}Z`, C, CS, { sx: 6, sy: 4, lw: 4.6 }) + `<path d="M${hx - 26} ${hy - 56} Q${hx - 46 + earw} ${hy - 120} ${hx - 34 + earw} ${hy - 162} Q${hx - 14 + earw} ${hy - 130} ${hx - 6} ${hy - 58}Z" fill="${PK}" opacity="0.85"/>`;
  s += chT(`M${hx + 14} ${hy - 44} Q${hx + 60} ${hy - 90} ${hx + 98} ${hy - 80 + earw} Q${hx + 112} ${hy - 62} ${hx + 82} ${hy - 50} Q${hx + 60} ${hy - 30} ${hx + 34} ${hy - 30}Z`, C, CS, { sx: 4, sy: 5, lw: 4.6 }) + `<path d="M${hx + 24} ${hy - 48} Q${hx + 60} ${hy - 76} ${hx + 90} ${hy - 72 + earw} Q${hx + 90} ${hy - 62} ${hx + 70} ${hy - 54}" fill="${PK}" opacity="0.85"/>`;
  s += chT(`M${hx - 62} ${hy + 6} Q${hx - 66} ${hy - 50} ${hx} ${hy - 54} Q${hx + 66} ${hy - 50} ${hx + 66} ${hy + 6} Q${hx + 62} ${hy + 48} ${hx} ${hy + 50} Q${hx - 60} ${hy + 48} ${hx - 62} ${hy + 6}Z`, C, CS, { sx: 9, sy: 7, lw: 5 });
  s += `<path d="M${hx + 4} ${hy + 16} l-8 8 h16Z" fill="${PK}" stroke="${AN_I}" stroke-width="2.6" stroke-linejoin="round"/>` + chL(`M${hx + 4} ${hy + 24} v8 M${hx - 14} ${hy + 30} Q${hx + 4} ${hy + 42} ${hx + 22} ${hy + 30}`, 3.2);
  s += `<rect x="${hx - 8}" y="${hy + 32}" width="9" height="12" rx="2" fill="#fff" stroke="${AN_I}" stroke-width="2.2"/><rect x="${hx + 2}" y="${hy + 32}" width="9" height="12" rx="2" fill="#fff" stroke="${AN_I}" stroke-width="2.2"/>`;
  s += anEye(hx - 28, hy - 6, 10, 'dot', '#D8504A') + anEye(hx + 34, hy - 6, 10, 'dot', '#D8504A') + anBl(hx - 46, hy + 22, 13, 8) + anBl(hx + 54, hy + 22, 13, 8);
  s += chL(`M${hx - 28} ${hy + 40} h-30 M${hx - 30} ${hy + 32} l-30 -8 M${hx + 40} ${hy + 40} h30 M${hx + 42} ${hy + 32} l30 -8`, 2, AN_I, 0.6);
  if (o.pound) {
    // cối ngọc ở trước, chày hai tay nâng
    s += chT('M70 -66 Q70 -4 120 -2 Q170 -4 170 -66Z', '#BFE4D6', '#8CC0AE', { sx: 5, sy: 4, lw: 4.6 }) + `<ellipse cx="120" cy="-66" rx="52" ry="12" fill="#8CC0AE" stroke="${AN_I}" stroke-width="4"/><ellipse cx="120" cy="-64" rx="40" ry="7" fill="#F4E8B8"/>`;
    const py = -150 - ph * 90;
    s += chT(`M110 ${py - 120} L130 ${py - 120} L134 ${py + 84} L106 ${py + 84}Z`, '#B88A58', '#8A6232', { sx: 4, sy: 0, lw: 4 }) + chT(`M98 ${py + 74} L142 ${py + 74} L138 ${py + 96} L102 ${py + 96}Z`, '#D8B078', '#A8844E', { lw: 3.6 });
    s += `<circle cx="104" cy="${py + 14}" r="17" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/><circle cx="138" cy="${py + 6}" r="17" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/>`;
  } else s += `<circle cx="-6" cy="-104" r="16" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/><circle cx="40" cy="-104" r="16" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/>`;
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- BỌ CẠP KHỔNG LỒ (an_bo_cap): yêu Tỳ Bà — to bằng đàn tỳ bà (dài ≈ 300), hai càng, đuôi móc cong lên trên đầu · o.sting đuôi quặp ra trước đâm xuống
function an_bo_cap(x, y, k, T, o = {}) {
  const C = '#9A5A8E', CS = '#6E3A66', LG = '#6E3A66', sw = Math.sin(T * 3) * 4, sting = o.sting ? 1 : 0;
  let s = anSh(0, 2, 190);
  // bốn chân mỗi bên (hai lớp), khớp gập
  const leg = (bx, i, back) => { const dir = (i - 1.5) * 46, ky = -34 - (back ? 8 : 0), d = `M${bx + i * 26} -58 L${bx + i * 26 + dir * 0.7} ${ky - 36} L${bx + i * 26 + dir * 1.3} -3`; return chL(d, back ? 16 : 18) + chL(d, back ? 10 : 12, back ? mixC(LG, '#000000', 0.2) : LG); };
  for (let i = 0; i < 4; i++) s += leg(-48, i, true);
  // đuôi: chuỗi đốt tròn, cong vòng ra sau rồi lên trên
  const P = sting ? [[-130, -76], [-210, -108], [-220, -214], [-130, -286], [-10, -250], [90, -190], [150, -100]] : [[-130, -76], [-210, -112], [-234, -210], [-196, -300], [-110, -340], [-30, -310], [8, -250]];
  const pt = (u) => { const n = P.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), t = f - i, a = P[i], b = P[i + 1]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
  for (let i = 17; i >= 0; i--) { const [px, py] = pt(i / 17), r = 30 - i * 0.7; s += chT(`M${R1(px - r)} ${R1(py)} a${R1(r)} ${R1(r * 0.92)} 0 1 0 ${R1(r * 2)} 0 a${R1(r)} ${R1(r * 0.92)} 0 1 0 ${-R1(r * 2)} 0Z`, i % 2 ? C : mixC(C, '#ffffff', 0.12), CS, { sx: 5, sy: 4, lw: 4 }); }
  const [tx, ty] = pt(1), [qx, qy] = pt(0.9), ang = Math.atan2(ty - qy, tx - qx) * 180 / Math.PI;
  s += `<g transform="translate(${R1(tx)} ${R1(ty)}) rotate(${R1(ang + sw)})">` + chT('M-8 -16 Q40 -22 64 14 Q30 4 -8 16Z', '#E8D8B0', '#B8A470', { sx: 2, sy: 3, lw: 4 }) + '</g>';
  // thân
  s += chT('M-154 -78 Q-150 -122 -92 -126 Q-40 -150 40 -130 Q112 -118 118 -70 Q104 -30 20 -28 Q-60 -22 -130 -42 Q-154 -52 -154 -78Z', C, CS, { sx: 10, sy: 8, lw: 5 });
  s += chL('M-110 -90 Q-78 -102 -50 -90 M-56 -92 Q-18 -108 20 -92 M-12 -92 Q30 -108 70 -92', 3.4, CS, 0.9);
  // càng: tay hai khúc + kìm
  const claw = (dy, big) => `<g transform="translate(0 ${dy})">` + chL('M96 -78 Q150 -78 178 -106', 26) + chL('M96 -78 Q150 -78 178 -106', 18, C) + chT(`M166 -118 Q186 -176 ${big ? 252 : 240} -150 Q${big ? 230 : 222} -140 218 -116 Q220 -96 196 -86 Q172 -86 166 -118Z`, C, CS, { sx: 5, sy: 5, lw: 4.6 }) + chT(`M176 -96 Q214 -92 246 -102 Q252 -80 224 -66 Q192 -62 176 -96Z`, mixC(C, '#ffffff', 0.12), CS, { sx: 4, sy: 5, lw: 4.4 }) + '</g>';
  s += claw(14, false) + claw(-14, true);
  s += anEye(82, -110, 11, 'angry', '#F2C23A') + anEye(46, -118, 10, 'angry', '#F2C23A') + anBl(94, -80, 11, 7);
  s += chL('M70 -62 Q92 -50 110 -62', 3.4);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- CHUỘT TINH (an_chuot): Chuột tinh Địa Dũng nghịch ngợm — đứng hai chân, hai tay xoa vào nhau, cười hở răng · o.run chạy khom · o.sneak rón rén
function an_chuot(x, y, k, T, o = {}) {
  const C = '#B0A494', CS = '#8A7E6E', BL = '#EADFCB', PK = '#F2B0A8', sw = Math.sin(T * 3), rub = Math.sin(T * 9) * 5;
  let s = anSh(0, 2, 90);
  const tail = `M-62 -34 Q-130 -20 -140 -84 Q-146 -130 -104 -140`;
  s += chL(tail, 14) + chL(tail, 8, PK);
  s += chT('M-40 -18 Q-44 -44 -6 -44 Q30 -44 28 -18 Q26 0 -4 0 Q-36 0 -40 -18Z', C, CS, { sx: 4, sy: 3, lw: 4 }) + chT('M26 -18 Q26 -40 56 -38 Q88 -34 86 -14 Q82 0 52 0 Q26 0 26 -18Z', C, CS, { sx: 4, sy: 3, lw: 4 });   // hai bàn chân
  s += chT('M-62 -50 Q-84 -130 -30 -190 Q26 -226 74 -186 Q108 -126 82 -50 Q20 -20 -62 -50Z', C, CS, { sx: 9, sy: 7, lw: 5 });
  s += chT('M-26 -116 Q6 -134 52 -116 Q56 -64 10 -52 Q-26 -62 -26 -116Z', BL, '#D0C3A8', { sx: 3, sy: 3, lw: 3.4 });   // bụng sáng
  // đầu nhọn mõm, tai tròn to
  const hx = 28, hy = -236;
  s += `<circle cx="${hx - 44}" cy="${hy - 40}" r="38" fill="${C}" stroke="${AN_I}" stroke-width="4.8"/><circle cx="${hx - 42}" cy="${hy - 38}" r="22" fill="${PK}"/><circle cx="${hx + 40}" cy="${hy - 44}" r="38" fill="${C}" stroke="${AN_I}" stroke-width="4.8"/><circle cx="${hx + 38}" cy="${hy - 42}" r="22" fill="${PK}"/>`;
  s += chT(`M${hx - 56} ${hy + 8} Q${hx - 58} ${hy - 44} ${hx - 2} ${hy - 48} Q${hx + 56} ${hy - 44} ${hx + 60} ${hy - 6} Q${hx + 120} ${hy + 6} ${hx + 118} ${hy + 22} Q${hx + 104} ${hy + 44} ${hx + 40} ${hy + 46} Q${hx - 50} ${hy + 44} ${hx - 56} ${hy + 8}Z`, C, CS, { sx: 8, sy: 6, lw: 5 });
  s += `<ellipse cx="${hx + 116}" cy="${hy + 18}" rx="9" ry="8" fill="${AN_I}"/>`;
  s += chL(`M${hx + 54} ${hy + 22} Q${hx + 86} ${hy + 40} ${hx + 108} ${hy + 30}`, 3.4) + `<rect x="${hx + 66}" y="${hy + 30}" width="10" height="14" rx="2" fill="#fff" stroke="${AN_I}" stroke-width="2.4"/><rect x="${hx + 77}" y="${hy + 28}" width="10" height="14" rx="2" fill="#fff" stroke="${AN_I}" stroke-width="2.4"/>`;
  s += chL(`M${hx + 70} ${hy + 14} l50 -16 M${hx + 70} ${hy + 20} l54 2 M${hx + 70} ${hy + 26} l50 20`, 2.2, AN_I, 0.55);
  s += anEye(hx + 10, hy - 6, 11, 'dot') + anEye(hx + 62, hy - 6, 10, 'dot') + chL(`M${hx - 6} ${hy - 26} L${hx + 30} ${hy - 20} M${hx + 48} ${hy - 22} L${hx + 78} ${hy - 26}`, 3.8) + anBl(hx - 8, hy + 28, 12, 7);
  // hai tay xoa nhau trước bụng
  s += `<circle cx="${R1(36 + rub)}" cy="-98" r="17" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/><circle cx="${R1(54 - rub)}" cy="-92" r="17" fill="${C}" stroke="${AN_I}" stroke-width="4.4"/>`;
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- CON ONG (an_ong): Lục Nhĩ Di Hầu hoá ong — nhỏ, cánh vỗ nhanh theo T · (x,y) = điểm dưới thân (ong lơ lửng, bay nhấp nhô)
function an_ong(x, y, k, T, o = {}) {
  const Y = '#F6C42E', YS = '#C8981A', BK = '#3A2A1E', bob = Math.sin(T * 3) * 6, fl = Math.sin(T * 42) * 20;
  let s = anSh(0, 2, 60, 0.14);
  s += `<g transform="translate(0 ${R1(-100 + bob)})">`;
  const wing = (a, dx) => `<g transform="translate(${dx} -36) rotate(${R1(a)})"><ellipse cx="0" cy="-34" rx="22" ry="46" fill="#DDF0FA" stroke="${AN_I}" stroke-width="3.6" opacity="0.88"/><path d="M0 -10 V-70" stroke="#9CC8E0" stroke-width="2.4" fill="none"/></g>`;
  s += wing(-26 + fl, -14) + wing(10 - fl * 0.8, 14);
  s += chT('M-110 6 L-70 -8 L-70 28Z', BK, '#14100C', { lw: 3.2 });   // ngòi
  s += chT('M-84 -2 Q-86 -46 -30 -52 Q40 -56 66 -20 Q80 24 20 40 Q-60 48 -84 -2Z', Y, YS, { sx: 8, sy: 6, lw: 5 });
  s += `<path d="M-52 -48 Q-64 -4 -50 40 Q-36 44 -28 42 Q-42 -4 -34 -52Z" fill="${BK}" stroke="${AN_I}" stroke-width="2.4"/><path d="M-10 -54 Q-22 -4 -8 44 Q6 46 14 43 Q0 -4 8 -54Z" fill="${BK}" stroke="${AN_I}" stroke-width="2.4"/>`;
  s += chT('M44 -28 Q40 -62 82 -64 Q124 -62 122 -26 Q122 14 80 16 Q44 14 44 -28Z', Y, YS, { sx: 6, sy: 5, lw: 4.6 });
  for (const sg of [-1, 1]) { const ax = 82 + sg * 18; s += chL(`M${ax} -62 Q${ax + sg * 10} -92 ${ax + sg * 26 + Math.sin(T * 5) * 3} -104`, 3.8) + `<circle cx="${R1(ax + sg * 26 + Math.sin(T * 5) * 3)}" cy="-104" r="6" fill="${BK}"/>`; }
  s += anEye(70, -30, 10, 'dot') + anEye(104, -30, 10, 'dot') + anBl(58, -6, 9, 6) + anBl(116, -6, 9, 6) + chL('M78 -6 Q88 4 98 -6', 3.2);
  s += '</g>';
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- RÙA GIÀ (an_rua_gia): bản an_rua có sẵn + rêu trên mai, râu bạc dưới cằm, nếp nhăn cổ · nhận mọi cờ của an_rua (head, water)
function an_rua_gia(x, y, k, T, o = {}) {
  const up = o.head ? 1 : 0, hx = 320 + up * 18, hy = -92 - up * 118, br = Math.sin(T * 1.8) * 3;
  let ov = '';
  // rêu xanh thẫm trên mai
  for (const [mx, my, r] of [[-120, -196, 34], [-30, -236, 28], [64, -226, 30], [150, -176, 28], [-190, -128, 24], [0, -140, 22]]) ov += `<ellipse cx="${mx}" cy="${my + br}" rx="${r}" ry="${r * 0.42}" fill="#4E7E44" stroke="${AN_I}" stroke-width="3" opacity="0.92"/><path d="M${mx - r * 0.6} ${my + br} q${r * 0.2} -16 ${r * 0.4} 0 M${mx + r * 0.1} ${my + br - 2} q${r * 0.2} -14 ${r * 0.4} 2" fill="none" stroke="#6AA05A" stroke-width="3" stroke-linecap="round"/>`;
  // râu bạc dưới cằm
  ov += chT(`M${hx - 22} ${hy + 34} Q${hx - 28} ${hy + 76} ${hx - 4} ${hy + 104} Q${hx + 16} ${hy + 70} ${hx + 26} ${hy + 40}Z`, '#F4F0E8', '#CFC8B8', { sx: 3, sy: 3, lw: 3.8 }) + chL(`M${hx - 8} ${hy + 44} q-2 28 6 48 M${hx + 8} ${hy + 44} q2 22 -2 40`, 2.2, '#CFC8B8', 0.9);
  // nếp nhăn cổ + trán
  ov += chL(`M${hx - 36} ${hy - 38} q18 -8 38 -2 M${hx - 30} ${hy - 28} q14 -6 28 -2`, 2.6, '#74A06A', 0.9);
  return anW(x, y, k, o, an_rua(0, 0, 1, T, Object.assign({}, o, { flip: 0, rot: 0 })) + ov);
}

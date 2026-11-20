// ===== CON VẬT TẬP ĐỒNG DAO (C2 bản 1, 2026-11-18, CHỜ DUYỆT) — cùng kiểu an_* (td/sc_animals.js): viền mực dày, tô phẳng 2 tông, mắt chibi.
// an_<tên>(x, y, k, T, o): (x,y) = điểm chân/đáy, k tỉ lệ, o.flip quay trái (mặc định nhìn phải). o.ex: 'dot'|'closed'|'happy'|'sad'|'angry'|'swirl'|'x'.
// Mỗi con một dấu hiệu lớn: cò = cổ dài trắng mỏ vàng · vạc = lùn mập, mũ đen, mắt đỏ · nông = túi mỏ to · diệc = xám, mào đen
// le le = vịt nhỏ nâu cổ trắng · bìm bịp = đen, cánh nâu đỏ, mắt đỏ, đuôi dài · tò vò = eo thắt như sợi chỉ · nhện = bụng tròn 8 chân
// mèo = mèo mướp cam · ếch = xanh mắt lồi. Chuột dùng an_chuot sẵn có.

// chân chim dài (đứng)
const ddBirdLegs = (xs, top, bot, c = '#3A3430') => xs.map(dx => chL(`M${dx} ${top} L${dx + 2} ${bot}`, 10, AN_I) + chL(`M${dx} ${top} L${dx + 2} ${bot}`, 5, c) + chL(`M${dx - 16} ${bot} L${dx + 26} ${bot} M${dx + 2} ${bot} L${dx + 18} ${bot - 10}`, 4, AN_I)).join('');

// ---------------------------------------------------------------- CÒ TRẮNG (an_co): o.fly bay · o.chick cò con trong tổ (tròn, lông tơ) · o.fall lộn cổ (xoay 140°)
function an_co(x, y, k, T, o = {}) {
  const C = '#FBFAF4', CS = '#D6D4CA', BY = '#E8B83A', fly = !!o.fly, fl = Math.sin(T * 5) * 30, ex = o.ex || 'dot';
  if (o.chick) { let s = anSh(0, 2, 70); s += chT('M-60 -10 Q-70 -100 0 -110 Q70 -100 60 -10 Q0 10 -60 -10Z', '#F4F2EA', '#D8D4C8', { sx: 5, sy: 5, lw: 4.5 }) + chL('M-20 -110 l-6 -24 M0 -112 l2 -26 M18 -108 l10 -22', 3.5, AN_I) + `<path d="M40 -70 L90 -62 L40 -54Z" fill="${BY}" stroke="${AN_I}" stroke-width="3.5" stroke-linejoin="round"/>` + anEye(18, -76, 9, ex) + anBl(30, -52, 8, 5); return anW(x, y, k, o, s); }
  let s = fly ? '' : anSh(0, 2, 100);
  if (fly) s += chL('M-40 -150 Q-100 -140 -170 -130 M-30 -144 Q-100 -124 -160 -112', 8, AN_I);
  else s += ddBirdLegs([-10, 22], -130, -2);
  if (fly) s += `<g transform="rotate(${R1(-fl - 20)} -10 -190)">` + chT('M-10 -196 Q-40 -300 -150 -320 Q-120 -270 -150 -240 Q-90 -240 -120 -206 Q-60 -212 -10 -190Z', CS, mixC(CS, '#000000', 0.12), { sx: 6, sy: 6, lw: 4 }) + '</g>';
  s += chT('M-100 -170 Q-104 -236 -20 -240 Q56 -242 90 -206 Q104 -172 64 -140 Q6 -116 -60 -128 Q-100 -138 -100 -170Z', C, CS, { sx: 10, sy: 8, lw: 4.5 });
  s += chT('M-100 -176 Q-150 -170 -170 -150 Q-130 -152 -96 -146Z', C, CS, { lw: 3.5 });                 // đuôi lông
  const nk = Math.sin(T * 2) * 4, hx = 128 + nk, hy = -366;
  s += chL(`M70 -208 Q${124 + nk} -236 ${108 + nk} -290 Q${96 + nk} -332 ${hx - 4} ${hy + 10}`, 30, AN_I) + chL(`M70 -208 Q${124 + nk} -236 ${108 + nk} -290 Q${96 + nk} -332 ${hx - 4} ${hy + 10}`, 22, C);
  s += `<path d="M${hx + 10} ${hy - 6} L${hx + 120} ${hy + 8} L${hx + 10} ${hy + 18}Z" fill="${BY}" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<circle cx="${hx}" cy="${hy}" r="28" fill="${C}" stroke="${AN_I}" stroke-width="4.5"/>` + chL(`M${hx - 20} ${hy - 22} Q${hx - 60} ${hy - 40} ${hx - 80} ${hy - 20}`, 3, '#B8B4A8') + anEye(hx + 6, hy - 4, 8, ex) + anBl(hx + 14, hy + 14, 7, 5);
  if (fly) s += `<g transform="rotate(${R1(fl)} -10 -190)">` + chT('M-10 -196 Q10 -330 -120 -350 Q-90 -300 -130 -266 Q-70 -270 -100 -224 Q-40 -226 0 -190Z', C, CS, { sx: 8, sy: 8, lw: 4.5 }) + '</g>';
  else s += chT('M-80 -190 Q-66 -228 -6 -222 Q40 -218 58 -190 Q20 -168 -40 -168 Q-78 -170 -80 -190Z', C, CS, { sx: 6, sy: 6, lw: 4 });
  if (o.fall) return anW(x, y, k, Object.assign({}, o, { rot: o.fall }), s);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- VẠC (an_vac): lùn mập, lưng xám đen, mũ đen, bụng trắng, mắt đỏ, cổ rụt · o.sleep đứng ngủ (mắt nhắm, Zzz)
function an_vac(x, y, k, T, o = {}) {
  const W = '#ECEBE4', WS = '#C8C6BC', G = '#5A6270', GS = '#3E4450', K = '#22242C', sleep = !!o.sleep, br = sleep ? Math.sin(T * 1.5) * 4 : 0;
  let s = anSh(0, 2, 90) + ddBirdLegs([-14, 18], -70, -2, '#C8A23A');
  s += `<g transform="translate(0 ${R1(br)})">`;
  s += chT('M-96 -120 Q-100 -210 -10 -214 Q76 -214 92 -150 Q96 -96 30 -78 Q-40 -66 -80 -86 Q-98 -98 -96 -120Z', W, WS, { sx: 8, sy: 8, lw: 4.5 });
  s += chT('M-96 -130 Q-90 -206 -10 -212 Q50 -212 70 -176 Q20 -150 -40 -146 Q-80 -144 -96 -130Z', G, GS, { sx: 6, sy: 6, lw: 4 });   // lưng/cánh xám
  s += chT('M-96 -130 Q-140 -128 -150 -108 Q-118 -112 -92 -110Z', G, GS, { lw: 3.5 });
  const hx = 70, hy = -222;
  s += chT(`M${hx - 44} ${hy + 24} Q${hx - 50} ${hy - 40} ${hx + 6} ${hy - 44} Q${hx + 52} ${hy - 40} ${hx + 50} ${hy + 10} Q${hx + 40} ${hy + 40} ${hx} ${hy + 40} Q${hx - 36} ${hy + 40} ${hx - 44} ${hy + 24}Z`, W, WS, { sx: 5, sy: 5, lw: 4.5 });
  s += chT(`M${hx - 46} ${hy - 4} Q${hx - 44} ${hy - 46} ${hx + 6} ${hy - 46} Q${hx + 50} ${hy - 42} ${hx + 50} ${hy - 6} Q${hx} ${hy - 22} ${hx - 46} ${hy - 4}Z`, K, '#0E0F14', { lw: 4 });   // mũ đen
  s += chL(`M${hx - 30} ${hy - 30} Q${hx - 90} ${hy - 10} ${hx - 110} ${hy + 40}`, 4, '#F4F2EA');                                                                     // lông trắng dài sau gáy
  s += `<path d="M${hx + 44} ${hy + 2} L${hx + 116} ${hy + 10} L${hx + 44} ${hy + 20}Z" fill="${K}" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/>`;
  s += sleep ? chL(`M${hx + 8} ${hy + 4} Q${hx + 20} ${hy + 12} ${hx + 32} ${hy + 4}`, 4) : `<circle cx="${hx + 20}" cy="${hy + 2}" r="12" fill="#D8343A" stroke="${AN_I}" stroke-width="3"/><circle cx="${hx + 22}" cy="${hy + 2}" r="5" fill="${AN_I}"/>`;
  if (sleep) { const z = (T * 0.7) % 1; s += `<text x="${hx + 30 + z * 40}" y="${hy - 60 - z * 70}" font-size="${30 + z * 20}" font-weight="bold" fill="#3A3A50" opacity="${R1(1 - z)}">Z</text>`; }
  s += '</g>';
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- NÔNG (an_nong): bồ nông, thân trắng to, TÚI MỎ vàng cam lớn
function an_nong(x, y, k, T, o = {}) {
  const C = '#F6F4EE', CS = '#D2CEC4', P = '#F0A848', PS = '#C8802A', ex = o.ex || 'dot';
  let s = anSh(0, 2, 110) + ddBirdLegs([-16, 20], -80, -2, '#E89A3A');
  s += chT('M-110 -130 Q-116 -230 -10 -236 Q90 -236 104 -160 Q108 -100 30 -84 Q-60 -74 -96 -96 Q-112 -108 -110 -130Z', C, CS, { sx: 10, sy: 8, lw: 4.5 });
  s += chT('M-100 -150 Q-80 -214 -10 -214 Q50 -212 70 -176 Q10 -150 -60 -146Z', '#E2DED4', '#C2BEB2', { sx: 5, sy: 5, lw: 3.5 }) + chT('M-110 -140 Q-150 -150 -160 -126 Q-130 -124 -106 -118Z', '#3A3A40', '#22222A', { lw: 3 });
  const hx = 86, hy = -270, nk = Math.sin(T * 1.8) * 3;
  s += chL(`M70 -200 Q${96 + nk} -230 ${hx} ${hy}`, 34, AN_I) + chL(`M70 -200 Q${96 + nk} -230 ${hx} ${hy}`, 26, C);
  s += chT(`M${hx + 10} ${hy - 4} L${hx + 170} ${hy + 6} Q${hx + 120} ${hy + 90} ${hx + 30} ${hy + 60} Q${hx + 6} ${hy + 40} ${hx + 10} ${hy - 4}Z`, P, PS, { sx: 6, sy: 6, lw: 4.5 }) + chL(`M${hx + 14} ${hy + 6} L${hx + 168} ${hy + 8}`, 3, AN_I);
  s += `<circle cx="${hx}" cy="${hy}" r="30" fill="${C}" stroke="${AN_I}" stroke-width="4.5"/>` + anEye(hx + 6, hy - 6, 8, ex) + anBl(hx - 8, hy + 14, 7, 5);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- DIỆC (an_diec): xám xanh, cổ dài, MÀO ĐEN dài sau đầu · o.sit ngồi trong lúa (chỉ nửa trên) · o.chick diệc con
function an_diec(x, y, k, T, o = {}) {
  const C = '#8E9AA8', CS = '#6A7684', W = '#E8EAEC', K = '#22242C', ex = o.ex || 'dot', sit = !!o.sit;
  let s = sit ? '' : anSh(0, 2, 100) + ddBirdLegs([-10, 22], -130, -2, '#8A7A4A');
  s += chT('M-100 -170 Q-104 -236 -20 -240 Q56 -242 90 -206 Q104 -172 64 -140 Q6 -116 -60 -128 Q-100 -138 -100 -170Z', C, CS, { sx: 10, sy: 8, lw: 4.5 });
  s += chT('M-100 -176 Q-150 -170 -170 -146 Q-130 -150 -96 -146Z', CS, mixC(CS, '#000000', 0.2), { lw: 3.5 });
  const nk = Math.sin(T * 2 + 1) * 4, hx = 124 + nk, hy = -350;
  s += chL(`M70 -208 Q${124 + nk} -236 ${108 + nk} -290 Q${98 + nk} -324 ${hx - 4} ${hy + 10}`, 30, AN_I) + chL(`M70 -208 Q${124 + nk} -236 ${108 + nk} -290 Q${98 + nk} -324 ${hx - 4} ${hy + 10}`, 22, W);
  s += `<path d="M${hx + 10} ${hy - 6} L${hx + 106} ${hy + 8} L${hx + 10} ${hy + 18}Z" fill="#D8A83A" stroke="${AN_I}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<circle cx="${hx}" cy="${hy}" r="28" fill="${W}" stroke="${AN_I}" stroke-width="4.5"/>` + chT(`M${hx - 10} ${hy - 26} Q${hx - 60} ${hy - 40} ${hx - 96} ${hy - 20} Q${hx - 50} ${hy - 22} ${hx - 20} ${hy - 6}Z`, K, '#0E0F14', { lw: 3 }) + anEye(hx + 6, hy - 4, 8, ex);
  s += chT('M-80 -190 Q-66 -228 -6 -222 Q40 -218 58 -190 Q20 -168 -40 -168 Q-78 -170 -80 -190Z', C, CS, { sx: 6, sy: 6, lw: 4 });
  return anW(x, y, k * (o.chick ? 0.6 : 1), o, s);
}

// ---------------------------------------------------------------- LE LE (an_lele): vịt trời nhỏ nâu, cổ trắng, mỏ xám · o.drum ôm trống đánh · o.fly bay
function an_lele(x, y, k, T, o = {}) {
  const C = '#8A6A4A', CS = '#6A4E32', W = '#F2EADA', ex = o.ex || 'dot', fl = Math.sin(T * 7) * 26;
  let s = anSh(0, 2, 80);
  if (!o.fly) s += chL('M-10 -40 L-12 -4 M20 -40 L22 -4', 8, AN_I) + chL('M-10 -40 L-12 -4 M20 -40 L22 -4', 4, '#3A3A40') + chL('M-28 -2 h30 M6 -2 h30', 5, AN_I);
  s += chT('M-90 -70 Q-96 -140 -10 -144 Q70 -142 80 -96 Q84 -50 20 -42 Q-60 -36 -82 -50 Q-92 -58 -90 -70Z', C, CS, { sx: 8, sy: 6, lw: 4.5 });
  s += chT('M-90 -80 Q-120 -96 -126 -70 Q-104 -72 -88 -66Z', '#3A2A1E', '#22180E', { lw: 3 });
  const hx = 74, hy = -170, bob = Math.sin(T * 4) * 3;
  s += chT(`M40 -120 Q${hx - 10} ${hy + 30} ${hx - 30} ${hy + 10} L${hx + 24} ${hy + 18} Q60 -110 40 -120Z`, W, '#D2CABA', { lw: 4 });
  s += `<circle cx="${hx}" cy="${hy + bob}" r="34" fill="${C}" stroke="${AN_I}" stroke-width="4.5"/><ellipse cx="${hx + 2}" cy="${hy + 12 + bob}" rx="22" ry="14" fill="${W}"/>` + `<path d="M${hx + 26} ${hy - 4 + bob} Q${hx + 74} ${hy + bob} ${hx + 66} ${hy + 14 + bob} Q${hx + 46} ${hy + 18 + bob} ${hx + 28} ${hy + 10 + bob}Z" fill="#5A6070" stroke="${AN_I}" stroke-width="3.5"/>` + anEye(hx + 8, hy - 8 + bob, 8, ex);
  s += `<g transform="rotate(${R1(o.fly ? fl : 0)} -10 -110)">` + chT('M-60 -110 Q-30 -136 30 -126 Q50 -100 20 -86 Q-30 -82 -60 -110Z', CS, mixC(CS, '#000000', 0.2), { sx: 4, sy: 4, lw: 4 }) + '</g>';
  if (o.drum) { const hit = Math.max(0, Math.sin(T * 8)); s += chT('M90 -60 h90 v70 h-90Z', '#B8322A', '#8E2418', { sx: 4, sy: 0, lw: 4 }) + `<ellipse cx="135" cy="-60" rx="45" ry="14" fill="#F2DCA8" stroke="${AN_I}" stroke-width="4"/>` + chL(`M60 -110 L${R1(120 - hit * 8)} ${R1(-74 + hit * 12)}`, 6, '#7A5A2A'); }
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- BÌM BỊP (an_bimbip): thân đen, CÁNH NÂU ĐỎ, MẮT ĐỎ, đuôi dài · o.horn thổi kèn
function an_bimbip(x, y, k, T, o = {}) {
  const K = '#22202A', KS = '#100E14', R = '#A0482A', RS = '#7A3218', ex = o.ex;
  let s = anSh(0, 2, 90) + chL('M-6 -50 L-8 -4 M22 -50 L24 -4', 8, AN_I) + chL('M-26 -2 h30 M8 -2 h30', 5, AN_I);
  s += chT('M-60 -100 L-200 -60 L-190 -40 L-50 -78Z', K, KS, { lw: 4 }) + chL('M-80 -92 L-180 -62', 2.5, '#3A3846');     // đuôi dài
  s += chT('M-80 -90 Q-84 -170 -6 -176 Q66 -174 74 -124 Q78 -70 16 -58 Q-56 -52 -76 -66 Q-82 -74 -80 -90Z', K, KS, { sx: 8, sy: 6, lw: 4.5 });
  s += chT('M-70 -118 Q-50 -166 10 -160 Q50 -150 50 -116 Q0 -96 -50 -100Z', R, RS, { sx: 5, sy: 5, lw: 4 });       // cánh nâu đỏ
  const hx = 70, hy = -196;
  s += `<circle cx="${hx}" cy="${hy}" r="36" fill="${K}" stroke="${AN_I}" stroke-width="4.5"/>` + `<path d="M${hx + 28} ${hy - 6} Q${hx + 70} ${hy + 4} ${hx + 32} ${hy + 18}Z" fill="#14121A" stroke="${AN_I}" stroke-width="3.5"/>`;
  s += ex === 'closed' ? chL(`M${hx - 2} ${hy - 4} Q${hx + 10} ${hy + 6} ${hx + 22} ${hy - 4}`, 4, '#E8E0D0') : `<circle cx="${hx + 10}" cy="${hy - 6}" r="13" fill="#D8343A" stroke="#E8E0D0" stroke-width="2.5"/><circle cx="${hx + 12}" cy="${hy - 6}" r="5" fill="#0A0A0E"/><circle cx="${hx + 15}" cy="${hy - 10}" r="2.5" fill="#fff"/>`;
  if (o.horn) s += chT(`M${hx + 40} ${hy + 4} L${hx + 160} ${hy - 30} L${hx + 170} ${hy + 30} L${hx + 40} ${hy + 14}Z`, '#E2B84A', '#B88A2A', { sx: 4, sy: 0, lw: 4 }) + chL(`M${hx + 180} ${hy - 20} q20 -10 30 -30 M${hx + 184} ${hy} q24 0 36 -10`, 3, AN_I, 0.7 + 0.3 * Math.sin(T * 6));
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- TÒ VÒ (an_tovo): ong đen mảnh, EO THẮT như sợi chỉ, bụng dài, chân vàng, cánh khói · o.carry ôm nhện · o.baby tò vò non (ấu trùng trắng)
function an_tovo(x, y, k, T, o = {}) {
  if (o.baby) { let s = chT('M-60 -20 Q-70 -60 -20 -66 Q40 -70 60 -40 Q70 -10 30 -4 Q-40 4 -60 -20Z', '#F6F0DA', '#D8CEAE', { sx: 4, sy: 4, lw: 4 }) + chL('M-30 -62 Q-34 -40 -28 -10 M0 -66 Q-4 -40 2 -6 M30 -60 Q26 -36 30 -8', 2.5, '#C8BC98') + anEye(40, -42, 7, o.ex || 'dot'); return anW(x, y, k, o, s); }
  const K = '#26242C', KS = '#121116', Y = '#E8B83A', bob = Math.sin(T * 3) * 6, fl = Math.sin(T * 44) * 22, ex = o.ex || 'dot';
  let s = anSh(0, 2, 60, 0.12) + `<g transform="translate(0 ${R1(-110 + bob)})">`;
  const wing = (a, dx) => `<g transform="translate(${dx} -30) rotate(${R1(a)})"><ellipse cx="-10" cy="-40" rx="18" ry="52" fill="#B8C8D8" stroke="${AN_I}" stroke-width="3.4" opacity="0.75"/></g>`;
  s += wing(-30 + fl, 10) + wing(8 - fl * 0.8, 26);
  s += chT('M-112 -8 Q-118 -30 -84 -32 Q-50 -30 -46 -12 Q-50 8 -84 10 Q-112 8 -112 -8Z', K, KS, { sx: 5, sy: 3, lw: 4.5 }) + chL('M-96 -30 Q-100 -6 -94 8', 2.5, '#4A4852') + chL('M-74 -31 Q-78 -6 -72 9', 2.5, '#E8B83A', 0.8);   // bụng
  s += chL('M-48 -10 L14 -14', 5, AN_I);                                                                                                             // eo thắt
  s += chT('M10 -24 Q16 -48 46 -46 Q70 -40 66 -14 Q62 8 36 6 Q10 4 10 -24Z', K, KS, { sx: 4, sy: 3, lw: 4 });                                            // ngực
  for (const [a, b] of [[20, 70], [36, 80], [52, 74]]) s += chL(`M${a} 2 L${a - 10} 40 L${a - 4} ${b}`, 5, AN_I) + chL(`M${a} 2 L${a - 10} 40 L${a - 4} ${b}`, 2.5, Y);
  s += `<circle cx="86" cy="-26" r="24" fill="${K}" stroke="${AN_I}" stroke-width="4"/>` + chL('M96 -46 Q110 -80 130 -86 M88 -48 Q96 -84 112 -96', 3, AN_I) + anEye(94, -28, 8, ex, '#E8B83A');
  if (o.carry) s += an_nhen(60, 76, 0.42, T, { stiff: 1 });
  s += '</g>';
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- NHỆN (an_nhen): nhện nhảy xanh, bụng tròn, 8 chân · o.stiff tê liệt (chân co cứng, mắt xoáy) · o.ghost vỏ nhện mờ
function an_nhen(x, y, k, T, o = {}) {
  const G = o.ghost ? '#C8C4B8' : '#6A9A5A', GS = o.ghost ? '#A8A498' : '#4A7A3E', stiff = !!o.stiff, op = o.ghost ? 0.55 : 1;
  let s = `<g opacity="${op}">`;
  for (let i = 0; i < 4; i++) for (const sg of [-1, 1]) { const a = -60 + i * 22, wig = stiff ? 0 : Math.sin(T * 8 + i) * 6, L = stiff ? 34 : 56;
    const x1 = sg * (30 + i * 4), y1 = -40 + i * 8, x2 = x1 + sg * L * 0.9, y2 = y1 - 30 + (stiff ? 26 : 0) + wig, x3 = x2 + sg * 18, y3 = stiff ? y2 + 10 : -4;
    s += chL(`M${x1} ${y1} L${R1(x2)} ${R1(y2)} L${R1(x3)} ${R1(y3)}`, 7, AN_I) + chL(`M${x1} ${y1} L${R1(x2)} ${R1(y2)} L${R1(x3)} ${R1(y3)}`, 3.5, GS); }
  s += chT('M-46 -50 Q-50 -100 0 -102 Q50 -100 46 -50 Q40 -14 0 -12 Q-40 -14 -46 -50Z', G, GS, { sx: 6, sy: 5, lw: 4.5 }) + chL('M-20 -90 Q0 -70 20 -90', 3, mixC(GS, '#000000', 0.2));
  s += `<circle cx="0" cy="-12" r="26" fill="${G}" stroke="${AN_I}" stroke-width="4"/>` + (stiff ? anEye(-10, -14, 7, 'swirl') + anEye(12, -14, 7, 'swirl') : anEye(-10, -14, 8, o.ex || 'dot') + anEye(12, -14, 8, o.ex || 'dot'));
  return anW(x, y, k, o, s + '</g>');
}

// ---------------------------------------------------------------- MÈO MƯỚP (an_meo): ngồi, cam sọc · o.climb ôm thân cây (dọc) · o.bow cúi đầu lễ phép · o.ex
function an_meo(x, y, k, T, o = {}) {
  const C = '#E8A050', CS = '#BE7A30', W = '#FBF2E2', ex = o.ex || 'dot', tw = Math.sin(T * 2.4) * 16, bow = o.bow ? 14 : 0;
  let s = anSh(0, 2, 90);
  s += chL(`M-60 -20 Q-130 -10 ${R1(-140 + tw)} -90 Q${R1(-146 + tw)} -130 ${R1(-118 + tw)} -140`, 22, AN_I) + chL(`M-60 -20 Q-130 -10 ${R1(-140 + tw)} -90 Q${R1(-146 + tw)} -130 ${R1(-118 + tw)} -140`, 14, C);
  s += chT('M-70 -10 Q-86 -120 -10 -150 Q60 -150 70 -80 Q76 -10 30 0 Q-40 6 -70 -10Z', C, CS, { sx: 8, sy: 6, lw: 4.5 }) + chT('M-20 -110 Q10 -124 40 -110 Q46 -50 10 -30 Q-24 -50 -20 -110Z', W, '#DCD0BC', { lw: 3.5 });
  s += chL('M-60 -100 l20 6 M-66 -70 l22 4 M-64 -40 l22 2', 5, CS);
  s += `<ellipse cx="-30" cy="-6" rx="22" ry="12" fill="${W}" stroke="${AN_I}" stroke-width="4"/><ellipse cx="30" cy="-6" rx="22" ry="12" fill="${W}" stroke="${AN_I}" stroke-width="4"/>`;
  const hx = 14, hy = -196 + bow;
  s += `<g transform="rotate(${bow} ${hx} ${hy + 50})">`;
  s += chT(`M${hx - 70} ${hy - 30} L${hx - 64} ${hy - 96} L${hx - 20} ${hy - 56}Z`, C, CS, { lw: 4.5 }) + chT(`M${hx + 70} ${hy - 30} L${hx + 64} ${hy - 96} L${hx + 20} ${hy - 56}Z`, C, CS, { lw: 4.5 }) + `<path d="M${hx - 58} ${hy - 44} L${hx - 56} ${hy - 80} L${hx - 32} ${hy - 56}Z M${hx + 58} ${hy - 44} L${hx + 56} ${hy - 80} L${hx + 32} ${hy - 56}Z" fill="#F2B0A8"/>`;
  s += chT(`M${hx - 76} ${hy + 6} Q${hx - 80} ${hy - 64} ${hx} ${hy - 66} Q${hx + 80} ${hy - 64} ${hx + 76} ${hy + 6} Q${hx + 66} ${hy + 56} ${hx} ${hy + 58} Q${hx - 66} ${hy + 56} ${hx - 76} ${hy + 6}Z`, C, CS, { sx: 7, sy: 6, lw: 4.8 });
  s += chL(`M${hx - 16} ${hy - 62} l6 22 M${hx} ${hy - 66} v24 M${hx + 16} ${hy - 62} l-6 22`, 5, CS);
  s += `<ellipse cx="${hx}" cy="${hy + 30}" rx="34" ry="22" fill="${W}"/><path d="M${hx - 8} ${hy + 16} L${hx + 8} ${hy + 16} L${hx} ${hy + 26}Z" fill="#E8828A" stroke="${AN_I}" stroke-width="2.5"/>` + chL(`M${hx} ${hy + 26} Q${hx - 10} ${hy + 40} ${hx - 22} ${hy + 34} M${hx} ${hy + 26} Q${hx + 10} ${hy + 40} ${hx + 22} ${hy + 34}`, 3);
  s += chL(`M${hx - 30} ${hy + 24} l-60 -8 M${hx - 30} ${hy + 32} l-60 6 M${hx + 30} ${hy + 24} l60 -8 M${hx + 30} ${hy + 32} l60 6`, 2.2, AN_I, 0.6);
  s += ex === 'sly' ? chL(`M${hx - 44} ${hy - 6} Q${hx - 28} ${hy - 16} ${hx - 12} ${hy - 6} M${hx + 12} ${hy - 6} Q${hx + 28} ${hy - 16} ${hx + 44} ${hy - 6}`, 4.5) : anEye(hx - 28, hy - 4, 12, ex, '#9AC85A') + anEye(hx + 28, hy - 4, 12, ex, '#9AC85A');
  s += anBl(hx - 46, hy + 20, 10, 6) + anBl(hx + 46, hy + 20, 10, 6) + '</g>';
  if (o.climb) return anW(x, y, k, Object.assign({}, o, { rot: -90 }), s);
  return anW(x, y, k, o, s);
}

// ---------------------------------------------------------------- ẾCH (an_ech): xanh lá, mắt lồi, ngồi xổm · o.jump nhảy (chân duỗi)
function an_ech(x, y, k, T, o = {}) {
  const C = '#7AAA4A', CS = '#5A8A32', B = '#E8E2B0', ex = o.ex || 'dot', j = o.jump ? 1 : 0;
  let s = anSh(0, 2, 70);
  s += j ? chL('M-40 -30 L-110 -10 L-150 10 M-30 -24 L-90 6', 12, AN_I) + chL('M-40 -30 L-110 -10 L-150 10 M-30 -24 L-90 6', 7, C) : chT('M-70 -10 Q-80 -50 -40 -56 Q-20 -40 -30 -6Z M70 -10 Q80 -50 40 -56 Q20 -40 30 -6Z', C, CS, { lw: 4 });
  s += chT('M-60 -40 Q-66 -110 0 -112 Q66 -110 60 -40 Q50 -6 0 -4 Q-50 -6 -60 -40Z', C, CS, { sx: 7, sy: 6, lw: 4.5 }) + chT('M-34 -60 Q0 -76 34 -60 Q36 -20 0 -14 Q-36 -20 -34 -60Z', B, '#CCC69A', { lw: 3 });
  for (const sx of [-30, 30]) s += `<circle cx="${sx}" cy="-112" r="22" fill="${C}" stroke="${AN_I}" stroke-width="4.5"/>` + anEye(sx, -114, 12, ex, '#E8D84A');
  s += chL('M-30 -78 Q0 -60 30 -78', 4) + anBl(-44, -70, 9, 5) + anBl(44, -70, 9, 5);
  return anW(x, y, k, o, s);
}

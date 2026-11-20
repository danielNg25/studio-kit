// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT CỔ TÍCH VIỆT NAM — tập co-tich-ban-goc (kênh kênh mẫu, 2026-11-08). Nạp SAU chars.js (+ các pack khác nếu cần).
// Cùng kiểu webtoon-code-v1 (tô phẳng 2 tông + viền mực). Tiền tố ct_.
// Trang phục Việt thêm bằng cờ trên CHAR (vẽ đè lên đầu / thân gốc, không sửa chars.js):
//   khan: 'moquat' (khăn mỏ quạ, nữ đứng tuổi) · 'vanNu' (khăn vấn tròn quanh đầu, nữ trẻ) · 'xep' (khăn xếp, nam) · 'nonla' (nón lá)
//         · 'phuong' (mũ phượng vàng, hoàng hậu) · 'canhchuon' (mũ cánh chuồn, quan/trạng nguyên) · 'mien' (vương miện vua Hùng, lông chim)
//   khanC: màu khăn (mặc định đen nhung) · tuThan: 1 → áo tứ thân mở ngực thấy yếm (màu yem) · yem: màu yếm

// biểu cảm thêm (dùng trong tập cổ tích; trước đây 'angry'/'gape'/'happy'/'closed' rơi về neutral)
Object.assign(CH_EXPR, {
  angry: ['angry', 18, 'frown', 'vein'], gape: ['shock', -14, 'gape', '', { bY: -12 }], happy: ['happy', -6, 'smile'], closed: ['closed', -4, 'n'],
  sleep: ['closed', -6, 'n'], scared: ['shock', -20, 'wavy', 'sweat', { bY: -10 }], cruel: ['half', 10, 'smug', '', { bNear: -4, bFar: 14 }],
  greedy: ['happy', 4, 'smile'], o: ['open', -8, 'o'], cold: ['half', 6, 'flat'], weep: ['closed', -22, 'cry', 'tear'], horror: ['shock', -24, 'yell', 'gloom', { bY: -14 }],
});
const _ctHead0 = chHead;
chHead = function (c, ex, T, o = {}) {
  const r = _ctHead0(c, ex, T, o);
  if (c.mole) r[1] += `<circle cx="96" cy="72" r="6" fill="#3A2418"/>` + chL('M-70 70 q10 8 22 6 M84 30 q8 6 18 4', 2.2, '#B98468', 0.8);
  if (c.blindfold) r[1] += chT('M-118 -20 Q12 -40 146 -20 L146 34 Q12 18 -118 38Z', c.blindfold, mixC(c.blindfold, '#000000', 0.2), { sx: 0, sy: 4, lw: 4 }) + chL('M-110 10 Q12 -6 140 8', 2.5, mixC(c.blindfold, '#000000', 0.3), 0.8) + chT('M-118 0 l-40 -20 l-10 30Z M-118 14 l-30 40 l-20 -10Z', c.blindfold, mixC(c.blindfold, '#000000', 0.2), { lw: 3 });
  if (!c.khan) return r;
  const K = c.khanC || '#24202A', KS = mixC(K, '#000000', 0.35), KH = mixC(K, '#ffffff', 0.18);
  let back = '', front = '';
  if (c.khan === 'moquat') {
    // khăn trùm kín tóc, mép trước nhọn xuống giữa trán (mỏ quạ), hai vạt ôm má
    front += chT('M-150 -30 Q-172 -210 12 -272 Q196 -214 172 -30 L150 -18 Q148 -112 112 -150 Q66 -140 12 -100 Q-44 -140 -96 -150 Q-132 -112 -132 -20Z', K, KS, { sx: 12, sy: 8, lw: 4.5 });
    front += chL('M-96 -150 Q-44 -140 12 -100 Q66 -140 112 -150', 3, KH, 0.8) + chL('M-120 -200 Q12 -250 150 -200 M-136 -120 Q-150 -170 -110 -210', 2.6, KS, 0.9);
  } else if (c.khan === 'vanNu') {
    // khăn nhung vấn tròn quanh đầu như vành, đỉnh đầu lộ tóc
    front += chT('M-150 -96 Q-170 -236 12 -262 Q194 -236 172 -96 L150 -104 Q150 -206 12 -222 Q-128 -206 -128 -104Z', K, KS, { sx: 8, sy: 6, lw: 4.5 });
    for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + i * 0.13), x0 = 12 + Math.cos(a) * 150, y0 = -110 + Math.sin(a) * 130; front += chL(`M${f1(x0)} ${f1(y0)} l${f1(Math.cos(a) * 18 + 10)} ${f1(Math.sin(a) * 18 + 14)}`, 3, KH, 0.75); }
  } else if (c.khan === 'xep') {
    front += chT('M-138 -92 Q-154 -234 12 -254 Q176 -236 164 -92 Q12 -128 -138 -92Z', K, KS, { sx: 10, sy: 6, lw: 4.5 });
    front += chL('M-136 -120 Q12 -156 162 -120 M-138 -150 Q12 -186 160 -150 M-130 -180 Q12 -214 152 -180 M-110 -208 Q12 -236 132 -208', 3, KH, 0.75);
  } else if (c.khan === 'nonla') {
    const sw = Math.sin(T * 1.6 + (o.seed || 0)) * 1.5;
    front += `<g transform="rotate(${f1(sw)} 12 -170)">` + chT('M-280 -128 Q12 -100 304 -128 L12 -352Z', '#E8D29A', '#C8AE6E', { sx: 18, sy: 0, lw: 5 })
      + chL('M-200 -150 Q12 -128 224 -150 M-130 -190 Q12 -172 154 -190 M-66 -240 Q12 -226 90 -240', 2.6, '#B49656', 0.9) + '</g>'
      + chL('M-104 -40 Q12 160 134 -40', 2.4, '#8A6A3A', 0.85);
  } else if (c.khan === 'phuong') {
    const g = '#F2C94A', gs = '#B8902A', s2 = Math.sin(T * 2.4) * 4;
    front += chT('M-130 -140 Q-136 -236 12 -250 Q160 -236 156 -140 Q12 -170 -130 -140Z', g, gs, { sx: 8, sy: 6, lw: 4.5 }) + chL('M-124 -160 Q12 -190 150 -160', 4, '#B8322A');
    // chim phượng giữa mấn: thân + hai cánh xoè + đuôi cong
    front += `<g transform="translate(12 -236)">` + chT('M0 -10 Q-16 -40 -64 -58 Q-40 -30 -30 -8 Q-56 -20 -84 -16 Q-50 4 -8 8Z', g, gs, { sx: 4, sy: 2, lw: 3.5 }) + chT('M0 -10 Q16 -40 64 -58 Q40 -30 30 -8 Q56 -20 84 -16 Q50 4 8 8Z', g, gs, { sx: 4, sy: 2, lw: 3.5 })
      + chT('M-8 8 Q0 -40 10 -56 Q22 -40 10 8Z', '#E8B83A', gs, { lw: 3 }) + `<circle cx="10" cy="-58" r="7" fill="${g}" stroke="${CH_INK}" stroke-width="2.5"/><circle cx="12" cy="-60" r="2" fill="${CH_INK}"/>` + '</g>';
    front += `<circle cx="12" cy="-196" r="11" fill="#3AA06A" stroke="${CH_INK}" stroke-width="3"/>` + [-90, -50, 74, 114].map(x => `<circle cx="${x}" cy="-176" r="6" fill="#E8EEF2" stroke="${CH_INK}" stroke-width="2"/>`).join('');
    back += chL(`M-126 -150 q-14 ${f1(60 + s2)} -10 ${f1(150 + s2)} M152 -150 q14 ${f1(60 - s2)} 10 ${f1(150 - s2)}`, 3, g) + [0, 1, 2].map(i => `<circle cx="${-134 + i * 1}" cy="${f1(-110 + i * 40 + s2 * (i + 1) / 3)}" r="6" fill="#E8EEF2" stroke="${CH_INK}" stroke-width="2"/><circle cx="${160 - i}" cy="${f1(-110 + i * 40 - s2 * (i + 1) / 3)}" r="6" fill="#E8EEF2" stroke="${CH_INK}" stroke-width="2"/>`).join('');
  } else if (c.khan === 'canhchuon') {
    back += `<g transform="rotate(-22 -150 -196)">` + chT('M-150 -196 a70 30 0 1 1 -140 0 a70 30 0 1 1 140 0Z', K, KS, { sx: 0, sy: 4, lw: 4 }) + '</g>'
      + `<g transform="rotate(22 176 -196)">` + chT('M176 -196 a70 30 0 1 0 140 0 a70 30 0 1 0 -140 0Z', K, KS, { sx: 0, sy: 4, lw: 4 }) + '</g>';
    front += chT('M-122 -146 Q-118 -262 12 -272 Q144 -262 150 -146 Q12 -172 -122 -146Z', K, KS, { sx: 8, sy: 6, lw: 4.5 }) + chL('M-110 -168 Q12 -194 140 -168', 4, '#C9A24A', 0.9);
  } else if (c.khan === 'binhthien') {   // mũ bình thiên (Ngọc Hoàng): tấm ván phẳng trên đỉnh, chuỗi ngọc rủ trước sau
    front += chT('M-110 -150 Q-104 -236 12 -244 Q130 -236 140 -150 Q12 -172 -110 -150Z', '#E0B048', '#B08428', { sx: 6, sy: 4, lw: 4 }) + chT('M-150 -262 L176 -262 L166 -238 L-140 -238Z', '#2A2A34', '#16161E', { lw: 4 }) + chL('M-130 -250 H160', 3, '#E0B048');
    const s2 = Math.sin(T * 2.2) * 2; for (let i = 0; i < 9; i++) { const x = -130 + i * 36; front += chL(`M${x} -238 L${f1(x + s2)} -160`, 2, '#E8E2D2') + `<circle cx="${f1(x + s2)}" cy="-196" r="5" fill="#E8EEF2" stroke="${CH_INK}" stroke-width="1.6"/><circle cx="${f1(x + s2)}" cy="-160" r="5" fill="#C0392B" stroke="${CH_INK}" stroke-width="1.6"/>`; }
  } else if (c.khan === 'mien') {
    front += chT('M-120 -150 Q-110 -220 12 -228 Q138 -220 148 -150 Q12 -172 -120 -150Z', '#C9A24A', '#94741E', { sx: 6, sy: 4, lw: 4 });
    for (let i = 0; i < 7; i++) { const x = -96 + i * 36, h = 90 + 40 * Math.sin(i / 6 * Math.PI); front += chT(`M${x - 12} -196 Q${x - 18} ${-196 - h * 0.6} ${x} ${-196 - h} Q${x + 18} ${-196 - h * 0.6} ${x + 12} -196Z`, i % 2 ? '#E8DCC0' : '#3A6A8A', i % 2 ? '#C8B890' : '#24485E', { sx: 3, sy: 0, lw: 3 }); }
  }
  return [back + r[0], r[1] + front];
};
const _ctBody0 = chBody;
chBody = function (c, T, o = {}) {
  let s = _ctBody0(c, T, o);
  if (c.tuThan) {
    const Y = c.yem || '#C0392B', YS = mixC(Y, '#000000', 0.25);
    // yếm: mảnh vải vuông che ngực, dây buộc cổ; hai vạt áo ngoài mở hai bên (viền màu trim)
    s += chT('M-60 -232 Q0 -226 60 -232 L72 -92 Q0 -80 -72 -92Z', Y, YS, { sx: 12, sy: 0, lw: 4 }) + chL('M-48 -232 Q0 -262 48 -232', 3.5, YS);
    s += [[-30, -150], [26, -132]].map(([x, y]) => [0, 72, 144, 216, 288].map(a => `<circle cx="${f1(x + Math.cos(a * 0.0175) * 9)}" cy="${f1(y + Math.sin(a * 0.0175) * 9)}" r="5.5" fill="${mixC(Y, '#ffffff', 0.45)}" opacity="0.8"/>`).join('') + `<circle cx="${x}" cy="${y}" r="4" fill="${mixC(Y, '#F2C94A', 0.6)}"/>`).join('') + chL('M-62 -200 Q0 -194 62 -200', 2, YS, 0.6);
    s += chL('M-62 -234 L-74 -90', 12, c.trim) + chL('M62 -234 L74 -90', 12, c.trim) + chL('M-62 -234 L-74 -90 M62 -234 L74 -90', 2, mixC(c.trim, '#ffffff', 0.4), 0.8);
  }
  return s;
};


// ---- đồ cầm tay cổ tích: 'riu' (rìu tiều phu) · 'torch' (đuốc) · 'knife' (dao) · 'leaf' (lá đa phát sáng) · 'gourd' (bầu nước) · 'clay' (nắm đất sét)
const _ctHand0 = chHand;
chHand = function (kind, c) {
  const R = (typeof TDK_ROT === 'number' ? TDK_ROT : 0), fist = () => _ctHand0('fist', c);
  if (kind === 'riu') return `<g transform="rotate(${R}) rotate(90)">` + chT('M-40 -8 L236 -8 L236 8 L-40 8Z', '#9A7A4A', '#6A5030', { sx: 0, sy: 4, lw: 4 }) + chT('M192 -20 L238 -20 L238 18 L192 18Z', '#6A6E76', '#4A4E56', { lw: 4 }) + chT('M196 16 L234 16 Q252 64 272 104 Q222 116 168 102 Q190 64 196 16Z', '#9AA0A8', '#6A7078', { sx: 6, sy: 0, lw: 4.5 }) + chL('M170 100 Q222 112 270 102', 4, '#EEF2F6') + `</g>` + fist();
  if (kind === 'torch') { const fl = Math.sin((typeof ANIM_T === 'number' ? ANIM_T : 0) * 15) * 6; return `<g transform="rotate(${R}) rotate(90)">` + chT('M-30 -9 L200 -9 L200 9 L-30 9Z', '#7A5A3A', '#5A4028', { sx: 0, sy: 4, lw: 4 }) + chT('M190 -16 h30 v32 h-30Z', '#5A4A3A', null, { lw: 3.5 }) + `<path d="M220 -22 Q${f1(280 + fl)} -30 ${f1(300 + fl * 2)} 0 Q${f1(280 - fl)} 30 220 22Z" fill="#F28A2A" stroke="${CH_INK}" stroke-width="3"/><path d="M222 -10 Q${f1(262 + fl)} -10 ${f1(272 + fl)} 0 Q${f1(262 - fl)} 10 222 10Z" fill="#FFE07A"/></g>` + fist(); }
  if (kind === 'knife') return `<g transform="rotate(${R}) rotate(90)">` + chT('M-36 -9 h60 v18 h-60Z', '#5A3A22', null, { lw: 3.5 }) + chT('M24 -12 L150 -8 Q178 0 150 10 L24 12Z', '#D8DEE6', '#A8B0BC', { sx: 0, sy: 4, lw: 4 }) + `</g>` + fist();
  if (kind === 'leaf') return `<g transform="translate(0 90)"><ellipse rx="70" ry="50" fill="#B8F07A" opacity="0.35"/><path d="M-48 0 Q0 -42 48 0 Q0 42 -48 0Z" fill="#6AB04A" stroke="${CH_INK}" stroke-width="4"/><path d="M-48 0 H48" stroke="#3A7A2A" stroke-width="3"/></g>` + _ctHand0('open', c);
  if (kind === 'gourd') return `<g transform="translate(0 110)"><circle cx="0" cy="-30" r="22" fill="#D9A44A" stroke="${CH_INK}" stroke-width="4"/><circle cx="0" cy="18" r="34" fill="#D9A44A" stroke="${CH_INK}" stroke-width="4"/></g>` + fist();
  if (kind === 'clay') return `<g transform="translate(0 86)"><path d="M-40 0 q10 -20 30 -6 q20 -20 36 0 q16 18 -6 26 q-20 14 -36 0 q-30 8 -24 -20Z" fill="#9A6A44" stroke="${CH_INK}" stroke-width="4"/><path d="M-26 0 q14 -10 26 0 q12 10 22 0" stroke="#6A4428" stroke-width="3" fill="none"/></g>` + _ctHand0('open', c);
  return _ctHand0(kind, c);
};

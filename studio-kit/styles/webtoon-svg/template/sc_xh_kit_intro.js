// ===== THẺ GIỚI THIỆU NHÂN VẬT (làm lại 10/11). người dùng: "cần hoành tráng hơn" → rồi "sao ai cũng giống ai" (thẻ giống nhau).
// Mỗi người MỘT thẻ riêng theo biệt hiệu/chuyện của họ: màu nền, hoạ tiết nền, hạt bay, kiểu xuất hiện, tư thế, bên đứng (trái/phải), màu băng tên.
// Khung chung: tên to trên vệt màu + ánh lướt, biệt hiệu trên dải lụa, dấu "HẠNG ?" viền vàng. Không chớp trắng.
const XH_IT = {
  qv:  { bg: '#0E4A2A', ac: '#7AE08A', ban: '#14603A', fx: 'dragon', pt: 'gold', en: 'drop', side: 'L', st: { arm: -150 } },
  hh:  { bg: '#2A2430', ac: '#E0D0FF', ban: '#3A2E4A', fx: 'blades', pt: 'spark', en: 'dash', side: 'R', st: { arm: -140 } },
  nl:  { bg: '#6A3A12', ac: '#FFC27A', ban: '#8A4A1A', fx: 'tiger', pt: 'ember', en: 'drop', side: 'L', st: { arm: -150 } },
  vs:  { bg: '#122244', ac: '#BFD6FF', ban: '#1E3A6A', fx: 'moon', pt: 'star', en: 'dash', side: 'R', st: { arm: -90 } },
  tv:  { bg: '#1E3A5A', ac: '#E0ECFF', ban: '#24486E', fx: 'jade', pt: 'snow', en: 'dash', side: 'L', st: { arm: -140 } },
  hc:  { bg: '#7A3A12', ac: '#E8902A', ban: '#8E2A1A', fx: 'tiger', pt: 'ember', en: 'drop', side: 'R', st: { arm: -150 } },
  dv:  { bg: '#2E2A3E', ac: '#C8B8FF', ban: '#3E3456', fx: 'chains', pt: 'spark', en: 'drop', side: 'L', st: { arm: -160 } },
  ms:  { bg: '#1E4A5A', ac: '#9AE6FF', ban: '#1E5A70', fx: 'blades', pt: 'snow', en: 'zoom', side: 'R', st: { arm: -120 } },
  hhd: { bg: '#1A1A1E', ac: '#D0402A', ban: '#24242A', fx: 'whirl', pt: 'leaf', en: 'dash', side: 'L', st: { arm: -160 } },
  ht:  { bg: '#5A4A12', ac: '#FFE7A0', ban: '#7A6A2A', fx: 'moon', pt: 'gold', en: 'rise', side: 'R', st: { arm: -130 } },
  ts:  { bg: '#7A1E0A', ac: '#FFC24A', ban: '#A8301A', fx: 'bolts', pt: 'ember', en: 'drop', side: 'L', st: { arm: -170 } },
  tst: { bg: '#2A4460', ac: '#9FC2E0', ban: '#24405E', fx: 'blades', pt: 'dust', en: 'dash', side: 'R', st: { arm: -150 } },
  tl:  { bg: '#1A2638', ac: '#E0E8F4', ban: '#2A3A5A', fx: 'leopard', pt: 'snow', en: 'dash', side: 'L', st: { arm: -140 } },
  bd:  { bg: '#3A3A44', ac: '#E8E4D8', ban: '#4A4650', fx: 'stones', pt: 'dust', en: 'rise', side: 'R', st: { arm: -150 } },
  pp:  { bg: '#8A5A12', ac: '#FFD27A', ban: '#9A4A12', fx: 'bolts', pt: 'gold', en: 'zoom', side: 'L', st: { arm: -170 } },
  hhk: { bg: '#4A5A4A', ac: '#D8E8C8', ban: '#5A6A4A', fx: 'whirl', pt: 'leaf', en: 'pop', side: 'R', st: {} },
  tp:  { bg: '#3A1418', ac: '#FF8A5A', ban: '#5A1A1E', fx: 'bolts', pt: 'ember', en: 'drop', side: 'R', st: { arm: -165 } },
  lb:  { bg: '#6A0E14', ac: '#FFD25A', ban: '#8E1A1E', fx: 'jade', pt: 'gold', en: 'zoom', side: 'L', st: { arm: -160 } },
};
const xhHeart = (x, y, r, c, op) => `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f1(r / 20)})" d="M0 18 C-26 0 -18 -20 0 -8 C18 -20 26 0 0 18Z" fill="${c}" opacity="${f1(op)}"/>`;
// hoạ tiết nền theo người (vẽ sau lưng nhân vật, quanh tâm cx, 560)
function xhIntroFx(t, fx, cx, ac) {
  let s = ''; const cy = 560, k = clamp((t - 0.2) / 0.5);
  if (fx === 'tiger') {   // ba vết vuốt hổ cào chéo + vằn hổ hai bên
    for (let i = 0; i < 3; i++) { const u = EZ.expoOut(clamp((t - 0.3 - i * 0.07) / 0.25)), x0 = cx - 420 + i * 150, y0 = 180;
      s += `<path d="M${x0} ${y0} Q${x0 + 300} ${y0 + 300} ${f1(x0 + 640 * u)} ${f1(y0 + 700 * u)}" stroke="${ac}" stroke-width="${46 - i * 6}" stroke-linecap="round" fill="none" opacity="0.5"/>`; }
    for (let i = 0; i < 6; i++) { const x = i < 3 ? 80 + i * 70 : 1640 + (i - 3) * 70; s += `<path d="M${x} 120 q40 160 -10 320 q-40 160 20 330" stroke="#1A0A04" stroke-width="34" fill="none" opacity="${f1(0.45 * k)}" stroke-linecap="round"/>`; }
  } else if (fx === 'stones') {   // đá cuội bay vòng quanh như vệ tinh
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + t * 1.6, x = cx + Math.cos(a) * 470, y = cy + Math.sin(a) * 170, r = 22 + (i % 3) * 8, front = Math.sin(a) > 0;
      s += `<path d="M${f1(x - Math.cos(a + 0.4) * 90)} ${f1(y - Math.sin(a + 0.4) * 30)} L${f1(x)} ${f1(y)}" stroke="${ac}" stroke-width="${r * 0.7}" stroke-linecap="round" opacity="${f1(0.35 * k)}"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${r}" ry="${f1(r * 0.8)}" fill="#D8D4CC" stroke="${INK2}" stroke-width="4" opacity="${f1(k * (front ? 1 : 0.6))}"/>`; }
  } else if (fx === 'hearts') {   // tim to nhịp đập sau lưng (mê gái)
    const b = 1 + 0.08 * Math.abs(Math.sin(t * 6)); s += xhHeart(cx, cy - 40, 300 * b * k, ac, 0.28) + xhHeart(cx - 380, 300, 70 * k, ac, 0.35) + xhHeart(cx + 400, 360, 90 * k, ac, 0.3);
  } else if (fx === 'lasso') {   // vòng dây thòng lọng xoay + song đao bắt chéo
    s += `<g transform="rotate(${f1(t * 40)} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${f1(400 * k)}" ry="${f1(400 * k)}" fill="none" stroke="#C8783A" stroke-width="18" stroke-dasharray="40 14" opacity="0.7"/></g>`;
    [-1, 1].forEach(d => { s += `<g transform="translate(${cx} ${cy}) rotate(${f1(d * 38 * k)})" opacity="${f1(0.45 * k)}"><path d="M-14 -420 L14 -420 L22 160 L-22 160Z" fill="#E8ECF0"/><rect x="-46" y="160" width="92" height="20" fill="${ac}"/><rect x="-12" y="180" width="24" height="120" fill="#5A2A1A"/></g>`; });
  } else if (fx === 'whirl') {   // lốc xoáy đen (Hắc Toàn Phong)
    for (let i = 0; i < 6; i++) { const a = t * 260 + i * 60; s += `<g transform="rotate(${f1(a)} ${cx} ${cy})"><path d="M${cx} ${cy} q260 -40 420 -260 q60 -100 30 -220" stroke="#5A5A64" stroke-width="${f1(40 - i * 4)}" fill="none" stroke-linecap="round" opacity="${f1(0.4 * k)}"/></g>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="${f1(180 * k)}" fill="#000" opacity="0.35"/>`;
  } else if (fx === 'bolts') {   // sấm sét lửa (Tích Lịch Hỏa)
    for (let i = 0; i < 3; i++) { const on = (Math.floor(t * 6 + i * 1.7) % 3) === 0 && t > 0.3; if (!on) continue; const x0 = cx - 360 + i * 360;
      s += `<path d="M${x0} 0 L${x0 + 60} 220 L${x0 - 20} 240 L${x0 + 70} 480 L${x0 - 10} 500 L${x0 + 90} 760" stroke="${ac}" stroke-width="16" fill="none" stroke-linejoin="round" opacity="0.8"/><path d="M${x0} 0 L${x0 + 60} 220 L${x0 - 20} 240 L${x0 + 70} 480 L${x0 - 10} 500 L${x0 + 90} 760" stroke="#FFF6DA" stroke-width="5" fill="none"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="360" fill="${ac}" opacity="${f1(0.12 * k)}"/>`;
  } else if (fx === 'tattoo') {   // hoa văn xăm (Yến Thanh xăm hoa khắp người)
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * 0.3, x = cx + Math.cos(a) * 380, y = cy + Math.sin(a) * 300, rr = 70 * k;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a * 57)})" opacity="0.4">` + [0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="${f1(-rr * 0.6)}" rx="${f1(rr * 0.32)}" ry="${f1(rr * 0.6)}" transform="rotate(${r})" fill="none" stroke="${ac}" stroke-width="6"/>`).join('') + `</g>`; }
    s += `<path d="M${cx - 500} ${cy + 200} C${cx - 300} ${cy - 300} ${cx + 300} ${cy + 300} ${cx + 500} ${cy - 200}" stroke="${ac}" stroke-width="10" fill="none" opacity="${f1(0.35 * k)}"/>`;
  } else if (fx === 'mandala') {   // vòng sen Phật xoay chậm (hoà thượng)
    for (let j = 0; j < 2; j++) { const R = (j ? 300 : 420) * k, n = j ? 12 : 16; s += `<g transform="rotate(${f1((j ? -1 : 1) * t * 12)} ${cx} ${cy})">`;
      for (let i = 0; i < n; i++) s += `<ellipse cx="${cx}" cy="${f1(cy - R)}" rx="${f1(R * 0.12)}" ry="${f1(R * 0.24)}" transform="rotate(${i * 360 / n} ${cx} ${cy})" fill="${ac}" opacity="${j ? 0.22 : 0.16}"/>`; s += `</g>`; }
  } else if (fx === 'moon') {   // trăng to + vòng bia + mũi tên vút qua (thần tiễn)
    s += `<circle cx="${cx + 120}" cy="300" r="${f1(230 * k)}" fill="#F4F0DC" opacity="0.85"/><circle cx="${cx + 60}" cy="260" r="${f1(40 * k)}" fill="#D8D4C0" opacity="0.6"/>`;
    [260, 190, 120].forEach((r, i) => { s += `<circle cx="${cx + 120}" cy="300" r="${f1(r * k)}" fill="none" stroke="${i % 2 ? '#C0392B' : '#1E3A6A'}" stroke-width="10" opacity="0.35"/>`; });
    for (let i = 0; i < 4; i++) { const d = ((t * 1.3 + i * 0.27) % 1), y = 160 + i * 230, x = -300 + d * 2600; s += `<path d="M${f1(x - 300)} ${y} L${f1(x)} ${y}" stroke="#FFF6DA" stroke-width="5" opacity="0.6"/><path d="M${f1(x)} ${y} l-24 -10 l0 20Z" fill="#FFF6DA" opacity="0.8"/>`; }
  } else if (fx === 'leopard') {   // đốm báo (Báo Tử Đầu) + đêm tuyết
    for (let i = 0; i < 22; i++) { const x = prand(i, 201) * 1920, y = prand(i, 202) * 1000, r = 26 + prand(i, 203) * 26;
      s += `<g opacity="${f1(0.22 * k)}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="#C8A060" stroke-width="${f1(r * 0.4)}" stroke-dasharray="${f1(r * 0.9)} ${f1(r * 0.35)}"/></g>`; }
  } else if (fx === 'blades') {   // ánh thép đao lướt chéo
    for (let i = 0; i < 4; i++) { const d = ((t * 0.9 + i * 0.25) % 1), x = -400 + d * 2800; s += `<path d="M${f1(x)} -50 L${f1(x - 600)} 1130" stroke="${ac}" stroke-width="${18 + i * 6}" opacity="${f1(0.18 * k)}"/>`; }
    s += `<g transform="translate(${cx} ${cy}) rotate(-30)" opacity="${f1(0.3 * k)}"><path d="M-20 -460 Q40 -300 30 200 L-30 200 Q-40 -200 -20 -460Z" fill="#DDE8EE"/><rect x="-60" y="200" width="120" height="22" fill="${ac}"/></g>`;
  } else if (fx === 'chains') {   // song tiên sắt bắt chéo
    [-1, 1].forEach(d => { s += `<g transform="translate(${cx} ${cy}) rotate(${f1(d * 35 * k)})" opacity="${f1(0.5 * k)}">` + Array.from({ length: 9 }, (_, j) => `<rect x="-22" y="${-440 + j * 70}" width="44" height="60" rx="10" fill="#6A6478" stroke="${INK2}" stroke-width="4"/>`).join('') + `<rect x="-14" y="190" width="28" height="140" fill="#3A2A1A"/></g>`; });
  } else if (fx === 'dragon') {   // rồng xanh uốn lượn + mây (hậu duệ Quan Vũ)
    let d = ''; for (let i = 0; i <= 40; i++) { const u = i / 40, x = -100 + u * 2120, y = cy - 120 + Math.sin(u * 9 + t * 2.5) * 170; d += (i ? ' L' : 'M') + f1(x) + ' ' + f1(y); }
    s += `<path d="${d}" stroke="#1E7A3A" stroke-width="${f1(110 * k)}" fill="none" stroke-linecap="round" opacity="0.45"/><path d="${d}" stroke="${ac}" stroke-width="${f1(14 * k)}" fill="none" stroke-dasharray="6 30" opacity="0.6"/>`;
    for (let i = 0; i < 5; i++) { const x = ((i * 470 + t * 60) % 2300) - 190; s += `<path d="M${f1(x)} ${880 - (i % 2) * 40} q40 -60 90 -10 q30 -50 80 0 q50 -10 40 40Z" fill="#E8F4E0" opacity="0.25"/>`; }
  } else if (fx === 'jade') {   // vầng hào quang + mây lành vàng (Ngọc Kỳ Lân)
    s += `<circle cx="${cx}" cy="${cy - 60}" r="${f1(380 * k)}" fill="${ac}" opacity="0.18"/><circle cx="${cx}" cy="${cy - 60}" r="${f1(300 * k)}" fill="none" stroke="${ac}" stroke-width="10" opacity="0.6"/>`;
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + t * 0.4, x = cx + Math.cos(a) * 470, y = cy - 40 + Math.sin(a) * 240;
      s += `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})" d="M-60 10 q0 -40 40 -36 q10 -30 44 -12 q40 -20 50 22 q24 6 16 26 Z" fill="${ac}" stroke="#7A6A2A" stroke-width="4" opacity="0.55"/>`; }
  }
  return s;
}
// hạt bay theo người
function xhIntroPt(t, pt, ac) {
  let s = '';
  for (let i = 0; i < 40; i++) {
    const r0 = prand(i, 93), x0 = r0 * 1920, rise = !['petal', 'snow', 'leaf'].includes(pt), sp = (rise ? 90 : 70) + prand(i, 91) * 140, ph = (t * sp + prand(i, 92) * 1200) % 1200;
    const y = rise ? 1120 - ph : ph - 60, x = x0 + Math.sin(t * 1.5 + i) * 40, op = 0.3 + 0.55 * prand(i, 95), r = 3 + prand(i, 94) * 6;
    if (pt === 'heart') s += xhHeart(x, y, r * 2.4, ac, op);
    else if (pt === 'petal') s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.6)}" ry="${f1(r)}" transform="rotate(${f1(t * 90 + i * 40)} ${f1(x)} ${f1(y)})" fill="#F6B8C8" opacity="${f1(op)}"/>`;
    else if (pt === 'snow') s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.8)}" fill="#FFFFFF" opacity="${f1(op)}"/>`;
    else if (pt === 'leaf') s += `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(t * 120 + i * 50)})" d="M0 -10 Q8 0 0 10 Q-8 0 0 -10Z" fill="${pt === 'leaf' ? '#6A7A4A' : ac}" opacity="${f1(op)}"/>`;
    else if (pt === 'star') { const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)); s += `<circle cx="${f1(x0)}" cy="${f1(prand(i, 96) * 700)}" r="${f1(r * 0.5)}" fill="#FFFFFF" opacity="${f1(op * tw)}"/>`; }
    else if (pt === 'dust') s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.7)}" fill="#D8D0C0" opacity="${f1(op * 0.6)}"/>`;
    else if (pt === 'spark') s += `<path d="M${f1(x)} ${f1(y)} l2 -14" stroke="${ac}" stroke-width="3" opacity="${f1(op)}"/>`;
    else s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.7)}" fill="${pt === 'gold' ? '#FFE7A0' : '#FFB45A'}" opacity="${f1(op)}"/>`;
  }
  return s;
}
function xhIntro(t, key, o = {}) {
  const [id, name] = XH_P[key], th = XH_IT[key] || XH_IT.qv, L = th.side === 'L', cx = L ? 600 : 1320, g = 1050, nx = L ? 1300 : 660, ny = 440, gid = 'xhi' + key;
  const dark = mixC(th.bg, '#05030A', 0.55), mid = mixC(th.bg, '#FFFFFF', 0.12);
  let s = `<defs><radialGradient id="${gid}" cx="${L ? 0.31 : 0.69}" cy="0.5" r="0.85"><stop offset="0" stop-color="${mid}"/><stop offset="0.6" stop-color="${th.bg}"/><stop offset="1" stop-color="${dark}"/></radialGradient>` +
    `<filter id="${gid}g" x="-30%" y="-30%" width="160%" height="160%"><feFlood flood-color="${th.ac}"/><feComposite in2="SourceAlpha" operator="in"/><feGaussianBlur stdDeviation="14"/></filter><linearGradient id="${gid}n" x1="0" x2="1"><stop offset="0" stop-color="#FFF6DA" stop-opacity="0"/><stop offset="0.5" stop-color="#FFF6DA" stop-opacity="0.95"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></linearGradient></defs>`;
  s += `<rect width="1920" height="1080" fill="url(#${gid})"/>` + xhIntroFx(t, th.fx, cx, th.ac) + xhIntroPt(t, th.pt, th.ac);
  // xuất hiện theo kiểu riêng; tl = lúc vào vị trí
  const en = th.en, tl = en === 'spin' ? 0.7 : en === 'zoom' ? 0.4 : 0.35, u = clamp(t / tl), land = t > tl ? spring(t, tl, 16, 7) : 0;
  let x = cx, gy = g, sc = 0.7, sx = 1, op = 1, ghost = '';
  if (en === 'drop') { gy = g - (1 - EZ.quadIn(u)) * 300; sc *= 1 + 0.12 * (1 - u) + land * 0.04; }
  else if (en === 'dash') { x = cx + (L ? -1 : 1) * (1 - EZ.expoOut(u)) * 1300; }
  else if (en === 'pop') { sc *= Math.max(0.01, EZ.backOut(u)) * (1 + land * 0.06); }
  else if (en === 'spin') { sx = Math.cos((1 - EZ.quadOut(u)) * Math.PI * 2); if (Math.abs(sx) < 0.04) sx = 0.04; }
  else if (en === 'rise') { gy = g + (1 - EZ.quadOut(u)) * 420; op = clamp(u * 1.5); }
  else if (en === 'zoom') { sc *= 1 + 0.9 * (1 - EZ.expoOut(u)); op = clamp(u * 2); }
  const st = Object.assign({ x, ground: gy, scale: sc, ex: o.ex || 'fierce', shadow: false, legs: 'stand', flip: !L }, th.st);
  if (st.arm != null && st.wrot == null) st.wrot = xfAlong(st.arm + Math.sin(t * 2) * 4, 0);
  const body = (S) => sx === 1 ? thC(id, S, t) : `<g transform="translate(${f1(S.x)} 0) scale(${f1(sx)} 1) translate(${f1(-S.x)} 0)">${thC(id, S, t)}</g>`;
  if (en === 'dash' && t < tl + 0.1) for (let i = 3; i >= 1; i--) { const ui = clamp((t - i * 0.05) / tl), xi = cx + (L ? -1 : 1) * (1 - EZ.expoOut(ui)) * 1300; ghost += `<g opacity="${f1(0.18 * (4 - i) / 3)}">${body(Object.assign({}, st, { x: xi }))}</g>`; }
  s += `<ellipse cx="${f1(x)}" cy="${g + 6}" rx="${f1(240 * clamp(u * 1.2))}" ry="32" fill="#000" opacity="0.4"/>` + ghost;
  s += `<g opacity="${f1(op)}"><g opacity="${f1(0.85 * clamp((t - tl) / 0.3))}" filter="url(#${gid}g)">${body(st)}</g>${body(st)}</g>`;
  if (en === 'drop' || en === 'dash') s += shockRing(t, tl, cx, g - 10, { r: 700, c: th.ac, dur: 0.6 }) + fxDust(t, tl, cx - 140, g - 6, -1) + fxDust(t, tl, cx + 140, g - 6, 1);
  if (en === 'rise') for (let i = 0; i < 6; i++) { const d = t - 0.1 * i; if (d > 0 && d < 1.2) s += `<ellipse cx="${f1(cx + (i - 2.5) * 90)}" cy="${f1(g - d * 60)}" rx="${f1(120 + d * 80)}" ry="${f1(50 + d * 20)}" fill="#E8DCC0" opacity="${f1(0.4 * (1 - d / 1.2))}"/>`; }
  if (en === 'zoom' || en === 'spin') s += radialLines(t, cx, 560, { n: 30, r0: 380, op: 0.5 * clamp(1 - Math.abs(t - tl) / 0.4), c: th.ac });
  // tên: vệt màu riêng quét ngang + chữ to + ánh lướt
  const bw = Math.min(1080, Math.max(620, name.length * 70 + 160)), wk = EZ.expoOut(clamp((t - 0.45) / 0.35)), cid = gid + 'c', dir = L ? 1 : -1;
  const x0 = L ? nx - bw / 2 - 40 : nx + bw / 2 + 40 - (bw + 80) * wk;
  s += `<clipPath id="${cid}"><rect x="${f1(x0)}" y="${ny - 160}" width="${f1((bw + 80) * wk)}" height="320"/></clipPath>`;
  s += `<g clip-path="url(#${cid})"><path d="M${nx - bw / 2 - 30} ${ny - 70} Q${nx - bw / 4} ${ny - 108} ${nx} ${ny - 86} T${nx + bw / 2 + 30} ${ny - 92} L${nx + bw / 2 + 10} ${ny + 74} Q${nx + bw / 5} ${ny + 98} ${nx - bw / 6} ${ny + 80} T${nx - bw / 2 - 20} ${ny + 70}Z" fill="${th.ban}" stroke="${mixC(th.ban, '#000000', 0.5)}" stroke-width="5"/>` +
    `<path d="M${nx - bw / 2} ${ny + 58} L${nx + bw / 2 - 20} ${ny + 64}" stroke="${th.ac}" stroke-width="6" opacity="0.9"/></g>`;
  const nk = clamp((t - 0.6) / 0.25), ns = 1 + 0.35 * (1 - EZ.backOut(nk));
  s += `<g opacity="${f1(nk)}" transform="translate(${nx} ${ny}) scale(${f1(ns)}) translate(${-nx} ${-ny})">` + kText(name.toUpperCase(), nx, ny + 40, name.length > 11 ? 96 : 116, { c: '#FFF6DA', stroke: '#14080A', sw: 14 }) + `</g>`;
  const gx = lerp(nx - bw * dir, nx + bw * dir, clamp((t - 1.0) / 0.55));
  if (t > 1.0 && t < 1.6) s += `<g clip-path="url(#${cid})"><rect x="${f1(gx - 70)}" y="${ny - 110}" width="140" height="220" fill="url(#${gid}n)" transform="skewX(-20)" opacity="0.7"/></g>`;
  if (o.tag) { const tk = clamp((t - 0.85) / 0.3), tw = Math.max(560, o.tag.length * 21 + 120), ty = ny + 130;
    s += `<g opacity="${f1(tk)}" transform="translate(${f1((1 - tk) * 40 * dir)} 0)"><path d="M${nx - tw / 2} ${ty} L${nx + tw / 2} ${ty} L${nx + tw / 2 + 34} ${ty + 40} L${nx + tw / 2} ${ty + 80} L${nx - tw / 2} ${ty + 80} L${nx - tw / 2 - 34} ${ty + 40}Z" fill="#F3E3B8" stroke="#14080A" stroke-width="5"/>` +
      kText(o.tag, nx, ty + 54, o.tag.length > 34 ? 32 : 38, { c: mixC(th.ban, '#000000', 0.3) }) + `</g>`; }
  const qd = t - 1.15; if (qd > 0) { const qk = qd < 0.15 ? 1 + (1 - qd / 0.15) * 1.4 : 1 + 0.08 * Math.exp(-(qd - 0.15) * 8) * Math.sin((qd - 0.15) * 30), w = Math.sin(t * 3) * 3, qx = nx + (L ? 120 : -120);
    s += `<g transform="translate(${qx} 830) rotate(${f1(-6 * dir + w)}) scale(${f1(qk)})"><rect x="-150" y="-78" width="300" height="156" rx="16" fill="#1E120A" stroke="#E2C25A" stroke-width="8"/><rect x="-136" y="-64" width="272" height="128" rx="10" fill="none" stroke="#E2C25A" stroke-width="2.5"/>` +
      kText('HẠNG', -40, 22, 54, { c: '#E2C25A' }) + kText('?', 82, 40, 110, { font: `'Bangers', ${FH}`, c: '#FFF6DA' }) + `</g>` + (qd < 0.6 ? glowSparks(t, 1.15, qx, 830, { n: 14, c: '#FFD25A', speed: 700, dur: 0.5 }) : ''); }
  const z = 1.0 + 0.04 * clamp(t / 4), sh = (en === 'drop' || en === 'dash') && t > tl && t < tl + 0.3 ? Math.sin(t * 90) * 10 * (1 - (t - tl) / 0.3) : 0;
  return `<g transform="translate(960 540) scale(${f1(z)}) translate(-960 ${f1(-540 + sh)})">${s}</g>`;
}

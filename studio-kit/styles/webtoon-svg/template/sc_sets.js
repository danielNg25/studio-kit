// CHÉP từ tập xep-hang-vo-cong (2026-10-13) — đồ nghề dùng chung, không sửa ở đây trừ khi cần.
// ===== NỀN VÕ HIỆP CHI TIẾT (2026-10-11) — theo channel-vi-nhan/VISUAL_RULES.md (người dùng: "apply sang kênh này, nền hiện tại đang tệ quá")
// Luật: mỗi địa điểm một bối cảnh riêng; nền chi tiết (nhiều lớp núi/đồi, cây có tán, cỏ chữ v to dần về phía gần, đồ đạc đúng thời);
// phòng vẽ phối cảnh 1 điểm tụ (room1p ở sc_bgkit.js); cảnh tối vẫn phải nhìn rõ (ánh trăng/đèn, không phủ đen).
// Mọi set nhận t (để cây/cỏ/mây/khói chuyển động) và trả chuỗi SVG khung 1920×1080. Nhân vật đứng ở ground ≈ 1075.

const _T = (t) => { if (typeof t === 'number') ANIM_T = t; return AT_(); };

// ---------- mái ngói cong kiểu chùa/cung điện ----------
// x = tâm, y = chân mái (mép dưới giữa), w = rộng chân mái, h = cao mái; o.c ngói, o.tip màu đầu đao, o.ridge bờ nóc
function wxRoof(x, y, w, h, o = {}) {
  const c = o.c || '#3E4A44', c2 = dk(c, 0.18), lip = o.lip ?? 18, up = o.up ?? 0.55, hw = w / 2;
  let s = `<path d="M${R1(x - hw - 40)} ${R1(y - h * up)} Q${R1(x - hw + 10)} ${R1(y + 6)} ${R1(x - hw + 70)} ${y} H${R1(x + hw - 70)} Q${R1(x + hw - 10)} ${R1(y + 6)} ${R1(x + hw + 40)} ${R1(y - h * up)} Q${R1(x + hw * 0.62)} ${R1(y - h * 0.62)} ${R1(x + hw * 0.5)} ${R1(y - h)} H${R1(x - hw * 0.5)} Q${R1(x - hw * 0.62)} ${R1(y - h * 0.62)} ${R1(x - hw - 40)} ${R1(y - h * up)}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  // hàng ngói ống
  const n = Math.max(8, Math.round(w / 34));
  for (let i = 1; i < n; i++) { const u = i / n, xb = x - hw + 70 + (w - 140) * u, xt = x - hw * 0.5 + w * 0.5 * u; s += `<path d="M${R1(xt)} ${R1(y - h + 6)} Q${R1((xt + xb) / 2 + (u - 0.5) * 30)} ${R1(y - h * 0.4)} ${R1(xb)} ${R1(y - 4)}" stroke="${c2}" stroke-width="3" fill="none" opacity="0.8"/>`; }
  // diềm ngói + bờ nóc + 2 đầu đao + 2 vẫn
  s += `<path d="M${R1(x - hw + 60)} ${y} H${R1(x + hw - 60)}" stroke="${o.lipC || dk(c, 0.3)}" stroke-width="${lip}" stroke-linecap="round"/><path d="M${R1(x - hw + 60)} ${y} H${R1(x + hw - 60)}" stroke="${INK2}" stroke-width="3" opacity="0.6" transform="translate(0 ${lip / 2})"/>`;
  s += `<rect x="${R1(x - hw * 0.52)}" y="${R1(y - h - 16)}" width="${R1(w * 0.52)}" height="20" rx="6" fill="${o.ridge || dk(c, 0.25)}" stroke="${INK2}" stroke-width="4"/>`;
  const tip = o.tip || '#C9A227';
  for (const sd of [-1, 1]) {
    s += `<path d="M${R1(x + sd * (hw + 40))} ${R1(y - h * up)} q${sd * 18} -22 ${sd * 10} -46" stroke="${INK2}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${R1(x + sd * (hw + 40))} ${R1(y - h * up)} q${sd * 18} -22 ${sd * 10} -46" stroke="${tip}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${R1(x + sd * w * 0.26)} ${R1(y - h - 14)} q${sd * 6} -30 ${sd * 30} -36 q${-sd * 4} 16 ${sd * 6} 26" fill="${tip}" stroke="${INK2}" stroke-width="3.5"/>`;
  }
  if (o.pearl) s += `<circle cx="${x}" cy="${R1(y - h - 30)}" r="14" fill="#E4B83A" stroke="${INK2}" stroke-width="3.5"/>`;
  return s;
}
// đèn lồng đỏ treo (đung đưa)
function wxLantern(x, y, s = 1, c = '#C0392B', T = AT_()) {
  const a = Math.sin(T * 1.6 + x * 0.01) * 4;
  return `<g transform="translate(${R1(x)} ${R1(y)}) rotate(${R1(a)}) scale(${s})"><path d="M0 -60 V-28" stroke="${INK2}" stroke-width="3"/><ellipse cx="0" cy="0" rx="34" ry="30" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M-20 -24 Q-30 0 -20 24 M0 -30 V30 M20 -24 Q30 0 20 24" stroke="${dk(c, 0.3)}" stroke-width="2.5" fill="none"/><rect x="-16" y="-36" width="32" height="10" rx="3" fill="#C9A227" stroke="${INK2}" stroke-width="2.5"/><rect x="-16" y="26" width="32" height="10" rx="3" fill="#C9A227" stroke="${INK2}" stroke-width="2.5"/><path d="M0 36 v26 M-6 36 v20 M6 36 v20" stroke="#E4B83A" stroke-width="3"/><ellipse cx="0" cy="0" rx="60" ry="54" fill="#FFD27A" opacity="0.14"/></g>`;
}
// lư hương đồng lớn ở sân chùa (có khói)
function wxCauldron(x, g, s = 1) {
  return _g(x, g, s, `<path d="M-70 0 L-58 -40 H58 L70 0Z" fill="#6A5A3A" stroke="${INK2}" stroke-width="4"/><path d="M-90 -40 Q-100 -130 -70 -150 H70 Q100 -130 90 -40Z" fill="#8A7440" stroke="${INK2}" stroke-width="5"/><path d="M-80 -110 H80" stroke="${dk('#8A7440', 0.3)}" stroke-width="4"/><path d="M-96 -150 H96" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M-96 -150 H96" stroke="#A88E52" stroke-width="7" stroke-linecap="round"/><path d="M-70 -150 q-20 -30 0 -44 M70 -150 q20 -30 0 -44" stroke="${INK2}" stroke-width="8" fill="none"/><path d="M-60 -80 q20 -14 40 0 q20 14 40 0 q20 -14 40 0" stroke="${dk('#8A7440', 0.35)}" stroke-width="3" fill="none"/>`) + smoke(x - 14 * s, g - 160 * s, 220 * s, 0.4) + smoke(x + 16 * s, g - 160 * s, 180 * s, 0.3);
}
// đèn đá
const wxStoneLamp = (x, g, s = 1) => _g(x, g, s, `<rect x="-34" y="-22" width="68" height="22" fill="#B8B0A0" stroke="${INK2}" stroke-width="4"/><rect x="-12" y="-110" width="24" height="88" fill="#C8C0B0" stroke="${INK2}" stroke-width="4"/><rect x="-40" y="-170" width="80" height="60" fill="#C8C0B0" stroke="${INK2}" stroke-width="4"/><rect x="-20" y="-158" width="40" height="34" fill="#FFE39A" stroke="${INK2}" stroke-width="3"/><path d="M-60 -170 L0 -214 L60 -170Z" fill="#9A9284" stroke="${INK2}" stroke-width="4"/><circle cx="0" cy="-220" r="8" fill="#9A9284" stroke="${INK2}" stroke-width="3"/>`);
// sư tử đá
const wxLion = (x, g, s = 1, flip = false) => _g(x, g, s, `<g transform="scale(${flip ? -1 : 1} 1)"><rect x="-70" y="-40" width="140" height="40" fill="#B8B0A0" stroke="${INK2}" stroke-width="4"/><path d="M-50 -40 Q-60 -120 -20 -150 Q30 -170 50 -130 Q60 -90 40 -40Z" fill="#CFC7B6" stroke="${INK2}" stroke-width="4.5"/><circle cx="20" cy="-150" r="42" fill="#CFC7B6" stroke="${INK2}" stroke-width="4.5"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${R1(20 + Math.cos(i) * 34)}" cy="${R1(-150 + Math.sin(i) * 34)}" r="9" fill="#BDB4A2" stroke="${INK2}" stroke-width="2"/>`).join('')}<circle cx="34" cy="-156" r="5" fill="${INK2}"/><path d="M30 -134 q14 6 24 -2" stroke="${INK2}" stroke-width="3" fill="none"/><circle cx="-30" cy="-46" r="20" fill="#BDB4A2" stroke="${INK2}" stroke-width="3"/></g>`);
// tháp nhiều tầng (Tam Tháp Đại Lý: trắng)
function wxPagoda(x, g, s = 1, n = 9, c = '#F2EEE4') {
  let b = '', y = 0, w = 120;
  b += `<rect x="-90" y="-30" width="180" height="30" fill="${dk(c, 0.1)}" stroke="${INK2}" stroke-width="4"/>`; y = -30;
  for (let i = 0; i < n; i++) { const hh = i === 0 ? 120 : 52 - i * 2.5, ww = w - i * 7; b += `<rect x="${R1(-ww / 2)}" y="${R1(y - hh)}" width="${R1(ww)}" height="${R1(hh)}" fill="${c}" stroke="${INK2}" stroke-width="3.5"/>`; if (i % 2 === 0 && i < n - 1) b += `<rect x="-8" y="${R1(y - hh * 0.7)}" width="16" height="${R1(hh * 0.4)}" rx="6" fill="#7A6A54"/>`; y -= hh; b += `<path d="M${R1(-ww / 2 - 18)} ${R1(y + 4)} Q0 ${R1(y - 10)} ${R1(ww / 2 + 18)} ${R1(y + 4)} L${R1(ww / 2 - 6)} ${R1(y - 6)} H${R1(-ww / 2 + 6)}Z" fill="${dk(c, 0.18)}" stroke="${INK2}" stroke-width="3"/>`; y -= 6; }
  b += `<path d="M0 ${R1(y)} V${R1(y - 60)}" stroke="#7A6A54" stroke-width="8"/><circle cx="0" cy="${R1(y - 64)}" r="10" fill="#C9A227" stroke="${INK2}" stroke-width="3"/>`;
  return _g(x, g, s, b);
}
// cây đào (tán hồng, hoa)
function wxPeach(x, g, s = 1, T = AT_()) {
  const c = '#F2B6C8', c2 = '#E58AA6';
  let b = `<path d="M-14 0 Q-20 -90 -40 -150 Q-60 -200 -110 -220 M-4 0 Q4 -100 20 -170 Q40 -220 100 -240 M10 -110 Q50 -150 70 -150" stroke="#5A3A2A" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-14 0 Q-20 -90 -40 -150 Q-60 -200 -110 -220 M-4 0 Q4 -100 20 -170 Q40 -220 100 -240" stroke="#7A5038" stroke-width="13" fill="none" stroke-linecap="round"/>`;
  for (const [cx, cy, r] of [[-120, -240, 70], [-40, -290, 84], [60, -300, 80], [130, -250, 64], [0, -220, 60], [-180, -200, 48]]) b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${INK2}" stroke-width="4.5"/>`;
  for (let i = 0; i < 34; i++) { const a = hrnd(i, 4) * 6.28, rr = 40 + hrnd(i, 5) * 120, px = Math.cos(a) * rr * 1.3, py = -260 + Math.sin(a) * rr * 0.6; b += `<g transform="translate(${R1(px)} ${R1(py)})">${[0, 72, 144, 216, 288].map(k => `<circle cx="${R1(Math.cos(k * 0.01745) * 5)}" cy="${R1(Math.sin(k * 0.01745) * 5)}" r="4" fill="${i % 3 ? '#FFF0F4' : c2}"/>`).join('')}<circle r="2.5" fill="#E4B83A"/></g>`; }
  return _g(x, g, s, b + `<ellipse cx="0" cy="4" rx="140" ry="18" fill="#20140A" opacity="0.12"/>`);
}
// cánh hoa đào bay
function wxPetals(n, T = AT_(), seed = 1) { let s = ''; for (let i = 0; i < n; i++) { const sp = 40 + hrnd(i, seed) * 50, x = ((hrnd(i, seed + 1) * 2200 + T * sp * 1.4) % 2200) - 140, y = ((hrnd(i, seed + 2) * 1100 + T * sp) % 1180) - 60, a = (T * 90 + i * 40) % 360; s += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="9" ry="5" fill="#F5C2D2" stroke="${INK2}" stroke-width="1.2" transform="rotate(${R1(a)} ${R1(x)} ${R1(y)})" opacity="0.9"/>`; } return s; }
// trúc
function wxBamboo(x, g, h = 520, s = 1, T = AT_(), c = '#7FA65A') { const sw = Math.sin(T * 1.2 + x * 0.013) * 10; let b = ''; const n = Math.round(h / 70); for (let i = 0; i < n; i++) { const y0 = -i * 70, x0 = sw * (i / n) * (i / n), x1 = sw * ((i + 1) / n) * ((i + 1) / n); b += `<path d="M${R1(x0)} ${y0} L${R1(x1)} ${y0 - 66}" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M${R1(x0)} ${y0} L${R1(x1)} ${y0 - 66}" stroke="${c}" stroke-width="13" stroke-linecap="round"/>`; if (i % 2) b += `<path d="M${R1(x1)} ${y0 - 60} q30 -20 70 -10 q-36 10 -70 10Z M${R1(x1)} ${y0 - 50} q-30 -16 -64 0 q34 6 64 0Z" fill="${dk(c, 0.1)}" stroke="${INK2}" stroke-width="2.5"/>`; } return _g(x, g, s, b); }
// tảng đá
const wxRock = (x, g, s = 1, c = '#9A9284') => _g(x, g, s, `<path d="M-90 0 Q-100 -50 -60 -80 Q-20 -110 30 -96 Q90 -80 96 -30 L100 0Z" fill="${c}" stroke="${INK2}" stroke-width="4.5"/><path d="M-40 -70 q20 -12 40 -4 M20 -60 q20 4 30 24" stroke="${lt_(c, 0.3)}" stroke-width="4" fill="none"/><path d="M-60 -20 q30 -10 50 6" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none"/>`);
// sân lát đá phối cảnh: từ yTop xuống 1080, các đường hội tụ về (960, vy)
function wxPaving(yTop, c = '#D8CEB8', o = {}) {
  const vy = o.vy ?? yTop - 140, vx = o.vx ?? 960;
  let s = `<rect y="${yTop}" width="1920" height="${1080 - yTop}" fill="${c}"/><path d="M0 ${yTop} H1920" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = -16; i <= 16; i++) { const xb = vx + i * 150, xt = vx + (xb - vx) * (yTop - vy) / (1080 - vy); s += _ln(xt, yTop, xb, 1080, dk(c, 0.18), 2.5); }
  for (let z = 1, j = 0; j < 14; j++) { const y = vy + (yTop - vy) / z; if (y > 1080) break; s += _ln(0, y, 1920, y, dk(c, 0.2), 2.5); z *= 0.72; }
  for (let i = 0; i < 26; i++) { const y = yTop + 20 + hrnd(i, 31) * (1060 - yTop), x = hrnd(i, 32) * 1920, k = 0.5 + (y - yTop) / (1080 - yTop); s += `<path d="M${R1(x)} ${R1(y)} l${R1(14 * k)} ${R1(4 * k)} l${R1(8 * k)} ${R1(-3 * k)}" stroke="${dk(c, 0.3)}" stroke-width="2" fill="none" opacity="0.6"/>`; }
  return s;
}
// mặt tiền điện/chùa nhìn thẳng: bệ đá + bậc + cột đỏ + cửa song + biển + mái 2 tầng
function wxTempleFront(x, g, w, o = {}) {
  const hw = w / 2, H = o.h || 250, col = o.col || '#A8322A', wall = o.wall || '#B8463A', base = o.base || '#CFC6B2', top = g - 60 - H;
  let s = '';
  // bệ đá + bậc thềm
  s += `<path d="M${R1(x - hw - 40)} ${g} V${g - 60} H${R1(x + hw + 40)} V${g}Z" fill="${base}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${R1(x - 120 - i * 14)}" y="${R1(g - 60 + i * 15)}" width="${R1(240 + i * 28)}" height="15" fill="${dk(base, 0.04 * i)}" stroke="${INK2}" stroke-width="3"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${R1(x - hw - 30 + i * (w + 60) / 9)} ${g - 56} v50" stroke="${dk(base, 0.2)}" stroke-width="3" opacity="0.6"/>`;
  // tường + cửa
  s += `<rect x="${R1(x - hw)}" y="${R1(top)}" width="${R1(w)}" height="${H}" fill="${wall}" stroke="${INK2}" stroke-width="5"/>`;
  const nC = o.cols || 6, gap = w / (nC - 1);
  for (let i = 0; i < nC - 1; i++) { const cx = x - hw + gap * (i + 0.5), dw = gap - 60; if (Math.abs(cx - x) < gap * 0.6 || o.allDoors) { s += `<rect x="${R1(cx - dw / 2)}" y="${R1(top + 40)}" width="${R1(dw)}" height="${R1(H - 40)}" fill="#7A3A22" stroke="${INK2}" stroke-width="4"/>`; for (let k = 1; k < 4; k++) s += `<path d="M${R1(cx - dw / 2)} ${R1(top + 40 + (H - 40) * k / 4)} h${R1(dw)}" stroke="${INK2}" stroke-width="2.5"/>`; s += `<path d="M${R1(cx)} ${R1(top + 40)} V${g - 60}" stroke="${INK2}" stroke-width="3"/>`; for (let k = 0; k < 6; k++) for (let m = 0; m < 3; m++) s += `<rect x="${R1(cx - dw / 2 + 10 + m * (dw - 20) / 3)}" y="${R1(top + 52 + k * 16)}" width="${R1((dw - 20) / 3 - 6)}" height="10" fill="#C9864A" opacity="0.8"/>`; }
    else { s += `<rect x="${R1(cx - dw / 2)}" y="${R1(top + 60)}" width="${R1(dw)}" height="${R1(H * 0.45)}" fill="#E8D9B0" stroke="${INK2}" stroke-width="4"/>`; for (let k = 1; k < 5; k++) s += `<path d="M${R1(cx - dw / 2 + dw * k / 5)} ${R1(top + 60)} v${R1(H * 0.45)}" stroke="#8A5A34" stroke-width="3"/>`; for (let k = 1; k < 4; k++) s += `<path d="M${R1(cx - dw / 2)} ${R1(top + 60 + H * 0.45 * k / 4)} h${R1(dw)}" stroke="#8A5A34" stroke-width="3"/>`; } }
  for (let i = 0; i < nC; i++) { const cx = x - hw + gap * i; s += `<rect x="${R1(cx - 15)}" y="${R1(top)}" width="30" height="${H}" fill="${col}" stroke="${INK2}" stroke-width="4"/><path d="M${R1(cx - 6)} ${R1(top + 10)} V${g - 70}" stroke="${lt_(col, 0.3)}" stroke-width="4" opacity="0.7"/><rect x="${R1(cx - 22)}" y="${g - 76}" width="44" height="16" fill="${base}" stroke="${INK2}" stroke-width="3"/>`; }
  // xà + đầu kê
  s += `<rect x="${R1(x - hw - 20)}" y="${R1(top - 26)}" width="${R1(w + 40)}" height="30" fill="#5A7A6A" stroke="${INK2}" stroke-width="4"/>` + `<rect x="${R1(x - hw - 20)}" y="${R1(top - 26)}" width="${R1(w + 40)}" height="30" fill="${pat('thunder', '#C9A227', null, 0.7)}" opacity="0.6"/>`;
  // mái 2 tầng
  s += wxRoof(x, top - 30, w + 160, 120, { c: o.roof || '#3E4A44', tip: o.tip, pearl: o.pearl });
  if (o.two !== false) s += `<rect x="${R1(x - hw * 0.62)}" y="${R1(top - 210)}" width="${R1(w * 0.62)}" height="70" fill="${wall}" stroke="${INK2}" stroke-width="4"/>` + wxRoof(x, top - 150, w * 0.78, 110, { c: o.roof || '#3E4A44', tip: o.tip, pearl: o.pearl ?? true });
  if (o.lanterns !== false) s += wxLantern(x - hw + gap * 0.5, top + 30, 0.8) + wxLantern(x + hw - gap * 0.5, top + 30, 0.8);
  // biển tên (treo dưới mái, vẽ sau cùng để không bị mái che)
  if (o.name) { const bw = Math.max(240, o.name.length * 26 + 60); s += `<path d="M${R1(x - bw / 3)} ${R1(top - 30)} L${R1(x - bw / 4)} ${R1(top + 6)} M${R1(x + bw / 3)} ${R1(top - 30)} L${R1(x + bw / 4)} ${R1(top + 6)}" stroke="${INK2}" stroke-width="3"/><rect x="${R1(x - bw / 2)}" y="${R1(top + 4)}" width="${R1(bw)}" height="58" rx="8" fill="#2A2A30" stroke="#C9A227" stroke-width="6"/>` + `<text x="${x}" y="${R1(top + 45)}" font-family="${FH}" font-size="34" fill="#E4B83A" text-anchor="middle">${o.name}</text>`; }
  return s;
}
// nền trời + mây + chim
function wxSky(t, o = {}) {
  const T = _T(t);
  let s = skyGrad(o.id || 'wxSk', o.c1 || '#B9D3E2', o.c2 || '#EEF0E2');
  if (o.sun) s += `<circle cx="${o.sun[0]}" cy="${o.sun[1]}" r="${o.sun[2] || 70}" fill="${o.sunC || '#FFE7A8'}" opacity="0.9"/><circle cx="${o.sun[0]}" cy="${o.sun[1]}" r="${(o.sun[2] || 70) * 1.8}" fill="${o.sunC || '#FFE7A8'}" opacity="0.18"/>`;
  if (o.clouds !== false) s += cloudsDrift([[180, 130, 1.0, '#F7F3E8'], [760, 90, 1.3, '#F7F3E8'], [1380, 150, 0.9, '#F7F3E8'], [1800, 80, 1.1, '#F7F3E8']], 9);
  if (o.birds !== false) s += birds(200, 3);
  return s;
}
// dải sương ngang
const wxMist = (y, op = 0.45, c = '#F4F2EA', T = AT_()) => `<path d="M${R1(-200 + Math.sin(T * 0.3) * 60)} ${y} q300 -40 600 0 t600 0 t600 0 t600 0 V${y + 46} H-200Z" fill="${c}" opacity="${op}"/>`;
// núi xa kiểu thuỷ mặc (nhiều lớp, nhọn) — y = chân, c = màu
function wxPeaks(y, c, seed = 1, amp = 1, snow = false) {
  const pts = []; let x = -60; let i = 0; while (x < 1980) { const w = 120 + hrnd(i, seed) * 160, hh = (120 + hrnd(i, seed + 1) * 220) * amp; pts.push([x + w / 2, y - hh, w]); x += w * 0.7; i++; }
  let s = '';
  for (const [px, py, w] of pts) { s += `<path d="M${R1(px - w)} ${y + 40} Q${R1(px - w * 0.3)} ${R1(py + (y - py) * 0.3)} ${R1(px)} ${R1(py)} Q${R1(px + w * 0.3)} ${R1(py + (y - py) * 0.35)} ${R1(px + w)} ${y + 40}Z" fill="${c}" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/><path d="M${R1(px)} ${R1(py)} q-10 ${R1((y - py) * 0.3)} -40 ${R1((y - py) * 0.55)}" stroke="${dk(c, 0.15)}" stroke-width="4" fill="none" opacity="0.7"/>`;
    if (snow) s += `<path d="M${R1(px - 34)} ${R1(py + 46)} L${R1(px)} ${R1(py)} L${R1(px + 36)} ${R1(py + 44)} L${R1(px + 16)} ${R1(py + 36)} L${R1(px + 2)} ${R1(py + 54)} L${R1(px - 14)} ${R1(py + 36)}Z" fill="#F6F6FA" stroke="${INK2}" stroke-width="3"/>`; }
  return s + `<rect y="${y + 38}" width="1920" height="${1080 - y}" fill="${c}"/>`;
}
// lớp cỏ tiền cảnh 2 bên (để trống giữa cho nhân vật/lối đi)
const wxGrassSides = (y0, c = '#6E8A4A', c2 = '#86A060', seed = 5, gapX = [560, 1360]) => vGrass(150, 0, y0, 1920, 1080 - y0, c, seed, { c2, skip: (x, y) => x > gapX[0] && x < gapX[1] && y < 1000 });

// ======================= CÁC BỐI CẢNH =======================
// 1. Chùa Thiên Long, Đại Lý: núi Thương Sơn, Tam Tháp trắng, sân lát đá, lư hương, đèn đá, cây trà hoa đỏ
function setDaiLy(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A9CBE0', c2: '#EAF0E4' });
  s += wxPeaks(520, '#9AAABE', 2, 1.1, true) + wxMist(500, 0.5) + wxPeaks(600, '#7E97A0', 5, 0.7) + farTrees(26, 610, '#5E7A5A', 4);
  s += wxPagoda(250, 700, 0.95, 11) + wxPagoda(1660, 700, 0.7, 9) + wxPagoda(1820, 700, 0.66, 9);
  s += wxPaving(700, '#D8CEB8');
  s += wxTempleFront(960, 700, 760, { name: o.name || 'THIÊN LONG TỰ', roof: '#3E4A44' });
  s += wxStoneLamp(560, 760, 0.8) + wxStoneLamp(1360, 760, 0.8) + wxCauldron(960, 830, 0.8);
  s += treeD(80, 860, 1.05, { c: '#4E7A4A' }) + treeD(1850, 870, 1.0, { c: '#4E7A4A' });
  for (let i = 0; i < 14; i++) s += `<circle cx="${R1([80, 1850][i % 2] + (hrnd(i, 8) - 0.5) * 200)}" cy="${R1(520 + hrnd(i, 9) * 160)}" r="7" fill="#D0402A" stroke="${INK2}" stroke-width="2"/>`;
  s += bushD(260, 900, 0.9, '#5E8A4A') + bushD(1640, 910, 0.8, '#5E8A4A') + vGrass(70, 0, 860, 420, 220, '#6E8A4A', 6, { c2: '#86A060' }) + vGrass(70, 1500, 860, 420, 220, '#6E8A4A', 7, { c2: '#86A060' });
  return s;
}
// 2. Thiếu Lâm Tự: núi Thiếu Thất xanh, rừng thông, sơn môn có biển, tường đỏ, sư tử đá, bậc đá
function setShaolin(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#B4CFDC', c2: '#EEF0E2' });
  s += wxPeaks(470, '#8FA88E', 11, 1.25) + wxMist(470, 0.55) + wxPeaks(560, '#6F8F6A', 13, 0.8);
  for (let i = 0; i < 16; i++) s += pineD(40 + i * 125 + hrnd(i, 3) * 40, 640 + hrnd(i, 4) * 20, 0.55 + hrnd(i, 5) * 0.2, '#3E5E44');
  // tường đỏ chạy ngang + ngói
  s += `<rect x="0" y="560" width="1920" height="150" fill="#B8463A" stroke="${INK2}" stroke-width="4"/><rect x="0" y="548" width="1920" height="22" fill="#3E4A44" stroke="${INK2}" stroke-width="4"/>` + Array.from({ length: 48 }, (_, i) => `<path d="M${i * 40} 552 q20 -12 40 0" stroke="${INK2}" stroke-width="2.5" fill="#4E5A54"/>`).join('');
  s += wxPaving(710, '#D2C8B2');
  s += wxTempleFront(960, 710, 640, { name: o.name || 'THIẾU LÂM TỰ', roof: '#3E4A44', wall: '#B8463A', h: 230 });
  s += wxLion(610, 800, 0.85) + wxLion(1310, 800, 0.85, true) + wxCauldron(960, 860, 0.75);
  s += pineD(120, 900, 1.2, '#3E5E44') + pineD(1800, 910, 1.25, '#3E5E44') + wxRock(330, 960, 0.9) + wxRock(1580, 980, 0.8);
  s += vGrass(80, 0, 880, 480, 200, '#5E7A4A', 8, { c2: '#7E9A5A' }) + vGrass(80, 1440, 880, 480, 200, '#5E7A4A', 9, { c2: '#7E9A5A' });
  return s;
}
// 3. Tổng đà Cái Bang: miếu hoang giữa rừng trúc, mái thủng, biển lệch, rơm, bát mẻ, đống lửa
function setBeggarHQ(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#C8D2C4', c2: '#ECE6D4', birds: false });
  s += wxPeaks(560, '#9AA894', 21, 0.7) + wxMist(560, 0.5);
  for (let i = 0; i < 18; i++) s += wxBamboo(30 + i * 110 + hrnd(i, 2) * 40, 720, 420 + hrnd(i, 3) * 200, 0.9, T, i % 2 ? '#7FA65A' : '#6E9450');
  s += `<rect y="700" width="1920" height="380" fill="#B8A07A"/><path d="M0 700 H1920" stroke="${INK2}" stroke-width="4"/>` + pebbles(50, 0, 720, 1920, 360, '#9A8462', 6);
  // miếu: tường đất loang, mái thủng, cột xiêu
  const x = 960, g = 720, w = 640, H = 230, top = g - H;
  s += `<path d="M${x - w / 2} ${g} V${top} H${x + w / 2} V${g}Z" fill="#A88A62" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${R1(x - w / 2 + 30 + hrnd(i, 4) * (w - 60))} ${R1(top + 30 + hrnd(i, 5) * (H - 60))} l20 6 l-6 14 l-22 -4Z" fill="${dk('#A88A62', 0.15)}" opacity="0.7"/>`;
  s += `<rect x="${x - 90}" y="${top + 50}" width="180" height="${H - 50}" fill="#3A2A20" stroke="${INK2}" stroke-width="4"/><path d="M${x - 90} ${top + 50} l40 ${H - 50}" stroke="#5A4030" stroke-width="6"/>`;
  s += `<rect x="${x - w / 2 + 40}" y="${top + 40}" width="110" height="80" fill="#E2D2A8" stroke="${INK2}" stroke-width="4"/><path d="M${x - w / 2 + 40} ${top + 40} l110 80 M${x - w / 2 + 150} ${top + 40} l-60 50" stroke="${INK2}" stroke-width="3"/><rect x="${x + w / 2 - 150}" y="${top + 40}" width="110" height="80" fill="#2A2018" stroke="${INK2}" stroke-width="4"/>`;
  for (const cx of [x - w / 2 + 10, x - 120, x + 120, x + w / 2 - 10]) s += `<rect x="${cx - 14}" y="${top}" width="28" height="${H}" fill="#7A4A30" stroke="${INK2}" stroke-width="4" transform="rotate(${R1((hrnd(cx, 2) - 0.5) * 4)} ${cx} ${g})"/>`;
  s += wxRoof(x, top - 6, w + 150, 120, { c: '#5A5048', tip: '#8A7A5A' });
  s += `<path d="M${x + 60} ${top - 90} l60 10 l30 50 l-50 20 l-40 -30Z" fill="#B8A07A" stroke="${INK2}" stroke-width="4"/><path d="M${x - 230} ${top - 50} l40 -6 l20 30 l-36 10Z" fill="#B8A07A" stroke="${INK2}" stroke-width="3.5"/>`;   // lỗ thủng mái
  s += `<g transform="rotate(-6 ${x} ${top - 60})"><rect x="${x - 170}" y="${top - 84}" width="340" height="56" rx="6" fill="#4A3A2A" stroke="#A88A42" stroke-width="5"/><text x="${x}" y="${top - 45}" font-family="${FH}" font-size="32" fill="#D8B860" text-anchor="middle">${o.name || 'TỔNG ĐÀ CÁI BANG'}</text></g>`;
  s += haystackD_(380, 790, 0.75) + haystackD_(1560, 800, 0.65);
  s += `<g transform="translate(1250 860)"><ellipse cx="0" cy="10" rx="80" ry="16" fill="#3A2A20"/>${chL('M-60 10 L50 -6 M-50 -4 L60 12', 10, '#6A4A30')}</g>` + flames(1250, 858, 0.45, T, 2) + smoke(1250, 790, 220, 0.4);
  s += `<g transform="translate(700 880)"><path d="M-40 0 Q-40 30 0 30 Q40 30 40 0Z" fill="#B8A890" stroke="${INK2}" stroke-width="4"/><path d="M20 0 l10 -12 l10 12" fill="#ECE6D4" stroke="${INK2}" stroke-width="2"/></g>`;
  s += vGrass(130, 0, 740, 1920, 340, '#7A8A4A', 10, { c2: '#94A060', skip: (x, y) => x > 600 && x < 1320 && y < 960 });
  return s;
}
const haystackD_ = (x, g, s = 1, c = '#D8B84A') => _g(x, g, s, `<path d="M-120 0 Q-130 -150 0 -190 Q130 -150 120 0Z" fill="${c}" stroke="${INK2}" stroke-width="5"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${R1(-100 + i * 13)} ${R1(-10 - hrnd(i, 7) * 20)} l${R1((hrnd(i, 8) - 0.5) * 16)} -40" stroke="${dk(c, 0.25)}" stroke-width="3"/>`).join('')}`);
// 4. Tử Cấm Thành: thềm đá trắng 3 tầng có lan can, điện mái vàng, tường đỏ, vạc đồng, cờ, quảng trường lát đá
function setForbidden(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A8C8E0', c2: '#F0EAD8', sun: [1650, 160, 60] });
  s += `<rect y="500" width="1920" height="140" fill="#A83A2E" stroke="${INK2}" stroke-width="4"/><rect y="486" width="1920" height="20" fill="#D8A82A" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) s += wxRoof(160 + i * 540, 500, 260, 60, { c: '#D8A82A', tip: '#A83A2E', lip: 10 });
  s += wxPaving(640, '#E4DCC8');
  // thềm 3 tầng có lan can
  for (let k = 0; k < 3; k++) { const y = 700 - k * 46, w = 1100 - k * 140; s += `<rect x="${960 - w / 2}" y="${y}" width="${w}" height="46" fill="#F2EEE4" stroke="${INK2}" stroke-width="4"/>`; for (let x = 960 - w / 2 + 10; x < 960 + w / 2; x += 34) s += `<path d="M${x} ${y} v-24" stroke="${INK2}" stroke-width="5"/><circle cx="${x}" cy="${y - 28}" r="6" fill="#F2EEE4" stroke="${INK2}" stroke-width="2.5"/>`; s += `<path d="M${960 - w / 2} ${y - 12} H${960 + w / 2}" stroke="${INK2}" stroke-width="3"/>`; }
  s += `<path d="M900 700 L870 830 H1050 L1020 700Z" fill="#E8E2D2" stroke="${INK2}" stroke-width="4"/><path d="M930 720 q30 20 60 0 q-30 30 -60 0Z M920 770 q40 24 80 0" stroke="#C9A227" stroke-width="4" fill="none"/>`;   // dốc rồng giữa bậc
  s += wxTempleFront(960, 562, 680, { name: o.name || 'THÁI HOÀ ĐIỆN', roof: '#D8A82A', tip: '#A83A2E', wall: '#B83A2E', col: '#A8322A', h: 200, two: true });
  s += wxCauldron(420, 820, 0.9) + wxCauldron(1500, 820, 0.9) + wxLion(250, 880, 0.9) + wxLion(1670, 880, 0.9, true);
  for (const x of [80, 1840]) { const a = Math.sin(T * 2 + x) * 6; s += `<path d="M${x} 1000 V560" stroke="#5A3A24" stroke-width="10"/><path d="M${x} 570 q${R1(70 + a)} 10 ${R1(130 + a)} -6 q-20 40 0 80 q${R1(-60 - a)} 10 ${R1(-130 - a)} 6Z" fill="#D8A82A" stroke="${INK2}" stroke-width="4" transform="scale(${x > 960 ? -1 : 1} 1) translate(${x > 960 ? -2 * x : 0} 0)"/>`; }
  return s;
}
// 5. Đào Hoa Đảo: biển, đảo xa, đình bát giác trên đá, rừng đào, cánh hoa bay, cỏ hoa
function setPeachIsland(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#A8CCE0', c2: '#F2EAE4', sun: [1500, 180, 64] });
  s += `<path d="M300 560 q80 -70 160 -10 q50 -40 110 10Z M1300 570 q60 -50 130 0Z" fill="#8AA4A8" stroke="${INK2}" stroke-width="3"/>`;
  s += seaBand(560, T, '#7FB0C4', '#5E92A8');
  s += `<path d="M0 700 Q300 650 700 690 Q1100 730 1500 680 Q1760 660 1920 690 V1080 H0Z" fill="#A8C08A" stroke="${INK2}" stroke-width="4"/><path d="M0 700 Q300 650 700 690 Q1100 730 1500 680 Q1760 660 1920 690" stroke="#E8DCB8" stroke-width="16" fill="none" opacity="0.8"/>`;
  // đình bát giác trên đá bên phải
  s += wxRock(1560, 700, 1.4, '#9A9284') + `<g>${[1480, 1560, 1640].map(x => `<rect x="${x - 10}" y="520" width="20" height="150" fill="#A8322A" stroke="${INK2}" stroke-width="4"/>`).join('')}<rect x="1440" y="660" width="240" height="16" fill="#CFC6B2" stroke="${INK2}" stroke-width="4"/><path d="M1460 610 H1660" stroke="#8A5A34" stroke-width="8"/></g>` + wxRoof(1560, 524, 300, 120, { c: '#4E6A5A', pearl: true });
  s += wxPeach(170, 820, 1.1, T) + wxPeach(1880, 860, 1.0, T) + wxPeach(560, 700, 0.6, T) + wxPeach(1260, 700, 0.55, T);
  s += wxRock(380, 900, 0.7) + vGrass(160, 0, 720, 1920, 360, '#6E8A4A', 12, { c2: '#86A060', skip: (x, y) => x > 620 && x < 1300 && y < 980 }) + flowers(40, 0, 760, 1920, 320, 13, ['#F5C2D2', '#FFF0F4', '#F2D16B']);
  s += wxPetals(26, T, 2);
  return s;
}
// 6. Nội thất điện/chùa (phối cảnh): kind 'phat' (tượng Phật + hoa sen) | 'dao' (Toàn Chân: tranh Tam Thanh + bát quái) | 'am' (am ni: Quan Âm)
function setTempleHall(t, o = {}) {
  const T = _T(t), kind = o.kind || 'phat', night = !!o.night;
  const R = { bx0: 330, bx1: 1590, by0: 120, by1: 690, wall: '#B8863E', wall2: '#A8763A', fc: '#8A6A4A', floor: 'tile', paper: false, wain: '#6B3E26', wainH: 120, beams: '#5A3A24', night };
  let s = room1p(R);
  // tường sau: ván gỗ đỏ + hoa văn mây
  s += `<rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 120}" fill="#8E3A2A"/><rect x="${R.bx0}" y="${R.by0}" width="${R.bx1 - R.bx0}" height="${R.by1 - R.by0 - 120}" fill="${pat('cloud', '#B8663A', null, 1.4)}" opacity="0.45"/>`;
  // bệ thờ + tượng
  const cx = 960;
  s += `<rect x="${cx - 260}" y="560" width="520" height="130" fill="#6B3E26" stroke="${INK2}" stroke-width="5"/><rect x="${cx - 280}" y="546" width="560" height="22" fill="#8A5A34" stroke="${INK2}" stroke-width="4"/>` + `<rect x="${cx - 240}" y="580" width="480" height="90" fill="${pat('thunder', '#C9A227', null, 0.8)}" opacity="0.5"/>`;
  if (kind === 'dao') {
    s += `<rect x="${cx - 200}" y="170" width="400" height="330" fill="#EFE2C0" stroke="${INK2}" stroke-width="6"/><rect x="${cx - 214}" y="160" width="428" height="16" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/><rect x="${cx - 214}" y="494" width="428" height="16" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/>`;
    for (const [dx, c] of [[-110, '#5A7A9A'], [0, '#B8463A'], [110, '#5A8A5A']]) s += `<circle cx="${cx + dx}" cy="290" r="34" fill="#F2D2B0" stroke="${INK2}" stroke-width="3"/><path d="M${cx + dx - 50} 460 Q${cx + dx - 50} 340 ${cx + dx} 330 Q${cx + dx + 50} 340 ${cx + dx + 50} 460Z" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><circle cx="${cx + dx}" cy="290" r="48" fill="none" stroke="#E4B83A" stroke-width="4"/>`;
    s += `<g transform="translate(${cx} 600)"><circle r="40" fill="#fff" stroke="${INK2}" stroke-width="4"/><path d="M0 -40 A40 40 0 0 1 0 40 A20 20 0 0 1 0 0 A20 20 0 0 0 0 -40Z" fill="${INK2}"/>${[...Array(8)].map((_, i) => `<path d="M-14 -56 h28" stroke="${INK2}" stroke-width="5" transform="rotate(${i * 45})"/>`).join('')}</g>`;
  } else {
    const gold = '#D8AE3A', robe = kind === 'am' ? '#F2EEE4' : gold;
    s += `<ellipse cx="${cx}" cy="300" rx="150" ry="170" fill="#FFE39A" opacity="0.35"/><circle cx="${cx}" cy="290" r="120" fill="none" stroke="${gold}" stroke-width="10" opacity="0.9"/>`;
    s += `<path d="M${cx - 170} 548 Q${cx - 190} 440 ${cx - 90} 400 Q${cx} 380 ${cx + 90} 400 Q${cx + 190} 440 ${cx + 170} 548Z" fill="${robe}" stroke="${INK2}" stroke-width="5"/><path d="M${cx - 120} 500 Q${cx} 470 ${cx + 120} 500" stroke="${dk(robe, 0.2)}" stroke-width="4" fill="none"/>`;
    s += `<circle cx="${cx}" cy="320" r="72" fill="${kind === 'am' ? '#F2D8C0' : gold}" stroke="${INK2}" stroke-width="5"/>${kind === 'am' ? `<path d="M${cx - 80} 330 Q${cx - 90} 230 ${cx} 230 Q${cx + 90} 230 ${cx + 80} 330 Q${cx + 70} 270 ${cx} 266 Q${cx - 70} 270 ${cx - 80} 330Z" fill="#F2EEE4" stroke="${INK2}" stroke-width="4"/>` : `<circle cx="${cx}" cy="250" r="26" fill="${gold}" stroke="${INK2}" stroke-width="4"/>${[...Array(12)].map((_, i) => `<circle cx="${R1(cx - 50 + (i % 6) * 20)}" cy="${R1(270 + Math.floor(i / 6) * 16)}" r="7" fill="${dk(gold, 0.15)}"/>`).join('')}`}<path d="M${cx - 24} 320 q10 6 20 0 M${cx + 4} 320 q10 6 20 0" stroke="${INK2}" stroke-width="3" fill="none"/><path d="M${cx - 10} 350 q10 6 20 0" stroke="${INK2}" stroke-width="3" fill="none"/>`;
    s += [...Array(8)].map((_, i) => `<ellipse cx="${cx - 140 + i * 40}" cy="546" rx="26" ry="14" fill="#E89AAE" stroke="${INK2}" stroke-width="3"/>`).join('');   // đài sen
  }
  // nến + hương trên bệ
  for (const dx of [-210, 210]) s += `<rect x="${cx + dx - 8}" y="500" width="16" height="46" fill="#F2EEE4" stroke="${INK2}" stroke-width="3"/><path d="M${cx + dx} 500 q-8 -14 0 -26 q8 12 0 26Z" fill="#FFB43A" stroke="${INK2}" stroke-width="2"/><ellipse cx="${cx + dx}" cy="486" rx="30" ry="30" fill="#FFD27A" opacity="0.25"/>`;
  s += `<rect x="${cx - 50}" y="520" width="100" height="26" fill="#8A7440" stroke="${INK2}" stroke-width="3"/>` + smoke(cx - 10, 520, 200, 0.45) + smoke(cx + 12, 520, 170, 0.35);
  // cột đỏ hai bên (phối cảnh: to dần ra ngoài)
  for (const [x, w] of [[380, 46], [250, 70], [80, 110]]) { s += columnD(x, 0, 1080, w, '#A8322A') + columnD(1920 - x, 0, 1080, w, '#A8322A'); }
  // đèn lồng treo
  s += wxLantern(560, 210, 1.0, '#C0392B', T) + wxLantern(1360, 210, 1.0, '#C0392B', T) + `<path d="M560 0 V150 M1360 0 V150" stroke="${INK2}" stroke-width="3"/>`;
  // bồ đoàn (đệm ngồi) + thảm
  s += rugD(960, 860, 900, 200, '#8E2A22', '#C9A227') + [-1, 1].map(k => `<ellipse cx="${960 + k * 150}" cy="780" rx="56" ry="18" fill="#C9A227" stroke="${INK2}" stroke-width="4"/>`).join('');
  s += motes(26, 500, 120, 920, 600, '#FFF1C8', 0.5, 2);
  if (night) s += `<defs><radialGradient id="wxNg" cx="0.5" cy="0.42" r="0.62"><stop offset="0" stop-color="#1A1A3A" stop-opacity="0.05"/><stop offset="1" stop-color="#0E0E26" stop-opacity="0.5"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#wxNg)"/>`;
  return s;
}
// 7. Tàng Kinh Các: phòng phối cảnh, kệ kinh cuộn ở tường sau và hai vách, thang gỗ, án thư, đèn dầu
function wxScrollShelf(x, y, w, h, rows = 4, seed = 1) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5A3420" stroke="${INK2}" stroke-width="5"/>`;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) { const yy = y + r * rh; s += `<rect x="${x + 8}" y="${R1(yy + 8)}" width="${w - 16}" height="${R1(rh - 16)}" fill="#3A2216"/>`;
    for (let i = 0; i * 34 + 20 < w - 16; i++) { const cx = x + 26 + i * 34, cy = yy + rh - 26, c = ['#E8D9B0', '#D8C49A', '#EFE2C0', '#C9B48A'][(i + r + seed) % 4]; s += `<circle cx="${cx}" cy="${R1(cy)}" r="15" fill="${c}" stroke="${INK2}" stroke-width="2.5"/><circle cx="${cx}" cy="${R1(cy)}" r="5" fill="${dk(c, 0.3)}"/>`; if (hrnd(i, r + seed) > 0.6) s += `<circle cx="${cx}" cy="${R1(cy - 28)}" r="13" fill="${c}" stroke="${INK2}" stroke-width="2.5"/>`; if (hrnd(i, r + seed + 9) > 0.8) s += `<path d="M${cx - 15} ${R1(cy - 6)} h30" stroke="#B8463A" stroke-width="4"/>`; }
    s += `<rect x="${x}" y="${R1(yy + rh - 8)}" width="${w}" height="12" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/>`; }
  return s;
}
function setLibraryWX(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 300, bx1: 1620, by0: 90, by1: 700, wall: '#8A6A4A', fc: '#7A5A3E', floor: 'wood', paper: false, wain: false, beams: '#4A2E1C' };
  let s = room1p(R);
  s += wxScrollShelf(330, 120, 380, 560, 5, 1) + wxScrollShelf(1210, 120, 380, 560, 5, 3);
  s += `<rect x="760" y="140" width="400" height="300" fill="#EFE2C0" stroke="${INK2}" stroke-width="6"/><rect x="746" y="130" width="428" height="16" fill="#5A3420" stroke="${INK2}" stroke-width="3"/>` + `<text x="960" y="270" font-family="${FH}" font-size="80" fill="#3A2A20" text-anchor="middle">藏經閣</text><text x="960" y="380" font-family="${FH}" font-size="40" fill="#6A5040" text-anchor="middle">TÀNG KINH CÁC</text>`;
  for (const [side, xA, xB] of [['L', 20, 260], ['R', 1660, 1900]]) { const q = wallQuad(R, side, xA, xB, 0.05, 0.98); s += _q(q, '#5A3420', 4); for (let k = 1; k < 6; k++) { const f = 0.05 + 0.93 * k / 6; const a = wallQuad(R, side, xA, xB, f, f); s += _ln(a[0][0], a[0][1], a[1][0], a[1][1], '#6B3E26', 10); for (let i = 0; i < 6; i++) { const u = (i + 0.5) / 6, px = a[0][0] + (a[1][0] - a[0][0]) * u, py = a[0][1] + (a[1][1] - a[0][1]) * u; s += `<circle cx="${R1(px)}" cy="${R1(py - 16)}" r="${R1(12 + (side === 'L' ? 1 - u : u) * 6)}" fill="#E8D9B0" stroke="${INK2}" stroke-width="2.5"/>`; } } }
  s += `<path d="M1180 700 L1250 180 M1250 700 L1320 180" stroke="#6B3E26" stroke-width="12"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${R1(1180 + 70 * (i + 1) / 9 * 0.135 * 7.4)} ${R1(700 - 520 * (i + 1) / 9)} h72" stroke="#6B3E26" stroke-width="9"/>`).join('');
  s += deskD(960, 840, 560, { top: '#6B3E26' }) + `<g transform="translate(900 700)"><rect x="-70" y="-14" width="140" height="18" rx="6" fill="#EFE2C0" stroke="${INK2}" stroke-width="3"/><circle cx="-70" cy="-5" r="12" fill="#C9B48A" stroke="${INK2}" stroke-width="2.5"/><circle cx="70" cy="-5" r="12" fill="#C9B48A" stroke="${INK2}" stroke-width="2.5"/></g>` + lampD(1110, 690, 0.8, 1, '#8A5A34');
  s += motes(30, 400, 150, 1100, 500, '#FFF1C8', 0.5, 4);
  return s;
}
// 8. Núi non: kind 'xanh' (Thiếu Thất), 'cat' (Tây Vực sa mạc), 'tuyet' (Hoa Sơn tuyết), 'ho' (hồ núi)
function setMountWX(t, o = {}) {
  const T = _T(t), k = o.kind || 'xanh';
  let s = '';
  if (k === 'cat') {
    s += wxSky(t, { c1: '#E8C88A', c2: '#F6EAD0', sun: [1500, 200, 90], sunC: '#FFE0A0', birds: false, id: 'wxSkC' });
    s += wxPeaks(560, '#D8B47A', 31, 0.8) + `<path d="M0 640 Q400 560 900 630 Q1400 690 1920 610 V1080 H0Z" fill="#E2C48A" stroke="${INK2}" stroke-width="4"/><path d="M0 760 Q500 690 1100 760 Q1500 800 1920 740 V1080 H0Z" fill="#D8B478" stroke="${INK2}" stroke-width="4"/>`;
    for (let i = 0; i < 16; i++) { const y = 680 + i * 26, x = hrnd(i, 3) * 1800; s += `<path d="M${R1(x)} ${y} q60 -10 120 0 q60 10 120 0" stroke="#C49A5E" stroke-width="3" fill="none" opacity="0.7"/>`; }
    s += wxRock(220, 900, 1.1, '#B89870') + wxRock(1700, 920, 0.9, '#B89870') + `<g transform="translate(1460 700)">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0 0 q${R1((i - 2.5) * 16)} -40 ${R1((i - 2.5) * 30)} -60" stroke="#8A7A4A" stroke-width="5" fill="none"/>`).join('')}</g>` + wxRock(1040, 690, 0.5, '#B89870') + `<g transform="translate(760 650)"><rect x="-40" y="-90" width="80" height="90" fill="#C8A878" stroke="${INK2}" stroke-width="4"/><path d="M-50 -90 L0 -130 L50 -90Z" fill="#A88858" stroke="${INK2}" stroke-width="4"/></g>`;
    s += `<g transform="translate(360 640) scale(0.7)"><path d="M-60 0 v-50 q0 -40 40 -40 q10 -40 40 -20 l40 -20 q20 0 20 20 q30 0 30 30 v80" fill="#C8A060" stroke="${INK2}" stroke-width="4"/><path d="M-50 0 v40 M-10 0 v40 M60 0 v40 M90 0 v40" stroke="${INK2}" stroke-width="10"/></g>`;   // lạc đà xa
    return s + `<rect width="1920" height="1080" fill="#FFD27A" opacity="0.06"/>`;
  }
  if (k === 'tuyet') {
    s += wxSky(t, { c1: '#C8D6E4', c2: '#F2F4F6', clouds: true, id: 'wxSkT' }) + wxPeaks(480, '#D8E2EC', 41, 1.3, true) + wxMist(460, 0.6, '#FFFFFF') + wxPeaks(600, '#B8C8D6', 43, 0.8, true);
    s += `<path d="M0 720 Q600 660 1200 720 Q1600 750 1920 700 V1080 H0Z" fill="#F4F6F8" stroke="${INK2}" stroke-width="4"/>`;
    for (let i = 0; i < 10; i++) s += pineD(80 + i * 190 + hrnd(i, 5) * 60, 700 + hrnd(i, 6) * 30, 0.55 + hrnd(i, 7) * 0.2, '#4E6E5A') + `<path d="M${R1(80 + i * 190 + hrnd(i, 5) * 60 - 40)} ${R1(660 + hrnd(i, 6) * 30)} q40 -20 80 0" stroke="#FFFFFF" stroke-width="8" fill="none"/>`;
    s += pineD(120, 980, 1.3, '#4E6E5A') + pineD(1820, 990, 1.25, '#4E6E5A') + wxRock(1500, 950, 1.0, '#A8B4C0');
    for (let i = 0; i < 70; i++) { const x = (hrnd(i, 2) * 1920 + T * 20) % 1920, y = (hrnd(i, 3) * 1080 + T * (40 + hrnd(i, 4) * 40)) % 1080; s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(2 + hrnd(i, 5) * 3)}" fill="#FFFFFF" opacity="0.85"/>`; }
    s += `<g transform="translate(1180 640)"><rect x="-10" y="-90" width="20" height="90" fill="#7A5A3E" stroke="${INK2}" stroke-width="3"/><rect x="-70" y="-110" width="140" height="44" fill="#EFE2C0" stroke="${INK2}" stroke-width="4"/><text y="-80" font-family="${FH}" font-size="26" fill="#3A2A20" text-anchor="middle">${o.sign || 'HOA SƠN'}</text></g>`;
    return s;
  }
  if (k === 'ho') {
    s += wxSky(t, { c1: '#A8C8DC', c2: '#ECF0E6', id: 'wxSkH' }) + wxPeaks(480, '#8EA6B8', 51, 1.2) + wxMist(470, 0.5) + wxPeaks(560, '#6E8E8A', 53, 0.7);
    s += `<rect y="590" width="1920" height="150" fill="#86B0C0"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${R1((i * 430 + T * 24) % 1920)} ${620 + i * 22} h80" stroke="#E8F2F6" stroke-width="4" opacity="0.8"/>`).join('') + `<path d="M0 590 H1920" stroke="${INK2}" stroke-width="3"/>`;
    s += `<path d="M0 720 Q500 690 1000 730 Q1500 760 1920 720 V1080 H0Z" fill="#9AB47A" stroke="${INK2}" stroke-width="4"/>` + pineD(140, 900, 1.2, '#3E5E44') + treeD(1780, 900, 1.0, { c: '#5E8A4A' }) + wxRock(1450, 880, 0.9) + vGrass(150, 0, 740, 1920, 340, '#5E7A4A', 14, { c2: '#7E9A5A', skip: (x, y) => x > 560 && x < 1360 && y < 980 }) + flowers(24, 0, 780, 1920, 300, 15);
    return s;
  }
  // xanh (Thiếu Thất)
  s += wxSky(t, { c1: '#AFCCDC', c2: '#EEF0E2', id: 'wxSkX' }) + wxPeaks(460, '#8FA88E', 61, 1.3) + wxMist(450, 0.55) + wxPeaks(560, '#6F8F6A', 63, 0.8) + wxMist(560, 0.4);
  for (let i = 0; i < 14; i++) s += pineD(60 + i * 140 + hrnd(i, 3) * 40, 660 + hrnd(i, 4) * 20, 0.5 + hrnd(i, 5) * 0.2, '#3E5E44');
  s += `<path d="M0 700 Q500 660 1000 700 Q1500 740 1920 690 V1080 H0Z" fill="#94AE78" stroke="${INK2}" stroke-width="4"/><path d="M820 1080 Q880 860 960 700 H1010 Q980 860 1060 1080Z" fill="#CDB88E" stroke="${INK2}" stroke-width="3"/>` + pebbles(30, 840, 720, 200, 340, '#A89A80', 6);
  s += pineD(110, 960, 1.3, '#3E5E44') + pineD(1810, 980, 1.3, '#3E5E44') + wxRock(360, 940, 0.9) + wxRock(1560, 960, 0.8);
  s += vGrass(160, 0, 720, 1920, 360, '#5E7A4A', 16, { c2: '#7E9A5A', skip: (x, y) => x > 760 && x < 1120 }) + flowers(20, 0, 760, 1920, 300, 17);
  if (o.sign) s += `<g transform="translate(1320 760)"><path d="M0 0 v-130" stroke="#5A3A24" stroke-width="12"/><rect x="-110" y="-180" width="220" height="60" rx="6" fill="#EFE2C0" stroke="${INK2}" stroke-width="4"/><text y="-138" font-family="${FH}" font-size="30" fill="#3A2A20" text-anchor="middle">${o.sign}</text></g>`;
  return s;
}
// 9. Làng / phố huyện: đường đất phối cảnh, nhà mái ngói hai bên, biển quán, đèn lồng, rào, cây, rơm
function wxHouse(x, g, w, h, o = {}) {
  const wall = o.wall || '#E8DCC0', roof = o.roof || '#5A5048';
  let s = `<rect x="${R1(x - w / 2)}" y="${R1(g - h)}" width="${w}" height="${h}" fill="${wall}" stroke="${INK2}" stroke-width="4"/><rect x="${R1(x - w / 2)}" y="${R1(g - 30)}" width="${w}" height="30" fill="${dk(wall, 0.15)}" stroke="${INK2}" stroke-width="3"/>`;
  s += `<rect x="${R1(x - w * 0.12)}" y="${R1(g - h * 0.72)}" width="${R1(w * 0.24)}" height="${R1(h * 0.72)}" fill="#6B3E26" stroke="${INK2}" stroke-width="4"/><rect x="${R1(x - w * 0.4)}" y="${R1(g - h * 0.7)}" width="${R1(w * 0.2)}" height="${R1(h * 0.34)}" fill="#E8D9B0" stroke="${INK2}" stroke-width="3"/>${[1, 2, 3].map(k => `<path d="M${R1(x - w * 0.4 + w * 0.2 * k / 4)} ${R1(g - h * 0.7)} v${R1(h * 0.34)}" stroke="#8A5A34" stroke-width="2.5"/>`).join('')}`;
  s += wxRoof(x, g - h + 4, w + 70, h * 0.55, { c: roof, tip: o.tip || '#7A6A5A', lip: 10 });
  if (o.sign) s += `<rect x="${R1(x + w * 0.18)}" y="${R1(g - h * 0.8)}" width="56" height="${R1(h * 0.6)}" fill="#2A2A30" stroke="#C9A227" stroke-width="3"/><text x="${R1(x + w * 0.18 + 28)}" y="${R1(g - h * 0.8 + 40)}" font-family="${FH}" font-size="26" fill="#E4B83A" text-anchor="middle" writing-mode="tb">${o.sign}</text>`;
  if (o.lantern) s += wxLantern(x + w * 0.42, g - h * 0.75, 0.6);
  return s;
}
function setVillageWX(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#B8D2E0', c2: '#EEEDE0', id: 'wxSkV' }) + wxPeaks(520, '#9AAEB8', 71, 0.9) + wxMist(510, 0.5) + rollingHills(600, '#A3BE8E', '#8EAC7C') + farTrees(22, 610, '#5E7A4A', 9);
  s += `<rect y="680" width="1920" height="400" fill="#A6BE86"/><path d="M0 680 H1920" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M560 1080 Q760 820 900 680 H1020 Q1160 820 1360 1080Z" fill="#D8C49A" stroke="${INK2}" stroke-width="3"/>` + pebbles(40, 640, 700, 640, 380, '#B8A47E', 4);
  s += wxHouse(560, 700, 260, 180, { sign: '酒', lantern: true }) + wxHouse(250, 740, 300, 210, { wall: '#E2D2B0' }) + wxHouse(1360, 700, 260, 180, { wall: '#DCCFB0', sign: '茶' }) + wxHouse(1680, 745, 320, 220, { lantern: true });
  s += fenceD(-20, 300, 860, 80) + fenceD(1640, 1940, 870, 80) + haystackD_(420, 880, 0.6) + treeD(80, 900, 1.0, { c: '#5E8A4A' }) + treeD(1850, 910, 0.95, { c: '#5E8A4A' });
  s += vGrass(170, 0, 700, 1920, 380, '#6E8A4A', 5, { c2: '#86A060', skip: (x, y) => x > 600 && x < 1320 }) + flowers(24, 0, 780, 1920, 300, 6);
  return s;
}
// 10. Khuê phòng Đông Phương Bất Bại (hồng): phòng phối cảnh, cửa sổ tròn nhìn vườn, rèm lụa, khung thêu, bàn trang điểm, bình hoa
function setBoudoir(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 320, bx1: 1600, by0: 110, by1: 700, wall: '#F2DCE4', wall2: '#E4BCCA', fc: '#8A5A6A', floor: 'wood', paper: 'damask', wain: '#9A5A6E', wainH: 150 };
  let s = room1p(R);
  s += `<circle cx="960" cy="360" r="170" fill="#BFE0D0" stroke="#6B3E26" stroke-width="16"/><circle cx="960" cy="360" r="170" fill="none" stroke="${INK2}" stroke-width="4"/>` + `<clipPath id="wxMoon"><circle cx="960" cy="360" r="162"/></clipPath><g clip-path="url(#wxMoon)">${wxPeaks(420, '#9AB8AC', 81, 0.6)}${wxPeach(880, 560, 0.5, T)}${wxPeach(1080, 560, 0.4, T)}</g>`;
  for (const k of [-1, 1]) { const x0 = 960 + k * 250, sw = Math.sin(T * 1.2 + k) * 8; s += `<path d="M${x0} 110 Q${x0 + k * 60 + sw} 400 ${x0 + k * 30} 700 L${x0 + k * 140} 700 Q${x0 + k * 140 + sw} 400 ${x0 + k * 120} 110Z" fill="#E86A8E" stroke="${INK2}" stroke-width="4" opacity="0.92"/><path d="M${x0 + k * 40} 130 Q${x0 + k * 70 + sw} 400 ${x0 + k * 60} 690" stroke="#C04A6E" stroke-width="4" fill="none"/>`; }
  s += `<path d="M640 100 Q960 170 1280 100 V140 Q960 210 640 140Z" fill="#E86A8E" stroke="${INK2}" stroke-width="4"/>`;
  s += `<g transform="translate(470 700)"><path d="M-110 0 L-90 -260 M110 0 L90 -260" stroke="#6B3E26" stroke-width="12"/><ellipse cx="0" cy="-170" rx="100" ry="90" fill="#FFF8F0" stroke="#6B3E26" stroke-width="10"/>${wxPeach(0, -110, 0.25, T)}<path d="M40 -150 l40 -60" stroke="#A8A8B0" stroke-width="3"/></g>`;   // khung thêu
  s += `<g transform="translate(1440 700)"><rect x="-120" y="-120" width="240" height="120" fill="#7A3A4A" stroke="${INK2}" stroke-width="5"/><ellipse cx="0" cy="-200" rx="70" ry="80" fill="#D8E2EA" stroke="#C9A227" stroke-width="10"/><path d="M-30 -230 q20 -10 40 10" stroke="#fff" stroke-width="6" fill="none"/><rect x="60" y="-160" width="34" height="40" rx="10" fill="#4E8AB0" stroke="${INK2}" stroke-width="3"/>${[0, 1, 2].map(i => `<circle cx="${70 + i * 10}" cy="-170" r="8" fill="#F2B6C8" stroke="${INK2}" stroke-width="2"/>`).join('')}</g>`;
  s += rugD(960, 880, 1000, 220, '#B8325E', '#F2D16B');
  return s;
}
// 11. Hang động: vòm đá nhiều lớp, thạch nhũ, cột sáng từ khe, vũng nước, giường đá — tối nhưng nhìn rõ
function setCaveWX(t, o = {}) {
  const T = _T(t);
  let s = `<rect width="1920" height="1080" fill="#4A4652"/>`;
  s += `<path d="M640 760 Q660 380 960 330 Q1260 380 1280 760Z" fill="#8A93A8"/><path d="M640 760 Q660 380 960 330 Q1260 380 1280 760Z" fill="#DCE6F0" opacity="${R1((0.5 + 0.1 * Math.sin(T)) * 100) / 100}"/>`;   // cửa hang sáng phía sau
  for (const [k, c] of [[1.0, '#5E5866'], [1.35, '#6A6474'], [1.8, '#57525F']]) s += `<path d="M0 0 H1920 V1080 H${R1(960 + 330 * k)} Q${R1(960 + 340 * k)} ${R1(560 - 230 * k)} 960 ${R1(470 - 160 * k)} Q${R1(960 - 340 * k)} ${R1(560 - 230 * k)} ${R1(960 - 330 * k)} 1080 H0Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 22; i++) { const x = 80 + i * 84 + hrnd(i, 2) * 30, L = 40 + hrnd(i, 3) * 120, y0 = 40 + Math.abs(x - 960) * 0.08; s += `<path d="M${R1(x - 18)} ${R1(y0)} L${R1(x)} ${R1(y0 + L)} L${R1(x + 18)} ${R1(y0)}Z" fill="#7A7484" stroke="${INK2}" stroke-width="3"/>`; }
  for (let i = 0; i < 18; i++) { const x = hrnd(i, 4) * 1920, y = 120 + hrnd(i, 5) * 800; if (Math.abs(x - 960) < 360) continue; s += `<path d="M${R1(x)} ${R1(y)} q30 -16 60 0 M${R1(x + 10)} ${R1(y + 20)} q20 -8 40 4" stroke="#8A8494" stroke-width="3" fill="none" opacity="0.8"/>`; }
  s += `<path d="M0 820 Q480 760 960 790 Q1440 770 1920 820 V1080 H0Z" fill="#6E6878" stroke="${INK2}" stroke-width="4"/>` + pebbles(40, 0, 830, 1920, 250, '#8A8494', 9);
  s += `<ellipse cx="1300" cy="900" rx="220" ry="40" fill="#5E86A8" stroke="${INK2}" stroke-width="4"/><ellipse cx="1300" cy="896" rx="140" ry="18" fill="#9CC0DA" opacity="0.6"/>`;
  s += `<path d="M380 860 L400 800 H660 L680 860Z" fill="#8A8494" stroke="${INK2}" stroke-width="4"/><rect x="380" y="860" width="300" height="40" fill="#7A7484" stroke="${INK2}" stroke-width="4"/>`;   // giường đá
  s += `<path d="M900 0 L760 1080 H1160 L1020 0Z" fill="#FFF4D6" opacity="${R1((0.16 + 0.04 * Math.sin(T * 0.8)) * 100) / 100}"/>` + motes(30, 760, 100, 400, 800, '#FFF1C8', 0.6, 3);
  return s;
}
// 12. Rừng đêm trăng (Mai Siêu Phong): trời tím xanh, trăng tròn lớn, cây khô, sương, đá, xương — tối nhưng nhìn rõ
function wxDeadTree(x, g, s = 1, c = '#3A3046') { return _g(x, g, s, `<path d="M-20 0 Q-10 -150 -30 -260 Q-60 -330 -120 -360 M-24 -200 Q20 -260 90 -290 M-30 -270 Q-20 -330 10 -380 M60 -276 l40 -30 M-80 -340 l-40 -6" stroke="${INK2}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M-20 0 Q-10 -150 -30 -260 Q-60 -330 -120 -360 M-24 -200 Q20 -260 90 -290 M-30 -270 Q-20 -330 10 -380 M60 -276 l40 -30 M-80 -340 l-40 -6" stroke="${c}" stroke-width="24" fill="none" stroke-linecap="round"/>`); }
function setNightWood(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('wxNW', '#2E2A52', '#5A4E78') + starsD(70, 560, 11);
  s += `<circle cx="1460" cy="260" r="210" fill="#FFF2C8" opacity="0.14"/><circle cx="1460" cy="260" r="130" fill="#FFF2C8" stroke="${INK2}" stroke-width="4"/><circle cx="1420" cy="240" r="22" fill="#EADBB0" opacity="0.8"/><circle cx="1500" cy="300" r="14" fill="#EADBB0" opacity="0.8"/>`;
  s += cloudsDrift([[300, 200, 1.0, '#6A6090'], [1100, 140, 1.2, '#6A6090']], 6);
  s += wxPeaks(640, '#40385E', 91, 0.9) + wxMist(640, 0.3, '#B8B0D8', T);
  s += `<path d="M0 760 Q600 720 1200 770 Q1600 790 1920 750 V1080 H0Z" fill="#3E3650" stroke="${INK2}" stroke-width="4"/>`;
  s += wxDeadTree(160, 840, 1.1) + wxDeadTree(1780, 860, 1.0, '#3A3046') + wxDeadTree(560, 760, 0.6, '#463C58') + wxDeadTree(1300, 760, 0.55, '#463C58');
  s += wxRock(420, 960, 0.9, '#5A5070') + wxRock(1560, 980, 0.8, '#5A5070') + vGrass(120, 0, 780, 1920, 300, '#5A5478', 18, { c2: '#6A6488', skip: (x, y) => x > 600 && x < 1320 && y < 980 });
  s += wxMist(900, 0.22, '#C8C0E8', T) + `<rect width="1920" height="1080" fill="#B8A8FF" opacity="0.05"/>`;
  return s;
}
// 13. Phòng khách nhà Việt thập niên 90 (người dẫn xem tivi): gạch bông, tủ gỗ, tivi đời cũ, lịch treo tường, quạt trần, cửa sổ song sắt
function setLiving90(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 300, bx1: 1620, by0: 110, by1: 700, wall: '#EAD9A8', wall2: '#DCC890', fc: '#C8B898', floor: 'tile', paper: false, wain: false };
  let s = room1p(R);
  // gạch bông: hoa văn trên sàn
  s += `<rect x="0" y="700" width="1920" height="380" fill="${pat('diamond', '#9A6A4A', null, 2.2)}" opacity="0.35"/>`;
  // cửa sổ song sắt + cánh xanh
  s += `<rect x="420" y="230" width="300" height="260" fill="#BFD8E2" stroke="${INK2}" stroke-width="6"/>${[1, 2, 3, 4, 5].map(i => `<path d="M${420 + i * 50} 230 v260" stroke="#4A4A50" stroke-width="5"/>`).join('')}<rect x="340" y="230" width="80" height="260" fill="#4E8A6A" stroke="${INK2}" stroke-width="4"/><rect x="720" y="230" width="80" height="260" fill="#4E8A6A" stroke="${INK2}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M350 ${250 + i * 40} h60 M730 ${250 + i * 40} h60" stroke="#2E5A44" stroke-width="5"/>`).join('')}`;
  // lịch treo + đồng hồ
  s += `<rect x="1300" y="220" width="160" height="210" fill="#F6F0E2" stroke="${INK2}" stroke-width="4"/><rect x="1300" y="220" width="160" height="60" fill="#C0392B" stroke="${INK2}" stroke-width="4"/><text x="1380" y="380" font-family="${FH}" font-size="92" fill="#C0392B" text-anchor="middle">20</text>` + `<g transform="translate(1100 240)"><circle r="56" fill="#F6F0E2" stroke="#6B3E26" stroke-width="10"/><path d="M0 0 V-34 M0 0 L22 10" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/></g>`;
  // quạt trần
  const a = (T * 400) % 360; s += `<path d="M960 0 V70" stroke="${INK2}" stroke-width="6"/><g transform="translate(960 80)"><ellipse rx="26" ry="12" fill="#6A6A70" stroke="${INK2}" stroke-width="3"/>${[0, 120, 240].map(k => `<ellipse cx="${R1(Math.cos((a + k) * 0.01745) * 110)}" cy="${R1(Math.sin((a + k) * 0.01745) * 14)}" rx="${R1(Math.abs(Math.cos((a + k) * 0.01745)) * 90 + 10)}" ry="8" fill="#8A7A6A" stroke="${INK2}" stroke-width="2.5"/>`).join('')}</g>`;
  // tủ gỗ kê tivi (tivi vẽ riêng ở cảnh), bình thuỷ + ấm chén trên bàn
  s += `<rect x="760" y="560" width="400" height="150" fill="#7A4A2E" stroke="${INK2}" stroke-width="5"/><rect x="780" y="580" width="170" height="110" fill="#8A5A3A" stroke="${INK2}" stroke-width="3"/><rect x="970" y="580" width="170" height="110" fill="#8A5A3A" stroke="${INK2}" stroke-width="3"/><circle cx="935" cy="635" r="7" fill="#C9A227"/><circle cx="985" cy="635" r="7" fill="#C9A227"/>`;
  s += `<g transform="translate(1500 860)"><rect x="-160" y="-20" width="320" height="24" fill="#7A4A2E" stroke="${INK2}" stroke-width="4"/><path d="M-140 4 V120 M140 4 V120" stroke="#5A3420" stroke-width="12"/><rect x="-120" y="-110" width="44" height="90" rx="14" fill="#C0392B" stroke="${INK2}" stroke-width="4"/><ellipse cx="20" cy="-46" rx="44" ry="30" fill="#F2EEE4" stroke="${INK2}" stroke-width="4"/><path d="M60 -56 q20 -6 26 -24" stroke="${INK2}" stroke-width="5" fill="none"/>${[0, 1].map(i => `<path d="M${90 + i * 34} -30 h24 l-4 22 h-16Z" fill="#F2EEE4" stroke="${INK2}" stroke-width="3"/>`).join('')}</g>`;
  s += plantD(330, 900, 1.0);
  return s;
}
// 14. Thư phòng của người dẫn (nền cho cảnh người dẫn giải thích): phối cảnh, tranh sơn thuỷ, kệ sách, án thư, đèn — dịu để chữ/thẻ đọc rõ
function setStudy(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 300, bx1: 1620, by0: 100, by1: 720, wall: '#E8DCC0', wall2: '#D8C8A4', fc: '#A9784E', floor: 'wood', paper: 'damask', wain: '#7A5234', wainH: 160 };
  let s = room1p(R);
  s += `<rect x="406" y="160" width="328" height="16" fill="#5A3420" stroke="${INK2}" stroke-width="3"/><rect x="406" y="564" width="328" height="16" fill="#5A3420" stroke="${INK2}" stroke-width="3"/>`;
  s += `<clipPath id="wxStd"><rect x="430" y="180" width="280" height="380"/></clipPath><g clip-path="url(#wxStd)"><rect x="430" y="180" width="280" height="380" fill="#F4ECD8"/>${[[500, 420, 110], [600, 380, 150], [660, 450, 90]].map(([x, y, h]) => `<path d="M${x - 60} 560 Q${x - 20} ${y - h * 0.3} ${x} ${y - h} Q${x + 24} ${y - h * 0.3} ${x + 60} 560Z" fill="#9AA89A" stroke="#4A4A44" stroke-width="3"/>`).join('')}<path d="M440 470 q120 -20 260 0" stroke="#C8CCC4" stroke-width="18" opacity="0.8"/><circle cx="640" cy="230" r="20" fill="#C0392B" opacity="0.8"/></g>`;
  s += wxScrollShelf(1200, 180, 360, 520, 4, 5) + deskD(960, 900, 520, { top: '#5A3420' }) + `<g transform="translate(900 760)"><rect x="-40" y="-10" width="80" height="12" fill="#2A2A30"/><path d="M60 -40 L100 0" stroke="#6B3E26" stroke-width="6"/></g>` + lampD(1120, 750, 0.8, 1, '#8A5A34') + plantD(200, 1000, 0.9);
  return s + `<rect width="1920" height="1080" fill="#F4ECD8" opacity="${o.fade ?? 0.28}"/>`;
}
// 15. Ngục đá dưới đáy Tây Hồ (Nhậm Ngã Hành): phòng phối cảnh tường đá, song sắt, xích, đuốc — tối nhưng nhìn rõ
function setDungeon(t, o = {}) {
  const T = _T(t);
  const R = { bx0: 340, bx1: 1580, by0: 120, by1: 720, wall: '#6E6A70', fc: '#5A5660', floor: 'tile', paper: false, wain: false, night: true };
  let s = room1p(R);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 14; c++) { const x = R.bx0 + c * 90 + (r % 2) * 45, y = R.by0 + r * 50; if (x + 86 > R.bx1) continue; s += `<rect x="${x}" y="${y}" width="86" height="46" rx="6" fill="${['#76727A', '#6A6670', '#7E7A82'][(r + c) % 3]}" stroke="#3A363E" stroke-width="2.5"/>`; }
  s += `<rect x="760" y="300" width="400" height="420" fill="#2A2630" stroke="${INK2}" stroke-width="5"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${780 + i * 45} 300 V720" stroke="#4A4650" stroke-width="10"/><path d="M${780 + i * 45} 300 V720" stroke="#8A8690" stroke-width="3"/>`).join('') + `<path d="M760 420 H1160 M760 600 H1160" stroke="#4A4650" stroke-width="10"/>`;
  for (const x of [520, 1400]) { const f = 0.85 + 0.15 * Math.sin(T * 9 + x); s += `<ellipse cx="${x}" cy="300" rx="${R1(160 * f)}" ry="${R1(140 * f)}" fill="#FFB45A" opacity="0.18"/><rect x="${x - 10}" y="300" width="20" height="70" fill="#5A3A24" stroke="${INK2}" stroke-width="3"/>` + flames(x, 300, 0.35, T, x); }
  s += `<path d="M560 720 Q600 840 700 860 M1360 720 Q1320 840 1220 870" stroke="#5A5660" stroke-width="12" fill="none" stroke-dasharray="16 6"/><path d="M560 720 Q600 840 700 860 M1360 720 Q1320 840 1220 870" stroke="#9A96A0" stroke-width="5" fill="none" stroke-dasharray="16 6"/>`;
  s += `<ellipse cx="960" cy="960" rx="420" ry="60" fill="#5A86A8" opacity="0.35"/>`;   // nước rỉ đọng
  return s;
}
// 16. Võ Đang: núi mây nhiều lớp, đạo quán mái ngói xanh rêu, sân đá có đồ hình Thái Cực khắc giữa sân, thông, bậc đá
function setWudang(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#B8CCD8', c2: '#EEF0E6', id: 'wxSkW' }) + wxPeaks(430, '#9AAEB2', 111, 1.35) + wxMist(420, 0.6) + wxPeaks(520, '#7E9A92', 113, 0.9) + wxMist(520, 0.5);
  for (let i = 0; i < 12; i++) s += pineD(60 + i * 165 + hrnd(i, 3) * 50, 620 + hrnd(i, 4) * 20, 0.5 + hrnd(i, 5) * 0.2, '#3E5E50');
  s += wxPaving(680, '#D6D0C0');
  // đồ hình Thái Cực khắc giữa sân (phối cảnh: elip dẹt)
  s += `<g transform="translate(960 860) scale(1 0.32)"><circle r="300" fill="#E8E2D2" stroke="${INK2}" stroke-width="10"/><path d="M0 -280 A280 280 0 0 1 0 280 A140 140 0 0 1 0 0 A140 140 0 0 0 0 -280Z" fill="#5A5650"/><circle cy="-140" r="40" fill="#E8E2D2"/><circle cy="140" r="40" fill="#5A5650"/>${[...Array(8)].map((_, i) => `<path d="M-60 -330 h120" stroke="${INK2}" stroke-width="16" transform="rotate(${i * 45})"/>`).join('')}</g>`;
  s += wxTempleFront(960, 680, 640, { name: o.name || 'VÕ ĐANG SƠN', roof: '#3E6A5A', wall: '#C8B89A', col: '#8A5A3A', h: 210, tip: '#C9A24A' });
  s += wxCauldron(560, 760, 0.7) + wxStoneLamp(1380, 760, 0.75);
  s += pineD(110, 960, 1.35, '#3E5E50') + pineD(1820, 980, 1.3, '#3E5E50') + wxRock(320, 990, 0.8);
  s += vGrass(90, 0, 900, 460, 180, '#5E7A4A', 21, { c2: '#7E9A5A' }) + vGrass(90, 1460, 900, 460, 180, '#5E7A4A', 22, { c2: '#7E9A5A' });
  return s;
}
// 17. Thung lũng kín (Trương Vô Kỵ gặp vượn): vách đá hai bên, thác nước, suối, cây trái, hoa cỏ
function setValley(t, o = {}) {
  const T = _T(t), cold = o.cold || 0;
  let s = wxSky(t, { c1: '#A8CCDC', c2: '#EEF2E6', id: 'wxSkVa', birds: !cold });
  s += wxPeaks(420, '#8AA2A8', 121, 1.1) + wxMist(420, 0.55);
  // vách đá 2 bên
  const cliffL = [[0, 0], [470, 0], [430, 110], [520, 230], [450, 380], [560, 520], [480, 690], [600, 860], [580, 1080], [0, 1080]], cliffR = [[1920, 0], [1430, 0], [1490, 140], [1400, 280], [1480, 430], [1380, 600], [1460, 760], [1320, 920], [1340, 1080], [1920, 1080]];
  for (const P of [cliffL, cliffR]) { const L = P === cliffL; s += _q(P, '#8A8478', 5); for (let i = 1; i < P.length - 2; i++) s += _ln(P[i][0], P[i][1], P[i][0] + (L ? -140 : 140), P[i][1] + 60, '#6E685E', 5) + _ln(P[i][0] + (L ? -40 : 40), P[i][1] + 30, P[i][0] + (L ? -260 : 260), P[i][1] + 40, '#9A9488', 3);
    s += bushD(L ? 330 : 1590, 300, 0.7, '#5E8A4A') + bushD(L ? 380 : 1560, 680, 0.8, '#5E8A4A') + pineD(L ? 200 : 1720, 470, 0.5, '#4E6E50'); }
  // thác nước giữa xa + hồ
  s += `<path d="M900 300 Q910 450 880 600 H1040 Q1010 450 1020 300Z" fill="#CFE6F2" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${910 + i * 24} ${R1(300 + ((T * 160 + i * 60) % 300))} v40" stroke="#FFFFFF" stroke-width="5" opacity="0.8"/>`).join('');
  s += `<ellipse cx="960" cy="640" rx="320" ry="50" fill="#86B8CC" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<ellipse cx="960" cy="640" rx="${R1(120 + ((T * 40 + i * 70) % 200))}" ry="${R1(20 + ((T * 40 + i * 70) % 200) * 0.15)}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.6"/>`).join('');
  s += `<path d="M560 1080 Q760 820 900 660 H1020 Q1160 820 1360 1080Z" fill="#A6C08A" stroke="${INK2}" stroke-width="4"/><path d="M900 680 Q880 820 760 1080 H880 Q960 820 1000 680Z" fill="#86B8CC" stroke="${INK2}" stroke-width="3"/>`;
  s += treeD(640, 840, 0.8, { c: '#5E8A4A' }) + treeD(1290, 860, 0.85, { c: '#5E8A4A' });
  for (let i = 0; i < 12; i++) s += `<circle cx="${R1([640, 1290][i % 2] + (hrnd(i, 9) - 0.5) * 160)}" cy="${R1(560 + hrnd(i, 10) * 140)}" r="9" fill="#E8A030" stroke="${INK2}" stroke-width="2"/>`;   // quả chín
  s += vGrass(120, 520, 700, 880, 380, '#5E7A4A', 23, { c2: '#7E9A5A', skip: (x, y) => x > 760 && x < 1000 }) + flowers(20, 560, 760, 800, 300, 24);
  if (cold) s += `<rect width="1920" height="1080" fill="#BFDCF2" opacity="${f1(0.35 * cold)}"/>` + [...Array(50)].map((_, i) => `<circle cx="${R1((hrnd(i, 2) * 1920 + T * 30) % 1920)}" cy="${R1((hrnd(i, 3) * 1080 + T * 60) % 1080)}" r="${R1(2 + hrnd(i, 4) * 3)}" fill="#FFFFFF" opacity="${f1(0.8 * cold)}"/>`).join('');
  return s;
}
// 18. Công viên buổi sáng (thời nay): cây, lối đi lát gạch, ghế đá, đèn, nắng sớm
function setPark(t, o = {}) {
  const T = _T(t);
  let s = wxSky(t, { c1: '#BFDCE8', c2: '#FFF0D8', sun: [1580, 220, 70], sunC: '#FFE0A0', id: 'wxSkP' }) + farTrees(30, 560, '#6E9A5A', 31) + `<path d="M0 600 H1920" stroke="${INK2}" stroke-width="3"/>`;
  s += `<rect y="600" width="1920" height="480" fill="#A6C88A"/>` + `<path d="M0 760 Q960 700 1920 770 V900 Q960 840 0 900Z" fill="#D8CCB8" stroke="${INK2}" stroke-width="3"/>`;
  for (let i = 0; i < 24; i++) s += `<path d="M${i * 80} ${R1(780 - Math.sin(i / 24 * Math.PI) * 50)} l20 ${R1(110)}" stroke="#C0B49E" stroke-width="3"/>`;
  s += treeD(140, 760, 1.15, { c: '#5E8A4A' }) + treeD(1780, 760, 1.1, { c: '#5E8A4A' }) + treeD(760, 640, 0.6, { c: '#6E9A5A' }) + treeD(1240, 640, 0.55, { c: '#6E9A5A' });
  s += `<g transform="translate(470 720)"><rect x="-90" y="-36" width="180" height="22" fill="#B8B0A0" stroke="${INK2}" stroke-width="4"/><rect x="-80" y="-14" width="20" height="40" fill="#A8A090" stroke="${INK2}" stroke-width="3"/><rect x="60" y="-14" width="20" height="40" fill="#A8A090" stroke="${INK2}" stroke-width="3"/></g>`;
  s += streetLampD(1500, 740, 0.7, 0) + vGrass(140, 0, 900, 1920, 180, '#5E8A4A', 25, { c2: '#7EAA5A' }) + flowers(24, 0, 920, 1920, 160, 26) + birds(160, 1);
  return s + `<rect width="1920" height="1080" fill="#FFE8B0" opacity="0.08"/>`;
}

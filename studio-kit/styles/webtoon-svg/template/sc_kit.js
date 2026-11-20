// CHÉP từ tập xep-hang-vo-cong (2026-10-13) — đồ nghề dùng chung, không sửa ở đây trừ khi cần.
// TẬP xep-hang-vo-cong — BỘ KHUÔN CẢNH CHUNG (kế hoạch cảnh build/scene-plan.md, duyệt 2026-10-11).
// Nhân vật = pack webtoon-code-v1 (chChar, sungChar), hiệu ứng = fx.js + glow.js, nền/chữ = chibi-v1.
// Luật: ô hạng KHÔNG gắn hiệu ứng (người dùng: "nhìn kiểu AI lắm") — vào ô S chỉ đóng dấu nặng + rung khung.
const EPISODE_SCENES = {};
const AT = (ctx, w) => ctx.at(w);
const FIN = (t, t0, d = 0.35) => clamp((t - t0) / d);
const K_P1 = '#F3E9D2', K_P2 = '#E6D6B4', K_RED = '#A8322A', K_GOLD = '#C99A3E';
const K_DEFS = `<defs><filter id="kJade" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.25 0.3 0.15 0 0.32  0.25 0.4 0.15 0 0.42  0.2 0.3 0.15 0 0.36  0 0 0 1 0"/></filter></defs>`;   // tượng ngọc
const kFin = (body) => chibiDefs() + glowDefs() + RG_DEFS() + K_DEFS + body + paper({ blotch: 0.25, grain: 0.3 });
const kPop = (t, t0, d = 0.25) => t < t0 ? 0 : EZ.backOut(clamp((t - t0) / d));
const kText = (s, x, y, size, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" font-family="${o.font || FH}" font-size="${size}" fill="${o.c || INK2}" text-anchor="${o.anchor || 'middle'}"${o.op != null ? ` opacity="${f1(o.op)}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 8}" paint-order="stroke"` : ''}>${s}</text>`;

// ======================= DỮ LIỆU 16 MÔN (bỏ Sư Tử Hống, Càn Khôn — người dùng 2026-10-11) =======================
const K_MON = [
  ['Lục Mạch Thần Kiếm', 'Lục Mạch', 'A', 'Thiên Long Bát Bộ', '#2E6FA8', '#E8F2FA'],
  ['Dịch Cân Kinh', 'Dịch Cân', 'A', 'Thiếu Lâm', '#C99A3E', '#FBF1DA'],
  ['Đả Cẩu Bổng Pháp', 'Đả Cẩu', 'B', 'Xạ Điêu Anh Hùng', '#4E9A62', '#E6F4E8'],
  ['Quỳ Hoa Bảo Điển', 'Quỳ Hoa', 'A', 'Tiếu Ngạo Giang Hồ', '#C2457A', '#FBE8F0'],
  ['Thần Hành Bách Biến', 'Thần Hành', 'D', 'Lộc Đỉnh Ký', '#8A7A62', '#EFE7D6'],
  ['Cáp Mô Công', 'Cáp Mô', 'B', 'Xạ Điêu Anh Hùng', '#6E8A3A', '#EEF2DC'],
  ['Nhất Dương Chỉ', 'Nhất Dương', 'B', 'Xạ Điêu Anh Hùng', '#D9822B', '#FCEEDC'],
  ['Cửu Âm Bạch Cốt Trảo', 'Bạch Cốt', 'D', 'Xạ Điêu Anh Hùng', '#6A4A8A', '#EEE6F4'],
  ['Bắc Minh Thần Công', 'Bắc Minh', 'S', 'Thiên Long Bát Bộ', '#2A7F8A', '#E2F2F2'],
  ['Thất Thương Quyền', 'Thất Thương', 'C', 'Ỷ Thiên Đồ Long Ký', '#A8322A', '#F6E2DE'],
  ['Ảm Nhiên Tiêu Hồn Chưởng', 'Ảm Nhiên', 'B', 'Thần Điêu Đại Hiệp', '#5A6E86', '#E6ECF2'],
  ['Thái Cực Quyền, Thái Cực Kiếm', 'Thái Cực', 'A', 'Ỷ Thiên Đồ Long Ký', '#2A2A2A', '#F2F2EE'],
  ['Cửu Dương Thần Công', 'Cửu Dương', 'S', 'Ỷ Thiên Đồ Long Ký', '#D0402A', '#FBE6DE'],
  ['Cửu Âm Chân Kinh', 'Cửu Âm', 'A', 'Xạ Điêu Anh Hùng', '#5A6A8E', '#E8ECF4'],
  ['Độc Cô Cửu Kiếm', 'Độc Cô', 'S', 'Tiếu Ngạo Giang Hồ', '#4A4A6A', '#ECECF2'],
  ['Hàng Long Thập Bát Chưởng', 'Hàng Long', 'S', 'Xạ Điêu · Thiên Long', '#C99A1E', '#FBF0D0'],
].map(([n, s, tier, book, ring, bg], i) => ({ i, n, s, tier, book, ring, bg }));
const K_TIERS = [['S', '#C0392B'], ['A', '#D9822B'], ['B', '#C9A227'], ['C', '#5E9A4F'], ['D', '#4A77A8']];
const K_TI = { S: 0, A: 1, B: 2, C: 3, D: 4 };

// ---------- biểu tượng huy hiệu (môn nào chưa vẽ biểu tượng thì hiện chữ tắt) ----------
const K_ICON = {
  0: (r) => { // bàn tay + 6 tia
    let s = ''; for (let i = 0; i < 6; i++) { const a = (-70 + i * 28) * Math.PI / 180; s += `<path d="M${f1(Math.cos(a) * r * 0.25)} ${f1(Math.sin(a) * r * 0.25 + r * 0.15)} L${f1(Math.cos(a) * r * 0.8)} ${f1(Math.sin(a) * r * 0.8 + r * 0.15)}" stroke="#7FC8FF" stroke-width="${f1(r * 0.09)}" stroke-linecap="round"/>`; }
    return s + `<circle cx="0" cy="${f1(r * 0.2)}" r="${f1(r * 0.22)}" fill="#F7DEC8" stroke="${INK2}" stroke-width="3"/>`; },
  1: (r) => `<g transform="scale(${f1(r / 100)})"><rect x="-44" y="-56" width="88" height="112" rx="6" fill="#D9A44A" stroke="${INK2}" stroke-width="7"/><rect x="-22" y="-36" width="44" height="30" fill="#FFF4D6" stroke="${INK2}" stroke-width="4"/>${chL('M-30 20 h60 M-30 36 h60', 5, '#8A5A1E')}</g>`,   // kinh vàng
  2: (r) => `<g transform="scale(${f1(r / 100)}) rotate(-40)"><rect x="-80" y="-11" width="160" height="22" rx="10" fill="#7CC48A" stroke="${INK2}" stroke-width="6"/>${chL('M-40 -11 V11 M0 -11 V11 M40 -11 V11', 4, '#3E7A4E')}</g>`,   // gậy trúc biếc
  4: (r) => `<g transform="scale(${f1(r / 100)})">${chL('M-60 -30 h70 M-80 0 h90 M-60 30 h70', 8, '#8A7A62')}${chL('M30 -50 L10 0 L40 0 L20 50', 10, '#C9A24A')}</g>`,   // gió + chớp (chạy)
  5: (r) => `<g transform="scale(${f1(r / 100)})"><ellipse cx="0" cy="16" rx="66" ry="44" fill="#8FB04A" stroke="${INK2}" stroke-width="6"/><circle cx="-30" cy="-30" r="18" fill="#8FB04A" stroke="${INK2}" stroke-width="5"/><circle cx="30" cy="-30" r="18" fill="#8FB04A" stroke="${INK2}" stroke-width="5"/><circle cx="-30" cy="-32" r="7" fill="${INK2}"/><circle cx="30" cy="-32" r="7" fill="${INK2}"/>${chL('M-26 16 Q0 30 26 16', 5)}</g>`,   // con cóc
  6: (r) => `<g transform="scale(${f1(r / 100)})"><rect x="-14" y="-70" width="28" height="90" rx="14" fill="#F7DEC8" stroke="${INK2}" stroke-width="5"/><rect x="-36" y="10" width="72" height="60" rx="20" fill="#F7DEC8" stroke="${INK2}" stroke-width="5"/><circle cx="0" cy="-74" r="20" fill="#FFD36A" opacity="0.85"/></g>`,   // một ngón tay sáng
  7: (r) => `<g transform="scale(${f1(r / 100)})">${[-36, -12, 12, 36].map((x, i) => `<path d="M${x} 30 Q${x + (i - 1.5) * 6} -20 ${x + (i - 1.5) * 10} -60" fill="none" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M${x + (i - 1.5) * 10 - 6} -56 L${x + (i - 1.5) * 10} -78 L${x + (i - 1.5) * 10 + 6} -56Z" fill="#8E44AD" stroke="${INK2}" stroke-width="3"/>`).join('')}</g>`,   // móng vuốt tím
  8: (r) => `<g transform="scale(${f1(r / 100)})">${[0, 1, 2, 3].map(i => `<path d="M0 0 m${-60 + i * 12} 0 a${60 - i * 12} ${60 - i * 12} 0 1 1 ${2 * (60 - i * 12)} 0" fill="none" stroke="#2A7F8A" stroke-width="9" stroke-linecap="round" transform="rotate(${i * 70})"/>`).join('')}<circle r="10" fill="#2A7F8A"/></g>`,   // xoáy nước
  9: (r) => `<g transform="scale(${f1(r / 100)})">${[...Array(7)].map((_, i) => { const a = (-160 + i * 23) * Math.PI / 180; return `<path d="M${f1(Math.cos(a) * 46)} ${f1(Math.sin(a) * 46 - 6)} L${f1(Math.cos(a) * 64)} ${f1(Math.sin(a) * 64 - 10)} L${f1(Math.cos(a) * 76 + 6)} ${f1(Math.sin(a) * 76 - 4)}" fill="none" stroke="#C0392B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`; }).join('')}<rect x="-38" y="-26" width="76" height="62" rx="24" fill="#F7DEC8" stroke="${INK2}" stroke-width="6"/>${chL('M-24 -26 v20 M-6 -26 v20 M12 -26 v20 M-38 6 q20 8 36 -2', 4)}</g>`,   // nắm đấm + 7 vết nứt đỏ (Thất Thương)
  10: (r) => `<g transform="scale(${f1(r / 100)})"><path d="M-30 50 Q-44 0 -36 -40 Q-30 -60 -18 -46 L-14 -10 L-10 -64 Q0 -76 8 -62 L8 -12 L16 -58 Q28 -66 32 -50 L26 0 L38 -30 Q50 -32 46 -14 Q36 30 24 50Z" fill="#DCE4EE" stroke="${INK2}" stroke-width="5"/><path d="M58 -30 q14 22 0 32 q-14 -10 0 -32Z" fill="#7FB0E0" stroke="${INK2}" stroke-width="4"/></g>`,   // bàn tay nhợt + giọt lệ (Ảm Nhiên)
  11: (r) => `<g transform="scale(${f1(r / 100)})"><circle r="62" fill="#fff" stroke="${INK2}" stroke-width="6"/><path d="M0 -62 A62 62 0 0 1 0 62 A31 31 0 0 1 0 0 A31 31 0 0 0 0 -62Z" fill="${INK2}"/><circle cy="-31" r="10" fill="#fff"/><circle cy="31" r="10" fill="${INK2}"/></g>`,   // âm dương (Thái Cực)
  12: (r) => `<g transform="scale(${f1(r / 100)})">${[...Array(9)].map((_, i) => `<path d="M0 -50 L-9 -76 L9 -76Z" fill="#F08A2A" stroke="${INK2}" stroke-width="3" transform="rotate(${i * 40})"/>`).join('')}<circle r="44" fill="#E04A2A" stroke="${INK2}" stroke-width="6"/><circle cx="-12" cy="-14" r="10" fill="#FFB08A" opacity="0.8"/></g>`,   // mặt trời đỏ 9 tia (Cửu Dương)
  13: (r) => `<g transform="scale(${f1(r / 100)})"><rect x="-46" y="-58" width="92" height="116" rx="6" fill="#5A6A8E" stroke="${INK2}" stroke-width="7"/><rect x="-46" y="-58" width="14" height="116" fill="#3E4A68" stroke="${INK2}" stroke-width="4"/><path d="M14 -30 A26 26 0 1 0 22 18 A20 20 0 1 1 14 -30Z" fill="#F4E6B0" stroke="${INK2}" stroke-width="3"/></g>`,   // kinh xanh + trăng khuyết (Cửu Âm)
  14: (r) => `<g transform="scale(${f1(r / 100)})"><path d="M-70 40 Q0 -10 70 -40" fill="none" stroke="#9AA6C8" stroke-width="10" stroke-linecap="round" opacity="0.7"/><g transform="rotate(-45)"><path d="M-70 -6 L50 -5 L70 0 L50 5 L-70 6Z" fill="#E4EAF0" stroke="${INK2}" stroke-width="5"/><rect x="-82" y="-20" width="10" height="40" fill="#C9A24A" stroke="${INK2}" stroke-width="3"/><rect x="-110" y="-7" width="28" height="14" fill="#3A2A3A" stroke="${INK2}" stroke-width="3"/></g></g>`,   // kiếm + vệt chém (Độc Cô)
  15: (r) => `<g transform="scale(${f1(r / 100)}) translate(-8 8)">${[[-64, 30, -30], [-46, -4, 0], [-8, -10, 20], [22, -26, 40], [18, -50, 70]].map(([x, y, a]) => `<path d="M-9 0 L0 -20 L9 0Z" fill="#D0402A" stroke="${INK2}" stroke-width="3" transform="translate(${x} ${y}) rotate(${a})"/>`).join('')}<path d="M-62 56 Q-74 2 -22 4 Q28 6 20 -36 Q16 -56 34 -64" fill="none" stroke="${INK2}" stroke-width="34" stroke-linecap="round"/><path d="M-62 56 Q-74 2 -22 4 Q28 6 20 -36 Q16 -56 34 -64" fill="none" stroke="#E6B42E" stroke-width="24" stroke-linecap="round"/>${chL('M-60 34 l12 2 M-44 12 l10 8 M-14 8 l4 12 M14 -10 l12 2 M16 -34 l12 -2', 3, '#9A6E10')}<path d="M22 -80 Q46 -96 72 -80 L88 -74 L70 -66 L86 -56 Q58 -42 30 -52 Q16 -64 22 -80Z" fill="#E6B42E" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M30 -86 L14 -110 M42 -88 L38 -114" stroke="${INK2}" stroke-width="6" stroke-linecap="round"/><path d="M86 -76 Q100 -92 96 -104 M84 -58 Q102 -50 104 -36" fill="none" stroke="${INK2}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="-74" r="5" fill="${INK2}"/></g>`,   // rồng vàng: thân uốn + vây đỏ + đầu có sừng, râu (Hàng Long)
  3: (r) => `<g transform="scale(${f1(r / 100)})">${[...Array(10)].map((_, i) => `<ellipse cx="0" cy="-42" rx="12" ry="26" fill="#F4C430" stroke="${INK2}" stroke-width="3" transform="rotate(${i * 36})"/>`).join('')}<circle r="22" fill="#7A4A2C" stroke="${INK2}" stroke-width="4"/>${chL('M-70 70 L60 -60', 4, '#7A8088')}<circle cx="60" cy="-60" r="5" fill="#fff"/></g>`,   // hoa quỳ + kim
};
// người dùng 2026-10-11: 'list 16 võ công show tên và hình ra luôn… không cần phải ẩn' → huy hiệu 'úp' (down) cũng hiện hình + tên
const K_SHOWALL = true;
// huy hiệu môn i: o.sc (phóng), o.op, o.down (úp mặt, chưa lộ), o.label (tên dưới), o.rot
function kBadge(i, x, y, r, o = {}) {
  const M = K_MON[i], sc = o.sc ?? 1;
  let s = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(sc * 1000) / 1000})" opacity="${f1(o.op ?? 1)}">`;
  if (o.down && !K_SHOWALL) {
    s += `<circle r="${r}" fill="#CDBF9F" stroke="#8A7A62" stroke-width="${f1(r * 0.12)}"/><circle r="${f1(r * 0.72)}" fill="none" stroke="#8A7A62" stroke-width="3" stroke-dasharray="6 6"/>` + kText('?', 0, r * 0.32, r * 0.9, { c: '#8A7A62' });
  } else {
    s += `<circle r="${r}" fill="${M.bg}" stroke="${M.ring}" stroke-width="${f1(r * 0.12)}"/><circle r="${f1(r * 0.8)}" fill="none" stroke="${INK2}" stroke-width="2" opacity="0.4"/>`;
    s += K_ICON[i] ? K_ICON[i](r) : kText(M.s, 0, r * 0.14, r * (M.s.length > 8 ? 0.3 : 0.38), { c: M.ring });
  }
  s += `</g>`;
  if ((o.label ?? (o.down && K_SHOWALL)) && (K_SHOWALL || !o.down)) s += kText(M.s, x, y + r * sc + (o.ly || 26), o.ls || Math.max(16, r * 0.42), { op: o.op ?? 1 });
  return s;
}

// ======================= BẢNG XẾP HẠNG =======================
const K_RX = 140, K_RW = 980, K_RY = (ti) => 210 + ti * 152;
// vị trí ô của môn i trên bảng (thứ tự trong cùng hạng = thứ tự môn)
function kSlot(i) {
  const M = K_MON[i], k = K_MON.filter(m => m.tier === M.tier && m.i < i).length;
  return [K_RX + 130 + 78 + k * 152, K_RY(K_TI[M.tier]) + 56];
}
// vị trí chờ (cột phải, úp mặt) của môn i
const kWait = (i) => [1390 + (i % 3) * 140, 230 + Math.floor(i / 3) * 128];
// vẽ bảng: placed = các môn đã xếp (mảng chỉ số); hide = các môn không vẽ ở chỗ chờ (đang diễn)
function kBoard(placed = [], o = {}) {
  let s = `<rect width="1920" height="1080" fill="#D9C9A6"/><rect x="60" y="40" width="1800" height="1000" rx="24" fill="${K_P1}" stroke="${INK2}" stroke-width="6"/>`;
  s += kText('BẢNG XẾP HẠNG VÕ CÔNG KIM DUNG', K_RX + K_RW / 2 + 60, 130, 54);
  K_TIERS.forEach(([L, c], ti) => {
    const y = K_RY(ti);
    s += `<rect x="${K_RX}" y="${y}" width="120" height="136" rx="12" fill="${c}" stroke="${INK2}" stroke-width="5"/>` + kText(L, K_RX + 60, y + 96, 88, { font: `'Bangers', ${FH}`, c: '#fff' });
    s += `<rect x="${K_RX + 130}" y="${y}" width="${K_RW}" height="136" rx="12" fill="${K_P2}" stroke="${INK2}" stroke-width="4" opacity="0.9"/>`;
  });
  for (const i of placed) { const [x, y] = kSlot(i); s += kBadge(i, x, y, 44, { label: true, ly: 24, ls: 25 }); }
  const hide = new Set([...(o.hide || []), ...placed]);
  for (let i = 0; i < K_MON.length; i++) if (!hide.has(i)) { const [x, y] = kWait(i); s += kBadge(i, x, y, 40, { label: true, ly: 20, ls: 19, op: 0.92 }); }
  return s;
}
const kPlacedBefore = (i) => K_MON.filter(m => m.i < i).map(m => m.i);

// máy quay có giới hạn: không lộ mép ngoài nền 1920×1080 khi phóng
function kCam(content, t, s, cx, cy, sh) { s = Math.max(1, s); const hx = 960 / s, hy = 540 / s; return camX(content, t, s, clamp(cx, hx + 12, 1920 - hx - 12), clamp(cy, hy + 10, 1080 - hy - 10), sh); }
// ======================= NGƯỜI DẪN SÙNG Ở GÓC =======================
// side: 'r' (góc phải dưới) | 'l'; trượt vào từ mép lúc t0; ex = biểu cảm; pose 'none' | 'point' | 'wave'
function kSung(t, o = {}) {
  const t0 = o.t0 ?? 0.2, k = EZ.expoOut(FIN(t, t0, 0.45)), side = o.side || 'r', sc = o.sc || 0.42;
  const x = side === 'r' ? lerp(2150, o.x ?? 1770, k) : lerp(-230, o.x ?? 150, k), y = (o.y ?? 1100) + spring(t, t0 + 0.45, 18, 7) * 10;
  return sungChar(f1(x), f1(y), sc, o.ex || 'tinhbo', t, { pose: o.pose || 'none', flip: side === 'l' });
}
// biểu cảm người dẫn đổi theo mốc thời gian: [[t, ex], …]
const kSungEx = (t, list, def = 'tinhbo') => { let e = def; for (const [t0, ex] of list) if (t >= t0) e = ex; return e; };

// ======================= KHUÔN HH — HUY HIỆU MỞ MÔN =======================
// o.at: từ khoá trong lời để hiện tên sách; o.sungEx
function kHH(t, ctx, i, o = {}) {
  const M = K_MON[i];
  let s = kBoard(kPlacedBefore(i), { hide: [i] });
  s += `<rect width="1920" height="1080" fill="#1B1410" opacity="${f1(0.45 * FIN(t, 0.1, 0.5))}"/>`;
  const [wx, wy] = kWait(i), k = EZ.expoOut(FIN(t, 0.2, 0.7));
  const x = lerp(wx, 960, k), y = lerp(wy, 470, k) + Math.sin(t * 2) * 6 * k, flip = clamp((t - 0.35) / 0.4);
  // lật huy hiệu: úp → ngửa (co ngang)
  const sx = Math.abs(Math.cos(flip * Math.PI));
  s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(Math.max(0.04, sx))} 1) translate(${f1(-x)} ${f1(-y)})">` + kBadge(i, x, y, 60, { sc: lerp(1, 2.7, k), down: flip < 0.5 }) + `</g>`;
  const tn = 0.95;
  s += kText(M.n.toUpperCase(), 960, 470 + 60 * 2.7 + 92, 70, { c: '#fff', op: FIN(t, tn, 0.35), stroke: INK2, sw: 10 });
  const tb = o.at ? AT(ctx, o.at) : tn + 0.6;
  if (t > tb) s += kText(M.book, 960, 470 + 60 * 2.7 + 150, 40, { c: '#E9D6A6', op: FIN(t, tb, 0.35) });
  if (t > tn + 0.9) s += sealIn('HẠNG ?', 1400, 300, t, tn + 0.9, { size: 72 });
  s += kSung(t, { t0: 0.5, ex: o.sungEx || 'quiz' });
  return kFin(camX(s, t, lerp(1.0, 1.04, clamp(t / ctx.dur)), 960, 540));
}

// ======================= KHUÔN DN — ĐỔI NHỊP: huy hiệu lao thẳng xuống ô D =======================
function kDN(t, ctx, idx, o = {}) {
  const list = Array.isArray(idx) ? idx : [idx];
  let s = kBoard(kPlacedBefore(list[0]), { hide: list });
  list.forEach((i, j) => {
    const [wx, wy] = kWait(i), [sx, sy] = kSlot(i), t0 = (o.t0 ?? 0.5) + j * 0.15, k = EZ.quadIn(FIN(t, t0, 0.45));
    const land = t > t0 + 0.45, x = lerp(wx, sx, k), y = lerp(wy, sy, k) - Math.sin(k * Math.PI) * 120;
    s += kBadge(i, x, y, 44, { down: t < t0 - 0.2, label: land, ly: 22, ls: 21, rot: land ? 0 : k * 360 });
    if (land) s += sealIn(K_MON[i].tier, sx + 70, sy - 40, t, t0 + 0.45, { size: 44 });
  });
  const tl = (o.t0 ?? 0.5) + 0.45;
  s += kSung(t, { t0: 0.3, ex: kSungEx(t, [[tl, o.sungEx || 'shock']], 'tinhbo'), pose: t > tl + 0.2 ? 'wave' : 'none' });
  const sh = shakeMulti(t, [[tl, 16, 0.3]]);
  return kFin(camX(s, t, 1, 960, 540, sh));
}

// ======================= KHUÔN XH — XẾP VÀO BẢNG =======================
// o.path: 'fizzle' (bay về S, xì khói giữa đường, rơi xuống ô thật) ; o.sungEx
function kXH(t, ctx, i, o = {}) {
  const M = K_MON[i], [sx, sy] = kSlot(i), heavy = M.tier === 'S';
  let s = kBoard(kPlacedBefore(i), { hide: [i] });
  const t0 = 0.3, x0 = 960, y0 = 520;
  let x, y, sc, rot = 0, land;
  if (o.path === 'fizzle') { // vòng 1: lao lên ô S → khựng, xì khói → rơi xuống ô thật
    const sS = [K_RX + 130 + 78, K_RY(0) + 56], k1 = EZ.quartOut(FIN(t, t0, 0.7)), stall = t0 + 0.7, k2 = EZ.quadIn(FIN(t, stall + 0.45, 0.45));
    x = lerp(lerp(x0, sS[0] + 120, k1), sx, k2); y = lerp(lerp(y0, sS[1] + 10, k1), sy, k2) + (t > stall && t < stall + 0.45 ? Math.sin((t - stall) * 40) * 4 : 0);
    sc = lerp(lerp(2.4, 1.1, k1), 1, k2); rot = k2 * 20 * (1 - k2) * 4; land = stall + 0.9;
    for (let j = 0; j < 5; j++) { const d = t - stall - j * 0.08; if (d < 0 || d > 1.3) continue; const kk = d / 1.3; s += `<circle cx="${f1(sS[0] + 130 + kk * 70 + j * 12)}" cy="${f1(sS[1] - kk * 90 - j * 10)}" r="${f1(16 + kk * 34)}" fill="#B9B4AA" opacity="${f1(0.75 * (1 - kk))}"/>`; }
    if (t > stall + 0.1 && t < stall + 1.2) s += kText('xì…', sS[0] + 260, sS[1] - 70, 46, { op: clamp(1.2 - (t - stall)) });
  } else if (o.path === 'poke') { // lơ lửng ở ô A → ngón tay sáng chọc → rơi xuống ô thật
    const sA = [K_RX + 130 + 78 + 3 * 152, K_RY(1) + 56], k1 = EZ.quartOut(FIN(t, t0, 0.6)), tp = t0 + 0.9, k2 = EZ.quadIn(FIN(t, tp + 0.15, 0.4));
    x = lerp(lerp(x0, sA[0], k1), sx, k2); y = lerp(lerp(y0, sA[1], k1), sy, k2) + (t > t0 + 0.6 && t < tp ? Math.sin(t * 6) * 6 : 0); sc = lerp(lerp(2.4, 1.1, k1), 1, k2); land = tp + 0.55;
    const fk = EZ.backOut(FIN(t, tp - 0.35, 0.35)) * (1 - FIN(t, tp + 0.5, 0.3));
    if (fk > 0) s += `<g transform="translate(${f1(sA[0] + 40)} ${f1(sA[1] - 40 - 220 * (1 - fk))}) scale(1.5)" opacity="${f1(Math.min(1, fk))}"><g ${GL.add}>${bloom('<circle cx="4" cy="104" r="26" fill="#FFD36A"/>', '#FFC23A', 0.9)}</g>${chHand('point', CHAR.vtd)}</g>`;
  } else {
    const k = EZ.quartOut(FIN(t, t0, 0.8)); land = t0 + 0.8;
    x = lerp(x0, sx, k); y = lerp(y0, sy, k) - Math.sin(k * Math.PI) * 140; sc = lerp(2.4, 1, k);
  }
  const done = t >= land;
  const squash = done ? 1 + spring(t, land, 22, 8) * 0.25 : 1;
  s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(squash)} ${f1(2 - squash)}) translate(${f1(-x)} ${f1(-y)})">` + kBadge(i, x, y, 44, { sc, rot, label: done, ly: 22, ls: 21 }) + `</g>`;
  if (done) s += sealIn(M.tier, sx + 74, sy - 42, t, land, { size: heavy ? 60 : 46 });
  if (o.extra) s += o.extra(t, land);
  s += kSung(t, { t0: 0.1, ex: kSungEx(t, [[land, o.sungEx || (heavy ? 'grin' : 'tinhbo')]], 'quiz'), pose: done && heavy ? 'wave' : 'none' });
  const sh = shakeMulti(t, [[land, heavy ? 30 : 12, heavy ? 0.5 : 0.25]]);
  return kFin(camX(s, t, lerp(1.0, 1.03, clamp(t / ctx.dur)), 960, 540, sh));
}

// ======================= KHUÔN CD — CHẤM ĐIỂM 3 TIÊU CHÍ =======================
function kBar(label, x, y, w, v, c, o = {}) {
  let s = kText(label, x, y - 16, 42, { anchor: 'start' }) + `<rect x="${x}" y="${y}" width="${w}" height="56" rx="28" fill="#E6D6B4" stroke="${INK2}" stroke-width="5"/>`;
  if (v > 0.01) s += `<rect x="${x + 5}" y="${y + 5}" width="${f1((w - 10) * clamp(v))}" height="46" rx="23" fill="${c}"/>`;
  if (o.over) s += `<rect x="${x + w - 30}" y="${y - 10}" width="${f1(o.over)}" height="76" rx="20" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  if (o.note) s += kText(o.note, x + 8, y + 104, 34, { anchor: 'start', c: o.nc || '#5A4A3A', op: o.nop ?? 1 });
  return s;
}
// o: portrait(t) → SVG nhân vật trong thẻ trái; user; bars: [{label, v(t), c, note, noteAt}]; seal: {text, at}; extra(t) → SVG thêm; sungEx list
function kCD(t, ctx, i, o = {}) {
  const M = K_MON[i];
  let s = `<rect width="1920" height="1080" fill="#D9C9A6"/><rect x="70" y="60" width="1780" height="960" rx="28" fill="${K_P1}" stroke="${INK2}" stroke-width="6"/>`;
  s += `<rect x="120" y="120" width="560" height="840" rx="20" fill="${M.bg}" stroke="${M.ring}" stroke-width="7"/><clipPath id="kcdCard"><rect x="126" y="126" width="548" height="828" rx="16"/></clipPath>`;
  // chân dung phóng to cho vừa khung (người dùng 2026-10-12: 'cho hình nhân vật to lên cho vừa với ô hình'): o.pz = độ phóng, o.pg = ground của nhân vật trong portrait()
  const pz = o.pz ?? 1.62, pg = o.pg ?? 1000;
  s += `<g clip-path="url(#kcdCard)"><g transform="translate(400 968) scale(${pz}) translate(-400 ${-pg})">${o.portrait ? o.portrait(t) : ''}</g></g>`;
  s += kBadge(i, 640, 160, 54);
  s += kText(M.n.toUpperCase(), 1230, 190, 60) + (o.user ? kText('người dùng giỏi nhất: ' + o.user, 1230, 242, 34, { c: '#7A6A52' }) : '');
  (o.bars || []).forEach((b, j) => {
    const y = 360 + j * 200, v = b.v(t), na = b.noteAt != null ? b.noteAt : 0.8;
    s += kBar(b.label, 760, y, 860, v, b.c, { note: t > na ? b.note : '', nop: FIN(t, na, 0.3), over: b.over ? b.over(t) : 0 });
  });
  if (o.extra) s += o.extra(t);
  if (o.seal && t > o.seal.at) s += sealIn(o.seal.text, 1560, 950, t, o.seal.at, { size: 54 });
  s += kSung(t, { t0: 0.3, ex: kSungEx(t, o.sungEx || [], 'tinhbo'), pose: 'point', x: 1800, sc: 0.36, y: 1110 });
  return kFin(s);
}

// ======================= KHUÔN CN — CHÈN NHANH CHO CÂU ĐÙA =======================
// draw(t, k) vẽ đồ vật quanh (960, 540); nền giấy màu + tia truyện tranh; o.bg, o.caption, o.sung {ex, side}
function kCN(t, ctx, draw, o = {}) {
  const k = kPop(t, 0.05, 0.35);
  let s = `<rect width="1920" height="1080" fill="${o.bg || '#F6E7B8'}"/>`;
  s += radialLines(t, 960, 540, { n: 40, r0: 380, op: 0.18, c: o.lines || '#C9A24E' });
  s += `<g transform="translate(960 540) scale(${f1(0.6 + 0.4 * k)}) rotate(${f1((1 - k) * -8)}) translate(-960 -540)" opacity="${f1(clamp(k * 2))}">${draw(t, k)}</g>`;
  if (o.caption) s += kText(o.caption, 960, 990, 52, { op: FIN(t, o.capAt ?? 0.4, 0.3), stroke: '#FFF8E6', sw: 10 });
  if (o.sung) s += kSung(t, { t0: o.sung.t0 ?? 0.6, ex: o.sung.ex || 'tac', side: o.sung.side || 'r', sc: 0.4 });
  return kFin(camX(s, t, lerp(1.02, 1.0, clamp(t / ctx.dur)), 960, 540));
}

// ======================= KHUÔN SG — SÙNG PHẢN ỨNG =======================
function kSG(t, ctx, o = {}) {
  let s = o.bgFn ? o.bgFn(t) : setStudy(t);   // người dẫn giải thích trong thư phòng (nền chi tiết, phủ nhạt để chữ đọc rõ)
  s += sungChar(f1(o.x ?? 760), f1(1110 + spring(t, 0.1, 16, 6) * 14), o.sc ?? 0.95, kSungEx(t, o.ex || [], 'tinhbo'), t, { pose: o.pose || 'none' });
  if (o.extra) s += o.extra(t);
  return kFin(camX(s, t, lerp(1.0, 1.05, clamp(t / ctx.dur)), 900, 560));
}

// ======================= KHUÔN DT — BÓNG THOẠI =======================
function kBubble(x, y, text, t, t0, o = {}) {
  if (t < t0) return '';
  // (2026-10-19) bóng một dòng không tràn khung: co chữ cho vừa; quá dài thì tách đôi hai bóng chồng nhau
  let fs = o.fs || 42; const MAXW = 1760;
  if (!o.w && text.length * fs * 0.54 + 80 > MAXW) {
    const fit = (MAXW - 80) / (text.length * 0.54);
    if (fit < 34 && !o._sub) {
      const mid = text.length / 2, idx = []; for (let i = 3; i < text.length - 3; i++) if (text[i] === ' ' && /[,.!?;:]/.test(text[i - 1])) idx.push(i); if (!idx.length) for (let i = 3; i < text.length - 3; i++) if (text[i] === ' ') idx.push(i);
      const i = idx.reduce((a, b) => Math.abs(b - mid) < Math.abs(a - mid) ? b : a), A = text.slice(0, i), B = text.slice(i + 1);
      return kBubble(x, y, A, t, t0, { ...o, _sub: 1 }) + kBubble(x + 40, y + 140, B, t, t0 + 0.075 * i, { ...o, _sub: 1 });
    }
    fs = Math.max(26, fit);
  }
  const k = kPop(t, t0), w = o.w || Math.min(MAXW, text.length * fs * 0.54 + 80), tx = o.tail ?? -w / 3;
  x = clamp(x, w / 2 + 30, 1890 - w / 2);
  const tail = o.to ? kTailTo(x, y, w, 112, o.to) : `<path d="M${f1(tx - 24)} 52 L${f1(tx + (o.tailDx ?? -40))} 110 L${f1(tx + 24)} 52Z" fill="#FFFBF0" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><rect x="${f1(tx - 30)}" y="44" width="60" height="12" fill="#FFFBF0"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})"><rect x="${f1(-w / 2)}" y="-56" width="${f1(w)}" height="112" rx="28" fill="#FFFBF0" stroke="${INK2}" stroke-width="5"/>` +
    tail + kText(text, 0, fs * 0.36, fs) + `</g>`;
}
// đuôi bóng lời trỏ thẳng vào nhân vật (o.to = [x, y] miệng người nói, toạ độ màn hình) — người dùng 2026-10-13
function kTailTo(x, y, w, h, to) {
  const dx = to[0] - x, dy = to[1] - y, down = dy > 0, ey = down ? h / 2 : -h / 2;
  const bx = clamp(dx * 0.7, -w / 2 + 64, w / 2 - 64);
  const vx = dx - bx, vy = dy - ey, d = Math.hypot(vx, vy) || 1, L = clamp(d - 46, 46, 170), px = bx + vx / d * L, py = ey + vy / d * L;
  const s = down ? -1 : 1;
  return `<path d="M${f1(bx - 22)} ${f1(ey + 4 * s)} L${f1(px)} ${f1(py)} L${f1(bx + 22)} ${f1(ey + 4 * s)}Z" fill="#FFFBF0" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><rect x="${f1(bx - 28)}" y="${f1(down ? ey - 10 : ey)}" width="56" height="10" fill="#FFFBF0"/>`;
}

// ======================= NỀN =======================
function kRoof(x, y, w, h, c = '#3E4A44') {
  return `<path d="M${x - 40} ${y + h} Q${x + w * 0.25} ${y + h * 0.55} ${x + w / 2} ${y} Q${x + w * 0.75} ${y + h * 0.55} ${x + w + 40} ${y + h} Q${x + w + 70} ${y + h - 30} ${x + w + 90} ${y + h - 46} L${x + w + 60} ${y + h + 18} H${x - 60} L${x - 90} ${y + h - 46} Q${x - 70} ${y + h - 30} ${x - 40} ${y + h}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
}
// sân chùa (o.name = biển; o.wall, o.roof đổi màu cho Thiếu Lâm / Võ Đang)
// (2026-10-11) nền sân → bối cảnh riêng theo địa điểm (sc_sets.js, luật VISUAL_RULES kênh Hóng Sử)
function kTempleYard(t, o = {}) {
  const n = o.name || '';
  if (/THIẾU LÂM/.test(n)) return setShaolin(t, o);
  if (/CÁI BANG/.test(n)) return setBeggarHQ(t, o);
  if (/TỬ CẤM/.test(n)) return setForbidden(t, { name: 'THÁI HOÀ ĐIỆN' });
  if (/ĐÀO HOA/.test(n)) return setPeachIsland(t, o);
  return setDaiLy(t, o);
}
// trong điện: cột đỏ + tượng mờ
// nội thất điện: kind 'phat' | 'dao' | 'am'; night
function kTempleHall(t, kind = 'phat', night = false) { return setTempleHall(t, { kind, night }); }
// ảnh đầu tròn vẽ code
function kIcon(id, x, y, r, ex = 'neutral', T = 0, o = {}) {
  const cid = 'ki' + (CHN++), k = r / 210, [hb, hf] = chHead(CHAR[id], ex, T, { seed: 1 });
  return `<g ${o.grey ? 'filter="url(#rgGrey)"' : ''}><clipPath id="${cid}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}"/></clipPath><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${o.bg || '#E8F2FA'}"/><g clip-path="url(#${cid})"><g transform="translate(${f1(x - 6 * k)} ${f1(y + 30 * k)}) scale(${f1(k * 1000) / 1000})">${hb}${hf}</g></g><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="none" stroke="${INK2}" stroke-width="6"/></g>`;
}
// khói xì nhỏ
function kPuff(t, t0, x, y, o = {}) { const d = t - t0; if (d < 0 || d > 1.6) return ''; let s = '';
  for (let i = 0; i < 4; i++) { const k = clamp((d - i * 0.12) / 1.2); if (k <= 0) continue; s += `<circle cx="${f1(x + 20 + k * 60 + i * 10)}" cy="${f1(y - 10 - k * 90 - i * 14)}" r="${f1((14 + k * 26) * (o.sc || 1))}" fill="#B9B4AA" opacity="${f1(0.7 * (1 - k))}"/>`; }
  return s; }

// ======================= KHUÔN DO — ĐOÁN: ô S và A nhấp nháy, đồng hồ cát =======================
function kDO(t, ctx, i, o = {}) {
  let s = kBoard(kPlacedBefore(i), { hide: [i] });
  const tq = o.at ? AT(ctx, o.at) : 0.8, blink = t > 0.3 ? Math.floor((t - 0.3) * 3) % 2 : -1;
  for (const [ti, on] of [[0, blink === 0], [1, blink === 1]]) if (blink >= 0) s += `<rect x="${K_RX + 130}" y="${K_RY(ti)}" width="${K_RW}" height="136" rx="12" fill="none" stroke="${INK2}" stroke-width="${on ? 12 : 4}" stroke-dasharray="${on ? '0' : '14 10'}"/>`;
  s += kBadge(i, 960, 520 + Math.sin(t * 3) * 10, 60, { sc: 2.0 }) + kText('S HAY A ?', 960, 760, 84, { stroke: '#FFF8E6', sw: 12, c: K_RED });
  if (t > tq) s += kHourglass(1560, 560, 1.1, clamp((t - tq) / 2.2));
  s += kSung(t, { t0: 0.2, ex: 'quiz', pose: 'point' });
  return kFin(camX(s, t, lerp(1.0, 1.05, clamp(t / ctx.dur)), 960, 540));
}

// ======================= KHUÔN BB — TOÀN BẢNG (giữa video / kết) =======================
function kBB(t, ctx, placed, o = {}) {
  let s = kBoard(placed, {});
  // các huy hiệu còn chờ: xoay nhẹ
  const k = EZ.quartOut(FIN(t, 0.2, 1.2));
  s = kBoard(placed, { hide: K_MON.map(m => m.i).filter(i => !placed.includes(i)) });
  K_MON.forEach(m => { if (placed.includes(m.i)) return; const [x, y] = kWait(m.i); s += kBadge(m.i, x, y, 46, { down: true, rot: Math.sin(t * 2 + m.i) * 12, op: 0.95 }); });
  s += kSung(t, { t0: 0.3, ex: kSungEx(t, o.sungEx || [], 'tinhbo'), pose: o.pose || 'none' });
  return kFin(camX(s, t, lerp(1.12, 1.0, k), lerp(700, 960, k), 540));
}
// trồng chuối / đi bằng tay: lật ngược nhân vật, đỉnh đầu chạm đất ở groundY
function kUpside(id, st, groundY, T) {
  const sc = st.scale || 1, LH = st.legs ? chLegHeight(st.legs, T) : 0, G0 = 1000;
  const headTop = G0 - (LH * CH_BS + 720) * sc, C = (headTop + groundY) / 2;
  return `<ellipse cx="${f1(st.x)}" cy="${groundY - 10}" rx="${f1(140 * sc)}" ry="${f1(22 * sc)}" fill="#3A2416" opacity="0.18"/><g transform="rotate(180 ${f1(st.x)} ${f1(C)})">${chChar(id, { ...st, ground: G0, shadow: false }, T)}</g>`;
}

// (2026-10-19) vị trí bàn tay trước (tay cầm đồ) của nhân vật tkChar — để đặt quả/đồ vật đúng vào tay. dy: dịch thêm theo trục dọc nhân vật.
function tkHandPt(id, st, T = 0, len = 185) {
  const c = CHAR[id] || {}, bk = c.bulk || 1, sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1, ang = (st.arm ?? 16) * Math.PI / 180;
  const LH = st.legs ? chLegHeight(st.legs, T) : 0, gy = (st.ground ?? 1090) + (st.y || 0) - LH * CH_BS * sc;
  const lx = (CH_SH[0] * bk - len * Math.sin(ang)) * CH_BS, ly = (CH_SH[1] + len * Math.cos(ang)) * CH_BS;
  const wx = lx * fl * sc * (2 - sq), wy = ly * sc * sq, a = (st.lean || 0) * fl * Math.PI / 180;
  return [st.x + wx * Math.cos(a) - wy * Math.sin(a), gy + wx * Math.sin(a) + wy * Math.cos(a)];
}
// quả nhân sâm cầm trên tay: tâm quả đặt đúng bàn tay
function c4InHand(id, st, T, k = 0.5) { const h = tkHandPt(id, st, T); return pr_nhan_sam(h[0], h[1] + 88 * k, k, T, {}); }

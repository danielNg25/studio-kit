// ===== BỘ NÂNG CẤP HÌNH — tập xep-hang-cao-thu-tam-quoc (2026-11-11, người dùng: "hình ảnh scene cần nâng cấp, đẹp hơn các bản cũ"; duyệt 5 hướng 23:32).
// (1) nền nhiều lớp có chiều sâu  (2) ánh sáng theo cảnh  (3) cảnh đánh nhiều nhịp  (4) thẻ/bảng làm lại  (5) đám đông là người thật, không bóng đen.
// File này: lớp ánh sáng (tqLight), đám đông lính (tqArmy, tqCrowdFront), bụi sáng (tqMotes), tia nắng (tqRays).
let TQ_ID = 0;
const tqMix = (a, b, k) => mixC(a, b, k);
// ---- tia nắng xiên từ mặt trời (x,y): các dải sáng mờ, đung đưa rất chậm
function tqRays(t, x, y, o = {}) {
  const n = o.n || 7, c = o.c || '#FFE2A8', L = o.len || 1700; let s = '';
  for (let i = 0; i < n; i++) { const a = (o.a0 ?? 100) + i * (o.step ?? 14) + Math.sin(t * 0.3 + i) * 1.5, w = 26 + (i % 3) * 22, r = a * Math.PI / 180;
    const x1 = x + Math.cos(r) * L, y1 = y + Math.sin(r) * L, nx = -Math.sin(r) * w, ny = Math.cos(r) * w;
    s += `<path d="M${f1(x)} ${f1(y)} L${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x1 - nx)} ${f1(y1 - ny)}Z" fill="${c}" opacity="${f1((o.op ?? 0.13) * (0.7 + 0.3 * Math.sin(t * 0.7 + i * 2)))}"/>`; }
  return s;
}
// ---- hạt bụi sáng trôi trong không khí (lớp gần máy quay)
function tqMotes(t, o = {}) {
  const n = o.n || 46, c = o.c || '#FFE9B8'; let s = '';
  for (let i = 0; i < n; i++) { const sp = 12 + hrnd(i, 7) * 26, x = ((hrnd(i, 1) * 2100 + t * sp * (o.dir ?? 1)) % 2100 + 2100) % 2100 - 90, y = hrnd(i, 2) * 1080 + Math.sin(t * 0.8 + i) * 14, r = 2 + hrnd(i, 3) * 5;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" opacity="${f1(0.18 + 0.4 * hrnd(i, 4) * (0.6 + 0.4 * Math.sin(t * 1.3 + i)))}"/>`; }
  return s;
}
// ---- lớp ánh sáng phủ cuối cảnh: mode 'dusk' (hoàng hôn ấm), 'night' (đêm xanh + lửa), 'dust' (trưa bụi vàng), 'day'
function tqLight(t, mode = 'dusk', o = {}) {
  const id = 'tql' + (TQ_ID++); let s = '';
  const P = { dusk: ['#FF9A4A', 0.20, '#2A1030', 0.55], night: ['#2A3A7A', 0.34, '#05060E', 0.72], dust: ['#E8C070', 0.16, '#3A2408', 0.42], day: ['#FFF2C8', 0.08, '#10203A', 0.30] }[mode];
  s += `<defs><radialGradient id="${id}a" cx="${o.sx ?? 0.72}" cy="${o.sy ?? 0.36}" r="0.9"><stop offset="0" stop-color="${P[0]}" stop-opacity="${P[1] * 1.6}"/><stop offset="0.5" stop-color="${P[0]}" stop-opacity="${P[1] * 0.6}"/><stop offset="1" stop-color="${P[0]}" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="${id}v" cx="0.5" cy="0.52" r="0.78"><stop offset="0.55" stop-color="${P[2]}" stop-opacity="0"/><stop offset="1" stop-color="${P[2]}" stop-opacity="${P[3]}"/></radialGradient></defs>`;
  s += `<rect width="1920" height="1080" fill="url(#${id}a)" style="mix-blend-mode:soft-light"/><rect width="1920" height="1080" fill="url(#${id}a)" opacity="0.5"/>`;
  s += `<rect width="1920" height="1080" fill="url(#${id}v)"/>`;
  return s;
}
// ---- MỘT NGƯỜI LÍNH (vẽ nhẹ, không dùng chChar): mũ trụ + mặt + giáp + khiên/giáo. dir: 1 nhìn phải, -1 nhìn trái. k = cỡ.
function tqSoldier(x, g, k, c, o = {}) {
  const dir = o.dir ?? 1, skin = o.skin || '#E2BC96', a = c, a2 = tqMix(c, '#000000', 0.3), a3 = tqMix(c, '#ffffff', 0.25), bob = o.bob || 0, ex = o.ex || 0;
  let s = `<g transform="translate(${f1(x)} ${f1(g + bob)}) scale(${f1(dir * k)} ${f1(k)})">`;
  if (o.spear !== false) s += `<path d="M34 -10 L46 -250" stroke="#2A1A12" stroke-width="9" stroke-linecap="round"/><path d="M34 -10 L46 -250" stroke="#8A5A30" stroke-width="5" stroke-linecap="round"/><path d="M46 -250 l-9 -4 l12 -44 l8 44Z" fill="#DDE4EA" stroke="#2A1A12" stroke-width="3" stroke-linejoin="round"/><path d="M42 -246 q-10 14 -4 30 q10 -8 8 -30Z" fill="#C0392B"/>`;
  s += `<path d="M-46 0 Q-52 -78 -34 -104 Q0 -120 34 -104 Q52 -78 46 0Z" fill="${a}" stroke="#2A1A12" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<path d="M-40 -60 Q0 -48 40 -60 M-42 -30 Q0 -18 42 -30" stroke="${a2}" stroke-width="5" fill="none"/><path d="M-30 -96 Q0 -84 30 -96" stroke="${a3}" stroke-width="5" fill="none"/>`;
  if (o.shield) s += `<path d="M-52 -92 Q-16 -104 6 -92 L4 -34 Q-24 -8 -54 -34Z" fill="${a2}" stroke="#2A1A12" stroke-width="5" stroke-linejoin="round"/><circle cx="-24" cy="-58" r="10" fill="#E2C25A" stroke="#2A1A12" stroke-width="3"/>`;
  s += `<circle cx="0" cy="-138" r="38" fill="${skin}" stroke="#2A1A12" stroke-width="5"/>`;
  s += `<path d="M-42 -134 Q-46 -190 0 -192 Q46 -190 42 -134 Q20 -154 0 -154 Q-20 -154 -42 -134Z" fill="${a2}" stroke="#2A1A12" stroke-width="5" stroke-linejoin="round"/><path d="M-6 -190 l6 -18 l6 18Z" fill="#E2C25A" stroke="#2A1A12" stroke-width="3"/><circle cx="0" cy="-212" r="7" fill="#C0392B" stroke="#2A1A12" stroke-width="2.5"/>`;
  // mặt: mắt + miệng (ex 1 = há miệng ngây ra)
  s += ex ? `<circle cx="8" cy="-136" r="6.5" fill="#fff" stroke="#2A1A12" stroke-width="2.5"/><circle cx="26" cy="-136" r="6.5" fill="#fff" stroke="#2A1A12" stroke-width="2.5"/><circle cx="10" cy="-136" r="2.6" fill="#2A1A12"/><circle cx="28" cy="-136" r="2.6" fill="#2A1A12"/><ellipse cx="18" cy="-116" rx="6" ry="8" fill="#5A1A14" stroke="#2A1A12" stroke-width="2.5"/>`
    : `<path d="M4 -138 h9 M22 -138 h9" stroke="#2A1A12" stroke-width="4.5" stroke-linecap="round"/><path d="M10 -120 h14" stroke="#2A1A12" stroke-width="3.5" stroke-linecap="round"/>`;
  return s + `</g>`;
}
// ---- ĐẠO QUÂN: nhiều hàng lính xếp chéo theo chiều sâu, hàng xa nhỏ + nhạt màu (không khí), cờ xen kẽ. Trả SVG.
//   o: x0,x1 (khoảng ngang), g (đất hàng gần), rows, per (số lính/hàng), c (màu giáp), flag (màu cờ), dir, ex (0..1 tỉ lệ há miệng), haze (màu pha xa)
function tqArmy(t, o) {
  const rows = o.rows || 3, per = o.per || 7, dir = o.dir ?? 1, haze = o.haze || '#E8B88A'; let s = '';
  for (let r = rows - 1; r >= 0; r--) {
    const k = (o.k || 0.62) * (1 - r * 0.16), g = o.g - r * (o.dy || 46), fade = r * (o.fade ?? 0.22), col = tqMix(o.c, haze, fade), sk = tqMix('#E2BC96', haze, fade);
    for (let i = 0; i < per; i++) {
      const u = (i + (r % 2) * 0.5) / per, x = lerp(o.x0, o.x1, u) + (hrnd(i, r, 9) - 0.5) * 16, bob = Math.sin(t * (1.6 + hrnd(i, r, 2)) + i * 1.7 + r) * (2 + (o.stir || 0) * 5);
      if (o.flag && (i + r) % 4 === 1) s += tqBanner(x - dir * 30 * k, g - 150 * k, 260 * k, tqMix(o.flag, haze, fade), t + i * 0.4 + r, dir);
      s += tqSoldier(x, g, k, col, { dir, skin: sk, bob, ex: (o.ex || 0) > hrnd(i, r, 5) ? 1 : 0, shield: (i + r) % 3 === 0, spear: (i + r) % 4 !== 1 });
    }
  }
  return s;
}
// ---- cờ đuôi nheo bay theo gió
function tqBanner(x, y, h, c, t, dir = 1) {
  const w = h * 0.5, wv = Math.sin(t * 2.6) * 10, c2 = tqMix(c, '#000000', 0.3);
  return `<path d="M${f1(x)} ${f1(y + h * 0.6)} V${f1(y - h * 0.5)}" stroke="#2A1A12" stroke-width="7" stroke-linecap="round"/><path d="M${f1(x)} ${f1(y + h * 0.6)} V${f1(y - h * 0.5)}" stroke="#8A6A40" stroke-width="3.5" stroke-linecap="round"/>`
    + `<path d="M${f1(x)} ${f1(y - h * 0.48)} Q${f1(x + dir * w * 0.5)} ${f1(y - h * 0.5 + wv)} ${f1(x + dir * w)} ${f1(y - h * 0.38 - wv)} L${f1(x + dir * w * 0.8)} ${f1(y - h * 0.22)} L${f1(x + dir * w)} ${f1(y - h * 0.06 + wv)} Q${f1(x + dir * w * 0.5)} ${f1(y - h * 0.12 - wv)} ${f1(x)} ${f1(y - h * 0.08)}Z" fill="${c}" stroke="#2A1A12" stroke-width="4" stroke-linejoin="round"/>`
    + `<path d="M${f1(x + dir * w * 0.2)} ${f1(y - h * 0.36)} Q${f1(x + dir * w * 0.5)} ${f1(y - h * 0.3 + wv * 0.5)} ${f1(x + dir * w * 0.72)} ${f1(y - h * 0.22)}" stroke="${c2}" stroke-width="5" fill="none" opacity="0.7"/>`;
}
// ---- hàng lính TIỀN CẢNH nhìn từ sau lưng (gần máy quay, tối + mờ): tạo chiều sâu, khung cảnh như đang đứng xem trong hàng quân
function tqCrowdFront(t, o = {}) {
  const n = o.n || 9, c = o.c || '#3A2A30', stir = o.stir || 0, gap = o.gap ?? 470, rim = o.rim || '#FFB870'; let s = '';
  for (let i = 0; i < n; i++) { const x = (i + 0.5) / n * 2040 - 60 + (hrnd(i, 3) - 0.5) * 40; if (Math.abs(x - 960) < gap) continue;
    const edge = (Math.abs(x - 960) - gap) / (1020 - gap), k = 1.25 + edge * 0.6 + hrnd(i, 4) * 0.2, y = 1215 - edge * 70 + hrnd(i, 5) * 30 + Math.sin(t * 2 + i * 1.3) * (3 + stir * 8) - (o.rise ?? 0), sd = x < 960 ? 1 : -1;
    s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * sd)} ${f1(k)})">`
      + (i % 5 === 0 ? `<path d="M64 60 L78 -330" stroke="#120C10" stroke-width="11" stroke-linecap="round"/><path d="M78 -330 l-11 -4 l14 -56 l10 56Z" fill="#6A7078" stroke="#120C10" stroke-width="4"/><path d="M72 -326 q-14 20 -6 44 q14 -12 12 -44Z" fill="#8E2430"/>` : '')
      + `<path d="M-84 60 Q-92 -30 -58 -62 Q0 -84 58 -62 Q92 -30 84 60Z" fill="${c}" stroke="#120C10" stroke-width="5"/><path d="M-80 -8 Q-66 -56 -30 -64 M80 -8 Q66 -56 30 -64" stroke="#120C10" stroke-width="4" fill="none"/>`
      + `<path d="M40 -66 Q84 -36 84 30" stroke="${rim}" stroke-width="5" fill="none" opacity="0.75"/>`
      + `<path d="M-46 -60 Q-52 -150 0 -156 Q52 -150 46 -60 Q0 -80 -46 -60Z" fill="${tqMix(c, '#000000', 0.25)}" stroke="#120C10" stroke-width="5"/><path d="M-50 -74 Q0 -96 50 -74" stroke="#120C10" stroke-width="4" fill="none"/>`
      + `<path d="M22 -148 Q48 -128 46 -72" stroke="${rim}" stroke-width="5" fill="none" opacity="0.8"/><path d="M-5 -154 l5 -22 l5 22Z" fill="#B89A4A" stroke="#120C10" stroke-width="3"/><path d="M0 -176 q-16 -14 -8 -34 q14 10 8 34Z" fill="#8E2430" stroke="#120C10" stroke-width="3"/></g>`; }
  return `<g opacity="${o.op ?? 1}">${s}</g>`;
}

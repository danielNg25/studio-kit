// ===== NỀN TẬP GIA CÁT LƯỢNG — nhóm E (2026-10-17): nam_quan, trai_thuc, trai_nguy, tay_thanh, ngu_truong, thanh_do
// Thành quách, trại quân, đồng ruộng. Mọi nền: bg_<tên>(t, o) trả SVG 1920×1080. Helper riêng tiền tố tqE_.

// ---------- helper chung nhóm E ----------
// quầng sáng tròn (radialGradient): id duy nhất theo (x,y,tag)
const tqE_glow = (x, y, r, c = '#FFC866', op = 0.5, ry = null, tag = '') => { const id = 'tqEg' + Math.round(x) + '_' + Math.round(y) + tag; return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="0.55" stop-color="${c}" stop-opacity="${R1(op * 0.4 * 100) / 100}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r)}" ry="${R1(ry ?? r)}" fill="url(#${id})"/>`; };
// dải gradient dọc
const tqE_vband = (id, x, y, w, h, c1, o1, c2, o2) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity="${o1}"/><stop offset="1" stop-color="${c2}" stop-opacity="${o2}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
// bếp lửa + nồi trên kiềng ba chân (x, g) chân; lửa động
function tqE_cookfire(x, g, s = 1, T = AT_(), o = {}) {
  let b = '';
  if (o.glow) b += tqE_glow(0, -10, 260, '#FFB84A', o.glow, 70, 'cf' + Math.round(x));
  b += `<ellipse cx="0" cy="6" rx="92" ry="16" fill="#20140A" opacity="0.22"/>`;
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; b += `<ellipse cx="${R1(Math.cos(a) * 68)}" cy="${R1(Math.sin(a) * 12 - 2)}" rx="19" ry="12" fill="${i % 2 ? '#9A9488' : '#847E72'}" stroke="${INK2}" stroke-width="3.5"/>`; }
  b += `<path d="M-52 -4 L48 -22 M52 -4 L-44 -22" stroke="${INK2}" stroke-width="14" stroke-linecap="round"/><path d="M-52 -4 L48 -22 M52 -4 L-44 -22" stroke="${TQ.wood2}" stroke-width="8" stroke-linecap="round"/>`;
  b += tqFlame(0, -4, 0.55, T, { seed: x });
  b += `<path d="M-70 -170 L-4 -118 M70 -170 L4 -118 M0 -176 V-118" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/><path d="M-70 -170 L-4 -118 M70 -170 L4 -118 M0 -176 V-118" stroke="${TQ.wood}" stroke-width="5.5" stroke-linecap="round"/>`;
  b += `<path d="M-66 -150 Q-72 -90 -40 -66 H40 Q72 -90 66 -150Z" fill="#3A3A40" stroke="${INK2}" stroke-width="5"/><path d="M-70 -150 H70" stroke="${INK2}" stroke-width="10" stroke-linecap="round"/><path d="M-70 -150 H70" stroke="#55555C" stroke-width="5" stroke-linecap="round"/><path d="M-48 -134 Q-52 -100 -34 -82" stroke="#6A6A72" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  b += `<ellipse cx="0" cy="-152" rx="60" ry="9" fill="#C8A060" stroke="${INK2}" stroke-width="3"/>`;
  b += tqSmoke(0, -170, T, 200, o.smoke || '#CFCAC0', 5, Math.round(x) % 7 + 1, 0.55);
  return _g(x, g, s, b);
}
// xe đẩy gỗ hai bánh (nhìn nghiêng); o.load bao gạo
function tqE_cart(x, g, s = 1, o = {}) {
  let b = `<ellipse cx="0" cy="6" rx="130" ry="14" fill="#20140A" opacity="0.2"/>`;
  b += `<path d="M-130 -92 L-190 -60 M-130 -76 L-196 -48" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M-130 -92 L-190 -60 M-130 -76 L-196 -48" stroke="${TQ.wood3}" stroke-width="7" stroke-linecap="round"/>`;
  b += `<path d="M-120 -96 H120 L106 -52 H-106Z" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-84 -96 L-76 -52 M-28 -96 L-26 -52 M28 -96 L26 -52 M84 -96 L76 -52" stroke="${TQ.wood2}" stroke-width="3.5"/><path d="M-126 -100 H126" stroke="${INK2}" stroke-width="9"/><path d="M-126 -100 H126" stroke="${TQ.wood}" stroke-width="5"/>`;
  if (o.load !== false) b += `<path d="M-90 -100 Q-100 -150 -60 -154 Q-20 -160 -4 -104Z" fill="#D8C79A" stroke="${INK2}" stroke-width="4"/><path d="M-80 -118 q20 -10 44 0" stroke="#8A7A52" stroke-width="3" fill="none"/><path d="M-6 -102 Q-8 -140 28 -146 Q64 -150 70 -102Z" fill="#CDB886" stroke="${INK2}" stroke-width="4"/><path d="M10 -120 q14 -8 34 0" stroke="#8A7A52" stroke-width="3" fill="none"/><path d="M-76 -128 H-6" stroke="#8A5A34" stroke-width="4"/>`;
  b += `<circle cx="0" cy="-34" r="42" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/><circle cx="0" cy="-34" r="30" fill="none" stroke="${TQ.wood3}" stroke-width="5"/><path d="M-30 -34 H30 M0 -64 V-4 M-21 -55 L21 -13 M21 -55 L-21 -13" stroke="${INK2}" stroke-width="4"/><circle cx="0" cy="-34" r="8" fill="${TQ.gold2}" stroke="${INK2}" stroke-width="3"/>`;
  b += `<path d="M96 -52 V-4 M116 -54 V-4" stroke="${INK2}" stroke-width="10" stroke-linecap="round"/><path d="M96 -52 V-4 M116 -54 V-4" stroke="${TQ.wood}" stroke-width="5" stroke-linecap="round"/>`;
  return _g(x, g, s, b);
}
// bao gạo / hòm lương chất đống
function tqE_sacks(x, g, s = 1, c = '#D8C79A') {
  const sk = (cx, cy, k) => `<path d="M${cx - 44 * k} ${cy} Q${cx - 54 * k} ${cy - 50 * k} ${cx - 30 * k} ${cy - 70 * k} Q${cx} ${cy - 84 * k} ${cx + 30 * k} ${cy - 70 * k} Q${cx + 54 * k} ${cy - 50 * k} ${cx + 44 * k} ${cy}Z" fill="${c}" stroke="${INK2}" stroke-width="4"/><path d="M${cx - 24 * k} ${cy - 66 * k} q${24 * k} 12 ${48 * k} 0" stroke="#8A7A52" stroke-width="3.5" fill="none"/><path d="M${cx - 20 * k} ${cy - 30 * k} q${20 * k} -8 ${40 * k} 0" stroke="${dk(c, 0.25)}" stroke-width="3" fill="none"/>`;
  return _g(x, g, s, `<ellipse cx="0" cy="4" rx="110" ry="12" fill="#20140A" opacity="0.18"/>` + sk(-56, 0, 1) + sk(48, 0, 1) + sk(-4, -66, 0.95));
}
// cọc buộc ngựa + máng cỏ
function tqE_hitch(x, g, s = 1, c = TQ.wood) {
  let b = `<ellipse cx="0" cy="6" rx="170" ry="14" fill="#10141C" opacity="0.28"/>`;
  b += `<path d="M-130 0 V-120 M130 0 V-120" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M-130 0 V-120 M130 0 V-120" stroke="${c}" stroke-width="11" stroke-linecap="round"/><path d="M-146 -104 H146" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M-146 -104 H146" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
  b += `<path d="M-40 -104 q-8 26 0 44 M40 -104 q8 26 0 44" stroke="${INK2}" stroke-width="5" fill="none"/><circle cx="-40" cy="-58" r="6" fill="#8A8A92" stroke="${INK2}" stroke-width="3"/><circle cx="40" cy="-58" r="6" fill="#8A8A92" stroke="${INK2}" stroke-width="3"/>`;
  b += `<path d="M-90 0 L-80 -46 H80 L90 0Z" fill="${dk(c, 0.1)}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-70 -46 Q-40 -76 0 -62 Q40 -80 70 -46Z" fill="#C8B058" stroke="${INK2}" stroke-width="4"/><path d="M-50 -52 l10 -14 M-10 -56 l8 -16 M30 -54 l10 -14" stroke="#E4CC78" stroke-width="3.5" stroke-linecap="round"/>`;
  return _g(x, g, s, b);
}
// chổi tre: (x,g) = đầu chổi chạm đất, cán chếch theo rot (độ, quanh điểm chạm đất)
function tqE_broom(x, g, s = 1, rot = 0) {
  return _g(x, g, s, `<path d="M0 -70 V-300" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M0 -70 V-300" stroke="#B89A5A" stroke-width="6" stroke-linecap="round"/><path d="M-12 -96 L-34 0 Q0 8 34 0 L12 -96Z" fill="#C8A860" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M-6 -90 L-16 -4 M0 -90 V-2 M6 -90 L16 -4 M-18 -50 H18" stroke="#8A6E34" stroke-width="3" fill="none"/><path d="M-13 -90 H13" stroke="#6B4428" stroke-width="7"/>`, rot);
}
// cột cờ trống trơn: cột + quả cầu + dây kéo cờ chùng
function tqE_barePole(x, g, h = 420, T = AT_(), o = {}) {
  const sw = Math.sin(T * 0.8 + x * 0.02) * 2.5;
  return `<path d="M${x} ${g} V${g - h}" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${g} V${g - h}" stroke="${o.c || TQ.wood}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${g - h - 9}" r="10" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><path d="M${x - 8} ${g - h + 70} H${x + 8} M${x - 8} ${g - h + 74} H${x + 8}" stroke="${INK2}" stroke-width="4"/><path d="M${x + 7} ${g - h + 20} Q${R1(x + 24 + sw)} ${R1(g - h + 150)} ${R1(x + 8 + sw * 0.5)} ${R1(g - h + 260)}" stroke="${INK2}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="${R1(x + 8 + sw * 0.5)}" cy="${R1(g - h + 266)}" r="5" fill="${TQ.gold2}" stroke="${INK2}" stroke-width="2.5"/>`;
}
// én (đuôi chẻ), bay theo vòng
function tqE_swallow(cx, cy, rx, ry, sp, ph, T = AT_(), s = 1) {
  const a = T * sp + ph, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a * 1.7) * ry, dir = -Math.sin(a) >= 0 ? 1 : -1, fl = Math.sin(T * 11 + ph * 3) * 9;
  return `<g transform="translate(${R1(x)} ${R1(y)}) scale(${dir * s} ${s}) rotate(${R1(Math.cos(a * 1.7) * 8)})"><path d="M0 3 Q-8 ${R1(10 + fl * 0.5)} -20 ${R1(13 + fl * 0.6)} Q-10 5 4 4Z" fill="#3A343E" stroke="${INK2}" stroke-width="2" stroke-linejoin="round"/><path d="M-8 1 L-36 -7 L-27 2 L-38 11 L-8 6Z" fill="#26222C" stroke="${INK2}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-10 0 Q8 -9 26 -3 Q31 1 25 5 Q8 9 -10 5Z" fill="#26222C" stroke="${INK2}" stroke-width="2.4"/><path d="M8 4 Q18 7 25 4" stroke="#E8D8C0" stroke-width="3" fill="none" opacity="0.85"/><path d="M-2 -4 Q-10 ${R1(-18 - fl)} -34 ${R1(-22 - fl * 1.3)} Q-20 ${R1(-8 - fl * 0.3)} 8 -2Z" fill="#2E2A34" stroke="${INK2}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="-1.5" r="1.5" fill="#F4EEDD"/></g>`;
}
// dừa (phương Nam): thân cong, tán lá, quả
function tqE_palm(x, g, s = 1, T = AT_(), o = {}) {
  const lean = o.lean ?? 40, H = o.h || 360, sw = Math.sin(T * 1.2 + x * 0.01) * 5;
  const tx = lean + sw * 0.5, ty = -H;
  let b = `<ellipse cx="0" cy="4" rx="70" ry="10" fill="#20140A" opacity="0.18"/><path d="M-14 0 Q${R1(lean * 0.2 - 8)} ${R1(ty * 0.5)} ${R1(tx - 7)} ${ty} L${R1(tx + 7)} ${ty} Q${R1(lean * 0.2 + 12)} ${R1(ty * 0.5)} 16 0Z" fill="#9A7A52" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 9; i++) { const u = i / 9, yy = ty * u, xx = lean * u * u * 0.9 + (u < 0.5 ? 0 : 0); b += `<path d="M${R1(xx - 11 + 4 * u)} ${R1(yy)} q10 5 22 -2" stroke="${INK2}" stroke-width="3" fill="none" opacity="0.55"/>`; }
  const fr = [[-150, 0.9], [-118, 1.0], [-84, 0.85], [-48, 0.75], [48, 0.75], [84, 0.85], [118, 1.0], [150, 0.9], [-20, 0.6], [22, 0.6]];
  fr.forEach(([a, k], i) => {
    const L = 190 * k * (o.k || 1), ar = a * Math.PI / 180, ex = Math.sin(ar) * L, ey = -Math.cos(ar) * L * 0.3 + L * 0.34 * Math.abs(Math.sin(ar)) + Math.sin(T * 1.6 + i) * 4, cx = ex * 0.5, cy = -L * 0.42 + ey * 0.2, c = i % 2 ? '#5E9A4A' : '#4E8A3E';
    let d = `<path d="M0 0 Q${R1(cx)} ${R1(cy - 14)} ${R1(ex)} ${R1(ey)} Q${R1(cx)} ${R1(cy + 20)} 0 6Z" fill="${c}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M0 2 Q${R1(cx)} ${R1(cy + 2)} ${R1(ex * 0.96)} ${R1(ey - 2)}" stroke="${dk(c, 0.3)}" stroke-width="3" fill="none"/>`;
    for (let j = 1; j < 7; j++) { const u = j / 7, px = ex * u * 0.98 + (cx - ex * 0.5) * 2 * u * (1 - u) * 1.0, py = ey * u + (cy - ey * 0.5) * 2 * u * (1 - u); d += `<path d="M${R1(px)} ${R1(py)} l${R1(Math.sign(ex || 1) * 5)} ${R1(18 - 8 * u)}" stroke="${dk(c, 0.25)}" stroke-width="2.5" stroke-linecap="round"/>`; }
    b += `<g transform="translate(${R1(tx)} ${ty})">${d}</g>`;
  });
  b += `<circle cx="${R1(tx - 10)}" cy="${ty + 16}" r="12" fill="#7A9A3A" stroke="${INK2}" stroke-width="3.5"/><circle cx="${R1(tx + 8)}" cy="${ty + 20}" r="12" fill="#6A8A32" stroke="${INK2}" stroke-width="3.5"/><circle cx="${R1(tx)}" cy="${ty + 30}" r="11" fill="#8AAA44" stroke="${INK2}" stroke-width="3.5"/>`;
  return _g(x, g, s, b);
}
// chuối (phương Nam)
function tqE_banana(x, g, s = 1, T = AT_(), o = {}) {
  const sw = Math.sin(T * 1.4 + x * 0.013) * 4;
  let b = `<ellipse cx="0" cy="4" rx="90" ry="12" fill="#20140A" opacity="0.16"/><path d="M-20 0 Q-16 -80 -12 -150 L14 -150 Q18 -80 22 0Z" fill="#A8C070" stroke="${INK2}" stroke-width="5"/><path d="M-10 -40 H12 M-12 -90 H14 M-10 -130 H12" stroke="${dk('#A8C070', 0.3)}" stroke-width="3"/>`;
  const leaves = [[-150, 190, 0], [-100, 220, 1], [-40, 200, 2], [20, 210, 3], [80, 220, 4], [140, 200, 5]];
  for (const [a, L, i] of leaves) {
    const ar = a * Math.PI / 180, ex = Math.sin(ar) * L * 0.9, ey = -Math.cos(ar) * L * 0.55 + 44 + Math.sin(T * 1.8 + i) * 4 + sw, cx = ex * 0.5, cy = -L * 0.5 - 20, c = i % 2 ? '#7DB454' : '#68A044';
    b += `<g transform="translate(${sw * 0.5} -150)"><path d="M0 0 Q${R1(cx - 30)} ${R1(cy)} ${R1(ex)} ${R1(ey)} Q${R1(cx + 30)} ${R1(cy + 70)} 0 10Z" fill="${c}" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M0 4 Q${R1(cx)} ${R1(cy + 34)} ${R1(ex * 0.94)} ${R1(ey - 2)}" stroke="${dk(c, 0.3)}" stroke-width="3.5" fill="none"/>${[0.3, 0.5, 0.7].map(u => `<path d="M${R1(ex * u)} ${R1(ey * u * 0.9 + cy * (1 - u) * 0.3)} l${R1(Math.sign(ex || 1) * 4)} 26" stroke="${dk(c, 0.2)}" stroke-width="2.5" opacity="0.7"/>`).join('')}</g>`;
  }
  if (o.fruit !== false) b += `<path d="M10 -146 Q40 -120 36 -80" stroke="${INK2}" stroke-width="6" fill="none"/><path d="M26 -100 q10 -6 14 6 q-6 20 -22 16 q4 -14 8 -22Z M36 -88 q10 -4 12 8 q-4 18 -18 14Z" fill="#C8C84A" stroke="${INK2}" stroke-width="3"/><ellipse cx="40" cy="-70" rx="9" ry="12" fill="#6A2E44" stroke="${INK2}" stroke-width="3"/>`;
  return _g(x, g, s, b);
}
// đống lửa trại: vòng đá, củi gác chéo, quầng sáng; o.glow cường độ quầng
function tqE_bonfire(x, g, s = 1, T = AT_(), o = {}) {
  let b = tqE_glow(0, -40, 300 * (o.gr || 1), '#FFB040', o.glow ?? 0.5, 90 * (o.gr || 1), 'bf' + Math.round(x) + Math.round(g)) + `<ellipse cx="0" cy="6" rx="86" ry="15" fill="#20140A" opacity="0.28"/>`;
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; b += `<ellipse cx="${R1(Math.cos(a) * 66)}" cy="${R1(Math.sin(a) * 11 - 2)}" rx="18" ry="11" fill="${i % 2 ? '#8E8C92' : '#76747C'}" stroke="${INK2}" stroke-width="3.5"/>`; }
  b += `<path d="M-56 -6 L52 -26 M56 -6 L-50 -28 M-20 -4 L10 -34" stroke="${INK2}" stroke-width="15" stroke-linecap="round"/><path d="M-56 -6 L52 -26 M56 -6 L-50 -28 M-20 -4 L10 -34" stroke="${TQ.wood2}" stroke-width="9" stroke-linecap="round"/>`;
  b += tqFlame(0, -6, 0.8 * (o.fs || 1), T, { seed: x, wide: 1.1 });
  if (o.smoke !== false) b += tqSmoke(0, -150 * (o.fs || 1), T, 260, o.smokeC || '#8A8CA0', 5, Math.round(x) % 5 + 2, 0.4);
  return _g(x, g, s, b);
}
// bụi mù từ chân trời: cụm bụi vàng nâu dâng lên; D 0..1 cường độ
function tqE_dust(x0, x1, base, H, T, D, seed = 1) {
  if (D <= 0.01) return '';
  let s = '';
  for (let i = 0; i < 34; i++) {
    const u = hrnd(i, seed), v = hrnd(i, seed + 1), x = x0 + (x1 - x0) * u + Math.sin(T * 0.35 + i * 1.7) * 26, hh = H * D * (0.25 + 0.75 * v) * (0.6 + 0.4 * Math.sin(u * 3.1)), y = base - hh * 0.55 + Math.sin(T * 0.5 + i) * 6, r = (50 + 90 * hrnd(i, seed + 2)) * (0.5 + 0.7 * D);
    s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${i % 3 ? '#D9BE86' : '#C9A468'}" opacity="${R1((0.16 + 0.22 * (1 - v)) * (0.5 + 0.8 * D) * 100) / 100}"/>`;
  }
  s += tqE_vband('tqEdu' + Math.round(x0) + seed, x0, base - H * D * 0.55, x1 - x0, H * D * 0.55 + 10, '#D9BE86', 0, '#C9A468', 0.45 * D);
  return s;
}
// vòm cổng mở toang: vòng đá, lòng vòm đen sâu, cánh cửa gạt vào hai bên; (x, g) giữa chân; w rộng trong, h cao
function tqE_openGate(x, g, w, h, c = '#9C8E74') {
  const r = w / 2, arc = (rr, yy) => `M${x - rr} ${g} V${yy} A${rr} ${rr} 0 0 1 ${x + rr} ${yy} V${g}Z`;
  let b = `<path d="${arc(r + 20, g - h + r)}" fill="${c}" stroke="${INK2}" stroke-width="5"/>` + [...Array(13)].map((_, i) => { const a = Math.PI + i / 12 * Math.PI; return `<path d="M${R1(x + Math.cos(a) * (r + 3))} ${R1(g - h + r + Math.sin(a) * (r + 3))} L${R1(x + Math.cos(a) * (r + 20))} ${R1(g - h + r + Math.sin(a) * (r + 20))}" stroke="${INK2}" stroke-width="3"/>`; }).join('');
  b += `<path d="${arc(r, g - h + r)}" fill="#14100C" stroke="${INK2}" stroke-width="5"/>`;
  b += `<path d="${arc(r * 0.78, g - h + r + 6)}" fill="#1E1812"/><path d="${arc(r * 0.56, g - h + r + 14)}" fill="#2A2018"/><path d="${arc(r * 0.34, g - h + r + 22)}" fill="#3A2E22"/>`;
  b += `<path d="M${x - r} ${g} L${x - r * 0.34} ${g - h * 0.34} H${x + r * 0.34} L${x + r} ${g}Z" fill="#2A2218" opacity="0.9"/>`;
  // cánh cửa mở vào trong (hai bên)
  for (const sd of [-1, 1]) b += `<path d="M${x + sd * (r - 2)} ${g} V${g - h + r + 20} L${x + sd * (r - 30)} ${g - h + r + 36} V${g - 26}Z" fill="#5A3A24" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M${x + sd * (r - 8)} ${g - 40} L${x + sd * (r - 26)} ${g - 52} M${x + sd * (r - 8)} ${g - 90} L${x + sd * (r - 26)} ${g - 98}" stroke="#2A2A30" stroke-width="5"/>`;
  return b;
}
// bụi cỏ cao lay trong gió: n cọng trong khung [x0,x1]×[y0,y1], cao hmin→hmax theo độ gần (y lớn = gần = cao hơn)
function tqE_blades(n, x0, x1, y0, y1, hmin, hmax, c1, c2, seed, T, wind = 1, ink = true) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * hrnd(i, seed), u = hrnd(i, seed + 1), y = y0 + (y1 - y0) * u, h = (hmin + (hmax - hmin) * u) * (0.7 + 0.5 * hrnd(i, seed + 2)), sw = Math.sin(T * 1.7 + x * 0.012 + y * 0.004) * h * 0.2 * wind + h * 0.08 * wind;
    const d = `M${R1(x)} ${R1(y)} Q${R1(x + sw * 0.3)} ${R1(y - h * 0.55)} ${R1(x + sw)} ${R1(y - h)}`, w = 2.4 + 3.4 * u;
    if (ink && h > 36) s += `<path d="${d}" stroke="${INK2}" stroke-width="${R1(w + 2.4)}" fill="none" stroke-linecap="round"/>`;
    s += `<path d="${d}" stroke="${i % 3 ? c1 : c2}" stroke-width="${R1(w)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
// hàng dâu trồng thẳng hàng theo phối cảnh; trả {svg, count}
function tqE_mulberry(x0, x1, y0, y1, rows, T, seed = 1) {
  let s = '', cnt = 0;
  for (let r = 0; r < rows; r++) {
    const u = rows > 1 ? r / (rows - 1) : 0, y = y0 + (y1 - y0) * Math.pow(u, 1.35), k = 0.3 + 1.1 * u, gap = 66 * k, n = Math.floor((x1 - x0) / gap);
    s += `<path d="M${x0} ${R1(y + 2 * k)} H${x1}" stroke="#8A6C3C" stroke-width="${R1(5 * k)}" opacity="0.5"/><path d="M${x0} ${R1(y + 9 * k)} H${x1}" stroke="#7E9A44" stroke-width="${R1(3 * k)}" opacity="0.55"/>`;
    for (let i = 0; i < n; i++) {
      const x = x0 + gap * (i + 0.5 + (r % 2) * 0.5), c = (i + r) % 3 === 0 ? '#5A8C3C' : (i + r) % 3 === 1 ? '#6C9C46' : '#7AAA50', sw = Math.sin(T * 1.4 + x * 0.02 + r) * 1.6 * k;
      s += `<path d="M${R1(x)} ${R1(y + 4 * k)} v${R1(-11 * k)}" stroke="${INK2}" stroke-width="${R1(5 * k + 1.5)}" stroke-linecap="round"/><ellipse cx="${R1(x + sw)}" cy="${R1(y - 20 * k)}" rx="${R1(23 * k)}" ry="${R1(19 * k)}" fill="${c}" stroke="${INK2}" stroke-width="${R1(Math.max(1.6, 3 * k))}"/><path d="M${R1(x + sw - 12 * k)} ${R1(y - 24 * k)} q${R1(8 * k)} ${R1(-8 * k)} ${R1(16 * k)} ${R1(-2 * k)}" stroke="${lt_(c, 0.35)}" stroke-width="${R1(Math.max(1.4, 2.6 * k))}" fill="none" stroke-linecap="round"/>`;
      if (k > 0.8 && (i * 7 + r) % 4 === 0) s += `<circle cx="${R1(x + sw + 9 * k)}" cy="${R1(y - 14 * k)}" r="${R1(3.2 * k)}" fill="#6A2A4E"/>`;
      cnt++;
    }
  }
  return { svg: s, count: cnt };
}
// đống củi / khúc gỗ xếp
function tqE_logs(x, g, s = 1, c = TQ.wood3) {
  let b = `<ellipse cx="0" cy="4" rx="100" ry="11" fill="#20140A" opacity="0.2"/>`;
  const row = (y, n, off) => { let r = ''; for (let i = 0; i < n; i++) { const cx = off + i * 46; r += `<rect x="${cx - 60}" y="${y - 22}" width="120" height="40" rx="19" fill="${i % 2 ? c : dk(c, 0.12)}" stroke="${INK2}" stroke-width="4"/><ellipse cx="${cx + 60}" cy="${y - 2}" rx="12" ry="19" fill="${lt_(c, 0.3)}" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="${cx + 60}" cy="${y - 2}" rx="5" ry="9" fill="none" stroke="${dk(c, 0.3)}" stroke-width="2.5"/>`; } return r; };
  return _g(x, g, s, b + row(-4, 3, -50) + row(-42, 2, -26) + row(-78, 1, 0));
}
// tháp góc thành gạch (turret) nhô cao hơn tường: x giữa, g chân, w rộng, top đỉnh thân; có chòi mái
function tqE_turret(x, g, w, top, T = AT_(), o = {}) {
  const c = o.c || '#B1A28A', c2 = dk(c, 0.2), x0 = x - w / 2, h = g - top;
  let s = `<rect x="${x0}" y="${top}" width="${w}" height="${h}" fill="${c}" stroke="${INK2}" stroke-width="5"/>`;
  for (let r = 1; r < h / 34; r++) { const y = top + r * 34; s += `<path d="M${x0} ${y} H${x0 + w}" stroke="${c2}" stroke-width="2.5" opacity="0.8"/>`; for (let i = 0; i < w / 60; i++) s += `<path d="M${R1(x0 + i * 60 + (r % 2 ? 30 : 0))} ${y} v34" stroke="${c2}" stroke-width="2.5" opacity="0.8"/>`; }
  s += `<rect x="${x0}" y="${top}" width="${R1(w * 0.28)}" height="${h}" fill="#FFFFFF" opacity="0.07"/><rect x="${R1(x0 + w * 0.7)}" y="${top}" width="${R1(w * 0.3)}" height="${h}" fill="#000000" opacity="0.08"/>`;
  // gờ đỡ (corbel) + lỗ châu mai
  s += `<rect x="${x0 - 14}" y="${top - 18}" width="${w + 28}" height="30" fill="${dk(c, 0.1)}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${R1(x0 - 4 + i * (w + 8) / 5.5)} ${top + 12} v18" stroke="${INK2}" stroke-width="4"/>`;
  const n = 4; for (let i = 0; i < n; i++) s += `<rect x="${R1(x0 - 12 + i * (w + 24) / n)}" y="${top - 58}" width="${R1((w + 24) / n - 16)}" height="42" fill="${lt_(c, 0.06)}" stroke="${INK2}" stroke-width="4"/>`;
  // khe bắn tên
  for (let i = 0; i < 2; i++) s += `<rect x="${R1(x - 6 + (i ? 30 : -30))}" y="${top + 70 + i * 90}" width="12" height="44" rx="3" fill="#2A241E" stroke="${INK2}" stroke-width="3"/>`;
  return s;
}

// ---------- Thành Nam Quận (Kinh Châu), ban ngày, nhìn từ ngoài: Triệu Vân cắm cờ trên tường
// Cổng ở TRÁI-giữa (x≈520), đoạn tường phẳng x≈830–1520 (đầu tường phẳng y≈340–380, giữa khung) để đặt Triệu Vân; cờ TRIỆU hai bên, tháp góc phải. o: (không có)
function bg_nam_quan(t, o = {}) {
  const T = _T(t);
  const WT = 380, WG = 700;            // đầu tường / chân tường
  let s = wxSky(t, { id: 'nqSk', c1: '#7DB7DA', c2: '#EEF3E2', birds: false });
  s += tqE_glow(1520, 250, 260, '#FFF1C0', 0.35, null, 'nqsun');
  s += wxPeaks(430, '#A5BCC8', 4, 1.0) + wxMist(405, 0.45, '#F4F6EC', T) + wxPeaks(480, '#86A894', 9, 0.6) + wxMist(470, 0.3, '#F4F6EC', T + 2);
  // thành phố sau tường: mái nhà, ngọn cây (chỉ hai bên, giữa để trời thoáng)
  s += [[1590, 390]].map(([x, y]) => `<rect x="${x - 120}" y="${y + 20}" width="240" height="60" fill="#C9B896" stroke="${INK2}" stroke-width="4"/>` + wxRoof(x, y + 20, 300, 80, { c: '#5C5A56', tip: TQ.gold, lip: 8 })).join('');
  s += farTrees(10, 380, '#5E8248', 21, 1180, 330) + [[1350, 372, 0.34], [1500, 376, 0.28]].map(([x, y, k]) => treeD(x, y, k, { c: '#6E9650', noShadow: true })).join('');
  // tường thành
  s += tqWallD(-40, 1960, WG, WG - WT, { c: '#AA9C84' });
  s += [...Array(150)].map((_, i) => { const r = 1 + Math.floor(hrnd(i, 81) * 8), ci = Math.floor(hrnd(i, 82) * 28), x = -40 + ci * 70 + (r % 2 ? 35 : 0), y = WT + r * 34; return `<rect x="${x}" y="${y}" width="70" height="34" fill="${hrnd(i, 83) > 0.5 ? '#FFFFFF' : '#2A2018'}" opacity="${R1(0.05 + hrnd(i, 84) * 0.07)}"/>`; }).join('');
  s += tqE_vband('nqWs', 0, WT, 1920, 330, '#000000', 0.0, '#2A2A20', 0.22);
  s += tqE_vband('nqWh', 0, WT + 4, 1920, 36, '#2A2A20', 0.3, '#2A2A20', 0);
  // chân tường đá + vết ẩm + rêu
  s += `<rect x="-40" y="646" width="2000" height="56" fill="#8A806C" stroke="${INK2}" stroke-width="4"/>` + [...Array(46)].map((_, i) => `<path d="M${i * 44 + (i % 2) * 14} 646 v${i % 2 ? 56 : 28}" stroke="${dk('#8A806C', 0.3)}" stroke-width="2.5"/>`).join('') + `<path d="M-40 674 H1960" stroke="${dk('#8A806C', 0.3)}" stroke-width="2.5"/>`;
  s += [...Array(16)].map((_, i) => { const x = 40 + hrnd(i, 61) * 1840, h = 50 + hrnd(i, 62) * 120; return `<path d="M${R1(x)} ${WT + 6} q${R1(6 - hrnd(i, 64) * 12)} ${R1(h / 2)} ${R1(hrnd(i, 65) * 8)} ${R1(h)}" stroke="${dk('#AA9C84', 0.35)}" stroke-width="${R1(5 + hrnd(i, 63) * 8)}" fill="none" stroke-linecap="round" opacity="0.22"/>`; }).join('') + [...Array(10)].map((_, i) => { const x = 20 + hrnd(i, 71) * 1880; return `<path d="M${R1(x)} 646 q${R1(10 + hrnd(i, 72) * 20)} -22 ${R1(30 + hrnd(i, 73) * 30)} -6 q-8 -16 -30 -4Z" fill="#6E8A4A" opacity="0.6"/>`; }).join('');
  // trụ bổ tường hai bên đoạn phẳng
  for (const px of [800, 1540]) s += `<rect x="${px - 20}" y="${WT - 12}" width="40" height="${WG - WT + 12}" fill="${lt_('#AA9C84', 0.08)}" stroke="${INK2}" stroke-width="4"/><rect x="${px - 28}" y="${WT - 22}" width="56" height="14" fill="${dk('#AA9C84', 0.1)}" stroke="${INK2}" stroke-width="3.5"/>`;
  // khe tên + ô gạch loang trên đoạn phẳng
  s += [880, 1010, 1140, 1270, 1400].map((x, i) => `<rect x="${x}" y="${520 + (i % 2) * 40}" width="12" height="46" rx="3" fill="#2A241E" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += [[900, 460, 90], [1260, 600, 120], [640, 612, 80]].map(([x, y, w]) => `<path d="M${x} ${y} h${w}" stroke="${dk('#AA9C84', 0.3)}" stroke-width="3" opacity="0.5"/>`).join('');
  // lầu cổng (đóng chặt, cầu treo kéo lên)
  s += tqGateD(520, WG, 1, T, { open: false, w: 600, h: WG - WT });
  // vòng đá quanh cổng + giá đuốc chưa thắp
  s += `<path d="M418 ${WG} V${WG - 150} A102 102 0 0 1 622 ${WG - 150} V${WG}" stroke="${INK2}" stroke-width="30" fill="none" stroke-linejoin="round"/><path d="M418 ${WG} V${WG - 150} A102 102 0 0 1 622 ${WG - 150} V${WG}" stroke="#8E8470" stroke-width="22" fill="none"/>` + [...Array(11)].map((_, i) => { const a = Math.PI + i / 10 * Math.PI, x = 520 + Math.cos(a) * 102, y = WG - 150 + Math.sin(a) * 102; return `<path d="M${R1(520 + Math.cos(a) * 91)} ${R1(WG - 150 + Math.sin(a) * 91)} L${R1(520 + Math.cos(a) * 113)} ${R1(WG - 150 + Math.sin(a) * 113)}" stroke="${INK2}" stroke-width="3"/>`; }).join('') + [-1, 1].map(sd => `<path d="M${520 + sd * 150} ${WG - 190} h${sd * 26}" stroke="${INK2}" stroke-width="8" stroke-linecap="round"/><path d="M${520 + sd * 176} ${WG - 190} v-44" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M${520 + sd * 176} ${WG - 190} v-44" stroke="#6A4A2C" stroke-width="6" stroke-linecap="round"/><path d="M${520 + sd * 168} ${WG - 232} h16 l-4 -16 h-8Z" fill="#3A2A22" stroke="${INK2}" stroke-width="3"/>`).join('');
  // cánh cổng: đinh tán + vòng
  s += [-60, -20, 20, 60].map(dx => [-190, -140, -90, -40].map(dy => `<circle cx="${520 + dx * 1.0}" cy="${WG + dy}" r="5" fill="${TQ.gold2}" stroke="${INK2}" stroke-width="2"/>`).join('')).join('') + `<path d="M436 ${WG - 132} H604 M436 ${WG - 64} H604" stroke="#3A3A40" stroke-width="9"/><circle cx="508" cy="${WG - 100}" r="11" fill="none" stroke="#C9A227" stroke-width="5"/><circle cx="532" cy="${WG - 100}" r="11" fill="none" stroke="#C9A227" stroke-width="5"/>`;
  // cửa sổ lầu cổng
  s += [355, 425, 495, 565, 635].map(x => `<rect x="${x - 17}" y="${WG - 432}" width="34" height="46" fill="#3A2A22" stroke="${INK2}" stroke-width="3.5"/><path d="M${x} ${WG - 432} v46 M${x - 17} ${WG - 409} h34" stroke="#7A5A3A" stroke-width="2.5"/>`).join('');
  // cầu treo kéo lên: tấm ván dựng sát cổng + xích
  s += `<path d="M452 ${WG} L458 ${WG - 214} H582 L588 ${WG}Z" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${R1(466 + i * 25)} ${WG - 208} L${R1(461 + i * 26.5)} ${WG - 4}" stroke="${TQ.wood2}" stroke-width="3.5"/>`).join('') + [-150, -80, -14].map(dy => `<path d="M${454 + (dy + 214) * -0.03} ${WG + dy} H${586 + (dy + 214) * 0.03}" stroke="#3A3A40" stroke-width="9"/>`).join('');
  s += [[460, 421], [580, 421]].map(([x, y]) => `<path d="M${x} ${WG - 214} L${x < 520 ? 478 : 562} ${y - 26}" stroke="${INK2}" stroke-width="9"/><path d="M${x} ${WG - 214} L${x < 520 ? 478 : 562} ${y - 26}" stroke="#8A8A92" stroke-width="4.5" stroke-dasharray="9 5"/>`).join('') + `<rect x="454" y="${WG - 262}" width="132" height="30" rx="5" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/><circle cx="478" cy="${WG - 247}" r="7" fill="#8A8A92" stroke="${INK2}" stroke-width="3"/><circle cx="562" cy="${WG - 247}" r="7" fill="#8A8A92" stroke="${INK2}" stroke-width="3"/>`;
  // tháp góc phải
  s += tqE_turret(1720, WG, 210, 270, T, { c: '#B1A28A' });
  // cờ TRIỆU trên đầu tường (chừa giữa khung x≈800–1180)
  // o.flag 'nguy': thành còn trong tay Tào Nhân (cờ NGỤY xanh); mặc định: thành đã thuộc phe Thục (cờ THỤC đỏ)
  const ng = o.flag === 'nguy', fl = (x, g, h, w = 150, fh = 98) => tqFlagD(x, g, h, ng ? '#2A4E86' : TQ.shu, T, { txt: ng ? 'NGỤY' : 'THỤC', w, fh, fs: 38, tail: true, trim: TQ.gold });
  s += fl(46, WT + 4, 200, 124, 82) + fl(1236, WT + 4, 215, 126, 84) + fl(1460, WT + 4, 170, 104, 70) + fl(1700, 214, 190, 132, 88) + fl(1886, WT + 4, 185, 110, 74);
  // hào nước phía trước
  s += tqRiver(WG, T, { id: 'nqMo', c1: '#5C8C9C', c2: '#7DB0BE', rows: 34, ripOp: 0.5 });
  s += tqE_vband('nqMr', 0, WG, 1920, 70, '#1E2E34', 0.5, '#1E2E34', 0) + `<rect x="0" y="${WG}" width="1920" height="60" fill="#AA9C84" opacity="0.18"/>` + [...Array(18)].map((_, i) => `<path d="M${R1(i * 110 + Math.sin(T * 1.5 + i) * 10)} ${WG + 10 + (i % 5) * 11} h${60 + (i % 3) * 20}" stroke="${dk('#AA9C84', 0.2)}" stroke-width="4" opacity="0.35" stroke-linecap="round"/>`).join('');
  s += [[260, 760], [720, 742], [1120, 770], [1640, 748]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="40" ry="9" fill="#5E8A4A" stroke="${INK2}" stroke-width="2.5"/><ellipse cx="${x + 30}" cy="${y + 8}" rx="26" ry="6" fill="#6E9A54" stroke="${INK2}" stroke-width="2.5"/>`).join('');
  // phản chiếu cầu treo/cờ
  // bờ hào đá + đường đất
  s += `<rect x="-20" y="796" width="1960" height="28" fill="#9A907C" stroke="${INK2}" stroke-width="4.5"/>` + [...Array(40)].map((_, i) => `<path d="M${i * 50 + (i % 3) * 10} 796 v28" stroke="${dk('#9A907C', 0.3)}" stroke-width="2.5"/>`).join('');
  s += tqGroundD(824, '#9DAA62', '#6C8A48', 6, { grass: 40 });
  // lối đất rộng, vết bánh xe
  s += `<path d="M380 824 H660 L1500 1090 H-420Z" fill="#CDB588" stroke="${INK2}" stroke-width="4"/>` + `<path d="M380 824 L-420 1090 M660 824 L1500 1090" stroke="${dk('#CDB588', 0.25)}" stroke-width="5"/><path d="M450 826 L-60 1090 M590 826 L880 1090" stroke="${dk('#CDB588', 0.22)}" stroke-width="7" fill="none" opacity="0.5"/>` + `<path d="M410 800 H640 V826 H410Z" fill="#B0A48E" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<path d="M${420 + i * 4} ${806 + i * 8} H${630 - i * 4}" stroke="${dk('#B0A48E', 0.3)}" stroke-width="3"/>`).join('') + pebbles(80, 0, 840, 1920, 230, dk('#CDB588', 0.22), 8) + vGrass(110, 0, 840, 1920, 230, '#7E9A56', 12, { c2: '#A0B86C', skip: (x, y) => { const u = (y - 824) / 266, l = 380 - 800 * u, r = 660 + 840 * u; return x > l - 20 && x < r + 20; } });
  s += motes(10, 100, 830, 1700, 220, '#FFF1C8', 0.4, 3);
  // cây ven đường + bụi + biển cọc
  s += treeD(110, 900, 0.9, { c: '#6E9650' }) + treeD(1810, 892, 0.82, { c: '#78A054' }) + bushD(300, 880, 0.7, '#6E9650') + bushD(1640, 872, 0.65, '#628A48') + treeD(1470, 840, 0.4, { c: '#6E9650' });
  s += `<path d="M40 1040 q30 -20 60 0 M1760 1010 q26 -18 52 0" stroke="#6E8A4A" stroke-width="5" fill="none"/>` + footShadow(960, 1076, 420);
  return s;
}

// ---------- Ngoài trướng trại Thục, ban ngày nắng chiều
// o.south (0/1): 1 → cây nhiệt đới (dừa, chuối), đồi xanh thẫm, sương ẩm (chiến dịch phương Nam). Giữa-dưới khung thoáng.
function bg_trai_thuc(t, o = {}) {
  const T = _T(t), S = o.south ? 1 : 0;
  let s = wxSky(t, { id: 'ttSk', c1: S ? '#78BCD6' : '#8CBAD8', c2: '#FBE4B2', sun: [1490, 330, 66], sunC: '#FFDF9A', birds: true });
  s += tqE_glow(1490, 380, 420, '#FFE2A0', 0.3, 260, 'ttsun');
  // núi xa, sương, đồi
  s += wxPeaks(560, S ? '#86AE9C' : '#A4B2BE', 3, S ? 0.55 : 0.75) + wxMist(520, S ? 0.55 : 0.4, '#F7EFD8', T) + wxPeaks(620, S ? '#6C9A7C' : '#8A9E96', 8, 0.4) + wxMist(600, 0.35, '#F7EFD8', T + 2);
  s += rollingHills(640, S ? '#7FA862' : '#A2AE6C', S ? '#6C9650' : '#94A25E', S ? '#5E8844' : '#869654');
  s += farTrees(46, 650, S ? '#4E7A44' : '#6C8A4E', 33);
  // đất phẳng
  s += tqGroundD(712, S ? '#B4AA6C' : '#C6AE7C', S ? '#5E8A44' : '#8A9A56', 5, { grass: 90 });
  s += `<ellipse cx="900" cy="900" rx="900" ry="150" fill="${S ? '#C8BE84' : '#D8C08C'}" opacity="0.55"/>`;
  // lối đất mòn từ trại ra cổng rào + vết bánh xe, sỏi
  s += `<path d="M900 758 L1060 758 L1500 1090 H300Z" fill="#DCC590" opacity="0.65"/><path d="M930 760 Q760 900 520 1090 M1040 760 Q1150 900 1330 1090" stroke="${dk('#C6AE7C', 0.25)}" stroke-width="6" fill="none" opacity="0.5"/>` + pebbles(50, 0, 730, 1920, 340, dk('#C6AE7C', 0.28), 11);
  // hàng xa: lều nhỏ sau hàng cọc
  s += [940, 1090, 1250, 1410, 1560].map((x, i) => tqTentD(x, 748 + (i % 2) * 6, 0.3, { c: '#B4503A', band: TQ.gold })).join('');
  s += tqPalisade(820, 1700, 758, 62, { c: '#8A6038', gap: 30 });
  s += tqFlagD(1000, 756, 160, TQ.shu, T, { txt: 'HÁN', w: 90, fh: 60, fs: 28, pw: 7 }) + tqFlagD(1330, 756, 180, TQ.shu, T, { txt: 'HÁN', w: 90, fh: 60, fs: 28, pw: 7 });
  // cây xa
  if (S) s += tqE_palm(880, 745, 0.5, T, { lean: 30 }) + tqE_palm(1720, 750, 0.55, T, { lean: -30 }) + tqE_banana(1800, 756, 0.4, T);
  else s += pineD(850, 744, 0.4) + treeD(1760, 752, 0.38, { c: '#7C9A54' }) + pineD(1840, 750, 0.45);
  // lều chính bên trái (đỏ gạch dải vàng)
  s += footShadow(260, 880, 300) + tqTentD(260, 868, 0.95, { c: '#B4503A', band: TQ.gold, open: true });
  s += footShadow(620, 812, 190) + tqTentD(620, 806, 0.62, { c: '#AA4833', band: TQ.gold });
  s += footShadow(1560, 842, 220) + tqTentD(1560, 838, 0.72, { c: '#B4503A', band: TQ.gold });
  // cờ HÁN lớn
  s += tqFlagD(478, 880, 460, TQ.shu, T, { txt: 'HÁN', w: 170, fh: 112, fs: 50, tail: true }) + tqFlagD(1370, 846, 360, TQ.shu, T, { txt: 'HÁN', w: 140, fh: 92, fs: 42, tail: true });
  // củi, vò nước, chòi cắm cọc dây thừng
  s += tqE_logs(800, 872, 0.5) + `<path d="M395 868 L330 884 M130 860 L196 884" stroke="${INK2}" stroke-width="4"/><path d="M718 806 L690 826" stroke="${INK2}" stroke-width="3.5"/>` + `<path d="M-30 0 Q-40 -50 0 -64 Q40 -50 30 0Z" transform="translate(1440 884)" fill="#B9855A" stroke="${INK2}" stroke-width="4"/><ellipse cx="1440" cy="820" rx="22" ry="7" fill="#6A4A30" stroke="${INK2}" stroke-width="3"/>`;
  // giá giáo + trống giữa-xa (nhỏ)
  s += tqSpearRack(760, 790, 0.5) + tqDrumD(1180, 784, 0.55, TQ.shu);
  // bếp lửa + nồi, hòm lương bên phải
  s += tqE_cookfire(1700, 940, 0.78, T, { glow: 0.2, smoke: '#D8D0C0' }) + tqE_sacks(1840, 1012, 0.8) + crateD(1620, 1040, 0.6, '#B8925E') + crateD(1736, 1050, 0.52, '#A8824E') + barrelD(1500, 1010, 0.5);
  // tiền cảnh trái: cây/chuối + cỏ
  if (S) s += tqE_banana(70, 1030, 0.85, T) + tqE_palm(180, 1050, 0.8, T, { lean: 50, h: 400 }) + tqE_banana(350, 1060, 0.55, T);
  else s += treeD(60, 1060, 0.78, { c: '#7C9A54' }) + bushD(330, 1050, 0.8, '#6E8A4A');
  s += wxGrassSides(1000, S ? '#4E8044' : '#7A9650', S ? '#6EA050' : '#98B060', 8, [520, 1380]);
  // tia nắng chiều ấm phủ nhẹ
  s += tqE_vband('ttWarm', 0, 0, 1920, 1080, '#FFC070', 0.0, '#FF9A40', 0.1);
  s += motes(18, 200, 520, 1500, 420, '#FFF1C8', 0.5, 5) + footShadow(960, 1076, 420);
  return s;
}

// ---------- Trại Ngụy ban đêm trăng (Tư Mã Ý đi xem trại / mừng thấy sao đỏ rơi / thở dài)
// Lều navy dải bạc, cờ Ngụy (chữ thưa), tháp canh, đuốc + đống lửa có quầng, cọc buộc ngựa + máng cỏ, sương nhẹ. Đất phẳng phía trước. o: (không có)
function bg_trai_nguy(t, o = {}) {
  const T = _T(t), SIL = '#C9D3E6';
  let s = skyGrad('tnSk', '#121C38', '#40527A');
  s += starsD(80, 380, 12) + tqE_glow(1470, 190, 330, '#CFE0F4', 0.3, null, 'tnmoon') + `<circle cx="1470" cy="190" r="62" fill="#F2EED8" stroke="#D8D4BC" stroke-width="3"/><circle cx="1452" cy="176" r="12" fill="#D8D4BC" opacity="0.7"/><circle cx="1490" cy="208" r="8" fill="#D8D4BC" opacity="0.7"/><circle cx="1484" cy="166" r="6" fill="#D8D4BC" opacity="0.6"/>`;
  s += wxPeaks(560, '#2E3E60', 5, 0.8) + wxMist(540, 0.32, '#8FA0C0', T) + wxPeaks(630, '#24324E', 2, 0.45) + farTrees(40, 650, '#1E2E40', 17);
  s += tqGroundD(690, '#3C4E62', '#52706A', 5, { grass: 70 });
  s += tqE_glow(1300, 860, 760, '#A9C0E0', 0.14, 220, 'tnml');
  // hàng xa: cọc rào, lều nhỏ sáng đèn, tháp canh
  s += tqE_glow(820, 720, 140, '#FFB84A', 0.35, 40, 'tnf1') + tqE_glow(1180, 720, 140, '#FFB84A', 0.3, 40, 'tnf2');
  s += [760, 900, 1060, 1230, 1390].map((x, i) => tqTentD(x, 726 + (i % 2) * 6, 0.3, { c: '#3C4E7E', band: SIL, lit: true })).join('');
  s += tqPalisade(560, 1780, 744, 70, { c: '#4A3C34', gap: 30 });
  s += tqTowerD(1580, 744, 0.7, T, { lamp: true }) + tqTowerD(460, 740, 0.6, T, { lamp: true });
  s += tqFlagD(980, 744, 190, lt_(TQ.wei, 0.12), T, { w: 90, fh: 62, pw: 7, trim: SIL }) + tqFlagD(1300, 744, 170, lt_(TQ.wei, 0.12), T, { w: 90, fh: 62, pw: 7, trim: SIL });
  s += tqFog([[742, 70, 0.3]], T, '#8FA0C0', { wisps: false });
  // lều chính: bên trái (lều soái, cờ TƯ MÃ), bên phải
  s += tqE_glow(300, 800, 250, '#FFB84A', 0.22, 110, 'tnt1') + footShadow(300, 870, 300) + tqTentD(300, 866, 0.95, { c: '#44588E', band: SIL, lit: true });
  s += footShadow(660, 808, 180) + tqTentD(660, 804, 0.6, { c: '#3C4E80', band: SIL, lit: true });
  s += tqE_glow(1600, 830, 250, '#FFB84A', 0.22, 110, 'tnt2') + footShadow(1600, 862, 260) + tqTentD(1600, 858, 0.8, { c: '#44588E', band: SIL, lit: true });
  s += tqFlagD(500, 872, 430, lt_(TQ.wei, 0.1), T, { txt: 'TƯ MÃ', w: 170, fh: 110, fs: 40, tail: true, trim: SIL, txtC: SIL }) + tqFlagD(1420, 840, 330, lt_(TQ.wei, 0.1), T, { txt: 'NGỤY', w: 140, fh: 92, fs: 40, tail: true, trim: SIL, txtC: SIL });
  // cọc buộc ngựa + máng cỏ, giá giáo, trống
  s += tqE_hitch(1180, 800, 0.62, '#5E4A38') + tqE_hitch(820, 786, 0.5, '#5E4A38') + tqSpearRack(960, 790, 0.5) + tqDrumD(1060, 786, 0.5, TQ.wei);
  // đống lửa trại + đuốc (quầng ấm)
  s += tqE_bonfire(1260, 940, 0.78, T, { glow: 0.5 }) + tqE_bonfire(560, 930, 0.6, T, { glow: 0.45 });
  s += tqTorchD(120, 1030, 1.1, T, { glow: false }) + tqTorchD(1820, 1020, 1.05, T, { glow: false }) + tqTorchD(790, 800, 0.55, T, { glow: false }) + tqE_glow(790, 640, 150, '#FFC060', 0.3, null, 'tnth3');
  s += tqE_glow(120, 780, 360, '#FFC060', 0.34, null, 'tnth1') + tqE_glow(1820, 780, 360, '#FFC060', 0.34, null, 'tnth2');
  // thùng, hòm
  s += crateD(1760, 1048, 0.55, '#6A5238') + barrelD(1690, 1040, 0.5, '#5E4630');
  s += tqFog([[900, 120, 0.22]], T, '#9AAAC8') + wxGrassSides(1020, '#4A6660', '#5E7E72', 8, [440, 1500]);
  s += motes(20, 100, 600, 1700, 400, '#FFD890', 0.45, 7) + footShadow(960, 1076, 400);
  return s;
}

// ---------- Tây Thành (không thành kế): thành nhỏ nhìn thẳng, ban công gỗ lầu cổng ở y≈556–604 (chỗ Lượng gảy đàn; phía sau để trống sáng)
// Cổng chính mở toang (vòm đen) + hai cổng phụ mở, cột cờ trống trơn, đường lát đá quét sạch + chổi + lá khô dồn góc, bụi xa quân Ngụy. o.dust 0..1 (mặc định 0.5) cường độ bụi.
// lan can lầu Tây Thành (vẽ lại đè lên nhân vật đứng sau lan can)
function tyRail(WT = 604) {
  return `<path d="M690 ${WT - 6} H1230" stroke="${INK2}" stroke-width="12"/><path d="M690 ${WT - 6} H1230" stroke="#7A4A2C" stroke-width="6"/>` + [...Array(11)].map((_, i) => `<path d="M${R1(706 + i * 50.8)} ${WT - 6} V${WT - 50}" stroke="${INK2}" stroke-width="9" stroke-linecap="round"/><path d="M${R1(706 + i * 50.8)} ${WT - 6} V${WT - 50}" stroke="#A8683C" stroke-width="4.5" stroke-linecap="round"/>`).join('') + `<path d="M676 ${WT - 52} H1244" stroke="${INK2}" stroke-width="17" stroke-linecap="round"/><path d="M676 ${WT - 52} H1244" stroke="#B87848" stroke-width="9" stroke-linecap="round"/><path d="M690 ${WT - 29} H1230" stroke="${INK2}" stroke-width="7"/><path d="M690 ${WT - 29} H1230" stroke="#9A6A40" stroke-width="3"/>`;
}
function bg_tay_thanh(t, o = {}) {
  const T = _T(t), D = Math.max(0, Math.min(1, o.dust ?? 0.5)), GY = 890, WT = 604, BC = '#C9B48C';
  let s = skyGrad('tyk', '#AFCFD8', '#F8E6B6');
  s += tqE_glow(430, 500, 420, '#FFF0B8', 0.5, 260, 'tysun') + `<circle cx="430" cy="500" r="56" fill="#FFF3C8" opacity="0.85"/>`;
  s += [[300, 150, 520], [1180, 100, 620], [820, 250, 440], [1560, 300, 380]].map(([x, y, w], i) => `<path d="M${x} ${y} q${w / 2} -18 ${w} 0 q${-w / 2} 16 ${-w} 0Z" fill="#FFF6DC" opacity="${0.35 + 0.1 * (i % 2)}"/>`).join('');
  s += wxPeaks(560, '#BFC6C0', 6, 0.7) + wxMist(540, 0.45, '#F8EBC8', T) + wxPeaks(590, '#AEB4A0', 1, 0.35);
  s += `<path d="M0 590 Q300 566 640 584 T1300 580 T1920 586 V640 H0Z" fill="#C8BE8E" stroke="${INK2}" stroke-width="3.5"/>` + farTrees(30, 584, '#8E9468', 41);
  s += tqE_dust(1180, 1980, 596, 380, T, D, 3) + tqE_dust(-60, 520, 596, 190, T + 2, D * 0.7, 9);
  s += tqE_dust(1250, 1920, 604, 150, T + 4, D * 0.8, 5);
  if (D > 0.3) s += `<g opacity="${R1(0.8 * Math.min(1, D) * 100) / 100}">` + [1650, 1700, 1750, 1800, 1850].map((x, i) => `<path d="M${x} 600 V${512 - (i % 3) * 16}" stroke="#2E3A5E" stroke-width="3.5"/><path d="M${x} ${512 - (i % 3) * 16} l18 5 l-18 10Z" fill="#2E3A5E"/>`).join('') + `</g>`;
  // sau tường: hai cây bách + mái nhà
  s += pineD(190, 604, 0.7, '#6E7E58') + pineD(1740, 604, 0.62, '#6E7E58') + `<rect x="1360" y="520" width="220" height="90" fill="#D8C8A0" stroke="${INK2}" stroke-width="4"/><rect x="1440" y="548" width="60" height="62" fill="#5A3A24" stroke="${INK2}" stroke-width="3.5"/>` + wxRoof(1470, 522, 250, 66, { c: '#6A6458', tip: TQ.gold, lip: 8 });
  // tường hai bên (đoạn giữa là khối cổng)
  s += tqWallD(-40, 690, GY, GY - WT, { c: BC }) + tqWallD(1225, 1960, GY, GY - WT, { c: BC });
  s += tqE_vband('tyWs', 0, WT, 1920, GY - WT, '#000000', 0.0, '#2A2418', 0.22);
  // cổng phụ hai bên (mở)
  s += tqE_openGate(430, GY, 110, 150) + tqE_openGate(1490, GY, 110, 150);
  // khối cổng chính
  s += `<rect x="690" y="${WT}" width="540" height="${GY - WT}" fill="${lt_(BC, 0.06)}" stroke="${INK2}" stroke-width="5"/>`;
  for (let r = 1; r < (GY - WT) / 34; r++) { const y = WT + r * 34; s += `<path d="M690 ${y} H1230" stroke="${dk(BC, 0.2)}" stroke-width="2.5" opacity="0.8"/>`; for (let i = 0; i < 8; i++) s += `<path d="M${690 + i * 70 + (r % 2 ? 35 : 0)} ${y} v34" stroke="${dk(BC, 0.2)}" stroke-width="2.5" opacity="0.8"/>`; }
  s += `<rect x="690" y="${WT}" width="540" height="${GY - WT}" fill="none" stroke="${INK2}" stroke-width="5"/>`;
  s += tqE_openGate(960, GY, 220, 190, '#A89A7C');
  // biển TÂY THÀNH
  s += `<rect x="868" y="650" width="184" height="40" rx="5" fill="#5A3A24" stroke="#C9A227" stroke-width="5"/><text x="960" y="679" font-family="${FH}" font-size="26" fill="#F0D890" text-anchor="middle">TÂY THÀNH</text>`;
  // ban công gỗ: sàn nhô ra + đỡ + lan can thấp
  s += `<path d="M740 ${WT + 30} L760 ${WT + 70} H800 Z M1180 ${WT + 30} L1160 ${WT + 70} H1120 Z M960 ${WT + 30} L940 ${WT + 66} H980Z" fill="#7A4A2C" stroke="${INK2}" stroke-width="4" opacity="0"/>`;
  s += [724, 840, 1080, 1196].map(x => `<path d="M${x - 22} ${WT + 32} L${x} ${WT + 62} L${x + 22} ${WT + 32}Z" fill="#7A4A2C" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  s += `<path d="M684 ${WT} L710 ${WT - 26} H1210 L1236 ${WT}Z" fill="#C89A62" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>` + [...Array(10)].map((_, i) => `<path d="M${R1(710 + i * 55.6)} ${WT - 26} L${R1(698 + i * 58.2)} ${WT}" stroke="#8A5E34" stroke-width="2.5"/>`).join('');
  s += `<rect x="676" y="${WT}" width="568" height="32" fill="#A87A4A" stroke="${INK2}" stroke-width="5"/>` + [...Array(11)].map((_, i) => `<path d="M${R1(704 + i * 51)} ${WT} v32" stroke="#7A5230" stroke-width="3"/>`).join('') + `<rect x="676" y="${WT}" width="568" height="8" fill="#D8B078" opacity="0.7"/>`;
  s += `<path d="M690 ${WT} V${WT - 52} M1230 ${WT} V${WT - 52}" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/>`;
  s += `<defs><linearGradient id="tySh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1E10" stop-opacity="0.35"/><stop offset="1" stop-color="#2A1E10" stop-opacity="0"/></linearGradient></defs><rect x="690" y="${WT + 32}" width="540" height="60" fill="url(#tySh)"/>`;
  // phía sau: phòng lầu mở, tường nền kem sáng
  s += `<rect x="640" y="372" width="640" height="${WT - 372}" fill="#E8D5A4" stroke="${INK2}" stroke-width="5"/>` + tqE_glow(960, 470, 360, '#FFF6D0', 0.85, 120, 'tybk') + tqE_vband('tyBk', 700, 372, 520, WT - 372 - 26, '#FFF3C4', 0.9, '#F2DDA6', 0.9);
  s += tqE_glow(960, 500, 300, '#FFFBE6', 0.7, 100, 'tybk2') + tqE_vband('tyEave', 700, 372, 520, 80, '#6A4A2A', 0.3, '#6A4A2A', 0) + [800, 880, 1040, 1120].map(x => `<path d="M${x} 400 V${WT - 40}" stroke="#E4CE98" stroke-width="3" opacity="0.5"/>`).join('') + `<path d="M700 ${WT - 36} H1220" stroke="#D8BE82" stroke-width="3" opacity="0.5"/>`;
  // vách hai bên + song cửa
  for (const [x0] of [[640], [1220]]) s += `<rect x="${x0}" y="372" width="60" height="${WT - 372 - 26}" fill="#C8B080" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${x0 + 8}" y="${408 + i * 4}" width="44" height="${120}" fill="#E8D8A8" stroke="${INK2}" stroke-width="3"/>`).join('').slice(0, 0) + `<rect x="${x0 + 8}" y="410" width="44" height="130" fill="#EADDB0" stroke="${INK2}" stroke-width="3"/>` + [1, 2, 3].map(i => `<path d="M${x0 + 8 + i * 11} 410 v130" stroke="#8A6A3E" stroke-width="2.5"/>`).join('') + [1, 2, 3, 4].map(i => `<path d="M${x0 + 8} ${410 + i * 26} h44" stroke="#8A6A3E" stroke-width="2.5"/>`).join('');
  // xà ngang + đấu củng + cuộn rèm tre
  s += `<rect x="650" y="340" width="620" height="38" fill="#8A3A2A" stroke="${INK2}" stroke-width="5"/>` + [...Array(14)].map((_, i) => `<rect x="${R1(668 + i * 43.5)}" y="350" width="20" height="18" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2.5"/>`).join('') + `<rect x="716" y="378" width="488" height="18" rx="9" fill="#D2B070" stroke="${INK2}" stroke-width="4"/>` + [...Array(14)].map((_, i) => `<path d="M${R1(732 + i * 34.6)} 380 v14" stroke="#8A6A3E" stroke-width="2"/>`).join('') + `<path d="M760 396 v22 M1160 396 v22" stroke="${INK2}" stroke-width="3"/>`;
  // cột (phải vẽ sau để đè lên rèm) + chân tảng
  for (const px of [700, 1220]) s += `<rect x="${px - 15}" y="372" width="30" height="${WT - 372 - 26 + 26}" fill="#9A3A2A" stroke="${INK2}" stroke-width="5"/><path d="M${px - 6} 384 V${WT - 40}" stroke="#C86A52" stroke-width="4" opacity="0.7"/><rect x="${px - 23}" y="${WT - 14}" width="46" height="14" fill="#CFC6B2" stroke="${INK2}" stroke-width="3.5"/><rect x="${px - 20}" y="364" width="40" height="14" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`;
  // lan can
  s += tyRail(WT);
  // mái lầu
  s += wxRoof(960, 340, 820, 134, { c: '#4E5A56', tip: TQ.gold, ridge: '#2E3A36', lip: 14, pearl: true });
  // cột cờ trống trơn (đã hạ hết cờ)
  s += tqE_barePole(536, WT + 2, 470, T) + tqE_barePole(1384, WT + 2, 470, T) + tqE_barePole(290, WT + 2, 300, T) + tqE_barePole(1640, WT + 2, 300, T) + tqE_barePole(130, WT + 2, 250, T) + tqE_barePole(1790, WT + 2, 250, T);
  // lát đá quét sạch
  s += wxPaving(GY, '#D8CCAE', { vy: 700 });
  s += `<rect x="0" y="${GY}" width="1920" height="12" fill="${dk('#D8CCAE', 0.25)}" opacity="0.45"/>` + `<path d="M690 ${GY} H1230" stroke="${INK2}" stroke-width="4"/>`;
  s += [...Array(26)].map((_, i) => { const x = 40 + hrnd(i, 91) * 1840, y = 925 + hrnd(i, 92) * 130, w = 90 + hrnd(i, 93) * 140; return `<path d="M${R1(x)} ${R1(y)} q${R1(w / 2)} ${R1(-16 - hrnd(i, 94) * 14)} ${R1(w)} ${R1(hrnd(i, 95) * 10 - 5)}" stroke="#FFF6E0" stroke-width="3" fill="none" opacity="0.55" stroke-linecap="round"/>`; }).join('');
  // chổi + lá khô dồn góc
  s += tqE_broom(626, 896, 0.78, 9) + tqE_broom(1318, 894, 0.78, -9) + tqE_broom(1760, 1030, 0.8, -74);
  s += [...Array(28)].map((_, i) => { const x = 1560 + hrnd(i, 101) * 170 - (i % 4) * 8, y = 1010 + hrnd(i, 102) * 40, a = hrnd(i, 103) * 180; return `<ellipse cx="${R1(x)}" cy="${R1(y - Math.pow(hrnd(i, 104), 2) * 26)}" rx="${R1(9 + hrnd(i, 105) * 7)}" ry="${R1(4 + hrnd(i, 106) * 3)}" fill="${['#B8863A', '#9A6A2A', '#C8A04A', '#8A5A28'][i % 4]}" stroke="${INK2}" stroke-width="1.8" transform="rotate(${R1(a)} ${R1(x)} ${R1(y)})"/>`; }).join('');
  s += `<ellipse cx="1650" cy="1048" rx="110" ry="12" fill="#20140A" opacity="0.14"/>`;
  // ánh chiều vàng phủ, tối nhẹ hai mép
  s += tqE_vband('tyWarm', 0, 0, 1920, 1080, '#FFD890', 0.0, '#F0B060', 0.12);
  s += `<defs><radialGradient id="tyVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#3A2A18" stop-opacity="0"/><stop offset="1" stop-color="#3A2A18" stop-opacity="0.28"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#tyVig)"/>`;
  return s;
}

// ---------- Ngũ Trượng Nguyên đêm thu: cao nguyên cỏ vàng úa, doanh trại Thục lửa nhỏ, trăng khuyết, sao dày
// Góc TRÊN-TRÁI (x<900, y<450) để trống (chỉ sao mờ) cho vệt sao đỏ rơi vẽ thêm. Cỏ lay gió. o: (không có)
function bg_ngu_truong(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('ntSk', '#0C1642', '#33477E');
  // sao: dày bên phải/trên, thưa bên trái-trên
  let st = '';
  for (let i = 0; i < 230; i++) {
    const x = hrnd(i, 201) * 1920, y = hrnd(i, 202) * 560, inHole = x < 900 && y < 450;
    if (inHole && hrnd(i, 203) > 0.28) continue;
    const r = inHole ? 1.1 + hrnd(i, 204) * 0.7 : 1.1 + hrnd(i, 204) * 2.3;
    st += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${hrnd(i, 205) > 0.85 ? '#FFE0A8' : '#EAF0FF'}" opacity="${R1((0.35 + 0.6 * Math.abs(Math.sin(T * 1.1 + i * 1.3))) * (inHole ? 0.6 : 1) * 100) / 100}"/>`;
  }
  s += tqE_glow(1250, 120, 520, '#8FA8E8', 0.16, 150, 'ngmw1') + tqE_glow(1700, 330, 420, '#8FA8E8', 0.12, 130, 'ngmw2') + st;
  // trăng khuyết lớn
  s += tqE_glow(1560, 210, 340, '#D8E4FF', 0.28, null, 'ngmoon') + `<defs><mask id="ntMk"><rect width="1920" height="1080" fill="#000"/><circle cx="1560" cy="210" r="104" fill="#fff"/><circle cx="1606" cy="186" r="92" fill="#000"/></mask></defs><rect width="1920" height="1080" fill="#F6EBC4" mask="url(#ntMk)"/>`;
  // núi xa thấp + sương, cao nguyên nhiều tầng
  s += wxPeaks(640, '#1E2C58', 4, 0.42) + `<path d="M0 650 Q260 600 560 640 T1160 630 T1920 624 V720 H0Z" fill="#2A3A62" stroke="${INK2}" stroke-width="3.5"/>` + farTrees(26, 652, '#1E2C48', 31);
  s += rollingHills(660, '#55543E', '#68633F', '#7A7446');
  s += tqGroundD(716, '#8E8650', '#B8AC62', 5, { grass: 100 });
  s += tqE_glow(1200, 880, 900, '#BCCCF0', 0.12, 220, 'ngml');
  // doanh trại xa: lều nhỏ sáng lửa, cọc rào, lửa nhỏ
  for (const x of [640, 780, 930, 1090, 1250, 1400, 1540, 1700]) s += tqE_glow(x, 738, 90, '#FFB84A', 0.3, 30, 'ngf' + x);
  s += [640, 780, 930, 1090, 1250, 1400, 1540, 1700].map((x, i) => tqTentD(x, 744 + (i % 2) * 8, 0.27, { c: '#8A4636', band: TQ.gold, lit: true })).join('');
  s += tqPalisade(560, 1800, 762, 56, { c: '#5A4634', gap: 28 });
  s += [760, 1160, 1480].map(x => tqFlagD(x, 760, 150, TQ.shu, T, { w: 70, fh: 48, pw: 6 })).join('');
  s += [700, 1020, 1340, 1620].map((x, i) => tqE_bonfire(x, 770 + (i % 2) * 8, 0.24, T, { glow: 0.35, smoke: false, gr: 0.6 })).join('');
  s += tqE_blades(110, 0, 1920, 730, 800, 20, 44, '#A89E5C', '#C2B66C', 41, T, 1, false);
  // lều gần
  s += tqE_glow(330, 840, 260, '#FFB84A', 0.22, 110, 'ngt1') + footShadow(330, 876, 280) + tqTentD(330, 872, 0.88, { c: '#8C4838', band: TQ.gold, lit: true });
  s += tqE_glow(1560, 830, 260, '#FFB84A', 0.22, 110, 'ngt2') + footShadow(1560, 862, 260) + tqTentD(1560, 858, 0.78, { c: '#8C4838', band: TQ.gold, lit: true });
  s += footShadow(700, 812, 170) + tqTentD(700, 808, 0.56, { c: '#7E4030', band: TQ.gold, lit: true });
  s += tqFlagD(560, 880, 380, TQ.shu, T, { txt: 'HÁN', w: 150, fh: 100, fs: 44, tail: true }) + tqFlagD(1380, 850, 300, TQ.shu, T, { w: 120, fh: 80, tail: true });
  // xe gỗ nhỏ, giá giáo, trống, lửa, đuốc
  s += tqE_cart(1130, 826, 0.5) + tqSpearRack(880, 800, 0.46) + tqDrumD(1000, 800, 0.46, TQ.shu) + crateD(1290, 830, 0.36, '#7A6040');
  s += tqE_bonfire(900, 930, 0.62, T, { glow: 0.5 }) + tqE_bonfire(1700, 960, 0.55, T, { glow: 0.45, smoke: false });
  s += tqTorchD(150, 1030, 1.0, T, { glow: false }) + tqE_glow(150, 780, 340, '#FFC060', 0.3, null, 'ngth1') + tqTorchD(1010, 700, 0.5, T, { glow: false });
  // cỏ vàng úa lay gió: xa mảnh → gần cao
  s += tqE_blades(26, 0, 520, 880, 1080, 70, 170, '#B8AA64', '#D8CC80', 43, T, 1.2) + tqE_blades(26, 1400, 1920, 880, 1080, 70, 170, '#B8AA64', '#D8CC80', 44, T, 1.2) + tqE_blades(22, 0, 360, 980, 1080, 130, 240, '#C0B26A', '#E0D488', 47, T, 1.4) + tqE_blades(22, 1560, 1920, 980, 1080, 130, 240, '#C0B26A', '#E0D488', 49, T, 1.4) + tqE_blades(40, 520, 1400, 900, 1010, 24, 56, '#B8AA64', '#D8CC80', 45, T, 1, false);
  // lá khô bay theo gió
  s += [...Array(7)].map((_, i) => { const x = ((hrnd(i, 211) * 2400 + T * (60 + 30 * hrnd(i, 212))) % 2200) - 150, y = 760 + hrnd(i, 213) * 260 + Math.sin(T * 2 + i) * 24; return `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="9" ry="4" fill="#B8923A" stroke="${INK2}" stroke-width="1.8" transform="rotate(${R1(T * 90 + i * 40)} ${R1(x)} ${R1(y)})"/>`; }).join('');
  s += tqFog([[790, 100, 0.2]], T, '#8FA2CC', { wisps: false }) + motes(16, 100, 600, 1700, 400, '#FFD890', 0.4, 9) + footShadow(960, 1076, 400);
  return s;
}

// ---------- Thành Đô buổi chiều (cảnh kết): ruộng dâu thẳng hàng, ruộng bậc thang, nhà tranh, bàn gỗ giản dị
// Chi tiết dồn bên trái; NỬA PHẢI (x>700) chỉ trời + ruộng dâu thấp để chừa màn kết. Mặt bàn y≈880 (x≈160–680). o: (không có)
function bg_thanh_do(t, o = {}) {
  const T = _T(t);
  let s = skyGrad('tdSk', '#9CC4DC', '#FBE2B4');
  s += tqE_glow(1500, 470, 520, '#FFE0A0', 0.55, 300, 'tdsun') + `<circle cx="1500" cy="440" r="56" fill="#FFEDB8" opacity="0.9"/>`;
  s += cloudsDrift([[200, 150, 1.2, '#F8D2C0'], [760, 90, 1.5, '#F9DCCB'], [1320, 190, 1.1, '#F6C8BA'], [1760, 100, 1.3, '#F9DCCB'], [1020, 300, 1.0, '#F7D0BE']], 7);
  // đồi xa
  s += `<path d="M0 520 Q300 470 620 510 T1240 500 T1920 510 V640 H0Z" fill="#B7C7A4" stroke="${INK2}" stroke-width="3"/>` + farTrees(40, 510, '#8DA874', 53) + `<path d="M0 580 Q380 536 800 574 T1500 566 T1920 576 V660 H0Z" fill="#A3BA84" stroke="${INK2}" stroke-width="3"/>`;
  // ruộng dâu: hàng thẳng, thấp dần về phía xa
  const mb = tqE_mulberry(-40, 1960, 598, 850, 20, T, 3);
  s += `<rect x="0" y="590" width="1920" height="320" fill="#B6C070"/>` + mb.svg;
  s += tqE_vband('tdFarMist', 0, 560, 1920, 70, '#FBE2B4', 0.0, '#FBE2B4', 0.55);
  // đồi trái + 15 khoảnh ruộng bậc thang
  s += `<path d="M-60 880 Q40 640 190 560 Q330 480 460 560 Q640 650 880 880Z" fill="#A6BE7E" stroke="${INK2}" stroke-width="4.5"/>`;
  const crops = ['#9CC060', '#D4CC64', '#7FAE50', '#C2B85A', '#8AB858'];
  for (let tr = 0; tr < 5; tr++) {
    const y0 = 596 + tr * 46, hh = 42, cx = 330, hw = 78 + tr * 62;
    for (let c = 0; c < 3; c++) {
      const w = (hw * 2) / 3, xa = cx - hw + c * w + 4, xb = xa + w - 8, col = crops[(tr * 3 + c) % 5], lean = 10;
      s += `<path d="M${R1(xa - 3)} ${y0 + hh} L${R1(xa + 5)} ${y0 + 10} Q${R1((xa + xb) / 2)} ${y0 - 4} ${R1(xb - 5)} ${y0 + 10} L${R1(xb + 3)} ${y0 + hh}Z" fill="${col}" stroke="${INK2}" stroke-width="3" stroke-linejoin="round"/>`;
      for (let k = 1; k < 5; k++) s += `<path d="M${R1(xa + k * (xb - xa) / 5)} ${R1(y0 + hh - 3)} Q${R1(xa + k * (xb - xa) / 5)} ${R1(y0 + 18)} ${R1(xa + k * (xb - xa) / 5 + (k - 2.5) * 3)} ${R1(y0 + 14)}" stroke="${dk(col, 0.25)}" stroke-width="2" fill="none" opacity="0.7"/>`;
    }
    s += `<path d="M${cx - hw - 6} ${y0 + hh + 3} Q${cx} ${y0 + hh - 6} ${cx + hw + 6} ${y0 + hh + 3}" stroke="${dk('#A6BE7E', 0.35)}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  // nhà tranh mái rạ
  s += `<ellipse cx="270" cy="584" rx="96" ry="12" fill="#20140A" opacity="0.2"/><rect x="214" y="520" width="112" height="62" fill="#D8C09A" stroke="${INK2}" stroke-width="4"/><rect x="262" y="544" width="30" height="38" fill="#5A3A24" stroke="${INK2}" stroke-width="3"/><rect x="226" y="534" width="26" height="22" fill="#4A3828" stroke="${INK2}" stroke-width="3"/><path d="M198 524 L270 462 L342 524 Q270 516 198 524Z" fill="#CDAA52" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/>` + [...Array(9)].map((_, i) => `<path d="M${R1(214 + i * 14)} 522 L${R1(246 + i * 6)} ${R1(480 + (i % 2) * 6)}" stroke="#9A7A32" stroke-width="2.5" opacity="0.8"/>`).join('') + `<path d="M320 480 v-22 h16 v28" fill="#B89A8A" stroke="${INK2}" stroke-width="3"/>` + tqSmoke(328, 456, T, 130, '#E6DAD0', 4, 3, 0.5);
  s += tqE_vband('tdHazeL', 0, 640, 1000, 260, '#FBE2B4', 0.0, '#FBE2B4', 0.0);
  // đồng cỏ tiền cảnh
  s += `<path d="M0 860 Q500 836 960 856 T1920 850 V1090 H0Z" fill="#9EB45E" stroke="${INK2}" stroke-width="4"/>` + `<path d="M0 940 Q600 912 1100 936 T1920 930 V1090 H0Z" fill="#8FA854" opacity="0.55"/>` + vGrass(110, 0, 868, 1920, 212, '#6E8A3E', 6, { c2: '#9CB860' }) + pebbles(30, 0, 880, 1920, 190, '#8A8A58', 9);
  // cây dâu lớn bên trái + bụi
  s += treeD(78, 930, 1.05, { c: '#6C9A46' }) + bushD(740, 872, 0.5, '#6E9A48');
  // bàn gỗ giản dị: mặt bàn y=880
  const bx = 150, bw = 540;
  s += `<ellipse cx="${bx + bw / 2}" cy="1062" rx="${bw / 2 + 30}" ry="16" fill="#20140A" opacity="0.2"/>`;
  s += [bx + 40, bx + bw - 40].map(x => `<path d="M${x - 14} 916 L${x - 22} 1060 H${x + 22} L${x + 14} 916Z" fill="#7A5232" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`).join('') + `<path d="M${bx + 40} 990 H${bx + bw - 40}" stroke="${INK2}" stroke-width="12"/><path d="M${bx + 40} 990 H${bx + bw - 40}" stroke="#8A6038" stroke-width="6"/>`;
  s += `<rect x="${bx - 10}" y="882" width="${bw + 20}" height="34" fill="#8A6038" stroke="${INK2}" stroke-width="5"/><path d="M${bx} 898 H${bx + bw}" stroke="#6A4628" stroke-width="3"/>`;
  s += `<path d="M${bx - 10} 882 L${bx + 24} 856 H${bx + bw - 24} L${bx + bw + 10} 882Z" fill="#B88A56" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>` + [1, 2, 3, 4, 5].map(i => `<path d="M${R1(bx - 10 + i * (bw + 20) / 6 + 4)} 882 L${R1(bx + 24 + i * (bw - 48) / 6)} 856" stroke="#8A6038" stroke-width="2.5"/>`).join('');
  // cuộn biểu trải ra, nét chữ giả (vệt mực), cuộn khác xếp chồng
  s += `<path d="M262 880 L292 858 H494 L530 880Z" fill="#F6EBCB" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${R1(300 + i * 5)} ${R1(865 + i * 3.4)} q${R1(30 + (i % 3) * 14)} -4 ${R1(70 + (i % 2) * 40)} 0 t${R1(60 + (i % 3) * 12)} 0 t${R1(30 + (i % 2) * 20)} 0" stroke="#3A302A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>`).join('') + `<rect x="250" y="866" width="14" height="18" rx="7" fill="#B8864A" stroke="${INK2}" stroke-width="3"/><rect x="522" y="866" width="14" height="18" rx="7" fill="#B8864A" stroke="${INK2}" stroke-width="3"/>`;
  s += [0, 1, 2].map(i => `<rect x="${176 + i * 6}" y="${848 - i * 14}" width="76" height="16" rx="8" fill="${['#E8D8A8', '#D8C690', '#EADCB0'][i]}" stroke="${INK2}" stroke-width="3.5"/><circle cx="${R1(178 + i * 6)}" cy="${856 - i * 14}" r="8" fill="#B8864A" stroke="${INK2}" stroke-width="3"/><path d="M${196 + i * 6} ${R1(848 - i * 14 + 8)} h28" stroke="#9A6A38" stroke-width="3"/>`).join('');
  // nghiên mực + bút gác
  s += `<path d="M560 876 L572 862 H628 L640 876Z" fill="#4A4A52" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="600" cy="868" rx="22" ry="5" fill="#1A1620"/><path d="M582 842 L632 866" stroke="${INK2}" stroke-width="9" stroke-linecap="round"/><path d="M582 842 L632 866" stroke="#B88A56" stroke-width="4.5" stroke-linecap="round"/><path d="M576 838 l-14 -14 q14 -4 20 8Z" fill="#2A2420" stroke="${INK2}" stroke-width="2.5"/>`;
  // đèn dầu nhỏ + quầng dịu
  s += tqE_glow(656, 826, 120, '#FFD890', 0.5, null, 'tdlamp') + `<path d="M644 876 Q640 858 656 856 Q672 858 668 876Z" fill="#B8864A" stroke="${INK2}" stroke-width="4"/><path d="M656 856 v-8" stroke="${INK2}" stroke-width="3.5"/><g transform="translate(656 846) scale(0.2)">${tqFlame(0, 0, 1, T, { seed: 5 })}</g>`;
  // én bay
  s += [[1100, 260, 340, 70, 0.5, 0], [1380, 340, 260, 60, 0.42, 2], [880, 200, 300, 50, 0.55, 4], [1560, 220, 220, 55, 0.47, 1], [1260, 150, 280, 40, 0.38, 3.3], [520, 330, 200, 50, 0.5, 5]].map(([cx, cy, rx, ry, sp, ph]) => tqE_swallow(cx, cy, rx, ry, sp, ph, T, 1.15)).join('');
  s += tqE_vband('tdWarm', 0, 0, 1920, 1080, '#FFD890', 0.0, '#F4A860', 0.14) + motes(18, 100, 560, 1700, 400, '#FFF1C8', 0.5, 4) + footShadow(960, 1076, 400);
  s = s.replace('<!--cnt-->', '');
  return s;
}

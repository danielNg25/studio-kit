// ===== ĐỒ NGHỀ TAM QUỐC (tập gia-cat-luong, 2026-10-17) — vật dụng quân trận/sông nước dùng chung cho mọi bg_* của tập
// Quy ước như sc_bgkit.js: khung 1920×1080, mọi hàm trả chuỗi SVG; (x, g) = vị trí chân/đường nước; s = tỉ lệ; T = AT_() thời gian.
// Màu quân: Ngụy xanh đậm (TQ.wei) · Ngô lục (TQ.wu) · Thục đỏ gạch (TQ.shu) — khớp áo lính trong chars_tq.js.
const TQ = { wei: '#34487A', wei2: '#223260', wu: '#3F7A55', wu2: '#2A5A3E', shu: '#A8402E', shu2: '#7E2C1E', gold: '#E2C25A', gold2: '#B8902A',
  wood: '#8A5E3A', wood2: '#6B4428', wood3: '#A87A4E', straw: '#D8B860', straw2: '#B8943E', cloth: '#5E8A9A', stone: '#A8A292', brick: '#9C8E7A', brick2: '#7E7260',
  sail: '#E8DCC0', water: '#6FA2B8', water2: '#4E86A0', earth: '#B89A6E', earth2: '#9A7E56' };

// ---------- lửa / khói
function tqFlame(x, g, s = 1, T = AT_(), o = {}) {
  const k = o.seed || 0, w = (i) => Math.sin(T * 9 + i * 1.7 + x * 0.05 + k) * 6;
  const tongue = (dx, h, wd, c, sw, i) => `<path d="M${R1(dx - wd)} 0 Q${R1(dx - wd * 1.1)} ${R1(-h * 0.5)} ${R1(dx + w(i) * 0.6)} ${R1(-h + w(i) * 2)} Q${R1(dx + wd * 0.9)} ${R1(-h * 0.45)} ${R1(dx + wd)} 0Z" fill="${c}" stroke="${INK2}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  let b = `<ellipse cx="0" cy="4" rx="${R1(80 * (o.wide || 1))}" ry="14" fill="#FFB43A" opacity="0.28"/>`;
  b += tongue(-34, 120, 26, '#E8531A', 4, 1) + tongue(34, 140, 28, '#E8531A', 4, 2) + tongue(0, 190, 36, '#EE6A1E', 4, 3);
  b += tongue(-14, 100, 20, '#F59A2A', 0, 4) + tongue(20, 120, 20, '#F59A2A', 0, 5) + tongue(0, 130, 24, '#F7A92E', 0, 6);
  b += tongue(0, 70, 14, '#FFE27A', 0, 7) + tongue(-22, 50, 10, '#FFE27A', 0, 8);
  return _g(x, g, s, b);
}
// cột khói bốc lên: n cụm từ (x, y) lên cao h
function tqSmoke(x, y, T = AT_(), h = 400, c = '#6E6A68', n = 7, seed = 1, op = 0.75) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const u = ((i / n) + T * 0.12) % 1, yy = y - u * h, xx = x + Math.sin(u * 5 + i + T) * (20 + 50 * u) + u * 60, r = 22 + u * 60;
    s += `<circle cx="${R1(xx)}" cy="${R1(yy)}" r="${R1(r)}" fill="${u < 0.5 ? c : lt_(c, 0.2)}" opacity="${R1(op * (1 - u) * 100) / 100}"/>`;
  }
  return s;
}
function tqTorchD(x, g, s = 1, T = AT_(), o = {}) {
  const b = `${o.glow === false ? '' : `<circle cx="0" cy="-250" r="${o.r || 150}" fill="#FFC866" opacity="0.2"/><circle cx="0" cy="-250" r="${(o.r || 150) * 0.55}" fill="#FFD98A" opacity="0.25"/>`}<path d="M0 0 V-230" stroke="${INK2}" stroke-width="14"/><path d="M0 0 V-230" stroke="${TQ.wood}" stroke-width="8"/><path d="M-14 -226 H14 L18 -250 H-18Z" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="3.5"/>`;
  return _g(x, g, s, b + `<g transform="translate(0 -246) scale(0.6)">${tqFlame(0, 0, 1, T, { seed: x })}</g>`);
}

// ---------- nước & sương
// mặt sông từ y0 xuống đáy khung; o.c1 (xa) o.c2 (gần); o.night; o.refl [[x, màu, rộng]] vệt phản chiếu
function tqRiver(y0, T = AT_(), o = {}) {
  const c1 = o.c1 || TQ.water, c2 = o.c2 || TQ.water2, id = 'rv' + R1(y0) + (o.id || '');
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="0" y="${y0}" width="1920" height="${1090 - y0}" fill="url(#${id})"/>`;
  const H = 1080 - y0, rows = o.rows || 16;
  for (let r = 0; r < rows; r++) {
    const u = (r + 0.5) / rows, y = y0 + H * Math.pow(u, 1.25), k = 0.4 + 1.6 * u, n = Math.round(8 - 4 * u);
    for (let i = 0; i < n; i++) {
      const x = ((hrnd(r, i, 31) * 2300 + T * (14 + 24 * u) * (r % 2 ? 1 : -1)) % 2200) - 150, ln = (60 + hrnd(r, i, 32) * 110) * k;
      s += `<path d="M${R1(x)} ${R1(y)} q${R1(ln * 0.25)} ${R1(-9 * k)} ${R1(ln * 0.5)} 0 q${R1(ln * 0.25)} ${R1(9 * k)} ${R1(ln * 0.5)} 0" stroke="${o.rip || '#FFFFFF'}" stroke-width="${R1(2 + 2 * u)}" fill="none" stroke-linecap="round" opacity="${R1((o.ripOp ?? 0.45) * (0.6 + 0.4 * hrnd(r, i, 33)) * 100) / 100}"/>`;
    }
  }
  if (o.refl) for (const [rx, rc, rw] of o.refl) for (let i = 0; i < 9; i++) { const y = y0 + 16 + i * (H / 9.5), w = (rw || 60) * (0.5 + i * 0.22) * (0.8 + 0.2 * Math.sin(T * 2 + i)); s += `<rect x="${R1(rx - w / 2 + Math.sin(T * 1.5 + i) * 8)}" y="${R1(y)}" width="${R1(w)}" height="${R1(5 + i * 1.2)}" rx="3" fill="${rc}" opacity="0.55"/>`; }
  return s;
}
// các dải sương/khói ngang trôi chậm; ys = list [y, cao, độ đục]
function tqFog(ys, T = AT_(), c = '#EDEFEA', o = {}) {
  let s = ''; ys.forEach(([y, h, op], i) => {
    const dx = Math.sin(T * 0.25 + i * 1.3) * 70, id = 'fg' + i + R1(y);
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="0.5" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs><rect x="-60" y="${R1(y - h / 2)}" width="2040" height="${R1(h)}" fill="url(#${id})"/>`;
    if (o.wisps !== false) for (let k = 0; k < 4; k++) s += `<path d="M${R1(-200 + k * 560 + dx)} ${R1(y + (k % 2 ? 14 : -10))} q150 ${R1(-30 - 12 * (k % 3))} 300 0 t300 0" stroke="${c}" stroke-width="${R1(h * 0.22)}" fill="none" stroke-linecap="round" opacity="${R1(op * 0.55 * 100) / 100}"/>`;
  }); return s;
}

// ---------- cờ
// cờ lệnh vuông bay phải: cột cao h từ chân g; c màu cờ; o.txt chữ Việt; o.small cờ nhỏ; o.tail đuôi nheo
function tqFlagD(x, g, h = 420, c = TQ.shu, T = AT_(), o = {}) {
  const wv = Math.sin(T * 3.2 + x * 0.013) * 14, W = o.w || 120, Hh = o.fh || 150, y0 = g - h + 18;
  let s = `<path d="M${x} ${g} V${g - h}" stroke="${INK2}" stroke-width="${o.pw || 11}" stroke-linecap="round"/><path d="M${x} ${g} V${g - h}" stroke="${TQ.wood}" stroke-width="${(o.pw || 11) - 5}" stroke-linecap="round"/><circle cx="${x}" cy="${g - h - 8}" r="${R1((o.pw || 11) * 0.9)}" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`;
  const d = `M${x + 4} ${y0} Q${R1(x + W * 0.35)} ${R1(y0 - 10 + wv * 0.4)} ${R1(x + W + wv)} ${R1(y0 + 4)} ${o.tail ? `L${R1(x + W * 0.78 + wv * 1.2)} ${R1(y0 + Hh * 0.5)} L${R1(x + W + wv * 1.3)} ${R1(y0 + Hh)}` : `L${R1(x + W + wv * 1.5)} ${R1(y0 + Hh)}`} Q${R1(x + W * 0.4)} ${R1(y0 + Hh + 8 - wv * 0.3)} ${x + 4} ${y0 + Hh}Z`;
  s += `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M${x + 6} ${y0 + 10} Q${R1(x + W * 0.4)} ${R1(y0 + wv * 0.3)} ${R1(x + W - 6 + wv)} ${R1(y0 + 14)}" stroke="${o.trim || TQ.gold}" stroke-width="5" fill="none"/><path d="M${x + 6} ${y0 + Hh - 10} Q${R1(x + W * 0.4)} ${R1(y0 + Hh - 2 - wv * 0.3)} ${R1(x + W - 8 + wv * 1.4)} ${R1(y0 + Hh - 12)}" stroke="${o.trim || TQ.gold}" stroke-width="5" fill="none"/>`;
  if (o.txt) s += `<text x="${R1(x + W * 0.48 + wv * 0.7)}" y="${R1(y0 + Hh * 0.64)}" font-family="${FH}" font-size="${o.fs || 62}" fill="${o.txtC || '#F6E7B8'}" stroke="${INK2}" stroke-width="2" text-anchor="middle" paint-order="stroke">${o.txt}</text>`;
  return s;
}

// ---------- tàu thuyền (nhìn nghiêng, mũi quay TRÁI; o.flip quay phải). (x, g) = giữa thân ở mực nước.
// o: col màu quân, sail (true|false|'furled'), fire (lửa), tilt, bob (biên độ nhấp nhô), cabin, flagTxt, oars, arrows (số tên cắm)
function tqShipD(x, g, s = 1, T = AT_(), o = {}) {
  const col = o.col || TQ.wei, col2 = dk(col, 0.25), bob = Math.sin(T * 1.3 + x * 0.007) * (o.bob ?? 4), tl = (o.tilt || 0) + Math.sin(T * 1.1 + x * 0.01) * 0.8;
  let b = '';
  // mái chèo
  if (o.oars !== false) for (let i = 0; i < 4; i++) { const ox = -170 + i * 100; b += `<path d="M${ox} -60 L${ox - 40} 40" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M${ox} -60 L${ox - 40} 40" stroke="${TQ.wood3}" stroke-width="6" stroke-linecap="round"/>`; }
  // cột buồm & buồm (vẽ trước thân để chân cột chìm sau lan can)
  const mx = -40;
  b += `<path d="M${mx} -110 V-540" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M${mx} -110 V-540" stroke="${TQ.wood}" stroke-width="12" stroke-linecap="round"/>`;
  if (o.sail === 'furled') b += `<path d="M${mx - 160} -470 H${mx + 160}" stroke="${INK2}" stroke-width="14" stroke-linecap="round"/><path d="M${mx - 160} -470 H${mx + 160}" stroke="${TQ.wood3}" stroke-width="8" stroke-linecap="round"/><path d="M${mx - 150} -464 Q${mx} -430 ${mx + 150} -464 L${mx + 140} -440 Q${mx} -410 ${mx - 140} -440Z" fill="${TQ.sail}" stroke="${INK2}" stroke-width="4"/>`;
  else if (o.sail !== false) {
    const bulge = 22 + Math.sin(T * 1.6 + x * 0.01) * 5;
    b += `<path d="M${mx - 170} -490 H${mx + 170}" stroke="${INK2}" stroke-width="14" stroke-linecap="round"/><path d="M${mx - 170} -490 H${mx + 170}" stroke="${TQ.wood3}" stroke-width="8" stroke-linecap="round"/>`;
    b += `<path d="M${mx - 164} -484 Q${R1(mx - 164 - bulge * 0.3)} -340 ${mx - 150} -190 Q${mx} ${R1(-170 + bulge)} ${mx + 150} -190 Q${R1(mx + 164 + bulge * 0.3)} -340 ${mx + 164} -484Z" fill="${o.sailC || TQ.sail}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
    for (let i = 1; i < 6; i++) { const y = -484 + i * 53; b += `<path d="M${mx - 158} ${y} Q${mx} ${R1(y + bulge * 0.35)} ${mx + 158} ${y}" stroke="${dk(o.sailC || TQ.sail, 0.28)}" stroke-width="4" fill="none"/>`; }
    b += `<path d="M${mx} -484 V-190" stroke="${dk(o.sailC || TQ.sail, 0.2)}" stroke-width="3" opacity="0.7"/><path d="M${mx - 160} -484 Q${mx - 150} -400 ${mx - 140} -300" stroke="#FFFFFF" stroke-width="7" fill="none" opacity="0.35"/>`;
    if (o.emblem !== false) b += `<circle cx="${mx}" cy="-340" r="46" fill="${col}" stroke="${INK2}" stroke-width="4"/><circle cx="${mx}" cy="-340" r="26" fill="none" stroke="${TQ.gold}" stroke-width="5"/>`;
  }
  // thân thuyền
  const hull = `M-318 -134 Q-306 -72 -250 -30 Q-200 4 -120 4 H150 Q254 4 296 -40 Q320 -72 324 -144 L296 -114 H-276Z`;
  b += `<path d="${hull}" fill="${TQ.wood}" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>`;
  b += `<path d="M-276 -114 H296 L292 -86 H-262Z" fill="${col}" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 3; i++) b += `<path d="M${-250 + i * 18} ${-60 + i * 16} Q0 ${-44 + i * 16 + 8} ${290 - i * 22} ${-62 + i * 16}" stroke="${TQ.wood2}" stroke-width="3.5" fill="none" opacity="0.8"/>`;
  b += `<path d="M-120 4 H150 Q254 4 296 -40 Q320 -72 324 -144 L300 -118 Q282 -52 230 -22 Q190 -6 150 -4 H-120Z" fill="${TQ.wood2}" opacity="0.55"/>`;
  // khiên tròn dọc mạn
  for (let i = 0; i < 7; i++) { const sx = -230 + i * 76; b += `<circle cx="${sx}" cy="-100" r="19" fill="${i % 2 ? col2 : col}" stroke="${INK2}" stroke-width="3.5"/><circle cx="${sx}" cy="-100" r="7" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2"/>`; }
  // mũi: sừng rồng/đầu thú đơn giản
  b += `<path d="M-318 -134 q-18 -26 -4 -52 q18 12 14 30 q22 -10 20 -34 q10 28 -6 56Z" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`;
  // lan can
  b += `<path d="M-276 -114 H296" stroke="${INK2}" stroke-width="9"/>`;
  for (let i = 0; i < 12; i++) { const px = -262 + i * 50; b += `<path d="M${px} -114 V-146" stroke="${INK2}" stroke-width="8"/><path d="M${px} -114 V-146" stroke="${TQ.wood3}" stroke-width="4"/>`; }
  b += `<path d="M-268 -146 H292" stroke="${INK2}" stroke-width="8"/><path d="M-268 -146 H292" stroke="${TQ.wood3}" stroke-width="4"/>`;
  // lầu đuôi
  if (o.cabin !== false) {
    b += `<rect x="96" y="-250" width="170" height="106" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5"/><rect x="96" y="-250" width="170" height="26" fill="${col}" stroke="${INK2}" stroke-width="4"/>` +
      [0, 1, 2].map(i => `<rect x="${112 + i * 52}" y="-210" width="36" height="46" fill="${o.lit ? '#FFD98A' : '#4A3A2C'}" stroke="${INK2}" stroke-width="3.5"/>`).join('') +
      wxRoof(181, -250, 214, 62, { c: o.roof || '#4A5560', tip: TQ.gold, ridge: dk(o.roof || '#4A5560', 0.3), lip: 12 });
  }
  // cờ trên đỉnh cột
  b += (() => { const W = 80; const wv = Math.sin(T * 3.4 + x * 0.02) * 10; return `<path d="M${mx} -540 L${R1(mx + W + wv)} ${R1(-528)} L${R1(mx + W * 0.78 + wv * 1.2)} -508 L${R1(mx + W + wv * 1.3)} -488 L${mx} -494Z" fill="${col}" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/>` + (o.flagTxt ? `<text x="${R1(mx + 34 + wv * 0.5)}" y="-505" font-family="${FH}" font-size="22" fill="#F6E7B8" stroke="${INK2}" stroke-width="1" paint-order="stroke" text-anchor="middle">${o.flagTxt}</text>` : ''); })();
  // tên cắm vào mạn
  if (o.arrows) for (let i = 0; i < o.arrows; i++) { const ax = -250 + hrnd(i, 5) * 520, ay = -90 + hrnd(i, 6) * 60, a = -35 + hrnd(i, 7) * 20; b += `<g transform="translate(${R1(ax)} ${R1(ay)}) rotate(${R1(a)})"><path d="M0 0 H-44" stroke="${INK2}" stroke-width="5"/><path d="M0 0 H-44" stroke="#E8D8B0" stroke-width="2.4"/><path d="M-44 0 l-12 -6 M-44 0 l-12 6 M-36 0 l-10 -5 M-36 0 l-10 5" stroke="${TQ.shu}" stroke-width="3"/></g>`; }
  // lửa cháy
  if (o.fire) b += tqFlame(-80, -140, 1.3, T, { seed: 1 }) + tqFlame(180, -240, 1.1, T, { seed: 2 }) + tqFlame(-40, -300, 0.9, T, { seed: 3 }) + tqSmoke(-40, -300, T, 520, '#4A4644', 8);
  // bọt nước ở thân
  b += `<path d="M-300 6 q60 -20 120 0 t120 0 t120 0 t120 0 t120 0 t100 -4" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  return `<g transform="translate(${R1(x)} ${R1(g + bob)}) rotate(${R1(tl)}) scale(${o.flip ? -s : s} ${s})">${b}</g>`;
}
// thuyền nhỏ chất cỏ (thuyền cỏ): thân thấp, màn vải xanh phủ hai mạn, bó cỏ chất cao. o.arrows: số mũi tên cắm vào bó cỏ/màn; o.heavy: nghiêng về một bên
function tqBoatD(x, g, s = 1, T = AT_(), o = {}) {
  const bob = Math.sin(T * 1.6 + x * 0.011) * 3, tl = (o.tilt || 0) + Math.sin(T * 1.3 + x * 0.02) * 1;
  let b = `<path d="M-190 -40 Q-170 8 -110 10 H110 Q170 8 190 -40 Q192 -58 184 -70 H-184 Q-192 -58 -190 -40Z" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/><path d="M-176 -50 H176" stroke="${TQ.wood3}" stroke-width="7"/>`;
  b += `<path d="M-190 -40 Q-150 -66 -120 -70 M190 -40 Q150 -66 120 -70" stroke="${INK2}" stroke-width="5" fill="none"/>`;
  // bó cỏ
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6 - r; i++) { const bx = -140 + r * 26 + i * 52, by = -76 - r * 44; b += `<rect x="${bx - 24}" y="${by - 46}" width="48" height="46" rx="8" fill="${(i + r) % 2 ? TQ.straw : TQ.straw2}" stroke="${INK2}" stroke-width="3.5"/><path d="M${bx - 14} ${by - 38} v28 M${bx} ${by - 40} v32 M${bx + 14} ${by - 38} v28" stroke="${dk(TQ.straw2, 0.3)}" stroke-width="3"/><path d="M${bx - 24} ${by - 24} H${bx + 24}" stroke="#6B4428" stroke-width="4"/>`; }
  // màn xanh phủ mạn
  for (const sd of [-1, 1]) b += `<path d="M${sd * 180} -72 Q${sd * 196} -40 ${sd * 168} -4 L${sd * 120} -6 L${sd * 100} -62Z" fill="${TQ.cloth}" stroke="${INK2}" stroke-width="4" opacity="0.95"/>`;
  b += `<path d="M-150 -70 Q0 -52 150 -70" stroke="${TQ.cloth}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-150 -70 Q0 -52 150 -70" stroke="${INK2}" stroke-width="3" fill="none"/>`;
  if (o.arrows) for (let i = 0; i < o.arrows; i++) { const ax = -150 + hrnd(i, 8) * 300, ay = -80 - hrnd(i, 9) * 130, a = o.dir === 'r' ? 35 : -30 + hrnd(i, 10) * 14; b += `<g transform="translate(${R1(ax)} ${R1(ay)}) rotate(${R1(a)})"><path d="M0 0 H-70" stroke="${INK2}" stroke-width="5"/><path d="M0 0 H-70" stroke="#E8D8B0" stroke-width="2.4"/><path d="M-70 0 l-14 -7 M-70 0 l-14 7 M-60 0 l-12 -6 M-60 0 l-12 6" stroke="${TQ.shu}" stroke-width="3"/></g>`; }
  b += `<path d="M-200 12 q50 -16 100 0 t100 0 t100 0 t100 0" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  return `<g transform="translate(${R1(x)} ${R1(g + bob)}) rotate(${R1(tl)}) scale(${o.flip ? -s : s} ${s})">${b}</g>`;
}

// ---------- doanh trại
// hàng cọc nhọn: x0→x1, chân g, cao h
function tqPalisade(x0, x1, g, h = 120, o = {}) {
  const c = o.c || TQ.wood, n = Math.max(2, Math.round((x1 - x0) / (o.gap || 38)));
  let s = '';
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, hh = h * (0.9 + 0.2 * hrnd(i, 4)); s += `<path d="M${R1(x - 15)} ${g} V${R1(g - hh + 18)} L${R1(x)} ${R1(g - hh)} L${R1(x + 15)} ${R1(g - hh + 18)} V${g}Z" fill="${i % 2 ? c : dk(c, 0.1)}" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/><path d="M${R1(x - 4)} ${R1(g - hh + 24)} V${R1(g - 8)}" stroke="${lt_(c, 0.2)}" stroke-width="3" opacity="0.7"/>`; }
  s += `<path d="M${x0 - 10} ${R1(g - h * 0.62)} H${x1 + 10}" stroke="${INK2}" stroke-width="9"/><path d="M${x0 - 10} ${R1(g - h * 0.62)} H${x1 + 10}" stroke="${TQ.wood3}" stroke-width="5"/>`;
  return s;
}
// tháp canh gỗ: o.lamp đèn sáng, o.flag màu
function tqTowerD(x, g, s = 1, T = AT_(), o = {}) {
  let b = `<path d="M-70 0 L-50 -260 M70 0 L50 -260 M-62 -90 L62 -170 M62 -90 L-62 -170" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M-70 0 L-50 -260 M70 0 L50 -260 M-62 -90 L62 -170 M62 -90 L-62 -170" stroke="${TQ.wood}" stroke-width="9" stroke-linecap="round"/>`;
  b += `<rect x="-86" y="-282" width="172" height="26" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5"/><path d="M-86 -282 v-70 M86 -282 v-70" stroke="${INK2}" stroke-width="12"/><path d="M-86 -282 v-70 M86 -282 v-70" stroke="${TQ.wood}" stroke-width="6"/>`;
  b += `<rect x="-80" y="-350" width="160" height="68" fill="${o.lamp ? '#FFD98A' : '#5A4632'}" opacity="${o.lamp ? 0.9 : 0.85}" stroke="${INK2}" stroke-width="4"/>` + (o.lamp ? `<circle cx="0" cy="-316" r="120" fill="#FFC866" opacity="0.2"/>` : '');
  b += wxRoof(0, -350, 220, 70, { c: '#4A5560', tip: TQ.gold, ridge: '#2E3640', lip: 12 });
  if (o.col) b += tqFlagD(60, -400, 120, o.col, T, { w: 70, fh: 90, pw: 7 });
  return _g(x, g, s, b);
}
// lều quân: o.c màu, o.open cửa mở (tối bên trong, có đèn nếu o.lit)
function tqTentD(x, g, s = 1, o = {}) {
  const c = o.c || '#C8B488', c2 = dk(c, 0.2);
  let b = `<path d="M-190 0 L-150 -150 L0 -230 L150 -150 L190 0Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -230 L-40 0 H40Z" fill="${o.open === false ? c2 : '#3A2E26'}" stroke="${INK2}" stroke-width="4"/>` + (o.lit ? `<path d="M-30 0 L-14 -150 H14 L30 0Z" fill="#FFD98A" opacity="0.85"/>` : '') +
    `<path d="M0 -230 L-150 -150 M0 -230 L150 -150" stroke="${c2}" stroke-width="5"/><path d="M-190 0 L-150 -150 L-40 0Z" fill="${c2}" opacity="0.4"/><path d="M-120 -60 H-70 M70 -60 H120 M-150 -110 H-100 M100 -110 H150" stroke="${c2}" stroke-width="4"/>`;
  b += `<path d="M-150 -150 L-210 -6 M150 -150 L210 -6" stroke="${INK2}" stroke-width="4"/><path d="M-210 -6 l-8 8 M210 -6 l8 8" stroke="${TQ.wood2}" stroke-width="8" stroke-linecap="round"/>`;
  b += `<path d="M0 -230 v-34" stroke="${INK2}" stroke-width="7"/><circle cx="0" cy="-270" r="10" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3.5"/>`;
  if (o.band) b += `<path d="M-186 -24 H186" stroke="${o.band}" stroke-width="16"/><path d="M-186 -24 H186" stroke="${INK2}" stroke-width="3"/>`;
  return _g(x, g, s, b);
}
// trống trận trên giá
function tqDrumD(x, g, s = 1, c = TQ.shu) {
  return _g(x, g, s, `<path d="M-60 0 L-40 -80 M60 0 L40 -80" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M-60 0 L-40 -80 M60 0 L40 -80" stroke="${TQ.wood}" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="-130" rx="74" ry="70" fill="${c}" stroke="${INK2}" stroke-width="5"/><ellipse cx="0" cy="-130" rx="52" ry="50" fill="${lt_(c, 0.22)}" stroke="${INK2}" stroke-width="3.5"/>` + [...Array(14)].map((_, i) => { const a = i / 14 * 6.283; return `<circle cx="${R1(Math.cos(a) * 66)}" cy="${R1(-130 + Math.sin(a) * 62)}" r="4" fill="${TQ.gold}" stroke="${INK2}" stroke-width="1.5"/>`; }).join(''));
}
// giá giáo
function tqSpearRack(x, g, s = 1) {
  let b = `<path d="M-90 0 V-70 H90 V0" stroke="${INK2}" stroke-width="14" fill="none"/><path d="M-90 0 V-70 H90 V0" stroke="${TQ.wood}" stroke-width="8" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const sx = -76 + i * 25, a = (i - 3) * 2; b += `<g transform="translate(${sx} -64) rotate(${a})"><path d="M0 0 V-300" stroke="${INK2}" stroke-width="9"/><path d="M0 0 V-300" stroke="${TQ.wood3}" stroke-width="4.5"/><path d="M-10 -300 L0 -350 L10 -300Z" fill="#CFD4D8" stroke="${INK2}" stroke-width="3"/><path d="M0 -290 q-18 8 -14 36 q10 -10 14 -10Z" fill="${i % 2 ? TQ.shu : TQ.gold}" stroke="${INK2}" stroke-width="2.5"/></g>`; }
  return _g(x, g, s, b);
}

// ---------- thành quách
// tường thành gạch: x0→x1, chân g, cao h, có lỗ châu mai; o.c màu
function tqWallD(x0, x1, g, h = 260, o = {}) {
  const c = o.c || TQ.brick, c2 = dk(c, 0.2), w = x1 - x0;
  let s = `<rect x="${x0}" y="${g - h}" width="${w}" height="${h}" fill="${c}" stroke="${INK2}" stroke-width="5"/>`;
  for (let r = 1; r < h / 34; r++) { const y = g - h + r * 34; s += `<path d="M${x0} ${y} H${x1}" stroke="${c2}" stroke-width="2.5" opacity="0.8"/>`; for (let i = 0; i < w / 70; i++) s += `<path d="M${R1(x0 + i * 70 + (r % 2 ? 35 : 0))} ${y} v34" stroke="${c2}" stroke-width="2.5" opacity="0.8"/>`; }
  s += `<rect x="${x0}" y="${g - h}" width="${w}" height="${R1(h * 0.18)}" fill="${lt_(c, 0.1)}" opacity="0.5"/><path d="M${x0 + 8} ${g - 8} H${x1 - 8}" stroke="${c2}" stroke-width="10" opacity="0.4"/>`;
  const m = Math.floor(w / 80);
  for (let i = 0; i < m; i++) { const x = x0 + 10 + i * (w - 20) / m; s += `<rect x="${R1(x)}" y="${g - h - 40}" width="${R1((w - 20) / m - 26)}" height="40" fill="${lt_(c, 0.06)}" stroke="${INK2}" stroke-width="4"/>`; }
  return s;
}
// lầu cổng thành: cổng vòm + lầu mái cong. o.open: cổng mở (tối/sáng), o.lit đèn
function tqGateD(x, g, s = 1, T = AT_(), o = {}) {
  const c = o.c || TQ.brick, W = o.w || 520, H = o.h || 330;
  let b = tqWallD(-W / 2, W / 2, 0, H, { c });
  b += `<path d="M-90 0 V-150 A90 90 0 0 1 90 -150 V0Z" fill="${o.open === false ? '#6B4428' : (o.lit ? '#FFD98A' : '#3A2E26')}" stroke="${INK2}" stroke-width="6"/>`;
  if (o.open === false) b += `<path d="M0 -240 V0 M-90 -120 H90 M-90 -50 H90" stroke="${INK2}" stroke-width="4"/>` + [-60, -30, 30, 60].flatMap(dx => [-190, -130, -70]).slice(0, 0).join('');
  b += `<path d="M-90 -150 A90 90 0 0 1 90 -150" stroke="${dk(c, 0.3)}" stroke-width="12" fill="none"/>`;
  // lầu
  b += `<rect x="${-W * 0.36}" y="${-H - 120}" width="${W * 0.72}" height="80" fill="${TQ.shu}" stroke="${INK2}" stroke-width="5"/>` + [...Array(6)].map((_, i) => `<rect x="${R1(-W * 0.36 + 8 + i * (W * 0.72 - 16) / 6)}" y="${-H - 120}" width="14" height="80" fill="${TQ.shu2}" stroke="${INK2}" stroke-width="3"/>`).join('');
  b += `<rect x="${-W * 0.36}" y="${-H - 40}" width="${W * 0.72}" height="40" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  b += wxRoof(0, -H - 120, W * 0.9, 100, { c: '#4A5560', tip: TQ.gold, ridge: '#2E3640', pearl: true });
  return _g(x, g, s, b);
}

// ---------- đất đá, cây
// mặt đất có đường nét: y = mép trên; c nền; c2 cỏ khô; o.path: lối đi [x trên, x dưới, rộng trên, rộng dưới]
function tqGroundD(y, c = TQ.earth, c2 = '#7E9A56', seed = 3, o = {}) {
  let s = `<path d="M0 ${y} Q480 ${y - 22} 960 ${y - 6} T1920 ${y - 14} V1090 H0Z" fill="${c}" stroke="${INK2}" stroke-width="4"/>`;
  if (o.path) { const [xa, xb, wa, wb] = o.path; s += `<path d="M${xa - wa / 2} ${y} L${xb - wb / 2} 1090 H${xb + wb / 2} L${xa + wa / 2} ${y}Z" fill="${lt_(c, 0.18)}" opacity="0.9"/><path d="M${xa - wa / 2} ${y} L${xb - wb / 2} 1090 M${xa + wa / 2} ${y} L${xb + wb / 2} 1090" stroke="${dk(c, 0.25)}" stroke-width="4" opacity="0.7"/>`; }
  s += pebbles(40, 0, y + 20, 1920, 1070 - y, dk(c, 0.2), seed) + vGrass(o.grass ?? 160, 0, y + 10, 1920, 1070 - y, c2, seed, { c2: lt_(c2, 0.2), skip: o.path ? ((x, yy) => { const [xa, xb, wa, wb] = o.path, u = (yy - y) / (1090 - y), cx = xa + (xb - xa) * u, hw = (wa + (wb - wa) * u) / 2; return Math.abs(x - cx) < hw; }) : undefined });
  return s;
}
// vách đá hẻm núi (một bên): side -1 trái / 1 phải; x0 mép ngoài; w rộng; top đỉnh; g chân
function tqGorgeWall(side, w, top, g = 1090, c = '#8E8672', seed = 1, T = AT_()) {
  const xo = side < 0 ? 0 : 1920, dir = side < 0 ? 1 : -1; const pts = [[xo, top]];
  const n = 9; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([xo + dir * (w * (0.55 + 0.45 * Math.pow(u, 1.5)) + (hrnd(i, seed) - 0.5) * 50), top + (g - top) * u]); }
  pts.push([xo, g]);
  let s = `<path d="M${pts.map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let k = 0; k < 10; k++) { const y = top + 40 + k * ((g - top - 60) / 10) + hrnd(k, seed + 3) * 20, x = xo + dir * (w * 0.1 + hrnd(k, seed + 4) * w * 0.55); s += `<path d="M${R1(x)} ${R1(y)} q${dir * 30} ${R1(10 + 20 * hrnd(k, seed + 5))} ${dir * 70} ${R1(30 * hrnd(k, seed + 6))}" stroke="${dk(c, 0.3)}" stroke-width="4" fill="none" opacity="0.7"/><path d="M${R1(x + dir * 8)} ${R1(y - 12)} h${dir * 40}" stroke="${lt_(c, 0.3)}" stroke-width="3" opacity="0.6"/>`; }
  s += `<path d="M${xo} ${top} ${pts.slice(1, -1).map(p => `L${R1(p[0])} ${R1(p[1])}`).join(' ')} L${R1(xo + dir * w * 0.3)} ${g} L${xo} ${g}Z" fill="${dk(c, 0.1)}" opacity="0.35"/>`;
  return s;
}

// ===== NỀN TẬP GIA CÁT LƯỢNG — nhóm C (2026-10-17): nền trong nhà / trướng
//   bg_the · bg_truong_du · bg_truong_luong · bg_sai_tang · bg_vinh_an      (helper riêng tiền tố tqC_)
// Mọi nền: bg_<tên>(t, o) trả SVG 1920×1080; nhân vật đứng ở ground ≈ 1075 (thân cao tới y ≈ 500) nên giữa-dưới khung để thoáng.

let tqC_n = 0;
const tqC_id = (p) => p + (tqC_n++ % 9999);
// quầng sáng mềm (gradient xuyên tâm): (x, y) tâm, r bán kính, ry tỉ lệ cao/rộng
function tqC_glow(x, y, r, c = '#FFC866', op = 0.3, ry = 1) {
  const id = tqC_id('tqCgl');
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="0.5" stop-color="${c}" stop-opacity="${R1(op * 0.4 * 100) / 100}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r)}" ry="${R1(r * ry)}" fill="url(#${id})"/>`;
}
// gradient tuyến tính đứng phủ một hình chữ nhật
function tqC_vgrad(x, y, w, h, stops, op = 1) {
  const id = tqC_id('tqCvg');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`).join('')}</linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" opacity="${op}"/>`;
}
// tối góc (vignette) — c màu, op độ đậm ở góc, cy tâm sáng (0..1)
function tqC_vig(c = '#150E0A', op = 0.45, cy = 0.5, r = 0.75) {
  const id = tqC_id('tqCvi');
  return `<defs><radialGradient id="${id}" cx="0.5" cy="${cy}" r="${r}"><stop offset="0.45" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="${op}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
}
// viền tua rua ngang
function tqC_fringe(x0, x1, y, c = '#E2C25A', n = 0, len = 16) {
  n = n || Math.round((x1 - x0) / 14); let s = '';
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; s += `<path d="M${R1(x)} ${y} v${len}" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/><path d="M${R1(x)} ${y} v${len}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`; }
  return s;
}
// dải cờ đuôi nheo treo dọc mép dưới một dải vải: từ x0 đến x1, hạ từ y
function tqC_bunting(x0, x1, y, w = 64, h = 46, cols = ['#3F7A55', '#E2C25A']) {
  const n = Math.round((x1 - x0) / w); let s = '';
  for (let i = 0; i < n; i++) { const xa = x0 + i * (x1 - x0) / n, xb = x0 + (i + 1) * (x1 - x0) / n, xm = (xa + xb) / 2; s += `<path d="M${R1(xa)} ${y} H${R1(xb)} L${R1(xb - 4)} ${R1(y + h * 0.55)} L${R1(xm)} ${R1(y + h)} L${R1(xa + 4)} ${R1(y + h * 0.55)}Z" fill="${cols[i % cols.length]}" stroke="${INK2}" stroke-width="3" stroke-linejoin="round"/>`; }
  return s;
}
// đèn đồng cao ba chân (đứng sàn): (x, g) chân; cao ≈ 290·s; ánh sáng quầng ở đầu
function tqC_lampStand(x, g, s = 1, T = AT_(), o = {}) {
  const br = o.c || '#B8902A', fl = 1 + Math.sin(T * 8 + x * 0.1) * 0.05 + Math.sin(T * 13 + x) * 0.03, top = g - 300 * s;
  let b = tqC_glow(x, top - 10 * s, (o.r || 260) * s * fl, '#FFC866', o.glow ?? 0.34);
  const body = `<path d="M0 -40 L-52 0 M0 -40 L52 0" stroke="${INK2}" stroke-width="14" stroke-linecap="round"/><path d="M0 -40 L-52 0 M0 -40 L52 0" stroke="${br}" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-4" rx="30" ry="8" fill="${dk(br, 0.25)}" stroke="${INK2}" stroke-width="3.5"/>` +
    `<path d="M0 -36 V-250" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M0 -36 V-250" stroke="${br}" stroke-width="8" stroke-linecap="round"/><path d="M-3 -60 V-240" stroke="${lt_(br, 0.4)}" stroke-width="2.5"/>` +
    `<ellipse cx="0" cy="-130" rx="16" ry="8" fill="${br}" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="0" cy="-190" rx="12" ry="6" fill="${br}" stroke="${INK2}" stroke-width="3"/>` +
    `<path d="M-58 -266 H58 Q50 -226 0 -222 Q-50 -226 -58 -266Z" fill="${br}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="0" cy="-266" rx="58" ry="9" fill="${dk(br, 0.3)}" stroke="${INK2}" stroke-width="4"/><path d="M-38 -250 Q-10 -234 20 -240" stroke="${lt_(br, 0.45)}" stroke-width="3" fill="none"/>` +
    `<path d="M-16 -270 V-282 H16 V-270Z" fill="#3A2E26" stroke="${INK2}" stroke-width="3"/><g transform="translate(0 -278) scale(0.3)">${tqFlame(0, 0, 1, T, { seed: x })}</g>`;
  return b + _g(x, g, s, body);
}
// nến trắng/đỏ cắm đế: (x, g) chân; cao ≈ 70·s
function tqC_candle(x, g, s = 1, T = AT_(), c = '#F4EFE2', o = {}) {
  const fl = 1 + Math.sin(T * 9 + x * 0.3) * 0.12, h = o.h || 70;
  let b = (o.glow === false ? '' : tqC_glow(x, g - (h + 20) * s, 85 * s * fl, '#FFD27A', 0.4));
  b += _g(x, g, s, `<path d="M-18 0 L-12 -12 H12 L18 0Z" fill="#8A6E3A" stroke="${INK2}" stroke-width="3"/><rect x="-9" y="${-h - 12}" width="18" height="${h}" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><path d="M-9 ${-h - 12} q9 8 18 0" fill="${lt_(c, 0.4)}" stroke="${INK2}" stroke-width="2.5"/><path d="M-3 ${-h - 4} v${h * 0.5}" stroke="${dk(c, 0.15)}" stroke-width="2.4"/><path d="M0 ${-h - 12} v-6" stroke="${INK2}" stroke-width="2.5"/><path d="M0 ${-h - 18} q${R1(-9 + Math.sin(T * 8 + x) * 2)} -12 0 -28 q${R1(9 + Math.sin(T * 8 + x) * 2)} 16 0 28Z" fill="#FFB43A" stroke="${INK2}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 ${-h - 20} q-4 -7 0 -14 q4 7 0 14Z" fill="#FFF2A8"/>`);
  return b;
}
// tấm màn/rèm vén sang một bên, buộc dây vàng: side -1 trái / 1 phải; w rộng chỗ phình; tieY chỗ thắt
function tqC_drape(side, w, tieY, col, T = AT_(), o = {}) {
  const span = o.span || 400, e = (y) => w * (0.34 + 0.66 * Math.min(1, Math.pow(Math.abs(y - tieY) / span, 1.25)));
  const sw = (y, k) => Math.sin(T * 0.8 + y * 0.01 + k) * 2.2;
  const pts = []; for (let y = 0; y <= 1080; y += 40) pts.push([e(y) + sw(y, 0), y]);
  let d = `M${-40} -10 H${R1(pts[0][0])} ` + pts.map(p => `L${R1(p[0])} ${p[1]}`).join(' ') + ` L${-40} 1090Z`;
  let b = `<path d="${d}" fill="${col}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let k = 1; k <= 4; k++) { const f = k / 5; b += `<path d="M${R1(w * f * 0.9)} 0 ` + pts.map(p => `L${R1(p[0] * f + sw(p[1], k))} ${p[1]}`).join(' ') + `" stroke="${dk(col, 0.28)}" stroke-width="${k % 2 ? 5 : 3.5}" fill="none" opacity="0.8"/>`; }
  for (let k = 0; k < 3; k++) { const f = (k + 0.5) / 4.2; b += `<path d="M${R1(w * f * 0.9 + 8)} 0 ` + pts.map(p => `L${R1(p[0] * f + 8 + sw(p[1], k))} ${p[1]}`).join(' ') + `" stroke="${lt_(col, 0.25)}" stroke-width="5" fill="none" opacity="0.55"/>`; }
  // dây buộc + tua
  const tx = e(tieY);
  b += `<path d="M-10 ${tieY - 8} Q${R1(tx * 0.5)} ${tieY + 14} ${R1(tx + 6)} ${tieY - 2}" stroke="${INK2}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-10 ${tieY - 8} Q${R1(tx * 0.5)} ${tieY + 14} ${R1(tx + 6)} ${tieY - 2}" stroke="${o.cord || '#E2C25A'}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  b += `<g transform="translate(${R1(tx + 4)} ${tieY + 2})"><circle r="11" fill="${o.cord || '#E2C25A'}" stroke="${INK2}" stroke-width="3.5"/><path d="M-12 8 v60 M-4 10 v66 M4 10 v66 M12 8 v60" stroke="${INK2}" stroke-width="6" stroke-linecap="round"/><path d="M-12 8 v60 M-4 10 v66 M4 10 v66 M12 8 v60" stroke="${o.cord || '#E2C25A'}" stroke-width="3" stroke-linecap="round"/></g>`;
  return `<g transform="${side < 0 ? '' : 'translate(1920 0) scale(-1 1)'}">${b}</g>`;
}
// thảm hình thang: y0 mép trên (hẹp), y1 mép dưới (rộng), cx tâm
function tqC_rug(cx, y0, y1, w0, w1, c = '#7E2A26', c2 = '#E2C25A', o = {}) {
  const inset = (u) => [[cx - w0 / 2 * (1 - u * 0.0) , y0], [cx + w0 / 2, y0], [cx + w1 / 2, y1], [cx - w1 / 2, y1]];
  const at = (u, v) => { const y = y0 + (y1 - y0) * v, hw = (w0 + (w1 - w0) * v) / 2; return [cx + hw * u, y]; };
  let s = `<path d="M${R1(cx - w0 / 2)} ${y0} H${R1(cx + w0 / 2)} L${R1(cx + w1 / 2)} ${y1} H${R1(cx - w1 / 2)}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  const q = (u0, v0, u1, v1) => [at(-u0, v0), at(u0, v0), at(u1, v1), at(-u1, v1)];
  const ring = (u, v0, v1, col, sw) => { const p = q(u, v0, u, v1); return `<path d="M${p.map(a => `${R1(a[0])} ${R1(a[1])}`).join(' L')}Z" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"/>`; };
  s += ring(0.92, 0.1, 0.9, c2, 5) + ring(0.84, 0.18, 0.82, dk(c2, 0.3), 3);
  const inner = q(0.8, 0.22, 0.8, 0.78); s += `<path d="M${inner.map(a => `${R1(a[0])} ${R1(a[1])}`).join(' L')}Z" fill="${pat(o.pat || 'diamond', lt_(c, 0.22), null, o.psc || 1.1)}" opacity="0.9"/>`;
  const m = at(0, 0.5), mw = (w0 + w1) / 4 * 0.5; if (o.med !== false) s += `<ellipse cx="${R1(m[0])}" cy="${R1(m[1])}" rx="${R1(mw)}" ry="${R1((y1 - y0) * 0.16)}" fill="none" stroke="${c2}" stroke-width="4"/>`;
  for (let i = 0; i < 14; i++) { const a = at(-1 + (i + 0.5) * 2 / 14, 1); s += `<path d="M${R1(a[0])} ${a[1]} v14" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`; }
  return s;
}
// bản đồ treo cuộn (không chữ): sông, núi, rừng; o.pins [[u,v]…] đinh ghim đỏ nối chỉ đỏ; o.c giấy
function tqC_map(x, y, w, h, T = AT_(), o = {}) {
  const pc = o.c || '#E6D6AC', sd = o.seed || 3;
  let b = `<path d="M${w * 0.18} -26 L${w * 0.5} -60 L${w * 0.82} -26" stroke="${INK2}" stroke-width="5" fill="none"/><circle cx="${w * 0.5}" cy="-60" r="7" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/>`;
  b += `<rect x="-14" y="-16" width="${w + 28}" height="22" rx="10" fill="#6B3E26" stroke="${INK2}" stroke-width="4.5"/><circle cx="-18" cy="-5" r="10" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/><circle cx="${w + 18}" cy="-5" r="10" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/>`;
  b += `<rect x="0" y="0" width="${w}" height="${h}" fill="${pc}" stroke="${INK2}" stroke-width="5"/><rect x="0" y="0" width="${w}" height="${h}" fill="${pat('weave', '#B8A070', null, 1.2)}" opacity="0.35"/>`;
  b += `<rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="${o.frame || '#8E3A2A'}" stroke-width="3.5"/>`;
  // vùng xanh (đất thấp) & núi hai bên
  b += `<path d="M20 ${h * 0.55} Q${w * 0.3} ${h * 0.42} ${w * 0.5} ${h * 0.58} T${w - 20} ${h * 0.5} V${h - 20} H20Z" fill="#C9D2A4" opacity="0.7"/>`;
  const peak = (px, py, k, c) => `<path d="M${R1(px - 26 * k)} ${R1(py)} L${R1(px - 6 * k)} ${R1(py - 40 * k)} L${R1(px + 6 * k)} ${R1(py - 30 * k)} L${R1(px + 28 * k)} ${R1(py)}Z" fill="${c}" stroke="${INK2}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${R1(px - 6 * k)} ${R1(py - 40 * k)} L${R1(px - 2 * k)} ${R1(py - 8 * k)}" stroke="${dk(c, 0.3)}" stroke-width="2"/>`;
  for (let i = 0; i < 9; i++) { const px = w * (0.1 + 0.18 * (i % 5)) + hrnd(i, sd) * 20, py = h * (0.2 + 0.14 * Math.floor(i / 5)) + hrnd(i, sd + 1) * 16 + 30; if (i % 5 === 2 && i < 5) continue; b += peak(px, py, 0.9 + hrnd(i, sd + 2) * 0.5, i % 2 ? '#A89A6E' : '#94895F'); }
  // sông: S-curve từ phải-trên xuống trái-dưới + nhánh + hồ
  const rv = `M${w * 0.9} 26 C${w * 0.8} ${h * 0.2} ${w * 0.5} ${h * 0.15} ${w * 0.55} ${h * 0.38} S${w * 0.78} ${h * 0.62} ${w * 0.46} ${h * 0.74} S${w * 0.2} ${h * 0.9} ${w * 0.1} ${h - 26}`;
  b += `<path d="${rv}" stroke="${INK2}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="${rv}" stroke="#7FB0C4" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M${w * 0.55} ${h * 0.38} C${w * 0.4} ${h * 0.34} ${w * 0.3} ${h * 0.4} ${w * 0.22} ${h * 0.36}" stroke="${INK2}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${w * 0.55} ${h * 0.38} C${w * 0.4} ${h * 0.34} ${w * 0.3} ${h * 0.4} ${w * 0.22} ${h * 0.36}" stroke="#7FB0C4" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  b += `<ellipse cx="${w * 0.28}" cy="${h * 0.7}" rx="${w * 0.09}" ry="${h * 0.06}" fill="#7FB0C4" stroke="${INK2}" stroke-width="3.5"/><path d="M${w * 0.23} ${h * 0.7} q10 -6 20 0 t20 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.7"/>`;
  for (let i = 0; i < 5; i++) b += `<path d="M${R1(w * (0.6 + i * 0.05))} ${R1(h * (0.8 - 0.02 * i))} q8 -6 16 0" stroke="#7FB0C4" stroke-width="3" fill="none"/>`;
  // rừng chấm
  for (let i = 0; i < 16; i++) b += `<circle cx="${R1(w * (0.62 + 0.28 * hrnd(i, sd + 5)))}" cy="${R1(h * (0.62 + 0.3 * hrnd(i, sd + 6)))}" r="${R1(5 + hrnd(i, sd + 7) * 4)}" fill="#7E9A5A" stroke="${INK2}" stroke-width="2"/>`;
  // thành nhỏ
  const town = (px, py) => `<rect x="${px - 14}" y="${py - 10}" width="28" height="14" fill="#C8BCA0" stroke="${INK2}" stroke-width="2.5"/><path d="M${px - 18} ${py - 10} L${px} ${py - 26} L${px + 18} ${py - 10}Z" fill="#8E3A2A" stroke="${INK2}" stroke-width="2.5"/>`;
  b += town(w * 0.72, h * 0.3) + town(w * 0.3, h * 0.55) + town(w * 0.5, h * 0.84);
  // đinh ghim + chỉ đỏ
  if (o.pins) { const P = o.pins.map(([u, v]) => [w * u, h * v]); b += `<path d="M${P.map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}" stroke="#C0392B" stroke-width="3.5" fill="none" stroke-linejoin="round" stroke-dasharray="${o.dash || 'none'}"/>` + P.map(p => `<circle cx="${R1(p[0])}" cy="${R1(p[1])}" r="7.5" fill="#E04A38" stroke="${INK2}" stroke-width="2.5"/><circle cx="${R1(p[0] - 2)}" cy="${R1(p[1] - 2)}" r="2.2" fill="#FFD8C8"/>`).join(''); }
  b += `<path d="M${w * 0.08} ${h * 0.05} v${h * 0.9}" stroke="#FFFFFF" stroke-width="6" opacity="0.18"/><rect x="-14" y="${h - 4}" width="${w + 28}" height="22" rx="10" fill="#6B3E26" stroke="${INK2}" stroke-width="4.5"/><circle cx="-18" cy="${h + 7}" r="10" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/><circle cx="${w + 18}" cy="${h + 7}" r="10" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/>`;
  b += `<path d="M${w * 0.3} ${h + 18} v34 M${w * 0.5} ${h + 18} v44 M${w * 0.7} ${h + 18} v34" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/><path d="M${w * 0.3} ${h + 18} v34 M${w * 0.5} ${h + 18} v44 M${w * 0.7} ${h + 18} v34" stroke="${o.tassel || '#E2C25A'}" stroke-width="2.4" stroke-linecap="round"/>`;
  return `<g transform="translate(${R1(x)} ${R1(y)})">${b}</g>`;
}
// bàn thấp (nhìn chính diện, mặt xiên nhẹ): (x, g) giữa chân; w rộng; mặt ở g - leg; o.c gỗ
function tqC_lowTable(x, g, w = 420, o = {}) {
  const c = o.c || '#7A4A30', leg = o.leg || 70, th = 24, top = g - leg - th;
  let b = `<path d="M${x - w / 2 + 30} ${g} V${top + th} M${x + w / 2 - 30} ${g} V${top + th}" stroke="${INK2}" stroke-width="22" stroke-linecap="round"/><path d="M${x - w / 2 + 30} ${g} V${top + th} M${x + w / 2 - 30} ${g} V${top + th}" stroke="${dk(c, 0.1)}" stroke-width="13" stroke-linecap="round"/>`;
  b += `<path d="M${x - w / 2 + 40} ${top + th + 26} H${x + w / 2 - 40}" stroke="${INK2}" stroke-width="12"/><path d="M${x - w / 2 + 40} ${top + th + 26} H${x + w / 2 - 40}" stroke="${dk(c, 0.15)}" stroke-width="6"/>`;
  b += `<path d="M${x - w / 2 + 14} ${top} H${x + w / 2 - 14} L${x + w / 2 + 14} ${top + 8} V${top + th} H${x - w / 2 - 14} V${top + 8}Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M${x - w / 2 + 14} ${top} H${x + w / 2 - 14} L${x + w / 2 + 14} ${top + 8} H${x - w / 2 - 14}Z" fill="${lt_(o.top || c, 0.18)}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/>`;
  b += `<path d="M${x - w / 2 + 6} ${top + th - 6} H${x + w / 2 - 6}" stroke="${dk(c, 0.3)}" stroke-width="3" opacity="0.7"/>`;
  return b;
}
// cuộn sách/thẻ tre đặt nằm
function tqC_scroll(x, y, s = 1, rot = 0, c = '#E8DCC0') { return _g(x, y, s, `<rect x="-40" y="-14" width="80" height="28" rx="14" fill="${c}" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="-40" cy="0" rx="8" ry="14" fill="${dk(c, 0.12)}" stroke="${INK2}" stroke-width="3"/><path d="M-30 -6 h56 M-30 4 h50" stroke="${dk(c, 0.2)}" stroke-width="2" /><rect x="-12" y="-16" width="24" height="32" fill="#A8402E" stroke="${INK2}" stroke-width="2.5"/>`, rot); }
// bó thẻ tre (đặt đứng/nghiêng): n thẻ
function tqC_slips(x, y, s = 1, n = 9, rot = 0) { let b = ''; for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 11; b += `<rect x="${dx - 5}" y="-110" width="10" height="110" fill="${i % 2 ? '#D8C084' : '#C9AE6A'}" stroke="${INK2}" stroke-width="2.5"/>`; } b += `<path d="M${-(n * 5.5)} -78 H${n * 5.5} M${-(n * 5.5)} -34 H${n * 5.5}" stroke="#7A3A2A" stroke-width="4"/>`; return _g(x, y, s, b, rot); }

// hơi nước/khói mỏng bay lên: 3 nét lượn; (x, y) miệng; h cao
function tqC_steam(x, y, T = AT_(), h = 70, c = '#FFFFFF', op = 0.55) {
  let s = '';
  for (let i = 0; i < 3; i++) { const ph = T * 1.2 + i * 2.1, dx = (i - 1) * 12, a = 7 + i; s += `<path d="M${R1(x + dx)} ${y} q${R1(Math.sin(ph) * a)} ${-h * 0.25} ${R1(Math.sin(ph + 1) * a * 1.4)} ${-h * 0.5} t${R1(Math.sin(ph + 2) * a * 1.6)} ${-h * 0.5}" stroke="${c}" stroke-width="${5 - i}" fill="none" stroke-linecap="round" opacity="${R1(op * (0.55 + 0.45 * Math.sin(ph * 0.7 + i)) * 100) / 100}"/>`; }
  return s;
}

// ---------- Nền thẻ chữ: cuộn giấy dó lớn giữa nền gấm tối (xanh than–nâu, vân sóng/mây). Giấy gần trống (chỉ họa tiết rất nhạt ở rìa) để đặt chữ/sơ đồ lên giữa.
// Dùng cho: thẻ tiêu đề, thẻ phép tính, sơ đồ. o: tone 'xanh'(mặc định) | 'nau' (gấm nâu), paper màu giấy.
function bg_the(t, o = {}) {
  const T = _T(t), nau = o.tone === 'nau';
  const base = nau ? '#2E2420' : '#1C2733', wv = nau ? '#4C3B30' : '#32465A', cl = nau ? '#5E4634' : '#3C5266';
  let s = `<rect width="1920" height="1080" fill="${base}"/>`;
  s += `<defs><pattern id="tqCwv" patternUnits="userSpaceOnUse" width="72" height="36">${[[36, 36], [0, 18], [72, 18]].map(([cx, cy]) => [30, 21, 12].map(r => `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${wv}" stroke-width="2.2"/>`).join('')).join('')}</pattern></defs>`;
  s += `<rect width="1920" height="1080" fill="url(#tqCwv)"/><rect width="1920" height="1080" fill="${pat('cloud', cl, null, 2.1)}" opacity="0.55"/>`;
  s += tqC_glow(960, 540, 1300, nau ? '#5A3E28' : '#2E4A5E', 0.12, 0.7);
  // dải gấm viền ngoài sát khung (hoa văn đậm hơn một chút)
  s += `<rect x="14" y="14" width="1892" height="1052" fill="none" stroke="${lt_(wv, 0.25)}" stroke-width="3" opacity="0.7"/><rect x="26" y="26" width="1868" height="1028" fill="none" stroke="${lt_(wv, 0.25)}" stroke-width="1.5" opacity="0.5"/>`;
  s += tqC_vig('#06080C', 0.62, 0.5, 0.78);
  // bóng đổ của cuộn giấy
  s += `<rect x="206" y="132" width="1540" height="860" fill="#050608" opacity="0.38"/>`;
  // GIẤY
  const px = 190, py = 110, pw = 1540, ph = 860, pc = o.paper || '#EFE1BC';
  s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${pc}" stroke="${INK2}" stroke-width="6"/>`;
  s += `<rect x="244" y="164" width="1432" height="752" fill="${pat('cloud', '#BFA066', null, 1.5)}" opacity="0.8"/>`;
  s += `<defs><radialGradient id="tqCcv" cx="0.5" cy="0.5" r="0.5"><stop offset="0.62" stop-color="${pc}" stop-opacity="1"/><stop offset="1" stop-color="${pc}" stop-opacity="0"/></radialGradient></defs><ellipse cx="960" cy="540" rx="900" ry="520" fill="url(#tqCcv)"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="none"/>`;
  s += tqC_vgrad(px, py, pw, ph, [[0, '#FFF6DA', 0.35], [0.5, '#FFF6DA', 0], [1, '#C9AE76', 0.35]]);
  s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${pat('weave', '#C9B488', null, 1.3)}" opacity="0.4"/>`;
  // sợi giấy + vết ố
  for (let i = 0; i < 70; i++) { const x = px + 40 + hrnd(i, 11) * (pw - 80), y = py + 30 + hrnd(i, 12) * (ph - 60), l = 24 + hrnd(i, 13) * 60, a = (hrnd(i, 14) - 0.5) * 40; s += `<path d="M${R1(x)} ${R1(y)} q${R1(l / 2)} ${R1(a * 0.3)} ${R1(l)} ${R1(a * 0.2)}" stroke="#CDB98A" stroke-width="1.6" fill="none" opacity="0.5"/>`; }
  s += `<ellipse cx="300" cy="880" rx="190" ry="60" fill="#C9AE76" opacity="0.2"/><ellipse cx="1560" cy="220" rx="210" ry="60" fill="#C9AE76" opacity="0.18"/><ellipse cx="1650" cy="700" rx="90" ry="160" fill="#C9AE76" opacity="0.14"/>`;
  // khung đỏ hai nét
  s += `<rect x="230" y="150" width="1460" height="780" fill="none" stroke="#A83A30" stroke-width="5"/><rect x="246" y="166" width="1428" height="748" fill="none" stroke="#A83A30" stroke-width="2.2"/>`;
  // họa tiết góc: nơ xoắn + hoa
  const corner = (x, y, sx, sy) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${[26, 42, 58].map((r, i) => `<path d="M${r} 16 A${r} ${r} 0 0 1 16 ${r}" fill="none" stroke="#A83A30" stroke-width="${i === 1 ? 2.4 : 3.6}" stroke-linecap="round"/>`).join('')}<path d="M16 16 L64 64" stroke="#A83A30" stroke-width="2.4" opacity="0.6"/><circle cx="16" cy="16" r="9" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/><circle cx="16" cy="16" r="3.4" fill="#A83A30"/><circle cx="52" cy="52" r="4" fill="#E2C25A" stroke="${INK2}" stroke-width="2"/></g>`;
  s += corner(230, 150, 1.3, 1.3) + corner(1690, 150, -1.3, 1.3) + corner(230, 930, 1.3, -1.3) + corner(1690, 930, -1.3, -1.3);
  // chấm hoa giữa các cạnh khung
  for (const [x, y] of [[960, 150], [960, 930]]) s += `<path d="M${x - 70} ${y} h140" stroke="#A83A30" stroke-width="8"/><path d="M${x - 70} ${y} h140" stroke="${pc}" stroke-width="3" stroke-dasharray="10 12"/><circle cx="${x}" cy="${y}" r="13" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#A83A30"/>`;
  for (const [x, y] of [[230, 540], [1690, 540]]) s += `<path d="M${x} ${y - 70} v140" stroke="#A83A30" stroke-width="8"/><path d="M${x} ${y - 70} v140" stroke="${pc}" stroke-width="3" stroke-dasharray="10 12"/><circle cx="${x}" cy="${y}" r="13" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#A83A30"/>`;
  // giấy cuốn quanh trục: bóng tối dần sát hai trục
  s += `<defs><linearGradient id="tqCpl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A2A1A" stop-opacity="0.5"/><stop offset="1" stop-color="#3A2A1A" stop-opacity="0"/></linearGradient><linearGradient id="tqCpr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#3A2A1A" stop-opacity="0.5"/><stop offset="1" stop-color="#3A2A1A" stop-opacity="0"/></linearGradient></defs><rect x="${px}" y="${py}" width="46" height="${ph}" fill="url(#tqCpl)"/><rect x="${px + pw - 46}" y="${py}" width="46" height="${ph}" fill="url(#tqCpr)"/>`;
  s += `<path d="M${px} ${py + ph - 28} q300 -14 600 4 q420 22 940 -8 V${py + ph} H${px}Z" fill="#C9AE76" opacity="0.32"/>`;
  // hai trục gỗ + núm vàng
  for (const x of [170, 1750]) {
    s += `<rect x="${x - 26}" y="86" width="52" height="908" rx="22" fill="#5E3420" stroke="${INK2}" stroke-width="5.5"/><rect x="${x - 15}" y="98" width="13" height="884" rx="6" fill="#8A5A3A"/><rect x="${x + 10}" y="98" width="8" height="884" rx="4" fill="#3E2214" opacity="0.5"/>`;
    for (const [yy, dir] of [[64, -1], [1016, 1]]) s += `<rect x="${x - 36}" y="${yy - 22}" width="72" height="44" rx="12" fill="#E2C25A" stroke="${INK2}" stroke-width="5"/><rect x="${x - 36}" y="${yy - 22}" width="72" height="12" rx="6" fill="#F6E08A" opacity="0.8"/><path d="M${x - 36} ${yy} h72" stroke="${dk('#E2C25A', 0.35)}" stroke-width="3"/><circle cx="${x}" cy="${yy + dir * 28}" r="13" fill="#E2C25A" stroke="${INK2}" stroke-width="4"/><circle cx="${x - 4}" cy="${yy + dir * 28 - 4}" r="4" fill="#FFF6C0"/>`;
    s += `<path d="M${x - 26} 130 h52 M${x - 26} 950 h52" stroke="#E2C25A" stroke-width="7"/><path d="M${x - 26} 130 h52 M${x - 26} 950 h52" stroke="${INK2}" stroke-width="2"/>`;
  }
  // ấn son nhỏ góc dưới phải
  s += `<g transform="translate(1596 868) rotate(-3)"><rect x="-37" y="-37" width="74" height="74" rx="5" fill="#B8362C" opacity="0.92" stroke="${INK2}" stroke-width="2.5"/><rect x="-31" y="-31" width="62" height="62" rx="3" fill="none" stroke="#F2E1BC" stroke-width="2" opacity="0.8"/><text x="0" y="-4" font-family="${FH}" font-size="20" fill="#F2E1BC" text-anchor="middle" font-weight="700">TAM</text><text x="0" y="24" font-family="${FH}" font-size="20" fill="#F2E1BC" text-anchor="middle" font-weight="700">QUỐC</text></g>`;
  // hạt bụi sáng trôi
  s += motes(22, 170, 90, 1580, 880, '#FFE8B0', 0.45, 12);
  return s;
}

// ---------- đồ đạc trướng (dùng chung bg_truong_du / bg_truong_luong)
// khung phòng-lều: phối cảnh 1 điểm tụ (room1p) + vách vải có đường may, dải thêu viền, cờ đuôi nheo, hai cột. Trả { s, bx0, bx1, by0, by1 }
function tqC_tentRoom(o) {
  const bx0 = 250, bx1 = 1670, by0 = 130, by1 = 730, oo = { bx0, bx1, by0, by1 };
  let s = room1p({ bx0, bx1, by0, by1, wall: o.wall, side: o.side, ceil: o.ceil, fc: o.fc, wain: false, paper: false, floor: o.floor || 'wood', beams: o.beams, night: !!o.night });
  const W = bx1 - bx0;
  // đường may vải lưng vách + mảng sáng tối xen kẽ
  for (let k = 0; k < 8; k++) { const x = bx0 + W * k / 8; if (k % 2) s += `<rect x="${R1(x)}" y="${by0}" width="${R1(W / 8)}" height="${by1 - by0}" fill="#FFFFFF" opacity="0.07"/>`; if (k) s += `<path d="M${R1(x)} ${by0} V${by1}" stroke="${dk(o.wall, 0.28)}" stroke-width="3" opacity="0.7"/><path d="M${R1(x + 7)} ${by0} V${by1}" stroke="${dk(o.wall, 0.18)}" stroke-width="1.6" stroke-dasharray="9 7" opacity="0.6"/>`; }
  for (let i = 0; i < 9; i++) { const x = bx0 + 60 + hrnd(i, 41) * (W - 120), y = by0 + 120 + hrnd(i, 42) * 380; s += `<path d="M${R1(x)} ${R1(y)} q18 14 36 0 t36 -4" stroke="${dk(o.wall, 0.18)}" stroke-width="3" fill="none" opacity="0.55"/>`; }
  // dải thêu trên (có hoa văn) + cờ đuôi nheo; dải thêu dưới
  const bc = o.band || '#3F7A55', gl = o.gold || '#E2C25A';
  const band = (y0, y1) => `<rect x="${bx0}" y="${y0}" width="${W}" height="${y1 - y0}" fill="${bc}" stroke="${INK2}" stroke-width="4"/><rect x="${bx0}" y="${y0}" width="${W}" height="${y1 - y0}" fill="${pat(o.bandPat || 'thunder', lt_(bc, 0.38), null, 0.55)}" opacity="0.9"/><path d="M${bx0} ${y0 + 5} H${bx1} M${bx0} ${y1 - 5} H${bx1}" stroke="${gl}" stroke-width="3"/>`;
  s += band(by0 + 14, by0 + 62) + tqC_bunting(bx0, bx1, by0 + 62, 71, 40, [bc, gl, bc, o.bunt2 || '#F4EFE2']) + band(by1 - 44, by1 - 8);
  const sq = (f0, f1) => `<path d="M${wallQuad(oo, 'L', 0, bx0, f0, f1).map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}Z" fill="${bc}" stroke="${INK2}" stroke-width="4"/><path d="M${wallQuad(oo, 'R', bx1, 1920, f0, f1).map(p => `${R1(p[0])} ${R1(p[1])}`).join(' L')}Z" fill="${dk(bc, 0.08)}" stroke="${INK2}" stroke-width="4"/>`;
  s += sq(0.023, 0.103) + sq(0.923, 0.983);
  // hai cột lều
  for (const x of [bx0, bx1]) s += `<rect x="${x - 15}" y="${by0 - 10}" width="30" height="${by1 - by0 + 14}" fill="${o.post || '#6B4428'}" stroke="${INK2}" stroke-width="5"/><rect x="${x - 9}" y="${by0 - 4}" width="7" height="${by1 - by0}" fill="${lt_(o.post || '#6B4428', 0.2)}" opacity="0.7"/><rect x="${x - 20}" y="${by1 - 6}" width="40" height="14" fill="${dk(o.post || '#6B4428', 0.2)}" stroke="${INK2}" stroke-width="4"/>`;
  return { s, bx0, bx1, by0, by1 };
}
// cờ/bức treo chữ nhật (không chữ): x tâm, y mép trên; col màu; có viền vàng, huy hiệu tròn, đuôi nheo
function tqC_banner(x, y, w, h, col, T = AT_(), o = {}) {
  const sw = Math.sin(T * 1.4 + x * 0.01) * 3, gl = o.gold || '#E2C25A';
  let b = `<path d="M${-w / 2 - 6} 0 V-30 M${w / 2 + 6} 0 V-30" stroke="${INK2}" stroke-width="3.5"/><rect x="${-w / 2 - 14}" y="-12" width="${w + 28}" height="16" rx="7" fill="#6B3E26" stroke="${INK2}" stroke-width="4"/><circle cx="${-w / 2 - 16}" cy="-4" r="8" fill="${gl}" stroke="${INK2}" stroke-width="3"/><circle cx="${w / 2 + 16}" cy="-4" r="8" fill="${gl}" stroke="${INK2}" stroke-width="3"/>`;
  b += `<path d="M${-w / 2} 4 H${w / 2} V${h} L${R1(w / 4 + sw)} ${h - 36} L${R1(sw)} ${h} L${R1(-w / 4 + sw)} ${h - 36} L${-w / 2} ${h}Z" fill="${col}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  b += `<path d="M${-w / 2 + 12} 16 H${w / 2 - 12} V${h - 30} M${-w / 2 + 12} ${h - 30} V16" stroke="${gl}" stroke-width="4" fill="none"/><path d="M${-w / 2 + 20} 26 H${w / 2 - 20}" stroke="${lt_(col, 0.3)}" stroke-width="2" opacity="0.7"/>`;
  b += `<circle cx="0" cy="${h * 0.38}" r="${R1(w * 0.26)}" fill="${dk(col, 0.18)}" stroke="${gl}" stroke-width="4.5"/><circle cx="0" cy="${h * 0.38}" r="${R1(w * 0.16)}" fill="none" stroke="${gl}" stroke-width="3.5"/><path d="M0 ${h * 0.38 - w * 0.13} L${w * 0.04} ${h * 0.38} L0 ${h * 0.38 + w * 0.13} L${-w * 0.04} ${h * 0.38}Z" fill="${gl}"/>`;
  b += `<path d="M${-w / 2 + 4} 14 V${h - 20}" stroke="#FFFFFF" stroke-width="5" opacity="0.12"/>`;
  return `<g transform="translate(${R1(x)} ${R1(y)})">${b}</g>`;
}
// sa bàn bằng cát: (x, g) giữa chân; s tỉ lệ. Có sông, núi, thuyền, cờ nhỏ, doanh trại thu nhỏ.
function tqC_sandTable(x, g, s = 1, T = AT_(), o = {}) {
  const wd = o.wu || TQ.wu, wi = o.wei || TQ.wei, X = (u, v) => u * (206 + 44 * v), Y = (v) => -184 + 86 * v;
  let b = `<path d="M-218 -64 V0 M218 -64 V0" stroke="${INK2}" stroke-width="24" stroke-linecap="round"/><path d="M-218 -64 V0 M218 -64 V0" stroke="#7A4A30" stroke-width="14" stroke-linecap="round"/><path d="M-200 -34 H200" stroke="${INK2}" stroke-width="13"/><path d="M-200 -34 H200" stroke="#6B4428" stroke-width="7"/>`;
  b += `<path d="M-252 -96 H252 V-64 H-252Z" fill="#8A5A3A" stroke="${INK2}" stroke-width="5"/><path d="M-238 -80 H238" stroke="${dk('#8A5A3A', 0.3)}" stroke-width="3"/>` + [-150, -50, 50, 150].map(xx => `<circle cx="${xx}" cy="-80" r="5" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2"/>`).join('');
  b += `<path d="M-206 -190 H206 L252 -96 H-252Z" fill="#8A5A3A" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-190 -180 H190 L232 -106 H-232Z" fill="#E0BE76" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 26; i++) b += `<circle cx="${R1(X(-0.95 + 1.9 * hrnd(i, 61), 0.5))}" cy="${R1(Y(0.1 + 0.8 * hrnd(i, 62)))}" r="2" fill="#B8964E"/>`;
  // sông
  const rp = [[-0.98, 0.15], [-0.5, 0.35], [-0.1, 0.62], [0.35, 0.5], [0.98, 0.8]].map(([u, v]) => [X(u, v), Y(v)]);
  const rd = `M${R1(rp[0][0])} ${R1(rp[0][1])} ` + rp.slice(1).map((p, i) => `Q${R1((rp[i][0] + p[0]) / 2)} ${R1((rp[i][1] + p[1]) / 2 - 8)} ${R1(p[0])} ${R1(p[1])}`).join(' ');
  b += `<path d="${rd}" stroke="${INK2}" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.9"/><path d="${rd}" stroke="#6FA2B8" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${rd}" stroke="#A8D0DE" stroke-width="3" fill="none" stroke-dasharray="14 18" stroke-dashoffset="${R1(-T * 10)}"/>`;
  // núi
  const mt = (u, v, k, c) => { const px = X(u, v), py = Y(v); return `<path d="M${R1(px - 26 * k)} ${R1(py)} Q${R1(px - 10 * k)} ${R1(py - 6 * k)} ${R1(px - 4 * k)} ${R1(py - 34 * k)} Q${R1(px + 4 * k)} ${R1(py - 40 * k)} ${R1(px + 6 * k)} ${R1(py - 30 * k)} Q${R1(px + 14 * k)} ${R1(py - 4 * k)} ${R1(px + 28 * k)} ${R1(py)}Z" fill="${c}" stroke="${INK2}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${R1(px - 3 * k)} ${R1(py - 32 * k)} L${R1(px - 6 * k)} ${R1(py - 6 * k)}" stroke="${dk(c, 0.3)}" stroke-width="2"/>`; };
  b += mt(-0.78, 0.7, 1, '#A8946A') + mt(-0.55, 0.78, 0.8, '#9A8760') + mt(0.7, 0.3, 1.1, '#A8946A') + mt(0.5, 0.2, 0.8, '#9A8760') + mt(-0.1, 0.18, 0.8, '#A8946A');
  // thuyền mini
  const ship = (u, v, col, fl) => { const px = X(u, v), py = Y(v) + 3; return `<path d="M${R1(px - 16)} ${R1(py - 6)} H${R1(px + 16)} L${R1(px + 10)} ${R1(py + 4)} H${R1(px - 10)}Z" fill="${TQ.wood}" stroke="${INK2}" stroke-width="2.4" stroke-linejoin="round"/><path d="M${px} ${R1(py - 6)} V${R1(py - 30)}" stroke="${INK2}" stroke-width="2.6"/><path d="M${px} ${R1(py - 28)} L${R1(px + 15 * fl)} ${R1(py - 12)} H${px}Z" fill="${col}" stroke="${INK2}" stroke-width="2.2" stroke-linejoin="round"/>`; };
  b += ship(-0.45, 0.4, wd, 1) + ship(-0.2, 0.52, wd, 1) + ship(0.5, 0.62, wi, -1) + ship(0.7, 0.7, wi, -1);
  // doanh trại mini
  const tent = (u, v, c) => { const px = X(u, v), py = Y(v); return `<path d="M${R1(px - 14)} ${R1(py)} L${px} ${R1(py - 18)} L${R1(px + 14)} ${R1(py)}Z" fill="${c}" stroke="${INK2}" stroke-width="2.4" stroke-linejoin="round"/>`; };
  b += tent(-0.82, 0.3, wd) + tent(-0.68, 0.38, wd) + tent(0.85, 0.52, wi) + tent(0.72, 0.46, wi);
  // cờ cắm
  const fg = (u, v, c, dy = 0) => { const px = X(u, v), py = Y(v); const w = Math.sin(T * 3 + u * 5) * 2; return `<path d="M${R1(px)} ${R1(py)} v-30" stroke="${INK2}" stroke-width="3"/><path d="M${R1(px)} ${R1(py - 30)} h${R1(16 + w)} l-4 6 l4 6 h${R1(-16 - w)}Z" fill="${c}" stroke="${INK2}" stroke-width="2.2" stroke-linejoin="round"/>`; };
  b += fg(-0.3, 0.78, TQ.shu) + fg(0.1, 0.3, wd) + fg(0.35, 0.82, wi) + fg(-0.9, 0.55, wd) + fg(0.92, 0.2, wi);
  // hàng cọc thành nhỏ
  b += [0.58, 0.64, 0.7, 0.76, 0.82].map(u => `<path d="M${R1(X(u, 0.15))} ${R1(Y(0.15))} v-12" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/><path d="M${R1(X(u, 0.15))} ${R1(Y(0.15))} v-12" stroke="${TQ.wood3}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
  return _g(x, g, s, b);
}
// kệ binh khí: (x, g) giữa chân, rộng ≈ 230·s: kích, giáo, kiếm nằm ngang, khiên tròn
function tqC_weaponRack(x, g, s = 1, o = {}) {
  const wc = o.c || '#6B4428', sh = o.shield || TQ.wu;
  const pole = (px, top, tilt) => `<path d="M${px} -30 L${px + tilt} ${top}" stroke="${INK2}" stroke-width="10" stroke-linecap="round"/><path d="M${px} -30 L${px + tilt} ${top}" stroke="#8A6A44" stroke-width="5" stroke-linecap="round"/>`;
  const ji = (px, top) => `<g transform="translate(${px} ${top})"><path d="M-4 0 q-34 4 -34 -40 q18 14 34 8 V-96 L0 -118 L4 -96 V-32 q16 6 34 -8 q0 44 -34 40Z" fill="#D2D6DA" stroke="${INK2}" stroke-width="3" stroke-linejoin="round"/><path d="M0 -110 V-30" stroke="#9AA2AA" stroke-width="2.4"/><path d="M0 -4 q-7 22 0 34 q7 -12 0 -34Z" fill="${TQ.shu}" stroke="${INK2}" stroke-width="2.4"/></g>`;
  const sp = (px, top) => `<g transform="translate(${px} ${top})"><path d="M-9 0 L0 -66 L9 0Z" fill="#D2D6DA" stroke="${INK2}" stroke-width="3" stroke-linejoin="round"/><path d="M0 -58 V-6" stroke="#9AA2AA" stroke-width="2"/><path d="M0 2 q-12 18 -4 38 q10 -12 4 -38Z" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2.4"/></g>`;
  let b = pole(-70, -310, -4) + pole(-30, -350, -2) + pole(14, -328, 3) + pole(56, -300, 6) + ji(-74, -310) + sp(-32, -350) + ji(17, -328) + sp(62, -300);
  b += `<path d="M-100 0 V-250 M100 0 V-250" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M-100 0 V-250 M100 0 V-250" stroke="${wc}" stroke-width="11" stroke-linecap="round"/><rect x="-112" y="-262" width="224" height="16" rx="5" fill="${wc}" stroke="${INK2}" stroke-width="4.5"/><rect x="-108" y="-150" width="216" height="14" rx="5" fill="${wc}" stroke="${INK2}" stroke-width="4.5"/><circle cx="-100" cy="-272" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><circle cx="100" cy="-272" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`;
  // kiếm nằm trên thanh dưới, kiếm trên thanh trên
  b += `<g transform="translate(0 -160)"><rect x="-84" y="-10" width="160" height="14" rx="6" fill="#2E2A30" stroke="${INK2}" stroke-width="3.5"/><rect x="-50" y="-10" width="9" height="14" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2"/><rect x="28" y="-10" width="9" height="14" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2"/><rect x="76" y="-13" width="12" height="20" rx="3" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><rect x="88" y="-8" width="30" height="10" rx="4" fill="#5A2A22" stroke="${INK2}" stroke-width="3"/><path d="M118 -3 q14 6 10 26" stroke="${TQ.shu}" stroke-width="4" fill="none"/></g>`;
  // khiên tròn dựa bên phải
  b += `<ellipse cx="146" cy="-52" rx="44" ry="46" fill="${sh}" stroke="${INK2}" stroke-width="5"/><ellipse cx="146" cy="-52" rx="30" ry="32" fill="none" stroke="${TQ.gold}" stroke-width="3.5"/><circle cx="146" cy="-52" r="10" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><path d="M118 -80 q8 -10 20 -14" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.3"/>`;
  b += `<ellipse cx="0" cy="2" rx="150" ry="9" fill="#20140A" opacity="0.16"/>`;
  return _g(x, g, s, b);
}
// ghế soái trên bệ hai bậc, phủ da hổ: (x, g) giữa chân bệ; rộng bệ ≈ 440·s; cao ≈ 400·s
function tqC_throne(x, g, s = 1, o = {}) {
  const wc = o.c || '#5A2A22', tg = '#D98A32';
  let b = `<path d="M-230 0 V-34 H230 V0Z" fill="#8E7048" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-230 -8 H230" stroke="#6E5434" stroke-width="3"/><path d="M-200 -34 V-68 H200 V-34Z" fill="#A88A5E" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-200 -68 H200 L186 -80 H-186Z" fill="${o.dais || '#A8402E'}" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M-186 -80 H186" stroke="${TQ.gold}" stroke-width="3"/>`;
  b += `<g transform="translate(0 -72)">`;
  // chân + thanh giằng
  b += `<path d="M-74 -60 V0 M74 -60 V0" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M-74 -60 V0 M74 -60 V0" stroke="${wc}" stroke-width="11" stroke-linecap="round"/><path d="M-70 -24 H70" stroke="${INK2}" stroke-width="10"/><path d="M-70 -24 H70" stroke="${dk(wc, 0.1)}" stroke-width="5"/>`;
  // lưng ghế
  b += `<path d="M-84 -80 V-346 Q-84 -366 -64 -362 Q0 -380 64 -362 Q84 -366 84 -346 V-80Z" fill="${wc}" stroke="${INK2}" stroke-width="5.5" stroke-linejoin="round"/><path d="M-62 -100 V-330 Q0 -346 62 -330 V-100Z" fill="#7E3A2E" stroke="${INK2}" stroke-width="3.5"/><path d="M-96 -352 q-8 -22 14 -22 M96 -352 q8 -22 -14 -22" stroke="${INK2}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-96 -352 q-8 -22 14 -22 M96 -352 q8 -22 -14 -22" stroke="${TQ.gold}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  // tay vịn
  b += `<path d="M-112 -196 H-70 M112 -196 H70" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M-112 -196 H-70 M112 -196 H70" stroke="${wc}" stroke-width="11" stroke-linecap="round"/><path d="M-102 -196 V-96 M102 -196 V-96" stroke="${INK2}" stroke-width="14"/><path d="M-102 -196 V-96 M102 -196 V-96" stroke="${wc}" stroke-width="7"/><circle cx="-112" cy="-196" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><circle cx="112" cy="-196" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`;
  // mặt ngồi
  b += `<path d="M-100 -96 H100 L108 -62 H-108Z" fill="${tg}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  // da hổ phủ lưng ghế + rủ hai bên
  b += `<path d="M-90 -350 Q0 -376 90 -350 L96 -250 Q80 -200 92 -150 L70 -120 L40 -150 L10 -118 L-20 -150 L-50 -116 L-76 -150 Q-94 -200 -96 -250Z" fill="${tg}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 7; i++) { const yy = -336 + i * 30, w = 26 + hrnd(i, 5) * 10; b += `<path d="M-90 ${yy} q${w} 12 ${w * 1.6} -6 M90 ${yy + 8} q-${w} 12 -${w * 1.6} -6" stroke="${INK2}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-18 ${yy + 4} q18 14 36 0" stroke="${INK2}" stroke-width="6" fill="none" stroke-linecap="round"/>`; }
  b += `<path d="M-60 -150 l10 24 M-20 -150 l8 28 M40 -150 l10 30" stroke="#FFF2D8" stroke-width="6" stroke-linecap="round" opacity="0.8"/><path d="M-84 -352 Q0 -378 84 -352" stroke="#FFF2D8" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  b += `</g>`;
  return _g(x, g, s, b);
}

// bàn thấp đặt giữa cảnh (cận cảnh hai người đối diện): o.table của bg_truong_du / bg_truong_luong. Có cuộn giấy, nghiên mực, chén.
function tqC_midTable(T, c = '#7A4A30', o = {}) {
  const g = o.g || 1010, w = o.w || 470, top = g - 70 - 24;
  let s = tqC_lowTable(960, g, w, { c, leg: 70, top: lt_(c, 0.1) });
  s += tqC_scroll(840, top - 12, 1.25, -3) + `<path d="M900 ${top + 2} q40 -12 90 -4" stroke="${INK2}" stroke-width="3" fill="none"/>`;
  s += `<rect x="1010" y="${top - 18}" width="56" height="24" rx="6" fill="#3A3238" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="1038" cy="${top - 18}" rx="22" ry="7" fill="#161216" stroke="${INK2}" stroke-width="2.5"/>`;
  s += `<path d="M1090 ${top + 4} q-4 -34 8 -34 h34 q12 0 8 34Z" fill="#E8E2D2" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="1115" cy="${top - 30}" rx="21" ry="5" fill="#B87A3A" stroke="${INK2}" stroke-width="2.5"/>` + (o.steam === false ? '' : tqC_steam(1115, top - 34, T, 60));
  s += `<path d="M1160 ${top + 4} v-42 M1170 ${top + 4} v-52" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/><rect x="1150" y="${top - 16}" width="30" height="20" rx="4" fill="#6B3E26" stroke="${INK2}" stroke-width="3"/>`;
  return s;
}
// valance (diềm vải trên đỉnh có tua) toàn chiều ngang
function tqC_valance(col, T, h = 62, gold = '#E2C25A') {
  const n = 16, w = 1920 / n; let d = `M0 -10 H1920 V${h - 24}`;
  for (let i = n - 1; i >= 0; i--) d += ` Q${R1(i * w + w / 2)} ${h + 26} ${R1(i * w)} ${h - 24}`;
  d += 'Z';
  let s = `<path d="${d}" fill="${col}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < n; i++) s += `<path d="M${R1(i * w + 10)} ${h - 34} Q${R1(i * w + w / 2)} ${h + 8} ${R1(i * w + w - 10)} ${h - 34}" stroke="${gold}" stroke-width="3.5" fill="none"/><circle cx="${R1(i * w + w / 2)}" cy="${h + 6}" r="5" fill="${gold}" stroke="${INK2}" stroke-width="2"/>`;
  s += `<path d="M0 ${h - 40} H1920" stroke="${dk(col, 0.3)}" stroke-width="3" opacity="0.6"/>`;
  return s;
}

// ---------- Trướng soái Chu Du (Ngô lục) ở Giang Đông: lều lớn bên trong, ban ngày có đèn.
// Trái-sau sa bàn cát có thuyền/cờ; giữa-sau bản đồ treo (không chữ) + kệ binh khí; phải-sau ghế soái phủ da hổ, bức/cờ Ngô; hai rèm vén + hai đèn đồng; sàn thảm đỏ sẫm.
// o: table (bool) vẽ bàn thấp giữa cảnh (quân lệnh trạng/đối diện) · dim 0..1 tối bớt (Chu Du bệnh) · night (bool) đèn là chính
function bg_truong_du(t, o = {}) {
  const T = _T(t), G = TQ.wu, dim = Math.max(0, Math.min(1, o.dim ?? (o.night ? 0.5 : 0)));
  const R = tqC_tentRoom({ wall: '#DCCDA6', side: '#BFAE84', ceil: '#CDBB8E', fc: '#7A4A34', band: G, post: '#6B4428', beams: '#9A8052', bunt2: '#F2EBD2' });
  let s = R.s;
  // thảm đỏ sẫm trải giữa sàn
  s += tqC_rug(960, 770, 1090, 980, 1560, '#7A2A26', '#E2C25A');
  // lớp xa: cờ lệnh hai bên, bức treo sau ghế
  s += tqFlagD(292, 752, 500, G, T, { txt: 'NGÔ', w: 130, fh: 160, tail: true, fs: 58 });
  s += tqC_banner(1522, 176, 210, 310, G, T);
  s += tqFlagD(1640, 752, 500, G, T, { txt: 'NGÔ', w: 130, fh: 160, tail: true, fs: 58 });
  // bản đồ treo (chỉ sông/núi, không chữ) + kệ binh khí
  s += tqC_map(806, 196, 300, 300, T, { seed: 5, frame: '#3F7A55', tassel: G });
  s += tqC_weaponRack(1200, 760, 0.86, { shield: G });
  // khiên + hai thanh kiếm treo tường (trái)
  s += `<g transform="translate(540 330)">` + [-1, 1].map(d => `<g transform="rotate(${d * 38})"><rect x="-7" y="-130" width="14" height="230" rx="5" fill="#2E2A30" stroke="${INK2}" stroke-width="4"/><rect x="-14" y="-150" width="28" height="20" rx="5" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3.5"/><rect x="-5" y="-190" width="10" height="42" fill="#5A2A22" stroke="${INK2}" stroke-width="3"/></g>`).join('') + `<circle r="78" fill="${G}" stroke="${INK2}" stroke-width="6"/><circle r="60" fill="none" stroke="#E2C25A" stroke-width="5"/><circle r="22" fill="#E2C25A" stroke="${INK2}" stroke-width="4"/><path d="M-52 -34 q14 -16 34 -20" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="0.3"/></g>`;
  // sa bàn bên trái
  s += tqC_sandTable(540, 780, 1.0, T, {});
  // ghế soái trên bệ
  s += tqC_throne(1524, 792, 0.86, {});
  // đèn đồng hai bên
  s += tqC_lampStand(262, 1000, 1.05, T) + tqC_lampStand(1668, 1000, 1.05, T);
  if (o.table) s += tqC_midTable(T, '#7A4A30');
  // rèm vén hai bên + diềm trên
  s += tqC_drape(-1, 200, 520, dk(G, 0.1), T, { cord: '#E2C25A' }) + tqC_drape(1, 200, 520, dk(G, 0.1), T, { cord: '#E2C25A' }) + tqC_valance(G, T);
  // ánh sáng: nắng xuyên vải từ trên + vignette
  s += tqC_vgrad(0, 0, 1920, 620, [[0, '#FFF4C8', 0.32 * (1 - dim)], [1, '#FFF4C8', 0]]);
  s += tqC_vig('#1A0E08', 0.42 + 0.2 * dim);
  if (dim > 0) s += `<rect width="1920" height="1080" fill="#0E0A14" opacity="${R1(dim * 0.38 * 100) / 100}"/>` + tqC_glow(262, 700, 300, '#FFC866', 0.2 * dim) + tqC_glow(1668, 700, 300, '#FFC866', 0.2 * dim);
  s += motes(14, 200, 150, 1500, 700, '#FFF1C8', 0.4, 5);
  return s;
}

// giá sách ba tầng: thẻ tre, cuộn giấy, hộp thẻ
function tqC_shelf(x, g, s = 1, o = {}) {
  const wc = o.c || '#7A4A30', W = 250, H = 330;
  let b = `<path d="M${-W / 2} 0 V${-H} M${W / 2} 0 V${-H}" stroke="${INK2}" stroke-width="20" stroke-linecap="round"/><path d="M${-W / 2} 0 V${-H} M${W / 2} 0 V${-H}" stroke="${wc}" stroke-width="11" stroke-linecap="round"/>`;
  const tiers = [-20, -130, -240];
  // nội dung từng tầng (vẽ trước ván để chân chìm sau ván)
  const t0 = tiers[0], t1 = tiers[1], t2 = tiers[2];
  b += tqC_slips(-80, t0, 0.8, 9) + tqC_slips(-20, t0, 0.8, 7) + tqC_scroll(50, t0 - 14, 1.0, 0) + tqC_scroll(60, t0 - 42, 1.0, 2) + tqC_scroll(44, t0 - 70, 1.0, -2);
  b += tqC_slips(-84, t1, 0.8, 8) + tqC_slips(-34, t1, 0.8, 9) + tqC_slips(16, t1, 0.8, 7) + `<rect x="62" y="${t1 - 56}" width="54" height="56" fill="#8A5A3A" stroke="${INK2}" stroke-width="3.5"/><path d="M62 ${t1 - 38} H116" stroke="${dk('#8A5A3A', 0.3)}" stroke-width="3"/><rect x="82" y="${t1 - 40}" width="14" height="10" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2"/>`;
  b += tqC_scroll(-70, t2 - 14, 1.0, 0) + tqC_scroll(-62, t2 - 42, 1.0, 2) + tqC_scroll(-76, t2 - 70, 1.0, -2) + tqC_slips(10, t2, 0.8, 9) + tqC_slips(64, t2, 0.8, 8);
  for (const y of tiers) b += `<rect x="${-W / 2 - 8}" y="${y}" width="${W + 16}" height="14" rx="4" fill="${wc}" stroke="${INK2}" stroke-width="4.5"/>`;
  b += `<rect x="${-W / 2 - 12}" y="${-H - 12}" width="${W + 24}" height="16" rx="5" fill="${dk(wc, 0.15)}" stroke="${INK2}" stroke-width="4.5"/>`;
  return _g(x, g, s, b);
}
// đèn dầu đồng nhỏ (đặt bàn): (x, y) đáy
function tqC_oilLamp(x, y, s = 1, T = AT_(), o = {}) {
  const fl = 1 + Math.sin(T * 9 + x) * 0.07 + Math.sin(T * 15 + x * 2) * 0.04;
  return tqC_glow(x, y - 52 * s, 190 * s * fl, '#FFC866', o.glow ?? 0.4) + _g(x, y, s, `<ellipse cx="0" cy="-4" rx="30" ry="8" fill="#B8902A" stroke="${INK2}" stroke-width="3.5"/><path d="M-6 -6 V-34" stroke="${INK2}" stroke-width="10"/><path d="M-6 -6 V-34" stroke="#B8902A" stroke-width="5"/><path d="M-34 -42 Q-30 -26 0 -26 Q30 -26 34 -42Z" fill="#B8902A" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="0" cy="-42" rx="34" ry="6" fill="#6B4A1A" stroke="${INK2}" stroke-width="3"/><path d="M-30 -44 q-14 -4 -12 -14" stroke="${INK2}" stroke-width="3.5" fill="none"/><g transform="translate(26 -44) scale(${R1(0.26 * fl * 100) / 100})">${tqFlame(0, 0, 1, T, { seed: x + 3 })}</g>`);
}
// ống bút + nghiên mực + ống lệnh tiễn
function tqC_penHolder(x, y, s = 1) { return _g(x, y, s, `<path d="M-6 -40 L-16 -78 M2 -40 L4 -86 M8 -40 L22 -74" stroke="${INK2}" stroke-width="5" stroke-linecap="round"/><path d="M-16 -78 q-3 -10 4 -12 q5 6 -4 12 M4 -86 q-3 -12 5 -14 q5 8 -5 14 M22 -74 q-2 -10 6 -12 q4 8 -6 12" fill="#2A2420" stroke="${INK2}" stroke-width="2.5"/><path d="M-26 0 L-22 -44 H26 L30 0Z" fill="#6E8A62" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M-22 -34 H26" stroke="${dk('#6E8A62', 0.3)}" stroke-width="3"/>`); }
function tqC_inkstone(x, y, s = 1) { return _g(x, y, s, `<path d="M-40 0 L-34 -22 H40 L46 0Z" fill="#3A3238" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="6" cy="-22" rx="30" ry="7" fill="#15110F" stroke="${INK2}" stroke-width="3"/><rect x="-34" y="-44" width="46" height="22" rx="3" fill="#2A2420" stroke="${INK2}" stroke-width="3" transform="rotate(-14 -34 -22)"/><path d="M-30 -36 l30 -6" stroke="${TQ.gold}" stroke-width="2.4"/>`); }
// ống lệnh tiễn: n mũi lệnh tiễn (tên có cờ đỏ)
function tqC_arrowTube(x, y, s = 1, n = 4, T = AT_()) {
  let b = '';
  for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 10, wv = Math.sin(T * 3 + i) * 2; b += `<g transform="translate(${(i - (n - 1) / 2) * 9} -90) rotate(${a})"><path d="M0 100 V-84" stroke="${INK2}" stroke-width="7" stroke-linecap="round"/><path d="M0 100 V-84" stroke="#D8C08A" stroke-width="3.2" stroke-linecap="round"/><path d="M-6 -80 L0 -102 L6 -80Z" fill="#CFD4D8" stroke="${INK2}" stroke-width="2.4" stroke-linejoin="round"/><path d="M0 -62 h${R1(34 + wv)} l-8 12 l8 12 h${R1(-34 - wv)}Z" fill="${TQ.shu}" stroke="${INK2}" stroke-width="2.8" stroke-linejoin="round"/></g>`; }
  b += `<path d="M-30 0 L-26 -92 H26 L30 0Z" fill="#8A3A2A" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-27 -26 H27 M-27 -66 H27" stroke="${TQ.gold}" stroke-width="4"/><ellipse cx="0" cy="-92" rx="26" ry="6" fill="#4A1E16" stroke="${INK2}" stroke-width="3"/>`;
  return _g(x, y, s, b);
}
// thẻ tre trải phẳng trên bàn (dải nằm ngang)
function tqC_slipRow(x, y, w = 150, n = 14) { let b = ''; const sw = w / n; for (let i = 0; i < n; i++) b += `<rect x="${R1(x - w / 2 + i * sw)}" y="${y - 12}" width="${R1(sw - 1)}" height="14" fill="${i % 2 ? '#D8C084' : '#C9AE6A'}" stroke="${INK2}" stroke-width="2"/>`; b += `<path d="M${x - w / 2} ${y - 8} H${x + w / 2} M${x - w / 2} ${y - 2} H${x + w / 2}" stroke="#7A3A2A" stroke-width="1.8"/>`; return b; }
// lư hương đồng ba chân có khói mỏng
function tqC_censer(x, g, s = 1, T = AT_(), steam = true) {
  return _g(x, g, s, `<path d="M-46 0 L-38 -30 M46 0 L38 -30 M0 0 V-30" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M-46 0 L-38 -30 M46 0 L38 -30" stroke="#B8902A" stroke-width="6.5" stroke-linecap="round"/><path d="M-62 -30 Q-70 -70 -56 -96 H56 Q70 -70 62 -30Z" fill="#B8902A" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-66 -62 H66" stroke="${dk('#B8902A', 0.3)}" stroke-width="3"/><path d="M-40 -46 l10 -12 l10 12 l10 -12 l10 12 l10 -12 l10 12 l10 -12 l10 12" stroke="${dk('#B8902A', 0.3)}" stroke-width="3" fill="none" stroke-linejoin="miter"/><path d="M-60 -92 V-138 H-42 V-96 M60 -92 V-138 H42 V-96" fill="none" stroke="${INK2}" stroke-width="13" stroke-linejoin="round"/><path d="M-60 -92 V-138 H-42 V-96 M60 -92 V-138 H42 V-96" fill="none" stroke="#B8902A" stroke-width="6" stroke-linejoin="round"/><path d="M-44 -96 Q-44 -126 0 -132 Q44 -126 44 -96Z" fill="#9A7A28" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-24 -108 l8 -8 M-6 -112 l8 -8 M12 -108 l8 -8" stroke="${INK2}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="0" cy="-136" r="6" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`) + (steam ? tqC_steam(x, g - 150 * s, T, 130 * s, '#E8E4DA', 0.55) : '');
}
// hòm quân lệnh: nắp cong, đai sắt, khoá vàng, dây đỏ
function tqC_chest(x, g, s = 1, c = '#7A4A30') {
  return _g(x, g, s, `<rect x="-90" y="-84" width="180" height="84" fill="${c}" stroke="${INK2}" stroke-width="5"/><path d="M-90 -84 Q-90 -132 0 -134 Q90 -132 90 -84Z" fill="${lt_(c, 0.1)}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-90 -84 H90" stroke="${INK2}" stroke-width="5"/>` + [-60, 60].map(dx => `<rect x="${dx - 9}" y="-130" width="18" height="130" fill="#4A4448" stroke="${INK2}" stroke-width="3.5"/>`).join('') + `<path d="M-84 -58 H84" stroke="${dk(c, 0.3)}" stroke-width="3"/><rect x="-14" y="-102" width="28" height="30" rx="4" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3.5"/><circle cx="0" cy="-88" r="4" fill="${INK2}"/><path d="M-6 -72 q-6 22 -2 40 M6 -72 q6 22 2 40" stroke="${TQ.shu}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-78 -112 q-4 -10 6 -14" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.25"/><ellipse cx="0" cy="2" rx="104" ry="9" fill="#20140A" opacity="0.16"/>`);
}
// kệ để quạt lông: chân chữ thập, trụ, hai chạc, quạt lông hạc
function tqC_fanStand(x, g, s = 1, o = {}) {
  let b = `<path d="M-60 0 L0 -22 L60 0 M-48 8 L48 8" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M-60 0 L0 -22 L60 0" stroke="#6B4428" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M0 -20 V-240" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M0 -20 V-240" stroke="#7A4A30" stroke-width="9" stroke-linecap="round"/>`;
  b += `<path d="M-46 -266 Q-34 -236 0 -240 Q34 -236 46 -266" stroke="${INK2}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-46 -266 Q-34 -236 0 -240 Q34 -236 46 -266" stroke="#7A4A30" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-46" cy="-270" r="7" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/><circle cx="46" cy="-270" r="7" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`;
  // quạt lông nằm trên chạc
  let fan = `<g transform="translate(0 -250) rotate(-8)"><path d="M-84 0 H-30" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M-84 0 H-30" stroke="#6B4428" stroke-width="6" stroke-linecap="round"/><circle cx="-90" cy="0" r="6" fill="${TQ.shu}" stroke="${INK2}" stroke-width="2.5"/>`;
  for (let i = 0; i < 9; i++) { const a = -62 + i * 15.5, r = 150 + (i % 2) * 8; fan += `<g transform="translate(-26 0) rotate(${a})"><path d="M0 0 Q${r * 0.2} ${-r * 0.5} 0 ${-r} Q${-r * 0.2} ${-r * 0.5} 0 0Z" fill="${i % 2 ? '#F6F2E6' : '#E6E0D0'}" stroke="${INK2}" stroke-width="3" stroke-linejoin="round" transform="rotate(90)"/></g>`; }
  fan += `<circle cx="-26" cy="0" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/></g>`;
  return _g(x, g, s, b + fan);
}
// cờ treo tường nhỏ có đuôi nheo
const tqC_pennant = (x, y, c, T, w = 70, h = 190) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-14" stroke="${INK2}" stroke-width="4"/><path d="M-${w / 2} 0 H${w / 2} V${h} L0 ${h - 34} L-${w / 2} ${h}Z" fill="${c}" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-${w / 2 - 8} 12 H${w / 2 - 8}" stroke="${TQ.gold}" stroke-width="3"/></g>`;

// ---------- Trướng thừa tướng của Lượng (Thục, đỏ gạch): lều quân bên trong, giản dị thanh nhã, ánh đèn dầu vàng ấm.
// Giữa-sau bản đồ lớn (không chữ, đinh ghim + chỉ đỏ); trái-sau giá thẻ tre/cuộn sách + cờ Thục; phải-sau bàn thấp (đèn dầu, nghiên bút, thẻ tre, ống lệnh tiễn) + kệ quạt lông + lư hương khói; hòm quân lệnh trước-trái.
// o: dim 0..1 tối/đèn leo lét (Lượng bệnh, dặn Dương Nghi) · table (bool) bàn thấp giữa cảnh (Mã Tắc quỳ / đối diện)
function bg_truong_luong(t, o = {}) {
  const T = _T(t), dim = Math.max(0, Math.min(1, o.dim ?? 0)), S2 = TQ.shu2;
  const R = tqC_tentRoom({ wall: '#A8573F', side: '#8A4430', ceil: '#8E4A36', fc: '#5E4030', band: '#5A1E16', post: '#4E3220', beams: '#6E4426', gold: '#D8B860', bunt2: '#E8D6B4', bandPat: 'cloud' });
  let s = R.s;
  // chiếu cói trải giữa sàn
  s += tqC_rug(960, 770, 1090, 940, 1500, '#B89A58', '#7E6234', { pat: 'weave', psc: 1.4, med: false });
  // cờ và đồ phía sau
  s += tqFlagD(296, 752, 500, TQ.shu, T, { txt: 'THỤC', w: 130, fh: 160, tail: true, fs: 56 });
  s += tqC_shelf(520, 760, 1.0, {});
  s += tqC_map(650, 168, 540, 380, T, { seed: 11, frame: '#7E2C1E', tassel: '#D8B860', c: '#E2D2A6', pins: [[0.14, 0.82], [0.28, 0.64], [0.46, 0.56], [0.6, 0.38], [0.8, 0.26]], dash: '10 6' });
  s += tqC_fanStand(1236, 772, 0.7);
  s += tqC_lowTable(1490, 775, 380, { c: '#7A4A30', leg: 74 });
  const ty = 775 - 74 - 24;
  s += tqC_slipRow(1540, ty - 6, 110, 11) + tqC_penHolder(1424, ty - 2, 1.0) + tqC_inkstone(1480, ty - 2, 0.95) + tqC_arrowTube(1628, ty - 2, 1.0, 4, T) + tqC_oilLamp(1346, ty - 2, 1.15, T, { glow: 0.5 + 0.2 * dim });
  s += tqC_censer(1790, 880, 1.1, T);
  // đèn treo trần
  s += wxLantern(430, 190, 0.8, '#D8993A', T) + wxLantern(1500, 190, 0.8, '#D8993A', T);
  s += tqC_chest(300, 930, 1.0);
  if (o.table) s += tqC_midTable(T, '#7A4A30', { steam: false });
  // ánh sáng: ấm từ đèn, tối góc
  s += tqC_glow(1380, 640, 460, '#FFB454', 0.26 + 0.12 * dim, 0.8) + tqC_glow(960, 460, 760, '#FFD890', 0.12 * (1 - dim), 0.6);
  s += tqC_vig('#1A0C06', 0.5 + 0.2 * dim);
  if (dim > 0) { const fl = 1 + Math.sin(T * 7) * 0.05; s += `<rect width="1920" height="1080" fill="#10080C" opacity="${R1(dim * 0.5 * 100) / 100}"/>` + tqC_glow(1360, 700, 300 * fl, '#FFB454', 0.35 * dim, 0.8); }
  s += motes(12, 300, 150, 1400, 700, '#FFE0A0', 0.4, 9);
  return s;
}

// bông cúc: (cx, cy) tâm, r bán kính, col màu cánh
function tqC_flower(cx, cy, r, col = '#F6F2E6') {
  let b = ''; for (let i = 0; i < 9; i++) b += `<ellipse cx="${R1(cx + Math.cos(i / 9 * 6.283) * r * 0.55)}" cy="${R1(cy + Math.sin(i / 9 * 6.283) * r * 0.55)}" rx="${R1(r * 0.5)}" ry="${R1(r * 0.24)}" transform="rotate(${R1(i / 9 * 360)} ${R1(cx + Math.cos(i / 9 * 6.283) * r * 0.55)} ${R1(cy + Math.sin(i / 9 * 6.283) * r * 0.55)})" fill="${col}" stroke="${INK2}" stroke-width="1.8"/>`;
  return b + `<circle cx="${R1(cx)}" cy="${R1(cy)}" r="${R1(r * 0.28)}" fill="#E8B83A" stroke="${INK2}" stroke-width="1.8"/>`;
}
// vòng hoa tang trên giá: (x, g) chân giá; r bán kính vòng; trắng xen vàng, ruy băng trắng
function tqC_wreath(x, g, r = 90, s = 1) {
  const cy = -r - 140; let b = `<path d="M${-r * 0.62} 0 L0 ${cy + r} M${r * 0.62} 0 L0 ${cy + r}" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/><path d="M${-r * 0.62} 0 L0 ${cy + r} M${r * 0.62} 0 L0 ${cy + r}" stroke="#5E4630" stroke-width="6.5" stroke-linecap="round"/><path d="M0 0 V${cy + r}" stroke="${INK2}" stroke-width="12"/><path d="M0 0 V${cy + r}" stroke="#6E5438" stroke-width="6"/>`;
  b += `<circle cx="0" cy="${cy}" r="${r}" fill="none" stroke="${INK2}" stroke-width="36"/><circle cx="0" cy="${cy}" r="${r}" fill="none" stroke="#4E6E48" stroke-width="28"/>`;
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + 0.2; b += `<ellipse cx="${R1(Math.cos(a) * r)}" cy="${R1(cy + Math.sin(a) * r)}" rx="14" ry="6" transform="rotate(${R1(a * 57.3 + 90)} ${R1(Math.cos(a) * r)} ${R1(cy + Math.sin(a) * r)})" fill="${i % 2 ? '#5E8A56' : '#3E5E3A'}" stroke="${INK2}" stroke-width="2"/>`; }
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; b += tqC_flower(Math.cos(a) * r, cy + Math.sin(a) * r, i % 3 === 0 ? 16 : 20, i % 3 === 0 ? '#F2C84A' : '#F6F2E6'); }
  b += `<path d="M0 ${cy + r + 12} q-10 40 -8 76 M0 ${cy + r + 12} q10 40 8 76" stroke="${INK2}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M0 ${cy + r + 12} q-10 40 -8 76 M0 ${cy + r + 12} q10 40 8 76" stroke="#F4F1EA" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-12 ${cy + r + 86} h8 M4 ${cy + r + 86} h8" stroke="${TQ.gold}" stroke-width="5"/>`;
  b += `<ellipse cx="0" cy="3" rx="${R1(r * 0.8)}" ry="8" fill="#20140A" opacity="0.18"/>`;
  return _g(x, g, s, b);
}
// tấm vải trắng treo (màn): x tâm, y mép trên, w rộng, h dài; đáy lượn sóng; n nếp
function tqC_cloth(x, y, w, h, T = AT_(), o = {}) {
  const c = o.c || '#F2EFE8', n = o.n || Math.max(3, Math.round(w / 48)), sw = (k) => Math.sin(T * 0.7 + k + x * 0.01) * 2.5;
  let d = `M${R1(x - w / 2)} ${y} H${R1(x + w / 2)} V${R1(y + h)}`;
  for (let i = n - 1; i >= 0; i--) d += ` Q${R1(x - w / 2 + (i + 0.5) * w / n)} ${R1(y + h + 16 + sw(i))} ${R1(x - w / 2 + i * w / n)} ${R1(y + h - (i % 2) * 5)}`;
  d += 'Z';
  let b = `<path d="${d}" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 4.5}" stroke-linejoin="round"/>`;
  for (let i = 1; i < n; i++) { const xx = x - w / 2 + i * w / n; b += `<path d="M${R1(xx + sw(i))} ${y + 6} Q${R1(xx + 5 + sw(i + 3))} ${R1(y + h * 0.5)} ${R1(xx + sw(i))} ${R1(y + h + 6)}" stroke="${dk(c, 0.2)}" stroke-width="3.2" fill="none" opacity="0.8"/><path d="M${R1(xx + 8)} ${y + 8} Q${R1(xx + 12)} ${R1(y + h * 0.5)} ${R1(xx + 8)} ${R1(y + h - 6)}" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.5"/>`; }
  if (o.hem) b += `<path d="M${R1(x - w / 2 + 3)} ${y + 8} H${R1(x + w / 2 - 3)}" stroke="${o.hem}" stroke-width="10"/>`;
  return b;
}
// bài vị: bệ + tấm gỗ sơn đen viền vàng, thẻ giấy trắng để TRỐNG (không chữ)
function tqC_tablet(x, g, s = 1) {
  return _g(x, g, s, `<path d="M-52 0 L-44 -26 H44 L52 0Z" fill="#8A6A28" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-40 -26 V-44 H40 V-26Z" fill="#6B4A1E" stroke="${INK2}" stroke-width="4"/><path d="M-56 -44 H56 V-212 Q56 -232 0 -246 Q-56 -232 -56 -212Z" fill="#241A16" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-46 -54 H46 V-208 Q46 -222 0 -234 Q-46 -222 -46 -208Z" fill="none" stroke="${TQ.gold}" stroke-width="4"/><rect x="-26" y="-190" width="52" height="116" fill="#F4EFE2" stroke="${INK2}" stroke-width="3"/><path d="M-26 -86 H26" stroke="#D8CFB8" stroke-width="2" opacity="0.7"/><circle cx="0" cy="-226" r="6" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2.5"/>`);
}
// đĩa trái cây
function tqC_fruit(x, y, s = 1) { return _g(x, y, s, `<path d="M-40 0 Q-36 14 0 14 Q36 14 40 0Z" fill="#E8E2D2" stroke="${INK2}" stroke-width="3.5"/>` + [[-18, -12, '#E8963A'], [0, -14, '#E8B83A'], [18, -12, '#E8963A'], [-8, -30, '#D8603A'], [10, -30, '#E8B83A']].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="14" fill="${c}" stroke="${INK2}" stroke-width="3"/>`).join('')); }
// bình hoa cúc trắng
function tqC_vase(x, y, s = 1) { return _g(x, y, s, `<path d="M-18 0 Q-26 -34 -10 -56 H10 Q26 -34 18 0Z" fill="#9AB0B0" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M-6 -56 V-96 M0 -56 V-110 M6 -56 V-92" stroke="#4E6E48" stroke-width="4"/>` + tqC_flower(-8, -104, 15) + tqC_flower(8, -118, 17, '#F2C84A') + tqC_flower(20, -98, 14)); }

// ---------- Linh đường Sài Tang (tang lễ Chu Du): sảnh rộng, vải trắng rủ từ xà, bàn thờ sau với bài vị (trống), lư hương, hai hàng nến trắng, vòng hoa trắng–vàng, màn trắng, cột sơn đen-đỏ thẫm, cờ tang trắng.
// Ánh sáng nến ấm trên nền xám lạnh. Sàn đá xám phẳng + thảm vải trắng ở giữa chừa chỗ nhân vật. o: dim 0..1 tối hơn (đêm canh linh) · warm 0..1 nến ấm hơn
function bg_sai_tang(t, o = {}) {
  const T = _T(t), dim = Math.max(0, Math.min(1, o.dim ?? 0)), warm = o.warm ?? 0.5;
  const bx0 = 300, bx1 = 1620, by0 = 110, by1 = 720;
  let s = room1p({ bx0, bx1, by0, by1, wall: '#CFCABB', side: '#A8A394', ceil: '#6E675E', fc: '#8A8780', wain: false, paper: false, floor: 'tile', beams: '#3E2220', night: true });
  // tường hậu: bệ đá chân tường + xà ngang đỏ thẫm
  s += `<rect x="${bx0}" y="${by1 - 70}" width="${bx1 - bx0}" height="70" fill="#A6A294" stroke="${INK2}" stroke-width="4"/>` + [...Array(11)].map((_, i) => `<path d="M${bx0 + i * 132} ${by1 - 70} v70" stroke="#8E8A7C" stroke-width="3"/>`).join('');
  s += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="52" fill="#4A2220" stroke="${INK2}" stroke-width="5"/><path d="M${bx0} ${by0 + 12} H${bx1} M${bx0} ${by0 + 40} H${bx1}" stroke="#6E3A30" stroke-width="3"/>` + [...Array(24)].map((_, i) => `<rect x="${bx0 + 14 + i * 55}" y="${by0 + 18}" width="26" height="16" fill="#8A6A28" stroke="${INK2}" stroke-width="2.5"/>`).join('');
  // cửa sổ hoa hai bên vịnh + màn trắng
  for (const wx of [470, 1450]) {
    s += `<rect x="${wx - 80}" y="240" width="160" height="380" fill="#B8C6CE" stroke="${INK2}" stroke-width="6"/>` + tqC_vgrad(wx - 80, 240, 160, 380, [[0, '#FFFFFF', 0.35], [1, '#FFFFFF', 0]]);
    for (let i = 1; i < 5; i++) s += `<path d="M${wx - 80 + i * 32} 240 V620" stroke="${INK2}" stroke-width="4"/>`;
    for (let i = 1; i < 8; i++) s += `<path d="M${wx - 80} ${240 + i * 47.5} H${wx + 80}" stroke="${INK2}" stroke-width="3.5"/>`;
    s += `<rect x="${wx - 92}" y="228" width="184" height="16" fill="#4A2220" stroke="${INK2}" stroke-width="4"/><rect x="${wx - 92}" y="616" width="184" height="16" fill="#4A2220" stroke="${INK2}" stroke-width="4"/>`;
    s += tqC_cloth(wx - 100, 170, 70, 470, T, { n: 3 }) + tqC_cloth(wx + 100, 170, 70, 470, T, { n: 3 });
  }
  // màn trắng sau bàn thờ + khung đen
  s += `<rect x="738" y="162" width="444" height="520" fill="#E9E5DA" stroke="${INK2}" stroke-width="5"/>` + tqC_cloth(960, 164, 430, 508, T, { c: '#EFEBE0', n: 8, hem: '#2A211C', sw: 3.5 });
  // bàn thờ: mặt + khăn trắng trước
  const ty = 590;
  s += `<rect x="716" y="${ty}" width="488" height="18" rx="4" fill="#2E1E18" stroke="${INK2}" stroke-width="5"/>`;
  s += tqC_cloth(960, ty + 18, 448, 124, T, { c: '#F4F1EA', n: 8, hem: '#2A211C', sw: 4 }) + `<path d="M740 ${ty + 118} H1180" stroke="${TQ.gold}" stroke-width="2.4" opacity="0.8"/>`;
  s += tqC_tablet(960, ty, 1.0) + tqC_censer(960, ty + 2, 0.58, T, false) + tqC_fruit(840, ty, 0.9) + tqC_fruit(1080, ty, 0.9) + tqC_vase(768, ty, 1.0) + tqC_vase(1152, ty, 1.0);
  s += tqC_candle(886, ty, 1.15, T, '#F4EFE2', { h: 84 }) + tqC_candle(1034, ty, 1.15, T, '#F4EFE2', { h: 84 });
  // cột đen-đỏ thẫm
  for (const [x, w] of [[bx0, 62], [700, 56], [1220, 56], [bx1, 62]]) s += columnD(x, by0 - 4, by1 + 18, w, '#3E1E1C').replace(/#EDE6D6/g, '#3E1E1C');
  // vải trắng rủ từ xà: ba nhịp lớn
  const swag = (xa, xb, d, c = '#F2EFE8') => { const xm = (xa + xb) / 2; let b = `<path d="M${xa} ${by0 + 50} Q${xm} ${by0 + 50 + d * 1.9} ${xb} ${by0 + 50} V${by0 + 38} H${xa}Z" fill="${c}" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/>`; for (let i = 1; i < 7; i++) { const u = i / 7, px = xa + (xb - xa) * u, py = by0 + 50 + 2 * d * 1.9 * 0.5 * (1 - Math.pow(2 * u - 1, 2)) * 0.5 * 1.0; b += `<path d="M${R1(px)} ${by0 + 44} Q${R1(px + (u - 0.5) * 6)} ${R1(by0 + 50 + d * 0.9 * (1 - Math.pow(2 * u - 1, 2)))} ${R1(px)} ${R1(by0 + 50 + d * 1.9 * 0.5 * (1 - Math.pow(2 * u - 1, 2)) + 4)}" stroke="${dk(c, 0.2)}" stroke-width="2.6" fill="none"/>`; } return b; };
  s += swag(bx0, 700, 56) + swag(700, 1220, 70) + swag(1220, bx1, 56);
  // dải vải trắng buông dọc hai bên bàn thờ
  s += tqC_cloth(752, 160, 40, 330, T, { n: 2 }) + tqC_cloth(1168, 160, 40, 330, T, { n: 2 });
  // thảm vải trắng giữa sàn + hai hàng nến
  s += tqC_rug(960, 740, 1090, 330, 820, '#E4DFD0', '#8E8A7C', { med: false, pat: 'diamond', psc: 1.3 });
  for (let i = 0; i < 6; i++) { const z = i / 5, y = 780 + 270 * Math.pow(z, 1.15), k = 0.55 + 0.7 * z, dx = 300 + 300 * z + 40 * z * z; for (const sd of [-1, 1]) s += tqC_candle(960 + sd * (dx + 100 * z), y, k, T + i * 0.7 + (sd > 0 ? 2 : 0), '#F4EFE2', { h: 60 }); }
  // vòng hoa
  s += tqC_wreath(600, 760, 80, 0.95) + tqC_wreath(1320, 760, 80, 0.95) + tqC_wreath(412, 800, 70, 0.95) + tqC_wreath(1508, 800, 70, 0.95);
  // cờ tang trắng + đèn lồng trắng
  s += tqFlagD(110, 960, 600, '#F4F1EA', T, { w: 120, fh: 170, tail: true, trim: '#2A211C' }) + tqFlagD(1750, 960, 600, '#F4F1EA', T, { w: 120, fh: 170, tail: true, trim: '#2A211C' });
  s += wxLantern(610, 220, 0.85, '#F2EEE2', T) + wxLantern(1310, 220, 0.85, '#F2EEE2', T);
  // ánh sáng: nền lạnh + quầng nến ấm + tối góc
  s += `<rect width="1920" height="1080" fill="#6A7894" opacity="${R1((0.1 + 0.08 * dim) * 100) / 100}"/>`;
  s += tqC_glow(960, 520, 430, '#FFC878', 0.26 + 0.2 * warm, 0.75) + tqC_glow(960, 900, 620, '#FFC878', 0.1 + 0.1 * warm, 0.3);
  s += tqC_vig('#0A0C14', 0.52 + 0.2 * dim, 0.55);
  if (dim > 0) s += `<rect width="1920" height="1080" fill="#080A14" opacity="${R1(dim * 0.35 * 100) / 100}"/>` + tqC_glow(960, 540, 460, '#FFC878', 0.22 * dim, 0.7);
  s += motes(12, 300, 200, 1300, 700, '#FFF1C8', 0.35, 4);
  return s;
}

// đèn cung đình lục giác treo trần: (x, y) điểm treo, s tỉ lệ
function tqC_palaceLamp(x, y, s = 1, T = AT_(), o = {}) {
  const sw = Math.sin(T * 1.1 + x * 0.01) * 1.6, fl = 1 + Math.sin(T * 6 + x) * 0.04;
  return tqC_glow(x, y + 150 * s, 230 * s * fl, '#FFC070', o.glow ?? 0.34) + `<g transform="translate(${R1(x)} ${R1(y)}) rotate(${R1(sw)}) scale(${s})"><path d="M0 0 V70" stroke="${INK2}" stroke-width="6"/><path d="M-22 70 H22 L14 52 H-14Z" fill="#C9A227" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M-70 70 Q-70 60 -40 60 H40 Q70 60 70 70 L56 90 H-56Z" fill="#7E2E24" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-56 90 H56 V200 H-56Z" fill="#F2C86A" stroke="${INK2}" stroke-width="5"/><path d="M-56 90 H56 V200 H-56Z" fill="#FFF0B0" opacity="${R1(0.5 * fl * 100) / 100}"/><path d="M-19 90 V200 M19 90 V200" stroke="${INK2}" stroke-width="5"/><path d="M-56 90 V200 M56 90 V200" stroke="#7E2E24" stroke-width="8"/><path d="M-56 200 H56 L66 214 H-66Z" fill="#7E2E24" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="145" r="22" fill="#FFB43A" opacity="0.6"/><path d="M-40 214 v44 M-20 214 v58 M0 214 v70 M20 214 v58 M40 214 v44" stroke="${INK2}" stroke-width="6" stroke-linecap="round"/><path d="M-40 214 v44 M-20 214 v58 M0 214 v70 M20 214 v58 M40 214 v44" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="290" r="9" fill="#C9A227" stroke="${INK2}" stroke-width="3"/></g>`;
}
// bình phong ba tấm vẽ núi thông (không chữ): x trái, g chân, w rộng, h cao
function tqC_screen(x, g, w, h, T = AT_(), o = {}) {
  const pw = w / 3, top = g - h, fr = '#4A2218', sk = o.silk || '#E4CF9E';
  let b = `<path d="M${x - 8} ${g} h30 M${x + w - 22} ${g} h30" stroke="${INK2}" stroke-width="16" stroke-linecap="round"/><path d="M${x - 8} ${g} h30 M${x + w - 22} ${g} h30" stroke="${fr}" stroke-width="9" stroke-linecap="round"/>`;
  for (let i = 0; i < 3; i++) { const px = x + i * pw; b += `<rect x="${R1(px)}" y="${top}" width="${R1(pw)}" height="${h}" fill="${fr}" stroke="${INK2}" stroke-width="5"/><rect x="${R1(px + 9)}" y="${top + 9}" width="${R1(pw - 18)}" height="${h - 18}" fill="${sk}" stroke="${INK2}" stroke-width="3"/>`; }
  // tranh liền ba tấm: núi xa, núi gần, thông, sương
  const pY = top + 9, pH = h - 18, px0 = x + 9, pW = w - 18;
  b += `<path d="M${px0} ${pY + pH * 0.55} L${px0 + pW * 0.15} ${pY + pH * 0.3} L${px0 + pW * 0.3} ${pY + pH * 0.5} L${px0 + pW * 0.5} ${pY + pH * 0.2} L${px0 + pW * 0.7} ${pY + pH * 0.5} L${px0 + pW * 0.85} ${pY + pH * 0.32} L${px0 + pW} ${pY + pH * 0.5} V${pY + pH * 0.7} H${px0}Z" fill="#B4BCA8" stroke="${INK2}" stroke-width="2.4" stroke-linejoin="round"/>`;
  b += `<path d="M${px0} ${pY + pH * 0.78} Q${px0 + pW * 0.25} ${pY + pH * 0.5} ${px0 + pW * 0.5} ${pY + pH * 0.7} T${px0 + pW} ${pY + pH * 0.62} V${pY + pH} H${px0}Z" fill="#7E9A78" stroke="${INK2}" stroke-width="2.6"/>`;
  b += `<ellipse cx="${px0 + pW * 0.55}" cy="${pY + pH * 0.62}" rx="${pW * 0.35}" ry="${pH * 0.04}" fill="#F4ECD8" opacity="0.7"/>`;
  for (const [u, k] of [[0.18, 1.0], [0.3, 0.7], [0.82, 0.9]]) { const tx = px0 + pW * u, ty = pY + pH * 0.9; b += `<path d="M${R1(tx)} ${R1(ty)} V${R1(ty - 60 * k)}" stroke="${INK2}" stroke-width="3.5"/>` + [0, 1, 2].map(j => `<path d="M${R1(tx - (26 - j * 6) * k)} ${R1(ty - (20 + j * 24) * k)} L${R1(tx)} ${R1(ty - (52 + j * 24) * k)} L${R1(tx + (26 - j * 6) * k)} ${R1(ty - (20 + j * 24) * k)}Z" fill="#3E5E44" stroke="${INK2}" stroke-width="2.4" stroke-linejoin="round"/>`).join(''); }
  b += `<circle cx="${px0 + pW * 0.7}" cy="${pY + pH * 0.16}" r="${R1(pW * 0.07)}" fill="#E8985A" opacity="0.85" stroke="${INK2}" stroke-width="2"/>`;
  for (let i = 1; i < 3; i++) b += `<circle cx="${R1(x + i * pw)}" cy="${R1(top + h * 0.3)}" r="5" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2.4"/><circle cx="${R1(x + i * pw)}" cy="${R1(top + h * 0.72)}" r="5" fill="${TQ.gold}" stroke="${INK2}" stroke-width="2.4"/>`;
  return b;
}
// bát thuốc bốc hơi + thìa + ấm sứ nhỏ, đặt trên mặt bàn tại (x, y)
function tqC_medicine(x, y, T = AT_()) {
  return `<ellipse cx="${x}" cy="${y}" rx="64" ry="9" fill="#20140A" opacity="0.2"/><path d="M${x - 34} ${y - 40} Q${x - 30} ${y - 4} ${x} ${y - 2} Q${x + 30} ${y - 4} ${x + 34} ${y - 40}Z" fill="#E8E2D2" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y - 40}" rx="34" ry="8" fill="#E8E2D2" stroke="${INK2}" stroke-width="4"/><ellipse cx="${x}" cy="${y - 39}" rx="28" ry="5.5" fill="#3A2412"/><path d="M${x - 20} ${y - 24} q20 8 40 0" stroke="#9AB0B0" stroke-width="3" fill="none"/><path d="M${x - 10} ${y - 38} q8 -2 12 2" stroke="#8A6A3A" stroke-width="2.4" fill="none" opacity="0.8"/>` + tqC_steam(x, y - 46, T, 90, '#FFFFFF', 0.7) +
    `<path d="M${x + 44} ${y - 6} l36 -10" stroke="${INK2}" stroke-width="6" stroke-linecap="round"/><path d="M${x + 44} ${y - 6} l36 -10" stroke="#E8E2D2" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x + 84}" cy="${y - 16}" rx="8" ry="4.5" fill="#E8E2D2" stroke="${INK2}" stroke-width="3"/>` +
    `<path d="M${x - 110} ${y - 0} Q${x - 120} ${y - 40} ${x - 92} ${y - 52} H${x - 62} Q${x - 52} ${y - 40} ${x - 66} ${y}Z" fill="#9AB0B0" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 94} ${y - 52} q4 -12 14 -12 q10 0 12 12" fill="#9AB0B0" stroke="${INK2}" stroke-width="3.5"/><path d="M${x - 118} ${y - 36} q-20 -4 -22 -24" stroke="${INK2}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x - 118} ${y - 36} q-20 -4 -22 -24" stroke="#9AB0B0" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

// ---------- Cung Vĩnh An (Bạch Đế Thành): phòng bệnh của Lưu Bị lúc hoàng hôn. Giường lớn có màn rủ bên trái (mặt giường y ≈ 800–830, thành giường 830–935 — chỗ nhân vật nằm/ngồi mép giường),
// cột đỏ sẫm, cửa sổ tròn trổ hoa rọi nắng chiều xiên, đèn cung đình, bình phong, bàn thuốc có bát thuốc bốc hơi, thảm đỏ.
// o: fade 0..1 (hồi tưởng: giảm bão hòa + hơi tối) · dusk 0..1 (độ tắt nắng, mặc định 0.5: nắng nhạt và tối góc hơn)
function bg_vinh_an(t, o = {}) {
  const T = _T(t), fade = Math.max(0, Math.min(1, o.fade ?? 0)), dusk = Math.max(0, Math.min(1, o.dusk ?? 0.5));
  const bx0 = 240, bx1 = 1680, by0 = 110, by1 = 740;
  let s = `<g style="isolation:isolate">`;
  s += room1p({ bx0, bx1, by0, by1, wall: '#C7A47E', side: '#A5805C', ceil: '#6E4430', fc: '#74482F', wain: '#5E3322', wainH: 150, paper: 'damask', wall2: '#B6906A', floor: 'wood', beams: '#4E2A1E', night: false });
  // cửa sổ tròn trổ hoa (phía sau chiều tà)
  const wx = 1180, wy = 380, wr = 150, wid = tqC_id('tqCwc');
  s += `<defs><clipPath id="${wid}"><circle cx="${wx}" cy="${wy}" r="${wr}"/></clipPath><linearGradient id="${wid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A5A86"/><stop offset="0.45" stop-color="#E8885A"/><stop offset="1" stop-color="#F8C878"/></linearGradient></defs>`;
  s += `<g clip-path="url(#${wid})"><rect x="${wx - wr}" y="${wy - wr}" width="${wr * 2}" height="${wr * 2}" fill="url(#${wid}s)"/>`;
  s += `<circle cx="${wx - 30}" cy="${wy + 70}" r="${R1(44 - dusk * 8)}" fill="#FFE0A0"/><circle cx="${wx - 30}" cy="${wy + 70}" r="90" fill="#FFE0A0" opacity="0.25"/>`;
  s += `<ellipse cx="${wx + 40}" cy="${wy - 30}" rx="90" ry="9" fill="#F8B080" opacity="0.6"/><ellipse cx="${wx - 70}" cy="${wy - 70}" rx="70" ry="7" fill="#F4A0A0" opacity="0.5"/>`;
  s += `<path d="M${wx - wr} ${wy + 100} L${wx - 90} ${wy + 60} L${wx - 40} ${wy + 100} L${wx + 30} ${wy + 40} L${wx + 100} ${wy + 100} L${wx + wr} ${wy + 70} V${wy + wr} H${wx - wr}Z" fill="#6A3A4A" stroke="${INK2}" stroke-width="3"/>`;
  s += `<path d="M${wx + wr} ${wy - 60} Q${wx + 80} ${wy - 70} ${wx + 40} ${wy - 20} M${wx + 90} ${wy - 66} q-10 -30 -40 -40 M${wx + 66} ${wy - 56} q-30 -6 -50 14" stroke="${INK2}" stroke-width="5" fill="none" stroke-linecap="round"/>` + [[wx + 110, wy - 40], [wx + 70, wy - 90], [wx + 34, wy - 20]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="12" ry="6" fill="#4A2A30" transform="rotate(-30 ${a} ${b})"/>`).join('');
  s += `<path d="M${wx - 80} ${wy - 40} q10 -10 20 0 q10 -10 20 0 M${wx - 20} ${wy - 90} q8 -8 16 0 q8 -8 16 0" stroke="${INK2}" stroke-width="3" fill="none"/></g>`;
  // khung hoa
  const lat = '#4A2218';
  s += `<circle cx="${wx}" cy="${wy}" r="${wr + 8}" fill="none" stroke="${INK2}" stroke-width="30"/><circle cx="${wx}" cy="${wy}" r="${wr + 8}" fill="none" stroke="${lat}" stroke-width="20"/><circle cx="${wx}" cy="${wy}" r="${wr + 20}" fill="none" stroke="${TQ.gold}" stroke-width="3.5"/>`;
  s += `<g clip-path="url(#${wid})"><g transform="rotate(45 ${wx} ${wy})">` + [...Array(9)].map((_, k) => { const o2 = (k - 4) * 56; return `<path d="M${wx - wr - 20} ${wy + o2} H${wx + wr + 20} M${wx + o2} ${wy - wr - 20} V${wy + wr + 20}" stroke="${INK2}" stroke-width="12"/><path d="M${wx - wr - 20} ${wy + o2} H${wx + wr + 20} M${wx + o2} ${wy - wr - 20} V${wy + wr + 20}" stroke="${lat}" stroke-width="6.5"/>`; }).join('') + `</g></g>`;
  s += `<circle cx="${wx}" cy="${wy}" r="${wr * 0.46}" fill="none" stroke="${INK2}" stroke-width="12"/><circle cx="${wx}" cy="${wy}" r="${wr * 0.46}" fill="none" stroke="${TQ.gold}" stroke-width="3.5"/><circle cx="${wx}" cy="${wy}" r="${wr * 0.46}" fill="none" stroke="${lat}" stroke-width="6" opacity="0.9" stroke-dasharray="0 0"/>`;
  s += [0, 1, 2, 3].map(i => `<circle cx="${R1(wx + Math.cos(i * 1.5708 + 0.785) * wr * 0.46)}" cy="${R1(wy + Math.sin(i * 1.5708 + 0.785) * wr * 0.46)}" r="8" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3"/>`).join('');
  s += tqC_glow(wx, wy, 330, '#FFB45A', 0.24 * (1 - dusk * 0.4));
  // cột đỏ sẫm chạm
  for (const [x, w] of [[bx0, 64], [860, 60], [bx1, 64]]) { s += columnD(x, by0 - 4, by1 + 18, w, '#6E2A22').replace(/#EDE6D6/g, '#6E2A22'); s += [250, 430, 600].map(y => `<rect x="${x - w / 2 - 2}" y="${y}" width="${w + 4}" height="12" fill="#C9A227" stroke="${INK2}" stroke-width="3"/>`).join(''); }
  s += tqC_map(1446, 196, 120, 206, T, { seed: 2, c: '#E4CF9E', frame: '#6E2A22', tassel: '#C9A227' }) + tqC_censer(1330, 778, 0.8, T);
  // bình phong bên phải
  s += tqC_screen(1380, 748, 270, 290, T);
  // đèn cung đình
  s += tqC_palaceLamp(946, 110, 0.85, T);
  // thảm
  s += tqC_rug(1000, 780, 1090, 1000, 1560, '#6E2A22', '#C9A227', { pat: 'cloud', psc: 1.1, med: false });
  // GIƯỜNG (trái)
  const bedL = 52, bedR = 738, post = (x) => `<rect x="${x - 19}" y="214" width="38" height="778" fill="#6E2A22" stroke="${INK2}" stroke-width="5.5"/><rect x="${x - 11}" y="222" width="8" height="760" fill="#8E4A38" opacity="0.7"/>` + [300, 560, 800].map(y => `<rect x="${x - 23}" y="${y}" width="46" height="14" fill="#C9A227" stroke="${INK2}" stroke-width="3.5"/>`).join('') + `<circle cx="${x}" cy="208" r="17" fill="#C9A227" stroke="${INK2}" stroke-width="4"/><circle cx="${x - 5}" cy="203" r="5" fill="#FFF0B0"/>`;
  s += `<ellipse cx="400" cy="990" rx="380" ry="26" fill="#20140A" opacity="0.28"/>`;
  s += `<rect x="92" y="262" width="606" height="520" fill="#3E1E16" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 1; i < 15; i++) s += `<path d="M${92 + i * 40.4} 262 V782" stroke="#5E3022" stroke-width="3"/>`;
  for (let j = 1; j < 13; j++) s += `<path d="M92 ${262 + j * 40} H698" stroke="#5E3022" stroke-width="3"/>`;
  s += `<rect x="110" y="280" width="570" height="484" fill="none" stroke="${TQ.gold}" stroke-width="3" opacity="0.7"/>`;
  s += post(70) + post(720);
  s += tqC_glow(480, 560, 360, '#FFC070', 0.16);
  // chân + thành giường
  s += `<rect x="72" y="934" width="40" height="58" fill="#4A2218" stroke="${INK2}" stroke-width="4.5"/><rect x="678" y="934" width="40" height="58" fill="#4A2218" stroke="${INK2}" stroke-width="4.5"/>`;
  s += `<rect x="58" y="832" width="674" height="102" fill="#5E2A20" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) { const px = 74 + i * 130; s += `<rect x="${px}" y="846" width="116" height="74" rx="8" fill="#7E3A2A" stroke="${INK2}" stroke-width="3.5"/><rect x="${px + 8}" y="854" width="100" height="58" rx="5" fill="none" stroke="${TQ.gold}" stroke-width="2.4" opacity="0.85"/><circle cx="${px + 58}" cy="883" r="12" fill="none" stroke="${TQ.gold}" stroke-width="2.4"/>`; }
  s += `<rect x="52" y="818" width="686" height="18" rx="4" fill="#7E2E24" stroke="${INK2}" stroke-width="5"/><path d="M60 827 H730" stroke="${TQ.gold}" stroke-width="2.4"/>`;
  // nệm + chăn gấp + gối
  s += `<path d="M64 802 H726 L738 820 H52Z" fill="#DCC890" stroke="${INK2}" stroke-width="4.5" stroke-linejoin="round"/><path d="M80 810 H700" stroke="#B89A5E" stroke-width="2.4" opacity="0.7"/>`;
  s += `<path d="M150 804 Q146 748 210 744 H460 Q512 746 516 804Z" fill="#A8742A" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M150 804 Q146 748 210 744 H460 Q512 746 516 804Z" fill="${pat('damask', '#C9A227', null, 0.4)}" opacity="0.5"/><path d="M160 784 H506 M166 764 Q190 756 210 758 H458" stroke="${dk('#A8742A', 0.35)}" stroke-width="3.5" fill="none"/><path d="M154 796 H512" stroke="${TQ.gold}" stroke-width="4"/>`;
  s += `<rect x="132" y="722" width="118" height="82" rx="26" fill="#8E3A2E" stroke="${INK2}" stroke-width="5"/><ellipse cx="244" cy="763" rx="14" ry="40" fill="#E8D8B0" stroke="${INK2}" stroke-width="4"/><path d="M148 742 H228 M148 786 H228" stroke="${TQ.gold}" stroke-width="3.5" opacity="0.8"/>`;
  // màn rủ hai bên (buộc dây vàng)
  const cur = `<path d="M52 266 H176 Q170 420 100 560 Q146 720 150 906 H52Z" fill="#8E3A2E" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M84 266 Q96 440 96 570 Q118 740 112 906 M122 266 Q140 430 98 566 Q136 730 132 906" stroke="${dk('#8E3A2E', 0.3)}" stroke-width="3.5" fill="none"/><path d="M70 270 Q80 430 76 560" stroke="#C06A52" stroke-width="5" fill="none" opacity="0.6"/><path d="M52 556 Q80 574 104 560" stroke="${INK2}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M52 556 Q80 574 104 560" stroke="${TQ.gold}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="106" cy="561" r="9" fill="${TQ.gold}" stroke="${INK2}" stroke-width="3.5"/><path d="M102 570 v40 M110 570 v46" stroke="${INK2}" stroke-width="6" stroke-linecap="round"/><path d="M102 570 v40 M110 570 v46" stroke="${TQ.gold}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<rect x="46" y="212" width="700" height="54" fill="#7E2E24" stroke="${INK2}" stroke-width="5.5"/><rect x="46" y="212" width="700" height="54" fill="${pat('cloud', '#C9A227', null, 0.7)}" opacity="0.6"/><path d="M46 222 H746 M46 256 H746" stroke="${TQ.gold}" stroke-width="3"/>`;
  s += `<g transform="translate(0 4)">${cur}</g><g transform="translate(792 4) scale(-1 1)">${cur}</g>`;
  s += tqC_bunting(52, 738, 266, 58, 34, ['#8E3A2E', '#C9A227']);
  // kỷ thuốc + bát thuốc bốc hơi
  s += tqC_lowTable(930, 800, 250, { c: '#5E3322', leg: 140, top: '#7A4A30' }) + tqC_medicine(930, 800 - 140 - 24, T);
  // nắng chiều rọi xiên
  s += `<defs><linearGradient id="${wid}b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC070" stop-opacity="${R1(0.34 * (1 - dusk * 0.5) * 100) / 100}"/><stop offset="1" stop-color="#FFB060" stop-opacity="0.04"/></linearGradient></defs><path d="M1090 300 L1290 470 L860 1010 L430 980Z" fill="url(#${wid}b)"/>` + [0.28, 0.5, 0.72].map(u => `<path d="M${R1(1090 + (430 - 1090) * u)} ${R1(300 + (980 - 300) * u)} L${R1(1290 + (860 - 1290) * u)} ${R1(470 + (1010 - 470) * u)}" stroke="#7A3A1E" stroke-width="14" opacity="0.07"/>`).join('');
  s += `<ellipse cx="800" cy="990" rx="300" ry="50" fill="#FFB45A" opacity="${R1(0.2 * (1 - dusk * 0.4) * 100) / 100}"/>`;
  // không khí hoàng hôn: ánh tím nhẹ trên cao, tối góc
  s += tqC_vgrad(0, 0, 1920, 1080, [[0, '#4A2A5A', 0.16 + 0.12 * dusk], [0.6, '#4A2A5A', 0], [1, '#2A140E', 0.2]]);
  s += tqC_vig('#120A0C', 0.46 + 0.2 * dusk, 0.5);
  s += motes(16, 700, 200, 800, 700, '#FFD890', 0.5, 6);
  // hồi tưởng: giảm bão hòa + tối nhẹ
  if (fade > 0) s += `<rect width="1920" height="1080" fill="#808080" opacity="${R1(fade * 0.75 * 100) / 100}" style="mix-blend-mode:saturation"/><rect width="1920" height="1080" fill="#241A20" opacity="${R1(fade * 0.16 * 100) / 100}"/>`;
  s += `</g>`;
  return s;
}

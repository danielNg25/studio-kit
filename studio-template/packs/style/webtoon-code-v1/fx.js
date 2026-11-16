// webtoon-code-v1 — hiệu ứng + chuyển động dùng chung (tách từ tập thử test-luc-mach, kênh mẫu, 2026-10-11).
// Cần nạp SAU chibi-v1 (EZ, f1, mixC, prand, clamp, lerp, INK2) và glow.js (bloom, glowDot, flareBurst, glowSparks, shockRing, swordArc, radialLines, GL).
// Bộ lọc nhân vật thua (xám) / trúng đòn (trắng) — chèn RG_DEFS() vào đầu SVG mỗi cảnh.
const RG_DEFS = () => `<defs><filter id="rgGrey" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.05"/><feComponentTransfer><feFuncR type="linear" slope="0.85" intercept="0.08"/><feFuncG type="linear" slope="0.85" intercept="0.08"/><feFuncB type="linear" slope="0.85" intercept="0.1"/></feComponentTransfer></filter>` +
  `<filter id="rgWhite" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>`+
  `<filter id="rgSil" color-interpolation-filters="sRGB"><feFlood flood-color="#3B3546"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>`;   // bóng đen quần chúng (2026-10-11)
function rgLeaves(t, n = 14) { let s = ''; for (let i = 0; i < n; i++) { const sp = 60 + prand(i, 31) * 80, y = ((prand(i, 32) * 1300 + t * sp) % 1300) - 120, x = prand(i, 33) * 2000 - 40 + Math.sin(t * 1.4 + i) * 50, r = Math.sin(t * 2 + i) * 60; s += `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})" d="M0 -14 Q12 0 0 16 Q-12 0 0 -14Z" fill="${i % 3 ? '#8FA86A' : '#C9A24E'}" stroke="#2A1A10" stroke-width="2.5" opacity="0.85"/>`; } return s; }
// BẢN 3 — chuyển động mượt hơn + hiệu ứng hoành tráng hơn (người dùng 2026-10-11).
// Mượt: 30 fps, nội suy Catmull-Rom (vận tốc liên tục), lò xo khi giật tay, gồng lấy đà trước khi ra đòn, vệt nhoè tay, máy quay trôi nhẹ.
// Hoành tráng: tụ khí ở đầu ngón, tia kiếm khí nhiều lớp (quầng – lõi – hạt), nổ có mảnh đá + bụi + vòng xung kích, khựng hình lúc trúng,
// nền tối lại khi tụ lực để ánh sáng nổi, tia sáng toả, khung mực.

// ---------- nội suy mượt ----------
// Catmull-Rom qua các mốc [[t, v], …] (qua đúng các mốc, vận tốc liên tục)
function smK(t, K) {
  if (t <= K[0][0]) return K[0][1];
  const n = K.length; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t >= K[i + 1][0]) i++;
  const p0 = K[Math.max(0, i - 1)][1], p1 = K[i][1], p2 = K[i + 1][1], p3 = K[Math.min(n - 1, i + 2)][1];
  const u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]), u2 = u * u, u3 = u2 * u;
  return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
}
// lò xo tắt dần sau cú giật tại t0 (0 trước t0)
const spring = (t, t0, f = 14, d = 7) => t < t0 ? 0 : Math.exp(-(t - t0) * d) * Math.sin((t - t0) * f);
const bump = (t, t0, dur) => t < t0 || t > t0 + dur ? 0 : Math.sin((t - t0) / dur * Math.PI);
// khựng hình: trong [t0, t0+d] thời gian đứng yên tại t0
function hitStop(t, list) { for (const [t0, d] of list) if (t > t0 && t < t0 + d) return t0; return t; }
// máy quay: cx, cy, s + trôi tay cầm nhẹ + rung
function camX(content, t, s, cx, cy, sh = [0, 0]) {
  const dx = Math.sin(t * 0.9) * 6 + Math.sin(t * 2.3) * 2, dy = Math.cos(t * 0.7) * 4, r = Math.sin(t * 0.6) * 0.25;
  return `<g transform="translate(${f1(960 + sh[0] + dx)} ${f1(540 + sh[1] + dy)}) rotate(${f1(r)}) scale(${(+s).toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})">${content}</g>`;
}

// ---------- hiệu ứng ----------
// tia kiếm khí nhiều lớp: quầng rộng mờ + thân màu + lõi trắng, mép rung, hạt bay dọc tia; đầu tia chạy tới b rồi tắt dần
function fxBeam(t, t0, a, b, o = {}) {
  const dur = o.dur || 0.12, hold = o.hold || 0.08, fade = o.fade || 0.28, d = t - t0;
  if (d < 0 || d > dur + hold + fade) return '';
  const head = EZ.expoOut(Math.min(1, d / dur)), tail = d < dur + hold ? 0 : EZ.quadIn(Math.min(1, (d - dur - hold) / fade));
  const ax = lerp(a[0], b[0], tail), ay = lerp(a[1], b[1], tail), bx = lerp(a[0], b[0], head), by = lerp(a[1], b[1], head);
  const L = Math.hypot(bx - ax, by - ay); if (L < 2) return '';
  const ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI, W = (o.w || 26) * (1 - tail * 0.6), c = o.c || '#7FC8FF', seed = o.seed || 0;
  let edge = 'M0 0'; const N = 14;
  for (let i = 1; i <= N; i++) { const u = i / N, x = L * u, w = W * 0.5 * (0.75 + 0.25 * Math.sin(t * 60 + i * 2.1 + seed)) * (u > 0.9 ? (1 - u) * 10 : 1); edge += ` L${f1(x)} ${f1(-w)}`; }
  for (let i = N; i >= 0; i--) { const u = i / N, x = L * u, w = W * 0.5 * (0.75 + 0.25 * Math.cos(t * 55 + i * 1.7 + seed)) * (u > 0.9 ? (1 - u) * 10 : 1); edge += ` L${f1(x)} ${f1(w)}`; }
  edge += 'Z';
  let parts = '';
  for (let i = 0; i < 10; i++) { const u = (prand(i, 41 + seed) + d * 3) % 1, x = L * u, y = (prand(i, 42 + seed) - 0.5) * W * 2.2; parts += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + 4 * prand(i, 43))}" fill="#fff"/>`; }
  const op = 1 - tail * 0.5;
  return `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(${f1(ang)})" ${GL.add} opacity="${f1(op)}">` +
    `<rect x="0" y="${f1(-W * 2.2)}" width="${f1(L)}" height="${f1(W * 4.4)}" rx="${f1(W * 2)}" fill="${c}" opacity="0.35" filter="url(#gB3)"/>` +
    `<path d="${edge}" fill="${c}" filter="url(#gB1)"/><path d="${edge}" fill="${mixC(c, '#ffffff', 0.55)}" transform="scale(1 0.45)"/>` +
    `<rect x="0" y="-2.5" width="${f1(L)}" height="5" fill="#fff"/>${parts}</g>` + glowDot(bx, by, W * 0.9, c, 1 - tail);
}
// tụ khí: hạt xoáy hút vào tâm, quả cầu lớn dần, sao 4 cánh quay, vòng co lại
function fxCharge(t, t0, t1, x, y, o = {}) {
  if (t < t0 || t > t1 + 0.05) return '';
  const k = clamp((t - t0) / (t1 - t0)), c = o.c || '#7FC8FF', R = o.r || 260;
  let s = '';
  for (let i = 0; i < 22; i++) { const ph = (prand(i, 51) + (t - t0) * (1.2 + prand(i, 52))) % 1, rr = R * (1 - ph) * (0.5 + 0.7 * prand(i, 53)), a = prand(i, 54) * 6.283 + ph * 3.5;
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.8, tx = x + Math.cos(a - 0.35) * rr * 1.25, ty = y + Math.sin(a - 0.35) * rr;
    s += `<path d="M${f1(tx)} ${f1(ty)} L${f1(px)} ${f1(py)}" stroke="#fff" stroke-width="${f1(2 + 3 * ph)}" stroke-linecap="round" opacity="${f1(ph * k)}"/>`; }
  const rr2 = R * (1 - EZ.quartOut(((t - t0) * 2) % 1));
  s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rr2)}" ry="${f1(rr2 * 0.8)}" fill="none" stroke="#fff" stroke-width="3" opacity="${f1(0.6 * k)}"/>`;
  const sr = 40 + 120 * k, rot = t * 220;
  s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="M0 ${-sr} L${f1(sr * 0.12)} 0 L0 ${sr} L${f1(-sr * 0.12)} 0Z M${-sr} 0 L0 ${f1(sr * 0.12)} L${sr} 0 L0 ${f1(-sr * 0.12)}Z" fill="#fff" opacity="${f1(0.9 * k)}"/></g>`;
  return `<g ${GL.add}>${bloom(s, c, 1)}${glowDot(x, y, 10 + 26 * k, c, 0.4 + 0.6 * k)}</g>`;
}
// nổ: chớp + 2 vòng xung kích + mảnh đá văng (xoay, rơi) + bụi phồng + tia tốc độ
function fxImpact(t, t0, x, y, o = {}) {
  const d = t - t0; if (d < 0 || d > 1.6) return { back: '', front: '' };
  const c = o.c || '#9FD6FF', sc = o.scale || 1;
  let front = flareBurst(t, t0, x, y, { r: 320 * sc, c, dur: 0.9, rays: 14 }) + glowSparks(t, t0, x, y, { n: 40, speed: 1400 * sc, c: o.spark || '#E9F6FF', dur: 0.8 });
  front += shockRing(t, t0 + 0.02, x, y + 40 * sc, { r: 700 * sc, c, dur: 0.6 });
  if (d < 0.45) { const k = d / 0.45; front += `<g ${GL.add} opacity="${f1(1 - k)}">${bloom(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(60 + 420 * EZ.expoOut(k) * sc)}" fill="none" stroke="#fff" stroke-width="${f1(18 * (1 - k) + 2)}"/>`, c, 1)}</g>`; }
  if (d < 0.5) front += radialLines(t, x, y, { n: 50, r0: 160 * sc, op: 0.6 * (1 - d / 0.5), c: '#FFFFFF' });
  let back = '';
  if (o.debris !== false) for (let i = 0; i < 14; i++) { const a = -Math.PI * (0.1 + 0.8 * prand(i, 61)), v = (500 + 700 * prand(i, 62)) * sc, px = x + Math.cos(a) * v * d * (prand(i, 63) > 0.5 ? 1 : -1), py = y + Math.sin(a) * v * d + 1400 * d * d, r = (10 + 22 * prand(i, 64)) * sc;
    if (py > 1150) continue; front += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(d * 600 * (prand(i, 65) - 0.5))})"><path d="M${-r} ${-r * 0.4} L${-r * 0.2} ${-r} L${r} ${-r * 0.3} L${r * 0.6} ${r * 0.8} L${-r * 0.7} ${r * 0.6}Z" fill="#8F897B" stroke="${INK2}" stroke-width="3"/></g>`; }
  for (let i = 0; i < 9; i++) { const k = clamp((d - i * 0.03) / 1.4); if (k <= 0) continue; const a = (i / 9) * Math.PI * 2, rr = 80 + 260 * EZ.expoOut(k) * sc;
    back += `<circle cx="${f1(x + Math.cos(a) * rr)}" cy="${f1(y + 60 * sc + Math.sin(a) * rr * 0.35 - k * 60)}" r="${f1((40 + 70 * k) * sc)}" fill="#E8DFCB" opacity="${f1(0.55 * (1 - k))}"/>`; }
  return { back: back ? `<g filter="url(#gB1)">${back}</g>` : '', front };
}
// tia sáng toả từ một điểm (god rays) — làm nền hoành tráng khi ra chiêu
function fxRays(t, x, y, k, c = '#BFE6FF') {
  if (k <= 0) return ''; let s = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * 360 + t * 12, w = 4 + 6 * prand(i, 71); s += `<path d="M0 0 L1600 ${-w * 6} L1600 ${w * 6}Z" fill="${c}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})" opacity="${f1((0.10 + 0.08 * Math.sin(t * 3 + i)) * k)}"/>`; }
  return `<g ${GL.add}>${s}</g>`;
}
// nền tối + ngả lạnh khi tụ lực (ánh sáng nổi hơn)
const fxDim = (k, c = '#0E1830') => k > 0 ? `<rect width="1920" height="1080" fill="${c}" opacity="${f1(0.5 * k)}"/>` : '';
// vệt bụi khi lướt
function fxDust(t, t0, x, y, dir = 1) { let s = ''; for (let i = 0; i < 8; i++) { const d = t - t0 - i * 0.04; if (d < 0 || d > 0.9) continue; s += `<circle cx="${f1(x + dir * (i * 50 + d * 80))}" cy="${f1(y - d * 50)}" r="${f1(24 + d * 70)}" fill="#E9DCC4" opacity="${f1(0.6 * (1 - d / 0.9))}"/>`; } return s; }
// đường tốc độ ngang khi lướt
function fxSpeed(t, k, y0, y1, dir = -1) { if (k <= 0) return ''; let s = ''; for (let i = 0; i < 26; i++) { const y = y0 + (y1 - y0) * prand(i, 81), x = ((prand(i, 82) * 2400 + t * 5000 * dir) % 2400 + 2400) % 2400 - 240, L = 200 + 400 * prand(i, 83); s += `<path d="M${f1(x)} ${f1(y)} h${f1(L)}" stroke="#fff" stroke-width="${f1(2 + 4 * prand(i, 84))}" opacity="${f1(0.5 * k)}"/>`; } return s; }


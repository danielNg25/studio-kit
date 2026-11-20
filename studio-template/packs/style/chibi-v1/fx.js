// chibi-v1 — hiệu ứng (FX) thuần hàm của thời gian: fx(t, t0, …) → chuỗi SVG. Không Math.random (dùng prand) → render lặp lại y hệt.
// Ý tưởng tham khảo bộ quy tắc chuyển động của HyperFrames (heygen-com/hyperframes, Apache-2.0): nét chém hình lưỡi liềm thon 2 đầu,
// vệt mờ theo hướng, chớp trắng 1–2 khung, rung máy tắt dần, tia lửa bay theo quỹ đạo rơi, "chém trúng thì giữ hình" — viết lại từ đầu, không chép mã.
const EZ = {
  expoOut: k => { k = clamp(k); return k >= 1 ? 1 : 1 - Math.pow(2, -10 * k); },
  expoIn: k => { k = clamp(k); return k <= 0 ? 0 : Math.pow(2, 10 * k - 10); },
  quartOut: k => { k = clamp(k); return 1 - Math.pow(1 - k, 4); },
  quadIn: k => { k = clamp(k); return k * k; },
  backOut: (k, s = 1.70158) => { k = clamp(k) - 1; return 1 + (s + 1) * k * k * k + s * k * k; },
  elasticOut: k => { k = clamp(k); return k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI) / 3) + 1; },
};
const prand = (i, s = 0) => { let h = (i * 374761393 + s * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const _fxid = { n: 0 };
// rung máy tắt dần: trả [dx, dy]
function shakeXY(t, t0, amp = 18, dur = 0.35, seed = 1) {
  if (t < t0 || t > t0 + dur) return [0, 0];
  const k = (t - t0) / dur, d = amp * Math.pow(1 - k, 2), f = Math.floor((t - t0) * 30);   // đổi hướng mỗi khung
  return [(prand(f, seed) - 0.5) * 2 * d, (prand(f, seed + 7) - 0.5) * 2 * d];
}
const shakeG = (inner, t, t0, amp, dur, seed) => { const [dx, dy] = shakeXY(t, t0, amp, dur, seed); return dx || dy ? `<g transform="translate(${f1(dx)} ${f1(dy)})">${inner}</g>` : inner; };
// chớp màn hình (trắng / đỏ) — đỉnh ngay t0, tắt trong dur
const flash = (t, t0, dur = 0.12, c = '#FFFFFF', peak = 0.85) => t < t0 || t > t0 + dur ? '' : `<rect x="-20" y="-20" width="1960" height="1120" fill="${c}" opacity="${f1(peak * (1 - (t - t0) / dur))}"/>`;
// điểm trên Bézier bậc 2
const qb = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
// NHÁT CHÉM: lưỡi liềm thon 2 đầu chạy từ a→b (cong qua điểm c), đầu nét lao nhanh (expoOut ~0,12 s), đuôi đuổi theo rồi tắt (~0,35 s).
// o: {a:[x,y], b:[x,y], bend (độ cong, px), w (độ dày giữa), color (viền), core (lõi), dur}
function slash(t, t0, o) {
  if (t < t0) return '';
  const dt = t - t0, D = o.dur || 0.42, a = o.a, b = o.b; if (dt > D) return '';
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, bend = o.bend ?? L * 0.18;
  const c = [mx + nx * bend * 2, my + ny * bend * 2];
  const head = EZ.expoOut(dt / 0.12), tail = EZ.quadIn(clamp((dt - 0.05) / (D - 0.05)));
  if (head - tail < 0.01) return '';
  const N = 26, W = o.w || 46, top = [], bot = [];
  for (let i = 0; i <= N; i++) {
    const u = tail + (head - tail) * i / N, p = qb(a, c, b, u), p2 = qb(a, c, b, Math.min(1, u + 0.01)), p1 = qb(a, c, b, Math.max(0, u - 0.01));
    const tx = p2[0] - p1[0], ty = p2[1] - p1[1], tl = Math.hypot(tx, ty) || 1, qx = -ty / tl, qy = tx / tl;
    const v = i / N, w = W * Math.pow(Math.sin(Math.PI * v), 0.8) * (0.35 + 0.65 * v);   // đầu nét (v=1) dày hơn đuôi
    top.push([p[0] + qx * w / 2, p[1] + qy * w / 2]); bot.push([p[0] - qx * w * 0.15, p[1] - qy * w * 0.15]);   // lệch về 1 phía → hình lưỡi liềm
  }
  const d = 'M' + top.map(q => `${f1(q[0])} ${f1(q[1])}`).join(' L') + ' L' + bot.reverse().map(q => `${f1(q[0])} ${f1(q[1])}`).join(' L') + 'Z';
  const id = 'sb' + (++_fxid.n), fade = 1 - EZ.quadIn(clamp((dt - D * 0.55) / (D * 0.45)));
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>`
    + `<g opacity="${f1(fade)}"><path d="${d}" fill="${o.color || '#E8452F'}" filter="url(#${id})" opacity="0.9"/>`
    + `<path d="${d}" fill="${o.color || '#E8452F'}" transform="translate(${f1(-nx * 4)} ${f1(-ny * 4)})"/>`
    + `<path d="${d}" fill="${o.core || '#FFF9EC'}"/></g>`;
}
// TIA LỬA: n hạt bay ra theo hình nón quanh góc `dir` (độ), rơi theo trọng lực, vẽ thành vệt theo vận tốc
function sparks(t, t0, x, y, o = {}) {
  const dt = t - t0, D = o.dur || 0.6; if (dt < 0 || dt > D) return '';
  const n = o.n || 16, g = o.g ?? 1800, spread = (o.spread ?? 70) * Math.PI / 180, dir = (o.dir ?? -90) * Math.PI / 180;
  let s = '';
  for (let i = 0; i < n; i++) {
    const ang = dir + (prand(i, 3) - 0.5) * spread * 2, sp = (o.speed || 900) * (0.45 + prand(i, 4) * 0.8), life = D * (0.5 + prand(i, 5) * 0.5);
    if (dt > life) continue;
    const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp, px = x + vx * dt, py = y + vy * dt + 0.5 * g * dt * dt, cvx = vx, cvy = vy + g * dt, cl = Math.hypot(cvx, cvy) || 1, len = 10 + cl * 0.025;
    const fade = 1 - dt / life;
    s += `<path d="M${f1(px)} ${f1(py)} L${f1(px - cvx / cl * len)} ${f1(py - cvy / cl * len)}" stroke="${prand(i, 6) < 0.5 ? (o.c1 || '#FFE07A') : (o.c2 || '#FFFFFF')}" stroke-width="${f1((o.w || 5) * (0.6 + prand(i, 7) * 0.8))}" stroke-linecap="round" opacity="${f1(fade)}"/>`;
  }
  return s;
}
// VỆT TỐC ĐỘ toả quanh tâm (khung truyện tranh) — hiện nhanh rồi tắt
function speedLines(t, t0, cx, cy, o = {}) {
  const dt = t - t0, D = o.dur || 0.5; if (dt < 0 || dt > D) return '';
  const n = o.n || 34, r0 = o.r0 || 380, k = 1 - EZ.quadIn(dt / D); let s = '';
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + prand(i, 9) * 0.12, r1 = r0 + prand(i, 10) * 120, r2 = 1300, w = 6 + prand(i, 11) * 14;
    const p1 = [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], p2 = [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2], q = [-Math.sin(a) * w / 2, Math.cos(a) * w / 2];
    s += `<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0] + q[0])} ${f1(p2[1] + q[1])} L${f1(p2[0] - q[0])} ${f1(p2[1] - q[1])}Z" fill="${o.c || '#FFF6E2'}" opacity="${f1(0.75 * k)}"/>`; }
  return s;
}
// BỤI phụt (khói tròn nở + tan)
function dustPuff(t, t0, x, y, o = {}) {
  const dt = t - t0, D = o.dur || 0.8; if (dt < 0 || dt > D) return '';
  const n = o.n || 9; let s = '';
  for (let i = 0; i < n; i++) { const a = Math.PI + (i / (n - 1)) * Math.PI, sp = (o.spread || 260) * (0.6 + prand(i, 12) * 0.6), k = EZ.quartOut(dt / D);
    const px = x + Math.cos(a) * sp * k, py = y + Math.sin(a) * sp * 0.35 * k - 30 * k, r = (o.r || 46) * (0.6 + prand(i, 13) * 0.6) * (0.5 + k);
    s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="${o.c || '#E8DCC4'}" ${o.line ? `stroke="${INK2}" stroke-width="3"` : ''} opacity="${f1((o.op ?? 0.75) * (1 - EZ.quadIn(dt / D)))}"/>`; }
  return s;
}
// SAO VA CHẠM (tia nhọn nở ra quanh điểm chạm)
function impactStar(t, t0, x, y, o = {}) {
  const dt = t - t0, D = o.dur || 0.3; if (dt < 0 || dt > D) return '';
  const k = EZ.expoOut(dt / 0.08), fade = 1 - EZ.quadIn(dt / D), R = (o.r || 120) * k, n = o.n || 10; let d = '';
  for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 + (o.rot || 0), r = i % 2 ? R * 0.42 : R * (0.8 + prand(i, 14) * 0.4); d += (i ? ' L' : 'M') + `${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }
  return `<path d="${d}Z" fill="${o.c || '#FFF6E2'}" stroke="${o.stroke || '#E8452F'}" stroke-width="6" stroke-linejoin="round" opacity="${f1(fade)}"/>`;
}
// VẬT BAY xoáy (đàn, dao…): vẽ `art` (SVG tại gốc 0,0) bay từ a→b trong dur, xoay `spin` vòng, có 3 bóng mờ phía sau
function flyer(t, t0, art, a, b, o = {}) {
  const dt = t - t0, D = o.dur || 0.45; if (dt < 0 || dt > D + (o.hold || 0)) return '';
  const pos = k => { const e = EZ.quartOut(k); return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - Math.sin(Math.PI * e) * (o.arc || 0)]; };
  let s = '';
  for (let g = 3; g >= 0; g--) { const k = clamp((dt - g * 0.035) / D); if (k <= 0) continue; const [px, py] = pos(k), rot = (o.spin || 1) * 360 * EZ.quartOut(k);
    s += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(rot)}) scale(${o.s || 1})" opacity="${g ? f1(0.25 / g) : 1}">${art}</g>`; }
  return s;
}
// VẾT NỨT (sau va chạm mạnh)
function cracks(t, t0, x, y, o = {}) { if (t < t0) return ''; const k = EZ.expoOut((t - t0) / 0.15), n = o.n || 7; let s = '';
  for (let i = 0; i < n; i++) { let px = x, py = y, a = (i / n) * Math.PI * 2 + prand(i, 15); let d = `M${f1(px)} ${f1(py)}`;
    for (let j = 0; j < 4; j++) { const l = (o.r || 140) / 4 * k * (0.7 + prand(i * 7 + j, 16) * 0.6); a += (prand(i * 7 + j, 17) - 0.5) * 0.9; px += Math.cos(a) * l; py += Math.sin(a) * l; d += ` L${f1(px)} ${f1(py)}`; }
    s += `<path d="${d}" stroke="${INK2}" stroke-width="${f1(5 - (i % 3))}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
  return s; }

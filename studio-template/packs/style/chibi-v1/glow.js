// chibi-v1 — HIỆU ỨNG "PHIM CHƯỞNG": ánh sáng cộng (screen), bloom, vệt kiếm phát sáng, nổ sáng + lens flare, sóng xung kích,
// tia lửa, khí xoáy, tàn lửa, hậu ảnh lướt, khung va chạm. Mọi hàm trả SVG; gọi glowDefs() một lần trong khung.
const GL = {
  add: 'style="mix-blend-mode:screen"',
};
function glowDefs() {
  return `<defs>
<filter id="gB1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="gB2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="gB3" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="42"/></filter>
<radialGradient id="gRad"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.25" stop-color="#fff" stop-opacity="0.65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="gStreak" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="gVig" cx="50%" cy="50%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.75"/></radialGradient>
</defs>`;
}
// lõi sáng + 2 lớp bloom (màu c) cho một hình bất kỳ (chuỗi SVG vẽ bằng stroke/fill trắng)
const bloom = (inner, c, k = 1) => { if (k <= 0) return ''; const col = inner.replace(/#FFFFFF|#fff\b/gi, c), core = inner.replace(/#FFFFFF|#fff\b/gi, mixC(c, '#FFFFFF', 0.72));
  return `<g ${GL.add} opacity="${f1(Math.min(1, k))}"><g filter="url(#gB3)">${col}</g><g filter="url(#gB2)">${col}${col}</g><g filter="url(#gB1)">${col}</g>${core}</g>`; };
// chấm sáng tròn (quầng)
const glowDot = (x, y, r, c, k = 1) => k <= 0 ? '' : `<g ${GL.add} opacity="${f1(Math.min(1, k))}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.6)}" fill="${c}" opacity="0.35" filter="url(#gB3)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" filter="url(#gB2)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.45)}" fill="#fff" filter="url(#gB1)"/></g>`;
// nổ sáng: quầng + 8 tia + vệt anamorphic ngang + vòng xung kích
function flareBurst(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 0.9; if (d < 0 || d > dur) return '';
  const k = d / dur, a = (1 - k) * (1 - k), R = (o.r || 260) * (0.4 + 0.8 * EZ.expoOut(k)), c = o.c || '#7FC8FF';
  let rays = '';
  for (let i = 0; i < (o.rays || 10); i++) { const ang = (i / (o.rays || 10)) * 360 + (prand(i, 2) - 0.5) * 24 + (o.rot || 0) + d * 40, L = R * (0.7 + 2.0 * prand(i, 3)), w = 2 + 4 * prand(i, 4); rays += `<path d="M0 ${f1(-w)} L${f1(L)} 0 L0 ${f1(w)}Z" fill="#fff" transform="rotate(${f1(ang)})"/>`; }
  const ring = k < 0.5 ? `<circle r="${f1(R * (0.6 + 1.6 * k))}" fill="none" stroke="#fff" stroke-width="${f1(8 * (1 - 2 * k) + 0.5)}" opacity="${f1(1 - 2 * k)}"/>` : '';
  const streak = `<rect x="${f1(-R * 4)}" y="-5" width="${f1(R * 8)}" height="10" fill="url(#gStreak)"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)})" ${GL.add} opacity="${f1(a)}"><circle r="${f1(R * 1.5)}" fill="${c}" opacity="0.85" filter="url(#gB3)"/>${bloom(rays + streak + ring, c, 1)}<circle r="${f1(R * 0.3)}" fill="${mixC(c, '#FFFFFF', 0.8)}" filter="url(#gB2)"/></g>`;
}
// vệt kiếm phát sáng dọc theo cung tròn (cx,cy,r) từ góc a0→a1 (độ), đầu vệt chạy theo t
function swordArc(t, t0, o) {
  const d = t - t0, dur = o.dur || 0.35, fade = o.fade || 0.35; if (d < 0 || d > dur + fade) return '';
  const k = EZ.expoOut(Math.min(1, d / dur)), tail = Math.max(0, (d - dur * 0.3) / (dur * 0.7 + fade)), a0 = o.a0, a1 = o.a1, r = o.r, n = 26;
  const head = a0 + (a1 - a0) * k, back = a0 + (a1 - a0) * Math.min(k, EZ.quadIn(Math.min(1, tail)));
  if (Math.abs(head - back) < 0.5) return '';
  const pt = (ang, rr) => [o.cx + Math.cos(ang * Math.PI / 180) * rr, o.cy + Math.sin(ang * Math.PI / 180) * rr];
  let outer = [], inner = [];
  for (let i = 0; i <= n; i++) { const u = i / n, ang = back + (head - back) * u, w = (o.w || 60) * Math.sin(u * Math.PI * 0.5) * (u < 0.92 ? 1 : (1 - u) / 0.08); outer.push(pt(ang, r + w / 2)); inner.push(pt(ang, r - w / 2)); }
  const dd = 'M' + outer.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L') + ' L' + inner.reverse().map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L') + 'Z';
  const op = d > dur ? 1 - (d - dur) / fade : 1;
  return `<g opacity="${f1(op)}">${bloom(`<path d="${dd}" fill="#fff"/>`, o.c || '#6FB8FF', 1)}</g>`;
}
// vệt thẳng phát sáng (đâm/ném): từ a→b, đầu chạy, đuôi đuổi
function glowStreak(t, t0, a, b, o = {}) {
  const d = t - t0, dur = o.dur || 0.25, fade = o.fade || 0.3; if (d < 0 || d > dur + fade) return '';
  const kh = EZ.expoOut(Math.min(1, d / dur)), kt = Math.min(kh, Math.max(0, (d - dur * 0.4) / (dur + fade - dur * 0.4)));
  const hx = a[0] + (b[0] - a[0]) * kh, hy = a[1] + (b[1] - a[1]) * kh, tx = a[0] + (b[0] - a[0]) * kt, ty = a[1] + (b[1] - a[1]) * kt;
  const ang = Math.atan2(hy - ty, hx - tx) * 180 / Math.PI, L = Math.hypot(hx - tx, hy - ty), w = o.w || 26;
  const sh = `<path d="M0 0 L${f1(L * 0.85)} ${-w / 2} L${f1(L)} 0 L${f1(L * 0.85)} ${w / 2}Z" fill="#fff"/>`;
  return `<g transform="translate(${f1(tx)} ${f1(ty)}) rotate(${f1(ang)})" opacity="${f1(d > dur ? 1 - (d - dur) / fade : 1)}">${bloom(sh, o.c || '#FF6A4A', 1)}</g>`;
}
// tia lửa phát sáng bắn tung (vệt ngắn, rơi theo trọng lực)
function glowSparks(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 0.7; if (d < 0 || d > dur) return '';
  let s = ''; const n = o.n || 24, sp = o.speed || 900, c = o.c || '#FFD27A';
  for (let i = 0; i < n; i++) { const ang = ((o.dir ?? 0) + (prand(i, 7) - 0.5) * (o.spread ?? 360)) * Math.PI / 180, v = sp * (0.4 + 0.8 * prand(i, 8)); const px = x + Math.cos(ang) * v * d, py = y + Math.sin(ang) * v * d + 700 * d * d; const L = 18 + 30 * prand(i, 9);
    s += `<path d="M${f1(px)} ${f1(py)} l${f1(-Math.cos(ang) * L)} ${f1(-Math.sin(ang) * L + 20 * d)}" stroke="#fff" stroke-width="${f1(4 * (1 - d / dur) + 1)}" stroke-linecap="round"/>`; }
  return bloom(s, c, 1 - d / dur * 0.6);
}
// khí xoáy: các cung sáng quay quanh tâm
function qiSwirl(t, cx, cy, r, o = {}) {
  let s = ''; const n = o.n || 5, c = o.c || '#B36BFF', sp = o.speed || 2.4;
  for (let i = 0; i < n; i++) { const a0 = t * sp * 60 + i * (360 / n), rr = r * (0.6 + 0.5 * prand(i, 4)), len = 70 + 50 * prand(i, 5), ry = rr * (o.flat || 0.42);
    const p = u => { const a = (a0 + len * u) * Math.PI / 180; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * ry]; };
    let d = ''; for (let j = 0; j <= 12; j++) { const [x, y] = p(j / 12); d += (j ? ' L' : 'M') + f1(x) + ' ' + f1(y); }
    s += `<path d="${d}" stroke="#fff" stroke-width="${f1(3 + 6 * prand(i, 6))}" fill="none" stroke-linecap="round"/>`; }
  return bloom(s, c, o.k ?? 1);
}
// tàn lửa / bụi sáng bay lên
function embers(t, n, x0, y0, w, h, c = '#FFB35A', seed = 0) {
  let s = '';
  for (let i = 0; i < n; i++) { const sp = 40 + prand(i, 11 + seed) * 90, y = y0 + h - ((prand(i, 12 + seed) * h + t * sp) % h), x = x0 + prand(i, 13 + seed) * w + Math.sin(t * 1.3 + i) * 24, r = 2 + prand(i, 14 + seed) * 4, a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fff" opacity="${f1(a)}"/>`; }
  return bloom(s, c, 1);
}
// sóng xung kích trên nền (elip dẹt) + bụi
function shockRing(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 0.6; if (d < 0 || d > dur) return '';
  const k = EZ.expoOut(d / dur), R = (o.r || 500) * k;
  return `<g opacity="${f1(1 - d / dur)}">${bloom(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R)}" ry="${f1(R * 0.22)}" fill="none" stroke="#fff" stroke-width="${f1(14 * (1 - k) + 2)}"/>`, o.c || '#FFE0A0', 1)}</g>`;
}
// hậu ảnh khi lướt: vẽ lại nhân vật ở các vị trí trước, mờ dần, ám màu
function afterimages(drawAt, t, n = 5, gap = 0.035, c = '#FF5A3A') {
  let s = '';
  for (let i = n; i >= 1; i--) s += `<g opacity="${f1(0.5 * (1 - i / (n + 1)))}" ${GL.add}><g filter="url(#gB1)">${drawAt(t - i * gap).replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="${c}"`)}</g></g>`;
  return s;
}
// khung va chạm: chớp trắng + âm bản 1–2 khung
const impactFrame = (t, t0, dur = 0.08) => (t < t0 || t > t0 + dur) ? '' : `<rect width="1920" height="1080" fill="#fff" style="mix-blend-mode:difference"/>`;
// tối viền (cinematic) + dải đen letterbox
const cineFrame = (k = 1, bars = 0) => `<rect width="1920" height="1080" fill="url(#gVig)" opacity="${f1(k)}"/>` + (bars > 0 ? `<rect width="1920" height="${f1(bars)}" fill="#000"/><rect y="${f1(1080 - bars)}" width="1920" height="${f1(bars)}" fill="#000"/>` : '');
// đường tốc độ hướng tâm phát sáng nhẹ
function radialLines(t, cx, cy, o = {}) {
  let s = ''; const n = o.n || 40, r0 = o.r0 || 380;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + prand(i, 21) * 0.2, L = 200 + 500 * prand(i + Math.floor(t * 24), 22), r = r0 + 200 * prand(i + Math.floor(t * 24), 23);
    s += `<path d="M${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)} L${f1(cx + Math.cos(a) * (r + L))} ${f1(cy + Math.sin(a) * (r + L))}" stroke="${o.c || '#fff'}" stroke-width="${f1(2 + 5 * prand(i, 24))}" opacity="${f1(o.op || 0.5)}"/>`; }
  return s;
}
// rung máy tổng hợp (nhiều lần va chạm): list [t0, amp, dur]
function shakeMulti(t, list) { let x = 0, y = 0; for (const [t0, amp, dur] of list) { const d = t - t0; if (d >= 0 && d < dur) { const k = (1 - d / dur); x += Math.sin(d * 90 + t0) * amp * k; y += Math.cos(d * 77 + t0 * 3) * amp * k * 0.7; } } return [x, y]; }
// ---- bổ sung v2: hào quang quanh nhân vật, rồng khí vàng, khung mực đông cứng, chân dung đối đầu
// hào quang: vẽ lại hình (chuỗi SVG của nhân vật) đổi hết màu thành c, làm mờ, cộng sáng — đặt TRƯỚC nhân vật
function auraOf(svg, c, k = 1, cx = 960, cy = 540, sc = 1.05) {
  if (k <= 0) return ''; const mono = svg.replace(/(fill|stroke)="(?!none|url)[^"]*"/g, `$1="${c}"`);
  return `<g ${GL.add} opacity="${f1(Math.min(1, k))}"><g transform="translate(${f1(cx)} ${f1(cy)}) scale(${sc}) translate(${f1(-cx)} ${f1(-cy)})"><g filter="url(#gB2)">${mono}</g></g><g filter="url(#gB1)" opacity="0.7">${mono}</g></g>`;
}
// đổi một hình thành bóng mực (cho khung mực đông cứng)
const inkify = (svg, c = '#141010') => svg.replace(/(fill|stroke)="(?!none|url)[^"]*"/g, `$1="${c}"`).replace(/filter="url\([^)]*\)"/g, '');
// rồng khí: thân dọc theo đường P(u) (u 0 = đuôi → 1 = đầu), hiện từ đầu tới tỉ lệ k
function dragonQi(P, o = {}) {
  // rồng khí vàng: quầng bloom phía sau + thân "vẽ" đặc (vảy, bụng sáng, vây lửa, chân móng, đầu há miệng) + lớp năng lượng cộng sáng
  const N = o.n || 52, W = o.w || 70, k = o.k ?? 1, c = o.c || '#FFC23A', op = o.op ?? 1; if (k <= 0 || op <= 0) return '';
  const C = { body: o.body || '#F5AE1C', hi: '#FFE27A', belly: '#FFF0B8', line: '#7A3C00', scale: '#C46A06', fin: '#FF6A12', fin2: '#FFC23A' };
  const u0 = 1 - k, pts = [];
  for (let i = 0; i <= N; i++) { const u = u0 + (1 - u0) * (i / N); pts.push([u, ...P(u)]); }
  // chọn phía lưng hướng lên màn hình (trung bình): đổi dấu pháp tuyến nếu cần
  let sg = 0; for (let i = 1; i < N; i++) sg += pts[i + 1][1] - pts[i - 1][1]; const SG = sg >= 0 ? -1 : 1;
  const L = [], R = [], B = [], Sp = [], fr = [];
  let fins = '', scales = '', belly = '', legs = '';
  const P2 = (a) => f1(a[0]) + ' ' + f1(a[1]);
  for (let i = 0; i <= N; i++) { const [u, x, y] = pts[i], j = Math.min(N, i + 1), jj = Math.max(0, i - 1), dx = pts[j][1] - pts[jj][1], dy = pts[j][2] - pts[jj][2], ln = Math.hypot(dx, dy) || 1, tx = dx / ln, ty = dy / ln, nx = -ty * SG, ny = tx * SG;
    const uu = i / N, w = W * (0.12 + 0.88 * Math.sin(Math.min(1, uu * 1.25) * Math.PI * 0.5)) * (uu > 0.93 ? 0.82 : 1);
    fr.push({ x, y, tx, ty, nx, ny, w, uu });
    L.push([x + nx * w / 2, y + ny * w / 2]); R.push([x - nx * w / 2, y - ny * w / 2]); B.push([x - nx * w * 0.12, y - ny * w * 0.12]); Sp.push([x + nx * w * 0.28, y + ny * w * 0.28]);
    // vây lưng dạng lửa
    if (i % 2 === 1 && uu < 0.94 && uu > 0.04) { const h = w * (0.45 + 0.25 * Math.sin(i * 1.7)), bx = x + nx * w / 2, by = y + ny * w / 2;
      fins += `<path d="M${f1(bx - tx * w * 0.22)} ${f1(by - ty * w * 0.22)} Q${f1(bx + nx * h * 0.7 - tx * h * 0.5)} ${f1(by + ny * h * 0.7 - ty * h * 0.5)} ${f1(bx + nx * h - tx * h * 0.75)} ${f1(by + ny * h - ty * h * 0.75)} Q${f1(bx + nx * h * 0.3)} ${f1(by + ny * h * 0.3)} ${f1(bx + tx * w * 0.25)} ${f1(by + ty * w * 0.25)}Z" fill="${C.fin}" stroke="${C.line}" stroke-width="2.5" stroke-linejoin="round"/>`; }
    // vảy hình vòng cung
    if (i % 2 === 0 && uu < 0.92 && uu > 0.03) for (const off of [0.38, 0.05]) { const cx = x + nx * w * off, cy = y + ny * w * off, r = w * 0.17;
      scales += `<path d="M${f1(cx + nx * r)} ${f1(cy + ny * r)} Q${f1(cx - tx * r * 1.3)} ${f1(cy - ty * r * 1.3)} ${f1(cx - nx * r)} ${f1(cy - ny * r)}" stroke="${C.scale}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; }
    // vạch ngang bụng
    if (i % 2 === 0 && uu < 0.92) belly += `<path d="M${f1(x - nx * w * 0.14)} ${f1(y - ny * w * 0.14)} L${f1(x - nx * w * 0.47)} ${f1(y - ny * w * 0.47)}" stroke="#E7B24A" stroke-width="2.4"/>`;
  }
  // 2 cặp chân móng vuốt phía bụng
  for (const lu of [0.72, 0.38]) { const f = fr[Math.round(lu * N)]; if (!f || f.uu * k + u0 < u0 + 0.02) continue; const s = f.w / 70;
    const ex = f.x - f.nx * f.w * 0.45, ey = f.y - f.ny * f.w * 0.45, kx = ex - f.nx * 46 * s - f.tx * 26 * s, ky = ey - f.ny * 46 * s - f.ty * 26 * s, hx = kx - f.nx * 10 * s + f.tx * 26 * s, hy = ky - f.ny * 10 * s + f.ty * 26 * s;
    let cl = ''; for (const a of [-0.6, 0, 0.6]) { const ca = Math.cos(a), sa = Math.sin(a), dxx = (f.tx * ca - f.nx * sa * -1), dyy = (f.ty * ca - f.ny * sa * -1); cl += `<path d="M${f1(hx)} ${f1(hy)} q${f1(dxx * 22 * s)} ${f1(dyy * 22 * s)} ${f1((dxx * 26 - f.nx * 10) * s)} ${f1((dyy * 26 - f.ny * 10) * s)}" stroke="${C.line}" stroke-width="${f1(5 * s)}" fill="none" stroke-linecap="round"/>`; }
    legs += `<path d="M${f1(ex + f.tx * 14 * s)} ${f1(ey + f.ty * 14 * s)} Q${f1(kx - f.tx * 14 * s)} ${f1(ky - f.ty * 14 * s)} ${f1(hx)} ${f1(hy)} L${f1(ex - f.tx * 14 * s)} ${f1(ey - f.ty * 14 * s)}Z" fill="${C.body}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>${cl}`; }
  const body = `M${L.map(P2).join(' L')} L${[...R].reverse().map(P2).join(' L')}Z`;
  const bellyP = `M${B.map(P2).join(' L')} L${[...R].reverse().map(P2).join(' L')}Z`;
  const spine = `M${Sp.map(P2).join(' L')}`;
  // chùm lửa đuôi
  const t0 = fr[0], tail = `<path d="M${f1(t0.x + t0.nx * 6)} ${f1(t0.y + t0.ny * 6)} Q${f1(t0.x - t0.tx * 60 + t0.nx * 40)} ${f1(t0.y - t0.ty * 60 + t0.ny * 40)} ${f1(t0.x - t0.tx * 110 + t0.nx * 30)} ${f1(t0.y - t0.ty * 110 + t0.ny * 30)} Q${f1(t0.x - t0.tx * 60)} ${f1(t0.y - t0.ty * 60)} ${f1(t0.x - t0.tx * 100 - t0.nx * 30)} ${f1(t0.y - t0.ty * 100 - t0.ny * 30)} Q${f1(t0.x - t0.tx * 40 - t0.nx * 30)} ${f1(t0.y - t0.ty * 40 - t0.ny * 30)} ${f1(t0.x - t0.nx * 6)} ${f1(t0.y - t0.ny * 6)}Z" fill="${C.fin}" stroke="${C.line}" stroke-width="2.5"/>`;
  // đầu rồng (trục +x), lật dọc nếu bay sang trái để sừng luôn hướng lên
  const [, hx, hy] = pts[N], [, px, py] = pts[N - 2], ang = Math.atan2(hy - py, hx - px) * 180 / Math.PI, hs = W / 64, flip = Math.cos(ang * Math.PI / 180) < 0 ? -1 : 1;
  const ln = `stroke="${C.line}" stroke-width="3" stroke-linejoin="round"`;
  const head = `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(ang)}) scale(${f1(hs)} ${f1(hs * flip)})">
<path d="M-34 -30 L-70 -58 L-44 -24 L-86 -30 L-46 -8 L-90 2 L-44 10 L-78 30 L-36 22Z" fill="${C.fin}" ${ln}/>
<path d="M-4 -34 Q-30 -70 -74 -88 M-30 -64 Q-44 -64 -54 -56 M14 -36 Q-2 -78 -34 -104 M-10 -80 Q-22 -82 -28 -76" stroke="#FFF3C8" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M-4 -34 Q-30 -70 -74 -88 M14 -36 Q-2 -78 -34 -104" stroke="${C.line}" stroke-width="2" fill="none" opacity="0.6"/>
<path d="M-14 16 Q30 22 64 16 L118 28 Q124 40 108 44 L44 42 Q2 40 -20 30Z" fill="${C.body}" ${ln}/>
<path d="M30 4 L116 -2 L112 28 L52 22Z" fill="#7A1010"/>
<path d="M60 4 l6 10 l6 -10 M80 2 l6 10 l6 -10 M100 0 l5 10 l5 -10 M64 22 l6 -9 l6 9 M86 24 l5 -9 l5 9" fill="#fff" stroke="none"/>
<path d="M-38 -26 Q-6 -50 44 -40 L106 -26 Q132 -22 134 -6 Q134 4 122 6 L60 6 Q16 10 -34 18Z" fill="${C.body}" ${ln}/>
<path d="M-24 -18 Q10 -38 50 -30" stroke="${C.hi}" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M14 -40 Q40 -60 66 -36" fill="${C.scale}" ${ln}/>
<ellipse cx="40" cy="-24" rx="14" ry="9" fill="#FFF8E0" stroke="${C.line}" stroke-width="2.5"/><circle cx="44" cy="-24" r="5.5" fill="#C01818"/><circle cx="45" cy="-25" r="2" fill="#fff"/>
<circle cx="122" cy="-12" r="3.5" fill="${C.line}"/>
<path d="M118 -8 Q150 -30 170 -14 Q186 0 200 -22 M110 30 Q140 54 168 44 Q186 38 196 56" stroke="#FFF3C8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M0 34 Q-4 56 -20 66 M20 40 Q20 62 8 74 M40 42 Q44 60 34 72" stroke="${C.fin2}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  const glow = bloom(`<path d="${body}" fill="#fff"/>`, c, 0.55);
  const solid = `<g>${tail}${fins}${legs}<path d="${body}" fill="${C.body}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/><path d="${bellyP}" fill="${C.belly}"/>${belly}${scales}<path d="${spine}" stroke="${C.hi}" stroke-width="${f1(W * 0.09)}" fill="none" stroke-linecap="round" opacity="0.7"/><path d="${body}" fill="none" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>${head}</g>`;
  const energy = `<g ${GL.add} opacity="0.35"><path d="${body}" fill="#FFF2C0" filter="url(#gB1)"/></g>`;
  return `<g opacity="${f1(Math.min(1, op))}">${glow}${solid}${energy}</g>`;
}

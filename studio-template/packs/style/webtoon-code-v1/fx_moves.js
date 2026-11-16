// webtoon-code-v1 — THƯ VIỆN CHIÊU THỨC (fx_moves.js), 2026-10-13
// Người dùng (kênh mẫu): "signature của kênh là hiệu ứng đánh nhau, chiêu thức đã mắt… cần nghĩ ra nhiều loại hiệu ứng khác nữa cho nhiều loại".
// Mỗi hàm trả chuỗi SVG, dùng chung mọi tập (nạp qua blueprint extra_scripts, sau glow.js + fx.js). Phụ thuộc: glow.js (bloom, GL, glowSparks, flareBurst, shockRing, glowDot),
// fx.js (smK, spring, bump), chibi.js (INK2, f1, clamp, lerp, EZ, prand, mixC).
// Quy ước: t = giây trong shot, t0 = lúc chiêu bắt đầu, o = tuỳ chọn (c màu chính, s cỡ). Hàm nào hết thời gian thì trả ''.
// DANH MỤC (xem mẫu: episodes/tay-du-p1/build/prev/mau_hieu_ung.mp4):
//   fmArc        vệt vung / chém vòng cung (gậy, đao)          fmThrust   vệt đâm thẳng (giáo, kích)
//   fmWheel      binh khí múa tít thành bánh xe                fmMorph    biến hoá: cột khói xoắn + loé, che lúc đổi hình
//   fmCloneBurst nhổ lông → hạt vàng bay ra → bụp thành bản sao fmCloudDash cân đẩu: vệt mây + vòng lộn + vệt vàng
//   fmBolt       sét đánh rẽ nhánh                             fmFreeze   định thân: vòng băng + tinh thể đóng
//   fmCrack      dậm đất / khổng lồ: nứt đất + bụi + đá văng    fmFlames   lửa cuộn nhiều lớp (lò, núi lửa, đao toé lửa)
//   fmBind       trói / vòng thu: vòng vàng siết + tia sáng      fmPalm     bàn tay Phật ép xuống: bóng tay + hào quang + sóng ép
//   fmAura       bộc phát khí quanh người (lửa khí bốc lên)      fmWind     thổi gió cuốn lá / bụi
// THÊM 2026-10-19 (Tây Du Ký P2, C4 đã duyệt):
//   fmVortex     xoáy hút: vệt xoắn ốc cuộn vào tâm (hồ lô, bình, tay áo)   fmPull / fmFly  vật bị hút / bay theo đường cong (toạ độ+cỡ+góc xoay)
//   fmNameCall   sóng tiếng gọi tên lan từ miệng                              fmChant    dòng bùa chú uốn lượn tới đầu người bị vòng
//   fmHeadRing   vòng kim cô siết đầu: vòng co nhịp, sóng vàng, vạch đau

// cụm mây/khói mềm (không phụ thuộc đồ nghề nền của tập)
function fmPuffs(list, c = '#FFFFFF', sw = 4, op = 1) {
  let s = list.map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0, r))}" fill="${c}" stroke="${INK2}" stroke-width="${sw}"/>`).join('');
  s += list.map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0, r - sw))}" fill="${c}"/>`).join('');
  return `<g opacity="${f1(op)}">${s}</g>`;
}

// 1. vệt vung vòng cung: tâm (cx,cy), bán kính r, quét từ góc a0 → a1 (độ) trong dur; lưỡi liềm sáng dày ở đầu, mảnh dần về đuôi
function fmArc(t, t0, cx, cy, r, a0, a1, o = {}) {
  const dur = o.dur || 0.16, fade = o.fade || 0.3, d = t - t0; if (d < 0 || d > dur + fade) return '';
  const head = EZ.expoOut(Math.min(1, d / dur)), tail = d < dur ? 0 : EZ.quadIn((d - dur) / fade), c = o.c || '#FFD36A', w = o.w || 46;
  const aH = lerp(a0, a1, head), aT = lerp(a0, a1, Math.min(head, tail + 0.05)), n = 14;
  let outer = '', inner = '';
  for (let i = 0; i <= n; i++) { const u = i / n, a = (aT + (aH - aT) * u) * Math.PI / 180, ww = w * Math.pow(u, 1.4); outer += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * (r + ww / 2)) + ' ' + f1(cy + Math.sin(a) * (r + ww / 2)); inner = 'L' + f1(cx + Math.cos(a) * (r - ww / 2)) + ' ' + f1(cy + Math.sin(a) * (r - ww / 2)) + inner; }
  const path = `<path d="${outer}${inner.replace(/^L/, ' L')}Z" fill="#fff"/>`;
  const aE = aH * Math.PI / 180, ex = cx + Math.cos(aE) * r, ey = cy + Math.sin(aE) * r;
  return `<g opacity="${f1(1 - tail)}">${bloom(path, c, 1)}</g>` + (d < dur + 0.1 ? glowDot(ex, ey, 18, c, 1 - tail) : '') + (o.sparks !== false && d < dur + 0.05 ? glowSparks(t, t0 + dur * 0.8, ex, ey, { n: 10, dur: 0.35, c: mixC(c, '#FFFFFF', 0.5) }) : '');
}

// 2. vệt đâm thẳng: từ (x0,y0) tới (x1,y1); mũi sáng + nón gió + vạch tốc độ song song
function fmThrust(t, t0, x0, y0, x1, y1, o = {}) {
  const dur = o.dur || 0.14, fade = o.fade || 0.3, d = t - t0; if (d < 0 || d > dur + fade) return '';
  const k = EZ.expoOut(Math.min(1, d / dur)), op = d < dur ? 1 : 1 - (d - dur) / fade, c = o.c || '#BFE6FF';
  const hx = lerp(x0, x1, k), hy = lerp(y0, y1, k), L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  let s = `<path d="M${f1(x0 + nx * 3)} ${f1(y0 + ny * 3)} L${f1(hx)} ${f1(hy)} L${f1(x0 - nx * 3)} ${f1(y0 - ny * 3)}Z" fill="#fff"/>`;
  s += `<path d="M${f1(hx)} ${f1(hy)} L${f1(hx - (x1 - x0) / L * 120 + nx * 40)} ${f1(hy - (y1 - y0) / L * 120 + ny * 40)} M${f1(hx)} ${f1(hy)} L${f1(hx - (x1 - x0) / L * 120 - nx * 40)} ${f1(hy - (y1 - y0) / L * 120 - ny * 40)}" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  for (let i = -2; i <= 2; i++) if (i) { const off = i * 26, l0 = 0.2 + 0.15 * Math.abs(i); s += `<path d="M${f1(lerp(x0, hx, l0) + nx * off)} ${f1(lerp(y0, hy, l0) + ny * off)} L${f1(lerp(x0, hx, 0.85) + nx * off)} ${f1(lerp(y0, hy, 0.85) + ny * off)}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`; }
  return `<g opacity="${f1(op)}">${bloom(s, c, 1)}</g>` + glowDot(hx, hy, 24, c, op);
}

// 3. binh khí múa tít thành bánh xe tại (cx,cy), bán kính r, độ hiện k (0..1)
function fmWheel(t, cx, cy, r, k = 1, o = {}) {
  if (k <= 0) return ''; const c = o.c || '#FFD36A', a = t * (o.speed || 1100);
  let s = `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="none" stroke="#fff" stroke-width="10" opacity="0.5"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * 0.7)}" fill="none" stroke="#fff" stroke-width="5" opacity="0.35"/>`;
  for (let i = 0; i < 3; i++) { const aa = (a - i * 18) * Math.PI / 180, op = 1 - i * 0.3; s += `<path d="M${f1(cx - Math.cos(aa) * r)} ${f1(cy - Math.sin(aa) * r)} L${f1(cx + Math.cos(aa) * r)} ${f1(cy + Math.sin(aa) * r)}" stroke="#fff" stroke-width="${14 - i * 4}" stroke-linecap="round" opacity="${f1(op)}"/>`; }
  const solid = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(a % 360)})"><rect x="${f1(-r)}" y="-9" width="${f1(2 * r)}" height="18" rx="6" fill="#2A2A30" stroke="${INK2}" stroke-width="4"/><rect x="${f1(-r - 6)}" y="-12" width="34" height="24" rx="5" fill="#E2B23A" stroke="${INK2}" stroke-width="3"/><rect x="${f1(r - 28)}" y="-12" width="34" height="24" rx="5" fill="#E2B23A" stroke="${INK2}" stroke-width="3"/></g>`;
  const sp = Math.floor(t * 8) / 8;
  return `<g opacity="${f1(k)}">${bloom(s, c, 0.9)}${solid}${glowSparks(t, sp, cx + Math.cos(a * 0.02) * r, cy + Math.sin(a * 0.02) * r, { n: 6, dur: 0.3, c })}</g>`;
}

// 4. biến hoá: cột khói xoắn ốc nở ra quanh (x,y) rồi tan; trả { back, front, cover } — cover (0..1) = lúc khói dày nhất, đổi hình ở giữa
function fmMorph(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 0.9, s = o.s || 1, c = o.c || '#FFFFFF', tint = o.tint || '#FFE39A';
  if (d < 0 || d > dur) return { back: '', front: '', cover: 0 };
  const k = d / dur, grow = EZ.expoOut(Math.min(1, k * 2.2)), fade = k < 0.55 ? 1 : 1 - (k - 0.55) / 0.45;
  let front = '';
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + d * 7 + (i % 2) * 0.4, rr = (60 + 120 * grow) * s * (0.8 + 0.3 * prand(i, 3)), yy = y - (i / 14) * 260 * s * grow;
    front += fmPuffs([[x + Math.cos(a) * rr * 0.8, yy + Math.sin(a) * rr * 0.25, (40 + 30 * prand(i, 4)) * s * (0.5 + grow)]], c, 3 * s, fade); }
  front += fmPuffs([[x - 120 * s * grow, y + 20, 70 * s * grow], [x + 120 * s * grow, y + 20, 70 * s * grow], [x, y + 30, 90 * s * grow]], c, 4, fade);
  const ring = `<ellipse cx="${f1(x)}" cy="${f1(y + 10)}" rx="${f1(200 * s * grow)}" ry="${f1(50 * s * grow)}" fill="none" stroke="#fff" stroke-width="8"/>`;
  front += bloom(ring, tint, fade * 0.9) + glowSparks(t, t0 + 0.15, x, y - 120 * s, { n: 22, dur: 0.7, c: tint }) + flareBurst(t, t0 + dur * 0.4, x, y - 140 * s, { r: 260 * s, c: tint, dur: 0.5, rays: 10 });
  const back = `<g ${GL.add} opacity="${f1(fade * 0.6)}"><circle cx="${f1(x)}" cy="${f1(y - 120 * s)}" r="${f1(220 * s * grow)}" fill="${tint}" filter="url(#gB3)"/></g>`;
  return { back, front, cover: Math.min(1, k * 3) * fade };
}

// 5. nhổ lông phân thân: sợi lông thổi ra từ (x,y) → hạt vàng bay theo cung tới từng đích → bụp khói nhỏ ở đích; trả { front, done(i) }
function fmCloneBurst(t, t0, x, y, targets, o = {}) {
  const fly = o.fly || 0.55, c = o.c || '#FFD36A'; let s = '';
  if (t < t0) return '';
  if (t < t0 + 0.25) s += glowDot(x, y, 16, c, 1) + [...Array(7)].map((_, i) => `<path d="M${f1(x)} ${f1(y)} q${f1((i - 3) * 6)} -18 ${f1((i - 3) * 10)} -30" stroke="#B8823A" stroke-width="3" fill="none"/>`).join('');
  targets.forEach(([tx, ty], i) => { const st = t0 + 0.12 + i * (o.stagger ?? 0.04), k = clamp((t - st) / fly); if (k <= 0) return;
    if (k < 1) { const e = EZ.quadInOut(k), px = lerp(x, tx, e), py = lerp(y, ty, e) - Math.sin(k * Math.PI) * 160; s += glowDot(px, py, 9, c, 1) + `<path d="M${f1(px)} ${f1(py)} L${f1(lerp(x, tx, Math.max(0, e - 0.12)))} ${f1(lerp(y, ty, Math.max(0, e - 0.12)) - Math.sin(Math.max(0, k - 0.12) * Math.PI) * 160)}" stroke="${c}" stroke-width="4" opacity="0.6" stroke-linecap="round"/>`; }
    else if (t < st + fly + 0.4) { const u = (t - st - fly) / 0.4; s += fmPuffs([[tx, ty, 26 + 40 * u], [tx - 30, ty + 16, 18 + 24 * u], [tx + 30, ty + 16, 18 + 24 * u]], '#FFFFFF', 3, 1 - u); } });
  return `<g ${GL.add}>${s}</g>`;
}

// 6. cân đẩu: vật bay theo đường P(u) (hàm u→[x,y]); để lại vệt mây + vệt vàng; vòng lộn ở đầu đường
function fmCloudDash(t, t0, dur, P, o = {}) {
  const d = t - t0; if (d < 0 || d > dur + 0.8) return '';
  const k = Math.min(1, d / dur), c = o.c || '#FFD36A'; let s = '', streak = '';
  for (let i = 0; i < 16; i++) { const u = k - i * 0.035; if (u <= 0) break; const [px, py] = P(u), age = (i * 0.035 * dur) + Math.max(0, d - dur), op = clamp(1 - age / 0.9);
    s += fmPuffs([[px, py + 10, 30 - i * 1.2], [px - 26, py + 20, 20 - i * 0.8]], '#FFFFFF', 3, op); }
  for (let i = 0; i <= 10; i++) { const u = Math.max(0, k - 0.25 + i * 0.025); const [px, py] = P(u); streak += (i ? 'L' : 'M') + f1(px) + ' ' + f1(py); }
  s += `<g opacity="${f1(d < dur ? 1 : 1 - (d - dur) / 0.8)}">${bloom(`<path d="${streak}" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>`, c, 1)}</g>`;
  if (d < 0.35) { const [px, py] = P(0); s += bloom(`<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(40 + 120 * (d / 0.35))}" fill="none" stroke="#fff" stroke-width="${f1(10 * (1 - d / 0.35))}"/>`, c, 1); }
  return s;
}

// 7. sét: tia rẽ nhánh từ (x0,y0) xuống (x1,y1), nhấp nháy trong dur
function fmBolt(t, t0, x0, y0, x1, y1, o = {}) {
  const dur = o.dur || 0.5, d = t - t0; if (d < 0 || d > dur) return '';
  const flick = Math.floor(d * 30), on = flick % 3 !== 2, c = o.c || '#BFD8FF'; if (!on) return '';
  const seg = 9, pts = []; for (let i = 0; i <= seg; i++) { const u = i / seg, j = i === 0 || i === seg ? 0 : (prand(i + flick * 13, 7) - 0.5) * 90; pts.push([lerp(x0, x1, u) + j, lerp(y0, y1, u)]); }
  let p = 'M' + pts.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L');
  for (let b = 0; b < 3; b++) { const i = 2 + b * 2, [bx, by] = pts[i]; p += ` M${f1(bx)} ${f1(by)} l${f1((prand(b + flick, 9) - 0.5) * 160)} ${f1(60 + prand(b, 10) * 80)} l${f1((prand(b + flick, 11) - 0.5) * 80)} ${f1(40 + prand(b, 12) * 50)}`; }
  return bloom(`<path d="${p}" stroke="#fff" stroke-width="8" fill="none" stroke-linejoin="round"/>`, c, 1 - d / dur * 0.5) + glowDot(x1, y1, 40, c, 1 - d / dur);
}

// 8. định thân / đóng băng: vòng băng lan ra từ (x,y) bán kính r, tinh thể nhọn mọc lên, hạt tuyết lấp lánh
function fmFreeze(t, t0, x, y, r, o = {}) {   // o.spikes: false = bỏ gai băng (người dùng 2026-10-13: cảnh tiên nữ đứng như tượng không cần gai)
  const d = t - t0; if (d < 0) return ''; const k = EZ.expoOut(Math.min(1, d / 0.5)), c = o.c || '#9ADCFF', hold = o.hold ?? 99, fade = d > hold ? clamp(1 - (d - hold) / 0.5) : 1;
  if (fade <= 0) return '';
  let s = bloom(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * k)}" ry="${f1(r * 0.28 * k)}" fill="none" stroke="#fff" stroke-width="7"/>`, c, fade);
  s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * k)}" ry="${f1(r * 0.28 * k)}" fill="${c}" opacity="${f1(0.25 * fade)}"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, gx = x + Math.cos(a) * r * 0.85 * k, gy = y + Math.sin(a) * r * 0.24 * k, h = (50 + 60 * prand(i, 21)) * clamp((d - 0.1 - i * 0.02) / 0.3);
    if (h > 0 && o.spikes !== false) s += `<path d="M${f1(gx - 14)} ${f1(gy)} L${f1(gx)} ${f1(gy - h)} L${f1(gx + 14)} ${f1(gy)}Z" fill="#DDF3FF" stroke="${INK2}" stroke-width="3" opacity="${f1(fade)}"/>`; }
  for (let i = 0; i < 10; i++) { const tw = Math.abs(Math.sin(t * 4 + i)); s += `<path d="M${f1(x + (prand(i, 23) - 0.5) * r * 1.6)} ${f1(y - prand(i, 24) * r * 0.9)} l5 -14 l5 14 l14 5 l-14 5 l-5 14 l-5 -14 l-14 -5Z" fill="#FFFFFF" opacity="${f1(tw * fade)}"/>`; }
  return s;
}

// 9. nứt đất: dậm chân / khổng lồ đáp xuống tại (x,y): khe nứt toả ra, bụi phồng, đá văng, vòng xung kích
function fmCrack(t, t0, x, y, o = {}) {
  const d = t - t0; if (d < 0 || d > 2.5) return ''; const s = o.s || 1, k = EZ.expoOut(Math.min(1, d / 0.25)), fade = d < 1.6 ? 1 : 1 - (d - 1.6) / 0.9;
  let p = '';
  for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI, L = (180 + 160 * prand(i, 31)) * s * k; let cx = x, cy = y; p += `M${f1(cx)} ${f1(cy)}`;
    for (let j = 1; j <= 4; j++) { cx = x + Math.cos(a + (prand(i * 4 + j, 32) - 0.5) * 0.5) * L * j / 4 * -1; cy = y + Math.abs(Math.sin(a)) * L * 0.18 * j / 4 + (prand(i * 4 + j, 33) - 0.5) * 10; p += ` L${f1(cx)} ${f1(cy)}`; } }
  let out = `<path d="${p}" stroke="#2A1E16" stroke-width="${f1(8 * s)}" fill="none" stroke-linecap="round" opacity="${f1(fade)}"/><path d="${p}" stroke="#FFB45A" stroke-width="${f1(2.5 * s)}" fill="none" opacity="${f1(fade * (1 - Math.min(1, d / 0.8)))}"/>`;
  for (let i = 0; i < 8; i++) { const kk = clamp((d - i * 0.03) / 1.2); if (kk <= 0) continue; const sd = i % 2 ? 1 : -1, rr = (80 + 280 * EZ.expoOut(kk)) * s; out += `<circle cx="${f1(x + sd * rr * (0.4 + 0.6 * prand(i, 34)))}" cy="${f1(y - 30 * kk)}" r="${f1((50 + 60 * kk) * s)}" fill="#D8CDB8" opacity="${f1(0.6 * (1 - kk))}"/>`; }
  for (let i = 0; i < 10; i++) { const a = -Math.PI * (0.15 + 0.7 * prand(i, 35)), v = (400 + 500 * prand(i, 36)) * s, px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d + 900 * d * d; if (py > y + 80) continue; const r = (8 + 12 * prand(i, 37)) * s; out += `<path d="M${f1(px - r)} ${f1(py)} L${f1(px)} ${f1(py - r)} L${f1(px + r)} ${f1(py + r * 0.3)}Z" fill="#8A7A64" stroke="${INK2}" stroke-width="2"/>`; }
  return out + shockRing(t, t0, x, y, { r: 600 * s, c: '#FFE6B0', dur: 0.55 });
}

// 10. lửa cuộn: dải lửa rộng w, cao h, chân tại (x,y); k = độ cháy (0..1)
function fmFlames(t, x, y, w, h, k = 1, o = {}) {
  if (k <= 0) return ''; const n = o.n || Math.max(5, Math.round(w / 50)), C = o.cols || ['#C0392B', '#FF7A2A', '#FFC83A', '#FFF2B0'];
  let s = '';
  C.forEach((c, layer) => { const hh = h * k * (1 - layer * 0.22), ww = w * (1 - layer * 0.12); let d = `M${f1(x - ww / 2)} ${f1(y)}`;
    for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 0.5) / n, u2 = (i + 1) / n, ph = t * (5 + layer) + i * 1.7, tip = hh * (0.6 + 0.4 * Math.abs(Math.sin(ph))) ;
      d += ` Q${f1(x - ww / 2 + ww * u0 + 6)} ${f1(y - tip * 0.5)} ${f1(x - ww / 2 + ww * u1 + Math.sin(ph) * 10)} ${f1(y - tip)} Q${f1(x - ww / 2 + ww * u2 - 6)} ${f1(y - tip * 0.5)} ${f1(x - ww / 2 + ww * u2)} ${f1(y)}`; }
    s += `<path d="${d}Z" fill="${c}" ${layer ? '' : `stroke="${INK2}" stroke-width="3"`}/>`; });
  for (let i = 0; i < 8; i++) { const u = ((t * 0.8 + prand(i, 41)) % 1); s += `<circle cx="${f1(x + (prand(i, 42) - 0.5) * w + Math.sin(t * 3 + i) * 12)}" cy="${f1(y - h * k * (0.6 + u))}" r="${f1(4 + 3 * prand(i, 43))}" fill="#FFE39A" opacity="${f1(1 - u)}"/>`; }
  return s + `<g ${GL.add} opacity="${f1(0.5 * k)}"><ellipse cx="${f1(x)}" cy="${f1(y - h * 0.4)}" rx="${f1(w * 0.7)}" ry="${f1(h * 0.7)}" fill="#FF9A3A" filter="url(#gB3)"/></g>`;
}

// 11. trói / thu phục: ba vòng vàng thu nhỏ siết quanh người tại (x,y) (cao h), loé khi siết xong
function fmBind(t, t0, x, y, h, o = {}) {
  const d = t - t0; if (d < 0) return ''; const c = o.c || '#FFD36A', dur = o.dur || 0.6; let s = '';
  [0.25, 0.5, 0.75].forEach((u, i) => { const k = EZ.backOut(clamp((d - i * 0.08) / dur)), r = lerp(260, 90, k), yy = y - h * u;
    s += bloom(`<ellipse cx="${f1(x)}" cy="${f1(yy)}" rx="${f1(r)}" ry="${f1(r * 0.28)}" fill="none" stroke="#fff" stroke-width="9"/>`, c, Math.min(1, d * 4)) + `<ellipse cx="${f1(x)}" cy="${f1(yy)}" rx="${f1(r)}" ry="${f1(r * 0.28)}" fill="none" stroke="${INK2}" stroke-width="2" opacity="0.6"/>`; });
  return s + flareBurst(t, t0 + dur, x, y - h * 0.5, { r: 220, c, dur: 0.4, rays: 8 }) + glowSparks(t, t0 + dur, x, y - h * 0.5, { n: 16, dur: 0.5, c });
}

// 12a. ấn Như Lai thần chưởng: pháp luân 8 nan trong vòng kép + cánh sen + tia vàng, xoay chậm, phát sáng — đặt giữa lòng bàn tay
// (người dùng 2026-10-13: 'bàn tay phật nên để thêm hình như lai thần chưởng ở giữa'). KHÔNG dùng chữ vạn / chữ Hán (dễ hiểu nhầm, luật kênh không chữ Hán).
function fmSeal(t, x, y, r, k = 1, o = {}) {
  if (k <= 0) return ''; const c = o.c || '#FFD36A', rot = t * (o.spin ?? 20); let w = '';
  w += `<circle cx="0" cy="0" r="${f1(r)}" fill="none" stroke="#fff" stroke-width="${f1(r * 0.06)}"/><circle cx="0" cy="0" r="${f1(r * 0.82)}" fill="none" stroke="#fff" stroke-width="${f1(r * 0.03)}"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; w += `<path d="M${f1(Math.cos(a) * r * 0.2)} ${f1(Math.sin(a) * r * 0.2)} L${f1(Math.cos(a) * r * 0.8)} ${f1(Math.sin(a) * r * 0.8)}" stroke="#fff" stroke-width="${f1(r * 0.07)}" stroke-linecap="round"/><circle cx="${f1(Math.cos(a) * r * 0.8)}" cy="${f1(Math.sin(a) * r * 0.8)}" r="${f1(r * 0.07)}" fill="#fff"/>`; }
  w += `<circle cx="0" cy="0" r="${f1(r * 0.2)}" fill="none" stroke="#fff" stroke-width="${f1(r * 0.06)}"/><circle cx="0" cy="0" r="${f1(r * 0.08)}" fill="#fff"/>`;
  let petals = ''; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; petals += `<path d="M0 0 Q${f1(-r * 0.12)} ${f1(-r * 0.2)} 0 ${f1(-r * 0.36)} Q${f1(r * 0.12)} ${f1(-r * 0.2)} 0 0Z" fill="#fff" transform="rotate(${f1(a * 180 / Math.PI)}) translate(0 ${f1(-r * 1.02)})"/>`; }
  const pulse = 0.85 + 0.15 * Math.sin(t * 6);
  const solid = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(pulse)})" opacity="${f1(Math.min(1, k))}"><g transform="rotate(${f1(-rot * 0.5)})">${petals.replace(/#fff/g, '#F2B83A')}</g><g transform="rotate(${f1(rot)})">${w.replace(/#fff/g, '#C8800E')}</g></g>`;
  return `<g ${GL.add} opacity="${f1(Math.min(1, k) * 0.3)}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.6)}" fill="${c}" filter="url(#gB3)"/></g>` + (o.rays !== false ? fxRays(t, x, y, k * 0.4, mixC(c, '#FFFFFF', 0.4)) : '') +
    `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(pulse)})">${bloom(`<g transform="rotate(${f1(-rot * 0.5)})">${petals}</g><g transform="rotate(${f1(rot)})">${w}</g>`, c, k * 0.7)}</g>` + solid;
}

// 12. bàn tay Phật ép xuống: bóng bàn tay khổng lồ hạ từ trên (x,y = tâm lòng bàn tay lúc chạm), hào quang vàng, vạch ép, sóng xung kích khi chạm
function fmPalm(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 1.0; if (d < 0 || d > dur + 1.2) return ''; const s = o.s || 1, k = EZ.quadIn(Math.min(1, d / dur)), yy = lerp(y - 900 * s, y, k), c = o.c || '#FFE39A';
  const hand = `<g transform="translate(${f1(x)} ${f1(yy)}) scale(${f1(s)})"><path d="M-300 120 Q-330 -40 -270 -120 L-280 -380 Q-280 -430 -235 -430 Q-190 -430 -190 -380 L-180 -160 L-170 -470 Q-170 -520 -122 -520 Q-74 -520 -74 -470 L-70 -160 L-50 -500 Q-50 -550 0 -550 Q50 -550 50 -500 L50 -160 L80 -440 Q80 -490 128 -490 Q176 -490 176 -440 L160 -100 L250 -230 Q280 -270 320 -248 Q350 -228 330 -190 L220 60 Q160 180 -300 120Z" fill="#F4CA8C" stroke="${INK2}" stroke-width="8"/>` + [[-235, -400], [-122, -490], [0, -520], [128, -460]].map(([fx, fy]) => `<path d="M${fx - 28} ${fy + 4} Q${fx} ${fy - 30} ${fx + 28} ${fy + 4} Q${fx} ${fy + 14} ${fx - 28} ${fy + 4}Z" fill="#FBE2C8" stroke="${INK2}" stroke-width="4"/><path d="M${fx - 30} ${fy + 110} q30 12 60 0 M${fx - 30} ${fy + 210} q30 12 60 0" stroke="#C8925A" stroke-width="5" fill="none"/>`).join('') + `<path d="M-230 -40 Q-60 -90 120 -40 M-200 40 Q0 0 200 30" stroke="#C8925A" stroke-width="7" fill="none"/></g>`;
  let out = `<g ${GL.add} opacity="${f1(0.6 * Math.min(1, d * 2))}"><circle cx="${f1(x)}" cy="${f1(yy - 200 * s)}" r="${f1(520 * s)}" fill="${c}" filter="url(#gB3)"/></g>` + (typeof auraOf === 'function' ? auraOf(hand, c, 0.8 * Math.min(1, d * 2), x, yy, 1.04) : '') + hand + fmSeal(t, x - 40 * s, yy - 60 * s, 150 * s, Math.min(1, d * 2.5) * (d < dur ? 1 : 1 + 0.6 * bump(t, t0 + dur, 0.6)));
  if (d < dur) for (let i = 0; i < 10; i++) { const xx = x + (i - 4.5) * 90 * s; out += `<path d="M${f1(xx)} ${f1(yy + 160 * s)} V${f1(yy + (220 + 60 * prand(i, 51)) * s)}" stroke="#fff" stroke-width="6" opacity="0.7"/>`; }
  const hf = d < dur + 0.4 ? 1 : clamp(1 - (d - dur - 0.4) / 0.8); out = `<g opacity="${f1(hf)}">${out}</g>`;
  if (d >= dur) out += shockRing(t, t0 + dur, x, y + 120 * s, { r: 900 * s, c, dur: 0.7 }) + flareBurst(t, t0 + dur, x, y, { r: 500 * s, c, dur: 0.8, rays: 16 });
  return out;
}

// 13. bộc phát khí quanh một hình (svg của nhân vật): viền lửa khí bốc lên + hạt bay; đặt TRƯỚC nhân vật
function fmAura(t, svg, x, y, k = 1, o = {}) {
  if (k <= 0) return ''; const c = o.c || '#FFD36A';
  let s = typeof auraOf === 'function' ? auraOf(svg, c, k * (0.7 + 0.3 * Math.sin(t * 12)), x, y, 1.08) : '';
  for (let i = 0; i < 12; i++) { const u = ((t * 1.2 + prand(i, 61)) % 1), px = x + (prand(i, 62) - 0.5) * (o.w || 260), py = y - u * (o.h || 420); s += `<path d="M${f1(px)} ${f1(py)} q-8 -20 0 -40 q8 20 0 40Z" fill="${c}" opacity="${f1(k * (1 - u))}" ${GL.add}/>`; }
  return s;
}

// 14. gió cuốn: các vệt gió xoắn chạy ngang vùng (x0..x1, y quanh yc), mang lá / bụi; dir = -1 sang trái
function fmWind(t, x0, x1, yc, k = 1, o = {}) {
  if (k <= 0) return ''; const dir = o.dir || -1, n = o.n || 9; let s = '';
  for (let i = 0; i < n; i++) { const ph = (t * (0.9 + prand(i, 71) * 0.6) + i / n) % 1, u = dir < 0 ? 1 - ph : ph, x = lerp(x0, x1, u), y = yc + (prand(i, 72) - 0.5) * (o.h || 400) + Math.sin(ph * 8 + i) * 30, op = k * (1 - Math.abs(ph - 0.5) * 2);
    s += `<path d="M${f1(x)} ${f1(y)} q${-dir * 60} -40 ${-dir * 120} 0 t${-dir * 120} 0 q${-dir * 40} 30 ${-dir * 10} 50" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f1(op)}"/>`;
    if (i % 3 === 0) s += `<path d="M${f1(x + dir * 30)} ${f1(y - 20)} q14 -14 28 -4 q-10 12 -28 4Z" fill="${['#7AAA4A', '#C8A04A', '#E58AA6'][i % 3]}" stroke="${INK2}" stroke-width="2" opacity="${f1(op)}" transform="rotate(${f1(t * 300 + i * 40)} ${f1(x + dir * 30)} ${f1(y - 20)})"/>`; }
  return s;
}

// ===== THÊM 2026-10-19: chiêu của Tây Du Ký P2 (từ sc_fx2.js, C4 đã duyệt) =====
function fmVortex(t, t0, x, y, r, o = {}) {
  const d = t - t0, dur = o.dur || 1.1, fade = 0.3; if (d < 0 || d > dur + fade) return '';
  const c = o.c || '#FFFFFF', n = o.n || 12, dir = o.dir || 1, ry = o.ry || 1, k = Math.min(1, d / 0.25) * (d < dur ? 1 : 1 - (d - dur) / fade);
  let s = '';
  for (let i = 0; i < n; i++) {
    const ph = (d * 1.5 + i / n + prand(i, 81) * 0.2) % 1, a0 = i * Math.PI * 2 / n; let path = '';
    for (let j = 0; j <= 6; j++) { const u = Math.max(0, ph - j * 0.035), rr = r * Math.pow(1 - u, 1.3), a = a0 + dir * u * 2.6; path += (j ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr * ry); }
    s += `<path d="${path}" stroke="#fff" stroke-width="${f1(3 + 6 * (1 - ph))}" fill="none" stroke-linecap="round" opacity="${f1(k * (0.35 + 0.65 * Math.min(1, ph * 3)))}"/>`;
  }
  s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 0.35)}" ry="${f1(r * 0.35 * ry)}" fill="none" stroke="#fff" stroke-width="6" opacity="${f1(k * 0.7)}"/>`;
  return bloom(s, c, k) + glowDot(x, y, 46 * k + 10 * Math.sin(t * 20), c, 0.85 * k) + (d > dur ? flareBurst(t, t0 + dur, x, y, { r: o.burst || 170, c, dur: 0.35, rays: 8 }) : '');
}

// vật bị hút / bay: from → to theo đường Bézier cong (bend px lệch ngang), o.shrink = cỡ cuối (mặc định 0.12), o.ease 'in' (hút) | 'out' (ném), o.spin = độ xoay cả chặng
function fmPull(t, t0, dur, from, to, o = {}) {
  const d = t - t0; if (d < 0) return { on: false, gone: false, x: from[0], y: from[1], s: 1, rot: 0, k: 0 };
  const k = Math.min(1, d / dur), e = (o.ease === 'out') ? EZ.expoOut(k) : EZ.quadIn(k), L = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1, b = o.bend ?? 140;
  const cx = (from[0] + to[0]) / 2 - (to[1] - from[1]) / L * b, cy = (from[1] + to[1]) / 2 + (to[0] - from[0]) / L * b, u = 1 - e;
  return { on: true, gone: k >= 1 && o.shrink !== 1, k, x: u * u * from[0] + 2 * u * e * cx + e * e * to[0], y: u * u * from[1] + 2 * u * e * cy + e * e * to[1], s: lerp(1, o.shrink ?? 0.12, e), rot: (o.spin ?? 540) * e };
}
const fmFly = (t, t0, dur, from, to, o = {}) => fmPull(t, t0, dur, from, to, { ease: 'out', shrink: 1, spin: 0, bend: 60, ...o });

// sóng tiếng gọi tên: 3 cung vàng lan từ (x,y) theo hướng dir (1 = sang phải)
function fmNameCall(t, t0, x, y, dir = 1, o = {}) {
  let s = ''; const c = o.c || '#FFD36A';
  for (let i = 0; i < 4; i++) { const d = t - t0 - i * 0.11; if (d < 0 || d > 0.8) continue;
    const r = 70 + EZ.expoOut(Math.min(1, d / 0.8)) * (o.len || 760), op = 1 - d / 0.8, a = 34 * Math.PI / 180, sx = dir, ry = r * Math.sin(a);
    s += `<path d="M${f1(x + sx * r * Math.cos(a))} ${f1(y - ry)} A${f1(r)} ${f1(r)} 0 0 ${dir > 0 ? 1 : 0} ${f1(x + sx * r * Math.cos(a))} ${f1(y + ry)}" stroke="#fff" stroke-width="${f1(11 - i * 2)}" fill="none" stroke-linecap="round" opacity="${f1(op)}"/>`; }
  return s ? bloom(s, c, 1) : '';
}

// bùa chú: 3 dòng uốn lượn gạch-chấm chạy từ (x0,y0) tới (x1,y1) (đầu nhận), lặp cho tới t1
function fmChant(t, t0, t1, x0, y0, x1, y1, o = {}) {
  if (t < t0 || t > t1 + 0.4) return ''; const c = o.c || '#FFD36A', fade = t < t1 ? Math.min(1, (t - t0) / 0.2) : 1 - (t - t1) / 0.4; let s = '';
  const L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  for (let i = 0; i < 3; i++) { let p = ''; for (let j = 0; j <= 40; j++) { const u = j / 40, w = Math.sin(u * 14 - t * 9 + i * 2.1) * (26 - i * 6) * Math.sin(Math.PI * u) + (i - 1) * 34 * Math.sin(Math.PI * u);
      p += (j ? 'L' : 'M') + f1(lerp(x0, x1, u) + nx * w) + ' ' + f1(lerp(y0, y1, u) + ny * w); }
    s += `<path d="${p}" stroke="#fff" stroke-width="${6 - i}" fill="none" stroke-linecap="round" stroke-dasharray="${i ? '4 18' : '26 12 4 12'}" stroke-dashoffset="${f1(-t * 160 * (i % 2 ? -1 : 1))}" opacity="${f1(fade * (0.95 - i * 0.15))}"/>`; }
  return bloom(s, c, fade) + glowDot(x1, y1, 30 * fade, c, 0.7 * fade);
}

// vòng kim cô trên đầu (x,y = tâm đầu, r = nửa rộng đầu): vòng vàng co theo nhịp niệm, sóng vàng lan ra, vạch đau toé
function fmHeadRing(t, t0, t1, x, y, r, o = {}) {
  if (t < t0) return ''; const c = o.c || '#FFC93A', on = t < t1 ? 1 : Math.max(0, 1 - (t - t1) / 0.5), per = 0.55, ph = ((t - t0) % per) / per, sq = 1 - 0.16 * Math.sin(Math.PI * Math.min(1, ph * 1.5)) * on;
  const ry = r * 0.3, ring = (rr, w) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rr)}" ry="${f1(rr * 0.3)}" fill="none" stroke="#fff" stroke-width="${w}"/>`;
  let s = ring(r * 1.08 * sq, 13) + ring(r * 1.08 * sq - 9, 4);
  s = bloom(s, c, 1) + `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.08 * sq)}" ry="${f1(ry * 1.08 * sq)}" fill="none" stroke="#E0A818" stroke-width="9"/><ellipse cx="${f1(x)}" cy="${f1(y - 3)}" rx="${f1(r * 1.08 * sq)}" ry="${f1(ry * 1.08 * sq)}" fill="none" stroke="#FFE27A" stroke-width="4"/>`;
  if (on > 0) { for (let i = 0; i < 2; i++) { const u = ((t - t0) / per + i * 0.5) % 1, rr = r * (1.1 + u * 2.4);
      s += `<ellipse cx="${f1(x)}" cy="${f1(y + 40)}" rx="${f1(rr)}" ry="${f1(rr * 0.85)}" fill="none" stroke="${c}" stroke-width="${f1(8 * (1 - u) + 2)}" opacity="${f1((1 - u) * 0.65 * on)}"/>`; }
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + prand(i, 91) * 0.3, u = ((t - t0) * 3 + prand(i, 92)) % 1, r0 = r * (1.5 + u * 0.4), r1 = r0 + 38 * (1 - u);
      s += `<path d="M${f1(x + Math.cos(a) * r0)} ${f1(y + 60 + Math.sin(a) * r0 * 0.9)} L${f1(x + Math.cos(a) * r1)} ${f1(y + 60 + Math.sin(a) * r1 * 0.9)}" stroke="${i % 2 ? '#FF6A4A' : '#fff'}" stroke-width="7" stroke-linecap="round" opacity="${f1((1 - u) * on)}"/>`; } }
  return s;
}

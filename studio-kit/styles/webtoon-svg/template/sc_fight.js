// BỘ CẢNH ĐÁNH — chuẩn Lục Mạch (VISUAL_RULES mục 5, 2026-10-12). Dùng chung cho các cảnh đánh chính môn 5–16.
// văng sau khi trúng: k (0–1), e (đã nới), dx (0–1 quãng văng), dy (cung bay, âm = lên), fl (loé trắng)
function fKB(t, tHit, dur = 0.9) { const on = t > tHit, k = clamp((t - tHit) / dur), e = EZ.expoOut(k); return { on, k, e, dy: on ? -Math.sin(k * Math.PI) : 0, fl: on ? clamp(1 - (t - tHit) / 0.2) : 0 }; }
// khung mực (2 hình đen trên nền kem) trong [tHit, tHit+d]
const fInk = (T, tHit, svg, d = 0.12) => T > tHit && T < tHit + d ? `<rect width="1920" height="1080" fill="#F2EAD6"/>` + inkify(svg) : null;
// hậu ảnh trong khoảng [t0, t1]: draw(tt) vẽ nhân vật ở thời điểm tt
const fTrail = (draw, t, t0, t1, c, n = 5, gap = 0.035) => t > t0 && t < t1 ? afterimages(draw, t, n, gap, c) : '';
// lớp cuối: chớp đảo màu + loé + viền tối
const fPost = (T, hits, dim, c = '#E8F4FF') => hits.map(h => impactFrame(T, h, 0.05) + flash(T, h + 0.02, 0.15, c, 0.45)).join('') + cineFrame(0.5 + 0.3 * dim);
// vệt vuốt: 3 vệt cong song song (móng vuốt) vạch qua điểm (x, y) theo góc ang
function fClaw(t, t0, x, y, ang, o = {}) {
  const d = t - t0, dur = o.dur || 0.14, fade = o.fade || 0.35; if (d < 0 || d > dur + fade) return '';
  const k = EZ.expoOut(Math.min(1, d / dur)), op = d < dur ? 1 : 1 - (d - dur) / fade, L = o.L || 360, c = o.c || '#B36BFF';
  let s = '';
  for (let i = -1; i <= 1; i++) { const off = i * 38, x0 = -L / 2, x1 = lerp(-L / 2, L / 2, k);
    const p = `M${f1(x0)} ${f1(off - 30)} Q0 ${f1(off + 40)} ${f1(x1)} ${f1(off - 30 + (x1 - x0) * 0.05)}`;
    s += bloom(`<path d="${p}" stroke="${c}" stroke-width="${f1(22 - Math.abs(i) * 6)}" fill="none" stroke-linecap="round"/>`, c, 1) + `<path d="${p}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})" opacity="${f1(op)}" ${GL.add}>${s}</g>`;
}
// vòng gợn (khiên khí) tại (x, y), nảy lên lúc t0
function fRipple(t, t0, x, y, o = {}) {
  const d = t - t0, dur = o.dur || 0.55; if (d < 0 || d > dur) return ''; const k = d / dur, c = o.c || '#9FD07A', R = o.r || 160;
  return `<g ${GL.add} opacity="${f1(1 - k)}">` + [0, 1, 2].map(i => { const kk = clamp(k * 1.4 - i * 0.18); return kk <= 0 ? '' : bloom(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R * (0.4 + kk))}" ry="${f1(R * (0.55 + kk * 1.2))}" fill="none" stroke="#fff" stroke-width="${f1(10 * (1 - kk) + 2)}"/>`, c, 1); }).join('') + `</g>`;
}
// dấu chữ tượng thanh bật ra (VÚT!, KENG!…)
const fSfx = (t, t0, txt, x, y, o = {}) => t < t0 || t > t0 + (o.dur || 0.7) ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot ?? -8}) scale(${f1(EZ.backOut(clamp((t - t0) / 0.15)))})">${kText(txt, 0, 0, o.size || 64, { c: o.c || K_RED, stroke: '#FFF8E6', sw: 10, op: clamp((t0 + (o.dur || 0.7) - t) / 0.2) })}</g>`;

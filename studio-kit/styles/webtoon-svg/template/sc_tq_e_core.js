// ===== KHUÔN CHUNG CỦA TẬP: bảng xếp hạng sơn mài (làm lại 12/11), cảnh chấm (thẻ + bảng cùng khung, huy hiệu bay vào hàng ngay lúc đọc hạng), thẻ giới thiệu.
const TQ_TC = { L: '#D9A21E', S: '#C0392B', A: '#D9822B', B: '#C9A227', C: '#5E9A4F', D: '#4A77A8' };
function tqPanelBg(t, tint = '#2A1810') {
  const id = 'pb' + (TQ_ID++); let s = `<defs><radialGradient id="${id}" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stop-color="${tqMix(tint, '#ffffff', 0.12)}"/><stop offset="0.6" stop-color="${tint}"/><stop offset="1" stop-color="${tqMix(tint, '#000000', 0.6)}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  for (let i = 0; i < 9; i++) { const y = 60 + i * 120 + Math.sin(i * 2.1) * 30; s += `<path d="M-40 ${y} Q480 ${y - 40 + 20 * Math.sin(t * 0.3 + i)} 960 ${y} T1960 ${y}" stroke="#E2C25A" stroke-width="2" fill="none" opacity="0.07"/>`; }
  for (const [x, y, k] of [[150, 150, 1], [1770, 150, -1], [150, 930, 1], [1770, 930, -1]]) s += `<path transform="translate(${x} ${y}) scale(${k} ${y > 500 ? -1 : 1})" d="M-90 -40 Q-90 -90 -40 -90 M-90 -10 Q-90 -110 10 -110 M-70 -90 q20 20 0 40 q-20 -20 0 -40Z" stroke="#E2C25A" stroke-width="5" fill="none" opacity="0.45" stroke-linecap="round"/>`;
  return s + `<rect x="34" y="28" width="1852" height="1024" rx="26" fill="none" stroke="#E2C25A" stroke-width="4" opacity="0.5"/><rect x="48" y="42" width="1824" height="996" rx="18" fill="none" stroke="#8A6A2A" stroke-width="2" opacity="0.6"/>`;
}
// bảng: o = {x, w, y0, rh, placed:[keys], drop:{keys:[…], t0}, lit:'S', top: 0..1 (hàng HẠNG LỮ BỐ mọc ra), lbT0: lúc huy hiệu Lữ Bố vào, title}
function tqBoard(t, o = {}) {
  const x = o.x ?? 240, w = o.w ?? 1440, top = o.top || 0, rh = o.rh ?? (top ? lerp(168, 146, top) : 168), y0 = (o.y0 ?? 150) + (top ? 150 * top : 0), cs = Math.min(150, (w - 190) / 6.2), r = Math.min(52, cs * 0.36, rh * 0.31); let s = '';
  if (o.title !== false) s += kText(o.title || (typeof TB_TITLE !== 'undefined' ? TB_TITLE : 'XẾP HẠNG CAO THỦ TAM QUỐC'), x + w / 2, (o.y0 ?? 150) - 36, o.ts || 54, { c: '#F3E3B8', stroke: '#14080A', sw: 8 });
  const rows = ['S', 'A', 'B', 'C', 'D'], drop = o.drop ? o.drop.keys : [], all = [...(o.placed || []), ...drop];
  const slot = (key) => { const tier = XH_P[key][2]; return XH_ORDER.filter(k => XH_P[k][2] === tier && all.includes(k)).sort((a, b) => XH_P[a][3] - XH_P[b][3]).indexOf(key); };
  const pos = (key) => { const ti = rows.indexOf(XH_P[key][2]); return [x + 190 + slot(key) * cs + r, y0 + ti * rh + rh * 0.42]; };
  const row = (L, y, h, gold) => { const c = TQ_TC[L], lit = o.lit === L ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    return `<rect x="${x}" y="${f1(y)}" width="140" height="${f1(h - 14)}" rx="14" fill="${c}" stroke="#14080A" stroke-width="6"/><rect x="${x + 8}" y="${f1(y + 8)}" width="124" height="${f1(h - 30)}" rx="9" fill="none" stroke="#FFF2C8" stroke-width="2" opacity="0.6"/>` + (gold ? kText('HẠNG', x + 70, y + h * 0.36, 30, { c: '#3A2408' }) + kText('LỮ BỐ', x + 70, y + h * 0.66, 34, { c: '#3A2408' }) : kText(L, x + 70, y + h * 0.68, Math.min(96, h * 0.6), { font: `'Bangers', ${FH}`, c: '#fff' }))
      + `<rect x="${x + 154}" y="${f1(y)}" width="${w - 154}" height="${f1(h - 14)}" rx="14" fill="${gold ? '#4A3408' : '#140C08'}" opacity="0.78"/><rect x="${x + 154}" y="${f1(y)}" width="${w - 154}" height="${f1(h - 14)}" rx="14" fill="none" stroke="${gold ? '#FFD25A' : '#8A6A2A'}" stroke-width="${gold ? 6 : 3}"/>` + (L === 'S' || gold ? `<rect x="${x + 154}" y="${f1(y)}" width="${w - 154}" height="${f1(h - 14)}" rx="14" fill="#FFD25A" opacity="${f1((gold ? 0.2 : 0.08) + 0.05 * Math.sin(t * 2.2) + lit * 0.25)}"/>` : lit ? `<rect x="${x + 154}" y="${f1(y)}" width="${w - 154}" height="${f1(h - 14)}" rx="14" fill="#fff" opacity="${f1(lit * 0.22)}"/>` : ''); };
  rows.forEach((L, ti) => { s += row(L, y0 + ti * rh, rh, 0); });
  const chip = (key, cx, cy, e = {}) => xhChip(key, cx, cy, r, e) + (e.noName ? '' : kText(XH_P[key][1], cx, cy + r + 24, Math.min(22, cs * 0.17), { c: '#F3E3B8' }));
  (o.placed || []).forEach(k => { const [cx, cy] = pos(k); s += chip(k, cx, cy); });
  drop.forEach((k, i) => { const t0 = o.drop.t0 + i * 0.3, [tx, ty] = pos(k), u = clamp((t - t0) / 0.5), fx = o.drop.from ? o.drop.from[0] : x + w / 2, fy = o.drop.from ? o.drop.from[1] : 560; if (t < t0) return;
    if (u < 1) { const e = EZ.quartOut(u); s += chip(k, lerp(fx, tx, e), lerp(fy, ty, e) - Math.sin(u * Math.PI) * 120, { sc: lerp(2.4, 1, e), noName: 1 }); }
    else { const S5 = XH_P[k][2] === 'S'; s += chip(k, tx, ty, { sc: 1 + 0.2 * Math.exp(-(t - t0 - 0.5) * 12) }) + shockRing(t, t0 + 0.5, tx, ty, { r: S5 ? 230 : 140, c: S5 ? '#FFD25A' : '#FFFFFF', dur: 0.5 }) + (S5 ? glowSparks(t, t0 + 0.5, tx, ty, { n: 16, c: '#FFD25A' }) : ''); } });
  if (top > 0) { const gy = (o.y0 ?? 150), gh = 150; s += `<g opacity="${f1(clamp(top * 1.4))}" transform="translate(0 ${f1((1 - EZ.backOut(clamp(top))) * -40)})">` + row('L', gy, gh, 1) + `</g>`;
    if (o.lbT0 != null && t >= o.lbT0) { const u = clamp((t - o.lbT0) / 0.6), e = EZ.quartOut(u), tx = x + 190 + 60, ty = gy + gh * 0.44, fx = o.lbFrom ? o.lbFrom[0] : x + w / 2, fy = o.lbFrom ? o.lbFrom[1] : 600;
      s += xhChip('lb', lerp(fx, tx, e), lerp(fy, ty, e) - Math.sin(u * Math.PI) * 60, 60, { sc: lerp(1.6, 1, e) + (u >= 1 ? 0.2 * Math.exp(-(t - o.lbT0 - 0.6) * 10) : 0) }) + (u >= 1 ? kText('Lữ Bố', tx + 150, ty + 14, 40, { c: '#FFE7A0' }) + shockRing(t, o.lbT0 + 0.6, tx, ty, { r: 320, c: '#FFD25A', dur: 0.7 }) + glowSparks(t, o.lbT0 + 0.6, tx, ty, { n: 26, c: '#FFD25A', speed: 900 }) : ''); } }
  return s;
}
// cảnh chấm: trái = nhân vật + 2 dòng kết quả; phải = bảng; đọc tới "hạng X" thì đóng dấu rồi huy hiệu bay vào hàng
function tqCham(t, ctx, key, lines, o = {}) {
  const group = XH_GROUP[key] || [key], tier = XH_P[key][2], tT = o.tT ?? ctx.at(o.tierWord || ('hạng ' + tier.toLowerCase())), placed = xhBefore(key).filter(k => k !== 'lb');
  let s = tqPanelBg(t, '#2A1810');
  s += tqBoard(t, { x: 930, w: 930, y0: 170, rh: 172, ts: 40, placed, drop: t >= tT + 0.2 ? { keys: group, t0: tT + 0.25, from: [470, 520] } : null, lit: t > tT ? tier : null });
  group.forEach((k, i) => { const cx = group.length > 1 ? 280 + i * 360 : 440, ex = t > tT ? (tier === 'D' ? 'shock' : tier === 'S' ? 'smile' : 'neutral') : 'neutral';
    s += `<g opacity="${f1(clamp(t / 0.3))}">` + thC(XH_P[k][0], { x: cx, ground: 700, scale: group.length > 1 ? 0.42 : 0.5, ex, flip: i === 1, shadow: false }, t) + kText(XH_P[k][1].toUpperCase(), cx, 124, group.length > 1 ? 46 : 60, { c: '#F3E3B8', stroke: '#14080A', sw: 8 }) + `</g>`; });
  lines.forEach(([tl, lab, txt, col], i) => { const u = clamp((t - tl) / 0.35); if (u <= 0) return; const y = 740 + i * 136, xx = 70;
    s += `<g opacity="${f1(u)}" transform="translate(${f1((1 - EZ.expoOut(u)) * -60)} 0)"><rect x="${xx}" y="${y}" width="800" height="118" rx="16" fill="#FFFBF0" stroke="#14080A" stroke-width="5"/><rect x="${xx}" y="${y}" width="190" height="118" rx="16" fill="${col}" stroke="#14080A" stroke-width="5"/>` + kText(lab, xx + 95, y + 74, lab.length > 6 ? 30 : 40, { c: '#fff' });
    const L2 = tpWrapX(txt, 34, 580); L2.forEach((ln, j) => { s += kText(ln, xx + 212, y + 70 + (j - (L2.length - 1) / 2) * 40, L2.length > 1 ? 31 : 36, { anchor: 'start' }); }); s += `</g>`; });
  if (t >= tT) { const d = t - tT, kk = d < 0.16 ? 1 + (1 - d / 0.16) * 1.5 : 1 + 0.1 * Math.exp(-(d - 0.16) * 8) * Math.sin((d - 0.16) * 30), op = clamp(1 - (d - 0.5) / 0.3);
    if (op > 0) s += `<g opacity="${f1(op)}" transform="translate(470 440) rotate(-8) scale(${f1(kk)})"><rect x="-200" y="-86" width="400" height="172" rx="22" fill="${TQ_TC[tier]}" stroke="#14080A" stroke-width="9"/>` + kText('HẠNG ' + tier, 0, 40, 108, { font: `'Bangers', ${FH}`, c: '#fff' }) + `</g>`; }
  return thFin(s + cineFrame(0.3));
}
const C_WIN = '#2E7A4E', C_DRAW = '#2E5F8A', C_LOSE = '#8A3A3A', C_ETC = '#6A5A7A';
// thẻ giới thiệu (một hoặc hai người nối nhau)
function tqIntro(t, ctx, keys, tags, o = {}) {
  if (typeof keys === 'string') return thFin(xhIntro(t, keys, { ex: o.ex || 'fierce', tag: tags }) + cineFrame(0.3));
  const t2 = o.t2 ?? ctx.dur / 2, i = t < t2 ? 0 : 1; return thFin(xhIntro(i ? t - t2 : t, keys[i], { ex: (o.ex || [])[i] || 'fierce', tag: tags[i] }) + cineFrame(0.3));
}
// co giãn thời gian theo mốc: map [[tThật, tGốc]…]
const tqWarp = (T, K) => { if (T <= K[0][0]) return K[0][1] + (T - K[0][0]); for (let i = 1; i < K.length; i++) if (T <= K[i][0]) return lerp(K[i - 1][1], K[i][1], (T - K[i - 1][0]) / Math.max(0.001, K[i][0] - K[i - 1][0])); return K[K.length - 1][1] + (T - K[K.length - 1][0]); };
// bóng lời có đuôi chỉ vào miệng — dùng S.say; chữ tiếng động — S.sfx
// vật nhỏ dùng chung
const xqCup = (x, y, k, t, steam = 1) => { let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})"><path d="M-40 -60 Q-44 0 -20 8 H20 Q44 0 40 -60Z" fill="#E8E0D0" stroke="#2A1420" stroke-width="5"/><ellipse cx="0" cy="-60" rx="40" ry="11" fill="#B8742A" stroke="#2A1420" stroke-width="5"/><path d="M-22 8 h44 v10 h-44Z" fill="#C8BCA8" stroke="#2A1420" stroke-width="4"/>`;
  if (steam > 0) for (let i = 0; i < 3; i++) { const u = ((t * 0.5 + i / 3) % 1), sx = (i - 1) * 22 + Math.sin(t * 2 + i * 2 + u * 5) * 12; s += `<path d="M${f1(sx)} ${f1(-76 - u * 120)} q14 -22 0 -44 q-14 -22 0 -44" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f1(0.7 * steam * (1 - u))}"/>`; } return s + `</g>`; };
const xqTable = (x, y, w = 260) => `<path d="M${x - w / 2} ${y} h${w} v18 h${-w}Z" fill="#7A4A2A" stroke="#2A1420" stroke-width="5"/><path d="M${x - w / 2 + 20} ${y + 18} v80 M${x + w / 2 - 20} ${y + 18} v80" stroke="#2A1420" stroke-width="16"/><path d="M${x - w / 2 + 20} ${y + 18} v80 M${x + w / 2 - 20} ${y + 18} v80" stroke="#7A4A2A" stroke-width="8"/>`;
// mũi tên bay từ a tới b theo u, có vệt
function xqArrow(a, b, u, o = {}) { if (u <= 0 || u > 1.001) return ''; const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * (o.arc ?? 40), ang = Math.atan2(b[1] - a[1] - Math.cos(u * Math.PI) * Math.PI * (o.arc ?? 40), b[0] - a[0]) * 180 / Math.PI;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><path d="M-260 0 H-60" stroke="#FFF6D8" stroke-width="10" opacity="0.5" stroke-linecap="round"/><path d="M-70 0 H10" stroke="#5A3A20" stroke-width="7" stroke-linecap="round"/><path d="M10 -9 L34 0 L10 9Z" fill="#DDE4EA" stroke="#2A1420" stroke-width="3"/><path d="M-70 0 l-14 -10 M-70 0 l-14 10 M-60 0 l-14 -10 M-60 0 l-14 10" stroke="#C0392B" stroke-width="4"/></g>`; }
// vòng sóng âm của tiếng quát
function xqShout(t, t0, x, y, dir = 1, o = {}) { let s = ''; for (let i = 0; i < (o.n || 4); i++) { const d = t - t0 - i * 0.12; if (d < 0 || d > 1.1) continue; const r = 80 + d * (o.sp || 900); s += `<path d="M${f1(x + dir * r * 0.5)} ${f1(y - r * 0.55)} Q${f1(x + dir * r)} ${f1(y)} ${f1(x + dir * r * 0.5)} ${f1(y + r * 0.55)}" stroke="${o.c || '#FFF2C8'}" stroke-width="${f1(16 * (1 - d / 1.1) + 3)}" fill="none" opacity="${f1(0.85 * (1 - d / 1.1))}" stroke-linecap="round"/>`; } return s; }

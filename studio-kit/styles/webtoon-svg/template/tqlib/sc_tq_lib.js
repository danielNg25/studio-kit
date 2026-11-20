// ===== THƯ VIỆN CẢNH CHUNG tập gia-cat-luong (C5, 2026-10-18) — dùng cho sc_c0..sc_c7
// Nạp SAU sc_c4.js (dùng c4ease/c4Man/c4Arrow…), TRƯỚC sc_c0.js. t = giây cục bộ của shot; ctx.at(...) = mốc lời (cục bộ).
// ---- điểm trên mặt nhân vật → toạ độ màn hình (đuôi bóng thoại về MIỆNG, tia mắt, mồ hôi, nước mắt…)
function tqFacePt(st, hx, hy, T = 0) {
  const sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1, LH = st.legs ? chLegHeight(st.legs, T) : 0;
  const gy = (st.ground ?? 1090) + (st.y || 0) - LH * CH_BS * sc;
  const wx = (CH_HEAD[0] + hx) * fl * sc * (2 - sq), wy = (CH_HEAD[1] + CH_HEAD[2] + hy) * sc * sq, a = (st.lean || 0) * fl * Math.PI / 180;
  return [st.x + wx * Math.cos(a) - wy * Math.sin(a), gy + wx * Math.sin(a) + wy * Math.cos(a)];
}
const tqMouth = (st, T) => tqFacePt(st, 13, 96, T);
const tqEyes = (st, T) => [tqFacePt(st, -38, 18, T), tqFacePt(st, 64, 18, T)];
// mốc lời của câu thứ i trong shot: {t0, dur} (giây cục bộ)
const tqLine = (ctx, i = 0) => ({ t0: ctx.at({ line: i, word: '' }), dur: (ctx.lines[i] || {}).dur || 2 });
// miệng mấp máy lặng (khi chưa có tiếng): trả talk 0..1 trong [t0,t1)
const tqTalkAt = (t, t0, t1) => (t >= t0 && t < t1) ? Math.max(0.14, Math.abs(Math.sin(t * 12.5)) * (0.65 + 0.35 * Math.sin(t * 4.3))) : 0;
// máy quay trôi chậm: z0→z1 theo tiến độ shot, tâm (cx0,cy0)→(cx1,cy1)
function tqCamP(body, t, D, o = {}) {
  const u = c4ease(clamp(t / Math.max(0.1, D))), z = lerp(o.z0 ?? 1, o.z1 ?? 1.06, u), cx = lerp(o.cx0 ?? 960, o.cx1 ?? o.cx0 ?? 960, u), cy = lerp(o.cy0 ?? 540, o.cy1 ?? o.cy0 ?? 540, u);
  return kCam(body, t, z, cx, cy, o.sh || [0, 0]);
}
// ---- chữ & thẻ
function tqWrap(text, maxc) { const ws = String(text).split(' '), ls = []; let cur = ''; for (const w of ws) { if (cur && (cur + ' ' + w).length > maxc) { ls.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; } if (cur) ls.push(cur); return ls; }
const tqTxt = (s, x, y, fs, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" font-family="${FH}" font-size="${fs}" fill="${o.c || INK2}" text-anchor="${o.anchor || 'middle'}"${o.op != null ? ` opacity="${f1(o.op)}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${f1(x)} ${f1(y)})"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 8}" paint-order="stroke" stroke-linejoin="round"` : ''}${o.bold ? ' font-weight="700"' : ''}>${s}</text>`;
// bóng thoại nhiều dòng; đuôi trỏ vào MIỆNG người nói (o.to=[x,y]); chữ hiện dần theo lời (o.dur giây kể từ t0)
function tqBub(x, y, text, t, t0, o = {}) {
  if (t < t0) return '';
  const fs = o.fs || 44, ls = tqWrap(text, o.maxc || 26), lh = fs * 1.22, n = ls.length, w = o.w || Math.max(...ls.map(l => l.length)) * fs * 0.5 + 84, h = n * lh + 44;
  const k = kPop(t, t0, 0.22), rv = o.dur ? clamp((t - t0) / o.dur) : 1; let left = Math.ceil(text.length * rv);
  let body = '';
  ls.forEach((l, i) => { const shown = l.slice(0, Math.max(0, left)), rest = l.slice(Math.max(0, left)); left -= l.length + 1; const y0 = -h / 2 + 22 + lh * i + fs * 0.82; body += `<text x="0" y="${f1(y0)}" font-family="${FH}" font-size="${fs}" fill="${o.c || INK2}" text-anchor="middle">${shown}<tspan fill-opacity="0">${rest}</tspan></text>`; });
  const tail = o.to ? kTailTo(x, y, w, h, o.to) : '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${o.rx ?? 30}" fill="${o.bg || '#FFFBF0'}" stroke="${INK2}" stroke-width="5.5"/>${tail}${body}</g>`;
}
// thẻ giấy dán (x,y = tâm); o.rot độ, o.c màu giấy
function tqPaper(x, y, w, h, o = {}) {
  const c = o.c || '#F6EBCB';
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || 0})"><rect x="${f1(-w / 2 + 8)}" y="${f1(-h / 2 + 10)}" width="${f1(w)}" height="${f1(h)}" rx="${o.rx ?? 14}" fill="#20140A" opacity="0.2"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${o.rx ?? 14}" fill="${c}" stroke="${INK2}" stroke-width="${o.sw || 5}"/>${o.inner === false ? '' : `<rect x="${f1(-w / 2 + 12)}" y="${f1(-h / 2 + 12)}" width="${f1(w - 24)}" height="${f1(h - 24)}" rx="8" fill="none" stroke="${o.line || '#B8902A'}" stroke-width="2.5" opacity="0.8"/>`}${o.body || ''}</g>`;
}
// viên chữ nhỏ (nhãn): x,y = tâm
function tqChip(text, x, y, o = {}) {
  const fs = o.fs || 34, w = text.length * fs * 0.52 + 44, h = fs + 24;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || 0})"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${h / 2}" fill="${o.bg || '#FFFBF0'}" stroke="${INK2}" stroke-width="4.5"/>${tqTxt(text, 0, fs * 0.35, fs, { c: o.c || INK2 })}</g>`;
}
// dấu đỏ đóng xuống (pop + rung): kind 'rect' | 'round'
function tqStamp(text, x, y, t, t0, o = {}) {
  if (t < t0) return '';
  const d = t - t0, k = d < 0.14 ? 1 + (1 - d / 0.14) * 1.6 : 1 + Math.max(0, 0.12 * Math.exp(-(d - 0.14) * 9) * Math.sin((d - 0.14) * 40)), op = Math.min(1, d / 0.08), fs = o.fs || 64, c = o.c || '#B8322A', rot = o.rot ?? -8;
  const w = o.w || text.length * fs * 0.56 + 56, h = o.h || fs + 40;
  const shape = o.kind === 'round' ? `<circle r="${f1(h / 2 + 8)}" fill="none" stroke="${c}" stroke-width="9"/><circle r="${f1(h / 2 - 6)}" fill="none" stroke="${c}" stroke-width="3.5"/>` : `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="12" fill="none" stroke="${c}" stroke-width="9"/><rect x="${f1(-w / 2 + 10)}" y="${f1(-h / 2 + 10)}" width="${f1(w - 20)}" height="${f1(h - 20)}" rx="6" fill="none" stroke="${c}" stroke-width="3"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${f1(k)})" opacity="${f1(op * (o.op ?? 0.92))}">${shape}${tqTxt(text, 0, fs * 0.35, fs, { c, bold: true })}</g>`;
}
// bụi/khói bốc nhỏ khi đóng dấu / đặt xuống
const tqThud = (t, t0, x, y, o = {}) => fxDust(t, t0, x, y, o.dir || 1);
// chữ tượng thanh kiểu truyện tranh (vầng gai + chữ), pop một lần: ỘC! · RẦM! · ...
function tqSfx(text, x, y, t, t0, o = {}) {
  if (t < t0) return '';
  const d = t - t0, k = d < 0.18 ? EZ.backOut(d / 0.18) : 1 + 0.03 * Math.sin((d - 0.18) * 20) * Math.exp(-(d - 0.18) * 5), fs = o.fs || 70, r = o.r || fs * 1.05, c = o.c || '#C0392B', rot = o.rot ?? -10;
  const op = o.life ? clamp((o.life - d) / 0.4) : 1; let burst = '';
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r1 = r * (i % 2 ? 0.78 : 1.12); burst += `${i ? 'L' : 'M'}${f1(Math.cos(a) * r1 * 1.25)} ${f1(Math.sin(a) * r1 * 0.85)}`; }
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${f1(k)})" opacity="${f1(op)}"><path d="${burst}Z" fill="${o.bg || '#FFE27A'}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>${tqTxt(text, 0, fs * 0.34, fs, { c, bold: true, stroke: '#FFF8E6', sw: 8 })}</g>`;
}
// giọt nước mắt rơi MỘT lần từ khoé mắt (u: 0..1 tiến độ rơi)
function tqTear(st, T, t, t0, dur = 1.2, o = {}) {
  const u = (t - t0) / dur; if (u < 0 || u > 1) return '';
  const [e0, e1] = tqEyes(st, T), e = o.eye === 0 ? e0 : e1, sc = st.scale || 1, y = e[1] + 20 * sc + u * 150 * sc;
  return `<path d="M${f1(e[0])} ${f1(y)} q${f1(-9 * sc)} ${f1(16 * sc)} 0 ${f1(26 * sc)} q${f1(9 * sc)} ${f1(-10 * sc)} 0 ${f1(-26 * sc)}Z" fill="#8ACBE8" stroke="${INK2}" stroke-width="2.4" opacity="${f1(1 - u * u)}"/>`;
}
// khung chân dung (bán thân nhân vật cắt trong khung giấy): x,y = tâm khung, w×h; sc = tỉ lệ nhân vật; dy = đẩy nhân vật lên/xuống
let TQ_CP = 0;
function tqBust(id, x, y, w, h, t, o = {}) {
  const cid = 'tqbp' + (TQ_CP++), sc = o.sc || 0.62, st = Object.assign({ x: x + (o.dx || 0), ground: y + h / 2 + (o.dy ?? 40), scale: sc, ex: o.ex || 'neutral', arm: null, back: null }, o.st || {});
  return `<g ${o.grey ? 'filter="url(#rgGrey)"' : ''}><clipPath id="${cid}"><rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="10"/></clipPath><rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="${o.bg || '#DDE8E6'}"/><g clip-path="url(#${cid})">${o.back || ''}${chChar(id, st, t)}</g></g><rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="none" stroke="${INK2}" stroke-width="6"/><rect x="${f1(x - w / 2 + 9)}" y="${f1(y - h / 2 + 9)}" width="${f1(w - 18)}" height="${f1(h - 18)}" rx="6" fill="none" stroke="${o.line || '#C9A227'}" stroke-width="3"/>`;
}
// đàn chim hải âu bay ngang MỘT lượt (t0..t0+dur), n con
function tqGulls(t, t0, dur, y0, y1, n = 3, dir = 1) {
  const u = (t - t0) / dur; if (u < 0 || u > 1) return ''; let s = '';
  for (let i = 0; i < n; i++) { const x = dir > 0 ? -80 + (u * 1.1 - i * 0.04) * 2080 : 2000 - (u * 1.1 - i * 0.04) * 2080, y = lerp(y0, y1, u) + i * 28 + Math.sin(t * 2 + i) * 10; s += tdGull(x, y, 1.1 - i * 0.12, t); }
  return s;
}
// sàn gỗ/bục nhỏ cho nhân vật đứng (x tâm, y mặt bục, w rộng)
const tqDais = (x, y, w, h = 70) => `<ellipse cx="${x}" cy="${y + h + 8}" rx="${w * 0.58}" ry="14" fill="#20140A" opacity="0.2"/><path d="M${x - w / 2} ${y} H${x + w / 2} V${y + h} H${x - w / 2}Z" fill="${TQ.wood}" stroke="${INK2}" stroke-width="5"/><path d="M${x - w / 2} ${y} H${x + w / 2} l-14 -16 H${x - w / 2 + 14}Z" fill="${TQ.wood3}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>${[1, 2, 3, 4, 5].map(i => `<path d="M${x - w / 2 + w * i / 6} ${y} V${y + h}" stroke="${TQ.wood2}" stroke-width="3"/>`).join('')}`;
// quạt lông vũ (prop rời): (x,y) = chuôi, rot độ (0 = chĩa lên), s tỉ lệ
function tqFan(x, y, rot = 0, s = 1) {
  let f = '';
  for (const a of [-44, 44, -22, 22, 0]) f += `<g transform="rotate(${a} 0 0)">` + chT('M0 -10 Q-34 -86 -10 -190 Q0 -204 10 -190 Q34 -86 0 -10Z', '#F6F3EA', '#D2CCBC', { sx: 5, sy: 3, lw: 3.6 }) + chL('M0 -30 L0 -176', 2, '#B8B2A0', 0.8) + '</g>';
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">${f}${chT('M-8 -14 h16 v70 h-16Z', '#B07E4A', '#8A5A2A', { lw: 3.4 })}${chT('M-14 34 h28 v12 h-28Z', '#C0392B', '#8E2418', { lw: 3 })}</g>`;
}
// sao lấp lánh bốn cánh (một lần chớp)
function tqTwinkle(t, t0, x, y, r = 30, c = '#FFE27A') {
  const d = t - t0; if (d < 0 || d > 0.7) return ''; const k = Math.sin(d / 0.7 * Math.PI), R = r * k;
  return `<path d="M${f1(x)} ${f1(y - R)} Q${f1(x)} ${f1(y)} ${f1(x + R)} ${f1(y)} Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y + R)} Q${f1(x)} ${f1(y)} ${f1(x - R)} ${f1(y)} Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y - R)}Z" fill="${c}" stroke="${INK2}" stroke-width="2.5" stroke-linejoin="round"/>`;
}
// mây mưa nhỏ trên đầu (buồn): (x,y) tâm mây; k 0..1 độ hiện
function tqRainCloud(t, x, y, k = 1, s = 1) {
  if (k <= 0) return ''; let r = '';
  for (let i = 0; i < 7; i++) { const u = (t * 1.3 + i / 7) % 1; r += `<path d="M${f1(x - 90 * s + i * 30 * s)} ${f1(y + 40 * s + u * 150 * s)} l-5 20" stroke="#6C9CC8" stroke-width="${f1(4 * s)}" stroke-linecap="round" opacity="${f1((1 - u) * 0.9 * k)}"/>`; }
  return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - k) * -20)})"><g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-110 20 Q-140 -12 -100 -24 Q-96 -64 -50 -54 Q-24 -92 22 -66 Q60 -84 92 -44 Q136 -44 134 0 Q134 22 108 22Z" fill="#8A93A8" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/></g>${r}</g>`;
}

// ---- viết tắt dựng nhân vật: tqC(id, x, ground, scale, ex, t, thêm)
const tqC = (id, x, g, sc, ex, t, o = {}) => chChar(id, Object.assign({ x, ground: g, scale: sc, ex, arm: null, back: null }, o), t);
// thợ làm tên (Ngô): áo nâu, khăn buộc trán, không giáp
CHAR.tq_tho = Object.assign({}, CHAR.tq_bt, { name: 'Thợ', robe: '#8A7A4A', robeS: '#665A32', trim: '#C8B890', sash: '#4A3A22', inner: '#E0D4B4', helmet: null, armor: null, armorGem: null, headband: '#E8DCC0', jaw: undefined });
// bóng thoại một khối, nhiều đuôi chỉ vào nhiều miệng (đồng thanh hô)
function tqBubMulti(x, y, text, t, t0, tos, o = {}) {
  if (t < t0) return '';
  const fs = o.fs || 44, ls = tqWrap(text, o.maxc || 26), lh = fs * 1.22, n = ls.length, w = o.w || Math.max(...ls.map(l => l.length)) * fs * 0.5 + 84, h = n * lh + 44, k = kPop(t, t0, 0.22);
  let body = ''; ls.forEach((l, i) => { body += tqTxt(l, 0, -h / 2 + 22 + lh * i + fs * 0.82, fs, { bold: !!o.bold }); });
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})">${tos.map(to => kTailTo(x, y, w, h, to)).join('')}<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="30" fill="${o.bg || '#FFFBF0'}" stroke="${INK2}" stroke-width="5.5"/>${body}</g>`;
}
// mũ tướng (rơi xuống bàn)
const tqHelmet = (x, y, s = 1, rot = 0, c = '#34487A') => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-70 0 Q-72 -80 0 -92 Q72 -80 70 0Z" fill="${c}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-84 0 H84 L72 16 H-72Z" fill="${dk(c, 0.25)}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -92 q-6 -34 8 -58 q18 22 -8 58Z" fill="#C0392B" stroke="${INK2}" stroke-width="4"/><circle cx="0" cy="-48" r="9" fill="#E2C25A" stroke="${INK2}" stroke-width="3"/></g>`;
// cung + mũi tên (biểu tượng)
const tqBow = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-30 -110 Q80 0 -30 110" stroke="${INK2}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-30 -110 Q80 0 -30 110" stroke="#9A6A3A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-30 -110 L-30 110" stroke="${INK2}" stroke-width="3"/><path d="M-30 0 H120" stroke="${INK2}" stroke-width="7" stroke-linecap="round"/><path d="M-30 0 H120" stroke="#F2E4BC" stroke-width="3.5"/><path d="M120 0 l-18 -10 v20Z" fill="#B0B8C4" stroke="${INK2}" stroke-width="3"/><path d="M-26 0 l-14 -9 M-26 0 l-14 9 M-14 0 l-12 -8 M-14 0 l-12 8" stroke="${TQ.shu}" stroke-width="3.5"/></g>`;
// bó tên (biểu tượng đếm): n mũi
const tqBundle = (x, y, s = 1, n = 9) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${Array.from({ length: n }, (_, i) => { const a = (i / (n - 1) - 0.5) * 26; return `<g transform="rotate(${f1(a)} 0 40)"><path d="M0 40 V-60" stroke="${INK2}" stroke-width="7" stroke-linecap="round"/><path d="M0 40 V-60" stroke="#F2E4BC" stroke-width="3.5"/><path d="M0 -64 l-8 14 h16Z" fill="#B0B8C4" stroke="${INK2}" stroke-width="2.5"/></g>`; }).join('')}<path d="M-22 22 H22" stroke="${TQ.shu}" stroke-width="10" stroke-linecap="round"/></g>`;
// thuyền có người (hai tấm: back vẽ trước nhân vật, front vẽ sau): cỏ dọc hai bên mạn, vải xanh. Trả {back, front, X(lx), Y(ly), bob}
function tqBoatP(x, g, s, T, o = {}) {
  const bob = Math.sin(T * 1.6 + x * 0.011) * 3 * (o.calm ? 0.4 : 1), fl = o.xs ?? (o.flip ? -1 : 1), tl = (o.tilt || 0) + Math.sin(T * 1.3 + x * 0.02) * 0.8;
  const bundle = (bx, by, i) => `<rect x="${bx - 25}" y="${by - 48}" width="50" height="48" rx="8" fill="${i % 2 ? TQ.straw : TQ.straw2}" stroke="${INK2}" stroke-width="3.5"/><path d="M${bx - 14} ${by - 40} v30 M${bx} ${by - 42} v34 M${bx + 14} ${by - 40} v30" stroke="${dk(TQ.straw2, 0.3)}" stroke-width="3"/><path d="M${bx - 25} ${by - 24} H${bx + 25}" stroke="#6B4428" stroke-width="4"/>`;
  let back = `<path d="M-190 -40 Q-170 8 -110 10 H110 Q170 8 190 -40 Q192 -58 184 -70 H-184 Q-192 -58 -190 -40Z" fill="${TQ.wood2}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) back += bundle(-130 + i * 52, -72, i);
  let front = '';
  for (let i = 0; i < 7; i++) front += bundle(-150 + i * 50, 4 - (i % 2) * 4, i + 1);
  front += `<path d="M-186 -34 Q0 -8 186 -34 L176 -4 Q0 22 -176 -4Z" fill="${TQ.cloth}" stroke="${INK2}" stroke-width="4" opacity="0.95"/><path d="M-200 14 q50 -16 100 0 t100 0 t100 0 t100 0" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  if (o.arrows) for (let i = 0; i < o.arrows; i++) { const ax = -150 + hrnd(i, 8) * 300, ay = -20 - hrnd(i, 9) * 40, a = -52 + hrnd(i, 10) * 20; front += `<g transform="translate(${R1(ax)} ${R1(ay)}) rotate(${R1(a)})"><path d="M0 0 H-78" stroke="${INK2}" stroke-width="5"/><path d="M0 0 H-78" stroke="#E8D8B0" stroke-width="2.4"/><path d="M-78 0 l-14 -7 M-78 0 l-14 7 M-66 0 l-12 -6 M-66 0 l-12 6" stroke="${TQ.shu}" stroke-width="3"/></g>`; }
  const tf = `translate(${R1(x)} ${R1(g + bob)}) rotate(${R1(tl)}) scale(${fl * s} ${s})`;
  return { back: `<g transform="${tf}">${back}</g>`, front: `<g transform="${tf}">${front}</g>`, bob, X: (lx) => x + lx * s * fl, Y: (ly) => g + bob + ly * s };
}
// bàn án gỗ nhìn chính diện: (x, y) = giữa mép trước mặt bàn, w rộng; chân dài h
function tqTable(x, y, w = 520, h = 150, c = TQ.wood) {
  return `<ellipse cx="${x}" cy="${y + h + 8}" rx="${w * 0.6}" ry="16" fill="#20140A" opacity="0.22"/>` +
    [-1, 1].map(sd => `<rect x="${x + sd * (w / 2 - 36) - 15}" y="${y + 20}" width="30" height="${h}" fill="${dk(c, 0.25)}" stroke="${INK2}" stroke-width="5"/>`).join('') +
    `<path d="M${x - w / 2 + 30} ${y - 44} H${x + w / 2 - 30} L${x + w / 2 + 10} ${y} H${x - w / 2 - 10}Z" fill="${lt_(c, 0.18)}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M${x - w / 2 - 10} ${y} H${x + w / 2 + 10} V${y + 34} H${x - w / 2 - 10}Z" fill="${c}" stroke="${INK2}" stroke-width="5"/>`;
}
// tờ quân lệnh trạng đặt trên bàn (x,y tâm, nghiêng nhẹ); stamp: đã đóng dấu đỏ
const tqScroll = (x, y, w = 300, o = {}) => tqPaper(x, y, w, w * 0.4, { rot: o.rot ?? -3, c: '#F4E8C6', sw: 4, line: '#B8902A', body: tqTxt(o.text || 'QUÂN LỆNH TRẠNG', 0, w * 0.04, w * 0.1, { c: '#6A2622', bold: true }) + (o.stamp ? `<g transform="translate(${w * 0.3} ${w * 0.1})">${o.stamp}</g>` : '') });
// vệt "lạnh" run người: các vạch xanh dọc hai bên đầu
function tqChill(x, y, t, s = 1) { let r = ''; for (let i = 0; i < 6; i++) { const sd = i < 3 ? -1 : 1, k = i % 3, hx = x + sd * (110 + k * 22) * s, hy = y + k * 36 * s, w = Math.sin(t * 30 + i * 2) * 4; r += `<path d="M${f1(hx + w)} ${f1(hy)} v${f1(40 * s)}" stroke="#7FA8D6" stroke-width="${f1(5 * s)}" stroke-linecap="round"/>`; } return r; }
// bẫy kẹp (hàm sắt): k 0 = mở, 1 = sập
function tqTrap(x, y, k = 0, s = 1) {
  const a = lerp(62, 0, k), tooth = (sd) => Array.from({ length: 7 }, (_, i) => `<path d="M${-96 + i * 32} 0 l16 -${f1(28 * (1 - k * 0.2))} l16 ${f1(28 * (1 - k * 0.2))}Z" fill="#DADFE6" stroke="${INK2}" stroke-width="3" stroke-linejoin="round"/>`).join('');
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="10" rx="140" ry="22" fill="#20140A" opacity="0.25"/><path d="M-120 0 Q-120 -14 -100 -14 H100 Q120 -14 120 0 V12 H-120Z" fill="#6A6A74" stroke="${INK2}" stroke-width="5"/><g transform="rotate(${f1(-a * 0.5)} -110 -4)"><path d="M-110 -6 Q-110 ${f1(-80 - a)} 0 ${f1(-84 - a)} Q110 ${f1(-80 - a)} 110 -6" fill="none" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/><path d="M-110 -6 Q-110 ${f1(-80 - a)} 0 ${f1(-84 - a)} Q110 ${f1(-80 - a)} 110 -6" fill="none" stroke="#9AA0AC" stroke-width="6" stroke-linecap="round"/></g>${tooth(1)}</g>`;
}
// khung "đối mặt qua bàn" — GÀI–TRẢ (c1_cam ↔ c5_lenh): giữ NGUYÊN toạ độ.  L, R = {id, ex, st}
function c1CamFrame(t, ctx, o) {
  ANIM_T = t;
  let s = bg_truong_du(t);
  const L = Object.assign({ x: 500, ground: 1060, scale: 0.82 }, o.L.st || {}), R = Object.assign({ x: 1420, ground: 1060, scale: 0.82, flip: true }, o.R.st || {});
  const lx = Object.assign({ ex: o.L.ex, arm: null, back: null, lean: 2 }, L), rx = Object.assign({ ex: o.R.ex, arm: null, back: null, lean: 2 }, R);
  s += chChar(o.L.id, lx, t) + chChar(o.R.id, rx, t);
  s += tqTable(960, 940, 640, 130) + tqScroll(960, 900, 330, { text: o.paper || 'QUÂN LỆNH TRẠNG', stamp: o.stamp || '' });
  return { s, lx, rx };
}
// cửa sổ tròn nhìn ra ngoài (khung gỗ): view = hàm trả SVG vẽ trong cửa sổ, toạ độ màn hình
function tqRoundWin(x, y, r, view) {
  const id = 'tqwin' + (TQ_CP++);
  return `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><circle cx="${x}" cy="${y}" r="${r + 14}" fill="#7A4E2C" stroke="${INK2}" stroke-width="6"/><g clip-path="url(#${id})">${view}</g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK2}" stroke-width="5"/>`;
}
// sóng âm lan từ (x,y): vòng cung to dần, lặp liên tục (n vòng)
function tqRings(t, x, y, o = {}) {
  let s = ''; const n = o.n || 3, per = o.per || 1.2;
  for (let i = 0; i < n; i++) { const u = ((t / per) + i / n) % 1, r = 20 + u * (o.r || 220); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${o.c || '#FFFFFF'}" stroke-width="${f1(7 * (1 - u) + 1)}" opacity="${f1((1 - u) * (o.op ?? 0.7))}"/>`; }
  return s;
}
// số có dấu chấm ngăn nghìn
const tqNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

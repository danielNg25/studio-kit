// ===== KHUÔN "HOẠT CẢNH" dùng chung cho các tập kể chuyện (12/11): một shot = một bảng mô tả (nền, người, mốc theo chữ trong lời).
// Dựng trên sân khấu tqStage (chuẩn hình đã duyệt): quay mặt bật ngay, không chớp trắng, chết = cắt tối (cut), người cưỡi ngựa nửa thân.
const SC = EPISODE_SCENES;
const ARM = { CH: { c: '#3E6A8E', flag: '#2E7A5A' }, DT: { c: '#5A4466', flag: '#2A2A30' }, TAO: { c: '#4A5A7A', flag: '#2E3E6A' }, VIEN: { c: '#8A7A3A', flag: '#C9A227' }, THUC: { c: '#3E7A52', flag: '#2E7A5A' }, NGO: { c: '#9A4A3A', flag: '#B8322A' }, TL: { c: '#7A6A5A', flag: '#E8E4DC' }, LB: { c: '#6A3A4A', flag: '#8E2430' }, TONG: { c: '#8A3A34', flag: '#C0392B' }, PL: { c: '#4A6A4A', flag: '#D9A21E' } };
const tqArm2 = (L, R, o = {}) => [L ? Object.assign({ x0: -30, x1: 470, dir: 1 }, ARM[L], o, o.L) : null, R ? Object.assign({ x0: 1450, x1: 1950, dir: -1 }, ARM[R], o, o.R) : null].filter(Boolean);
// mốc: số ≥ 0 = giây trong shot; số âm = tính từ cuối; chuỗi = lúc đọc tới cụm chữ đó
const tbA = (ctx, w, fb = 0) => typeof w === 'number' ? (w < 0 ? Math.max(0, ctx.dur + w) : w) : tqAt(ctx, w, fb);
// ---- NỀN TRONG NHÀ: kind 'tent' (lều quân) | 'hall' (sảnh, cột gỗ) | 'room' (phòng nhỏ) ; night: 1 ; tint
function tbIn(t, o = {}) {
  const kind = o.in || 'tent', night = !!o.night, id = 'in' + (TQ_ID++), wall = o.tint || (kind === 'tent' ? (night ? '#5A4A3E' : '#B89A72') : kind === 'hall' ? (night ? '#3A2A2A' : '#8A5A44') : (night ? '#3A3440' : '#A88A6A')), fl = tqMix(wall, '#1A0E0A', 0.45), gl = night ? '#FFB45A' : '#FFE9B8';
  let s = `<defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tqMix(wall, '#000000', 0.45)}"/><stop offset="0.75" stop-color="${wall}"/></linearGradient><radialGradient id="${id}l"><stop offset="0" stop-color="${gl}" stop-opacity="0.75"/><stop offset="1" stop-color="${gl}" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id}w)"/>`;
  if (kind === 'tent') { for (let i = 0; i < 9; i++) { const x = -120 + i * 270; s += `<path d="M960 -60 Q${x + 60} 260 ${x} 860" stroke="${tqMix(wall, '#000000', 0.3)}" stroke-width="7" fill="none" opacity="0.6"/>`; }
    s += `<path d="M-20 300 Q960 120 1940 300" stroke="${tqMix(wall, '#000000', 0.4)}" stroke-width="16" fill="none"/><path d="M960 -20 V860" stroke="#14080A" stroke-width="30"/><path d="M960 -20 V860" stroke="#6A4428" stroke-width="18"/>`;
    for (const x of [330, 1590]) s += `<path d="M${x} 300 v120" stroke="#14080A" stroke-width="5"/><path d="M${x - 34} 420 h68 l-12 84 h-44Z" fill="${night ? '#FFC870' : '#E8D8A8'}" stroke="#14080A" stroke-width="5"/>`;
  } else if (kind === 'hall') { for (const x of [150, 560, 1360, 1770]) s += `<rect x="${x - 44}" y="-20" width="88" height="900" fill="#7A2A22" stroke="#14080A" stroke-width="6"/><rect x="${x - 60}" y="800" width="120" height="70" rx="8" fill="#5A4A3A" stroke="#14080A" stroke-width="6"/><rect x="${x - 56}" y="40" width="112" height="46" fill="#C9A227" stroke="#14080A" stroke-width="5"/>`;
    s += `<rect x="700" y="170" width="520" height="430" rx="10" fill="${tqMix(wall, '#000000', 0.35)}" stroke="#14080A" stroke-width="7"/>`; for (let i = 0; i < 5; i++) s += `<path d="M${760 + i * 100} 170 v430 M700 ${240 + i * 80} h520" stroke="#C9A227" stroke-width="4" opacity="0.45"/>`;
    s += `<path d="M-20 0 Q480 150 960 70 Q1440 150 1940 0 V-20 H-20Z" fill="#8E2430" stroke="#14080A" stroke-width="6"/>`;
  } else { s += `<rect x="1180" y="190" width="420" height="360" rx="8" fill="${night ? '#1E2A4A' : '#CFE4F0'}" stroke="#14080A" stroke-width="8"/><path d="M1390 190 v360 M1180 370 h420" stroke="#14080A" stroke-width="7"/>` + (night ? `<circle cx="1500" cy="270" r="38" fill="#F4EED8"/>` : '') + `<rect x="230" y="260" width="300" height="420" rx="6" fill="${tqMix(wall, '#000000', 0.3)}" stroke="#14080A" stroke-width="6"/><path d="M260 330 h240 M260 420 h240 M260 510 h240 M260 600 h240" stroke="#14080A" stroke-width="5"/>`; }
  s += `<path d="M-20 860 H1940 V1100 H-20Z" fill="${fl}"/><path d="M-20 860 H1940" stroke="#14080A" stroke-width="7"/>`;
  for (let i = 0; i < 7; i++) s += `<path d="M${-200 + i * 400} 1100 L${200 + i * 260} 862" stroke="#14080A" stroke-width="3" opacity="0.25"/>`;
  s += `<ellipse cx="960" cy="985" rx="${o.rug === false ? 0 : 640}" ry="96" fill="#7A2A2A" opacity="0.5"/><ellipse cx="960" cy="985" rx="${o.rug === false ? 0 : 560}" ry="78" fill="none" stroke="#C9A227" stroke-width="5" opacity="0.5"/>`;
  s += `<circle cx="${o.lx || 960}" cy="${o.ly || 380}" r="${f1(620 + 16 * Math.sin(t * 5))}" fill="url(#${id}l)" opacity="${night ? 0.8 : 0.5}"/>` + (night ? `<rect width="1920" height="1080" fill="#0A0A20" opacity="0.28"/>` : '');
  return { far: s, mid: '', near: '', P: { hz: tqMix(wall, '#FFFFFF', 0.2), light: night ? 'night' : 'day' } };
}
// ---- HOẠT CẢNH. o = { bg: {…tqbg} | {in:'tent'…} | fn(t), cast: [[ai, x, {d, f, ex, hand, arm, m (cưỡi ngựa), horse, k, in:[mốc, từX, dur], out:[mốc, tớiX, dur], mv:[mốc, tớiX, dur],
//   show, hide, hop, lie (độ xoay nằm), fall (mốc ngã ngựa), b:[[mốc, {…đổi thuộc tính}]] }]], say:[[sốThứTự, chữ, mốc, dur]], sfx:[[chữ, x, y, mốc]], props(S, t, A, R),
//   cam:[[mốc, z, cx, cy]], focus, cut: mốc cắt tối, big:[mốc đòn lớn], arm:[L, R], fin:{…} }
function tb(T, ctx, o) {
  const A = (w, fb) => tbA(ctx, w, fb), S = tqStage(T, ctx, { big: (o.big || []).map(w => A(w)) }), t = S.t, R = [];
  (o.cast || []).forEach((c) => {
    let [who, x, q0 = {}] = c; const q = Object.assign({}, q0);
    for (const [at, d] of (q0.b || [])) if (t >= A(at)) Object.assign(q, d);
    if ((q.show != null && t < A(q.show)) || (q.hide != null && t >= A(q.hide))) { R.push(null); return; }
    let legs = 'stand', run = q.run ?? 0.3, face = q.f ?? (x < 960 ? 1 : -1);
    if (q.in) { const [at, from, dur = 1.1] = q.in, a = A(at); if (t < a) { R.push(null); return; } const u = clamp((t - a) / dur); if (u < 1) { const tx = x; x = lerp(from, tx, xfQO(u)); legs = 'run'; run = 1.4; face = from < tx ? 1 : -1; } }
    if (q.mv) { const [at, to, dur = 1.2] = q.mv, a = A(at); if (t >= a) { const u = clamp((t - a) / dur); if (u < 1) { legs = 'run'; run = 1.2; face = to > x ? 1 : -1; } x = lerp(x, to, xfQO(u)); } }
    if (q.out) { const [at, to, dur = 1.3] = q.out, a = A(at); if (t >= a) { const u = clamp((t - a) / dur); if (u >= 1) { R.push(null); return; } face = to > x ? 1 : -1; x = lerp(x, to, u * u); legs = 'run'; run = 1.4; } }
    const hop = q.hop != null ? bump(t, A(q.hop), 0.4) : 0, st = { ex: q.ex || 'neutral' }; if (q.hand) st.hand = q.hand; if (q.sweat) st.sweat = 1; if (q.lean) st.lean = q.lean;
    const arm = q.arm != null ? q.arm + (q.wave ? Math.sin(t * q.wave) * 7 : 0) : null; let r;
    if (q.m) { const W = typeof who === 'string' ? { id: who, horse: q.horse || '#7A5A3A', hand: q.hand || 'fist' } : Object.assign({}, who, q.hand ? { hand: q.hand } : {}), extra = {};
      if (arm != null) { st.arm = arm; st.wrot = xfAlong(arm, q.off ?? 0); } if (q.k) extra.k = q.k; if (q.fall != null && t >= A(q.fall)) extra.fall = { t0: A(q.fall), dur: 0.5, back: q.fb ?? -40, ex: 'pain', lift: 60, drop: 1 };
      r = S.put(W, x, q.d || 0, face, st, run, extra); }
    else { st.legs = legs; if (st.hand == null && typeof who === 'string') st.hand = 'fist'; st.arm = arm == null ? 8 : arm; r = S.foot(who, x, q.d || 0, face, st, q.k || 1);
      if (q.lie || hop || q.dy) { const L = S.L[S.L.length - 1], tr = q.lie ? `translate(0 ${q.dy || 0}) rotate(${q.lie} ${f1(x)} ${f1(L.g - 60)})` : `translate(0 ${f1(-hop * 46 + (q.dy || 0))})`; L.front = `<g transform="${tr}">${L.front}</g>`; }
      if (q.op != null) { const L = S.L[S.L.length - 1]; L.front = `<g opacity="${f1(q.op)}">${L.front}</g>`; } }
    R.push(r);
  });
  (o.say || []).forEach(([i, text, at, dur, c]) => { if (R[i]) S.say(text, R[i], A(at), A(at) + (dur || 2.8), c || {}); });
  (o.sfx || []).forEach(([text, x, y, at, c]) => S.sfx(text, x, y, A(at), c || {}));
  if (o.cut != null) { const d = t - A(o.cut); if (d > 0) S.over += `<rect x="-10" y="-10" width="1940" height="1100" fill="#0A0508" opacity="${f1(clamp(d / 0.3) * (o.cutOp ?? 0.94))}"/>`; }
  if (o.props) o.props(S, t, A, R);
  const bg = typeof o.bg === 'function' ? o.bg(t) : (o.bg && o.bg.in) ? tbIn(t, o.bg) : tqbg(t, o.bg || {});
  const cam = o.cam ? o.cam.map(k => [A(k[0]), k[1], k[2], k[3]]) : [[0, 1.04, 960, 580], [ctx.dur, 1.13, o.focus || 960, 610]];
  if (o.cap) { const [text, at, dur = 3] = o.cap, d = t - A(at); if (d > 0 && d < dur) S.over += `<g opacity="${f1(clamp(d / 0.3) * clamp((dur - d) / 0.3))}">` + kText(text, 960, 170, o.capFs || 64, { c: '#FFF2C8', stroke: '#14080A', sw: 10 }) + `</g>`; }
  return S.fin(bg, cam, Object.assign({ crowd: false }, (bg.P && bg.P.light === 'night') || (o.bg && o.bg.in) ? { light: bg.P.light, motes: !(o.bg && o.bg.in) } : {}, o.arm ? { armies: tqArm2(o.arm[0], o.arm[1], o.arm[2] || {}) } : {}, o.fin || {}));
}
// ---- THẺ GIỚI THIỆU: người đứng to một bên, tên + dòng phụ bên kia. o = {id, name, tag, no, tint, side:'L'|'R', ex, hand, arm, sub:[[mốc, chữ]…] (dòng chữ hiện thêm theo lời)}
function tbCard(t, ctx, o) {
  const L = o.side !== 'R', cx = L ? 520 : 1400, nx = L ? 1270 : 650, tint = o.tint || '#3A1E22', u = EZ.expoOut(clamp(t / 0.5)), z = 1 + 0.05 * clamp(t / ctx.dur);
  let s = tqPanelBg(t, tint) + `<g opacity="0.5">` + tqRays(t, cx, 520, { c: '#FFE2A8' }) + `</g>`;
  s += `<g transform="translate(${f1((1 - u) * (L ? -500 : 500))} 0)">` + thC(o.id, { x: cx, ground: 1090, scale: o.sc || 0.84, ex: o.ex || 'neutral', flip: !L, shadow: false, legs: 'stand', hand: o.hand || 'fist', arm: o.arm ?? 8 }, t) + `</g>`;
  if (o.no) s += `<g opacity="${f1(clamp((t - 0.2) / 0.3))}"><circle cx="${nx}" cy="250" r="74" fill="#C0392B" stroke="#14080A" stroke-width="8"/>` + kText(String(o.no), nx, 282, 92, { c: '#fff' }) + `</g>`;
  s += `<g opacity="${f1(clamp((t - 0.3) / 0.3))}" transform="translate(${f1((1 - EZ.expoOut(clamp((t - 0.3) / 0.5))) * (L ? 120 : -120))} 0)"><rect x="${nx - 430}" y="360" width="860" height="170" rx="18" fill="#1A0E0A" opacity="0.8"/><rect x="${nx - 430}" y="360" width="860" height="170" rx="18" fill="none" stroke="#E2C25A" stroke-width="5"/>` + (o.name.length > 18 ? tpWrapX(o.name.toUpperCase(), 58, 800).map((ln, j, A2) => kText(ln, nx, 466 + (j - (A2.length - 1) / 2) * 66, 58, { c: '#F3E3B8', stroke: '#14080A', sw: 9 })).join('') : kText(o.name.toUpperCase(), nx, 482, o.name.length > 14 ? 76 : o.name.length > 10 ? 92 : 112, { c: '#F3E3B8', stroke: '#14080A', sw: 10 })) + `</g>`;
  if (o.tag) s += `<g opacity="${f1(clamp((t - 0.7) / 0.3))}">` + kText(o.tag, nx, 606, 58, { c: '#E8D8B0' }) + `</g>`;
  (o.sub || []).forEach(([at, text], i) => { const d = t - tbA(ctx, at); if (d < 0) return; const e = EZ.expoOut(clamp(d / 0.4)), y = ((o.sub || []).length > 2 ? 712 : 730) + i * ((o.sub || []).length > 2 ? 116 : 128);
    s += `<g opacity="${f1(clamp(d / 0.25))}" transform="translate(${f1((1 - e) * (L ? 90 : -90))} 0)"><rect x="${nx - 430}" y="${y - 74}" width="860" height="112" rx="14" fill="#FFFBF0" stroke="#14080A" stroke-width="5"/>` + kText(text, nx, y, text.length > 34 ? 38 : text.length > 26 ? 46 : 54, {}) + `</g>`; });
  return thFin(kCam(s, t, z, 960, 540, [0, 0]) + cineFrame(0.3));
}
// ---- THẺ NHÃN cuối mục: chân dung + con dấu nhãn đóng xuống. o = {id, name, label, at (mốc đóng dấu, mặc định cuối −3 s), tint, ex, col}
function tbNhan(t, ctx, o) {
  const tS = tbA(ctx, o.at ?? -3.2), d = t - tS, col = o.col || '#8E2430';
  let s = tqPanelBg(t, o.tint || '#2A1810');
  s += `<g opacity="${f1(clamp(t / 0.3))}">` + thC(o.id, { x: 470, ground: 1070, scale: 0.8, ex: d > 0 ? (o.ex2 || 'so') : (o.ex || 'neutral'), flip: false, shadow: false, legs: 'stand', hand: 'fist', arm: 8 }, t) + `</g>`;
  s += kText(o.name.toUpperCase(), 1270, 300, o.name.length > 26 ? 40 : o.name.length > 16 ? 56 : 80, { c: '#F3E3B8', stroke: '#14080A', sw: 9 }) + `<path d="M900 350 H1640" stroke="#E2C25A" stroke-width="5" opacity="0.6"/>`;
  const NL3 = (o.lines || []).length > 2, NF = NL3 ? 44 : 50, LY = o.ly || ((o.lines || []).length > 1 ? 850 : 800);
  (o.lines || []).forEach(([at, text], i) => { const dd = t - tbA(ctx, at); if (dd < 0) return; s += `<g opacity="${f1(clamp(dd / 0.3))}">` + tpWrapX(text, NF, 900).map((ln, j) => kText(ln, 1270, 430 + i * (NL3 ? 104 : 126) + j * (NF + 6), NF, { c: '#E8D8B0' })).join('') + `</g>`; });
  if (d >= 0) { const kk = d < 0.16 ? 1 + (1 - d / 0.16) * 1.6 : 1 + 0.08 * Math.exp(-(d - 0.16) * 8) * Math.sin((d - 0.16) * 30), L2 = tpWrapX(o.label, 84, 800), LF = Math.min(L2.length > 1 ? 80 : 88, 860 / (Math.max(...L2.map(x => x.length)) * 0.62)), h = 150 + (L2.length - 1) * 100;
    s += `<g transform="translate(1270 ${LY}) rotate(-5) scale(${f1(kk)})"><rect x="-470" y="${-h / 2}" width="940" height="${h}" rx="22" fill="${col}" stroke="#14080A" stroke-width="10"/><rect x="-452" y="${-h / 2 + 18}" width="904" height="${h - 36}" rx="12" fill="none" stroke="#FFF2C8" stroke-width="4" opacity="0.7"/>` + L2.map((ln, j) => kText(ln, 0, 30 + (j - (L2.length - 1) / 2) * 100, LF, { c: '#fff' })).join('') + `</g>` + shockRing(t, tS + 0.16, 1270, LY, { r: 520, c: '#FFD25A', dur: 0.5 }); }
  return thFin(kCam(s, t, 1.02, 960, 540, shakeMulti(t, [[tS + 0.16, 9, 0.25]])) + cineFrame(0.3));
}
// ---- LƯỚI NHÃN (màn kết): items = [[id, tên, nhãn]…]; hiện lần lượt
function tbGrid(t, ctx, items, o = {}) {
  const n = items.length, cols = o.cols || Math.ceil(n / 2), cw = 1780 / cols, rows = Math.ceil(n / cols); let s = tqPanelBg(t, o.tint || '#2A1810') + kText(o.title || '', 960, 130, 60, { c: '#F3E3B8', stroke: '#14080A', sw: 8 });
  items.forEach(([id, name, label], i) => { const d = t - 0.3 - i * (o.step || 0.35); if (d < 0) return; const e = EZ.backOut(clamp(d / 0.4)), cx = 70 + cw * (i % cols + 0.5), cy = (rows > 1 ? 340 : 480) + Math.floor(i / cols) * 420, r = Math.min(120, cw * 0.33);
    s += `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(e)})"><circle r="${r + 8}" fill="#1A0E0A" stroke="#E2C25A" stroke-width="6"/>` + kIcon(id, 0, 0, r, 'neutral', t, { bg: '#5A4636' }) + tpWrapX(name, 30, cw - 30).slice(0, 2).map((ln, j) => kText(ln, 0, r + 46 + j * 34, 30, { c: '#F3E3B8' })).join('');
    const NL = Math.min(2, tpWrapX(name, 30, cw - 30).length) - 1, L2 = tpWrapX(label, 28, cw - 40); s += `<rect x="${-cw / 2 + 14}" y="${r + 72 + NL * 34}" width="${cw - 28}" height="${34 + L2.length * 36}" rx="10" fill="#8E2430" stroke="#14080A" stroke-width="4"/>` + L2.map((ln, j) => kText(ln, 0, r + 110 + NL * 34 + j * 36, 28, { c: '#fff' })).join('') + `</g>`; });
  return thFin(s + cineFrame(0.3));
}
// đồ vật nhỏ
const tbBox = (x, y, w, h, fill = '#7A4A2A') => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="#14080A" stroke-width="6"/>`;
const tbBed = (x, g, w = 520) => `<rect x="${x - w / 2}" y="${g - 110}" width="${w}" height="70" rx="10" fill="#8A6A4A" stroke="#14080A" stroke-width="6"/><rect x="${x - w / 2 + 10}" y="${g - 140}" width="${w - 20}" height="40" rx="14" fill="#D8C8A8" stroke="#14080A" stroke-width="5"/><path d="M${x - w / 2 + 30} ${g - 40} v44 M${x + w / 2 - 30} ${g - 40} v44" stroke="#14080A" stroke-width="16"/>`;
const tbTree = (x, g, k = 1, c = '#3E6A46') => `<g transform="translate(${x} ${g}) scale(${k})"><path d="M-26 0 Q-16 -200 -22 -380 H22 Q16 -200 26 0Z" fill="#6A4A30" stroke="#14080A" stroke-width="6"/><ellipse cx="0" cy="-470" rx="210" ry="170" fill="${c}" stroke="#14080A" stroke-width="6"/><ellipse cx="-110" cy="-390" rx="120" ry="90" fill="${c}" stroke="#14080A" stroke-width="6"/><ellipse cx="120" cy="-400" rx="130" ry="96" fill="${c}" stroke="#14080A" stroke-width="6"/><ellipse cx="0" cy="-470" rx="196" ry="156" fill="${c}"/></g>`;
const tbSign = (x, g, text, k = 1) => `<g transform="translate(${x} ${g}) scale(${k})"><path d="M-110 0 L-96 -260 Q0 -300 96 -260 L110 0Z" fill="#8A8A86" stroke="#14080A" stroke-width="7"/>` + tpWrapX(text, 46, 190).map((ln, j) => kText(ln, 0, -170 + j * 56, 44, { c: '#2A1A1A' })).join('') + `</g>`;
const tbBoard2 = (x, y, lines, w = 520) => `<g transform="translate(${x} ${y})"><path d="M0 0 V420" stroke="#14080A" stroke-width="18"/><path d="M0 0 V420" stroke="#6A4428" stroke-width="10"/><rect x="${-w / 2}" y="-20" width="${w}" height="${50 + lines.length * 56}" rx="8" fill="#F3E8C8" stroke="#14080A" stroke-width="7"/>` + lines.map((ln, j) => kText(ln, 0, 44 + j * 56, 38, { c: '#2A1A1A' })).join('') + `</g>`;
const tbArrows = (t, t0, n, from, to, o = {}) => { let s = ''; for (let i = 0; i < n; i++) { const u = (t - t0 - i * (o.gap ?? 0.07)) / (o.dur ?? 0.45); s += xqArrow([from[0] + hrnd(i, 51) * (o.sx ?? 500) - (o.sx ?? 500) / 2, from[1] + hrnd(i, 52) * 120], [to[0] + hrnd(i, 53) * (o.tx ?? 260) - (o.tx ?? 260) / 2, to[1] + hrnd(i, 54) * 160 - 80], u, { arc: o.arc ?? 20 }); } return s; };
// ---- SÔNG + THUYỀN (Xích Bích…): o = {night, fog, chain (xích nối thuyền), fire: mốc bắt lửa (giây) hoặc null, boats: n thuyền nhỏ, straw}
function tbRiver(t, o = {}) {
  const night = o.night !== false, id = 'rv' + (TQ_ID++), sky = night ? ['#0E1430', '#243A66'] : ['#8EC4E8', '#DCEFF6'], wat = night ? '#1A2E52' : '#4E8EB4', f0 = o.fire;
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="1920" height="620" fill="url(#${id})"/>` + (night ? `<circle cx="1560" cy="170" r="70" fill="#F4EED8"/><circle cx="1560" cy="170" r="200" fill="#F4EED8" opacity="0.12"/>` : `<circle cx="420" cy="190" r="90" fill="#FFF6D8"/>`);
  s += `<path d="M-20 560 Q300 500 620 548 T1240 540 T1940 556 V640 H-20Z" fill="${night ? '#16203A' : '#6E9A7A'}"/><rect x="-20" y="610" width="1960" height="480" fill="${wat}"/>`;
  for (let i = 0; i < 14; i++) { const y = 640 + i * 24, x = ((i * 277 + t * (20 + i * 3)) % 2200) - 140; s += `<path d="M${f1(x)} ${y} q60 -10 120 0 t120 0" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="${night ? 0.18 : 0.4}"/>`; }
  const n = o.ships ?? 5; for (let i = 0; i < n; i++) { const x = 980 + i * 220 - (o.sx || 0), y = 690 + (i % 2) * 16 + Math.sin(t * 1.4 + i) * 4, burn = f0 != null && t > f0 + i * 0.35;
    s += `<g transform="translate(${x} ${f1(y)})"><path d="M-120 0 Q-100 70 -60 74 H60 Q100 70 120 0Z" fill="${burn ? '#3A1A12' : '#6A4428'}" stroke="#14080A" stroke-width="6"/><path d="M0 0 V-230" stroke="#14080A" stroke-width="10"/><path d="M6 -220 Q110 -180 100 -40 H6Z" fill="${burn ? '#7A2A1A' : '#C8B490'}" stroke="#14080A" stroke-width="5"/><path d="M-6 -224 l-60 22 l60 20Z" fill="#2E3E6A" stroke="#14080A" stroke-width="4"/></g>`;
    if (o.chain && i < n - 1) s += `<path d="M${x + 118} ${f1(y + 16)} q52 34 104 0" stroke="#14080A" stroke-width="9" fill="none" stroke-dasharray="14 8"/>`;
    if (burn) s += tqFire(t, x, y - 20, 1.5 + (i % 2) * 0.4); }
  for (let i = 0; i < (o.boats || 0); i++) { const u = clamp((t - (o.bt0 || 0) - i * 0.25) / (o.bdur || 4)), x = lerp(o.bfrom ?? -200, (o.bto ?? 900) - i * 120, xfQO(u)), y = 780 + (i % 3) * 46 + Math.sin(t * 2 + i) * 4;
    s += `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-90 0 Q-70 46 -40 48 H40 Q70 46 90 0Z" fill="#5A3A20" stroke="#14080A" stroke-width="5"/>` + (o.straw ? `<path d="M-70 0 Q-60 -80 0 -86 Q60 -80 70 0Z" fill="#D8B45A" stroke="#14080A" stroke-width="5"/><path d="M-40 -10 v-50 M0 -6 v-70 M40 -10 v-50" stroke="#8A6A2A" stroke-width="4"/>` : `<path d="M-50 0 Q-40 -50 0 -54 Q40 -50 50 0Z" fill="#8A7A5A" stroke="#14080A" stroke-width="5"/>`) + `</g>` + (o.bfire != null && t > o.bfire ? tqFire(t, x, y - 30, 0.9) : ''); }
  if (o.fog) s += `<rect width="1920" height="1080" fill="#C8D4E0" opacity="${o.fog}"/>`;
  s += `<path d="M-20 930 H1940 V1100 H-20Z" fill="#7A5232"/><path d="M-20 930 H1940" stroke="#14080A" stroke-width="8"/>`; for (let i = 0; i < 9; i++) s += `<path d="M${i * 240} 930 V1100" stroke="#14080A" stroke-width="4" opacity="0.35"/>`;
  s += `<path d="M-20 930 v-70 M300 930 v-70 M620 930 v-70 M-20 866 H640" stroke="#14080A" stroke-width="12"/><path d="M-20 930 v-70 M300 930 v-70 M620 930 v-70 M-20 866 H640" stroke="#8A6238" stroke-width="6"/>`;
  return { far: s, mid: '', near: '', P: { hz: '#9AB0C8', light: night ? 'night' : 'day' } };
}
// thẻ chữ lớn giữa khung (kế 1/2/3…): items = [[mốc, nhãn, chữ, màu]], o.hi = [mốc, chỉ số] (làm nổi một thẻ)
function tbCards(t, ctx, title, items, o = {}) {
  let s = tqPanelBg(t, o.tint || '#2A1810') + kText(title, 960, 150, 64, { c: '#F3E3B8', stroke: '#14080A', sw: 9 }); const n = items.length, hiT = o.hi ? tbA(ctx, o.hi[0]) : 1e9;
  items.forEach(([at, lab, txt, col], i) => { const d = t - tbA(ctx, at); if (d < 0) return; const e = EZ.backOut(clamp(d / 0.4)), y = 300 + i * (660 / n), h = 660 / n - 30, hi = t > hiT && o.hi[1] === i, dimm = t > hiT && !hi;
    s += `<g opacity="${dimm ? 0.35 : 1}" transform="translate(960 ${f1(y + h / 2)}) scale(${f1(e * (hi ? 1.06 : 1))}) translate(-960 ${f1(-y - h / 2)})"><rect x="260" y="${y}" width="1400" height="${h}" rx="18" fill="#FFFBF0" stroke="${hi ? '#FFD25A' : '#14080A'}" stroke-width="${hi ? 12 : 6}"/><rect x="260" y="${y}" width="330" height="${h}" rx="18" fill="${col || '#8E2430'}" stroke="#14080A" stroke-width="6"/>` + kText(lab, 425, y + h / 2 + 20, lab.length > 8 ? 44 : 58, { c: '#fff' }) + tpWrapX(txt, 46, 1000).map((ln, j, a) => kText(ln, 640, y + h / 2 + 18 + (j - (a.length - 1) / 2) * 54, 46, { anchor: 'start' })).join('') + `</g>`; });
  return thFin(s + cineFrame(0.3));
}
const tqFire = (t, x, y, k = 1) => { let s = `<circle cx="${x}" cy="${y - 60 * k}" r="${f1(220 * k * (0.85 + 0.15 * Math.sin(t * 9 + x)))}" fill="#FF8A2A" opacity="0.22"/>`; for (let i = 0; i < 5; i++) { const fl = 0.7 + 0.3 * Math.sin(t * (9 + i) + x + i * 2), w = (60 - i * 8) * k, h = (190 - i * 22) * k * fl; s += `<path d="M${f1(x - w + i * 6)} ${y} Q${f1(x - w * 0.6)} ${f1(y - h * 0.5)} ${f1(x + Math.sin(t * 6 + i) * 14)} ${f1(y - h)} Q${f1(x + w * 0.6)} ${f1(y - h * 0.5)} ${f1(x + w - i * 6)} ${y}Z" fill="${['#C0391A', '#E8602A', '#FF9A3A', '#FFC85A', '#FFF0A0'][i]}"/>`; } return s; };
// ---- DỰNG NHANH NHIỀU CẢNH (mở đầu): mượn cảnh của shot khác trong tập, cắt nhanh, mỗi lần cắt giật zoom nhẹ + nháy tối 2 khung (không chớp trắng)
function tbPeekCtx(id) { const tl = RJ.timeline, i = tl.shots.findIndex(s => s.id === id); if (i < 0) return null; return { shot: tl.shots[i], c: makeCtx(tl.shots[i], RJ.episode.shots[i], 0) }; }
const tbSlam0 = (text, t, t0, o = {}) => { const d = t - t0; if (d < 0 || !text) return ''; const k = d < 0.14 ? 1 + (1 - d / 0.14) * 1.2 : 1 + 0.05 * Math.exp(-(d - 0.14) * 8) * Math.sin((d - 0.14) * 30), fs = o.fs || 96, L = tpWrapX(text, fs, o.w || 1500), y = o.y ?? 900;
  return `<g transform="translate(${o.x ?? 960} ${y}) rotate(${o.rot ?? -3}) scale(${k.toFixed(3)})">` + L.map((ln, j) => kText(ln, 0, (j - (L.length - 1) / 2) * fs * 1.1 + fs * 0.35, fs, { c: o.c || '#FFE9A0', stroke: '#14080A', sw: Math.max(10, fs * 0.16) })).join('') + `</g>`; };
// cuts: [[t0, idShot, mốc trong shot đó (chữ | giây), lệch giây, nhãn]] ; o: {speed, labelY}
function tbMontage(t, ctx, cuts, o = {}) {
  let k = 0; for (let i = 0; i < cuts.length; i++) if (t >= cuts[i][0]) k = i; const [t0, id, at, off = 0, label] = cuts[k], P = tbPeekCtx(id); if (!P) return thFin(tqPanelBg(t));
  const base = (typeof at === 'number' ? (at < 0 ? P.shot.dur + at : at) : P.c.at(at)) + off, lt = clamp(base + (t - t0) * (o.speed || 1), 0.05, P.shot.dur - 0.05), d = t - t0, z = 1.06 + 0.16 * Math.exp(-d * 9);
  let s = `<g transform="translate(960 540) scale(${z.toFixed(3)}) translate(-960 -540)">${EPISODE_SCENES['s_' + id](lt, makeCtx(P.shot, null, lt))}</g>`;
  return s + tbSlam(label, t, t0 + 0.12, { y: o.labelY ?? 900, fs: o.fs || 90 }) + `<rect width="1920" height="1080" fill="none" stroke="#0A0508" stroke-width="70" opacity="0.5"/>`;
}
// tiêu đề đập xuống trên nền tối + hàng chân dung bật ra (ids = [[id, tên]…])
function tbTitle(t, ctx, t0, lines, ids, o = {}) { const d = t - t0; let s = tqPanelBg(t, o.tint || '#1A0E12') + `<g opacity="0.6">` + tqRays(t, 960, 420, { c: '#FFD98A' }) + `</g>` + tqEmbers(t);
  const n = ids.length, cw = Math.min(190, 1760 / n), r = cw * 0.42; ids.forEach(([id, name], i) => { const e = EZ.backOut(clamp((d - 0.25 - i * (o.step ?? 0.07)) / 0.3)); if (e <= 0) return; const x = 960 + (i - (n - 1) / 2) * cw, y = 800 + (i % 2) * 34; s += `<g transform="translate(${f1(x)} ${y}) scale(${e.toFixed(3)})">` + kIcon(id, 0, 0, r, 'neutral', t, { bg: '#5A4636' }) + `<circle r="${f1(r)}" fill="none" stroke="#E2C25A" stroke-width="6"/></g>`; });
  lines.forEach(([txt, fs, c], i) => { s += tbSlam(txt, t, t0 + i * 0.28, { y: 300 + i * (o.gap || 170), fs, c: c || '#FFE9A0', rot: i % 2 ? 2 : -2, w: 1700 }); });
  return thFin(kCam(s, t, 1.02 + 0.05 * clamp(d / 6), 960, 540, shakeMulti(t, lines.map((_, i) => [t0 + i * 0.28 + 0.14, 10, 0.25]))) + cineFrame(0.3)); }
// ghi chú chữ thường trên dải tối (thay chữ tiếng động cho câu dài — dễ đọc hơn)
function tbNote(text, x, y, t, t0, o = {}) { const d = t - t0, life = o.life ?? 3; if (d < 0 || d > life) return ''; const fs = Math.min(o.fs || 54, 1700 / (text.length * 0.56)), w = text.length * fs * 0.56 + 80, op = clamp(d / 0.25) * clamp((life - d) / 0.3); x = clamp(x, w / 2 + 30, 1890 - w / 2);
  return `<g opacity="${op.toFixed(2)}" transform="translate(${f1(x)} ${f1(y - (1 - EZ.expoOut(clamp(d / 0.35))) * 30)})"><rect x="${f1(-w / 2)}" y="${f1(-fs * 0.98)}" width="${f1(w)}" height="${f1(fs * 1.6)}" rx="14" fill="#1A0E0A" opacity="0.82"/><rect x="${f1(-w / 2)}" y="${f1(-fs * 0.98)}" width="${f1(w)}" height="${f1(fs * 1.6)}" rx="14" fill="none" stroke="#E2C25A" stroke-width="3" opacity="0.8"/>` + kText(text, 0, fs * 0.16, fs, { c: '#FFF2C8' }) + `</g>`; }
// ===== KHUÔN BẢN 3 (12/11 13:04, người dùng: "quá nhiều chữ giải thích lại câu đang nói; nhiều cảnh rất tĩnh") — các hàm dưới đây THAY bản cũ cùng tên ở trên.
// 1) Bớt chữ: thẻ giới thiệu không còn dòng chữ phụ, thẻ nhãn không còn dòng tóm tắt, chữ đập dài bị bỏ, cảnh mượn (peek) không hiện bóng thoại / ghi chú.
// 2) Hết tĩnh: máy quay tự cắt cận – toàn theo từng mốc diễn biến, người nói nhún + vung tay, đổi nét mặt thì nảy người + dấu ! ?, thẻ giới thiệu / thẻ nhãn chạy trên nền cảnh thật của mục.
function tbSlam(text, t, t0, o = {}) { if (!text || globalThis.TB_PEEK) return ''; if (!o.keep && text.length > 18 && !/^[“…]|[.…”?]$/.test(text)) return ''; return tbSlam0(text, t, t0, o); }
function tbNote(text, x, y, t, t0, o = {}) { if (globalThis.TB_PEEK) return ''; const d = t - t0, life = o.life ?? 3; if (d < 0 || d > life) return ''; const fs = Math.min(o.fs || 54, 1700 / (text.length * 0.56)), w = text.length * fs * 0.56 + 80, op = clamp(d / 0.25) * clamp((life - d) / 0.3); x = clamp(x, w / 2 + 30, 1890 - w / 2);
  return `<g opacity="${op.toFixed(2)}" transform="translate(${f1(x)} ${f1(y - (1 - EZ.expoOut(clamp(d / 0.35))) * 30)})"><rect x="${f1(-w / 2)}" y="${f1(-fs * 0.98)}" width="${f1(w)}" height="${f1(fs * 1.6)}" rx="14" fill="#1A0E0A" opacity="0.82"/><rect x="${f1(-w / 2)}" y="${f1(-fs * 0.98)}" width="${f1(w)}" height="${f1(fs * 1.6)}" rx="14" fill="none" stroke="#E2C25A" stroke-width="3" opacity="0.8"/>` + kText(text, 0, fs * 0.16, fs, { c: '#FFF2C8' }) + `</g>`; }
function tbMontage(t, ctx, cuts, o = {}) {
  let k = 0; for (let i = 0; i < cuts.length; i++) if (t >= cuts[i][0]) k = i; const [t0, id, at, off = 0, label] = cuts[k], P = tbPeekCtx(id); if (!P) return thFin(tqPanelBg(t));
  const base = (typeof at === 'number' ? (at < 0 ? P.shot.dur + at : at) : P.c.at(at)) + off, lt = clamp(base + (t - t0) * (o.speed || 1), 0.05, P.shot.dur - 0.05), d = t - t0, z = 1.06 + 0.16 * Math.exp(-d * 9);
  globalThis.TB_PEEK = (globalThis.TB_PEEK || 0) + 1; let inner = ''; try { inner = EPISODE_SCENES['s_' + id](lt, makeCtx(P.shot, null, lt)); } finally { globalThis.TB_PEEK--; }
  let s = `<g transform="translate(960 540) scale(${z.toFixed(3)}) translate(-960 -540)">${inner}</g>`;
  return s + tbSlam(label, t, t0 + 0.12, { y: o.labelY ?? 900, fs: o.fs || 90 }) + (o.frame === false ? '' : `<rect width="1920" height="1080" fill="none" stroke="#0A0508" stroke-width="70" opacity="0.5"/>`);
}
function tbTitle(t, ctx, t0, lines, ids, o = {}) { const d = t - t0; let s = tqPanelBg(t, o.tint || '#1A0E12') + `<g opacity="0.6">` + tqRays(t, 960, 420, { c: '#FFD98A' }) + `</g>` + tqEmbers(t);
  const n = ids.length, cw = Math.min(190, 1760 / n), r = cw * 0.42; ids.forEach(([id, name], i) => { const e = EZ.backOut(clamp((d - 0.25 - i * (o.step ?? 0.07)) / 0.3)); if (e <= 0) return; const x = 960 + (i - (n - 1) / 2) * cw, y = 800 + (i % 2) * 34 + Math.sin(t * 2.4 + i) * 8; s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${e.toFixed(3)})">` + kIcon(id, 0, 0, r, 'neutral', t, { bg: '#5A4636' }) + `<circle r="${f1(r)}" fill="none" stroke="#E2C25A" stroke-width="6"/></g>`; });
  lines.forEach(([txt, fs, c], i) => { s += tbSlam(txt, t, t0 + i * 0.28, { y: 300 + i * (o.gap || 170), fs, c: c || '#FFE9A0', rot: i % 2 ? 2 : -2, w: 1700, keep: 1 }); });
  return thFin(kCam(s, t, 1.02 + 0.05 * clamp(d / 6), 960, 540, shakeMulti(t, lines.map((_, i) => [t0 + i * 0.28 + 0.14, 10, 0.25]))) + cineFrame(0.3)); }
const tbSelf = (ctx) => { const tl = RJ.timeline, i = tl.shots.findIndex(s => s.lines === ctx.lines); return { i, shot: i >= 0 ? tl.shots[i] : null, tl }; };
// dải tên góc dưới trái (số thứ tự + tên + dòng phụ ngắn) — thứ duy nhất bằng chữ trên thẻ giới thiệu
const tbLower = (t, o) => { const e = EZ.expoOut(clamp((t - 0.15) / 0.5)), nm = o.name.toUpperCase(), fs = nm.length > 26 ? 44 : nm.length > 16 ? 58 : 76, w = Math.max(nm.length * fs * 0.6, (o.tag || '').length * 21) + 90 + (o.no ? 130 : 0);
  return `<g transform="translate(${f1(70 - (1 - e) * 700)} 840)"><rect x="0" y="0" width="${f1(w)}" height="170" rx="18" fill="#1A0E0A" opacity="0.86"/><rect x="0" y="0" width="${f1(w)}" height="170" rx="18" fill="none" stroke="#E2C25A" stroke-width="5"/>` + (o.no ? `<circle cx="80" cy="85" r="56" fill="#C0392B" stroke="#14080A" stroke-width="7"/>` + kText(String(o.no), 80, 110, 70, { c: '#fff' }) : '') + kText(nm, o.no ? 160 : 44, 84, fs, { c: '#F3E3B8', anchor: 'start' }) + (o.tag ? kText(o.tag, o.no ? 162 : 46, 140, 38, { c: '#E8D8B0', anchor: 'start' }) : '') + `</g>`; };
function tbCard(t, ctx, o) {
  const me = tbSelf(ctx), id = me.shot ? me.shot.id : '', pre = id.slice(0, 4), nxt = me.shot && !globalThis.TB_PEEK ? me.tl.shots.filter(s => s.id.startsWith(pre) && s.id > id).slice(0, -1) : [], T1 = Math.min(2.2, ctx.dur * 0.3);
  if (t < T1 || !nxt.length) { const L = o.side !== 'R', cx = L ? 620 : 1300, u = EZ.expoOut(clamp(t / 0.45)), z = 1.0 + 0.1 * clamp(t / Math.max(1, nxt.length ? T1 : ctx.dur));
    let s = tqPanelBg(t, o.tint || '#3A1E22') + `<g opacity="0.55">` + tqRays(t, cx, 520, { c: '#FFE2A8' }) + `</g>` + tqEmbers(t) + `<g transform="translate(${f1((1 - u) * (L ? -700 : 700))} ${f1(-Math.abs(Math.sin(t * 2.2)) * 10)})">` + thC(o.id, { x: cx, ground: 1120, scale: 0.95, ex: o.ex || 'neutral', flip: !L, shadow: false, legs: 'stand', hand: o.hand || 'fist', arm: (o.arm ?? 8) + Math.sin(t * 3) * 5 }, t) + `</g>`;
    return thFin(kCam(s, t, z, cx, 520, shakeMulti(t, [[0.45, 8, 0.25]])) + tbLower(t, o) + cineFrame(0.3)); }
  const n = Math.max(2, Math.min(7, Math.round((ctx.dur - T1) / 1.8))), step = (ctx.dur - T1) / n, cuts = [];
  for (let k = 0; k < n; k++) { const sh = nxt[k % nxt.length], rnd = Math.floor(k / nxt.length); cuts.push([T1 + k * step, sh.id, sh.dur * Math.min(0.72, 0.22 + 0.22 * rnd + 0.06 * (k % nxt.length)), 0, '']); }
  return tbMontage(t, ctx, cuts) + tbLower(t, o);
}
function tbNhan(t, ctx, o) {
  const me = tbSelf(ctx), prev = me.i > 0 && !globalThis.TB_PEEK ? me.tl.shots[me.i - 1] : null, tS = Math.min(tbA(ctx, o.at ?? -3.2), Math.max(0.6, ctx.dur - 2.2)), d = t - tS, col = o.col || '#8E2430';
  let s = prev ? tbMontage(t, ctx, [[0, prev.id, prev.dur * 0.3, 0, '']], { speed: 0.7, frame: false }) + `<rect width="1920" height="1080" fill="#0A0508" opacity="${f1(0.35 + 0.3 * clamp(d / 0.3))}"/>` : tqPanelBg(t, o.tint || '#2A1810');
  const e = EZ.backOut(clamp(t / 0.4)), bob = Math.sin(t * 2.2) * 8;
  s += `<g transform="translate(400 ${f1(560 + bob)}) scale(${e.toFixed(3)})"><circle r="236" fill="#1A0E0A" stroke="#E2C25A" stroke-width="10"/>` + kIcon(o.id, 0, 0, 220, d > 0 ? (o.ex2 || 'so') : (o.ex || 'neutral'), t, { bg: '#5A4636' }) + `</g>` + kText(o.name.toUpperCase(), 400, 880, o.name.length > 26 ? 36 : o.name.length > 16 ? 48 : 64, { c: '#F3E3B8', stroke: '#14080A', sw: 9 });
  if (d >= 0) { const kk = d < 0.16 ? 1 + (1 - d / 0.16) * 1.6 : 1 + 0.08 * Math.exp(-(d - 0.16) * 8) * Math.sin((d - 0.16) * 30), L2 = tpWrapX(o.label, 84, 800), LF = Math.min(L2.length > 1 ? 80 : 88, 860 / (Math.max(...L2.map(x => x.length)) * 0.62)), h = 150 + (L2.length - 1) * 100;
    s += `<g transform="translate(1250 560) rotate(-5) scale(${f1(kk)})"><rect x="-470" y="${-h / 2}" width="940" height="${h}" rx="22" fill="${col}" stroke="#14080A" stroke-width="10"/><rect x="-452" y="${-h / 2 + 18}" width="904" height="${h - 36}" rx="12" fill="none" stroke="#FFF2C8" stroke-width="4" opacity="0.7"/>` + L2.map((ln, j) => kText(ln, 0, 30 + (j - (L2.length - 1) / 2) * 100, LF, { c: '#fff' })).join('') + `</g>` + shockRing(t, tS + 0.16, 1250, 560, { r: 520, c: '#FFD25A', dur: 0.5 }); }
  return s + cineFrame(0.3);
}
function tb(T, ctx, o) {
  const A = (w, fb) => tbA(ctx, w, fb), S = tqStage(T, ctx, { big: (o.big || []).map(w => A(w)) }), t = S.t, R = [], EV = [], PK = !!globalThis.TB_PEEK;
  const SAY = (o.say || []).map(([i, , at, dur]) => [i, A(at), A(at) + (dur || 2.8)]);
  (o.cast || []).forEach((c, ci) => {
    let [who, x, q0 = {}] = c; const q = Object.assign({}, q0), x0 = x; let lastB = -9, lastEx = null;
    for (const [at, d] of (q0.b || [])) { const a = A(at); EV.push([a, x0]); if (t >= a) { Object.assign(q, d); if (a >= lastB) { lastB = a; lastEx = d.ex || null; } } }
    SAY.forEach(s => { if (s[0] === ci) EV.push([s[1], x0]); }); if (q0.in) EV.push([A(q0.in[0]) + 0.3, x0]); if (q0.mv) EV.push([A(q0.mv[0]), q0.mv[1]]); if (q0.show != null) EV.push([A(q0.show), x0]);
    if ((q.show != null && t < A(q.show)) || (q.hide != null && t >= A(q.hide))) { R.push(null); return; }
    let legs = 'stand', run = q.run ?? 0.3, face = q.f ?? (x < 960 ? 1 : -1);
    if (q.in) { const [at, from, dur = 1.1] = q.in, a = A(at); if (t < a) { R.push(null); return; } const u = clamp((t - a) / dur); if (u < 1) { const tx = x; x = lerp(from, tx, xfQO(u)); legs = 'run'; run = 1.4; face = from < tx ? 1 : -1; } }
    if (q.mv) { const [at, to, dur = 1.2] = q.mv, a = A(at); if (t >= a) { const u = clamp((t - a) / dur); if (u < 1) { legs = 'run'; run = 1.2; face = to > x ? 1 : -1; } x = lerp(x, to, xfQO(u)); } }
    if (q.out) { const [at, to, dur = 1.3] = q.out, a = A(at); if (t >= a) { const u = clamp((t - a) / dur); if (u >= 1) { R.push(null); return; } face = to > x ? 1 : -1; x = lerp(x, to, u * u); legs = 'run'; run = 1.4; } }
    const talk = SAY.some(s => s[0] === ci && t >= s[1] && t < s[2]), pop = lastB > 0.3 ? bump(t, lastB, 0.32) * 0.7 : 0;
    const hop = 0 * pop /* người dùng 13/11: bỏ hẳn kiểu nhân vật nhảy lên một tí (hop/pop/nhún khi nói) */, st = { ex: q.ex || 'neutral' }; if (q.hand) st.hand = q.hand; if (q.sweat) st.sweat = 1; if (q.lean) st.lean = q.lean;
    let arm = q.arm != null ? q.arm + (q.wave ? Math.sin(t * q.wave) * 7 : 0) : null; if (talk && q.arm == null) arm = -66 + Math.sin(t * 7) * 18; else if (arm == null && !q.lie) arm = 8 + Math.sin(t * 1.6 + ci * 1.7) * 4;
    if (talk && st.ex === 'neutral') st.ex = 'smile'; let r;
    if (q.m) { const W = typeof who === 'string' ? { id: who, horse: q.horse || '#7A5A3A', hand: q.hand || 'fist' } : Object.assign({}, who, q.hand ? { hand: q.hand } : {}), extra = {};
      if (q.arm != null || talk) { st.arm = arm; st.wrot = xfAlong(arm, q.off ?? 0); } if (q.k) extra.k = q.k; if (q.fall != null && t >= A(q.fall)) extra.fall = { t0: A(q.fall), dur: 0.5, back: q.fb ?? -40, ex: 'pain', lift: 60, drop: 1 };
      r = S.put(W, x, q.d || 0, face, st, Math.max(run, talk ? 0.5 : run), extra); }
    else { st.legs = legs; if (st.hand == null && typeof who === 'string') st.hand = 'fist'; st.arm = arm == null ? 8 : arm; r = S.foot(who, x, q.d || 0, face, st, q.k || 1);
      if (q.lie || hop || q.dy) { const L = S.L[S.L.length - 1], tr = q.lie ? `translate(0 ${q.dy || 0}) rotate(${q.lie} ${f1(x)} ${f1(L.g - 60)})` : `translate(0 ${f1(-hop * 46 + (q.dy || 0))})`; L.front = `<g transform="${tr}">${L.front}</g>`; }
      if (q.op != null) { const L = S.L[S.L.length - 1]; L.front = `<g opacity="${f1(q.op)}">${L.front}</g>`; } }
    if (!q.lie && lastEx && lastB > 0.3 && t - lastB < 1.0 && ['shock', 'quiz', 'yell'].includes(lastEx)) { const d = t - lastB, e = EZ.backOut(clamp(d / 0.2)), hy = r.g - (q.m ? 680 : 800) * r.s + (q.dy || 0);
      S.fx += `<g transform="translate(${f1(x + 60)} ${f1(hy)}) scale(${e.toFixed(2)}) rotate(12)" opacity="${clamp((1 - d) / 0.25).toFixed(2)}">` + kText(lastEx === 'quiz' ? '?' : '!', 0, 0, 100, { c: lastEx === 'quiz' ? '#FFE9A0' : '#FF5A4A', stroke: '#14080A', sw: 12 }) + `</g>`; }
    R.push(r);
  });
  if (!PK) (o.say || []).forEach(([i, text, at, dur, c]) => { if (R[i]) S.say(text, R[i], A(at), A(at) + (dur || 2.8), c || {}); });
  (o.sfx || []).forEach(([text, x, y, at, c]) => S.sfx(text, x, y, A(at), c || {}));
  if (o.cut != null) { const d = t - A(o.cut); if (d > 0) S.over += `<rect x="-10" y="-10" width="1940" height="1100" fill="#0A0508" opacity="${f1(clamp(d / 0.3) * (o.cutOp ?? 0.94))}"/>`; }
  if (o.props) o.props(S, t, A, R);
  const bg = typeof o.bg === 'function' ? o.bg(t) : (o.bg && o.bg.in) ? tbIn(t, o.bg) : tqbg(t, o.bg || {});
  let cam;
  if (o.cam) cam = o.cam.map(k => [A(k[0]), k[1], k[2], k[3]]);
  else { const fx = o.focus || 960, ev = EV.filter(e => e[0] > 0.9 && e[0] < ctx.dur - 0.9).sort((a, b) => a[0] - b[0]), seg = [[0, 1.05, fx]]; let lastT = -9;
    for (const [te, xe] of ev) { if (te - lastT < 1.7) continue; lastT = te; const close = seg.length % 2 === 1; seg.push([te, close ? 1.36 : 1.07, close ? clamp(xe, 560, 1360) : fx]); }
    if (seg.length === 1 && ctx.dur > 5) { const n = Math.floor(ctx.dur / 3.2); for (let i = 1; i <= n; i++) { const c0 = (o.cast || [])[(i - 1) % Math.max(1, (o.cast || []).length)]; seg.push([i * ctx.dur / (n + 1), i % 2 ? 1.34 : 1.07, i % 2 && c0 ? clamp(c0[1], 560, 1360) : fx]); } }
    cam = []; seg.forEach((s, i) => { const t1 = i + 1 < seg.length ? seg[i + 1][0] - 0.05 : ctx.dur, cl = s[1] > 1.2; cam.push([s[0], s[1], s[2], cl ? 650 : 585], [Math.max(s[0] + 0.02, t1), s[1] * 1.06, s[2], cl ? 650 : 592]); }); }
  if (o.cap && !PK) { const [text, at, dur = 3] = o.cap, d = t - A(at); if (d > 0 && d < dur) S.over += `<g opacity="${f1(clamp(d / 0.3) * clamp((dur - d) / 0.3))}">` + kText(text, 960, 170, o.capFs || 64, { c: '#FFF2C8', stroke: '#14080A', sw: 10 }) + `</g>`; }
  return S.fin(bg, cam, Object.assign({ crowd: false }, (bg.P && bg.P.light === 'night') || (o.bg && o.bg.in) ? { light: bg.P.light, motes: !(o.bg && o.bg.in) } : {}, o.arm ? { armies: tqArm2(o.arm[0], o.arm[1], o.arm[2] || {}) } : {}, o.fin || {}));
}

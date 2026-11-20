// ===== KHUÔN CẢNH RIÊNG TẬP TÂY DU P1 (kế hoạch build/scene-plan.md, duyệt 2026-10-13) =====
// Dùng chung với sc_kit.js (tập 1): kFin, kText, kPop, kCam, kSung, kSG, kBubble, FIN, AT.
// Nhân vật: chChar(id, st, T) — Ngộ Không 'tnk_da' | 'tnk_hoc' | 'tnk_bmo' | 'tnk_tt'; còn lại chars_tdk.js. Đồ cầm tay xoay bằng TDK_ROT / TNK_STAFF_ROT.

EZ.quadOut = EZ.quadOut || (k => { k = clamp(k); return 1 - (1 - k) * (1 - k); });
EZ.quadInOut = EZ.quadInOut || (k => { k = clamp(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; });
const TK = { paper: '#F6ECD2', paper2: '#E8D8B4', red: '#B03A2E', gold: '#E2B23A', ink: INK2 };
// gọi chChar có xoay đồ cầm tay (rot) — trả chuỗi SVG
function tkChar(id, st, T) { const r0 = TDK_ROT, r1 = TNK_STAFF_ROT; TDK_ROT = st.rot ?? 0; TNK_STAFF_ROT = st.srot ?? -20; const s = chChar(id, st, T); TDK_ROT = r0; TNK_STAFF_ROT = r1; return s; }
// nhân vật chỉ ló phần trên (cắt dưới đường yCut) — dùng cho con khỉ bị núi đè, khỉ tắm suối…
function tkCut(svg, yCut, id = 'tkc') { return `<clipPath id="${id}"><rect x="-200" y="-400" width="2400" height="${yCut + 400}"/></clipPath><g clip-path="url(#${id})">${svg}</g>`; }
// nhảy/nảy: độ cao nảy (px) theo nhịp
const tkHop = (t, f = 3, h = 40) => -Math.abs(Math.sin(t * Math.PI * f)) * h;
// ô chữ (tấm thẻ giấy) — x,y tâm, w,h; o.rot, o.c nền, o.border
function tkCard(x, y, w, h, inner, k = 1, o = {}) {
  if (k <= 0) return '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(k)})"><rect x="${f1(-w / 2 + 8)}" y="${f1(-h / 2 + 10)}" width="${w}" height="${h}" rx="14" fill="#000" opacity="0.18"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="${o.c || TK.paper}" stroke="${INK2}" stroke-width="5"/>${o.border !== false ? `<rect x="${-w / 2 + 12}" y="${-h / 2 + 12}" width="${w - 24}" height="${h - 24}" rx="8" fill="none" stroke="${o.bc || TK.red}" stroke-width="2.5"/>` : ''}${inner}</g>`;
}
// mũi tên chú thích nét bút: từ (x0,y0) tới (x1,y1), vẽ dần theo k
function tkArrow(x0, y0, x1, y1, k = 1, c = TK.red, w = 6) {
  if (k <= 0) return ''; const mx = (x0 + x1) / 2 + (y1 - y0) * 0.2, my = (y0 + y1) / 2 - (x1 - x0) * 0.2, L = Math.hypot(x1 - x0, y1 - y0) * 1.2;
  const a = Math.atan2(y1 - my, x1 - mx), hx = Math.cos(a), hy = Math.sin(a);
  return `<path d="M${f1(x0)} ${f1(y0)} Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-dasharray="${f1(L)}" stroke-dashoffset="${f1(L * (1 - k))}"/>` + (k > 0.95 ? `<path d="M${f1(x1 - hx * 26 - hy * 14)} ${f1(y1 - hy * 26 + hx * 14)} L${f1(x1)} ${f1(y1)} L${f1(x1 - hx * 26 + hy * 14)} ${f1(y1 - hy * 26 - hx * 14)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : '');
}
// nhãn nhỏ có mũi tên chỉ vào vật
function tkTag(t, t0, txt, x, y, tx, ty, o = {}) {
  if (t < t0) return ''; const k = kPop(t, t0, 0.3), fs = o.fs || 38, w = txt.length * fs * 0.56 + 40;
  return tkArrow(x, y + (ty > y ? 30 : -30), tx, ty, FIN(t, t0 + 0.1, 0.35), o.c || TK.red, 5) + tkCard(x, y, w, fs + 34, kText(txt, 0, fs * 0.36, fs, { c: o.tc || INK2 }), k, { border: false, rot: o.rot || 0 });
}
// ===== bảng ĐƠN KIỆN (góc trên phải, câu đùa xuyên tập): n = số hiện tại; o.from: đếm từ số này tới n (o.t0 bắt đầu, o.step mỗi số); o.stamp: dấu đè
function tkDonKien(t, n, o = {}) {
  const x = o.x ?? 1680, y = o.y ?? 150, sc = o.sc ?? 1, t0 = o.t0 ?? 0.3, k = o.instant ? 1 : EZ.backOut(clamp((t - (o.pop ?? 0) ) / 0.4));
  let shown = n;
  if (o.from != null) { const step = o.step ?? 0.5; shown = Math.min(n, o.from + Math.max(0, Math.floor((t - t0) / step) + (t >= t0 ? 1 : 0))); if (t < t0) shown = o.from; }
  const bump = o.from != null && t >= t0 ? Math.max(0, 1 - ((t - t0) % (o.step ?? 0.5)) / 0.25) * (shown < n || (t - t0) < (n - o.from) * (o.step ?? 0.5) + 0.25 ? 1 : 0) : (o.bumpAt != null ? Math.max(0, 1 - Math.abs(t - o.bumpAt) / 0.25) : 0);
  let s = `<g transform="translate(${x} ${y}) scale(${f1(sc * k)}) rotate(4)">`;
  s += `<rect x="-150" y="-96" width="300" height="200" rx="10" fill="#000" opacity="0.2" transform="translate(8 10)"/><path d="M-150 -96 H150 V104 H-150Z" fill="#F4E6C4" stroke="${INK2}" stroke-width="5"/>`;
  s += `<rect x="-150" y="-96" width="300" height="56" fill="${TK.red}" stroke="${INK2}" stroke-width="5"/>` + kText('ĐƠN KIỆN', 0, -56, 40, { c: '#FFF4D6' });
  s += [0, 1, 2].map(i => `<path d="M-120 ${-10 + i * 20} h${i === 2 ? 60 : 110}" stroke="#B8A27A" stroke-width="4"/>`).join('');
  s += `<g transform="translate(70 40) scale(${f1(1 + 0.35 * bump)})">${kText(String(shown), 0, 36, 108, { c: TK.red, stroke: '#F4E6C4', sw: 8 })}</g>`;
  // chồng giấy phía sau tăng theo số
  for (let i = 1; i < Math.min(shown, 9); i++) s += `<path d="M${-150 + i * 3} 104 v${4 + i * 3} h300 v${-(4 + i * 3)}" fill="#E8D8B0" stroke="${INK2}" stroke-width="2.5" opacity="0.9"/>`;
  if (o.stamp && t >= o.stampAt) { const kk = clamp((t - o.stampAt) / 0.18), sc2 = lerp(2.2, 1, EZ.quartOut(kk)); s += `<g transform="translate(0 20) rotate(-14) scale(${f1(sc2)})" opacity="${f1(kk)}"><rect x="${f1(-o.stamp.length * 13 - 20)}" y="-38" width="${f1(o.stamp.length * 26 + 40)}" height="76" rx="8" fill="none" stroke="#C0392B" stroke-width="7"/>${kText(o.stamp, 0, 14, 38, { c: '#C0392B' })}</g>`; }
  if (o.note) s += kText(o.note, 0, 150, 26, { c: INK2, stroke: '#FFF8E6', sw: 6 });
  return s + '</g>';
}
// vòng ánh vàng (dùng cho mắt phát sáng, bảo vật)
const tkGlow = (x, y, r, c = '#FFE39A', k = 1) => `<g ${GL.add} opacity="${f1(k)}">${bloom(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}"/>`, c, 1)}</g>`;
// chữ tiêu đề lớn có viền (dùng cho màn tựa, tem)
const tkBig = (s, x, y, size, c = '#F2D16B', o = {}) => kText(s, x, y, size, { c, stroke: o.stroke || INK2, sw: o.sw || 14, op: o.op, font: o.font });
// tem đóng dấu (rơi từ to xuống), xoay nhẹ
function tkStamp(txt, x, y, t, t0, o = {}) {
  if (t < t0) return ''; const kk = clamp((t - t0) / 0.2), sc = lerp(2.4, 1, EZ.quartOut(kk)), fs = o.fs || 46, w = txt.length * fs * 0.6 + 50;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot ?? -8}) scale(${f1(sc)})" opacity="${f1(kk)}"><rect x="${f1(-w / 2)}" y="${f1(-fs * 0.85)}" width="${f1(w)}" height="${f1(fs * 1.7)}" rx="10" fill="${o.fill || 'rgba(255,248,230,0.85)'}" stroke="${o.c || '#C0392B'}" stroke-width="7"/>${kText(txt, 0, fs * 0.36, fs, { c: o.c || '#C0392B' })}</g>`;
}
// đám thiên binh nhỏ (bóng đơn giản, cầm giáo) chạy / đứng — dùng tdTroops ở sc_bg.js cho đứng dàn trận
function tkRunner(x, g, s, T, flip = false, c = '#5A6A9A', seed = 0) {
  const ph = T * 12 + seed, leg = Math.sin(ph) * 22, bob = Math.abs(Math.sin(ph)) * -8;
  return `<g transform="translate(${f1(x)} ${f1(g + bob)}) scale(${flip ? -s : s} ${s})"><path d="M-6 -70 L${f1(-14 + leg)} 0 M6 -70 L${f1(14 - leg)} 0" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M-26 -60 Q-30 -120 0 -128 Q30 -120 26 -60Z" fill="${c}" stroke="${INK2}" stroke-width="4"/><circle cx="4" cy="-146" r="22" fill="#E8C8A8" stroke="${INK2}" stroke-width="4"/><path d="M-20 -152 Q4 -186 28 -152Z" fill="#B8A040" stroke="${INK2}" stroke-width="3"/><circle cx="14" cy="-146" r="4" fill="${INK2}"/><path d="M-30 -110 L-90 -40" stroke="${INK2}" stroke-width="6"/><path d="M-30 -110 L-90 -40" stroke="#8A6A3A" stroke-width="3"/><path d="M-26 -116 l-14 -16 l-6 18Z" fill="#D8D8DC" stroke="${INK2}" stroke-width="2"/><path d="M-12 -100 q30 10 40 -6" stroke="${INK2}" stroke-width="4" fill="none"/>${[0, 1, 2].map(i => `<path d="M-50 ${-130 + i * 26} h-${30 + i * 10}" stroke="${INK2}" stroke-width="4" opacity="0.5"/>`).join('')}</g>`;
}
// thiên binh (nhân vật 'tb' của bộ nhân vật): chạy (run) hoặc đứng, cầm giáo
function tkSoldier(x, g, s, T, flip = false, run = true, ex = 'shock') { return tkChar('tb', { x, ground: g, scale: s, flip, legs: run ? 'run' : undefined, ex, arm: -40, hand: 'spear', rot: 80, shadow: false, seed: x * 0.01 }, T + x * 0.001); }
// khung tranh nhỏ (ô minh hoạ trong thẻ chữ): x,y tâm, w,h, nội dung vẽ trong toạ độ khung (0..w,0..h)
function tkPanel(x, y, w, h, inner, k = 1, o = {}) {
  if (k <= 0) return ''; const id = 'tkp' + Math.round(x) + '_' + Math.round(y);
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || 0}) scale(${f1(k)}) translate(${-w / 2} ${-h / 2})"><rect x="8" y="10" width="${w}" height="${h}" rx="12" fill="#000" opacity="0.2"/><clipPath id="${id}"><rect width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="${o.bg || '#F6ECD2'}"/>${inner}</g><rect width="${w}" height="${h}" rx="12" fill="none" stroke="${INK2}" stroke-width="6"/></g>`;
}
// thu nhỏ một nền 1920×1080 vào khung w×h (dùng trong tkPanel)
const tkMini = (svg, w, h, cx = 960, cy = 540, s = null) => { const sc = s ?? Math.max(w / 1920, h / 1080); return `<g transform="translate(${f1(w / 2)} ${f1(h / 2)}) scale(${f1(sc * 1000) / 1000}) translate(${-cx} ${-cy})">${svg}</g>`; };
// bóng thoại nhiều dòng: L = ['dòng 1', 'dòng 2'] (tự căn rộng theo dòng dài nhất)
function tkSay(x, y, L, t, t0, o = {}) {
  if (t < t0) return ''; const k = kPop(t, t0), fs = o.fs || 40, lh = fs * 1.25, n = L.length;
  const w = o.w || Math.min(1500, Math.max(...L.map(s => s.length)) * fs * 0.5 + 90), h = n * lh + 50, tx = o.tail ?? -w / 3, tb = h / 2;
  let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)})"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="30" fill="#FFFBF0" stroke="${INK2}" stroke-width="5"/>`;
  if (o.to) s += kTailTo(x, y, w, h, o.to);
  else if (o.tail !== null) s += `<path d="M${f1(tx - 24)} ${f1(tb - 4)} L${f1(tx + (o.tailDx ?? -40))} ${f1(tb + 54)} L${f1(tx + 24)} ${f1(tb - 4)}Z" fill="#FFFBF0" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><rect x="${f1(tx - 30)}" y="${f1(tb - 12)}" width="60" height="10" fill="#FFFBF0"/>`;
  L.forEach((ln, i) => { s += kText(ln, 0, -h / 2 + 25 + lh * (i + 0.5) + fs * 0.36, fs, { c: o.c && o.c[i] ? o.c[i] : INK2 }); });
  return s + `</g>`;
}
// ===== điểm trên mặt nhân vật → toạ độ màn hình (người dùng 2026-10-13: tia mắt, nước mắt, mồ hôi phải đúng chỗ) =====
function tkFacePt(st, hx, hy, T = 0) {
  const sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1, LH = st.legs ? chLegHeight(st.legs, T) : 0;
  const gy = (st.ground ?? 1090) + (st.y || 0) - LH * CH_BS * sc;
  const wx = (CH_HEAD[0] + hx) * fl * sc * (2 - sq), wy = (CH_HEAD[1] + CH_HEAD[2] + hy) * sc * sq, a = (st.lean || 0) * fl * Math.PI / 180;
  return [st.x + wx * Math.cos(a) - wy * Math.sin(a), gy + wx * Math.sin(a) + wy * Math.cos(a)];
}
const tkIsMonkey = (id) => !!(CHAR[id] && CHAR[id].monkey);
function tkEyes(id, st, T) { return tkIsMonkey(id) ? [tkFacePt(st, -30, 6, T), tkFacePt(st, 68, 6, T)] : [tkFacePt(st, -38, 18, T), tkFacePt(st, 64, 18, T)]; }
function tkMouth(id, st, T) { return tkIsMonkey(id) ? tkFacePt(st, 21, 106, T) : tkFacePt(st, 13, 96, T); }
// nước mắt chảy từ khoé mắt xuống má
function tkTears(id, st, T, o = {}) {
  const sc = st.scale || 1; let s = '';
  for (const [ex, ey] of tkEyes(id, st, T)) for (let i = 0; i < (o.n || 3); i++) { const u = (T * 1.1 + i / (o.n || 3) + ex * 0.001) % 1;
    s += `<path d="M${f1(ex)} ${f1(ey + 24 * sc + u * 170 * sc)} q${f1(-9 * sc)} ${f1(15 * sc)} 0 ${f1(24 * sc)} q${f1(9 * sc)} ${f1(-9 * sc)} 0 ${f1(-24 * sc)}Z" fill="#8ACBE8" stroke="${INK2}" stroke-width="2" opacity="${f1(1 - u * 0.8)}"/>`; }
  if (o.stream) for (const [ex, ey] of tkEyes(id, st, T)) s += `<path d="M${f1(ex)} ${f1(ey + 20 * sc)} q${f1(-6 * sc)} ${f1(60 * sc)} 0 ${f1(130 * sc)}" stroke="#8ACBE8" stroke-width="${f1(10 * sc)}" stroke-linecap="round" fill="none" opacity="0.85"/>`;
  return s;
}
// giọt mồ hôi bên thái dương (lăn xuống má)
function tkSweat(id, st, T, o = {}) {
  const sc = (st.scale || 1) * (o.k || 1); let s = '';
  for (let i = 0; i < (o.n || 2); i++) { const hx = i ? -112 : 146, hy = i ? -6 : -24, u = (T * 0.9 + i * 0.45) % 1, [x, y] = tkFacePt(st, hx, hy + u * 80, T);
    s += `<path d="M${f1(x)} ${f1(y)} q${f1(16 * sc)} ${f1(26 * sc)} 0 ${f1(40 * sc)} q${f1(-16 * sc)} ${f1(-14 * sc)} 0 ${f1(-40 * sc)}Z" fill="#CDEBFF" stroke="${INK2}" stroke-width="3" opacity="${f1(1 - u * 0.6)}"/>`; }
  return s;
}

// ===== bước đi bộ (chậm hơn 'run'): 'walk' | 'walkslow' — người dùng 2026-10-13 (lang thang giữa các quán, Đường Tăng bước chậm) =====
{ const _lp0 = chLegPose; chLegPose = function (kind, T) {
    if (kind === 'walk' || kind === 'walkslow') { const w = kind === 'walk' ? 6.5 : 3.4, p = Math.sin(T * w), q = Math.cos(T * w);
      const lg = (u, v) => [26 * u, 26 * u - 34 * Math.max(0, -u) - 8 * Math.max(0, v)];
      return [lg(p, q), lg(-p, -q), 130, 24]; }
    return _lp0(kind, T); }; }
// người qua đường bị lột áo: áo nâu như áo Ngộ Không mặc sau đó; sau khi bị lột còn áo lót trắng
CHAR.dan_ao = Object.assign({}, CHAR.tphu, { name: 'Người qua đường', robe: '#9A7A5A', robeS: '#7A5E42', trim: '#E8DCC8', sash: '#4A3622', inner: '#F2E8D6', headband: null, rags: 0 });
CHAR.dan_lot = Object.assign({}, CHAR.tphu, { name: 'Người bị lột áo', robe: '#F4F0E4', robeS: '#D6D0C0', trim: '#F4F0E4', sash: '#C8C0AE', inner: '#F4F0E4', headband: null, rags: 0 });
// nằm sõng soài: xoay cả người quanh chân (đầu sang trái nếu dir = -1)
function tkLying(id, st, T, dir = -1) {
  const g = st.ground ?? 1075, x = st.x;
  return `<ellipse cx="${f1(x + dir * 150 * (st.scale || 1))}" cy="${f1(g + 4)}" rx="${f1(300 * (st.scale || 1))}" ry="${f1(26 * (st.scale || 1))}" fill="#3A2416" opacity="0.18"/>` +
    `<g transform="rotate(${dir * 86} ${f1(x)} ${f1(g - 40 * (st.scale || 1))})">${tkChar(id, Object.assign({}, st, { shadow: false }), T)}</g>`;
}
// mặt ngủ: nhắm mắt, há miệng (người dùng 2026-10-13: ngủ thì nhắm mắt, miệng há chảy dãi)
CH_EXPR.ngu = ['closed', -8, 'o'];
// điểm (x, y) của nhân vật đứng → toạ độ khi nằm (cùng phép xoay với tkLying)
function tkLyingPt(st, p, dir = -1) {
  const a = dir * 86 * Math.PI / 180, cx = st.x, cy = (st.ground ?? 1075) - 40 * (st.scale || 1), dx = p[0] - cx, dy = p[1] - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}
// nước dãi từ khoé miệng chảy xuống (dài/ngắn theo nhịp thở)
function tkDrool(x, y, T, sc = 0.5) {
  const L = (40 + 30 * (0.5 + 0.5 * Math.sin(T * 1.6))) * sc * 2;
  return `<path d="M${f1(x)} ${f1(y)} q${f1(-6 * sc)} ${f1(L * 0.6)} ${f1(2 * sc)} ${f1(L)}" stroke="#CDEBFF" stroke-width="${f1(9 * sc)}" stroke-linecap="round" fill="none"/><circle cx="${f1(x + 2 * sc)}" cy="${f1(y + L + 6 * sc)}" r="${f1(10 * sc)}" fill="#CDEBFF" stroke="${INK2}" stroke-width="2"/>`;
}
CH_EXPR.angon = ['happy', -8, 'gape'];   // há miệng ăn ngon (dốc hồ lô)
CH_EXPR.flat = ['half', 10, 'flat'];   // mặt nghiêm lạnh (niệm chú, quay mặt đi) — trước đây thiếu nên rơi về mặt trơ
CH_EXPR.cry = ['pain', -22, 'cry', 'tear'];   // mếu khóc
CH_EXPR.painY = ['pain', -28, 'yell', 'tear'];   // đau thét: nhăn mắt, há miệng gào, nước mắt
// mặt khi bị niệm chú: xen kẽ gào thét / nghiến răng theo nhịp đau (người dùng 2026-10-19: mặt phải đau thật)
function tkPainEx(t, t0) { return Math.sin((t - t0) * 7 + 1.2) > -0.25 ? 'painY' : 'pain'; }
// ô phóng to mặt đang đau (cận cảnh để thấy rõ biểu cảm): vẽ cả đầu + hai tay ôm đầu trong khung kẹp
let _PI = 0;
function tkPainInset(id, t, t0, x, y, size, o = {}) {
  const k = kPop(t, t0, 0.25); if (k <= 0) return '';
  const cid = 'pin' + (_PI++), sc = o.scale || 1.3, g = y + 550 * sc - 55, shake = tkPainShake(t, t0) * 2;
  const face = tkChar(id, { x: x + shake, ground: g, scale: sc, flip: o.flip !== false, ex: tkPainEx(t, t0), arm: -165, back: 165, sweat: 1, headTilt: Math.sin((t - t0) * 31) * 5, hand: 'open', shadow: false }, t);
  const rays = Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2 + t * 2, r0 = size * 0.36, r1 = size * (0.46 + 0.04 * Math.sin(t * 20 + i)); return `<path d="M${f1(x + Math.cos(a) * r0)} ${f1(y + Math.sin(a) * r0)} L${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)}" stroke="#D03A2E" stroke-width="7" stroke-linecap="round"/>`; }).join('');
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)}) rotate(-2) translate(${f1(-x)} ${f1(-y)})"><rect x="${f1(x - size / 2 + 8)}" y="${f1(y - size / 2 + 10)}" width="${size}" height="${size}" rx="22" fill="#000" opacity="0.2"/><clipPath id="${cid}"><rect x="${f1(x - size / 2)}" y="${f1(y - size / 2)}" width="${size}" height="${size}" rx="22"/></clipPath><rect x="${f1(x - size / 2)}" y="${f1(y - size / 2)}" width="${size}" height="${size}" rx="22" fill="#F7D9B8"/><g clip-path="url(#${cid})"><circle cx="${x}" cy="${y}" r="${f1(size * 0.62)}" fill="#E9A07A" opacity="0.6"/>${face}</g><rect x="${f1(x - size / 2)}" y="${f1(y - size / 2)}" width="${size}" height="${size}" rx="22" fill="none" stroke="${INK2}" stroke-width="7"/></g>${k > 0.9 ? rays : ''}`;
}
const tkPainShake = (t, t0) => Math.sin((t - t0) * 31) * 4;
// cưỡi mây (đằng vân): thần tiên di chuyển trên trời đứng trên một cụm mây, có đuôi mây kéo sau — người dùng 2026-10-13
// trả về [sau, trước]: vẽ 'sau' trước nhân vật, 'trước' sau nhân vật (mép mây che chân)
function tkCloudRide(x, g, sc, T, dir = 1, o = {}) {
  const w = 230 * sc / 0.4, bob = Math.sin(T * 3) * 4, c = o.c || '#FFFFFF', y = g + bob;
  const trail = [0, 1, 2, 3].map(i => `<circle cx="${f1(x - dir * (w * 0.7 + i * w * 0.32))}" cy="${f1(y - 10 + i * 6)}" r="${f1(w * (0.26 - i * 0.05))}" fill="${c}" opacity="${f1(0.75 - i * 0.17)}"/>`).join('');
  const back = trail + tdPuffs([[x - w * 0.35, y - 4, w * 0.3], [x + w * 0.3, y - 6, w * 0.28]], c, 3);
  const front = tdPuffs([[x - w * 0.5, y + 14, w * 0.24], [x, y + 20, w * 0.3], [x + w * 0.48, y + 14, w * 0.24]], c, 3.5, { curl: true });
  return [back, front];
}
// bình tịnh thuỷ cầm ở ĐÁY (lòng tay đỡ đáy, bình đứng thẳng phía trên) — người dùng 2026-10-14; đặt st.rot = -arm để bình thẳng đứng
{ const _h1 = chHand; chHand = function (kind, c) {
    if (kind !== 'vaseUp') return _h1(kind, c);
    const r0 = TDK_ROT; TDK_ROT = 0; const v = _h1('vase', c), f = _h1('fist', c); TDK_ROT = r0;
    return `<g transform="rotate(${TDK_ROT})"><g transform="translate(0 -128)">${v.slice(f.length)}</g></g>` + f; }; }

// ===== BỘ ĐÁNH NHAU MỚI — tập xep-hang-cao-thu-thuy-hu (2026-11-10). người dùng: "các đoạn đánh nhau chưa được, cần làm lại".
// Chuẩn VISUAL_RULES §5: tối thiểu 3 nhịp (áp sát → giao chiêu → đòn kết); tay đặt mốc smK + vệt nhoè (smear) + giật lò xo;
// vệt binh khí (fmArc / fmThrust), tia lửa glowSparks ở chỗ chạm; máy quay đẩy vào, giật theo đòn, dí sát lúc trúng rồi nhả;
// khựng hình hitStop ≤ 0,14 s CHỈ ở đòn kết; người ngã nằm NGANG (±86°); ngựa phi có bụi + vệt tốc độ.
// Luật kênh: KHÔNG chớp trắng màn hình, không máu; LUẬT KHÔNG LẶP: mỗi lượt giao chiêu một đòn khác + một góc máy khác.
// Nạp sau sc_xh_kit.js (dùng thHorse, thC, tkHandPt, fmArc, fmThrust, glowSparks, shockRing, shakeMulti, fxDust, fxSpeed, smK, spring, kCam, tqSfx).

const xfQO = (k) => { k = clamp(k); return 1 - (1 - k) * (1 - k); };
// ---- góc binh khí tuỳ ý: st.wrot = góc tuyệt đối của cán (độ, 0 = dựng đứng, 90 = chĩa về phía mặt, 180 = chúc xuống).
// Mặc định của tập (TH_UPRIGHT) giữ binh khí dựng đứng bất kể tay → đánh nhau trông như cầm cờ. xfC đặt góc theo từng khung.
let XF_WROT = null;
{ const _a = chArm; chArm = function (c, ang, hand, front, T, o = {}) { if (XF_WROT == null) return _a(c, ang, hand, front, T, o); const p = TH_ROT; TH_ROT = -ang + XF_WROT; const r = _thArm0(c, ang, hand, front, T, o); TH_ROT = p; return r; }; }
function xfC(id, st, T) { const p = XF_WROT; XF_WROT = st.wrot ?? null; const r = thC(id, st, T); XF_WROT = p; return r; }
// cán theo hướng tay (+ lệch d độ): dùng khi đâm / chém
const xfAlong = (arm, d = 0) => 180 + arm + d;
// ---- nền trôi ngang (máy bám theo cuộc phi): lát nền gương nối nhau nên không lộ mối; off = số px đã trôi
function xfScroll(svg, off) {
  const o = ((off % 3840) + 3840) % 3840, i0 = Math.floor(o / 1920); let s = '';
  for (let i = i0; i <= i0 + 1; i++) { const x = i * 1920 - o, mir = i % 2 === 1; s += mir ? `<g transform="translate(${f1(x + 1920)} 0) scale(-1 1)">${svg}</g>` : `<g transform="translate(${f1(x)} 0)">${svg}</g>`; }
  return s;
}
// ---- đầu binh khí: vai + hướng tay * len (đơn vị nhân vật), có lean / flip / chân
function xfTip(id, st, T, len = 330) {
  const c = CHAR[id] || {}, sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1, a = (st.arm ?? 16) * Math.PI / 180;
  let lx = (CH_SH[0] * (c.bulk || 1) - Math.sin(a) * len) * CH_BS, ly = (CH_SH[1] + Math.cos(a) * len) * CH_BS;
  ly -= st.legs ? chLegHeight(st.legs, T) * CH_BS : 0;
  const L = (st.lean || 0) * fl * Math.PI / 180, wx = lx * fl * sc * (2 - sq), wy = ly * sc * sq;
  return [st.x + wx * Math.cos(L) - wy * Math.sin(L), (st.ground ?? 1090) + (st.y || 0) + wx * Math.sin(L) + wy * Math.cos(L)];
}
// vai (tâm vung) trong toạ độ cảnh
const xfShoulder = (id, st, T) => xfTip(id, st, T, 0);

// ---- NỬA NGƯỜI TRÊN NGỰA (người dùng 10/11: "các cảnh trên ngựa chỉ dùng nửa người"): cắt người cưỡi ở ngang hông, phần dưới chìm sau thân ngựa.
let XF_CP = 0;
let XF_HALF_K = 330;
let XF_SEAT = 140;   // mức B (người dùng 10/11): người cưỡi chân đứng, hạ thấp; phần dưới bị cắt theo ĐƯỜNG CONG lưng ngựa (xfHalfH), không cắt thẳng
// cắt người cưỡi theo mép trên thân ngựa (elip cx 0, cy -250, rx 170, ry 80 trong toạ độ ngựa), ngoài 2 đầu elip cắt ngang ở tâm elip
function xfHalfH(svg, x, gb, s) {
  const id = 'xfh' + (XF_CP++); let d = `M${f1(x - 4000)} -4000 L${f1(x + 4000)} -4000 L${f1(x + 4000)} ${f1(gb - 250 * s)} L${f1(x + 170 * s)} ${f1(gb - 250 * s)}`;
  for (let i = 0; i <= 40; i++) { const lx = 170 - i * 8.5; d += ` L${f1(x + lx * s)} ${f1(gb + (-250 - 80 * Math.sqrt(Math.max(0, 1 - (lx / 170) ** 2))) * s)}`; }
  d += ` L${f1(x - 4000)} ${f1(gb - 250 * s)}Z`;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${svg}</g>`;
}
function xfHalf(svg, cutY) { const id = 'xfh' + (XF_CP++); return `<clipPath id="${id}"><rect x="-4000" y="-4000" width="12000" height="${f1(cutY + 4000)}"/></clipPath><g clip-path="url(#${id})">${svg}</g>`; }
// ---- KỴ SĨ. o: x, g (mặt đất), s (cỡ ngựa ~0.9–1.1), face (+1 nhìn phải / -1 nhìn trái, số lẻ giữa = đang quay đầu),
//   horse (màu), run (0..1.4), st (trạng thái nhân vật: arm, hand, ex, lean, smear…),
//   fall: {t0, dur} → người rời yên, xoay nằm ngang, rơi xuống đất phía sau ngựa; ngựa chạy tiếp (o.runOff px/s).
// Trả { back, front, rider, st, tip(len) }
function xfRider(id, o, t) {
  const s = o.s || 0.95, face = o.face ?? 1, F = Math.abs(face) < 0.06 ? 0.06 * Math.sign(face || 1) : face, flip = F < 0;
  const H = thHorse(o.x, o.g, s, t, { run: o.run ?? 0.8, c: o.horse || '#8A5A3A', flip: false });
  const st = Object.assign({ x: o.x - 20 * s, ground: o.g - s * XF_SEAT + (H.bob || 0), scale: o.cs || s * 0.5, legs: 'stand', shadow: false, ex: 'fierce' }, o.st || {});
  if (st.hand === undefined) delete st.hand;   // không ghi đè binh khí mặc định của nhân vật
  const stW = Object.assign({}, st, { x: o.x + (st.x - o.x) * (flip ? -1 : 1), flip: !!flip ^ !!st.flip });   // trạng thái trong toạ độ cảnh (khi không quay dở)
  const rc0 = xfC(id, Object.assign({}, st), t); let rider = xfHalfH(o.post ? o.post(rc0) : rc0, o.x, o.g + (H.bob || 0), s), fallG = '';
  if (o.fall && t >= o.fall.t0) {
    const d = t - o.fall.t0, D = o.fall.dur || 0.55, u = clamp(d / D), e = EZ.quadIn(u), land = u >= 1;
    const drop = (s * XF_SEAT - (H.bob || 0)) * e, back = -(o.fall.back ?? 150) * xfQO(u), ang = -86 * (1 - Math.pow(1 - u, 3));
    const fx = st.x, fy = st.ground;
    const fxo = o.fall.x != null ? (o.fall.x - o.x) * (F < 0 ? -1 : 1) : 0, lift = -(o.fall.lift ?? 40) * u;
    rider = `<g transform="translate(${f1(back + fxo)} ${f1(drop + lift)}) rotate(${f1(ang)} ${f1(fx)} ${f1(fy)})">${xfC(id, Object.assign({}, st, { ex: o.fall.ex || 'pain', legs: 'stand', lean: 0, arm: lerp(st.arm ?? -30, -170, e), smear: null, hand: o.fall.drop ? 'fist' : st.hand, wrot: null }), t)}</g>`;
    if (land) { const lx = (o.fall.x ?? o.x) - (o.fall.back ?? 150); fallG = fxDust(t, o.fall.t0 + D, lx, o.g - 6, -1) + fxDust(t, o.fall.t0 + D, lx, o.g - 6, 1); }
    // người đã rơi thì vẽ ở lớp sau ngựa (ngựa chạy tiếp ra khỏi)
  }
  const wrap = (svg) => Math.abs(F) === 1 && !flip ? svg : `<g transform="translate(${f1(o.x)} 0) scale(${f1(F)} 1) translate(${f1(-o.x)} 0)">${svg}</g>`;
  const fallen = o.fall && t >= o.fall.t0 + (o.fall.dur || 0.55) * 0.5;
  return {
    back: wrap(H.back) + (fallen ? wrap(rider) + fallG : ''),
    front: wrap(H.front) + (fallen ? '' : wrap(rider)),
    st: stW, F,
    tip: (len = 330) => { const p = xfTip(id, Object.assign({}, st, { flip: false }), t, len); return [o.x + (p[0] - o.x) * F, p[1]]; },
  };
}

// ---- chỗ chạm binh khí: tia lửa nhỏ (không loé trắng), vòng sóng mảnh, chữ tiếng động. Trả chuỗi SVG.
function xfClash(t, t0, x, y, o = {}) {
  const d = t - t0; if (d < -0.01 || d > 0.9) return '';
  let s = glowSparks(t, t0, x, y, { n: o.n || 16, speed: o.speed || 900, c: o.c || '#FFC24A', dur: 0.5, dir: o.dir ?? 0, spread: o.spread ?? 360 });
  if (d < 0.35) { const k = EZ.expoOut(d / 0.35); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(20 + 90 * k)}" fill="none" stroke="#FFE7A0" stroke-width="${f1(8 * (1 - k) + 1)}" opacity="${f1(1 - k)}"/>`; }
  if (d < 0.12) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(18 * (1 - d / 0.12) + 6)}" fill="#FFF2C0"/>`;
  return s;
}
// ---- đòn trúng người (đòn kết): tia lửa toả + vòng xung kích dưới chân + chữ; không flash trắng
function xfHit(t, t0, x, y, o = {}) {
  const d = t - t0; if (d < 0 || d > 1.2) return '';
  return glowSparks(t, t0, x, y, { n: 26, speed: 1300, c: o.c || '#FFB45A', dur: 0.7, dir: o.dir ?? 0, spread: o.spread ?? 160 }) +
    shockRing(t, t0 + 0.02, x, (o.gy ?? y + 260), { r: 520, c: o.c || '#FFB45A', dur: 0.55 }) + radialLines(t, x, y, { n: 36, r0: 120, op: 0.55 * clamp(1 - d / 0.4), c: '#FFF4D8' });
}
// ---- máy quay theo mốc [[t, z, cx, cy], …] (smK) + rung; không lộ mép (kCam)
function xfCam(body, t, K, shakes = []) {
  const z = Math.max(1.03, smK(t, K.map(k => [k[0], k[1]]))), cx = smK(t, K.map(k => [k[0], k[2]])), cy = smK(t, K.map(k => [k[0], k[3]]));
  return kCam(body, t, z, cx, cy, shakeMulti(t, shakes));
}
// ---- cánh tay theo mốc: trả {arm, smear}
const xfArm = (t, K) => ({ arm: smK(t, K), smear: [smK(t - 0.03, K), smK(t - 0.06, K)] });
// ---- bụi vó ngựa liên tục khi phi (dir = -1 bụi bay về sau khi ngựa chạy sang phải)
function xfHooves(t, x, g, dir, run = 1) {
  if (run < 0.3) return ''; let s = '';
  for (let i = 0; i < 9; i++) { const ph = ((t * 3.4 + i / 9) % 1), px = x + dir * (80 + ph * 420) + (prand(i, 3) - 0.5) * 60, py = g - 10 - ph * 50, r = 18 + ph * 46;
    s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="#D9C6A0" opacity="${f1(0.65 * (1 - ph) * Math.min(1, run))}"/>`; }
  return s;
}

// ---- đầu binh khí thật: tay + hướng cán (wrot) * độ dài (≈ 920 px ở scale 1 cho thương; đao ≈ 860)
function xfWTip(id, st, T, L = 920) {
  const h = tkHandPt(id, st, T), w = ((st.wrot ?? 0) * (st.flip ? -1 : 1)) * Math.PI / 180, k = L * (st.scale || 1);
  return [h[0] + Math.sin(w) * k, h[1] - Math.cos(w) * k];
}
// ---- GIAO CHIÊU TRÊN NGỰA: mỗi lượt hai ngựa lao vào (bụi, vệt tốc độ) → MỘT đòn rõ ràng (binh khí chạm binh khí ở giữa, hai thân không chồng) → bật ra.
// Không lượt nào lặp đòn. A bên trái nhìn phải, B bên phải nhìn trái.
// A, B: {id, horse, hand, L}. spec: {t0, t1, passes: [{m, atk, sfx, dx}], g, s, far, near}
//   m: 'thrust' (bên tấn công đâm thẳng, bên kia gạt lên) | 'high' (chém vòng từ trên xuống, bên kia đỡ ngang trên đầu) |
//      'low' (quét ngang thấp, bên kia chặn xuống) | 'lock' (hai cán khoá chéo nhau, ghì, rung, rồi đẩy bật)
const XF_SFX = ['KENG!', 'CHOANG!', 'XOẢNG!', 'CẠCH!', 'KENG KENG!'];
const XF_POSE = {   // [tay, lệch cán so với tay] theo pha: chuẩn bị → vung/đâm (lúc chạm) → sau chạm
  thrust: { atk: [[-70, 0], [-60, 8], [-92, 0], [-88, 0]], def: [[-60, 0], [-80, 20], [-125, -35], [-120, -40]] },
  high: { atk: [[-80, 0], [-175, 10], [-110, 0], [-75, 0]], def: [[-60, 0], [-120, -60], [-150, -78], [-140, -70]] },
  low: { atk: [[-70, 0], [-25, -40], [-78, 0], [-110, 0]], def: [[-60, 0], [-50, 40], [-70, 60], [-60, 50]] },
  lock: { atk: [[-70, 0], [-150, 10], [-118, -30], [-115, -30]], def: [[-70, 0], [-150, 10], [-118, -30], [-115, -30]] },
};
function xfJoust(t, A, B, spec) {
  const P = spec.passes, n = P.length, T0 = spec.t0, D = (spec.t1 - T0) / n, g = spec.g ?? 1030, S = spec.s || 0.92;
  const k = clamp(Math.floor((t - T0) / D), 0, n - 1), u = clamp((t - T0 - k * D) / D), pass = P[k], lock = pass.m === 'lock';
  const cx = 960 + (pass.dx || 0), far = spec.far ?? 1050, near = spec.near ?? (lock ? 470 : 560);
  // khoảng cách: lao vào (0→0.45), chạm ở 0.45, giữ (lock tới 0.75), bật ra
  const uh = 0.45, ue = lock ? 0.78 : 0.55, tHit = T0 + k * D + D * uh;
  const gap = u < uh ? lerp(k === 0 ? far : far * 0.8, near, Math.pow(u / uh, 1.6)) : u < ue ? near - (lock ? 18 * Math.sin((u - uh) * 60) : 0) : lerp(near, far * 0.8, xfQO((u - ue) / (1 - ue)));
  const run = u < uh ? 1.3 : u < ue ? 0.2 : 0.7;
  const ph = [tHit - D * uh, tHit - 0.16, tHit, tHit + (lock ? D * (ue - uh) : 0.3)];
  const pose = (who) => { const Q = XF_POSE[pass.m][who]; const arm = smK(t, ph.map((p, i) => [p, Q[i][0]])), off = smK(t, ph.map((p, i) => [p, Q[i][1]]));
    return { arm, wrot: xfAlong(arm, off), smear: [smK(t - 0.03, ph.map((p, i) => [p, Q[i][0]])), smK(t - 0.06, ph.map((p, i) => [p, Q[i][0]]))] }; };
  const atkA = pass.atk !== 'B';
  const exA = t > tHit - 0.35 && t < tHit + 0.5 ? (atkA ? 'yell' : 'grit') : 'fierce', exB = t > tHit - 0.35 && t < tHit + 0.5 ? (!atkA ? 'yell' : 'grit') : 'fierce';
  const recoil = (who) => (spring(t, tHit, 20, 7) * 14) * (who === (atkA ? 'A' : 'B') ? 0.4 : 1);
  const xA = cx - gap / 2 - recoil('A'), xB = cx + gap / 2 + recoil('B');
  const RA = xfRider(A.id, { x: xA, g, s: S, face: 1, horse: A.horse, run, st: { hand: A.hand || (CHAR[A.id] || {}).hand, ex: exA, lean: u < uh ? 10 : -4 * bump(t, tHit, 0.4), ...pose(atkA ? 'atk' : 'def') } }, t);
  const RB = xfRider(B.id, { x: xB, g: g - 14, s: S * 0.97, face: -1, horse: B.horse, run, st: { hand: B.hand || (CHAR[B.id] || {}).hand, ex: exB, lean: u < uh ? 10 : -4 * bump(t, tHit, 0.4), ...pose(atkA ? 'def' : 'atk') } }, t);
  const tipA = xfWTip(A.id, RA.st, t, (A.L || 920) * 0.5 / 0.5), tipB = xfWTip(B.id, RB.st, t, B.L || 920);
  // điểm chạm: giữa hai bàn tay, cao ngang ngực–đầu
  const hA = tkHandPt(A.id, RA.st, t), hB = tkHandPt(B.id, RB.st, t), px = (hA[0] + hB[0]) / 2, py = Math.min(hA[1], hB[1]) - (pass.m === 'high' || lock ? 120 : pass.m === 'low' ? -40 : 40);
  let fx = '';
  const at = atkA ? RA : RB, f = atkA ? 1 : -1, hh = atkA ? hA : hB;
  if (pass.m === 'thrust') fx += fmThrust(t, tHit - 0.1, hh[0] - 120 * f, hh[1], px + 40 * f, py, { w: 24, c: '#FFE7A0' });
  else if (pass.m === 'high') fx += fmArc(t, tHit - 0.16, hh[0], hh[1] + 60, 300 * S, f > 0 ? -160 : -20, f > 0 ? -30 : -150, { dur: 0.16, c: '#FFE7A0', w: 44 });
  else if (pass.m === 'low') fx += fmArc(t, tHit - 0.14, hh[0], hh[1] - 80, 280 * S, f > 0 ? 120 : 60, f > 0 ? 10 : 170, { dur: 0.14, c: '#FFE7A0', w: 38 });
  else fx += fmArc(t, tHit - 0.16, hA[0], hA[1] + 40, 260 * S, -160, -70, { dur: 0.16, c: '#FFE7A0', w: 34 }) + fmArc(t, tHit - 0.16, hB[0], hB[1] + 40, 260 * S, -20, -110, { dur: 0.16, c: '#FFE7A0', w: 34 });
  fx += xfClash(t, tHit, px, py, { n: 18 });
  if (lock && t > tHit + 0.1 && t < tHit + D * (ue - uh)) fx += glowSparks(t, tHit + 0.1 + Math.floor((t - tHit - 0.1) / 0.2) * 0.2, px, py, { n: 5, dur: 0.22, speed: 420, c: '#FFD27A' });
  if (spec.sfx !== false) fx += tqSfx(pass.sfx || XF_SFX[k % XF_SFX.length], px + (pass.sfxDx ?? (k % 2 ? 150 : -150)), Math.max(150, py - 260), t, tHit, { fs: 58, life: 0.7, rot: k % 2 ? 6 : -6 });
  const dust = xfHooves(t, xA, g, -1, run) + xfHooves(t, xB, g - 14, 1, run) + (u < uh ? fxSpeed(t, 0.5 * (1 - u / uh), 700, 1000, 1) : '');
  return { back: dust + RB.back + RA.back, front: RB.front + RA.front + fx, tHit, k, u, cx: px, cy: py, xA, xB, RA, RB,
    events: P.map((pp, i) => T0 + i * D + D * uh) };
}

// ---- mặt đất trôi khi máy bám theo cuộc đuổi (cỏ, đá nhỏ chạy ngược chiều phi) — nền vẫn đứng, chỉ lớp đất gần trôi
function xfGroundScroll(t, speed, g, o = {}) {
  let s = ''; const n = o.n || 34;
  for (let i = 0; i < n; i++) {
    const x = ((prand(i, 41) * 2300 - (o.off ?? t * speed)) % 2300 + 2300) % 2300 - 190, y = g + 4 + prand(i, 42) * 70, k = 0.9 + prand(i, 43) * 1.1;
    s += prand(i, 44) < 0.5 ? `<path d="M${f1(x)} ${f1(y)} l${f1(-8 * k)} ${f1(-26 * k)} M${f1(x + 10 * k)} ${f1(y)} l0 ${f1(-34 * k)} M${f1(x + 20 * k)} ${f1(y)} l${f1(8 * k)} ${f1(-24 * k)}" stroke="#4E7A3A" stroke-width="${f1(5 * k)}" stroke-linecap="round"/>`
      : `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(16 * k)}" ry="${f1(9 * k)}" fill="#B8A88C" stroke="${INK2}" stroke-width="3"/>`;
  }
  return s;
}
// ---- cọc cờ tiền cảnh lướt qua (máy bám theo cuộc phi) — nền xa đứng yên, tiền cảnh trôi nhanh: không lộ nền lặp
function xfPostsScroll(off, g, o = {}) {
  let s = ''; const gap = o.gap || 1100, n = 3;
  for (let i = 0; i < n; i++) {
    const x = ((i * gap + 400 - off * 1.4) % (gap * n) + gap * n) % (gap * n) - 300, c = ['#B03A2E', '#3A3236', '#C99A3E'][i % 3];
    s += `<g transform="translate(${f1(x)} ${g - 60}) scale(0.9)"><rect x="-11" y="-480" width="22" height="480" fill="#7A5A3A" stroke="${INK2}" stroke-width="6"/><path d="M11 -470 L140 -456 L126 -404 L140 -350 L11 -362Z" fill="${c}" stroke="${INK2}" stroke-width="7" stroke-linejoin="round"/></g>`;
  }
  return s;
}
// ---- thời gian chậm lại quanh khoảnh khắc quyết định: trả t' (chậm hệ số k trong [t0, t1], liên tục)
function xfRamp(t, t0, t1, k = 0.3) { if (t <= t0) return t; if (t <= t1) return t0 + (t - t0) * k; return t0 + (t1 - t0) * k + (t - t1); }

// ---- tư thế chân tuỳ ý cho đòn đá: st.legs = [[đùi trái, cẳng trái], [đùi phải, cẳng phải], vạt, loe] (độ, dương = về trước)
// (bọc chLegPose của pack ngay trong gói cảnh tập này — không sửa file pack dùng chung)
{ const _base = chLegPose; chLegPose = function (kind, T) { return Array.isArray(kind) ? kind : _base(kind, T); }; }
const XF_LEG = {
  guard: [[-24, -6], [26, 12], 120, 40],          // thủ thế
  chamber: [[70, -40], [-6, 0], 110, 44],         // co gối trước khi đá
  kickMid: [[96, 92], [-14, -2], 100, 50],        // đá thẳng ngang bụng
  kickHigh: [[150, 158], [-18, -4], 96, 56],      // đá vút lên trán
  land: [[-30, -10], [34, 20], 120, 44],
};
// nội suy hai tư thế chân (k 0..1)
const xfLegMix = (a, b, k) => [[lerp(a[0][0], b[0][0], k), lerp(a[0][1], b[0][1], k)], [lerp(a[1][0], b[1][0], k), lerp(a[1][1], b[1][1], k)], lerp(a[2], b[2], k), lerp(a[3], b[3], k)];
// chuỗi tư thế chân theo mốc [[t, tên], …]
function xfLegs(t, K) {
  if (t <= K[0][0]) return XF_LEG[K[0][1]];
  for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { const k = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); return xfLegMix(XF_LEG[K[i][1]], XF_LEG[K[i + 1][1]], EZ.expoOut(k)); }
  return XF_LEG[K[K.length - 1][1]];
}
// xoáy người (nhân vật luôn nhìn ra máy nên xoay = lật trái/phải nhanh + vệt cuộn quanh người)
function xfSpinFx(t, t0, x, y, o = {}) {
  const d = t - t0, D = o.dur || 0.35; if (d < 0 || d > D + 0.25) return '';
  return fmArc(t, t0, x, y, o.r || 150, o.a0 ?? 200, o.a1 ?? -160, { dur: D, c: o.c || '#FFE7A0', w: 30 }) + fmArc(t, t0 + 0.05, x, y + 60, (o.r || 150) * 0.8, (o.a0 ?? 200) + 30, (o.a1 ?? -160) + 30, { dur: D, c: '#FFFFFF', w: 18 });
}

// ---- chân đá vẽ đè (chân chibi ngắn, bị vạt áo che): đùi + cẳng + giày từ hông tới mục tiêu. ang: 0 = chúc xuống, 90 = ngang trước, 150 = vút lên.
// k 0..1 = độ duỗi (0 co gối sát người, 1 duỗi thẳng). Trả SVG, vẽ SAU nhân vật.
function xfKickLeg(id, st, k, ang, o = {}) {
  const c = CHAR[id] || {}, sc = st.scale || 1, fl = st.flip ? -1 : 1, P = c.pants || mixC(c.robeS || '#333333', '#000000', 0.25), SH = c.shoe || '#2E2630';
  const hip = [st.x + fl * 26 * sc, (st.ground ?? 1090) + (st.y || 0) - (o.hipH ?? 380) * sc], L = (o.L ?? 600) * sc, a = ang * Math.PI / 180;
  const kneeA = a - (1 - k) * 1.3, kneeL = L * 0.5, footL = L * 0.5;
  const kx = hip[0] + fl * Math.sin(kneeA) * kneeL, ky = hip[1] + Math.cos(kneeA) * kneeL;
  const fa = a + (1 - k) * 1.6, fx = kx + fl * Math.sin(fa) * footL, fy = ky + Math.cos(fa) * footL, w = 74 * sc;
  const d = `M${f1(hip[0])} ${f1(hip[1])} L${f1(kx)} ${f1(ky)} L${f1(fx)} ${f1(fy)}`;
  const sa = Math.atan2(fy - ky, fx - kx) * 180 / Math.PI;
  return `<path d="${d}" stroke="${INK2}" stroke-width="${f1(w + 10)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${P}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<g transform="translate(${f1(fx)} ${f1(fy)}) rotate(${f1(sa)})"><ellipse cx="${f1(18 * sc)}" cy="0" rx="${f1(78 * sc)}" ry="${f1(40 * sc)}" fill="${SH}" stroke="${INK2}" stroke-width="5"/></g>`;
}
const xfFoot = (id, st, k, ang, o = {}) => { const sc = st.scale || 1, fl = st.flip ? -1 : 1, hip = [st.x + fl * 26 * sc, (st.ground ?? 1090) - (o.hipH ?? 380) * sc], L = (o.L ?? 600) * sc, a = ang * Math.PI / 180; return [hip[0] + fl * Math.sin(a) * L * (0.6 + 0.4 * k), hip[1] + Math.cos(a) * L * (0.6 + 0.4 * k)]; };

// ---- VÒNG XOÁY NHIỀU KỴ SĨ: kỵ sĩ chạy trên một vòng elip quanh tâm (trước to, sau nhỏ, sắp lớp theo chiều sâu), quay đầu ở hai mép;
// mỗi "lượt chạm" (events: [{t, a, b, m}]) hai người a, b vung binh khí vào nhau ở giữa → tia lửa + chữ. Bụi cuộn thành vành quanh vòng.
// R: [{id, horse, ph (pha ban đầu, rad)}]. o: {cx, cy, rx, ry, w (rad/s), t0, s}
function xfMelee(t, R, events, o = {}) {
  const cx = o.cx ?? 960, cy = o.cy ?? 960, rx = o.rx ?? 420, ry = o.ry ?? 70, w = o.w ?? 1.6, t0 = o.t0 ?? 0, S = o.s ?? 0.9;
  const P = R.map((r, i) => { const ph = r.ph + w * Math.max(0, t - t0), sn = Math.sin(ph), x = cx + Math.cos(ph) * rx, gy = cy + sn * ry, dir = -Math.sign(Math.sin(ph)) || 1;
    return { ...r, i, ph, x, gy, d: sn, s: S * (0.86 + 0.14 * (sn + 1) / 2), face: dir }; });
  // tư thế tay theo lượt chạm gần nhất của từng người
  const armOf = (i) => { let K = [[t0 - 1, -60]]; let wo = 0;
    events.forEach(e => { if (e.a !== i && e.b !== i) return; const atk = e.a === i, m = e.m || 'high', Q = XF_POSE[m][atk ? 'atk' : 'def'];
      [e.t - 0.45, e.t - 0.14, e.t, e.t + 0.3].forEach((tt, j) => K.push([tt, Q[j][0]])); });
    K.sort((a, b) => a[0] - b[0]); const arm = smK(t, K); return { arm, wrot: xfAlong(arm), smear: [smK(t - 0.03, K), smK(t - 0.06, K)] }; };
  let back = '', front = '', fx = '';
  // vành bụi phía sau
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * 0.9, sn = Math.sin(a); if (sn > 0) continue; const x = cx + Math.cos(a) * (rx + 60), y = cy + sn * ry - 10; back += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(120 + 40 * prand(i, 5))}" ry="${f1(50 + 20 * prand(i, 6))}" fill="#E2D2AE" opacity="0.5"/>`; }
  const H = {};
  P.slice().sort((a, b) => a.d - b.d).forEach(p => {
    const rd = xfRider(p.id, { x: p.x, g: p.gy, s: p.s, face: p.face, horse: p.horse, run: 1.2, st: { hand: p.hand || (CHAR[p.id] || {}).hand, ex: p.ex || 'fierce', lean: 8, ...armOf(p.i) } }, t);
    H[p.i] = rd; back += rd.back + xfHooves(t, p.x, p.gy, -p.face, 1.2); back += rd.front;
  });
  events.forEach((e, k) => { if (!H[e.a] || !H[e.b]) return; const ha = tkHandPt(R[e.a].id, H[e.a].st, t), hb = tkHandPt(R[e.b].id, H[e.b].st, t), px = (ha[0] + hb[0]) / 2, py = Math.min(ha[1], hb[1]) - 80;
    fx += xfClash(t, e.t, px, py, { n: 18 }) + (e.sfx ? tqSfx(e.sfx, px + (k % 2 ? 160 : -160), Math.max(160, py - 240), t, e.t, { fs: 56, life: 0.7, rot: k % 2 ? 6 : -6 }) : '');
    if (e.m === 'thrust') fx += fmThrust(t, e.t - 0.1, ha[0], ha[1], px, py, { w: 22, c: '#FFE7A0' }); else fx += fmArc(t, e.t - 0.15, ha[0], ha[1] + 60, 240, -160, -40, { dur: 0.15, c: '#FFE7A0', w: 38 }); });
  // vành bụi phía trước
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * 0.9, sn = Math.sin(a); if (sn <= 0) continue; const x = cx + Math.cos(a) * (rx + 80), y = cy + sn * ry + 40; front += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(130 + 40 * prand(i, 7))}" ry="${f1(46 + 18 * prand(i, 8))}" fill="#E8DCC0" opacity="0.55"/>`; }
  return { back, front: front + fx, P, H };
}

// ---- MỘT ĐẤU HAI (hay nhiều) TRÊN NGỰA: người giữa (C) đứng giữa sân xoay hướng đón đòn; những người còn lại phi vòng quanh trên elip,
// được canh pha để ĐÚNG lúc chạm thì người tấn công ở ngang hông người giữa (không chồng hình); người giữa lật hướng đón trước 0,3 s.
// C: {id, horse}; O: [{id, horse}], events: [{t, who (chỉ số trong O), m, sfx}] (event đầu tiên who=0 ở bên trái), o: {cx, cy, rx, ry, s}
function xfOneVsMany(t, C, O, events, o = {}) {
  const cx = o.cx ?? 960, cy = o.cy ?? 980, rx = o.rx ?? 560, ry = o.ry ?? 90, S = o.s ?? 0.92, n = O.length;
  const e0 = events[0].t, gap = events.length > 1 ? events[1].t - e0 : 1.2, w = Math.PI / gap;   // nửa vòng giữa hai lượt
  const P = O.map((r, i) => { const ph = Math.PI + i * (2 * Math.PI / n) + w * (t - e0), sn = Math.sin(ph);
    return { ...r, i, ph, x: cx + Math.cos(ph) * rx, gy: cy + sn * ry, d: sn, s: S * (0.78 + 0.22 * (sn + 1) / 2), face: -Math.sign(sn) || 1 }; });
  // người tấn công ở lượt k: ai đang ở gần mép trái/phải lúc event → hướng người giữa
  const cur = events.reduce((a, e) => (t > e.t - 0.35 ? e : a), events[0]);
  const side = (e) => Math.sign(Math.cos(Math.PI + e.who * (2 * Math.PI / n) + w * (e.t - e0))) || -1;
  const cFace = side(cur);
  const poseK = (who) => { let K = [[-9, -60]], W = [[-9, 0]];
    events.forEach(e => { const atk = who === 'C' ? false : e.who === who, inv = who === 'C' || e.who === who; if (!inv) return; const Q = XF_POSE[e.m || 'high'][atk ? 'atk' : 'def'];
      [e.t - 0.45, e.t - 0.14, e.t, e.t + 0.3].forEach((tt, j) => { K.push([tt, Q[j][0]]); W.push([tt, Q[j][1]]); }); });
    const arm = smK(t, K), off = smK(t, W); return { arm, wrot: xfAlong(arm, off), smear: [smK(t - 0.03, K), smK(t - 0.06, K)] }; };
  let back = '', front = '', fx = '';
  // vành bụi
  const dustRing = (frontSide) => { let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t * 1.1, sn = Math.sin(a); if ((sn > 0) !== frontSide) continue;
    d += `<ellipse cx="${f1(cx + Math.cos(a) * (rx + 40))}" cy="${f1(cy + sn * ry + (frontSide ? 50 : -20))}" rx="${f1(130 + 40 * prand(i, 5))}" ry="${f1(46 + 18 * prand(i, 6))}" fill="#E4D6B4" opacity="${frontSide ? 0.5 : 0.45}"/>`; } return d; };
  back += dustRing(false);
  const RC = xfRider(C.id, { x: cx, g: cy, s: S, face: cFace, horse: C.horse, run: 0.5, st: { hand: C.hand || (CHAR[C.id] || {}).hand, ex: t > cur.t - 0.3 && t < cur.t + 0.5 ? 'yell' : 'grit', ...poseK('C') } }, t);
  const H = {};
  const list = P.map(p => ({ d: p.d, draw: () => { const r = xfRider(p.id, { x: p.x, g: p.gy, s: p.s, face: p.face, horse: p.horse, run: 1.2, st: { hand: p.hand || (CHAR[p.id] || {}).hand, ex: 'fierce', lean: 10, ...poseK(p.i) } }, t); H[p.i] = r; return xfHooves(t, p.x, p.gy, -p.face, 1.2) + r.back + r.front; } }));
  list.push({ d: 0, draw: () => RC.back + RC.front });
  // màn bụi dày ngang thân ngựa chen giữa lớp xa và lớp gần: người ở xa mờ đi, đúng "giữa đám bụi"
  const midDust = () => { let d = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + t * 1.3; d += `<ellipse cx="${f1(cx + Math.cos(a) * rx * 0.9)}" cy="${f1(cy - 170 + Math.sin(a * 2) * 40)}" rx="${f1(170 + 50 * prand(i, 9))}" ry="${f1(90 + 30 * prand(i, 10))}" fill="#E4D6B4" opacity="0.42"/>`; } return d; };
  let dusted = false;
  list.sort((a, b) => a.d - b.d).forEach(L => { if (!dusted && L.d >= -0.05) { back += midDust(); dusted = true; } back += L.draw(); });
  events.forEach((e, k) => { const R = H[e.who]; if (!R) return; const ha = tkHandPt(O[e.who].id, R.st, t), hc = tkHandPt(C.id, RC.st, t), px = (ha[0] + hc[0]) / 2, py = Math.min(ha[1], hc[1]) - 70;
    fx += xfClash(t, e.t, px, py, { n: 18 });
    if (e.sfx) fx += tqSfx(e.sfx, px + (px < cx ? -120 : 120), Math.max(160, py - 240), t, e.t, { fs: 58, life: 0.7, rot: k % 2 ? 6 : -6 });
    if (e.m === 'thrust') fx += fmThrust(t, e.t - 0.1, ha[0], ha[1], px, py, { w: 22, c: '#FFE7A0' }); else fx += fmArc(t, e.t - 0.15, ha[0], ha[1] + 60, 220, px < ha[0] ? -20 : -160, px < ha[0] ? -150 : -30, { dur: 0.15, c: '#FFE7A0', w: 36 }); });
  front += dustRing(true) + fx;
  return { back, front, P, H, RC };
}

// ---- hòn đá bay: từ a tới b trong [t0, t1], to, có vệt + quầng; o.hold: hòn đá nằm trong tay trước t0
function xfStone(t, t0, t1, a, b, o = {}) {
  if (t < t0 || t > t1) return '';
  const u = clamp((t - t0) / Math.max(0.05, t1 - t0)), x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * (o.arc ?? 40), u0 = Math.max(0, u - 0.35);
  const tx = lerp(a[0], b[0], u0), ty = lerp(a[1], b[1], u0) - Math.sin(u0 * Math.PI) * (o.arc ?? 40), r = o.r || 30;
  return `<path d="M${f1(tx)} ${f1(ty)} L${f1(x)} ${f1(y)}" stroke="#FFF6D8" stroke-width="${f1(r * 0.7)}" stroke-linecap="round" opacity="0.75"/>` + glowDot(x, y, r * 0.8, '#FFE7A0', 0.6) +
    `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${r}" ry="${f1(r * 0.78)}" fill="#D8D4CC" stroke="${INK2}" stroke-width="5"/><path d="M${f1(x - r * 0.4)} ${f1(y - r * 0.25)} q${f1(r * 0.35)} ${f1(-r * 0.22)} ${f1(r * 0.7)} 0" stroke="#FFFFFF" stroke-width="4" fill="none"/>`;
}
// ---- tư thế ném của Trương Thanh (mỗi kiểu một lần — không lặp): 'over' ném vòng trên đầu · 'side' ném ngang hông · 'under' hất từ dưới lên · 'snap' búng cổ tay nhanh
function xfThrowArm(t, tRel, kind) {
  const K = { over: [[-0.5, -40], [-0.25, -170], [-0.08, -160], [0, -95], [0.4, -80], [0.9, -40]],
    side: [[-0.5, -40], [-0.25, 10], [-0.08, 20], [0, -95], [0.4, -100], [0.9, -40]],
    under: [[-0.5, -40], [-0.25, 30], [-0.08, 40], [0, -120], [0.4, -140], [0.9, -40]],
    snap: [[-0.5, -50], [-0.15, -110], [-0.05, -120], [0, -80], [0.3, -85], [0.9, -40]] }[kind];
  return xfArm(t, K.map(([d, a]) => [tRel + d, a]));
}

// ---- GIAO CHIÊU ĐÁNH BỘ: mỗi lượt một người lướt tới (hậu ảnh nhẹ, bụi chân) → MỘT đòn (đâm / chém trên / quét thấp / khoá) → bên kia đỡ → bật lùi.
// A bên trái nhìn phải, B bên phải nhìn trái. A, B: {id, hand?, backHand?, sc}. spec: {t0, t1, passes: [{m, atk, sfx}], g, near, far}
function xfFootBout(t, A, B, spec) {
  const P = spec.passes, n = P.length, T0 = spec.t0, D = (spec.t1 - T0) / n, g = spec.g ?? 1050;
  const k = clamp(Math.floor((t - T0) / D), 0, n - 1), u = clamp((t - T0 - k * D) / D), pass = P[k], lock = pass.m === 'lock', atkA = pass.atk !== 'B';
  const far = spec.far ?? 620, near = spec.near ?? (lock ? 300 : 360), uh = 0.42, ue = lock ? 0.75 : 0.55, tHit = T0 + k * D + D * uh, cx = 960 + (pass.dx || 0);
  const gap = u < uh ? lerp(far, near, Math.pow(u / uh, 1.8)) : u < ue ? near : lerp(near, far, xfQO((u - ue) / (1 - ue)));
  // người tấn công lướt nhiều hơn, người đỡ lùi ít
  const share = atkA ? 0.75 : 0.25, xA = cx - gap * (atkA ? 1 - share : share) - (gap * 0.5 - gap * (atkA ? 1 - share : share)) - gap * 0 , xA2 = cx - gap / 2 + (atkA ? -1 : 1) * 0, xB2 = cx + gap / 2;
  const ph = [tHit - D * uh, tHit - 0.16, tHit, tHit + (lock ? D * (ue - uh) : 0.3)];
  const pose = (who) => { const Q = XF_POSE[pass.m][who]; const K = ph.map((p, i) => [p, Q[i][0]]), W = ph.map((p, i) => [p, Q[i][1]]); const arm = smK(t, K); return { arm, wrot: xfAlong(arm, smK(t, W)), smear: [smK(t - 0.03, K), smK(t - 0.06, K)] }; };
  const dash = u < uh && u > 0.15, sA = A.sc || 0.62, sB = B.sc || 0.62;
  const stA = Object.assign({ x: xA2, ground: g, scale: sA, ex: t > tHit - 0.35 && t < tHit + 0.5 ? (atkA ? 'yell' : 'grit') : 'fierce', legs: dash && atkA ? 'run' : 'stance', lean: dash && atkA ? 14 : -6 * bump(t, tHit, 0.4) }, A.hand ? { hand: A.hand } : {}, A.backHand ? { backHand: A.backHand } : {}, pose(atkA ? 'atk' : 'def'));
  const stB = Object.assign({ x: xB2, ground: g, scale: sB, flip: true, ex: t > tHit - 0.35 && t < tHit + 0.5 ? (!atkA ? 'yell' : 'grit') : 'fierce', legs: dash && !atkA ? 'run' : 'stance', lean: dash && !atkA ? 14 : -6 * bump(t, tHit, 0.4) }, B.hand ? { hand: B.hand } : {}, B.backHand ? { backHand: B.backHand } : {}, pose(atkA ? 'def' : 'atk'));
  let s = '';
  if (dash) { const at = atkA ? A : B, st = atkA ? stA : stB; s += afterimages(tx => thC(at.id, Object.assign({}, st, { smear: null, shadow: false }), tx), t, 3, 0.04, '#E8D6A8') + fxDust(t, T0 + k * D + D * 0.15, st.x + (atkA ? -80 : 80), g - 6, atkA ? -1 : 1); }
  s += xfC(A.id, stA, t) + xfC(B.id, stB, t);
  const hA = tkHandPt(A.id, stA, t), hB = tkHandPt(B.id, stB, t), px = (hA[0] + hB[0]) / 2, py = Math.min(hA[1], hB[1]) - (pass.m === 'high' || lock ? 90 : pass.m === 'low' ? -40 : 30);
  const hh = atkA ? hA : hB, f = atkA ? 1 : -1;
  if (pass.m === 'thrust') s += fmThrust(t, tHit - 0.1, hh[0] - 100 * f, hh[1], px + 30 * f, py, { w: 20, c: '#FFE7A0' });
  else if (pass.m === 'high') s += fmArc(t, tHit - 0.15, hh[0], hh[1] + 50, 220, f > 0 ? -160 : -20, f > 0 ? -30 : -150, { dur: 0.15, c: '#FFE7A0', w: 38 });
  else if (pass.m === 'low') s += fmArc(t, tHit - 0.13, hh[0], hh[1] - 60, 200, f > 0 ? 120 : 60, f > 0 ? 10 : 170, { dur: 0.13, c: '#FFE7A0', w: 32 });
  s += xfClash(t, tHit, px, py, { n: 16 });
  if (lock && t > tHit + 0.1 && t < tHit + D * (ue - uh)) s += glowSparks(t, tHit + 0.1 + Math.floor((t - tHit - 0.1) / 0.2) * 0.2, px, py, { n: 5, dur: 0.2, speed: 400, c: '#FFD27A' });
  if (pass.sfx) s += tqSfx(pass.sfx, px + (k % 2 ? 160 : -160), Math.max(160, py - 240), t, tHit, { fs: 56, life: 0.7, rot: k % 2 ? 6 : -6 });
  return { svg: s, tHit, events: P.map((pp, i) => T0 + i * D + D * uh), stA, stB, cx: px, cy: py };
}

// ---- điểm trên người kỵ sĩ (đơn vị nhân vật; dx dương = phía trước mặt, dy tính từ chân): mép lưng ngựa ≈ dy 380, ngực ≈ 560, mặt ≈ 850, núm mũ ≈ 1150
function xfBody(R, dx, dy) { const st = R.st; return [st.x + (st.flip ? -1 : 1) * dx * st.scale, st.ground - dy * st.scale]; }
// bỏ núm tua đỏ trên đỉnh mũ trụ (bị bắn rơi)
const xfNoKnob = (svg) => svg.replace(/<circle cx="14" cy="[-0-9.]+" r="14" fill="#C0392B"[^>]*\/>/g, '');
// lính bộ giản lược (đám đông lớn): mũ, thân, giáo; pose 0 đứng, 1 giơ tay, k bay (xoay)
function xfMook(x, y, sc, c, o = {}) {
  const rot = o.rot || 0, f = o.flip ? -1 : 1, arm = o.up ? -150 : -40;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * f)} ${f1(sc)})"><path d="M10 -120 L${f1(10 + Math.sin(arm * Math.PI / 180) * -40)} ${f1(-120 - Math.cos(arm * Math.PI / 180) * 40)}" stroke="#6A4A2A" stroke-width="6"/>` +
    `<line x1="${o.up ? 30 : 34}" y1="${o.up ? -230 : -200}" x2="${o.up ? 20 : 34}" y2="-30" stroke="#7A5A3A" stroke-width="6"/><path d="M${o.up ? 30 : 34} ${o.up ? -230 : -200} l-8 22 l16 0Z" fill="#C8CCD0" stroke="${INK2}" stroke-width="3"/>` +
    `<rect x="-26" y="-118" width="52" height="84" rx="16" fill="${c}" stroke="${INK2}" stroke-width="5"/><path d="M-14 -34 l-4 34 M14 -34 l4 34" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/>` +
    `<circle cx="0" cy="-146" r="30" fill="#E8C49A" stroke="${INK2}" stroke-width="5"/><path d="M-34 -150 Q0 -200 34 -150 Z" fill="${o.hat || '#5A4636'}" stroke="${INK2}" stroke-width="5"/>` +
    (o.ex === 'shock' ? `<circle cx="-9" cy="-146" r="5" fill="${INK2}"/><circle cx="11" cy="-146" r="5" fill="${INK2}"/><ellipse cx="2" cy="-128" rx="6" ry="8" fill="${INK2}"/>` : `<path d="M-14 -148 h10 M6 -148 h10" stroke="${INK2}" stroke-width="5"/>`) + `</g>`;
}
// sao xoay quanh đầu (choáng)
function xfStars(t, x, y, r = 60) { let s = ''; for (let i = 0; i < 3; i++) { const a = t * 5 + i * 2.09, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.35;
  s += `<path transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(a * 40)})" d="M0 -16 L5 -5 L16 -4 L7 4 L10 15 L0 9 L-10 15 L-7 4 L-16 -4 L-5 -5Z" fill="#FFD84A" stroke="${INK2}" stroke-width="3"/>`; } return s; }

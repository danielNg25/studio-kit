// ===== SÂN KHẤU CHUNG (rút từ cảnh mẫu đã duyệt 12/11). Một cảnh = tqStage(T, ctx, {big:[…]}) → S; đặt người bằng S.put / S.foot; đòn bằng S.clash; kết bằng S.fin(bg, camK, o).
// Luật đã gắn sẵn: quay mặt bật ngay (face ±1), không dựng lại hình, tia loé tại điểm chạm, đòn lớn khựng 0,1 s + nền tối, zoom nhẹ đòn thường / mạnh đòn lớn, không chớp trắng.
const XM = { LB: { id: 'xq_lubo', horse: '#B8402A', hand: 'xh_kich' }, TP: { id: 'xq_tp_tran', horse: '#2E2A30', hand: 'xq_xamau' }, QV: { id: 'xq_qv_tran', horse: '#8A5A3A', hand: 'xh_guandao' }, LBI: { id: 'xq_lb_tran', horse: '#E4DCCC', hand: 'xq_kiem' },
  TV: { id: 'xq_tv_tran', horse: '#F0ECE4', hand: 'th_spear' }, MS: { id: 'xq_masieu', horse: '#E8E4DC', hand: 'th_spear' }, HC: { id: 'xq_huachu', horse: '#6A4A32', hand: 'xh_dao' }, HCT: { id: 'xq_huachu_tran', horse: '#6A4A32', hand: 'xh_dao' },
  DV: { id: 'xq_dienvi', horse: '#4A3A30', hand: 'xq_ji' }, HT: { id: 'xq_hoangtrung', horse: '#B89A6A', hand: 'xh_dao' }, NL: { id: 'xq_nhanluong', horse: '#7A5A3A', hand: 'xh_dao' }, VS: { id: 'xq_vansu', horse: '#5A3A2A', hand: 'th_spear' },
  TS: { id: 'xq_tonsach', horse: '#C8B490', hand: 'th_spear' }, TST: { id: 'xq_thaisutu', horse: '#8A6A4A', hand: 'th_spear' }, TL: { id: 'xq_truonglieu', horse: '#5E5048', hand: 'xh_dao' }, BD: { id: 'xq_bangduc', horse: '#D8D4CC', hand: 'xh_dao' },
  HH: { id: 'xq_hoahung', horse: '#3A3238', hand: 'xh_dao' }, HHD: { id: 'xq_hahaudon_truoc', horse: '#6E5238', hand: 'th_spear' }, HHD1: { id: 'xq_hahaudon', horse: '#6E5238', hand: 'th_spear' }, PP: { id: 'xq_phanphung', horse: '#8A7A5A', hand: 'xh_bigaxe' }, HHK: { id: 'xq_hahaukiet', horse: '#9A8A6A', hand: 'th_spear' },
  TH: { id: 'xq_tuhoang', horse: '#7A6A5A', hand: 'xh_bigaxe' }, TT: { id: 'tq_tt', horse: '#3A3030', hand: 'fist' }, TQN: { id: 'tq_tq', horse: '#C8A878', hand: 'fist' }, T1: { id: 'xq_tuong_tao', horse: '#6A5A4A', hand: 'th_spear' }, T2: { id: 'xq_tuong_ch', horse: '#9A8266', hand: 'xh_dao' } };
const XM_POSE = { idle: [-62, 0], thrust: [[-55, 8], [-92, 0]], high: [[-175, 10], [-108, 0]], low: [[-25, -40], [-78, 0]], block: [[-95, -20], [-138, -55]] };
function xmArm(t, hits, fast) {
  const q = fast ? [0.3, 0.13, 0.25, 0.42] : [0.42, 0.15, 0.28, 0.6];
  const KA = [[-99, XM_POSE.idle[0]]], KO = [[-99, XM_POSE.idle[1]]];
  for (const [th, m] of hits) { const P = XM_POSE[m]; KA.push([th - q[0], XM_POSE.idle[0]], [th - q[1], P[0][0]], [th, P[1][0]], [th + q[2], P[1][0] + 6], [th + q[3], XM_POSE.idle[0]]); KO.push([th - q[0], 0], [th - q[1], P[0][1]], [th, P[1][1]], [th + q[2], P[1][1]], [th + q[3], 0]); }
  const arm = smK(t, KA), off = smK(t, KO); let hot = 0; for (const [th] of hits) if (t > th - 0.3 && t < th + 0.4) hot = 1;
  return { arm, wrot: xfAlong(arm, off), smear: hot ? [smK(t - 0.03, KA), smK(t - 0.06, KA)] : null, hot };
}
function xmGlint(t, t0, x, y, big) {
  const d = t - t0; if (d < 0 || d > (big ? 0.7 : 0.4)) return ''; const D = big ? 0.7 : 0.4, k = 1 - d / D, R = (big ? 420 : 240) * (0.35 + 0.65 * EZ.expoOut(Math.min(1, d / 0.12))), w = (big ? 26 : 16) * k;
  const star = (a, L) => { const c = Math.cos(a), sn = Math.sin(a); return `<path d="M${f1(x - c * L)} ${f1(y - sn * L)} L${f1(x - sn * w)} ${f1(y + c * w)} L${f1(x + c * L)} ${f1(y + sn * L)} L${f1(x + sn * w)} ${f1(y - c * w)}Z" fill="#FFE9B0" opacity="${f1(0.9 * k)}"/>`; };
  return `<g style="mix-blend-mode:screen">` + star(0, R * 1.9) + star(Math.PI / 2, R * 0.8) + star(Math.PI / 4, R * 0.45) + star(-Math.PI / 4, R * 0.45) + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * 0.5)}" fill="#FFB45A" opacity="${f1(0.4 * k)}"/></g>` + radialLines(t, x, y, { n: big ? 40 : 24, r0: big ? 230 : 170, op: (big ? 0.6 : 0.4) * k, c: '#FFE2A8' });
}
function tqEmbers(t, c = '#FFE08A') { let s = ''; for (let i = 0; i < 26; i++) { const u = ((t * (0.12 + hrnd(i, 5) * 0.14) + hrnd(i, 6)) % 1), x = hrnd(i, 7) * 2000 - 40 + Math.sin(t * 1.5 + i) * 40 - u * 260, y = 1100 - u * 900, r = 2.5 + hrnd(i, 8) * 3.5;
  s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.6)}" fill="#FF8A2A" opacity="${f1(0.22 * (1 - u))}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" opacity="${f1(0.9 * (1 - u))}"/>`; } return s; }
// mốc theo chữ trong lời (an toàn: không thấy chữ thì trả fallback)
const tqAt = (ctx, w, fb) => { try { const v = ctx.at(w); return (v == null || isNaN(v)) ? fb : v; } catch (e) { return fb; } };
function tqStage(T, ctx, o = {}) {
  const BIG = o.big || [], S = { T, ctx, BIG, t: hitStop(T, BIG.map(b => [b, 0.1])), HITS: [], L: [], fx: '', over: '', shad: '', aura: '', dust: '', under: '', shakes: [], G: o.G ?? 1000, Sc: o.S ?? 0.74, dur: ctx && ctx.dur || 10 };
  const t = S.t;
  // kỵ sĩ ở độ sâu d (-1 xa … +1 gần)
  S.put = (W, x, d, face, st = {}, run = 0.4, extra = {}) => { face = face >= 0 ? 1 : -1; const s = S.Sc * (1 + 0.13 * d) * (extra.k || 1), g = S.G + d * 46;
    const R = xfRider(W.id, Object.assign({ x, g, s, face, horse: W.horse, run, st: Object.assign({ hand: W.hand, ex: 'fierce' }, st) }, extra), t); R.x = x; R.g = g; R.d = d; R.W = W; R.s = s; R.mounted = 1;
    if (extra.op != null) { R.back = `<g opacity="${f1(extra.op)}">${R.back}</g>`; R.front = `<g opacity="${f1(extra.op)}">${R.front}</g>`; }
    S.L.push(R); S.shad += `<ellipse cx="${f1(x - 70 * s)}" cy="${f1(g + 8)}" rx="${f1(250 * s)}" ry="${f1(30 * s)}" fill="#2A1420" opacity="0.34"/>`; if (run > 0.9) S.dust += xfHooves(t, x, g, face > 0 ? -1 : 1, run * 0.8); return R; };
  // người đứng dưới đất (cả thân)
  S.foot = (W, x, d, face, st = {}, k = 1) => { const sc = S.Sc * 0.6 * (1 + 0.13 * d) * k, g = S.G + d * 46 + 30, id = typeof W === 'string' ? W : W.id;
    const stW = Object.assign({ x, ground: g, scale: sc, flip: face < 0, ex: 'neutral', shadow: false, legs: 'stand' }, typeof W === 'string' ? {} : { hand: W.hand }, st);
    const R = { back: '', front: (st.wrot != null ? xfC(id, stW, t) : thC(id, stW, t)), st: stW, x, g, d, W: typeof W === 'string' ? { id } : W, s: sc, F: face < 0 ? -1 : 1 };
    S.L.push(R); S.shad += `<ellipse cx="${f1(x - 30 * sc)}" cy="${f1(g + 4)}" rx="${f1(190 * sc)}" ry="${f1(26 * sc)}" fill="#2A1420" opacity="0.32"/>`; return R; };
  S.raw = (svg, d = 0) => { S.L.push({ back: '', front: svg, d }); };
  S.hand = (R) => tkHandPt(R.W.id, R.st, t);
  S.clash = (t0, A, B, c = {}) => { if (t < t0 - 0.2 || t > t0 + 1) return; const hA = S.hand(A), hB = S.hand(B), px = c.x ?? (hA[0] + hB[0]) / 2, py = c.y ?? (Math.min(hA[1], hB[1]) - (c.dy ?? 90)), big = BIG.includes(t0);
    S.HITS.push([t0, px, py, big]); S.shakes.push([t0, c.sh ?? (big ? 8 : 5), 0.22]); S.fx += xfClash(t, t0, px, py, { n: (c.n || 16) + 10, speed: 1150 }) + xmGlint(t, t0, px, py, big);
    if (c.sfx) S.fx += tqSfx(c.sfx, px + (c.sx ?? 0), Math.max(150, py - 230), t, t0, { fs: c.fs || 54, life: 0.6, rot: c.rot ?? -6 }); };
  S.glint = (t0, x, y, big, c = {}) => { if (t < t0 - 0.2 || t > t0 + 1) return; S.HITS.push([t0, x, y, big]); S.shakes.push([t0, big ? 8 : 5, 0.22]); S.fx += xmGlint(t, t0, x, y, big) + (c.sparks === false ? '' : xfClash(t, t0, x, y, { n: 20 })); if (c.sfx) S.fx += tqSfx(c.sfx, x + (c.sx ?? 0), Math.max(150, y - 230), t, t0, { fs: c.fs || 54, life: 0.6, rot: c.rot ?? -6 }); };
  S.arc = (t0, R, side, c = {}) => { S.fx += fmArc(t, t0 - 0.14, R.x, R.g - (c.h ?? 420) * (R.s || S.Sc), (c.r ?? 250) * (R.s || S.Sc), side > 0 ? -150 : -30, side > 0 ? -20 : -160, { dur: 0.15, c: c.c || '#FFD9A0', w: c.w || 34 }); };
  S.sfx = (text, x, y, t0, c = {}) => { if (t >= t0) S.fx += tqSfx(text, x, y, t, t0, Object.assign({ fs: 56, life: 0.7, rot: -6 }, c)); };
  // (18/11, tập đồng dao — người dùng: "các chỗ bong bóng chat đang lệch") bóng thoại vẽ TRONG lớp máy quay (đi theo zoom/lia), đặt TRÊN đầu, đuôi trỏ vào miệng
  S.say = (text, R, t0, t1, c = {}) => { if (t >= t0 && t < (t1 ?? t0 + 2.6)) { const head = R.g - (R.mounted ? 760 : 1110) * R.s + (c.dyHead || 0), mouth = [R.x + (R.F || 1) * 18 * (R.s / 0.44), R.g - (R.mounted ? 600 : 860) * R.s + (c.dyHead || 0)];
    S.fx += kBubble(R.x + (c.dx ?? 60), c.y ?? (head - 90), text, t, t0, Object.assign({ fs: 40, to: mouth }, c)); } };
  S.counter = (n, c = {}) => { S.over += `<g opacity="${f1(c.op ?? 1)}">${tqCounter(t, n, c)}</g>`; };
  // kết: bg = tqbg(...) hoặc {far,mid,near,mode}; camK = [[t,z,cx,cy]…]; o: armies [{…tqArmy}], crowd (false để tắt), light, dimMax
  S.fin = (bg, camK, f = {}) => {
    S.L.sort((a, b) => a.d - b.d); const riders = S.L.map(r => r.back + r.front).join('');
    let dim = 0, z = Math.max(1.03, smK(t, camK.map(k => [k[0], k[1]]))), cx = smK(t, camK.map(k => [k[0], k[2]])), cy = smK(t, camK.map(k => [k[0], k[3]]));
    for (const b of BIG) { const d = T - b; if (d > -0.06 && d < 0.6) dim = Math.max(dim, 0.55 * (d < 0 ? 1 + d / 0.06 : 1 - d / 0.6)); }
    const dense = f.dense;   // đoạn đòn dồn dập: không zoom đòn thường
    for (const [th, px, py, big] of S.HITS) { const d = T - th, k = d < -0.12 ? 0 : d < 0 ? (1 + d / 0.12) * 0.6 : Math.exp(-d * (big ? 3.2 : 6)); if (!big && dense) continue; z += (big ? 0.24 : 0.06) * k; cx = lerp(cx, px, Math.min(1, (big ? 0.6 : 0.15) * k)); cy = lerp(cy, py + 120, Math.min(1, (big ? 0.45 : 0.1) * k)); }
    const defs = `<defs><radialGradient id="xmAura"><stop offset="0" stop-color="#FFD27A" stop-opacity="0.9"/><stop offset="0.45" stop-color="#FF6A2A" stop-opacity="0.45"/><stop offset="1" stop-color="#C0241A" stop-opacity="0"/></radialGradient></defs>`;
    const arm = (f.armies || []).map(a => tqArmy(t, Object.assign({ g: 892, rows: 4, per: 6, k: 0.6, haze: bg.P ? bg.P.hz : '#E8B890' }, a))).join('');
    const body = defs + bg.far + (f.farX || '') + bg.mid + arm + (f.midX || '') + `<rect x="-200" y="-200" width="2320" height="1480" fill="#160818" opacity="${f1(dim)}"/>` + S.under + S.shad + S.aura + S.dust + riders + S.fx + bg.near + (f.crowd === false ? '' : tqCrowdFront(t, { n: 11, stir: f.stir || 0.3, rise: 36 })) + (f.nearX || '');
    const light = f.light || (bg.P && bg.P.light) || 'dusk', night = light === 'night';
    return thFin(kCam(body, T, z, cx, cy, shakeMulti(T, S.shakes.map(q => [q[0], q[1] * 1.7, q[2]]))) + (f.motes === false ? '' : tqMotes(t, { n: 36, c: night ? '#FFC890' : '#FFE9B8' })) + (f.embers || night || light === 'dusk' ? tqEmbers(T) : '') + tqLight(t, light, { sx: f.sx ?? 0.69, sy: f.sy ?? 0.38 }) + S.over + (S.over2 || '') + cineFrame(0.45));
  };
  return S;
}
// ---- bộ đếm (HIỆP / TƯỚNG …) góc phải trên, khung sơn mài viền vàng
function tqCounter(t, n, o = {}) {
  const lab = o.label || 'HIỆP';
  return `<g transform="translate(1650 122)"><rect x="-210" y="-74" width="420" height="148" rx="22" fill="#1E120A" opacity="0.86"/><rect x="-210" y="-74" width="420" height="148" rx="22" fill="none" stroke="#E2C25A" stroke-width="5"/><rect x="-198" y="-62" width="396" height="124" rx="16" fill="none" stroke="#8A6A2A" stroke-width="2"/>` + kText(lab, -100, 20, lab.length > 5 ? 38 : 50, { c: '#E2C25A' }) + kText(String(Math.floor(n)) + (o.plus ? '+' : ''), 96, 34, 92, { font: `'Bangers', ${FH}`, c: '#FFFFFF' }) + `</g>`;
}
// ---- ĐẤU TAY ĐÔI TỰ ĐỘNG trên sân khấu S: A bên trái, B bên phải; hits = [[t, ai đánh 'A'|'B', kiểu, sfx]]; kết: end = {type:'draw'|'Bflee'|'Aflee'|'Bfall'|'Afall', t}
// o: xa, xb (vị trí lúc áp sát), back (lùi ra bao nhiêu), enterA/enterB: {t0, from}, push (px B bị ép lùi/đòn; âm = A bị ép), exA/exB
function tqDuel(S, A, B, hits, o = {}) {
  const t = S.t, xa0 = o.xa ?? 720, xb0 = o.xb ?? 1200, back = o.back ?? 70, end = o.end || { type: 'draw', t: 1e9 }, push = o.push || 0;
  // vị trí: mỗi đòn áp vào, giữa hai đòn lùi ra `back`
  const KX = [[-9, back]]; hits.forEach(([th], i) => { KX.push([th - 0.5, back], [th, 0], [th + 0.3, 6]); }); KX.sort((a, b) => a[0] - b[0]); const kx = []; for (const k of KX) { if (!kx.length || k[0] > kx[kx.length - 1][0] + 0.02) kx.push(k); }
  const off = smK(t, kx), nDone = hits.filter(h => t >= h[0]).length, shift = push * nDone - push * (nDone ? Math.exp(-(t - hits[nDone - 1][0]) * 6) : 0);
  let xa = xa0 - off + shift, xb = xb0 + off + shift, fa = 1, fb = -1, runA = 0.35, runB = 0.35, da = o.dA || 0, db = o.dB || 0;
  const eA = o.enterA, eB = o.enterB;
  if (eA && t < eA.t0 + (eA.dur || 1.1)) { const u = clamp((t - eA.t0) / (eA.dur || 1.1)); xa = lerp(eA.from ?? -300, xa, xfQO(u)); runA = 1.4; }
  if (eB && t < eB.t0 + (eB.dur || 1.1)) { const u = clamp((t - eB.t0) / (eB.dur || 1.1)); xb = lerp(eB.from ?? 2220, xb, xfQO(u)); runB = 1.4; }
  const hA = hits.map(([th, who, m]) => [th, who === 'A' ? m : 'block']), hB = hits.map(([th, who, m]) => [th, who === 'B' ? m : 'block']);
  const fast = hits.some((h, i) => i && h[0] - hits[i - 1][0] < 1.06), aA = xmArm(t, hA, fast), aB = xmArm(t, hB, fast);
  const lastAtk = (who) => { let r = 0; for (const h of hits) if (t > h[0] - 0.3 && t < h[0] + 0.45) r = h[1] === who ? 1 : -1; return r; };
  let stA = Object.assign({}, aA, { ex: lastAtk('A') > 0 ? 'yell' : lastAtk('A') < 0 ? 'grit' : (o.exA || 'fierce'), lean: aA.hot ? 8 : 0 }), stB = Object.assign({}, aB, { ex: lastAtk('B') > 0 ? 'yell' : lastAtk('B') < 0 ? 'grit' : (o.exB || 'fierce'), lean: aB.hot ? 8 : 0 });
  let exA = {}, exB = {};
  if (t >= end.t) { const d = t - end.t, u = d / (end.dur || 1.6);
    if (end.type === 'Bflee') { fb = 1; xb += 1500 * u * u; runB = 1.4; stB = { arm: -60, wrot: xfAlong(-60, 30), ex: 'shock', lean: 14 }; if (end.chase) { xa += Math.min(520, 900 * Math.max(0, u - 0.25) ** 2); runA = 1.3; stA = { arm: -92, wrot: xfAlong(-92, -6), ex: 'yell', lean: 12 }; } else stA = Object.assign(stA, { ex: 'smug' }); }
    else if (end.type === 'Aflee') { fa = -1; xa -= 1500 * u * u; runA = 1.4; stA = { arm: -60, wrot: xfAlong(-60, 30), ex: 'shock', lean: 14 }; if (end.chase) { xb -= Math.min(520, 900 * Math.max(0, u - 0.25) ** 2); runB = 1.3; stB = { arm: -92, wrot: xfAlong(-92, -6), ex: 'yell', lean: 12 }; } else stB = Object.assign(stB, { ex: 'smug' }); }
    else if (end.type === 'Bfall') { exB = { fall: { t0: end.t, dur: 0.5, back: -40, ex: 'pain', lift: 60, drop: 1 } }; stA = Object.assign(stA, { ex: 'fierce' }); }
    else if (end.type === 'Afall') { exA = { fall: { t0: end.t, dur: 0.5, back: -40, ex: 'pain', lift: 60, drop: 1 } }; }
    else if (end.type === 'draw') { const k = clamp(d / 0.8); xa -= 90 * k; xb += 90 * k; stA = Object.assign(stA, { ex: 'grit' }); stB = Object.assign(stB, { ex: 'grit' }); } }
  const RA = S.put(A, xa, da, fa, Object.assign(stA, o.stA || {}), runA, exA), RB = S.put(B, xb, db, fb, Object.assign(stB, o.stB || {}), runB, exB);
  const SF = ['KENG!', 'CHOANG!', 'XOẢNG!', 'CẠCH!'];
  hits.forEach(([th, who, m, sfx], i) => { S.clash(th, RA, RB, { sfx: sfx === 0 ? null : (sfx || (i % 2 === 0 || hits.length < 5 ? SF[i % 4] : null)), sx: i % 2 ? 140 : -140, rot: i % 2 ? 6 : -6, dy: m === 'low' ? 10 : m === 'high' ? 120 : 70 }); S.arc(th, who === 'A' ? RA : RB, who === 'A' ? 1 : -1); });
  return { RA, RB, xa, xb };
}
// sinh danh sách đòn đều nhau trong [t0, t1], luân phiên người đánh và kiểu đòn; first = 'A' | 'B'
function tqHits(t0, t1, n, first = 'A', kinds = ['thrust', 'high', 'low']) { const out = []; for (let i = 0; i < n; i++) out.push([t0 + (t1 - t0) * (n === 1 ? 0.5 : i / (n - 1)), (i % 2 === 0) === (first === 'A') ? 'A' : 'B', kinds[i % kinds.length]]); return out; }

// ---- MỘT ĐẤU NHIỀU: lính (tqSoldier) lần lượt xông vào từ hai phía, tới lượt thì bị hất văng. hits = [[t, phía(+1 phải/-1 trái)]]. R = người đánh (đã put/foot).
function tqMob(S, R, hits, o = {}) {
  const t = S.t, c = o.c || '#4A5A7A', k = o.k || 0.9, g = R.g + (R.mounted ? 0 : -30);
  hits.forEach(([th, side], i) => { const d = t - th; if (d < -1.0 || d > 0.9) return; let x, y = g + (i % 3 - 1) * 16, rot = 0, op = 1;
    if (d < 0) x = R.x + side * (190 + (-d / 1.0) * 900); else { const u = d / 0.9; x = R.x + side * (190 + u * 760); y -= Math.sin(u * Math.PI) * 300; rot = side * u * 280; op = 1 - u * u; }
    S.L.push({ d: R.d + (i % 2 ? 0.05 : -0.05), back: '', front: `<g opacity="${f1(op)}" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y - 100)})">` + tqSoldier(x, y, k, i % 3 === 2 ? tqMix(c, '#000000', 0.2) : c, { dir: -side, ex: d > -0.2 ? 1 : 0, bob: d < 0 ? Math.sin(t * 14 + i) * 5 : 0, shield: i % 2 === 0 }) + `</g>` });
    S.glint(th, R.x + side * 170, R.g - (R.mounted ? 420 : 330) * R.s, false, { sfx: o.sfx === false || i % 3 ? null : ['BỐP!', 'CHOANG!', 'RẦM!'][(i / 3 | 0) % 3], sx: side * 150, rot: side * 6 }); });
}
// người đánh giữa đám đông: quay mặt về phía đòn kế tiếp, tay vung theo từng đòn
function tqHero(S, W, x, hits, o = {}) {
  const t = S.t, kinds = ['high', 'thrust', 'low']; let side = hits.length ? hits[0][1] : 1; for (const h of hits) if (t > h[0] - 0.45) side = h[1];
  const a = xmArm(t, hits.map(([th], i) => [th, kinds[i % 3]]), true), st = Object.assign(a, { ex: a.hot ? 'yell' : (o.ex || 'fierce'), lean: a.hot ? 8 : 0 }, o.st || {});
  const R = o.foot ? S.foot(W, x, o.d || 0, side, st, o.k || 1.15) : S.put(W, x, o.d || 0, side, st, o.run ?? 0.5); hits.forEach(([th, sd]) => S.arc(th, R, sd, { h: o.foot ? 330 : 420 })); return R;
}
// đều đặn n đòn hai phía xen kẽ
const tqMobHits = (t0, t1, n, first = 1) => { const out = []; for (let i = 0; i < n; i++) out.push([t0 + (t1 - t0) * (n === 1 ? 0.5 : i / (n - 1)), (i % 2 ? -first : first)]); return out; };
// ---- chuỗi trận ngắn nối nhau trong một shot: segs = [{t0, t1, A, B, bg, count:[a,b], label, first, armies, end, plus}] — mỗi trận một nền khác (luật không lặp)
function tqSeq(T, ctx, segs) {
  let g = segs[0]; for (const s of segs) if (T >= s.t0) g = s; const S = tqStage(T, ctx, { big: g.big || [] }), t = S.t, t1 = g.t1 ?? ctx.dur;
  const n = g.n || Math.max(2, Math.min(5, Math.round((t1 - g.t0) / 1.25))), hits = g.hits || tqHits(g.t0 + 0.55, t1 - 0.45, n, g.first || 'A');
  tqDuel(S, g.A, g.B, hits, Object.assign({ end: g.end || { type: 'draw', t: t1 - 0.2 } }, g.o || {}));
  if (g.count) S.counter(Math.round(lerp(g.count[0], g.count[1], clamp((t - g.t0) / Math.max(0.5, t1 - g.t0 - 0.5)))), { label: g.label, plus: g.plus && t > t1 - 0.6 });
  return S.fin(typeof g.bg === 'function' ? g.bg(t) : tqbg(t, g.bg || {}), [[g.t0, 1.05, 960, 575], [t1, 1.13, 960, 600]], { armies: g.armies, stir: 0.5 });
}

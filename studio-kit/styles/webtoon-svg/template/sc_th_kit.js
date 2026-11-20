// ===== BỘ ĐỒ NGHỀ CẢNH tập buc-thuong-luong-son (C5, 2026-10-25). Nạp SAU sc_tq_lib.js (Gia Cát Lượng) + nền build/bg/*.js, TRƯỚC sc_th_c*.js.
function thHorse(x, g, s, t, o = {}) {
  const c = o.c || '#B5442A', c2 = dk(c, 0.3), fl = o.flip ? -1 : 1, run = o.run ?? 0, ph = t * (6 + 6 * run), bob = Math.sin(ph) * 3 * (0.3 + run);
  const leg = (lx, a, col, w = 30) => { const sw = Math.sin(ph + a) * 22 * (0.2 + run), up = Math.max(0, Math.cos(ph + a)) * 22 * run; return `<path d="M${lx} -210 L${f1(lx + sw * 0.5)} -110 L${f1(lx + sw)} ${f1(-up)}" stroke="${INK2}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M${lx} -210 L${f1(lx + sw * 0.5)} -110 L${f1(lx + sw)} ${f1(-up)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="${f1(lx + sw)}" cy="${f1(-up - 2)}" rx="${w * 0.6}" ry="${w * 0.32}" fill="#3A2A1E" stroke="${INK2}" stroke-width="4"/>`; };
  const tf = `translate(${f1(x)} ${f1(g + bob)}) scale(${fl * s} ${s})`;
  const tail = `<path d="M-150 -250 Q-230 -240 -240 -150 Q-250 -90 -226 -60" stroke="${INK2}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-150 -250 Q-230 -240 -240 -150 Q-250 -90 -226 -60" stroke="#2A1A12" stroke-width="20" fill="none" stroke-linecap="round" transform="translate(${f1(Math.sin(ph * 0.6) * 6)} 0)"/>`;
  const back = `<g transform="${tf}">${tail}${leg(-100, 1.6, c2)}${leg(90, 0.2, c2)}</g>`;
  const front = `<g transform="${tf}">${leg(-60, 0.2, c)}${leg(130, 1.8, c)}<ellipse cx="0" cy="-250" rx="170" ry="80" fill="${c}" stroke="${INK2}" stroke-width="6"/><path d="M-120 -230 Q0 -190 140 -226" stroke="${c2}" stroke-width="8" fill="none" opacity="0.5" stroke-linecap="round"/>` +
    `<path d="M110 -280 Q170 -330 200 -400 L260 -380 Q240 -300 190 -230Z" fill="${c}" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M200 -400 Q290 -420 330 -350 Q350 -310 320 -290 Q270 -280 250 -300 Q230 -340 200 -400Z" fill="${c}" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="326" cy="-318" rx="14" ry="10" fill="#3A2A1E"/><circle cx="262" cy="-358" r="8" fill="#2A1A12"/><circle cx="260" cy="-360" r="3" fill="#FFF"/>` +
    `<path d="M214 -408 l-14 -50 l40 34Z" fill="${c2}" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M196 -396 Q150 -380 130 -320 Q110 -290 108 -262" stroke="#2A1A12" stroke-width="26" fill="none" stroke-linecap="round"/></g>`;
  return { back, front, X: (lx) => x + lx * s * fl, Y: (ly) => g + bob + ly * s, bob };
}

// ---- thẻ chương: chữ to giữa trên khung lúc đầu shot rồi thu lên góc trái trên và mờ dần (lời chạy ngay, không màn im)
function thTitle(t, text, o = {}) {
  const k1 = EZ.backOut(clamp(t / 0.35)), mv = c4ease(clamp((t - 1.3) / 0.6)), op = 1 - clamp((t - 4.0) / 0.8);
  if (op <= 0) return '';
  const x = lerp(960, 300, mv), y = lerp(200, 70, mv), sc = lerp(1, 0.55, mv) * k1;
  const w = text.length * 50 + 140;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})" opacity="${f1(op)}"><rect x="${f1(-w / 2 + 10)}" y="-50" width="${f1(w)}" height="112" rx="14" fill="#20140A" opacity="0.3"/><rect x="${f1(-w / 2)}" y="-60" width="${f1(w)}" height="112" rx="14" fill="#F3E3B8" stroke="${INK2}" stroke-width="6"/><rect x="${f1(-w / 2 + 12)}" y="-48" width="${f1(w - 24)}" height="88" rx="8" fill="none" stroke="#B8322A" stroke-width="3"/>${tqTxt(text, 0, 22, 66, { c: '#5A1E16' })}</g>`;
}
// ---- nhãn tên có mũi trỏ (pop một lần, giữ)
function thName(text, x, y, t, t0, o = {}) { const k = kPop(t, t0, 0.3); if (k <= 0) return ''; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)}) translate(${f1(-x)} ${f1(-y)})">${tqChip(text, x, y, { fs: o.fs || 38, bg: o.bg || '#FFF6DA', rot: o.rot || 0 })}</g>`; }
// ---- nhân vật (đặt TDK_ROT cho đồ cầm tay khi cần)
function thC(id, st, T) { const c = CHAR[id]; if (!c) return ''; const g = Object.assign({ shadow: true }, c.hand ? { hand: c.hand, arm: -22 } : {}, c.backHand ? { backHand: c.backHand, back: 22 } : {}, c.look ? { look: c.look } : {}, st); return tkChar(id, g, T); }
// nhân vật phụ chỉ dùng trong hồi tưởng chương 1: cha Vương Tiến (bản già của Vương Tiến, tóc bạc)
CHAR.th_x_cha_vt = Object.assign({}, CHAR.th_vuongtien, { old: 1, name: 'Cha Vương Tiến (hồi tưởng)', hair: '#C8C4BC', hairS: '#A8A49C', brow: '#B8B4AC', greyStreak: '#E0DCD4', creases: 1, thx: 1 });
// đuôi chữ chạy: chữ hiện dần (gõ) — dùng cho thẻ trích dẫn
const thType = (text, t, t0, dur) => text.slice(0, Math.ceil(text.length * clamp((t - t0) / Math.max(0.1, dur))));
// ---- khung kể hồi tưởng màu sepia (inner vẽ trong toạ độ 1920×1080 rồi thu vào khung)
function thFlash(x, y, w, h, inner, k = 1, o = {}) {
  if (k <= 0) return ''; const id = 'thfb' + (TQ_CP++), sc = Math.max(w / 1920, h / 1080);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k)}) rotate(${o.rot ?? -2})"><rect x="${f1(-w / 2 + 12)}" y="${f1(-h / 2 + 14)}" width="${f1(w)}" height="${f1(h)}" fill="#20140A" opacity="0.3"/><clipPath id="${id}"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}"/></clipPath><g clip-path="url(#${id})"${o.sepia === false ? '' : ' filter="url(#thSepia)"'}><g transform="scale(${f1(sc)}) translate(-960 -540)">${inner}</g></g><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="#F6EAD0" stroke-width="14"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="${INK2}" stroke-width="4"/></g>`;
}
const TH_DEFS = `<defs><filter id="thSepia" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.39 0.62 0.19 0 0.02  0.35 0.56 0.17 0 0.0  0.27 0.43 0.13 0 -0.03  0 0 0 1 0"/></filter></defs>`;
const thFin = (body) => kFin(TH_DEFS + body);
// ---- quả cầu da (x,y tâm, r), vệt bay
function thBall(x, y, r = 26, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><circle r="${r}" fill="#C8843E" stroke="${INK2}" stroke-width="4"/><path d="M${-r * 0.9} ${-r * 0.3} Q0 ${r * 0.1} ${r * 0.9} ${-r * 0.3} M${-r * 0.7} ${r * 0.7} Q0 ${r * 0.2} ${r * 0.7} ${r * 0.7} M0 ${-r} Q${-r * 0.35} 0 0 ${r}" stroke="#6A3A16" stroke-width="2.6" fill="none"/></g>`; }
// ---- toạ độ quỹ đạo nhiều điểm (catmull đơn giản) — u 0..1
function thPath(pts, u) { const n = pts.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; const [a, b] = [pts[i], pts[i + 1]]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * (b[2] || 0)]; }

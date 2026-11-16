// BỘ ẢNH BÌA chung cho tập dùng khuôn tb (14/11/2026). Nạp sau scenes của tập (tools/thumb_job.py tự nạp), trước thumb.js của tập.
// Luật (studio-kit/references/anh-bia.md + bài học repo stickman-video-director): MỘT xung đột, MỘT tiêu điểm; chữ chính ≤ 4 từ, to;
// đồ vật biểu tượng phóng thật to; chênh lệch kích thước / đối lập hai nửa; nền có ánh sáng (tia, quầng, hạt); tránh góc dưới phải.
let BIA_N = 0;
const biaId = (p) => `${p}${++BIA_N}`;
// nền: quầng tròn màu c0 tại (cx, cy) loang ra c1 rồi c2 ở mép
function biaBg(c0, c1, c2, cx = 0.5, cy = 0.5, r = 0.95) { const id = biaId('tkb'); return `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${c0}"/><stop offset="0.5" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`; }
function biaRays(cx, cy, c, op = 0.09, n = 20, w = 8) { let s = ''; const st = 360 / n; for (let i = 0; i < n; i++) { const a0 = i * st * Math.PI / 180, a1 = (i * st + w) * Math.PI / 180, R = 2800; s += `<path d="M${cx} ${cy} L${f1(cx + R * Math.cos(a0))} ${f1(cy + R * Math.sin(a0))} L${f1(cx + R * Math.cos(a1))} ${f1(cy + R * Math.sin(a1))}Z" fill="${c}" opacity="${op}"/>`; } return s; }
function biaGlow(cx, cy, rx, ry, c, op = 0.5) { const id = biaId('tkg'); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><g ${GL.add}><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})" opacity="${op}"/></g>`; }
// hạt sáng / tàn lửa cố định (ảnh tĩnh nên không cần thời gian)
function biaMotes(c = '#FFE08A', n = 40, box = [0, 0, 1920, 1080], seed = 1) { let s = ''; for (let i = 0; i < n; i++) { const x = box[0] + hrnd(i, seed) * box[2], y = box[1] + hrnd(i, seed + 1) * box[3], r = 2 + hrnd(i, seed + 2) * 6; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" opacity="${f1(0.35 + 0.5 * hrnd(i, seed + 3))}"/>`; } return `<g ${GL.add}>${s}</g>`; }
const biaVig = (op = 0.55) => { const id = biaId('tkv'); return `<defs><radialGradient id="${id}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`; };
// dải tối phía trên cho chữ
const biaTop = (h = 360, op = 0.8) => { const id = biaId('tkt'); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0810" stop-opacity="${op}"/><stop offset="1" stop-color="#0A0810" stop-opacity="0"/></linearGradient></defs><rect width="1920" height="${h}" fill="url(#${id})"/>`; };
// chữ to: viền đen dày + bóng đổ; lines = [[chữ, cỡ, màu, y], …]
function biaTitle(lines, x, o = {}) { return lines.map(([t, fs, c, y, rot = 0]) => `<g transform="rotate(${rot} ${x} ${y})"><g transform="translate(10 12)">${kText(t, x, y, fs, { c: '#000', stroke: '#000', sw: Math.round(fs * 0.2), op: 0.55, anchor: o.anchor })}</g>${kText(t, x, y, fs, { c: c || '#FFFFFF', stroke: '#140C06', sw: Math.round(fs * 0.19), anchor: o.anchor })}</g>`).join(''); }
// tấm biển tối viền vàng sau chữ (kiểu bìa Tào Tháo)
function biaPlate(t, x, y, fs, c = '#F2D16B') { const w = t.length * fs * 0.62 + 90, h = fs * 1.45; return `<g><rect x="${f1(x - w / 2 + 8)}" y="${f1(y - h * 0.74 + 10)}" width="${f1(w)}" height="${f1(h)}" rx="20" fill="#000" opacity="0.5"/><rect x="${f1(x - w / 2)}" y="${f1(y - h * 0.74)}" width="${f1(w)}" height="${f1(h)}" rx="20" fill="#14101A" stroke="#E2C25A" stroke-width="8"/>${kText(t, x, y, fs, { c })}</g>`; }
function biaBadge(txt, x, y, rot = 8, c = '#C0392B', s = 1) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-80" y="-80" width="160" height="160" rx="26" fill="${c}" stroke="#140C06" stroke-width="10"/>${kText(txt, 0, 46, 130, { c: '#FFFFFF', stroke: '#140C06', sw: 8 })}</g>`; }
// nhân vật (bộ đã duyệt, không vẽ lại mặt). st: ex, arm, hand, lean, legs… ; flip = quay sang trái
const biaFig = (id, x, ground, scale, st = {}, flip = false) => thC(id, Object.assign({ x, ground, scale, ex: 'neutral', legs: 'stand', shadow: false, flip }, st), 2.0);
// viền sáng (rim light) giả: vẽ bóng nhân vật phóng to 1–2 % màu sáng mờ phía sau
const biaRim = (id, x, ground, scale, st, flip, c = '#FFE2A0', op = 0.55) => `<g ${GL.add} opacity="${op}" filter="url(#biaBlur8)"><g transform="translate(${x} ${ground}) scale(1.025) translate(${-x} ${-ground})" style="filter: brightness(0) invert(1)">${biaFig(id, x, ground, scale, st, flip)}</g></g>`;
const BIA_DEFS = `<defs><filter id="biaBlur8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter><filter id="biaBlur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter></defs>`;
const biaFin = (body) => thFin(BIA_DEFS + body);

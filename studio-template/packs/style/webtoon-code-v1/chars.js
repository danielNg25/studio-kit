// NHÂN VẬT VẼ BẰNG CODE (kiểu webtoon "cách 1" — người dùng 2026-10-11: tay tự nhiên, nhưng mặt phải đẹp hơn).
// Nửa thân, nhìn sang phải (3/4). Gốc toạ độ = giữa đáy thân. Tay = tay áo rộng xoay quanh vai (0 = buông, -90 = chỉ thẳng trước, -150 = giơ cao).
// Mặt kiểu anime chibi: mắt to có tròng chuyển màu + 2 điểm sáng, mi trên đậm có đuôi, lông mày mảnh, mũi chấm, miệng nhỏ; tóc khối có mảng bóng.
const CH_INK = '#2A1A14';
let CHN = 0;
// tô 2 tông + nét kép (như cách 1)
function chT(d, base, shade, o = {}) {
  const id = 'chc' + (CHN++), sx = o.sx ?? 10, sy = o.sy ?? 8, lw = o.lw ?? 4.5;
  let s = '';
  if (shade) s += `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${shade}"/><g clip-path="url(#${id})"><path d="${d}" fill="${base}" transform="translate(${-sx} ${-sy})"/></g>`;
  else s += `<path d="${d}" fill="${base}"/>`;
  if (lw > 0) s += `<path d="${d}" fill="none" stroke="${o.lc || CH_INK}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round"/>`;
  return s;
}
const chL = (d, w = 3.5, c = CH_INK, op = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
const CH_SKIN = '#F3D2B5', CH_SKIN_S = '#DCA987', CH_BLUSH = '#F49A8C';

const CHAR = {
  // Bản công khai: chỉ để vài nhân vật mẫu chung chung. Thêm nhân vật: chép một dòng, đổi id + màu (xem STYLE.md).
  am: { male: 1, name: 'Ăn mày', hair: '#2A2420', hairS: '#16120F', iris: ['#2A2018', '#6A5A40'], skin: '#E8BE98', skinS: '#C8946C', robe: '#9A8A6A', robeS: '#7A6A4C', trim: '#6A5A3A', sash: '#5A4A30', inner: '#D8CCB0', messy: 1, rope: 1, patches: 1, stubble: 1 },   // quần chúng Cái Bang
  su: { male: 1, name: 'Sư', bald: 1, brow: '#F4F1EA', beard: '#F4F1EA', beardS: '#CFC9BC', iris: ['#3A2418', '#9A6A3A'], robe: '#E8A040', robeS: '#C27A22', kasaya: '#B8402E', kasayaS: '#8E2C1E', trim: '#E6B84E', sash: '#8E2C1E', inner: '#F2E8D6', beads: 1, old: 1 },
  cu1: { male: 1, name: 'Ông cụ (công viên)', hair: '#D8D4CC', hairS: '#B4AEA2', brow: '#D8D4CC', iris: ['#2A2226', '#6A6066'], robe: '#F2F2EE', robeS: '#D2D2CC', trim: '#5E7A96', sash: '#3E4E60', inner: '#FFFFFF', knot: '#8A8478', old: 1 },
  cu2: { fem: 1, name: 'Bà cụ (công viên)', hair: '#CFC8BC', hairS: '#A8A094', iris: ['#2A2226', '#6A6066'], robe: '#C84A5A', robeS: '#A0384A', trim: '#F2D16B', sash: '#7A2A38', inner: '#FFF2F2', bun: 1, old: 1 },
};

// ---------- mắt ----------
function chEye(x, y, w, h, c, ex, far, lookX = 0) {
  // ex: open | half | closed | happy | shock | pain | angry
  if (ex === 'closed') return chL(`M${x - w} ${y + 2} Q${x} ${y + h * 0.35} ${x + w} ${y - 2}`, 5);
  if (ex === 'happy') return chL(`M${x - w} ${y + 6} Q${x} ${y - h * 0.55} ${x + w} ${y + 4}`, 5.5);
  if (ex === 'pain') return chL(`M${x - w} ${y - h * 0.4} L${x + w * 0.5} ${y} L${x - w} ${y + h * 0.4}`, 5.5);
  const gid = 'chI' + (CHN++);
  const top = ex === 'half' ? y - h * 0.15 : ex === 'angry' ? y - h * 0.38 : ex === 'shock' ? y - h * 0.62 : y - h * 0.55;
  const bot = y + h * 0.48;
  const sclera = `M${x - w} ${y - 2} Q${x - w * 0.6} ${top - 4} ${x + w * 0.2} ${top} Q${x + w * 0.9} ${top + 4} ${x + w} ${y - h * 0.08} Q${x + w * 0.85} ${bot} ${x} ${bot} Q${x - w * 0.8} ${bot - 2} ${x - w} ${y - 2}Z`;
  const scid = 'chS' + (CHN++);
  const ir = ex === 'shock' ? 0.42 : 0.62, irx = w * ir, iry = h * (ex === 'shock' ? 0.36 : 0.5), icx = x + lookX * w * 0.25 + (far ? -2 : 3), icy = y + h * 0.04;
  let s = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.iris[0]}"/><stop offset="0.55" stop-color="${mixC(c.iris[0], c.iris[1], 0.5)}"/><stop offset="1" stop-color="${c.iris[1]}"/></linearGradient><clipPath id="${scid}"><path d="${sclera}"/></clipPath></defs>`;
  s += `<path d="${sclera}" fill="#FFFFFF"/>`;
  s += `<g clip-path="url(#${scid})"><ellipse cx="${f1(icx)}" cy="${f1(icy)}" rx="${f1(irx)}" ry="${f1(iry)}" fill="url(#${gid})" stroke="${CH_INK}" stroke-width="2.5"/>` +
    `<ellipse cx="${f1(icx)}" cy="${f1(icy + 2)}" rx="${f1(irx * 0.42)}" ry="${f1(iry * 0.45)}" fill="${mixC(c.iris[0], '#000000', 0.4)}"/>` +
    `<path d="M${f1(x - w)} ${f1(top)} H${f1(x + w)} V${f1(top + h * 0.22)} Q${f1(x)} ${f1(top + h * 0.3)} ${f1(x - w)} ${f1(top + h * 0.22)}Z" fill="${c.iris[0]}" opacity="0.18"/>` +
    `<ellipse cx="${f1(icx - irx * 0.35)}" cy="${f1(icy - iry * 0.42)}" rx="${f1(irx * (c.male ? 0.24 : 0.34))}" ry="${f1(iry * (c.male ? 0.18 : 0.26))}" fill="#fff"/><circle cx="${f1(icx + irx * 0.4)}" cy="${f1(icy + iry * 0.45)}" r="${f1(irx * 0.14)}" fill="#fff" opacity="0.9"/></g>`;
  // mi trên dày + đuôi mắt, mi dưới mảnh
  s += `<path d="M${x - w - 3} ${y + 1} Q${x - w * 0.6} ${top - 7} ${x + w * 0.2} ${top - 3} Q${x + w * 0.95} ${top + 1} ${x + w + 7} ${y - h * 0.18} L${x + w + 2} ${y - h * 0.02} Q${x + w * 0.8} ${top + 8} ${x + w * 0.2} ${top + 4} Q${x - w * 0.55} ${top + 2} ${x - w - 3} ${y + 1}Z" fill="${CH_INK}"/>`;
  if (!far && !c.male) s += chL(`M${x + w * 0.55} ${top - 3} l${f1(w * 0.3)} ${-6}`, 3);
  s += chL(`M${x - w * 0.55} ${bot - 1} Q${x} ${bot + 3} ${x + w * 0.7} ${bot - 4}`, 2.4, CH_INK, 0.75);
  return s;
}
// mắt nam: hẹp, đuôi xếch, tròng nhỏ bị mi trên che bớt; mắt trái lật đối xứng
function chEyeM(x, y, w, h, c, ex, mirror, look = 0) {
  const m = mirror ? -1 : 1, lk = look * m, SK = c.skin || CH_SKIN;
  let s = '';
  if (ex === 'closed') s = chL(`M${-w} 2 Q0 ${h * 0.3} ${w} -4`, 5);
  else if (ex === 'happy') s = chL(`M${-w} 6 Q0 ${-h * 0.6} ${w} 2`, 5.5);
  else if (ex === 'pain') s = chL(`M${-w * 0.8} ${-h * 0.6} L${w * 0.7} 0 L${-w * 0.8} ${h * 0.6}`, 7.5);
  else {
    const H = ex === 'shock' ? h * 1.25 : h, gid = 'cmI' + (CHN++), scid = 'cmS' + (CHN++);
    const sc = `M${-w} 2 Q${-w * 0.4} ${-H * 0.52} ${w * 0.3} ${-H * 0.56} Q${w * 0.8} ${-H * 0.5} ${w} ${-H * 0.22} Q${w * 0.6} ${H * 0.42} 0 ${H * 0.44} Q${-w * 0.6} ${H * 0.4} ${-w} 2Z`;
    const r = ex === 'shock' ? H * 0.22 : H * 0.5, ix = lk * w * 0.3 + 2, iy = ex === 'shock' ? 0 : H * 0.04;
    s += `<defs><clipPath id="${scid}"><path d="${sc}"/></clipPath></defs><path d="${sc}" fill="#fff"/>`;
    s += `<g clip-path="url(#${scid})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(r)}" fill="${mixC(c.iris[0], c.iris[1], 0.35)}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(r * 0.45)}" fill="${mixC(c.iris[0], '#000000', 0.5)}"/><circle cx="${f1(ix - r * 0.35)}" cy="${f1(iy - r * 0.38)}" r="${f1(r * 0.16)}" fill="#fff"/>`;
    // mi trên đè xuống khi giận / lim dim
    if (ex === 'angry') s += `<path d="M${-w - 4} ${-H * 0.05} L${w + 4} ${-H * 0.5} L${w + 4} ${-H} L${-w - 4} ${-H}Z" fill="${SK}"/>`;
    if (ex === 'half') s += `<path d="M${-w - 4} ${-H * 0.12} Q0 ${-H * 0.2} ${w + 4} ${-H * 0.3} L${w + 4} ${-H} L${-w - 4} ${-H}Z" fill="${SK}"/>`;
    s += `</g>`;
    const topL = ex === 'angry' ? `M${-w - 3} ${-H * 0.02} L${w * 0.3} ${-H * 0.34} Q${w * 0.8} ${-H * 0.44} ${w + 7} ${-H * 0.3}` : ex === 'half' ? `M${-w - 3} ${-H * 0.08} Q0 ${-H * 0.2} ${w + 7} ${-H * 0.32}` : `M${-w - 3} 2 Q${-w * 0.4} ${-H * 0.58} ${w * 0.3} ${-H * 0.6} Q${w * 0.85} ${-H * 0.56} ${w + 7} ${-H * 0.3}`;
    if (false) s += chL(`M${-w * 0.55} ${-H * 0.78} Q${w * 0.2} ${-H * 0.98} ${w * 0.95} ${-H * 0.62}`, 2, '#A9745C', 0.8);
    s += chL(topL, 6.5) + chL(`M${-w * 0.2} ${H * 0.44} Q${w * 0.4} ${H * 0.42} ${w * 0.75} ${H * 0.3}`, 2.2, CH_INK, 0.7);
  }
  return `<g transform="translate(${x} ${y}) scale(${m} 1)">${s}</g>`;
}
function chBrow(x, y, w, ang, col, thick = 12, far = false) {
  // lông mày nam: dày, thẳng, đầu trong to — đuôi ngoài thon
  const i = far ? w : -w, o = far ? -w : w;
  return `<g transform="translate(${x} ${y}) rotate(${f1(ang)})"><path d="M${i} ${-thick * 0.5} Q0 ${-thick * 0.9} ${o} ${-thick * 0.35} L${o} ${thick * 0.05} Q0 ${-thick * 0.15} ${i} ${thick * 0.5}Z" fill="${col}" stroke="${CH_INK}" stroke-width="2"/></g>`;
}
// mắt nữ (2026-10-11): cùng kiểu phẳng như mắt nam — tròn hơn, tròng to hơn, mi trên dày có đuôi mi; không tròng chuyển màu
function chEyeF(x, y, w, h, c, ex, mirror, look = 0) {
  const m = mirror ? -1 : 1, lk = look * m, SK = c.skin || CH_SKIN;
  const lash = (H) => chL(`M${w + 5} ${-H * 0.32} l11 -7 M${w - 2} ${-H * 0.46} l9 -11`, 3.4);
  let s = '';
  if (ex === 'closed') s = chL(`M${-w} 2 Q0 ${h * 0.36} ${w} -2`, 5) + chL(`M${w - 2} -2 l10 -4`, 3);
  else if (ex === 'happy') s = chL(`M${-w} 8 Q0 ${-h * 0.62} ${w} 4`, 5.5) + chL(`M${w} 4 l9 -6`, 3);
  else if (ex === 'pain') s = chL(`M${-w * 0.8} ${-h * 0.6} L${w * 0.7} 0 L${-w * 0.8} ${h * 0.6}`, 7.5);
  else {
    const H = (ex === 'shock' ? 1.3 : 1.12) * h, scid = 'cfS' + (CHN++);
    const sc = `M${-w} 4 Q${-w * 0.5} ${-H * 0.6} ${w * 0.3} ${-H * 0.62} Q${w * 0.85} ${-H * 0.58} ${w} ${-H * 0.2} Q${w * 0.7} ${H * 0.5} 0 ${H * 0.5} Q${-w * 0.7} ${H * 0.46} ${-w} 4Z`;
    const r = ex === 'shock' ? H * 0.24 : H * 0.54, ix = lk * w * 0.3 + 1, iy = ex === 'shock' ? 0 : H * 0.06;
    s += `<defs><clipPath id="${scid}"><path d="${sc}"/></clipPath></defs><path d="${sc}" fill="#fff"/>`;
    s += `<g clip-path="url(#${scid})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(r)}" fill="${mixC(c.iris[0], c.iris[1], 0.35)}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(r * 0.46)}" fill="${mixC(c.iris[0], '#000000', 0.5)}"/><circle cx="${f1(ix - r * 0.34)}" cy="${f1(iy - r * 0.36)}" r="${f1(r * 0.2)}" fill="#fff"/>`;
    if (ex === 'angry') s += `<path d="M${-w - 4} ${-H * 0.1} L${w + 4} ${-H * 0.45} L${w + 4} ${-H} L${-w - 4} ${-H}Z" fill="${SK}"/>`;
    if (ex === 'half') s += `<path d="M${-w - 4} ${-H * 0.1} Q0 ${-H * 0.18} ${w + 4} ${-H * 0.26} L${w + 4} ${-H} L${-w - 4} ${-H}Z" fill="${SK}"/>`;
    s += `</g>`;
    const topL = ex === 'angry' ? `M${-w - 3} ${-H * 0.06} L${w * 0.3} ${-H * 0.32} Q${w * 0.8} ${-H * 0.4} ${w + 7} ${-H * 0.28}` : ex === 'half' ? `M${-w - 3} ${-H * 0.06} Q0 ${-H * 0.18} ${w + 7} ${-H * 0.28}` : `M${-w - 3} 4 Q${-w * 0.5} ${-H * 0.66} ${w * 0.3} ${-H * 0.66} Q${w * 0.88} ${-H * 0.6} ${w + 7} ${-H * 0.28}`;
    s += chL(topL, 7) + lash(H) + chL(`M${-w * 0.4} ${H * 0.5} Q${w * 0.3} ${H * 0.54} ${w * 0.75} ${H * 0.34}`, 2.2, CH_INK, 0.7);
  }
  return `<g transform="translate(${x} ${y}) scale(${m} 1)">${s}</g>`;
}
function chBrowF(x, y, w, ang, col, far = false) { // lông mày nữ: mảnh, cong
  const i = far ? w : -w, o = far ? -w : w, d = `M${i} 4 Q${f1(i * 0.1)} -12 ${o} 0`;
  return `<g transform="translate(${x} ${y}) rotate(${f1(ang)})">${chL(d, 9.5)}${chL(d, 5.5, col)}</g>`;
}
// MIỆNG NÓI (2026-10-13, người dùng: 'nhân vật nói cũng cần cho miệng mấp máy như MC'):
// CH_SPEAK = { ids: [...] hoặc tiền tố 'tnk_', k: 0..1 } do lớp bọc cảnh của tập đặt khi câu thoại của nhân vật đang đọc;
// chChar đặt CH_TALK_NOW cho đúng nhân vật đang nói → chMZ vẽ miệng mở/khép theo k. Tập không đặt CH_SPEAK thì không đổi gì.
var CH_SPEAK = null, CH_TALK_NOW = 0;
const CH_TALK_OPEN = new Set(['yell', 'gape', 'cry', 'shock', 'tongue', 'o']);
function chTalkMouth(k, x, y) {
  const w = 13 + 3 * k, h = 3 + 15 * k;
  return `<path d="M${f1(x - w)} ${f1(y - 2)} Q${x} ${f1(y - 5)} ${f1(x + w)} ${f1(y - 2)} Q${f1(x + w * 0.8)} ${f1(y + h)} ${x} ${f1(y + h + 1)} Q${f1(x - w * 0.8)} ${f1(y + h)} ${f1(x - w)} ${f1(y - 2)}Z" fill="#6E2228" stroke="${CH_INK}" stroke-width="3" stroke-linejoin="round"/>` + (k > 0.4 ? `<path d="M${f1(x - w * 0.55)} ${f1(y + h - 3)} Q${x} ${f1(y + h * 0.35)} ${f1(x + w * 0.55)} ${f1(y + h - 3)} Q${x} ${f1(y + h + 2)} ${f1(x - w * 0.55)} ${f1(y + h - 3)}Z" fill="#EE8E8E"/>` : '');
}
const chMZ = (ex, x, y) => CH_TALK_NOW > 0 && !CH_TALK_OPEN.has(ex) ? `<g transform="translate(${x} ${y}) scale(1.25) translate(${-x} ${-y})">${chTalkMouth(CH_TALK_NOW, x, y)}</g>` : chMZ0(ex, x, y);
const chMZ0 = (ex, x, y) => { const k = ex === 'tongue' || ex === 'tac' ? 1.3 : ex === 'goldgrin' ? 1.25 : ex === 'cry' ? 1.4 : ex === 'yell' ? 1.7 : ex === 'gape' ? 1.25 : ex === 'o' || ex === 'smile' ? 1.4 : 1.2; return `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${chMouth(ex, x, y)}</g>`; };
function chMouth(ex, x, y) {
  // miệng nhỏ kiểu anime chibi; miệng mở = khối đỏ sẫm + lưỡi hồng, nét mảnh
  const D = '#6E2228', TG = '#EE8E8E', I = CH_INK;
  const open = (d, tongue, teeth) => `<path d="${d}" fill="${D}" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>` + (tongue ? `<path d="${tongue}" fill="${TG}"/>` : '') + (teeth ? `<path d="${teeth}" fill="#fff"/>` : '');
  switch (ex) {
    case 'smile': return open(`M${x - 13} ${y - 3} Q${x} ${y - 1} ${x + 13} ${y - 4} Q${x + 9} ${y + 12} ${x} ${y + 12} Q${x - 10} ${y + 11} ${x - 13} ${y - 3}Z`, `M${x - 7} ${y + 8} Q${x} ${y + 3} ${x + 7} ${y + 8} Q${x} ${y + 12} ${x - 7} ${y + 8}Z`);
    case 'smug': return chL(`M${x - 11} ${y + 2} Q${x} ${y + 4} ${x + 9} ${y - 1} Q${x + 13} ${y - 4} ${x + 14} ${y - 8}`, 3);
    case 'flat': return chL(`M${x - 9} ${y} L${x + 9} ${y - 1}`, 3);
    case 'frown': return chL(`M${x - 9} ${y + 3} Q${x} ${y - 3} ${x + 9} ${y + 2}`, 3);
    case 'wavy': return chL(`M${x - 12} ${y + 1} q3 -4 6 0 t6 0 t6 0 t6 0`, 2.6);
    case 'o': return open(`M${x} ${y - 6} Q${x + 8} ${y - 6} ${x + 8} ${y + 4} Q${x + 8} ${y + 13} ${x} ${y + 13} Q${x - 8} ${y + 13} ${x - 8} ${y + 4} Q${x - 8} ${y - 6} ${x} ${y - 6}Z`, `M${x - 5} ${y + 9} Q${x} ${y + 5} ${x + 5} ${y + 9} Q${x} ${y + 12} ${x - 5} ${y + 9}Z`);
    case 'yell': return open(`M${x - 18} ${y - 7} Q${x} ${y - 10} ${x + 18} ${y - 9} L${x + 9} ${y + 16} Q${x} ${y + 19} ${x - 9} ${y + 16}Z`, `M${x - 8} ${y + 12} Q${x} ${y + 6} ${x + 8} ${y + 12} Q${x} ${y + 17} ${x - 8} ${y + 12}Z`, `M${x - 16} ${y - 6} Q${x} ${y - 9} ${x + 16} ${y - 8} L${x + 15} ${y - 3} Q${x} ${y - 4} ${x - 15} ${y - 2}Z`);
    case 'crooked': return `<path d="M${x - 20} ${y - 1} Q${x} ${y + 2} ${x + 20} ${y - 7} Q${x + 14} ${y + 8} ${x - 2} ${y + 8} Q${x - 14} ${y + 7} ${x - 20} ${y - 1}Z" fill="#fff" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>` + chL(`M${x - 18} ${y + 2} Q${x} ${y + 5} ${x + 17} ${y - 3}`, 1.6) + chL(`M${x + 20} ${y - 7} l5 -4`, 2.6);
    case 'gape': return open(`M${x - 12} ${y - 8} Q${x} ${y - 11} ${x + 12} ${y - 8} Q${x + 15} ${y + 14} ${x + 9} ${y + 26} Q${x} ${y + 30} ${x - 9} ${y + 26} Q${x - 15} ${y + 14} ${x - 12} ${y - 8}Z`, `M${x - 8} ${y + 20} Q${x} ${y + 12} ${x + 8} ${y + 20} Q${x} ${y + 27} ${x - 8} ${y + 20}Z`);
    case 'grit2': return `<path d="M${x - 24} ${y - 7} Q${x} ${y - 10} ${x + 24} ${y - 7} L${x + 20} ${y + 9} Q${x} ${y + 12} ${x - 20} ${y + 9}Z" fill="#fff" stroke="${I}" stroke-width="3.2" stroke-linejoin="round"/>` + chL(`M${x - 22} ${y + 1} Q${x} ${y + 3} ${x + 22} ${y + 1} M${x - 12} ${y - 8} V${y + 10} M${x} ${y - 9} V${y + 11} M${x + 12} ${y - 8} V${y + 10}`, 1.8) + chL(`M${x - 24} ${y - 7} l-6 6 M${x + 24} ${y - 7} l6 6`, 2.6);
    case 'pgrit': return `<path d="M${x - 22} ${y - 2} L${x - 11} ${y - 8} L${x} ${y - 3} L${x + 11} ${y - 8} L${x + 22} ${y - 2} L${x + 18} ${y + 9} Q${x} ${y + 12} ${x - 18} ${y + 9}Z" fill="#fff" stroke="${I}" stroke-width="3.2" stroke-linejoin="round"/>` + chL(`M${x - 20} ${y + 3} L${x - 10} ${y} L${x} ${y + 3} L${x + 10} ${y} L${x + 20} ${y + 3}`, 1.8);
    case 'tongue': return chL(`M${x - 12} ${y} Q${x} ${y + 5} ${x + 12} ${y - 2}`, 3) + `<path d="M${x + 4} ${y + 1} Q${x + 8} ${y + 14} ${x + 14} ${y + 10} Q${x + 15} ${y + 3} ${x + 11} ${y - 1}Z" fill="${TG}" stroke="${I}" stroke-width="2.4"/>`;
    case 'tac': return chL(`M${x - 14} ${y + 2} Q${x - 2} ${y + 4} ${x + 6} ${y - 2}`, 3) + `<path d="M${x + 6} ${y - 3} Q${x + 20} ${y - 6} ${x + 22} ${y + 4} Q${x + 14} ${y + 10} ${x + 7} ${y + 2}Z" fill="${TG}" stroke="${I}" stroke-width="2.4"/>`;
    case 'goldgrin': return `<path d="M${x - 20} ${y - 2} Q${x} ${y + 3} ${x + 20} ${y - 8} Q${x + 14} ${y + 9} ${x - 2} ${y + 9} Q${x - 14} ${y + 8} ${x - 20} ${y - 2}Z" fill="#fff" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><rect x="${x + 4}" y="${y - 4}" width="7" height="9" fill="#E8B830" stroke="${I}" stroke-width="1.6"/>` + chL(`M${x - 18} ${y + 2} Q${x} ${y + 5} ${x + 17} ${y - 3}`, 1.6) + chL(`M${x + 20} ${y - 8} l5 -4`, 2.6);
    case 'cry': return open(`M${x - 16} ${y - 2} Q${x - 8} ${y - 8} ${x} ${y - 3} Q${x + 8} ${y - 8} ${x + 16} ${y - 2} Q${x + 12} ${y + 14} ${x} ${y + 15} Q${x - 12} ${y + 14} ${x - 16} ${y - 2}Z`, `M${x - 8} ${y + 10} Q${x} ${y + 5} ${x + 8} ${y + 10} Q${x} ${y + 14} ${x - 8} ${y + 10}Z`);
    case 'grit': return `<path d="M${x - 15} ${y - 5} Q${x} ${y - 7} ${x + 15} ${y - 6} L${x + 12} ${y + 7} Q${x} ${y + 9} ${x - 12} ${y + 7}Z" fill="#fff" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>` + chL(`M${x - 13} ${y + 1} Q${x} ${y + 2} ${x + 13} ${y}`, 1.8);
    default: return chL(`M${x - 9} ${y} Q${x} ${y + 2} ${x + 9} ${y}`, 3);
  }
}
// biểu cảm → [mắt, góc lông mày, miệng, phụ]
const CH_EXPR = {
  // [mắt, góc lông mày, miệng, hiệu ứng, {bNear, bFar, bY, look}]
  neutral: ['open', 0, 'n'], calm: ['half', -2, 'n'], smile: ['happy', -6, 'smile'], smug: ['half', 6, 'smug', '', { bNear: -6, bFar: 10 }],
  fierce: ['angry', 16, 'flat'], yell: ['angry', 22, 'yell', 'vein'], grit: ['angry', 22, 'grit2', 'vein'],
  shock: ['shock', -12, 'gape', 'gloom', { bY: -12 }], awkward: ['half', 0, 'crooked', 'sweat', { bNear: -16, bFar: 6, look: -1 }],
  pain: ['pain', -22, 'pgrit', 'tear'], strain: ['angry', 16, 'grit2', 'sweat'], sad: ['half', -18, 'frown'],
  // riêng người dẫn MC
  tinhbo: ['half', 2, 'tongue'], tac: ['half', 8, 'tac', 'tac', { bNear: -10, bFar: 10, look: 1 }], grin: ['half', 6, 'goldgrin', '', { bNear: -8, bFar: 12 }],
  tiec: ['closed', -24, 'cry', 'stream'], quiz: ['open', 0, 'smug', '', { bNear: -18, bFar: 8, look: 1 }],
};
// mặt nạ sắt (Du Thản Chi): che cả mặt; cảm xúc chỉ còn qua đôi mắt trong 2 lỗ + vạch phụ
function chMask(c, ex, look) {
  const M = c.mask, MS = mixC(M, '#000000', 0.25);
  let s = chT('M-112 -150 Q-116 -196 12 -200 Q140 -196 140 -150 L140 -10 Q140 60 126 92 Q100 132 40 140 Q8 144 -22 138 Q-80 124 -100 84 Q-114 50 -112 -10Z', M, MS, { sx: 18, sy: 0, lw: 5.5 });
  s += chL('M14 -196 V60', 4, MS, 0.9) + chL('M-108 -36 H138', 3, MS, 0.7);
  for (const [x, y] of [[-96, -170], [124, -170], [-100, 60], [128, 60], [14, 100], [-60, -186], [88, -186]]) s += `<circle cx="${x}" cy="${y}" r="6" fill="${mixC(M, '#ffffff', 0.35)}" stroke="${CH_INK}" stroke-width="2"/>`;
  for (const x of [-38, 64]) s += `<ellipse cx="${x}" cy="14" rx="34" ry="24" fill="#1A1416" stroke="${CH_INK}" stroke-width="3"/>`;
  s += chL('M-20 100 H48 M-14 114 H42', 3.5, '#1A1416');
  const lk = (look || 0) * 6;
  for (const x of [-38, 64]) {
    if (ex === 'closed' || ex === 'happy') s += chL(`M${x - 16} 14 Q${x} ${ex === 'happy' ? 2 : 20} ${x + 16} 14`, 4, '#F2EEE6');
    else if (ex === 'pain') s += chL(`M${x - 12} 4 L${x + 10} 14 L${x - 12} 24`, 4, '#F2EEE6');
    else if (ex === 'angry') s += `<path d="M${x - 18 + lk} 8 L${x + 18 + lk} ${x < 0 ? 18 : 2} L${x + 14 + lk} 22 L${x - 14 + lk} 22Z" fill="#F2EEE6"/>`;
    else { const r = ex === 'shock' ? 13 : 9; s += `<circle cx="${x + lk}" cy="14" r="${r}" fill="#F2EEE6"/><circle cx="${x + lk}" cy="14" r="${ex === 'shock' ? 4 : 5}" fill="#1A1416"/>`; }
  }
  return s;
}
// râu kiểu khác: short (râu quai nón lởm chởm), goatee (ria mỏng + chòm cằm), stache (chỉ ria)
function chBeard2(c, mouthEx, T, seed) {
  const B = c.beard, BS = c.beardS || mixC(B, '#000000', 0.2), st = c.beardStyle;
  let s = '';
  if (st === 'short') s += chT('M-86 52 Q-74 116 -20 136 Q14 150 56 140 Q112 122 130 46 Q118 86 96 96 L84 112 L70 100 L52 120 L36 104 L14 122 L0 104 L-20 118 L-34 100 L-56 104 Q-74 86 -86 52Z', B, BS, { sx: -6, sy: 0, lw: 3.8 });
  s += chMZ(mouthEx, 13, 94);
  if (st === 'goatee') { const sw = Math.sin(T * 2 + seed) * 3; s += chT(`M-2 118 Q14 112 30 118 Q30 150 ${16 + sw} 184 Q0 150 -2 118Z`, B, BS, { sx: -3, sy: 0, lw: 3 }); }
  s += chT(st === 'short' ? 'M-30 82 Q12 62 58 80 Q62 92 50 92 Q14 78 -22 92 Q-36 92 -30 82Z' : 'M-24 84 Q12 70 50 84 Q58 104 44 110 Q40 92 14 88 Q-14 92 -18 110 Q-32 104 -24 84Z', B, BS, { sx: 0, sy: -3, lw: 3 });
  return s;
}
// ---------- đầu: trả về [sau, trước] (tóc sau vẽ SAU thân) ----------
function chHead(c, ex, T, o = {}) {
  const E = CH_EXPR[ex] || CH_EXPR.neutral, seed = o.seed || 0, SK = c.skin || CH_SKIN, SS = c.skinS || CH_SKIN_S;
  let eyeEx = E[0]; const EO = E[4] || {};
  const blink = ((T + seed * 1.37) % 3.4) < 0.11 && (eyeEx === 'open' || eyeEx === 'half' || eyeEx === 'angry');
  if (blink) eyeEx = 'closed';
  let back = '', s = '', front = '';
  const lag = o.lag || 0;
  // tóc dài sau lưng (lượn sóng, nhiều lọn)
  if (c.longHair) { const sw = Math.sin(T * 1.8 + seed) * 8 + lag * 40;
    back += chT(`M-120 -120 Q-176 20 ${-168 + sw * 0.6} 170 Q${-160 + sw} 280 ${-120 + sw} 330 Q${-96 + sw} 290 ${-80 + sw * 0.8} 330 Q${-56 + sw * 0.6} 280 -50 230 Q-40 150 -10 100 Q60 40 120 -60 Q60 -140 -120 -120Z`, c.hair, c.hairS, { sx: 16, sy: 0 });
    back += chL(`M-140 -20 Q${-150 + sw * 0.5} 120 ${-136 + sw} 300 M-104 10 Q${-110 + sw * 0.6} 160 ${-90 + sw * 0.8} 300 M-70 80 Q${-74 + sw * 0.5} 180 ${-60 + sw * 0.6} 250`, 3, c.hairS, 0.9); }
  if (c.pony) { const sw = Math.sin(T * 2.4 + seed) * 12 + lag * 60;
    back += chT(`M-30 -200 Q-130 -230 ${-200 + sw * 0.5} -150 Q${-260 + sw} -60 ${-236 + sw * 1.3} 80 Q${-220 + sw} 20 ${-196 + sw} 40 Q${-180 + sw * 0.8} -40 ${-150 + sw * 0.6} -90 Q-110 -150 -20 -150Z`, c.hair, c.hairS, { sx: 10, sy: -6 });
    back += chL(`M-60 -200 Q${-180 + sw * 0.5} -170 ${-216 + sw} -40 M-80 -176 Q${-170 + sw * 0.6} -130 ${-200 + sw * 1.1} 30`, 3, c.hairS, 0.9); }
  if (c.bald) back += '';
  if (c.scholar) { const sw = Math.sin(T * 2 + seed) * 6; back += chT(`M-96 -150 Q${-150 + sw} -110 ${-170 + sw} -40 L${-150 + sw} -36 Q${-136 + sw} -100 -84 -132Z M-70 -160 Q${-120 + sw} -100 ${-126 + sw} -20 L${-108 + sw} -18 Q${-104 + sw} -90 -58 -140Z`, '#2A2630', '#16141C', { sx: 4, sy: 0, lw: 3 }); }
  // cổ
  s += chT('M-34 70 L-30 150 L40 150 L42 70Z', SK, SS, { sx: -14, sy: 0, lw: 4 }) + `<path d="M-32 100 Q6 136 40 104 L42 70 L-34 70Z" fill="${SS}" opacity="0.85"/>`;
  // mặt: má tròn, cằm nhọn lệch phải (3/4)
  const face = c.fem ? 'M-104 -70 Q-106 -178 12 -186 Q130 -180 130 -70 Q132 -6 122 30 Q106 90 60 118 Q24 134 -4 126 Q-50 110 -76 72 L-94 30 Q-106 -8 -104 -70Z'
    : c.jaw === 'square' ? 'M-112 -70 Q-114 -182 12 -190 Q140 -184 140 -70 Q142 -8 136 36 L126 86 Q104 126 50 136 Q16 142 -16 136 Q-66 126 -88 86 L-104 36 Q-114 -8 -112 -70Z'
    : c.chubby ? 'M-112 -70 Q-114 -180 12 -188 Q138 -182 138 -70 Q144 0 136 46 Q122 100 70 124 Q20 140 -24 126 Q-80 108 -104 52 Q-118 0 -112 -70Z' : 'M-108 -70 Q-110 -180 12 -188 Q134 -182 134 -70 Q136 -8 126 30 L112 76 Q88 114 44 128 Q16 136 -12 128 Q-56 114 -80 76 L-98 30 Q-110 -8 -108 -70Z';
  const fid = 'chF' + (CHN++);
  s += chT(face, SK, SS, { sx: 20, sy: 2, lw: 5.5 });
  if (false) s += `<clipPath id="${fid}"><path d="${face}"/></clipPath><g clip-path="url(#${fid})" opacity="0.5"><path d="M-128 -10 Q-150 -200 6 -234 Q152 -246 158 -90 Q160 -50 146 -14 Q140 -84 104 -116 Q72 -138 26 -128 Q20 -150 12 -158 Q2 -136 -24 -130 Q-66 -132 -94 -102 Q-110 -72 -110 -10 Q-118 -14 -128 -10Z" transform="translate(4 12)" fill="${CH_SKIN_S}"/><path d="M14 -150 Q-20 -126 -26 -80 Q-30 -60 -44 -50 Q-14 -60 -8 -96 Q-2 -124 22 -134Z" transform="translate(6 10)" fill="${CH_SKIN_S}"/></g>`;
  else s += `<path d="M40 -120 Q100 -110 124 -40" fill="none" stroke="${SS}" stroke-width="16" opacity="0.5" stroke-linecap="round"/>`;
  if (E[3] === 'gloom') { const gid2 = 'chG' + (CHN++); s += `<clipPath id="${gid2}"><path d="${face}"/></clipPath><g clip-path="url(#${gid2})"><defs><linearGradient id="${gid2}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A6CB8" stop-opacity="0.55"/><stop offset="1" stop-color="#5A6CB8" stop-opacity="0"/></linearGradient></defs><rect x="-130" y="-200" width="280" height="170" fill="url(#${gid2}g)"/>${[-70, -44, -18, 8, 34, 60, 86].map((x, i) => chL(`M${x} ${-150 + (i % 2) * 12} V${-70 - (i % 3) * 10}`, 4, '#4A5A9A', 0.8)).join('')}</g>`; }
  // tai
  if (!c.hood) s += chT('M-104 -4 Q-142 -20 -144 16 Q-142 52 -102 48Z', SK, SS, { sx: 6, sy: 0, lw: 4 }) + chL('M-112 8 Q-128 14 -120 32', 2.5, '#C98F78');
  if (c.stubble) s += `<path d="M-84 64 Q-60 112 -14 128 Q16 138 48 128 Q94 112 118 64" fill="none" stroke="${SS}" stroke-width="20" opacity="0.55" stroke-linecap="round"/>`;
  // má hồng
  const bk = ex === 'awkward' || ex === 'shock' ? 0.8 : 0;
  s += `<ellipse cx="78" cy="58" rx="22" ry="9" fill="${CH_BLUSH}" opacity="${0.45 * bk}"/><ellipse cx="-46" cy="58" rx="20" ry="9" fill="${CH_BLUSH}" opacity="${0.35 * bk}"/>`;
  if (false) s += chL('M68 56 l6 -8 M78 57 l6 -8 M88 58 l6 -8', 2.2, '#E0786A', 0.7 * bk);
  // mắt to, đặt thấp (chibi)
  const look = o.look ?? EO.look ?? 0;
  const eh = c.sharp ? 0.85 : 1;
  if (c.mask) s += chMask(c, eyeEx, look);
  else if (c.fem) s += chEyeF(-38, 18, 30, 36 * eh, c, eyeEx, true, look) + chEyeF(64, 18, 30, 36 * eh, c, eyeEx, false, look);
  else s += chEyeM(-38, 18, 31, 36 * eh, c, eyeEx, true, look) + chEyeM(64, 18, 31, 36 * eh, c, eyeEx, false, look);
  // lông mày
  const ba = E[1], bc = c.brow || c.hair;
  let browS = '';
  if (c.mask) browS += '';
  else if (c.fem) browS += chBrowF(66, -14 + (EO.bY || 0), 32, -(EO.bNear ?? ba) * 1.1, bc) + chBrowF(-40, -14 + (EO.bY || 0), 32, (EO.bFar ?? ba) * 1.1, bc, true);
  else if (c.bald) browS += `<g transform="translate(66 ${-22 + (EO.bY || 0)}) rotate(${-(EO.bNear ?? ba)})"><path d="M-42 6 Q-6 -24 42 -8 L56 -18 L46 2 Q4 -6 -42 14Z" fill="${bc}" stroke="${CH_INK}" stroke-width="2.5"/></g><g transform="translate(-40 ${-22 + (EO.bY || 0)}) rotate(${EO.bFar ?? ba})"><path d="M-48 -2 L-62 -14 L-54 4 Q-18 -20 26 -2 L24 10 Q-14 -4 -48 10Z" fill="${bc}" stroke="${CH_INK}" stroke-width="2.5"/></g>`;
  else browS += chBrow(66, -18 + (EO.bY || 0) + ((EO.bNear ?? ba) < -8 ? -6 : 0), 36, -(EO.bNear ?? ba) * 1.2, bc, 14) + chBrow(-40, -18 + (EO.bY || 0), 36, (EO.bFar ?? ba) * 1.2, bc, 14, true);
  // mũi + miệng
  if (!c.mask) s += c.fem ? chL('M19 50 l3 8 l-5 1', 2.6, CH_INK, 0.55) : chL('M18 44 l5 14 l-8 2', 3, CH_INK, 0.6);
  const bst = c.beardStyle || 'long';
  if (c.mask) s += '';
  else if (!c.beard) s += chMZ(E[2], 13, 94);
  else if (bst !== 'long') s += chBeard2(c, E[2], T, seed);
  if (c.old) s += chL('M98 -2 q8 4 14 0 M-74 0 q-8 4 -14 0', 2, '#C98F78', 0.8);
  // râu sư: ria rủ + chòm dài thon
  if (c.beard && bst === 'long' && !c.mask) { const sw = Math.sin(T * 2 + seed) * 5;
    s += `<g transform="translate(-64 0)">` + chT(`M26 96 Q78 84 132 96 Q142 140 ${124 + sw * 0.4} 180 L${112 + sw * 0.6} 168 L${106 + sw * 0.7} 206 L${92 + sw * 0.8} 190 L${80 + sw} 240 L${68 + sw * 0.8} 192 L${54 + sw * 0.6} 208 L${48 + sw * 0.4} 168 L${36 + sw * 0.3} 178 Q20 140 26 96Z`, c.beard, c.beardS, { sx: -8, sy: 0, lw: 4 });
    s += chT('M34 84 Q58 70 80 82 Q102 70 128 84 Q138 102 130 112 Q112 94 80 96 Q48 94 32 112 Q24 100 34 84Z', c.beard, c.beardS, { sx: 0, sy: -4, lw: 3.5 }) + '</g>';
    s += chMZ(E[2], 14, 104);
    s += `<g transform="translate(-64 0)">` + chL(`M70 124 Q${74 + sw * 0.6} 170 ${72 + sw * 0.9} 210 M96 124 Q${100 + sw * 0.5} 160 ${98 + sw * 0.7} 190`, 2, '#BDB6A6') + '</g>'; }
  // tóc trước
  if (c.hood) { // mũ trùm thằn lằn: vòm ôm mặt + 2 mắt lồi trên đỉnh (mắt mũ cũng biểu cảm)
    const H1 = c.hood, H2 = c.hoodS, ex2 = E[0], shock = ex2 === 'shock', cl = ex2 === 'closed' || ex2 === 'happy' || blink;
    front += chT('M-150 70 Q-176 -150 -16 -222 Q142 -240 180 -100 Q192 -20 168 70 Q154 0 140 -36 Q120 -118 12 -126 Q-100 -118 -118 -36 Q-132 0 -150 70Z', H1, H2, { sx: 14, sy: 8, lw: 5 });
    front += chL('M-140 52 Q-130 -40 -108 -70 Q-60 -132 12 -134 Q110 -128 150 -60 Q164 -20 160 52', 6, H2, 0.9);
    for (const [px, py, r] of [[-120, -110, 9], [-70, -186, 7], [120, -150, 10], [150, -60, 7], [-140, 0, 7], [40, -205, 6]]) front += `<ellipse cx="${px}" cy="${py}" rx="${r}" ry="${r * 0.8}" fill="${c.hoodSpot}"/>`;
    const sw = Math.sin(T * 2.2 + seed) * 2;
    for (const [ex_, ey_] of [[-54, -214], [80, -222]]) {
      front += chT(`M${ex_ - 44} ${ey_ + 10} a44 42 0 1 1 88 0 a44 42 0 1 1 -88 0Z`, H1, H2, { sx: 6, sy: 4, lw: 4.5 });
      if (cl) front += chL(`M${ex_ - 26} ${ey_ + 2} Q${ex_} ${ey_ + 14} ${ex_ + 26} ${ey_ + 2}`, 5);
      else { const pr = shock ? 6 : 13, lk = (look || 0) * 8; front += `<circle cx="${ex_}" cy="${ey_}" r="29" fill="#F6F2DC" stroke="${CH_INK}" stroke-width="3.5"/><ellipse cx="${f1(ex_ + lk + sw)}" cy="${ey_ + 2}" rx="${pr}" ry="${f1(pr * 1.5)}" fill="${CH_INK}"/><circle cx="${f1(ex_ + lk + sw - 3)}" cy="${ey_ - 4}" r="3.5" fill="#fff"/>`;
        if (ex2 === 'half' || ex2 === 'angry') { const tl = ex2 === 'angry' ? (ex_ < 0 ? -8 : 8) : 0; front += `<g transform="rotate(${tl} ${ex_} ${ey_})"><path d="M${ex_ - 31} ${ey_ + 1} A31 31 0 0 1 ${ex_ + 31} ${ey_ + 1}Z" fill="${H1}" stroke="${CH_INK}" stroke-width="3.5"/></g>`; } }
    }
  } else if (c.nunHood) {
    // mũ ni: giữ dáng mũ úp cũ nhưng ôm sát đầu — hai mép dừng sát mép mặt, không chĩa ra (người dùng 2026-10-11: 'mũ như lúc trước nhưng khớp vào đầu')
    const N1 = c.nunHood, N2 = mixC(c.nunHood, '#000000', 0.2), N3 = mixC(c.nunHood, '#000000', 0.3);
    // dáng mũ cũ (đỉnh tròn bo theo đầu), GIỮ hai vạt hai bên nhưng khép sát vào thái dương: mép ngoài bám viền mặt, mép trong nằm trên mặt
    front += chT('M-111 -34 C-116 -110 -134 -204 10 -234 C152 -230 150 -110 137 -34 Q130 -22 121 -34 Q122 -100 108 -124 Q10 -146 -86 -124 Q-98 -100 -95 -34 Q-103 -22 -111 -34Z', N1, N2, { sx: 10, sy: 6, lw: 4.5 }) + chL('M-90 -124 Q10 -146 112 -124', 5, N3);
  } else if (c.bald) {
    s += `<path d="M-92 -110 Q-40 -172 40 -176" fill="none" stroke="#fff" stroke-width="10" opacity="0.3" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) { const px = -26 + (i % 3) * 32 + Math.floor(i / 3) * 6, py = -150 + Math.floor(i / 3) * 22; s += `<circle cx="${px}" cy="${py}" r="5" fill="#E9B48C" stroke="#B9785A" stroke-width="1.6"/>`; }
  } else {
    if (c.bun) { const sw = Math.sin(T * 2 + seed) * 5;
      front += chT('M-46 -244 a54 48 0 1 1 108 0 a54 48 0 1 1 -108 0Z', c.hair, c.hairS, { sx: 10, sy: 8 }) + '';
      if (c.crown === 'silver') { front += chL('M-40 -250 L-132 -226', 6, '#C9D2DC') + chL(`M-124 -228 L${-128 + sw} -168`, 2.5, '#C9D2DC') + chT(`M${-136 + sw} -168 h16 l-4 46 h-8Z`, '#EEF3F7', '#C4CED8', { lw: 2.5 });
      front += chT('M-40 -262 L-24 -296 L8 -284 L26 -306 L44 -284 L68 -294 L72 -258Z', '#E8EEF4', '#A9B6C4', { sx: 4, sy: 4, lw: 3.5 }) + `<circle cx="16" cy="-276" r="7" fill="#9FD0E8" stroke="${CH_INK}" stroke-width="2"/>`; }
      if (c.bunBand) front += chT('M-50 -236 Q8 -222 66 -236 L66 -222 Q8 -208 -50 -222Z', c.bunBand, mixC(c.bunBand, '#000000', 0.25), { lw: 3 });
      if (c.ribbonTails) front += chT(`M-48 -232 Q${-110 + sw} -220 ${-140 + sw * 1.6} -140 L${-124 + sw * 1.6} -134 Q${-96 + sw} -200 -44 -216Z M-40 -226 Q${-86 + sw} -200 ${-96 + sw * 1.4} -110 L${-82 + sw * 1.4} -108 Q${-70 + sw} -190 -34 -214Z`, c.ribbonTails, mixC(c.ribbonTails, '#000000', 0.18), { sx: 3, sy: 0, lw: 2.5 }); }
    if (c.messy) for (const d of ['M-86 -194 Q-118 -232 -134 -228 Q-104 -206 -62 -214Z', 'M-12 -228 Q-2 -262 -10 -272 Q22 -252 28 -230Z', 'M76 -218 Q110 -236 120 -230 Q106 -208 100 -192Z', 'M-118 -96 Q-146 -104 -152 -96 Q-136 -82 -122 -66Z']) front += chT(d, c.hair, c.hairS, { sx: 4, sy: 4, lw: 4 });
    if (c.knot) front += chT('M-30 -236 a40 32 0 1 1 80 0 a40 32 0 1 1 -80 0Z', c.hair, c.hairS, { sx: 8, sy: 6 }) + chT('M-34 -226 Q10 -214 54 -226 L54 -212 Q10 -200 -34 -212Z', c.knot, mixC(c.knot, '#000000', 0.25), { lw: 3 });
    if (c.fem) { // nữ: khối tóc + mái thưa che trán + 2 lọn dài ôm mặt
      front += chT('M-128 -10 Q-150 -200 6 -234 Q152 -246 158 -90 Q160 -50 146 -14 Q140 -84 122 -96 Q114 -70 98 -64 Q92 -96 74 -104 Q64 -72 44 -68 Q36 -102 16 -112 Q6 -78 -14 -74 Q-22 -106 -42 -110 Q-52 -78 -72 -72 Q-82 -98 -98 -94 Q-108 -50 -110 -10 Q-118 -14 -128 -10Z', c.hair, c.hairS, { sx: 14, sy: 10, lw: 4.5 });
      front += chL('M-60 -176 Q-90 -150 -100 -90 M40 -200 Q100 -176 130 -116', 3, c.hairS, 0.9);
      const sw2 = Math.sin(T * 2.2 + seed) * 4;
      front += chT(`M-112 -60 Q-130 40 ${-114 + sw2} 150 L${-98 + sw2} 140 Q-104 40 -96 -50Z`, c.hair, c.hairS, { sx: 4, sy: 0, lw: 3.2 });
      front += chT(`M144 -60 Q162 40 ${148 + sw2} 150 L${132 + sw2} 140 Q138 40 128 -50Z`, c.hair, c.hairS, { sx: 4, sy: 0, lw: 3.2 });
    } else {
    // khối tóc + mái nhiều lọn nhọn
    front += chT('M-128 -10 Q-150 -200 6 -234 Q152 -246 158 -90 Q160 -50 146 -14 Q140 -84 104 -116 Q72 -138 26 -128 Q20 -150 12 -158 Q2 -136 -24 -130 Q-66 -132 -94 -102 Q-110 -72 -110 -10 Q-118 -14 -128 -10Z', c.hair, c.hairS, { sx: 14, sy: 10, lw: 4.5 }) + chT('M14 -150 Q-20 -126 -26 -80 Q-30 -60 -44 -50 Q-14 -60 -8 -96 Q-2 -124 22 -134Z', c.hair, c.hairS, { sx: 3, sy: 0, lw: 3.2 });
    // (bỏ dải bóng tóc — tóc tô 2 tông phẳng như áo)
    front += chL('M-60 -170 Q-90 -140 -100 -70 M40 -196 Q100 -170 130 -110', 3, c.hairS, 0.9);
    // lọn mai hai bên ôm mặt
    front += chT('M-110 -30 Q-114 10 -104 34 Q-100 6 -98 -24Z', c.hair, c.hairS, { sx: 3, sy: 0, lw: 3 });
    front += chT('M146 -30 Q150 10 138 34 Q136 4 132 -24Z', c.hair, c.hairS, { sx: 3, sy: 0, lw: 3 });
    }
    if (c.headband) { const sw = Math.sin(T * 2.6 + seed) * 8 + lag * 40; front += chT('M-134 -96 Q10 -146 158 -98 L160 -72 Q10 -122 -136 -70Z', c.headband, mixC(c.headband, '#000000', 0.25), { sx: 0, sy: -4, lw: 3.5 }); back += chT(`M-130 -90 Q${-186 + sw} -80 ${-214 + sw * 1.5} -20 L${-196 + sw * 1.5} -14 Q${-170 + sw} -62 -126 -72Z M-128 -84 Q${-170 + sw} -50 ${-176 + sw * 1.2} 20 L${-160 + sw * 1.2} 22 Q${-150 + sw} -40 -120 -70Z`, c.headband, mixC(c.headband, '#000000', 0.25), { sx: 3, sy: 0, lw: 3 }); }
    if (c.songHat) { // mũ quan nhà Tống (phốc đầu cánh dài): chóp đen + 2 cánh ngang
      const wc = '#1E1C24', ws = '#0E0C12';
      back += chT('M-128 -184 L-300 -192 Q-318 -184 -300 -174 L-128 -164Z', wc, ws, { sx: 0, sy: 3, lw: 3.5 }) + chT('M150 -184 L322 -192 Q340 -184 322 -174 L150 -164Z', wc, ws, { sx: 0, sy: 3, lw: 3.5 });
      front += chT('M-60 -232 Q-54 -298 16 -302 Q86 -298 92 -232Z', wc, ws, { sx: 6, sy: 4, lw: 4 }) + chT('M-118 -150 Q-110 -240 16 -248 Q134 -240 152 -150 Q20 -180 -118 -150Z', wc, ws, { sx: 8, sy: 6, lw: 4 }) + chL('M-108 -166 Q20 -196 146 -166', 3, '#C9A24A', 0.9);
    }
    if (c.scholar) front += chT('M-112 -150 Q-84 -246 14 -252 Q118 -248 150 -150 Q20 -184 -112 -150Z', '#2A2630', '#16141C', { sx: 8, sy: 6, lw: 4 }) + chL('M-96 -168 Q20 -196 136 -168', 2.5, '#5A5468', 0.8);
    if (c.flower) front += [0, 72, 144, 216, 288].map(a => `<ellipse cx="${f1(124 + Math.cos(a * Math.PI / 180) * 14)}" cy="${f1(-176 + Math.sin(a * Math.PI / 180) * 14)}" rx="12" ry="8" transform="rotate(${a} ${f1(124 + Math.cos(a * Math.PI / 180) * 14)} ${f1(-176 + Math.sin(a * Math.PI / 180) * 14)})" fill="${c.flower}" stroke="${CH_INK}" stroke-width="2.2"/>`).join('') + `<circle cx="124" cy="-176" r="7" fill="#F4D06A" stroke="${CH_INK}" stroke-width="2"/>`;
    if (c.qingHat) { const sw = Math.sin(T * 2.4 + seed) * 6; front += chT('M-150 -150 Q-140 -260 10 -268 Q160 -260 170 -150 Q10 -176 -150 -150Z', '#2A2A34', '#16161E', { sx: 8, sy: 6, lw: 4.5 }) + chT('M-170 -150 Q10 -190 190 -150 L196 -126 Q10 -164 -176 -126Z', '#3A3A46', '#24242C', { lw: 4 }) + `<circle cx="10" cy="-272" r="18" fill="#C0392B" stroke="${CH_INK}" stroke-width="3"/>` + chT(`M0 -272 Q${-80 + sw} -250 ${-150 + sw} -170 L${-140 + sw} -164 Q${-70 + sw} -236 0 -258Z`, '#C0392B', '#8E2A20', { lw: 2.5 }) + chT(`M-20 -262 Q${-120 + sw} -280 ${-200 + sw * 1.5} -230 L${-196 + sw * 1.5} -218 Q${-110 + sw} -262 -18 -250Z`, '#3E8A6A', '#2A6A4E', { lw: 2.5 }) + `<circle cx="${f1(-196 + sw * 1.5)}" cy="-226" r="9" fill="#2A4A8A" stroke="${CH_INK}" stroke-width="2"/>`; }
    if (c.greyStreak) front += chL('M-20 -200 Q-50 -170 -70 -120', 9, c.greyStreak) + chL('M-20 -200 Q-50 -170 -70 -120', 2, c.hairS, 0.6);
    if (c.pony) { front += chT('M-60 -222 Q-20 -246 22 -226 Q-6 -206 -60 -206Z', c.ribbon, mixC(c.ribbon, '#000000', 0.3), { lw: 3 });
      const sw = Math.sin(T * 3 + seed) * 8 + lag * 30;
      front += chT(`M-44 -214 Q${-116 + sw} -210 ${-150 + sw} -170 L${-134 + sw} -160 Q${-106 + sw} -194 -40 -202Z`, c.ribbon, mixC(c.ribbon, '#000000', 0.3), { lw: 2.5 }); }
  }
  front += browS; // lông mày vẽ đè lên mái tóc (kiểu anime) để thấy rõ cảm xúc
  // dấu hiệu cảm xúc
  if (E[3] === 'sweat' || o.sweat) { const u = (T * 1.2 + seed) % 1; front += `<path d="M150 ${-60 + u * 30} q18 28 0 42 q-18 -14 0 -42Z" fill="#CDEBFF" stroke="${CH_INK}" stroke-width="3" opacity="${f1(1 - u * 0.5)}"/><path d="M146 ${-36 + u * 30} q3 8 0 12" stroke="#fff" stroke-width="3" fill="none"/>`; }
  if (E[3] === 'vein') front += `<g transform="translate(118 -112) rotate(10)" fill="none" stroke="#D03A2E" stroke-width="5" stroke-linecap="round"><path d="M-16 -4 Q-6 -6 -4 -16"/><path d="M4 -16 Q6 -6 16 -4"/><path d="M16 4 Q6 6 4 16"/><path d="M-4 16 Q-6 6 -16 4"/></g>`;
  if (E[3] === 'tear') { const u = (T * 0.9 + seed) % 1; front += `<path d="M98 ${30 + u * 40} q10 16 0 24 q-10 -8 0 -24Z M-62 ${34 + u * 36} q9 14 0 22 q-9 -8 0 -22Z" fill="#BFE6FF" stroke="${CH_INK}" stroke-width="2.5"/>`; }
  if (E[3] === 'tac') { const k = 0.85 + 0.15 * Math.sin(T * 9); front += `<g transform="translate(176 -140) rotate(-14) scale(${f1(k)})"><path d="M-70 -34 L-40 -46 L-20 -70 L4 -48 L40 -60 L44 -30 L76 -14 L46 4 L54 36 L18 26 L-6 50 L-22 22 L-60 26 L-48 -2Z" fill="#FFE07A" stroke="${CH_INK}" stroke-width="3.5"/><text y="12" font-family="'Bangers', ${FH}" font-size="38" text-anchor="middle" fill="${CH_INK}">TẶC!</text></g>`; }
  if (E[3] === 'stream') { const u = (T * 1.4 + seed) % 1; front += `<path d="M48 22 Q44 ${f1(60 + u * 20)} 52 120 L64 120 Q60 ${f1(60 + u * 20)} 62 22Z M-52 26 Q-56 ${f1(64 + u * 20)} -48 120 L-36 120 Q-40 ${f1(64 + u * 20)} -38 26Z" fill="#9FD3F2" stroke="${CH_INK}" stroke-width="2.5" opacity="0.9"/>`; }
  if (E[3] === 'gloom') front += chL('M166 -160 l22 -22 M180 -128 l28 -6 M150 -186 l6 -28', 4.5);
  if (ex === 'fierce') front += chL('M166 -150 l16 -12 M174 -128 l18 -4 M164 -170 l8 -16', 4.5, '#C0392B');
  return [back, s + front];
}

// Góp ý 2026-10-11 (tay sau ở dáng đứng yên bị che nhiều quá; bàn tay tròn hơi ngắn) — CHỜ DUYỆT trên 1 nhân vật, mặc định = như cũ.
// backDx: dời vai sau ra ngoài (px, hệ thân); backA: góc buông tay sau mặc định; handLong: 1 = bàn tay tròn dài hơn.
const CH_OPT = { backDx: 0, backA: 12, handLong: 0, backFuse: 0, frontFuse: 0, idle: '', noIdleArms: 1, carve: 0, stance: 2 };   // noIdleArms=1 CHỐT 2026-10-11 ('thôi dùng bản này đi'); stance 2 CHỐT 2026-10-11 ('duyệt cả 2')
// carve (thử 2026-10-11): tay ẩn → khoét khe nhỏ ở mép dưới hai bên thân để phần mép thân thành ống tay, bàn tay tròn ló dưới.
// noIdleArms (góp ý 2026-10-11 'idle sẽ ko hiện tay luôn, khi nào dùng chiêu hay đánh nhau cần tay thì mới có tay'):
// tay nào scene không điều khiển (không truyền arm/hand cho tay trước, back/backHand cho tay sau) thì KHÔNG vẽ.   // idle: '' | 'behind' (chắp tay sau lưng) | 'muff' (giấu tay trong ống áo trước bụng) | 'hang' (buông thẳng 2 bên)
// Tay LIỀN THÂN (góp ý 2026-10-11): tay đứng yên vẽ như một phần thân áo — ống tay ép sát mép thân, chỉ viền ngoài,
// nếp gấp mảnh ở mép trong, cổ tay áo + bàn tay tròn ló dưới. Tay có cử động (scene truyền arm/back/hand) mới dùng tay rời.
// side: -1 = tay sau (bên trái thân), +1 = tay trước. Toạ độ hệ thân (trước khi scale CH_BS).
function chArmFused(c, side, T) {
  const X = (x) => f1(x * side), col = side < 0 ? mixC(c.robe, c.robeS, 0.45) : c.robe, sh = side < 0 ? mixC(c.robeS, '#000000', 0.12) : c.robeS;
  const sw = Math.sin(T * 2.4 + (side < 0 ? 1.1 : 0)) * 1.5;
  let s = `<g transform="translate(${X(126)} ${f1(-26 + sw)}) scale(1.25)">${chHand('rest', c)}</g>`;
  const d = `M${X(100)} -196 Q${X(150)} -176 ${X(160)} -104 Q${X(166)} -60 ${X(158)} ${f1(-22 + sw)} L${X(98)} ${f1(-18 + sw)} Q${X(110)} -84 ${X(94)} -156Z`;
  s += `<path d="${d}" fill="${col}"/>`;
  s += `<path d="M${X(112)} ${f1(-20 + sw)} Q${X(122)} -90 ${X(108)} -170 L${X(94)} -156 Q${X(110)} -84 ${X(98)} ${f1(-18 + sw)}Z" fill="${sh}" opacity="0.7"/>`;
  s += `<path d="M${X(100)} -196 Q${X(150)} -176 ${X(160)} -104 Q${X(166)} -60 ${X(158)} ${f1(-22 + sw)} L${X(98)} ${f1(-18 + sw)}" fill="none" stroke="${CH_INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += chL(`M${X(98)} ${f1(-18 + sw)} Q${X(110)} -84 ${X(96)} -150`, 3, mixC(sh, '#000000', 0.3), 0.9);
  s += chL(`M${X(156)} ${f1(-26 + sw)} L${X(100)} ${f1(-22 + sw)}`, 8, c.trim) + chL(`M${X(146)} -150 Q${X(152)} -110 ${X(150)} -70`, 2.6, mixC(sh, '#000000', 0.25), 0.7);
  return s;
}
// ---------- bàn tay (cổ tay ở 0,0; cánh tay hướng +y) ----------
function chHand(kind, c) {
  // tay người dẫn MC: LUÔN tay tròn, không ngón — kể cả khi chỉ trỏ (người dùng 2026-10-11)
  if (c && c.gecko) { const sk = c.handSkin || CH_SKIN, ss = c.handSkinS || CH_SKIN_S; return chT('M-24 -2 Q-32 30 -14 46 Q10 54 26 34 Q32 10 22 -4Z', sk, ss, { sx: -5, sy: 0, lw: 3.8 }); }
  const sk = (c && (c.handSkin || c.skin)) || CH_SKIN, ss = (c && (c.handSkinS || c.skinS)) || CH_SKIN_S;
  let s;
  if (kind === 'needle') s = chL('M4 20 L4 150', 3.2, '#D8DEE6') + `<circle cx="4" cy="150" r="5" fill="#fff" opacity="0.95"/>` + chL('M4 24 Q34 40 30 80 Q24 120 50 140', 2.2, '#E2557A') + chT('M-24 -2 Q-30 32 -8 46 Q18 50 26 30 Q30 8 20 -4Z', sk, ss, { sx: -5, sy: 0, lw: 3.5 });
  else if (kind === 'staff') s = `<g transform="rotate(90)">` + chT('M-120 -9 L330 -9 L336 0 L330 9 L-120 9Z', '#7CC48A', '#4E9A62', { sx: 0, sy: 4, lw: 4 }) + [-60, 40, 140, 240].map(x => chL(`M${x} -9 V9`, 3, '#3E7A4E')).join('') + `</g>` + chHand('fist', c);
  else if (kind === 'none') s = '';   // tay áo trống (cụt tay: Cửu Nạn, Dương Quá)
  else if (kind === 'claw') s = chHand('open', c) + [[-13, 76], [-4, 78], [4, 82], [13, 80], [22, 72]].map(([x, y]) => `<path d="M${x - 4} ${y - 4} L${x} ${y + 20} L${x + 4} ${y - 4}Z" fill="#8E44AD" stroke="${CH_INK}" stroke-width="2"/>`).join('');   // móng vuốt tím (Mai Siêu Phong)
  else if (kind === 'flute') s = `<g transform="rotate(90)">` + chT('M-60 -8 L170 -8 L170 8 L-60 8Z', '#7CC48A', '#4E9A62', { sx: 0, sy: 3, lw: 3.5 }) + [20, 60, 100, 140].map(x => `<circle cx="${x}" cy="0" r="3.5" fill="${CH_INK}"/>`).join('') + `</g>` + chHand('fist', c);   // tiêu ngọc (Hoàng Dược Sư)
  else if (kind === 'chopsticks') s = chL('M-4 18 L-20 176 M10 20 L2 178', 7, '#B07E4A') + chHand('fist', c);
  else if (kind === 'point') s = chT('M-20 -4 Q-28 22 -16 40 Q4 50 20 40 Q28 24 20 0Z', sk, ss, { sx: -5, sy: 0, lw: 3.5 }) + chT('M-7 36 Q-9 70 -5 104 Q4 110 11 104 Q13 70 11 36Z', sk, ss, { sx: -3, sy: 0, lw: 3.5 }) + chL('M16 22 Q30 28 22 40', 3);
  else if (kind === 'fist') s = chT('M-24 -2 Q-30 32 -8 46 Q18 50 26 30 Q30 8 20 -4Z', sk, ss, { sx: -5, sy: 0, lw: 3.5 }) + chL('M-10 32 Q0 38 12 32 M-14 20 Q0 26 16 20', 2.4, '#B98468');
  else if (kind === 'open') s = chT('M-22 -2 Q-30 42 -18 74 L-9 76 L-9 50 L0 82 L9 80 L7 48 L18 74 L26 70 L18 30 L30 42 L34 36 Q24 4 20 -2Z', sk, ss, { sx: -5, sy: 0, lw: 3.2 });
  else if (kind === 'book') s = chT('M-64 10 h128 v86 h-128Z', '#4A3A5A', '#33283F', { lw: 4 }) + chL('M-56 22 h112', 3, '#C9B26A') + chT('M-22 -2 Q-28 26 -10 36 Q16 40 24 22 Q28 6 20 -4Z', sk, ss, { sx: -4, sy: 0, lw: 3.2 });
  else s = CH_OPT.handLong ? chT('M-22 -2 Q-30 38 -14 58 Q12 68 24 44 Q30 10 20 -4Z', sk, ss, { sx: -4, sy: 0, lw: 3.5 }) : chT('M-22 -2 Q-28 28 -10 40 Q16 44 24 26 Q28 6 20 -4Z', sk, ss, { sx: -4, sy: 0, lw: 3.5 });
  return s;
}
function chSword(glow = 0, wood = 0) { // dọc theo +y từ lòng bàn tay; wood=1: kiếm gỗ (Thái Cực)
  if (wood) return `<g transform="rotate(90)">` + chT('M0 -10 L296 -8 Q330 0 296 8 L0 10Z', '#C9965A', '#9A6A36', { sx: 0, sy: 5, lw: 4 }) + chL('M20 -2 L120 -3 M150 2 L260 1', 2.2, '#8A5A2A', 0.7) + chT('M-14 -24 h14 v48 h-14Z', '#8A5A2A', '#6A4220', { lw: 3.5 }) + chT('M-70 -9 h56 v18 h-56Z', '#5A3A22', null, { lw: 3.5 }) + `</g>`;
  return `<g transform="rotate(90)">` + chT('M0 -8 L300 -5 L336 0 L300 5 L0 8Z', '#E4EAF0', '#AEB8C4', { sx: 0, sy: 4, lw: 4 }) + chL('M12 0 L300 0', 2.5, '#FFFFFF', 0.8) + chT('M-14 -28 h14 v56 h-14Z', '#C9A24A', '#94741E', { lw: 3.5 }) + chT('M-70 -9 h56 v18 h-56Z', '#3A2A3A', null, { lw: 3.5 }) + (glow > 0 ? bloom(`<path d="M0 -5 L300 -3 L336 0 L300 3 L0 5Z" fill="#fff"/>`, '#B69CFF', glow) : '') + `</g>`;
}
// tay áo: ống tay + vạt rủ về phía trọng lực (tính trong hệ toạ độ của tay)
const CH_AL = 150;
function chArm(c, ang, hand, front, T, o = {}) {
  const col = front ? c.robe : mixC(c.robe, c.robeS, 0.55), sh = front ? c.robeS : mixC(c.robeS, '#000000', 0.18);
  const L = CH_AL, a = ang * Math.PI / 180, gx = Math.sin(a), k = Math.abs(gx), side = gx < 0 ? -1 : 1; // trọng lực trong hệ tay: (sin a, cos a)
  const sw = Math.sin(T * 3 + (front ? 0 : 1.2)) * 5;
  const fl = 26 + 62 * k; // độ rủ vạt
  // cạnh phía trọng lực có vạt túi rủ; cạnh kia thẳng
  const gPart = side < 0
    ? `Q${f1(-50 - fl + sw)} ${f1(L + 6 - fl * 0.2)} ${f1(-46 - fl * 0.9 + sw)} ${f1(L - 40 - fl * 0.6)} Q${f1(-50 - fl * 0.3)} ${f1(L * 0.4)} -40 -16`
    : `Q-50 ${f1(L * 0.4)} -40 -16`;
  const oEdge = side > 0
    ? `M40 -16 Q${f1(50 + fl * 0.3)} ${f1(L * 0.4)} ${f1(46 + fl * 0.9 + sw)} ${f1(L - 40 - fl * 0.6)} Q${f1(50 + fl + sw)} ${f1(L + 6 - fl * 0.2)} 46 ${L + 6}`
    : `M40 -16 Q50 ${f1(L * 0.4)} 46 ${L + 6}`;
  const d = `${oEdge} Q0 ${L + 24} -46 ${L + 6} ${gPart} Q0 -40 40 -16Z`;
  let s = `<g transform="rotate(${f1(ang)})">`;
  // tay trong (cẳng tay) lộ ra khi giơ cao
  s += chT(d, col, sh, { sx: -12 * (side), sy: 0, lw: 4.5 });
  s += `<path d="M-44 ${L + 4} Q0 ${L + 22} 44 ${L + 4}" fill="none" stroke="${c.trim}" stroke-width="8" stroke-linecap="round"/>`;
  s += chL(`M-8 16 Q-12 70 -10 ${L - 20} M16 26 Q20 80 22 ${L - 24}`, 2.6, mixC(sh, '#000000', 0.25), 0.7);
  if (c.beads && front) s += `<g transform="translate(0 ${L + 12})">${[...Array(7)].map((_, i) => `<circle cx="${-30 + i * 10}" cy="${f1(4 + Math.sin(i / 6 * Math.PI) * 10)}" r="6.5" fill="#6A3A22" stroke="${CH_INK}" stroke-width="1.8"/>`).join('')}</g>`;
  s += `<g transform="translate(0 ${L + 10}) scale(1.25)">` + (hand === 'sword' || hand === 'woodsword' ? `<g transform="rotate(${f1(o.wpn ?? 0)})">${chSword(o.glow || 0, hand === 'woodsword')}</g>` + chHand('fist', c) : chHand(hand, c)) + `</g>`;
  return s + '</g>';
}
// ---------- thân (vai hẹp hơn đầu) ----------
const CH_SH = [92, -196]; // vai trước (x, y); vai sau = (-x, y)
function chBody(c, T, o = {}) {
  // áo: vai tròn, 3 lớp cổ chéo, đai lưng có nút thắt + 2 dải rủ, nếp vải
  const hk = CH_OPT.carve === 2 || CH_OPT.carve === 3 ? (CH_OPT.carve === 3 ? 'fist' : 'rest') : null;   // 2/3: KHÔNG khoét, chỉ thêm 2 bàn tay (tròn / nắm) ở mép dưới
  const hL = hk && o.carveL, hR = hk && o.carveR, cL = !hk && o.carveL, cR = !hk && o.carveR;
  let s = '';
  if (cL || cR) { // bàn tay tròn ló dưới ống tay (vẽ trước thân để mép ống tay đè lên cổ tay)
    const sw = Math.sin(T * 2.4) * 1.2;
    if (cL) s += `<g transform="translate(-110 ${f1(-14 + sw)}) scale(1.08)">${chHand('rest', c)}</g>`;
    if (cR) s += `<g transform="translate(110 ${f1(-14 - sw)}) scale(1.08)">${chHand('rest', c)}</g>`;
  }
  if (hL || hR) { const sw = Math.sin(T * 2.4) * 1.2;
    if (hL) s += `<g transform="translate(-110 ${f1(-6 + sw)}) scale(1.1)">${chHand(hk, c)}</g>`;
    if (hR) s += `<g transform="translate(110 ${f1(-6 - sw)}) scale(1.1)">${chHand(hk, c)}</g>`; }
  const AL = c.armless === 'left';   // cụt tay trái (Cửu Nạn): bớt hẳn mép thân bên trái
  const bd = (AL ? 'M-80 0 Q-88 -112 -78 -188 Q-58 -230 0 -236' : 'M-124 0 Q-136 -112 -108 -186 Q-74 -228 0 -236') + ' Q74 -228 110 -186 Q138 -112 124 0'
    + (cR ? ' L97 5 L95 -30 Q90 -40 85 -30 L83 8' : '')
    + (cL ? ' Q0 30 -83 8 L-85 -30 Q-90 -40 -95 -30 L-97 5 L-124 0Z' : AL ? ' Q0 24 -80 0Z' : ' Q0 30 -124 0Z');
  s += chT(bd, c.robe, c.robeS, { sx: 24, sy: 0, lw: 5 });
  // ống tay rỗng bên cụt (thử 2026-10-11): 'tuck' nhét vào đai | 'flutter' bay phấp phới | 'knot' buộc gọn ở vai | '' không có
  const ES = AL ? (CH_OPT.emptySleeve || '') : '';   // CHỐT 2026-10-11: người dùng chọn 'chỉ cắt thân' (thụt sâu), không ống tay rỗng
  const sc1 = mixC(c.robe, c.robeS, 0.35), sc2 = mixC(c.robeS, '#000000', 0.15);
  if (ES === 'tuck') {
    s += chT('M-90 -190 Q-118 -170 -122 -110 Q-124 -80 -116 -50 L-92 -52 Q-100 -90 -96 -130 Q-92 -160 -78 -176Z', sc1, sc2, { sx: 6, sy: 0, lw: 4.5 });
    s += chL('M-106 -160 Q-112 -120 -108 -70 M-98 -168 Q-104 -140 -102 -100', 2.6, mixC(sc2, '#000000', 0.3), 0.8) + chL('M-112 -150 l10 4 M-114 -120 l12 2 M-112 -90 l11 1', 2.2, mixC(sc2, '#000000', 0.3), 0.6);
  }
  if (ES === 'knot') {
    s += chT('M-88 -192 Q-124 -176 -126 -132 Q-124 -112 -104 -110 Q-90 -124 -82 -160Z', sc1, sc2, { sx: 5, sy: 0, lw: 4.5 });
    s += chL('M-122 -128 Q-106 -120 -92 -128', 6, c.trim) + `<circle cx="-112" cy="-120" r="9" fill="${c.trim}" stroke="${CH_INK}" stroke-width="3"/>` + chL('M-112 -114 q-6 18 -2 34 M-110 -114 q8 16 4 30', 4, c.trim);
  }
  if (ES === 'flutter') {
    const N = 14, pts = [], L = 260;
    for (let i = 0; i <= N; i++) { const u = i / N, ang = -2.2 + 0.9 * u, w = Math.sin(T * 5 - u * 7) * 26 * u, x = -92 + Math.cos(-2.6 + 0.5 * u) * L * u * 0.55 - 20 * u + w * 0.6, y = -176 + L * u * 0.62 + w; pts.push([x, y, 22 - 12 * u]); }
    const up = pts.map(([x, y, h]) => `${f1(x - h * 0.6)} ${f1(y - h)}`), dn = pts.slice().reverse().map(([x, y, h]) => `${f1(x + h * 0.6)} ${f1(y + h)}`);
    s += chT(`M${up.join(' L')} L${dn.join(' L')}Z`, sc1, sc2, { sx: 4, sy: 0, lw: 4 });
    s += chL(`M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')}`, 2.4, mixC(sc2, '#000000', 0.3), 0.7);
  }
  if (c.kasaya) s += chT('M-112 -178 Q-20 -116 54 0 L124 0 Q134 -96 108 -186 Q56 -146 8 -230 Q-56 -224 -112 -178Z', c.kasaya, c.kasayaS, { sx: 18, sy: 0, lw: 4 }) + chL('M-96 -170 Q-10 -108 64 -4 M-84 -186 Q0 -118 80 -2', 3, c.trim, 0.9) + `<circle cx="-20" cy="-150" r="14" fill="#E6B84E" stroke="${CH_INK}" stroke-width="3"/><circle cx="-20" cy="-150" r="5" fill="${c.kasayaS}"/>`;
  // lớp trong (trắng) → lớp giữa → vạt ngoài có viền
  s += chT('M-40 -232 L30 -110 L60 -124 L10 -238Z', c.inner, mixC(c.inner, '#000000', 0.12), { sx: 4, sy: 0, lw: 3.5 });
  s += chT('M-26 -234 L34 -118 L46 -126 L-6 -236Z', c.trim, mixC(c.trim, '#000000', 0.2), { sx: 2, sy: 0, lw: 2.5 });
  s += chT('M46 -234 L-24 -110 L-60 -126 L2 -238Z', c.robe, c.robeS, { sx: 6, sy: 0, lw: 4 });
  s += chL('M44 -232 L-24 -112', 11, c.trim) + chL('M44 -232 L-24 -112', 2, mixC(c.trim, '#ffffff', 0.5), 0.9);
  if (c.rope) {
    s += chT('M-132 -74 Q0 -54 132 -74 L133 -52 Q0 -32 -133 -52Z', c.sash, mixC(c.sash, '#000000', 0.25), { sx: 0, sy: -4, lw: 3.5 });
    for (let i = -6; i <= 6; i++) s += chL(`M${i * 20 - 6} ${f1(-70 + Math.abs(i) * 0.6)} l12 ${f1(18)}`, 2.5, mixC(c.sash, '#000000', 0.35), 0.8);
    const sw = Math.sin(T * 2.2) * 4; s += chL(`M-60 -52 q-4 ${f1(30 + sw)} -14 ${f1(54 + sw)} M-46 -50 q6 ${f1(30 - sw)} 2 ${f1(50 - sw)}`, 7, c.sash) + chL(`M-60 -52 q-4 ${f1(30 + sw)} -14 ${f1(54 + sw)} M-46 -50 q6 ${f1(30 - sw)} 2 ${f1(50 - sw)}`, 1.8, mixC(c.sash, '#000000', 0.35));
  }
  if (!c.kasaya && !c.rope) {
    const wl = AL ? ((CH_OPT.emptySleeve || '') === 'tuck' ? 124 : 82) : cL ? 112 : 132, wr = cR ? 112 : 132;
    s += chT(`M-${wl} -82 Q0 -60 ${wr} -82 L${wr + 2} -38 Q0 -16 -${wl + 2} -38Z`, c.sash, mixC(c.sash, '#000000', 0.3), { sx: 0, sy: -6, lw: 4 }) + chL(`M-${wl - 2} -62 Q0 -40 ${wr} -62`, 2.5, mixC(c.sash, '#ffffff', 0.3), 0.7);
    const sw = Math.sin(T * 2.2) * 4;
    const kc = mixC(c.sash, '#ffffff', 0.35), kd = mixC(c.sash, '#ffffff', 0.15);
    s += chT(`M-62 -56 l-16 ${f1(64 + sw)} l18 6 l10 -68Z M-40 -54 l4 ${f1(70 - sw)} l18 -2 l-8 -68Z`, kc, kd, { sx: 3, sy: 0, lw: 3 }) + chL(`M-74 ${f1(4 + sw)} l14 4 M-34 ${f1(12 - sw)} l14 -2`, 3, c.trim);
    s += chT('M-78 -74 Q-64 -96 -50 -70 Q-64 -50 -78 -74Z M-50 -70 Q-36 -96 -22 -74 Q-36 -50 -50 -70Z', kc, kd, { sx: 2, sy: 2, lw: 3 }) + `<circle cx="-50" cy="-70" r="9" fill="${kd}" stroke="${CH_INK}" stroke-width="3"/>`;
  }
  if (c.patches) s += chT('M-96 -150 l40 -6 l6 38 l-40 6Z', '#A99A72', '#8C7E5A', { sx: 3, sy: 3, lw: 3 }) + chL('M-92 -146 l32 -5 M-88 -118 l32 -5', 2, '#5A4A30', 0.8) + `<path d="M-96 -150 l40 -6 l6 38 l-40 6Z" fill="none" stroke="#5A4A30" stroke-width="2" stroke-dasharray="5 4" transform="translate(4 4) scale(0.92)"/>` + chT('M64 -30 l34 4 l-4 26 l-34 -4Z', '#8A9AA8', '#6E7E8C', { sx: 2, sy: 2, lw: 3 }) + chL('M66 -26 l28 3', 1.8, '#3A4A58', 0.8);
  if (c.pot) { const sw = Math.sin(T * 2.4) * 3; s += `<g transform="translate(96 -40) rotate(${f1(sw)})">` + chL('M0 -30 L0 0', 3, '#7A5A36') + chT('M-34 4 h68 q4 12 -6 34 q-28 18 -56 0 q-10 -22 -6 -34Z', '#7A4A2C', '#5C3620', { sx: 6, sy: 0, lw: 3.5 }) + chT('M-38 -2 h76 v10 h-76Z', '#8E5A36', null, { lw: 3 }) + chL('M-14 16 q6 4 12 0', 2, '#C08A5A') + '</g>'; }
  if (c.gourd) { const sw = Math.sin(T * 2.2 + 1) * 3; s += `<g transform="translate(100 -46) rotate(${f1(8 + sw)})">` + chL('M0 -26 L0 0', 4, '#B03A2E') + chT('M-16 0 a16 15 0 1 1 32 0 a16 15 0 1 1 -32 0Z M-26 40 a26 26 0 1 1 52 0 a26 26 0 1 1 -52 0Z', '#D9A44A', '#B07E2A', { sx: 6, sy: 0, lw: 3.5 }) + chL('M-14 12 Q0 18 14 12', 4, '#B03A2E') + '</g>'; }
  if (c.embroid) for (const [x, y, r] of [[-70, -170, 22], [80, -120, 18], [-40, -20, 16], [92, -200, 12]]) s += [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${f1(x + Math.cos(a * Math.PI / 180) * r * 0.6)}" cy="${f1(y + Math.sin(a * Math.PI / 180) * r * 0.6)}" rx="${f1(r * 0.42)}" ry="${f1(r * 0.26)}" transform="rotate(${a} ${f1(x + Math.cos(a * Math.PI / 180) * r * 0.6)} ${f1(y + Math.sin(a * Math.PI / 180) * r * 0.6)})" fill="${c.embroid}" opacity="0.9"/>`).join('') + `<circle cx="${x}" cy="${y}" r="${f1(r * 0.22)}" fill="#F4D06A"/>`;
  if (c.rags) s += chT('M-124 -8 L-112 18 L-96 -4 L-80 22 L-62 -2 L-40 20 L-20 -4 L4 18 L24 -6 L46 16 L64 -4 L86 20 L104 -2 L124 14 L124 -8 Q0 20 -124 -8Z', c.robe, c.robeS, { sx: 8, sy: 0, lw: 4 }) + chT('M40 -170 l34 -4 l4 30 l-34 4Z', mixC(c.robe, '#ffffff', 0.25), c.robeS, { sx: 2, sy: 2, lw: 3 }) + chL('M-90 -120 l18 30 M-60 -60 l-14 26', 3, mixC(c.robeS, '#000000', 0.3), 0.8);
  if (c.jade) s += chL('M26 -40 V-2', 3, c.sash) + `<circle cx="26" cy="16" r="20" fill="#CFE6D8" stroke="${CH_INK}" stroke-width="3.5"/><circle cx="26" cy="16" r="6" fill="${c.robe}" stroke="${CH_INK}" stroke-width="2.5"/><path d="M20 36 l-4 22 M32 36 l4 22" stroke="#7FB49A" stroke-width="4"/>`;
  if (c.beads) s += [...Array(15)].map((_, i) => { const a = Math.PI * (0.15 + 0.7 * i / 14); const x = Math.cos(a) * -96 + 8, y = -232 + Math.sin(a) * 140; return `<circle cx="${f1(x)}" cy="${f1(y)}" r="8.5" fill="#6A3A22" stroke="${CH_INK}" stroke-width="2"/><circle cx="${f1(x - 2.5)}" cy="${f1(y - 3)}" r="2.4" fill="#C08A5A"/>`; }).join('');
  s += chL((AL ? 'M-66 -24 Q-60 -84 -70 -146' : 'M-100 -24 Q-92 -84 -106 -146') + ' M100 -20 Q92 -84 108 -150 M70 -12 Q66 -40 76 -66', 3, mixC(c.robeS, '#000000', 0.25), 0.7);
  // ống tay (mép thân hai bên) phủ lên đai lưng → đọc thành cánh tay buông sát người
  const sl = (k, col, sh) => chT(`M${104 * k} -182 Q${138 * k} -112 ${124 * k} 0 L${97 * k} 5 L${95 * k} -30 Q${90 * k} -110 ${104 * k} -182Z`, col, sh, { sx: 10 * k, sy: 0, lw: 4.5 }) + chL(`M${124 * k} -4 L${97 * k} 1`, 7, c.trim);
  if (cL) s += sl(-1, mixC(c.robe, c.robeS, 0.3), c.robeS);
  if (cR) s += sl(1, c.robe, c.robeS);
  return s;
}
// ---------- nhân vật hoàn chỉnh ----------
// st: { x, ground, y (âm = nhấc lên), lean, sq, arm, back, hand, backHand, wpn, glow, ex, look, lag, scale, flip, grey, flash, op, headTilt, spin, sweat }
const CH_BS = 1.32; // thân + tay to hơn so với đầu
const CH_HEAD = [6 * CH_BS, -246 * CH_BS, -146]; // gốc cổ (x, y) + nâng tâm đầu
// đuôi thằn lằn: mọc từ sau hông trái, cong lên, đung đưa
function chTail(c, T, seed = 0, lag = 0) {
  const a = Math.sin(T * 1.6 + seed) * 7 + (lag || 0) * 10;
  let s = `<g transform="rotate(${f1(a)} -96 -40)">` + chT('M-96 -70 Q-196 -60 -226 -150 Q-246 -228 -186 -262 Q-150 -278 -136 -252 Q-130 -238 -152 -236 Q-196 -226 -192 -168 Q-184 -96 -100 -26Z', c.hood, c.hoodS, { sx: -8, sy: 6, lw: 5 });
  for (const [px, py, r] of [[-170, -110, 9], [-206, -176, 8], [-180, -236, 6], [-128, -66, 7]]) s += `<ellipse cx="${px}" cy="${py}" rx="${r}" ry="${r * 0.8}" fill="${c.hoodSpot}"/>`;
  return s + '</g>';
}
// ---------- chân (2026-10-11, cho ~6 cảnh toàn thân): gốc = giữa hông (đáy thân áo), y hướng xuống ----------
// st.legs: 'stand' | 'run' | 'squat' | 'kneel' | 'stance'. Vạt áo dưới + quần ống rộng + giày vải; nét bằng 2 lớp stroke (viền mực + màu).
const CH_LEG = [140, 125]; // đùi, cẳng
// thế tấn: 0 = bản cũ (rộng, gập sâu); 1–3 = bản thử 2026-10-11 (người dùng: 'bản có chân nhìn chân kì quá')
const CH_STANCE = [[[-42, 8], [42, -8], 100, 50], [[-24, 10], [24, -10], 140, 26], [[-18, 4], [18, -4], 150, 20], [[-30, 18], [12, -2], 132, 30]];
function chLegPose(kind, T) {
  // trả về [[aThighL, aShinL], [aThighR, aShinR], hem, flare] — góc tính từ phương thẳng đứng, dương = về phía trước (+x)
  if (kind === 'run') { const p = Math.sin(T * 11), q = Math.cos(T * 11);
    const lg = (u, v) => [42 * u, 42 * u - 70 * Math.max(0, -u) - 18 * Math.max(0, v)];
    return [lg(p, q), lg(-p, -q), 110, 40]; }
  if (kind === 'squat') return [[-82, -8], [82, 8], 70, 60];
  if (kind === 'kneel') return [[8, -92], [4, -96], 120, 30];
  if (kind === 'stance') return CH_STANCE[CH_OPT.stance || 0];
  if (kind === 'stance0') return CH_STANCE[0];
  return [[-2, 0], [2, 0], 160, 14];
}
function chLegHeight(kind, T) {
  const [L, R] = chLegPose(kind, T), h = ([a, b]) => CH_LEG[0] * Math.cos(a * Math.PI / 180) + CH_LEG[1] * Math.cos(b * Math.PI / 180);
  return Math.max(h(L), h(R)) + 26;
}
function chLegs(c, kind, T) {
  const [L, R, hem, fl] = chLegPose(kind, T), P = c.pants || mixC(c.robeS, '#000000', 0.25), PS = mixC(P, '#000000', 0.25), SH = c.shoe || '#2E2630';
  const rad = Math.PI / 180;
  const leg = (hx, [a, b]) => {
    const kx = hx + Math.sin(a * rad) * CH_LEG[0], ky = Math.cos(a * rad) * CH_LEG[0], ax = kx + Math.sin(b * rad) * CH_LEG[1], ay = ky + Math.cos(b * rad) * CH_LEG[1];
    const d = `M${f1(hx)} 0 L${f1(kx)} ${f1(ky)} L${f1(ax)} ${f1(ay)}`;
    let s = `<path d="${d}" fill="none" stroke="${CH_INK}" stroke-width="78" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${PS}" stroke-width="68" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" transform="translate(6 0)"/>`;
    const fa = kind === 'kneel' ? 90 + b * 0.2 : b * 0.4;
    s += `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(${f1(fa)})">` + chT('M-30 -14 Q-36 22 -10 26 L52 26 Q62 8 40 0 L22 -14Z', SH, mixC(SH, '#000000', 0.3), { sx: 4, sy: -3, lw: 4 }) + '</g>';
    return s;
  };
  let s = leg(-52, L) + leg(52, R);
  // vạt áo dưới (2 vạt, xẻ giữa) phủ lên đùi
  const sw = Math.sin(T * 3) * 6 + (kind === 'run' ? Math.sin(T * 11) * 14 : 0);
  s += chT(`M-122 -12 L${-128 - fl + sw * 0.5} ${hem} Q${-60 + sw} ${hem + 16} ${f1(4 + sw)} ${hem + 4} L14 -12Z`, c.robe, c.robeS, { sx: 14, sy: 0, lw: 4.5 });
  s += chT(`M8 -12 L${f1(10 + sw)} ${hem + 2} Q${70 + sw} ${hem + 16} ${f1(128 + fl + sw * 0.5)} ${hem} L122 -12Z`, c.robe, c.robeS, { sx: 14, sy: 0, lw: 4.5 });
  s += chL(`M-118 ${hem - 4} Q-60 ${hem + 12} ${f1(4 + sw)} ${hem + 2} M${f1(12 + sw)} ${hem + 2} Q70 ${hem + 12} ${f1(124 + fl + sw * 0.5)} ${hem - 2}`, 7, c.trim, 0.9);
  return s;
}
function chChar(id, st, T) {
  const c = CHAR[id], seed = st.seed ?? (id.length * 1.3), sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1;
  const br = Math.sin(T * 2.4 + seed);
  const back = st.back ?? (CH_OPT.backA + 6 * Math.sin(T * 2 + seed));
  const ht = (st.headTilt || 0) + Math.sin(T * 1.7 + seed) * 1.6 + (st.lag || 0) * 6;
  const talkPrev = CH_TALK_NOW;
  CH_TALK_NOW = st.talk != null ? st.talk : (CH_SPEAK && CH_SPEAK.k > 0 && !st.sil && CH_SPEAK.ids.some(p => p.endsWith('_') ? id.startsWith(p) : p === id) ? CH_SPEAK.k : 0);
  const [hb, hf] = chHead(c, st.ex || 'neutral', T, { seed, look: st.look, lag: st.lag, sweat: st.sweat });
  CH_TALK_NOW = talkPrev;
  const hT = `translate(${CH_HEAD[0]} ${f1(CH_HEAD[1] + br * 3)}) rotate(${f1(ht)}) translate(0 ${CH_HEAD[2]})`;
  const bk = c.bulk || 1, LH = st.legs ? chLegHeight(st.legs, T) : 0;
  let ch = st.legs ? `<g transform="scale(${CH_BS * bk} ${CH_BS})">${chLegs(c, st.legs, T)}</g>` : '';
  ch += `<g transform="${hT}">${hb}</g>`;
  // dáng đứng yên (CHỜ DUYỆT) — chỉ khi scene không điều khiển tay nào
  const idle = CH_OPT.idle && st.arm == null && st.back == null && (!st.hand || st.hand === 'rest') && !st.backHand && !st.smear && !st.spin && st.legs !== 'run' ? CH_OPT.idle : '';
  if (idle) {
    const B = `<g transform="translate(${-CH_SH[0] + 34} ${CH_SH[1] + 6})">`, F = `<g transform="translate(${CH_SH[0]} ${CH_SH[1]})">`;
    let pre = '', post = '';
    if (idle === 'behind') pre = B + chArm(c, -14, 'none', false, T) + '</g>' + F + chArm(c, 22, 'none', true, T) + '</g>';
    if (idle === 'muff') post = B + chArm(c, -34, 'none', false, T) + '</g>' + F + chArm(c, 34, 'none', true, T) + '</g>';
    if (idle === 'hang') { pre = `<g transform="translate(${-CH_SH[0] + 16} ${CH_SH[1] + 6})">` + chArm(c, 3, 'rest', false, T) + '</g>'; post = `<g transform="translate(${CH_SH[0] + 8} ${CH_SH[1]})">` + chArm(c, -3, 'rest', true, T) + '</g>'; }
    ch += `<g transform="scale(${CH_BS * bk} ${CH_BS})">${pre}${c.tail ? chTail(c, T, seed, st.lag) : ''}${chBody(c, T)}${post}</g>`;
  }
  const hideB = c.armless === 'left' || (CH_OPT.noIdleArms && st.back == null && !st.backHand && !st.smear);
  const hideF = CH_OPT.noIdleArms && st.arm == null && !st.smear && (!st.hand || ['rest', 'open', 'fist', 'point'].includes(st.hand));   // tay cầm đồ (kiếm, kim, tiêu, sách, 'none' tay cụt…) vẫn vẽ
  const fuseB = CH_OPT.backFuse && st.back == null && !st.backHand && !st.legs?.startsWith?.('run') && !st.spin;
  const fuseF = CH_OPT.frontFuse && st.arm == null && (!st.hand || st.hand === 'rest') && !st.smear && !st.spin;
  if (!idle) ch += `<g transform="scale(${CH_BS * bk} ${CH_BS})">${fuseB || hideB ? '' : `<g transform="translate(${-CH_SH[0] + 34 - CH_OPT.backDx} ${CH_SH[1] + 6})">${chArm(c, back, st.backHand || 'rest', false, T)}</g>`}${c.tail ? chTail(c, T, seed, st.lag) : ''}${chBody(c, T, { carveL: CH_OPT.carve && hideB, carveR: CH_OPT.carve && hideF })}${fuseB ? chArmFused(c, -1, T) : ''}${fuseF ? chArmFused(c, 1, T) : ''}</g>`;
  ch += `<g transform="${hT}">${hf}</g>`;
  if (st.smear) st.smear.forEach((ang, i) => { ch += `<g opacity="${f1(0.32 - i * 0.12)}" transform="scale(${CH_BS}) translate(${CH_SH[0] * bk} ${CH_SH[1]})">${chArm(c, ang, st.hand || 'rest', true, T, { wpn: st.wpn })}</g>`; });
  if (!fuseF && !idle && !hideF) ch += `<g transform="scale(${CH_BS}) translate(${CH_SH[0] * bk} ${CH_SH[1]})">${chArm(c, st.arm ?? 16, st.hand || 'rest', true, T, { wpn: st.wpn, glow: st.glow })}</g>`;
  const gy = (st.ground ?? 1090) + (st.y || 0) - LH * CH_BS * sc;
  const tf = `translate(${f1(st.x)} ${f1(gy)}) rotate(${f1((st.lean || 0) * fl)}) scale(${f1(fl * sc * (2 - sq) * 1e4) / 1e4} ${f1(sc * sq * (1 + br * 0.008) * 1e4) / 1e4})${st.spin ? ` rotate(${f1(st.spin)} 0 -300)` : ''}`;
  let g = `<g transform="${tf}">${ch}</g>`;
  if (st.grey) g = `<g filter="url(#rgGrey)">${g}</g>`;
  if (st.sil) g = `<g filter="url(#rgSil)">${g}</g>`;   // bóng đen quần chúng
  if (st.op != null && st.op < 1) g = `<g opacity="${f1(st.op)}">${g}</g>`;
  if (st.flash > 0) g += `<g filter="url(#rgWhite)" opacity="${f1(st.flash)}"><g transform="${tf}">${ch}</g></g>`;
  const shadow = st.shadow === false ? '' : `<ellipse cx="${f1(st.x)}" cy="${f1((st.ground ?? 1090) - 16)}" rx="${f1(160 * sc * (1 + (st.y || 0) / 800))}" ry="${f1(24 * sc)}" fill="#3A2416" opacity="0.18"/>`;
  return shadow + g;
}
// đầu ngón tay / mũi kiếm trên màn hình
function chTip(id, st, T) {
  const sc = st.scale || 1, fl = st.flip ? -1 : 1, sq = st.sq || 1, seed = st.seed ?? (id.length * 1.3), br = Math.sin(T * 2.4 + seed);
  const a = (st.arm ?? 16) * Math.PI / 180, hl = CH_AL + 10;
  let lx, ly;
  if (st.hand === 'sword' || st.hand === 'woodsword') { const w = (st.wpn || 0) * Math.PI / 180, ka = a + w, hx = CH_SH[0] - Math.sin(a) * hl, hy = CH_SH[1] + Math.cos(a) * hl; lx = hx - Math.sin(ka) * 420; ly = hy + Math.cos(ka) * 420; }
  else { const len = hl + 130; lx = CH_SH[0] - Math.sin(a) * len; ly = CH_SH[1] + Math.cos(a) * len; }
  lx += CH_SH[0] * ((CHAR[id].bulk || 1) - 1); lx *= CH_BS; ly *= CH_BS;
  ly -= st.legs ? chLegHeight(st.legs, T) * CH_BS : 0;
  const L = (st.lean || 0) * fl * Math.PI / 180, sx = fl * sc * (2 - sq), sy = sc * sq * (1 + br * 0.008);
  const wx = lx * sx, wy = ly * sy;
  return [st.x + wx * Math.cos(L) - wy * Math.sin(L), (st.ground ?? 1090) + (st.y || 0) + wx * Math.sin(L) + wy * Math.cos(L)];
}

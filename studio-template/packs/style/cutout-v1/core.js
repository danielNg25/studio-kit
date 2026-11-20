// cutout-v1 — "cắt dán" (bản 2, 2026-10-08 — sau góp ý của người dùng: bản 1 cắt thừa nền + viền trắng dày "không hợp lý").
// Cách làm học từ kênh Thanh Pahm, đo lại trên storyboard video Leonardo:
//   • đầu = mặt thật cắt SÁT theo đường viền mũ/tóc/râu (không còn nền), chỉ có NÉT TỐI MẢNH ôm theo hình — không viền trắng
//   • thân = khối ống đứng bo tròn trên vai, rộng ~0,8–0,9 bề rộng đầu, màu theo áo thật của nhân vật, 1 vạch xẻ áo; thường KHÔNG có tay
//   • đầu ≈ 1/3–2/5 chiều cao người; râu/cằm đè lên đỉnh thân; hình phẳng, không bóng đổ
// Đầu cắt là PNG trong suốt làm sẵn bằng tools/make_head.py (rembg tách nền + mặt nạ cắt ở cổ + nét viền) → heads/<id>.png + heads/<id>.yaml.
// KHÔNG chép nhân vật/avatar của Thanh Pahm. Toạ độ khung 1920x1080. Font: Bangers (tiêu đề) + Be Vietnam Pro (chữ) — OFL, fonts/.

const NS = 'http://www.w3.org/2000/svg';
const INK = '#1E1B18', PAPER = '#F4EBD8', LINE = 5;
const F = { title: "'Bangers', 'Impact', sans-serif", bold: "'Be Vietnam Pro', 'Arial', sans-serif" };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// chữ: o = {size, fill, stroke, sw, weight, anchor, font, ls, rot}
const txt = (s, x, y, o = {}) => { const sz = o.size || 48; return `<text x="${x}" y="${y}" font-family="${o.font || F.bold}" font-size="${sz}" font-weight="${o.weight || 800}" text-anchor="${o.anchor || 'middle'}" fill="${o.fill || '#fff'}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || sz * 0.16}" stroke-linejoin="round" paint-order="stroke"` : ''} ${o.ls ? `letter-spacing="${o.ls}"` : ''} ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''}>${esc(s)}</text>`; };

const defs = () => `<defs>
 <filter id="sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0"/></filter>
 <filter id="dim"><feComponentTransfer><feFuncR type="linear" slope="0.55"/><feFuncG type="linear" slope="0.55"/><feFuncB type="linear" slope="0.6"/></feComponentTransfer></filter>
 <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.5"/></radialGradient>
</defs>`;

// ---- nền
const bgPhoto = (href, o = {}) => `<image href="${href}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" ${o.filter ? `filter="url(#${o.filter})"` : ''}/>` + (o.vig !== false ? `<rect width="1920" height="1080" fill="url(#vig)"/>` : '');
const bgPlain = (c) => `<rect width="1920" height="1080" fill="${c || PAPER}"/>`;

// ---- đầu cắt (PNG trong suốt đã có nét viền). h = {href, w, h (px ảnh), chin (0..1: vị trí cằm/đáy râu tính từ trên — điểm đặt lên thân)}
// đặt: x = tâm ngang, y = điểm "cổ" (đỉnh thân), H = chiều cao đầu trên khung. Trả về chuỗi SVG.
const head = (h, x, y, H, o = {}) => {
  const s = H / h.h, W = h.w * s, top = y - H * (h.neck || 0.86);
  const fl = o.flip ? `translate(${2 * x} 0) scale(-1 1)` : '';
  return `<g transform="${fl} rotate(${o.rot || 0} ${x} ${y})"><image href="${h.href}" x="${x - W / 2 + (h.dx || 0) * W}" y="${top}" width="${W}" height="${H}"/></g>`;
};

// ---- thân ống (kiểu Thanh Pahm): x tâm, y đỉnh (vai), w, h, color, open (màu vạch xẻ áo), collar (màu cổ áo), belt, arms:[{side:-1|1, to:[dx,dy]}]
const peg = (o) => {
  const { x, y } = o, w = o.w, h = o.h, c = o.color || '#2B2B33'; const r = w * 0.42, wb = w * (o.flare || 1.12);
  const d = `M${x - w / 2} ${y + r} Q${x - w / 2} ${y} ${x - w / 2 + r} ${y} L${x + w / 2 - r} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y + r} L${x + wb / 2} ${y + h} L${x - wb / 2} ${y + h}Z`;
  let s = `<path d="${d}" fill="${c}" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round"/>`;
  if (o.open) s += `<path d="M${x + w * 0.06} ${y + h * 0.12} L${x + w * 0.08} ${y + h}" stroke="${o.open}" stroke-width="${Math.max(4, w * 0.035)}" stroke-linecap="round"/>`;
  if (o.collar) s += `<path d="M${x - w * 0.24} ${y + 2} L${x + w * 0.04} ${y + h * 0.16} L${x + w * 0.30} ${y + 2}" stroke="${o.collar}" stroke-width="${w * 0.07}" fill="none" stroke-linejoin="round"/>`;
  if (o.belt) s += `<path d="M${x - w * 0.5} ${y + h * 0.48} L${x + w * 0.5} ${y + h * 0.48}" stroke="${o.belt}" stroke-width="${h * 0.05}"/>`;
  for (const a of (o.arms || [])) { const sx = x + a.side * w * 0.42, sy = y + h * 0.22, ex = sx + a.to[0], ey = sy + a.to[1];
    s += `<path d="M${sx} ${sy} L${ex} ${ey}" stroke="${INK}" stroke-width="${w * 0.17 + 2 * LINE}" stroke-linecap="round"/><path d="M${sx} ${sy} L${ex} ${ey}" stroke="${c}" stroke-width="${w * 0.17}" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="${w * 0.07}" fill="${o.skin || '#E9B48E'}" stroke="${INK}" stroke-width="${LINE - 1}"/>`; }
  return s;
};

// ---- nhân vật lịch sử = thân ống + đầu cắt (tỉ lệ đo từ Thanh Pahm: đầu ≈ 0,45 chiều cao người, thân rộng ≈ bề rộng đầu, râu/cằm đè lên đỉnh thân)
// o = {x, ground, H (cao cả người), head:{href,w,h,neck,bodyW}, color, open, collar, belt, arms, flip, rot, dx}
const person = (o) => {
  const H = o.H, hh = H * 0.45, bodyTop = o.ground - H * 0.62; const s = hh / o.head.h;
  const w = Math.max(o.head.w * s * (o.head.bodyW || 1.0), hh * 0.62) * (o.wide || 1);
  return peg({ x: o.x, y: bodyTop, w, h: o.ground - bodyTop, color: o.color, open: o.open, collar: o.collar, belt: o.belt, arms: o.arms, skin: o.skin })
    + head(o.head, o.x + (o.dx || 0), bodyTop + hh * (1 - (o.head.neck || 0.8)) * 0.0 + 0, hh, { flip: o.flip, rot: o.rot });
};

// ---- người vô danh: đầu tròn trắng nét mảnh, mắt chấm, thân ống. o = {x, ground, H, color, hat, mood, carry}
const stone = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 -28 L36 -32 L46 22 L-44 26Z" fill="#B9A88C" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round"/><path d="M-20 -10 L10 -14" stroke="#8C7B62" stroke-width="4"/></g>`;
const extra = (o) => {
  const H = o.H || 300, r = H * 0.17, y0 = o.ground - H * 0.64, hy = y0 - r * 0.55;
  const eye = (k) => `<circle cx="${o.x + k * r * 0.36}" cy="${hy - r * 0.05}" r="${r * 0.085}" fill="${INK}"/>`;
  const mouth = o.mood === 'shock' ? `<ellipse cx="${o.x}" cy="${hy + r * 0.42}" rx="${r * 0.14}" ry="${r * 0.19}" fill="${INK}"/>` : `<path d="M${o.x - r * 0.22} ${hy + r * 0.32} Q${o.x} ${hy + r * 0.48} ${o.x + r * 0.22} ${hy + r * 0.32}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const hat = o.hat ? `<path d="M${o.x - r * 1.3} ${hy - r * 0.5} L${o.x} ${hy - r * 1.4} L${o.x + r * 1.3} ${hy - r * 0.5}Z" fill="${o.hat}" stroke="${INK}" stroke-width="${LINE - 1}" stroke-linejoin="round"/>` : '';
  return peg({ x: o.x, y: y0, w: r * 2.1, h: o.ground - y0, color: o.color || '#7A8B6F', open: o.open || '#00000033' })
    + `<circle cx="${o.x}" cy="${hy}" r="${r}" fill="#FBF8F2" stroke="${INK}" stroke-width="${LINE - 1}"/>${hat}` + eye(-1) + eye(1) + mouth + (o.carry ? stone(o.x, hy - r * 1.75, r / 50) : '');
};

// ---- người dẫn (NHÁP, chờ duyệt): thanh niên tóc rối, kính tròn, hoodie vàng mù tạt — vẽ cùng nét/khối với thân ống, khác Shiba (kênh Facebook) và su-gia
const narrator = (o) => {
  const sc = o.scale || 1, x = o.x, g = o.ground; const w = 250 * sc, y = g - 330 * sc; const fr = 118 * sc, fx = x, fy = y - fr * 0.78; const L = LINE * sc;
  let s = peg({ x, y, w, h: g - y, color: '#E8A33D', open: '#F7EFDC', arms: o.arms, skin: '#F1C7A1' });
  s += `<path d="M${x - w * 0.36} ${y + 10 * sc} Q${x} ${y + 58 * sc} ${x + w * 0.36} ${y + 10 * sc}" stroke="#B9781F" stroke-width="${22 * sc}" fill="none" stroke-linecap="round"/>`;
  const ears = [-1, 1].map(k => `<circle cx="${fx + k * fr * 0.98}" cy="${fy + fr * 0.08}" r="${fr * 0.2}" fill="#F1C7A1" stroke="${INK}" stroke-width="${L}"/>`).join('');
  const face = `<path d="M${fx - fr * 0.95} ${fy - fr * 0.2} Q${fx - fr} ${fy + fr * 0.85} ${fx} ${fy + fr * 1.0} Q${fx + fr} ${fy + fr * 0.85} ${fx + fr * 0.95} ${fy - fr * 0.2} Q${fx + fr * 0.8} ${fy - fr * 1.05} ${fx} ${fy - fr * 1.05} Q${fx - fr * 0.8} ${fy - fr * 1.05} ${fx - fr * 0.95} ${fy - fr * 0.2}Z" fill="#F1C7A1" stroke="${INK}" stroke-width="${L}"/>`;
  const hair = `<path d="M${fx - fr * 1.0} ${fy - fr * 0.05} Q${fx - fr * 1.12} ${fy - fr * 1.0} ${fx - fr * 0.35} ${fy - fr * 1.22} Q${fx + fr * 0.3} ${fy - fr * 1.45} ${fx + fr * 0.95} ${fy - fr * 1.0} Q${fx + fr * 1.12} ${fy - fr * 0.6} ${fx + fr * 0.98} ${fy - fr * 0.05} L${fx + fr * 0.82} ${fy - fr * 0.42} L${fx + fr * 0.55} ${fy - fr * 0.30} L${fx + fr * 0.40} ${fy - fr * 0.58} L${fx + fr * 0.12} ${fy - fr * 0.36} L${fx - fr * 0.10} ${fy - fr * 0.62} L${fx - fr * 0.38} ${fy - fr * 0.38} L${fx - fr * 0.62} ${fy - fr * 0.56} L${fx - fr * 0.80} ${fy - fr * 0.30}Z" fill="#231F1C" stroke="${INK}" stroke-width="${L}" stroke-linejoin="round"/><path d="M${fx + fr * 0.15} ${fy - fr * 1.3} q${fr * 0.25} ${-fr * 0.25} ${fr * 0.5} ${-fr * 0.05}" stroke="#231F1C" stroke-width="${10 * sc}" fill="none" stroke-linecap="round"/>`;
  const gx = fr * 0.42, gy = fy + fr * 0.05, gr = fr * 0.30;
  const eyes = o.eyes === 'wide'
    ? [-1, 1].map(k => `<circle cx="${fx + k * gx}" cy="${gy}" r="${gr * 0.42}" fill="#fff" stroke="${INK}" stroke-width="${3 * sc}"/><circle cx="${fx + k * gx}" cy="${gy}" r="${gr * 0.13}" fill="${INK}"/>`).join('')
    : [-1, 1].map(k => `<circle cx="${fx + k * gx}" cy="${gy}" r="${gr * 0.18}" fill="${INK}"/>`).join('');
  const glasses = [-1, 1].map(k => `<circle cx="${fx + k * gx}" cy="${gy}" r="${gr}" fill="#ffffff" fill-opacity="0.25" stroke="${INK}" stroke-width="${L}"/>`).join('') + `<path d="M${fx - gx + gr} ${gy} Q${fx} ${gy - gr * 0.35} ${fx + gx - gr} ${gy}" stroke="${INK}" stroke-width="${L}" fill="none"/>`;
  const bh = o.brow === 'up' ? 1.9 : 1.6;
  const brows = [-1, 1].map(k => `<path d="M${fx + k * gx - gr * 0.7} ${gy - gr * (k < 0 ? 1.35 : 1.4)} Q${fx + k * gx} ${gy - gr * bh} ${fx + k * gx + gr * 0.7} ${gy - gr * (k < 0 ? 1.4 : 1.35)}" stroke="#231F1C" stroke-width="${11 * sc}" fill="none" stroke-linecap="round"/>`).join('');
  const my = fy + fr * 0.62;
  const mouth = o.mouth === 'open'
    ? `<path d="M${fx - fr * 0.28} ${my - fr * 0.06} Q${fx} ${my - fr * 0.02} ${fx + fr * 0.28} ${my - fr * 0.06} Q${fx + fr * 0.22} ${my + fr * 0.28} ${fx} ${my + fr * 0.28} Q${fx - fr * 0.22} ${my + fr * 0.28} ${fx - fr * 0.28} ${my - fr * 0.06}Z" fill="#6B2E2E" stroke="${INK}" stroke-width="${4 * sc}"/><path d="M${fx - fr * 0.12} ${my + fr * 0.2} Q${fx} ${my + fr * 0.1} ${fx + fr * 0.12} ${my + fr * 0.2}" fill="#D9707A"/>`
    : `<path d="M${fx - fr * 0.25} ${my} Q${fx} ${my + fr * 0.2} ${fx + fr * 0.25} ${my}" stroke="${INK}" stroke-width="${6 * sc}" fill="none" stroke-linecap="round"/>`;
  const blush = [-1, 1].map(k => `<ellipse cx="${fx + k * fr * 0.62}" cy="${fy + fr * 0.48}" rx="${fr * 0.16}" ry="${fr * 0.09}" fill="#E98C7F" opacity="0.6"/>`).join('');
  return s + ears + face + hair + blush + eyes + glasses + brows + mouth;
};

// ---- thẻ chữ
// tên người (kiểu Thanh Pahm: chữ trắng đậm viền tối đặt trên hình) — "TÊN (năm – năm)"
const nameTag = (name, years, x, y, o = {}) => txt(name, x, y, { size: o.size || 56, fill: '#fff', stroke: INK, sw: 12, weight: 900, anchor: o.anchor || 'middle' }) + (years ? txt(years, x, y + (o.size || 56) * 0.75, { size: (o.size || 56) * 0.55, fill: '#FFD43B', stroke: INK, sw: 9, weight: 800, anchor: o.anchor || 'middle' }) : '');
const placeCard = (s, x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${s.length * 19 + 90}" height="62" rx="10" fill="${INK}" opacity="0.88"/><path d="M30 46 L22 30 L38 30Z" fill="#E8A33D"/><circle cx="30" cy="27" r="13" fill="#E8A33D"/><circle cx="30" cy="27" r="5" fill="${INK}"/>${txt(s, 58, 42, { size: 30, fill: '#fff', anchor: 'start', weight: 700 })}</g>`;
const bigTitle = (main, sub, x, y, o = {}) => (sub ? txt(sub, x, y - (o.size || 150) * 1.08, { font: F.title, size: (o.size || 150) * 0.42, fill: o.subFill || '#FFD43B', stroke: INK, sw: 16, ls: 2, rot: o.rot }) : '') + txt(main, x, y, { font: F.title, size: o.size || 150, fill: '#fff', stroke: INK, sw: 26, ls: 3, rot: o.rot });
const bubble = (s, x, y, tx, ty, size = 40) => { const w = s.length * size * 0.52 + 70, h = size * 2.4, bx = x - w / 2; const t1 = Math.max(bx + 40, Math.min(tx - 30, bx + w - 90)); return `<path d="M${bx + 28} ${y} H${bx + w - 28} Q${bx + w} ${y} ${bx + w} ${y + 28} V${y + h - 28} Q${bx + w} ${y + h} ${bx + w - 28} ${y + h} H${t1 + 60} L${tx} ${ty} L${t1} ${y + h} H${bx + 28} Q${bx} ${y + h} ${bx} ${y + h - 28} V${y + 28} Q${bx} ${y} ${bx + 28} ${y}Z" fill="#fff" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round"/>` + txt(s, x, y + h / 2 + size * 0.36, { size, fill: INK, weight: 800 }); };
const board = (x, y, w, h, inner) => `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="16" fill="#8A5A3B" stroke="${INK}" stroke-width="${LINE}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#F7EFDC" stroke="${INK}" stroke-width="4"/>${inner}`;
const table = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="34" rx="6" fill="#8A5A3B" stroke="${INK}" stroke-width="${LINE}"/><rect x="${x - w / 2 + 30}" y="${y + 34}" width="26" height="150" fill="#6E4630" stroke="${INK}" stroke-width="${LINE}"/><rect x="${x + w / 2 - 56}" y="${y + 34}" width="26" height="150" fill="#6E4630" stroke="${INK}" stroke-width="${LINE}"/>`;

// ---- biểu tượng gag
const icon = {
  heart: (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 30 C-60 -10 -30 -60 0 -30 C30 -60 60 -10 0 30Z" fill="#E5384B" stroke="${INK}" stroke-width="5"/>`,
  bolt: (x, y, s = 1, r = 0) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M-10 -60 L25 -60 L5 -10 L30 -10 L-25 65 L-5 5 L-30 5Z" fill="#FFD43B" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  anger: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="#D7263D" stroke-width="10" fill="none" stroke-linecap="round"><path d="M-30 -8 Q-10 -10 -8 -30"/><path d="M30 -8 Q10 -10 8 -30"/><path d="M-30 8 Q-10 10 -8 30"/><path d="M30 8 Q10 10 8 30"/></g>`,
  sweat: (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -30 Q22 0 14 16 A15 15 0 0 1 -14 16 Q-22 0 0 -30Z" fill="#7CC6F2" stroke="${INK}" stroke-width="4"/>`,
  q: (x, y, s = 1, r = 0) => txt('?', x, y, { font: F.title, size: 110 * s, fill: '#FFD43B', stroke: INK, sw: 12, rot: r }),
  skull: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 6 A28 28 0 1 1 26 6 L18 22 L-18 22Z" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-10" cy="-2" r="7" fill="${INK}"/><circle cx="10" cy="-2" r="7" fill="${INK}"/></g>`,
  bottle: (x, y, s = 1, label = '', c = '#8FD3C8') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -90 L14 -90 L14 -60 Q52 -40 52 0 L52 60 Q52 76 36 76 L-36 76 Q-52 76 -52 60 L-52 0 Q-52 -40 -14 -60Z" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="-18" y="-104" width="36" height="18" rx="4" fill="#8A5A3B" stroke="${INK}" stroke-width="4"/><rect x="-46" y="-8" width="92" height="58" rx="6" fill="#F7EFDC" stroke="${INK}" stroke-width="3"/>${label.split('|').map((l, i, a) => txt(l, 0, (a.length > 1 ? 14 : 26) + i * 24, { size: 18, fill: INK, weight: 900 })).join('')}</g>`,
};

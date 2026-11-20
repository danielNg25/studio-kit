// chibi-v1 (pack, 2026-10-09 — người dùng: 'như này trông oke hơn') — nâng độ chi tiết sau góp ý "hình thiếu chi tiết" + học MỨC ĐỘ CHI TIẾT của kênh Văn Vở
// (không chép nhân vật/nền của họ): người ống đầu to, NHƯNG có tóc/mũ đúng thời, áo giao lĩnh nhiều lớp, đai + ngọc bội, hoa văn viền,
// tay áo rộng + bàn tay; nền phối cảnh 1 điểm tụ đầy đồ vật; chất giấy + nét mực hơi run.
// Khác Văn Vở có chủ đích: mắt hạt đậu có đốm sáng (họ dùng mắt gạch/lim dim), có tay, nhãn tên = thẻ gỗ treo (họ dùng cuộn giấy),
// màu theo thời (Tần chuộng đen), Hóng là nhân vật trong cảnh.
const INK2 = '#2A211C', SKIN = '#F7DEC8', SKIN_D = '#EBC3A5', HAIR = '#26222A', HAIR_HI = '#4B4656';
const FH = "'Pangolin', 'Be Vietnam Pro', sans-serif";
let _uid = 0; const uid = p => `${p}${++_uid}`;
const mixC = (a, b, t) => { t = Math.max(0, Math.min(1, t)); const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const R1 = v => Math.round(v * 10) / 10;
const P = (x, y) => `${R1(x)} ${R1(y)}`;

// ---------- defs dùng chung: hoa văn + chất giấy + nét run
const _pats = {};
function pat(kind, fg, bg, sc = 1) {
  const id = `p_${kind}_${(fg + bg).replace(/#/g, '')}_${String(sc).replace('.', '_')}`;
  if (_pats[id]) return `url(#${id})`;
  let w = 40 * sc, h = 40 * sc, body = '';
  const B = bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '';
  if (kind === 'thunder') { // lôi văn: xoắn vuông
    w = h = 36 * sc; const s = sc;
    body = `<path d="M${4 * s} ${32 * s} V${4 * s} H${32 * s} V${28 * s} H${10 * s} V${10 * s} H${26 * s} V${22 * s} H${16 * s} V${16 * s}" fill="none" stroke="${fg}" stroke-width="${2.6 * s}"/>`;
  } else if (kind === 'cloud') { // vân văn
    w = 64 * sc; h = 34 * sc; const s = sc;
    body = `<path d="M${4 * s} ${26 * s} q${8 * s} ${-16 * s} ${18 * s} ${-8 * s} q${6 * s} ${6 * s} ${-2 * s} ${8 * s} M${30 * s} ${12 * s} q${10 * s} ${-12 * s} ${20 * s} ${-2 * s} q${4 * s} ${8 * s} ${-6 * s} ${8 * s} q${-6 * s} 0 ${-4 * s} ${-6 * s}" fill="none" stroke="${fg}" stroke-width="${2.4 * s}" stroke-linecap="round"/>`;
  } else if (kind === 'diamond') {
    w = h = 26 * sc; const s = sc;
    body = `<path d="M${13 * s} ${2 * s} L${24 * s} ${13 * s} L${13 * s} ${24 * s} L${2 * s} ${13 * s}Z" fill="none" stroke="${fg}" stroke-width="${2 * s}"/><circle cx="${13 * s}" cy="${13 * s}" r="${2.2 * s}" fill="${fg}"/>`;
  } else if (kind === 'lamellar') {
    w = 22 * sc; h = 18 * sc; const s = sc;
    body = `<rect x="${1.5 * s}" y="${1 * s}" width="${9 * s}" height="${15 * s}" rx="${3 * s}" fill="none" stroke="${fg}" stroke-width="${1.8 * s}"/><rect x="${12.5 * s}" y="${1 * s}" width="${9 * s}" height="${15 * s}" rx="${3 * s}" fill="none" stroke="${fg}" stroke-width="${1.8 * s}"/>`;
  } else if (kind === 'damask') { // hoa văn tường/bình phong
    w = 120 * sc; h = 120 * sc; const s = sc;
    const m = (x, y) => `<g transform="translate(${x * s} ${y * s})"><path d="M0 -26 Q14 -12 0 0 Q-14 -12 0 -26Z M0 26 Q14 12 0 0 Q-14 12 0 26Z M-26 0 Q-12 14 0 0 Q-12 -14 -26 0Z M26 0 Q12 14 0 0 Q12 -14 26 0Z" transform="scale(${s})" fill="${fg}"/><circle r="${4 * s}" fill="${bg || '#fff'}"/></g>`;
    body = m(30, 30) + m(90, 90) + `<circle cx="${90 * s}" cy="${30 * s}" r="${3 * s}" fill="${fg}"/><circle cx="${30 * s}" cy="${90 * s}" r="${3 * s}" fill="${fg}"/>`;
  } else if (kind === 'tile') { // ngói nhìn thẳng
    w = 30 * sc; h = 22 * sc; const s = sc;
    body = `<path d="M0 ${22 * s} Q${15 * s} ${6 * s} ${30 * s} ${22 * s}" fill="none" stroke="${fg}" stroke-width="${2.4 * s}"/><path d="M${15 * s} 0 V${12 * s}" stroke="${fg}" stroke-width="${1.6 * s}"/>`;
  } else if (kind === 'weave') { // vải thô
    w = h = 10 * sc; const s = sc;
    body = `<path d="M0 ${5 * s} H${10 * s} M${5 * s} 0 V${10 * s}" stroke="${fg}" stroke-width="${0.9 * s}" opacity="0.5"/>`;
  } else if (kind === 'coin') { // hoa văn đồng tiền (vải nhà giàu)
    w = h = 44 * sc; const s = sc;
    body = `<circle cx="${22 * s}" cy="${22 * s}" r="${10 * s}" fill="none" stroke="${fg}" stroke-width="${2.2 * s}"/><rect x="${18.5 * s}" y="${18.5 * s}" width="${7 * s}" height="${7 * s}" fill="none" stroke="${fg}" stroke-width="${2 * s}"/><circle cx="${0}" cy="${0}" r="${3 * s}" fill="${fg}"/><circle cx="${44 * s}" cy="${44 * s}" r="${3 * s}" fill="${fg}"/><circle cx="${44 * s}" cy="0" r="${3 * s}" fill="${fg}"/><circle cx="0" cy="${44 * s}" r="${3 * s}" fill="${fg}"/>`;
  }
  _pats[id] = `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${R1(w)}" height="${R1(h)}">${bg ? `<rect width="${R1(w)}" height="${R1(h)}" fill="${bg}"/>` : ''}${body}</pattern>`;
  return `url(#${id})`;
}
function chibiDefs() {
  return `<defs>
<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.32  0 0 0 0 0.26  0 0 0 0 0.2  1.3 0 0 0 -0.55"/></filter>
<filter id="blotch" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0045" numOctaves="3" seed="21"/><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  1.4 0 0 0 -0.55"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
<pattern id="texGrain" patternUnits="userSpaceOnUse" width="256" height="256"><image href="${TEX_GRAIN}" width="256" height="256"/></pattern>
<radialGradient id="vig2" cx="50%" cy="48%" r="75%"><stop offset="62%" stop-color="#3A2A1A" stop-opacity="0"/><stop offset="100%" stop-color="#3A2A1A" stop-opacity="0.32"/></radialGradient>
${Object.values(_pats).join('\n')}
</defs>`;
}
// lớp giấy phủ cuối cùng: dùng ảnh chất giấy dựng sẵn (texture.js) — rẻ; o.fx=true thì dùng bộ lọc feTurbulence (đẹp hơn chút, chậm, cho ảnh tĩnh)
const paper = (o = {}) => o.fx
  ? `<rect width="1920" height="1080" filter="url(#blotch)" opacity="${o.blotch ?? 0.55}" style="mix-blend-mode:multiply"/><rect width="1920" height="1080" filter="url(#grain)" opacity="${o.grain ?? 0.35}" style="mix-blend-mode:multiply"/><rect width="1920" height="1080" fill="url(#vig2)"/>`
  : `<image href="${TEX_BLOTCH}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="none" opacity="${Math.min(1, (o.blotch ?? 0.55) * 1.6)}"/><rect width="1920" height="1080" fill="url(#texGrain)" opacity="${Math.min(1, (o.grain ?? 0.35) * 2)}"/><rect width="1920" height="1080" fill="url(#vig2)"/>`;
const ln = (pts, w = 4, c = INK2, o = '') => `<path d="M${pts.map(p => P(p[0], p[1])).join(' L')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`;
const poly = (pts, fill, w = 4, c = INK2, o = '') => `<path d="M${pts.map(p => P(p[0], p[1])).join(' L')}Z" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" ${o}/>`;
const shade = (d, op = 0.13) => `<path d="${d}" fill="#20140A" opacity="${op}"/>`;

// ================= ĐẦU =================
// o: {x, y (tâm đầu), r, hair:'bun'|'long'|'bald'|'topknot', hat:null|'mien'|'mienBig'|'guan'|'wrap'|'cap', hatColor, eyes:'bean'|'lid'|'wide'|'happy'|'closed'|'side',
//     brow: góc (+ nhíu, - ngạc nhiên), mouth:'flat'|'smile'|'smirk'|'open'|'frown'|'o'|'grin', beard:null|'stache'|'goatee'|'long'|'thin', blush, sweat, look (-1..1), age}
function chHead(o) {
  const { x, y, r } = o, k = r / 100, LW = o.lw || 4.5;
  // o.aging 0..1: tóc/râu/mày bạc dần (sợi bạc trước, rồi cả mái), da nhăn: nếp trán, chân chim, bọng mắt, rãnh mũi–miệng; o.beardGrow: râu dài mọc ra theo aging
  const ag = Math.max(0, Math.min(1, o.aging || 0)), k2 = Math.max(0, Math.min(1, (ag - 0.25) / 0.75)), SIL = '#DADAE0';
  const hcl = mixC(HAIR, SIL, k2), hhi = mixC(HAIR_HI, '#FFFFFF', k2 * 0.9), skc = mixC(mixC(SKIN, '#EDD3BF', ag * 0.8), '#E4E9EE', Math.max(0, Math.min(1, o.dead || 0))), brc = mixC(INK2, '#CFCFD6', k2), bc = mixC(INK2, '#E4E4EA', k2);
  const lk = (o.look || 0) * r * 0.1;
  let back = '', s = '';
  // tóc sau gáy
  if (o.hair === 'long') back += `<path d="M${P(x - r * 0.98, y - r * 0.1)} Q${P(x - r * 1.18, y + r * 1.1)} ${P(x - r * 0.9, y + r * 1.75)} L${P(x + r * 0.9, y + r * 1.75)} Q${P(x + r * 1.18, y + r * 1.1)} ${P(x + r * 0.98, y - r * 0.1)}Z" fill="${hcl}" stroke="${INK2}" stroke-width="${LW}"/>`;
  // tai
  s += [-1, 1].map(q => `<ellipse cx="${R1(x + q * r * 0.98)}" cy="${R1(y + r * 0.14)}" rx="${R1(r * 0.13)}" ry="${R1(r * 0.17)}" fill="${skc}" stroke="${INK2}" stroke-width="${LW * 0.85}"/>`).join('');
  // mặt
  s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${R1(r * 0.97)}" fill="${skc}" stroke="${INK2}" stroke-width="${LW}"/>`;
  // bóng má phải (cel)
  s += `<path d="M${P(x + r * 0.55, y - r * 0.75)} Q${P(x + r * 1.08, y)} ${P(x + r * 0.5, y + r * 0.86)} Q${P(x + r * 0.88, y + r * 0.1)} ${P(x + r * 0.55, y - r * 0.75)}Z" fill="${SKIN_D}" opacity="0.7"/>`;
  // tóc mái (trừ trọc)
  if (o.hair !== 'bald') {
    s += `<path d="M${P(x - r * 1.03, y + r * 0.2)} Q${P(x - r * 1.12, y - r * 1.0)} ${P(x, y - r * 1.04)} Q${P(x + r * 1.12, y - r * 1.0)} ${P(x + r * 1.03, y + r * 0.2)} L${P(x + r * 0.9, y + r * 0.22)} Q${P(x + r * 0.86, y - r * 0.3)} ${P(x + r * 0.12, y - r * 0.5)} Q${P(x + r * 0.02, y - r * 0.35)} ${P(x - r * 0.06, y - r * 0.52)} Q${P(x - r * 0.84, y - r * 0.32)} ${P(x - r * 0.9, y + r * 0.22)}Z" fill="${hcl}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
    // tóc mai
    s += [-1, 1].map(q => `<path d="M${P(x + q * r * 0.9, y - r * 0.05)} Q${P(x + q * r * 0.97, y + r * 0.3)} ${P(x + q * r * 0.86, y + r * 0.5)} Q${P(x + q * r * 0.82, y + r * 0.2)} ${P(x + q * r * 0.8, y - r * 0.02)}Z" fill="${hcl}" stroke="${INK2}" stroke-width="${LW * 0.7}"/>`).join('');
    // ánh tóc
    s += `<path d="M${P(x - r * 0.62, y - r * 0.62)} Q${P(x - r * 0.3, y - r * 0.9)} ${P(x + r * 0.05, y - r * 0.92)}" stroke="${hhi}" stroke-width="${R1(6 * k)}" fill="none" stroke-linecap="round"/><path d="M${P(x + r * 0.3, y - r * 0.85)} Q${P(x + r * 0.55, y - r * 0.76)} ${P(x + r * 0.7, y - r * 0.55)}" stroke="${hhi}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  }
  if (o.hair === 'bun' || o.hair === 'long' || o.hair === 'topknot') { // búi tóc + trâm
    const by = y - r * 1.12;
    s = `<circle cx="${x}" cy="${R1(by)}" r="${R1(r * 0.3)}" fill="${hcl}" stroke="${INK2}" stroke-width="${LW}"/>` + s;
    if (!o.hat) s += `<rect x="${R1(x - r * 0.2)}" y="${R1(by + r * 0.08)}" width="${R1(r * 0.4)}" height="${R1(r * 0.12)}" rx="${R1(r * 0.04)}" fill="#C9A227" stroke="${INK2}" stroke-width="${LW * 0.7}"/><path d="M${P(x - r * 0.48, by - r * 0.04)} L${P(x + r * 0.5, by - r * 0.12)}" stroke="#B48A3C" stroke-width="${R1(7 * k)}" stroke-linecap="round"/><circle cx="${R1(x + r * 0.52)}" cy="${R1(by - r * 0.12)}" r="${R1(r * 0.06)}" fill="#7FB8A4" stroke="${INK2}" stroke-width="2"/>`;
  }
  if (o.flower) { const by = y - r * 1.12; s += `<circle cx="${R1(x - r * 0.3)}" cy="${R1(by + r * 0.05)}" r="${R1(r * 0.12)}" fill="${o.flower}" stroke="${INK2}" stroke-width="${LW * 0.6}"/><circle cx="${R1(x - r * 0.3)}" cy="${R1(by + r * 0.05)}" r="${R1(r * 0.04)}" fill="#F6E27A"/><circle cx="${R1(x - r * 0.48)}" cy="${R1(by + r * 0.16)}" r="${R1(r * 0.08)}" fill="${o.flower}" stroke="${INK2}" stroke-width="${LW * 0.5}"/><path d="M${P(x + r * 0.25, by - r * 0.05)} L${P(x + r * 0.62, by - r * 0.2)}" stroke="#D8B54A" stroke-width="${R1(6 * k)}" stroke-linecap="round"/><path d="M${P(x + r * 0.58, by - r * 0.18)} v${R1(r * 0.35)}" stroke="#D8B54A" stroke-width="${R1(2.5 * k)}"/><circle cx="${R1(x + r * 0.58)}" cy="${R1(by + r * 0.2)}" r="${R1(r * 0.05)}" fill="#E8A0B0" stroke="${INK2}" stroke-width="1.5"/>`; }
  if (o.curl) s += `<path d="M${P(x - r * 0.05, y - r * 0.92)} q${R1(r * 0.2)} ${R1(-r * 0.3)} ${R1(r * 0.05)} ${R1(-r * 0.35)} q${R1(-r * 0.15)} ${R1(r * 0.05)} ${R1(-r * 0.05)} ${R1(r * 0.15)}" stroke="${hcl}" stroke-width="${R1(7 * k)}" fill="none" stroke-linecap="round"/>`;
  // mắt
  const eyY = y + r * 0.12, ex = [x - r * 0.36 + lk, x + r * 0.36 + lk], ew = r * 0.085, eh = r * 0.13;
  const E = o.eyes || 'bean';
  for (const e of ex) {
    if (E === 'x') s += `<path d="M${P(e - ew * 1.3, eyY - eh * 0.9)} L${P(e + ew * 1.3, eyY + eh * 0.9)} M${P(e + ew * 1.3, eyY - eh * 0.9)} L${P(e - ew * 1.3, eyY + eh * 0.9)}" stroke="${INK2}" stroke-width="${R1(6.5 * k)}" stroke-linecap="round"/>`;
    else if (E === 'happy') s += `<path d="M${P(e - ew * 1.3, eyY + eh * 0.3)} Q${P(e, eyY - eh * 1.2)} ${P(e + ew * 1.3, eyY + eh * 0.3)}" stroke="${INK2}" stroke-width="${R1(6 * k)}" fill="none" stroke-linecap="round"/>`;
    else if (E === 'closed') s += `<path d="M${P(e - ew * 1.3, eyY)} Q${P(e, eyY + eh * 0.6)} ${P(e + ew * 1.3, eyY)}" stroke="${INK2}" stroke-width="${R1(6 * k)}" fill="none" stroke-linecap="round"/>`;
    else if (E === 'wide') s += `<ellipse cx="${R1(e)}" cy="${R1(eyY)}" rx="${R1(ew * 1.7)}" ry="${R1(eh * 1.4)}" fill="#fff" stroke="${INK2}" stroke-width="${R1(4 * k)}"/><circle cx="${R1(e)}" cy="${R1(eyY)}" r="${R1(ew * 0.55)}" fill="${INK2}"/>`;
    else {
      const dx = E === 'side' ? ew * 0.8 * (o.sideDir || 1) : 0;
      s += `<ellipse cx="${R1(e + dx)}" cy="${R1(eyY)}" rx="${R1(ew)}" ry="${R1(eh)}" fill="${INK2}"/><circle cx="${R1(e + dx + ew * 0.35)}" cy="${R1(eyY - eh * 0.4)}" r="${R1(ew * 0.38)}" fill="#fff"/>`;
      if (E === 'lid' || E === 'side') s += `<path d="M${P(e - ew * 1.6, eyY - eh * 0.15)} L${P(e + ew * 1.6, eyY - eh * 0.15)} L${P(e + ew * 1.6, eyY - eh * 1.4)} L${P(e - ew * 1.6, eyY - eh * 1.4)}Z" fill="${skc}"/><path d="M${P(e - ew * 1.5, eyY - eh * 0.12)} L${P(e + ew * 1.5, eyY - eh * 0.18)}" stroke="${INK2}" stroke-width="${R1(5.5 * k)}" stroke-linecap="round"/>`;
    }
  }
  if (o.lashes && (E === 'bean' || E === 'lid' || E === 'side')) s += ex.map((e, i) => { const q = i ? 1 : -1; return `<path d="M${P(e + q * ew * 0.9, eyY - eh * 0.5)} l${R1(q * ew * 0.9)} ${R1(-eh * 0.45)}" stroke="${INK2}" stroke-width="${R1(4 * k)}" stroke-linecap="round"/>`; }).join('');
  // lông mày
  const bw = o.browW ?? 1, ba = o.brow || 0;
  s += ex.map((e, i) => { const q = i === 0 ? -1 : 1, by = eyY - eh * 2.1; return `<path d="M${P(e - q * r * 0.12 * bw, by + ba * r * 0.05)} L${P(e + q * r * 0.12 * bw, by - ba * r * 0.05)}" stroke="${brc}" stroke-width="${R1((o.browThick || 7) * k * (1 + ag * 0.35))}" stroke-linecap="round"/>`; }).join('');
  // má hồng
  // mặt tái (chết kiểu hoạt hình): vệt xanh trên trán
  if ((o.dead || 0) > 0.3) s += [-0.3, -0.1, 0.1, 0.3].map(q => `<path d="M${P(x + q * r, y - r * 0.62)} L${P(x + q * r, y - r * (0.3 - Math.abs(q) * 0.3))}" stroke="#7E9CC4" stroke-width="${R1(5 * k)}" stroke-linecap="round" opacity="${R1(Math.min(1, (o.dead - 0.3) / 0.4) * 80) / 100}"/>`).join('');
  if (o.blush !== false && !((o.dead || 0) > 0.3)) s += ex.map((e, i) => `<ellipse cx="${R1(e + (i ? 1 : -1) * r * 0.1)}" cy="${R1(eyY + eh * 1.6)}" rx="${R1(r * 0.12)}" ry="${R1(r * 0.06)}" fill="#E58A7A" opacity="0.45"/>`).join('');
  // nếp tuổi
  if (o.age) s += ex.map(e => `<path d="M${P(e - ew * 1.5, eyY + eh * 1.25)} q${R1(ew * 1.5)} ${R1(eh * 0.5)} ${R1(ew * 3)} 0" stroke="${INK2}" stroke-width="${R1(2.5 * k)}" fill="none" opacity="0.6"/>`).join('');
  // miệng
  const my = y + r * 0.56, M = o.mouth || 'flat', mx = x + lk * 0.6;
  if (M === 'tongue') s += `<path d="M${P(mx - r * 0.15, my - r * 0.02)} Q${P(mx, my + r * 0.06)} ${P(mx + r * 0.15, my - r * 0.02)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/><path d="M${P(mx + r * 0.0, my + r * 0.02)} Q${P(mx - r * 0.02, my + r * 0.24)} ${P(mx + r * 0.09, my + r * 0.25)} Q${P(mx + r * 0.18, my + r * 0.22)} ${P(mx + r * 0.13, my + r * 0.01)}Z" fill="#E87A86" stroke="${INK2}" stroke-width="${R1(4 * k)}"/><path d="M${P(mx + r * 0.07, my + r * 0.05)} L${P(mx + r * 0.08, my + r * 0.17)}" stroke="#B04A58" stroke-width="${R1(3 * k)}" stroke-linecap="round"/>`;
  else if (M === 'smile') s += `<path d="M${P(mx - r * 0.14, my - r * 0.02)} Q${P(mx, my + r * 0.12)} ${P(mx + r * 0.14, my - r * 0.02)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  else if (M === 'smirk') s += `<path d="M${P(mx - r * 0.13, my + r * 0.03)} Q${P(mx + r * 0.04, my + r * 0.06)} ${P(mx + r * 0.17, my - r * 0.07)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  else if (M === 'frown') s += `<path d="M${P(mx - r * 0.13, my + r * 0.05)} Q${P(mx, my - r * 0.06)} ${P(mx + r * 0.13, my + r * 0.05)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  else if (M === 'o') s += `<ellipse cx="${R1(mx)}" cy="${R1(my + r * 0.02)}" rx="${R1(r * 0.07)}" ry="${R1(r * 0.09)}" fill="#7A2E2E" stroke="${INK2}" stroke-width="${R1(3.5 * k)}"/>`;
  else if (M === 'open' || M === 'grin') s += `<path d="M${P(mx - r * 0.16, my - r * 0.03)} Q${P(mx, my + (M === 'grin' ? r * 0.02 : -r * 0.05))} ${P(mx + r * 0.16, my - r * 0.03)} Q${P(mx + r * 0.12, my + r * 0.2)} ${P(mx, my + r * 0.2)} Q${P(mx - r * 0.12, my + r * 0.2)} ${P(mx - r * 0.16, my - r * 0.03)}Z" fill="${M === 'grin' ? '#fff' : '#7A2E2E'}" stroke="${INK2}" stroke-width="${R1(3.5 * k)}"/>`;
  else s += `<path d="M${P(mx - r * 0.1, my)} L${P(mx + r * 0.1, my)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" stroke-linecap="round"/>`;
  if (ag > 0.02) {   // nếp nhăn hiện dần
    const wo = Math.min(1, ag * 1.4), ws = R1(3.2 * k), wc = '#8E5E44';
    let w = '';
    for (const [dy, sp] of [[-0.3, 0.32], [-0.2, 0.4]]) w += `<path d="M${P(x - r * sp, y + r * dy)} q${R1(r * sp * 0.5)} ${R1(-r * 0.05)} ${R1(r * sp)} 0 t${R1(r * sp)} 0" stroke="${wc}" stroke-width="${ws}" fill="none" stroke-linecap="round"/>`;
    ex.forEach((e, i) => { const q = i ? 1 : -1, cx0 = e + q * ew * (E === 'wide' ? 2.7 : 1.9);
      for (const a of [-0.45, 0, 0.45]) w += `<path d="M${P(cx0, eyY + a * eh * 0.8)} l${R1(q * r * 0.13 * Math.cos(a))} ${R1(r * 0.13 * Math.sin(a))}" stroke="${wc}" stroke-width="${ws}" stroke-linecap="round"/>`;
      w += `<path d="M${P(e - ew * 1.3, eyY + eh * 1.35)} q${R1(ew * 1.3)} ${R1(eh * 0.7)} ${R1(ew * 2.6)} 0" stroke="${wc}" stroke-width="${ws}" fill="none" stroke-linecap="round"/>`;
      w += `<path d="M${P(x + q * r * 0.17, y + r * 0.34)} q${R1(q * r * 0.12)} ${R1(r * 0.12)} ${R1(q * r * 0.1)} ${R1(r * 0.3)}" stroke="${wc}" stroke-width="${ws}" fill="none" stroke-linecap="round"/>`;
    });
    s += `<g opacity="${R1(wo * 100) / 100}">${w}</g>`;
    const nS = Math.floor(ag * 9);
    for (let i = 0; i < nS; i++) { const u = -0.75 + i * 0.19 + (i % 2) * 0.05; s += `<path d="M${P(x + u * r, y - r * (0.95 - Math.abs(u) * 0.25))} q${R1(r * 0.08)} ${R1(r * 0.2)} ${R1(r * 0.03)} ${R1(r * 0.4)}" stroke="#F4F4F8" stroke-width="${R1(4 * k)}" fill="none" stroke-linecap="round" opacity="${R1((1 - k2 * 0.8) * 100) / 100}"/>`; }
  }
  if (o.beardGrow && ag > 0.05) { const g2 = Math.min(1, (ag - 0.05) / 0.95), L2 = r * (0.25 + 0.75 * g2);
    s += `<path d="M${P(mx - r * 0.3, my + r * 0.05)} Q${P(mx - r * 0.28, my + L2 * 0.8)} ${P(mx, my + L2 + r * 0.1)} Q${P(mx + r * 0.28, my + L2 * 0.8)} ${P(mx + r * 0.3, my + r * 0.05)} Q${P(mx, my + r * 0.22)} ${P(mx - r * 0.3, my + r * 0.05)}Z" fill="${bc}" stroke="${INK2}" stroke-width="${LW * 0.7}"/>`; }
  // râu
  if (o.beard === 'thin' || o.beard === 'stache') s += [-1, 1].map(q => `<path d="M${P(mx + q * r * 0.03, my - r * 0.1)} Q${P(mx + q * r * 0.3, my - r * 0.16)} ${P(mx + q * r * 0.42, my + (o.beard === 'thin' ? r * 0.22 : r * 0.02))}" stroke="${bc}" stroke-width="${R1((o.beard === 'thin' ? 4 : 8) * k)}" fill="none" stroke-linecap="round"/>`).join('');
  if (o.beard === 'goatee' || o.beard === 'thin') s += `<path d="M${P(mx - r * 0.04, my + r * 0.17)} Q${P(mx, my + r * 0.42)} ${P(mx + r * 0.03, my + r * 0.48)} Q${P(mx + r * 0.06, my + r * 0.3)} ${P(mx + r * 0.05, my + r * 0.17)}Z" fill="${bc}"/>`;
  if (o.beard === 'long') s += `<path d="M${P(mx - r * 0.35, my - r * 0.05)} Q${P(mx - r * 0.3, my + r * 0.75)} ${P(mx, my + r * 0.95)} Q${P(mx + r * 0.3, my + r * 0.75)} ${P(mx + r * 0.35, my - r * 0.05)} Q${P(mx, my + r * 0.2)} ${P(mx - r * 0.35, my - r * 0.05)}Z" fill="${hcl}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
  if (M === 'tongue' && o.beard) s += `<path d="M${P(mx + r * 0.0, my + r * 0.04)} Q${P(mx - r * 0.03, my + r * 0.3)} ${P(mx + r * 0.09, my + r * 0.31)} Q${P(mx + r * 0.2, my + r * 0.27)} ${P(mx + r * 0.14, my + r * 0.03)}Z" fill="#E87A86" stroke="${INK2}" stroke-width="${R1(4 * k)}"/><path d="M${P(mx + r * 0.07, my + r * 0.07)} L${P(mx + r * 0.08, my + r * 0.21)}" stroke="#B04A58" stroke-width="${R1(3 * k)}" stroke-linecap="round"/>`;
  // mồ hôi
  if (o.sweat) s += `<path d="M${P(x + r * 0.95, y - r * 0.55)} q${R1(-r * 0.1)} ${R1(r * 0.16)} 0 ${R1(r * 0.22)} q${R1(r * 0.1)} ${R1(-r * 0.06)} 0 ${R1(-r * 0.22)}Z" fill="#9FD3F2" stroke="${INK2}" stroke-width="${R1(3 * k)}"/>`;
  // mũ
  const hc = o.hatColor || '#1F1C22';
  if (o.hat === 'guan') { // mũ quan (tiến hiền quán) nghiêng về sau
    s += `<path d="M${P(x - r * 0.42, y - r * 0.95)} L${P(x - r * 0.3, y - r * 1.62)} Q${P(x + r * 0.05, y - r * 1.78)} ${P(x + r * 0.42, y - r * 1.5)} L${P(x + r * 0.42, y - r * 0.95)}Z" fill="${hc}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
    s += `<path d="M${P(x - r * 0.36, y - r * 1.3)} Q${P(x, y - r * 1.4)} ${P(x + r * 0.4, y - r * 1.22)}" stroke="#4A4552" stroke-width="${R1(4 * k)}" fill="none"/>`;
    s += `<rect x="${R1(x - r * 0.5)}" y="${R1(y - r * 1.04)}" width="${R1(r)}" height="${R1(r * 0.16)}" rx="${R1(r * 0.05)}" fill="#8E2A22" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
    s += [-1, 1].map(q => `<path d="M${P(x + q * r * 0.46, y - r * 0.92)} Q${P(x + q * r * 0.92, y - r * 0.3)} ${P(x + q * r * 0.86, y + r * 0.35)}" stroke="#8E2A22" stroke-width="${R1(3 * k)}" fill="none"/>`).join('');
  }
  if (o.hat === 'wrap') { // khăn vấn (thương nhân / gia nhân)
    const c1 = o.hatColor || '#8C6A3F', c2 = o.hatColor2 || '#6E5130';
    s += `<path d="M${P(x - r * 0.98, y - r * 0.3)} Q${P(x - r * 1.05, y - r * 1.3)} ${P(x, y - r * 1.34)} Q${P(x + r * 1.05, y - r * 1.3)} ${P(x + r * 0.98, y - r * 0.3)} Q${P(x, y - r * 0.62)} ${P(x - r * 0.98, y - r * 0.3)}Z" fill="${c1}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
    s += `<path d="M${P(x - r * 0.9, y - r * 0.55)} Q${P(x, y - r * 0.82)} ${P(x + r * 0.9, y - r * 0.55)}" stroke="${c2}" stroke-width="${R1(10 * k)}" fill="none"/><path d="M${P(x - r * 0.75, y - r * 0.95)} Q${P(x - r * 0.2, y - r * 1.15)} ${P(x + r * 0.5, y - r * 1.05)}" stroke="${c2}" stroke-width="${R1(4 * k)}" fill="none"/>`;
    // nút khăn + đuôi khăn
    s += `<circle cx="${R1(x + r * 0.7)}" cy="${R1(y - r * 0.85)}" r="${R1(r * 0.16)}" fill="${c1}" stroke="${INK2}" stroke-width="${LW * 0.8}"/><path d="M${P(x + r * 0.78, y - r * 0.78)} Q${P(x + r * 1.3, y - r * 0.6)} ${P(x + r * 1.25, y - r * 0.1)} L${P(x + r * 1.08, y - r * 0.2)} Q${P(x + r * 1.12, y - r * 0.55)} ${P(x + r * 0.76, y - r * 0.66)}Z" fill="${c2}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
    if (o.jade) s += `<circle cx="${R1(x)}" cy="${R1(y - r * 0.72)}" r="${R1(r * 0.09)}" fill="#7FB8A4" stroke="${INK2}" stroke-width="${LW * 0.7}"/>`;
  }
  if (o.hat === 'helmet') { // mũ trụ tướng: chóp da + dải che tai + chóp tua đỏ
    const c1 = o.hatColor || '#4A3F38';
    s += `<path d="M${P(x - r * 1.05, y - r * 0.05)} Q${P(x - r * 1.1, y - r * 1.25)} ${P(x, y - r * 1.25)} Q${P(x + r * 1.1, y - r * 1.25)} ${P(x + r * 1.05, y - r * 0.05)} L${P(x + r * 0.86, y + r * 0.05)} Q${P(x + r * 0.8, y - r * 0.5)} ${P(x, y - r * 0.6)} Q${P(x - r * 0.8, y - r * 0.5)} ${P(x - r * 0.86, y + r * 0.05)}Z" fill="${c1}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
    s += `<path d="M${P(x - r * 0.95, y - r * 0.62)} Q${P(x, y - r * 0.95)} ${P(x + r * 0.95, y - r * 0.62)}" stroke="#C9A227" stroke-width="${R1(7 * k)}" fill="none"/>`;
    s += `<path d="M${P(x, y - r * 1.25)} L${P(x, y - r * 1.55)}" stroke="${INK2}" stroke-width="${R1(8 * k)}"/><path d="M${P(x, y - r * 1.5)} q${R1(r * 0.35)} ${R1(-r * 0.2)} ${R1(r * 0.5)} ${R1(r * 0.15)} q${R1(-r * 0.25)} ${R1(-r * 0.02)} ${R1(-r * 0.5)} ${R1(r * 0.05)}Z" fill="#B83A2E" stroke="${INK2}" stroke-width="${LW * 0.6}"/>`;
  }
  if (o.hat === 'dao') { // mũ đạo sĩ / phương sĩ: mão nhỏ hình hoa sen + trâm
    s += `<path d="M${P(x - r * 0.42, y - r * 0.95)} L${P(x - r * 0.5, y - r * 1.4)} L${P(x - r * 0.18, y - r * 1.22)} L${P(x, y - r * 1.5)} L${P(x + r * 0.18, y - r * 1.22)} L${P(x + r * 0.5, y - r * 1.4)} L${P(x + r * 0.42, y - r * 0.95)}Z" fill="${o.hatColor || '#C9A227'}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M${P(x - r * 0.75, y - r * 1.15)} L${P(x + r * 0.75, y - r * 1.15)}" stroke="#E9E2C8" stroke-width="${R1(6 * k)}" stroke-linecap="round"/>`;
  }
  if (o.hat === 'straw') { // nón rơm nông dân
    s += `<path d="M${P(x - r * 1.45, y - r * 0.55)} Q${P(x, y - r * 0.8)} ${P(x + r * 1.45, y - r * 0.55)} Q${P(x + r * 0.5, y - r * 1.55)} ${P(x, y - r * 1.6)} Q${P(x - r * 0.5, y - r * 1.55)} ${P(x - r * 1.45, y - r * 0.55)}Z" fill="#D9B86A" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>` + [0.35, 0.7].map(q => `<path d="M${P(x - r * 1.45 * (1 - q * 0.55), y - r * (0.55 + q * 0.75))} Q${P(x, y - r * (0.8 + q * 0.72))} ${P(x + r * 1.45 * (1 - q * 0.55), y - r * (0.55 + q * 0.75))}" stroke="#A8873E" stroke-width="${R1(3 * k)}" fill="none"/>`).join('');
  }
  if (o.blindfold) s += `<path d="M${P(x - r * 1.02, y + r * 0.02)} Q${P(x, y - r * 0.08)} ${P(x + r * 1.02, y + r * 0.02)} L${P(x + r * 1.0, y + r * 0.28)} Q${P(x, y + r * 0.18)} ${P(x - r * 1.0, y + r * 0.28)}Z" fill="#E8E0CE" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
  if (o.hat === 'mien' || o.hat === 'mienBig') { // miện: mão có tấm "diên" phẳng + chuỗi ngọc "lưu" rủ trước mặt
    const big = o.hat === 'mienBig', bw2 = r * (big ? 1.9 : 1.35), by = y - r * (big ? 1.32 : 1.38), dropL = r * (big ? 1.5 : 0.55);
    s += `<path d="M${P(x - r * 0.45, y - r * 0.85)} L${P(x - r * 0.4, by + r * 0.08)} L${P(x + r * 0.4, by + r * 0.08)} L${P(x + r * 0.45, y - r * 0.85)}Z" fill="#1E1A1C" stroke="${INK2}" stroke-width="${LW}"/>`;
    s += `<path d="M${P(x - r * 0.42, y - r * 0.98)} H${R1(x + r * 0.42)}" stroke="#C9A227" stroke-width="${R1(6 * k)}"/>`;
    // trâm ngang + dây
    s += `<path d="M${P(x - r * 0.75, y - r * 1.0)} L${P(x + r * 0.75, y - r * 1.0)}" stroke="#D8B54A" stroke-width="${R1(7 * k)}" stroke-linecap="round"/>`;
    s += [-1, 1].map(q => `<path d="M${P(x + q * r * 0.72, y - r * 1.0)} Q${P(x + q * r * 1.1, y - r * 0.2)} ${P(x + q * r * 1.0, y + r * 0.45)}" stroke="#B83A2E" stroke-width="${R1(3.5 * k)}" fill="none"/><circle cx="${R1(x + q * r * 1.0)}" cy="${R1(y + r * 0.5)}" r="${R1(r * 0.07)}" fill="#E9E2C8" stroke="${INK2}" stroke-width="2"/>`).join('');
    // tấm diên (mặt trên đen, mép đỏ) — hơi nghiêng
    const tilt = big ? 0.12 : 0.05;
    s += `<path d="M${P(x - bw2, by - r * tilt)} L${P(x + bw2, by + r * tilt)} L${P(x + bw2, by + r * tilt + r * 0.1)} L${P(x - bw2, by - r * tilt + r * 0.1)}Z" fill="#B83A2E" stroke="${INK2}" stroke-width="${LW * 0.9}" stroke-linejoin="round"/>`;
    s += `<path d="M${P(x - bw2 + r * 0.1, by - r * tilt - r * 0.16)} L${P(x + bw2 + r * 0.1, by + r * tilt - r * 0.16)} L${P(x + bw2, by + r * tilt)} L${P(x - bw2, by - r * tilt)}Z" fill="#1E1A1C" stroke="${INK2}" stroke-width="${LW * 0.9}" stroke-linejoin="round"/>`;
    // chuỗi ngọc lưu
    const n = big ? 11 : 9;
    for (let i = 0; i < n; i++) {
      const fx = x - bw2 * 0.9 + (bw2 * 1.8) * i / (n - 1), fy = by + r * 0.1 + (fx - x) / bw2 * r * tilt;
      s += `<path d="M${P(fx, fy)} V${R1(fy + dropL)}" stroke="#6E5A3A" stroke-width="${R1(1.8 * k)}"/>`;
      for (let j = 0; j < (big ? 6 : 4); j++) { const cy2 = fy + dropL * (j + 0.6) / (big ? 6 : 4); s += `<circle cx="${R1(fx)}" cy="${R1(cy2)}" r="${R1(r * 0.035)}" fill="${['#C8E0C9', '#C94A3A', '#F2EBD3', '#2E6C8E'][(i + j) % 4]}" stroke="${INK2}" stroke-width="1.2"/>`; }
    }
  }
  return { back, front: s };
}

// ================= THÂN (áo giao lĩnh) =================
// o: {x, ground, H, robe:{c, c2(trim), inner, belt, beltC, apron(pattern url|null), hemPat, pattern(url over robe), armor}, arms:{l,r: 'down'|'fold'|'point'|'hold'|[dx,dy]}, ...head opts, scale}
// thở + đung đưa quanh chân (x,g); walk: số bước (bob + lắc)
function idleTr(AT, ph, x, g, H, walk) {
  if (AT === null) return '';
  const b = Math.sin(AT * 2.6 + ph); let rot = 1.4 * Math.sin(AT * 1.3 + ph * 1.7), dy = 0;
  if (walk !== undefined && walk !== null) { const w = walk * Math.PI; dy = -Math.abs(Math.sin(w)) * H * 0.045; rot += 3.5 * Math.sin(w); }
  return `translate(0 ${R1(dy)}) translate(${R1(x)} ${R1(g)}) rotate(${R1(rot)}) scale(${(1 + 0.007 * b).toFixed(4)} ${(1 + 0.018 * b).toFixed(4)}) translate(${R1(-x)} ${R1(-g)})`;
}
function chibi(o) {
  // chuyển động sống (khi ANIM_T là số — tập đặt mỗi khung): thở, đung đưa, chớp mắt tự động, bước đi (o.walk = số bước)
  const AT = (typeof ANIM_T === 'number' && !o.still) ? ANIM_T : null, ph = (((o.x || 0) * 0.0137 + (o.ground || 0) * 0.0071) % 6.283);
  if (AT !== null && !o.noBlink && ['bean', 'lid', 'side'].includes(o.eyes) && (((AT + ph * 0.55) % 3.9) + 3.9) % 3.9 < 0.11) o = Object.assign({}, o, { eyes: 'closed' });
  const H = o.H || 600, g = o.ground, x = o.x, k = H / 600, LW = 4.6 * Math.max(0.7, Math.min(1.2, k));
  const r = H * 0.205, hy = g - H + r * 1.32 + (o.headLift || 0) * r, top = hy + r * 0.8, bh = g - top, sw = (o.sw || 1.5) * r, fw = sw * 1.12, wy = top + bh * 0.46;
  const R = Object.assign({ c: '#3D4A66', c2: '#8E2A22', inner: '#F4EFE2', belt: '#2B2420', beltC: '#C9A227' }, o.robe || {});
  const id = uid('cb');
  let s = '';
  const head = o.headless ? { back: '', front: '' } : chHead(Object.assign({}, o, { x: x + (o.headDx || 0) * r, y: hy, r, lw: LW }));
  s += head.back;
  // giày
  s += [-1, 1].map(q => `<ellipse cx="${R1(x + q * sw * 0.17)}" cy="${R1(g + 2)}" rx="${R1(sw * 0.13)}" ry="${R1(sw * 0.06)}" fill="${o.shoe || '#2A2222'}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`).join('');
  // dáng áo
  const rr = sw * 0.36;
  const sil = `M${P(x - sw / 2 + rr, top)} L${P(x + sw / 2 - rr, top)} Q${P(x + sw / 2, top)} ${P(x + sw / 2, top + rr)} L${P(x + fw / 2, g - 6)} Q${P(x, g + 8 * k)} ${P(x - fw / 2, g - 6)} L${P(x - sw / 2, top + rr)} Q${P(x - sw / 2, top)} ${P(x - sw / 2 + rr, top)}Z`;
  s += `<clipPath id="${id}"><path d="${sil}"/></clipPath>`;
  s += `<path d="${sil}" fill="${R.c}"/>`;
  s += `<g clip-path="url(#${id})">`;
  if (R.pattern) s += `<path d="${sil}" fill="${R.pattern}" opacity="${R.patOp ?? 0.35}"/>`;
  if (R.armor) { // giáp vảy phần ngực
    s += `<rect x="${R1(x - sw)}" y="${R1(top + bh * 0.08)}" width="${R1(sw * 2)}" height="${R1(wy - top - bh * 0.08)}" fill="${R.armor}"/><rect x="${R1(x - sw)}" y="${R1(top + bh * 0.08)}" width="${R1(sw * 2)}" height="${R1(wy - top - bh * 0.08)}" fill="${pat('lamellar', '#1A1614', null, k * 1.1)}" opacity="0.7"/>`;
  }
  // nếp áo
  s += [-0.28, -0.05, 0.22, 0.36].map((q, i) => `<path d="M${P(x + q * fw, wy + bh * 0.12)} Q${P(x + q * fw * 1.08, wy + bh * 0.35)} ${P(x + q * fw * 1.12, g - bh * 0.08)}" stroke="${INK2}" stroke-width="${R1(2.6 * k)}" fill="none" opacity="0.35"/>`).join('');
  // bóng phải
  s += shade(`M${P(x + sw * 0.18, top - 5)} L${P(x + fw, top - 5)} L${P(x + fw, g + 10)} L${P(x + sw * 0.3, g + 10)} Q${P(x + sw * 0.4, wy)} ${P(x + sw * 0.18, top - 5)}Z`, 0.14);
  // cổ áo: lớp trong (trắng) + vạt ngoài (viền màu trim) chéo từ vai phải người xem xuống hông trái
  const cw = sw * 0.12;
  s += `<path d="M${P(x - sw * 0.2, top - 4)} L${P(x + sw * 0.03, top + (wy - top) * 0.42)}" stroke="${INK2}" stroke-width="${R1(cw + LW * 2)}" stroke-linecap="butt"/><path d="M${P(x - sw * 0.2, top - 4)} L${P(x + sw * 0.03, top + (wy - top) * 0.42)}" stroke="${R.inner}" stroke-width="${R1(cw)}"/>`;
  s += `<path d="M${P(x + sw * 0.22, top - 4)} L${P(x - sw * 0.36, wy + 4)}" stroke="${INK2}" stroke-width="${R1(cw * 1.5 + LW * 2)}"/><path d="M${P(x + sw * 0.22, top - 4)} L${P(x - sw * 0.36, wy + 4)}" stroke="${R.c2}" stroke-width="${R1(cw * 1.5)}"/>`;
  if (R.trimPat) s += `<path d="M${P(x + sw * 0.22, top - 4)} L${P(x - sw * 0.36, wy + 4)}" stroke="${R.trimPat}" stroke-width="${R1(cw * 1.5)}" opacity="0.6"/>`;
  s += `<path d="M${P(x + sw * 0.22 - cw * 0.55, top - 4)} L${P(x - sw * 0.36 - cw * 0.5, wy + 4)}" stroke="${R.inner}" stroke-width="${R1(cw * 0.35)}"/>`;
  // vạt dưới (bì tất) + viền gấu
  if (R.apron) {
    const ay = wy + bh * 0.06;
    s += poly([[x - sw * 0.2, ay], [x + sw * 0.18, ay], [x + sw * 0.24, g - bh * 0.1], [x - sw * 0.26, g - bh * 0.1]], R.apronC || R.c2, LW * 0.8);
    s += poly([[x - sw * 0.13, ay + bh * 0.04], [x + sw * 0.11, ay + bh * 0.04], [x + sw * 0.15, g - bh * 0.15], [x - sw * 0.19, g - bh * 0.15]], R.apron, 0, 'none');
  }
  const hemY = g - bh * 0.085;
  s += `<rect x="${R1(x - fw)}" y="${R1(hemY)}" width="${R1(fw * 2)}" height="${R1(bh * 0.2)}" fill="${R.c2}"/>`;
  if (R.hemPat) s += `<rect x="${R1(x - fw)}" y="${R1(hemY)}" width="${R1(fw * 2)}" height="${R1(bh * 0.2)}" fill="${R.hemPat}" opacity="0.75"/>`;
  s += `<path d="M${P(x - fw, hemY)} H${R1(x + fw)}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
  // đai lưng
  const bt = bh * 0.085;
  s += `<rect x="${R1(x - fw)}" y="${R1(wy - bt / 2)}" width="${R1(fw * 2)}" height="${R1(bt)}" fill="${R.belt}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
  s += `<path d="M${P(x - fw, wy)} H${R1(x + fw)}" stroke="${R.beltC}" stroke-width="${R1(bt * 0.18)}" opacity="0.8"/>`;
  s += `</g>`;
  s += `<path d="${sil}" fill="none" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  // ngọc bội + dây tua
  if (o.pendant !== false) {
    const px = x - sw * 0.06, py = wy + bt * 0.5;
    s += `<path d="M${P(px - 3, py)} Q${P(px - 8, py + bh * 0.14)} ${P(px - 4, py + bh * 0.3)} M${P(px + 4, py)} Q${P(px + 10, py + bh * 0.16)} ${P(px + 6, py + bh * 0.3)}" stroke="${R.cord || '#B83A2E'}" stroke-width="${R1(4 * k)}" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="${R1(px)}" cy="${R1(py + bh * 0.06)}" r="${R1(sw * 0.075)}" fill="${R.jade || '#8CC2A6'}" stroke="${INK2}" stroke-width="${LW * 0.7}"/><circle cx="${R1(px)}" cy="${R1(py + bh * 0.06)}" r="${R1(sw * 0.025)}" fill="${R.belt}"/>`;
  }
  // tay áo + bàn tay
  const arms = o.arms || {};
  const sleeve = (q, mode) => {
    const S = [x + q * sw * 0.36, top + bh * 0.06];
    let Pp, sag = bh * 0.06;
    if (Array.isArray(mode)) Pp = [x + q * mode[0] * sw, top + mode[1] * bh];
    else if (mode === 'fold') { Pp = [x + q * sw * 0.08, wy + bh * 0.04]; sag = bh * 0.1; }
    else if (mode === 'point') { Pp = [x + q * sw * 0.98, top - bh * 0.12]; sag = -bh * 0.02; }
    else if (mode === 'up') { Pp = [x + q * sw * 0.7, top - bh * 0.3]; sag = 0; }
    else if (mode === 'hip') { Pp = [x + q * sw * 0.55, wy - bh * 0.02]; sag = bh * 0.02; }
    else Pp = [x + q * sw * 0.6, wy + bh * 0.2];
    const dx = Pp[0] - S[0], dy = Pp[1] - S[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const w0 = sw * 0.22, w1 = sw * (o.sleeveW || 0.36), M = [(S[0] + Pp[0]) / 2, (S[1] + Pp[1]) / 2 + sag], wm = (w0 + w1) * 0.62;
    const d = `M${P(S[0] + nx * w0 / 2, S[1] + ny * w0 / 2)} Q${P(M[0] + nx * wm, M[1] + ny * wm)} ${P(Pp[0] + nx * w1 / 2, Pp[1] + ny * w1 / 2)} L${P(Pp[0] - nx * w1 / 2, Pp[1] - ny * w1 / 2)} Q${P(M[0] - nx * wm, M[1] - ny * wm)} ${P(S[0] - nx * w0 / 2, S[1] - ny * w0 / 2)}Z`;
    let t = '';
    const hx = Pp[0] + ux * w1 * 0.12, hy2 = Pp[1] + uy * w1 * 0.12, hr = sw * 0.085;
    const hand = mode === 'point'
      ? `<circle cx="${R1(hx)}" cy="${R1(hy2)}" r="${R1(hr)}" fill="${SKIN}" stroke="${INK2}" stroke-width="${LW * 0.8}"/><path d="M${P(hx, hy2)} L${P(hx + ux * hr * 2.2, hy2 + uy * hr * 2.2)}" stroke="${INK2}" stroke-width="${R1(hr * 0.75 + LW * 1.6)}" stroke-linecap="round"/><path d="M${P(hx, hy2)} L${P(hx + ux * hr * 2.2, hy2 + uy * hr * 2.2)}" stroke="${SKIN}" stroke-width="${R1(hr * 0.75)}" stroke-linecap="round"/>`
      : `<circle cx="${R1(hx)}" cy="${R1(hy2)}" r="${R1(hr)}" fill="${SKIN}" stroke="${INK2}" stroke-width="${LW * 0.8}"/><path d="M${P(hx - hr * 0.3, hy2 + hr * 0.1)} l${R1(hr * 0.5)} ${R1(hr * 0.2)}" stroke="${INK2}" stroke-width="${R1(2 * k)}" opacity="0.5"/>`;
    if (mode !== 'fold') t += hand;
    t += `<path d="${d}" fill="${R.c}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
    t += q > 0 ? shade(d, 0.12) : '';
    // viền cổ tay
    t += `<path d="M${P(Pp[0] + nx * w1 / 2 - ux * w1 * 0.12, Pp[1] + ny * w1 / 2 - uy * w1 * 0.12)} L${P(Pp[0] - nx * w1 / 2 - ux * w1 * 0.12, Pp[1] - ny * w1 / 2 - uy * w1 * 0.12)}" stroke="${R.c2}" stroke-width="${R1(w1 * 0.16)}"/>`;
    t += `<path d="M${P(Pp[0] + nx * w1 / 2, Pp[1] + ny * w1 / 2)} L${P(Pp[0] - nx * w1 / 2, Pp[1] - ny * w1 / 2)}" stroke="${INK2}" stroke-width="${LW}" stroke-linecap="round"/>`;
    return { t, hand: [hx, hy2] };
  };
  const L = sleeve(-1, arms.l || 'down'), Rr = sleeve(1, arms.r || 'down');
  s += L.t + Rr.t;
  if (arms.l === 'fold' && arms.r === 'fold') s += `<ellipse cx="${R1(x)}" cy="${R1(wy + bh * 0.05)}" rx="${R1(sw * 0.17)}" ry="${R1(sw * 0.08)}" fill="#1A1210" opacity="0.55"/>`;
  s += head.front;
  if (o.prop) s += o.prop(L.hand, Rr.hand, { x, g, top, wy, sw, r, hy, k });
  const tr = [idleTr(AT, ph, x, g, H, o.walk), o.flip ? `translate(${2 * x} 0) scale(-1 1)` : '', o.rot ? `rotate(${o.rot} ${x} ${g})` : ''].join(' ').trim();
  const shadowE = o.noShadow ? '' : `<ellipse cx="${R1(x)}" cy="${R1(g + 4)}" rx="${R1(fw * 0.75)}" ry="${R1(fw * 0.12)}" fill="#2A1A0A" opacity="0.18"/>`;
  return shadowE + (tr ? `<g transform="${tr}">${s}</g>` : s);
}

// ================= HÓNG (bản chi tiết) =================
// giữ thiết kế Khỉ Hóng (mặt số 8, mắt lim dim, mặt lạnh), thêm: lông lởm chởm, vệt lông, má bóng, tay; áo theo bối cảnh dùng chung hệ áo của chibi
const HONG2 = { fur: '#B5713C', furD: '#8E5427', furL: '#CF8E55', face: '#F3D2AE', faceD: '#E3B68C', ear: '#F0B990' };
function hong2(o) {
  const AT = (typeof ANIM_T === 'number' && !o.still) ? ANIM_T : null, ph = (((o.x || 0) * 0.0137 + (o.ground || 0) * 0.0071) % 6.283);
  const blinkH = AT !== null && (((AT + ph * 0.55) % 4.3) + 4.3) % 4.3 < 0.12, tw = AT !== null ? Math.sin(AT * 2.1 + ph) : 0;
  // Hóng là người kể: khi lời người dẫn đang phát thì nhép miệng + vung tay (trừ khi cầm đồ / cảnh lặng)
  if (AT !== null && o.mouth === undefined && typeof NARR_ON !== 'undefined' && NARR_ON && !o.mute) o = Object.assign({}, o, { mouth: talk(AT, true, 11), arms: o.prop || o.calm ? o.arms : gestArms(o.arms, AT, 4) });
  const H = o.H || 560, g = o.ground, x = o.x, k = H / 600, LW = 4.6 * Math.max(0.7, Math.min(1.2, k));
  const r = H * 0.2, hy = g - H + r * 1.15, top = hy + r * 0.78, bh = g - top, sw = 1.45 * r;
  let s = '';
  // đuôi
  const td = `M${P(x + sw * 0.35, g - bh * 0.18)} Q${P(x + sw * 1.25, g - bh * 0.05)} ${P(x + sw * (1.15 + 0.06 * tw), g - bh * 0.65)} Q${P(x + sw * (1.08 + 0.14 * tw), g - bh * (0.98 - 0.03 * tw))} ${P(x + sw * (0.82 + 0.2 * tw), g - bh * (0.86 + 0.04 * tw))}`;
  s += `<path d="${td}" stroke="${INK2}" stroke-width="${R1(34 * k)}" fill="none" stroke-linecap="round"/><path d="${td}" stroke="${HONG2.fur}" stroke-width="${R1(34 * k - LW * 2)}" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${P(x + sw * 0.75, g - bh * 0.6)} q${R1(10 * k)} ${R1(-30 * k)} ${R1(26 * k)} ${R1(-34 * k)}" stroke="${HONG2.furD}" stroke-width="${R1(4 * k)}" fill="none" stroke-linecap="round"/>`;
  // thân áo dùng chibi() nhưng không đầu: vẽ thân bằng chibi với đầu ẩn → đơn giản: gọi chibi với headless
  const body = chibi(Object.assign({}, o, { x, ground: g, H: H * 1.0, hair: 'bald', blush: false, robe: o.robe, arms: o.arms, sw: 1.45, headless: true, prop: null, still: true, walk: null, noShadow: o.noShadow, pendant: o.pendant ?? false, headLift: -0.05 }));
  // bỏ phần đầu người: chibi trả về cả đầu → ta che bằng đầu khỉ to hơn vẽ đè lên
  s += body;
  // đầu khỉ
  const hx = x, hY = g - H * 1.0 + H * 0.205 * 1.32 - H * 0.205 * 0.05, rr = H * 0.205 * 1.08;
  // tai
  s += [-1, 1].map(q => `<circle cx="${R1(hx + q * rr * 1.04)}" cy="${R1(hY + rr * 0.08)}" r="${R1(rr * 0.38)}" fill="${HONG2.fur}" stroke="${INK2}" stroke-width="${LW}"/><circle cx="${R1(hx + q * rr * 1.04)}" cy="${R1(hY + rr * 0.08)}" r="${R1(rr * 0.21)}" fill="${HONG2.ear}"/>`).join('');
  // đầu lông lởm chởm
  const N = 22; let d = '';
  for (let i = 0; i <= N; i++) { const a = -Math.PI / 2 + i / N * Math.PI * 2, rad = rr * (i % 2 ? 1.0 : 1.08); d += (i ? ' L' : 'M') + P(hx + Math.cos(a) * rad, hY + Math.sin(a) * rad * 0.98); }
  s += `<path d="${d}Z" fill="${HONG2.fur}" stroke="${INK2}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  // vệt lông
  s += [[-0.55, -0.62, 0.15], [-0.25, -0.8, 0.1], [0.35, -0.72, 0.14], [0.68, -0.4, 0.12], [-0.78, -0.2, 0.1]].map(([a, b, l]) => `<path d="M${P(hx + a * rr, hY + b * rr)} l${R1(l * rr * 0.6)} ${R1(-l * rr)}" stroke="${HONG2.furD}" stroke-width="${R1(4 * k)}" stroke-linecap="round"/>`).join('');
  s += `<path d="M${P(hx + rr * 0.3, hY - rr * 0.92)} Q${P(hx + rr * 0.75, hY - rr * 0.7)} ${P(hx + rr * 0.86, hY - rr * 0.25)}" stroke="${HONG2.furL}" stroke-width="${R1(7 * k)}" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  // mặt số 8
  const p8 = (a, b) => P(hx + a * rr, hY + b * rr);
  const face = `M${p8(0, -0.3)} Q${p8(-0.2, -0.76)} ${p8(-0.5, -0.7)} Q${p8(-0.86, -0.6)} ${p8(-0.8, -0.1)} Q${p8(-0.78, 0.2)} ${p8(-0.6, 0.3)} Q${p8(-0.8, 0.8)} ${p8(0, 0.9)} Q${p8(0.8, 0.8)} ${p8(0.6, 0.3)} Q${p8(0.78, 0.2)} ${p8(0.8, -0.1)} Q${p8(0.86, -0.6)} ${p8(0.5, -0.7)} Q${p8(0.2, -0.76)} ${p8(0, -0.3)}Z`;
  s += `<path d="${face}" fill="${HONG2.face}" stroke="${INK2}" stroke-width="${LW * 0.85}"/>`;
  s += `<path d="M${p8(0.45, -0.62)} Q${p8(0.85, -0.4)} ${p8(0.62, 0.0)} Q${p8(0.5, 0.25)} ${p8(0.55, 0.6)} Q${p8(0.75, 0.3)} ${p8(0.74, 0.05)} Q${p8(0.86, -0.45)} ${p8(0.45, -0.62)}Z" fill="${HONG2.faceD}" opacity="0.8"/>`;
  // mũi
  s += `<circle cx="${R1(hx - rr * 0.08)}" cy="${R1(hY + rr * 0.28)}" r="${R1(rr * 0.04)}" fill="${INK2}"/><circle cx="${R1(hx + rr * 0.08)}" cy="${R1(hY + rr * 0.28)}" r="${R1(rr * 0.04)}" fill="${INK2}"/>`;
  // mắt
  const ex = o.expr || 'lanh', eL = hx - rr * 0.4, eR = hx + rr * 0.4, ey = hY - rr * 0.2, lw = 7 * k;
  if (ex === 'soc') s += [eL, eR].map(e => `<circle cx="${R1(e)}" cy="${R1(ey)}" r="${R1(rr * 0.15)}" fill="#fff" stroke="${INK2}" stroke-width="${R1(4 * k)}"/><circle cx="${R1(e)}" cy="${R1(ey)}" r="${R1(rr * 0.05)}" fill="${INK2}"/>`).join('');
  else if (ex === 'side') s += [eL, eR].map(e => `<path d="M${P(e - rr * 0.16, ey)} h${R1(rr * 0.32)}" stroke="${INK2}" stroke-width="${R1(lw)}" stroke-linecap="round"/><path d="M${P(e + rr * 0.0, ey)} q${R1(rr * 0.07)} ${R1(rr * 0.12)} ${R1(rr * 0.15)} 0" fill="${INK2}"/>`).join('');
  else if (blinkH) s += [eL, eR].map(e => `<path d="M${P(e - rr * 0.16, ey + rr * 0.04)} q${R1(rr * 0.16)} ${R1(rr * 0.07)} ${R1(rr * 0.32)} 0" stroke="${INK2}" stroke-width="${R1(lw * 0.8)}" fill="none" stroke-linecap="round"/>`).join('');
  else s += [eL, eR].map(e => `<path d="M${P(e - rr * 0.16, ey)} h${R1(rr * 0.32)}" stroke="${INK2}" stroke-width="${R1(lw)}" stroke-linecap="round"/><path d="M${P(e - rr * 0.1, ey)} q${R1(rr * 0.1)} ${R1(rr * 0.13)} ${R1(rr * 0.2)} 0" fill="${INK2}"/>`).join('');
  // miệng
  const my = hY + rr * 0.52;
  if (ex === 'soc') s += `<ellipse cx="${R1(hx)}" cy="${R1(my + rr * 0.05)}" rx="${R1(rr * 0.11)}" ry="${R1(rr * 0.15)}" fill="#7A2E2E" stroke="${INK2}" stroke-width="${R1(4 * k)}"/>`;
  else if ((o.mouth || 0) > 0.05) { const oh = rr * (0.08 + 0.26 * o.mouth); s += `<path d="M${P(hx - rr * 0.24, my - rr * 0.02)} Q${P(hx, my - rr * 0.06)} ${P(hx + rr * 0.24, my - rr * 0.02)} Q${P(hx + rr * 0.2, my + oh)} ${P(hx, my + oh)} Q${P(hx - rr * 0.2, my + oh)} ${P(hx - rr * 0.24, my - rr * 0.02)}Z" fill="#7A2E2E" stroke="${INK2}" stroke-width="${R1(4 * k)}"/>`; }
  else if (ex === 'deu') s += `<path d="M${P(hx - rr * 0.22, my + rr * 0.02)} Q${P(hx + rr * 0.05, my + rr * 0.1)} ${P(hx + rr * 0.3, my - rr * 0.1)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M${P(hx - rr * 0.24, my + rr * 0.02)} Q${P(hx, my + rr * 0.08)} ${P(hx + rr * 0.26, my - rr * 0.02)}" stroke="${INK2}" stroke-width="${R1(5 * k)}" fill="none" stroke-linecap="round"/>`;
  // khăn gia nhân
  if (o.hat === 'wrap') {
    const c1 = o.hatColor || '#6B5A44', c2 = o.hatColor2 || '#54452F';
    s += `<path d="M${P(hx - rr * 0.95, hY - rr * 0.45)} Q${P(hx - rr * 0.9, hY - rr * 1.22)} ${P(hx, hY - rr * 1.2)} Q${P(hx + rr * 0.9, hY - rr * 1.22)} ${P(hx + rr * 0.95, hY - rr * 0.45)} Q${P(hx, hY - rr * 0.78)} ${P(hx - rr * 0.95, hY - rr * 0.45)}Z" fill="${c1}" stroke="${INK2}" stroke-width="${LW}"/><path d="M${P(hx - rr * 0.85, hY - rr * 0.68)} Q${P(hx, hY - rr * 0.95)} ${P(hx + rr * 0.85, hY - rr * 0.68)}" stroke="${c2}" stroke-width="${R1(9 * k)}" fill="none"/><path d="M${P(hx - rr * 0.6, hY - rr * 1.12)} q${R1(-rr * 0.35)} ${R1(-rr * 0.05)} ${R1(-rr * 0.5)} ${R1(rr * 0.3)} l${R1(rr * 0.15)} ${R1(rr * 0.05)} q${R1(rr * 0.1)} ${R1(-rr * 0.2)} ${R1(rr * 0.38)} ${R1(-rr * 0.18)}Z" fill="${c2}" stroke="${INK2}" stroke-width="${LW * 0.8}"/>`;
  }
  if (o.prop) s += o.prop({ x, g, hy: hY, rr, k });
  const hop = AT !== null && o.expr === 'soc' ? -Math.abs(Math.sin(AT * 9)) * H * 0.018 : 0;   // giật mình: nảy nhẹ
  const tr = [hop ? `translate(0 ${R1(hop)})` : '', idleTr(AT, ph, x, g, H, o.walk), o.flip ? `translate(${2 * x} 0) scale(-1 1)` : '', o.rot ? `rotate(${o.rot} ${x} ${g})` : ''].join(' ').trim();
  return tr ? `<g transform="${tr}">${s}</g>` : s;
}

// ================= NHÃN TÊN: thẻ gỗ treo =================
function plaque(name, sub, x, y, o = {}) {
  const sz = o.size || 50, ss = Math.max(30, sz * 0.62), w = Math.max(name.length * sz * 0.56, (sub || '').length * ss * 0.5) + 70, h = sub ? sz * 1.3 + ss * 1.25 : sz * 1.4, rot = o.rot ?? -2;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
<path d="M${-w * 0.3} ${-h / 2 - 46} L${-w * 0.36} ${-h / 2 + 4} M${w * 0.3} ${-h / 2 - 46} L${w * 0.36} ${-h / 2 + 4}" stroke="#5A4026" stroke-width="4"/>
<circle cx="0" cy="${-h / 2 - 48}" r="7" fill="#B83A2E" stroke="${INK2}" stroke-width="3"/>
<path d="M${-w * 0.3} ${-h / 2 - 46} L0 ${-h / 2 - 48} L${w * 0.3} ${-h / 2 - 46}" stroke="#5A4026" stroke-width="4" fill="none"/>
<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#D9B27C" stroke="${INK2}" stroke-width="5"/>
<path d="M${-w / 2 + 12} ${-h / 2 + 14} H${w / 2 - 30} M${-w / 2 + 40} ${h / 2 - 12} H${w / 2 - 14}" stroke="#B88A55" stroke-width="3"/>
<rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 16}" height="${h - 16}" rx="6" fill="none" stroke="#8A6239" stroke-width="2.5"/>
<text x="0" y="${sub ? -h / 2 + sz * 1.08 : sz * 0.34}" font-family="${FH}" font-size="${sz}" text-anchor="middle" fill="${INK2}">${name}</text>
${sub ? `<text x="0" y="${h / 2 - ss * 0.55}" font-family="${FH}" font-size="${R1(ss)}" text-anchor="middle" fill="#3A1A0E">${sub}</text>` : ''}
</g>`;
}
// thẻ địa danh (dải lụa đỏ + chữ)
function placeRibbon(s, x, y, o = {}) {
  const sz = o.size || 34, w = s.length * sz * 0.55 + 60;
  return `<g transform="translate(${x} ${y})"><path d="M0 0 H${w} L${w - 18} ${sz * 0.75} L${w} ${sz * 1.5} H0 L18 ${sz * 0.75}Z" fill="#9E2F25" stroke="${INK2}" stroke-width="4"/><text x="${w / 2}" y="${sz * 1.07}" font-family="${FH}" font-size="${sz}" text-anchor="middle" fill="#F7EBD3">${s}</text></g>`;
}

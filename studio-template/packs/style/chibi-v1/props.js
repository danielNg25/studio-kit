// chibi-v1 — đạo cụ + nền phụ dùng chung (thời cổ Trung Hoa). Mỗi hàm trả SVG, gốc (0,0) = điểm chạm đất / tâm, s = tỉ lệ.
const _g = (x, y, s, inner, rot = 0) => `<g transform="translate(${R1(x)} ${R1(y)}) rotate(${R1(rot)}) scale(${R1(s * 100) / 100})">${inner}</g>`;
// xe ngựa có mui (nhìn ngang, hướng phải). o: {c (thân), roof, horse (bool), curtain (0..1 mở rèm), bob}
function carriage(x, y, s = 1, o = {}) {
  const c = o.c || '#5A3A24', roof = o.roof || '#2F2A2C', b = o.bob || 0; let h = '';
  if (o.horse !== false) { // ngựa
    h += `<g transform="translate(250 ${R1(-10 + b)})"><path d="M-60 -60 Q-70 -110 -20 -112 L60 -110 Q90 -150 120 -140 L130 -100 Q110 -95 100 -80 L95 -55 Q60 -40 -50 -45Z" fill="#8C5A3A" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><path d="M-45 -50 L-55 0 M-20 -48 L-15 0 M55 -55 L50 0 M80 -58 L90 0" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/><path d="M-45 -50 L-55 0 M-20 -48 L-15 0 M55 -55 L50 0 M80 -58 L90 0" stroke="#8C5A3A" stroke-width="6" stroke-linecap="round"/><path d="M100 -140 q-30 10 -40 40" stroke="${INK2}" stroke-width="10" fill="none"/><circle cx="112" cy="-125" r="5" fill="${INK2}"/></g>`;
    h += `<path d="M150 -80 L200 -75" stroke="#6B4A30" stroke-width="8"/>`;
  }
  h += `<rect x="-150" y="-180" width="300" height="140" rx="10" fill="${c}" stroke="${INK2}" stroke-width="6"/>`;
  h += `<rect x="-110" y="-160" width="220" height="90" rx="6" fill="#2A1E16" stroke="${INK2}" stroke-width="4"/>`;
  const cw = 220 * (1 - (o.curtain || 0) * 0.6);
  h += `<rect x="-110" y="-160" width="${R1(cw)}" height="90" fill="#9E2F25" stroke="${INK2}" stroke-width="3"/>` + `<path d="M-110 -150 H${R1(-110 + cw)}" stroke="#C9A227" stroke-width="5"/>`;
  if (o.peek) h += o.peek;
  h += `<path d="M-185 -175 Q0 -250 185 -175 L160 -190 Q0 -255 -160 -190Z" fill="${roof}" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<circle cx="-60" cy="-30" r="44" fill="#6B4A30" stroke="${INK2}" stroke-width="6"/><circle cx="-60" cy="-30" r="12" fill="${INK2}"/>` + [0, 45, 90, 135].map(a => `<path d="M${R1(-60 - 40 * Math.cos(a * Math.PI / 180))} ${R1(-30 - 40 * Math.sin(a * Math.PI / 180))} L${R1(-60 + 40 * Math.cos(a * Math.PI / 180))} ${R1(-30 + 40 * Math.sin(a * Math.PI / 180))}" stroke="${INK2}" stroke-width="4"/>`).join('');
  if (o.cargo) h += `<rect x="-140" y="-215" width="280" height="40" rx="8" fill="#8C7A5A" stroke="${INK2}" stroke-width="5"/><path d="M-120 -205 h240" stroke="#6B5A3A" stroke-width="4"/>`;
  return _g(x, y, s, h);
}
// tượng lính đất nung (chibi màu đất, giáp vảy). o: {face: 'hong' | null, eyes, pose}
function terracotta(x, ground, H, o = {}) {
  const clay = '#B98A62', dark = '#8C6444';
  if (o.face === 'hong') return hong2({ x, ground, H, robe: { c: clay, c2: dark, inner: '#C9A27A', belt: dark, armor: '#A27652' }, expr: 'lanh', arms: { l: 'fold', r: 'fold' }, noShadow: true, still: true });
  return chibi({ x, ground, H, hair: 'bun', eyes: o.eyes || 'lid', brow: o.brow ?? 0.6, mouth: o.mouth || 'flat', beard: o.beard || null, robe: { c: clay, c2: dark, inner: '#C9A27A', belt: dark, armor: '#A27652' }, arms: { l: 'fold', r: 'fold' }, pendant: false, noShadow: true, skin: clay, still: true }).replace(/#F7DEC8/gi, '#C99B72').replace(/#EBC3A5/gi, '#B98A62').replace(/#26222A/gi, '#7A5434').replace(/#4B4656/gi, '#9C7650');
}
// con hươu (đeo bảng). o: {sign}
function deer(x, y, s = 1, o = {}) {
  let h = `<path d="M-90 -120 Q-100 -170 -40 -175 L70 -170 Q100 -168 100 -130 L95 -100 Q20 -90 -80 -95Z" fill="#B87A48" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/>`;
  h += [[-70, -95], [-45, -95], [60, -100], [85, -100]].map(([a, b2]) => `<path d="M${a} ${b2} L${a} 0" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/><path d="M${a} ${b2} L${a} 0" stroke="#B87A48" stroke-width="5" stroke-linecap="round"/>`).join('');
  h += [[-60, -160], [-20, -150], [30, -158], [60, -140], [-40, -130], [10, -125]].map(([a, b2]) => `<circle cx="${a}" cy="${b2}" r="7" fill="#F2E3C0"/>`).join('');
  h += `<path d="M85 -165 Q100 -220 120 -235 L150 -230 Q160 -210 140 -200 L120 -170Z" fill="#B87A48" stroke="${INK2}" stroke-width="5" stroke-linejoin="round"/><circle cx="135" cy="-220" r="5" fill="${INK2}"/><ellipse cx="150" cy="-208" rx="7" ry="5" fill="${INK2}"/>`;
  h += `<path d="M115 -238 L105 -290 L90 -305 M105 -270 L125 -290 M128 -236 L140 -285 L155 -300 M140 -265 L125 -282" stroke="#7A5434" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  h += `<path d="M110 -238 q-12 -10 -20 -2 q8 10 22 6Z" fill="#B87A48" stroke="${INK2}" stroke-width="3"/>`;
  if (o.sign) h += `<path d="M95 -200 L60 -150 M135 -200 L150 -150" stroke="#5A4026" stroke-width="3"/><g transform="translate(105 -130) rotate(-4)"><rect x="-70" y="-26" width="140" height="52" rx="8" fill="#E9D3A6" stroke="${INK2}" stroke-width="4"/><text y="14" font-family="${FH}" font-size="38" text-anchor="middle" fill="#8E2A22">${o.sign}</text></g>`;
  return _g(x, y, s, h);
}
// bia đá khắc chữ (vạch ngang thay chữ)
const stele = (x, y, s = 1, k = 1) => _g(x, y, s * k, `<rect x="-60" y="-260" width="120" height="250" rx="14" fill="#9C9A92" stroke="${INK2}" stroke-width="6"/><path d="M-60 -230 Q0 -290 60 -230" fill="#9C9A92" stroke="${INK2}" stroke-width="6"/>${[-200, -170, -140, -110, -80, -50].map(y2 => `<path d="M-38 ${y2} h76" stroke="#6E6C66" stroke-width="5" stroke-dasharray="10 6"/>`).join('')}<rect x="-80" y="-14" width="160" height="22" rx="6" fill="#7E7C76" stroke="${INK2}" stroke-width="5"/>`);
// đồng tiền Bán Lạng (tròn lỗ vuông) + chữ tay trên mặt
const banliang = (x, y, s = 1, rot = 0) => _g(x, y, s, `<circle r="60" fill="#B98A3E" stroke="${INK2}" stroke-width="6"/><circle r="50" fill="none" stroke="#8C6526" stroke-width="3"/><rect x="-18" y="-18" width="36" height="36" fill="#2A1E16" stroke="${INK2}" stroke-width="5"/><path d="M-40 -6 q6 -10 12 0 M28 -6 q6 -10 12 0" stroke="#6B4A1E" stroke-width="4" fill="none"/>`, rot);
// cái cân đòn
const scale_ = (x, y, s = 1, tiltA = 0) => _g(x, y, s, `<path d="M0 0 V-200" stroke="${INK2}" stroke-width="10"/><g transform="rotate(${tiltA} 0 -200)"><path d="M-150 -200 H150" stroke="#6B4A30" stroke-width="10" stroke-linecap="round"/>${[-1, 1].map(q => `<path d="M${q * 140} -200 L${q * 140 - 40} -120 M${q * 140} -200 L${q * 140 + 40} -120" stroke="${INK2}" stroke-width="3"/><path d="M${q * 140 - 50} -120 Q${q * 140} -95 ${q * 140 + 50} -120Z" fill="#B98A3E" stroke="${INK2}" stroke-width="4"/>`).join('')}</g><rect x="-40" y="-8" width="80" height="16" rx="5" fill="#6B4A30" stroke="${INK2}" stroke-width="4"/>`);
// ngọn lửa động (seed)
function flames(x, y, s, t, seed = 0) { let h = ''; for (let i = 0; i < 5; i++) { const w = 60 + i * 8, hh = 160 + 50 * Math.sin(t * 9 + i * 1.7 + seed), dx = (i - 2) * 38;
  h += `<path d="M${dx - w / 2} 0 Q${dx - w / 2} ${-hh * 0.5} ${dx + Math.sin(t * 7 + i) * 14} ${-hh} Q${dx + w / 2} ${-hh * 0.5} ${dx + w / 2} 0Z" fill="${['#E8452F', '#F28C28', '#F2C14E', '#E8452F', '#F28C28'][i]}" opacity="0.92"/>`; }
  return _g(x, y, s, h + `<path d="M-120 0 L120 0" stroke="#3A2A1E" stroke-width="20" stroke-linecap="round"/>`); }
// thuyền buồm
const boat = (x, y, s = 1, rock = 0) => _g(x, y, s, `<path d="M-220 -40 L220 -40 L170 30 L-170 30Z" fill="#6B4A30" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/><path d="M-200 -30 H200" stroke="#8C6640" stroke-width="5"/><path d="M0 -40 V-330" stroke="${INK2}" stroke-width="10"/><path d="M10 -320 Q130 -220 10 -60Z" fill="#E9DFC6" stroke="${INK2}" stroke-width="5"/>${[-280, -220, -160, -100].map(y2 => `<path d="M10 ${y2} Q${R1(70 + (y2 + 200) * 0.2)} ${y2 + 10} 60 ${y2 + 4}" stroke="#B8A888" stroke-width="3" fill="none"/>`).join('')}`, rock);
// sóng biển
function seaBand(y, t, c1 = '#7FA9B5', c2 = '#5E8C9A') { let d = `M0 ${y}`; for (let x = 0; x <= 1920; x += 40) d += ` L${x} ${R1(y + Math.sin(x / 90 + t * 2) * 10)}`; return `<path d="${d} V1080 H0Z" fill="${c1}" stroke="${INK2}" stroke-width="4"/>` + [0, 1, 2].map(i => `<path d="M${(i * 600 + t * 60) % 2100 - 100} ${y + 80 + i * 60} q30 -16 60 0 q30 16 60 0" stroke="${c2}" stroke-width="5" fill="none"/>`).join(''); }
// cá khổng lồ (gương mặt hề) o: {puff}
const bigFish = (x, y, s = 1, puff = 0) => _g(x, y, s, `<path d="M-200 0 Q-120 ${-110 - puff * 40} 60 -90 Q180 -60 200 0 Q180 60 60 90 Q-120 ${110 + puff * 40} -200 0Z" fill="#5E8CA6" stroke="${INK2}" stroke-width="6"/><path d="M-200 0 L-290 -80 L-270 0 L-290 80Z" fill="#4E7890" stroke="${INK2}" stroke-width="6" stroke-linejoin="round"/><circle cx="120" cy="-25" r="18" fill="#fff" stroke="${INK2}" stroke-width="4"/><circle cx="125" cy="-25" r="8" fill="${INK2}"/><path d="M175 20 q-20 12 -38 4" stroke="${INK2}" stroke-width="5" fill="none"/>${[-100, -40, 20].map(x2 => `<path d="M${x2} -60 q20 60 0 120" stroke="#4E7890" stroke-width="4" fill="none"/>`).join('')}`);
// nỏ liên phát (cầm tay)
const crossbow = (x, y, s = 1, rot = 0) => _g(x, y, s, `<path d="M-90 0 H90" stroke="#6B4A30" stroke-width="16" stroke-linecap="round"/><path d="M40 -70 Q70 0 40 70" stroke="#5A3A24" stroke-width="10" fill="none"/><path d="M40 -70 L40 70" stroke="#D9D0C0" stroke-width="2"/><rect x="-40" y="-26" width="70" height="20" fill="#8C6640" stroke="${INK2}" stroke-width="4"/>`, rot);
// túi thuốc
const medbag = (x, y, s = 1, rot = 0) => _g(x, y, s, `<path d="M-40 -30 Q-50 40 0 45 Q50 40 40 -30Z" fill="#7FA36E" stroke="${INK2}" stroke-width="5"/><path d="M-30 -30 Q0 -55 30 -30" stroke="#8E2A22" stroke-width="6" fill="none"/><path d="M-12 5 h24 M0 -7 v24" stroke="#F2E3C0" stroke-width="6"/>`, rot);
// dao găm
const dagger = (x, y, s = 1, rot = 0) => _g(x, y, s, `<path d="M0 -10 L120 0 L0 10Z" fill="#D7DDE0" stroke="${INK2}" stroke-width="4" stroke-linejoin="round"/><path d="M10 0 L100 0" stroke="#5E8C5E" stroke-width="3"/><rect x="-14" y="-20" width="12" height="40" fill="#8E6640" stroke="${INK2}" stroke-width="4"/><rect x="-60" y="-8" width="48" height="16" rx="4" fill="#5A3A24" stroke="${INK2}" stroke-width="4"/>`, rot);
// cuộn bản đồ (mở theo k)
const mapScroll = (x, y, s = 1, k = 1) => _g(x, y, s, `<rect x="-20" y="-80" width="${R1(40 + 320 * k)}" height="160" fill="#EAD9B0" stroke="${INK2}" stroke-width="5"/><path d="M0 -40 q60 20 120 -10 q60 -20 ${R1(160 * k)} 20" stroke="#7FA36E" stroke-width="5" fill="none" opacity="${R1(k * 100) / 100}"/><rect x="-36" y="-92" width="28" height="184" rx="12" fill="#8E6640" stroke="${INK2}" stroke-width="5"/><rect x="${R1(8 + 320 * k)}" y="-92" width="28" height="184" rx="12" fill="#8E6640" stroke="${INK2}" stroke-width="5"/>`);
// hộp gỗ đóng kín
const woodBox = (x, y, s = 1) => _g(x, y, s, `<rect x="-80" y="-110" width="160" height="110" rx="8" fill="#6B4A30" stroke="${INK2}" stroke-width="6"/><path d="M-80 -80 H80" stroke="${INK2}" stroke-width="5"/><rect x="-14" y="-92" width="28" height="22" fill="#C9A227" stroke="${INK2}" stroke-width="3"/>`);
// ấn vuông (con dấu) + dây tua
const sealBlock = (x, y, s = 1, c = '#C9A227') => _g(x, y, s, `<rect x="-50" y="-50" width="100" height="70" rx="8" fill="${c}" stroke="${INK2}" stroke-width="6"/><path d="M-20 -50 Q0 -110 20 -50" fill="${c}" stroke="${INK2}" stroke-width="6"/><path d="M0 -90 q30 30 10 80" stroke="#B83A2E" stroke-width="6" fill="none"/>`);
// bóng đen người (cảnh nghiêm)
const silhouette = (x, ground, H, o = {}) => `<g opacity="${o.op ?? 0.92}">${chibi({ x, ground, H, hair: 'bun', hat: o.hat || null, eyes: 'closed', mouth: 'flat', robe: { c: '#1A1416', c2: '#1A1416', inner: '#1A1416', belt: '#1A1416' }, pendant: false, noShadow: true, arms: o.arms || { l: 'down', r: 'down' }, flip: o.flip }).replace(/#F7DEC8|#EBC3A5|#26222A|#4B4656|#E58A7A|#2A211C|#C9A227|#8E2A22|#2A2222/gi, '#1A1416')}</g>`;

// ---------- nền phụ
// bờ sông (sông Dịch): sương, lau sậy, mặt nước
function setRiver(t, o = {}) {
  let s = `<rect width="1920" height="1080" fill="${o.sky || '#D9DED8'}"/>` + hills(520, '#B8BFB6', '#A6AEA4');
  s += `<rect y="560" width="1920" height="200" fill="#9DB3B2"/>` + [600, 650, 700].map((y, i) => `<path d="M${(t * 30 + i * 300) % 400 - 200} ${y} h300 M${(t * 30 + i * 300) % 400 + 500} ${y} h220 M${(t * 30 + i * 300) % 400 + 1100} ${y} h300" stroke="#C5D4D2" stroke-width="5" stroke-linecap="round"/>`).join('');
  s += `<path d="M0 760 Q480 720 960 760 T1920 750 V1080 H0Z" fill="#C9C29A" stroke="${INK2}" stroke-width="4"/>`;
  for (let i = 0; i < 26; i++) { const x = hrnd(i, 31) * 1920, y = 770 + hrnd(i, 32) * 60, sw = Math.sin(t * 2 + i) * 6; s += `<path d="M${R1(x)} ${R1(y)} q${R1(sw)} -60 ${R1(sw * 2)} -120" stroke="#8C8A5A" stroke-width="5" fill="none"/><ellipse cx="${R1(x + sw * 2)}" cy="${R1(y - 125)}" rx="7" ry="18" fill="#A89A6A"/>`; }
  s += `<rect width="1920" height="1080" fill="#FFFFFF" opacity="${o.mist ?? 0.18}"/>`;
  return s;
}
// trường quay "Hỏi xoáy đáp cổ": phông giấy, 2 ghế, bảng tên chương trình
function setTalk(t) {
  let s = `<rect width="1920" height="1080" fill="#2E2630"/><rect x="0" y="0" width="1920" height="820" fill="#3A2F3C"/>`;
  s += `<rect x="0" y="0" width="1920" height="820" fill="${pat('damask', '#463848', null, 1.2)}" opacity="0.8"/>`;
  for (let i = 0; i < 9; i++) s += `<circle cx="${120 + i * 210}" cy="70" r="16" fill="#F2D16B" opacity="${R1((0.5 + 0.5 * Math.sin(t * 3 + i)) * 100) / 100}"/>`;
  s += `<rect x="0" y="820" width="1920" height="260" fill="#5A3A30"/><path d="M0 820 H1920" stroke="${INK2}" stroke-width="6"/>`;
  s += `<g transform="translate(960 230)"><rect x="-430" y="-80" width="860" height="160" rx="18" fill="#9E2F25" stroke="${INK2}" stroke-width="7"/><rect x="-410" y="-62" width="820" height="124" rx="10" fill="none" stroke="#C9A227" stroke-width="4"/><text y="28" font-family="${FH}" font-size="86" text-anchor="middle" fill="#F7EBD3">HỎI XOÁY ĐÁP CỔ</text></g>`;
  return s;
}
// nhãn năm (thẻ năm nghiêm)
const yearTag = (s, x = 960, y = 140) => `<g transform="translate(${x} ${y})"><rect x="${-s.length * 15 - 30}" y="-36" width="${s.length * 30 + 60}" height="72" rx="8" fill="#1E1A1C" opacity="0.85"/><text y="16" font-family="${FH}" font-size="46" text-anchor="middle" fill="#F2E3C0">${s}</text></g>`;

// hồn bay lên (chết kiểu hoạt hình): bóng trắng có mặt X, đuôi uốn, lắc lư. k: 0..1 tiến trình bay lên
function soul(x, y, s = 1, k = 0, T = 0) { if (k <= 0) return ''; const dy = -260 * k, sw = Math.sin(T * 5) * 14, op = Math.min(1, k * 4) * (1 - Math.max(0, (k - 0.8) / 0.2));
  return `<g opacity="${R1(op * 100) / 100}" transform="translate(${R1(x + sw)} ${R1(y + dy)}) scale(${s})"><path d="M-46 0 Q-50 -70 0 -74 Q50 -70 46 0 Q46 50 20 64 Q30 84 4 100 Q-6 80 -14 66 Q-46 52 -46 0Z" fill="#F7FAFC" stroke="${INK2}" stroke-width="5" opacity="0.92"/><path d="M-22 -16 l12 12 M-10 -16 l-12 12 M10 -16 l12 12 M22 -16 l-12 12" stroke="${INK2}" stroke-width="4" stroke-linecap="round"/><ellipse cx="0" cy="20" rx="8" ry="6" fill="${INK2}"/><ellipse cx="0" cy="-86" rx="30" ry="8" fill="none" stroke="#E2BE4A" stroke-width="5"/></g>`; }

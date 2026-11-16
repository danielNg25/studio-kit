// Layout + scene for threads-60. The scene draws everything (background + post card); the layout adds nothing on top.
// Template `threads_card`: p = {card: {user, date, author, stats[], part, text}, bg: 'walk'}
// episode `hook:` (1-2 dòng ngắn) = tít lớn ở vùng trời phía trên, hiện SUỐT video (ngay từ khung 0) — để người lướt
// (thường tắt tiếng) biết ngay video nói gì trong 1-2 giây đầu, ảnh bìa Reels có chữ to, người vào giữa chừng vẫn biết đang xem gì.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep) {
    if (!ep || !ep.hook) return content;
    return content + thrHook(ep.hook, ctx.W);
  },
  subtitle() { return ''; },
};
const THR_HOOK = { y: 120, size: 66, lh: 1.18, padX: 40, padY: 26, maxW: 980 };
function thrHook(text, W) {
  const H = THR_HOOK, lines = String(text).split('\n');
  const cv = (window.__thrCv2 = window.__thrCv2 || document.createElement('canvas').getContext('2d')); cv.font = `800 ${H.size}px Inter`;
  const tw = Math.min(H.maxW - H.padX * 2, Math.max(...lines.map((l) => cv.measureText(l).width)));
  const bw = tw + H.padX * 2, bh = lines.length * H.size * H.lh + H.padY * 2, x = (W - bw) / 2;
  let s = `<rect x="${x + 8}" y="${H.y + 10}" width="${bw}" height="${bh}" rx="28" fill="#000" opacity="0.28"/>`;
  s += `<rect x="${x}" y="${H.y}" width="${bw}" height="${bh}" rx="28" fill="#FFFFFF" stroke="#111" stroke-width="6"/>`;
  s += `<foreignObject x="${x}" y="${H.y + H.padY - 4}" width="${bw}" height="${bh}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 ${H.size}px/${H.lh} Inter, sans-serif;color:#111;text-align:center;white-space:pre;">${thrEsc(text)}</div></foreignObject>`;
  window.__hookBottom = H.y + bh;
  return s;
}
const thrHookBottom = (text) => text ? THR_HOOK.y + String(text).split('\n').length * THR_HOOK.size * THR_HOOK.lh + THR_HOOK.padY * 2 : 0;

const _thrMeasure = {};
function thrTextHeight(text, w, size, lh) {
  const key = w + '|' + size + '|' + text;
  if (_thrMeasure[key]) return _thrMeasure[key];
  const d = document.createElement('div');
  d.style.cssText = `position:absolute;left:-9999px;top:0;width:${w}px;font:400 ${size}px/${lh} Inter, sans-serif;white-space:pre-wrap;word-wrap:break-word;`;
  d.textContent = text; document.body.appendChild(d);
  const h = d.getBoundingClientRect().height; d.remove();
  return (_thrMeasure[key] = h);
}
const thrEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// drawn background: parallax hills + clouds + trees + road, the narrator walks along.
// Shapes are built ONCE and only moved with transforms (wobble cached) — rebuilding them per frame makes renders ~10x slower.
const _thrTiles = {};
function thrHill(y, amp, per, col) {
  const key = [y, amp, per, col].join('|');
  if (_thrTiles[key]) return _thrTiles[key];
  const pts = []; for (let x = 0; x <= per; x += 30) pts.push([x, y - Math.max(0, Math.sin(x / per * Math.PI * 2)) * amp - amp * 0.25]);
  return (_thrTiles[key] = sh(S(pts.concat([[per, 2000], [0, 2000]]), true, 0.5), { fill: col, sw: 6 }));
}
const thrTree = () => _thrTiles.tree || (_thrTiles.tree = sh(R(-10, -140, 20, 140, 6), { fill: '#8A6A48' }) + sh(E(0, -160, 70, 80), { fill: '#6FA65A' }));
const thrCloud = () => _thrTiles.cloud || (_thrTiles.cloud = cloud(0, 0, 0.9));
function thrWalkBg(t, W, H) {
  let s = rect(0, 0, W, H, '#FBE3A1') + `<circle cx="${W * 0.78}" cy="300" r="150" fill="#F8C66A"/>`;
  const wrap = (x, span) => ((x % span) + span) % span;
  for (let k = 0; k < 3; k++) s += g(thrCloud(), { x: wrap(k * 520 - t * 40, W + 400) - 200, y: 160 + k * 90 });
  const layer = (y, amp, per, col, speed) => { const off = wrap(t * speed, per); let o = ''; for (let x = -off - per; x < W + per; x += per) o += g(thrHill(y, amp, per, col), { x }); return o; };
  s += layer(1500, 260, 900, '#E9B97A', 30) + layer(1620, 180, 640, '#9DC08B', 70);
  s += rect(0, 1720, W, H - 1720, '#C9A87C') + `<line x1="-20" y1="1720" x2="${W + 20}" y2="1720" stroke="#000" stroke-width="6"/>`;
  for (let i = 0; i < 8; i++) { const x = wrap(i * 220 - t * 160, W + 220) - 110; s += `<line x1="${x.toFixed(1)}" y1="1800" x2="${(x + 90).toFixed(1)}" y2="1800" stroke="#FFF4D6" stroke-width="9" stroke-linecap="round"/>`; }
  for (let i = 0; i < 4; i++) s += g(thrTree(), { x: wrap(i * 380 - t * 120, W + 380) - 190, y: 1720 });
  if (typeof narrPose === 'function') s += narrPose('happy', { x: W * 0.5, y: 1720, s: 0.42, legs: 'walk', ph: t * 7, look: 0.6 });
  return s;
}

// Picture inside a post. c.media = {src | pov+emoji, h, sheet: {count, user, text, date, likes, at}}
//   src  = the post's own picture (file in the episode folder), fitted to the panel height on black
//   pov/emoji = rebuilt TikTok frame instead (POV caption + emoji stand-in)
//   sheet = TikTok comment sheet sliding up when `sheet.at` is spoken.
let _thrClip = 0;
function thrMedia(t, ctx, m, x, y, w) {
  const h = m.h || 760, id = 'thrm' + (++_thrClip);
  let s = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/></clipPath><g clip-path="url(#${id})">`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${m.bg || '#000'}"/>`;   // h = 892 × image h / image w → no letterbox
  const vw = Math.round(h * 0.56), vx = x + (w - vw) / 2;
  if (m.src) s += `<image href="${m.src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
  else {
  s += `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3A35"/><stop offset="1" stop-color="#1E1714"/></linearGradient></defs>`;
  s += `<rect x="${vx}" y="${y}" width="${vw}" height="${h}" fill="url(#${id}g)"/>`;
  if (m.emoji) s += `<text x="${vx + vw / 2}" y="${y + h * 0.56}" text-anchor="middle" font-size="190" font-family="Noto Color Emoji, Apple Color Emoji, sans-serif">${thrEsc(m.emoji)}</text>`;
  if (m.pov) s += `<foreignObject x="${vx + 16}" y="${y + 26}" width="${vw - 32}" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 30px/1.3 Inter, sans-serif;color:#fff;text-align:center;white-space:pre-wrap;text-shadow:0 2px 6px rgba(0,0,0,.8);">${thrEsc(m.pov)}</div></foreignObject>`;
  }
  if (m.sheet || m.pov) s += `<circle cx="${x + w - 52}" cy="${y + 46}" r="17" fill="none" stroke="#DDD" stroke-width="4"/><line x1="${x + w - 40}" y1="${y + 58}" x2="${x + w - 28}" y2="${y + 70}" stroke="#DDD" stroke-width="4" stroke-linecap="round"/>`;   // TikTok search icon only on TikTok frames
  const sh = m.sheet;
  if (sh) {
    const at = sh.at === undefined ? 0 : ctx.at(sh.at), k = easeOut(clamp((t - at) / 0.35));
    if (k > 0) {
      const sz = 36, tw2 = w - 150, th2 = thrTextHeight(sh.text, tw2, sz, 1.3), H2 = 120 + 52 + th2 + 70;
      const sy0 = y + h - H2 * k;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" opacity="${(0.35 * k).toFixed(3)}"/>`;
      s += `<rect x="${x}" y="${sy0}" width="${w}" height="${H2 + 30}" rx="26" fill="#F4F4F5"/>`;
      s += `<text x="${x + w / 2}" y="${sy0 + 66}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="32" fill="#161823">${thrEsc(sh.count || '')}</text>`;
      const ix = x + w - 60, iy = sy0 + 56;
      s += `<path d="M${ix - 16} ${iy - 14} L${ix + 16} ${iy + 14} M${ix + 16} ${iy - 14} L${ix - 16} ${iy + 14}" stroke="#161823" stroke-width="4" stroke-linecap="round"/>`;
      s += `<path d="M${ix - 110} ${iy - 14} H${ix - 86} M${ix - 110} ${iy} H${ix - 90} M${ix - 110} ${iy + 14} H${ix - 94} M${ix - 74} ${iy - 16} V${iy + 16} M${ix - 82} ${iy + 8} L${ix - 74} ${iy + 16} L${ix - 66} ${iy + 8}" fill="none" stroke="#161823" stroke-width="3.5" stroke-linecap="round"/>`;
      const ay = sy0 + 150, ax = x + 62;
      s += `<circle cx="${ax}" cy="${ay}" r="34" fill="${sh.avatar || '#E9A3B5'}"/><text x="${ax}" y="${ay + 13}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="34" fill="#fff">${thrEsc(String(sh.user)[0].toUpperCase())}</text>`;
      s += `<text x="${ax + 56}" y="${sy0 + 132}" font-family="Inter" font-size="30" fill="#8A8B91">${thrEsc(sh.user)}</text>`;
      s += `<foreignObject x="${ax + 56}" y="${sy0 + 146}" width="${tw2}" height="${th2 + 8}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 ${sz}px/1.3 Inter, sans-serif;color:#161823;white-space:pre-wrap;word-wrap:break-word;">${thrEsc(sh.text)}</div></foreignObject>`;
      const by = sy0 + 146 + th2 + 44;
      s += `<text x="${ax + 56}" y="${by}" font-family="Inter" font-size="28" fill="#8A8B91">${thrEsc(sh.date || '')}     Trả lời</text>`;
      const hx = x + w - 170, hy = by - 10;
      s += `<path d="M${hx} ${hy + 12} C${hx - 26} ${hy - 8} ${hx - 14} ${hy - 28} ${hx} ${hy - 14} C${hx + 14} ${hy - 28} ${hx + 26} ${hy - 8} ${hx} ${hy + 12}Z" fill="none" stroke="#8A8B91" stroke-width="3.5"/>`;
      s += `<text x="${hx + 30}" y="${by}" font-family="Inter" font-size="30" fill="#8A8B91">${thrEsc(sh.likes || '')}</text>`;
    }
  }
  return { svg: s + '</g>', h };
}

// Threads-style post card (no logo; avatar = initial). c = {user, date, author, stats[], part, text, media, replies}
//   replies: [{user, date, author, stats[], text, line}] — trả lời lồng NGAY DƯỚI bình luận gốc trong cùng khung (thụt vào + đường nối),
//   mỗi trả lời hiện khi lời đọc tới dòng `line` (mặc định: thứ tự 1, 2, …); khung dài dần theo trả lời đã hiện.
function thrCard(t, ctx, c) {
  const W = ctx.W, cw = 980, pad = 44, size = 44, lh = 1.42, tw = cw - pad * 2;
  const th = c.text ? thrTextHeight(c.text, tw, size, lh) : -24;
  const mh = c.media ? (c.media.h || 760) + 24 : 0;
  const head = 120, foot = 96, mainH = head + th + 24 + mh + foot;
  const rsz = 40, rlh = 1.4, rind = 70, rtw = tw - rind;
  const R = (c.replies || []).map((r, i) => ({ r, i, th: thrTextHeight(r.text || '', rtw, rsz, rlh) })).map((e) => ({ ...e, h: 70 + e.th + 78 }));
  const ra = (e) => easeOut(clamp((t - ctx.at({ line: e.r.line === undefined ? e.i + 1 : e.r.line })) / 0.35));
  const chFull = mainH + R.reduce((a, e) => a + e.h, 0);
  let chH = mainH; R.forEach((e) => { chH += e.h * ra(e); });
  const first = ctx.T - t < 0.001;                                       // shot đầu: khung hiện đủ ngay khung 0 (không mờ dần)
  const hb = ctx.hook ? thrHookBottom(ctx.hook) + 40 : 260;             // có tít → khung bài luôn nằm dưới tít
  const x0 = (W - cw) / 2, y0 = Math.max(hb, Math.min(900 - chFull / 2, 1640 - chFull));
  const k = first ? 1 : easeOut(clamp(t / 0.45)), dy = (1 - k) * 80;
  window.__cardRect = { x: x0, y: y0, w: cw, h: chH };   // memes (pos: auto) are placed around the card
  let s = `<g opacity="${k.toFixed(3)}" transform="translate(0 ${dy.toFixed(1)})">`;
  s += `<rect x="${x0 + 8}" y="${y0 + 12}" width="${cw}" height="${chH}" rx="34" fill="#000" opacity="0.25"/>`;
  s += `<rect x="${x0}" y="${y0}" width="${cw}" height="${chH}" rx="34" fill="#101010" stroke="#2A2A2A" stroke-width="2"/>`;
  const ax = x0 + pad + 34, ay = y0 + 64;
  s += `<circle cx="${ax}" cy="${ay}" r="34" fill="#3A3A4A"/><text x="${ax}" y="${ay + 13}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="36" fill="#F3F5F7">${thrEsc(String(c.user)[0].toUpperCase())}</text>`;
  s += `<text x="${ax + 54}" y="${ay + 12}" font-family="Inter" font-weight="700" font-size="36" fill="#F3F5F7">${thrEsc(c.user)}</text>`;
  const cv = (window.__thrCv = window.__thrCv || document.createElement('canvas').getContext('2d')); cv.font = '700 36px Inter';
  const uw = cv.measureText(String(c.user)).width + 16;
  s += `<text x="${ax + 54 + uw}" y="${ay + 12}" font-family="Inter" font-size="32" fill="#777">${thrEsc(c.date || '')}${c.author ? ' · Tác giả' : ''}</text>`;
  if (c.part) s += `<text x="${x0 + cw - pad}" y="${ay + 12}" text-anchor="end" font-family="Inter" font-size="30" fill="#777">${thrEsc(c.part)}</text>`;
  if (c.text) s += `<foreignObject x="${x0 + pad}" y="${y0 + head}" width="${tw}" height="${th + 10}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:400 ${size}px/${lh} Inter, sans-serif;color:#F3F5F7;white-space:pre-wrap;word-wrap:break-word;">${thrEsc(c.text)}</div></foreignObject>`;
  if (c.media) s += thrMedia(t, ctx, c.media, x0 + pad, y0 + head + th + 24, tw).svg;
  const icons = [
    (x, y) => `<path d="M${x} ${y + 12} C${x - 26} ${y - 8} ${x - 14} ${y - 28} ${x} ${y - 14} C${x + 14} ${y - 28} ${x + 26} ${y - 8} ${x} ${y + 12}Z" fill="none" stroke="#CCC" stroke-width="3.5"/>`,
    (x, y) => `<path d="M${x - 15} ${y + 13} L${x - 11} ${y + 4} A16 16 0 1 1 ${x - 3} ${y + 12} Z" fill="none" stroke="#CCC" stroke-width="3.5" stroke-linejoin="round"/>`,
    (x, y) => `<path d="M${x - 14} ${y + 2} V${y - 8} H${x + 12} M${x + 6} ${y - 14} L${x + 12} ${y - 8} L${x + 6} ${y - 2} M${x + 14} ${y - 2} V${y + 8} H${x - 12} M${x - 6} ${y + 2} L${x - 12} ${y + 8} L${x - 6} ${y + 14}" fill="none" stroke="#CCC" stroke-width="3.5"/>`,
    (x, y) => `<path d="M${x - 16} ${y - 14} L${x + 18} ${y} L${x - 16} ${y + 14} L${x - 9} ${y} Z" fill="none" stroke="#CCC" stroke-width="3.5" stroke-linejoin="round"/>`,
  ];
  const sy = y0 + mainH - foot / 2;
  (c.stats || []).slice(0, 4).forEach((v, i) => { const sx = x0 + pad + 18 + i * 190; s += icons[i](sx, sy) + `<text x="${sx + 34}" y="${sy + 11}" font-family="Inter" font-size="32" fill="#CCC">${thrEsc(v)}</text>`; });
  s += `<text x="${x0 + cw - pad}" y="${sy + 11}" text-anchor="end" font-family="Inter" font-size="28" fill="#555">Threads</text>`;
  // nested replies
  let ry = y0 + mainH;
  R.forEach((e) => {
    const a = ra(e); if (a <= 0) return;
    const r = e.r, yy = ry + (1 - a) * 20, rx = x0 + pad + rind, rax = rx - 6 + 26, ray = yy + 36;
    let o = `<g opacity="${a.toFixed(3)}">`;
    o += `<path d="M${ax} ${ry - 6} V${ray - 18} Q${ax} ${ray} ${ax + 18} ${ray} H${rax - 30}" fill="none" stroke="#333" stroke-width="4"/>`;
    o += `<circle cx="${rax}" cy="${ray}" r="26" fill="#3A3A4A"/><text x="${rax}" y="${ray + 10}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="28" fill="#F3F5F7">${thrEsc(String(r.user)[0].toUpperCase())}</text>`;
    const nx = rax + 42;
    o += `<text x="${nx}" y="${ray + 10}" font-family="Inter" font-weight="700" font-size="32" fill="#F3F5F7">${thrEsc(r.user)}</text>`;
    cv.font = '700 32px Inter'; const ruw = cv.measureText(String(r.user)).width + 14;
    o += `<text x="${nx + ruw}" y="${ray + 10}" font-family="Inter" font-size="28" fill="#777">${thrEsc(r.date || '')}${r.author ? ' · Tác giả' : ''}</text>`;
    o += `<foreignObject x="${nx}" y="${yy + 70}" width="${rtw - 50}" height="${e.th + 10}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:400 ${rsz}px/${rlh} Inter, sans-serif;color:#F3F5F7;white-space:pre-wrap;word-wrap:break-word;">${thrEsc(r.text || '')}</div></foreignObject>`;
    const fy = yy + 70 + e.th + 40;
    (r.stats || []).slice(0, 4).forEach((v, i) => { const sx = nx + 14 + i * 170; o += icons[i](sx, fy) + `<text x="${sx + 32}" y="${fy + 10}" font-family="Inter" font-size="29" fill="#CCC">${thrEsc(v)}</text>`; });
    s += o + '</g>';
    ry += e.h * a;
  });
  return s + '</g>';
}

// format scenes (QA finds them here: build.py also scans the format's layout.js for templates)
const FORMAT_SCENES = {
  // ctx.bgMedia: a background clip/image from the channel's assets is drawn under the scene -> skip the drawn hills
  threads_card(t, ctx, p) { ctx.hook = (typeof RJ !== 'undefined' && RJ.episode && RJ.episode.hook) || ''; return (ctx.bgMedia ? '' : thrWalkBg(ctx.T, ctx.W, ctx.H)) + thrCard(t, ctx, p.card || {}); },
};
if (typeof SCENES !== 'undefined') Object.assign(SCENES, FORMAT_SCENES);

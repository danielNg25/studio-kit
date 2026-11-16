// Layout + scenes for reddit-60. The scene draws everything (background + card); the layout adds nothing on top.
// reddit_post:   p = {post: {sub, user, time, title, flair, text, votes, comments, part, source, byline, likes}}
//   source/byline: nguồn KHÔNG phải Reddit (vd 'Câu hỏi trên Zhihu' / 'Trạm Tâm Sự kể lại') → in nguyên chữ, không thêm r/ u/; likes: true → số là lượt thích (icon tim, không mũi tên xuống)
// reddit_thread: p = {items: [{user, op, time, text, votes, depth, line}], likes}   (likes: true → icon tim thay mũi tên up/down)
//   every item fades in when line `line` of the shot starts (default: its index) — a reply appears as it is read.
// No Reddit logo / Snoo: avatars are a coloured circle with the initial.
// episode `hook:` (1-2 dòng ngắn) = tít lớn ở trên cùng, hiện SUỐT video ngay từ khung 0 (người dùng 08/10, giống threads-60);
// có tít thì khung bài / bình luận luôn nằm dưới tít.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep) { return ep && ep.hook ? content + rdHook(ep.hook, ctx.W) : content; },
  subtitle() { return ''; },
};
const RD_HOOK = { y: 120, size: 64, lh: 1.18, padX: 40, padY: 26, maxW: 980 };
function rdHook(text, W) {
  const H = RD_HOOK, lines = String(text).split('\n');
  const cv = (window.__rdCv2 = window.__rdCv2 || document.createElement('canvas').getContext('2d')); cv.font = `800 ${H.size}px Inter`;
  const tw = Math.min(H.maxW - H.padX * 2, Math.max(...lines.map((l) => cv.measureText(l).width)));
  const bw = tw + H.padX * 2, bh = lines.length * H.size * H.lh + H.padY * 2, x = (W - bw) / 2;
  let s = `<rect x="${x + 8}" y="${H.y + 10}" width="${bw}" height="${bh}" rx="28" fill="#000" opacity="0.28"/>`;
  s += `<rect x="${x}" y="${H.y}" width="${bw}" height="${bh}" rx="28" fill="#FFFFFF" stroke="#111" stroke-width="6"/>`;
  s += `<foreignObject x="${x}" y="${H.y + H.padY - 4}" width="${bw}" height="${bh}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 ${H.size}px/${H.lh} Inter, sans-serif;color:#111;text-align:center;white-space:pre;">${rdEsc(text)}</div></foreignObject>`;
  return s;
}
const rdHookTop = () => { const h = (typeof RJ !== 'undefined' && RJ.episode && RJ.episode.hook) || ''; return h ? RD_HOOK.y + String(h).split('\n').length * RD_HOOK.size * RD_HOOK.lh + RD_HOOK.padY * 2 + 40 : 240; };

const RD = { card: '#FFFFFF', edge: '#DCE2E5', ink: '#0F1A1C', grey: '#5C6C74', pill: '#EAEDEF', flair: '#C9417F', op: '#0A5DC2', sub: '#1D3A5F' };
const rdEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const _rdMeasure = {};
function rdTextH(text, w, size, lh, weight) {
  const key = [w, size, lh, weight, text].join('|');
  if (_rdMeasure[key]) return _rdMeasure[key];
  const d = document.createElement('div');
  d.style.cssText = `position:absolute;left:-9999px;top:0;width:${w}px;font:${weight || 400} ${size}px/${lh} Inter, sans-serif;white-space:pre-wrap;word-wrap:break-word;`;
  d.textContent = text; document.body.appendChild(d);
  const h = d.getBoundingClientRect().height; d.remove();
  return (_rdMeasure[key] = h);
}
function rdTextW(text, size, weight) {
  const cv = (window.__rdCv = window.__rdCv || document.createElement('canvas').getContext('2d'));
  cv.font = `${weight || 400} ${size}px Inter`;
  return cv.measureText(String(text)).width;
}
const rdBlock = (x, y, w, h, text, size, lh, weight, col) =>
  `<foreignObject x="${x}" y="${y}" width="${w}" height="${h + 10}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:${weight} ${size}px/${lh} Inter, sans-serif;color:${col};white-space:pre-wrap;word-wrap:break-word;">${rdEsc(text)}</div></foreignObject>`;

// icons (outline, Reddit-like but generic)
const rdUp = (x, y, c) => `<path d="M${x} ${y - 15} L${x + 14} ${y} H${x + 7} V${y + 13} H${x - 7} V${y} H${x - 14} Z" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round"/>`;
const rdDown = (x, y, c) => `<path d="M${x} ${y + 15} L${x + 14} ${y} H${x + 7} V${y - 13} H${x - 7} V${y} H${x - 14} Z" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round"/>`;
const rdBubble = (x, y, c) => `<path d="M${x - 15} ${y + 13} L${x - 11} ${y + 4} A16 16 0 1 1 ${x - 3} ${y + 12} Z" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round"/>`;

const RD_AV = ['#B79AE8', '#6CC9AE', '#F2A0A0', '#EDC055', '#8DB8EE', '#E59BC9', '#9FB0C0'];
function rdAvatar(cx, cy, r, user, col) {
  const u = String(user || '?');
  let hsh = 0; for (const ch of u) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
  const fill = col || RD_AV[hsh % RD_AV.length];
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><text x="${cx}" y="${cy + r * 0.36}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${Math.round(r * 1.0)}" fill="#fff">${rdEsc(u.replace(/^u\//, '')[0].toUpperCase())}</text>`;
}

// drawn background: dusk hills + drifting clouds, the narrator walks along (calmer palette for tâm sự stories).
// Shapes are built ONCE and only moved with transforms.
const _rdTiles = {};
function rdHill(y, amp, per, col) {
  const key = [y, amp, per, col].join('|');
  if (_rdTiles[key]) return _rdTiles[key];
  const pts = []; for (let x = 0; x <= per; x += 30) pts.push([x, y - Math.max(0, Math.sin(x / per * Math.PI * 2)) * amp - amp * 0.25]);
  return (_rdTiles[key] = sh(S(pts.concat([[per, 2000], [0, 2000]]), true, 0.5), { fill: col, sw: 6 }));
}
const rdTree = () => _rdTiles.tree || (_rdTiles.tree = sh(R(-10, -140, 20, 140, 6), { fill: '#7A6250' }) + sh(E(0, -160, 70, 80), { fill: '#7FA58C' }));
const rdCloud = () => _rdTiles.cloud || (_rdTiles.cloud = cloud(0, 0, 0.9));
function rdBg(t, W, H) {
  let s = `<defs><linearGradient id="rdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9C3EE"/><stop offset="1" stop-color="#F6D7C3"/></linearGradient></defs>`;
  s += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#rdsky)"/><circle cx="${W * 0.8}" cy="330" r="140" fill="#FBE6B8" opacity="0.9"/>`;
  const wrap = (x, span) => ((x % span) + span) % span;
  for (let k = 0; k < 3; k++) s += g(rdCloud(), { x: wrap(k * 520 - t * 30, W + 400) - 200, y: 150 + k * 95 });
  const layer = (y, amp, per, col, speed) => { const off = wrap(t * speed, per); let o = ''; for (let x = -off - per; x < W + per; x += per) o += g(rdHill(y, amp, per, col), { x }); return o; };
  s += layer(1500, 260, 900, '#B9A9D9', 25) + layer(1620, 180, 640, '#9FBFA8', 60);
  s += rect(0, 1720, W, H - 1720, '#B8A58E') + `<line x1="-20" y1="1720" x2="${W + 20}" y2="1720" stroke="#000" stroke-width="6"/>`;
  for (let i = 0; i < 8; i++) { const x = wrap(i * 220 - t * 140, W + 220) - 110; s += `<line x1="${x.toFixed(1)}" y1="1800" x2="${(x + 90).toFixed(1)}" y2="1800" stroke="#F3EBDD" stroke-width="9" stroke-linecap="round"/>`; }
  for (let i = 0; i < 4; i++) s += g(rdTree(), { x: wrap(i * 380 - t * 105, W + 380) - 190, y: 1720 });
  if (typeof narrPose === 'function') s += narrPose('happy', { x: W * 0.5, y: 1720, s: 0.42, legs: 'walk', ph: t * 6, look: 0.6 });
  return s;
}

function rdFrame(t, x0, y0, cw, h) {
  window.__cardRect = { x: x0, y: y0, w: cw, h };   // memes (pos: auto) are placed around the card
  return `<rect x="${x0 + 8}" y="${y0 + 12}" width="${cw}" height="${h}" rx="30" fill="#000" opacity="0.18"/>` +
    `<rect x="${x0}" y="${y0}" width="${cw}" height="${h}" rx="30" fill="${RD.card}" stroke="${RD.edge}" stroke-width="2"/>`;
}

const rdHeart = (x, y, col, fill) => `<path d="M${x} ${y + 12} C${x - 26} ${y - 8} ${x - 14} ${y - 28} ${x} ${y - 14} C${x + 14} ${y - 28} ${x + 26} ${y - 8} ${x} ${y + 12}Z" fill="${fill || 'none'}" stroke="${col}" stroke-width="3.5"/>`;
// the post: header (sub, time, u/author), title, flair, body, vote/comment pills
function rdPost(t, ctx, c) {
  const W = ctx.W, cw = 980, pad = 46, tw = cw - pad * 2;
  const tsz = 50, tlh = 1.24, bsz = 40, blh = 1.45;
  const titleH = c.title ? rdTextH(c.title, tw, tsz, tlh, 700) : 0;
  const bodyH = c.text ? rdTextH(c.text, tw, bsz, blh, 400) : 0;
  const head = 122, foot = 116;
  const h = head + (titleH ? titleH + 20 : 0) + (c.flair ? 54 + 22 : 0) + (bodyH ? bodyH + 8 : 0) + foot;
  const x0 = (W - cw) / 2, y0 = Math.max(rdHookTop(), Math.min(900 - h / 2, 1640 - h));
  const k = ctx.T - t < 0.001 ? 1 : easeOut(clamp(t / 0.45)), dy = (1 - k) * 80;   // shot đầu: hiện đủ ngay khung 0
  let s = `<g opacity="${k.toFixed(3)}" transform="translate(0 ${dy.toFixed(1)})">` + rdFrame(t, x0, y0, cw, h);
  const ax = x0 + pad + 34, ay = y0 + 66;
  const badge = c.source ? (c.badge || String(c.source).trim()[0] || '•') : 'r/';
  s += `<circle cx="${ax}" cy="${ay}" r="34" fill="${RD.sub}"/><text x="${ax}" y="${ay + 11}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="30" fill="#fff">${rdEsc(badge)}</text>`;
  const sub = c.source ? String(c.source) : 'r/' + String(c.sub || '').replace(/^r\//, '');
  s += `<text x="${ax + 52}" y="${ay - 6}" font-family="Inter" font-weight="700" font-size="32" fill="${RD.ink}">${rdEsc(sub)}</text>`;
  if (c.time) s += `<text x="${ax + 52 + rdTextW(sub, 32, 700) + 10}" y="${ay - 6}" font-family="Inter" font-size="30" fill="${RD.grey}">• ${rdEsc(c.time)}</text>`;
  s += `<text x="${ax + 52}" y="${ay + 32}" font-family="Inter" font-size="30" fill="${RD.grey}">${rdEsc(c.byline !== undefined ? c.byline : 'u/' + String(c.user || '').replace(/^u\//, ''))}</text>`;
  if (c.part) s += `<text x="${x0 + cw - pad}" y="${ay - 6}" text-anchor="end" font-family="Inter" font-size="28" fill="${RD.grey}">${rdEsc(c.part)}</text>`;
  let y = y0 + head;
  if (titleH) { s += rdBlock(x0 + pad, y, tw, titleH, c.title, tsz, tlh, 700, RD.ink); y += titleH + 20; }
  if (c.flair) {
    const fw = rdTextW(c.flair, 30, 500) + 36;
    s += `<rect x="${x0 + pad}" y="${y}" width="${fw}" height="50" rx="25" fill="${RD.flair}"/><text x="${x0 + pad + 18}" y="${y + 35}" font-family="Inter" font-weight="500" font-size="30" fill="#fff">${rdEsc(c.flair)}</text>`;
    y += 54 + 22;
  }
  if (bodyH) s += rdBlock(x0 + pad, y, tw, bodyH, c.text, bsz, blh, 400, RD.ink);
  // pills
  const py = y0 + h - foot / 2 - 4, ph = 64;
  let px = x0 + pad;
  if (c.votes !== undefined) {
    const vw = rdTextW(c.votes, 32, 600), w = c.likes ? 46 + vw + 34 : 46 + vw + 70;
    s += `<rect x="${px}" y="${py - ph / 2}" width="${w}" height="${ph}" rx="${ph / 2}" fill="${RD.pill}"/>` + (c.likes ? rdHeart(px + 34, py, RD.flair, RD.flair) : rdUp(px + 34, py, RD.ink));
    s += `<text x="${px + 60}" y="${py + 11}" font-family="Inter" font-weight="600" font-size="32" fill="${RD.ink}">${rdEsc(c.votes)}</text>` + (c.likes ? '' : rdDown(px + 60 + vw + 26, py, RD.ink));
    px += w + 20;
  }
  if (c.comments !== undefined) {
    const cw2 = rdTextW(c.comments, 32, 600), w = 74 + cw2 + 26;
    s += `<rect x="${px}" y="${py - ph / 2}" width="${w}" height="${ph}" rx="${ph / 2}" fill="${RD.pill}"/>` + rdBubble(px + 38, py, RD.ink);
    s += `<text x="${px + 66}" y="${py + 11}" font-family="Inter" font-weight="600" font-size="32" fill="${RD.ink}">${rdEsc(c.comments)}</text>`;
  }
  return s + '</g>';
}

// a comment chain: nested replies with thread lines; each item appears when its line starts
function rdThread(t, ctx, items, likes) {
  const W = ctx.W, cw = 980, pad = 40, ind = 62, ar = 26, nsz = 31, bsz = 38, blh = 1.42;
  const L = []; let y = 34;
  items.forEach((it, i) => {
    const d = it.depth || 0, xa = pad + d * ind, tx = xa + ar * 2 + 18, tw = cw - pad - tx;
    const th = rdTextH(it.text || '', tw, bsz, blh, 400);
    L.push({ it, i, d, xa, tx, tw, th, y });
    y += 56 + th + 78;
  });
  const h = y + 4;
  const x0 = (W - cw) / 2, y0 = Math.max(rdHookTop(), Math.min(900 - h / 2, 1600 - h));
  const k = ctx.T - t < 0.001 ? 1 : easeOut(clamp(t / 0.45)), dy = (1 - k) * 80;   // shot đầu: hiện đủ ngay khung 0
  const alpha = (e) => e.i === 0 ? 1 : easeOut(clamp((t - ctx.at({ line: e.it.line === undefined ? e.i : e.it.line })) / 0.35));
  // the card grows with the replies already read (position stays fixed: y0 uses the full height)
  let hv = 34; L.forEach((e) => { hv += (56 + e.th + 78) * alpha(e); }); hv += 4;
  let s = `<g opacity="${k.toFixed(3)}" transform="translate(0 ${dy.toFixed(1)})">` + rdFrame(t, x0, y0, cw, Math.min(h, hv));
  // thread lines (under the avatars): from the parent's avatar down to the child
  L.forEach((e) => {
    if (!e.d) return;
    let p = null; for (let j = e.i - 1; j >= 0; j--) if (L[j].d === e.d - 1) { p = L[j]; break; }
    if (!p) return;
    const a = alpha(e); if (a <= 0) return;
    const lx = x0 + p.xa + ar, ly0 = y0 + p.y + ar * 2 + 8, cy = y0 + e.y + ar, cx = x0 + e.xa;
    s += `<path d="M${lx} ${ly0} V${cy - 22} Q${lx} ${cy} ${lx + 22} ${cy} H${cx - 4}" fill="none" stroke="${RD.edge}" stroke-width="4" opacity="${a.toFixed(3)}"/>`;
  });
  L.forEach((e) => {
    const a = alpha(e); if (a <= 0) return;
    const it = e.it, yy = y0 + e.y + (1 - a) * 24;
    let o = `<g opacity="${a.toFixed(3)}">`;
    o += rdAvatar(x0 + e.xa + ar, yy + ar, ar, it.user, it.op ? '#EE9AA6' : null);
    const nx = x0 + e.tx, ny = yy + ar + 11;
    o += `<text x="${nx}" y="${ny}" font-family="Inter" font-weight="700" font-size="${nsz}" fill="${RD.ink}">${rdEsc(it.user)}</text>`;
    let mx = nx + rdTextW(it.user, nsz, 700) + 12;
    if (it.op) { o += `<text x="${mx}" y="${ny}" font-family="Inter" font-weight="700" font-size="${nsz - 2}" fill="${RD.op}">OP</text>`; mx += rdTextW('OP', nsz - 2, 700) + 12; }
    if (it.time) o += `<text x="${mx}" y="${ny}" font-family="Inter" font-size="28" fill="${RD.grey}">• ${rdEsc(it.time)}</text>`;
    o += rdBlock(nx, yy + 56, e.tw, e.th, it.text || '', bsz, blh, 400, RD.ink);
    const fy = yy + 56 + e.th + 38;
    o += (likes ? rdHeart(nx + 14, fy, RD.grey) : rdUp(nx + 14, fy, RD.grey)) + `<text x="${nx + 40}" y="${fy + 10}" font-family="Inter" font-weight="600" font-size="29" fill="${RD.grey}">${rdEsc(it.votes === undefined ? '' : it.votes)}</text>`;
    const vx = nx + 40 + rdTextW(it.votes === undefined ? '' : it.votes, 29, 600) + 26 - (likes ? 36 : 0);
    o += (likes ? '' : rdDown(vx, fy, RD.grey)) + rdBubble(vx + 62, fy, RD.grey) + `<text x="${vx + 86}" y="${fy + 10}" font-family="Inter" font-size="28" fill="${RD.grey}">Trả lời</text>`;
    s += o + '</g>';
  });
  return s + '</g>';
}

// channel outro: question to the viewer on top + page card (logo, name, tagline, pulsing "Theo dõi" button)
// p = {name, tagline, question, button}
function rdOutro(t, ctx, p) {
  const W = ctx.W, cw = 860, ch = 560, x0 = (W - cw) / 2, y0 = 760;
  const k = easeOut(clamp(t / 0.5)), sc = 0.9 + 0.1 * k;
  let s = '';
  if (p.question) {
    const qk = easeOut(clamp(t / 0.4)), qw = 940, qh = rdTextH(p.question, qw, 54, 1.25, 800);
    s += `<g opacity="${qk.toFixed(3)}">` + `<foreignObject x="${(W - qw) / 2}" y="${y0 - 70 - qh}" width="${qw}" height="${qh + 12}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 54px/1.25 Inter, sans-serif;color:#fff;text-align:center;white-space:pre-wrap;text-shadow:0 3px 10px rgba(0,0,0,.75);">${rdEsc(p.question)}</div></foreignObject></g>`;
  }
  s += `<g opacity="${k.toFixed(3)}" transform="translate(${W / 2} ${y0 + ch / 2}) scale(${sc.toFixed(4)}) translate(${-W / 2} ${-(y0 + ch / 2)})">`;
  s += rdFrame(t, x0, y0, cw, ch);
  // logo: gradient circle + speech bubble with a heart
  const lx = W / 2, ly = y0 + 130, lr = 82;
  s += `<defs><linearGradient id="rdlogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E7CF0"/><stop offset="1" stop-color="#E06AA3"/></linearGradient></defs>`;
  s += `<circle cx="${lx}" cy="${ly}" r="${lr}" fill="url(#rdlogo)"/>`;
  s += `<path d="M${lx - 46} ${ly - 34} h92 a14 14 0 0 1 14 14 v46 a14 14 0 0 1 -14 14 h-50 l-24 22 v-22 h-18 a14 14 0 0 1 -14 -14 v-46 a14 14 0 0 1 14 -14 z" fill="#fff"/>`;
  s += `<path d="M${lx} ${ly + 22} C${lx - 30} ${ly + 2} ${lx - 22} ${ly - 22} ${lx} ${ly - 8} C${lx + 22} ${ly - 22} ${lx + 30} ${ly + 2} ${lx} ${ly + 22}Z" fill="#E06AA3"/>`;
  s += `<text x="${lx}" y="${y0 + 290}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="62" fill="${RD.ink}">${rdEsc(p.name || '')}</text>`;
  if (p.tagline) s += `<text x="${lx}" y="${y0 + 345}" text-anchor="middle" font-family="Inter" font-size="34" fill="${RD.grey}">${rdEsc(p.tagline)}</text>`;
  const pulse = 1 + 0.05 * Math.max(0, Math.sin(Math.max(0, t - 0.6) * 5)), bw = 360, bh = 96, by = y0 + 410;
  s += `<g transform="translate(${lx} ${by + bh / 2}) scale(${pulse.toFixed(4)}) translate(${-lx} ${-(by + bh / 2)})">`;
  s += `<rect x="${lx - bw / 2}" y="${by}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="${RD.flair}"/>`;
  s += `<text x="${lx}" y="${by + 63}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="42" fill="#fff">${rdEsc(p.button || '+ Theo dõi')}</text></g>`;
  return s + '</g>';
}

// format scenes (QA finds them here: build.py also scans the format's layout.js for templates)
const FORMAT_SCENES = {
  // ctx.bgMedia: a background clip/image from the channel's assets is drawn under the scene -> skip the drawn hills
  reddit_post(t, ctx, p) { return (ctx.bgMedia ? '' : rdBg(ctx.T, ctx.W, ctx.H)) + rdPost(t, ctx, p.post || {}); },
  reddit_thread(t, ctx, p) { return (ctx.bgMedia ? '' : rdBg(ctx.T, ctx.W, ctx.H)) + rdThread(t, ctx, p.items || [], !!p.likes); },
  reddit_outro(t, ctx, p) { return (ctx.bgMedia ? '' : rdBg(ctx.T, ctx.W, ctx.H)) + rdOutro(t, ctx, p); },
};
if (typeof SCENES !== 'undefined') Object.assign(SCENES, FORMAT_SCENES);

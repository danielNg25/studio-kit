// Engine runtime (runs in the page): turns render.json + packs + templates into SVG frames.
let RJ = null, SUBS = [];
function chunk(se, maxc) {
  if (se.parts && se.parts.length) return se.parts.map(p => ({ text: p.text, start: p.start, end: p.start + p.dur }));   // breath group (apply_ja_breath.py)
  // keep capitalised name runs together ("Bắc Thái Bình Dương") so a subtitle never splits a place name
  const raw = se.text.split(' '), words = [], cap = w => w && w[0] !== w[0].toLowerCase();
  for (const w of raw) { const L = words.length - 1; if (L >= 0 && cap(w) && cap(words[L]) && !/[.,!?:;]$/.test(words[L]) && (words[L] + ' ' + w).length <= maxc) words[L] += ' ' + w; else words.push(w); }
  const parts = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > maxc && cur) { parts.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) parts.push(cur);
  const total = parts.reduce((a, p) => a + p.length, 0); let t = se.start; const out = [];
  for (const p of parts) { const d = se.dur * p.length / total; out.push({ text: p, start: t, end: t + d }); t += d; }
  return out;
}
// ---- channel media (render.json `media`, built by engine/media.py): background clip/image under the scene, memes on top.
// Layers: <canvas #mbg> (background) · <div #root> (the SVG scene) · <canvas #mfx> (memes). Scenes that draw their own
// background skip it when ctx.bgMedia is true (threads_card does). A scene may publish the main content box in
// window.__cardRect = {x, y, w, h} so memes are placed around it (pos: auto).
const MEDIA = { bg: null, memes: [], frames: {}, bgImg: null };
function loadImg(src) { const im = new Image(); im.src = src; return im.decode().then(() => im); }
async function setupMedia(m) {
  const root = document.getElementById('root');
  const mk = (id, z) => { const cv = document.createElement('canvas'); cv.id = id; cv.width = RJ.W; cv.height = RJ.H;
    cv.style.cssText = `position:absolute;left:0;top:0;z-index:${z};`; document.body.appendChild(cv); return cv.getContext('2d'); };
  root.style.cssText = 'position:absolute;left:0;top:0;z-index:1;';
  MEDIA.bg = m.bg || null; MEDIA.memes = m.memes || []; MEDIA.safe = m.safe;
  if (MEDIA.bg) { MEDIA.bgCtx = mk('mbg', 0); if (MEDIA.bg.kind === 'image') MEDIA.bgImg = await loadImg(MEDIA.bg.uri); }
  if (MEDIA.memes.length) {
    MEDIA.fxCtx = mk('mfx', 2);
    for (const e of MEDIA.memes) for (const f of e.frames) if (!MEDIA.frames[f]) MEDIA.frames[f] = await loadImg(f);
  }
}
async function drawBg(t) {
  const b = MEDIA.bg, cx = MEDIA.bgCtx, W = RJ.W, H = RJ.H;
  if (b.kind === 'video') {
    const i = Math.floor(t * b.speed * b.fps) % b.n;
    const im = await loadImg(b.pattern.replace('{n}', String(i + 1).padStart(5, '0')));
    cx.drawImage(im, 0, 0, W, H);
  } else {   // still image: slow zoom (Ken Burns) over the whole video
    const im = MEDIA.bgImg, z = 1 + (b.zoom || 0.06) * Math.min(1, t / Math.max(RJ.timeline.total, 1));
    const w = W * z, h = H * z; cx.drawImage(im, (im.width - im.width / 1.08) / 2, (im.height - im.height / 1.08) / 2, im.width / 1.08, im.height / 1.08, (W - w) / 2, (H - h) / 2, w, h);
  }
  if (b.dim) { cx.fillStyle = `rgba(0,0,0,${b.dim})`; cx.fillRect(0, 0, W, H); }
}
const _eob = (k) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
function memeBox(e, w, h, card) {
  const sf = MEDIA.safe || { top: 170, bottom: 1480, left: 50, right: 1030 }, W = RJ.W;
  if (Array.isArray(e.pos)) return [e.pos[0], e.pos[1], 1];
  const corner = { tl: [sf.left + w / 2, sf.top + h / 2], tr: [sf.right - w / 2, sf.top + h / 2], bl: [sf.left + w / 2, sf.bottom - h / 2], br: [sf.right - w / 2, sf.bottom - h / 2] };
  if (corner[e.pos]) return [...corner[e.pos], 1];
  if (e.pos === 'center') return [W / 2, card ? card.y + card.h / 2 : RJ.H / 2, 1];
  const above = card ? card.y - sf.top - 20 : (RJ.H / 2 - sf.top), below = card ? sf.bottom - (card.y + card.h) - 20 : (sf.bottom - RJ.H / 2);
  const fit = (gap) => Math.min(1, gap / h);
  let where = e.pos === 'top' ? 'top' : e.pos === 'bottom' ? 'bottom' : (below >= above ? 'bottom' : 'top');
  const gap = where === 'top' ? above : below;
  if (e.pos === 'auto' && gap < Math.min(h, 240)) {   // no room around the card: sit on its lower-right corner
    const x = Math.min(sf.right - w * 0.42, (card ? card.x + card.w : W) - w * 0.32), y = Math.min(sf.bottom - h * 0.45, (card ? card.y + card.h : RJ.H * 0.7) - h * 0.15);
    return [x, y, 0.85];
  }
  const s = Math.max(0.45, fit(gap));
  const y = where === 'top' ? (card ? card.y - 20 - h * s / 2 : sf.top + h * s / 2) : (card ? card.y + card.h + 20 + h * s / 2 : sf.bottom - h * s / 2);
  return [W / 2 + (e.rot > 0 ? 40 : -40), y, s];
}
function drawMemes(t) {
  const cx = MEDIA.fxCtx; cx.clearRect(0, 0, RJ.W, RJ.H);
  const card = window.__cardRect;
  for (const e of MEDIA.memes) {
    const lt = t - e.t; if (lt < 0 || lt > e.dur) continue;
    let fi = Math.floor(lt * e.fps); fi = e.loop ? fi % e.frames.length : Math.min(fi, e.frames.length - 1);
    const im = MEDIA.frames[e.frames[fi]]; if (!im) continue;
    const w0 = e.size, h0 = e.size * im.height / im.width;
    const [x, y, s0] = memeBox(e, w0, h0, card);
    const kin = Math.min(1, lt / 0.28), kout = Math.max(0, (lt - (e.dur - 0.2)) / 0.2);
    let sc = s0 * (e.anim === 'slide' ? 1 : _eob(kin)) * (1 - 0.25 * kout), dx = 0, rot = e.rot;
    if (e.anim === 'slide') dx = (1 - (1 - Math.pow(1 - kin, 3))) * (x > RJ.W / 2 ? 700 : -700);
    if (e.anim === 'shake') rot += Math.sin(lt * 40) * 5 * Math.max(0, 1 - lt / 0.6);
    cx.save(); cx.globalAlpha = Math.min(1, kin * 3) * (1 - kout);
    cx.translate(x + dx, y); cx.rotate(rot * Math.PI / 180); cx.scale(sc, sc);
    cx.shadowColor = 'rgba(0,0,0,0.45)'; cx.shadowBlur = 28; cx.shadowOffsetY = 10;
    if (!e.alpha) {   // opaque picture: white sticker frame
      const p = 12; cx.fillStyle = '#fff'; cx.beginPath();
      cx.roundRect ? cx.roundRect(-w0 / 2 - p, -h0 / 2 - p, w0 + 2 * p, h0 + 2 * p, 22) : cx.rect(-w0 / 2 - p, -h0 / 2 - p, w0 + 2 * p, h0 + 2 * p);
      cx.fill(); cx.shadowColor = 'transparent';
      cx.save(); cx.beginPath(); cx.roundRect ? cx.roundRect(-w0 / 2, -h0 / 2, w0, h0, 12) : cx.rect(-w0 / 2, -h0 / 2, w0, h0); cx.clip();
      cx.drawImage(im, -w0 / 2, -h0 / 2, w0, h0); cx.restore();
    } else cx.drawImage(im, -w0 / 2, -h0 / 2, w0, h0);
    cx.restore();
  }
}
window.setup = async (rj) => {
  RJ = rj;
  if (rj.media) await setupMedia(rj.media);
  for (const u of rj.preload || []) { try { (window.__pre = window.__pre || []).push(await loadImg(u)); } catch (e) { console.log('ERR preload ' + u); } }
  if (rj.fontBase && typeof loadPackFonts === 'function') await loadPackFonts(rj.fontBase);   // style packs with their own fonts (flat-v1)
  else { const f = new FontFace('Hand', `url(${rj.font})`); await f.load(); document.fonts.add(f); }
  SUBS = [];
  if (rj.layout.subtitles) for (const s of rj.timeline.shots) for (const l of s.lines) for (const se of l.sents) SUBS.push(...chunk(se, rj.layout.subtitles.max_chars));
  return true;
};
function makeCtx(shot, spec, t) {
  const W = RJ.W, H = RJ.H;
  const ctx = { W, H, dur: shot.dur, lines: shot.lines, T: t, floor: LAYOUT.floor(RJ.layout), surface: 420, bgMedia: !!MEDIA.bg };
  const rel = (x) => x - shot.start;
  ctx.at = (a) => {
    if (a === undefined || a === null) return 0;
    if (typeof a === 'number') return a;
    let li = null, w = a;
    if (typeof a === 'object') { li = a.line || 0; w = a.word || ''; }
    w = String(w).toLowerCase();
    const lines = li === null ? shot.lines : [shot.lines[li]].filter(Boolean);
    for (const l of lines) for (const se of l.sents) {
      const k = se.text.toLowerCase().indexOf(w);
      if (k >= 0) return rel(se.start) + se.dur * (k / Math.max(se.text.length, 1));
    }
    return lines.length ? rel(lines[0].start) : 0;
  };
  return ctx;
}
// one shot's content at local time lt (layout applied)
function renderShot(idx, lt, t) {
  const tl = RJ.timeline, shot = tl.shots[idx], spec = RJ.episode.shots[idx];
  const ctx = makeCtx(shot, spec, t);
  let body = '';
  try {
    const p = spec.params || {};
    const fn = spec.template === 'custom' ? (typeof EPISODE_SCENES !== 'undefined' && EPISODE_SCENES[p.fn]) : SCENES[spec.template];
    body = fn ? fn(lt, ctx, p) : rect(0, 0, RJ.W, RJ.H, '#f0f') + tx('missing template ' + spec.template, RJ.W / 2, RJ.H / 2, { size: 60 });
    body = LAYOUT.frame(body, lt, ctx, RJ.episode, spec, RJ.layout);
  } catch (e) { body = rect(0, 0, RJ.W, RJ.H, '#f88') + tx('ERR ' + spec.id + ': ' + e.message, RJ.W / 2, RJ.H / 2, { size: 36 }); console.log('ERR', spec.id, e.stack); }
  return body;
}
// Transitions (set on the INCOMING shot in episode.yaml):  transition: {type, dur, dir, at: [x, y]}
//   cut (default) · fade (cross-dissolve) · black (dip to black) · push (new pushes old out) · slide (new slides over old)
//   iris (circle grows from `at`) · wipe (straight edge sweeps) · drip (paint drips down revealing the new shot) · zoom (old scales up + fades: dive-in)
// The outgoing shot keeps animating during the transition (its local time runs past its end).
let _tid = 0;
function compose(prev, cur, k, tr) {
  const W = RJ.W, H = RJ.H, e = ease(k), dir = tr.dir || 'left';
  const dx = { left: -1, right: 1, up: 0, down: 0 }[dir], dy = { up: -1, down: 1, left: 0, right: 0 }[dir];
  const id = 'tr' + (++_tid);
  switch (tr.type) {
    case 'fade': return prev + `<g opacity="${e.toFixed(3)}">${cur}</g>`;
    case 'black': return k < 0.5 ? prev + `<rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="#05020A" opacity="${(e * 2).toFixed(3)}"/>`
                                 : cur + `<rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="#05020A" opacity="${(2 - e * 2).toFixed(3)}"/>`;
    case 'push': return `<g transform="translate(${(dx * e * W).toFixed(1)} ${(dy * e * H).toFixed(1)})">${prev}</g><g transform="translate(${(-dx * (1 - e) * W).toFixed(1)} ${(-dy * (1 - e) * H).toFixed(1)})">${cur}</g>`;
    case 'slide': return prev + `<g transform="translate(${(-dx * (1 - e) * W).toFixed(1)} ${(-dy * (1 - e) * H).toFixed(1)})">${cur}</g>`;
    case 'iris': { const [cx, cy] = tr.at || [W / 2, H / 2]; const r = e * Math.hypot(W, H);
      return prev + `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${cur}</g>`; }
    case 'wipe': { const x = dx ? (dx < 0 ? W * (1 - e) : 0) : 0, y = dy ? (dy < 0 ? H * (1 - e) : 0) : 0, w = dx ? W * e : W, h = dy ? H * e : H;
      return prev + `<clipPath id="${id}"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${cur}</g>`; }
    case 'drip': { const n = 8, base = e * (H + 300) - 300, pts = [[W + 20, base]];
      for (let i = n; i >= 0; i--) { const x = W * i / n, off = (Math.sin(i * 2.7) * 0.5 + 0.5) * 260; pts.push([x + W / n * 0.25, base]); pts.push([x, base + off]); pts.push([x - W / n * 0.25, base]); }
      pts.push([-20, base]);
      return prev + `<clipPath id="${id}"><path d="M-20 -20L${W + 20} -20${S(pts).replace('M', 'L')}Z"/></clipPath><g clip-path="url(#${id})">${cur}</g>`; }
    case 'zoom': return `<g opacity="${(1 - e).toFixed(3)}" transform="translate(${W / 2} ${H / 2}) scale(${(1 + e * 1.5).toFixed(3)}) translate(${-W / 2} ${-H / 2})">${prev}</g>` + `<g opacity="${e.toFixed(3)}">${cur}</g>`;
    default: return cur;
  }
}
window.renderFrame = async (t) => {
  const tl = RJ.timeline;
  window.__cardRect = null;
  if (MEDIA.bg) await drawBg(t);
  let idx = tl.shots.findIndex((s, i) => t >= s.start && (i === tl.shots.length - 1 || t < tl.shots[i + 1].start));
  if (idx < 0) idx = 0;
  const shot = tl.shots[idx], spec = RJ.episode.shots[idx], lt = t - shot.start;
  // Lớp vẽ trước SVG (vd thế giới 3D three.js ở packs/3d/layer3d.js): tập nào nạp script tự đăng ký vào window.FRAME_LAYERS;
  // không có thì bỏ qua — kênh/tập khác không đổi gì. Mỗi lớp: async (t, idx, lt, spec) => void.
  if (window.FRAME_LAYERS) for (const f of window.FRAME_LAYERS) await f(t, idx, lt, spec);
  const ctx = makeCtx(shot, spec, t);
  const tr = spec.transition;
  let body;
  if (tr && tr.type && tr.type !== 'cut' && idx > 0 && lt < (tr.dur || 0.6)) {
    const prev = tl.shots[idx - 1];
    body = compose(renderShot(idx - 1, prev.dur + lt, t), renderShot(idx, lt, t), lt / (tr.dur || 0.6), tr);
  } else body = renderShot(idx, lt, t);
  const cur = SUBS.find(s => t >= s.start - 0.05 && t < s.end + 0.12);
  const sub = cur ? LAYOUT.subtitle(cur.text, ctx, RJ.layout) : '';
  document.getElementById('root').innerHTML = `<svg xmlns="${NS}" width="${RJ.W}" height="${RJ.H}" viewBox="0 0 ${RJ.W} ${RJ.H}">${body}${sub}</svg>`;
  if (MEDIA.fxCtx) drawMemes(t);
  return true;
};

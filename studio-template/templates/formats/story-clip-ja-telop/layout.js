// Layout for story-clip-ja-telop / story-long-ja-telop (shared file): the scene is the frame + Japanese テロップ (full sentence, bottom, speaker colour, emphasised words).
// Independent of the style pack: raw SVG <text> with a system CJK font (Noto Sans CJK JP in the render container).
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content, T = L.telop;
    const k = c.zoom + (c.push || 0) * ease(t / Math.max(ctx.dur, 0.01));
    let s = k === 1 ? content : `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
    if (!T) return s;
    // current sentence (absolute time ctx.T)
    let cur = null, li = -1;
    (ctx.lines || []).forEach((l, i) => { for (const se of l.sents) if (ctx.T >= se.start - 0.05 && ctx.T < se.start + se.dur + 0.15) { cur = se; li = i; } });
    if (!cur) return s;
    let text = cur.text;
    if (cur.parts && cur.parts.length) {   // breath group (engine/patches/apply_ja_breath.py): one piece at a time
      let pc = cur.parts[0];
      for (const pp of cur.parts) if (ctx.T >= pp.start - 0.05) pc = pp;
      text = pc.text;
    }
    const who = (shot.line_voices || [])[li] || shot.speaker || 'default';
    const fill = (T.colors || {})[who] || (T.colors || {}).default || '#FFFFFF';
    const lines = LAYOUT._wrap(text, T.max_chars);
    const emph = shot.emph || [];
    const esc_ = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const spans = (str, col) => {   // colour emphasised words
      if (!emph.length) return esc_(str);
      const re = new RegExp('(' + emph.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
      return str.split(re).map(p => emph.includes(p) ? `<tspan fill="${col}">${esc_(p)}</tspan>` : esc_(p)).join('');
    };
    const lh = T.size * 1.22, y0 = T.y - (lines.length - 1) * lh;
    lines.forEach((ln_, i) => {
      const y = y0 + i * lh, common = `x="${W / 2}" y="${y}" font-family="${T.font}" font-weight="${T.weight}" font-size="${T.size}" text-anchor="middle" dominant-baseline="middle"`;
      s += `<text ${common} fill="${T.outline}" stroke="${T.outline}" stroke-width="${T.ow}" stroke-linejoin="round">${esc_(ln_)}</text>`;
      s += `<text ${common} fill="${fill}">${spans(ln_, T.emph)}</text>`;
    });
    return s;
  },
  // split a Japanese sentence into ≤ 2 lines: prefer a break after 、 or 。 near the middle
  _wrap(str, max) {
    if (str.length <= max) return [str];
    const mid = str.length / 2; let best = -1, bd = 1e9;
    for (let i = 1; i < str.length - 1; i++) if ('、。！？…'.includes(str[i]) && Math.abs(i + 1 - mid) < bd) { bd = Math.abs(i + 1 - mid); best = i + 1; }
    if (best < 0 || bd > max * 0.45) best = Math.ceil(mid);
    return [str.slice(0, best), str.slice(best)];
  },
  subtitle() { return ''; },
};

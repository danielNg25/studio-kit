// Layout story-clip-ja: the scene is the frame; Japanese subtitle at the bottom on a soft dark band (Noto Sans JP via channel jp_fonts.js).
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + (c.push || 0) * ease(t / Math.max(ctx.dur, 0.01));
    return k === 1 ? content : `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
  },
  subtitle(text, ctx, L) {
    const S_ = L.subtitles, n = [...text].length, w = Math.min(ctx.W - 120, n * S_.size * 1.02 + 90);
    return `<rect x="${(ctx.W - w) / 2}" y="${S_.y - S_.size * 0.85}" width="${w}" height="${S_.size * 1.7}" rx="${S_.size * 0.35}" fill="rgba(10,10,10,0.55)"/>` +
      tx(text, ctx.W / 2, S_.y, { font: 'JP', weight: 800, size: S_.size, fill: '#FFFFFF', outline: '#080808', ow: 8, ls: 1 });
  },
};

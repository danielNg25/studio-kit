// Layout for median-long (16:9 math/science explainer, mono-v1): the scene IS the frame; no subtitles burned in (YouTube SRT).
// unless the format turns them on. A slow push can be enabled per format (content.push).
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + (c.push || 0) * ease(t / Math.max(ctx.dur, 0.01));
    return k === 1 ? content : `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
  },
  subtitle(text, ctx, L) { return tx(text, ctx.W / 2, L.subtitles.y, { font: 'Sans', size: L.subtitles.size, fill: '#FFFFFF', outline: '#080808', ow: 9, ls: 1 }); },
};

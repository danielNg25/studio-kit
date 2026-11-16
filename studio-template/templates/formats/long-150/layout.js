// Layout for long-150: content with slow push, optional sticker at the top, subtitles at the bottom.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + c.push * ease(t / Math.max(ctx.dur, 0.01));
    let s = `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
    let cur = null;
    for (const st of (shot.stickers || [])) if (t >= ctx.at(st.at || 0)) cur = st;
    if (cur) {
      const st = L.sticker, w = Math.max(300, cur.text.length * st.size * 0.52 + 70);
      s += g(sh(R(-w / 2, -46, w, 92, 6), { fill: st.fill, sw: 6 }) + tx(cur.text, 0, 2, { size: st.size, ls: 1 }), { x: W / 2, y: st.y, s: pop(t, ctx.at(cur.at || 0)) });
    }
    return s;
  },
  subtitle(text, ctx, L) { return tx(text, ctx.W / 2, L.subtitles.y, { size: L.subtitles.size, fill: '#FFFFFF', outline: '#000000', ow: 9, ls: 1 }); },
};

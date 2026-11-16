// Layout for long-3min (flat styles): no keyword stickers by default (channel rule: text only inside the drawn world),
// subtitles at the bottom on a soft dark plate (Nunito 800, white) — readable over any scene, quiet like the style.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + c.push * ease(t / Math.max(ctx.dur, 0.01));
    let s = `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
    let cur = null;
    for (const st of (shot.stickers || [])) if (t >= ctx.at(st.at || 0) && (st.until === undefined || t < ctx.at(st.until))) cur = st;
    if (cur) s += keyword(cur.text, cur.x !== undefined ? cur.x : L.sticker.x, cur.y !== undefined ? cur.y : L.sticker.y, t, { t0: ctx.at(cur.at || 0), size: cur.size || L.sticker.size, fill: cur.fill });
    return s;
  },
  subtitle(text, ctx, L) {
    const S_ = L.subtitles, size = S_.size, y = S_.y;
    // rough width estimate for Nunito 800 (avg glyph ≈ 0.52 em) → plate
    const w = Math.min(ctx.W - 120, text.length * size * 0.52 + size * 1.4), h = size * 1.55;
    return fl(R(ctx.W / 2 - w / 2, y - h / 2, w, h, h / 2), 'rgba(18,6,36,0.62)')
      + tx(text, ctx.W / 2, y + size * 0.04, { size, fill: '#FFFFFF', weight: 800, ls: 0.5 });
  },
};

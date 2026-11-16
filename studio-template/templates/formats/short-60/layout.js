// Layout for short-60: zoomed content + fixed question box + yellow fact sticker + subtitles.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + c.push * ease(t / Math.max(ctx.dur, 0.01));
    // content point center_y lands at screen_y on screen (screen_y > center_y moves the scene down; backgrounds bleed above via bgRect)
    const sy = c.screen_y === undefined ? c.center_y : c.screen_y;
    let s = `<g transform="translate(${W / 2} ${sy}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
    if (ep.title_box) {
      const b = L.title_box;
      s += g(sh(R(-b.w / 2, -b.h / 2, b.w, b.h, 10), { fill: '#FFFFFF', sw: 7 }) + tx(ep.title_box, 0, 2, { size: b.size, lh: 1.1, ls: 1 }), { x: W / 2, y: b.y });
    }
    // sticker: the latest one whose `at` has passed
    let cur = null;
    for (const st of (shot.stickers || [])) if (t >= ctx.at(st.at || 0)) cur = st;
    if (cur) {
      const st = L.sticker, w = Math.max(360, cur.text.length * st.size * 0.52 + 80);
      s += g(sh(R(-w / 2, -52, w, 104, 6), { fill: st.fill, sw: 6 }) + tx(cur.text, 0, 2, { size: st.size, ls: 1 }), { x: W / 2, y: st.y, s: pop(t, ctx.at(cur.at || 0)) });
    }
    return s;
  },
  subtitle(text, ctx, L) { return tx(text, ctx.W / 2, L.subtitles.y, { size: L.subtitles.size, fill: '#FFFFFF', outline: '#000000', ow: 11, ls: 1 }); },
};

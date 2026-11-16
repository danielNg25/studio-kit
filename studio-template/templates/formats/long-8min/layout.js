// Layout for long-8min: content with slow push, chapter tag top-left, yellow sticker top-centre, subtitles at the bottom.
// `shot._chapter` = {n, title} is filled in by build.py (render_json) from the `chapter:` keys in episode.yaml.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + c.push * ease(t / Math.max(ctx.dur, 0.01));
    let s = `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
    // chapter tag (not on the chapter's own title card, not before the first real chapter)
    const ch = shot._chapter, tg = L.chapter_tag;
    if (tg && ch && ch.n > 0 && shot.template !== 'title_card') {
      const label = `${ch.n} · ${ch.title}`, w = label.length * tg.size * 0.5 + 44, h = tg.size * 1.5;
      s += g(sh(R(0, -h / 2, w, h, 8), { fill: '#FFFFFF', sw: 5 }) + tx(label, w / 2, 1, { size: tg.size, ls: 1 }), { x: tg.x, y: tg.y });
    }
    // sticker: the latest one whose `at` has passed
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

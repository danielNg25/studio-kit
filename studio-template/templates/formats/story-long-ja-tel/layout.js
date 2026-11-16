// Layout story-long-ja-tel (2026-10-09): same frame as story-long-ja; the Japanese subtitle colour follows the speaker of the
// shot on screen (format.yaml layout.subtitles.speakers: {<cast key>: {fill, outline, band}}). Speaker = RJ.episode.shots[i].speaker,
// found by time (the runtime keeps RJ global); falls back to the first entry. No engine change needed.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content, t, ctx, ep, shot, L) {
    const { W } = ctx, c = L.content;
    const k = c.zoom + (c.push || 0) * ease(t / Math.max(ctx.dur, 0.01));
    return k === 1 ? content : `<g transform="translate(${W / 2} ${c.center_y}) scale(${k.toFixed(4)}) translate(${-W / 2} ${-c.center_y})">${content}</g>`;
  },
  _speaker(text, t) {
    try {
      const sh = RJ.timeline.shots;
      // prefer the shot that actually contains this subtitle text near time t; else the shot playing at t
      for (let i = 0; i < sh.length; i++) { const s = sh[i]; if (t < s.start - 1 || t > s.start + s.dur + 1) continue;
        for (const l of s.lines) for (const se of l.sents) { const parts = se.parts && se.parts.length ? se.parts : [se]; if (parts.some(p => p.text === text)) return RJ.episode.shots[i].speaker; } }
      for (let i = 0; i < sh.length; i++) if (t >= sh[i].start && t < sh[i].start + sh[i].dur) return RJ.episode.shots[i].speaker;
    } catch (e) { }
    return null;
  },
  subtitle(text, ctx, L) {
    const S_ = L.subtitles, n = [...text].length, w = Math.min(ctx.W - 120, n * S_.size * 1.02 + 90);
    const sp = S_.speakers || {}, st = sp[LAYOUT._speaker(text, ctx.T)] || sp[Object.keys(sp)[0]] || { fill: '#FFFFFF', outline: '#080808', band: 'rgba(10,10,10,0.55)' };
    return `<rect x="${(ctx.W - w) / 2}" y="${S_.y - S_.size * 0.85}" width="${w}" height="${S_.size * 1.7}" rx="${S_.size * 0.35}" fill="${st.band}"/>` +
      tx(text, ctx.W / 2, S_.y, { font: 'JP', weight: 800, size: S_.size, fill: st.fill, outline: st.outline, ow: 8, ls: 1 });
  },
};

// Layout story-short-ja-v (2026-10-13): frame = passthrough (the Short's scenes.js places the 16:9 scene into the vertical panel);
// subtitles: up to 2 lines (split near the middle at 、。！？…), coloured by the speaker of the shot on screen.
const LAYOUT = {
  floor: (L) => L.content.floor_y,
  frame(content) { return content; },
  _speaker(text, t) {
    try {
      const sh = RJ.timeline.shots;
      for (let i = 0; i < sh.length; i++) { const s = sh[i]; if (t < s.start - 1 || t > s.start + s.dur + 1) continue;
        for (const l of s.lines) for (const se of l.sents) { const parts = se.parts && se.parts.length ? se.parts : [se]; if (parts.some(p => p.text === text)) return RJ.episode.shots[i].speaker; } }
      for (let i = 0; i < sh.length; i++) if (t >= sh[i].start && t < sh[i].start + sh[i].dur) return RJ.episode.shots[i].speaker;
    } catch (e) { }
    return null;
  },
  _wrap(text, n) {   // 2 lines: break after punctuation (not after 「), else after a particle that precedes kanji/katakana/「
    const ch = [...text];
    if (ch.length <= n) return [text];
    const mid = ch.length / 2, isH = (c) => c >= '\u3041' && c <= '\u309F';
    let best = -1, bs = 1e9;
    ch.forEach((c, i) => { if (i >= ch.length - 2 || i < 1) return;
      const nx = ch[i + 1], punct = '、。！？…」'.includes(c), part = 'はをがのにでともへ'.includes(c) && isH(c) && !isH(nx) && !'、。！？…」'.includes(nx);
      if (!punct && !part) return;
      const sc = Math.abs(i + 1 - mid) - (punct ? 4 : 0) + (Math.max(i + 1, ch.length - i - 1) > n + 2 ? 6 : 0);
      if (sc < bs) { bs = sc; best = i + 1; } });
    if (best < 0 || Math.abs(best - mid) > ch.length * 0.34) best = Math.ceil(mid);
    return [ch.slice(0, best).join(''), ch.slice(best).join('')];
  },
  subtitle(text, ctx, L) {
    const S_ = L.subtitles, rows = LAYOUT._wrap(text, S_.wrap || 15);
    const sp = S_.speakers || {}, st = sp[LAYOUT._speaker(text, ctx.T)] || sp[Object.keys(sp)[0]] || { fill: '#FFFFFF', outline: '#080808', band: 'rgba(10,10,10,0.7)' };
    const size = Math.min(S_.size, Math.floor((ctx.W - 90) / Math.max(...rows.map(r => [...r].length)) / 1.02));
    const lh = S_.line_h || size * 1.35, y0 = S_.y - (rows.length - 1) * lh / 2;
    const w = Math.min(ctx.W - 40, Math.max(...rows.map(r => [...r].length)) * size * 1.04 + 70), h = rows.length * lh + size * 0.5;
    return `<rect x="${(ctx.W - w) / 2}" y="${(y0 - size * 0.62 - size * 0.25).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="${size * 0.35}" fill="${st.band}"/>` +
      rows.map((r, i) => tx(r, ctx.W / 2, y0 + i * lh, { font: 'JP', weight: 900, size, fill: st.fill, outline: st.outline, ow: 9, ls: 1 })).join('');
  },
};

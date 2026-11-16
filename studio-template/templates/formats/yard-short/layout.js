// Layout for yard-short: the 3D layer (canvas under #root) is the picture; SVG adds only one-word captions.
const LAYOUT = {
  floor: () => 1500,
  frame(content) { return content; },
  subtitle(text, ctx, L) {
    const s = L.subtitles, esc = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<text x="${ctx.W / 2}" y="${s.y}" text-anchor="middle" font-family="${s.font || 'Fredoka'}" font-weight="${s.weight || 700}" font-size="${s.size}"
      fill="#FFFFFF" stroke="#111111" stroke-width="${Math.round(s.size * 0.16)}" stroke-linejoin="round" paint-order="stroke"
      style="filter: drop-shadow(0 6px 6px rgba(0,0,0,.35))">${esc}</text>`;
  },
};

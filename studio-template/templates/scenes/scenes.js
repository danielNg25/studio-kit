// Scene templates: (t, ctx, p) -> svg of the CONTENT area (no title/sticker/subtitles; the format layout adds those).
// t = seconds since shot start. ctx: {W, H, dur, floor, at(x), T, lines}. p = params from episode.yaml.
// `at` values in params: a word/phrase spoken in this shot (first line that contains it), {line: i, word: '...'}, or a number of seconds.
// Anything a template cannot express goes in the episode's own scenes.js as template: custom / fn: name.

function bgFor(kind, ctx, t) {
  const { W, H, floor } = ctx;
  kind = kind || 'sea';
  if (kind === 'sea') {
    let s = bgRect(W, H, COL.under);
    const pts = []; for (let i = 0; i <= 8; i++) pts.push([-30 + (W + 60) * i / 8, floor + Math.sin(i * 1.9) * 10]);
    s += sh(S(pts.concat([[W + 30, H + 30], [-30, H + 30]]), true, 0.6), { fill: COL.sand });
    s += rock(60, floor + 18, 180, 90) + rock(W - 70, floor + 20, 170, 85);
    s += seaweed(30, floor + 28, t, 260, 0) + seaweed(W - 50, floor + 28, t, 300, 2.1, COL.green);
    s += bubbles(t, 60, floor - 40, 4, 25, 600, 2) + bubbles(t, W - 60, floor - 40, 4, 25, 600, 7);
    return s;
  }
  if (kind === 'sea_surface') {
    const sy = ctx.surface || 420;
    let s = bgFor('sea', ctx, t);
    s += rect(0, -BLEED, W, sy + BLEED, COL.sky) + cloud(W * 0.2, sy * 0.6, 0.55) + cloud(W * 0.78, sy * 0.5, 0.45);
    const pts = []; for (let x = -20; x <= W + 20; x += 40) pts.push([x, sy + Math.sin(x / 90 + t * 1.6) * 8]);
    return s + sh(S(pts), { sw: LW, amp: 0 });
  }
  if (kind === 'room') return bgRoom(W, H, { floor });
  if (kind === 'beach') {   // sky, sea band with moving waves, wet sand (cá voi mắc cạn)
    const hz = floor - 420, sea = floor - 260;
    let s = rect(0, -BLEED, W, hz + BLEED, COL.sky) + rect(0, hz, W, sea - hz, COL.sea) + rect(0, sea, W, H - sea, COL.sand);
    s += cloud(W * 0.2, hz - 300, 0.7) + cloud(W * 0.72, hz - 360, 0.55) + sh(E(W * 0.85, hz - 260, 50), { fill: '#F3D883', sw: 5, amp: 0 });
    s += sh(Ln(-20, hz, W + 20, hz), { sw: 5, amp: 0 });
    const pts = []; for (let x = -20; x <= W + 20; x += 40) pts.push([x, sea + Math.sin(x / 80 + t * 2) * 10]);
    s += sh(S(pts.concat([[W + 30, sea + 60], [-30, sea + 60]]), true, 0.8), { fill: '#C9E6F5', sw: 0, amp: 0 }) + sh(S(pts), { sw: 5, amp: 0 });
    [[0.12, 0.5], [0.4, 0.8], [0.7, 0.4], [0.9, 0.9]].forEach(([x, k]) => { s += sh(Ln(W * x, sea + 90 + k * 120, W * x + 26, sea + 84 + k * 120), { sw: 4, stroke: COL.sandD, amp: 0 }); });
    return s;
  }
  if (kind === 'savanna') {   // dry grassland: sky, low horizon, an acacia at the edge, grass tufts (lion / tiger / mamba episodes)
    const hz = floor - 330;
    let s = rect(0, -BLEED, W, hz + BLEED, COL.sky) + rect(0, hz, W, H - hz, '#DCC488');
    s += cloud(W * 0.22, hz - 330, 0.7) + cloud(W * 0.75, hz - 380, 0.5);
    s += sh(E(W * 0.84, hz - 300, 50), { fill: '#F3D883', sw: 5, amp: 0 });
    const pts = []; for (let i = 0; i <= 8; i++) pts.push([-30 + (W + 60) * i / 8, hz + Math.sin(i * 1.7) * 8]);
    s += sh(S(pts), { sw: 5 });
    s += acacia({ x: W * 0.9, y: hz + 40, s: 0.8 }) + acacia({ x: W * 0.08, y: hz + 10, s: 0.45, flip: true });
    [[0.15, 0.4], [0.32, 0.75], [0.55, 0.3], [0.7, 0.85], [0.88, 0.55], [0.45, 0.95], [0.05, 0.9]].forEach(([x, k]) => { s += grassTuft(W * x, hz + 40 + k * (floor - hz + 40), 1 + k * 0.4); });
    return s;
  }
  if (kind.startsWith('card')) {
    const fill = COL[kind.split(':')[1]] || kind.split(':')[1] || COL.cream;
    return bgRect(W, H, fill) + rect(0, floor, W, H - floor, COL.floor) + sh(Ln(-20, floor, W + 20, floor));
  }
  return bgRect(W, H, kind);
}
// narrator helper: {pose, x, s, face, look, at+pose2 switch}
function narrator(ctx, t, n) {
  if (!n) return '';
  let pose = n.pose || 'stand', face = n.face;
  if (n.switch && t > ctx.at(n.switch.at)) { pose = n.switch.pose || pose; face = n.switch.face || face; }
  const x = n.x !== undefined ? n.x : ctx.W * 0.72;
  return narrPose(pose, { x, y: ctx.floor, s: n.s || 0.6, look: n.look !== undefined ? n.look : -0.6, face, flip: n.flip });
}

const SCENES = {
  // hunter swims in from the left, prey reacts. p: {bg, hunter:{animal,mood}, prey:{animal,mood,react_mood}, gag:{prop, at}}
  encounter(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg, ctx, t);
    const reactAt = p.prey && p.prey.react_at !== undefined ? ctx.at(p.prey.react_at) : 0.9;
    const prey = Object.assign({ animal: 'shark', mood: 'neutral' }, p.prey);
    s += actor(prey.animal, { x: W * 0.6, y: ctx.floor - 310 + bob(t, 6), s: 0.72, mood: t > reactAt ? (prey.react_mood || 'scared') : prey.mood });
    const hunter = Object.assign({ animal: 'orca', mood: 'angry' }, p.hunter);
    const hx = lerp(-420, W * 0.3, easeOut(t / 1.0));
    const gagAt = p.gag ? ctx.at(p.gag.at) : 1e9;
    s += actor(hunter.animal, { x: hx, y: ctx.floor - 610 + bob(t, 5, 3, 1), s: 0.62, mood: hunter.mood, mouth: t > gagAt ? 'open' : undefined });
    if (p.gag && t > gagAt) s += g(prop(p.gag.prop || 'napkin_fork', { x: 0, y: 0 }), { x: hx + 120, y: ctx.floor - 530, s: pop(t, gagAt) });
    return s;
  },
  // hero shows off a prop; another animal lies on the floor with a label. p: {bg, hero:{animal,mood}, prop:{name,at}, rest:{animal,mood,label,at}}
  show_off(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg, ctx, t);
    if (p.rest) s += actor(p.rest.animal || 'shark', { x: W * 0.6, y: ctx.floor - 60, s: 0.55, mood: p.rest.mood || 'out', r: 3 });
    const hero = Object.assign({ animal: 'orca', mood: 'eating' }, p.hero);
    s += actor(hero.animal, { x: W * 0.37, y: ctx.floor - 570 + bob(t, 6), s: 0.62, mood: hero.mood });
    if (p.prop) s += g(prop(p.prop.name, { x: 0, y: 0, s: 0.62, oil: true }), { x: W * 0.74, y: ctx.floor - 530 + bob(t, 9, 2), s: pop(t, ctx.at(p.prop.at) - 0.15) });
    if (p.rest && p.rest.label) s += label(p.rest.label, W * 0.21, ctx.floor - 250, W * 0.4, ctx.floor - 120, pop(t, ctx.at(p.rest.at)), { size: 66, bend: -0.25, arrowFrom: [W * 0.24, ctx.floor - 205] });
    return s;
  },
  // explain a fact with a subject + everyday-object analogy + narrator reaction.
  // p: {bg:'card:cream', subject:{animal, dots:{at, color}}, label:{text, at}, prop:{name, at, stink}, narrator:{pose, switch:{at, pose}}}
  analogy(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg || 'card:cream', ctx, t);
    const sub = p.subject || {}; const sy = ctx.floor - 660;
    if (sub.animal) s += actor(sub.animal, { x: W * 0.52, y: sy + bob(t, 5), s: 0.62, mood: sub.mood });
    if (sub.dots) {
      const k0 = ctx.at(sub.dots.at);
      [[-150, -10], [-90, 12], [-30, -24], [30, 4], [90, -26], [-120, 26], [0, 24], [60, -8]].forEach(([x, y], i) => { s += g(sh(E(0, 0, 11), { fill: sub.dots.color || COL.gyellow, sw: 3, amp: 0 }), { x: W * 0.52 + x * 0.62, y: sy + bob(t, 5) + y * 0.62, s: pop(t, k0 + i * 0.05, 0.25) }); });
    }
    if (p.label) s += label(p.label.text, W * 0.83, sy + 230, W * 0.64, sy + 30, pop(t, ctx.at(p.label.at)), { size: 74, bend: 0.25, arrowFrom: [W * 0.81, sy + 180] });
    if (p.prop) s += g(prop(p.prop.name, { x: 0, y: 0, s: 0.6, stink: p.prop.stink, t }), { x: W * 0.23, y: ctx.floor, s: pop(t, ctx.at(p.prop.at)) });
    s += narrator(ctx, t, Object.assign({ x: W * 0.7 }, p.narrator));
    return s;
  },
  // cut-away of an animal with an organ highlighted, a ratio pie and an "=" object. p: {bg, subject, organ, ratio:{text, frac, at}, extra:{prop, at}, narrator}
  cutaway(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg || 'card:skyB', ctx, t);
    const sy = ctx.floor - 610;
    s += actor(p.subject || 'shark', { x: W * 0.55, y: sy, s: 0.85 });
    if (p.organ) s += g(prop(p.organ.name || p.organ, { x: 0, y: 0, shine: false }) + sh(E(0, 0, 150, 90), { fill: 'none', sw: 5, dash: '14 12', amp: 0 }), { x: W * 0.52, y: sy + 20, s: 0.7 * pop(t, ctx.at(p.organ.at || 0), 0.4) });
    if (p.ratio) s += prop('pie', { x: W * 0.19, y: sy + 330, frac: p.ratio.frac || 0.25, text: p.ratio.text, s: pop(t, ctx.at(p.ratio.at)) });
    if (p.extra) { const kb = ctx.at(p.extra.at); s += g(prop(p.extra.prop, { x: 0, y: 0, k: (t - kb) / 0.7, s: 1.1 }), { x: W * 0.7, y: sy + 380, s: pop(t, kb) }); }
    s += narrator(ctx, t, Object.assign({ x: W * 0.44, s: 0.5, pose: 'point', look: 0.6 }, p.narrator));
    return s;
  },
  // animals flee off-screen; optional second beat with a big number object. p: {bg, chaser:'orca_fin', flee:{animal, count, at}, then:{line, prop, text, returner}}
  flee(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg || 'sea', ctx, t);
    const then = p.then; const tThen = then ? ctx.at({ line: then.line || 1, word: '' }) : 1e9;
    if (t < tThen) {
      if (p.chaser === 'orca_fin') s += orcaFin(lerp(-100, W * 0.2, easeOut(t / 0.9)), ctx.floor - 710, 0.8);
      const f = Object.assign({ animal: 'shark', count: 2 }, p.flee);
      const lanes = [[W * 0.48, ctx.floor - 510, 0.5, 0.3], [W * 0.35, ctx.floor - 250, 0.45, 0.5], [W * 0.6, ctx.floor - 380, 0.4, 0.4]].slice(0, f.count);
      for (const [x, y, sc, d] of lanes) {
        const kk = easeIn(clamp((t - ctx.at(f.at) + 0.6 - d) / 1.1));
        const xx = x + kk * 1200;
        s += actor(f.animal, { x: xx, y: y + bob(t, 5, 2, x), s: sc, mood: 'scared' });
        if (kk > 0.05 && kk < 0.95) s += speed(xx - 330 * sc - 140, y - 30, 3, 100, 28);
      }
    } else {
      s += g(prop(then.prop || 'calendar', { x: 0, y: 0, text: then.text, size: 66 }), { x: W / 2, y: ctx.floor - 490, s: 1.3 * pop(t, tThen + 0.05) });
      if (then.returner) { const back = easeOut((t - tThen - 0.4) / 1.0); s += actor(then.returner, { x: lerp(W + 400, W * 0.8, back), y: ctx.floor - 170, s: 0.42, flip: true, mood: 'sad' }); }
    }
    return s;
  },
  // closing shot: winner + a sign dropping in + narrator. p: {bg, winner:{animal}, loser:{animal}, sign:'text', narrator}
  ending_sign(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg, ctx, t);
    if (p.loser) s += actor(p.loser.animal || p.loser, { x: W * 0.6, y: ctx.floor - 60, s: 0.5, mood: 'out', r: 3 });
    if (p.winner) s += actor(p.winner.animal || p.winner, { x: W * 0.39, y: ctx.floor - 610 + bob(t, 6), s: 0.6, mood: t > 0.6 ? 'happy' : 'neutral' });
    const d = easeOut((t - 0.1) / 0.45);
    s += prop('sign', { text: p.sign || '', x: W * 0.7, y: lerp(-300, ctx.floor + 20, d), w: 380, h: 190, size: 62, r: 4 });
    s += narrator(ctx, t, Object.assign({ x: W * 0.19, s: 0.5, pose: 'point_up', look: 0.6 }, p.narrator));
    return s;
  },
  // a big object carrying a number: stopwatch / calendar / pie / battery. p: {bg, kind, text, frac, at, caption, narrator}
  number_reveal(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg || 'card:skyB', ctx, t);
    const k = pop(t, ctx.at(p.at || 0));
    const o = { x: 0, y: 0, text: p.text, frac: p.frac, hand: t * 1.6, k: p.kind === 'stopwatch' ? (p.frac || 0.2) : clamp((t - ctx.at(p.at || 0)) / 0.7), size: 70 };
    s += g(prop(p.kind || 'stopwatch', o), { x: W / 2, y: ctx.floor - 520, s: 1.6 * k });
    if (p.caption) s += g(tx(p.caption, 0, 0, { size: 80 }), { x: W / 2, y: ctx.floor - 170, s: pop(t, ctx.at(p.at || 0) + 0.2) });
    s += narrator(ctx, t, p.narrator);
    return s;
  },
  // big number + short text card, narrator on the side. p: {color, number, text, narrator}
  title_card(t, ctx, p) {
    const { W } = ctx; let s = bgFor('card:' + (p.color || 'yellow'), ctx, t);
    if (p.number) s += g(tx(p.number, 0, 0, { size: 200 }), { x: W * 0.2, y: ctx.floor - 640, s: pop(t, 0) });
    s += g(tx(p.text || '', 0, 0, { size: 96 }), { x: W * 0.58, y: ctx.floor - 640, o: fade(t, 0.15) });
    s += narrator(ctx, t, Object.assign({ x: W * 0.72, s: 0.62 }, p.narrator));
    return s;
  },
  // bar chart. p: {title, bars:[{label, value, color}], at, mascot:{animal}}
  bar_chart(t, ctx, p) {
    const { W } = ctx; let s = bgFor('card:cream', ctx, t);
    const base = ctx.floor - 200, top = ctx.floor - 860, bars = p.bars || [];
    const max = Math.max(...bars.map(b => b.value), 1), bw = (W - 240) / Math.max(bars.length, 1);
    if (p.title) s += tx(p.title, W / 2, top - 60, { size: 60 });
    s += sh(Ln(100, base, W - 100, base)) + sh(Ln(100, base, 100, top), { sw: 5 });
    bars.forEach((b, i) => {
      const k = ease((t - ctx.at(b.at !== undefined ? b.at : (p.at || 0)) - i * 0.2) / 0.8), h = (base - top - 40) * b.value / max * k;
      const x = 140 + i * bw + bw * 0.15;
      s += sh(R(x, base - h, bw * 0.7, Math.max(1, h), 0), { fill: COL[b.color] || b.color || COL.blue }) + tx(b.label, x + bw * 0.35, base + 50, { size: 44 });
    });
    return s;
  },
  // simple map. p: {region:'us_west'|'africa_south', year:{text, at}, place:{label, at, x, y}}
  map(t, ctx, p) {
    const { W, H } = ctx; let s = bgRect(W, H, COL.mapSea);
    s += g(p.region === 'africa_south' ? africaTip(1920, 1080) : usCoast(1920, 1080), { x: W === 1920 ? 0 : -880, y: W === 1920 ? 0 : 400 });
    if (p.year) s += g(tx(p.year.text, 0, 0, { size: 140 }), { x: W * 0.3, y: ctx.floor - 750, s: pop(t, ctx.at(p.year.at || 0)) });
    if (p.place) s += label(p.place.label, p.place.lx || W * 0.35, p.place.ly || ctx.floor - 520, p.place.x || W * 0.16, p.place.y || ctx.floor - 330, pop(t, ctx.at(p.place.at)), { size: 62 });
    return s;
  },
  // narrator alone with a speech bubble. p: {bg, pose, bubble:{text, at}}
  narrator_talk(t, ctx, p) {
    const { W } = ctx; let s = bgFor(p.bg || 'card:cream', ctx, t);
    s += narrPose(p.pose || 'point', { x: W * 0.5, y: ctx.floor, s: 0.9 });
    if (p.bubble) s += g(speech(0, 0, 520, 220, -120, 200, p.bubble.text, { size: 58 }), { x: W * 0.55, y: ctx.floor - 980, s: pop(t, ctx.at(p.bubble.at || 0)) });
    return s;
  },
};

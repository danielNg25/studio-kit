// ===== NỀN TỔNG QUÁT 5 LỚP cho cả tập (chuẩn VISUAL_RULES "CHUẨN HÌNH NÂNG CẤP" 12/11). tqbg(t, {mode, feat, label, cliffs, sun, cx}) → {far, mid, near, mode}
// mode: dusk | day | night | dawn | gold | grey.  feat: pass | city | camp | bridge | hill | plain | none
const TQ_PAL = {
  dusk: { sky: ['#3A2A5A', '#C85A4A', '#F6A85A', '#FFE0A0'], rd: ['#B8707A', '#8E5468', '#6A3E54'], gr: ['#C89A5A', '#7A5230'], hz: '#FFC88A', sun: '#FFF4C8', glow: '#FFD98A', cl: ['#8A4A6A', '#FFD08A'], st: '#7A4A4A', ink: '#2A1420', pool: '#FFE2A0' },
  day: { sky: ['#4A8AC8', '#86BCE2', '#C4E0F0', '#F2ECD8'], rd: ['#A4BCCC', '#86A2B4', '#6E8E7E'], gr: ['#CDB878', '#8A7844'], hz: '#FFF6DC', sun: '#FFFBE0', glow: '#FFF0B0', cl: ['#FFFFFF', '#FFF2C8'], st: '#8A8478', ink: '#2A2420', pool: '#FFF6D0' },
  night: { sky: ['#080C22', '#141C44', '#262A5A', '#3E3458'], rd: ['#2C2C50', '#22223E', '#1A1A30'], gr: ['#463A48', '#1E1826'], hz: '#FF9A4A', sun: '#F4F0D8', glow: '#B8C4F0', cl: ['#2A2A4E', '#6A6A9A'], st: '#3E3444', ink: '#0E0A14', pool: '#FFB060' },
  dawn: { sky: ['#34447A', '#8A7AA8', '#F0A890', '#FFE2B8'], rd: ['#8E8EB4', '#6C6C96', '#52527A'], gr: ['#B0A084', '#6A5E50'], hz: '#FFD8C0', sun: '#FFF0D8', glow: '#FFC8A0', cl: ['#7A6A9A', '#FFC8B0'], st: '#6E6474', ink: '#221C2A', pool: '#FFE0C8' },
  gold: { sky: ['#B88A3A', '#DDB866', '#F0D898', '#FBEBC0'], rd: ['#CCA676', '#AC8454', '#8C643A'], gr: ['#DCBC74', '#987A40'], hz: '#FFE8B0', sun: '#FFFBE8', glow: '#FFF0C0', cl: ['#E8CC8A', '#FFF4D0'], st: '#9A7A54', ink: '#2E2010', pool: '#FFF2C0' },
  grey: { sky: ['#56606C', '#868F98', '#B2BABE', '#D8DCD6'], rd: ['#7C8892', '#606C76', '#4C5660'], gr: ['#A0A084', '#5E5E4A'], hz: '#E4E8E0', sun: '#F0F0E8', glow: '#D8DCD8', cl: ['#6A747E', '#C8CED0'], st: '#6E7074', ink: '#1E2226', pool: '#E8ECE0' },
};
const TQ_H = 806;   // đường chân tường / mép đất
// ---- tường thành + cổng + lầu (dùng cho ải và thành). o: x0,x1,cx (tâm cổng), label, tower, torches, flags [[x,c]]
function tqfWall(t, P, o = {}) {
  const x0 = o.x0 ?? 330, x1 = o.x1 ?? 1590, cx = o.cx ?? 960, wy = TQ_H - 246, wh = 250, ink = P.ink, st = P.st, st2 = tqMix(st, '#000000', 0.18), st3 = tqMix(st, '#ffffff', 0.14); let s = '';
  s += `<path d="M${x0} ${wy} H${x1} V${wy + wh} H${x0}Z" fill="${st}" stroke="${ink}" stroke-width="6"/>`;
  for (let r = 0; r < 7; r++) for (let i = 0; i < Math.ceil((x1 - x0) / 58); i++) { const x = x0 + 6 + i * 58 + (r % 2) * 29, y = wy + 14 + r * 34; if (x > x1 - 56) continue; if (hrnd(i, r, 3) < 0.42) s += `<rect x="${x}" y="${y}" width="50" height="26" rx="3" fill="${hrnd(i, r, 4) < 0.5 ? st2 : st3}" opacity="0.55"/>`; }
  for (let x = x0 + 6; x < x1 - 30; x += 48) s += `<rect x="${x}" y="${wy - 30}" width="30" height="34" fill="${st}" stroke="${ink}" stroke-width="4"/>`;
  s += `<path d="M${x0} ${wy} H${x1}" stroke="${tqMix(st, P.glow, 0.5)}" stroke-width="6" opacity="0.6"/>`;
  if (o.gate !== false) { s += `<path d="M${cx - 130} ${wy + wh} V${wy + 110} Q${cx} ${wy + 10} ${cx + 130} ${wy + 110} V${wy + wh}Z" fill="${ink}"/><path d="M${cx - 114} ${wy + wh} V${wy + 118} Q${cx} ${wy + 34} ${cx + 114} ${wy + 118} V${wy + wh}Z" fill="${o.open ? '#1A0E10' : '#5A2E22'}" stroke="${ink}" stroke-width="5"/>`;
    if (!o.open) { s += `<path d="M${cx} ${wy + 60} V${wy + wh}" stroke="${ink}" stroke-width="6"/>`; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += `<circle cx="${cx - 80 + j * 54}" cy="${wy + 140 + i * 28}" r="5" fill="#C9A24A"/>`; } }
  if (o.tower !== false) { const roof = (y, w) => `<path d="M${cx - w} ${y} Q${cx - w * 0.6} ${y - 14} ${cx} ${y - 20} Q${cx + w * 0.6} ${y - 14} ${cx + w} ${y} Q${cx + w * 0.86} ${y - 34} ${cx + w * 0.7} ${y - 58} H${cx - w * 0.7} Q${cx - w * 0.86} ${y - 34} ${cx - w} ${y}Z" fill="${tqMix(ink, st, 0.3)}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><path d="M${cx - w * 0.7} ${y - 58} H${cx + w * 0.7}" stroke="#C9A24A" stroke-width="6"/>`, tw = o.towerC || '#8A3A2E';
    s += `<rect x="${cx - 190}" y="${wy - 150}" width="380" height="124" fill="${tw}" stroke="${ink}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${cx - 170 + i * 74}" y="${wy - 132}" width="44" height="88" fill="${tqMix(tw, '#000000', 0.6)}" stroke="${ink}" stroke-width="3"/>`).join('') + roof(wy - 146, 250);
    if (o.tower !== 1) s += `<rect x="${cx - 120}" y="${wy - 280}" width="240" height="84" fill="${tw}" stroke="${ink}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="${cx - 98 + i * 74}" y="${wy - 264}" width="44" height="56" fill="${tqMix(tw, '#000000', 0.6)}" stroke="${ink}" stroke-width="3"/>`).join('') + roof(wy - 276, 190); }
  if (o.label) { const w = Math.max(184, o.label.length * 17 + 30); s += `<rect x="${cx - w / 2}" y="${wy - 22}" width="${w}" height="46" rx="6" fill="#20140A" stroke="#C9A24A" stroke-width="4"/>` + kText(o.label, cx, wy + 12, 26, { c: '#E2C25A' }); }
  (o.flags || [[x0 + 90, '#2A2A30'], [x0 + 230, '#8E2430'], [x1 - 230, '#2A2A30'], [x1 - 90, '#8E2430']]).forEach(([x, c]) => { s += tqBanner(x, wy - 130, 190, c, t + x * 0.01, x < cx ? 1 : -1); });
  for (let x = x0 + 50; x < x1 - 30; x += 140) { if (Math.abs(x - cx) < 210) continue; s += tqSoldier(x, wy - 2, 0.26, tqMix(st, '#2A2030', 0.6), { dir: x < cx ? 1 : -1, skin: tqMix('#E2BC96', P.hz, 0.3), spear: (x / 140 | 0) % 2 === 0 }); }
  if (o.torches !== false) for (let x = x0 + 66; x < x1 - 30; x += 162) { if (Math.abs(x - cx) < 200) continue; const fl = 0.75 + 0.25 * Math.sin(t * 11 + x) * Math.sin(t * 7 + x * 0.3);
    s += `<circle cx="${x}" cy="${wy - 52}" r="${f1(46 * fl)}" fill="#FFB040" opacity="0.28"/><path d="M${x} ${wy - 30} v-18" stroke="${ink}" stroke-width="6"/><path d="M${x - 9} ${wy - 46} q9 ${f1(-30 * fl)} 9 ${f1(-34 * fl)} q2 14 9 ${f1(34 * fl)}Z" fill="#FFD25A" stroke="#E86A2A" stroke-width="3"/>`; }
  return s;
}
// ---- trại quân: hàng rào cọc nhọn, lều, lều soái có cờ, bếp lửa
function tqfCamp(t, P, o = {}) {
  let s = ''; const ink = P.ink, c1 = o.tent || '#C8B890', c2 = tqMix(c1, '#000000', 0.25);
  const tent = (x, g, k, big) => { const w = (big ? 250 : 150) * k, h = (big ? 230 : 130) * k; return `<path d="M${f1(x - w)} ${g} L${f1(x - w * 0.3)} ${f1(g - h)} Q${f1(x)} ${f1(g - h * 1.14)} ${f1(x + w * 0.3)} ${f1(g - h)} L${f1(x + w)} ${g}Z" fill="${c1}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><path d="M${f1(x - w * 0.3)} ${f1(g - h)} L${f1(x - w * 0.5)} ${g} M${f1(x + w * 0.3)} ${f1(g - h)} L${f1(x + w * 0.5)} ${g}" stroke="${c2}" stroke-width="4"/><path d="M${f1(x - w * 0.16)} ${g} L${f1(x)} ${f1(g - h * 0.6)} L${f1(x + w * 0.16)} ${g}Z" fill="${tqMix(ink, c1, 0.15)}"/>` + (big ? `<path d="M${f1(x - w * 0.32)} ${f1(g - h)} H${f1(x + w * 0.32)}" stroke="${o.trim || '#8E2430'}" stroke-width="12"/>` : ''); };
  for (let i = 0; i < 9; i++) { const x = 60 + i * 230 + (i % 2) * 40; if (Math.abs(x - (o.cx ?? 960)) < 330) continue; s += tent(x, TQ_H - 30 - (i % 3) * 22, 0.8 + (i % 3) * 0.12); }
  s += tent(o.cx ?? 960, TQ_H - 6, 1.15, 1) + tqBanner((o.cx ?? 960) - 330, TQ_H - 200, 260, o.flag || '#8E2430', t, 1) + tqBanner((o.cx ?? 960) + 330, TQ_H - 200, 260, o.flag || '#8E2430', t + 1, -1);
  for (let x = -10; x < 1930; x += 44) { if (o.gap && Math.abs(x - o.gap) < 190) continue; s += `<path d="M${x} ${TQ_H + 8} V${TQ_H - 86} l15 -30 l15 30 V${TQ_H + 8}Z" fill="#7A5230" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`; }
  s += `<path d="M-10 ${TQ_H - 50} H${o.gap ? o.gap - 190 : 1930} M${o.gap ? o.gap + 190 : 1930} ${TQ_H - 50} H1930" stroke="${ink}" stroke-width="7"/>`;
  for (const x of o.fires || [520, 1400]) { const fl = 0.8 + 0.2 * Math.sin(t * 10 + x); s += `<circle cx="${x}" cy="${TQ_H - 20}" r="${f1(110 * fl)}" fill="#FFA030" opacity="0.22"/><path d="M${x - 26} ${TQ_H - 4} q26 ${f1(-90 * fl)} 26 ${f1(-104 * fl)} q6 40 26 ${f1(104 * fl)}Z" fill="#FFD25A" stroke="#E86A2A" stroke-width="4"/><path d="M${x - 34} ${TQ_H} l68 -8 M${x - 34} ${TQ_H - 8} l68 8" stroke="#3A2010" stroke-width="9" stroke-linecap="round"/>`; }
  return s;
}
// ---- sông + cầu gỗ (Trường Bản, Tiêu Dao Tân). Cầu chạy ngang sau lưng nhân vật, bờ bên kia có cây
function tqfBridge(t, P, o = {}) {
  let s = ''; const ink = P.ink, y0 = TQ_H - 150, w1 = tqMix(P.sky[2], '#3A6A8A', 0.55), w2 = tqMix(P.sky[3], '#6AA0B8', 0.4);
  for (let i = 0; i < 16; i++) { const x = i * 130 - 20, h = 90 + hrnd(i, 7) * 90; s += `<path d="M${x} ${y0} q-50 ${-h * 0.5} 0 ${-h} q60 ${-h * 0.2} 70 ${h * 0.5} q20 30 -10 ${h * 0.5}Z" fill="${tqMix(P.rd[2], '#3E7A4A', 0.75)}" stroke="${ink}" stroke-width="4"/><path d="M${x + 20} ${y0 - h * 0.8} q24 ${h * 0.2} 14 ${h * 0.5}" stroke="${P.glow}" stroke-width="5" fill="none" opacity="0.5"/>`; }
  s += `<rect x="0" y="${y0}" width="1920" height="${TQ_H - y0 + 8}" fill="${w1}"/>`;
  for (let i = 0; i < 22; i++) { const x = ((hrnd(i, 2) * 2200 + t * (30 + i * 3)) % 2200) - 140, y = y0 + 14 + hrnd(i, 3) * 120; s += `<path d="M${f1(x)} ${f1(y)} q30 -8 60 0 q30 8 60 0" stroke="${w2}" stroke-width="5" fill="none" opacity="0.8" stroke-linecap="round"/>`; }
  const bx0 = o.bx0 ?? 520, bx1 = o.bx1 ?? 1400, by = y0 + 60;
  s += `<path d="M${bx0} ${by + 40} Q${(bx0 + bx1) / 2} ${by - 40} ${bx1} ${by + 40} V${by + 66} Q${(bx0 + bx1) / 2} ${by - 14} ${bx0} ${by + 66}Z" fill="#8A6238" stroke="${ink}" stroke-width="5"/>`;
  for (let i = 0; i <= 10; i++) { const u = i / 10, x = lerp(bx0, bx1, u), y = by + 40 - Math.sin(u * Math.PI) * 60; s += `<path d="M${f1(x)} ${f1(y)} v-54" stroke="${ink}" stroke-width="9"/><path d="M${f1(x)} ${f1(y)} v-54" stroke="#A8794A" stroke-width="4"/>` + (i % 3 === 1 ? `<path d="M${f1(x)} ${f1(y + 26)} V${TQ_H}" stroke="${ink}" stroke-width="12"/>` : ''); }
  s += `<path d="M${bx0} ${by - 14} Q${(bx0 + bx1) / 2} ${by - 94} ${bx1} ${by - 14}" stroke="${ink}" stroke-width="9" fill="none"/><path d="M${bx0} ${by - 14} Q${(bx0 + bx1) / 2} ${by - 94} ${bx1} ${by - 14}" stroke="#A8794A" stroke-width="4" fill="none"/>`;
  return s;
}
// ---- sườn núi dốc từ phải cao xuống trái (cho cảnh lao xuống núi), có thông
function tqfHill(t, P, o = {}) {
  let s = ''; const ink = P.ink, c = tqMix(P.rd[2], '#5A7A4A', 0.45), d = o.dir ?? 1, X = (x) => d > 0 ? x : 1920 - x;
  s += `<path d="M${X(1920)} ${TQ_H + 10} L${X(1920)} 300 Q${X(1500)} 330 ${X(1100)} 560 Q${X(800)} 720 ${X(300)} ${TQ_H + 10}Z" fill="${c}" stroke="${ink}" stroke-width="5"/><path d="M${X(1880)} 330 Q${X(1500)} 360 ${X(1120)} 580" stroke="${tqMix(c, P.glow, 0.5)}" stroke-width="8" fill="none" opacity="0.7"/>`;
  for (let i = 0; i < 12; i++) { const u = hrnd(i, 5), x = 520 + u * 1360, y = 760 - (x - 520) * 0.3 + hrnd(i, 6) * 40, k = 0.7 + hrnd(i, 7) * 0.6, pc = tqMix('#2E5A3A', P.rd[2], 0.3);
    s += `<g transform="translate(${f1(X(x))} ${f1(y)}) scale(${f1(k)})"><path d="M-7 0 v-50 h14 v50Z" fill="#5A3A20" stroke="${ink}" stroke-width="3"/><path d="M0 -190 L46 -110 H22 L58 -60 H-58 L-22 -110 H-46Z" fill="${pc}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/></g>`; }
  return s;
}
// ---- đồng trống: trại xa nhỏ + hàng cờ
function tqfPlain(t, P, o = {}) {
  let s = ''; const ink = P.ink;
  for (let i = 0; i < 14; i++) { const x = 40 + i * 140 + hrnd(i, 4) * 40, k = 0.5 + hrnd(i, 5) * 0.3; s += `<path d="M${f1(x - 60 * k)} ${TQ_H - 4} L${f1(x)} ${f1(TQ_H - 90 * k)} L${f1(x + 60 * k)} ${TQ_H - 4}Z" fill="${tqMix('#D8C8A0', P.hz, 0.4)}" stroke="${ink}" stroke-width="3" opacity="0.9"/>`; if (i % 3 === 0) s += tqBanner(x + 70, TQ_H - 100, 120, tqMix(o.flag || '#8E2430', P.hz, 0.3), t + i, 1); }
  return s;
}
function tqbg(t, o = {}) {
  const mode = o.mode || 'dusk', P = TQ_PAL[mode], id = 'bg' + (TQ_ID++), feat = o.feat || 'plain', night = mode === 'night', sx = (o.sun || [1330, 400])[0], sy = (o.sun || [1330, 400])[1]; let far = '', mid = '', near = '';
  far += `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="0.38" stop-color="${P.sky[1]}"/><stop offset="0.62" stop-color="${P.sky[2]}"/><stop offset="0.8" stop-color="${P.sky[3]}"/></linearGradient><radialGradient id="${id}u"><stop offset="0" stop-color="${P.sun}"/><stop offset="0.25" stop-color="${P.glow}" stop-opacity="0.85"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></radialGradient>`
    + `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.gr[0]}"/><stop offset="1" stop-color="${P.gr[1]}"/></linearGradient><radialGradient id="${id}p" cx="${f1(sx / 1920)}" cy="0.1" r="0.9"><stop offset="0" stop-color="${P.pool}" stop-opacity="${night ? 0.3 : 0.7}"/><stop offset="0.5" stop-color="${P.pool}" stop-opacity="0.18"/><stop offset="1" stop-color="${P.ink}" stop-opacity="0.5"/></radialGradient></defs>`;
  far += `<rect width="1920" height="1080" fill="url(#${id}s)"/>`;
  if (night) for (let i = 0; i < 70; i++) far += `<circle cx="${f1(hrnd(i, 1) * 1920)}" cy="${f1(hrnd(i, 2) * 560)}" r="${f1(1.5 + hrnd(i, 3) * 2.5)}" fill="#FFFFFF" opacity="${f1(0.4 + 0.5 * Math.abs(Math.sin(t * (1 + hrnd(i, 4)) + i)))}"/>`;
  far += `<circle cx="${sx}" cy="${sy}" r="${night ? 260 : 600}" fill="url(#${id}u)" opacity="${mode === 'grey' ? 0.5 : 1}"/><circle cx="${sx}" cy="${sy}" r="${night ? 70 : 100}" fill="${P.sun}"/>` + (night ? `<circle cx="${sx - 22}" cy="${sy - 18}" r="14" fill="#D8D4BC"/><circle cx="${sx + 20}" cy="${sy + 16}" r="10" fill="#D8D4BC"/>` : '');
  for (let i = 0; i < 6; i++) { const x = ((hrnd(i, 31) * 2600 + t * (9 + i * 3)) % 2600) - 340, y = 130 + hrnd(i, 32) * 250, w = 190 + hrnd(i, 33) * 230;
    far += `<g transform="translate(${f1(x)} ${f1(y)})" opacity="${night ? 0.6 : 0.85}"><ellipse cx="0" cy="0" rx="${f1(w)}" ry="32" fill="${P.cl[0]}"/><ellipse cx="${f1(-w * 0.3)}" cy="-22" rx="${f1(w * 0.5)}" ry="30" fill="${P.cl[0]}"/><ellipse cx="${f1(w * 0.25)}" cy="-16" rx="${f1(w * 0.45)}" ry="26" fill="${P.cl[0]}"/><path d="M${f1(-w * 0.9)} 14 Q0 42 ${f1(w * 0.9)} 14" stroke="${P.cl[1]}" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round"/></g>`; }
  if (!night) for (let i = 0; i < 8; i++) { const bx = ((t * 38 + i * 70) % 2300) - 180, by = 240 + (i % 3) * 34 + Math.sin(t * 0.8 + i) * 16 + i * 6, fl = Math.sin(t * 9 + i * 1.7) * 9; far += `<path d="M${f1(bx - 16)} ${f1(by - fl)} Q${f1(bx - 6)} ${f1(by - 6)} ${f1(bx)} ${f1(by)} Q${f1(bx + 6)} ${f1(by - 6)} ${f1(bx + 16)} ${f1(by - fl)}" stroke="${P.ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`; }
  const sd = o.seed || 0, ridge = (y0, amp, seed, c, op = 1) => { let d = `M0 1080 L0 ${y0}`; for (let x = 0; x <= 1920; x += 60) d += ` L${x} ${f1(y0 - amp * (0.5 + 0.5 * Math.sin(x * 0.004 * (1 + seed * 0.3) + seed * 3)) - amp * 0.5 * hrnd(x, seed))}`; return `<path d="${d} L1920 1080Z" fill="${c}" opacity="${op}"/>`; };
  far += ridge(600, 170, 1 + sd, P.rd[0], 0.75) + ridge(650, 150, 2 + sd, P.rd[1]) + ridge(700, 110, 3 + sd, P.rd[2]);
  if (o.cliffs) { const cc = tqMix(P.rd[2], P.ink, 0.35), cliff = (L) => `<g transform="translate(${L ? 0 : 1920} 0) scale(${L ? 1 : -1} 1)"><path d="M0 1080 L0 250 Q70 200 150 260 Q210 300 250 420 Q330 470 380 600 Q430 690 470 790 L470 1080Z" fill="${cc}" stroke="${P.ink}" stroke-width="5"/><path d="M40 320 Q120 330 170 430 M110 520 Q230 540 300 650 M60 700 Q200 720 330 820" stroke="${tqMix(cc, P.ink, 0.4)}" stroke-width="7" fill="none" opacity="0.8"/><path d="M150 262 Q200 300 244 420" stroke="${P.glow}" stroke-width="8" fill="none" opacity="0.45"/></g>`; far += cliff(1) + cliff(0); }
  if (feat === 'pass') far += tqfWall(t, P, Object.assign({ label: o.label }, o.wall || {}));
  else if (feat === 'city') far += tqfWall(t, P, Object.assign({ x0: -40, x1: 1960, cx: o.cx ?? 1250, label: o.label, tower: 1 }, o.wall || {}));
  else if (feat === 'camp') far += tqfCamp(t, P, o.camp || {});
  else if (feat === 'bridge') far += tqfBridge(t, P, o.bridge || {});
  else if (feat === 'hill') far += tqfHill(t, P, o.hill || {});
  else if (feat === 'plain') far += tqfPlain(t, P, o.plain || {});
  if (o.smoke !== false && feat !== 'bridge') for (const [sx0, ph] of [[150, 0], [1800, 3]]) for (let i = 0; i < 7; i++) { const u = ((t * 0.09 + i / 7 + ph * 0.13) % 1), x = sx0 + Math.sin(u * 5 + ph) * 34 + u * 60, y = 800 - u * 420; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(18 + u * 60)}" fill="${P.hz}" opacity="${f1(0.2 * (1 - u))}"/>`; }
  if (!night && mode !== 'grey') far += `<g style="mix-blend-mode:screen">${tqRays(t, sx, sy, { n: 9, a0: 70, step: 12, op: mode === 'day' ? 0.09 : 0.15, c: P.glow })}</g>`;
  far += `<rect x="0" y="${TQ_H - 90}" width="1920" height="160" fill="${P.hz}" opacity="${night ? 0.12 : 0.28}"/>`;
  mid += `<path d="M0 ${TQ_H - 8} H1920 V1080 H0Z" fill="url(#${id}g)"/><rect x="0" y="${TQ_H - 8}" width="1920" height="${1080 - TQ_H + 8}" fill="url(#${id}p)"/>`;
  for (let i = 0; i < 16; i++) { const x0 = 960 + (i - 7.5) * 40, x1 = 960 + (i - 7.5) * 330; mid += `<path d="M${f1(x0)} ${TQ_H} L${f1(x1)} 1080" stroke="${P.gr[1]}" stroke-width="${3 + (i % 3)}" opacity="0.22"/>`; }
  for (let i = 0; i < 14; i++) { const x = hrnd(i, 51 + sd) * 1920, y = 850 + hrnd(i, 52) * 210, k = 0.6 + (y - 820) / 260; mid += `<path d="M${f1(x)} ${f1(y)} l${f1(30 * k)} ${f1(6 * k)} l${f1(18 * k)} ${f1(-5 * k)} l${f1(26 * k)} ${f1(9 * k)}" stroke="${P.gr[1]}" stroke-width="${f1(2.5 * k)}" fill="none" opacity="0.55" stroke-linecap="round"/>`; }
  const rk = tqMix(P.gr[1], P.st, 0.5);
  for (let i = 0; i < 12; i++) { const x = hrnd(i, 61 + sd) * 1920, y = 860 + hrnd(i, 62) * 200, k = 0.6 + (y - 820) / 240, r = 12 + hrnd(i, 63) * 16;
    mid += `<ellipse cx="${f1(x - r * k)}" cy="${f1(y + 5 * k)}" rx="${f1(r * 1.8 * k)}" ry="${f1(r * 0.35 * k)}" fill="${P.ink}" opacity="0.3"/><path d="M${f1(x - r * k)} ${f1(y)} Q${f1(x - r * 0.6 * k)} ${f1(y - r * k)} ${f1(x)} ${f1(y - r * 0.9 * k)} Q${f1(x + r * k)} ${f1(y - r * 0.6 * k)} ${f1(x + r * k)} ${f1(y)}Z" fill="${rk}" stroke="${P.ink}" stroke-width="3.5"/><path d="M${f1(x + r * 0.1 * k)} ${f1(y - r * 0.75 * k)} Q${f1(x + r * 0.8 * k)} ${f1(y - r * 0.5 * k)} ${f1(x + r * 0.85 * k)} ${f1(y - 3)}" stroke="${P.glow}" stroke-width="3.5" fill="none" opacity="0.85"/>`; }
  for (let i = 0; i < 9; i++) { const x = ((hrnd(i, 71) * 2500 + t * (26 + i * 5)) % 2500) - 300, y = 850 + hrnd(i, 72) * 150; mid += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(220 + hrnd(i, 73) * 160)}" ry="${f1(16 + hrnd(i, 74) * 12)}" fill="${P.hz}" opacity="0.14"/>`; }
  const gc = tqMix(P.ink, P.gr[1], 0.3);
  for (let i = 0; i < 44; i++) { const x = hrnd(i, 21) * 1920, edge = Math.abs(x - 960) / 960; if (edge < 0.35) continue; const y = 1010 + hrnd(i, 22) * 70, h = 40 + hrnd(i, 23) * 70 * edge, sw = Math.sin(t * 1.4 + i) * 6;
    near += `<path d="M${f1(x)} ${f1(y)} q${f1(-6 + sw)} ${f1(-h * 0.6)} ${f1(-10 + sw * 2)} ${f1(-h)} M${f1(x + 8)} ${f1(y)} q${f1(4 + sw)} ${f1(-h * 0.7)} ${f1(10 + sw * 2)} ${f1(-h * 0.9)}" stroke="${gc}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }
  near += `<path d="M-20 1080 Q40 980 150 1000 Q230 1010 270 1080Z" fill="${tqMix(P.ink, P.gr[1], 0.15)}" stroke="${P.ink}" stroke-width="5"/><path d="M1940 1080 Q1880 970 1760 996 Q1690 1010 1650 1080Z" fill="${tqMix(P.ink, P.gr[1], 0.15)}" stroke="${P.ink}" stroke-width="5"/>`;
  return { far, mid, near, mode, P };
}
if (TQ_PAL) { TQ_PAL.night.light = 'night'; TQ_PAL.day.light = 'day'; TQ_PAL.dusk.light = 'dusk'; TQ_PAL.dawn.light = 'dusk'; TQ_PAL.gold.light = 'dust'; TQ_PAL.grey.light = 'day'; }

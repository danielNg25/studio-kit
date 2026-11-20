// sets.js — nền phối cảnh 1 điểm tụ cho chibi-v1 (bản thử). Toạ độ khung 1920x1080.
function hrnd(...a) { let h = 2166136261; for (const v of a) { h ^= Math.floor(v * 1000) | 0; h = Math.imul(h, 16777619); } h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) / 4294967296; }
// proj: X ngang (0 = giữa phố), Y cao (0 = mặt đất), Z sâu (≥1). VP = điểm tụ.
function mkProj(vx = 960, vy = 455, f = 900, camH = 0.62) { return (X, Y, Z) => [vx + f * X / Z, vy + f * (camH - Y) / Z]; }
const quadP = (pr, pts, fill, w = 4, extra = '') => poly(pts.map(p => pr(...p)), fill, w, INK2, extra);

// mây mực cuộn
function inkCloud(x, y, s = 1, c = '#F6F0E2') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 20 Q-130 -20 -80 -18 Q-70 -60 -20 -46 Q10 -80 50 -50 Q100 -60 104 -14 Q140 -6 124 22Z" fill="${c}" stroke="${INK2}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-60 -2 q20 -22 40 -4 M30 -18 q22 -16 36 6" stroke="${INK2}" stroke-width="2.5" fill="none" opacity="0.55" stroke-linecap="round"/></g>`;
}
function hills(y, c1, c2) {
  return `<path d="M0 ${y} Q180 ${y - 120} 360 ${y - 40} Q520 ${y - 160} 760 ${y - 50} Q980 ${y - 150} 1180 ${y - 40} Q1400 ${y - 170} 1620 ${y - 50} Q1800 ${y - 120} 1920 ${y - 30} V${y + 80} H0Z" fill="${c1}" stroke="${INK2}" stroke-width="3" opacity="0.9"/>` +
    `<path d="M0 ${y + 20} Q260 ${y - 60} 520 ${y + 10} Q820 ${y - 80} 1100 ${y + 10} Q1400 ${y - 70} 1700 ${y + 5} Q1840 ${y - 30} 1920 ${y} V${y + 80} H0Z" fill="${c2}" stroke="${INK2}" stroke-width="3"/>`;
}

// ---------- PHỐ HÀM ĐAN (chợ, nước Triệu) ----------
function setStreet() {
  const pr = mkProj(960, 470, 900, 0.62);
  let s = '';
  // trời + mây + núi xa
  s += `<rect width="1920" height="1080" fill="#DCE7E2"/><rect y="0" width="1920" height="520" fill="#E9EFE6"/>`;
  s += cloudsDrift([[300, 120, 1.1], [1500, 90, 0.9], [980, 190, 0.6]]) + birds(150, 1);
  s += hills(470, '#B7C6B5', '#A2B59F');
  // tường thành + cổng xa (Z = 9)
  const Zg = 9;
  const [gx0, gy0] = pr(-3.2, 0, Zg), [gx1, gy1] = pr(3.2, 0.95, Zg);
  s += `<rect x="${R1(gx0)}" y="${R1(gy1)}" width="${R1(gx1 - gx0)}" height="${R1(gy0 - gy1)}" fill="#C9B48E" stroke="${INK2}" stroke-width="3.5"/>`;
  for (let i = 0; i < 22; i++) { const bx = gx0 + (gx1 - gx0) * i / 22; s += `<rect x="${R1(bx + 2)}" y="${R1(gy1 - 10)}" width="${R1((gx1 - gx0) / 22 * 0.55)}" height="10" fill="#C9B48E" stroke="${INK2}" stroke-width="2.5"/>`; }
  for (let j = 1; j < 5; j++) s += `<path d="M${R1(gx0)} ${R1(gy1 + (gy0 - gy1) * j / 5)} H${R1(gx1)}" stroke="#A8926C" stroke-width="2"/>`;
  // cổng + lầu
  const [cx0, cy0] = pr(-0.38, 0, Zg), [cx1, cy1] = pr(0.38, 0.6, Zg);
  s += `<path d="M${R1(cx0)} ${R1(cy0)} V${R1(cy1 + 14)} Q${R1((cx0 + cx1) / 2)} ${R1(cy1 - 12)} ${R1(cx1)} ${R1(cy1 + 14)} V${R1(cy0)}Z" fill="#4A3A2E" stroke="${INK2}" stroke-width="3"/>`;
  const [tx0, ty0] = pr(-0.75, 0.95, Zg), [tx1, ty1] = pr(0.75, 1.45, Zg);
  s += `<rect x="${R1(tx0)}" y="${R1(ty1)}" width="${R1(tx1 - tx0)}" height="${R1(ty0 - ty1)}" fill="#9E3A2C" stroke="${INK2}" stroke-width="3"/>`;
  for (let i = 1; i < 5; i++) s += `<path d="M${R1(tx0 + (tx1 - tx0) * i / 5)} ${R1(ty1)} V${R1(ty0)}" stroke="${INK2}" stroke-width="2.5"/>`;
  s += `<path d="M${R1(tx0 - 40)} ${R1(ty1 + 6)} Q${R1((tx0 + tx1) / 2)} ${R1(ty1 - 24)} ${R1(tx1 + 40)} ${R1(ty1 + 6)} L${R1(tx1 + 10)} ${R1(ty1 - 38)} Q${R1((tx0 + tx1) / 2)} ${R1(ty1 - 60)} ${R1(tx0 - 10)} ${R1(ty1 - 38)}Z" fill="#3A3436" stroke="${INK2}" stroke-width="3"/>`;
  // cờ trên thành (nước Triệu — cờ không chữ)
  [-2.4, -1.4, 1.4, 2.4].forEach(X => { const [fx, fy] = pr(X, 0.95, Zg); s += `<path d="M${R1(fx)} ${R1(fy)} V${R1(fy - 55)}" stroke="${INK2}" stroke-width="2.5"/><path d="M${R1(fx)} ${R1(fy - 55)} q18 ${R1(6 + 5 * Math.sin(AT_() * 4 + X))} 30 ${R1(-2 + 3 * Math.sin(AT_() * 5 + X))} l-4 20 q-12 ${R1(6 + 5 * Math.sin(AT_() * 4 + X + 1))} -26 0Z" fill="#B88A2C" stroke="${INK2}" stroke-width="2"/>`; });
  // mặt đất + vệt bánh xe
  s += poly([pr(-6, 0, 0.55), pr(6, 0, 0.55), pr(6, 0, Zg), pr(-6, 0, Zg)], '#D3BE94', 0);
  s += poly([pr(-1.3, 0, 0.55), pr(1.3, 0, 0.55), pr(1.3, 0, Zg), pr(-1.3, 0, Zg)], '#CDB68A', 0);
  [-0.45, 0.45].forEach(X => { s += ln([pr(X, 0, 1.0), pr(X, 0, Zg)], 5, '#A98F64', 'opacity="0.8"'); s += ln([pr(X + 0.1, 0, 1.0), pr(X + 0.1, 0, Zg)], 3, '#B9A077', 'opacity="0.7"'); });
  // sỏi
  for (let i = 0; i < 70; i++) { const X = (hrnd(i, 1) - 0.5) * 2.5, Z = 1.05 + hrnd(i, 2) * 7; const [px, py] = pr(X, 0, Z); s += `<ellipse cx="${R1(px)}" cy="${R1(py)}" rx="${R1(10 / Z + 1)}" ry="${R1(5 / Z + 0.5)}" fill="#A88E66" opacity="0.6"/>`; }
  // dãy nhà 2 bên: mỗi gian [z0, z1]
  const bays = [[1.0, 1.9], [1.9, 2.9], [2.9, 4.1], [4.1, 5.6], [5.6, 7.4], [7.4, 9]];
  const wallC = ['#E4D2AE', '#DDC7A0', '#E7D7B6', '#DCC59C', '#E4D2AE', '#DDC7A0'];
  const awn = ['#A8432F', '#3F6E6A', '#C08A2E', '#5C5A86', '#A8432F', '#3F6E6A'];
  for (const side of [-1, 1]) {
    const XW = side * 1.35, XE = side * 1.0, Hw = 1.45;
    // vẽ từ xa đến gần
    for (let bi = bays.length - 1; bi >= 0; bi--) {
      const [z0, z1] = bays[bi], c = wallC[(bi + (side > 0 ? 1 : 0)) % wallC.length];
      // tường
      s += quadP(pr, [[XW, 0, z0], [XW, Hw, z0], [XW, Hw, z1], [XW, 0, z1]], c, 3.5);
      // cửa hàng mở (khoảng tối)
      const za = z0 + (z1 - z0) * 0.12, zb = z0 + (z1 - z0) * 0.88;
      s += quadP(pr, [[XW, 0.08, za], [XW, 0.95, za], [XW, 0.95, zb], [XW, 0.08, zb]], '#4B3A2C', 3);
      // kệ hàng trong tối
      s += ln([pr(XW, 0.55, za), pr(XW, 0.55, zb)], 4, '#7A5A3C');
      for (let j = 0; j < 4; j++) { const zz = za + (zb - za) * (j + 0.5) / 4; const [jx, jy] = pr(XW, 0.55, zz); const sc = 1 / zz; s += `<ellipse cx="${R1(jx)}" cy="${R1(jy - 26 * sc * 1.6)}" rx="${R1(18 * sc * 1.6)}" ry="${R1(24 * sc * 1.6)}" fill="${['#B36A3A', '#7E8C6A', '#C9A26A', '#8C5A42'][(j + bi) % 4]}" stroke="${INK2}" stroke-width="2.5"/>`; }
      // cột gỗ
      for (const zz of [z0, z1]) s += ln([pr(XW, 0, zz), pr(XW, Hw, zz)], 9, '#6B4A30') + ln([pr(XW, 0, zz), pr(XW, Hw, zz)], 3, INK2, 'opacity="0.5"');
      // xà ngang
      s += ln([pr(XW, 1.02, z0), pr(XW, 1.02, z1)], 8, '#6B4A30');
      // mái hiên vải (awning) chìa ra
      s += quadP(pr, [[XW, 1.0, z0 + 0.04], [XE + side * 0.02, 0.86, z0 + 0.04], [XE + side * 0.02, 0.86, z1 - 0.04], [XW, 1.0, z1 - 0.04]], awn[bi], 3);
      for (let j = 1; j < 5; j++) { const zz = z0 + (z1 - z0) * j / 5; s += ln([pr(XW, 1.0, zz), pr(XE + side * 0.02, 0.86, zz)], 2.5, '#00000033'); }
      // diềm vải tua
      s += quadP(pr, [[XE + side * 0.02, 0.86, z0 + 0.04], [XE + side * 0.02, 0.78, z0 + 0.04], [XE + side * 0.02, 0.78, z1 - 0.04], [XE + side * 0.02, 0.86, z1 - 0.04]], '#F0E2C2', 2.5);
      // mái ngói
      s += quadP(pr, [[XW, Hw, z0 - 0.05], [XW + side * -0.42, Hw + 0.08, z0 - 0.05], [XW + side * -0.42, Hw + 0.08, z1 + 0.05], [XW, Hw, z1 + 0.05]], '#4E4A4D', 3);
      for (let j = 0; j <= 8; j++) { const zz = z0 - 0.05 + (z1 - z0 + 0.1) * j / 8; s += ln([pr(XW, Hw, zz), pr(XW - side * 0.42, Hw + 0.08, zz)], 2.2, '#2E2A2C'); }
      s += quadP(pr, [[XW, Hw, z0 - 0.05], [XW, Hw + 0.38, z0 - 0.05], [XW, Hw + 0.38, z1 + 0.05], [XW, Hw, z1 + 0.05]], '#5A5558', 3);
      s += ln([pr(XW, Hw + 0.38, z0 - 0.05), pr(XW, Hw + 0.38, z1 + 0.05)], 6, '#2E2A2C');
      // biển hiệu treo (vuông góc tường)
      if (bi > 0 && bi % 2 === (side > 0 ? 0 : 1)) {
        const zz = z0 + (z1 - z0) * 0.18;
        s += quadP(pr, [[XW - side * 0.05, 1.3, zz], [XW - side * 0.32, 1.3, zz], [XW - side * 0.32, 0.98, zz], [XW - side * 0.05, 0.98, zz]], '#2F2A26', 3);
        const [qx, qy] = pr(XW - side * 0.185, 1.14, zz); const sc = 1.3 / zz;
        s += `<g transform="translate(${R1(qx)} ${R1(qy)}) scale(${R1(sc * 10) / 10})"><path d="M-10 -22 h20 M0 -26 v14 M-12 -8 h24 M-6 -2 l-6 14 M6 -2 l6 14 M-2 6 h4" stroke="#E2C27A" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>`;
      }
      // đồ bày trước cửa (gần)
      if (bi <= 2) {
        const zz = z0 + (z1 - z0) * 0.5, [bx, by] = pr(XW - side * 0.12, 0, zz), sc = 1.15 / zz;
        if ((bi + (side > 0 ? 1 : 0)) % 2 === 0) { // chum vại
          s += `<g transform="translate(${R1(bx)} ${R1(by)}) scale(${R1(sc * 100) / 100})"><ellipse cx="0" cy="-46" rx="44" ry="50" fill="#9C5A34" stroke="${INK2}" stroke-width="4"/><rect x="-24" y="-104" width="48" height="16" rx="5" fill="#8A4C2C" stroke="${INK2}" stroke-width="4"/><path d="M-36 -40 q36 14 72 0" stroke="#7A3E22" stroke-width="5" fill="none"/><ellipse cx="62" cy="-30" rx="30" ry="34" fill="#B98552" stroke="${INK2}" stroke-width="4"/><path d="M40 -48 q22 -10 44 0" stroke="#8E6234" stroke-width="4" fill="none"/></g>`;
        } else { // sạp vải lụa cuộn
          s += `<g transform="translate(${R1(bx)} ${R1(by)}) scale(${R1(sc * 100) / 100})"><rect x="-70" y="-60" width="140" height="60" fill="#7A5434" stroke="${INK2}" stroke-width="4"/>${['#C8553F', '#3F7F86', '#D9B44A', '#7C5C9A'].map((c, i) => `<rect x="${-62 + i * 32}" y="-96" width="28" height="40" rx="8" fill="${c}" stroke="${INK2}" stroke-width="3.5"/>`).join('')}</g>`;
        }
      }
    }
  }
  // người qua đường xa (nhạt)
  const far = [[-0.7, 6.2, '#7E8E9E'], [0.55, 5.0, '#A27E62'], [0.15, 7.6, '#8C8070'], [-0.3, 4.4, '#9C6E6A']];
  let crowd = '';
  for (const [X, Z, c] of far) { const [px, py] = pr(X, 0, Z); const h = 900 * 1.0 / Z; crowd += chibi({ x: px, ground: py, H: h, hair: 'bun', eyes: 'bean', mouth: 'flat', robe: { c, c2: '#5A4A3C' }, pendant: false, noShadow: true, arms: { l: 'down', r: 'down' } }); }
  s += `<g opacity="0.75">${crowd}</g>`;
  return s;
}


// ---------- chuyển động nền (đọc ANIM_T; null → đứng yên) ----------
const AT_ = () => (typeof ANIM_T === 'number' ? ANIM_T : 0);
const driftX = (x, sp, span = 2300) => ((((x + 160 + AT_() * sp) % span) + span) % span) - 160;
// mây trôi: list [[x, y, s, c?]]
const cloudsDrift = (list, sp = 14) => list.map(([x, y, sc, c], i) => inkCloud(R1(driftX(x, sp * (0.7 + 0.3 * (i % 3)))), y, sc, c)).join('');
// đàn chim bay ngang (mỗi ~16 s một lượt)
function birds(y0 = 200, seed = 0) { const T = AT_() + seed * 5.3, per = 16, k = (T % per) / per; if (k > 0.55) return ''; const bx = -200 + k / 0.55 * 2400; let s = '';
  for (let i = 0; i < 4; i++) { const x = bx - i * 46 - (i % 2) * 20, y = y0 + i * 18 + Math.sin(T * 3 + i) * 6, w = 14 + 6 * Math.sin(T * 14 + i * 1.3); s += `<path d="M${R1(x - 16)} ${R1(y - w * 0.5)} Q${R1(x - 6)} ${R1(y - 4)} ${R1(x)} ${R1(y)} Q${R1(x + 6)} ${R1(y - 4)} ${R1(x + 16)} ${R1(y - w * 0.5)}" stroke="#3A3236" stroke-width="3.5" fill="none" stroke-linecap="round"/>`; }
  return s; }
// bụi lơ lửng trong nắng / ánh đèn
function motes(n, x0, y0, w, h, c = '#FFF1C8', op = 0.55, seed = 0) { const T = AT_(); let s = '';
  for (let i = 0; i < n; i++) { const sp = 6 + hrnd(i, 50 + seed) * 10, y = y0 + h - (((hrnd(i, 51 + seed) * h + T * sp) % h)), x = x0 + hrnd(i, 52 + seed) * w + Math.sin(T * 0.7 + i) * 18, r = 2 + hrnd(i, 53 + seed) * 3.5, a = op * (0.4 + 0.6 * Math.abs(Math.sin(T * 0.9 + i * 1.7)));
    s += `<circle cx="${R1(x)}" cy="${R1(y)}" r="${R1(r)}" fill="${c}" opacity="${R1(a * 100) / 100}"/>`; }
  return s; }
// khói hương uốn lượn
function smoke(x, y, h = 160, op = 0.35) { const T = AT_(); let d = `M${x} ${y}`; for (let j = 1; j <= 6; j++) d += ` Q${R1(x + Math.sin(T * 1.5 + j) * 22)} ${R1(y - h * (j - 0.5) / 6)} ${R1(x + Math.sin(T * 1.2 + j * 1.3) * 10)} ${R1(y - h * j / 6)}`;
  return `<path d="${d}" stroke="#D8D2C8" stroke-width="5" fill="none" opacity="${op}" stroke-linecap="round"/>`; }

// ---------- ĐIỆN TẦN (triều đình) ----------
function setHall() {
  const pr = mkProj(960, 430, 860, 0.7);
  let s = '';
  const Zb = 6.2; // tường sau
  // nền tối ấm
  s += `<rect width="1920" height="1080" fill="#2E2626"/>`;
  // tường sau
  const [bx0, by0] = pr(-2.6, 0, Zb), [bx1, by1] = pr(2.6, 2.3, Zb);
  s += `<rect x="${R1(bx0)}" y="${R1(by1)}" width="${R1(bx1 - bx0)}" height="${R1(by0 - by1)}" fill="#5A2622"/>`;
  s += `<rect x="${R1(bx0)}" y="${R1(by1)}" width="${R1(bx1 - bx0)}" height="${R1(by0 - by1)}" fill="${pat('damask', '#6E302A', null, 0.8)}"/>`;
  // bình phong lớn sau ngai (hoa văn lôi văn + vân)
  const [sx0, sy0] = pr(-1.15, 0.35, Zb - 0.05), [sx1, sy1] = pr(1.15, 1.95, Zb - 0.05);
  s += `<rect x="${R1(sx0 - 14)}" y="${R1(sy1 - 14)}" width="${R1(sx1 - sx0 + 28)}" height="${R1(sy0 - sy1 + 28)}" fill="#1D1A1C" stroke="${INK2}" stroke-width="4"/>`;
  s += `<rect x="${R1(sx0)}" y="${R1(sy1)}" width="${R1(sx1 - sx0)}" height="${R1(sy0 - sy1)}" fill="#2A2629"/>`;
  s += `<rect x="${R1(sx0)}" y="${R1(sy1)}" width="${R1(sx1 - sx0)}" height="${R1(sy0 - sy1)}" fill="${pat('thunder', '#7E2A22', null, 1)}" opacity="0.9"/>`;
  for (let i = 1; i < 5; i++) s += `<path d="M${R1(sx0 + (sx1 - sx0) * i / 5)} ${R1(sy1)} V${R1(sy0)}" stroke="#C9A227" stroke-width="5"/>`;
  // hình chim huyền điểu cách điệu ở giữa (vàng) — chi tiết trang trí, không chữ
  const mx = (sx0 + sx1) / 2, myy = (sy0 + sy1) / 2;
  s += `<g transform="translate(${R1(mx)} ${R1(myy)})"><circle r="70" fill="#1D1A1C" stroke="#C9A227" stroke-width="6"/><path d="M-40 10 Q-10 -40 30 -20 Q10 -10 20 10 Q50 20 44 40 Q10 26 -6 34 Q-20 20 -40 10Z" fill="#C9A227"/><circle cx="18" cy="-14" r="5" fill="#1D1A1C"/></g>`;
  // sàn: gạch đen bóng lưới phối cảnh
  s += poly([pr(-4, 0, 1.0), pr(4, 0, 1.0), pr(2.6, 0, Zb), pr(-2.6, 0, Zb)], '#3A3236', 0);
  const fl = poly([pr(-3, 0, 0.9), pr(3, 0, 0.9), pr(2.6, 0, Zb), pr(-2.6, 0, Zb)], 'none', 0);
  for (let i = -8; i <= 8; i++) s += ln([pr(i * 0.33, 0, 0.9), pr(i * 0.33, 0, Zb)], 2.2, '#241E21');
  for (const z of [1.1, 1.35, 1.65, 2.0, 2.45, 3.0, 3.7, 4.6, 5.6]) s += ln([pr(-4, 0, z), pr(4, 0, z)], 2.2, '#241E21');
  // thảm đỏ giữa
  s += poly([pr(-0.55, 0.001, 0.9), pr(0.55, 0.001, 0.9), pr(0.55, 0.001, Zb - 1.4), pr(-0.55, 0.001, Zb - 1.4)], '#8E2A22', 3);
  s += poly([pr(-0.45, 0.002, 0.9), pr(0.45, 0.002, 0.9), pr(0.45, 0.002, Zb - 1.4), pr(-0.45, 0.002, Zb - 1.4)], pat('cloud', '#B8463A', null, 0.8), 0, 'none', 'opacity="0.8"');
  s += ln([pr(-0.47, 0.002, 0.9), pr(-0.47, 0.002, Zb - 1.4)], 4, '#C9A227') + ln([pr(0.47, 0.002, 0.9), pr(0.47, 0.002, Zb - 1.4)], 4, '#C9A227');
  // bệ cao + bậc thềm (từ Z=Zb-1.4 đến Zb)
  const dz0 = Zb - 1.4, dz1 = Zb - 0.05, dh = 0.42, nst = 5;
  s += quadP(pr, [[-1.6, dh, dz0 + 0.3], [1.6, dh, dz0 + 0.3], [1.6, dh, dz1], [-1.6, dh, dz1]], '#4A3E40', 3); // mặt bệ
  s += quadP(pr, [[-1.6, 0, dz0 + 0.3], [-0.6, 0, dz0 + 0.3], [-0.6, dh, dz0 + 0.3], [-1.6, dh, dz0 + 0.3]], '#2C2427', 3);
  s += quadP(pr, [[0.6, 0, dz0 + 0.3], [1.6, 0, dz0 + 0.3], [1.6, dh, dz0 + 0.3], [0.6, dh, dz0 + 0.3]], '#2C2427', 3);
  for (let i = 0; i < nst; i++) {
    const y0 = dh * i / nst, y1 = dh * (i + 1) / nst, z = dz0 + 0.3 * i / nst;
    s += quadP(pr, [[-0.6, y0, z], [0.6, y0, z], [0.6, y1, z], [-0.6, y1, z]], i % 2 ? '#3A3034' : '#43383C', 2.5);
    s += quadP(pr, [[-0.6, y1, z], [0.6, y1, z], [0.6, y1, z + 0.3 / nst], [-0.6, y1, z + 0.3 / nst]], '#5A4E52', 2.5);
  }
  // lan can 2 bên bậc
  for (const X of [-0.62, 0.62]) { s += ln([pr(X, 0.18, dz0), pr(X, dh + 0.18, dz0 + 0.3)], 7, '#C9A227'); s += ln([pr(X, 0, dz0), pr(X, 0.22, dz0)], 9, '#C9A227'); }
  // cột sơn đen viền đỏ-vàng
  const cols = [[-2.0, 1.25], [2.0, 1.25], [-2.0, 2.4], [2.0, 2.4], [-2.0, 4.0], [2.0, 4.0]];
  cols.sort((a, b) => b[1] - a[1]);
  for (const [X, Z] of cols) {
    const [cx0, cy0] = pr(X, 0, Z), [, cy1] = pr(X, 2.6, Z), w = 0.26 * 860 / Z;
    s += `<rect x="${R1(cx0 - w / 2)}" y="${R1(cy1)}" width="${R1(w)}" height="${R1(cy0 - cy1)}" fill="#1F1B1E" stroke="${INK2}" stroke-width="4"/>`;
    s += `<rect x="${R1(cx0 - w / 2)}" y="${R1(cy1)}" width="${R1(w * 0.28)}" height="${R1(cy0 - cy1)}" fill="#3A3438" opacity="0.8"/>`;
    for (const yy of [0.08, 0.5, 0.92]) { const yb = cy1 + (cy0 - cy1) * yy; s += `<rect x="${R1(cx0 - w / 2 - 3)}" y="${R1(yb - w * 0.09)}" width="${R1(w + 6)}" height="${R1(w * 0.18)}" fill="#9E2F25" stroke="${INK2}" stroke-width="3"/><rect x="${R1(cx0 - w / 2 - 3)}" y="${R1(yb - w * 0.02)}" width="${R1(w + 6)}" height="${R1(w * 0.04)}" fill="#C9A227"/>`; }
    s += `<rect x="${R1(cx0 - w * 0.7)}" y="${R1(cy0 - w * 0.25)}" width="${R1(w * 1.4)}" height="${R1(w * 0.3)}" rx="4" fill="#5A5054" stroke="${INK2}" stroke-width="3"/>`;
  }
  // xà trên + rèm
  s += `<rect x="0" y="0" width="1920" height="70" fill="#1F1B1E"/><rect x="0" y="58" width="1920" height="18" fill="#9E2F25" stroke="${INK2}" stroke-width="3"/><rect x="0" y="0" width="1920" height="58" fill="${pat('cloud', '#C9A227', null, 1.1)}" opacity="0.6"/>`;
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? 0 : 1920, w = 170;
    s += `<path d="M${x0} 70 L${x0 + side * -0 + (side < 0 ? w : -w)} 70 Q${x0 + (side < 0 ? w * 0.6 : -w * 0.6)} 300 ${x0 + (side < 0 ? w * 0.35 : -w * 0.35)} 560 L${x0} 560Z" fill="#7E241C" stroke="${INK2}" stroke-width="4"/>`;
    s += `<path d="M${x0 + (side < 0 ? 40 : -40)} 80 Q${x0 + (side < 0 ? 70 : -70)} 300 ${x0 + (side < 0 ? 40 : -40)} 540 M${x0 + (side < 0 ? 100 : -100)} 80 Q${x0 + (side < 0 ? 110 : -110)} 280 ${x0 + (side < 0 ? 70 : -70)} 520" stroke="#5A1812" stroke-width="4" fill="none"/>`;
    s += `<path d="M${x0 + (side < 0 ? 30 : -30)} 330 q${side < 0 ? 60 : -60} 10 ${side < 0 ? 110 : -110} -10" stroke="#C9A227" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  }
  // đỉnh đồng 2 bên bệ
  for (const X of [-1.25, 1.25]) {
    const [dx, dy] = pr(X, 0, dz0 - 0.15), sc = 1.1 / (dz0 - 0.15);
    s += `<g transform="translate(${R1(dx)} ${R1(dy)}) scale(${R1(sc * 100) / 100})"><path d="M-40 -10 L-48 40 M40 -10 L48 40 M0 0 L0 44" stroke="${INK2}" stroke-width="9"/><path d="M-40 -10 L-48 40 M40 -10 L48 40 M0 0 L0 44" stroke="#5E7A62" stroke-width="5"/><path d="M-62 -84 H62 Q66 -10 0 0 Q-66 -10 -62 -84Z" fill="#5E7A62" stroke="${INK2}" stroke-width="5"/><path d="M-60 -70 H60" stroke="#C9A227" stroke-width="5"/><rect x="-62" y="-60" width="124" height="22" fill="${pat('thunder', '#2E4434', null, 0.5)}"/><path d="M-50 -84 v-24 h16 v24 M50 -84 v-24 h-16 v24" fill="none" stroke="${INK2}" stroke-width="5"/><path d="M-30 -96 q30 -40 60 0" stroke="#D9D0C0" stroke-width="5" fill="none" opacity="0.5"/></g>`;
  }
  // khói hương nhạt (bay) + bụi trong vệt sáng giữa điện
  for (const X of [-1.25, 1.25]) { const [dx, dy] = pr(X, 0, dz0 - 0.15), sc = 1.1 / (dz0 - 0.15); s += smoke(R1(dx), R1(dy - 110 * sc), 220 * sc, 0.4) + smoke(R1(dx + 14 * sc), R1(dy - 105 * sc), 180 * sc, 0.25); }
  s += motes(26, 560, 200, 800, 700, '#FFE7B0', 0.5);
  return s;
}
// ngai rồng to quá khổ (đặt trên bệ)
function bigThrone(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M-210 -40 L-210 -330 Q-210 -380 -160 -380 L160 -380 Q210 -380 210 -330 L210 -40Z" fill="#B88A2C" stroke="${INK2}" stroke-width="6"/>
<path d="M-180 -60 L-180 -320 L180 -320 L180 -60Z" fill="#8E2A22" stroke="${INK2}" stroke-width="5"/>
<path d="M-180 -320 L180 -320 L180 -60 L-180 -60Z" fill="${pat('cloud', '#C9A227', null, 1.2)}" opacity="0.7"/>
<path d="M-240 -40 Q-260 -200 -210 -220 M240 -40 Q260 -200 210 -220" stroke="${INK2}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-240 -40 Q-260 -200 -210 -220 M240 -40 Q260 -200 210 -220" stroke="#C9A227" stroke-width="13" fill="none" stroke-linecap="round"/>
<circle cx="-210" cy="-224" r="22" fill="#C9A227" stroke="${INK2}" stroke-width="5"/><circle cx="210" cy="-224" r="22" fill="#C9A227" stroke="${INK2}" stroke-width="5"/>
<rect x="-270" y="-60" width="540" height="70" rx="10" fill="#B88A2C" stroke="${INK2}" stroke-width="6"/>
<rect x="-250" y="-48" width="500" height="44" fill="${pat('thunder', '#7A5A1C', null, 0.9)}"/>
<path d="M-250 10 L-260 120 M250 10 L260 120" stroke="${INK2}" stroke-width="26"/><path d="M-250 10 L-260 120 M250 10 L260 120" stroke="#8C6A24" stroke-width="16"/>
</g>`;
}

// ---------- BẢN ĐỒ GIẤY CŨ: Chiến Quốc thất hùng (minh hoạ, khoảng 260 TCN) ----------
// chiếu: x = (kinh độ - 100) * 80 + 40, y = (42.5 - vĩ độ) * 72
const mp = (lon, lat) => [(lon - 100) * 80 + 40, (42.5 - lat) * 72];
const smooth = (pts, close = true) => { // đường cong qua các điểm (Catmull-Rom → Bezier)
  const p = pts.map(([a, b]) => mp(a, b)), n = p.length; let d = `M${P(...p[0])}`;
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    if (!close && i === 0) { c1[0] = p1[0]; c1[1] = p1[1]; } if (!close && i === n - 2) { c2[0] = p2[0]; c2[1] = p2[1]; }
    d += ` C${P(...c1)} ${P(...c2)} ${P(...p2)}`;
  }
  return d + (close ? 'Z' : '');
};
const COAST = [[95, 45], [126, 45], [126, 39.9], [124.2, 39.9], [123.0, 39.5], [121.2, 38.8], [121.6, 39.5], [122.2, 40.6], [121.1, 40.85], [120.0, 40.2], [119.3, 39.6], [118.4, 39.1], [117.7, 38.9], [117.6, 38.3], [118.6, 38.0], [118.9, 37.5], [119.3, 37.1], [120.0, 37.3], [120.8, 37.8], [121.8, 37.5], [122.6, 37.35], [122.3, 36.85], [121.0, 36.6], [120.3, 36.0], [119.5, 35.4], [119.25, 34.6], [120.2, 33.6], [120.9, 32.6], [121.85, 31.8], [121.9, 31.0], [121.0, 30.6], [121.9, 30.0], [121.6, 29.0], [121.3, 28.2], [120.7, 27.5], [120.3, 26.0], [95, 26]];
const STATES = [ // [tên, màu, đa giác (kinh, vĩ) — thô, minh hoạ]
  ['Tần', '#7E8494', [[102.8, 36.4], [105.5, 37.4], [108.2, 38.2], [110.6, 37.0], [111.0, 35.4], [110.6, 34.2], [111.3, 33.0], [112.4, 32.0], [112.9, 30.6], [112.0, 29.6], [110.4, 29.4], [108.6, 30.0], [106.0, 28.7], [103.4, 29.2], [102.4, 31.2], [103.2, 33.6], [102.3, 35.0]]],
  ['Triệu', '#D9A95B', [[110.8, 37.2], [111.4, 39.0], [112.6, 40.6], [114.6, 40.9], [115.7, 39.6], [116.2, 38.2], [115.6, 36.6], [114.4, 36.0], [113.0, 36.3], [111.6, 36.0], [111.0, 35.5]]],
  ['Yên', '#7FB3A6', [[115.7, 39.6], [114.8, 40.9], [116.0, 41.8], [118.6, 41.9], [120.6, 41.2], [121.2, 40.9], [119.4, 39.7], [118.3, 39.1], [117.6, 38.9], [116.8, 38.6], [116.2, 38.4]]],
  ['Tề', '#8EA7D0', [[116.2, 38.2], [117.6, 38.3], [118.9, 37.5], [120.8, 37.8], [122.6, 37.35], [121.0, 36.6], [119.5, 35.4], [118.4, 35.0], [117.0, 35.2], [116.0, 35.8], [115.6, 36.6]]],
  ['Ngụy', '#B7B66A', [[113.0, 36.3], [114.4, 36.0], [115.6, 36.6], [116.0, 35.8], [116.4, 34.9], [115.6, 34.2], [114.4, 34.3], [113.8, 34.8], [112.8, 35.1], [111.6, 35.2], [111.0, 35.5], [111.6, 36.0]]],
  ['Hàn', '#C99AAE', [[110.6, 34.2], [111.0, 35.4], [111.6, 35.2], [112.8, 35.1], [113.8, 34.8], [114.0, 34.0], [113.2, 33.4], [111.9, 33.4], [111.3, 33.0]]],
  ['Sở', '#9DBB78', [[111.3, 33.0], [111.9, 33.4], [113.2, 33.4], [114.0, 34.0], [114.4, 34.3], [115.6, 34.2], [116.4, 34.9], [117.0, 35.2], [118.4, 35.0], [119.25, 34.6], [120.2, 33.6], [120.9, 32.6], [121.85, 31.8], [121.9, 31.0], [121.0, 30.6], [121.6, 29.6], [119.0, 28.6], [116.0, 27.6], [113.0, 27.4], [111.0, 28.2], [110.4, 29.4], [112.0, 29.6], [112.9, 30.6], [112.4, 32.0]]],
];
const HUANGHE = [[103.8, 36.1], [105.2, 37.5], [106.3, 38.6], [107.2, 40.1], [108.6, 40.7], [110.0, 40.5], [111.2, 40.2], [110.9, 38.8], [110.4, 37.2], [110.5, 35.6], [110.3, 34.65], [111.6, 34.8], [113.0, 34.95], [114.2, 35.3], [115.0, 36.2], [115.8, 37.2], [116.6, 38.1], [117.4, 38.7]];
const YANGTZE = [[103.6, 28.6], [104.6, 28.8], [106.5, 29.6], [108.4, 30.8], [110.2, 31.0], [111.3, 30.7], [112.2, 30.3], [113.1, 29.4], [114.3, 30.6], [115.9, 29.7], [117.0, 30.5], [118.4, 31.4], [118.8, 32.1], [120.3, 31.95], [121.6, 31.65]];
const WEI = [[104.8, 34.6], [106.8, 34.4], [108.9, 34.35], [110.3, 34.62]];
const HAN_R = [[106.9, 33.1], [109.0, 32.7], [111.5, 32.6], [112.1, 32.0], [113.2, 30.9], [114.3, 30.6]];
function setMap(o = {}) {
  const rv = o.reveal ?? 1, showNames = o.names ?? 1;
  let s = `<rect width="1920" height="1080" fill="#BFD3D1"/>`;
  // sóng biển
  for (let i = 0; i < 40; i++) { const x = 1300 + hrnd(i, 3) * 620 + Math.sin(AT_() * 0.8 + i) * 14, y = 120 + hrnd(i, 4) * 900; s += `<path opacity="${R1((0.55 + 0.45 * Math.sin(AT_() * 1.3 + i * 2.1)) * 100) / 100}" d="M${R1(x)} ${R1(y)} q12 -10 24 0 q12 10 24 0" stroke="#8FAFAE" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
  // đất liền (giấy)
  s += `<path d="${smooth(COAST)}" fill="#EFDFB8" stroke="${INK2}" stroke-width="5"/>`;
  s += `<path d="${smooth(COAST)}" fill="none" stroke="#8FAFAE" stroke-width="14" opacity="0.45" transform="translate(0 0)"/>`;
  // các nước
  s += `<clipPath id="land"><path d="${smooth(COAST)}"/></clipPath><g clip-path="url(#land)">`;
  const vis = i => Math.max(0, Math.min(1, rv * STATES.length - i));
  STATES.forEach(([n, c, pts], i) => { if (vis(i) > 0) s += `<path d="${smooth(pts)}" fill="${c}" opacity="${R1(0.7 * vis(i) * 100) / 100}"/>`; });
  STATES.forEach(([n, c, pts], i) => { if (vis(i) > 0) s += `<path d="${smooth(pts)}" fill="none" stroke="${INK2}" stroke-width="3.5" stroke-dasharray="14 7" opacity="${R1(0.8 * vis(i) * 100) / 100}"/>`; });
  s += `</g>`;
  // núi
  const mtn = (lon, lat, sc = 1) => { const [x, y] = mp(lon, lat); return `<path d="M${R1(x - 26 * sc)} ${R1(y)} L${R1(x)} ${R1(y - 30 * sc)} L${R1(x + 26 * sc)} ${R1(y)} M${R1(x - 8 * sc)} ${R1(y - 20 * sc)} L${R1(x - 2 * sc)} ${R1(y - 8 * sc)}" stroke="#6B5A40" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`; };
  [[107.5, 34.0], [108.6, 33.8], [109.6, 33.7], [106.5, 33.9], [113.2, 37.0], [113.6, 38.2], [113.9, 36.5], [114.2, 39.2], [104.5, 30.6], [110.0, 29.6], [117.3, 36.4]].forEach(([a, b]) => s += mtn(a, b, 1.1));
  // sông
  for (const [rv, w] of [[HUANGHE, 7], [YANGTZE, 7], [WEI, 4], [HAN_R, 4]]) s += `<path d="${smooth(rv, false)}" stroke="#5E8FA6" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const lab = (t, lon, lat, sz = 26, c = '#3F6E86', rot = 0) => { const [x, y] = mp(lon, lat); return `<text x="${R1(x)}" y="${R1(y)}" font-family="${FH}" font-size="${sz}" fill="${c}" stroke="#F7EFDC" stroke-width="${R1(Math.max(4, sz * 0.16))}" paint-order="stroke" stroke-linejoin="round" text-anchor="middle" transform="rotate(${rot} ${R1(x)} ${R1(y)})">${t}</text>`; };
  s += lab('Hoàng Hà', 111.6, 39.6, 32, '#2F5E76', -70) + lab('Trường Giang', 116.4, 29.4, 32, '#2F5E76', -14) + lab('sông Vị', 107.6, 34.85, 30, '#2F5E76');
  // tên nước
  const names = { 'Tần': [106.8, 32.4], 'Triệu': [113.6, 38.9], 'Yên': [118.2, 40.6], 'Tề': [119.0, 36.4], 'Ngụy': [114.4, 35.2], 'Hàn': [112.2, 34.1], 'Sở': [114.6, 31.2] };
  for (const [n, [a, b]] of Object.entries(names)) if (showNames && vis(STATES.findIndex(q => q[0] === n)) >= 1) s += `<g transform="rotate(-3 ${R1(mp(a, b)[0])} ${R1(mp(a, b)[1])})">${lab(n, a, b, 58, INK2)}</g>`;
  // kinh đô
  const city = (t, lon, lat, dx = 0, dy = 36) => { const [x, y] = mp(lon, lat); return `<rect x="${R1(x - 11)}" y="${R1(y - 11)}" width="22" height="22" fill="#9E2F25" stroke="${INK2}" stroke-width="3.5"/><rect x="${R1(x - 4)}" y="${R1(y - 4)}" width="8" height="8" fill="#F2E3C0"/><text x="${R1(x + dx)}" y="${R1(y + dy)}" font-family="${FH}" font-size="34" fill="#6B2A1E" stroke="#F7EFDC" stroke-width="7" paint-order="stroke" stroke-linejoin="round" text-anchor="middle">${t}</text>`; };
  if (o.cities !== false) s += city('Hàm Dương', 108.7, 34.35, 0, 44) + city('Hàm Đan', 114.5, 36.6, 0, 40);
  // biển + hướng bắc (dấu đỏ)
  s += lab('BIỂN', 121.9, 33.2, 40, '#4E7E7E');
  s += `<g transform="translate(1780 150)"><circle r="54" fill="none" stroke="#9E2F25" stroke-width="6"/><path d="M0 -44 L14 6 L0 -4 L-14 6Z" fill="#9E2F25"/><text y="40" font-family="${FH}" font-size="30" text-anchor="middle" fill="#9E2F25">BẮC</text></g>`;
  s += `<text x="40" y="1050" font-family="${FH}" font-size="24" fill="#5A4A36" text-anchor="start">(bản đồ minh hoạ, ranh giới phỏng theo khoảng 260 TCN)</text>`;
  return s;
}

// ---------- PHÒNG TRONG (cung, phủ) — tường hoa văn, cửa sổ tròn, sàn gỗ, bình phong, bàn trà, đèn lụa ----------
// o: {wall, wall2, floor, accent}
function setChamber(o = {}) {
  const pr = mkProj(960, 470, 900, 0.62), wall = o.wall || '#E8D6B4', wall2 = o.wall2 || '#D9C29A', floor = o.floor || '#B98B5E', acc = o.accent || '#9E2F25';
  const Zb = 4.2; let s = '';
  s += `<rect width="1920" height="1080" fill="${wall}"/>`;
  const [bx0, by0] = pr(-2.4, 0, Zb), [bx1, by1] = pr(2.4, 2.2, Zb);
  // tường sau + hoa văn
  s += `<rect x="0" y="0" width="1920" height="${R1(by0)}" fill="${wall}"/><rect x="0" y="0" width="1920" height="${R1(by0)}" fill="${pat('damask', wall2, null, 0.9)}" opacity="0.7"/>`;
  // tường bên (phối cảnh)
  for (const q of [-1, 1]) { s += quadP(pr, [[q * 2.4, 0, Zb], [q * 2.4, 2.4, Zb], [q * 2.4, 2.4, 0.6], [q * 2.4, 0, 0.6]], wall2, 4); s += quadP(pr, [[q * 2.4, 0, Zb], [q * 2.4, 0.3, Zb], [q * 2.4, 0.3, 0.6], [q * 2.4, 0, 0.6]], '#7A5234', 3); }
  // sàn ván
  s += poly([pr(-2.4, 0, 0.6), pr(2.4, 0, 0.6), pr(2.4, 0, Zb), pr(-2.4, 0, Zb)], floor, 4);
  for (let i = -6; i <= 6; i++) s += ln([pr(i * 0.4, 0, 0.6), pr(i * 0.4, 0, Zb)], 2.5, '#8E6640');
  // chân tường sau
  s += `<rect x="${R1(bx0)}" y="${R1(by0 - 26)}" width="${R1(bx1 - bx0)}" height="26" fill="#7A5234" stroke="${INK2}" stroke-width="3"/>`;
  // cửa sổ tròn với trúc ngoài
  const wx = 960 + (o.winX || 0), wy = 330, wr = 150;
  s += `<clipPath id="win1"><circle cx="${wx}" cy="${wy}" r="${wr}"/></clipPath><g clip-path="url(#win1)"><rect x="${wx - wr}" y="${wy - wr}" width="${wr * 2}" height="${wr * 2}" fill="#D7E6D2"/>`;
  for (let i = 0; i < 7; i++) { const x = wx - wr + 20 + i * 46; s += `<path d="M${x} ${wy + wr} Q${x + 10} ${wy} ${x - 6} ${wy - wr}" stroke="#7FA36E" stroke-width="9" fill="none"/>` + [0, 1, 2].map(j => `<path d="M${x + 4} ${wy + 80 - j * 90} q30 -14 52 -4 q-26 4 -52 4Z" fill="#8DB57A" stroke="#4F7344" stroke-width="2"/>`).join(''); }
  s += `</g><circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="#5A3A24" stroke-width="18"/><circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="${INK2}" stroke-width="4"/>`;
  s += `<path d="M${wx - wr} ${wy} H${wx + wr} M${wx} ${wy - wr} V${wy + wr}" stroke="#5A3A24" stroke-width="6" opacity="0.7"/>`;
  // bình phong (trái) — tranh núi mực
  const sx = 330, sy = 330, sw = 360, sh = 380;
  s += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#F3E9D2" stroke="${INK2}" stroke-width="5"/>` + [1, 2].map(i => `<path d="M${sx + sw * i / 3} ${sy} V${sy + sh}" stroke="#5A3A24" stroke-width="8"/>`).join('');
  s += `<path d="M${sx + 20} ${sy + 250} Q${sx + 80} ${sy + 120} ${sx + 140} ${sy + 220} Q${sx + 200} ${sy + 90} ${sx + 270} ${sy + 210} Q${sx + 310} ${sy + 160} ${sx + 345} ${sy + 230}" stroke="#7A7A7A" stroke-width="5" fill="none"/><circle cx="${sx + 280}" cy="${sy + 80}" r="26" fill="#D9573F" opacity="0.8"/>`;
  s += `<rect x="${sx - 10}" y="${sy + sh}" width="${sw + 20}" height="22" fill="#5A3A24" stroke="${INK2}" stroke-width="4"/>`;
  // đèn lụa treo (phải)
  const lx = 1560 + Math.sin(AT_() * 1.4) * 10, ly = 210;
  s += `<path d="M${lx} 0 V${ly - 60}" stroke="${INK2}" stroke-width="4"/><ellipse cx="${lx}" cy="${ly}" rx="62" ry="78" fill="${acc}" stroke="${INK2}" stroke-width="5"/><path d="M${lx - 40} ${ly - 56} Q${lx} ${ly} ${lx - 40} ${ly + 56} M${lx + 40} ${ly - 56} Q${lx} ${ly} ${lx + 40} ${ly + 56}" stroke="${INK2}" stroke-width="3" fill="none" opacity="0.6"/><rect x="${lx - 34}" y="${ly - 90}" width="68" height="16" fill="#C9A227" stroke="${INK2}" stroke-width="3"/><rect x="${lx - 34}" y="${ly + 74}" width="68" height="16" fill="#C9A227" stroke="${INK2}" stroke-width="3"/><path d="M${lx - 16} ${ly + 90} v50 M${lx} ${ly + 90} v62 M${lx + 16} ${ly + 90} v50" stroke="${acc}" stroke-width="5"/>`;
  s += `<ellipse cx="${lx}" cy="${ly}" rx="120" ry="140" fill="#FFE39A" opacity="${R1((0.16 + 0.05 * Math.sin(AT_() * 7) * Math.sin(AT_() * 3.1)) * 100) / 100}" filter="url(#soft)"/>` + motes(16, 700, 180, 700, 520, '#FFF4D6', 0.45, 3);
  // bàn trà thấp (phải giữa)
  const [tx, ty] = pr(1.35, 0, 2.2); const ts = 1.2 / 2.2;
  s += `<g transform="translate(${R1(tx)} ${R1(ty)}) scale(${R1(ts * 100) / 100})"><rect x="-150" y="-110" width="300" height="34" rx="6" fill="#6B3E26" stroke="${INK2}" stroke-width="5"/><path d="M-130 -76 V0 M130 -76 V0" stroke="${INK2}" stroke-width="16"/><path d="M-130 -76 V0 M130 -76 V0" stroke="#5A321E" stroke-width="9"/><path d="M-60 -110 q0 -46 30 -46 h20 q30 0 30 46Z" fill="#DCE8E0" stroke="${INK2}" stroke-width="4"/><path d="M30 -128 q20 -6 26 10" stroke="${INK2}" stroke-width="4" fill="none"/><ellipse cx="70" cy="-118" rx="22" ry="10" fill="#DCE8E0" stroke="${INK2}" stroke-width="3.5"/><ellipse cx="110" cy="-118" rx="22" ry="10" fill="#DCE8E0" stroke="${INK2}" stroke-width="3.5"/></g>`;
  // rèm 2 bên trên
  s += `<path d="M0 0 H1920 V40 Q1700 90 1480 40 Q1240 90 960 40 Q680 90 440 40 Q220 90 0 40Z" fill="${acc}" stroke="${INK2}" stroke-width="4"/><path d="M0 0 H1920 V22 H0Z" fill="#C9A227" opacity="0.8"/>`;
  return s;
}
// ---------- NGOÀI THÀNH: tường đất nện + cổng + lầu, đường đất, đồi xa ----------
function setCityGate(o = {}) {
  let s = `<rect width="1920" height="1080" fill="#E3ECE4"/>` + cloudsDrift([[320, 140, 1.2], [1560, 110, 1.0]]) + birds(220, 2) + hills(520, '#B9C8B4', '#A6B79F');
  const wy = 640, wc = o.wall || '#CBB58F';
  s += `<rect x="-10" y="${wy - 230}" width="1940" height="260" fill="${wc}" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 48; i++) s += `<rect x="${i * 42 - 8}" y="${wy - 258}" width="26" height="28" fill="${wc}" stroke="${INK2}" stroke-width="4"/>`;
  for (let j = 1; j < 6; j++) s += `<path d="M0 ${wy - 230 + j * 44} H1920" stroke="#A8916A" stroke-width="3"/>`;
  for (let i = 0; i < 40; i++) s += `<path d="M${(i * 97) % 1920} ${wy - 220 + (i * 37) % 230} h${18 + (i % 3) * 10}" stroke="#B49C74" stroke-width="3"/>`;
  // cổng + lầu
  s += `<path d="M820 ${wy + 30} V${wy - 110} Q960 ${wy - 220} 1100 ${wy - 110} V${wy + 30}Z" fill="#3E3128" stroke="${INK2}" stroke-width="5"/><path d="M836 ${wy + 30} V${wy - 104} Q960 ${wy - 200} 1084 ${wy - 104} V${wy + 30}" stroke="#6B4A30" stroke-width="10" fill="none"/>`;
  s += `<rect x="700" y="${wy - 420}" width="520" height="170" fill="#9E3A2C" stroke="${INK2}" stroke-width="5"/>` + [1, 2, 3, 4, 5].map(i => `<path d="M${700 + i * 520 / 6} ${wy - 420} V${wy - 250}" stroke="${INK2}" stroke-width="4"/>`).join('') + `<rect x="700" y="${wy - 300}" width="520" height="14" fill="#5A2A20"/>`;
  s += `<path d="M640 ${wy - 410} Q960 ${wy - 470} 1280 ${wy - 410} L1210 ${wy - 500} Q960 ${wy - 540} 710 ${wy - 500}Z" fill="#3A3436" stroke="${INK2}" stroke-width="5"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${720 + i * 36} ${wy - 498 + Math.abs(i - 6.5) * 2} L${700 + i * 40} ${wy - 420 + Math.abs(i - 6.5) * 3}" stroke="#262224" stroke-width="3"/>`).join('');
  s += `<path d="M640 ${wy - 410} q-30 -6 -40 -36 M1280 ${wy - 410} q30 -6 40 -36" stroke="${INK2}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  // biển cổng (không chữ Hán; vạch trang trí)
  s += `<rect x="900" y="${wy - 236}" width="120" height="50" rx="4" fill="#2F2A26" stroke="#C9A227" stroke-width="4"/><path d="M920 ${wy - 211} h80" stroke="#C9A227" stroke-width="4" stroke-dasharray="10 6"/>`;
  // cờ
  [180, 460, 1460, 1740].forEach(x => { s += `<path d="M${x} ${wy - 258} V${wy - 400}" stroke="${INK2}" stroke-width="6"/><path d="M${x} ${wy - 400} q50 ${R1(14 + 12 * Math.sin(AT_() * 4 + x))} 90 ${R1(-4 + 8 * Math.sin(AT_() * 4.6 + x))} l-10 56 q-40 ${R1(16 + 12 * Math.sin(AT_() * 4 + x + 1))} -80 0Z" fill="${o.flag || '#C08A2E'}" stroke="${INK2}" stroke-width="4"/>`; });
  // đất + đường
  s += `<rect x="0" y="${wy + 30}" width="1920" height="${1080 - wy - 30}" fill="#D3BE94"/><path d="M820 ${wy + 30} L1100 ${wy + 30} L1500 1080 L420 1080Z" fill="#C9B288"/>`;
  for (let i = 0; i < 40; i++) { const x = hrnd(i, 5) * 1920, y = wy + 60 + hrnd(i, 6) * 380; s += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(5 + hrnd(i, 7) * 8)}" ry="${R1(3 + hrnd(i, 8) * 3)}" fill="#A88E66" opacity="0.6"/>`; }
  for (let i = 0; i < 18; i++) { const x = hrnd(i, 9) * 1920, y = wy + 50 + hrnd(i, 10) * 400; if (x > 500 && x < 1420) continue; s += `<path d="M${R1(x)} ${R1(y)} l-8 -22 M${R1(x)} ${R1(y)} l2 -28 M${R1(x)} ${R1(y)} l12 -20" stroke="#7E9A62" stroke-width="4" stroke-linecap="round"/>`; }
  return s;
}
// ---------- ĐỒNG TRỐNG (2 phe dàn quân) ----------
function setField() {
  let s = `<rect width="1920" height="1080" fill="#E6E1D0"/>` + cloudsDrift([[400, 150, 1.0, '#F1EBDC'], [1500, 120, 1.2, '#F1EBDC'], [950, 220, 0.6, '#F1EBDC']]) + birds(260, 3) + hills(560, '#BFC2A6', '#AEB394');
  s += `<rect x="0" y="600" width="1920" height="480" fill="#C9C29A"/>`;
  for (let i = 0; i < 60; i++) { const x = hrnd(i, 11) * 1920, y = 620 + hrnd(i, 12) * 440; s += `<path d="M${R1(x)} ${R1(y)} l-7 -18 M${R1(x)} ${R1(y)} l1 -24 M${R1(x)} ${R1(y)} l10 -16" stroke="#8E9A62" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>`; }
  return s;
}
// ---------- PHÒNG SÁCH của Hóng (giá thẻ tre, bàn, nghiên mực) ----------
function setScrollRoom() {
  let s = `<rect width="1920" height="1080" fill="#EADBB9"/><rect width="1920" height="1080" fill="${pat('damask', '#E0CDA6', null, 1.1)}" opacity="0.8"/>`;
  // kệ
  const kx = 1180, ky = 150, kw = 620, kh = 640;
  s += `<rect x="${kx}" y="${ky}" width="${kw}" height="${kh}" fill="#7A5234" stroke="${INK2}" stroke-width="6"/>`;
  for (let r = 0; r < 4; r++) {
    const y = ky + 20 + r * 155; s += `<rect x="${kx + 18}" y="${y}" width="${kw - 36}" height="130" fill="#5A3A24"/>`;
    for (let i = 0; i < 7; i++) { const x = kx + 50 + i * 80 + (r % 2) * 20; if (x > kx + kw - 60) continue; const c = ['#D9B97A', '#CBA866', '#E2C68E'][(i + r) % 3];
      s += `<g transform="translate(${x} ${y + 128})"><rect x="-30" y="-58" width="60" height="58" rx="10" fill="${c}" stroke="${INK2}" stroke-width="3.5"/>${[-18, -6, 6, 18].map(dx => `<path d="M${dx} -56 V-2" stroke="#9C7A44" stroke-width="2"/>`).join('')}<path d="M-30 -30 H30" stroke="#8E2A22" stroke-width="4"/></g>`; }
    s += `<rect x="${kx}" y="${y + 128}" width="${kw}" height="14" fill="#8E6640" stroke="${INK2}" stroke-width="3"/>`;
  }
  // sàn + bàn
  s += `<rect x="0" y="860" width="1920" height="220" fill="#B98B5E"/><path d="M0 860 H1920" stroke="${INK2}" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${i * 170} 860 L${i * 170 - 120} 1080" stroke="#8E6640" stroke-width="3"/>`;
  s += `<rect x="1120" y="800" width="560" height="40" rx="8" fill="#6B3E26" stroke="${INK2}" stroke-width="5"/><path d="M1160 840 V960 M1640 840 V960" stroke="${INK2}" stroke-width="20"/><path d="M1160 840 V960 M1640 840 V960" stroke="#5A321E" stroke-width="12"/>`;
  s += `<rect x="1200" y="770" width="110" height="30" rx="6" fill="#2F2A2C" stroke="${INK2}" stroke-width="4"/><path d="M1380 800 L1470 700" stroke="#8E6640" stroke-width="10" stroke-linecap="round"/><path d="M1465 706 l14 -16" stroke="${INK2}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<rect x="1500" y="760" width="140" height="40" rx="8" fill="#E2C68E" stroke="${INK2}" stroke-width="4"/>` + motes(18, 200, 150, 1500, 650, '#FFF8E2', 0.5, 5);
  return s;
}

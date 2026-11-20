// ===== NỀN NHIỀU LỚP tập xep-hang-cao-thu-tam-quoc. Mỗi nền trả {far, mid, near}: far = trời + núi + công trình; mid = mặt đất; near = lớp gần máy quay.
// ---- HỔ LAO QUAN lúc hoàng hôn: trời chuyển màu, mặt trời thấp sau núi, 3 lớp núi mờ dần, tường ải chắn giữa hai vách đá, lầu cổng 2 tầng mái, cờ trên thành.
function tqbgHoLao(t) {
  const id = 'hl' + (TQ_ID++); let far = '', mid = '', near = '';
  far += `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2A5A"/><stop offset="0.38" stop-color="#C85A4A"/><stop offset="0.62" stop-color="#F6A85A"/><stop offset="0.8" stop-color="#FFE0A0"/></linearGradient>`
    + `<radialGradient id="${id}u"><stop offset="0" stop-color="#FFF6D0"/><stop offset="0.25" stop-color="#FFD98A" stop-opacity="0.9"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>`
    + `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C89A5A"/><stop offset="1" stop-color="#7A5230"/></linearGradient></defs>`;
  far += `<rect width="1920" height="1080" fill="url(#${id}s)"/>`;
  // mây dài nhuộm nắng
  for (let i = 0; i < 7; i++) { const x = ((hrnd(i, 1) * 2400 + t * (6 + i * 2)) % 2400) - 240, y = 90 + hrnd(i, 2) * 300, w = 260 + hrnd(i, 3) * 360;
    far += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(16 + hrnd(i, 4) * 18)}" fill="${i % 2 ? '#FFB88A' : '#8A4A6A'}" opacity="${f1(0.35 + hrnd(i, 5) * 0.3)}"/>`; }
  far += `<circle cx="1330" cy="400" r="620" fill="url(#${id}u)"/><circle cx="1330" cy="400" r="104" fill="#FFF4C8"/><circle cx="1330" cy="400" r="${f1(128 + 6 * Math.sin(t * 1.3))}" fill="none" stroke="#FFF0C0" stroke-width="10" opacity="0.35"/>`;
  for (let i = 0; i < 5; i++) { const x = ((hrnd(i, 31) * 2600 + t * (9 + i * 3)) % 2600) - 340, y = 150 + hrnd(i, 32) * 230, w = 200 + hrnd(i, 33) * 220;
    far += `<g transform="translate(${f1(x)} ${f1(y)})"><ellipse cx="0" cy="0" rx="${f1(w)}" ry="34" fill="#7A3E62" opacity="0.8"/><ellipse cx="${f1(-w * 0.3)}" cy="-22" rx="${f1(w * 0.5)}" ry="30" fill="#8A4A6A" opacity="0.8"/><ellipse cx="${f1(w * 0.25)}" cy="-16" rx="${f1(w * 0.45)}" ry="26" fill="#8A4A6A" opacity="0.8"/><path d="M${f1(-w * 0.9)} 14 Q0 44 ${f1(w * 0.9)} 14" stroke="#FFD08A" stroke-width="9" fill="none" opacity="0.85" stroke-linecap="round"/></g>`; }
  for (let i = 0; i < 9; i++) { const bx = ((t * 38 + i * 70) % 2300) - 180, by = 250 + (i % 3) * 34 + Math.sin(t * 0.8 + i) * 16 + i * 6, fl = Math.sin(t * 9 + i * 1.7) * 9;
    far += `<path d="M${f1(bx - 16)} ${f1(by - fl)} Q${f1(bx - 6)} ${f1(by - 6)} ${f1(bx)} ${f1(by)} Q${f1(bx + 6)} ${f1(by - 6)} ${f1(bx + 16)} ${f1(by - fl)}" stroke="#3A1E34" stroke-width="4.5" fill="none" stroke-linecap="round"/>`; }
  // 3 lớp núi (xa → gần: nhạt → đậm)
  const ridge = (y0, amp, seed, c, op = 1) => { let d = `M0 1080 L0 ${y0}`; for (let x = 0; x <= 1920; x += 60) d += ` L${x} ${f1(y0 - amp * (0.5 + 0.5 * Math.sin(x * 0.004 * (1 + seed * 0.3) + seed * 3)) - amp * 0.5 * hrnd(x, seed))}`; return `<path d="${d} L1920 1080Z" fill="${c}" opacity="${op}"/>`; };
  far += ridge(600, 170, 1, '#B8707A', 0.75) + ridge(650, 150, 2, '#8E5468') + ridge(700, 110, 3, '#6A3E54');
  // hai vách đá kẹp ải
  const cliff = (sx) => `<g transform="translate(${sx < 0 ? 0 : 1920} 0) scale(${sx < 0 ? 1 : -1} 1)"><path d="M0 1080 L0 250 Q70 200 150 260 Q210 300 250 420 Q330 470 380 600 Q430 690 470 790 L470 1080Z" fill="#4E2E40" stroke="#2A1420" stroke-width="5"/><path d="M40 320 Q120 330 170 430 M110 520 Q230 540 300 650 M60 700 Q200 720 330 820" stroke="#3A2030" stroke-width="7" fill="none" opacity="0.8"/><path d="M150 262 Q200 300 244 420" stroke="#C87A6A" stroke-width="8" fill="none" opacity="0.5"/></g>`;
  far += cliff(-1) + cliff(1);
  // tường ải: thân tường + gạch + răng thành
  const wy = 560, wh = 250;
  far += `<path d="M330 ${wy} H1590 V${wy + wh} H330Z" fill="#7A4A4A" stroke="#2A1420" stroke-width="6"/>`;
  for (let r = 0; r < 7; r++) for (let i = 0; i < 22; i++) { const x = 336 + i * 58 + (r % 2) * 29, y = wy + 14 + r * 34; if (x > 1570) continue; if (hrnd(i, r, 3) < 0.45) far += `<rect x="${x}" y="${y}" width="50" height="26" rx="3" fill="${hrnd(i, r, 4) < 0.5 ? '#6A3E42' : '#8A565A'}" opacity="0.55"/>`; }
  for (let i = 0; i < 26; i++) far += `<rect x="${336 + i * 48}" y="${wy - 30}" width="30" height="34" fill="#7A4A4A" stroke="#2A1420" stroke-width="4"/>`;
  far += `<path d="M330 ${wy} H1590" stroke="#C88A6A" stroke-width="6" opacity="0.6"/>`;
  // cổng vòm + cánh cửa gỗ đinh tán
  far += `<path d="M830 ${wy + wh} V${wy + 110} Q960 ${wy + 10} 1090 ${wy + 110} V${wy + wh}Z" fill="#2A1420"/><path d="M846 ${wy + wh} V${wy + 118} Q960 ${wy + 34} 1074 ${wy + 118} V${wy + wh}Z" fill="#5A2E22" stroke="#2A1420" stroke-width="5"/><path d="M960 ${wy + 60} V${wy + wh}" stroke="#2A1420" stroke-width="6"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) far += `<circle cx="${880 + j * 54}" cy="${wy + 140 + i * 28}" r="5" fill="#C9A24A"/>`;
  // lầu cổng hai tầng mái cong
  const roof = (y, w) => `<path d="M${960 - w} ${y} Q${960 - w * 0.6} ${y - 14} 960 ${y - 20} Q${960 + w * 0.6} ${y - 14} ${960 + w} ${y} Q${960 + w * 0.86} ${y - 34} ${960 + w * 0.7} ${y - 58} H${960 - w * 0.7} Q${960 - w * 0.86} ${y - 34} ${960 - w} ${y}Z" fill="#3A2434" stroke="#2A1420" stroke-width="5" stroke-linejoin="round"/><path d="M${960 - w * 0.7} ${y - 58} H${960 + w * 0.7}" stroke="#C9A24A" stroke-width="6"/>`;
  far += `<rect x="770" y="${wy - 150}" width="380" height="124" fill="#8A3A2E" stroke="#2A1420" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${790 + i * 74}" y="${wy - 132}" width="44" height="88" fill="#3A1A18" stroke="#2A1420" stroke-width="3"/>`).join('') + roof(wy - 146, 250)
    + `<rect x="840" y="${wy - 280}" width="240" height="84" fill="#8A3A2E" stroke="#2A1420" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="${862 + i * 74}" y="${wy - 264}" width="44" height="56" fill="#3A1A18" stroke="#2A1420" stroke-width="3"/>`).join('') + roof(wy - 276, 190);
  // biển tên ải (tiếng Việt)
  far += `<rect x="868" y="${wy - 22}" width="184" height="46" rx="6" fill="#20140A" stroke="#C9A24A" stroke-width="4"/>` + kText('HỔ LAO QUAN', 960, wy + 12, 26, { c: '#E2C25A' });
  // cờ trên thành
  for (const [x, c] of [[420, '#2A2A30'], [560, '#8E2430'], [700, '#2A2A30'], [1220, '#8E2430'], [1360, '#2A2A30'], [1500, '#8E2430']]) far += tqBanner(x, wy - 130, 190, c, t + x * 0.01, x < 960 ? 1 : -1);
  // lính canh nhỏ trên thành
  for (let i = 0; i < 9; i++) { const x = 380 + i * 140 + (i > 3 ? 60 : 0); if (x > 760 && x < 1160) continue; far += tqSoldier(x, wy - 2, 0.26, '#4A3A4A', { dir: x < 960 ? 1 : -1, skin: '#C89A84', spear: i % 2 === 0 }); }
  // đuốc trên mặt thành: quầng lửa nhấp nháy
  for (let i = 0; i < 8; i++) { const x = 396 + i * 162 + (i > 3 ? 20 : 0); if (x > 780 && x < 1150) continue; const fl = 0.75 + 0.25 * Math.sin(t * 11 + i * 2.3) * Math.sin(t * 7 + i);
    far += `<circle cx="${x}" cy="${wy - 52}" r="${f1(46 * fl)}" fill="#FFB040" opacity="0.28"/><path d="M${x} ${wy - 30} v-18" stroke="#2A1420" stroke-width="6"/><path d="M${x - 9} ${wy - 46} q9 ${f1(-30 * fl)} 9 ${f1(-34 * fl)} q2 14 9 ${f1(34 * fl)}Z" fill="#FFD25A" stroke="#E86A2A" stroke-width="3"/>`; }
  // hai đuốc lớn hai bên cổng + ánh hắt lên vòm
  for (const x of [800, 1120]) { const fl = 0.8 + 0.2 * Math.sin(t * 10 + x); far += `<circle cx="${x}" cy="${wy + 96}" r="${f1(84 * fl)}" fill="#FFA030" opacity="0.26"/><path d="M${x} ${wy + 150} v-46" stroke="#2A1420" stroke-width="8"/><path d="M${x - 13} ${wy + 106} q13 ${f1(-44 * fl)} 13 ${f1(-50 * fl)} q3 20 13 ${f1(50 * fl)}Z" fill="#FFD25A" stroke="#E86A2A" stroke-width="3.5"/>`; }
  // khói bếp trại bốc lên sau hai cánh quân
  for (const [sx, ph] of [[150, 0], [300, 2], [1650, 1], [1800, 3]]) for (let i = 0; i < 7; i++) { const u = ((t * 0.09 + i / 7 + ph * 0.13) % 1), x = sx + Math.sin(u * 5 + ph) * 34 + u * 60, y = 800 - u * 420, r = 18 + u * 60;
    far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#F6C89A" opacity="${f1(0.22 * (1 - u))}"/>`; }
  // tia nắng xiên phủ lên tường và mặt đất (cộng sáng)
  far += `<g style="mix-blend-mode:screen">${tqRays(t, 1330, 400, { n: 9, a0: 70, step: 12, op: 0.16, c: '#FFC98A' })}</g>`;
  // sương bụi chân tường
  far += `<rect x="0" y="${wy + wh - 90}" width="1920" height="160" fill="#FFC88A" opacity="0.30"/>`;
  // mặt đất: nền dốc sáng về phía mặt trời + vệt bánh xe/vó ngựa theo phối cảnh + đá
  mid += `<path d="M0 ${wy + wh - 8} H1920 V1080 H0Z" fill="url(#${id}g)"/>`;
  for (let i = 0; i < 16; i++) { const x0 = 960 + (i - 7.5) * 40, x1 = 960 + (i - 7.5) * 330; mid += `<path d="M${f1(x0)} ${wy + wh} L${f1(x1)} 1080" stroke="#8A6238" stroke-width="${3 + (i % 3)}" opacity="0.28"/>`; }
  for (let i = 0; i < 26; i++) { const y = 830 + hrnd(i, 11) * 240, x = hrnd(i, 12) * 1920, k = (y - 780) / 300; mid += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(16 + 40 * k * hrnd(i, 13))}" ry="${f1(5 + 9 * k)}" fill="${hrnd(i, 14) < 0.5 ? '#6A4628' : '#D8AE72'}" opacity="0.5"/>`; }
  mid += `<defs><radialGradient id="${id}p" cx="0.62" cy="0.1" r="0.9"><stop offset="0" stop-color="#FFE2A0" stop-opacity="0.75"/><stop offset="0.5" stop-color="#F0B060" stop-opacity="0.25"/><stop offset="1" stop-color="#5A2E20" stop-opacity="0.55"/></radialGradient></defs><rect x="0" y="${wy + wh - 8}" width="1920" height="${1080 - wy - wh + 8}" fill="url(#${id}p)"/>`;
  mid += `<path d="M1010 ${wy + wh} L1560 1080 L760 1080 L930 ${wy + wh}Z" fill="#FFE0A0" opacity="0.22"/>`;
  for (let i = 0; i < 14; i++) { const x = hrnd(i, 51) * 1920, y = 850 + hrnd(i, 52) * 210, k = 0.6 + (y - 820) / 260; mid += `<path d="M${f1(x)} ${f1(y)} l${f1(30 * k)} ${f1(6 * k)} l${f1(18 * k)} ${f1(-5 * k)} l${f1(26 * k)} ${f1(9 * k)} M${f1(x + 48 * k)} ${f1(y + 1)} l${f1(8 * k)} ${f1(14 * k)}" stroke="#5A3A20" stroke-width="${f1(2.5 * k)}" fill="none" opacity="0.5" stroke-linecap="round"/>`; }
  for (let i = 0; i < 12; i++) { const x = hrnd(i, 61) * 1920, y = 860 + hrnd(i, 62) * 200, k = 0.6 + (y - 820) / 240, r = 12 + hrnd(i, 63) * 16;
    mid += `<ellipse cx="${f1(x - r * k)}" cy="${f1(y + 5 * k)}" rx="${f1(r * 1.8 * k)}" ry="${f1(r * 0.35 * k)}" fill="#3A2014" opacity="0.35"/><path d="M${f1(x - r * k)} ${f1(y)} Q${f1(x - r * 0.6 * k)} ${f1(y - r * k)} ${f1(x)} ${f1(y - r * 0.9 * k)} Q${f1(x + r * k)} ${f1(y - r * 0.6 * k)} ${f1(x + r * k)} ${f1(y)}Z" fill="#8A6648" stroke="#2A1420" stroke-width="3.5"/><path d="M${f1(x + r * 0.1 * k)} ${f1(y - r * 0.75 * k)} Q${f1(x + r * 0.8 * k)} ${f1(y - r * 0.5 * k)} ${f1(x + r * 0.85 * k)} ${f1(y - 3)}" stroke="#FFD08A" stroke-width="3.5" fill="none" opacity="0.9"/>`; }
  for (let i = 0; i < 9; i++) { const x = ((hrnd(i, 71) * 2500 + t * (26 + i * 5)) % 2500) - 300, y = 850 + hrnd(i, 72) * 150; mid += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(220 + hrnd(i, 73) * 160)}" ry="${f1(16 + hrnd(i, 74) * 12)}" fill="#FFD9A0" opacity="0.16"/>`; }   // vệt nắng rọi qua cổng xuống đất
  // lớp gần: cỏ khô + đá tối hai góc
  for (let i = 0; i < 44; i++) { const x = hrnd(i, 21) * 1920, edge = Math.abs(x - 960) / 960; if (edge < 0.35) continue; const y = 1010 + hrnd(i, 22) * 70, h = 40 + hrnd(i, 23) * 70 * edge, sw = Math.sin(t * 1.4 + i) * 6;
    near += `<path d="M${f1(x)} ${f1(y)} q${f1(-6 + sw)} ${f1(-h * 0.6)} ${f1(-10 + sw * 2)} ${f1(-h)} M${f1(x + 8)} ${f1(y)} q${f1(4 + sw)} ${f1(-h * 0.7)} ${f1(10 + sw * 2)} ${f1(-h * 0.9)}" stroke="#3A2418" stroke-width="5" fill="none" stroke-linecap="round"/>`; }
  near += `<path d="M-20 1080 Q40 980 150 1000 Q230 1010 270 1080Z" fill="#2E1C1C" stroke="#160C0C" stroke-width="5"/><path d="M1940 1080 Q1880 970 1760 996 Q1690 1010 1650 1080Z" fill="#2E1C1C" stroke="#160C0C" stroke-width="5"/>`;
  return { far, mid, near };
}

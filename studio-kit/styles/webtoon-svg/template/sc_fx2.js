// sc_fx2.js — CHIÊU THỨC MỚI CỦA PHẦN 2 (C4 đã duyệt 2026-10-19). Các chiêu chung (fmVortex, fmPull, fmFly, fmNameCall, fmChant, fmHeadRing) đã dồn vào webtoon-code-v1/fx_moves.js; file này chỉ giữ đồ riêng của P2.
// Phụ thuộc: glow.js (bloom, GL, glowSparks, flareBurst, shockRing, glowDot), fx.js, chibi.js (INK2, f1, clamp, lerp, EZ, prand, mixC), sc_animals.js (pr_*).
//   fmVortex    xoáy hút: vệt xoắn ốc cuộn vào tâm (hồ lô, bình, tay áo, vòng Kim Cương Trác)
//   fmPull      vật / người bị hút: trả toạ độ + cỡ + góc xoay theo đường cong, thu nhỏ dần
//   fmNameCall  sóng tiếng gọi tên lan từ miệng ra (luật "ai đáp thì bị hút")
//   fmChant     dòng bùa chú uốn lượn từ người niệm tới đầu người bị vòng
//   fmHeadRing  vòng kim cô siết đầu: vòng vàng co nhịp, sóng vàng lan, vạch đau toé ra
//   fmFly       vật bay theo đường cong (vòng thần ném đi, thu về)
//   fx2Staff / fx2Icon  gậy Như Ý rời tay; 6 binh khí nhỏ (giáo, vòng, kiếm, bánh xe, thòng lọng, rìu) của Na Tra

// gậy Như Ý rời tay (vẽ độc lập): tâm (x,y), góc rot (độ), cỡ s
function fx2Staff(x, y, rot, s = 1) {
  const L = 240, G = '#E0B048', GS = '#B08428';
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s)})"><rect x="${-L}" y="-11" width="${2 * L}" height="22" fill="#3A3438" stroke="${INK2}" stroke-width="4"/><rect x="${-L - 6}" y="-15" width="60" height="30" fill="${G}" stroke="${INK2}" stroke-width="4"/><rect x="${L - 54}" y="-15" width="60" height="30" fill="${G}" stroke="${INK2}" stroke-width="4"/><path d="M${-L + 20} -15 V15 M${L - 20} -15 V15" stroke="${GS}" stroke-width="3"/></g>`;
}
function fx2Icon(i, x, y, rot, s = 1) {
  const K = (b) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s)})">${b}</g>`, st = `stroke="${INK2}" stroke-width="4"`;
  switch (i % 6) {
    case 0: return K(`<rect x="-110" y="-6" width="190" height="12" fill="#8A6A44" ${st}/><path d="M80 -20 L150 0 L80 20Z" fill="#D8DEE6" ${st}/>`);                                  // giáo
    case 1: return K(`<circle r="48" fill="none" stroke="#D8B848" stroke-width="16"/><circle r="48" fill="none" ${st} opacity="0.5"/>`);                                              // vòng Càn Khôn
    case 2: return K(`<rect x="-30" y="-7" width="140" height="14" fill="#E4EAF2" ${st}/><rect x="-44" y="-18" width="16" height="36" fill="#B8883A" ${st}/><rect x="-100" y="-6" width="58" height="12" fill="#6A4A2A" ${st}/>`); // kiếm
    case 3: return K(`<circle r="52" fill="#F2D28A" ${st}/><circle r="16" fill="#C8A04A" ${st}/><path d="M0 -52 V52 M-52 0 H52 M-37 -37 L37 37 M-37 37 L37 -37" stroke="${INK2}" stroke-width="4"/>`); // bánh xe
    case 4: return K(`<path d="M-90 20 Q-40 -60 20 -20 Q70 20 40 50 Q10 70 -10 30" fill="none" stroke="#C8584A" stroke-width="12" stroke-linecap="round"/><path d="M-90 20 Q-40 -60 20 -20 Q70 20 40 50 Q10 70 -10 30" fill="none" ${st} opacity="0.4"/>`); // thòng lọng
    default: return K(`<rect x="-100" y="-6" width="170" height="12" fill="#8A6A44" ${st}/><path d="M60 -50 Q130 -40 120 0 Q130 40 60 50Z" fill="#C8CCD2" ${st}/>`);              // rìu
  }
}

// ---------------------------------------------------------------- CÂN ĐẨU VÂN (giống P1: s_c2_72) — đám mây xoắn trắng dưới người, Ngộ Không lộn nhào, vệt kim vân + vệt gió
// P(u)→[x,y] quỹ đạo (y = chân nhân vật), id nhân vật, o: {flip, ex, sc, spin (vòng/giây), c}. Vẽ từ t0, chạy dur giây.
function c2Cdv(t, t0, dur, P, id, o = {}) {
  const d = t - t0; if (d < 0 || d > dur + 0.1) return '';
  const k = Math.min(1, d / dur), [px, py] = P(k), sc = o.sc ?? 0.46, dir = o.flip ? -1 : 1;
  const cy = py + 36;   // mây ngay dưới thân
  let s = fmCloudDash(t, t0, dur, P, { c: o.c || '#FFD36A' });
  s += tdPuffs([[px - dir * 96, cy + 10, 34], [px - dir * 150, cy + 24, 24]], '#FFFFFF', 3, {});   // đuôi mây
  s += tdPuffs([[px - 70, cy + 16, 46], [px + 12, cy + 4, 58], [px + 90, cy + 18, 42]], '#FFFFFF', 4, { curl: true });
  s += tkChar(id, { x: px, ground: py, scale: sc, flip: !!o.flip, ex: o.ex || 'yell', arm: -150, hand: 'open', spin: (d * 360 * (o.spin ?? 1.1)) % 360 * dir, shadow: false }, t);
  s += tdPuffs([[px - 62, cy + 30, 34], [px + 18, cy + 36, 40], [px + 84, cy + 30, 30]], '#FFFFFF', 3.5, { curl: true });
  s += speedLines(t, t0, px - dir * 200, py - 120, { n: 10, c: '#FFFFFF' });
  return s;
}

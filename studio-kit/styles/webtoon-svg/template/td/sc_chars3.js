// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// NHÂN VẬT MỚI — TÂY DU KÝ PHẦN 3 (2026-11-01, C3). Nạp SAU chars_tdk2.js + sc_extra.js (P2).
// Cùng kiểu chibi đã duyệt C2: đầu to (headK 1.38; trẻ con 1.55), má hồng, tô phẳng 2 tông + viền mực.
// Cờ mới (đầu): sixEars (Lục Nhĩ Di Hầu: sáu tai khỉ).
const _c3Head0 = chHead;
chHead = function (c, ex, T, o = {}) {
  let [hb, hf] = _c3Head0(c, ex, T, o);
  if (c && c.sixEars) {   // thêm hai cặp tai khỉ phía sau đầu → mỗi bên ba tai
    const F = c.hair, FS = c.hairS; let e = '';
    for (const [x, y, r] of [[-196, -140, 38], [-256, -30, 42], [-200, 82, 38]]) e += `<circle cx="${x}" cy="${y}" r="${r}" fill="${F}" stroke="${CH_INK}" stroke-width="5"/><circle cx="${x + 5}" cy="${y}" r="${r * 0.55}" fill="${c.skinS}"/>`;
    for (const [x, y, r] of [[224, -140, 38], [284, -30, 42], [228, 82, 38]]) e += `<circle cx="${x}" cy="${y}" r="${r}" fill="${F}" stroke="${CH_INK}" stroke-width="5"/><circle cx="${x - 5}" cy="${y}" r="${r * 0.55}" fill="${c.skinS}"/>`;
    hb = e + hb;
  }
  return [hb, hf];
};
const c3Kid = (o) => Object.assign({ male: 1, headK: 1.7, kidEyes: '#3A2418', cheeks: '#F4A08E', bulk: 0.72, iris: ['#2A1E16', '#7A5A3A'], skin: '#F6DCC0', skinS: '#E0BC9A', trim: '#E8DCC0', inner: '#F8F0DC' }, o);
const c3Bad = (name, band, robe, robeS, x = {}) => Object.assign({ male: 1, name, hair: '#1E1A18', hairS: '#0E0C0A', messy: 1, headband: band, stubble: 1, rags: 1, brow: '#141010', iris: ['#2A1E16', '#6A4A30'], skin: '#D6A47E', skinS: '#B4805C', robe, robeS, trim: '#C8B88A', sash: '#3A2E22', inner: '#E0D4B8', jaw: 'square', bulk: 1.1, headK: 1.38 }, x);
const c3Fem = (o) => Object.assign({ fem: 1, hair: '#1E1A1E', hairS: '#0E0C10', iris: ['#2A1E1A', '#8A6A5A'], skin: '#F6DCC4', skinS: '#DCBCA0', headK: 1.38, cheeks: '#F4A08E' }, o);

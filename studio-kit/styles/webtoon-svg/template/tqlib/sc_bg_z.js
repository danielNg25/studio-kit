// ===== LỚP SỐNG ĐỘNG CHO NỀN (2026-10-17, luật "cảnh phải sống động như mây, gió, tuyết")
// Nạp CUỐI CÙNG (sc_bg_z.js sau sc_bg_a..e.js). Bọc lại bg_<tên>(t, o): trả nền gốc + lớp chuyển động nhẹ phủ lên.
// Tắt: o.amb = 0. Chuyển động nền liên tục (mây trôi, gió, hạt bay) — KHÔNG phải chiêu/hiệu ứng lớn nên không vướng luật không lặp.
// Mọi hạt đều là hàm của T (mờ dần ở hai đầu vòng nên không bị giật).

const _zf = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const _zalpha = (u) => Math.max(0, Math.min(1, u * 7, (1 - u) * 7));

// mây trôi ngang (vẽ phẳng viền mực như mây nền)
function tqZ_clouds(T, o = {}) {
  const n = o.n || 3, y0 = o.y0 ?? 40, y1 = o.y1 ?? 220, sp = o.sp ?? 0.02, c = o.c || '#FFFFFF', sh = o.sh || dk(c, 0.12), op = o.op ?? 0.85;
  let s = '';
  for (let i = 0; i < n; i++) {
    const sc = (o.sc || 1) * (0.7 + 0.7 * hrnd(i, 31)), w = 150 * sc, v = sp * (0.7 + 0.6 * hrnd(i, 32));
    const u = (i / n + (o.ph || 0) + T * v) % 1, x = -w + u * (1920 + 2 * w), y = y0 + (y1 - y0) * ((i + 0.5 * hrnd(i, 33)) / n);
    s += `<g transform="translate(${_zf(x)} ${_zf(y)}) scale(${_zf(sc, 2)})" opacity="${op}"><path d="M-120 22 Q-146 -6 -104 -14 Q-100 -52 -56 -44 Q-30 -82 14 -58 Q52 -76 84 -40 Q130 -42 130 2 Q130 22 108 22Z" fill="${c}" stroke="${INK2}" stroke-width="${o.sw ?? 3.5}" stroke-linejoin="round"/><path d="M-96 8 Q-60 -2 -20 6 M24 10 Q60 0 100 8" stroke="${sh}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/></g>`;
  }
  return s;
}
// lá/trấu bay theo gió
function tqZ_leaves(T, o = {}) {
  const n = o.n || 10, cols = o.cols || ['#C8872E', '#A8522A', '#D9A93A'], y0 = o.y0 ?? 200, y1 = o.y1 ?? 900, sp = o.sp ?? 0.07, dir = o.dir ?? 1;
  let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i / n + T * sp * (0.7 + 0.6 * hrnd(i, 41))) % 1, x = dir > 0 ? -60 + u * 2040 : 1980 - u * 2040;
    const y = y0 + (y1 - y0) * hrnd(i, 42) + Math.sin(u * 14 + i * 2) * 50 + u * (o.fall ?? 120), r = (u * 900 + i * 40) * dir, sz = (o.size ?? 1) * (0.8 + 0.5 * hrnd(i, 43));
    s += `<g transform="translate(${_zf(x)} ${_zf(y)}) rotate(${_zf(r)}) scale(${_zf(sz, 2)})" opacity="${_zf(_zalpha(u), 2)}"><path d="M-11 0 Q0 -8 11 0 Q0 8 -11 0Z" fill="${cols[i % cols.length]}" stroke="${INK2}" stroke-width="2"/><path d="M-9 0 H9" stroke="${INK2}" stroke-width="1.4" opacity="0.6"/></g>`;
  }
  return s;
}
// vệt gió (nét mảnh lướt ngang)
function tqZ_wind(T, o = {}) {
  const n = o.n || 6, y0 = o.y0 ?? 300, y1 = o.y1 ?? 900, sp = o.sp ?? 0.09, c = o.c || '#FFFFFF', op = o.op ?? 0.28; let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i / n + T * sp * (0.7 + 0.6 * hrnd(i, 71))) % 1, x = -300 + u * 2300, y = y0 + (y1 - y0) * hrnd(i, 72), L = 140 + 160 * hrnd(i, 73);
    s += `<path d="M${_zf(x)} ${_zf(y)} q${_zf(L * 0.3)} -14 ${_zf(L * 0.55)} -2 t${_zf(L * 0.45)} -4" stroke="${c}" stroke-width="${o.w ?? 3}" fill="none" stroke-linecap="round" opacity="${_zf(op * _zalpha(u), 2)}"/>`;
  }
  return s;
}
// hạt bụi/phấn trôi lơ lửng trong một vùng
function tqZ_motes(T, o = {}) {
  const n = o.n || 24, [x0, y0, x1, y1] = o.box || [0, 0, 1920, 1080], c = o.c || '#FFF3C8', op = o.op ?? 0.7, r0 = o.r ?? 3; let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i * 0.137 + T * (o.sp ?? 0.05) * (0.6 + 0.8 * hrnd(i, 51))) % 1, ax = x0 + (x1 - x0) * hrnd(i, 52), ay = y0 + (y1 - y0) * hrnd(i, 53);
    const x = ax + Math.sin(T * 0.6 + i * 1.7) * (o.sw ?? 24) + u * (o.dx ?? 0), y = ay - u * (o.rise ?? 80), a = Math.sin(Math.PI * u) * op * (0.6 + 0.4 * Math.sin(T * 2 + i));
    s += `<circle cx="${_zf(x)}" cy="${_zf(y)}" r="${_zf(r0 * (0.6 + 0.8 * hrnd(i, 54)), 1)}" fill="${c}" opacity="${_zf(Math.max(0, a), 2)}"/>`;
  }
  return s;
}
// cánh hoa / tro tàn rơi như tuyết
function tqZ_snow(T, o = {}) {
  const n = o.n || 24, c = o.c || '#FFFFFF', sp = o.sp ?? 0.04, ink = o.ink ?? 1.6; let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i / n + T * sp * (0.7 + 0.6 * hrnd(i, 61))) % 1, x = 1920 * hrnd(i, 62) + Math.sin(u * 9 + i) * (o.sw ?? 50) + u * (o.dx ?? 80), y = -30 + u * 1140, sz = (o.sz ?? 1) * (0.7 + 0.7 * hrnd(i, 63)), r = u * 360 * (hrnd(i, 64) > 0.5 ? 1 : -1);
    s += `<g transform="translate(${_zf(x)} ${_zf(y)}) rotate(${_zf(r)}) scale(${_zf(sz, 2)})" opacity="${_zf(_zalpha(u) * (o.op ?? 0.9), 2)}"><ellipse cx="0" cy="0" rx="8" ry="4.6" fill="${c}"${ink ? ` stroke="${INK2}" stroke-width="${ink}"` : ''}/></g>`;
  }
  return s;
}
// tàn lửa bay lên từ một vùng
function tqZ_embers(T, o = {}) {
  const n = o.n || 8, [x0, y0, x1, y1] = o.box || [0, 900, 1920, 1040], rise = o.rise ?? 320, sp = o.sp ?? 0.16; let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i / n + T * sp * (0.7 + 0.6 * hrnd(i, 81))) % 1, x = x0 + (x1 - x0) * hrnd(i, 82) + Math.sin(u * 8 + i) * 22 + u * 30, y = y0 + (y1 - y0) * hrnd(i, 83) - u * rise;
    s += `<circle cx="${_zf(x)}" cy="${_zf(y)}" r="${_zf((o.r ?? 3) * (1 - 0.5 * u) * (0.7 + 0.6 * hrnd(i, 84)), 1)}" fill="${hrnd(i, 85) > 0.5 ? '#FFB43A' : '#FF7A2A'}" opacity="${_zf(Math.sin(Math.PI * u) * (o.op ?? 0.9), 2)}"/>`;
  }
  return s;
}
// chim bay ngang (cánh vỗ)
function tqZ_birds(T, o = {}) {
  const n = o.n || 3, y0 = o.y0 ?? 120, y1 = o.y1 ?? 260, sp = o.sp ?? 0.03, c = o.c || INK2; let s = '';
  for (let i = 0; i < n; i++) {
    const u = (i / n + T * sp * (0.8 + 0.4 * hrnd(i, 91))) % 1, x = -60 + u * 2040, y = y0 + (y1 - y0) * hrnd(i, 92) + Math.sin(u * 10 + i) * 18, f = Math.sin(T * 7 + i * 2);
    s += `<path d="M${_zf(x - 16)} ${_zf(y)} Q${_zf(x - 8)} ${_zf(y - 10 * f)} ${_zf(x)} ${_zf(y)} Q${_zf(x + 8)} ${_zf(y - 10 * f)} ${_zf(x + 16)} ${_zf(y)}" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${_zf(_zalpha(u), 2)}"/>`;
  }
  return s;
}
// lấp lánh mặt nước
function tqZ_glints(T, o = {}) {
  const n = o.n || 16, [x0, y0, x1, y1] = o.box || [400, 500, 1700, 700]; let s = '';
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, Math.sin(T * (1.6 + hrnd(i, 95)) + i * 2.1)) ** 3, x = x0 + (x1 - x0) * hrnd(i, 96), y = y0 + (y1 - y0) * hrnd(i, 97), k = 5 + 6 * hrnd(i, 98);
    s += `<path d="M${_zf(x - k)} ${_zf(y)} H${_zf(x + k)} M${_zf(x)} ${_zf(y - k * 0.7)} V${_zf(y + k * 0.7)}" stroke="${o.c || '#FFF6D8'}" stroke-width="2.4" stroke-linecap="round" opacity="${_zf(a * 0.9, 2)}"/>`;
  }
  return s;
}
// quầng sáng đèn/lửa nhấp nháy
function tqZ_glow(T, x, y, r, c = '#FFC866', op = 0.22, k = 0) {
  const f = 1 + 0.06 * Math.sin(T * 7 + k) + 0.04 * Math.sin(T * 13.3 + k * 2.1), id = 'tqzg' + k + '_' + Math.round(x) + '_' + Math.round(y), a = op * (0.85 + 0.15 * Math.sin(T * 9 + k * 1.3));
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${_zf(a * 2.2, 3)}"/><stop offset="0.45" stop-color="${c}" stop-opacity="${_zf(a * 1.1, 3)}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${_zf(r * f)}" fill="url(#${id})"/>`;
}

// ---------- cấu hình theo nền: (T, o) => svg. o.fire (nhai_dinh) làm mờ lớp trời khi cháy.
const TQZ = {
  the: (T) => tqZ_clouds(T, { n: 2, y0: 6, y1: 70, sc: 0.5, c: '#3E5078', sh: '#34456A', op: 0.55, sw: 2.5, sp: 0.03 }) + tqZ_motes(T, { box: [14, 60, 126, 1040], n: 16, c: '#F6D98E', op: 1, rise: 160, r: 5, sp: 0.07 }) + tqZ_motes(T, { box: [1794, 60, 1906, 1040], n: 16, c: '#F6D98E', op: 1, rise: 160, r: 5, sp: 0.07 }) + tqZ_glints(T, { box: [1792, 120, 1908, 960], n: 6 }) + tqZ_glints(T, { box: [12, 120, 128, 960], n: 6 }),
  tua: (T) => tqZ_birds(T, { n: 3, y0: 140, y1: 330, sp: 0.02 }) + tqZ_glints(T, { box: [900, 640, 1700, 760], n: 14, c: '#FFE9B8' }),
  truong_du: (T) => tqZ_glow(T, 262, 708, 170, '#FFC866', 0.22, 1) + tqZ_glow(T, 1668, 708, 170, '#FFC866', 0.22, 2) + tqZ_motes(T, { box: [320, 200, 1600, 900], n: 18, c: '#FFF1C8', op: 0.55, rise: 90 }),
  truong_luong: (T) => tqZ_glow(T, 1374, 596, 150, '#FFC866', 0.25, 3) + tqZ_glow(T, 430, 190, 95, '#FFC866', 0.24, 4) + tqZ_glow(T, 1500, 190, 95, '#FFC866', 0.24, 5) + tqZ_motes(T, { box: [300, 150, 1600, 820], n: 20, c: '#FFE6B0', op: 0.6, rise: 100 }),
  sai_tang: (T) => tqZ_snow(T, { n: 26, sz: 1.1, sp: 0.032, c: '#FFFFFF', sw: 60, dx: 90 }) + tqZ_glow(T, 610, 220, 100, '#FFF3D0', 0.22, 6) + tqZ_glow(T, 1310, 220, 100, '#FFF3D0', 0.22, 7),
  vinh_an: (T) => tqZ_motes(T, { box: [700, 250, 1500, 820], n: 24, c: '#FFE9B0', op: 0.7, rise: 110, r: 3.4 }) + tqZ_glow(T, 920, 190, 115, '#FFC866', 0.28, 8) + tqZ_glow(T, 1170, 340, 190, '#FFB86A', 0.1, 9),
  thuyen_du: (T) => tqZ_clouds(T, { n: 3, y0: 40, y1: 300, c: '#FFD9B8', sh: '#E8A890', op: 0.8, sp: 0.016 }) + tqZ_birds(T, { n: 3, y0: 110, y1: 250 }) + tqZ_glints(T, { box: [480, 468, 1700, 530], n: 20, c: '#FFF1C8' }),
  thuy_trai: (T) => tqZ_clouds(T, { n: 2, y0: 50, y1: 250, c: '#4A5A82', sh: '#3E4C72', op: 0.5, sw: 3 }) + tqZ_embers(T, { box: [585, 700, 615, 760], n: 5, rise: 260 }) + tqZ_embers(T, { box: [1315, 700, 1345, 760], n: 5, rise: 260 }) + tqZ_motes(T, { box: [200, 500, 1700, 1000], n: 14, c: '#FFE0A0', op: 0.4, rise: 70 }),
  dan_gio: (T) => tqZ_clouds(T, { n: 2, y0: 70, y1: 380, c: '#5A4A7A', sh: '#4A3C68', op: 0.42, sw: 3 }) + tqZ_embers(T, { box: [100, 730, 140, 800], n: 6, rise: 300 }) + tqZ_embers(T, { box: [1790, 730, 1830, 800], n: 6, rise: 300 }) + tqZ_leaves(T, { n: 8, y0: 300, y1: 800, cols: ['#8A9A4A', '#6A8A3A'], sp: 0.1, fall: 40 }),
  duong_rung: (T) => tqZ_leaves(T, { n: 12, y0: 150, y1: 800, cols: ['#B8862E', '#8A9A3A', '#C2662E'], sp: 0.06, fall: 100 }) + tqZ_motes(T, { box: [300, 60, 1500, 720], n: 24, c: '#FFE9B0', op: 0.7, rise: 100 }),
  nga_ba: (T) => tqZ_clouds(T, { n: 2, y0: 30, y1: 250, c: '#FFFFFF', op: 0.8, sp: 0.014 }) + tqZ_leaves(T, { n: 10, y0: 300, y1: 900, cols: ['#C8B03A', '#9CB24A', '#D9A93A'], sp: 0.06, fall: 60 }) + tqZ_wind(T, { n: 5, y0: 620, y1: 950, op: 0.24 }),
  trai_thuc: (T) => tqZ_clouds(T, { n: 2, y0: 30, y1: 250, c: '#FFFFFF', op: 0.8, sp: 0.016 }) + tqZ_wind(T, { n: 6, y0: 760, y1: 1040, c: '#F6EBD0', op: 0.3 }) + tqZ_leaves(T, { n: 7, y0: 500, y1: 950, cols: ['#C8872E', '#D9A93A'], sp: 0.07, fall: 40 }),
  nam_quan: (T) => tqZ_clouds(T, { n: 2, y0: 30, y1: 200, c: '#FFFFFF', op: 0.8, sp: 0.015 }) + tqZ_leaves(T, { n: 7, y0: 650, y1: 1000, cols: ['#9CB24A', '#C8B03A'], sp: 0.06, fall: 40 }) + tqZ_wind(T, { n: 4, y0: 700, y1: 1000, op: 0.22 }),
  trai_nguy: (T) => tqZ_clouds(T, { n: 3, y0: 70, y1: 340, c: '#33456E', sh: '#2A3A5E', op: 0.55, sw: 3 }) + tqZ_embers(T, { box: [100, 800, 140, 880], n: 6, rise: 320 }) + tqZ_embers(T, { box: [1800, 800, 1840, 880], n: 6, rise: 320 }) + tqZ_embers(T, { box: [300, 900, 1500, 1040], n: 9, rise: 280, r: 2.4 }),
  tay_thanh: (T) => tqZ_clouds(T, { n: 3, y0: 28, y1: 150, sc: 0.8, c: '#FFFFFF', op: 0.8, sp: 0.018 }) + tqZ_wind(T, { n: 7, y0: 900, y1: 1060, c: '#FFF6DA', op: 0.34 }) + tqZ_leaves(T, { n: 8, y0: 700, y1: 1000, cols: ['#D8B060', '#C09A48'], sp: 0.05, fall: 30 }),
  ngu_truong: (T) => tqZ_clouds(T, { n: 3, y0: 70, y1: 380, c: '#3A4F86', sh: '#324472', op: 0.5, sw: 3, sc: 1.2 }) + tqZ_embers(T, { box: [860, 850, 940, 905], n: 8, rise: 330 }) + tqZ_embers(T, { box: [130, 700, 170, 780], n: 5, rise: 300 }) + tqZ_wind(T, { n: 5, y0: 900, y1: 1050, c: '#E8E4A8', op: 0.22 }),
  chan_nui: (T) => tqZ_leaves(T, { n: 16, y0: 150, y1: 900, cols: ['#C8381E', '#E0802A', '#E8B030'], sp: 0.065, fall: 90, size: 1.2 }) + tqZ_wind(T, { n: 5, y0: 650, y1: 1000, c: '#FFE6B8', op: 0.25 }),
  thanh_do: (T) => tqZ_snow(T, { n: 16, c: '#FFE6E6', sp: 0.03, sz: 0.9, sw: 70, dx: 160 }) + tqZ_clouds(T, { n: 2, y0: 30, y1: 170, c: '#FFE3DC', sh: '#E8B8B0', op: 0.7, sp: 0.012 }),
  cam_dai: (T) => tqZ_leaves(T, { n: 10, y0: 100, y1: 700, cols: ['#7AAE4A', '#9CCB66', '#5E9A44'], sp: 0.05, fall: 100, size: 1.1 }) + tqZ_motes(T, { box: [400, 200, 1500, 800], n: 22, c: '#FFFBC8', op: 0.7, rise: 120 }),
  xich_bich: (T) => tqZ_snow(T, { n: 22, c: '#3C2C34', sp: 0.045, sz: 0.9, sw: 40, dx: 60, ink: 0, op: 0.6 }) + tqZ_embers(T, { box: [0, 560, 1920, 700], n: 16, rise: 420, r: 3.2 }),
  hoa_dung: (T) => tqZ_leaves(T, { n: 8, y0: 200, y1: 800, cols: ['#8AAE4A', '#B8B04A'], sp: 0.05, fall: 80 }),
  bo_song: (T) => tqZ_clouds(T, { n: 2, y0: 40, y1: 200, c: '#FFFFFF', op: 0.7, sp: 0.014 }) + tqZ_birds(T, { n: 3, y0: 120, y1: 300 }) + tqZ_glints(T, { box: [0, 560, 1920, 700], n: 14, c: '#FFFFFF' }),
  giang: (T) => tqZ_leaves(T, { n: 6, y0: 700, y1: 950, cols: ['#C8B03A', '#D9A93A'], sp: 0.06, fall: 30 }),
  song_suong: (T) => tqZ_wind(T, { n: 5, y0: 600, y1: 900, c: '#D8E2E4', op: 0.2 }) + tqZ_motes(T, { box: [300, 560, 1600, 900], n: 12, c: '#E8F0F0', op: 0.35, rise: 60 }),
};
['the', 'tua', 'truong_du', 'truong_luong', 'sai_tang', 'vinh_an', 'thuyen_du', 'thuy_trai', 'dan_gio', 'duong_rung', 'nga_ba', 'trai_thuc', 'nam_quan', 'trai_nguy', 'tay_thanh', 'ngu_truong', 'chan_nui', 'thanh_do', 'cam_dai', 'xich_bich', 'hoa_dung', 'bo_song', 'giang', 'song_suong'].forEach((n) => {
  const orig = globalThis['bg_' + n];
  if (typeof orig !== 'function' || orig.__tqz) return;
  const w = function (t, o = {}) { const base = orig(t, o); if (o.amb === 0) return base; const T = _T(t); return base + `<g class="tqz">${TQZ[n](T, o)}</g>`; };
  w.__tqz = 1; globalThis['bg_' + n] = w;
});
// Nhai Đình: lớp trời + gió khi chưa cháy; khi cháy (o.fire>0) thay bằng tro rơi + tàn lửa bay
(function () {
  const orig = globalThis.bg_nhai_dinh; if (typeof orig !== 'function' || orig.__tqz) return;
  const w = function (t, o = {}) {
    const base = orig(t, o); if (o.amb === 0) return base; const T = _T(t), f = Math.max(0, Math.min(1, o.fire || 0));
    let s = '';
    if (f < 0.6) s += `<g opacity="${_zf(1 - f / 0.6, 2)}">` + tqZ_clouds(T, { n: 3, y0: 40, y1: 330, c: '#FFFFFF', op: 0.85, sp: 0.016 }) + tqZ_wind(T, { n: 6, y0: 700, y1: 1000, op: 0.24 }) + tqZ_leaves(T, { n: 7, y0: 500, y1: 900, cols: ['#C8872E', '#D9A93A'], sp: 0.06, fall: 30 }) + `</g>`;
    if (f > 0.05) s += tqZ_snow(T, { n: Math.round(30 * f), c: '#4A3836', sp: 0.05, sz: 0.9, sw: 40, dx: 70, ink: 0, op: 0.6 }) + tqZ_embers(T, { box: [200, 700, 1700, 1000], n: Math.round(22 * f), rise: 520, r: 3.2, op: 0.95 });
    return base + `<g class="tqz">${s}</g>`;
  };
  w.__tqz = 1; globalThis.bg_nhai_dinh = w;
})();

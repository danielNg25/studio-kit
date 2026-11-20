// NỀN tập xep-hang-cao-thu-thuy-hu (C4). xhbg_<tên> = tên nền trong kế hoạch cảnh (episode.yaml params.bg).
// Dùng lại thư viện nền tập Lương Sơn / Tam Quốc (bg/*.js, tqlib/*) khi hợp; nền mới vẽ ở đây. Chi tiết nhiều lớp theo chuẩn nền đã duyệt.

// ---- chiến trường: trời, núi xa, đồi, cỏ, hai hàng cờ (đỏ = quan quân bên phải, đen-vàng = Lương Sơn bên trái), lều xa
function xhbg_field(t, o = {}) {
  const T = _T(t), dusk = o.dusk ? 1 : 0;
  let s = wxSky(t, { id: 'xfSk', c1: dusk ? '#E89A6A' : '#9CC4DE', c2: dusk ? '#FBD9A8' : '#F4ECD6', sun: dusk ? [1500, 520, 80] : [1560, 250, 60], sunC: dusk ? '#FFB26A' : '#FFE9A8', birds: !dusk });
  s += tqB_peak(260, 640, 760, 300, dusk ? '#B88A86' : '#A8BCC8', 3) + tqB_peak(980, 650, 900, 360, dusk ? '#A87A7A' : '#9AB0BE', 5) + tqB_peak(1700, 640, 780, 280, dusk ? '#B88A86' : '#A8BCC8', 7);
  s += `<path d="M0 660 Q300 600 640 650 Q1000 700 1340 640 Q1660 590 1920 650 L1920 1080 L0 1080Z" fill="${dusk ? '#9A9A5A' : '#8EB06A'}"/>`;
  s += `<path d="M0 760 Q480 700 960 750 Q1440 800 1920 740 L1920 1080 L0 1080Z" fill="${dusk ? '#A8A660' : '#9DC072'}"/>`;
  // lều xa hai bên
  [[160, 700, '#7A5A3A'], [300, 690, '#8A6A44'], [1640, 700, '#A8402A'], [1780, 694, '#8E2C1A']].forEach(([x, g, c]) => { s += `<path d="M${x - 50} ${g} L${x} ${g - 56} L${x + 50} ${g}Z" fill="${c}" stroke="${INK2}" stroke-width="3"/><path d="M${x} ${g - 56} V${g}" stroke="${INK2}" stroke-width="2"/>`; });
  // hàng cờ hai phe
  if (o.flags !== false) {
    for (let i = 0; i < 5; i++) s += tqB_flagPole(70 + i * 70, 800 - i * 8, 200, '#2A2A30', T + i * 0.3, 1);
    for (let i = 0; i < 5; i++) s += tqB_flagPole(1850 - i * 70, 800 - i * 8, 200, '#B8322A', T + i * 0.37, 1);
  }
  // cỏ tiền cảnh + đá
  for (let i = 0; i < 40; i++) { const x = hrnd(i, 31) * 1920, y = 900 + hrnd(i, 32) * 170, h = 18 + hrnd(i, 33) * 22; s += `<path d="M${R1(x)} ${R1(y)} q-4 ${-h * 0.6} -8 ${-h} M${R1(x)} ${R1(y)} q2 ${-h * 0.7} 6 ${-h * 0.9}" stroke="${dusk ? '#6A6A30' : '#5E8A3E'}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
  s += `<ellipse cx="380" cy="1010" rx="70" ry="22" fill="#9A9488" stroke="${INK2}" stroke-width="3"/><ellipse cx="1560" cy="1030" rx="90" ry="26" fill="#A49E92" stroke="${INK2}" stroke-width="3"/>`;
  // bụi chiến trường
  for (let i = 0; i < 6; i++) { const x = (hrnd(i, 41) * 1920 + T * 30 * (i % 2 ? 1 : -1)) % 1920; s += `<ellipse cx="${R1(x)}" cy="${R1(880 + hrnd(i, 42) * 80)}" rx="${R1(120 + hrnd(i, 43) * 80)}" ry="26" fill="#E8DCC0" opacity="0.28"/>`; }
  return s;
}
// ---- nền giấy (bảng, thẻ)
function xhbg_board(t) { return `<rect width="1920" height="1080" fill="${K_P1}"/><rect x="40" y="30" width="1840" height="1020" rx="26" fill="${K_P2}" opacity="0.28"/>`; }
function xhbg_study(t) { return setStudy(t, {}); }
// ---- quán rượu / phố: phố chợ có biển QUÁN RƯỢU
function xhbg_tavern(t) { return bg_cho(t, {}); }
function xhbg_street(t) { return bg_cho(t, {}); }
// ---- đồi Cảnh Dương lúc chạng vạng: rừng núi + phủ cam tối
function xhbg_hill(t) { return bg_rung(t, {}) + `<rect width="1920" height="1080" fill="#7A3A1E" opacity="0.32"/><rect width="1920" height="540" fill="#FFB060" opacity="0.18"/>`; }
// ---- am cỏ đồi Ngô Công, đêm trăng: rừng + lớp đêm + trăng + am cỏ
function xhbg_temple(t) {
  let s = bg_rung(t, {}) + `<rect width="1920" height="1080" fill="#0C1430" opacity="0.62"/>` + starsD(40, 360, 9) + `<circle cx="1500" cy="170" r="58" fill="#F4F0DC"/><circle cx="1500" cy="170" r="120" fill="#F4F0DC" opacity="0.12"/>`;
  // am cỏ: mái rơm + vách tre + cửa sổ hắt đèn
  s += `<path d="M1180 760 L1330 640 L1480 760Z" fill="#8A7A4A" stroke="${INK2}" stroke-width="5"/><rect x="1200" y="760" width="260" height="140" fill="#6A5A3A" stroke="${INK2}" stroke-width="5"/><rect x="1240" y="790" width="70" height="56" fill="#FFC870" stroke="${INK2}" stroke-width="4"/><rect x="1350" y="800" width="60" height="100" fill="#3A2A1A" stroke="${INK2}" stroke-width="4"/>`;
  s += `<ellipse cx="1275" cy="818" rx="120" ry="80" fill="#FFC870" opacity="0.12"/>`;
  return s;
}
function xhbg_mountain(t) { return bg_rung(t, {}); }

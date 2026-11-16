// CỔNG TRANG — đo rối ngay trên trang dựng, chưa cần render video (cổng C5 bước đầu; qa.py gate gọi lại lệnh này).
//   node studio-kit/core/pagecheck.mjs <thư mục dựng> <khoá chương…> [--json out.json] [--qa <qa.json>] [--step 0.0833] [--quiet]
//   vd: node studio-kit/core/pagecheck.mjs episodes/<id>/build/comic-history 00 01 02          (mở trang index.html?ch=<khoá>)
// Cần mở server 127.0.0.1 + Chromium không đầu → chạy NGOÀI sandbox như peek.sh. Viết theo khuôn vendor/lemo-opuscar/core/render/readcheck.mjs.
// Mã thoát: 0 đạt (có thể có cảnh báo) · 1 có LỖI (hoặc trang lỗi JS) · 2 KHÔNG KIỂM ĐƯỢC (engine cũ thiếu window.QA, thiếu DUR, thiếu ngưỡng) — không tính là đạt.
//
// Hợp đồng trang (engine.js cài, file này đọc):
//   window.SHOTS = [{ t, key }, …]   mốc bắt đầu từng cảnh (giây của chương); [] ở chế độ trang cũ
//   window.QA(t) → vẽ khung t rồi trả { t, shot, zoom, shake, hits, puppets: [{ rig, face, x0, y0, x1, y1, h, neck: [x, y], headPivot: [x, y], pose }] }
//     mọi số là px màn hình sau máy quay, hộp bao không cắt theo khung; pose = chuỗi đổi mỗi khi tư thế đổi; hits = số cú rung máy đã khai tới t.
// Ngưỡng: khoá "page" trong studio-kit/styles/<slug>/qa.json (tìm qua <dựng>/engine → styles/<slug>/, hoặc /build/<slug>/ trong đường dẫn, hoặc --qa):
//   P1 tỉ lệ thời gian có ≥ 1 rối trên hình (LỖI < 50 %)            P2 đoạn không có rối dài nhất (LỖI > 15 s)
//   P3 trung vị chiều cao rối lớn nhất / chiều cao khung (LỖI < 0,55) P4 rối lớn nhất < 0,40 khung liền quá 3 s (LỖI)
//   P5 MỘT rối trên hình giữ nguyên tư thế > 4,5 s (LỖI)             P6 MỌI rối trên hình cùng giữ nguyên tư thế > 2,5 s (LỖI; > 2,0 s cảnh báo)
//   P7 rung máy < 2 cú mỗi phút (cảnh báo)                           P8 |cổ − điểm xoay đầu| > 1,5 % chiều cao rối (LỖI: đầu lệch thân)
//   P9 đầu nhảy > 4 px so với cổ giữa hai bước liền khi đổi mặt (LỖI)
// "Giữ nguyên tư thế" = chuỗi pose của engine không đổi giữa hai bước (engine lượng tử 2° / 1 px): P5/P6 bắt rối ĐỨNG HÌNH, không chấm diễn hay dở.
// "Trên hình" = ít nhất `tren_hinh` (30 %) diện tích hộp bao rối nằm trong khung. Mốc thời gian in ra là giây của CHƯƠNG.
// Miễn trừ không xử lý ở đây: qa.py gate đổi mốc sang giây của clip rồi đối chiếu review_log.md (P8, P9 không bao giờ được miễn).
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), KIT = path.resolve(HERE, '..'), ROOT = path.resolve(KIT, '..');
const LIB = process.env.LIB || path.join(ROOT, 'vendor', 'lemo-opuscar');
const { openDemo, closeServer, requireDemo } = await import(pathToFileURL(path.join(LIB, 'core', 'render', 'page.mjs')).href);

const args = process.argv.slice(2), take = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; return args.splice(i, 2)[1]; };
const JSON_OUT = take('--json', null), QA_FILE = take('--qa', null), STEP = +take('--step', 1 / 12);
const QUIET = args.includes('--quiet'); if (QUIET) args.splice(args.indexOf('--quiet'), 1);
const dir = args[0], keys = args.slice(1);
requireDemo(dir);
if (!keys.length || !(STEP > 0)) { console.error('cách dùng: node pagecheck.mjs <thư mục dựng> <khoá chương…> [--json out.json] [--qa qa.json] [--step giây] [--quiet]'); process.exit(2); }

// ---- ngưỡng của style
function findQa() {
  if (QA_FILE) return QA_FILE;
  const B = path.resolve(dir), eng = path.join(B, 'engine');
  if (fs.existsSync(eng)) { const p = path.join(path.dirname(fs.realpathSync(eng)), 'qa.json'); if (fs.existsSync(p)) return p; }
  const m = /\/build\/([^/]+)\//.exec(B + '/'), p = m && path.join(KIT, 'styles', m[1], 'qa.json');
  return p && fs.existsSync(p) ? p : null;
}
const qf = findQa(), P = qf ? JSON.parse(fs.readFileSync(qf, 'utf8')).page : null;
if (!P || !Object.keys(P).length) { console.error('pagecheck: KHÔNG KIỂM ĐƯỢC — không tìm thấy ngưỡng "page" (styles/<slug>/qa.json; khai --qa <file>)'); process.exit(2); }

const HINT = {
  P1: 'kể bằng rối: đưa nhân vật vào các cảnh đang chỉ có phiếu chữ/bản đồ/biểu tượng (rối đứng cạnh bản đồ, tay giấy chỉ, rối phản ứng)',
  P2: 'đoạn dài không có rối: chen một cảnh rối (phản ứng, quay sang nhau, cầm vật) hoặc cho rối đứng trong chính cảnh đó',
  P3: 'rối nhỏ: tăng hh / đẩy máy vào — rối chính của cảnh nên cao ≥ 0,6 chiều cao khung (phim mẫu 0,66–0,76)',
  P4: 'cảnh rộng kéo dài: sau ≤ 3 s phải cắt/đẩy vào cỡ trung hoặc cận',
  P5: 'rối đứng nguyên tư thế: thêm khoá tư thế theo câu lời (gật, quay, giơ tay, đổi mặt, lùi/tới), giữ tư thế phải có run hoặc dư đà',
  P6: 'cả cảnh đứng hình: luôn có ít nhất một rối đang diễn (lấy đà → hành động → dư đà), rối kia phản ứng lệch nhịp',
  P7: 'ít cú va chạm: mỗi khoảnh khắc chính (đóng dấu, dán, rơi, tiết lộ) khai một cú rung trong shakes + vụn giấy/vệt mực',
  P8: 'đầu lệch khỏi cổ: chạy `qa.py rig <thư mục dựng>`, sửa cổ/điểm xoay đầu trong cast.spec.js — không được miễn',
  P9: 'đổi mặt làm đầu nhảy: các mặt phải chung điểm xoay (cổng rig "độ tản điểm xoay") — không được miễn',
};
const LOW = new Set(['P1', 'P3', 'P7']);
const num = v => { const a = Math.abs(v); return a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : a >= 1 ? v.toFixed(2) : v.toFixed(3); };
const mmss = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(2).padStart(5, '0')}`;

// ---- đo một chương: bước STEP, đọc window.QA
async function measure(key) {
  const { browser, page } = await openDemo(dir, { q: 'ch=' + key, gl: false });
  const res = await page.evaluate(({ STEP }) => {
    if (typeof window.QA !== 'function') return { noQA: true };
    if (!(window.DUR > 0)) return { noDur: true };
    const fr = [], n = Math.floor(window.DUR / STEP + 1e-9);
    for (let i = 0; i <= n; i++) {
      const t = i * STEP, q = window.QA(t) || {};
      fr.push({ t, shot: q.shot ?? '', hits: q.hits || 0,
        p: (q.puppets || []).map(u => ({ rig: String(u.rig), face: u.face, x0: u.x0, y0: u.y0, x1: u.x1, y1: u.y1, h: u.h, neck: u.neck, hp: u.headPivot, pose: String(u.pose) })) });
    }
    return { dur: window.DUR, W: innerWidth, H: innerHeight, shots: window.SHOTS || [], fr };
  }, { STEP });
  await browser.close();
  return res;
}

// ---- chấm một chương
function judge(key, R) {
  const { W, H, fr, dur } = R, F = [], n = fr.length, vis = P.tren_hinh ?? 0.3;
  const add = (code, lvl, t0, t1, val, thr, msg, unit = '') => F.push({ code, lvl, t0: +t0.toFixed(2), t1: +t1.toFixed(2), val, thr, unit, msg, hint: HINT[code] });
  const lim = (code, val, t0, t1, msg, unit = '') => {                     // so với P[code] = { err, warn }
    const L = P[code]; if (!L) return;
    for (const lvl of ['err', 'warn']) if (L[lvl] != null && (LOW.has(code) ? val < L[lvl] : val > L[lvl])) return add(code, lvl, t0, t1, val, L[lvl], msg, unit);
  };
  // rối trên hình ở từng bước, gắn khoá ổn định: cảnh | rối # thứ tự trong các rối cùng tên
  for (const f of fr) {
    const cnt = {}; f.on = [];
    for (const u of f.p) {
      const k = `${f.shot}|${u.rig}#${cnt[u.rig] = (cnt[u.rig] || 0) + 1}`, a = Math.max(0, u.x1 - u.x0) * Math.max(0, u.y1 - u.y0);
      const ia = Math.max(0, Math.min(u.x1, W) - Math.max(u.x0, 0)) * Math.max(0, Math.min(u.y1, H) - Math.max(u.y0, 0));
      if (a > 0 && u.h > 0 && ia / a >= vis) f.on.push({ ...u, k });
    }
    f.hh = f.on.length ? Math.max(...f.on.map(u => u.h)) / H : 0;
  }
  const runs = pred => { const out = []; let st = -1; for (let i = 0; i <= n; i++) { const v = i < n && pred(fr[i], i); if (v && st < 0) st = i; else if (!v && st >= 0) { out.push([st, i]); st = -1; } } return out; };
  const T = i => Math.min(i * STEP, dur), len = ([a, b]) => (b - a) * STEP;
  // P1, P2
  const withP = fr.filter(f => f.on.length), p1 = withP.length / n;
  lim('P1', p1, 0, dur, `rối có mặt trên hình ${(p1 * 100).toFixed(0)} % thời lượng chương`);
  const none = runs(f => !f.on.length), p2 = Math.max(0, ...none.map(len));
  for (const r of none) lim('P2', len(r), T(r[0]), T(r[1]), 'không có rối nào trên hình', ' s');
  // P3, P4
  const hs = withP.map(f => f.hh).sort((a, b) => a - b), p3 = hs.length ? hs[hs.length >> 1] : 0;
  if (hs.length) lim('P3', p3, 0, dur, 'trung vị chiều cao rối lớn nhất / chiều cao khung');
  let p4 = 0;
  if (P.P4) for (const r of runs(f => f.on.length && f.hh < P.P4.duoi)) {
    p4 = Math.max(p4, len(r));
    if (len(r) > P.P4.err) add('P4', 'err', T(r[0]), T(r[1]), len(r), P.P4.err, `rối lớn nhất chỉ cao ${num(Math.max(...fr.slice(r[0], r[1]).map(f => f.hh)))} khung (< ${P.P4.duoi}) liền`, ' s');
  }
  // P5: từng rối giữ nguyên tư thế · P6: mọi rối trên hình cùng giữ nguyên
  const prev = i => (i > 0 ? new Map(fr[i - 1].on.map(u => [u.k, u])) : new Map());
  const hold = {}; let p5 = 0;                                              // khoá rối → [bước bắt đầu giữ]
  const closeHold = (k, i) => {
    const st = hold[k]; delete hold[k]; if (st == null) return; const d = (i - st) * STEP; p5 = Math.max(p5, d);
    lim('P5', d, T(st), T(i), `rối ${k.split('|')[1].split('#')[0]} (cảnh ${k.split('|')[0] || '?'}) giữ nguyên một tư thế`, ' s');
  };
  for (let i = 0; i < n; i++) {
    const pv = prev(i), now = new Set();
    for (const u of fr[i].on) {
      now.add(u.k); const q = pv.get(u.k);
      u.same = !!q && q.pose === u.pose;
      if (u.same) { if (hold[u.k] == null) hold[u.k] = i - 1; } else closeHold(u.k, i);
    }
    for (const k of Object.keys(hold)) if (!now.has(k)) closeHold(k, i);
  }
  for (const k of Object.keys(hold)) closeHold(k, n);
  const allHold = runs(f => f.on.length && f.on.every(u => u.same)), p6 = Math.max(0, ...allHold.map(r => len(r) + STEP));
  for (const r of allHold) lim('P6', len(r) + STEP, T(r[0] - 1), T(r[1]), `mọi rối trên hình (${[...new Set(fr[r[0]].on.map(u => u.rig))].join(', ')}) cùng đứng nguyên tư thế`, ' s');
  // P7: rung máy
  const hits = n ? fr[n - 1].hits : 0, p7 = hits / (dur / 60);
  lim('P7', p7, 0, dur, `${hits} cú rung máy trong ${dur.toFixed(0)} s`, '/phút');
  // P8: cổ – điểm xoay đầu (gộp theo rối: mức tệ nhất, mốc đầu–cuối)
  const worst = {}; let p8 = 0;
  for (const f of fr) for (const u of f.on) {
    if (!u.neck || !u.hp) continue; const d = Math.hypot(u.neck[0] - u.hp[0], u.neck[1] - u.hp[1]) / u.h; p8 = Math.max(p8, d);
    const L = P.P8 || {}, lvl = L.err != null && d > L.err ? 'err' : L.warn != null && d > L.warn ? 'warn' : null; if (!lvl) continue;
    const w = worst[u.rig + lvl] ??= { rig: u.rig, lvl, t0: f.t, t1: f.t, d: 0, px: 0 }; w.t1 = f.t; if (d > w.d) { w.d = d; w.px = d * u.h; }
  }
  for (const w of Object.values(worst)) if (w.lvl === 'err' || !worst[w.rig + 'err'])
    add('P8', w.lvl, w.t0, w.t1 + STEP, w.d, P.P8[w.lvl], `rối ${w.rig}: cổ và điểm xoay đầu cách nhau ${w.px.toFixed(1)} px (tỉ lệ theo chiều cao rối)`);
  // P9: đổi mặt mà đầu nhảy so với cổ
  let p9 = 0, n9 = 0;
  for (let i = 1; i < n; i++) {
    const pv = prev(i);
    for (const u of fr[i].on) {
      const q = pv.get(u.k); if (!q || q.face === u.face || !u.neck || !u.hp || !q.neck || !q.hp) continue;
      const d = Math.hypot((u.hp[0] - u.neck[0]) - (q.hp[0] - q.neck[0]), (u.hp[1] - u.neck[1]) - (q.hp[1] - q.neck[1])); p9 = Math.max(p9, d);
      const before = F.length; lim('P9', d, T(i - 1), T(i), `rối ${u.rig}: đổi mặt ${q.face}→${u.face}, đầu nhảy so với cổ`, ' px');
      if (F.length > before && ++n9 > 12) F.pop();                         // nhiều hơn 12 lần thì chỉ đếm
    }
  }
  if (n9 > 12) add('P9', 'err', 0, dur, n9, 12, `còn ${n9 - 12} lần đổi mặt đầu nhảy nữa (không liệt kê)`, ' lần');
  const metrics = { dur: +dur.toFixed(2), P1_co_roi: +p1.toFixed(3), P2_vang_roi_s: +p2.toFixed(2), P3_cao_roi: +p3.toFixed(3), P4_roi_nho_s: +p4.toFixed(2),
    P5_giu_tu_the_s: +p5.toFixed(2), P6_ca_canh_dung_s: +p6.toFixed(2), P7_rung_moi_phut: +p7.toFixed(2), P8_co_dau: +p8.toFixed(4), P9_dau_nhay_px: +p9.toFixed(1),
    canh: (R.shots || []).length, buoc: n };
  return { key, dur, metrics, findings: F };
}

const out = { ok: true, qa: qf, step: STEP, chapters: [], unchecked: [] };
for (const key of keys) {
  const R = await measure(key);
  if (R.noQA || R.noDur) { out.unchecked.push({ key, why: R.noQA ? 'engine cũ: thiếu window.QA' : 'window.DUR không phải số dương' }); continue; }
  const c = judge(key, R); out.chapters.push(c);
  if (QUIET) continue;
  console.log(`\n== ch${key} · ${c.dur.toFixed(1)} s · ${R.fr.length} bước · ` + Object.entries(c.metrics).filter(([k]) => k[0] === 'P').map(([k, v]) => `${k} ${v}`).join(' · '));
  for (const x of c.findings.sort((a, b) => (a.lvl < b.lvl ? -1 : a.lvl > b.lvl ? 1 : a.code.localeCompare(b.code) || a.t0 - b.t0)))
    console.log(`${x.lvl === 'err' ? 'LỖI     ' : 'CẢNH BÁO'} ${x.code.padEnd(4)} ${mmss(x.t0)}–${mmss(x.t1)}  ch${key}  đo ${num(x.val)}${x.unit} · ngưỡng ${LOW.has(x.code) ? '≥' : '≤'} ${num(x.thr)}${x.unit} · ${x.msg} · SỬA: ${x.hint}`);
}
closeServer();
const all = out.chapters.flatMap(c => c.findings), nE = all.filter(x => x.lvl === 'err').length, nW = all.length - nE;
out.ok = !nE && !out.unchecked.length;
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
for (const u of out.unchecked) console.error(`pagecheck: KHÔNG KIỂM ĐƯỢC ch${u.key} — ${u.why}. Không tính là đạt.`);
if (!QUIET || nE) console.log(`--- cổng trang: ${out.chapters.length} chương · ${nE} lỗi · ${nW} cảnh báo` + (out.ok ? '' : ' · KHÔNG ĐẠT'));
process.exit(out.unchecked.length ? 2 : nE ? 1 : 0);

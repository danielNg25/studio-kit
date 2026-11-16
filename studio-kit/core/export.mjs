// Xuất sự kiện tiếng + phụ đề + mốc của một chương: node tools/export.mjs <thư mục phim> <NN>  → out/chNN.json
import fs from 'fs'; import path from 'path';
const LIB = process.env.LIB; if (!LIB) { console.error('đặt LIB=…/vendor/lemo-opuscar'); process.exit(1); }
const { openDemo, closeServer } = await import(path.join(LIB, 'core/render/page.mjs'));
const [dir, ch] = process.argv.slice(2);
const { browser, page } = await openDemo(dir, { w: 1920, h: 1080, q: `ch=${ch}`, gl: false });
const d = await page.evaluate(() => ({ dur: window.DUR, lead: window.LEAD, ev: window.EV || [], caps: window.CAPS || [] }));
fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
fs.writeFileSync(path.join(dir, 'out', `ch${ch}.json`), JSON.stringify(d));
console.log(`ch${ch}: ${d.ev.length} sự kiện, ${d.caps.length} phụ đề, ${d.dur} s`);
await browser.close(); closeServer();

// node render.mjs <render.json> <out.mp4 | stills_dir> [--stills t1,t2,...] [--audio narration.wav] [--frames a:b]
//   --frames a:b renders only frames a..b-1 (video only) — for long videos render in chunks, then concat + mux (see START_HERE)
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : undefined; };
const rj = JSON.parse(fs.readFileSync(args[0], 'utf8'));
const out = args[1];
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: rj.W, height: rj.H }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.text().startsWith('ERR')) console.error(m.text()); });
await page.goto('file://' + path.join(here, 'stage.html'));
for (const s of rj.scripts) await page.addScriptTag({ path: s });
await page.addScriptTag({ path: path.join(here, 'runtime.js') });
await page.evaluate(r => window.setup(r), rj);

const stills = opt('stills');
if (stills) {
  fs.mkdirSync(out, { recursive: true });
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate(t => window.renderFrame(t), t);
    await page.screenshot({ path: path.join(out, `t${t.toFixed(2).padStart(7, '0')}.jpg`), type: 'jpeg', quality: 88 });
  }
} else {
  const fps = rj.fps || 30, nAll = Math.round(rj.timeline.total * fps), fr = opt('frames');
  const f0 = fr ? +fr.split(':')[0] : 0, n = fr ? Math.min(nAll, +fr.split(':')[1]) : nAll;
  const audio = fr ? undefined : opt('audio');
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ff.push('-i', audio);
  // colour: 'bt709' (opt-in per format) = convert the browser's JPEG frames (BT.601 matrix, full range) to BT.709 limited range
  // and tag the stream BT.709; without it the stream keeps the BT.601 matrix untagged (previous behaviour, other channels).
  // Measured 2026-10-07 on a Nokia frame vs the browser still (flat areas, mean |ΔRGB|): zscale 0.17, swscale-via-RGB 1.13,
  // BT.601 data merely tagged 709 2.20 (saturated colours 4.0). zscale (libzimg) when ffmpeg has it, else the swscale chain.
  if (rj.colour === 'bt709') {
    const hasZ = spawnSync('ffmpeg', ['-hide_banner', '-filters'], { encoding: 'utf8' }).stdout.includes(' zscale ');
    ff.push('-vf', hasZ ? 'zscale=matrixin=470bg:rangein=full:matrix=709:range=limited,format=yuv420p'
      : 'scale=in_color_matrix=bt601:in_range=pc:out_range=pc,format=gbrp,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv');
  }
  ff.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(fps));
  if (audio) ff.push('-c:a', 'aac', '-b:a', '160k', '-shortest');
  ff.push('-movflags', '+faststart', out);
  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'ignore'] });
  const t0 = Date.now();
  for (let i = f0; i < n; i++) {
    await page.evaluate(t => window.renderFrame(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!proc.stdin.write(buf)) await new Promise(r => proc.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`  frame ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  proc.stdin.end();
  await new Promise(r => proc.on('close', r));
  console.log('  done', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await browser.close();

#!/usr/bin/env node
// Xuất những con số khớp mà engine THẬT SỰ dùng để ráp rối → <thư mục dựng>/parts/rig.json (đầu vào của cổng rig tools/rig_gate.py).
//   node studio-kit/tools/rig_dump.mjs <thư mục dựng>
// Dùng đúng engine/rig.js của thư mục dựng (symlink hoặc bản đã đóng băng) + chapters/cast.spec.js + parts/index.json — không cần trình duyệt.
import fs from 'node:fs';
import path from 'node:path';
const H = path.resolve(process.argv[2] || '.');
const load = async f => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(path.join(H, f), 'utf8')).toString('base64'));   // file thuần, không import
for (const f of ['engine/rig.js', 'chapters/cast.spec.js', 'parts/index.json']) if (!fs.existsSync(path.join(H, f))) { console.error(`LỖI rig_dump: thiếu ${f} trong ${H}`); process.exit(2); }
const IDX = JSON.parse(fs.readFileSync(path.join(H, 'parts/index.json'), 'utf8'));
const { makeRig } = await load('engine/rig.js'), { CAST } = await load('chapters/cast.spec.js');
const rig = makeRig(IDX), out = {}, errs = [];
for (const [name, sp] of Object.entries(CAST)) {
  try { const R = rig(sp); out[name] = { spec: sp, sheet: R.sheet, torso: R.torso, neck: R.neck, headDrop: R.headDrop, heads: R.heads, headPivot: R.headPivot, src: R.src,
      armA: R.armA, armB: R.armB, legA: R.legA, legB: R.legB, hipMid: R.hipMid, legLen: R.legLen, height: R.height, hat: R.hat, parts: R.parts }; }
  catch (e) { errs.push(`${name}: ${e.message}`); out[name] = { spec: sp, error: e.message }; }
}
fs.writeFileSync(path.join(H, 'parts/rig.json'), JSON.stringify(out, null, 1));
for (const e of errs) console.error('LỖI rig: ' + e);
console.log(`parts/rig.json: ${Object.keys(out).length} rối${errs.length ? `, ${errs.length} rối không ráp được` : ''}`);
process.exit(errs.length ? 1 : 0);

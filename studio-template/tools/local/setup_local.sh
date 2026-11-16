#!/usr/bin/env bash
# Cài MỘT LẦN để audio / qa / stills / render chạy thẳng trên máy local (macOS hoặc Linux).
# Việc script làm: kiểm node/ffmpeg/python3 (KHÔNG tự cài — thiếu thì in lệnh brew), `npm install` (playwright 1.56.1),
# tải Chromium của Playwright (~150 MB, một lần; bỏ qua nếu đặt CHROMIUM_PATH), tạo .venv + pip install requirements.txt,
# rồi thử chụp một khung bằng Chromium để chắc là chạy được. Chạy lại bao nhiêu lần cũng được.
#
# usage:  cd studio-template && tools/local/setup_local.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../.." && pwd)"
cd "$STUDIO"

ok()   { printf '  ✓ %s\n' "$*"; }
warn() { printf '  ✗ %s\n' "$*"; MISSING=1; }
MISSING=0

echo "== Công cụ hệ thống =="
for t in node npm ffmpeg ffprobe python3; do
  if command -v "$t" >/dev/null 2>&1; then ok "$t: $(command -v "$t")"; else warn "thiếu $t"; fi
done
if [ "$MISSING" = 1 ]; then
  echo
  echo "Cài phần thiếu rồi chạy lại. Trên macOS có Homebrew:   brew install node ffmpeg python"
  exit 1
fi
node -e 'process.exit(+process.versions.node.split(".")[0] >= 18 ? 0 : 1)' || { echo "  ✗ cần Node >= 18 (đang $(node -v))"; exit 1; }
python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)' || { echo "  ✗ cần Python >= 3.9 (đang $(python3 -V))"; exit 1; }
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libx264 && ok "ffmpeg có libx264" || { echo "  ✗ ffmpeg không có libx264 (cài bản brew đầy đủ)"; exit 1; }
if ffmpeg -hide_banner -filters 2>/dev/null | grep -q ' zscale '; then
  ok "ffmpeg có zscale (màu BT.709 chuẩn cho format colour: bt709)"
else
  echo "  ! ffmpeg không có zscale: format dùng colour: bt709 sẽ dùng nhánh swscale (màu lệch nhẹ hơn bản dựng bằng zscale)"
fi

echo "== npm / Playwright =="
npm install --no-audit --no-fund --loglevel=error
if [ -n "${CHROMIUM_PATH:-}" ] && [ -x "$CHROMIUM_PATH" ]; then
  ok "dùng Chromium/Chrome ở CHROMIUM_PATH=$CHROMIUM_PATH"
else
  npx playwright install chromium
fi

echo "== Python (.venv) =="
[ -d .venv ] || python3 -m venv .venv
.venv/bin/python -m pip install -q --upgrade pip
.venv/bin/python -m pip install -q -r requirements.txt
.venv/bin/python -c 'import numpy, soundfile, PIL, yaml; print("  ✓ numpy soundfile pillow pyyaml")'

echo "== Thử Chromium chụp một khung =="
mkdir -p .cache
CHK=".cache/chromium_check.mjs"
cat > "$CHK" <<'JS'
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 320, height: 180 } });
await p.setContent('<body style="margin:0;background:#c33"><h1 style="font:40px sans-serif;color:#fff">OK</h1></body>');
const buf = await p.screenshot({ type: 'jpeg', quality: 90 });
console.log('  ✓ Chromium chụp được khung (' + buf.length + ' byte)');
await b.close();
JS
node "$CHK"
rm -f "$CHK" 2>/dev/null || true

cores="$( (sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo '?') | head -1 )"
echo
echo "Xong. Máy có $cores nhân → render song song mặc định dùng min(4, nhân/2) tiến trình (đổi: --jobs N)."
echo "Dùng:  tools/local/run.sh ../<kênh>/episodes/<id> render      (các lệnh khác: plan|voice|audio|qa|stills|all|post)"
echo "Thử trước khi tin: chạy 'stills' rồi xem build/contact.jpg (font/chữ trên macOS có thể khác Linux một chút)."

# HyperFrames (heygen-com/hyperframes) — đánh giá cho studio (2026-10-09)

Repo: https://github.com/heygen-com/hyperframes · Apache-2.0 · CLI npm `hyperframes` 0.8.143 · cần Node ≥ 22 + FFmpeg.
Cùng cách làm với engine của mình (HTML → Chromium headless chụp từng khung → FFmpeg), nhưng đầy đủ hơn.

## Chạy được trên cloud (đã thử)
```bash
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1   # mặc định CÓ gửi telemetry ẩn danh (PostHog)
export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell  # tải Chrome của nó bị chặn mạng
npm i hyperframes && npx hyperframes init demo --example blank --non-interactive
npx hyperframes lint && npx hyperframes render -o out/x.mp4 --workers 2
```
- Không được dùng CDN trong trang (cdn.jsdelivr bị chặn) → vendor GSAP (`npm i gsap`), font, d3 vào `assets/`.
- Cảnh thử `demo_index.html`: bản đồ Đông Nam Á từ gói `packs/maps/world` + Lào/Campuchia hiện dần + sông Mê Kông vẽ dần + pill + đếm số (style C).
  8 s/30 fps: 5 phút (1 worker) → 2 phút 55 (2 worker) ≈ 0,7 s/khung trên cloud 2 nhân, chế độ screenshot (BeginFrame không chạy với headless_shell này).
  Chậm vì SVG bản đồ 50m cả thế giới bị vẽ lại mỗi khung — engine của mình cũng chụp từng khung y như vậy → phải raster hoá lớp nền (PNG) rồi chỉ animate lớp trên.
- Bài học pháp luật bản đồ: camera zoom làm nhãn Trường Sa trôi khỏi khung / bị thẻ che ở cuối cảnh → `World.assertLegal` phải kiểm theo khung cuối/từng khung, không chỉ t=0.

## Dùng được gì
- Hợp đồng composition: `data-start/duration`, `class="clip"`, timeline GSAP `window.__timelines` (seek được, tất định), sub-composition.
- `lint` + `check` (lỗi runtime, bố cục tràn, chuyển động, độ tương phản WCAG) — mình chưa có.
- Render song song nhiều worker, xuất mp4/webm/mov alpha/png-sequence/gif.
- `hyperframes-audio`: giảm nhạc nền theo dải tần giọng (voiceover carve), EQ/compressor/limiter — tốt hơn lệnh `mix` hiện có.
- Registry 150+ block/200+ component: transitions, shader transitions, count-up, chart-story, decline-chart, bar-chart-race, svg-line-draw, vox-annotate, hw-* (vẽ tay), paper-collage, grain…
  Map: `world-map`, `us-map*`, `spain-map`, `nyc-paris-flight`, `north-korea-locked-down` — KHÔNG dùng nguyên: world-map tải world-atlas 110m từ CDN (không theo POV Việt Nam), 2 block cuối là ảnh PNG bản đồ.
- Skill `faceless-explainer`: quy trình brief → design (`frame.md` preset) → storyboard/script (cổng duyệt) → audio → mỗi frame 1 sub-agent → render. Nhắm 60–90 s (tối đa ~3 phút), không hợp video 15–25 phút nhưng học cách chia frame + preset thiết kế.

## Không nên / lưu ý
- `media-use` (TTS, nhạc, SFX, avatar) dựa vào tài khoản/CLI HeyGen; mình đã có VBee → không cần.
- Cài plugin đủ 21 skill thì nặng và có nhiều luồng không liên quan (PR video, product launch, talking head).
- GSAP: "GSAP Standard License" (miễn phí cả thương mại, không phải OSI) — ghi chú khi dùng.
- Block của bên thứ ba có tác giả riêng (vd Stronkter) và một số tải font/three.js từ CDN lúc chạy → phải vendor trước khi render.

# Studio template — làm video hàng loạt, nhiều kênh

Template này tách **code dùng chung** khỏi **dữ liệu của từng kênh / từng video**. Một video = một file `episode.yaml`.

> **Session mới bắt đầu ở đâu?** `START_HERE.md` (studio: cách làm, môi trường, quy ước) → `<kênh>/START_HERE.md` (kênh là gì,
> luật đã chốt) → `<kênh>/STATUS.md` (đang làm tới đâu, việc tiếp theo, nhật ký quyết định). Hết session: cập nhật `STATUS.md`.
>
> **Root chỉ chứa folder**: `studio-template/` (mọi thứ dùng chung) + một folder cho mỗi kênh (mọi thứ của kênh đó).

```
studio-template/                 ← dùng chung cho mọi kênh (copy cả folder nếu muốn một studio mới)
  engine/                        build.py (plan/voice/audio/qa/stills/render), render.mjs, runtime.js
  packs/style/doodle-v1/         phong cách vẽ (core.js + style.md + font + source/ ảnh mẫu gốc)
  packs/characters/              stick-figure, shiba-punk (+ ảnh gốc, model sheet)
  packs/assets/                  thư viện con vật + đạo cụ (vẽ 1 lần, mọi kênh dùng)
  templates/scenes/              mẫu cảnh có tham số + catalog.md
  templates/formats/             short-60 (9:16 ~60s), long-8min (16:9 ≥ 8 phút, YouTube mid-roll),
                                 long-150 (16:9 2-3 phút, không mid-roll): nhịp, độ dài, bố cục chữ
  channel_template/              khung một kênh mới
  new_channel.sh, new_episode.sh
  tools/local/                   setup_local.sh · run.sh · render_parallel.py — chạy mọi bước + render song song trên máy local
  START_HERE.md                  file neo: đọc gì trước, môi trường, quy ước, hạn chế đã biết

<kênh>/                          ← chỉ dữ liệu (tạo bằng new_channel.sh)
  START_HERE.md  STATUS.md  channel.yaml  blueprint.yaml  voice.yaml  .env
  references/  backlog.csv  analytics.csv
  episodes/<id>/episode.yaml (+ scenes.js, post.md, build/)
  out/<id>_<format>.mp4          video thành phẩm của mọi tập, chung một chỗ
```

## Ba tầng

1. **Studio** (engine, QA) — không đổi theo kênh.
2. **Gói** — style, nhân vật, con vật/đạo cụ, mẫu cảnh, mẫu định dạng. Kênh nào cũng chọn được.
3. **Kênh** — `blueprint.yaml` (luật của kênh), `voice.yaml`, reference, backlog, analytics.
4. **Video** — `episode.yaml`: lời thoại theo shot, mẫu cảnh + tham số, nhãn vàng, dữ kiện + nguồn.

## Quy trình một video

1. Chọn chủ đề trong `backlog.csv` (chấm điểm tò mò / gần gũi / dễ share / dễ vẽ / có nguồn).
2. `./new_episode.sh <kênh> <id> [format]` → viết `episode.yaml` theo `script_formula` trong blueprint và beat sheet của format.
3. `python3 engine/build.py <kênh>/episodes/<id> plan` → xem số ký tự / độ dài ước tính.
4. `… audio --silent` + `… stills` → xem nhanh bố cục khi chưa tốn tiền giọng.
5. **Duyệt kịch bản** (cổng 1).
6. `… voice` (VBee, chỉ tạo câu mới/đã sửa) → `… audio` → `… qa` → `… render`.
7. **Duyệt video** (cổng 2) → viết `post:` (caption + hashtag) trong `episode.yaml` → `… post [--mode nguon|fact] [--link URL]` → `post.md` (caption dán nguyên khối
   + comment ghim: nguồn kèm link, hoặc 1 fact thêm; + câu ủng hộ kênh nếu có link) → đăng → ghi link vào `post.md` + `analytics.csv` → rút kinh nghiệm vào blueprint.
8. Cập nhật `<kênh>/STATUS.md`.

## Video dài YouTube (`long-8min`)
YouTube chỉ cho chèn quảng cáo giữa video (mid-roll) khi video đã bật kiếm tiền và **dài từ 8:00 trở lên**
([YouTube Help](https://support.google.com/youtube/answer/6175006)). Format `long-8min` nhắm 8:30–11:00:
- Shot có `chapter: "Tên"` mở chương mới (nên là `title_card`); trước chương có khoảng lặng dài hơn (`pauses.chapter`).
- `audio`/`qa` ghi `build/youtube.md`: mốc chương dán vào mô tả (0:00 đầu tiên, ≥ 10s mỗi chương) và **vị trí đặt quảng cáo**
  ở khoảng lặng đầu chương (cách nhau ≥ 150s). `ad_break: true` trên một shot = cho phép đặt quảng cáo ở đó.
- QA báo ❌ nếu < 8:00 hoặc < 4 chương. Đừng kéo dài bằng câu thừa — tỉ lệ xem hết quan trọng hơn số phút.
- `plan` in số ký tự từng chương để cân độ dài khi viết.

`… all` = plan + voice + audio + qa + render (dừng nếu QA lỗi, trừ khi `--force`).

## QA tự động (build/qa.md)
từ cấm trong lời/nhãn/tiêu đề · mọi mốc `at` có trong lời · nhãn ≤ 6 chữ · dữ kiện có nguồn · shot có số liệu phải dẫn claim ·
độ dài nằm trong khung format · shot dài quá `max_shot_s` (mặc định 14s) · mẫu cảnh tồn tại · title_box ≤ 24 ký tự/dòng ·
(format dài) ≥ 8:00 để có mid-roll · đủ chương, mỗi chương ≥ 10s.

## Mở rộng
- **Kênh mới:** `./new_channel.sh ../<kênh-mới> "Tên"` → sửa blueprint/voice/.env.
- **Con vật / đạo cụ mới:** `packs/assets/*.js` (xem README trong đó).
- **Mẫu cảnh mới:** `templates/scenes/scenes.js` + `catalog.md`. Cảnh chỉ dùng 1 lần → `episodes/<id>/scenes.js` (`template: custom`).
- **Định dạng mới:** `templates/formats/<id>/format.yaml` + `layout.js` (+ `example_episode.yaml` để `new_episode.sh` dùng).
- **Nhân vật mới:** `packs/characters/<id>/character.js` (đổi đầu qua `headFn` hoặc vẽ thân riêng).

## Cài đặt
- Python 3 + `pip install -r requirements.txt`; Node + `npm install` (Playwright/Chromium); ffmpeg.
- Mạng: cho phép `api.vbee.vn`, `vbee.vn`, `vbee-studio2-3.s3.ap-southeast-1.amazonaws.com`.
- Render ~5 phút cho 60s trên máy 2 nhân. `CHROMIUM_PATH` nếu Chromium nằm chỗ khác.
- Máy local: `tools/local/setup_local.sh` (một lần) rồi `tools/local/run.sh ../<kênh>/episodes/<id> render` (song song theo đoạn khung; chi tiết ở START_HERE → Môi trường).

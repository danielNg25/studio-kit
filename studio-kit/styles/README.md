# Style hình của studio (tương đương "my-styles" của Lemo-Opuscar)

Mỗi style = `styles/<slug>/STYLE.md` (bất biến: nhìn, màu, chữ, chuyển động, máy quay, âm thanh, cạm bẫy, lệnh) + `template/` nếu có engine riêng.
**Không dựng trong `styles/`** — tạo tập bằng `new_episode.sh` của style (chép `template/`, `engine/` trỏ về bản chung); chốt đăng thì `freeze.py`.

| Slug | Tên | Kênh đang dùng | Engine | Tập mẫu đã duyệt |
|---|---|---|---|---|
| [webtoon-svg](webtoon-svg/STYLE.md) | Webtoon vẽ code (SVG), nền 5 lớp, cảnh đánh | Kênh Mẫu | `studio-template/engine` + pack `webtoon-code-v1` | `channel-example/episodes/xep-hang-cao-thu-tam-quoc` |
| [comic-history](comic-history/STYLE.md) | Truyện tranh lịch sử giấy cắt (Lemo-Opuscar "Comic History Cartoon"), rối khớp từ tấm Codex (mỗi nhân vật một tấm) | **Hóng (mặc định)** | `comic-history/engine/` (dùng chung) + `studio-kit/core/` + render `vendor/lemo-opuscar/core` | `channel-hong-su-remotion/episodes/jensen-huang-cuoc-doi/build/comic-history` |
| [stick-3d](stick-3d/STYLE.md) | Người que đầu tròn trong bối cảnh 3D, máy bay liên tục (kiểu Ricks Clips / Situational Stories), Shorts dọc tiếng Anh | chưa gán kênh (đang thử) | `stick-3d/engine/` → `video/rick-short/engine` (three.js r147 có sẵn + render `vendor/lemo-opuscar/core`) | bản test `rick-short/engine/out/hook-test/hook-test-v3.mp4` (chưa có tập đã duyệt) |
| [paper-remotion](paper-remotion/STYLE.md) | Cắt giấy nhiều lớp bằng React/Remotion | Hóng (trước 13/11, tham khảo) | `channel-hong-su-remotion/src` | `channel-hong-su-remotion/episodes/trung-quoc-toan-su` |

Thư viện 99 style khác: `vendor/lemo-opuscar/styles/README.md` + gallery https://lemomo-ai.github.io/lemo-opuscar/ (repo chỉ có sẵn `comic-history`; style khác phải tải về và soát mã độc trước).

## Thêm style mới
1. Tạo `styles/<slug>/STYLE.md` theo khung: Nhìn · Màu · Chữ · Nhân vật · Chuyển động · Máy quay & chuyển cảnh · Âm thanh · Chi tiết bắt buộc · Cạm bẫy đã gặp · Lệnh.
2. Làm thử một chương (hoặc 3 chương đầu) cho người dùng duyệt trước khi làm cả tập.
3. Góp ý của người dùng về style → ghi vào `STYLE.md` của style đó (kèm ngày + câu gốc).

# START HERE — <tên kênh>

File neo của kênh. Session mới đọc: `../studio-template/START_HERE.md` (cách làm, môi trường) → file này → `STATUS.md` → `blueprint.yaml`.

## Kênh này là gì
- Nội dung: …
- Nền tảng + format: … (vd `short-60` cho TikTok/Reels, `long-8min` cho YouTube)
- Phong cách vẽ / người dẫn chuyện: … (pack trong `../studio-template/packs/`)
- Giọng: … (`voice.yaml`)

## Luật đã chốt (không tự đổi khi người dùng chưa đồng ý)
- …
(Chi tiết đầy đủ trong `blueprint.yaml`; file này chỉ tóm tắt những điều quan trọng nhất.)

## Bản đồ folder kênh
```
START_HERE.md   file này
BRIEF.md        ý tưởng gốc do người dùng điền (tên, chủ đề, giọng, link reference)
STATUS.md       trạng thái, việc tiếp theo, nhật ký quyết định — cập nhật cuối mỗi session
blueprint.yaml  luật kênh · voice.yaml giọng · .env bí mật (không bao giờ in ra) · channel.yaml đường dẫn studio
references/     content/ (video nguồn + ghi chú) · style/ · competitors/
backlog.csv     chủ đề + điểm · analytics.csv kết quả sau khi đăng
episodes/<id>/  episode.yaml (+ scenes.js, post.md), audio/, build/, archive/ (bản cũ)
out/            VIDEO THÀNH PHẨM của mọi tập (<id>_<format>.mp4) — tải lên hàng loạt từ đây
```

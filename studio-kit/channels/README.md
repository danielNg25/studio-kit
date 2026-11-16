# Mở kênh mới

Kênh = thư mục `<root>/<kênh>/` (dữ liệu: episodes, backlog, analytics, voice, music, branding) + **skill mỏng** `<kênh>/skill/` chỉ giữ thứ riêng của kênh. Mọi luật chung ở `studio-kit/`.

## Các bước
1. Thư mục kênh: `cd studio-template && ./new_channel.sh ../<kênh> "Tên kênh"` (engine SVG) — hoặc thư mục trống nếu kênh dùng style khác (comic-history, Remotion).
2. Skill kênh: `cp -R studio-kit/channels/_template/skill <kênh>/skill`, rồi điền (mỗi file vài chục dòng):
   - `SKILL.md`: kênh là gì, người dẫn/giọng, style hình (`studio-kit/styles/<slug>`), bảng bước trỏ về studio-kit + reference kênh, mẫu đã duyệt.
   - `references/hanh-van.md`: giọng văn (học từ 50–100 transcript kênh mẫu, có cặp câu cũ → mới).
   - `references/de-tai.md`: vùng đề tài, dạng video, tiêu đề đã chạy.
   - `references/nhan-vat.md`: người dẫn + bảng nhân vật thường gặp.
   - `references/signature.md`: khoảnh khắc chữ ký của kênh (kênh mẫu: cảnh đánh; Hóng: …).
   - `references/dang-bai.md`: footer, tags cố định, comment ghim mẫu, cài đặt tải lên.
3. Chọn style; nếu style mới thì thêm `studio-kit/styles/<slug>/STYLE.md` và làm 3 chương đầu cho duyệt.
4. Ghi vào `<kênh>/START_HERE.md` một dòng: "Luật chung: studio-kit/AGENTS.md; luật kênh: skill/SKILL.md".

## Kênh hiện có
| Kênh | Skill | Style |
|---|---|---|
| Kênh Mẫu | `channel-example/skill/` (bản đầu tiên, nguồn của studio-kit) | webtoon-svg |
| Hóng | `channel-hong-su-remotion/skill/` | **comic-history (mặc định)**; paper-remotion (cũ) |
| Vi Nhân | `channel-vi-nhan/START_HERE.md` (chưa tách skill) | |
| rick-short (Shorts tiếng Anh người que 3D; nằm ngoài `shorts-claude/`, ở `video/rick-short/`) | `../rick-short/skill/` (skill `rick-short-video`) | stick-3d |

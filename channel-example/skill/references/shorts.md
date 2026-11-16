# Shorts — phần riêng Kênh Mẫu

**Phần chung: `studio-kit/references/shorts.md`** (chọn đoạn, bố cục dọc, giao).

## Riêng kênh (mẫu Shorts "Xếp hạng võ công Kim Dung")
- Video xếp hạng: mỗi mục một Short ("8 vũ khí cắt 8 cái chứ"). Shorts đăng cả TikTok (từ 8/11).
- Nền tím; trên: dòng vàng nhỏ (TÊN TRUYỆN/TÊN VIDEO) + dòng to tên mục; khung 16:9 lấp kín giữa hai vạch vàng.
- Thẻ "XEM FULL" giữ logo YouTube nhưng chữ "YouTube" đổi thành "Kênh Mẫu".
- Công cụ (từ 14/11/2026): ghi đoạn vào `episodes/<id>/build/shorts.json` (`video`, `top` có `{i}/{n}`, `segs`: slug, t0, t1, title với `|` = xuống dòng), rồi `python3 tools/shorts_cut.py <id> [--check] [1,3] [--video <mp4>]` → `out/shorts_<id>/NN_<slug>.mp4` (gọi `shorts_full.py`, tự co cỡ chữ tiêu đề theo font thật). Mẫu: `episodes/xu-an-tao-thao/build/shorts.json`. Công cụ cũ `episodes/tay-du-p1/build/shorts.py` chỉ còn để tham khảo.
- Tiêu đề, caption, comment: `episodes/<id>/shorts_post.md`, mỗi clip một mục `## N. <tên>` + dòng `` `out/shorts_<id>/NN_<slug>.mp4` `` + các khối code có nhãn ngay trên (Tiêu đề / Caption / Comment ghim). Trang web đọc đúng dạng này (bước Shorts) và cho người dùng tích đã đăng YouTube/TikTok (`build/shorts_posted.json`).
- Bản edit nhạc TikTok: `build/music_edit.py` (~35 s: cảnh khởi đầu → toàn cảnh đánh → chiêu đẹp nhất).

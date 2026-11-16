# Bài đăng YouTube (chung; dùng cùng skill `youtube-publish` / `video-post-gen` nếu session có)

Chỉ làm sau khi bản full qua cổng C6. Claude soạn sẵn, người dùng tự đăng. Footer, tags cố định, comment ghim mẫu của từng kênh nằm trong skill kênh.

- **Tiêu đề** ≤ 70 ký tự ([de-tai.md](de-tai.md)).
- **Mô tả**: đoạn mở (nghịch lý/câu hỏi của tập) → 1 đoạn tóm hành trình → câu hỏi bình luận → **mục lục chương** (mốc lấy từ bản ghép thật, vd `assemble.py` in "chương bắt đầu") → nguồn (thời sự: báo nào, ngày nào) → footer kênh → 3 hashtag. ≤ 5000 ký tự.
- **Credit nhạc**: tên bài — tác giả, mọi bài đã dùng (`credits.txt` cạnh video).
- **Tags** ≤ 500 ký tự: tên có dấu + không dấu, "… là ai", "cuộc đời …", tên kênh.
- **Comment ghim**: câu hỏi tranh luận của tập + mời gợi ý đề tài.
- Không nêu tên tập sau. **Không đề xuất mốc chèn quảng cáo** (người dùng 1/11).

## Cài đặt khi tải lên (ghi cuối post.md)
Không dành cho trẻ em · Tiếng Việt · danh mục theo kênh · phụ đề `.vi.srt` · màn hình kết thúc 20 s cuối · nội dung tổng hợp (hoạt hình + giọng tổng hợp không giả người thật → thường "Không", người dùng quyết).

## Trả về trong chat
Tiêu đề, Mô tả, Tags, Comment ghim — mỗi cái một khối code; gửi ảnh bìa; một dòng: đường dẫn video/phụ đề, màn hình kết thúc từ giây nào.

## Ghi trạng thái
`STATUS.md` "post sẵn"; `backlog.csv` status. Khi có link đã đăng: post.md mục "Đã đăng", `episode.yaml status: posted`. 48 h và 7 ngày: [so-lieu.md](so-lieu.md).

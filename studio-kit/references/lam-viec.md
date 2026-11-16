# Cách làm việc với người dùng (mọi kênh)

## Giao tiếp
- Tiếng Việt, "bạn"/"mình". Báo ngắn: kết quả trước, không kể lại từng bước.
- Dàn ý, kịch bản, tiêu đề, mô tả, lệnh cần dán: hiện thẳng trong chat (file chỉ là bản lưu). Luôn ghi đường dẫn đầy đủ của file giao.
- Muốn xem nhanh thì gửi đúng đoạn đã sửa (clip ngắn), không bắt chờ render cả tập. Đang điều khiển từ xa → gửi file vào chat (TECHNIQUE §6).

## Nhịp làm
- Làm liền các bước, không hỏi giữa chừng. Dừng ở: cổng duyệt, việc tốn tiền, việc không đảo ngược, quyết định cấu trúc lớn (đổi thư mục, đổi kênh đang chạy).
- **Không báo khi chưa xong.** Được giao "dựng lại chương 4 → 12" thì dựng hết rồi báo một lần.
- Đoạn khó/mới → làm mẫu ngắn cho duyệt trước rồi mới áp cả tập. Style mới: làm 3 chương đầu cho duyệt mức chi tiết và độ bắt mắt rồi mới làm phần còn lại (Jensen 13/11).
- Góp ý mơ hồ → nghĩa hẹp nhất, gửi xem. Hướng đã bị bác thì không đề xuất lại.
- "Cần đăng sớm" → song song hoá (TECHNIQUE §7), chỉ sửa lỗi rõ ràng, gửi kèm danh sách lỗi còn lại.

## Tiền và tài khoản
- VBee/API trả phí: báo số ký tự/chi phí trước mỗi lần gọi, chờ "ok". Không bao giờ in `.env`/khoá.
- Người dùng nhạy chi phí token: một workflow 35 agent từng đốt ~3,5 triệu token. Hỏi trước khi chạy workflow > 7 agent hoặc agent trên mức medium; không chạy agent max effort cho việc viết; có đường rẻ hơn (tự sửa, một agent) thì dùng.
- Không đăng, không lên lịch, không trả lời comment hộ.

## File trên Mac
- Không `rm`; bản bỏ đi dời/chép vào `<kênh>/_to_delete/`. File tạm làm rỗng bằng `: >`.
- Tệp người dùng tải về `~/Downloads` có thể không đọc được (quyền macOS) → nhờ chép vào thư mục dự án.
- File dùng chung: đọc lại trước khi ghi, chỉ vá phần của mình. `STATUS.md` kênh: cuối mỗi việc lớn thêm một dòng nhật ký.

## Ghi luật mới
Góp ý dùng lại được → ghi ngay: chung mọi kênh → `studio-kit/` (DIRECTOR/TECHNIQUE/references); riêng kênh → `<kênh>/skill/references/`. Dạng `- (YYYY-MM-DD, tập …) luật — "câu gốc"`. Luật mới thay luật cũ thì sửa luật cũ, không để hai dòng mâu thuẫn.

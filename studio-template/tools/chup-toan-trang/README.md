# Chụp toàn trang — tiện ích Chrome (1 cú bấm)

Thay cho: Inspect → Cmd+Shift+P → "Capture full size screenshot".

## Cài (1 lần)
1. Mở `chrome://extensions` → bật **Developer mode** (góc phải trên).
2. Bấm **Load unpacked** → chọn folder này (`studio-template/tools/chup-toan-trang`).
3. Ghim icon (biểu tượng mảnh ghép → ghim "Chụp toàn trang").

## Dùng
- Mở bài Reddit, sắp xếp bình luận **Top**, bấm mở các "More replies" cần lấy.
- Bấm icon tiện ích, hoặc **Cmd+Shift+Y** (đổi phím ở `chrome://extensions/shortcuts`).
- Ảnh lưu vào **Downloads/chup-toan-trang/** (tên = ngày giờ + tiêu đề trang). Icon hiện "OK" khi xong, "LỖI" nếu hỏng.
- Reddit: chỉ chụp cột bài + bình luận (bỏ thanh bên). Trang khác: chụp cả trang.
- Lúc chụp Chrome hiện thanh "… đang gỡ lỗi trình duyệt" 1–2 giây — bình thường, tự tắt.

Trang rất dài (> 12000 px) tự giảm độ phân giải để Chrome không lỗi; dài quá 30000 px thì phần cuối bị cắt → chụp 2 lần (cuộn rồi thu gọn bớt bình luận).
Threads không dùng được kiểu này cho bình luận (Threads chỉ vẽ phần đang nhìn thấy).

## Bản 1.1 (09/10, sau khi người dùng review)
- Bỏ quyền `tabs` (chỉ cần `activeTab`: tiện ích chỉ thấy tab lúc bạn bấm icon / phím tắt).
- Gắn debugger nằm trong `try` → tab đang mở DevTools thì icon báo "LỖI" (đóng DevTools rồi bấm lại).
- Gỡ giả lập kích thước luôn chạy trong `finally`.
- Trang rất dài (> 12000 px) lưu JPEG thay vì PNG để file nhỏ, tải không hỏng.
- Bảo mật: quyền `debugger` rất mạnh và Chrome KHÔNG hỏi lại khi file của tiện ích dạng unpacked bị sửa → mỗi khi `background.js` / `manifest.json` thay đổi, xem lại thay đổi trước khi dùng.
- Cẩn thận phím tắt trên trang ngân hàng / email: ảnh chụp lưu nguyên trang vào Downloads.

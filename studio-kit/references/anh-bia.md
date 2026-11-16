# Ảnh bìa (chung)

Kênh sống nhờ trang chủ → ảnh bìa là thứ đầu tư nhiều nhất. **Ảnh bìa phải hoành tráng, có hiệu ứng ánh sáng** — ảnh phẳng, đơn giản bị trả về. Hướng đã thắng của từng kênh nằm trong skill kênh.

## Nguyên tắc (người dùng duyệt 12/11, kênh mẫu)
- **Một cặp màu tương phản**, tối đa 2–3 màu chính; tránh nền đỏ–trắng (lẫn giao diện YouTube); nền dịu để nhân vật nổi.
- **Ánh sáng** ở nền + viền: rim light, halo, tia sáng, hạt sáng, khói. **Không phủ lớp màu lên mặt.**
- **Mặt to, biểu cảm mạnh, khác nhau ở chi tiết lớn** (mũ, nụ cười, mắt), không chỉ khác màu. Người thật được kể: biếm hoạ giống mặt (DIRECTOR §8); nhân vật hư cấu: không giống diễn viên.
- **Chữ**: 2–3 dòng, ≤ 5 từ mỗi khối, IN HOA, viền đen dày, đổ bóng; tránh góc dưới phải (khung thời lượng che); khớp tiêu đề video.
- Kiểm ở 320×180: vẫn nhận ra nhân vật và đọc được chữ.

## Hai cách làm
1. **Vẽ bằng engine của style** (cảnh 1920×1080 dùng nhân vật/nền của tập) → xuất 1280×720. Kênh Mẫu: `thumb.js` (lệnh trong skill kênh).
2. **Ảnh tạo bằng AI (Gemini…) do người dùng đưa, đã bỏ chữ** → mình thêm chữ bằng `studio-kit/tools/thumb_text.py` (Be Vietnam Pro Black, băng giấy đỏ cho dòng đầu, chữ vàng cho tên chính, xoá dấu lấp lánh Gemini bằng `--erase x,y`). Ra `thumbnail_2k.png` + `thumbnail_1280.jpg`. Mẫu: tập Jensen (Hóng) — "SỰ SỤP ĐỔ CỦA / JENSEN HUANG / VÀ NVIDIA".

## Giao
Gửi **2–3 phương án** khác hướng (C7) khi mình tự vẽ; ảnh người dùng đưa thì một bản + đề nghị biến thể (màu, ngắt dòng). Có 2 bản tốt → đề xuất "Thử nghiệm và so sánh" của YouTube Studio. Sửa theo góp ý thì đổi đúng chỗ được nói.

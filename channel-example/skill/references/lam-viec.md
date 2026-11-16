# Cách làm việc — phần riêng Kênh Mẫu

**Phần chung: `studio-kit/references/lam-viec.md`** (giao tiếp, nhịp làm, tiền, file trên Mac, ghi luật). Ví dụ luật gốc: người dùng 12/11 "dựng lại hết từ chương 4 đến 12 rồi mới báo mình".

## Riêng kênh
- Dựng và duyệt **từng chương**: dựng chương N → soát → gửi → sửa → chương N+1.
- Ví dụ góp ý mơ hồ: "trận phải viết đủ" = chỉ viết đủ chữ "trận pháp", không phải kể đầy đủ cấu tạo.
- Chỗ render: cloud (container) chỉ ảnh tĩnh, bảng ghép, clip thử ≤ ~1 phút; Mac render bản xem chương + bản full bằng một dòng lệnh người dùng tự chạy: `cd "<thư mục tập>" && python3 build/render_local.py -j 4` ([lenh.md](lenh.md)).
- "Dựng hình trước, giọng sau": dựng theo mốc ước lượng (`build.py <ep> audio --silent`) kèm phụ đề tạm, thay giọng thật sau.
- VBee thu theo lô bằng `build/voice_batch.py`; không gọi `build.py voice` cho cả tập.
- File bỏ đi: `channel-example/_to_delete/`. `STATUS.md` kênh: cuối mỗi việc lớn thêm một dòng nhật ký cho tập.

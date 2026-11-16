# Đọc số liệu sau khi đăng (chung, người dùng duyệt 13/11)

Ba thứ quyết định một video: **ảnh bìa** (CTR), **30 giây đầu** (giữ chân), **chỗ người xem bỏ đi**. Bước này cho luật đến cả từ người xem, không chỉ từ góp ý.

## Khi nào, lấy gì
48 h và 7 ngày sau đăng, người dùng gửi ảnh chụp YouTube Studio: lượt xem, hiển thị, CTR · đồ thị giữ chân + % còn lại ở giây 30 + thời lượng xem trung bình · nguồn lưu lượng · kết quả thử nghiệm ảnh bìa.

## Ghi vào `<kênh>/analytics.csv` (một dòng mỗi mốc)
Cột: `impressions` · `ctr_pct` · `retention_30s_pct` · `avg_view_pct` · `browse_pct` · `drop_at` (mốc tụt dốc nhất ngoài 30 s đầu, mm:ss) · `drop_what` (video đang chiếu gì lúc đó — mở bản full tại mốc, chụp 1 khung) · `thumb` (file ảnh bìa).

## Rút bài học (mốc 7 ngày)
- So với 2–3 tập **cùng dạng, cùng kênh**.
- Thấy điểm rõ → 1–2 dòng vào reference đúng chủ đề, dạng `- (YYYY-MM-DD, số liệu tập …) luật — số liệu`. Bài học đúng cho mọi kênh (vd về 30 s đầu, ảnh bìa) → `studio-kit/`.
- Một tập chưa đủ kết luận: ghi "giả thuyết" ở cột `notes`; thành luật khi ≥ 2 tập cùng xu hướng.
- Không tự đổi luật người dùng đã chốt chỉ vì số liệu — đề xuất trong chat, người dùng duyệt rồi mới ghi.

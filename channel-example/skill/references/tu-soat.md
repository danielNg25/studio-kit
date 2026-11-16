# Tự soát — phần riêng Kênh Mẫu

**Phần chung (bắt buộc, đọc trước): `studio-kit/references/tu-soat.md`** — chạy `qa.py` trước, soát mắt sau, chấm 7 mục ≥ 8, ghi `build/review_log.md`, chưa có log thì chưa gửi. Lệnh QA vẫn chạy được từ kênh: `python3 tools/qa.py …` (vỏ gọi bản ở `studio-kit/tools/qa.py`).

## Thêm vào bảng điểm của kênh
| Mục | Xem gì |
|---|---|
| Cảnh đánh | so `episodes/xep-hang-cao-thu-tam-quoc/build/prev/mau_holao_v5.mp4`; dải 12 khung sạch ở điểm chạm (chương không đánh: ghi "—") |

## Checklist riêng kênh
- [ ] Kịch bản: hành văn MC ([hanh-van.md](hanh-van.md)); tên đọc đủ, không gọi tắt; không câu đùa tự nặn; xếp hạng mở và kết bằng hạng S.
- [ ] Mở đầu đúng cấu trúc kênh ([cau-truc.md](cau-truc.md)).
- [ ] Nhân vật: mặt đổi biểu cảm, miệng mấp máy khi nói; hạn chế chân đi/chạy; trên ngựa nửa người; không bóp dẹt; ngã thì nằm; trang phục đúng triều đại; mỗi người có điểm nhận ra.
- [ ] Đồ vật đúng chiều (cung, dao, đao, bình), vật chỉ tách đôi lúc bị chém.
- [ ] Nền 5 lớp, có lớp chuyển động, đủ sáng; đám đông là người thật; không vệt đỏ.
- [ ] Cảnh đánh: một mạch, không reset, zoom/rung đúng mức, không chớp trắng, không máu ([canh-danh.md](canh-danh.md)).
- [ ] Tiếng: giọng 0.95, soften "vừa"; nhạc −31 dB, tắt trước màn hình kết thúc.
- [ ] Bản full: `python3 tools/qa.py full <id>` (20 s cuối là màn hình kết thúc MC).

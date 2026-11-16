# Chữ trên hình và phụ đề — phần riêng Kênh Mẫu

**Phần chung: `studio-kit/DIRECTOR.md` §7** (ít chữ, không nhắc lại lời, không đè mặt, phụ đề 1 dòng, không in cứng bản đăng).

## Riêng kênh
- Font kênh `kText`/`thName`/`tqTxt`; chữ ghi chú đặt ngoài lớp máy (`kCam`). Ví dụ lỗi đã bắt: "chữ tên sách đè lên bìa".
- Giấy/thư có chữ đọc được (ít nhất dòng đầu đúng nội dung). Địa danh nước ngoài trên bản đồ giữ tiếng gốc (ZARAGOZA), lời đọc dùng phiên âm.
- Danh sách/huy hiệu luôn hiện hình + tên, không úp "?".
- Phụ đề bản full: `out/<id>_bio-long.vi.srt` (`WrapStyle: 2`). Shorts đo bề rộng bằng `one_line()` trong `episodes/tay-du-p1/build/shorts.py`.

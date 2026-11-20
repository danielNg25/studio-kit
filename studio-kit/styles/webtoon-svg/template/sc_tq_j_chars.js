// (bản công khai: đã bỏ dàn nhân vật của kênh, chỉ giữ phần mở rộng khung xương — tự thêm CHAR.<id> của bạn)
// ===== NHÂN VẬT THÊM cho tập này (dẫn xuất từ bộ Tam Quốc đã duyệt: chỉ đổi màu áo, râu tóc). CHƯA qua bảng duyệt nhân vật riêng.
const clC = (base, o) => Object.assign({}, CHAR[base], o);

// ===== TẬP CHÚA CÔNG (13/11): 5 chúa công chưa có mặt + nhân vật phụ. Mỗi người một điểm nhận ra ở ĐẦU/DÁNG (STYLE webtoon-svg). CHỜ DUYỆT C2: build/prev/nhan-vat-chua-cong.jpg

// ===== TẬP YÊU QUÁI TÂY DU (14/11): yêu quái chưa có mặt trong bộ Tây Du đã duyệt. Mỗi con một điểm nhận ra ở ĐẦU/DÁNG. CHỜ DUYỆT C2: build/prev/nhan-vat-yeu-quai_t1.jpg
const yqC = (base, o) => Object.assign({}, CHAR[base], o);

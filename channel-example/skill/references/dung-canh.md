# Dựng cảnh — phần riêng Kênh Mẫu

**Phần chung (đọc trước): `studio-kit/DIRECTOR.md` §2–6** (mỗi câu có việc, cắt có lý do, máy quay, người xem kịp hiểu, bố cục, diễn hoạt). Lỗi người dùng bắt nhiều nhất ở kênh: **cảnh tĩnh** ("vẫn chỉ 1 cảnh zoom ra zoom vào", 12/11) và **cắt cảnh vô lý** ("giống đang cố cắt cho được nhiều cảnh", 12/11).

## Riêng kênh
- Ví dụ "hình theo lời": "chém đôi quả cà" thì thấy dao chém quả cà và người xung quanh hốt hoảng; nhắc "gậy đánh chó" thì có cảnh đánh chó; "lột đồ" có người bị lột nằm dưới đất.
- Đổi địa điểm → mờ chồng ≤ 0,3 s; trượt ngang chỉ ~1/4 lần đổi địa điểm, không liên tiếp.
- MC không biến mất rồi vào lại giữa các shot cùng cảnh. Camera khi nói: cận người đang nói, bóng thoại hiện.
- Thần tiên đi trên trời cưỡi mây; khói/mây biến hình chỉ thoáng 0,5–0,8 s.
- Bóng thoại: đuôi chỉ đúng miệng; nước mắt ở khoé mắt, mồ hôi ở thái dương.
- Nền chuyển động liên tục (mây, cờ) thì được, nhưng mỗi chiêu/động tác lớn diễn một lần (cấm replay, kể cả màn chia đôi).
- (2026-11-13, tập xep-hang-chua-cong-tam-quoc) Không cho nhân vật nhảy lên một tí để "có chuyển động" (hop khi nói, khi đổi nét mặt, khi phản ứng, nhún lặp lại) — "bỏ cái hành động cứ 1 tí nhân vật cứ nhảy lên 1 tí đi ko hay tí nào". Diễn bằng tay, nghiêng người, nét mặt, di chuyển, đồ vật. Trong khuôn `tb` (sc_tq_k_tab.js) đặt hop = 0.
- (2026-11-13, tập vo-cong-hong-nguoi) Cùng luật trên, lần hai — "sao mấy tập này bị nhân vật đứng yên là cứ nhảy nhảy lên 1 tí vậy, hình như do luật ko đứng yên à?". LƯU Ý chỗ sửa: ở các tập có `sc_tq_l_b6.js`, hàm `tb` / `tbNhan` / `tbCard3` ĐANG CHẠY là bản trong `sc_tq_l_b6.js` (khai báo sau nên đè bản trong `sc_tq_k_tab.js`) — sửa `sc_tq_k_tab.js` không có tác dụng. BẢN 7 (đã áp cho 4 tập mưu sĩ / võ công / lãng xẹt / Lương Sơn): bỏ nảy khi đổi `b:`, bỏ nhún khi nói, bỏ nảy chu kỳ 0,9 s ở thẻ nhãn; `hop: mốc` chỉ còn là nghiêng người ~6° trong 0,3 s; nhảy thật dùng `jump:`. Khi giao agent dựng/rà: cấm `hop`/`jump` lặp theo chu kỳ (`Math.floor…`) để "khỏi đứng im" — lượt dung-tap đầu của tập võ công các agent đã tự thêm ~50 chỗ như vậy.
- (2026-11-13, tập vo-cong-hong-nguoi) Montage mở đầu: ít cảnh, mỗi cảnh ≥ ~2,5 s (DIRECTOR §1) — "show montage mấy chiêu bị cắt nhanh quá, nên giảm bớt môn để hiện dài hơn chứ chưa kịp nhìn gì". Mẫu đã sửa: `episodes/vo-cong-hong-nguoi/sc_tq_u_c00.js` (2 cảnh bám hai vế câu thay cho 5 cảnh × 1,4 s; ba nhát bổ trong một khung rộng thay cho cận từng người).

## Cách làm một chương
1. Mốc từng câu: `build/timeline.json`, `ctx.at('từ khoá', …)`.
2. Mỗi câu ghi "việc xảy ra trên hình" + "người xem phải hiểu gì" trước khi code.
3. `sh mkscenes.sh` → ảnh tĩnh mỗi 1 s + dải 12 khung ở đòn lớn/chuyển cảnh → chấm điểm, ghi `build/review_log.md` → sửa → clip xem thử 720p.
4. Gửi clip chương + điểm vòng cuối + 1–2 dòng.

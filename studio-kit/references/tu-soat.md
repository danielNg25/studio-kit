# Tự soát trước khi gửi (bắt buộc, mọi kênh)

Người dùng đã trách nhiều lần: "đã dặn phải review lại mà không làm". Soát hết **cả phần người dùng chưa xem**, sửa xong rồi mới gửi. Soát tổng thể trước (nhìn cả khung có hiểu ngay ai, ở đâu, làm gì?), chi tiết sau. Kênh có checklist riêng thì thêm từ skill kênh.

## Chạy máy trước, soát mắt sau — và cổng do CÔNG CỤ giữ, không do người dựng tự nhớ
Mỗi phần bắt đầu bằng `studio-kit/tools/qa.py` (TECHNIQUE §5): sửa hết LỖI, rồi soát mắt trên ảnh nó sinh. Qua script **không** có nghĩa là đạt.
(2026-11-13, tập Đài Loan – Trung Quốc) Bản xem 3 chương bị bác — "chất lượng vẫn chưa đạt… vẫn bị lỗi đầu lệch khỏi thân" — trong khi QA máy báo **0 lỗi, 26 cảnh báo** và không ai chạy cổng. Từ đó:
- **Cảnh báo không phải để đọc rồi bỏ qua**: mỗi cảnh báo phải được sửa, hoặc ghi miễn trừ có lý do trong `build/review_log.md` mục `## Miễn trừ` (tối đa 3 mỗi chương). "Phần lớn là biển trên bản đồ" không phải lý do — sửa cảnh.
- **Bản gửi chỉ làm bằng `studio-kit/core/preview.sh <clip>`**: lệnh này từ chối nếu `qa.py gate <clip>` chưa qua với đúng clip đó. Không tự gõ lệnh ffmpeg nén để gửi.
- **Người rà khác người dựng**: ai (agent nào) dựng chương thì không tự chấm đạt cho chương đó; mục soát mắt bên dưới do một lượt rà độc lập làm (workflow `dung-tap` có sẵn bước rà; làm một mình thì rà ở một lượt riêng sau khi dựng xong, mở từng ảnh, không rà bằng trí nhớ).
- Style có **phim mẫu** (vd comic-history: `styles/comic-history/reference/`): đặt khung hình của mình cạnh khung phim mẫu trước khi gửi. Thua rõ thì chưa gửi.

## Kịch bản (trước C1)
- [ ] `qa.py script <id>`: 0 lỗi; cảnh báo giữ lại thì có lý do.
- [ ] Đọc to một đoạn: nghe như người kể, không như sách (hành văn kênh).
- [ ] Mở đầu ≤ 30 s; "trả hàng" trong 90 s đầu; mỗi mục tự đủ nghĩa, có kết luận; kết ≤ 40 s có câu hỏi bình luận.
- [ ] Ước độ dài (tiếng/205 × 1,06) và số ký tự VBee.

## Rối (trước khi dựng chương đầu tiên — cổng C2; chạy lại mỗi khi tách lại tấm hoặc sửa khai báo rối)
- [ ] `python3 studio-kit/tools/rig_gate.py <thư mục dựng>` (hoặc `qa.py rig <thư mục dựng>`): **0 lỗi**. Khớp nào tấm không có ghim thì khai tay, không để engine đoán.
- [ ] Mở từng ảnh `qa/rig/<rối>.jpg`: cằm đè lên cổ áo, không hở cổ, không lệch trục, bốn mặt trùng vị trí, nghiêng ±10° vẫn kín.
- [ ] Tấm ráp thử `index.html?ch=rb`: vai, khuỷu, hông, chân đúng chỗ ở mọi tư thế; các rối cùng loại cao đều nhau.

## Hình (trước khi gửi mỗi chương / lô)
`qa.py gate <clip>`: 0 lỗi (gồm cổng rối, `qa.py video`, và soát mức trang `core/pagecheck.mjs` với style có rối). Rồi xem ảnh **mỗi 1 s** (hoặc bảng ghép ảnh tĩnh dày) cho cả chương, thêm:
- **Dải 12 khung liền** ở mỗi đòn/biến cố lớn và mỗi chỗ chuyển cảnh (ảnh mỗi giây không trúng khoảnh khắc ≤ 0,2 s).
- **Ảnh ghép cỡ điện thoại** (rộng 360 px): chữ còn đọc được, mặt còn nhận ra.
Soát:
- [ ] Không cảnh tĩnh (zoom không tính); hình theo lời, đúng thứ tự; việc xảy ra lúc máy đang ở đó.
- [ ] **Không ai đứng yên mà nảy/nhảy lên một tí** (chạy `studio-kit/tools/hopcheck.py <clip>` rồi mở dải khung nó sinh ra; ảnh mỗi giây và `qa.py` không bắt được; dò thêm trong mã: `hop:`/`Math.floor` lặp chu kỳ). "Đứng im" sửa bằng diễn theo lời, không bằng nảy (DIRECTOR §2).
- [ ] Dựng nhanh/montage: ≤ 2–3 cảnh một câu, mỗi cảnh ≥ ~2,5 s, kịp nhìn trọn một việc (DIRECTOR §1).
- [ ] Cắt cảnh có lý do; không chớp trắng/khung đen; nhân vật không biến/vào lại; không lặp động tác.
- [ ] Màn hình không trống ở đầu shot; chữ không biến mất khi lời còn nói về nó.
- [ ] **Không gì che mặt nhân vật**; chữ không đè mặt/chữ khác, không bị cắt mép; nhân vật cùng loại cao đều nhau.
- [ ] Đủ chi tiết: 3 lớp sâu, ≥ 3 đồ vật đúng thời, nguồn sáng, không mảng trống lớn (DIRECTOR §5).
- [ ] Bản đồ / người thật / nghi vấn đúng DIRECTOR §8.

## Tiếng
- [ ] Đúng tốc độ, nhịp nghỉ chuẩn (TECHNIQUE §2), tên riêng đọc đúng; nhạc đúng mức, tắt trước màn hình kết thúc; không tiếng động trừ khi kênh đã duyệt.
- [ ] Bản full: `qa.py full`/`qa.py srt` 0 lỗi (−16 LUFS, phụ đề 1 dòng); không phụ đề cứng.

## Ảnh bìa
- [ ] Đọc được chữ ở 320×180; không góc dưới phải; mặt rõ chi tiết ([anh-bia.md](anh-bia.md)).

## Soát mắt ĐẠT / HỎNG và nhật ký soát (mỗi chương) — do lượt rà độc lập làm
Thang 1–10 tự chấm đã để lọt bản bị bác (2026-11-13) → đổi sang **ĐẠT / HỎNG**, mỗi mục có tiêu chí đo được. **Một mục HỎNG = chưa gửi.**
Mục chung mọi style: **Theo lời** (hình đúng câu đang đọc, đúng thứ tự) · **Kịp hiểu** (mỗi cảnh một ý, nhìn 1 s là biết ai–ở đâu–làm gì) · **Không đứng im** (mỗi câu lời có thay đổi nhìn thấy trong 1 s đầu; không quãng im > 2,5 s) · **Lấp khung** (không mảng phẳng > 30 % khung, ≥ 3 lớp sâu) · **Chữ** (≤ 4 khối cùng lúc, đọc được ở 360 px, không bị cắt mép, không đè mặt) · **Điện thoại** (ảnh 360 px: mặt còn nhận ra) (+ mục signature của kênh, vd "Cảnh đánh" ở Kênh Mẫu).
Thêm cho style có rối (comic-history — ngưỡng ở `styles/comic-history/STYLE.md` mục Chuẩn chất lượng):
- **Khớp rối**: đầu ngồi đúng cổ ở mọi khung có rối (soi dải khung quanh mỗi lần đổi mặt/nghiêng đầu).
- **Cỡ và sự có mặt của rối**: rối chính ≥ 0,60 chiều cao khung; rối/người giấy có mặt ≥ 50 % chương.
- **Mật độ diễn**: con đang dẫn đổi tư thế mỗi ~1,5 s, có phản ứng của con kia; đổi mặt đúng lúc; không idle hình sin.
- **Hành động giấy và hiệu ứng**: mỗi ý lớn có một hành động giấy đủ lớp (đà–giữ–chạm–rung–vụn–thu về); ≥ 4 loại mỗi chương.
- **So với phim mẫu**: đặt 3 khung của chương cạnh 3 khung phim mẫu — không thua rõ về cỡ rối, độ kín nền, màu.
Thêm cho style stick-3d (ngưỡng và cách đo ở `styles/stick-3d/STYLE.md` mục Chuẩn chất lượng; cổng máy là `engine/tools/gate.py`):
- **Cỡ nhân vật**: cỡ trung là mặc định, đầu chiếm 30–60 % bề ngang khung; cảnh rộng chỉ 1–2 s.
- **Máy không đứng, nền có chất liệu**: không bố cục nào đứng hẳn; nền của cận cảnh không trống, không nhoè mất hết nét.
- **Diễn theo lời**: luôn có một người trên hình đang đổi dáng hoặc nét mặt đúng từ; dáng có lực, không đứng thẳng đơ.
- **So với video mẫu**: ghép cặp khung của ta / của họ ở cỡ đầy đủ (`engine/tools/compare.py`), nhìn nhân vật trước.
- **Nét vẽ của bối cảnh**: cắt một cảnh rộng ở cỡ gốc đặt cạnh khung mẫu; mọi cạnh của nhà/đồ vật có viền mực đậm (đo bằng điểm ảnh, không ước bằng mắt), tường và mái có đường kẻ và vệt bẩn, cửa sổ có khung–kính–đố. Thiếu là HỎNG dù các thước khác qua (cổng: M1, C7).
Ghi vào `build/review_log.md`:
```
## Chương N — vòng K (YYYY-MM-DD HH:MM) — rà: <ai/agent nào, khác người dựng>
Soát mắt: Theo lời ĐẠT · Kịp hiểu ĐẠT · Không đứng im HỎNG (01:12–01:16) · Lấp khung ĐẠT · Chữ ĐẠT · Điện thoại ĐẠT · Khớp rối ĐẠT · Cỡ rối ĐẠT · Diễn HỎNG (Mao đứng im 01:05–01:11) · Hành động giấy ĐẠT · So mẫu ĐẠT
Đã sửa: …   (vòng sau chấm lại)
sha256 1a2b3c4d   (8 ký tự đầu sha256 của clip đã render — cổng dùng để biết vòng rà này là của đúng clip đó)

## Miễn trừ
- V7 01:12–01:16: lý do cụ thể (vd cảnh nghiêm có chủ đích, khoá máy)
```
Cổng (`qa.py gate <clip>`) đọc đúng định dạng này: mỗi chương của clip phải có một vòng `## Chương N … (YYYY-MM-DD HH:MM)`, vòng cuối có dòng `Soát mắt:` **không chứa chữ HỎNG** và dòng `sha256 …` của clip (không ghi sha256 thì file hình của chương không được mới hơn vòng rà quá 60 s). Miễn trừ: **mỗi dòng chỉ miễn một phát hiện** (cùng mã, phủ ≥ 50 % khoảng thời gian), tối đa 3 dòng mỗi chương; không miễn được lỗi rối (R1, P8, P9), lỗi không kiểm được (P0), khung đen/không tiếng (V11).
**Chưa có vòng rà toàn ĐẠT trong review_log, hoặc `qa.py gate` chưa qua = chưa được gửi.** Không còn ngoại lệ "đăng gấp được gửi với mục chưa đạt": gấp thì gửi ít chương hơn. Chấm trên **bản gốc 1080p**, không chấm bản nén.

## Khi gửi
Clip/ảnh + điểm vòng cuối (một dòng) + 1–3 dòng: đã sửa gì, còn gì chưa chắc. Không kể lại từng bước.

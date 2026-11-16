# Cảnh đánh — SIGNATURE của kênh

Người dùng: "signature của kênh chúng ta là hiệu ứng đánh nhau, chiêu thức đã mắt, cần apply cho tất cả video". Mẫu chuẩn hiện tại: `episodes/xep-hang-cao-thu-tam-quoc/build/prev/mau_holao_v5.mp4` (mã `sc_tq_m_mau.js`, `sc_tq_a_kit.js`) — mở ra so trước khi gửi bất kỳ cảnh đánh nào.

## Kế hoạch
- Scene plan có mục **"Cảnh đánh"** riêng: bảng shot ★/★★/★★★, nhịp tụ lực → giao chiêu → đòn kết, chiêu/hiệu ứng, tên chiêu, căn cứ trong truyện. Mỗi chương ít nhất một cảnh đã mắt; truyện ít võ cũng đào khoảnh khắc thể hiện sức mạnh.
- Cảnh đánh mới của tập: dựng **một cảnh mẫu** (trận nổi tiếng nhất) gửi duyệt trước (C4), rồi mới áp cả tập.
- Cảnh ngắn hơn ~9 s thì gộp câu dẫn trước đó làm nhịp dồn.

## Nhịp và mạch
- Tối thiểu 3 nhịp: tụ lực/áp sát → giao chiêu (đỡ, chạm) → đòn kết. Có mở – dồn – bùng, không "đứng đánh".
- **Một mạch liền, không dựng lại hình giữa các lượt**: xong đòn thì lùi ra rồi áp vào; vị trí/tư thế/hướng cuối nhịp này = đầu nhịp sau. Đặt vị trí bằng mốc `smK` liên tục cho cả cảnh, không ghép nhiều `xfJoust` rời.
- Quay mặt = bật ngay trong 1 khung (face ±1), không quay từ từ, không nội suy face (gây kéo ngang người).
- Mỗi đòn một kiểu (đâm / bổ / quét / gạt) với vệt binh khí (`fmArc`, `fmThrust`), tia lửa; chữ tượng thanh thưa (không phải đòn nào cũng có).
- Người mạnh hơn phải THẤY mạnh hơn: ép lùi, một mình gạt nhiều hướng, có quầng sáng; đuối sức có mồ hôi, tay hạ.
- Có bộ đếm hiệp khi lời nêu số hiệp; bụi vó ngựa, vệt tốc độ lúc phi.
- Chiêu khí công: tụ khí (`fxCharge`, `qiSwirl`) → bùng; chiêu **tách khỏi tay** sau khi tung (chưởng rồng bay đi nhanh tới đích, không bám tay; vuốt thì xoẹt ngang). Tia bắn ra từ đầu ngón/bàn tay và đi đúng hướng tay chỉ — muốn bắn ngược thì nhân vật quay người.
- Phép thuật (biến hoá, phân thân, định thân…) cũng là chiêu: tụ khí, loé, khói có lớp, hạt sáng.
- Nhiều loại chiêu, mỗi loại hiệu ứng riêng: thư viện `studio-template/packs/style/webtoon-code-v1/fx_moves.js` (vệt vung, đâm, múa tít, biến hoá, phân thân, cân đẩu, sét, băng, nứt đất, lửa cuộn, trói, bàn tay Phật, bộc phát khí, gió). Chiêu mới thì thêm vào thư viện, không viết lẻ trong tập.
- Trận dài liên tục (300 hiệp): đánh liên tục lao vào – chạm – lùi, không cắt cảnh, nền đứng yên.

## Va chạm
- Hiệu ứng tại ĐIỂM CHẠM (`xmGlint`): tia loé hình sao, vệt sáng ngang, vạch hội tụ, quầng cam, cộng sáng.
- **Tuyệt đối không chớp trắng cả màn hình**, không máu.
- Đòn lớn (2–3 đòn/cảnh, then chốt): khựng 0,1 s, nền tối ~55 % trong 0,6 s cho người đánh nổi lên, tia loé to. `hitStop` chỉ cho đòn kết (≤ 0,12 s); giao chiêu, đỡ đòn không khựng.
- Người trúng đòn văng/ngã nằm hẳn dưới đất; không máu me.

## Máy quay (mức đã chốt sau 3 vòng)
- Đòn thường: zoom +0,06, gần như không lia theo điểm chạm (kéo tâm ≤ 15 %).
- Đòn lớn: zoom +0,24, kéo tâm về điểm chạm ~60 %, nhả chậm.
- Đoạn dồn dập (≥ 2 đòn/giây): không zoom theo đòn, chỉ rung.
- Rung: 7–10 px, 0,2 s mỗi đòn.
- Máy nền: khung rộng vừa đủ thấy trọn hai người, mỗi nhịp một lần đẩy vào chậm (1,03 → ~1,12; cao trào 1,22); không lia trái–phải theo từng người, không thừa khoảng trống trên đầu.
- Nhận xét đã có: "zoom ra zoom vào nhiều quá đau đầu" (quá nhiều) · "ít zoom quá" (quá ít) · bản 5 "đẹp rồi".

## Luật cũ vẫn giữ
Không lặp chiêu; hai bên quay mặt vào nhau; hiệu ứng không che mặt nhân vật chính; dây xích/vòng trói không cắt ngang mặt, bắt đầu từ cạnh người; ba đầu sáu tay thì bản sau quay ngược để tay vươn ra sau; khói hương ra khói thật, đốt đồ có lửa.

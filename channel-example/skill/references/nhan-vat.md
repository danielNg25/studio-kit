# Nhân vật — phần riêng Kênh Mẫu

**Phần chung**: style `studio-kit/styles/webtoon-svg/STYLE.md` (vẽ, điểm nhận ra, diễn, đồ cầm, bảng duyệt C2) + `studio-kit/DIRECTOR.md` §6 (nguyên tắc diễn hoạt: lấy đà, đi trễ, lệch pha, nhanh–chậm, đường cong, mắt trước người sau).

## MC (người dẫn)
Đầu thằn lằn be xám đốm nâu, áo phú hộ đỏ vá, dây thừng, mẻ kho, răng vàng, đuôi, nón tre; tay luôn tròn không ngón; đứng yên = không tay. Không tự giới thiệu. Không giống con Shiba kênh Facebook của người dùng.

## Nhân vật đã duyệt (giữ mặt, chỉ thêm bản ra trận)
Quan Vũ, Trương Phi, Lưu Bị, Triệu Vân, Tào Tháo… Điểm nhận ra mẫu: Lữ Bố hai lông trĩ + giáp đỏ; Mã Siêu bờm trắng; Hứa Chử da hổ; Điển Vi sẹo + song kích; Hạ Hầu Đôn bịt mắt. Không tai rủ quá cỡ.
Nhân vật riêng bộ truyện để file riêng (vd `chars_tdk.js`, `build/design/chars_xtq.js`). Pack dùng chung → so md5 trước khi ghi.

## Triều đại
Nhà Thanh cạo nửa đầu + tết bím + áo cài khuy; Tống/Minh/Nguyên người Hán búi tóc, áo giao lĩnh; quân Mông Cổ tóc tết hai bên, mũ lông. Ghi triều đại trong kế hoạch nhân vật.

## Diễn riêng kênh
- Hạn chế vẽ chân đi/chạy (người dùng 12/11: "làm không đẹp"); lính đi đông thì vẫn có chân bước.
- Trên ngựa nửa người (mức cắt B, XF_SEAT 140, `xfRider`); chỉ hiện cả người khi ngã ngựa.
- Mũi tên găm vào người thì theo người khi ngã.

## Thẻ giới thiệu nhân vật
Mỗi người một thẻ riêng (màu nền, hoạ tiết theo biệt hiệu, kiểu xuất hiện): nền tối, tia sáng xoay, vòng mực đỏ, tàn lửa; nhân vật cả người cầm binh khí đáp xuống; tên to trên vệt mực đỏ; biệt hiệu trên dải lụa; đứng đủ vài giây. Mẫu: `xep-hang-cao-thu-thuy-hu/sc_xh_kit_intro.js`.

## Dấu hiệu phải thấy từ bóng dáng (2026-11-16)
Người dùng (bảng Cổ Long bản 1): "nhân vật ko có điểm riêng gì cả". Bản 1 chỉ đổi màu áo + phụ kiện nhỏ (khăn trán, trâm, sẹo mảnh) trên cùng một khuôn búi tóc + áo giao lĩnh → nhìn như một người. Mỗi nhân vật phải có MỘT dấu hiệu lớn làm đổi đường viền: nón/mũ (đấu lạp, phốc đầu, luân cân, kim quan), tóc (xõa dài, đuôi ngựa, dựng tua tủa), áo choàng xòe, râu rậm, khổ người (to bè/nhỏ con), hoặc đồ cầm lớn đặc trưng truyện (cần câu, chổi, mặt nạ, kiếm sau lưng). Không hai người cùng một dấu hiệu. Soát bằng cách che mặt đi: còn nhận ra không.

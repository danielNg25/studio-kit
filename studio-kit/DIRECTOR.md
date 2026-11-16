# DIRECTOR — luật đạo diễn dùng chung

Luật đã được người dùng duyệt qua các tập kênh mẫu và tập Jensen (Hóng). Kênh có thể thêm luật riêng trong skill kênh; khi khác nhau, **luật kênh thắng**.

## 1. Cấu trúc video dài
- Khung: mở đầu (≤ 30 s) → (lời kêu gọi nếu kênh có) → các chương/mục → kết (≤ 30–40 s) → màn hình kết thúc (~20 s, nhạc tắt trước ~3 s).
- **Mở đầu**: nhanh, đi thẳng vào chuyện chính. Mở bằng khoảnh khắc mạnh nhất mà người chưa biết vẫn hiểu (cold open); không "Nếu bạn từng xem…", không montage dài, không teaser nhiều chuyện, không hứa kéo xem tới cuối.
- **10 giây đầu phải bắt mắt bằng chuyển động**, không phải bằng chữ (Jensen 13/11: giấy bung, bút viết từng vế, dấu đỏ đóng trúng tiếng bíp, nhân vật trượt, quất sang cảnh sân khấu có mưa xu). **Không mở bằng cả trang/toàn cảnh rồi phóng vào ô đầu** — vào thẳng cảnh đầu (người dùng 13/11).
- (2026-11-13, tập vo-cong-hong-nguoi) **Dựng nhanh/montage ở mở đầu: ít cảnh, mỗi cảnh đủ lâu để kịp nhìn** — tối đa 2–3 cảnh cho một câu, mỗi cảnh ≥ ~2,5 s và trọn một việc (lấy đà → việc chính → giữ ~1 s), cắt đúng chỗ ngắt vế câu; không cắt cận từng người 0,6 s. 5 cảnh × 1,4 s bị chê — "show montage mấy chiêu bị cắt nhanh quá, nên giảm bớt môn để hiện dài hơn chứ chưa kịp nhìn gì".
- **60–90 s đầu phải "trả hàng"**: một phán quyết, một trận đánh, một chi tiết sốc. Không mở thân bằng địa lý, gia phả, số đo.
- **Mỗi mục tự đủ nghĩa** (người xem hay bật nền, chỉ nghe từng mục); mỗi mục có kết luận rõ; nhịp kết luận 70–110 s.
- Mở mỗi mục bằng thứ người xem đã biết hoặc muốn thấy; lai lịch kể sau, ngắn. Chương nhiều chuyện rời phải có sợi dây nối.
- Không khoảng im lặng/thẻ không lời. Đọc luật/tiêu chí: một câu + hình đang chạy.
- Kết: trả lời câu hỏi của tập → câu cảm xúc cuối → câu hỏi bình luận đọc thành lời → (tập có phần sau) câu hẹn, không nêu tên tập sau.
- Tập tiếp nối: tóm vị trí + câu hỏi ≤ 15 s, không kể trước chuyện trong tập, xem được độc lập.

## 2. Mỗi câu có việc xảy ra
- Hình chính không đứng yên quá ~2,5 s. **Đổi cỡ máy (zoom) KHÔNG tính là hoạt động** — hoạt động là nhân vật/đồ vật làm đúng việc lời đang nói.
- **Hình theo đúng lời, đúng thứ tự**; không thêm hành động lời không nói. Hành động trong lời phải diễn đủ.
- Lấp khoảng giữa các nhịp bằng hành động khác nhau, không lặp một động tác. Cấm loop/replay để lấp thời gian.
- (2026-11-13, kênh mẫu: tập xep-hang-chua-cong + vo-cong-hong-nguoi) **"Không đứng yên" KHÔNG có nghĩa là cho nhân vật nảy/nhảy lên một tí** (khi nói, khi đổi nét mặt, khi phản ứng, hay lặp theo chu kỳ) — "bỏ cái hành động cứ 1 tí nhân vật cứ nhảy lên 1 tí đi ko hay tí nào" · "sao mấy tập này bị nhân vật đứng yên là cứ nhảy nhảy lên 1 tí vậy". Người đứng yên chỉ thở + chớp mắt; muốn có việc thì diễn đúng lời: tay, nghiêng người một lần, quay đầu, nét mặt, di chuyển, đồ vật. Nhảy thật chỉ khi việc đang kể đúng là nhảy.
- **Việc trên hình phải xảy ra lúc máy đang ở panel/cảnh đó** — neo theo chữ trong lời (`Wd(i,'chữ')`), không theo giây cứng.

## 3. Cắt cảnh và máy quay
- Mỗi lần đổi cảnh vì lời chuyển sang người/nơi/việc khác; không cắt đều mỗi câu. Cùng bối cảnh → cắt thẳng/giữ khung.
- Không chớp trắng, không khung đen; nhân vật không biến mất rồi vào lại trong cùng cảnh, không reset tư thế.
- Giữ cảnh lâu (cảnh nghiêm, bảng dữ liệu) thì cho máy đẩy rất chậm ~4 % để không "đứng im" (comic history: `camSeq(..., drift=0.045)`).
- Máy ngang tầm người, không quá cao; giây đầu shot chỉ đẩy vào thẳng, nhẹ. Không bay máy xuyên song cửa/lan can vô cớ; không viền đen/khung nhỏ vô cớ; không lạm dụng tối bốn góc. Không để bóng đen rồi nhảy ra người thật.
- Chuyển giữa các chương bằng động tác của style (trang giấy trượt khỏi bàn, lật trang…), không hiệu ứng chuyển cảnh chung chung.

## 4. Người xem kịp hiểu (học từ ANIMATION_GUIDE repo painted-animation)
- Mỗi lúc **một** việc quan trọng; nguyên nhân xong rồi mới tới phản ứng.
- Động tác nhanh, ý nghĩa giữ lâu: sau đòn kết/tiết lộ/câu nổi tiếng giữ ~0,8–1 s (vẫn thở, không nảy).
- Dẫn mắt trước: nhân vật quay nhìn, vật sáng lên, máy đẩy về đó. Vật nhỏ/xa/mép khung cần thêm thời gian.
- Độ dài cảnh theo số việc cần hiểu; việc cuối chương cần thời gian đọng lại.

## 5. Bố cục, chi tiết, nền
- Nhân vật tương tác quay mặt vào nhau; nhóm đông xếp thưa, lệch pha nhịp thở; đồng nhất cỡ cảnh trong một cảnh.
- **Không gì che mặt nhân vật chính** (đồ cầm, vật bay, phiếu chữ, màn hình, biển chỉ đường) — lỗi bị bắt nhiều nhất ở tập Jensen.
- Nhân vật xuất hiện từ phía đúng của bối cảnh (lính ra từ cổng thành, khách vào từ cửa); người rơi/ngã giữ tỉ lệ, không đè nhóm khác.
- Đồ cầm tay đúng chiều, nằm trong tay, không tự trôi; đồ bê/ôm phải nằm trước ngực, không che mặt.
- Mọi rối/nhân vật cùng loại phải **cao đều nhau** dù nguồn khác nhau (comic history: đặt `hh` = chiều cao px, không đặt `s` tuỳ tiện — tấm Gemini mỗi tấm một độ phân giải).
- **Mỗi khung có đủ chi tiết** (người dùng 13/11 "cần dựng cảnh chi tiết hơn"): 3 lớp sâu (nền · giữa · trước, có bóng đổ), ≥ 3 đồ vật đúng thời/đúng nơi, một nguồn sáng có quầng, nhân vật chính ≥ 1/3 chiều cao khung ở khoảnh khắc chính (**style rối giấy comic-history: ≥ 0,60 khung** — STYLE.md mục Chuẩn chất lượng), không để giữa khung là tường/biển/giấy trơn (ô màu phẳng lớn nhất ≤ 30 % khung). Style còn dùng trang truyện thì mỗi chương có ít nhất một panel hẹp/ô chèn để nhịp thay đổi (kênh Hóng: mỗi màn một cảnh 16:9 đầy khung, không panel hẹp).
- Nền phải sống: luôn có ít nhất một lớp chuyển động (mây, cờ, hạt bay, màn hình nhấp nháy). Cảnh tối vẫn đủ sáng thấy người. (Ngoại lệ — rối giấy comic-history, học phim mẫu Lemo 13/11: nền đứng yên hoàn toàn; chỉ rối, giấy và máy quay động, nên rối phải diễn dày và máy phải trôi nhẹ.)
- Mỗi địa điểm một nền riêng, không dùng chung một nền đổi biển tên.

## 6. Diễn hoạt (chuyển động bằng code đỡ máy móc)
(2026-11-13, phân tích phim mẫu Lemo — `styles/comic-history/reference/analysis/01-dien-xuat.md`) **Cú mạnh có đủ 5 lớp**: đà ~0,5 s → giữ đỉnh và run ~0,35 s → đánh ~0,15 s với một hình trung gian → chạm (rung máy, nét mực, vụn giấy, vật/người bên cạnh phản ứng) → giữ 0,6–1 s → thu về có vượt. Cú lặp lại ngắn dần. **Một người dẫn, người kia phản ứng**; nét mặt ý định đi trước cử chỉ, nét mặt phản ứng đến trễ 0,1–0,5 s. Với rối giấy: idle là động tác có chủ đích, không thở/lắc hình sin đều.
Lấy đà 0,1–0,2 s trước động tác lớn · tóc/vạt áo/cờ đi trễ rồi nảy · lệch pha giữa người và giữa hai tay · nhanh–chậm (ease), vật nặng chậm, vật nhẹ nảy · vật bay theo đường cong · mắt/đầu quay trước thân ~0,15 s · tư thế chạy trên "nhịp hai" (12 tư thế/giây) nếu style là rối giấy. Quay 180° = lật một khung. Không bóp dẹt để diễn ngồi/nằm. Hạn chế vẽ chân đi/chạy nếu style không làm đẹp được (bước nhún thay thế).

## 7. Chữ trên hình và phụ đề
- **Ít chữ.** Không chữ nhắc lại đúng câu đang đọc. Giữ: tên người lần đầu, địa danh, năm, con số then chốt, câu nói nổi tiếng.
- Chữ không tràn khung, không đè mặt/chữ khác, không bị máy cắt; tiếng Việt, không chữ Hán; font của style/kênh.
- **Phụ đề: không in cứng ở bản đăng** — đi bằng file `.vi.srt`, mỗi cue **1 dòng** (câu dài tách tại dấu phẩy). Phụ đề in sẵn chỉ cho bản xem thử/Shorts (người dùng 13/11).

## 8. Nội dung nhạy cảm
- **KHÔNG theo §13 "Maps" của `vendor/lemo-opuscar/DIRECTOR.md`** (Lemo bắt vẽ đường lưỡi bò và bản đồ theo góc nhìn Trung Quốc) — kênh Việt dùng luật dưới đây.
- **Bản đồ cho kênh Việt**: mọi bản đồ có Biển Đông phải có **QĐ. Hoàng Sa và QĐ. Trường Sa thuộc Việt Nam, có nhãn**; không vẽ đường lưỡi bò; Trung Quốc/Đài Loan/láng giềng màu trung tính. Không cần bản đồ thì đừng vẽ (Jensen ch10 dùng nhãn thay bản đồ). Dữ liệu Natural Earth không có hai quần đảo → vẽ thêm theo toạ độ thật (`styles/comic-history/template/tools/map.py`).
- **Người thật có tên trong câu chuyện** (người nổi tiếng, doanh nhân, nhà khoa học, chính khách…): **vẽ biếm hoạ giống mặt, nhận ra được** theo style của tập (người dùng 13/11: "nhân vật thì đổi luật lại là vẽ giống mặt") — nét mặt, kiểu tóc, kính, trang phục đặc trưng; vẫn là tranh/rối giấy, không ảnh thật. Giữ: không vẽ người thật trong cảnh tình dục, bạo lực, nhục mạ; việc chỉ là cáo buộc thì không diễn như sự thật (chỉ giấy tờ, tờ báo, dấu "nghi vấn"). Người chưa được nêu tên trong nguồn/kịch bản → bóng không mặt, không tên. **Không dùng cùng một rối cho hai người khác nhau trong cùng một chuyện nhạy cảm** (dễ gây hiểu nhầm là một người).
- Cáo buộc chưa chứng minh luôn ghi "nghi vấn / chưa được chứng minh" trên hình đúng lúc lời nói.
- Không chính trị hiện đại ngoài phần kịch bản bắt buộc; chính khách có tên trong kịch bản được vẽ biếm hoạ giống mặt nhưng trung tính (không châm biếm, không bình luận).
- Nhân vật hư cấu từ tác phẩm có phim chuyển thể (kênh mẫu): vẫn **không** vẽ giống diễn viên — luật giống mặt chỉ dành cho người thật được kể.
- Không máu, không xác: cắt trước lúc chạm, người ngã thì nằm.
- Chương nghiêm/bê bối: bảng màu trầm, không tiếng động vui, nhạc u ám.

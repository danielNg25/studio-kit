# stick-3d — người que đầu tròn trong bối cảnh 3D (kiểu Ricks Clips / Situational Stories)

Shorts dọc 1080×1920, 30 fps, 40–65 s. Nhân vật 2D vẽ bằng code (đầu trắng to, thân hạt đậu, tay chân nét đơn) đứng trong bối cảnh 3D thật,
máy quay bay liên tục, mọi thay đổi hình neo vào từ của lời đọc. Phim = dữ liệu (`film.json`), không viết code cảnh cho từng phim.

- Engine: `engine/` (liên kết tới `video/rick-short/engine/`; cách chạy và mọi tên hợp lệ ở `engine/README.md`). Không cài thêm thư viện: three.js r147 và bộ render có sẵn của studio.
- Nghiên cứu gốc (29 video Ricks Clips, đọc từng shot): `video/rick-short/docs/01`–`04`. Số đo chuẩn: [reference/do-chuan-2026-11-14.md](reference/do-chuan-2026-11-14.md).
- Hai kiểu con dùng chung engine, khác phụ đề và đồ hoạ:

| | Kiểu Ricks (mặc định) | Kiểu Situational (`"captions": {"style": "caps"}`) |
|---|---|---|
| Phụ đề | 1 dòng, chữ thường, trắng, 1–3 từ mỗi card, tâm ở 70,3 % chiều cao, đổi tức thì | mỗi từ một card, IN HOA, chữ tròn rất đậm, từ khoá có màu, tâm ở 66,4 %, nảy vào 3 khung |
| Đồ hoạ phủ | không có; chữ nằm trên đạo cụ trong cảnh | thẻ tên có chân dung, ngoặc góc, tiêu đề lớn, nhãn địa điểm (`"hud"`) |
| Nhịp | 23–38 bố cục mỗi 60 s, cắt cứng 0–3 | khoảng 60 bố cục mỗi 60 s, nhiều cắt cứng và quất máy |
| Tay chân | nét mực đơn | ống có màu: tay trắng, quần màu, giày |

## Chuẩn chất lượng — đo từ video của họ (người dùng 14/11/2026: "update lại luật và qa các thứ để luôn đạt được kết quả consistent chất lượng cao như họ")

Mọi ngưỡng nằm ở [qa.json](qa.json), đo bằng cùng một thước trên 30 video mẫu. Mức CHẶN đặt ngoài đoạn yếu nhất của họ; mức CẢNH BÁO quanh p10–p25 của họ.
Qua cổng nghĩa là bản của ta nằm trong dải bình thường của kênh mẫu, không chỉ trên đáy.

| Thứ đo | Kênh mẫu (trung vị · p10 · yếu nhất) | Chặn | Cảnh báo | Bản đầu của ta (đã bị chê / tự thấy thua) |
|---|---|---|---|---|
| Chuyển động: điểm ảnh đổi mỗi khung (V4) | 0,248 · 0,122 · 0,067 | < 0,055 | < 0,15 | clone bản 1: 0,093 |
| Khung có động (V3C) · đứng im dài nhất (V2) | 0,996 · 0,974 · 0,859 · dài nhất 1,25 s | < 0,80 · > 2,0 s | < 0,97 · > 0,8 s | — |
| Vùng phẳng trung bình (V6) | 0,281 · p90 0,383 · cao nhất 0,522 | > 0,56 | > 0,38 | đèn thợ mỏ v2: 0,393 |
| Mật độ nét trung bình (V8) | 0,139 · 0,087 · 0,068 | < 0,062 | < 0,10 | đèn thợ mỏ v2: 0,082 |
| Mật độ nét của các khung thưa nhất (V8P) | 0,082 · 0,048 · 0,029 | < 0,026 | < 0,055 | đèn thợ mỏ v2: 0,019 |
| Bão hoà màu (V9 thấp, S1 cao) | 0,466 · p10 0,352 · p90 0,557 | > 0,72 | < 0,33 hoặc > 0,60 | đèn thợ mỏ v2: 0,678 · clone bản 1: 0,293 |
| Có nhân vật rõ trong khung (H1) | 0,57 · 0,38 · 0,18 | < 0,18 | < 0,38 | — |
| Đầu nhân vật lớn nhất / bề ngang khung (H2) | 0,217 · 0,167 · 0,100 | < 0,10 | < 0,167 | đèn thợ mỏ v2: 0,148 |
| Mọi nhân vật trên hình cùng đứng nguyên dáng (P6) | luật studio: không quãng im > 2,5 s | > 3,0 s | > 2,0 s | đèn thợ mỏ v2: 2,92 s |
| Khung đen, chớp trắng (V11) | không có | bất kỳ | — | đèn thợ mỏ v2: 1 khung đen giữa cú quất máy |
| Khung lạ một khung (F1, soi từng khung) | 4 khung trong 11 video, đều là chớp có chủ đích | bất kỳ khung nào chưa khai `flash_ok` | — | đèn thợ mỏ v3: khung 35, đầu nhân vật lọt sát ống kính che 1/3 hình |
| Khung trống mỗi 10 s (E1: mật độ nét < 0,012) | nhiều nhất 1,0 | > 3 | > 1 | đèn thợ mỏ v3: 2 khung trong 10 s (quất máy xuyên vùng tối) |
| Nét mực ở các cảnh rộng (M1: nhóm 10 % khung giàu nét nhất, `inkscan.py`) | 0,056 · 0,025 · 0,0227 | < 0,020 | < 0,026 | đèn thợ mỏ v4: 0,0230 (v6: 0,0348) · clone bản 1: 0,046 trong khi đoạn gốc 0,096 |

Bản dựng so sánh (dựng lại một đoạn của họ) chấm thêm C1–C7: số của ta so với số của đúng đoạn gốc (chuyển động ≥ 0,8 lần, nét ≥ 0,85 lần, bão hoà và độ sáng lệch ≤ 0,06, cỡ nhân vật ≥ 0,8 lần, nét mực ở cảnh rộng ≥ 0,7 lần).

## Nhìn
- **Nhân vật là mảng sáng nhất và sạch nhất trong khung.** Đầu trắng to (khoảng 1/3 chiều cao người), viền tím than dày 3,5–4 % bề ngang đầu, mặt chỉ có mắt, mày, miệng.
- **Nhân vật phải TO.** Cỡ trung là cỡ mặc định: đầu chiếm 30–60 % bề ngang khung. Cảnh rộng chỉ là nhịp ngắn 1–2 s để lộ quy mô, rồi vào lại cỡ trung (H2).
- **Bối cảnh chi tiết hơn nhân vật**: phối cảnh sâu, có chất liệu (ván có vân, đất có sỏi và vệt loang, tường ốp), ít nhất 3 lớp sâu, không mảng trơn lớn (V6, V8). Nền của cận cảnh không được trống: đặt kệ, đồ nghề, ván ốp sau lưng chủ thể.
- **Nhà và vật lớn đặt xa, máy dùng ống kính dài** (nhà cách hàng người khoảng 12 m): lan can tầng hai nằm ngang đầu nhân vật như bản gốc. Đặt nhà sát lưng nhân vật thì chỉ thấy một mảng tường.
- **Mọi cạnh của bối cảnh có viền mực** (nhà, cửa, lan can, mái, xe, thùng): bật `inkPass` khi tạo `RX.kit` của địa điểm. Đây là một lớp hậu kỳ dò cạnh trên hình 3D (bậc độ sâu, ranh giữa hai vật, nếp gấp), đúng cách kênh mẫu làm. Nét dày khoảng 4 px ở 1080 ngang cho kiểu Situational (đo ở khung gốc: 4,5 px), 3 px cho kiểu Ricks; màu nâu đen, phủ kín (`alpha: 1`). Vật không muốn có nét (bóng đèn phát sáng, dây mảnh, sỏi) khai `outline: 0`.
- **Tường, mái có đường kẻ và vệt bẩn, không tô trơn**: ván ốp `RX.tex.siding` (đường kẻ từng ván, vệt loang, dải tối chân tường), ngói `RX.tex.shingles`, gạch `RX.tex.brick`, kính hai tông `RX.tex.glass`. Cửa sổ = khung trắng dày + kính + đố giữa + bệ, mỗi phần một khối riêng để viền mực tách lớp.
- **Nhà có nhiều lớp khối**: hiên lõm tối, lan can song dày, trụ, nẹp giữa hai tầng, diềm mái trắng, ống khói gạch, bậc thềm, quạt gió. Một khối hộp ốp ván + vài ô cửa thì thua bản mẫu một bậc (M1, C7).
- **Nền cát mịn**: ít sỏi, sỏi không viền, có mảng sáng loang. Sỏi to có viền rải khắp trông rối và rẻ.
- **Ánh sáng có nguồn nhìn thấy được**; cảnh tối vẫn phải đọc được chất liệu (nâu ấm có đèn lấp), không đen đặc. Đầu và thân được tô khối theo đèn của cảnh (`look.char`).

## Màu
- Bão hoà trung bình quanh 0,35–0,55. Một tông ấm phủ kín khung (hầm mỏ toàn cam) đẩy bão hoà vượt 0,6: hạ `grade.sat` của địa điểm.
- Ban ngày: cát be hồng, trời xanh nhạt có sương, vignette 0,3. Màu mạnh dành cho thân nhân vật, đạo cụ chính và chữ.

## Chữ
- Kiểu Ricks: Montserrat ExtraBold 84 px (chữ cao 3,4 % khung), viền đen 5–6 px, bóng lệch xuống-phải 3–4 px. Kiểu Situational: Nunito Black 122 px in hoa, viền 10 px, màu: đỏ cho từ tục đã che, hồng/vàng/lam cho tên và từ khoá.
- Card đầu vào ở khung 0, card cuối giữ tới khung cuối, không khung nào thiếu chữ. Chữ không nhoè theo chuyển động và không mờ theo hoà tan.

## Nhân vật
- Mỗi nhân vật = mũ hoặc tóc + một màu thân + một phụ kiện hoặc nét riêng (kính, râu, xe lăn). Thiết kế là của mình; không chép nhân vật của kênh nào.
- **Dáng có lực**: thân nghiêng theo động tác (`POSE_LEAN`), tay vươn dài quá đầu khi giơ, nắm tay có khớp ngón. Không ai đứng thẳng đơ ở cỡ trung.
- **Diễn theo lời**: nét mặt và dáng đổi đúng từ (sự kiện `face` / `pose`), đổi trong 1 khung, không tween.
- **Giới hạn về diễn hoạt (người dùng 14/11, xem video nzbkkEZFM8g: "nhân vật di chuyển các thứ rất tự nhiên, mình nghĩ code của mình không làm được vậy").** Đúng: engine chỉ diễn kiểu giữ dáng rồi bật dáng (đổi trong một khung), nhân vật là thẻ phẳng luôn quay mặt về máy, không đi, không xoay người. Một phần video của kênh mẫu thì nhân vật chuyển động toàn thân liên tục: đi có nhịp chân, xoay người trong không gian (thấy mặt rồi thấy gáy), cúi đẩy đồ, mũ len kéo xuống thành mặt nạ. Dải khung làm bằng chứng: `rick-short/analysis/nzbkkEZFM8g/chuyen-dong-1-di-va-day-ghe.jpg`, `chuyen-dong-2-canh-sat-va-mu-len.jpg`. Luật "đổi dáng trong một khung, không tween" trước đây được rút từ ba video (7xS87iActkU, Mz72MuPgnGY, TRUkQ1wbV2E), không đại diện cho cả kênh. Đã làm hướng một (14/11, người dùng: "thử làm hướng đầu đi"): engine có `"anim"` (khung trung gian, nhún), sự kiện `move` (đi: hai chân vẽ lại từng khung, chân trụ ghim trên đất) và `turn` (quay người); phim mới thì bật, cách dùng ở `rick-short/skill/references/dien-hoat.md`, phim mẫu `engine/films/walk-test`. Vẫn là hoạt hình cắt giấy: chưa có xoay người mềm trong không gian hay hình biến dần. Hướng hai (công cụ sinh video cho cảnh cần chuyển động, lấy ảnh tĩnh của engine làm khung đầu và khung cuối) chưa thử, tốn tiền, chờ người dùng quyết. Luôn có ít nhất một người trên hình đang diễn; người kia phản ứng lệch nhịp (P6).
- Vai deadpan (mỏ neo) giữ một nét mặt nhưng vẫn đổi dáng tay; người xung quanh phản ứng mạnh.
- Chớp mắt 2 khung mỗi 2,6–4,2 s, lệch pha từng người. Thở rất nhẹ. Không nảy tại chỗ.
- **Độ "bóng bẩy"** (đo ở khung gốc cỡ thật): đầu và thân có vùng sáng và bóng tím loang mềm (`look.char.shadow` khoảng [.78,.75,.9] ban ngày, đậm hơn trong nhà; `range` rộng [-.25,.8]), ánh bóng nhẹ trên thân và mũ (`spec` 0,1), vệt bóng trên mũ/tóc, đốm sáng ở mắt, môi, kính, hoa tai, và một quầng tối mềm quanh người để tách khỏi nền (`look.char.halo` 0,3–0,4). Nét bao nhân vật của ta và của họ dày bằng nhau (4,1 % và 4,3–4,5 % đường kính đầu): không cần làm dày thêm.

## Chuyển động, máy quay, chuyển cảnh
- **Máy không bao giờ đứng**: mọi bố cục có trôi/đẩy, cộng lắc tay rất nhẹ liên tục (`sway`, mặc định 0,005; kiểu Situational 0,008). Đo bằng V4.
- Preset: lunge (lao vào 0,2–0,8 s rồi trôi), push, pull, drift, flyin, follow (bám vật), orbit, settle. Hook là một đường máy liền phủ trọn câu đầu.
- Mối nối: máy liền (quất, có nhoè thật) trong cùng không gian; hoà tan 6–13 khung khi đổi địa điểm, cả hai máy đang chạy; cắt cứng hiếm, rơi đúng từ nhấn.
- Cú rung chỉ ở va chạm, nổ, tiếng hét (`"do": "hit"` hoặc `shake`), tắt dần trong 0,4 s.
- **Cận nhân vật thì nền nhoè, cảnh rộng thì nền nét**: ở màn giới thiệu, nhà sau lưng 12 m nhoè khoảng 4 px (`aperture` 26) nên nét mực của nhà lùi xuống và nhân vật nổi lên; ở cảnh rộng nhà phải sắc để lộ nét vẽ.
- Cận cảnh: nền nhoè vừa phải. Khẩu độ lớn quá làm mất hết nét của nền (V8P tụt): cận cảnh đạo cụ dùng `aperture` 3–5, cỡ trung 9–15, chỉ nhoè mạnh (26–30) khi nền ở rất xa.

## Âm thanh
- Lời từ 0,0 s, khoảng 255 từ/phút trong câu, nghỉ 0,45 s giữa câu, đuôi 0,6 s, −14 LUFS. Giọng tạm của máy chỉ để dựng; bản đăng cần giọng thật.
- Nhạc và tiếng động của kênh mẫu chưa được nghe và phân tích (chưa ai nghe được tiếng trong các phiên dựng).

## Chi tiết bắt buộc (soát mắt ĐẠT / HỎNG, do lượt rà độc lập làm — khuôn ở `references/tu-soat.md`)
- **So với video mẫu**: ghép khung của ta cạnh khung của họ ở độ phân giải đầy đủ (`engine/tools/compare.py`), nhìn nhân vật trước. Thua rõ về cỡ nhân vật, độ kín nền, màu hoặc độ "sống" của dáng thì chưa gửi.
- **Bảng nhân vật** (cổng C2): mọi thiết kế mới và mọi nét mặt dùng trong phim, sáng ngày và tối (`?film=_sheet`).
- **Dải khung liền** quanh mỗi mối nối và mỗi cú quất máy: không khung đen, không khung trống, chủ thể không nhảy.
- Mỗi câu lời có một thay đổi nhìn thấy trong 1 s đầu; đạo cụ vô lý của câu hook có hình cận trước giây thứ 2.

## Cạm bẫy đã gặp (bản test "đèn thợ mỏ" và bản dựng so sánh, 14/11/2026)
- (2026-11-14, bản test hook) Vẽ nhân vật theo lời tả và bảng ảnh nhỏ, không mở khung gốc cỡ đầy đủ → nhân vật đơn sơ, bị chê — "bạn nên review lại hình ảnh nhân vật họ làm chi tiết hơn nhìn có bóng ánh sáng các thứ, biểu cảm rất đẹp". Luật: đặt cạnh khung gốc trước khi gửi.
- Mọi số đo phụ đề và nhịp đều khớp mà hình vẫn thua: số đo phụ đề không chấm được hình. Từ đó có các thước V4, V6, V8, H1, H2 ở trên.
- Đề xuất cài thư viện mới trong khi studio đã có sẵn three.js và bộ render: kiểm kê `packs/`, `vendor/`, phòng lab trước.
- Nhà đặt sát lưng nhân vật, cảnh rộng kéo dài 2,5 s với nhân vật tí hon, nền cận cảnh trống và nhoè, hầm tối đen giữa cú quất máy (ra 1 khung đen): cổng bắt được cả bốn.
- Đầu trắng vượt ngưỡng bloom làm loá: giữ ngưỡng bloom trên 1, vật phát sáng nhân 2–6 lần.
- Bản dựng lại video của kênh khác chỉ để so sánh nội bộ, không đăng; logo của bên thứ ba thay bằng thẻ chữ trung tính.

## Cạm bẫy do lượt rà độc lập bắt được (14/11/2026, cổng máy lúc đó báo ĐẠT)
- **Thước lấy mẫu không thấy lỗi một khung.** Máy bám vật rơi đi sát đầu nhân vật: đúng 1 khung có mảng trắng che 1/3 hình. Từ đó có `framescan.py` soi từng khung (F1, E1). Dò thủ phạm: `node tools/whatsnear.mjs <phim> <giây>`.
- **Quất máy xuyên qua tường hoặc vùng tối cho ra khung trống.** Mỗi khung của cú quất phải còn chủ thể hoặc nền có nét; không được thì đổi hướng quất, lùi máy ra liền, hoặc dùng match dissolve.
- **Nhoè chuyển động ít mẫu thành bóng răng lược** (nhân vật hiện thành nhiều bản chồng). Engine đã tự tăng số khung con theo tốc độ máy (12 / 24 / 40).
- **Không hoà tan giữa hai bố cục trong cùng một không gian**: người cỡ lớn mờ chồng lên cảnh rộng trông như lỗi. Cùng không gian thì kéo máy liền; hoà tan chỉ khi đổi địa điểm hoặc thời gian.
- **Cảnh "ý niệm" khó hiểu** (nhìn dọc giếng xuống một ô xanh có người tí hon): nhìn 1 giây không biết là gì. Kể bằng người ở cỡ trung + một biển chữ trong cảnh + hiệu ứng nhìn thấy quanh người.
- **Vắng nhân vật quá 1,5 s** (cận đạo cụ kéo dài): cận đạo cụ phải giữ tay và một phần mặt người cầm trong khung.
- **Đồ hoạ lệch nhịp**: thẻ tên phải đổi đúng khung phụ đề đổi (vào ngay trong cú quất), tiêu đề vào đúng từ.
- **Chữ trên đạo cụ bị mép khung cắt** (biển REWARD): chữ trong cảnh phải nằm trọn trong khung ở bố cục cuối của cú máy.
- **Máy chính diện, ngang bằng trông như ảnh thẻ**: màn giới thiệu nhân vật đặt máy thấp (`el` −4), nghiêng trục 6° (`roll`), thấy chân và bóng dưới chân.
- **Nền một tông sáng đều làm đầu trắng chìm**: nhà hai tông (ấm + xám lam), có bóng hiên, cột gỗ sẫm; trời nhạt có sương chứ không xanh đậm.
- **Bàn tay tí hon, tay cùng màu thân**: nắm tay rộng khoảng 1/4 đầu, có khớp ngón; tay áo phải tách tông với thân để thấy dáng (tay chống hông thành vòng).
- **Khối hộp thô lọt vào tiền cảnh** (nóc xe là hộp đen, xe là hộp trắng): vật ở tiền cảnh phải có hình khối đọc được, không thì bỏ.

## Họ làm bằng gì, và cạm bẫy của đợt viền mực (14/11/2026)
- (2026-11-14, bản dựng so sánh v1) Thêm viền mực hậu kỳ, chất liệu nhà, quầng và tô khối nhân vật — "nhà cửa khung cảnh của họ vẫn hơn mình 1 bậc, nhân vật thì họ có kiểu bóng bẩy nhiều, bạn có nghĩ họ dùng cách khác ko? blender hoặc là gen ảnh bằng llm?"
- **Kiểu Situational là 3D thật + viền mực hậu kỳ + nhân vật vector 2D, không phải ảnh sinh.** Đo: bám điểm giữa các khung thì mô hình "ảnh phẳng phóng/trượt" chỉ khớp 40–54 % điểm, mô hình cảnh 3D cứng khớp 78–85 % (bản 3D của ta: 75–91 %); viền có răng cưa bậc thang kiểu shader dò cạnh; nhân vật giống hệt nhau giữa các shot. Không cần Blender hay công cụ sinh ảnh; mọi thứ làm được trong engine. Riêng kênh Ricks Clips còn dấu hiệu lẫn lộn (một số video có hình "chảy" kiểu video sinh bằng AI), chưa ngã ngũ: xem `rick-short/docs/01-phong-cach-hinh.md` mục 12.1.
- **Nét mực phải phủ kín (`alpha: 1`) và chỉ ăn 30 % sương của cảnh.** Màu trộn trong không gian tuyến tính: để lọt 5 % nền trắng hoặc trộn đủ sương là nét đen thành xám (đo: độ sáng nét 89 thay vì 34 trên thang 255) và cả cảnh trông nhạt, mềm.
- **Mật độ nét Sobel (V8) không phân biệt "nhiều chi tiết" với "có nét vẽ"**: bản cũ đầy sỏi có viền vẫn qua V8 và C2 trong khi cảnh rộng chỉ có 48 % nét mực của bản gốc. Từ đó có thước M1/C7 (`inkscan.py`); bản cũ chạy qua cổng mới bị chặn ở C7.
- **Bề dày nét phải đo bằng điểm ảnh ở cỡ gốc**, không ước bằng mắt trên ảnh thu nhỏ: hai lần nhìn ảnh nhỏ đều kết luận sai (tưởng nét nhân vật của họ dày gấp 1,4 lần; đo ra bằng nhau).
- Cửa sổ của họ là một phần của tường, không có viền riêng; viền đậm chỉ ở vật tách rời (lan can, trụ, mái). Bản của ta viền cả khung cửa: giàu nét hơn, chấp nhận được, nhưng nếu thấy rối thì khai `outline: 0` cho khung cửa.
- **Vật mảnh ở xa bị mực nuốt** (song lan can rộng 6 px với nét 4 px mỗi bên thành thanh đen; lượt rà độc lập chấm HỎNG): shader giờ chỉ cho vật hẹp hơn hai lần bề dày nét nhận nét nửa bề dày; song lan can, tâm quạt gió, nan lồng nên khai `outline: 0`. Soi mọi cảnh rộng ở cỡ điện thoại (360 px) cạnh khung mẫu.
- **Vật ghép từ nhiều khối trên cùng một mặt phải chung `inkId`** (ba tấm vách đá, bộ ba thanh của một khung gỗ): khác mã thì viền mực vẽ một vạch ở mỗi mối ghép, hoặc nét đôi có móc ở góc. Lượt rà độc lập bắt được ở vách mỏ và lòng cửa mỏ.
- **Hai tấm mái giao nhau ở nóc sinh ra một cái móc**: úp một thanh nóc che chỗ giao.
- **Dây điện, thanh dài phải có hai đầu neo vào vật (cột thứ hai) hoặc ra hẳn ngoài khung** ở MỌI bố cục dùng địa điểm đó; đầu mút lơ lửng giữa trời là lỗi.
- **Bỏ một lớp chi tiết thì phải thay bằng lớp khác**: đổi cát sỏi sang cát mịn làm 1/3 dưới của cảnh thiết lập trống trơn; đã lấp bằng xe bán tải, rào chắn sọc, chồng ván, vệt bánh xe (vật tiền cảnh phải đọc được hình).
- **Nhân vật phụ không được bị cột hay vật mảnh che mặt**: đứng trước mặt phẳng của cột, hoặc ra hẳn ngoài khung của cận cảnh (chỉnh `dx` của bố cục cuối); không để lại một mẩu mũ ở mép khung.
- **Bản dựng so sánh: nhịp máy đọc từ dải khung gốc, không suy từ mốc chữ.** Bản Situational trượt máy giữa hai nhân vật trong 2 khung, hình vẫn nét (`"frames": 2, "blur": 0`), khung giữa cú trượt trùng khung đổi chữ, thẻ tên mới vào ngay khung đó. Cửa sổ mối nối của engine căn GIỮA `at_f` (trượt 2 khung tại `at_f` 53 = khung 52 còn cảnh cũ, 53 ở giữa, 54 tới nơi).
- Khi một agent đang rà clip, vòng render mới phải ra TÊN FILE KHÁC; ghi đè file đang được rà làm lẫn hai phiên bản.

## Lệnh (chạy ngoài sandbox: bộ render mở server 127.0.0.1 và dùng GPU)
```sh
cd video/rick-short/engine;  PY=../.venv/bin/python;  LIB=../../shorts-claude/vendor/lemo-opuscar     # quy trình đầy đủ: skill rick-short-video (rick-short/skill/SKILL.md)
node tools/check.mjs <phim>                                  # 1. trước render: tên sai, at_word không có trong câu, nhịp
sh tools/stills.sh <phim> <bảng> -- 0 0.5 1.2 …              # 2. ảnh tĩnh: xem ảnh trước, render sau
(cd $LIB && node core/render/video.mjs "$OLDPWD" --fps 30 --workers 3 --q film=<phim> --size 1080x1920 --out "$OLDPWD/out/<phim>/picture.mp4")
$PY tools/gate.py <phim> --clip out/<phim>/<clip>.mp4        # 3. CỔNG: video + cỡ nhân vật + soi từng khung + nét mực + trang; thêm --ref <đoạn gốc> cho bản so sánh
$PY tools/compare.py <video gốc> <thư mục ảnh tĩnh> <ảnh ra>  # 4. ghép cặp khung gốc / của ta để soát mắt
```
Thứ tự bắt buộc: `check.mjs` 0 lỗi → ảnh tĩnh và bảng nhân vật → render → `gate.py` 0 lỗi, cảnh báo đã sửa hoặc ghi miễn trừ có lý do (tối đa 3) trong `films/<phim>/review_log.md` → lượt rà độc lập soát mắt toàn ĐẠT → mới gửi.
Đổi ngưỡng trong `qa.json` thì phải đo lại: mọi video mẫu vẫn 0 lỗi.

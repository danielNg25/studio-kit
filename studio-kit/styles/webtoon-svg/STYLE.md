# webtoon-svg — webtoon vẽ hoàn toàn bằng code (SVG)

Style của kênh mẫu. Engine `studio-template/engine/` (`build.py`, `render.mjs`), pack `studio-template/packs/style/webtoon-code-v1/` (đọc `STYLE.md` của pack). Lệnh: mục **Lệnh** cuối file này; phần riêng kênh (render tại Mac, đồng bộ cloud) ở skill kênh, vd `channel-example/skill/references/lenh.md`.

## Nhân vật
- Mặt/tóc phẳng 2 tông + viền mực như áo; nam không trông như nữ; không giống diễn viên.
- **Mỗi người một điểm nhận ra ở ĐẦU hoặc DÁNG** (mũ, lông trĩ, sừng, bịt mắt, sẹo, bờm tóc, da thú, khổ người), không chỉ khác màu áo (người dùng 11/11).
- Trang phục/tóc khớp triều đại; nhân vật mù đeo đai vải.
- Mặt đổi biểu cảm theo từng nhịp ('yell', 'grit', 'smug', 'shock'); nói thì mấp máy miệng; giữa các nhịp vẫn diễn (tay, quay đầu, nét mặt) — nhưng **không nảy/nhảy người lên** (xem Chuyển động).
- Hạn chế vẽ chân đi/chạy (lướt nửa người có nhún); trên ngựa chỉ vẽ nửa người (`xfRider`); đứng yên không vẽ tay; không bóp dẹt để ngồi/nằm.
- Đồ cầm đúng chiều (lưỡi về đối thủ, cung dây về phía người); vật chỉ tách đôi lúc bị chém.
- Bảng duyệt C2: `ref/*.jpg` cả người + mặt cận + biểu cảm + bản ra trận.

## Nền — chuẩn 5 lớp (mẫu Hổ Lao, 12/11)
1. Trời theo giờ (quầng mặt trời, mây viền nắng, chim). 2. Xa: ≥ 3 lớp núi + công trình đúng nơi có chi tiết thật, biển tên tiếng Việt, cờ đúng phe. 3. Giữa: vũng sáng, vệt phối cảnh, đá, bụi; mọi nhân vật có bóng đổ. 4. Gần: cỏ chữ "v", đá tối hai góc, lính chỉ ở hai mép. 5. Không khí: tia nắng, bụi sáng, tàn lửa, lớp màu theo giờ (`tqLight`, `tqRays`, `tqMotes`, `tqEmbers`).
Trong nhà: phối cảnh 1 điểm tụ, đồ đạc đúng thời, nguồn sáng có quầng. Thư viện: `sc_tkbglib.js`, `sc_tq_b_bg.js`, `sc_tq_a_kit.js`. Bảng nền C3: `tools_bg/bgboard.py`.
Đám đông là người thật (`tqArmy`), không bóng đen; thuyền trên nước; người trên tường đứng sau gờ; không vệt đỏ trên đất.

## Hiệu ứng chiêu
Thư viện `webtoon-code-v1/fx_moves.js` (vệt vung, đâm, múa tít, biến hoá, phân thân, sét, băng, nứt đất, lửa, trói, bàn tay Phật, bộc phát khí, gió). Chiêu mới thêm vào thư viện, không viết lẻ trong tập. Va chạm `xmGlint`; không chớp trắng cả màn hình, không máu. Luật cảnh đánh đầy đủ (signature Kênh Mẫu): `channel-example/skill/references/canh-danh.md`.

## Chữ
Font kênh (`kText`/`thName`/`tqTxt`); chữ ghi chú ngoài lớp máy (`kCam`) để không bị cắt.

## Màu
Bảng màu theo bộ truyện/nhân vật trong pack; ánh sáng theo giờ trong ngày của cảnh (`tqLight`). Cảnh tối vẫn đủ sáng thấy người (trăng, đuốc, đèn). Không phủ đen cả khung, không vệt đỏ trên đất (dễ thành máu).

## Chuyển động & máy quay
- Nhân vật luôn thở + chớp mắt (có sẵn trong bộ vẽ `tkChar`). **Đứng yên thì không nảy/nhún người lên xuống** (người dùng 13/11, hai tập): không nảy khi đổi nét mặt, khi nói, khi phản ứng, không hop lặp theo chu kỳ để "khỏi đứng im". Khuôn `tb` bản 7 (`sc_tq_l_b6.js` của 4 tập mưu sĩ/võ công/lãng xẹt/Lương Sơn): `hop: mốc` = nghiêng người ~6° trong 0,3 s (ngả sau khi đau/sốc, chúi tới khi đánh/hét), không nhấc lên; nhảy thật mới dùng `jump: mốc | [mốc, cao px, dur]`.
- Vào cảnh bằng lướt nửa người có nhún (`ttIn`/`ttInL` kiểu Tào Tháo) thay cho chân bước. Quay 180° = lật một khung (face ±1), không nội suy hướng mặt.
- Cảnh kể chuyện: máy theo người nói (cận khi bóng thoại hiện, khung giữ trọn mặt); danh sách shot trong cảnh (`shots: [[t,cx,cy,z],…]`) đổi theo lời, không cắt đều mỗi câu.
- Cảnh đánh: một mạch không reset; zoom đòn thường +0,06, đòn lớn +0,24 (kéo tâm ~60 % về điểm chạm, nhả chậm), đoạn dồn dập chỉ rung 7–10 px; khựng ≤ 0,12 s chỉ ở đòn kết. Chi tiết ở `channel-example/skill/references/canh-danh.md`.
- Đổi địa điểm: mờ chồng ≤ 0,3 s; trượt ngang thỉnh thoảng; không chớp trắng, không khung đen.

## Âm thanh
Theo kênh (giọng, nhạc, mức dB nằm ở skill kênh). Engine trộn bằng `build.py <ep> mix`; tiếng động chỉ ở hành động thật trên hình nếu kênh đã duyệt.

## Cạm bẫy đã gặp
- Chỉ dùng được các hàm easing có trong engine: `expoOut, quartOut, backOut, quadIn, expoIn, smK` (không có `quadOut/quadInOut/quartIn`).
- Không trộn `legs` kiểu chuỗi với mảng trong cùng một keyframe; ngã/nằm: `spin ≈ ±85–90` + `y ≈ +440·scale`.
- Chữ ghi chú phải ngoài lớp máy (`kCam`) kẻo bị cắt khi zoom; tên dài trên bảng hạng tự co + nền tối.
- Dải tiền cảnh của kỵ sĩ nửa người (`xfRider`) che nhân vật đứng thấp → dùng `full:1` cho cảnh đó.
- Nhiều agent cùng chạy `sh mkscenes.sh` / cùng thư mục `build/prev/_st` sẽ ghi đè nhau → dùng `tools/dev_tag.sh` (mục Lệnh).

## Lệnh
Tạo tập mới: `sh studio-kit/styles/webtoon-svg/new_episode.sh <kênh> <id> "<tiêu đề>"` (chép `template/`: đồ nghề cảnh + script build). Cài đặt, tạo nhân vật, mang sang máy khác: `INSTALL.md`.
Chạy trong thư mục tập `channel-<kênh>/episodes/<id>/` (engine: `../../../studio-template/engine/`).
| Việc | Lệnh |
|---|---|
| Timeline từ giọng thật / ước lượng chưa có giọng | `python3 ../../../studio-template/engine/build.py . audio` · thêm `--silent` |
| Trộn nhạc · thay tiếng cho video đã render · bài đăng | `… build.py . mix` · `… remux` · `… post` |
| Ghép cảnh (một người làm) | `sh mkscenes.sh` · bản dev: `sh mkscenes.sh dev main` |
| Ghép cảnh khi **chạy song song** (mỗi agent một tag) | `sh ../../../studio-kit/styles/webtoon-svg/tools/dev_tag.sh <tag>` |
| Ảnh tĩnh soát | `python3 build/still.py <tên> c02_01:1.5,4 c03_00:2` → `build/prev/<tên>.jpg`; song song: thêm `STILL_JSON=build/render_dev_<tag>.json STILL_DIR=build/prev/_st_<tag>` phía trước |
| Một cảnh tự do (ảnh bìa, thử) | `python3 build/job.py <fn> <giây> <file.js…>` → `node ../../../studio-template/engine/render.mjs build/job_<fn>.json <ra> --stills t1,t2` |
| Clip thử một đoạn | `node ../../../studio-template/engine/render.mjs build/render.json <ra.mp4> --frames a:b` |
| Bản xem/bản full (Mac) | `python3 build/render_local.py -j 4` (`--fresh` · `--redo shotA,shotB` · `--only K`) |
| QA máy | `cd channel-<kênh> && python3 tools/qa.py script|video|gate|full …` (TECHNIQUE §5) |

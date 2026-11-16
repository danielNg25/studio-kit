# comic-history — truyện tranh lịch sử giấy cắt

Gốc: Lemo-Opuscar "Comic History Cartoon" (`vendor/lemo-opuscar/styles/comic-history/STYLE.md` — đọc trước, đó là bất biến của style).
Bản của studio dựng lần đầu cho tập Jensen (Hóng, 13/11/2026; 13 chương, 13:48). Người dùng: "mình thích style này hơn".
**Style mặc định của kênh Hóng** (người dùng 13/11). Cấu trúc (giống Lemo: engine chung, mỗi tập chỉ dữ liệu):
- `engine/` — DÙNG CHUNG: `engine.js` (page contract, vẽ rối, bản đồ, máy, phụ đề), `rig.js` (phép tính khớp rối, thuần — cổng rig dùng chung), `anim.js` (nhịp chuyển động: `key`, `EASE`, `twos`, `wob`, `popIn`, `strike`), `fx.js` (hiệu ứng và hành động giấy, nền nhiều lớp), `kit.js` (đồ nghề cảnh), `extract.py` + `pins.py` (tách tấm rối, dò ghim), `map.py` (bản đồ vùng, dữ liệu Natural Earth trong `engine/data/`), `fonts/`.
- `reference/` — **phim mẫu Lemo + 6 báo cáo phân tích + bảng số làm chuẩn** (`reference/README.md`). Đọc trước khi dựng tập đầu tiên theo style này và mỗi khi bị chê "chưa đạt".
- `template/` — khung một tập: `index.html`, `chapters/cast.spec.js` (khai rối, dữ liệu thuần) + `cast.js`, `chapters/chrb.js` (tấm ráp thử), `music.json`, `sheets.json` (prompt Codex mỗi nhân vật một tấm), `PLAN.md`; `examples/` = chương 4, dàn rối, kế hoạch của tập Jensen.
- `new_episode.sh <thư mục dựng>` — tạo tập: chép template + `engine/` là **symlink** về engine chung. `freeze.py <thư mục dựng>` — khi chốt đăng, thay symlink bằng bản chép (tập đã đăng không đổi khi engine chung sửa).
- Âm thanh, ghép, QA, xem nhanh, dựng song song: `studio-kit/core/` (dùng chung mọi style cùng page contract).
- Tập Jensen (`channel-hong-su-remotion/episodes/jensen-huang-cuoc-doi/build/comic-history/`) là bản gốc có engine chép riêng — coi như đã đóng băng; engine chung là bản mới nhất của nó.
- Sửa engine chung: chỉ thêm tuỳ chọn mới, giữ mặc định cũ (tập đang làm khác đang dùng); chạy thử `peek` một chương của tập đang làm trước khi báo xong.

## Nhìn
- **Mặc định từ 13/11/2026: chế độ CẢNH 16:9** (người dùng: "bỏ hẳn kiểu trang truyện… mỗi màn đều là 1 màn hình 16:9") — mỗi cảnh phủ kín 1920×1080, không trang, không viền ô, không mặt bàn; đổi cảnh mờ chồng 0,35 s (`E.XF`); đầu chương: khung cuối chương trước mờ dần. Lý do: ô hẹp/ô dài không vừa màn hình (hụt một phần khung) và cú lia giữa các ô gây khó chịu.
  Khai trong chương: `panels: { P1: { w: 1920, h: 1080 }, … }` (cảnh rộng hơn, vd 2980, được phép để lia ngang trong cảnh — màn hình luôn kín) + `shots: [[t, 'P1'], [t, 'P5', ox, d], …]` thay cho `page`/`cam`. Mẫu: `channel-hong-su-remotion/episodes/trung-quoc-dai-loan/build/comic-history/chapters/ch00–02.js`.
- Kiểu cũ (tập Jensen): mỗi chương một trang truyện trên mặt bàn gỗ, máy trượt giữa các panel (`page` + `K.camSeq`) — engine vẫn giữ để dựng lại tập cũ, không dùng cho tập mới.
- Mọi thứ là giấy cắt: thẻ có bóng đổ + viền kem (`card`), vân giấy phủ multiply, phiếu chữ (`slip`), thẻ năm (`yearTag`), con dấu đỏ (`stamp`).
- Bản đồ in kiểu atlas thế kỷ 19: nét khắc đất, ký hiệu sóng, núi, rừng, tàu giấy, la bàn, thước, khung tiêu đề (`printMap`, `cartouche`). Luật bản đồ Việt: DIRECTOR §8.
- Bảng màu ấm (giấy kem, gỗ, đỏ son, vàng đồng, xanh lục Nvidia…); chương nghiêm đổi sang xám-xanh trầm.

## Chuẩn chất lượng — đo từ phim mẫu (người dùng 13/11/2026: "xem kĩ video gốc… họ làm hiệu ứng và animation rất hay")
Bảng số đầy đủ: `reference/README.md`; ngưỡng máy: `qa.json` (cổng `qa.py gate`). Bản xem 3 chương đầu tập Đài Loan bị bác vì trái hết các dòng dưới.
- **Rối là chủ thể**: rối đóng chính cao **≥ 0,60 chiều cao khung** khi có 2 rối (đứng quanh 22 % và 76 % bề ngang, vật đang nói tới ở giữa), **≥ 0,68** khi 1 rối; không đứng trong 15 % mép khung, không bị che quá 20 %. Rối (hoặc người giấy không mặt, bàn tay giấy) có mặt **≥ 50 % mỗi chương**, không quãng nào > 15 s vắng hẳn.
- **Diễn liên tục, một con dẫn – con kia phản ứng**: con đang dẫn đổi tư thế ít nhất mỗi ~1,5 s; không con nào im > 4,5 s; không để mọi con cùng im > 2 s; mỗi câu lời có một thay đổi nhìn thấy trong 1 s đầu. Idle là động tác có chủ đích (đưa người ±1,4° chu kỳ 2 s, nghiêng đầu 6° giữ 1,5 s, run ±2°) — **không thở/lắc đầu hình sin đều, không chớp mắt**.
- **Công thức cú đánh / đóng dấu / đặt mạnh** (`strike` trong `anim.js`): đà 0,5 s → giữ đỉnh và run 0,35 s → đánh 0,15 s với đúng 1 hình trung gian (vệt mực) → chạm: rung máy + nét mực 0,25 s + vụn giấy 0,75 s + vật/người bên cạnh phản ứng → giữ 0,6–1,0 s → thu về có vượt ~10 %. Cú lặp lại rút còn ~60 % rồi ~25 % thời gian. Cú nặng rơi 0,05–0,2 s **sau khi câu dứt** hoặc đúng động từ ±0,1 s.
- **Đổi mặt có canh giờ**: mặt ý định đi trước cử chỉ 0–0,2 s; mặt phản ứng trễ 0,12–0,5 s sau kích thích; mặt kết quả đến trong lúc giữ. Mục tiêu một lần đổi mặt mỗi 2,5–3 s khi có rối. Đầu bật nhẹ quanh cằm khi đổi mặt (engine tự làm).
- **Mỗi ý lớn = một hành động giấy** (cắt kéo theo đường biên, xé, dán mảnh, đóng dấu có cán, ghim cờ, lật biển, bộ đếm lật, quân cờ trượt); mỗi chương ≥ 4 loại khác nhau, dấu đỏ ≤ 2 lần; vật đã vào thì ở lại hết cảnh. Rung máy theo thang 4 (ghim) · 6 · 8–9 (dấu) · 14–16 (dán mạnh) · 24.
- **Nền kín, đậm, nhiều lớp**: ô màu lớn nhất ≤ 30 % khung, ≥ 3 lớp sâu, có nguồn sáng, tối góc nhẹ; bão hoà trung bình ≥ 0,26. Không tường kem trơn. Bản đồ tô màu từng vùng, biển có sóng khắc; mảnh đất dùng **hình thật cắt từ dữ liệu bản đồ** (`fx.drawMapPiece`), không đa giác tự vẽ.
- **Cứ ≤ 10 s có một nhịp lớn** (thay đổi trên diện rộng: vật to bung ra/trượt vào, đổi cảnh, đèn sân khấu bật — rung máy nhỏ không tính; cổng V5G). Chương 0 tập Đài Loan: dải giấy giật bung ở 0,2 s, đèn rọi bật ở 6,5 s, con dấu ở 10,2 s.
- **Máy quay** hiếm khi đứng hẳn: mỗi cảnh trôi/đẩy nhẹ (engine mặc định 1,00 → 1,04), khoá cứng chỉ cho cảnh nghiêm; không lia ngang cắt cụt chữ.
- **Chữ ít và to**: tối đa 4 khối chữ cùng lúc; chữ chính ≥ 56 px, chữ phụ ≥ 36 px (ở 1080p); không nhãn giải thích thừa, không biểu đồ có độ dài tự đặt (lời không có số thì không vẽ thanh/cột).
- **Người thật**: trung tính, đĩnh đạc — cử chỉ tay tầm ngực, chỉ, nhìn, cầm/đặt giấy, gật, lùi nửa bước, đổi mặt; **không** bị đánh, ném vật vào, ngã, văng phụ kiện, không giơ thẳng tay. Việc mạnh do **bàn tay giấy không mặt** (`fx.paperHand`) và vật vô tri làm.

## Nhân vật — rối khớp từ tấm linh kiện
- Người dùng tạo **tấm linh kiện bằng Gemini** (nền xanh lá, các mảnh tách rời, ghim đồng ở khớp) theo prompt `template/sheets.json`; nhắc "các mảnh cách nhau rộng, không chồng nhau" (tấm `suits` lần đầu hỏng vì hai đầu chồng nhau).
- **Tạo ảnh bằng Codex (cách của Lemo)**: `python3 vendor/lemo-opuscar/core/image/gen_image.py "<prompt>" --aspect 16:9 --model <model> --out src/gen --name sheet-x` (đã thêm `--model` vì model mặc định trong `~/.codex/config.toml` không dùng được với tài khoản ChatGPT). 13/11/2026: tài khoản ChatGPT cũ không có `image_gen`; người dùng đăng nhập lại tài khoản khác (`codex logout && codex login`) → **chạy được với model mặc định**, ~1 phút/ảnh, ra 1672×941. Tấm thử (nhà đầu tư Phố Wall, mỗi tấm một nhân vật) đẹp hơn hẳn tấm Gemini: vân giấy thật, ghim đồng đúng khớp, 4 đầu biểu cảm, mảnh tách rời rõ. Tài khoản lỗi `image_gen` thì thử `--model gpt-6-luna` hoặc đổi tài khoản. Trước khi tạo cả bộ: báo người dùng số tấm (một tấm/nhân vật) — dùng hạn mức tạo ảnh của gói ChatGPT.
- **Mỗi tấm MỘT nhân vật, ảnh ≥ 2K** (video mẫu Lemo làm vậy): tấm nhiều nhân vật 1376 px ở tập Jensen cho mảnh nhỏ, mờ khi cận — lý do chính chất lượng thua video mẫu.
- Tách mảnh: `engine/extract.py` (khoá nền theo khoảng cách màu, khử viền xanh 7 px, giữ vùng xanh kín như chip/huy hiệu, xoá dấu lấp lánh Gemini, tách đầu dính). Ghim dò bằng `engine/pins.py` — phép thử **vàng** (g−b lớn so với r−g), không nhầm da nỉ cam; ghi thêm `sil` (điểm cằm dự phòng theo đáy bóng mảnh) và `grp`/`reg` (các mặt của một đầu chồng khít lên nhau). Prompt tấm rối phải có ghim ở **cằm mọi đầu**, cổ, hai vai, hai hông.
- Khai rối trong `chapters/cast.spec.js` (dữ liệu thuần; `cast.js` chỉ gọi `rig`). **Khớp không được đoán** (13/11: bộ dò cũ nhầm đốm da là ghim → đầu Tưởng Giới Thạch lệch 27 px, đổi mặt đầu nhảy): cổ = ghim gần trục giữa nhất, mọi mặt dùng chung một điểm xoay ở cằm, cằm đè cổ áo (`headDrop`); tấm thiếu ghim thì **khai tay** `neck` / `headPivot` / `hipA`… sau khi soát ảnh — engine ném lỗi chứ không tự đoán.
- **CỔNG RIG (bắt buộc, cổng C2)**: `python3 studio-kit/tools/rig_gate.py <dựng>` → 0 lỗi, rồi **mở xem** `qa/rig/<rối>.jpg` (đầu ráp lên vai cỡ lớn, mọi mặt + nghiêng ±10°, chữ thập ở cổ) và tấm ráp thử `index.html?ch=rb`. Chạy lại sau mỗi lần tách lại tấm hoặc sửa `cast.spec.js`. Tấm ráp thử cỡ nhỏ không đủ để thấy lỗi 5–8 px.
- **Chiều cao đồng đều: dùng `hh` (px cảnh), không dùng `s`** — mỗi tấm một độ phân giải nên cùng `s` ra người lớn–trẻ con. Rối đóng chính **`hh` 650–760** trong cảnh 1080 (xem Chuẩn chất lượng); 520–600 chỉ cho người phụ ở lớp sau.
- **Tay phải ra dáng đọc được ngay** (2026-11-14, tập nghi án Nvidia, chương mẫu — "sao tay bị cong queo kì dị vậy, so sánh với video mẫu xem"): phim mẫu chỉ có tay chống hông (khuỷu mở ra ngoài, chúc xuống), tay duỗi gần thẳng để chỉ, tay khoanh. Lỗi đã gặp: đích `handA/handB` đặt sát vai (< 0,7 tầm với) → khuỷu gập ngược vào ngực hoặc chĩa ngang vai; tay rảnh để `sA = eA = 0` → buông thẳng tới ống chân. Luật: mọi chuỗi khoá đi qua `E.natKeys(R, keys)` trước `poseTrack` (kéo đích ra ≥ 0,72 tầm với, tự chọn phía khuỷu, tay rảnh thành dáng nghỉ `'side' | 'hip' | 'belly'`); đặt đích riêng thì dùng `E.handAt(R, p, side, góc, phần tầm với)`; tấm Codex vẽ cẳng tay dài hơn bắp tay thì khai `foS: 0.8` trong `cast.spec.js`. Sau khi `natKeys` kéo tay ra, **soát lại ảnh tĩnh xem bàn tay có đè chữ không** (cổng trang chưa bắt được lỗi này).
- Diễn: rối chạy "nhịp hai" (12 tư thế/giây), máy quay và bóng chạy mỗi khung. `poseTrack` (ease từng khoá `e:`), **tay với tới đích** `handA/handB: [x, y]` (IK), đồ cầm `holdA/holdB`, `walkTo` bước nhún; thở/đưa người là tuỳ chọn (`breath`, `sway`), mặc định tắt. Một bóng đổ chung cho cả rối. Bóng không mặt: `dim: 'brightness(0.12) saturate(0)'`.
- Người thật có tên: **tấm rối biếm hoạ giống mặt** (người dùng 13/11: "nhân vật thì đổi luật lại là vẽ giống mặt") — prompt dùng `style_block_real` trong `sheets.json` (tên + đặc điểm nhận ra: mặt, tóc, kính, trang phục đặc trưng, tuổi). Codex từ chối thì đính kèm ảnh tham khảo người dùng đưa bằng `--ref`. Người không tên: bóng không mặt. Không dùng cùng một rối cho hai người khác nhau trong chuyện nhạy cảm.

## Chuyển động, máy quay, chuyển cảnh
- Mọi mốc neo theo câu/chữ: `S(i)`, `Wd(i,'chữ')` (đọc `data/timeline.json`; mốc tiếng bíp đo thật trong `marks`).
- Máy (chế độ cảnh): `shots` — đổi cảnh theo câu/chữ, mờ chồng; mỗi cảnh tự trôi nhẹ (khai `{ z: [z0, z1], f: [fx, fy] }` để đẩy vào điểm cần nhìn, `lock: true` cho cảnh nghiêm); tối góc tự vẽ. **Không dùng cảnh rộng hơn 1920 để lia ngang** (13/11: cắt cụt chữ "HÓNG", "BẮC KINH") — tách thành các cảnh 16:9. (Kiểu trang cũ: `K.camSeq`.)
- Rung máy khai ở `shakes` (dùng `fx.hit(t, amp)` + `fx.shakeList()`); mọi cú dán/đóng dấu/đập đi kèm `fx.impact`.
- 10 s đầu phải nổ chuyển động (DIRECTOR §1).

## Âm thanh
- Giọng: `audio/chNN.m4a` ghép lại bằng `tools/revoice.py` với nhịp chuẩn (TECHNIQUE §2) → `data/timeline.json`.
- Nhạc: `tools/assemble.py` (bảng `CUES` chương → bài, giao nhau 2 s, −28 dB, nâng trong khoảng lặng, −16 LUFS).
- **Không tiếng động** (người dùng 13/11 "bỏ sfx đi, nghe không hay"): `mix.py` chỉ thêm khi `SFX=1`.
- Phụ đề: `makeCaps` → `window.CAPS` → `.vi.srt` (không in cứng; `burnCaps` chỉ cho bản xem thử).

## Chi tiết bắt buộc (QA "Chi tiết")
DIRECTOR §5 + `kit.js`: `office`, `deskSet`, `monitor`, `chart`, `newspaper`, `envelope`, `gpuCard`, `pcTower`, `cashStack`, `building` (tower/warehouse/capitol), `calendar/flipCal`, `crowd` (có điện thoại loé), `bubble`, `stamp`, `bigNum`, `chair`, `jacket`, `nameplate`, `whiteboard`… và `SC` của engine (tường, sàn, cửa sổ có cảnh, tranh, đồng hồ chạy, kệ sách, cây, đèn có quầng, bàn, ghế, thảm, poster, cửa, mặt trời, mây, biển hiệu).

## Cạm bẫy đã gặp (tập Jensen)
- Phiếu chữ, biển, màn hình, đồ ôm **che mặt** — lỗi nhiều nhất; đồ bê đặt trước ngực.
- Việc xảy ra khi máy đã rời panel; lịch lật chưa xong máy đã đi → neo theo chữ, kiểm thứ tự.
- Panel cao chỉ rộng 1000 → nửa khung lộ panel bên (cần bố cục trang khác nếu dùng lâu).
- Máy lùi xa (z < 1) lộ panel kế bên sớm.
- Tấm nhân viên đổi số mảnh sau mỗi lần tách lại → khai rối một chỗ (`cast.spec.js`) + cổng rig + tấm ráp thử.

## Cạm bẫy đã gặp (tập Đài Loan – Trung Quốc, bản xem bị bác 13/11)
- **Đầu lệch khỏi thân**: tin bộ dò ghim tự động, không có cổng đo khớp, tấm ráp thử xem ở cỡ nhỏ → cổng rig + ảnh soát cỡ lớn.
- **Bài thuyết trình bằng nhãn giấy trên tường kem**: 16/21 cảnh không có rối, rối cao 0,44–0,56 khung, 18 khoá tư thế trong 247 s, 1 lần rung máy → dựng theo Chuẩn chất lượng, mỗi cảnh trả lời: ai diễn, làm gì với giấy, cú chạm ở chữ nào.
- **QA máy 0 lỗi nhưng 26 cảnh báo vẫn gửi**: cảnh báo không ai phải xử lý → đứng im/khung trống giờ là LỖI, cảnh báo phải sửa hoặc ghi miễn trừ, `preview.sh` không làm bản gửi khi chưa qua cổng.
- Cảnh rộng 2980 px lia ngang cắt cụt chữ; biểu đồ thanh/cột có độ dài tự đặt (lời không có số); đảo vẽ bằng đa giác 6–8 đỉnh lệch bản đồ in; micro, bục che mặt và thân rối.

## Lệnh (chạy với `LIB=<root>/vendor/lemo-opuscar`; các lệnh render/peek cần tắt sandbox)
| Việc | Lệnh |
|---|---|
| Tạo tập | `sh studio-kit/styles/comic-history/new_episode.sh <kênh>/episodes/<id>/build/comic-history` |
| Tạo tấm rối (Codex) | `python3 vendor/lemo-opuscar/core/image/gen_image.py "<prompt>" --aspect 16:9 --out <dựng>/src/gen --name sheet-<tên> [--ref <tấm đã duyệt>]` (prompt ghép từ `sheets.json`) |
| Tách mảnh rối | `cd <dựng> && $LIB/.venv/bin/python <root>/studio-kit/styles/comic-history/engine/extract.py` (tuỳ chọn `extract.json`) |
| Bản đồ vùng | `cd <dựng> && python3 <root>/studio-kit/styles/comic-history/engine/map.py` → `data/map_<vùng>.json` |
| Giọng + mốc câu | `cd <dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/revoice.py` (từ `<tập>/voice/clips`, không gọi VBee) |
| Ảnh tĩnh soát | `sh studio-kit/core/peek.sh <dựng> 05 2.5 6 11 …` → `<dựng>/qa/peek_05.jpg` |
| Dựng chương | `sh studio-kit/core/build_par.sh <dựng> 00 01 02 …` (song song 2 chương; `PAR=1` tuần tự) |
| Ghép cả tập | `cd <dựng> && $LIB/.venv/bin/python <root>/studio-kit/core/assemble.py 00 01 … --name <tên>` → `out/<tên>.mp4` + `.vi.srt` (nhạc theo `music.json`) |
| Cổng rig (C2) | `python3 studio-kit/tools/rig_gate.py <dựng>` → `qa/rig/*.jpg`, `qa/rig_gate.json` |
| QA + cổng gửi | `python3 studio-kit/tools/qa.py video <clip>` · `qa.py gate <clip>` (rối + hình + trang) → `<clip>.gate.json` · bản gửi: `sh studio-kit/core/preview.sh <clip>` (540p; từ chối nếu chưa qua cổng; `HQ=1` = bản nét 1080p cho clip ngắn khi người dùng duyệt chất lượng hình) · cổng trang riêng: `node studio-kit/core/pagecheck.mjs <dựng> <chương…>` · `qa.py srt …` |
| Chốt đăng | `python3 studio-kit/styles/comic-history/freeze.py <dựng>` |
Mỗi chương: `chapters/chNN.js` import `../engine/engine.js`, `../engine/kit.js`, `../engine/fx.js`, `../engine/anim.js`, `./cast.js`; xem nhanh trong trình duyệt `index.html?ch=NN`. **Chương mẫu đạt chuẩn (đã qua cổng, chờ người dùng duyệt C4): `channel-hong-su-remotion/episodes/trung-quoc-dai-loan/build/comic-history/chapters/ch00.js`.** Trang thử hiệu ứng: `chapters/chfx.js`, trang thử engine `cha1.js` (tập Đài Loan); chương kiểu trang cũ: `template/examples/ch04-jensen.js`.

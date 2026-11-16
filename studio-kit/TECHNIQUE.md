# TECHNIQUE — luật dựng dùng chung (giọng, nhạc, render, QA, giao file)

Đường dẫn gốc: Mac `<STUDIO>/`. Lệnh riêng của từng engine nằm trong `styles/<slug>/STYLE.md`.

## 1. Giọng VBee
- **Luật tiền**: trước MỖI lần gọi API báo số ký tự (sau khi áp `pronounce`) và chờ "ok". Thu theo lô, chỉ thu câu thiếu/câu đổi. Không gọi cả tập một phát.
- Câu đã thu lưu theo mã băm `md5(giọng|tốc độ|lời)` → sửa lời chỉ thu lại câu đổi; **đổi nhịp nghỉ, đổi tốc độ một câu bằng atempo, ghép lại chương đều KHÔNG cần gọi lại VBee**.
- Tốc độ mỗi kênh khai trong skill kênh. Một câu cần chậm (tục ngữ, câu then chốt): khoá `tempo` (vd `0.9`) áp bằng ffmpeg `atempo`, so khớp không phân biệt hoa thường.
- Viết cho giọng: câu ngắn ~9–12 tiếng; số đọc bằng chữ khi tự nhiên hơn; tên riêng phiên âm viết dính liền ("Panđôra"). Tốc độ ước khi viết: 200–210 tiếng/phút × 1,06 cho khoảng nghỉ.
- Làm dịu giọng gắt (nếu kênh dùng): lowshelf 180 Hz +1,5 · peaking 3 kHz −3,5 · 5,5 kHz −2 · highshelf 7 kHz −3 · deesser 0,5.
- **Hết hạn mức API giữa chừng** (13/11, tập Đài Loan): câu đã gửi nằm trong `<voice>/pending.json` — tải về bằng GET (không gửi lại), rồi gói câu còn thiếu thành `<voice>/vbee_ui/<chương>.txt` + `plan_<chương>.json` cho người dùng thu tay trên web VBee; mp3 về thì cắt bằng `studio-kit/tools/vbee_ui_split.py <voice>` (cắt theo khoảng lặng + tỉ lệ chữ, đặt tên clip đúng khoá md5). Python 3.12 bản python.org thiếu chứng chỉ SSL → chạy với `SSL_CERT_FILE=$(python3 -m certifi)`.
- Khoá VBee có thể chỉ nằm trên cloud: khi đó ghép lại giọng từ `voice/clips/` có sẵn, không gọi API (comic history: `tools/revoice.py`).

## 2. Nhịp nghỉ (chuẩn chung, học từ kênh mẫu 20/10, áp cho Hóng 13/11)
**Giữa câu 0,65 s · giữa dòng/đoạn 0,6–0,7 s · giữa shot 0,7 s · giữa chương 1,4 s.** Nhịp cũ 0,28–0,35 s bị chê "nhanh quá / liên tục, mệt". Tiếng bíp che chữ: lặng 0,3 s trước + 0,35 s sau. Độ dài tăng ~3–6 %.

## 3. Nhạc và tiếng động
- Nhạc nền thư viện kênh (`channel-example/music/library.yaml` ghi nghĩa từng bài): "The Thought of You" — TrackTribe cho phần thường; "Vespers on the Shore" (u ám) cho đoạn nghiêm/bê bối; "Pink Flamenco" cho đánh nhau (kênh mẫu). Mức **−28 đến −31 dB dưới giọng**, nâng +3 dB trong khoảng lặng ≥ 0,8 s, vào 2 s ra 3 s, đổi bài bằng giao nhau 2 s. Ghi credit trong mô tả.
- **Tiếng động: mặc định TẮT.** Montage/mở đầu chỉ nhạc (vút/bùm/keng bị bác ở kênh mẫu); tiếng động giấy tổng hợp ở tập Jensen bị bác "nghe không hay" (13/11) → comic history `mix.py` chỉ bật bằng `SFX=1`. Kênh nào muốn tiếng động thì làm 60–100 s mẫu cho người dùng duyệt trước.
- Chuẩn âm lượng bản full: **−16 LUFS** (`loudnorm=I=-16:TP=-1.5:LRA=11`).

## 4. Render
- **Lệnh render, ảnh tĩnh, dựng song song khác nhau theo style — xem mục "Lệnh" trong `styles/<slug>/STYLE.md`.** Các ý dưới ghi rõ style nào.
- webtoon-svg: `render.mjs` (engine `studio-template`) chia khúc theo shot: Mac `build/render_local.py -j N`, cloud `build/render_full.py -j N`; sửa shot nào chỉ render lại khúc đó (`--redo`). Nhiều agent dựng cùng tập: mỗi agent một tag (`styles/webtoon-svg/tools/dev_tag.sh`).
- comic-history: render bằng Chromium headless qua server 127.0.0.1 → trong sandbox Claude Code phải chạy với `dangerouslyDisableSandbox: true` (hoặc bật `sandbox.network.allowLocalBinding`). Lệnh có `rm -rf` ngoài sandbox bị chặn → ghi ra thư mục mới mỗi lần, không xoá.
- Bản xem/bản full chạy được trên Mac; khi người dùng muốn tự chạy thì đưa **một dòng lệnh** (thêm `!` ở đầu nếu gõ trong ô chat của phiên).
- **Dựng song song (comic-history)**: chụp trước trang/khung cuối của mọi chương (cú chuyển trang của chương sau cần nó) rồi render 2 chương một lúc, 4 worker mỗi chương (`studio-kit/core/build_par.sh <thư mục dựng> 03 04 …`). 13 chương ~14 phút video dựng xong trong ~10 phút trên máy 12 nhân.
- Mỗi chương render riêng rồi ghép → sửa chương nào chỉ render lại chương đó; đổi tiếng (bỏ SFX, đổi nhạc) chỉ trộn lại + ghép, không render lại hình.

## 5. QA máy — `studio-kit/tools/qa.py`
Mã thoát 1 = có LỖI; chỉ cần ffmpeg. Chạy từ thư mục kênh (đường dẫn tập tương đối với kênh).
| Lúc | Lệnh | Bắt gì |
|---|---|---|
| Trước C1 | `python3 ../studio-kit/tools/qa.py script <id>` | từ cấm, tên gọi tắt, câu dài, mở/kết quá dài, số ký tự VBee |
| Sau khi tách tấm rối / sửa khai báo rối | `python3 studio-kit/tools/rig_gate.py <thư mục dựng>` (= `qa.py rig …`) | khớp lấy từ nguồn đoán, cổ lệch giữa hai vai, điểm xoay đầu ngoài vùng cằm, đổi mặt đầu nhảy, khớp lệch ghim; sinh `qa/rig/<rối>.jpg` để soát mắt |
| Mỗi clip | `… qa.py video <clip.mp4> [--starts 0,44,…]` | khung đen, chớp trắng, cắt giữa câu; **LỖI (ngưỡng theo style, `styles/<slug>/qa.json`, đo từ phim mẫu)**: đứng im, quãng gần như không động, khung trống/phẳng, ít chuyển động, ít chi tiết; màu nhạt (cảnh báo); sinh dải 12 khung + ảnh 360 px |
| Mỗi chương (style có rối) | `node studio-kit/core/pagecheck.mjs <thư mục dựng> <chương…>` | rối vắng/nhỏ, rối giữ nguyên tư thế quá lâu, cổ–đầu lệch, đầu nhảy khi đổi mặt, ít rung máy |
| Trước khi gửi | `… qa.py gate <clip>` rồi `sh studio-kit/core/preview.sh <clip>` | chạy cả ba cổng trên + vòng rà trong `review_log.md` + miễn trừ; ghi `<clip>.gate.json` (sha256 clip + sha256 file ngưỡng); `preview.sh` chỉ nén bản gửi khi cổng đã qua với đúng clip đó và ngưỡng chưa đổi. `--no-page` chỉ để xem nhanh — khi đó cổng không đạt. Chạy ngoài sandbox (cổng trang mở server cục bộ). Chấm bản gốc 1080p. |
| Bản full | `… qa.py full <id>` / `… qa.py srt <file.srt>` | 1080p30, −16 LUFS, khung kết, phụ đề 1 dòng |
| Mỗi clip / bản full (13/11) | `python3 ../studio-kit/tools/hopcheck.py <clip.mp4> --ep episodes/<id>` | **nhân vật đứng yên mà nảy/nhảy lên một tí** (≥ ~18 px): đo chuyển động từng ô, trừ chuyển động máy, tìm cụm đi lên rồi về chỗ cũ ≤ 0,7 s; sinh dải 12 khung ở mỗi chỗ nghi. Đối chứng: bản 5 tập võ công 50 chỗ / 90 s; sau khi sửa 15 chỗ / cả tập, đều là đồ vật–hiệu ứng |
Ngưỡng theo style nằm ở `styles/<slug>/qa.json` (tự nhận khi đường dẫn clip có `/build/<slug>/`, hoặc `--style <slug>`; clip không thuộc style nào có `qa.json` — vd kênh mẫu — dùng bảng mặc định, **chỉ cảnh báo** như trước; muốn chặn thì hiệu chuẩn trên phim mẫu của style đó rồi tạo `qa.json`). Phim mẫu của style phải qua 0 lỗi với chính các ngưỡng đó (comic-history: `qa.py video styles/comic-history/reference/lemo-comic-history-demo-full.mp4 --style comic-history`); đổi `qa.json` thì mọi `gate.json` cũ hết hiệu lực.
Lỗi phải sửa; cảnh báo phải sửa hoặc ghi miễn trừ (`## Miễn trừ` trong `build/review_log.md`, mỗi dòng một phát hiện, ≤ 3 mỗi chương) — không gửi kèm lời giải thích.
Không bắt được (soát mắt, do lượt rà độc lập — references/tu-soat.md): hình sai lời, biểu cảm sai lúc, che mặt, bố cục, diễn có hợp vai không, hành động giấy có đọc ra ý không. Ảnh tĩnh nhanh: tool `peek` của style → bảng ghép, xem bằng Read.

## 6. Giao file cho người dùng
- Người dùng điều khiển từ xa: gửi qua SendUserFile, **giới hạn 30 MB** → bản xem nén: `ffmpeg -i in.mp4 -vf scale=-2:540 -c:v libx264 -preset veryfast -b:v 200k -maxrate 260k -bufsize 520k -c:a aac -b:a 64k -ac 1 -movflags +faststart out.mp4` (14 phút ≈ 27 MB); clip ngắn thì 720p `-crf 27`.
- Luôn nói rõ **đường dẫn đầy đủ** của bản đăng 1080p + `.vi.srt` + `credits.txt`, kèm lệnh `open` thư mục.
- Gửi lô sớm (3 chương đầu, hoặc bản nghe thử nhịp) để người dùng sửa hướng trước khi dựng hết.

- (2026-11-14) **Trang web studio dùng chung mọi kênh**: `cd channel-example && python3 tools/studio_web.py` → http://127.0.0.1:8765, mỗi kênh một tab. File giao của kênh nào cũng để cùng kiểu chỗ để trang thấy: `<kênh>/out/<id>*.mp4`, `<kênh>/out/<id>*.srt`, `<kênh>/out/xem/<id>_*.mp4`, `<kênh>/branding/thumb_<id>*.jpg`. Thêm kênh: thêm một dòng vào `CHANNELS` trong `studio_web.py`. Mỗi tập của mọi kênh có `episodes/<id>/episode.yaml` với `title:` và `status:` (kênh studio-kit: tạo và cập nhật bằng `studio-kit/tools/new_ep.py`); trang đọc tiêu đề, trạng thái ở đó và nút "Đánh dấu đã duyệt / đã đăng" ghi vào đó.

## 7. Làm song song bằng agent — workflow `dung-tap`
**Luôn hỏi trước** (AGENTS "Luôn áp" #7): khi bắt đầu dựng tập, hỏi người dùng có dùng workflow này không.
- Bản gốc `studio-kit/workflows/dung-tap.js`; bản chạy `shorts-claude/.claude/workflows/dung-tap.js` (sửa bản gốc rồi chép sang).
- Gọi: `Workflow({ scriptPath: "<STUDIO>/.claude/workflows/dung-tap.js", args: { build_dir, style, chapters: ["03",…], samples: ["00","01","02"], plan, rules, fast } })`.
- Chia chương thành ≤ 3 nhóm → mỗi nhóm 1 agent dựng, xong nhóm nào thì 1 agent KHÁC rà nhóm đó ngay (pipeline). Tối đa 6 agent, effort mặc định.
- Không giao cho workflow: kịch bản (dùng `video-script`), chương mẫu, mở đầu, khoảnh khắc chữ ký, chương nhạy cảm — mình làm. Sau workflow mình render song song, ghép, `qa.py`, soát mắt ảnh ghép cả tập rồi mới gửi.
- Chất lượng giữ được khi: có chương mẫu đã duyệt, mọi agent đọc cùng luật/STYLE, người rà khác người dựng, mình soát cuối. Dễ lệch: độ đồng đều giữa chương, agent tự quyết khác ý, lỗi cần đổi bố cục trang.

### Làm song song thủ công (khi không dùng workflow)
- Mẫu đã chạy tốt (Jensen 13/11): **1 agent rà soát** các chương đã dựng (ảnh tĩnh → sửa che mặt/chồng chữ/khung trống, chỉ sửa file chương được giao) + **1 agent dựng** các chương cuối theo mẫu chương đã xong; mình dựng chương khó nhất (nội dung nhạy cảm). Tổng ≤ 2–3 agent, effort mặc định.
- Brief agent: đường dẫn, file mẫu để chép cấu trúc, luật nội dung bắt buộc, công cụ soát, **file được sửa / không được sửa** (engine, kit dùng chung, chương của người khác), không `rm`, không chạy build cả tập.
- Đổi dữ liệu dùng chung giữa chừng (vd timeline) → nhắn ngay cho agent; yêu cầu mọi mốc neo theo câu/chữ, không giây cứng.
- Cần nhanh → nhắn agent "chỉ sửa lỗi rõ ràng, tối đa 1 lần chụp lại mỗi chương".

## 8. File và đồng bộ
- Không `rm` trên Mac; bản cũ chép vào `<kênh>/_to_delete/<tên>.truoc-<việc>-<ngày>`.
- File dùng chung (studio-kit, studio-template, pack): đọc lại trước khi ghi, chỉ vá đúng phần của mình.
- Làm trên claude.ai (cloud) mới cần đóng gói/đồng bộ với Mac (tar → `device_commit_files`, mp4 > 25 MB chia ≤ 17 MB + XOR 0x5A); Claude Code chạy trên Mac thì sửa tại chỗ.

# START HERE — studio-template

> **Luật + đồ nghề dùng chung theo kiểu Lemo-Opuscar: `../studio-kit/AGENTS.md`** (13/11/2026: DIRECTOR, TECHNIQUE, styles/, tools/qa.py, khung skill kênh). Thư mục này giữ engine SVG + packs.


File neo của **studio dùng chung** (engine, gói vẽ, mẫu cảnh, format). Người hoặc Claude bắt đầu session mới thì đọc file này,
rồi đọc `START_HERE.md` của kênh đang làm. Trả lời người dùng bằng **tiếng Việt**.

## Cấu trúc root (giữ đúng như vầy)
```
<root>/                        ← root KHÔNG chứa file nào, chỉ có các folder dưới đây
  studio-template/             mọi thứ dùng chung: engine, packs (style + nguồn tham khảo, nhân vật + ảnh gốc, con vật/đạo cụ),
                               templates (cảnh, format), channel_template/, script tạo kênh/tập, file neo này
  <kênh-1>/                    mọi thứ của một kênh: START_HERE, STATUS, blueprint, voice, .env, references (cả video nguồn),
  <kênh-2>/ …                  backlog, analytics, episodes/<id>/ (+ archive/ của tập đó)
```
Thứ gì mới: dùng chung được cho kênh khác → `studio-template/`; chỉ của một kênh → folder kênh đó. Không để gì ở root.
Kênh mới: `./new_channel.sh ../<kênh> "Tên"` — copy `channel_template/` (đã có sẵn `START_HERE.md`, `STATUS.md`).

## Bắt đầu session (checklist)
1. File này.
2. `<kênh>/START_HERE.md` — kênh là gì, luật đã chốt, bản đồ folder kênh.
3. `<kênh>/STATUS.md` — đang làm tới đâu, việc tiếp theo, nhật ký quyết định.
4. `<kênh>/blueprint.yaml` — luật giọng văn, từ cấm, công thức kịch bản, format mặc định.
5. Khi viết/sửa video: `templates/formats/<format>/format.yaml` (độ dài, beat sheet, bố cục) và `templates/scenes/catalog.md`.
6. Chỉ hỏi người dùng khi việc tốn kém và mơ hồ; còn lại cứ làm hết các bước.

## Kết thúc session (bắt buộc)
- Cập nhật `<kênh>/STATUS.md`: **Hiện tại**, **Việc tiếp theo**, thêm dòng **Nhật ký quyết định** (ngày + quyết định + lý do).
- Cập nhật `status` trong `episode.yaml` và trong `backlog.csv`. Bài học lâu dài → `blueprint.yaml`.

## Quy trình một video (2 cổng duyệt)
1. Chọn chủ đề trong `backlog.csv` → `./new_episode.sh ../<kênh> <id> [format]`.
2. Viết `episode.yaml` → `plan` → `audio --silent` → `qa` → `stills`.
3. **Cổng 1 — người dùng duyệt kịch bản** (gửi lời thoại + `build/contact.jpg`). Chưa duyệt thì chưa tạo giọng.
4. `voice` → `audio` → `qa` → `render` → **Cổng 2 — người dùng duyệt video**.
5. **Chốt video → bài đăng:** viết `post.caption` + `post.hashtags` trong `episode.yaml` (theo `blueprint.publishing`) → `post` →
   `post.md` có caption + hashtag dán nguyên khối và comment ghim. Hai chế độ comment: `--mode nguon` (danh sách nguồn video đã dùng, kèm link)
   hoặc `--mode fact` (1 fact hay ho thêm, đã kiểm chứng, ở `post.bonus_fact`). Có link (Shopee…) → `--link URL` thêm câu ủng hộ kênh.
   Người dùng gọi skill **video-post-gen** để làm trọn bước này.
6. Sau khi đăng: ghi link vào mục "Đã đăng" của `post.md`, `analytics.csv`, rút kinh nghiệm vào blueprint, cập nhật STATUS.

## Lệnh
```
./new_channel.sh ../<kênh> "Tên kênh"
./new_episode.sh ../<kênh> <id> [format]          # format: short-60 | long-8min | long-150 | bio-long (tiểu sử 16:9, 10–20 phút) | geo-long (địa chính trị 16:9, 15–25 phút, không người dẫn) | long-3min (16:9, style phẳng, có phụ đề) | story-long (16:9, 24 fps, stickhead-v1, mỗi chuyện = 1 chương)
python3 engine/build.py ../<kênh>/episodes/<id> plan|voice|audio [--silent]|mix|qa|stills|render|remux|all [--force]|post
tools/local/run.sh ../<kênh>/episodes/<id> <như trên>   # máy local: dùng .venv, `render` song song (cài: tools/local/setup_local.sh)
```
Tài nguyên kênh (nhạc nền, sound, meme, nền video/ảnh) — `engine/media.py`, mô tả đủ khoá ở đầu file: blueprint `media:` chỉ folder
(vd `assets/music`, `assets/sfx`), gọi file theo tên (không cần đuôi, gần đúng cũng được); mặc định kênh `music: {pick: any}`, `background:`, `intro_sfx:`
(sound mở đầu, giọng chờ sound), shot `sfx: [{file, at: "chữ"}]`, shot `memes: [{file, at: "chữ", pos, dur}]` (ảnh/gif/mp4, mp4 giữ tiếng),
`<folder>/library.yaml` = nghĩa + lúc dùng từng file (Claude đọc để CHỌN; engine chỉ phát). `render` tự chạy `mix`. Thiếu file → bỏ qua + QA ⚠️.
Lời đọc: `{từ}` = che bằng tiếng bíp — TTS đọc nguyên câu liền mạch với "bíp" thay từ đó, engine tách âm tiết (chỗ âm lượng trũng + độ dài chữ) để tắt giọng đúng chữ và đặt tiếng bíp (blueprint `censor: {sfx, gain_db, say}`) · shot `line_voices: [người, người]` = mỗi câu một giọng ·
shot `hold: 0.8` = giữ khung thêm sau câu chốt · ảnh trong cảnh `src: anh.png` (file trong folder tập, tự nạp trước). `voice` gặp câu bị VBee chặn → tạo hết câu khác rồi liệt kê.
Phụ đề YouTube: `build.py … subs` (tự chạy sau `audio`) → `build/<id>.<lang>.srt` + `<kênh>/out/<id>_<format>.<lang>.srt` (lang = blueprint `language`) — tải lên YouTube Studio, không in vào hình.
Giọng tiếng Anh offline: voice.yaml `provider: kokoro`, `voice_id: kokoro:am_michael` (am_adam, bm_george, bm_lewis…), model ở `.cache/tts/kokoro-int8-en-v0_19`
(tải 1 lần từ GitHub releases sherpa-onnx `tts-models`; `pip install sherpa-onnx`); ~3–4 s máy cho mỗi giây lời trên cloud 2 nhân. Format tiếng Anh kiểu Kurzgesagt: `explainer-en`.
Nhạc/SFX: cue sheet `music:` + `sfx:` trong episode.yaml (mốc = id shot, `shot#2` = câu thứ 2, `shot+1.5`), bài trong `<kênh>/music/` tra theo mood ở `music/library.yaml` → `mix` ghi `build/mix.wav` (render dùng nó nếu mới hơn narration) → `remux` thay tiếng mp4 có sẵn, không render lại hình. Thiếu file thì bỏ qua và báo.
Kết quả: `build/qa.md`, `build/contact.jpg`, `build/timeline.json`, `build/youtube.md` (format dài: chương + vị trí quảng cáo),
video thành phẩm → **`<kênh>/out/<id>_<format>.mp4`** (mọi tập của kênh nằm chung một folder để tải lên hàng loạt).

## Môi trường (các session trước đã vấp — đọc kỹ)
Root là folder chứa `studio-template/` trên Mac của người dùng (đường dẫn hiện tại ghi trong tài liệu `START_HERE.md` của Project;
tên folder có thể đổi — không viết cứng tên nó ở đâu cả). Qua device bridge: `$HOME/mnt/<tên root>` (xem bằng `ls $HOME/mnt`).
- **Máy local (Mac mini / MacBook) — MẶC ĐỊNH từ 2026-10-14**: chạy mọi bước (`voice`, `audio`, `qa`, `stills`, `render`, `post`) thẳng trên máy của người dùng — không qua cloud, không đồng bộ tarball, mạng không bị allowlist.
  Cài một lần: `cd studio-template && tools/local/setup_local.sh` (kiểm node/ffmpeg/python3 — thiếu thì in lệnh `brew install node ffmpeg python` chứ không tự cài; `npm install`; tải Chromium của Playwright ~150 MB; tạo `.venv`; thử chụp một khung).
  Chạy: `tools/local/run.sh ../<kênh>/episodes/<id> <lệnh>` — `<lệnh>` như `build.py` (plan|voice|audio|subs|mix|qa|stills|render|remux|all|post). `render` chạy **song song theo đoạn khung** (`tools/local/render_parallel.py`; `--jobs N` mặc định min(4, nhân/2), `--chunk K` khung mỗi đoạn, `--keep` giữ build/chunks; `--serial` = `build.py render` tuần tự). Video ghi thẳng vào `<kênh>/out/`.
  Script ngoài, KHÔNG sửa `build.py`: `render_parallel.py` nạp `build.py` như module và lặp lại phần chọn tiếng/tên file của `cmd_render` — nếu `cmd_render` đổi thì sửa theo.
  Đã thử 2026-10-14 (cloud 2 nhân): tập ngắn 48 s render 5 đoạn song song ra đủ 1444 khung + tiếng; so với render tuần tự PSNR trung bình 49,9 dB, thấp nhất 46,2 dB (không lỗi ở chỗ nối đoạn). Tốc độ trên Mac CHƯA đo — đo tập đầu rồi ghi vào "Hạn chế đã biết".
  Lần đầu trên Mac: chạy `stills` và xem `build/contact.jpg` (Chromium macOS vẽ chữ/font hơi khác Linux); ffmpeg Homebrew thường có `zscale` (format `colour: bt709`).
  Claude Code mở thẳng trong folder này trên máy local chạy được y hệt (không cần device bridge). Claude Cowork qua device bridge vẫn theo mô tả cũ ngay dưới.
- **Mac qua device bridge của Cowork** (cũ): python3 + pyyaml; **không** có numpy/soundfile/Chromium. Chỉ chạy bước `voice` ở đây (giữ `.env` trên máy):
  `cd "$HOME/mnt/<tên root>/studio-template" && python3 engine/build.py ../<kênh>/episodes/<id> voice`
  Mặc định không xoá được file (cần xin quyền xoá); ghi đè thì được.
- **Cloud container** (dự phòng khi không có máy local; 2 nhân, chậm): có numpy/soundfile/pillow, ffmpeg, Chromium → chạy `audio`, `qa`, `stills`, `render`. Đồng bộ:
  1. Mac: `cd "$HOME/mnt/<tên root>" && mkdir -p studio-template/.cache && tar czf studio-template/.cache/sync.tgz --exclude node_modules --exclude .cache --exclude renders --exclude archive --exclude source --exclude refs --exclude 'references/content/*/*.mp4' --exclude '.env' --exclude .DS_Store studio-template <kênh>`
     (`.cache/` là chỗ tạm duy nhất; file trong đó ghi đè mỗi lần, xoá được thì xoá sau khi dùng — **trừ `.cache/tts/`**: kho giọng/mô hình offline dùng chung cho mọi kênh (VOICEVOX, Kokoro, AivisSpeech), không phải file tạm, đừng xoá.)
  2. Stage `studio-template/.cache/sync.tgz` vào container, giải nén vào `/home/claude/studio/`.
  3. Container: `cd studio-template && npm install` (playwright 1.56.1) · `pip install --break-system-packages -r requirements.txt` ·
     `export CHROMIUM_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)`.
  4. Container không có `.env` → engine tìm clip giọng qua `audio/clips/index.json` (bước `voice` ghi file này).
  5. Trả kết quả về Mac: ghi thẳng từng file vào đúng chỗ trong folder kênh (video → `<kênh>/out/*.mp4`; `build/qa.md`, `build/contact.jpg`,
     `build/youtube.md`…). Gửi video cho người dùng xem trong chat.
- **Mạng**: allowlist có `api.vbee.vn`, `vbee.vn`, `vbee-studio2-3.s3.ap-southeast-1.amazonaws.com`.
  VBee: gói của người dùng không cho chế độ sync → engine dùng async + poll (đã viết sẵn).

- **Giọng**: VBee (tiếng Việt) hoặc ElevenLabs (tiếng Anh, `voice.yaml provider: elevenlabs`, `.env`: ELEVENLABS_API_KEY / ELEVENLABS_VOICE) — cả cloud lẫn môi trường Claude trên Mac đều CHƯA vào được api.elevenlabs.io (kiểm tra 2026-10-06; VBee thì được) → thêm `api.elevenlabs.io` vào danh sách domain cho phép trong cài đặt Claude, HOẶC người dùng tự chạy `python3 engine/build.py ../stick_history/episodes/<id> voice` trong Terminal của Mac (mạng thường), rồi Claude làm tiếp từ bước audio. Kênh YouTube: `blueprint.publishing.platform: youtube` → `post` sinh tiêu đề + mô tả có chương + comment ghim.

## Bảo mật
`<kênh>/.env` chứa VBEE_APP_ID / VBEE_TOKEN / VBEE_VOICE. **Không bao giờ in giá trị** (kiểm tra: `sed -E 's/=.*/=<set>/' .env`).
Không đưa `.env` vào tar/zip gửi đi; nhắc người dùng khi chia sẻ folder kênh.

## Giọng đọc
- Danh mục giọng VBee tiếng Việt: `voices/vbee-vi.yaml` (alias `nu-bac-ngochuyen`, `nam-nam-minhhoang`, `tre-bac-vietbach`…). Cập nhật: gọi `https://vbee.vn/api/v1/voices?languageCode=vi-VN` bằng khoá trong `.env`.
- Nhiều người trong một video: `cast: {<người>: <alias>}` trong episode.yaml (người = `speaker:` của shot hoặc `params.card.user`), hoặc `voice: <alias>` ngay trên shot. Không có thì dùng giọng mặc định của kênh (`voice.yaml`).

## Quy ước khi sửa / mở rộng
- **Một video = một `episode.yaml`.** Không sửa tay `build/` hay video trong `out/` — chạy lại lệnh.
- Mốc thời gian trong cảnh (`at`) là **từ trong lời thoại của shot đó** (không phân biệt hoa thường), `{line, word}` hoặc giây.
  Đổi lời → chạy `qa` để bắt mốc bị mất.
- Cảnh dùng lại được → `templates/scenes/scenes.js` **và** `catalog.md`. Cảnh một lần → `episodes/<id>/scenes.js`
  (`EPISODE_SCENES.<fn>`, `template: custom`).
- Con vật / đạo cụ mới → `packs/assets/animals.js` / `props.js` (đăng ký `PROPS`), vẽ đúng `packs/style/<style>/style.md`
  (ảnh mẫu gốc: `packs/style/doodle-v1/source/`).
- Chép lời video tham khảo (tiếng Trung…) → `tools/asr/README.md` (SenseVoice qua GitHub release; HuggingFace bị chặn).
- Người dùng tự viết lại từng câu kịch bản (trang "Bàn Sửa Lời" → xuất → áp lại + ghi voice_notes) → `skills/gen-web-sua-loi/SKILL.md`, công cụ `tools/sua-loi/`.
- Style cắt dán (mặt cắt từ chân dung public domain + thân vẽ) → `packs/style/cutout-v1/` (bản thử; README: việc còn thiếu, ảnh phải tải về đĩa).
- Bản đồ Việt Nam (34 tỉnh, 63 tỉnh cũ, Hoàng Sa, Trường Sa, nước láng giềng) → `packs/maps/vietnam/` (đọc README: luật vẽ bắt buộc + nguồn).
- Bản đồ THẾ GIỚI (Natural Earth 10m POV Việt Nam → 50m/110m, tên tiếng Việt, sông/hồ/thành phố/biển, d3-geo + `World.drawBase/assertLegal`) → `packs/maps/world/` (README: luật vẽ, phép chiếu; tạo lại: `tools/maps/world/`).
- Thế giới 3D (three.js r147, vẽ code) dưới lớp SVG → `packs/3d/` (layer3d.js đăng ký vào móc `window.FRAME_LAYERS` của engine/runtime.js; shot có `params.three: <key>` vẽ cảnh `window.SHOT3D[key]`; nv_light.js = ánh sáng ăn vào nhân vật billboard). Tập không nạp thì không đổi gì. Phòng thử + sổ tay: `channel-example/episodes/lab-visual-v2/` (SO_TAY_3D.md). Render cần Chromium ngoài sandbox (Claude Code: dangerouslyDisableSandbox).
- Nhân vật mới → `packs/characters/<id>/` (+ `refs/` ảnh gốc). Format mới → `templates/formats/<id>/` (`format.yaml`, `layout.js`,
  `example_episode.yaml` nếu cấu trúc khác).
- Nền phủ cả khung dùng `bgRect(W, H, fill)` (hoặc `bgFor(...)`), **không** `rect(0, 0, W, H, …)`: layout `short-60` đặt cảnh thấp xuống (`content.screen_y`), nền phải tràn lên trên y=0 để không hở mép trên.
- Chuyển cảnh: `transition: {type: fade|black|push|slide|iris|wipe|drip|zoom, dur, dir, at}` trên shot ĐẾN (engine/runtime.js); shot đi tiếp tục chạy trong lúc chuyển.
- Style pack có `pack.yaml` (vd `flat-v1`) tự khai script + font; build.py khi đó KHÔNG nạp asset/scene doodle, nhân vật lấy từ `blueprint.characters`.
- Engine **trung lập với kênh**: chữ, từ cấm, giọng, nhân vật đến từ blueprint / voice / episode, không viết cứng.
- Thứ tự ghi đè khoảng nghỉ: format → `voice.yaml` → `episode.yaml`.
- Tên clip giọng = hash(voice|speed|câu) → sửa một câu chỉ tạo lại câu đó.
- Trước khi giao: `qa` không còn ❌, đã xem `contact.jpg` và vài khung của video.

## Style pack hiện có
- `doodle-v1` (Biết Tuất), `flat-v1` (ve_chuyen_ref, kiểu Kurzgesagt; tầng `light.js` = gradient/DoF/neon/hạt đo từ Kurzgesagt gốc), `stickhead-v1` (stick_history: thân que + đầu biếm hoạ, đo từ Serious History; format đi kèm `story-long`, người dẫn nháp `su-gia`). Mỗi pack có `style.md` (đặc tả đo được) + `test/` (khung thử cạnh khung gốc).

## Hạn chế đã biết
- Mẫu cảnh trong `scenes.js` canh cho **dọc 9:16**. Ở 16:9 (`long-150`, `long-8min`) vài cảnh lệch: bóng thoại `narrator_talk`
  ra ngoài khung, `analogy` đè nhãn vàng. Cần canh theo `ctx.W/ctx.H` trước video dài đầu tiên.
- Render trên **cloud** 2 nhân (dự phòng; trên máy local dùng `tools/local/run.sh … render` chạy song song — chưa đo tốc độ): 3–11 phút cho 60s tuỳ cảnh (tập mèo ~3 phút, tập cá voi ~11 phút); video 9 phút ≈ 45 phút+.
  Lệnh shell của Claude bị ngắt sau 10 phút, và tiến trình chạy nền (`nohup … &`) cũng từng bị dừng giữa chừng → video dài/chậm thì
  render **theo đoạn khung** (mỗi đoạn ~700 khung, chỉ hình), ghép bằng `ffmpeg -f concat … -c:v copy`, rồi mux `build/narration.wav` (`-shortest`).
- Render theo đoạn đã có sẵn: `node engine/render.mjs <ep>/build/render.json <ep>/build/chunks/cN.mp4 --frames a:b` (chỉ hình) →
  `ffmpeg -f concat … -c:v copy` → mux `build/narration.wav`. render.json tạo bằng `stills` (hoặc `build.render_json`). Style flat-v1: thực đo 3 phút 16:9 ≈ 6 phút render (3 đoạn ~1.400–2.000 khung).
- Trước khi render lại một tập cũ trên cloud: chạy `audio` trước để `build/narration.wav` khớp `timeline.json` (bản trên Mac có thể là bản cũ).

Giọng tiếng Nhật AivisSpeech (offline, model ACML — không bắt buộc credit): cast `aivis:<style_id>@<speed>[@<intonation>]`.
  Cài 1 lần: `tools/aivis/setup.sh` (file model tải tay vào `.cache/tts/aivisspeech/downloads/`, xem README trong đó).
  Mỗi tập: `tools/aivis/run.sh <ep>` (lặp tới "done"; VM giết tiến trình nền sau mỗi lệnh) → `tools/voicevox/tts.py <ep> --ref-for-aivis`
  → `tools/align/aivis_parts.py <ep>` (DTW: thời điểm phụ đề từ clip VOICEVOX cùng lời) → `build.py <ep> audio`.

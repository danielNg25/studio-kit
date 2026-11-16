# Lệnh và công cụ

Đường dẫn: Mac `<STUDIO>/`; cloud (nếu có) `/home/claude/studio/`. Engine: `studio-template/engine/` (`build.py`, `render.mjs`).

## Một tập
```
episodes/<id>/
  outline.md  script.md  episode.yaml  thumb.js  post.md
  mkscenes.sh            ghép mọi sc_*.js → scenes.js (hoặc build/scenes_dev_<tag>.js)
  sc_*.js                cảnh; bộ đồ nghề chép từ tập trước (sc_bgkit, sc_sets, sc_kit, sc_tdk, sc_fight, tqlib/, bg/, sc_tq_a_kit…)
  build/                 timeline.json, render.json, final_audio.m4a, still.py, job.py, render_local.py, voice_batch.py, voice_fx.py, design/
```
Tập mới: chép bộ đồ nghề của tập gần nhất cùng bộ truyện (Tam Quốc → `xu-an-tao-thao` hoặc `xep-hang-cao-thu-tam-quoc`), sửa id trong `mkscenes.sh` và các script build, sinh `episode.yaml` từ `script.md` (`build/gen_stub.py`).

## Lệnh hay dùng (chạy trong thư mục tập)
| Việc | Lệnh |
|---|---|
| Timeline từ giọng thật | `python3 ../../../studio-template/engine/build.py . audio` |
| Timeline ước lượng (chưa có giọng) | `… build.py . audio --silent` |
| Trộn nhạc | `… build.py . mix` · thay tiếng cho video đã render: `… remux` |
| Bài đăng | `… build.py . post` |
| Ghép cảnh | `sh mkscenes.sh` · bản dev: `sh mkscenes.sh dev main` |
| Ảnh tĩnh soát | `rm -rf build/prev/_st; python3 build/still.py <tên> c02_01:1.5,4 c03_00:2` → `build/prev/<tên>.jpg` |
| Một cảnh tự do (ảnh bìa, thử) | `python3 build/job.py <fn> <giây> <file.js…>` → `node ../../../studio-template/engine/render.mjs build/job_<fn>.json <ra> --stills t1,t2` |
| Clip thử một đoạn | `node …/render.mjs build/render.json <ra.mp4> --frames a:b` |
| Thu giọng (sau khi báo ký tự) | `cd build && python3 voice_batch.py 40` (lặp) → `python3 voice_fx.py` |
| Dải 12 khung liền (soát đòn đánh, chỗ chuyển cảnh) | `ffmpeg -v error -ss <giây> -i <clip.mp4> -vf "scale=320:-1,tile=12x1" -frames:v 1 build/prev/strip_<giây>.jpg` (đặt `<giây>` sớm hơn điểm chạm ~0,15 s; 12 khung = 0,4 s) |
| Ảnh ghép cỡ điện thoại | `ffmpeg -v error -i <clip.mp4> -vf "fps=1/2,scale=360:-1,tile=4x4" build/prev/phone_<chương>_%02d.jpg` |

## Kiểm tra máy móc — `tools/qa.py` (2026-11-13)
Chạy từ `channel-example/`. Từ 13/11 bản thật ở `studio-kit/tools/qa.py` (dùng chung mọi kênh, xem `studio-kit/TECHNIQUE.md` §5); `tools/qa.py` của kênh là vỏ gọi nên lệnh dưới giữ nguyên. Mã thoát 1 = có LỖI. Chỉ cần ffmpeg, không gọi mạng/VBee.

| Lúc | Lệnh | Bắt gì |
|---|---|---|
| Trước C1 | `python3 tools/qa.py script <id>` | từ cấm (hanh-van §3), tên gọi tắt, từ văn viết, câu quá dài, mở đầu > 30 s / kết > 40 s (ước), mục thiếu từ nối, số ký tự VBee |
| Mỗi clip chương | `python3 tools/qa.py video <clip.mp4> --ep <id> --shot <shot đầu chương>` (hoặc `--offset <giây>`) | khung đen, chớp trắng, vùng giữa đứng im ≥ 2,5 s, khung trống lớn (> 40 % vùng phẳng ≥ 3 s), cắt cảnh giữa câu; sinh dải 12 khung ở mọi chỗ cắt + ảnh 360 px vào `qa_<clip>/` (thêm `--at t1,t2` cho đòn lớn) |
| Trước khi gửi chương | `python3 tools/qa.py gate <id> --chapter N --clip <clip.mp4>` | có vòng soát trong `build/review_log.md`, mọi mục ≥ 8, log mới hơn clip |
| Bản full (C6) | `python3 tools/qa.py full <id>` | 1920×1080, 30 fps, số khung = timeline × 30, −16 LUFS, 17 s cuối im, phụ đề `.vi.srt` mỗi cue 1 dòng |

**Không bắt được** (vẫn phải soát bằng mắt trên ảnh nó sinh ra): nhân vật giật/reset tư thế trong cùng bối cảnh, zoom thay hành động, hình sai lời, biểu cảm, bố cục, cảnh đánh so mẫu.

## Render tại Mac (bản xem chương / bản full) — đưa người dùng một dòng
```
cd "<STUDIO>/channel-example/episodes/<id>" && python3 build/render_local.py -j 4
```
Tuỳ chọn: `--fresh` (render lại toàn bộ, bỏ khúc cũ) · `--redo shotA,shotB` (chỉ khúc chứa các shot đã sửa) · `--only K` (thử K khúc). Đứt giữa chừng: chạy lại không `--fresh`. Ra `channel-example/out/<id>_bio-long.mp4`. Script dùng `build/render.json` + `build/final_audio.m4a` (không cần giọng rời). Tập mới: chép `render_local.py` của `xu-an-tao-thao`.

## Đồng bộ cloud ↔ Mac
**Chỉ áp khi làm trên claude.ai** (có công cụ `device_commit_files` / `device_stage_files`). Session Claude Code chạy thẳng trên Mac thì bỏ qua cả mục này: sửa file tại chỗ, không đóng gói, không XOR.
- Gói nhiều file: tar.gz vào `/mnt/user-data/outputs/<tên mới mỗi lần>/` → `device_commit_files` → giải nén trên Mac bằng python tarfile → so md5 (vd `md5sum sc_*.js | md5sum` hai bên).
- File > 25 MB: chia ≤ 17 MB; file mp4 bị kho trung gian sửa đầu file → XOR từng byte (0x5A) trước khi gửi, XOR lại trên Mac, so md5.
- mp4 luôn `-movflags +faststart`.
- Lấy file từ Mac: `device_stage_files` (mỗi lần stage là ảnh chụp tại lúc đó).

## Kiểm bản full
`ffprobe` độ dài + 1080p30 + có tiếng; loudness −16 LUFS (`loudnorm=I=-16:TP=-1.5:LRA=11`); 20 s cuối là màn hình kết thúc; bản xem gửi chat thì nén 720p (`-vf scale=-2:720 -crf 29`).

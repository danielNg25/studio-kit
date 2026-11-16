# studio-kit — luật và đồ nghề dùng chung cho mọi kênh

Cấu trúc học theo Lemo-Opuscar (`vendor/lemo-opuscar/AGENTS.md`): một file chỉ đường (file này), luật đạo diễn (`DIRECTOR.md`),
luật dựng (`TECHNIQUE.md`), mỗi style một `STYLE.md`, mỗi kênh một skill mỏng chỉ giữ phần riêng của kênh.
Tạo 13/11/2026 từ skill kênh mẫu (luật đã được người dùng duyệt qua ~15 tập) + bài học tập Jensen (Hóng, comic history).

| Việc | Đọc |
|---|---|
| Bắt đầu mọi session của một kênh | skill của kênh: `<kênh>/skill/SKILL.md` → nó trỏ về đây |
| Đề tài, tiêu đề, pháp lý | [references/de-tai.md](references/de-tai.md) |
| Cấu trúc video, dựng cảnh, chữ, phụ đề, diễn hoạt, bản đồ, người thật | [DIRECTOR.md](DIRECTOR.md) |
| Giọng, nhịp nghỉ, nhạc, tiếng động, render, QA, gửi file, song song | [TECHNIQUE.md](TECHNIQUE.md) |
| Chọn / dựng theo một style hình | [styles/README.md](styles/README.md) → `styles/<slug>/STYLE.md` |
| Tự soát + chấm điểm trước khi gửi | [references/tu-soat.md](references/tu-soat.md) |
| Cách làm việc với người dùng (giao tiếp, tiền, file, ghi luật) | [references/lam-viec.md](references/lam-viec.md) |
| Ảnh bìa | [references/anh-bia.md](references/anh-bia.md) · công cụ `tools/thumb_text.py` |
| Bài đăng YouTube | [references/dang-bai.md](references/dang-bai.md) |
| Shorts / TikTok | [references/shorts.md](references/shorts.md) |
| Đọc số liệu sau đăng | [references/so-lieu.md](references/so-lieu.md) |
| Mở kênh mới | [channels/README.md](channels/README.md) |
| Viết kịch bản bằng workflow | `~/.claude/video-script-kit/` (luật toàn cục trong `~/.claude/CLAUDE.md`) |

## Luôn áp, mọi kênh (không cần ai nhắc)
1. Tiếng Việt, gọi người dùng **bạn**, xưng **mình**. Thứ người dùng cần chép (tiêu đề, mô tả, lệnh) đưa thẳng trong chat.
2. **Không đăng/lên lịch/trả lời comment hộ.** Không in `.env`/khoá. Không `rm` file trên Mac — dời vào `<kênh>/_to_delete/`.
3. **Việc tốn tiền (VBee, API trả phí): báo số ký tự/chi phí trước MỖI lần gọi và chờ xác nhận.** Workflow > 7 agent hoặc agent trên mức medium: hỏi trước.
4. **Làm xong trọn phần được giao rồi mới báo**; tự soát cả phần người dùng chưa xem ([tu-soat.md](references/tu-soat.md)); có nhật ký soát mới được gửi.
5. Góp ý mơ hồ → làm theo nghĩa hẹp nhất rồi gửi xem. Hướng đã bị bác thì không đề xuất lại.
6. Góp ý dùng lại được → ghi ngay: **dùng chung mọi kênh → file ở `studio-kit/`**; chỉ của một kênh → `<kênh>/skill/references/`. Dạng `- (YYYY-MM-DD, tập …) luật — "câu gốc"`. Luật mới thay luật cũ thì sửa luật cũ.
7. **Bắt đầu dựng một tập (hoặc khi đổi từ chương mẫu sang các chương còn lại): HỎI người dùng có dùng workflow `dung-tap` (dựng song song bằng agent) không** — người dùng dặn 13/11 vì hay quên. Nêu ngắn: số agent dự kiến, nhanh hơn ~2–3 lần, tốn thêm token (~1 triệu cho 5–6 agent). Chỉ chạy khi người dùng đồng ý (TECHNIQUE §7).
8. Người dùng đang điều khiển từ xa → gửi file thẳng vào chat (SendUserFile, ≤ 30 MB: nén trước, xem TECHNIQUE §6).

## Các bước một video (cổng duyệt đặt tên theo kênh)
| Bước | Việc | Đọc trước | Cổng |
|---|---|---|---|
| 1 | Đề tài, tiêu đề, dàn ý — mở tập bằng `tools/new_ep.py new <kênh> <id> "<tiêu đề>"` (tạo `episode.yaml`), qua mỗi cổng ghi `new_ep.py status …` | references/de-tai.md · DIRECTOR §1 · skill kênh | C0 dàn ý |
| 2 | Kịch bản | hành văn của kênh · DIRECTOR §1 · `qa.py script` | C1 kịch bản |
| 3 | Giọng, nhạc | TECHNIQUE §1–3 | báo ký tự trước khi gọi VBee |
| 4 | Nhân vật mới | STYLE.md của style · skill kênh | C2 bảng nhân vật + **cổng rối** (`tools/rig_gate.py` 0 lỗi, mở xem `qa/rig/*.jpg`) |
| 5 | Kế hoạch cảnh + nền: mỗi cảnh ghi ai diễn (cỡ rối), hành động giấy, cú chạm ở chữ nào | DIRECTOR §2–5 · STYLE.md (Chuẩn chất lượng) | C3 |
| 5b | **Chứng minh hình**: một chương mẫu (hoặc 3 cảnh + một hành động chữ ký) dựng bằng code thật, đặt cạnh khung phim mẫu của style | STYLE.md · `styles/<slug>/reference/` | **C4 người dùng duyệt hình một lần mỗi tập trước khi dựng các chương còn lại** |
| 6 | Dựng từng chương (hoặc 3 chương đầu) — **hỏi dùng workflow `dung-tap` không** | DIRECTOR · STYLE.md · TECHNIQUE §4–5, §7 | C5 từng chương / lô đầu: `qa.py gate <clip>` qua + vòng rà toàn ĐẠT; bản gửi làm bằng `core/preview.sh` |
| 7 | Bản full | TECHNIQUE §4–6 · `qa.py gate` + `qa.py full` | C6 |
| 8 | Ảnh bìa | references/anh-bia.md | C7 2–3 phương án |
| 9 | Bài đăng | references/dang-bai.md | Người dùng tự đăng |
| 10 | Shorts | references/shorts.md | |
| 11 | Số liệu 48 h / 7 ngày | references/so-lieu.md | đề xuất luật cho người dùng duyệt |

Cổng: không qua cổng thì không làm bước sau. Người dùng giao "tự làm hết, tự review" thì đi liền, chỉ dừng ở việc tốn tiền và việc không đảo ngược.
**Cổng máy do công cụ giữ** (2026-11-13, sau bản xem tập Đài Loan bị bác dù QA "0 lỗi"): cảnh báo phải sửa hoặc ghi miễn trừ; `core/preview.sh` không làm bản gửi khi `qa.py gate` chưa qua; người rà khác người dựng ([tu-soat.md](references/tu-soat.md)).
Cần đăng gấp: ưu tiên chạy song song (TECHNIQUE §7), gửi lô sớm để người dùng sửa hướng sớm.

## Bản đồ thư mục
```
studio-kit/
  AGENTS.md  DIRECTOR.md  TECHNIQUE.md
  references/        luật chung theo chủ đề (tự soát, làm việc, đề tài, ảnh bìa, đăng bài, shorts, số liệu)
  styles/<slug>/     STYLE.md + engine/ dùng chung (nếu style có engine riêng) + template/ khung một tập + new_episode.sh / freeze.py
  core/              dùng chung mọi style cùng page contract: revoice.py (giọng + mốc câu), mix.py, assemble.py (nhạc theo chương, .srt, −16 LUFS),
                     export.mjs, peek.sh (ảnh tĩnh), build_par.sh (dựng song song), pagecheck.mjs (soát mức trang: rối, diễn), preview.sh (bản gửi — chỉ khi đã qua cổng)
  tools/             qa.py (QA máy + cổng cho mọi kênh), rig_gate.py + rig_dump.mjs (cổng khớp rối), thumb_text.py,
                     new_ep.py (tạo tập mới + ghi status vào episodes/<id>/episode.yaml — trang web studio đọc file này cho mọi kênh)
  workflows/         dung-tap.js (bản gốc; bản chạy: shorts-claude/.claude/workflows/)
  channels/          README (mở kênh mới) + _template/skill/ (khung skill kênh)
studio-template/     engine SVG + packs vẽ + channel_template (giữ chỗ cũ vì các kênh trỏ đường dẫn tới đây)
vendor/lemo-opuscar/ thư viện 99 style + core render (page contract READY/render(t)/DUR/EV/TEXTS)
```

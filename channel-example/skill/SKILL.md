---
name: channel-video
description: "Làm video kênh YouTube Kênh Mẫu (studio shorts-claude): chọn đề tài, dàn ý, kịch bản theo hành văn kênh, giọng VBee, dựng hình bằng code, cảnh đánh, ảnh bìa, bài đăng, Shorts. Dùng cho MỌI việc của kênh mẫu để không phải nhắc lại luật."
---

# Kênh Mẫu — luật riêng của kênh

**Luật chung mọi kênh nằm ở `studio-kit/` — đọc `studio-kit/AGENTS.md` trước** (luôn áp, các bước, cổng duyệt), rồi `DIRECTOR.md` (dựng cảnh, chữ, phụ đề, diễn hoạt, nội dung nhạy cảm), `TECHNIQUE.md` (giọng, nhịp nghỉ, nhạc, render, QA, giao file, song song) và `studio-kit/references/` (tự soát, làm việc, ảnh bìa, đăng bài, shorts, số liệu). Skill này chỉ giữ phần riêng của Kênh Mẫu; **khi khác nhau, file ở đây thắng**. Tách ra ngày 13/11/2026; bản trước khi tách: `channel-example/_to_delete/skill.truoc-studio-kit-20261113/`.

Kênh tiếng Việt, người dẫn **MC** (đầu thằn lằn, áo phú hộ vá), kể/bình/xếp hạng Tam Quốc, Tây Du, Thủy Hử, Kim Dung, văn học kinh điển. Video dài 16:9 ~15–25 phút + Shorts. Style hình: **webtoon-svg** (`studio-kit/styles/webtoon-svg/STYLE.md`), giọng VBee Quốc Huy Pro.
Studio: Mac `<STUDIO>/`, kênh `channel-example/`, tập `channel-example/episodes/<id>/`.

## Riêng kênh, luôn áp
1. **Render bản xem chương / bản full tại Mac** bằng một dòng lệnh người dùng tự dán ([lenh.md](references/lenh.md)); cloud chỉ ảnh tĩnh + clip thử ngắn.
2. Cảnh đánh là **signature** của kênh: mọi video có, so với mẫu `mau_holao_v5.mp4` ([canh-danh.md](references/canh-danh.md)). Bảng điểm tự soát có thêm mục "Cảnh đánh".
3. Tiếng động: chỉ ở hành động có thật trên hình, mức nhỏ ([giong-am-thanh.md](references/giong-am-thanh.md)); montage không tiếng động.

## Đi theo bước — đọc đúng file trước khi làm
| Bước | Việc | Chung (studio-kit) | Riêng kênh | Cổng |
|---|---|---|---|---|
| 1 | Đề tài, tiêu đề, dàn ý | references/de-tai.md · DIRECTOR §1 | [de-tai.md](references/de-tai.md), [cau-truc.md](references/cau-truc.md) | C0 dàn ý |
| 2 | Kịch bản | DIRECTOR §1 · `qa.py script` | [hanh-van.md](references/hanh-van.md), [cau-truc.md](references/cau-truc.md); rà bằng skill `script-review` | C1 kịch bản |
| 3 | Giọng, nhạc, tiếng | TECHNIQUE §1–3 | [giong-am-thanh.md](references/giong-am-thanh.md) | báo ký tự trước khi gọi VBee |
| 4 | Nhân vật mới | styles/webtoon-svg | [nhan-vat.md](references/nhan-vat.md) | C2 bảng nhân vật |
| 5 | Nền + kế hoạch cảnh | DIRECTOR §2–5 · styles/webtoon-svg | [nen.md](references/nen.md), [dung-canh.md](references/dung-canh.md), [canh-danh.md](references/canh-danh.md) | C3 kế hoạch cảnh + bảng nền; C4 một cảnh đánh mẫu |
| 6 | Dựng từng chương — **hỏi người dùng có dùng workflow `dung-tap` không** | DIRECTOR · TECHNIQUE §4–5, §7 | [dung-canh.md](references/dung-canh.md), [canh-danh.md](references/canh-danh.md), [chu-phu-de.md](references/chu-phu-de.md), [lenh.md](references/lenh.md) | C5 từng chương |
| 7 | Bản full | TECHNIQUE §4–6 | [lenh.md](references/lenh.md) | C6 bản full |
| 8 | Ảnh bìa | references/anh-bia.md | [anh-bia.md](references/anh-bia.md) | C7 2–3 phương án |
| 9 | Bài đăng YouTube | references/dang-bai.md | [dang-bai.md](references/dang-bai.md) + skill `youtube-publish` | Người dùng tự đăng |
| 10 | Shorts / TikTok | references/shorts.md | [shorts.md](references/shorts.md) | |
| 11 | Số liệu sau đăng | references/so-lieu.md | [so-lieu.md](references/so-lieu.md) | đề xuất luật cho người dùng duyệt |
| mọi lúc | Cách làm việc | references/lam-viec.md | [lam-viec.md](references/lam-viec.md) | |
| trước khi gửi | Tự soát | references/tu-soat.md | [tu-soat.md](references/tu-soat.md) | |

Skill ngoài (`script-review`, `youtube-publish`, `video-post-gen`): nếu session không có, tự làm theo reference của bước và **ghi rõ trong báo cáo là chưa chạy skill đó**.

## Bối cảnh mỗi session
Đọc theo thứ tự: `studio-kit/AGENTS.md` → file này → reference của bước (chung + riêng) → `channel-example/STATUS.md` (đoạn cuối, phần của tập) → `episodes/<id>/` (outline.md, script.md, episode.yaml). Các file cũ `VISUAL_RULES.md`, `QUY_TRINH.md`, `HANH_VAN.md` là lịch sử; khi khác nhau thì **skill này + studio-kit thắng**.

## Trang web studio (14/11/2026)
Người dùng xem và sửa mọi thứ của tập trên trang `http://127.0.0.1:8765` (từ 14/11 tối: một trang cho mọi kênh, tab Kênh Mẫu và tab Hóng). Lệnh mở: `cd <STUDIO>/channel-example && python3 tools/studio_web.py`. Thiết kế ở `docs/2026-11-14-studio-web-design.md`.
Trang tự đọc thư mục, không cần đăng ký. Nó chỉ thấy file đặt **đúng chỗ, đúng tên** — cây thư mục đầy đủ ở [`channel-example/CAU_TRUC.md`](../CAU_TRUC.md). **Tạo tập mới luôn bằng `python3 tools/tao_tap.py <id> "<tiêu đề>"`** (chép `episodes/_mau/`). **Không viết lại trang web**; cần thêm thì sửa `tools/studio_web.py` / `tools/studio_web/index.html`. Kênh mới = thư mục `<STUDIO>/channel-<tên>/` có `episodes/`, trang tự hiện tab.
- `episodes/<id>/` gồm `outline.md`, `script.md`, `post.md`, `episode.yaml` (có `title:` và `status:`), `build/review_log.md`.
- Bản chốt phải ghi vào đúng các tên trên, không để ở `script_v2.md` hay `outline.v5.md`. Bản cũ chuyển vào `_to_delete/`.
- Video xem thử: `out/xem/<id>_*.mp4`. Bản thật: `out/<id>_bio-long.mp4` + `.vi.srt`.
- Ảnh bìa: `branding/thumb_<id>_<X>.jpg`. Ảnh soát: `episodes/<id>/build/prev/*.jpg`.
- Shorts: `out/shorts_<id>/NN_<slug>.mp4` + `episodes/<id>/shorts_post.md` (mục `## N. <tên>`). Cắt bằng `tools/shorts_cut.py` ([shorts.md](references/shorts.md)). Người dùng tích đã đăng từng clip, hoặc bấm "Đã đăng tất cả Shorts" (cạnh nút Đánh dấu đã đăng ở đầu trang tập) để tích YouTube + TikTok cho mọi clip một lần → `build/shorts_posted.json`.
- Gói thu VBee: `episodes/<id>/audio/vbee_ui/<phần>.txt`. File giọng người dùng chép vào nằm cùng tên `.mp3`.
- Dòng tiến độ: `STATUS.md`, có nhắc `<id>`.

Trước khi sửa `outline.md` hay `script.md`, đọc `episodes/<id>/build/web_edits.log`. Người dùng có thể vừa sửa trên trang; bản cũ của người dùng nằm trong `_to_delete/web_bak/`.
Người dùng có thể bấm "Đánh dấu đã duyệt" hoặc "Đánh dấu đã đăng" trên trang. Khi đó `status:` trong `episode.yaml`, dòng của tập trong `backlog.csv` và một dòng cuối `STATUS.md` được ghi tự động; nếu có link thì thêm vào bảng "Đã đăng" của `post.md`. Người dùng cũng có thể dọn dung lượng: file tạm, video và Shorts (chỉ coi là an toàn khi đã tích đăng) chuyển vào Thùng rác macOS. Tập **đã đăng** còn **Dọn sâu** (nút ở tab Dọn dung lượng, hoặc ô "Dọn sâu tập đã đăng" ở trang Dọn máy): bỏ hết mã cảnh, giọng, build, video, Shorts; chỉ giữ file chữ ở gốc tập (`.md/.yaml/.txt`, `research/`) và `branding/thumb_<id>*`. Tập đã dọn sâu có `episodes/<id>/DON_SAU.md` liệt kê thứ đã bỏ — muốn dựng lại thì người dùng phải lấy từ Thùng rác. Mọi thao tác được ghi ở `web_actions.log` của kênh. Đọc file này nếu thấy thiếu mảnh render hoặc ảnh soát.
Báo cáo xong việc thì nói rõ xem ở bước nào trên trang (ví dụ "bước Video", "bước Ảnh bìa"). Vẫn gửi SendUserFile khi người dùng cần xem trên thiết bị khác.

## Mẫu đã duyệt để so
- Hành văn: `episodes/xep-hang-cao-thu-tam-quoc/script.md` (bản 2).
- Cảnh đánh + nền chuẩn: `episodes/xep-hang-cao-thu-tam-quoc/build/prev/mau_holao_v5.mp4`.
- Mở đầu + chương 1 kể chuyện: `episodes/xu-an-tao-thao/` (mở đầu bản 3, chương 1 bản 4).
- Ảnh bìa xếp hạng: `branding/thumb_vu-khi-kim-dung*` (lên view nhanh); ảnh bìa nhân vật: `branding/thumb_xu-an-tao-thao_B.jpg`.
- Thẻ giới thiệu nhân vật: `episodes/xep-hang-cao-thu-thuy-hu/sc_xh_kit_intro.js`.

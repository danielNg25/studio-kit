---
name: <kenh>-video
description: "Làm video kênh YouTube <Tên kênh> (studio shorts-claude): đề tài, kịch bản theo hành văn kênh, giọng, dựng hình, ảnh bìa, bài đăng, Shorts. Dùng cho MỌI việc của kênh <Tên kênh>."
---

# <Tên kênh> — luật riêng của kênh

**Luật chung mọi kênh: `studio-kit/AGENTS.md` (đọc trước)** → DIRECTOR.md, TECHNIQUE.md, references/. Khi khác nhau, luật trong skill này thắng.

## Kênh
- Nội dung: <…> · Người dẫn: <…> · Độ dài: <…> · Khán giả: <…>
- Style hình: `studio-kit/styles/<slug>/STYLE.md`
- Mỗi tập có `episodes/<id>/episode.yaml` (`title:`, `status:`): tạo bằng `python3 studio-kit/tools/new_ep.py new <thư mục kênh> <id> "<tiêu đề>"` ngay khi mở tập, qua mỗi cổng ghi `new_ep.py status <thư mục tập> <trạng thái>` (idea → outline → script → voice → build → preview → approved → posted). File giao để ở `out/<id>*.mp4`, `out/<id>*.srt`, `out/xem/<id>_*.mp4`, `branding/thumb_<id>*.jpg` — trang web studio (TECHNIQUE §6) đọc các chỗ đó; thêm kênh vào `CHANNELS` của `channel-example/tools/studio_web.py`.
- Giọng: VBee `<voice code>`, tốc độ <…>; nhịp nghỉ chuẩn (TECHNIQUE §2) trừ khi ghi khác ở đây.
- Nhạc: <bài, mức dB>. Tiếng động: <tắt (mặc định) / bật — đã duyệt ngày …>.

## Bước — đọc trước khi làm
| Bước | Chung (studio-kit) | Riêng kênh (references/) |
|---|---|---|
| Đề tài, dàn ý | references/de-tai.md · DIRECTOR §1 | de-tai.md |
| Kịch bản | DIRECTOR §1 | hanh-van.md |
| Giọng, nhạc | TECHNIQUE §1–3 | (mục Kênh ở trên) |
| Nhân vật | STYLE.md | nhan-vat.md |
| Dựng | DIRECTOR · STYLE.md · TECHNIQUE §4–5 | signature.md |
| Tự soát | references/tu-soat.md | (mục signature thêm vào bảng điểm) |
| Ảnh bìa, đăng bài, Shorts, số liệu | references/anh-bia, dang-bai, shorts, so-lieu | dang-bai.md |

## Mẫu đã duyệt để so
- <tập mẫu hành văn> · <tập mẫu hình> · <ảnh bìa mẫu>

# Bàn Sửa Lời (tools/sua-loi)

Trang HTML tự đủ để người dùng **tự viết lại từng câu** kịch bản của một tập (mọi kênh, mọi ngôn ngữ), rồi xuất kết quả dán vào chat; Claude áp lại vào kịch bản và học giọng từ các câu người dùng sửa.

| file | việc |
|---|---|
| `template.html` | giao diện (placeholder `__PAGE_TITLE__`, `__STAMP__`, `__SAMPLE__`, `__NS__`) — sửa giao diện ở đây, mọi tập dùng chung |
| `build.py` | `python3 tools/sua-loi/build.py <thư mục tập \| episode.yaml \| script.md \| .txt> [--stamp "TÊN KÊNH"] [--out FILE]` → `<tập>/build/sua-loi/sua-loi.html` |
| `apply.py` | `python3 tools/sua-loi/apply.py <export.txt \| -> <shots_body.yaml \| episode.yaml> [--dry-run] [--notes <kênh>/voice_notes.md]` |

Trang: tách từng câu (hoặc giữ đoạn), ô viết lại dưới mỗi câu (trống = giữ nguyên), nút "Bỏ câu này", lọc Chưa sửa / Đã sửa, ghi chú chung, nháp tự lưu trong trình duyệt (theo tên thư mục tập). Xuất 2 dạng: **Chỉ câu đã sửa** (`[id] (người nói) / cũ: … / mới: …` — dạng apply.py đọc) và **Cả kịch bản sau khi sửa**.

`apply.py` khớp câu cũ theo đúng chữ trong `lines` (phải xuất hiện đúng 1 lần), giữ chú thích YAML khi được, luôn lưu `.bak-sualoi-<giờ>`, báo shot nào mất dòng (cần canh lại `L(ctx,i)` trong cảnh). Skill hướng dẫn: `skills/gen-web-sua-loi/SKILL.md`.

---

## Bản Thảo (kiểu mới, mặc định cho kênh có script.md một câu một dòng)

Sửa **thẳng trên lời đọc**, một chương một lần (không có ô nhập riêng): mục lục chương có số tiếng/phút, Enter tách câu, xoá sạch = bỏ câu, ghi chú theo chương, công tắc Gợi ý hình / Ghi chú nguồn, tự lưu lên máy chủ khi publish thành Artifact có `db`.

| file | việc |
|---|---|
| `template_banthao.html` | giao diện chung (placeholder `__PAGE_TITLE__`, `__DATA__`) |
| `ban_thao.py` | `python3 tools/sua-loi/ban_thao.py <thư mục tập> [--tsv lines_vN.tsv] [--version "bản 9"] [--name …] [--sub …] [--key …] [--out …]` → `<tập>/build/ban-thao/ban-thao.html` + `data.json`. Mỗi bản mới phải đổi `--key` |
| `apply_banthao.py` | `python3 tools/sua-loi/apply_banthao.py <export.txt \| -> <thư mục tập> [--tsv …] [--dry-run] [--notes <kênh>/voice_notes.md]` → `script.md` mới, `build/script.v<N>.md`, `lines_v<N+1>.tsv`, `edits_v<N+1>.json`. Dừng không ghi gì nếu câu "cũ" không khớp |

Export: `[mã] (chương) / cũ: … / mới: …` (`⏎` = tách câu, `(BỎ CÂU NÀY)` = xoá) + `GHI CHÚ <chương>: …`. Dữ liệu trên trang (db): `edits/<mã câu>` {text, cut, orig, ch}, `notes/<s0…>` {text, ch}. Quy trình đầy đủ: `skills/gen-web-sua-loi/SKILL.md`. Bộ cũ (`build.py`, `apply.py`, `template.html`) vẫn dùng cho kênh sửa tay `shots_body.yaml`.

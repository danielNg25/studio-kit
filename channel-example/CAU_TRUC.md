# Cấu trúc thư mục của kênh

Trang web studio (`tools/studio_web.py`) **không có cơ sở dữ liệu**. Nó chỉ đọc thư mục, nên chỉ thấy file đặt **đúng chỗ, đúng tên**. Đặt sai chỗ thì trang không chia được tập, hoặc dồn mọi thứ vào một chỗ.

**Luật cho Claude:**
- Mọi kênh và mọi tập theo đúng cây dưới đây.
- Tạo tập mới bằng `tools/tao_tap.py`, không tự dựng thư mục.
- Không viết lại trang web. Cần thêm gì thì sửa `tools/studio_web.py` và `tools/studio_web/index.html`.

## Cây thư mục

```
<STUDIO>/                          thư mục gốc studio (repo này)
├── studio-kit/  studio-template/  luật chung + engine dựng hình (không để file của tập ở đây)
└── channel-<tên>/                 MỖI KÊNH MỘT THƯ MỤC, tên bắt đầu bằng "channel-"
    ├── channel.yaml               (tuỳ chọn) name: "Tên hiện trên tab"
    ├── STATUS.md                  nhật ký tiến độ, chỉ ghi thêm dòng; mỗi dòng nhắc <id> của tập
    ├── backlog.csv                một dòng mỗi tập: id,topic,...,status,...
    ├── skill/                     luật riêng của kênh
    ├── tools/                     studio_web.py, qa.py, shorts_cut.py, tao_tap.py ...
    ├── branding/                  ẢNH BÌA: thumb_<id>_<A|B|C>.jpg
    ├── out/                       FILE GIAO (mọi tập dùng chung, phân biệt bằng tiền tố <id>)
    │   ├── <id>_bio-long.mp4          bản đăng
    │   ├── <id>_bio-long.vi.srt       phụ đề
    │   ├── xem/<id>_<gì đó>.mp4       bản xem thử
    │   └── shorts_<id>/NN_<slug>.mp4  Shorts của tập
    └── episodes/
        ├── _mau/                  tập mẫu để chép (thư mục bắt đầu bằng "_" bị trang bỏ qua)
        └── <id>/                  MỖI TẬP MỘT THƯ MỤC; <id> viết thường, không dấu, nối bằng "-"
            ├── episode.yaml       BẮT BUỘC: id, title, status (+ shots, music, pronounce, post)
            ├── outline.md         dàn ý (bản chốt, không đặt tên outline_v2.md)
            ├── script.md          kịch bản (bản chốt)
            ├── post.md            bài đăng YouTube
            ├── shorts_post.md     bài đăng Shorts, mục "## N. <tên>"
            ├── research/          tư liệu, nguồn
            ├── audio/
            │   ├── vbee_ui/<phần>.txt (+ <phần>.mp3)   gói thu VBee
            │   └── clips/                               giọng đã cắt
            └── build/
                ├── prev/*.jpg     ảnh soát
                ├── review_log.md  nhật ký tự soát
                └── web_edits.log  do trang web ghi khi người dùng sửa
```

## Những lỗi làm trang "bỏ chung vào"
| Sai | Đúng |
|---|---|
| File của nhiều tập nằm thẳng trong `episodes/` (`episodes/script_tap1.md`) | Mỗi tập một thư mục `episodes/<id>/script.md` |
| Thiếu `episode.yaml`, hoặc thiếu `title:` / `status:` | Có đủ 3 dòng `id:`, `title:`, `status:` ở đầu file |
| Video, ảnh bìa không có tiền tố id (`out/final.mp4`, `branding/thumb.jpg`) | `out/<id>_bio-long.mp4`, `branding/thumb_<id>_A.jpg` |
| Bản sửa đặt tên mới (`script_v3.md`) | Ghi đè `script.md`; bản cũ chuyển vào `_to_delete/` |
| Kênh nằm ngoài `<STUDIO>/` hoặc tên không bắt đầu bằng `channel-` | `<STUDIO>/channel-<tên>/` |
| Đặt tập vào `studio-template/` hay thư mục `episodes/` của engine | `channel-<tên>/episodes/<id>/` |

## status: đi theo cổng duyệt
`idea → outline (C0) → script (C1) → voice → build (C2–C5) → preview (C6) → approved → posted`

## Kênh mới
Chép `channel-example/` thành `channel-<tên>/` (bỏ phần `episodes/` trừ `_mau/`), sửa `channel.yaml`, `skill/`. Trang web tự hiện tab mới, không cần sửa code.

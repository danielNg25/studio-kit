# Studio làm video YouTube bằng Claude Code

Bộ khung dùng để làm video kể chuyện, bình luận và xếp hạng tiếng Việt. Hình vẽ bằng code, giọng đọc lấy từ VBee, còn Claude Code lo phần lớn công việc: dàn ý, kịch bản, giọng, dựng cảnh, ảnh bìa, bài đăng và Shorts. Asset riêng của kênh đã bỏ: nhân vật, người dẫn, nhạc, video, ảnh bìa, các tập.

## Có gì trong repo

```
studio-kit/              luật chung mọi kênh, đọc AGENTS.md trước
  AGENTS.md              luôn áp, các bước, cổng duyệt
  DIRECTOR.md            dựng cảnh, chữ, phụ đề, diễn hoạt
  TECHNIQUE.md           giọng, nhịp nghỉ, nhạc, render, QA
  references/            tự soát, đề tài, ảnh bìa, đăng bài, Shorts, số liệu
  styles/                hướng dẫn từng phong cách hình (webtoon-svg là phong cách đang dùng)
  core/ tools/           ghép tiếng, trộn nhạc, QA, cắt giọng VBee
  workflows/dung-tap.js  workflow Claude Code dựng song song các chương
studio-template/         engine dùng chung
  engine/                build.py (voice/audio/mix/render), render.mjs, runtime.js
  packs/style/webtoon-code-v1/   bộ vẽ nhân vật + hiệu ứng (chỉ kèm 4 nhân vật mẫu)
  templates/ channel_template/   khung kênh mới và định dạng video
channel-example/      ví dụ một kênh
  skill/                 skill Claude Code của kênh: SKILL.md + references (hành văn, cấu trúc, cảnh đánh…)
  tools/studio_web.py    trang web studio để xem, sửa và duyệt từng tập
  episodes/              để trống; tập mới nằm ở đây
```

## Cài đặt

Cần có macOS hoặc Linux, Python 3.10 trở lên, Node 18 trở lên, ffmpeg và Claude Code.

```bash
cd studio-template
pip install -r requirements.txt
npm install && npx playwright install chromium
cp channel_template/.env.example ../channel-example/.env   # điền VBEE_APP_ID, VBEE_TOKEN
```

Font cần cho chữ trên video và Shorts là [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro). Repo không kèm font và nhạc nền: bạn tự tải về rồi đặt đúng đường dẫn được ghi trong `STYLE.md` và `shorts_cut.py`.

## Chạy trang web studio

```bash
cd channel-example && python3 tools/studio_web.py
# mở http://127.0.0.1:8765
```

Tạo tập mới (đúng cấu trúc trang web cần, xem `channel-example/CAU_TRUC.md`):

```bash
cd channel-example && python3 tools/tao_tap.py xep-hang-cao-thu "Xếp Hạng Cao Thủ"
```

Trang tự hiện tab cho mọi thư mục `channel-<tên>/` có `episodes/`. Trang tự đọc thư mục `episodes/<id>/`, gồm `outline.md`, `script.md`, `episode.yaml`, giọng VBee, ảnh soát, video, ảnh bìa và Shorts. Từ trang có thể:
- sửa kịch bản;
- copy lời cho từng phần để thu trên web VBee;
- đánh dấu tập đã duyệt hoặc đã đăng, và tích Shorts đã đăng;
- dọn dung lượng (file chuyển vào Thùng rác, không xoá hẳn).

Trang chỉ chạy trên máy (127.0.0.1) và không đọc file `.env`.

## Dùng với Claude Code

1. Đặt repo này làm thư mục gốc studio. Trong tài liệu, `<STUDIO>` là đường dẫn tới thư mục đó.
2. Cài skill của kênh: chép `channel-example/skill/` vào `~/.claude/skills/<tên-skill>/`, hoặc bảo Claude đọc `channel-example/skill/SKILL.md` ở đầu mỗi phiên.
3. Claude đọc theo thứ tự: `studio-kit/AGENTS.md`, rồi `channel-example/skill/SKILL.md`, rồi reference của bước đang làm.
4. Quy trình gồm 11 bước, có cổng duyệt C0–C7: đề tài → kịch bản → giọng → nhân vật → nền và kế hoạch cảnh → dựng chương → bản full → ảnh bìa → bài đăng → Shorts → số liệu. Bảng các bước nằm trong `SKILL.md`.

Muốn làm kênh của riêng mình, đổi tên `channel-example` và viết lại phần riêng trong `skill/` (người dẫn, giọng văn, chủ đề). Phần `studio-kit/` giữ nguyên để dùng chung.

## Lưu ý

- Tài liệu viết bằng tiếng Việt và còn ghi lại các quyết định theo ngày của kênh gốc. Cứ giữ như một nhật ký vì sao luật ra đời.
- Phần đọc giọng mặc định dùng VBee. Bạn cần tự đăng ký tài khoản và thanh toán.
- Một số style khác (comic-history, stick-3d) chỉ kèm `STYLE.md`, không kèm engine và tư liệu tham khảo.

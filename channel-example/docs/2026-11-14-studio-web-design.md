# Trang web studio (chạy trên máy Mac) — thiết kế

Ngày 14/11/2026, người dùng duyệt cách 1.

## Vì sao làm
Hiện nay mỗi lần Claude làm ra một thứ (dàn ý, kịch bản, ảnh, video), người dùng phải mở thư mục mới xem được, rất phiền.
Trang này gom mọi thứ của một tập vào một chỗ. Người dùng dùng nó để:
- xem và sửa chữ;
- copy chữ sang VBee để thu giọng;
- đưa file giọng vào tập;
- xem video và ảnh bìa.

Trang chỉ dùng trên máy của người dùng, không cần mở được từ điện thoại.

## Mục tiêu
1. **Danh sách tập:** đọc từ `episodes/*`. Mỗi tập hiện trạng thái (`status` trong `episode.yaml`), tiêu đề và dòng `STATUS.md` mới nhất có nhắc tên tập. Có ô lọc theo tên.
2. **Trang một tập, chia thành các thẻ:**
   - **Ý tưởng:** dòng của tập trong `backlog.csv` (chỉ xem).
   - **Dàn ý:** `outline.md`. Xem dạng định dạng sẵn, có nút Sửa, Lưu.
   - **Kịch bản:** `script.md`, cũng có Sửa và Lưu. Thêm bảng lời theo chương lấy từ `episode.yaml`: mỗi chương một khối, có nút **Copy**. Chữ được copy là chữ đã áp `pronounce:` của tập (đúng như gói `audio/vbee_ui/*.txt`). Nếu tập đã có gói `vbee_ui`, copy thẳng từng file `.txt` trong đó và kèm số ký tự, để người dùng ước được chi phí VBee.
   - **Giọng:**
     - liệt kê các mp3 đang có trong `audio/vbee_ui/` (nghe được ngay trên trang);
     - ô nhập đường dẫn thư mục chứa mp3 vừa tải từ VBee (ví dụ `~/Downloads`) kèm nút **Chép vào tập**;
     - đổi tên file theo chương: chọn file nào là chương nào. Có thể đổi thẳng, hoặc ghi một yêu cầu cho Claude.
     - Trang **không gọi VBee API** và không tự cắt file. Cắt bằng `vbee_ui_split.py` vẫn do Claude làm, vì đó là luật tiền VBee.
   - **Video:** bản xem thử (`out/xem/<id>_*.mp4`, mới nhất trên cùng) và bản thật (`out/<id>_bio-long*.mp4`), phát ngay trong trang. Mỗi bản ghi ngày giờ và dung lượng. Có thêm file `.vi.srt` để tải.
   - **Ảnh:** ảnh bìa (`branding/thumb_<id>*.jpg`), ảnh soát (`build/prev/*.jpg`, mới nhất trước) và ảnh dò nảy (`qa_hop_*`). Bấm vào ảnh để phóng to.
   - **Đăng bài:** `post.md` nếu có (xem, có nút Copy từng khối tiêu đề, mô tả và tag), cùng nhật ký soát `build/review_log.md`.
3. **Trang "Mới nhất":** 20 file mới sửa gần đây trong `out/`, `branding/` và `episodes/*/build/prev/`. Claude vừa làm gì thì người dùng mở trang này là thấy ngay, không phải đi tìm.

## Không làm
- Không đăng lên YouTube, không gọi VBee API, không render video.
- Không xoá file.
- Không cần đăng nhập, vì chỉ chạy ở `127.0.0.1`.

## Điều cấm
Những điều sau thì dù trang chạy được vẫn coi là hỏng:
- Lưu đè mất bản sửa của Claude.
- Làm mất nội dung file.
- Lộ `.env`.
- Trang mở được file ngoài thư mục studio.

## Ràng buộc và cách dựng
- **Công nghệ:** `tools/studio_web.py`, chỉ dùng thư viện có sẵn của Python 3 (http.server, json, csv). Giao diện là một file `tools/studio_web/index.html` với JS thuần, không build. Riêng markdown dùng `marked` qua CDN, vì máy có mạng. Nếu không tải được thì hiện chữ thô.
- **Chạy:** `python3 tools/studio_web.py` rồi mở `http://127.0.0.1:8765`. Server chỉ nghe ở 127.0.0.1.
- **Phạm vi đọc file:** chỉ đọc trong `channel-example/`. Đường dẫn có `..` hoặc trỏ ra ngoài thì bị chặn, và `.env` luôn bị chặn.
- **Video:** phục vụ có hỗ trợ tua (HTTP Range), để file 1080p dài không phải tải hết mới xem được.
- **Lưu file:**
  - Trang gửi kèm `mtime` của lúc mở file. Nếu file trên đĩa đã đổi từ lúc đó, trang báo "Claude vừa sửa file này, tải lại" và không ghi.
  - Trước khi ghi, bản cũ được chép sang `_to_delete/web_bak/<id>/<tên>.<giờ>`.
  - Mỗi lần lưu ghi một dòng vào `episodes/<id>/build/web_edits.log`, để Claude biết người dùng đã sửa gì.
- **Chép giọng:** chỉ chép (`shutil.copy2`), không di chuyển và không xoá file gốc.
- **Kiểu file mở được:** .md .yaml .csv .txt .srt .log .jpg .png .mp3 .m4a .mp4 .json. Không kèm .env.

## Các cách đã cân nhắc
1. **Python stdlib và một trang HTML (đã chọn).** Không phải cài gì, hợp với studio vốn chạy Python, dễ thêm tính năng. Giao diện đơn giản.
2. **Node, React hoặc Vite.** Đẹp hơn, nhưng phải cài npm và build, nhiều file hơn và tốn token để giữ. Không chọn.
3. **HTML tĩnh do script sinh ra.** Không lưu được bản sửa, nên trượt ý "vừa xem vừa sửa". Không chọn.

## Để người dựng quyết
Màu sắc và bố cục chi tiết (mặc định nền tối, chữ tiếng Việt), cổng mặc định 8765, và cách sắp xếp thẻ.

## Gộp nhiều kênh (14/11/2026, tối — người dùng: "mình muốn gộp lại 2 trang vào 1, mỗi kênh 1 tab chức năng tương đương")
- Vẫn một lệnh chạy, một cổng. Đầu cột trái có **tab kênh** (Kênh Mẫu · Hóng); mỗi tab có đủ: Mới nhất, Shorts, Dọn máy, danh sách tập, 9 bước của tập.
- `CHANNELS` trong `tools/studio_web.py` khai từng kênh: tên, thư mục gốc, kiểu. Kiểu `yaml` = Kênh Mẫu (episode.yaml, backlog.csv, audio/vbee_ui, build/prev). Kiểu `kit` = kênh dựng bằng studio-kit như Hóng (episode.yaml chỉ giữ title/status…, không có shots: lời theo chương tách từ script.md, gói thu ở voice/vbee_ui, ảnh soát ở build/<style>/qa, tấm rối ở src/sheet-*.png, "Ý tưởng" là backlog.md).
- **Sửa 14/11 20:3x theo lời người dùng ("sao bạn ko follow theo episode.yaml như bên kia luôn")**: mọi kênh đọc `title:` + `status:` ở `episodes/<id>/episode.yaml`, và nút Đánh dấu ghi vào đó (kèm một dòng `STATUS.md` của kênh). Bản đầu ghi trạng thái Hóng ở `build/web_status.json` — đã bỏ. Tập kit cũ thiếu episode.yaml thì trang đoán tiêu đề/trạng thái từ file đang có và tạo file khi bấm Đánh dấu. Tập mới: `studio-kit/tools/new_ep.py`.
- Mỗi yêu cầu kèm `ch=<kênh>`; file phục vụ ở `/f/<kênh>/<đường dẫn>` và chỉ đọc trong thư mục của kênh đó. Link cũ không có tên kênh vẫn mở Kênh Mẫu. Địa chỉ trang: `#<kênh>/<tập>`.
- File giao của mọi kênh để cùng kiểu chỗ: `out/<id>*.mp4`, `out/<id>*.srt`, `out/xem/<id>_*.mp4`, `branding/thumb_<id>*.jpg`. Với kênh `kit`, trang còn liệt kê thêm bản xem còn nằm trong `build/<style>/out/`.
- Dọn máy cho kênh `kit`: mảnh render từng chương, dải ảnh cổng, khung ảnh soát, bản xem; bản ghép trong thư mục dựng bị đánh dấu "cẩn thận" khi `out/` chưa có bản đăng.
- Đã kiểm 14/11 bằng trình duyệt không đầu: hai tab, 9 bước của một tập mỗi kênh, Mới nhất, Dọn máy, link cũ; chặn `..` và `.env` (403). CHƯA thử các nút ghi ở tab Hóng (Lưu, Chép giọng, Đánh dấu, Thùng rác).

## Kênh thứ ba: Người que 3D (14/11/2026, khuya — người dùng: "gộp chung vào trang của kênh mẫu luôn")
- Tab **Người que 3D** = dự án `video/rick-short` (video dọc người que 3D kiểu Ricks Clips, dựng bằng engine three.js). Kiểu kênh mới `rick`; phần đọc dữ liệu nằm riêng ở `tools/studio_web_rick.py`, file chính chỉ thêm vài nhánh `if X.kind == 'rick'`.
- Một tập = một phim `engine/films/<phim>/` (`episode.yaml` title/status/note, `script.md`, `film.json`, `words.json`, `narration.wav`, `review_log.md`); video và ảnh soát ở `engine/out/<phim>/`; tiến độ ở `STATUS.md` của dự án.
- 9 công đoạn riêng: Đề tài · Kịch bản (lời từng câu lấy từ film.json, có Copy) · Giọng · Kế hoạch cảnh (film.json, chỉ xem) · Hình · Video (bản chốt nhận qua dòng có chữ "chốt" trong review_log.md, kèm kết quả cổng máy của từng clip) · Rà soát · Ảnh bìa · Đăng bài.
- Nút Shorts ở cột trái thành **Tài liệu** (nghiên cứu kênh, phân tích kênh mẫu, engine, skill); Dọn máy tính cả hai thư mục `_to_delete/` và `engine/_to_delete/` của dự án.
- Trang chung: `Doc` hiện `.json/.csv/.log` dạng chữ thô; `.json/.log` không có nút Sửa (film.json sửa qua Claude để còn chạy kiểm).
- Đã kiểm bằng trình duyệt không đầu (cổng thử): ba tab, tập của Kênh Mẫu và Hóng, phim, Tài liệu, Dọn máy, link cũ không tên kênh; không có lỗi trang. Các nút ghi (Lưu, Đánh dấu, Thùng rác) của kiểu rick đã thử trên một phim tạm bằng bản trang riêng trước khi gộp, cùng mã đọc dữ liệu.
- Bản sao lưu file trước khi gộp: `_to_delete/web_bak/tools-2026-11-14-truoc-gop-rick/`.

## Cấu trúc thư mục, tự nhận kênh (17/11/2026)
- Máy khác dùng bộ này từng ra trang "dồn chung" vì tập không nằm mỗi tập một thư mục. Cây thư mục chuẩn ghi ở `channel-example/CAU_TRUC.md`; tập mới tạo bằng `tools/tao_tap.py` (chép `episodes/_mau/`).
- Trang tự thêm tab cho mọi `<STUDIO>/channel-<tên>/` có `episodes/`; tên tab và kiểu lấy từ `channel.yaml` (`name:`, `web_kind:`), mặc định kiểu `yaml`.

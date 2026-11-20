# Engine webtoon-svg: cài và tạo tập mới

Engine vẽ webtoon hoàn toàn bằng code (SVG → Playwright → ffmpeg). Repo có engine, phần mở rộng khung xương nhân vật (mũ, giáp, đồ cầm, thú…), bộ đồ nghề cảnh (nền 5 lớp, sân khấu, cảnh đánh, hiệu ứng) và một template tập. Dàn nhân vật của kênh gốc đã bỏ; pack chỉ kèm vài nhân vật mẫu (`am`, `su`, `cu1`, `cu2` trong `chars.js`). Bạn tự thêm nhân vật của mình.

## 1. Cài
Cần **Node 18+**, **Python 3.10+**, **ffmpeg** (Mac: `brew install node ffmpeg`).
```sh
cd studio-template
npm install && npx playwright install chromium
python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt   # pyyaml numpy soundfile pillow
```
Mỗi terminal mới: `. studio-template/.venv/bin/activate` (bước `build.py audio` cần `soundfile`).

## 2. Thử ngay
```sh
bash studio-template/new_channel.sh channel-thu "Kênh thử"                       # kênh phải nằm ở gốc repo, cùng cấp studio-kit/
sh studio-kit/styles/webtoon-svg/new_episode.sh channel-thu thu-engine "Thử engine"
cd channel-thu/episodes/thu-engine
python3 ../../../studio-template/engine/build.py . audio --silent   # timeline ước lượng (chưa có giọng)
python3 build/mkjob.py                                             # ghép cảnh + build/render_dev_main.json
python3 build/still.py thu c00_p01:1,3                             # → build/prev/thu.jpg
node ../../../studio-template/engine/render.mjs build/render_dev_main.json build/prev/thu.mp4 --frames 0:90
```
Kết quả: hai nhân vật mẫu trên nền đồng trống lúc hoàng hôn, chữ "ENGINE WEBTOON OK".

## 3. Tạo nhân vật của bạn
Tạo `build/design/chars_<tập>.js` trong thư mục tập (mkscenes tự nạp):
```js
CHAR.thay_do = Object.assign({}, CHAR.cu1, { name: 'Thầy đồ', robe: '#3E5A7A', robeS: '#2A4058', beard: '#2A2420', scholar: 1 });
```
- Thuộc tính cơ bản (tóc, mắt, da, áo, râu, khổ người, biểu cảm): `studio-template/packs/style/webtoon-code-v1/chars.js` + `STYLE.md` của pack.
- Thuộc tính mở rộng (mũ, giáp, sừng, hào quang, đồ cầm tay, thú…): đầu mỗi file `packs/style/webtoon-code-v1/chars_*.js` có danh sách.
- Dùng trong cảnh: `cast: [['thay_do', 700, { f: 1, k: 1.2, ex: 'smug' }]]` của `tb(T, ctx, {...})` (xem `sc_tq_u_c00.js`).

## 4. Dựng tập thật
1. Viết `script.md` (mỗi `## ` là một chương, mỗi đoạn lời là một shot) → `python3 build/gen_stub.py` sinh shot vào `episode.yaml`. Sửa câu kêu gọi `CTA` trong `gen_stub.py` cho kênh của bạn.
2. Cảnh: `sc_tq_u_cNN.js` (một file mỗi chương, hàm `EPISODE_SCENES.s_<shot id>`), màn hình kết thúc `sc_tq_v_end.js`. Xoá cảnh thử `sc_tq_u_c00.js`.
3. Nền riêng: `bg/*.js`. Lời kêu gọi dạng cảnh dùng chung cả kênh: `<kênh>/shared/loi_keu_goi/scene_lk_cta.js` (không có thì bỏ qua).
4. Có giọng thật: đặt clip vào `audio/` rồi `build.py . audio` (bỏ `--silent`), sau đó `python3 build/render_local.py -j 4` ra `<kênh>/out/<id>_bio-long.mp4`.
5. Lệnh soát (ảnh tĩnh, clip thử, dựng song song nhiều agent): mục **Lệnh** trong `STYLE.md`.

## 5. Mang sang máy khác
`sh studio-kit/styles/webtoon-svg/export.sh webtoon-kit.tgz [--channel <thư mục kênh>]` đóng gói engine + pack + template, giữ nguyên bố cục thư mục (không đóng `.env`, `.venv`, `node_modules`).

## Ghi chú
- `studio-kit/workflows/dung-tap.js` có hằng `ROOT` (đường dẫn gốc studio): sửa cho đúng máy của bạn trước khi chạy workflow.
- Font chữ trên hình: Be Vietnam Pro, Bangers, Pangolin (OFL, kèm trong `packs/style/chibi-v1/fonts/`).

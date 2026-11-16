# Ảnh bìa — phần riêng Kênh Mẫu

**Phần chung: `studio-kit/references/anh-bia.md`** (màu, ánh sáng, mặt, chữ, kiểm 320×180, hai cách làm, giao 2–3 phương án).

## Hướng đã thắng
- **Video xếp hạng**: mẫu ảnh bìa tập vũ khí Kim Dung (`branding/thumb_vu-khi-kim-dung*`, lên view nhanh). Hai nhân vật đang đánh nhau thắng các phương án khác (tập 1 bản D, Tây Du P1 bản A).
- **Video cuộc đời một nhân vật**: mẫu `branding/thumb_xu-an-tao-thao_B.jpg` — hai nửa là hai phiên bản của cùng một người, mỗi nửa một bảng màu + ánh sáng riêng. Bản mặt chia đôi đơn giản bị chê "đơn giản quá, nhìn khó chịu".
- Phản diện: mắt nheo liếc, chút sáng ở mắt, cười toác/nhếch, mặt chìm bóng một phần; anh hùng: mắt sáng, cười hiền, nắng ấm.
- Chi tiết đúng văn hoá: mũ hoàng đế = mũ miện (tấm phẳng, chuỗi ngọc rủ, trâm ngang, dây đỏ hai bên tai). Không vẽ hai cái miệng (thay hẳn miệng gốc).
- Tên chính to trên tấm biển nền tối viền vàng; chữ phụ phát sáng theo màu nửa của nó. Không chữ "truyện gốc".

## Làm (engine SVG)
1. `episodes/<id>/thumb.js` (hàm `EPISODE_SCENES.s_thumb_a/b/…`, khung 1920×1080, dùng nhân vật/nền của tập).
2. `sh mkscenes.sh dev main && python3 build/job.py s_thumb_a 1 thumb.js && node ../../../studio-template/engine/render.mjs build/job_s_thumb_a.json build/thumb_a --stills 0.5`
3. `ffmpeg -i build/thumb_a/t0000.50.jpg -vf scale=1280:720 -q:v 2 ../../branding/thumb_<id>_A.jpg`; xem bản 320×180. Người dùng chọn → ghi `post.thumbnail`.

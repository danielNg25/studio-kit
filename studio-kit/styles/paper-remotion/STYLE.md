# paper-remotion — cắt giấy nhiều lớp bằng React/Remotion

Style cũ của kênh Hóng (12–13/11/2026), giữ để tham khảo; từ 13/11 Hóng dùng **comic-history** làm mặc định.
Engine nằm trong kênh: `channel-hong-su-remotion/src/` (`theme.tsx`, `Fx.tsx`, `Layers.tsx`, `Ui.tsx`, `Puppet.tsx`, `kit.tsx`, `People.tsx`), lệnh trong `channel-hong-su-remotion/START_HERE.md`
(`./bake.sh` nướng lớp tĩnh → `public/bake/`; `node scripts/stills.mjs …`; `./render.sh [jensen]`; giọng `scripts/voice_ep.py`).
- Nhìn: lớp tĩnh nướng sẵn ra PNG, lớp động SVG, bóng đổ cứng, phủ hạt giấy + sợi giấy; 1920×1080, 30 fps.
- Đã thử và không chọn: `Styles.tsx`, `ClipPix/Vo/Que/Comic.tsx`.
- Lỗi mẫu chưa sửa: phụ đề che thân vua cuối cảnh bản đồ · quân nổi dậy chỉ nhảy tại chỗ · cảnh "Đốt." thiếu đống sách cháy · mũ vua lệch · cây kích quá mảnh.

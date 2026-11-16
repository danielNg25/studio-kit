# Giọng, nhạc, tiếng động — phần riêng Kênh Mẫu

**Phần chung: `studio-kit/TECHNIQUE.md` §1–3** (luật tiền VBee, nhịp nghỉ chuẩn 0,65/0,6/0,7/1,4 — gốc từ kênh này 20/10, làm dịu giọng, nhạc, −16 LUFS).

## Giọng MC (signature — không đổi giọng)
- VBee `hn_male_quochuy_yt_24k-pre` (Quốc Huy Pro), **tốc độ 0.95** (người dùng 13/11/2026: "sửa giọng quốc huy thành 0.95"; trước đó 0.93), khai trong `episode.yaml` của từng tập (`voice:` → `speed: 0.95`). Tập đã thu giữ tốc độ cũ — đổi tốc độ là thu lại cả tập (tốn ký tự VBee), chỉ làm khi người dùng yêu cầu. Ngoại lệ có chủ đích: Tào Tháo 0.95, Kiều Phong 1.05. `voice.yaml` ghi 1.0 chỉ là nền bị ghi đè — **tập mới phải tự khai `speed`**.
- Nhịp nghỉ ở `voice.yaml` → `pauses`; làm dịu `soften` mức "vừa" tự chạy trong `build.py <ep> audio` (mức mạnh "nghe như bịt mũi" — không dùng).

## Giọng nhân vật
- Nam: Anh Tú `sg_male_anhtu_yt_24k-pre` (Ngộ Không 1.2; Tào Tháo 1.05), hậu kỳ `build/voice_fx.py` (+3,5 dB so với lời dẫn). Nữ kể truyện (Truyện Kiều): Ngọc Huyền, làm dịu như MC.
- Chỉ thêm giọng khi cốt truyện cần; câu nổi tiếng của nhân vật mới cho nhân vật đọc, còn lại MC thuật.

## Thu giọng
- Theo lô: `cd episodes/<id>/build && python3 voice_batch.py <n>` (lặp) → `python3 voice_fx.py`.
- API hết quota / người dùng muốn tự nghe: người dùng gen trên VBee web từng chương; Claude gửi gói `audio/vbee_ui/` chương N (.txt đã áp pronounce, tách theo giọng, HUONG_DAN.md), nhận mp3, cắt bằng `vbee_ui_split.py --chap N`.
- Đổi nhịp/độ dịu: sửa `voice.yaml` → `build.py <ep> audio` → `mix` → render lại; cập nhật mục lục chương trong post.md.

## Nhạc
- Chương thường: "The Thought of You" **−31 dB**, khai trong `episode.yaml`: `music: {gain_db: -31, gap_lift_db: 3, gap_min_s: 0.8, cues: [{from: 0, to: <giây kết −3>, file: "The Thought of You - TrackTribe.mp3", fade_in: 2, fade_out: 3}]}`.
- Chương có đánh nhau: "Pink Flamenco" — Doug Maxwell. Đoạn cuối: "Vespers on the Shore" −23 dB. Không dùng Whirlpool. 20 s màn hình kết thúc: im nhạc.

## Tiếng động
Chỉ ở hành động có thật trên hình (chạm binh khí, ngã, cửa đóng), mức nhỏ dưới giọng; không chuông lặp, không drone to; montage không tiếng động. Đổi mức nhạc: làm 60–100 s mẫu ở vài mức cho người dùng chọn.

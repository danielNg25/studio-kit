# VOICEVOX core (giọng tiếng Nhật offline) — dùng cho kênh tiếng Nhật (japan-company)

Tài nguyên ở `studio-template/.cache/tts/voicevox/` (không vào sync.tgz):
- `voicevox_core-0.17.0-cp310-abi3-manylinux_2_34_aarch64.whl` (máy ảo Mac = Linux aarch64; máy khác tải wheel đúng nền tảng ở
  https://github.com/VOICEVOX/voicevox_core/releases/tag/0.17.0)
- `voicevox_onnxruntime-linux-arm64-1.17.3/` (https://github.com/VOICEVOX/onnxruntime-builder/releases/tag/voicevox_onnxruntime-1.17.3)
- `open_jtalk_dic_utf_8-1.11/` (https://github.com/r9y9/open_jtalk/releases/tag/v1.11.1)
- `models/4.vvm` (玄野武宏 11, 剣崎雌雄 21), `models/9.vvm` (白上虎太郎 12/32/33/34/35) — https://github.com/VOICEVOX/voicevox_vvm/releases/tag/0.16.4
  `README_vvm.txt` = bảng vvm ↔ nhân vật ↔ style id + điều khoản từng nhân vật.
Lưu ý: trình tải `download` của VOICEVOX KHÔNG đi qua proxy của môi trường Claude → tải từng file bằng curl như trên.
青山龍星: doanh nghiệp dùng phải hỏi trước → không dùng.

Chạy (Mac, device bridge): `pip3 install --user .cache/tts/voicevox/voicevox_core-*.whl` rồi
`python3 tools/voicevox/tts.py ../japan-company/episodes/<id>` → `audio/clips/*.mp3` + `index.json`. Sau đó audio/qa/stills/render như mọi kênh.
Đăng video thì BẮT BUỘC ghi credit 「VOICEVOX:玄野武宏」「VOICEVOX:白上虎太郎」.

## Câu đọc liền + nhiều đoạn phụ đề (2026-10-07)
- Engine đã vá bằng `engine/patches/apply_ja_breath.py` (chạy lại được, vá theo mốc): trong `lines:` của episode.yaml, ký tự `｜` (U+FF5C)
  đánh dấu chỗ ngắt phụ đề **bên trong một câu**. Giọng đọc cả câu một lần (ngữ điệu tự nhiên), phụ đề vẫn hiện từng đoạn.
- `tts.py` ghi thêm `<clip>.parts.json` = thời điểm bắt đầu từng đoạn, tính từ mốc thời gian từng mora của chính VOICEVOX;
  `build.py audio` dùng nó cho phụ đề in hình và file SRT. Không có file này thì chia theo số ký tự (ước lượng).
- Kiểm cách đọc trước khi tạo giọng: `python3 tools/voicevox/tts.py <ep> --kana` → `build/kana.txt` (katakana từng câu).
- Câu không có `｜` chạy y như cũ (đã kiểm: timeline nokia-v3 giống hệt trước khi vá).

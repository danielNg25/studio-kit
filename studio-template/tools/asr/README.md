# ASR — chép lời video tham khảo (tiếng Trung / Anh / Nhật / Hàn / Quảng Đông)

Dùng khi cần lời gốc của video Douyin trong `channel-*/references/content/douyin/`.
HuggingFace bị chặn trong container cloud và VM trên Mac, nên lấy model **SenseVoice** qua GitHub release của sherpa-onnx.

Chạy trong container cloud (`/home/claude/asr`), ~15 giây cho 1 phút âm thanh:
```bash
pip install --break-system-packages sherpa-onnx soundfile
cd /home/claude/asr
curl -sSL -o sv.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17.tar.bz2 && tar xjf sv.tar.bz2 && rm sv.tar.bz2
curl -sSL -o silero_vad.onnx https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
# trên Mac: ffmpeg -i video.mp4 -ac 1 -ar 16000 studio-template/.cache/asr/<id>.wav → stage lên cloud
python3 transcribe.py /mnt/user-data/uploads/.../<id>.wav   # ghi <id>.zh.txt, mỗi dòng [giây] câu
```
Kết quả lưu ở `channel-dong-vat/references/content/transcripts/<id>.zh.txt`. Lời gốc chỉ để lấy ý — không dịch nguyên văn, kiểm chứng lại mọi con số.

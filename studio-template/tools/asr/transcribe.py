import sys, sherpa_onnx, soundfile as sf, numpy as np
M = '/home/claude/asr/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17'
rec = sherpa_onnx.OfflineRecognizer.from_sense_voice(
    model=f'{M}/model.int8.onnx', tokens=f'{M}/tokens.txt', language='zh', use_itn=True, num_threads=2)
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = '/home/claude/asr/silero_vad.onnx'
cfg.silero_vad.min_silence_duration = 0.25
cfg.silero_vad.max_speech_duration = 12
cfg.sample_rate = 16000
for path in sys.argv[1:]:
    a, sr = sf.read(path, dtype='float32')
    vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=400)
    w = cfg.silero_vad.window_size
    out = []
    i = 0
    def drain():
        while not vad.empty():
            seg = vad.front
            s = rec.create_stream(); s.accept_waveform(16000, seg.samples); rec.decode_stream(s)
            out.append((seg.start / 16000, s.result.text))
            vad.pop()
    while i < len(a):
        vad.accept_waveform(a[i:i + w]); i += w; drain()
    vad.flush(); drain()
    txt = '\n'.join(f'[{t:6.1f}] {x}' for t, x in out)
    open(path.rsplit('/', 1)[-1].replace('.wav', '.zh.txt'), 'w').write(txt)
    print('==', path, len(out))

#!/bin/bash
# One-time setup of AivisSpeech-Engine in a Linux VM/container WITHOUT network access to AivisHub / Hugging Face.
# Model files are downloaded by hand into studio-template/.cache/tts/aivisspeech/downloads/{bert,tsqyomi,models} (README there).
set -e
D=$(cd "$(dirname "$0")/../../.cache/tts/aivisspeech/downloads" && pwd); E=${AIVIS_ENGINE:-$HOME/aivis/engine}
mkdir -p "$(dirname "$E")"; [ -d "$E" ] || git clone -q --depth 1 https://github.com/Aivis-Project/AivisSpeech-Engine "$E"
command -v uv >/dev/null || pip3 install --user -q uv; export PATH=$HOME/.local/bin:$PATH
cd "$E" && uv python install 3.11 && uv sync --no-dev
# aarch64 CPU: extended graph fusion builds an FP16 Gelu node without a kernel → tsqyomi with basic optimisation (local patch)
F=$(ls .venv/lib/python3.11/site-packages/pyopenjtalk/tsqyomi/model.py)
grep -q "_so = onnxruntime.SessionOptions()" "$F" || python3 - "$F" <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
old="""    session = onnxruntime.InferenceSession(
        str(model_path),
        providers=resolved_providers,
    )"""
new="""    _so = onnxruntime.SessionOptions(); _so.graph_optimization_level = onnxruntime.GraphOptimizationLevel.ORT_ENABLE_BASIC
    session = onnxruntime.InferenceSession(
        str(model_path),
        _so,
        providers=resolved_providers,
    )"""
assert old in s; open(p,'w').write(s.replace(old,new)); print("patched tsqyomi")
PY
U=$HOME/.local/share/AivisSpeech-Engine-Dev; mkdir -p "$U/Models"
B=$U/BertModelCaches/models--tsukumijima--deberta-v2-large-japanese-char-wwm-onnx; mkdir -p "$B/snapshots/5e5cc2b628d083d0a815c4d4a4c3fe84a414f8ed" "$B/refs"
for f in model_fp16.onnx config.json tokenizer.json tokenizer_config.json special_tokens_map.json vocab.txt; do ln -sf "$D/bert/$f" "$B/snapshots/5e5cc2b628d083d0a815c4d4a4c3fe84a414f8ed/$f"; done
echo -n 5e5cc2b628d083d0a815c4d4a4c3fe84a414f8ed > "$B/refs/main"
T=$U/BertModelCaches/models--tsukumijima--tsqyomi-models; mkdir -p "$T/snapshots/680596dd2ad2bad59ee5db3741e197cfce79f9b4/v4" "$T/refs"
for f in model.onnx tokenizer.json metadata.json; do ln -sf "$D/tsqyomi/$f" "$T/snapshots/680596dd2ad2bad59ee5db3741e197cfce79f9b4/v4/$f"; done
echo -n 680596dd2ad2bad59ee5db3741e197cfce79f9b4 > "$T/refs/main"
i=0; for f in "$D"/models/*.aivmx; do ln -sf "$f" "$U/Models/m$i.aivmx"; i=$((i+1)); done
echo "AivisSpeech ready: $(ls "$U/Models" | wc -l) voice models"

#!/bin/bash
# Start AivisSpeech-Engine (offline), make missing clips within a time budget, stop the engine.
#   tools/aivis/run.sh ../japan-company/episodes/nokia        (repeat until it prints "aivis: done")
# Needed once per machine: tools/aivis/setup.sh   (engine from source + model files from .cache/tts/aivisspeech/downloads)
ENGINE=${AIVIS_ENGINE:-$HOME/aivis/engine}; HERE=$(cd "$(dirname "$0")" && pwd)
cd "$ENGINE" || { echo "no engine at $ENGINE — run tools/aivis/setup.sh"; exit 1; }
HF_HUB_OFFLINE=1 .venv/bin/python run.py --disable_sentry --port 10101 > "$ENGINE/../run.log" 2>&1 &
EP=$!; S=$(date +%s)
until curl -s -m 2 localhost:10101/version >/dev/null; do sleep 1; [ $(( $(date +%s) - S )) -gt 90 ] && { echo "engine not ready (see $ENGINE/../run.log)"; kill $EP; exit 1; }; done
cd "$HERE/../.." && BUDGET=${BUDGET:-$(( 150 - ($(date +%s) - S) ))} "$ENGINE/.venv/bin/python" "$HERE/tts_aivis.py" "$@" 2>&1 | grep -v cpuid
kill $EP

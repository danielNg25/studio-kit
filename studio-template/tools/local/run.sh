#!/usr/bin/env bash
# Chạy các bước của studio trên máy local, dùng venv của studio (.venv) nếu đã cài bằng setup_local.sh.
#
# usage:  tools/local/run.sh <episode_dir> <lệnh> [tham số...]
#   <lệnh> = plan | voice | audio [--silent] | subs | mix | qa | stills | render | remux | all | post
#   render → render SONG SONG (tools/local/render_parallel.py; thêm --jobs N / --chunk K). Thêm --serial = build.py render tuần tự.
#   all    → plan + voice + audio + qa + render song song (dừng nếu QA lỗi, trừ khi có --force)
# ví dụ (đứng trong studio-template):  tools/local/run.sh ../channel-example/episodes/ep01 render
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../.." && pwd)"
cd "$STUDIO"
PY="$STUDIO/.venv/bin/python"
[ -x "$PY" ] || PY="$(command -v python3)"

if [ $# -lt 2 ]; then sed -n '2,8p' "$HERE/run.sh"; exit 2; fi
EP="$1"; CMD="$2"; shift 2

# tách --serial / --force khỏi các tham số còn lại
serial=0; force=0; rest=()
for a in "$@"; do
  case "$a" in
    --serial) serial=1 ;;
    --force) force=1; rest+=("$a") ;;
    *) rest+=("$a") ;;
  esac
done

par_render() { "$PY" tools/local/render_parallel.py "$EP" ${rest_render[@]+"${rest_render[@]}"}; }
rest_render=()
for a in ${rest[@]+"${rest[@]}"}; do [ "$a" = --force ] || rest_render+=("$a"); done

case "$CMD" in
  render)
    if [ "$serial" = 1 ]; then exec "$PY" engine/build.py "$EP" render ${rest[@]+"${rest[@]}"}; fi
    par_render ;;
  all)
    for s in plan voice audio; do "$PY" engine/build.py "$EP" "$s"; done
    if ! "$PY" engine/build.py "$EP" qa; then
      if [ "$force" = 1 ]; then echo "QA lỗi nhưng --force: vẫn render"; else echo "QA failed — sửa tập hoặc chạy lại với --force"; exit 1; fi
    fi
    if [ "$serial" = 1 ]; then exec "$PY" engine/build.py "$EP" render; fi
    rest_render=(); par_render ;;
  *)
    exec "$PY" engine/build.py "$EP" "$CMD" ${rest[@]+"${rest[@]}"} ;;
esac

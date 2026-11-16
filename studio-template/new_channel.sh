#!/usr/bin/env bash
# usage: ./new_channel.sh <target-folder> "<Channel name>"
set -e
here="$(cd "$(dirname "$0")" && pwd)"
target="$1"; name="${2:-New channel}"
[ -z "$target" ] && { echo "usage: $0 <target-folder> \"<Channel name>\""; exit 1; }
[ -e "$target" ] && { echo "$target already exists"; exit 1; }
cp -R "$here/channel_template" "$target"
rel="$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$here" "$target")"
printf '# Which studio this channel uses (relative path)\nstudio: %s\n' "$rel" > "$target/channel.yaml"
python3 - "$target/blueprint.yaml" "$name" "$(basename "$target")" <<'PY'
import sys; p, name, cid = sys.argv[1:]
s = open(p, encoding='utf-8').read().replace('"TÊN KÊNH"', f'"{name}"').replace('id: channel-id', f'id: {cid}')
open(p, 'w', encoding='utf-8').write(s)
import os
for f in ('STATUS.md', 'START_HERE.md'):
    st = os.path.join(os.path.dirname(p), f)
    if os.path.exists(st):
        t = open(st, encoding='utf-8').read().replace('<tên kênh>', name)
        open(st, 'w', encoding='utf-8').write(t)
PY
echo "created $target  →  next: fill START_HERE.md + blueprint.yaml + voice.yaml, copy .env.example to .env"

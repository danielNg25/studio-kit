#!/usr/bin/env bash
# usage: ./new_episode.sh <channel-folder> <episode-id> [format]
#   format (optional): e.g. long-8min — starts from templates/formats/<format>/example_episode.yaml if it exists,
#   otherwise from the channel's episodes/_example (which follows the channel's default format).
set -e
here="$(cd "$(dirname "$0")" && pwd)"
ch="$1"; id="$2"; fmt="$3"
[ -z "$id" ] && { echo "usage: $0 <channel-folder> <episode-id> [format]"; exit 1; }
[ -e "$ch/episodes/$id" ] && { echo "episode exists"; exit 1; }
cp -R "$ch/episodes/_example" "$ch/episodes/$id"
if [ -n "$fmt" ]; then
  [ -d "$here/templates/formats/$fmt" ] || { echo "unknown format: $fmt"; exit 1; }
  if [ -f "$here/templates/formats/$fmt/example_episode.yaml" ]; then
    cp "$here/templates/formats/$fmt/example_episode.yaml" "$ch/episodes/$id/episode.yaml"
  else
    sed -i.bak "s/^format: .*/format: $fmt/" "$ch/episodes/$id/episode.yaml" && rm -f "$ch/episodes/$id/episode.yaml.bak"
  fi
fi
sed -i.bak "s/^id: example-episode/id: $id/" "$ch/episodes/$id/episode.yaml" && rm -f "$ch/episodes/$id/episode.yaml.bak"
echo "created $ch/episodes/$id/episode.yaml${fmt:+  (format $fmt)}"

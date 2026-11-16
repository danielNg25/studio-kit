# Channel folder (data only)

| file | what |
|---|---|
| `START_HERE.md` | **đọc đầu tiên mỗi session**: kênh là gì, luật đã chốt, bản đồ folder |
| `STATUS.md` | đọc ngay sau START_HERE: trạng thái, việc tiếp theo, nhật ký quyết định — cập nhật cuối session |
| `channel.yaml` | path to the studio (engine, packs, templates) |
| `blueprint.yaml` | the channel's rules: format, narrator, tone, banned words, script formula, on-screen rules, facts policy |
| `voice.yaml` | VBee voice, speed, pauses, pronunciation dictionary |
| `.env` | secrets (copy `.env.example`) |
| `references/` | content / style / competitor notes |
| `backlog.csv` | topic ideas with scores |
| `analytics.csv` | results per post — feed lessons back into the blueprint |
| `episodes/<id>/` | `episode.yaml` (+ `scenes.js` for one-off scenes), `post.md`, `build/` |
| `out/` | finished videos of every episode (`<id>_<format>.mp4`) — bulk upload from here |

Build an episode: `python3 <studio>/engine/build.py episodes/<id> all`

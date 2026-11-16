# Scene templates

Each shot in `episode.yaml` picks one `template` and gives `params`. Times (`at`) are words/phrases spoken in the shot,
`{line: 1, word: "..."}`, or seconds. Animals: `orca`, `shark`, `seal`, `cat`, `mouse`, `snake` (mamba; `pose: slither|rear|coil`, `open`, `mouthIn`), `honeyBadger` (`belly`, `zzz`, `hold`), `lion` (`mane:false` = sư tử cái), `tiger`, `leopard`, `hyena`, `buffalo`, `zebra` (chung khung `quad`: `walk`, `pose: stand|crouch|lie`, `mouth: pant|chomp|open|grin|frown`), `ostrich` (`run`, `kick`, `eyeBig`, `look`), `pilotWhale` (gốc ở mặt cát; `flat`, `towel`, `blow`), `mosquito` (bay; `bow` = muỗi cái, `land`), `fish` (cá hồi) (cat/mouse origin = on the ground; add more in `packs/assets/animals.js`).
Moods: `neutral, scared, angry, happy, eating, sad, out, shocked`. Props: see `PROPS` in `packs/assets/props.js`.
Narrator poses: `stand, shrug, point, point_up, disgust, shock, happy, think, sad` (`packs/characters/shiba-punk`).

| template | use it for | key params |
|---|---|---|
| `encounter` | hook: predator meets prey | `bg, hunter{animal,mood}, prey{animal,mood,react_mood,react_at}, gag{prop,at}` |
| `show_off` | "it only takes X" — hero + prop, leftover on the floor | `bg, hero{animal,mood}, prop{name,at}, rest{animal,mood,label,at}` |
| `analogy` | explain a fact with an everyday object + narrator reaction | `bg, subject{animal,dots{at}}, label{text,at}, prop{name,at,stink}, narrator{pose,switch{at,pose}}` |
| `cutaway` | body part / ratio / "= battery" | `bg, subject, organ{name,at}, ratio{text,frac,at}, extra{prop,at}, narrator` |
| `flee` | animals run away; second beat with a big number | `bg, chaser, flee{animal,count,at}, then{line,prop,text,returner}` |
| `number_reveal` | one big number object | `bg, kind(stopwatch/calendar/pie/battery), text, frac, at, caption, narrator` |
| `title_card` | chapter card "1. …" | `color, number, text, narrator` |
| `bar_chart` | before/after numbers | `title, bars[{label,value,color,at}]` |
| `map` | where/when | `region(us_west/africa_south), year{text,at}, place{label,at,x,y}` |
| `narrator_talk` | the Shiba says something directly | `bg, pose, bubble{text,at}` |
| `ending_sign` | closing joke + CTA | `bg, winner, loser, sign, narrator` |
| `custom` | one-off scene written in the episode's own `scenes.js` | `fn: <function name>` + anything |

Shot keys besides `template/params`: `stickers`, `claims`, and for long formats `chapter: "Tên chương"` (starts a chapter,
usually on a `title_card` shot) and `ad_break: true` (allows a mid-roll at the start of this shot).

Note: templates are composed for 9:16; in 16:9 some need tuning (see `START_HERE.md` → hạn chế đã biết).

Backgrounds (`bg`): `sea`, `sea_surface`, `room`, `savanna`, `beach`, `card:<colour>` (`cream, skyB, yellow, navy` or a hex).

Adding a template: write a function `(t, ctx, p) => svg` in `scenes.js`, document it here, and reuse it.
If an episode needs something truly unique, put it in `episodes/<ep>/scenes.js` as `EPISODE_SCENES.<fn>` and use `template: custom`.

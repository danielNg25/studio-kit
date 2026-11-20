// chibi-v1: mẫu cảnh dùng chung (tối thiểu). Cảnh riêng từng tập: episodes/<id>/scenes.js → EPISODE_SCENES (template: custom).
const SCENES = {
  plain(t, ctx, p) { return chibiDefs() + `<rect width="1920" height="1080" fill="${p.bg || '#EFE3CB'}"/>` + (p.text ? plaque(p.text, p.sub || '', 960, 560, { size: 80 }) : '') + paper(); },
};

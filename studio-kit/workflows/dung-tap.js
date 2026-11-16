export const meta = {
  name: 'dung-tap',
  description: 'Dựng song song các chương của một tập theo chuẩn của style: tối đa 3 agent dựng, mỗi nhóm có 1 agent rà độc lập chấm ĐẠT/HỎNG',
  whenToUse: 'Dựng chương mẫu (cổng C4) hoặc, sau khi người dùng đã duyệt chương mẫu và đồng ý dùng workflow, dựng các chương còn lại. Hỏi người dùng trước khi chạy cho các chương còn lại.',
  phases: [
    { title: 'Dựng', detail: 'mỗi agent 1 nhóm chương, theo kế hoạch cảnh + chuẩn chất lượng của style' },
    { title: 'Rà soát', detail: 'agent khác (không phải người dựng) soát ảnh, chạy cổng trang, sửa, chấm ĐẠT/HỎNG' },
  ],
}
// Bản gốc ở đây; bản chạy: shorts-claude/.claude/workflows/dung-tap.js (chép sang sau khi sửa).
// args: {
//   build_dir:  đường dẫn tuyệt đối thư mục dựng của tập (comic-history: …/build/comic-history; webtoon-svg: …/episodes/<id>)
//   style:      'comic-history' | 'webtoon-svg'
//   chapters:   ["03","04",…]  chương giao cho agent (chương nhạy cảm agent chính tự làm)
//   samples:    ["00"]         chương đã được người dùng duyệt hình (C4) để chép cấu trúc — [] nếu đang dựng chính chương mẫu
//   plan:       đường dẫn kế hoạch tập (PLAN.md / scene plan) — nội dung từng chương lấy ở đây
//   brief:      (tuỳ chọn) đường dẫn + mục của bản dựng lại từng cảnh (vd reference/analysis/05-so-sanh.md "### Chương 0") — có thì theo nó trước
//   rules:      chuỗi luật nội dung riêng của tập (người thật, nghi vấn, bản đồ, nhân vật không được dùng…)
//   fast:       true = cần đăng gấp: chỉ sửa lỗi rõ ràng, tối đa 1 lần chụp lại mỗi chương
//   model, effort: (tuỳ chọn) model và mức effort cho mọi agent, vd model: 'fable', effort: 'medium'.
//               Không truyền effort → 'medium' (luật ngân sách của người dùng: agent trên mức medium phải hỏi trước); không truyền model → theo phiên.
// }
// Render, cổng `qa.py gate`, ghi review_log (kèm sha256 clip) và `core/preview.sh`: agent chính làm SAU workflow (render cần tắt sandbox).
// 14/11/2026: viết lại phần comic-history theo chuẩn phim mẫu Lemo sau khi người dùng bác bản xem tập Đài Loan — thêm phần đọc bắt buộc (STYLE "Chuẩn chất lượng",
// reference/, fx.js), luật diễn cho rối chính khách, tự chạy cổng trang (pagecheck); người rà chấm ĐẠT/HỎNG (references/tu-soat.md) thay cho "sửa lỗi rõ ràng".
const A = args || {}
if (!A.build_dir || !A.chapters || !A.chapters.length) throw new Error('thiếu args.build_dir hoặc args.chapters')
const ROOT = A.root || '<STUDIO>'   // truyền args.root = thư mục gốc studio (nơi có studio-kit/)
const SLUG = A.style || 'comic-history'
const SDIR = `${ROOT}/studio-kit/styles/${SLUG}`
const STYLE = `${SDIR}/STYLE.md`
// Lời dặn neo thời gian + chạy song song theo style (sửa 13/11: bản cũ chỉ đúng cho comic-history)
const WEBTOON = SLUG === 'webtoon-svg'
const ANCHOR = WEBTOON
  ? `Mọi mốc thời gian neo theo chữ trong lời đọc bằng ctx.at('chữ', …) (engine studio-template, xem build/timeline.json), không viết cứng số giây. Mỗi chương một file cảnh riêng (vd sc_<tập>_cNN.js); chỉ sửa file chương của mình.
CHẠY SONG SONG — bắt buộc: dùng tag riêng = nhãn nhóm của bạn. Ghép cảnh: "sh ${ROOT}/studio-kit/styles/webtoon-svg/tools/dev_tag.sh <tag>" (KHÔNG chạy "sh mkscenes.sh" trơn — nó ghi đè scenes.js của cả tập). Ảnh tĩnh: "STILL_JSON=build/render_dev_<tag>.json STILL_DIR=build/prev/_st_<tag> python3 build/still.py <tên> <shot:giây,…>" (không xoá build/prev/_st của người khác). mkscenes báo lỗi cú pháp ở file của agent khác thì đợi rồi chạy lại, không sửa file của họ. Lệnh khác: mục "Lệnh" trong ${STYLE}.`
  : `Mọi mốc thời gian neo theo câu/chữ của lời đọc (S(i), Wd(i,'chữ') từ K.chapter — đọc data/timeline.json để biết câu nào ở giây nào), không viết cứng số giây.
Xem ảnh tĩnh: "sh ${ROOT}/studio-kit/core/peek.sh ${A.build_dir} <khoá chương> <t1> <t2> …" → ${A.build_dir}/qa/peek_<khoá>.jpg (bảng ghép) + khung đầy đủ trong qa/peek<khoá>-HHMMSS/. Lệnh này và pagecheck mở server cục bộ → chạy Bash với dangerouslyDisableSandbox: true. Xem bằng Read.
Cổng trang (đo rối ngay trên trang, chưa cần render): "node ${ROOT}/studio-kit/core/pagecheck.mjs ${A.build_dir} <khoá chương>" (cũng cần dangerouslyDisableSandbox: true) — phải 0 LỖI (P1 rối có mặt ≥ 50 % chương · P2 không quãng nào > 15 s vắng rối · P3 chiều cao rối ≥ 0,55 khung · P5/P6 rối không đứng hình · P8/P9 đầu ngồi đúng cổ); ngưỡng ở ${SDIR}/qa.json.`
// model / effort cho mọi agent (14/11: người dùng dặn "dùng fable mức medium"); effort mặc định medium, model không truyền thì theo phiên
const OPT = Object.assign({}, A.model ? { model: A.model } : {}, { effort: A.effort || 'medium' })

// phần riêng của style rối giấy comic-history: đọc gì, đồ nghề gì, chuẩn nào, diễn thế nào
const COMIC = `ĐỌC BẮT BUỘC TRƯỚC KHI VIẾT (theo thứ tự): ${STYLE} — nhất là mục "Chuẩn chất lượng" và "Cạm bẫy đã gặp"; ${SDIR}/reference/README.md (bảng số phim mẫu Lemo so với bản bị bác); xem tận mắt phim mẫu qua ${SDIR}/reference/sheets/demo_1.jpg … demo_3.jpg và bản bị bác qua ${SDIR}/reference/ours_sheets/o_02.jpg, o_06.jpg (để biết KHÔNG làm gì); ${SDIR}/reference/analysis/01-dien-xuat.md mục nguyên tắc diễn.
ĐỒ NGHỀ: ${SDIR}/engine/anim.js (key, EASE, twos, wob, hopY, popIn, strike), ${SDIR}/engine/fx.js (đọc phần chú thích đầu file và danh sách export: backdrop/front nền nhiều lớp, paperSheet, drawMapPiece mảnh bản đồ hình thật, scissorsCut, slapDown, stampTool, impact + hit/shakeList, paperHand, pinDrop, token, counter, yearDrop, factSlip, speech, flipBoard, tearRect/tornEdge, coldLight…), engine.js (drawPuppet/puppet/poseTrack: hh, face, flip, handA/handB = đích bàn tay IK, holdA/holdB, e: ease từng khoá, sway/breath tuỳ chọn; shots: [t, 'P1', 0, 0, { z: [z0, z1], f: [x, y], lock, vig }]), kit.js. Cách dùng mẫu: ${A.build_dir}/chapters/chfx.js (mọi hiệu ứng) và cha1.js (rối to, tay IK, rung, máy)${(A.samples || []).length ? ` và chương đã được duyệt: ${A.samples.join(', ')}` : ''}.
CHUẨN PHẢI ĐẠT (bản trước bị người dùng bác vì trái hết): mỗi cảnh là một cảnh 16:9 đầy khung 1920×1080 (KHÔNG cảnh rộng hơn để lia ngang); nền kín, đậm màu, nhiều lớp (FX.backdrop + FX.front, không tường kem trơn, không biển trơn); rối đóng chính cao hh 650–760 (≥ 0,60 khung), đứng quanh 22 % và 76 % bề ngang, vật đang nói tới ở giữa; rối/bàn tay giấy có mặt ≥ nửa chương; con đang dẫn đổi tư thế mỗi ~1,5 s, con kia phản ứng, đổi mặt có canh giờ (ý định trước cử chỉ 0–0,2 s, phản ứng trễ 0,12–0,5 s); MỖI Ý LỚN là một hành động giấy đủ lớp bằng strike(): đà → giữ run → một hình trung gian → chạm (FX.hit rung máy + FX.impact nét mực/vụn giấy) → giữ → thu về; cú chạm rơi 0,05–0,2 s sau khi câu dứt hoặc đúng động từ; mỗi câu lời có một thay đổi nhìn thấy trong 1 s đầu; không quãng nào đứng im > 2 s; cứ ≤ 10 s có một nhịp LỚN (thay đổi trên diện rộng: vật to bung/trượt vào, đổi cảnh, đèn bật — rung máy nhỏ không tính); tối đa 4 khối chữ cùng lúc, chữ chính ≥ 56 px, phụ ≥ 36 px, không chữ nào bị mép khung cắt (máy trôi 1,00 → 1,04 cắt thêm ~2 % mép: chừa lề ≥ 50 px); không biểu đồ có độ dài tự đặt; mảnh đất dùng FX.drawMapPiece (hình thật), không đa giác tự vẽ.
NGƯỜI THẬT (rối có mặt, chính khách): trung tính, đĩnh đạc — tay mở ở tầm ngực, chỉ, nhìn, gật, cầm/đặt giấy, lùi nửa bước, đổi mặt (thường / cười nhẹ / nghiêm); KHÔNG giơ thẳng tay, không bị vật gì đập/ném vào, không ngã, không nhảy; không gì che mặt (kể cả vụn giấy rơi qua mặt), micro/bục không đè lên mặt và thân. Việc mạnh (đóng dấu, cắt, xé, dán, đẩy quân cờ) do bàn tay giấy không mặt (FX.paperHand) và vật vô tri làm. Idle là động tác có chủ đích (nghiêng đầu 6° giữ 1,5 s, đưa người nhẹ), KHÔNG thở/lắc hình sin đều, không chớp mắt, không nảy lên một tí. Không cờ, phù hiệu, biểu tượng chính trị.`

const GENERIC = `Diễn hoạt — hai lỗi người dùng đã chê ngày 13/11, cấm lặp lại: (1) KHÔNG cho nhân vật nảy/nhảy lên một tí để "khỏi đứng im" (không hop/jump lặp theo chu kỳ kiểu Math.floor, không nhún khi nói / đổi nét mặt / phản ứng). Người đứng yên chỉ thở + chớp mắt; cần có việc thì diễn đúng lời bằng tay, nghiêng người một lần, quay đầu, nét mặt, di chuyển, đồ vật. (2) Dựng nhanh/montage: tối đa 2–3 cảnh cho một câu, mỗi cảnh ≥ ~2,5 s và trọn một việc; không cắt cận từng người 0,6 s. Chi tiết: studio-kit/DIRECTOR.md §1–§2.
Mỗi khung phải đạt DIRECTOR §5 (3 lớp sâu, ≥ 3 đồ vật đúng thời, nguồn sáng, nhân vật chính ≥ 1/3 khung, không mảng trống lớn, không gì che mặt).`

const chs = A.chapters.slice()
const G = Math.min(3, chs.length), per = Math.ceil(chs.length / G)
const groups = []; for (let i = 0; i < chs.length; i += per) groups.push(chs.slice(i, i + per))
log(`${chs.length} chương → ${groups.length} nhóm: ${groups.map(g => g.join(',')).join(' | ')} · tổng ${groups.length * 2} agent · effort ${OPT.effort}${OPT.model ? ' · model ' + OPT.model : ''}`)

const COMMON = `Bạn đang làm một tập video của studio người dùng (kênh YouTube tiếng Việt). Thư mục dựng: ${A.build_dir}
Đọc trước: ${ROOT}/studio-kit/AGENTS.md (mục "Luôn áp"), ${ROOT}/studio-kit/DIRECTOR.md, ${STYLE}, kế hoạch tập: ${A.plan || '(xem PLAN.md trong thư mục dựng)'}${A.brief ? `, và BẢN DỰNG LẠI TỪNG CẢNH (theo nó trước, giữ nguyên lời và dữ kiện): ${A.brief}` : ''}${(A.samples || []).length && WEBTOON ? `, và các chương mẫu đã được duyệt: ${A.samples.join(', ')}` : ''}.
Luật nội dung riêng của tập: ${A.rules || '(không có thêm)'}
Ràng buộc cứng: chỉ sửa file của các chương được giao; KHÔNG sửa engine, fx/kit/anim/cast dùng chung, chương khác, tài liệu .md; không xoá file (không rm — dời vào <kênh>/_to_delete/ hoặc ghi ra thư mục mới); không render video cả chương / build cả tập — agent chính làm; không gọi mạng, dịch vụ trả phí, tạo ảnh. File của người khác đang lỗi cú pháp thì đợi ~60 s rồi thử lại, không sửa hộ.
${WEBTOON ? GENERIC : COMIC}
${ANCHOR}
${A.fast ? 'CẦN ĐĂNG GẤP: chỉ sửa lỗi rõ ràng, tối đa 1 lần chụp lại để kiểm mỗi chương, không tinh chỉnh thẩm mỹ.' : 'Soát kỹ: lặp sửa–chụp tới khi đạt chuẩn (tối đa 4 vòng mỗi chương).'}`

const RESULT = { type: 'object', properties: { chapters: { type: 'array', items: { type: 'object', properties: {
  ch: { type: 'string' }, status: { type: 'string', enum: ['xong', 'chạy được, còn lỗi', 'hỏng'] },
  done: { type: 'array', items: { type: 'string' } }, open: { type: 'array', items: { type: 'string' } },
  verdict: { type: 'string', description: 'Chỉ người rà điền: một dòng "Soát mắt: Theo lời ĐẠT · Kịp hiểu ĐẠT · Không đứng im … · Lấp khung … · Chữ … · Điện thoại … (+ với rối: Khớp rối … · Cỡ rối … · Diễn … · Hành động giấy … · So mẫu …)" — HỎNG thì kèm giây' },
  pagecheck: { type: 'string', description: 'kết quả pagecheck cuối (style có rối): số lỗi/cảnh báo và các số đo P1–P9' } }, required: ['ch', 'status', 'done', 'open'] } } }, required: ['chapters'] }

const results = await pipeline(groups,
  (g, _, i) => agent(`${COMMON}

VIỆC: DỰNG các chương ${g.join(', ')}. Với mỗi chương: đọc lời từng câu và mốc giây, lập danh sách cảnh (mỗi cảnh: nền gì, nhân vật nào cỡ nào đứng đâu, từng nhịp ai làm gì theo câu nào, hành động/vật nào mang ý chính và xảy ra ở chữ nào, chữ gì hiện), rồi viết file chương${WEBTOON ? ' (chép cấu trúc chương mẫu: khung chương, bố cục cảnh, máy quay, phụ đề, cách khai nhân vật)' : ' chapters/ch<khoá>.js ở chế độ shots'}.
Mỗi khung phải đạt chuẩn ở trên và DIRECTOR §8 (nội dung nhạy cảm).
Tự soát trước khi trả: chụp ảnh tĩnh ít nhất mỗi 1 s cho cả chương + dải 6 khung liền ~1/12 s qua mỗi cú chạm / đổi mặt / đổi cảnh, MỞ XEM bằng Read, sửa lỗi JS và mọi chỗ chưa đạt; ${WEBTOON ? '' : 'chạy pagecheck tới khi 0 LỖI; '}đặt 3 khung của chương cạnh khung phim mẫu của style (nếu có) để tự so cỡ nhân vật, độ kín nền, màu.
Trả về từng chương: trạng thái, đã làm gì (danh sách cảnh, 1 dòng mỗi cảnh), còn gì chưa chắc (kèm giây)${WEBTOON ? '' : ', kết quả pagecheck'}.`, Object.assign({ label: `dựng ${g.join(',')}`, phase: 'Dựng', schema: RESULT }, OPT)),
  (built, g, i) => agent(`${COMMON}

VIỆC: RÀ SOÁT ĐỘC LẬP các chương ${g.join(', ')} vừa được một agent khác dựng. Bạn là người xem khó tính và là người giữ cổng, không phải tác giả: mặc định là CHƯA ĐẠT cho tới khi ảnh chứng minh ngược lại. Đọc ${ROOT}/studio-kit/references/tu-soat.md (mục "Soát mắt ĐẠT / HỎNG").
Báo cáo của người dựng: ${JSON.stringify(built || {})}
Làm: (1) chụp ảnh tĩnh mỗi 1 s cho cả chương + dải 6 khung liền ~1/12 s qua mỗi cú chạm, mỗi lần đổi mặt, mỗi lần đổi cảnh; mở xem TỪNG tấm ở cỡ đủ lớn (khung đầy đủ cho cảnh có nhân vật); ${WEBTOON ? '' : '(2) chạy pagecheck, đọc từng số; '}(3) đặt cạnh khung phim mẫu của style (nếu có); (4) đối chiếu từng câu lời với hình ở đúng giây đó.
Chấm từng mục ĐẠT / HỎNG với bằng chứng (giây + đường dẫn ảnh): Theo lời · Kịp hiểu · Không đứng im · Lấp khung · Chữ (≤ 4 khối, đủ to, không bị cắt mép, không đè mặt) · Điện thoại (thu ảnh còn 360 px: mặt còn nhận ra, chữ còn đọc)${WEBTOON ? ' (+ mục signature của kênh trong skill kênh)' : ' · Khớp rối (đầu ngồi đúng cổ ở mọi khung, kể cả lúc đổi mặt/nghiêng đầu) · Cỡ và sự có mặt của rối · Mật độ diễn (dẫn – phản ứng, đổi mặt đúng lúc, không idle hình sin, người thật đĩnh đạc) · Hành động giấy và hiệu ứng (đủ lớp đà–giữ–chạm–rung–vụn–thu về, đúng chữ) · So với phim mẫu'}.
Mục nào HỎNG: sửa trực tiếp trong file chương (được thiết kế lại một cảnh nếu cần để đạt chuẩn, giữ nguyên lời và dữ kiện), chụp lại, chấm lại — tối đa ${A.fast ? 2 : 4} vòng. Không hạ chuẩn để cho qua; cái gì không sửa nổi thì ghi rõ HỎNG kèm giây và lý do.
Trả về từng chương: trạng thái, đã sửa gì, còn gì HỎNG (kèm giây), dòng verdict "Soát mắt: …" của vòng cuối${WEBTOON ? '' : ', kết quả pagecheck cuối'}.`, Object.assign({ label: `rà ${g.join(',')}`, phase: 'Rà soát', schema: RESULT }, OPT)),
)
const out = results.filter(Boolean).flatMap(r => r.chapters || [])
const missing = chs.filter(c => !out.some(o => String(o.ch).includes(c)))
if (missing.length) log(`Không có báo cáo cho chương: ${missing.join(', ')} — kiểm tay`)
return { chapters: out, missing, next: 'Agent chính: render (build_par / render_local), ghép, `qa.py gate <clip>` (rối + hình + trang); xem dải ảnh cổng sinh ra; ghi review_log.md: "## Chương N — vòng K (YYYY-MM-DD HH:MM) — rà: agent rà độc lập" + dòng verdict "Soát mắt: …" + "sha256 <8 ký tự đầu của clip>"; cổng qua thì `sh studio-kit/core/preview.sh <clip>` rồi gửi người dùng.' }

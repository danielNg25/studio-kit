# webtoon-code-v1: nhân vật vẽ bằng code, kiểu webtoon phẳng

Người dùng chốt ngày 2026-10-11 ở kênh mẫu, tập thử `test-luc-mach`. Câu chốt: "như này oke hơn nè… note lại vào style sau này dùng cho chuẩn".

Ảnh mẫu đã duyệt: `ref/nhan-vat-v6.jpg`. Khi vẽ nhân vật mới, đặt cạnh ảnh này để so cho khớp.

## Nguyên tắc số 1: mặt, tóc và áo cùng một độ chi tiết

Toàn bộ nhân vật vẽ theo một kiểu: **tô phẳng 2 tông + viền mực đậm**.
- **Cách tô:** dùng hàm `chT(d, màu, màu-bóng)`. Mảng bóng lệch sang một bên, không dùng gradient.
- **Viền:** nét mực `#2A1A14`, dày khoảng 4,5–5,5. Nét bên trong mảnh hơn và thưa.
- **Mặt và tóc không được chi tiết hơn áo.** Bạn gái người dùng góp ý rằng mặt quá đẹp và quá chi tiết so với phần còn lại, nên đã bỏ hết những thứ sau. Không thêm lại:
  - tròng mắt chuyển màu, vòng sáng trong tròng, viền tối trên lòng trắng, nếp mí;
  - dải bóng hay chấm sáng lấp lánh trên tóc, nét tóc màu sáng (nét tóc chỉ dùng màu bóng, giống nếp vải);
  - mảng bóng tóc đổ trên trán, gạch hồng trên má (chỉ còn má hồng nhạt khi ngượng hoặc sốc).
- Bản chi tiết đã bị loại được giữ ở `ref/chars_ban-chi-tiet_KHONG-DUNG.js`, chỉ để tham khảo, không dùng.

## Mặt nam

Người dùng nhận xét 2 lần rằng mặt "nhìn như con gái", nên mặt nam phải theo đúng các điểm sau:
- **Mặt gần nhìn thẳng.** Miệng, mũi và cằm nằm giữa hai mắt. Miệng không được lệch sang một bên.
- **Mắt:** dùng `chEyeM`. Mắt hẹp, đuôi xếch, tròng nhỏ bị mi trên che bớt, chỉ có một chấm sáng nhỏ. Mắt trái lật đối xứng với mắt phải.
- **Lông mày:** dày, thẳng, đầu trong đậm, nằm sát mắt và vẽ đè lên tóc mái. Khi giận thì đầu trong cụp xuống.
- **Mặt và da:** hàm có góc, mặt dài hơn mặt tròn. Da `#F3D2B5`, bóng da `#DCA987`.
- **Tóc:** vuốt ra sau, hở trán, chỉ một lọn rủ. Không để mái lởm chởm, không để lọn tóc ôm hai bên mặt.
- **Miệng:** nhỏ, gọn, phóng 1,2–1,7 lần theo biểu cảm (`chMZ`). Miệng mở có lòng miệng đỏ sẫm và lưỡi hồng.

## Tỉ lệ và cấu tạo (xem `chChar`)

- **Nửa thân, không chân.** Đáy thân nằm sát mép dưới khung hình, `ground` khoảng 1075.
- **Đầu và thân:** thân cùng tay phóng `CH_BS = 1.32` so với đầu, để đầu không quá to so với thân.
- **Tay:** là tay áo rộng xoay quanh vai. Góc 0 là buông, −90 là chỉ thẳng ra trước, −150 là giơ cao. Vạt tay áo rủ theo trọng lực. Tay sau giấu sau lưng.
- **Bàn tay:** có các kiểu `point` (chỉ ngón), `fist` (nắm), `open` (xòe), `book` (ôm sách), `sword` (cầm kiếm; góc kiếm so với tay chỉnh bằng `wpn`).
- **Áo:**
  - cổ chéo 3 lớp (trong trắng, giữa màu viền, vạt ngoài có viền);
  - đai lưng có nút thắt và 2 dải rủ;
  - vài nếp vải.

## Biểu cảm (`CH_EXPR`), đã duyệt

| Biểu cảm | Mô tả |
|---|---|
| neutral, calm | mặt bình thường / lim dim |
| smile | mắt cười cong ^^ |
| smug | mắt lim dim, một bên lông mày nhướn |
| fierce | mắt giận |
| yell | quát, kèm dấu gân đỏ |
| grit | nghiến răng, kèm dấu gân đỏ |
| shock | mắt trợn tròng nhỏ, miệng há dọc, trán tái xanh có vạch dọc |
| awkward | liếc ngang, cười méo, giọt mồ hôi to |
| pain | mắt >< nét đậm, răng cưa, nước mắt |
| strain | gồng sức, kèm mồ hôi |
| sad | buồn |

Người dùng chê bản biểu cảm cũ ("trông tệ quá"), nên không quay lại kiểu miệng lượn sóng nhỏ hay chữ "o" nhỏ xíu.

## Chuyển động và hiệu ứng (`fx.js`), đã duyệt ("trông ổn rồi đó")

**Khung hình:** render 30 fps. Blueprint của kênh ghi `format_overrides: { fps: 30 }`.

**Chuyển động:**
- Nội suy bằng `smK` (Catmull-Rom). Giật tay có lò xo (`spring`).
- Gồng lấy đà trước mỗi đòn. Tay vung nhanh để lại vệt nhòe (`smear`).
- Khựng hình lúc trúng đòn (`hitStop`). Máy quay trôi nhẹ như cầm tay (`camX`).

**Hiệu ứng:**
- Tụ khí trước khi bắn (`fxCharge`).
- Tia kiếm khí nhiều lớp (`fxBeam`).
- Nổ có mảnh đá văng, bụi và vòng xung kích (`fxImpact`).
- Nền tối lại khi tụ lực (`fxDim`), tia sáng tỏa ra phía sau (`fxRays`).
- Bụi khi lướt (`fxDust`) và đường tốc độ (`fxSpeed`).
- Khung mực (`inkify`), cộng thêm các hàm có sẵn trong `glow.js`.

**Ô xếp hạng không gắn hiệu ứng** (người dùng: "nhìn kiểu AI lắm").

## Cách dùng

1. **Nạp file:** blueprint của kênh đặt `extra_scripts` theo thứ tự `chibi-v1/glow.js`, rồi `webtoon-code-v1/fx.js`, rồi `webtoon-code-v1/chars.js`. Hiện tập thử đang ghép tay các file này vào `scenes.js`.
2. **Thêm nhân vật:** thêm vào `CHAR` (có thể khai báo trong `scenes.js` của tập):
   - `male: 1`, màu tóc / áo / viền / đai, màu mắt `iris`;
   - kiểu tóc: `longHair`, `bun`, `pony` + `ribbon`, hoặc `bald` + `beard`;
   - `sharp` nếu mắt hẹp hơn.
3. **Vẽ nhân vật:** `chChar(id, { x, ground, scale, arm, hand, wpn, ex, lean, sq, lag, smear, flip, grey, flash, spin }, t)`.
   Đầu ngón tay hoặc mũi kiếm lấy bằng `chTip(id, st, t)`.
4. **Duyệt trước:** dựng bảng nhân vật mới theo mẫu `ref/nhan-vat-v6.jpg` (dáng lớn + 7 biểu cảm), gửi người dùng duyệt **trước** khi ghép vào cảnh.

## Người dẫn MC (kênh mẫu), chốt ngày 2026-10-11

Ảnh mẫu đã duyệt: `ref/mc-chot-v2.jpg` (tay tròn, dây nón), `ref/mc-soc-v2.jpg` (mặt sốc). Code nằm trong `narrator_mc.js`, nạp sau `chars.js`. Hàm vẽ: `mcChar(x, y, scale, ex, t, { pose, hat, look, tilt, flip })`.

- **Lai lịch:** phú hộ sa cơ, thua cược vì thiếu cái mẻ kho, hóa thằn lằn.
  - Hướng thiết kế đã chọn là A: **đầu là đầu con thằn lằn thật, thân người**. Như vậy MC không giống nhân vật trong truyện. Người dùng đã loại bản "người đội mũ trùm thằn lằn" vì "giống nhân vật trong truyện quá".
- **Màu thằn lằn thật:** be xám ngả hồng `#DCCBAE`, đốm nâu, bụng nhạt, mắt to con ngươi dọc, có 2 lỗ mũi trên mõm. **Không dùng màu xanh.**
- **Dấu nhận diện:**
  - nón tre giang hồ (đấu lạp) rách một mảng;
  - áo phú hộ gấm đỏ bạc màu, có 2 miếng vá;
  - dây thừng thay đai;
  - mẻ kho đeo hông;
  - một chiếc răng vàng;
  - đuôi đung đưa.
- **Dây nón:** dây bên trái vòng trước cằm. Dây bên phải đi **sau mặt** và vẽ ở lớp sau đầu (`hat.back`). Không được vẽ cả 2 dây trước mặt.
- **Tay:** **luôn là tay tròn, không có ngón**, kể cả khi chỉ trỏ.
  - Đứng yên: `pose: 'none'`, **không vẽ tay**.
  - Chỉ trỏ: `pose: 'point'`. Vẫy tay: `pose: 'wave'`.
  - **Không dùng kiểu chắp tay sau lưng** (người dùng: "xấu quá").
- **Biểu cảm:**

  | Mã | Biểu cảm |
  |---|---|
  | `tinhbo` | tỉnh bơ, mặc định |
  | `tac` | tặc lưỡi, có chữ "TẶC!" |
  | `grin` | cười đểu, lộ răng vàng |
  | `shock` | sốc: há hốc mồm thật to, hàm rớt quá cằm, thấy lưỡi hồng và răng vàng (người dùng: "há mồm to hơn") |
  | `tiec` | tiếc của, khóc ròng |
  | `quiz` | hỏi xoáy |

- **Không tự giới thiệu** trong video ("tôi là MC…").

## Bổ sung đợt 1 tập xep-hang-vo-cong, duyệt ngày 2026-10-11

Người dùng duyệt: "Oke mình duyệt bản vẽ này". Ảnh mẫu: `ref/nhan-vat-dot1-A.jpg` (nhân vật chính) và `ref/nhan-vat-dot1-B.jpg` (nhân vật phụ, phần chân, bóng đen).

- **Mặt nữ** (`fem: 1`):
  - cùng kiểu tô phẳng 2 tông, không đẹp và chi tiết hơn áo;
  - mắt `chEyeF`: tròn hơn mắt nam, tròng to, mi trên dày có 2 nét đuôi mi, chỉ một chấm sáng;
  - lông mày mảnh, cong (`chBrowF`); mũi nhỏ;
  - mái thưa có mép tròn (không cắt răng cưa nhọn), 2 lọn dài ôm mặt.
- **Phần chân** (`st.legs: 'stand' | 'run' | 'squat' | 'kneel' | 'stance'`):
  - chỉ dùng cho cảnh toàn thân; mặc định vẫn nửa thân;
  - gồm vạt áo dưới xẻ giữa, quần ống rộng (`pants`), giày vải (`shoe`).
- **Bóng đen quần chúng** (`st.sil: 1`): cả người tô một màu `#3B3546`. Dùng cho nhân vật chỉ xuất hiện thoáng qua.
- **Tuỳ chọn nhân vật mới:**
  - mặt: `skin`/`skinS`, `jaw: 'square'`, `stubble`, `mask` (mặt nạ sắt, cảm xúc chỉ qua mắt);
  - râu: `beardStyle: 'short' | 'goatee' | 'long'`;
  - tóc: `messy` (vài lọn cong nhỏ, không chĩa như sừng), `knot`, `headband`, `scholar`, `flower`, `greyStreak`, `bunBand`, `ribbonTails`; vương miện bạc chỉ khi `crown: 'silver'`;
  - người và áo: `bulk` (người to), `gourd` (hồ lô), `embroid` (thêu hoa), `rags` (áo rách gấu);
  - tay: `'needle'` (kim thêu), `'staff'` (gậy trúc biếc).
- **12 nhân vật đã duyệt:** `lhx`, `tp`, `htc`, `hd`, `dpbb`, `dtc`, `pt`, `nnh`, `ddd`, `dld`, `nbq`, `lbc`.

## Tay ở dáng đứng yên (CHỐT 2026-10-11)
- Người dùng: "idle sẽ ko hiện tay luôn, khi nào dùng chiêu hay đánh nhau cần tay thì mới có tay" → duyệt bản thân áo vai tròn KHÔNG tay ('thôi dùng bản này đi').
- `CH_OPT.noIdleArms = 1` (mặc định): tay trước ẩn khi scene không truyền `arm` (hoặc `arm: null`) và `hand` là rest/open/fist/point/không có; tay sau ẩn khi không truyền `back`/`backHand`. Tay cầm đồ (kiếm, kim, tiêu, sách, gậy, `none` = tay cụt) vẫn vẽ.
- Trong scene: muốn đứng yên thì để `arm: null` (KHÔNG dùng `arm: 16` như trước).
- Đã thử và bị loại: tay sau lộ thêm, tay liền thân (ống tay dính thân), chắp tay sau lưng/giấu tay trong ống áo/buông thẳng, mép thân khoét thành tay, thêm 2 bàn tay dưới mép — mã còn trong chars.js (`CH_OPT.backDx/backFuse/frontFuse/idle/carve`), mặc định tắt.
- Mũ ni (`nunHood`, Cửu Nạn): giữ dáng mũ úp cũ, ôm sát đầu, mép dừng sát mặt (bản trùm dài có vạt bị chê 'dài quá').
- Cụt tay trái (`armless: 'left'`, Cửu Nạn): CHỐT 2026-10-11 = cắt thụt hẳn mép thân bên trái, không vẽ tay/ống tay rỗng bên đó ('thôi kệ đi, dùng bản mình gợi ý, nhưng cho cắt thụt vào 1 tí nữa'). Các kiểu ống tay rỗng (tuck/flutter/knot) còn trong `CH_OPT.emptySleeve`, mặc định tắt.
- Thế tấn `legs: 'stance'`: bản cũ bị chê 'chân kì quá' → `CH_STANCE` 4 bản, `CH_OPT.stance` = 2 (gần như đứng) — ĐÃ DUYỆT 2026-10-11.
- Người dẫn MC GIỮ NGUYÊN tay như đã duyệt (không áp quy tắc ẩn tay) — người dùng 2026-10-11 'MC giữ nguyên'.
- Nhân vật đợt 2 (vtb cn adp qt hds vtd nd msp thp ht vnt + am) ĐÃ DUYỆT 2026-10-11 ('oke, duyệt cả 2'); bảng ở ref/nhan-vat-dot2-A.jpg, -B.jpg.
- Nhân vật đợt 3 (tt Tạ Tốn, tvk Trương Vô Kỵ, kk Không Kiến, dq Dương Quá — `armless:'left'`, tln Tiểu Long Nữ, tsp Trương Tam Phong, ad A Đại; thêm cu1/cu2 các cụ công viên) ĐÃ DUYỆT 2026-10-12 ('duyệt luôn nhân vật đợt 3'); bảng ở ref/nhan-vat-dot3.jpg.

## Bổ sung 2026-10-12
- Tay cầm `hand: 'woodsword'`: kiếm gỗ (Thái Cực), dùng như `'sword'` (xoay bằng `wpn`, `chTip` tính mũi kiếm). `chSword(glow, wood)`.
- **MC nhép miệng khi nói** (người dùng: 'các đoạn MC nói thì cho miệng nhấp nhô mở ra mở vào như nói chuyện'): `narrator_mc.js` có biến toàn cục `SUNG_TALK` (0–1) + `gkTalk()`; khi `SUNG_TALK > 0` và miệng là n/grin/tac thì miệng mở–khép. Tập gán `SUNG_TALK` theo câu người dẫn đang đọc (xem `build/mktalk.py` của tập xep-hang-vo-cong: bọc mọi scene, bỏ qua câu thoại nhân vật).
- Nhân vật đợt 4 (hth Hoàng Thường + hth2 bản 40 năm sau, ptd Phong Thanh Dương, dbq Điền Bá Quang, dxt Đinh Xuân Thu; mũ quan Tống `songHat`) + bóng lưng Độc Cô Cầu Bại `kBackHero` + rồng vàng `kGoldDragon` (tập xep-hang-vo-cong, `sc_props_d.js`) ĐÃ DUYỆT 2026-10-12 ('duyệt nhé'); bảng ở ref/nhan-vat-dot4.jpg.

## Tôn Ngộ Không (kênh mẫu, Tây Du Ký) — ĐÃ DUYỆT 2026-10-13 ('oke đó, duyệt nhé')
- Code: `chars_tnk.js` (nạp SAU chars.js): `CHAR.tnk_da` (khỉ đá / Mỹ Hầu Vương), `CHAR.tnk_tt` (Tề Thiên Đại Thánh — dáng chính Phần 1), `CHAR.tnk_hg` (Hành Giả đi thỉnh kinh, xem trước). Ảnh mẫu: `ref/ngo-khong-chot.jpg`, `ref/ngo-khong-lem-linh.jpg`.
- Cân đối người dùng chốt: khung đầu + trang phục học theo Văn Vở, nhưng mắt / lông mày / mũi / miệng là bộ mặt nam của pack ('mình vẫn thích kiểu có mắt mũi của chúng ta, nên cân đối').
  - Đầu tròn, lông xù MỘT lớp, viền chỏm lông cong mềm (không gai nhọn, không vòng lông thứ 2), 1 chỏm nhỏ trên đỉnh; mặt nạ kem 2 thuỳ ôm mắt + mõm tới cằm; 2 tai tròn chìa hai bên; mũi 2 lỗ; mắt vàng.
  - Đã thử và bị loại: lông má, chỏm chữ V trán, bờm lông dưới cằm ('bỏ phần lông ở cằm'), vòng lông ngoài 2 lớp ('làm 1 lớp chứ không phải 2 lớp'), lông ló dưới gấu áo, mắt tròn to riêng + đầu lông chĩa nhọn (bản nháp đầu 'xấu quá'), 3 phương án mặt người / mỏ lôi công / khỉ tròn với trang phục giáp vàng mũ cánh phượng ('trang phục chưa đạt').
- Trang phục Tề Thiên: giáp đỏ, huy hiệu vuông vàng giữa ngực, giáp vai + vạt dưới vảy cá vàng, đai xanh khoá vàng, áo choàng đỏ, mũ vàng nhỏ + 2 sợi lông trĩ dài. Gậy Như Ý: thân sắt đen, hai đầu bịt vàng (`hand: 'gstaff'`, nghiêng bằng `TNK_STAFF_ROT`). Phần 1 KHÔNG đeo vòng kim cô (hồi 14 mới có).
- Mặt lém lỉnh (biểu cảm riêng `TNK_EX`): `lem` = liếc ngang, một bên mày nhướn cao, nhếch mép lộ chút răng + lúm (MẶT MẶC ĐỊNH khi đứng/nói); `nhay` = nháy mắt cười toe; `hihi` = cười híp mắt lộ răng (cho đoạn hài). Các biểu cảm chung (fierce, yell, shock, pain…) vẫn dùng như nhân vật khác.

## Nhân vật Tây Du Ký Phần 1 (kênh mẫu) — ĐÃ DUYỆT 2026-10-13 ('Oke ổn rồi nè')
- Code: `chars_tdk.js` (nạp SAU chars.js + chars_tnk.js). Bảng duyệt: `ref/nhan-vat-tdk-A..E.jpg` (A Thiên Đình văn · B võ tướng · C Phật/đạo/người · D Long Cung/âm phủ/yêu · E khỉ + Ngộ Không dáng phụ).
- Thuộc tính mới trong CHAR: mian, phoenix, twinBuns(+bunRibbon/bunFlower), horns ('ox'|'one'|'imp'|'dragon'|'small'), whiskers, thirdEye, bigEyes, bigEars, buddha(+buddhaStache), veil, halo, helmet(+helmetGem, hatY), lotus, toDia, offHat, plate, longBrow, noseRing, monkeyBeard, fangs, redEyes, mature, bushyBrow, dragonFace(+crownDragon); thân: armor(+armorGem), cape, sashLoop, bagua; đồ cầm tay: whisk, ruler, pagoda, axe, woodaxe, trident, spear, whip, blade, cane, rope, vase, qkring (xoay bằng biến toàn cục TDK_ROT); chó săn `tdkDog(x,y,k,T,{c})`; ba đầu sáu tay `tdkThreeHeads(id, st, T, arms)`.
- Chốt của người dùng: GIỮ mắt thứ ba cho Nhị Lang + Vương Linh Quan ('đó là thứ người ta nhận ra'); chó săn của Nhị Lang màu ĐEN (truyện chỉ gọi 細犬, không nói màu); Long Vương = MẶT RỒNG (phương án B; các em đổi màu vảy/áo; Long nữ mặt người có sừng nhỏ); Phật Tổ trông già dặn (mặt đầy, nếp khoé mắt/má), mặc định KHÔNG râu (bản có ria để ở `buddhaStache: 1`, ref/phat-to-rau.jpg); Diêm Vương da tím sẫm, mắt đỏ, nanh, mày rậm; Lão Quân hói + mày dài (khác Thái Bạch búi tóc).

## Nhân vật Kim Dung Phần 2 (tập xep-hang-vo-cong-p2) — ĐÃ DUYỆT 2026-10-15 ('Mình thấy ổn rồi nhé')
- Code: `chars_kd2.js` (nạp SAU chars.js + chars_tnk.js + chars_tdk.js). Bảng duyệt: `channel-example/episodes/xep-hang-vo-cong-p2/build/design/nhan-vat-kd2-A..C.jpg`.
- Đợt chính: klpv Kim Luân (mũ sư Tây Tạng `lamaHat`, áo đỏ sẫm + cà sa vàng, `hand:'wheel'`; đạo cụ `kd2Wheels()` 5 bánh xe vàng/bạc/đồng/sắt/chì có răng cưa — KHÔNG kiểu bánh lái tàu), tsdl Thiên Sơn Đồng Lão (`kid`: đầu ×1.22, tóc bạc 2 búi, vẽ scale ~0.4), ltt Lý Thu Thủy (`faceVeil`: khăn lụa mỏng che nửa dưới mặt, mép gợn — không kiểu khẩu trang), cmt Cưu Ma Trí (áo vàng + cà sa đỏ, không mũ), athanh A Thanh (`hand:'bamboo'` gậy trúc thường), bcc Bạch công công (vượn trắng, dựa CHAR.vuon), tpt Thạch Phá Thiên, mdb Mộ Dung Bác, ldc/mdc Long/Mộc đảo chủ.
- Đợt phụ: nhnt (`hand:'shears'`), tlt, plai, tthi (`tiara`), lta, hbi, cbt, cts, dth, tamdo (`longBrow`), basu, ngoks (+ bóng đen `sil`).

## Nhân vật Tây Du Ký Phần 2 + 3 (kênh mẫu) — ĐÃ DUYỆT C2 2026-10-19 10:16 ('ok rồi nhé')
- Code: `chars_tdk2.js` (nạp SAU chars.js + chars_tnk.js + chars_tdk.js + narrator_mc.js), DÙNG CHUNG cho P2 và P3 ('dùng chung nhân vật nhé'). Bảng duyệt: `channel-example/episodes/tay-du-p2/build/design/nhan-vat-tdk2-A..E.jpg` (A thầy trò + triều Đường · B thần tiên · C yêu quái · D Bạch Cốt ba hình + lục tặc · E lục tặc + cả sáu tên). Dựng bảng: `build/design/build_board.sh` (+ `sheet_tdk2.js`).
- Người dùng muốn nhân vật **gần gũi như Vui Vẻ** ('nên tạo hình nhân vật giống vui vẻ thân thuộc với mọi người hơn'): kiểu chibi — đầu to (`headK` ≈ 1,38; Hồng Hài Nhi 1,55), thân nhỏ, má hồng (`cheeks`). Mặt vẫn giữ bộ mắt mũi của kênh (đã chốt từ Ngộ Không). Không chép nguyên thiết kế của Vui Vẻ (tránh bị coi là sao chép) — chỉ lấy các nét quen thuộc.
- Chốt riêng từng người: **Kim cô vân mây GIỐNG NHAU ở cả ba đệ tử** (Ngộ Không `hg2`, Bát Giới, Sa Tăng): dải vàng + vân mây xoắn đôi vàng `tdk2Cloud()` — 'vòng kim cô của 3 người khác nhau thế' → làm đồng bộ. Đường Tăng: mão ngũ phật vàng có nền đỏ viền mực, cà sa ô ruộng đỏ cam viền vàng (`patchKasaya`, giống trong phim). Bát Giới: da hồng nhạt, mõm nhỏ tròn, tai to xòe, mũ navy có kim cô. Sa Tăng: HÓI đỉnh đầu (`bald` + `noDots`), tóc mai xanh đậm, râu xanh đậm tròn rất to (`bushBeard`, chừa ô miệng để nhép khi nói), chuỗi hạt đen to (`bigBeads`), áo xanh lam đai tím. Hồng Hài Nhi: đầu to như trẻ con (`kidEyes`, má hồng, búi tóc + chỏm lửa). Ông/bà lão (Bạch Cốt, thầy bói, Thọ Tinh…): `aged` (nhăn trán, chân chim, bọng mắt, má võng, đốm đồi mồi) + `hunch` (lưng gù). Lục tặc cùng khuôn nhưng mỗi tên một nét (bịt mắt, hói đeo khuyên, sẹo+nanh, kính râm, râu dê…).
- Thuộc tính mới (chars_tdk2.js): pigEars, pigSnout, pigHat, tusks, monkCrown, patchKasaya, flameTuft, bigForehead, futou, pale, cheekMark, kidEyes, cheeks, headK, aged, hunch, scar(+scarC), eyepatch, earring, glasses, crescent (= kim cô vân mây của hg2), bandBald, bushBeard, noDots, bigBeads, skulls; tay cầm: rake, crescent, khakkhara, redgourd, jadebottle, porcelain, brush, peach, fan. Biến thể chibi dùng lại nhân vật P1: `hg2` (Ngộ Không), `tlq2`, `qa2`, `nmv2`, `nt2`. KHÔNG sửa chars_tdk.js / chars_tnk.js (P1 giữ nguyên).
- Chưa vẽ (làm ở bước kế hoạch cảnh C3): dạng thú/nguyên hình — ngựa (Bạch Long Mã), rồng, sư tử xanh, trâu xanh, rùa, cá vàng, gấu.

## Nhân vật Kim Dung tập phan-dien-kim-dung (12 phản diện) — ĐÃ DUYỆT C2 2026-10-19 14:12 ('ổn rồi nhé')
- Code: `chars_pd.js` (nạp SAU chars.js + chars_tnk.js + chars_tdk.js + narrator_mc.js + chars_kd2.js + chars_kd3.js). Id có tiền tố `pd_` (tránh đụng id tập khác, vd `nl` = Nhị Lang bên Tây Du). Bảng duyệt: `channel-example/episodes/phan-dien-kim-dung/build/design/nhan-vat-pd-A..C.jpg`.
- Kiểu: webtoon-code cũ (KHÔNG chibi) để đồng bộ loạt Kim Dung tập 1–4; chibi chỉ áp cho Tây Du Ký P2+P3.
- Mới: pd_vc Viên Chân + pd_tc Thành Côn (một người hai mặt, thẻ lật chia dọc giữa người), pd_km Khang Mẫn (áo tang + hoa trắng), pd_dkd Đoạn Diên Khánh (áo xanh, hai trượng sắt), pd_at A Tử (kid, áo tím), pd_nl Nghi Lâm, pd_vny Vương Ngữ Yên, pd_ltq lão tăng quét lá, pd_ccn Chu Chỉ Nhược, pd_tm Triệu Mẫn (mũ Mông Cổ + bím hai bên), pd_lms Lý Mạc Sầu (áo đỏ).
- Đạo cụ cầm tay mới (bọc chHand): 'ironstaff' (trượng sắt), 'mirror' (gương đồng, dùng TDK_ROT), 'broom' (chổi tre; cầm thẳng đứng + legs:'stand' thì rơm chạm đất), 'whisk' (phất trần).
- Dùng lại: mdb tlt nbq klpv dxt adp dpbb lbc mdp nnh + nhân vật phụ tp lhx ddd dld tt tvk kk dd dcm ht qt qtg hd htc dq + mc. Hướng Vấn Thiên, Thượng Quan Vân: chỉ bóng đen (`sil: 1`).

## Nhân vật tập nhan-vat-kieu-phong — ĐÃ DUYỆT C2 2026-11-03 (Huyền Khổ chết = kp_hk_chet mắt nhắm; A Châu giả sư đầu trọc kp_ac_su; bản dập Trí Quang = vệt mực, không chữ; trong cảnh 3D phủ ánh sáng nv_light mức +30%)
- Code: `chars_kp.js`, nạp SAU `chars_tp1.js` (thứ tự đầy đủ: fx, chars, tnk, tdk, narrator_mc, kd2, kd3, pd, pd2, tp1, kp). Cần CHAR.tp + `aged` (tp1), `kid` (kd2), CHAR.dct + kingHat (kd3), TDK_ROT + twinBuns (tdk). Id đều có tiền tố `kp_`. KHÔNG sửa chars.js: mọi mở rộng là hàm bọc, chỉ tác động nhân vật mang cờ của nhóm (`kpTp`, `kpTang`, `kpc*`, `kun`/`kpHat`/`songHelm`…). File gộp từ 4 nhóm vẽ riêng (tp, tang, chau, lieu); đã kiểm nạp chung không trùng biến toàn cục, bảng render lại trùng khít từng điểm ảnh với bản trước khi gộp.
- Bảng duyệt: `channel-example/episodes/nhan-vat-kieu-phong/build/design/` — `nhan-vat-kp-tong.jpg` (10 nhân vật chính), `nhan-vat-kp-tp.jpg`, `nhan-vat-kp-chau.jpg` (+ `-bienthe`, `-toanthan`), `nhan-vat-kp-tang.jpg` (+ `-toan-than`, `-canh`), `nhan-vat-kp-lieu.jpg` (+ `-toanthan`). Dựng lại: `build_board_{tong,kp_tp,chau,tang,lieu}.sh` (chạy NGOÀI sandbox).
- Kiểu: webtoon-code cũ (KHÔNG chibi), đồng bộ loạt Kim Dung. Tay ẩn ở dáng đứng yên như quy tắc chung.
- **Nhóm tp** — Tiêu Phong mặt = nguyên CHAR.tp, chỉ đổi áo/trạng thái: `kp_tp_bc` (bang chủ, áo xám vá, dây thừng, KHÔNG túi; `hand:'kpdacau'` gậy Đả Cẩu), `kp_tp_thuong` (Tụ Hiền Trang, áo rách vai/ngực, vạch thương mảnh không máu; đánh chưởng `hand:'open'`), `kp_tp_soi` (xé áo, đầu sói xanh trên ngực), `kp_tp_dv` (Nam Viện đại vương, áo choàng dạ cổ lông, đai vàng), `kp_tp_dv_soi`. Tiêu Viễn Sơn: `kp_tvs_bit` (mũ dạ + khăn bịt mặt, `hand:'kprope'` cuộn dây), `kp_tvs` (~60 tuổi, râu quai nón muối tiêu), `kp_tvs_soi`. Thuộc tính: kpTp, kpTear, kpChest, kpWolf, kpCape(+kpFur), kpBelt, kpCrown, kpHood(+kpMask), beardStyle `'kpbush'`.
- **Nhóm chau** — `kp_ac_xau` (A Châu cải trang xấu, áo vàng nhạt, gò má cao — KHÔNG đẹp), `kp_ac` (A Châu thật, áo hồng, khóa vàng như ý), `kp_ac_dct` (giả Đoàn Chính Thuần ×0,88), `kp_ac_cau` (trên cầu sau khi vuốt hóa trang, nhắm mắt, không máu), `kp_ac_su` / `kp_ac_su_lo` (giả nhà sư Chỉ Thanh / bị lau mặt), `kp_ttny` (Tiết thần y, râu nửa đen nửa bạc), `kp_kth` / `kp_kth_non` (Kiều Tam Hòe / đội nón), `kp_kth_vo` (bà Kiều). Co người: `kpcScale` (hàm bọc chChar/chTip tự nhân). Nét mặt mới `kp_ngat`. Tay cầm: `medbox`, `teapot`, `basket`, `acu`; đạo cụ rời `kpcMakeup`, `kpcGoldLock`, `kpcMedBox`, `kpcTeapot({piece})`, `kpcStrawHat`, `kpcBasket`.
- **Nhóm tang** — `kp_hk` (Huyền Khổ, râu mày muối tiêu, cà sa vàng, `hand:'kpcon'` côn tự dài chạm đất khi `legs:'stand'`), `kp_hk_thuong` (trọng thương, da tái, nhép miệng được), `kp_hk_chet` / `kp_hk_chet_mo` (đứng mà chết mắt nhắm / mắt mở), `kp_tq` (Trí Quang, mặt vuông, tai lớn, áo nạp 3 miếng vá; `kprubbing`, `kprubbing2`, `kpletter`), `kp_tieu` (chú tiểu, `kpScale` 0,74; `kpbowl`). Dáng mới: `legs:'kpsit'`, `legs:'kpzen'` (bồ đoàn), `st.kpChest:1` (tay ôm ngực). Nét mặt mới: `kp_hien`, `kp_chet`, `kp_chet_mo`, `kp_vientich` (miệng `kp_cuoi`). Đạo cụ rời `kpBowl(x,y,k,rot,{spill|broken})`.
- **Nhóm lieu** — `kp_hc_san` (Gia Luật Hồng Cơ đi săn, áo đỏ cổ tròn, cạo đỉnh chừa 2 lọn), `kp_hc_vua` (hoàng đế, mũ lông), `kp_hc_giap` (giáp vàng), `kp_sv` (Sở vương), `kp_htt` (Hoàng thái thúc, mũ nỉ cao), `kp_ky_lieu`, `kp_ky_lieu2` (kỵ binh / thân binh Liêu), `kp_tong_linh`, `kp_tong_cung` (quân Tống). Thuộc tính: `kun`(+kunTie), `kpHat:'emperor'|'tall'`, `songHelm`, `roundCollar`, `diexie`, kpStubble, kpBrowA, kpNoFringe. Tay cầm: `kp_bow`, `kp_bowdraw` (tự thêm tay sau `kp_elbow` kéo dây tới cằm), `kp_dao`, `kp_spear`, `kp_flag`. Truyền `seed: 2` cho id dài 9 ký tự (seed mặc định rơi đúng lúc chớp mắt).
- Gọi trong cảnh 3D (billboard): đặt `TDK_ROT` theo `-arm` khi cầm đồ dựng đứng; ngồi ôm ngực `chChar('kp_hk_thuong',{legs:'kpsit',kpChest:1,ex:'sad',talk:k})`; viên tịch `chChar('kp_tq',{legs:'kpzen',ex:'kp_vientich'})`; đọc thư `TDK_ROT=122; chChar('kp_tq',{arm:-122,hand:'kpletter'})`.
- Chờ người dùng chốt: (1) Huyền Khổ đứng mà chết — mắt nhắm (`kp_hk_chet`) hay mắt mở (`kp_hk_chet_mo`, theo kịch bản); (2) `kp_ac_su` vẽ ĐẦU TRỌC thay mũ tăng như sách (bản mũ vải trông như mũ sắt). Chưa làm: `kp_kda_gia` (ông lão Khiết Đan ch4 — tạm dùng pd_kda), cằm `kp_ac_xau` chưa thu hẹp, khiên `kpshield` + áo cổ tròn/mũ lông cho `kp_tp_dv` (tùy chọn). Bản dập chữ của Trí Quang: chữ khối giả Hán, chưa chắc không trùng chữ thật.

## chars_kp2.js — bảng phụ C4 (CHỜ DUYỆT, vòng 2)
- Bảng phụ cho cảnh mẫu C4 (cầu đá đêm mưa) của tập nhan-vat-kieu-phong. Code `chars_kp2.js`, nạp SAU `chars_kp.js`. Không sửa chars.js / chars_kp.js: id mới tiền tố `kp_` + hàm bọc (chChar, chBody, chHead, chLegs, chLegHeight, chLegPose, chEyeM, chEyeF, chBrowF, chMouth, chTalkMouth, chHand) chỉ chạy khi nhân vật mang cờ `kpView`/`kp2*`/`kpGroup`, nét mặt `kp_he`/`kp_trung`/`kp_dau`, hoặc scene truyền `st.kp*`.
- Bảng duyệt: `channel-example/episodes/nhan-vat-kieu-phong/build/design/nhan-vat-kp-phu-c4.jpg` (dựng lại: `build_board_kp_phu_c4.sh` + `sheet_kp_phu_c4.js`, chạy NGOÀI sandbox). Ảnh thử trong B7 đêm mưa + nv_light +30 %: phòng thử `lab-visual-v2`, variant `kp2_dem` (t 0,5 máy A · 5,5 máy B hook · 8,5 máy C).
- **Kiều Phong nhìn từ sau** (billboard chỉ xoay trục Y nên cần bản vẽ riêng): `kp_tp_bc_lung` (gáy tóc 7 ngọn lởm chởm + 2 lọn bay, búi; lưng áo vá/rách mạng/gấu rách; `legs` 'stand' | 'stance' | 'kneel' = quỳ MỘT gối: gối trái chạm đất + đế giày dựng, gối phải dựng nhô ra ngoài vạt, thân thấp + đầu cúi) · `kp_tp_bc_vai` (qua vai 3/4 sau: gáy, tai phải, gò má + gờ mày + hàm; chóp mày/mi cắt theo viền mặt; `kpArm` null | 'charge' | 'push' (tay chĩa vào trong khung, rút ngắn, mu bàn tay nhỏ ở xa, vai nhô) | 'reach'; `kpDown:1` cả khối đầu cúi 18°) · `kpRim:1` viền sáng lam tóc + vai cho cảnh đêm · đạo cụ `kp2HandVuot(x,y,k,rot,T)`.
- **LUẬT HƯỚNG BĂNG ĐẦU `kp_tp_bc`:** nút + hai đuôi băng luôn ở bên PHẢI nhân vật (chính diện: bên trái người xem; lưng: bên phải người xem; qua vai: sau tai phải, rủ xuống gáy phải). Đuôi bay theo gió ra phía ngoài bên phải đó. Đổi máy trước ↔ sau không được đổi bên.
- **A Châu trên cầu:** `st.kpFold:1` khoanh tay (kp_ac_dct) · `kp_ac_dct_khongmu` (giả ĐCT rơi mũ: tóc giả nam + búi dải chàm) + đạo cụ `kp2Hat(x,y,k,rot)` mũ vua rời (rot ≈ -100 = nằm lăn trên mặt cầu) · `kp_ac_dct_nga` trúng chưởng: lưng chữ C, tay + chân văng về trước, mũ bật khỏi đầu, mặt `kp_trung` (mắt nhắm chặt, miệng hé, không mồ hôi) · `legs:'kp2sit'` + `kpLimp:1` ngồi gục tựa trụ lan can (đổ ~22°, đầu ngả, tay buông ngửa) + `kp2Rail(x,y,k)` đoạn lan can tham chiếu · `kp_ac_cau_troi` + `kpSlide` 0→1: 0 TRÙNG mặt kp_ac_dct_khongmu, mặt nạ tụt từ trán xuống (mép bùn), tóc giả bung ~0,3, 1 = mảng bám mềm; không treo bùn dưới cằm · `kp_ac_cau_m` = kp_ac_cau với mảng bám MỀM (vệt bột thuôn, tránh miệng ≥ 15 px) + môi tái — dùng cho C4 thay kp_ac_cau · `kp_ac_cau_he` + `kp_he` (mày mảnh nhướng đầu trong, mi trên cong võng, mắt nhìn lên có ánh ướt; lòng miệng hồng xám #B89A98, môi #D9BFB8, miệng bầu dục dọc theo `talk`) · `kp_om_cau` NHÓM một billboard: Kiều Phong quỳ, tay ôm luồn sau gáy cô (vẽ sau đầu cô, không che mặt), tay kia trên vai; A Châu ngả ~40° tựa ngực anh; mặt anh mặc định `kp_dau` (mày chau, mắt nhắm, 2 vệt nước mắt dài, môi mím run). Không máu, không mặt "đau hài" (mắt ><, giọt bắn) ở cảnh này.
- **`st.kpWet:1`** (mọi nhân vật, cả bản lưng và nhóm): ướt mưa — áo sẫm ~12 %, tóc bết lọn, vệt nước trên má + giọt ở cằm.


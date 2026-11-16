#!/usr/bin/env python3
# Thêm 20 s màn hình kết thúc (shot kt_end) cho tập dựng bằng khuôn sc_tq_* + render_local (13/11/2026).
# python3 tools/add_end_screen.py <id tập>   (chạy từ channel-example/). Chạy lại nhiều lần không sao.
# Làm: episode.yaml + build/timeline.json thêm shot kt_end; sc_tq_v_end.js (cảnh MC vẫy tay, 2/3 phải trống tối);
#      build/final_audio_full.m4a = final_audio.m4a chuẩn −16 LUFS + 20 s im; build/render_local.py bản full → out/<id>_bio-long.mp4; out/<id>_bio-long.vi.srt
import sys, os, json, re, subprocess, shutil
CH = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); eid = sys.argv[1]; EP = os.path.join(CH, 'episodes', eid); os.chdir(EP)
tl = json.load(open('build/timeline.json'))
if tl['shots'][-1]['id'] != 'kt_end':
    y = open('episode.yaml', encoding='utf-8').read()
    assert 'kt_end' not in y
    shots_pos = y.index('\nshots:'); m = re.search(r'\n[a-z_]+:', y[shots_pos + 7:]); end = shots_pos + 7 + m.start() if m else len(y)
    add = "- id: kt_end\n  chapter: Kết\n  template: custom\n  params:\n    fn: s_kt_end\n    bg: ''\n  lines: []\n  dur: 20\n"
    body = y[:end].rstrip('\n') + '\n' + add; y = body + y[end:] if m else body
    shutil.copy('episode.yaml', 'build/episode.pre_end.yaml'); open('episode.yaml', 'w', encoding='utf-8').write(y)
    shutil.copy('build/timeline.json', 'build/timeline.pre_end.json')
    tl['shots'].append({'id': 'kt_end', 'start': round(tl['total'], 2), 'lines': [], 'chapter': 'Kết', 'dur': 20.0}); tl['total'] = round(tl['total'] + 20, 2)
    json.dump(tl, open('build/timeline.json', 'w'), ensure_ascii=False)
open('sc_tq_v_end.js', 'w', encoding='utf-8').write("// Màn hình kết thúc 20 s: MC vẫy tay bên trái, 2/3 bên phải trống tối để đặt nút Đăng ký + video (skill/references/cau-truc.md). Sinh bởi tools/add_end_screen.py\nEPISODE_SCENES.s_kt_end = (t, ctx) => kFin(xhbg_study(t) + `<rect width=\"1920\" height=\"1080\" fill=\"#1E140C\" opacity=\"0.25\"/>` + mcChar(330, 1130, 0.75, 'tinhbo', t, { pose: Math.floor(t / 4) % 3 === 1 ? 'wave' : 'none' }));\n")
# tiếng: đo rồi chuẩn −16 LUFS (2 lượt), thêm 20 s im
src = 'build/final_audio.m4a'; body = tl['total'] - 20
p = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', src, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
j = json.loads(p.stderr[p.stderr.rindex('{'):p.stderr.rindex('}') + 1])
af = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,apad=whole_dur={tl['total']:.2f}"
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', src, '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', 'build/final_audio_full.m4a'], check=True)
# render_local bản full
r = open('build/render_local.py', encoding='utf-8').read()
if 'full_local_v5' not in r:
    shutil.copy('build/render_local.py', 'build/render_local.pre_full.py')
    r = r.replace("subprocess.run(['sh', 'mkscenes.sh', 'dev', 'main'], cwd=EP, check=True, stdin=subprocess.DEVNULL)", "subprocess.run(['python3', 'build/mkjob.py'], cwd=EP, check=True, stdin=subprocess.DEVNULL)   # ghép cảnh + build/render_dev.json từ episode.yaml + timeline.json (không phụ đề cứng)")
    r = r.replace("'render_cloud.json'", "'render_dev.json'").replace('full_local_v4', 'full_local_v5').replace("'final_audio.m4a'", "'final_audio_full.m4a'").replace('_xem-thu_v4.mp4', '_bio-long.mp4')
    assert 'render_dev.json' in r and 'mkjob.py' in r and '_bio-long.mp4' in r
    open('build/render_local.py', 'w', encoding='utf-8').write(r)
srt = f'build/{eid}.vi.srt'
if os.path.exists(srt): shutil.copy(srt, os.path.join(CH, 'out', f'{eid}_bio-long.vi.srt'))
print('ok', eid, 'total', tl['total'])

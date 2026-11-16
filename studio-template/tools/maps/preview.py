import json, sys
D = json.load(open(sys.argv[1])); out = sys.argv[2]
pal = ['#f6c85f','#6f4e7c','#9dd866','#ca472f','#ffa056','#8dddd0','#e6a0c4','#7aa6e0','#c9b37e','#5fb7a0','#e07a5f','#b8c4e0']
def panel(provs, title, vb, show_isl=True, nb=True):
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str,vb))}" width="540" height="960"><rect x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="#bfe3f2"/>']
    if nb:
        for n in D['neighbors']: s.append(f'<path d="{n["d"]}" fill="#efe9dc" stroke="#b9ae97" stroke-width="2"/>')
        for n in D['neighbors']:
            x,y=n['label']
            if vb[0]<x<vb[0]+vb[2] and vb[1]<y<vb[1]+vb[3]: s.append(f'<text x="{x}" y="{y}" font-size="34" fill="#8a7f6a" font-family="sans-serif" text-anchor="middle">{n["name"]}</text>')
    for i,p in enumerate(provs): s.append(f'<path d="{p["d"]}" fill="{pal[i%len(pal)]}" stroke="#fff" stroke-width="2"/>')
    s.append(f'<path d="{D["outline"]}" fill="none" stroke="#333" stroke-width="3"/>')
    if show_isl:
        for k,v in D['islands'].items():
            for x,y in v['dots']: s.append(f'<circle cx="{x}" cy="{y}" r="5" fill="#c0392b"/>')
            x,y=v['center']; s.append(f'<text x="{x}" y="{y-40}" font-size="34" font-weight="bold" fill="#333" font-family="sans-serif" text-anchor="middle">{v["name"]}</text><text x="{x}" y="{y-5}" font-size="26" fill="#333" font-family="sans-serif" text-anchor="middle">({v["belongs_to"]})</text>')
    s.append(f'<text x="{vb[0]+30}" y="{vb[1]+60}" font-size="52" font-weight="bold" font-family="sans-serif">{title}</text></svg>')
    return ''.join(s)
v = D['meta']['viewbox_vietnam']; vb9 = [v[0], v[1]-50, v[2], round(v[2]*16/9)]
html = '<html><body style="margin:0;display:flex;gap:10px;background:#222">' + panel(D['provinces63'],'63 tỉnh (trước 1/7/2025)',vb9) + panel(D['provinces34'],'34 tỉnh/thành (từ 1/7/2025)',vb9) + panel(D['provinces34'],'Khu vực',D['meta']['viewbox_region']) + '</body></html>'
open(out,'w').write(html)

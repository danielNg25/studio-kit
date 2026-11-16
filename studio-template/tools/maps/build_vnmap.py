# Build studio-template/packs/maps/vietnam/vn-map.json from Free-GIS-Data (34 + 63 tỉnh) + Natural Earth 50m (nước láng giềng)
import json, math, sys
from shapely.geometry import shape, Polygon, MultiPolygon, box
from shapely.ops import unary_union
G, OUT = sys.argv[1], sys.argv[2]
K = math.cos(math.radians(16))
def P(lon, lat): return ((lon - 102.0) * K * 100, (24.0 - lat) * 100)
def proj(geom):
    def ring(r): return [P(x, y) for x, y in r.coords]
    polys = geom.geoms if hasattr(geom, 'geoms') else [geom]
    return MultiPolygon([Polygon(ring(p.exterior), [ring(i) for i in p.interiors]) for p in polys])
def parts(g): return list(g.geoms) if hasattr(g, 'geoms') else [g]
def d_of(geom, tol=0.8, min_area=6.0):
    out = []
    for p in parts(geom):
        if p.area < min_area: continue
        s = p.simplify(tol, preserve_topology=True)
        for r in [s.exterior] + list(s.interiors):
            c = list(r.coords)[:-1]
            if len(c) < 3: continue
            out.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in c) + 'Z')
    return ''.join(out)
def label(geom):
    big = max(parts(geom), key=lambda p: p.area)
    pt = big.representative_point(); return [round(pt.x, 1), round(pt.y, 1)]
OFFSHORE = 110.0   # kinh độ: phần đảo xa bờ của Đà Nẵng (Hoàng Sa) / Khánh Hòa (Trường Sa)

post = json.load(open(f'{G}/post.geojson'))
prov34, islands = [], {}
for f in post['features']:
    pr = f['properties']; g = shape(f['geometry'])
    name, merged = pr['TinhThanh'], pr['SapNhap']
    if pr['Ma'] == '31':   # lỗi dữ liệu gốc: bản ghi mã 31 mang nhãn Lạng Sơn nhưng hình là Đồng Tháp (+ Tiền Giang)
        name, merged = 'Đồng Tháp', 'Đồng Tháp, Tiền Giang'
        pr = {**pr, 'SoXa': None, 'Dtich_km2': None, 'DanSo_ng': None}
    main = [p for p in parts(g) if p.centroid.x < OFFSHORE]
    off = [p for p in parts(g) if p.centroid.x >= OFFSHORE]
    if off:
        key = 'hoang_sa' if name == 'Đà Nẵng' else 'truong_sa'
        dots = [[round(c.x, 1), round(c.y, 1)] for c in (proj(p).centroid for p in off)]
        u = proj(MultiPolygon(off)).centroid
        islands[key] = {'name': 'Quần đảo Hoàng Sa' if key == 'hoang_sa' else 'Quần đảo Trường Sa',
                        'belongs_to': name, 'center': [round(u.x, 1), round(u.y, 1)], 'dots': dots}
    m = proj(MultiPolygon(main))
    prov34.append({'code': pr['Ma'], 'name': name, 'type': pr['Loai'],
                   'merged_from': [s.strip() for s in merged.split(',')],
                   'label': label(m), 'd': d_of(m),
                   'ref_unverified': {'communes': pr['SoXa'], 'area_km2': pr['Dtich_km2'], 'population': pr['DanSo_ng']}})
prov34.sort(key=lambda p: p['code'])

VI63 = {'An Giang':'An Giang','Ba Ria - Vung Tau':'Bà Rịa - Vũng Tàu','Bac Giang':'Bắc Giang','Bac Kan':'Bắc Kạn','Bac Lieu':'Bạc Liêu','Bac Ninh':'Bắc Ninh','Ben Tre':'Bến Tre','Binh Dinh':'Bình Định','Binh Duong':'Bình Dương','Binh Phuoc':'Bình Phước','Binh Thuan':'Bình Thuận','Ca Mau':'Cà Mau','Can Tho city':'Cần Thơ','Cao Bang':'Cao Bằng','Dak Lak':'Đắk Lắk','Dak Nong':'Đắk Nông','Dien Bien':'Điện Biên','Dong Nai':'Đồng Nai','Dong Thap':'Đồng Tháp','Gia Lai':'Gia Lai','Ha Giang':'Hà Giang','Ha Nam':'Hà Nam','Ha Noi city':'Hà Nội','Ha Tinh':'Hà Tĩnh','Hai Duong':'Hải Dương','Hai Phong city':'Hải Phòng','Hau Giang':'Hậu Giang','Hoa Binh':'Hòa Bình','Hung Yen':'Hưng Yên','Kien Giang':'Kiên Giang','Kon Tum':'Kon Tum','Lai Chau':'Lai Châu','Lam Dong':'Lâm Đồng','Lang Son':'Lạng Sơn','Lao Cai':'Lào Cai','Long An':'Long An','Nam Dinh':'Nam Định','Nghe An':'Nghệ An','Ninh Binh':'Ninh Bình','Ninh Thuan':'Ninh Thuận','Phu Tho':'Phú Thọ','Phu Yen':'Phú Yên','Quang Binh':'Quảng Bình','Quang Nam':'Quảng Nam','Quang Ngai':'Quảng Ngãi','Quang Ninh':'Quảng Ninh','Quang Tri':'Quảng Trị','Soc Trang':'Sóc Trăng','Son La':'Sơn La','Tay Ninh':'Tây Ninh','Thai Binh':'Thái Bình','Thai Nguyen':'Thái Nguyên','Thanh Hoa':'Thanh Hóa','Thua Thien - Hue':'Thừa Thiên Huế','Tien Giang':'Tiền Giang','Ho Chi Minh city':'TP. Hồ Chí Minh','Tra Vinh':'Trà Vinh','Tuyen Quang':'Tuyên Quang','Vinh Long':'Vĩnh Long','Vinh Phuc':'Vĩnh Phúc','Yen Bai':'Yên Bái','Khanh Hoa':'Khánh Hòa','Da Nang city':'Đà Nẵng'}
pre = json.load(open(f'{G}/pre.geojson'))
prov63 = []
for f in pre['features']:
    if f['properties'].get('Note'): continue          # Hoàng Sa / Trường Sa → đã có trong islands
    g = proj(shape(f['geometry']))
    g = MultiPolygon([p for p in parts(g) if p.centroid.x / 100 / K + 102 < OFFSHORE])
    prov63.append({'name': VI63[f['properties']['Name']], 'label': label(g), 'd': d_of(g)})
prov63.sort(key=lambda p: p['name'])

vn_main = unary_union([proj(MultiPolygon([p for p in parts(shape(f['geometry'])) if p.centroid.x < OFFSHORE])).buffer(0)
                       for f in post['features']])
outline = d_of(vn_main.buffer(0.6).buffer(-0.6), tol=1.0, min_area=20)

NE = json.load(open(f'{G}/ne50.geojson'))
VI = {'CHN':'Trung Quốc','LAO':'Lào','KHM':'Campuchia','THA':'Thái Lan','MMR':'Myanmar','PHL':'Philippines','MYS':'Malaysia','BRN':'Brunei','IDN':'Indonesia','TWN':'Đài Loan'}
CLIP = box(92, 0, 125, 28); SEA = box(109.3, 3.5, 118.5, 21.6)
neighbors = []
for f in NE['features']:
    iso = f['properties']['ISO_A3']
    if iso not in VI: continue
    g = shape(f['geometry']).intersection(CLIP)
    keep = [p for p in parts(g) if isinstance(p, Polygon) and not (SEA.contains(p.centroid) and p.area < 0.05)]
    if not keep: continue
    m = proj(MultiPolygon(keep))
    neighbors.append({'iso': iso, 'name': VI[iso], 'label': label(m), 'd': d_of(m, tol=1.5, min_area=30)})

x0, y0 = P(92, 28); x1, y1 = P(125, 0)
vx0, vy0 = P(102.0, 23.6); vx1, vy1 = P(118.2, 7.0)
data = {'meta': {
    'projection': 'equirectangular: x = (lon-102)*cos16°*100, y = (24-lat)*100  (1 đơn vị ≈ 1.1 km)',
    'viewbox_vietnam': [round(vx0), round(vy0), round(vx1 - vx0), round(vy1 - vy0)],
    'viewbox_region': [round(x0), round(y0), round(x1 - x0), round(y1 - y0)],
    'sources': ['Nguyễn Duy Liêm (2025). Dữ liệu GIS Việt Nam. https://github.com/nguyenduy1133/Free-GIS-Data',
                'Natural Earth 1:50m admin 0 (public domain). https://www.naturalearthdata.com'],
    'fixes': ['mã 31: dữ liệu gốc ghi nhầm Lạng Sơn → Đồng Tháp (Đồng Tháp + Tiền Giang); số liệu đi kèm bị xoá'],
    'note': 'ref_unverified = số liệu đi kèm dữ liệu GIS, CHƯA kiểm chứng — không đưa lên video nếu chưa đối chiếu nguồn chính thức'},
  'outline': outline, 'provinces34': prov34, 'provinces63': prov63, 'islands': islands, 'neighbors': neighbors}
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('ok', len(prov34), len(prov63), list(islands), [n['iso'] for n in neighbors])

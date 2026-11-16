#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_world.py — Dựng gói bản đồ THẾ GIỚI (maps_world) cho studio shorts-claude.

Nguồn: Natural Earth (public domain), repo nvkelso/natural-earth-vector (master/geojson).
  - Quốc gia: ne_10m_admin_0_countries_vnm.geojson  (POV Việt Nam — Hoàng Sa, Trường Sa
    thuộc VNM; Kosovo gộp Serbia; Somaliland gộp Somalia; Bắc Síp gộp Síp),
    tự đơn giản hoá xuống 2 mức "110m" và "50m" bằng mapshaper.
  - Sông: ne_50m_rivers_lake_centerlines (+ Chao Phraya từ 10m)
  - Hồ: ne_50m_lakes
  - Thành phố: ne_10m_populated_places (thủ đô + đô thị > 2 triệu dân)
  - Đảo nhỏ: ne_10m_minor_islands (chấm đảo Hoàng Sa/Trường Sa)
  - Nhãn biển/eo biển: bảng tự soạn (tiếng Việt) ở cuối file.

Cách chạy (cần python3 + shapely, node + npm):
  cd tools_maps && npm i            (package.json ghim phiên bản: mapshaper 0.7.81, d3-geo 3.1.1, d3-geo-projection 4.0.0, topojson-client 3.1.0)
  python3 build_world.py              (mặc định --out ../maps_world --node-dir . --src ./ne_cache)
  python3 shoot_preview.py            (chụp preview_world.png, preview_sea.png)

Kết quả: maps_world/world-110m.json|.js, world-50m.json|.js (TopoJSON, lon/lat, chưa chiếu),
         maps_world/vendor/* (nếu có node_modules), kiểm tra pháp lý tự động (assert).
"""
import argparse, json, math, os, re, shutil, subprocess, sys, urllib.request
from shapely.geometry import shape, mapping, box, Point, MultiPolygon, Polygon

NE_RAW = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"
SOURCES = [
    "ne_10m_admin_0_countries_vnm",
    "ne_50m_rivers_lake_centerlines",
    "ne_10m_rivers_lake_centerlines",
    "ne_50m_lakes",
    "ne_10m_populated_places",
    "ne_10m_minor_islands",
]

# Vùng 2 quần đảo (dùng để gom chấm đảo và để KIỂM TRA không nước nào khác có đảo ở đây)
PARACEL_BOX = box(111.0, 15.6, 113.0, 17.2)          # Hoàng Sa
SPRATLY_BOX = box(111.4, 7.0, 116.2, 11.9)            # Trường Sa (lõi; tránh Palawan/Sabah)

# ---------------------------------------------------------------- tên nước tiếng Việt
# name_vi = tên ngắn thông dụng trên báo chí VN (dùng làm nhãn bản đồ).
# NE có sẵn NAME_VI (giữ làm name_vi_full); bảng dưới ghi đè những tên quá dài/khác cách gọi phổ biến.
NAME_VI_SHORT = {
    "USA": "Mỹ", "GBR": "Anh", "PRK": "Triều Tiên", "KOR": "Hàn Quốc", "ARE": "UAE",
    "CZE": "Séc", "ZAF": "Nam Phi", "IRL": "Ireland", "CYP": "Síp", "COG": "Congo",
    "COD": "CHDC Congo", "CAF": "Trung Phi", "DOM": "CH Dominica", "MMR": "Myanmar",
    "TUN": "Tunisia", "BRA": "Brazil", "GIN": "Guinea", "SEN": "Senegal", "BEN": "Benin",
    "DZA": "Algeria", "MRT": "Mauritania", "MEX": "Mexico", "TCD": "Chad",
    "GNB": "Guinea-Bissau", "ATA": "Nam Cực", "SAU": "Ả Rập Xê Út", "ITA": "Italy",
    "AUS": "Australia", "UKR": "Ukraine", "BIH": "Bosnia và Herzegovina",
    "TLS": "Timor-Leste", "VAT": "Vatican", "ESB": "Dhekelia (Anh)", "WSB": "Akrotiri (Anh)",
    "USG": "Vịnh Guantánamo (Mỹ)", "BRI": "Đảo Brazilian", "BRT": "Bir Tawil",
    "ATF": "Lãnh thổ phía Nam thuộc Pháp", "UMI": "Các đảo xa của Mỹ",
    "HMD": "Đảo Heard và McDonald", "SGS": "Nam Georgia và Nam Sandwich",
    "IOA": "Đảo Christmas, Cocos (Úc)", "IOT": "Lãnh thổ Ấn Độ Dương thuộc Anh",
    "CSI": "QĐ Biển San Hô (Úc)", "ATC": "QĐ Ashmore và Cartier (Úc)",
    "CLP": "Đảo Clipperton (Pháp)", "SCR": "Bãi cạn Scarborough",
    "PYF": "Polynesia thuộc Pháp", "NCL": "New Caledonia", "GEO": "Gruzia",
    "SWZ": "Eswatini", "SDS": "Nam Sudan", "MAR": "Maroc", "SAH": "Tây Sahara",
    "PSX": "Palestine", "TWN": "Đài Loan", "HKG": "Hồng Kông", "MAC": "Ma Cao",
    "LBN": "Liban", "ALD": "Åland", "TCA": "QĐ Turks và Caicos", "VCT": "Saint Vincent và Grenadines",
    "VIR": "QĐ Virgin (Mỹ)", "VGB": "QĐ Virgin (Anh)", "FLK": "QĐ Falkland (Malvinas)",
    "FRO": "QĐ Faroe", "MNP": "QĐ Bắc Mariana", "ASM": "Samoa thuộc Mỹ",
    "SPM": "Saint-Pierre và Miquelon", "WLF": "Wallis và Futuna", "PCN": "QĐ Pitcairn",
    "SLB": "QĐ Solomon", "MHL": "QĐ Marshall", "COK": "QĐ Cook", "CYM": "QĐ Cayman",
    "STP": "São Tomé và Príncipe", "ANT": "Antigua và Barbuda", "ATG": "Antigua và Barbuda",
    "KNA": "Saint Kitts và Nevis", "TTO": "Trinidad và Tobago", "CIV": "Bờ Biển Ngà",
    "GNQ": "Guinea Xích Đạo", "IMN": "Đảo Man", "NFK": "Đảo Norfolk",
}
NAME_VI_ALT = {"USA": "Hoa Kỳ", "ITA": "Ý", "AUS": "Úc", "UKR": "Ukraina", "TLS": "Đông Timor",
               "BRA": "Brasil", "MMR": "Myanma", "PRK": "CHDCND Triều Tiên", "GBR": "Vương quốc Anh",
               "ARE": "Các Tiểu vương quốc Ả Rập Thống nhất", "SAU": "Saudi Arabia", "COD": "Cộng hòa Dân chủ Congo"}
CONTINENT_VI = {"Asia": "Châu Á", "Europe": "Châu Âu", "Africa": "Châu Phi", "North America": "Bắc Mỹ",
                "South America": "Nam Mỹ", "Oceania": "Châu Đại Dương", "Antarctica": "Châu Nam Cực",
                "Seven seas (open ocean)": "Đảo đại dương"}

# ---------------------------------------------------------------- sông
RIVER_VI = {
    "Mekong": "Sông Mê Kông", "Lancang": "Sông Mê Kông", "Hong": "Sông Hồng",
    "Chang Jiang": "Sông Dương Tử", "Jinsha": "Sông Dương Tử (Kim Sa)", "Huang": "Hoàng Hà",
    "Nile": "Sông Nin", "Albert Nile": "Sông Nin", "Victoria Nile": "Sông Nin",
    "White Nile": "Sông Nin Trắng", "Blue Nile": "Sông Nin Xanh",
    "Damietta Branch": "Sông Nin", "Rosetta Branch": "Sông Nin",
    "Indus": "Sông Ấn", "Ganges": "Sông Hằng", "Brahmaputra": "Sông Brahmaputra",
    "Yarlung": "Sông Brahmaputra (Yarlung Tsangpo)", "Dihang": "Sông Brahmaputra",
    "Ayeyarwady": "Sông Irrawaddy", "Irrawaddy Delta": "Sông Irrawaddy",
    "Salween": "Sông Salween", "Nu": "Sông Salween (Nộ Giang)", "Xi": "Tây Giang",
    "Chao Phraya": "Sông Chao Phraya", "Amur": "Sông Amur (Hắc Long Giang)",
    "Songhua": "Sông Tùng Hoa", "Volga": "Sông Volga", "Danube": "Sông Danube",
    "Rhine": "Sông Rhine", "Dnieper": "Sông Dnepr", "Dnipro": "Sông Dnepr", "Don": "Sông Don",
    "Tigris": "Sông Tigris", "Euphrates": "Sông Euphrates", "Jordan": "Sông Jordan",
    "Amazonas": "Sông Amazon", "Amazon": "Sông Amazon", "Mississippi": "Sông Mississippi",
    "Missouri": "Sông Missouri", "Congo": "Sông Congo", "Niger": "Sông Niger",
    "Zambezi": "Sông Zambezi", "Ob": "Sông Ob", "Yenisey": "Sông Yenisei", "Yenisei": "Sông Yenisei",
    "Lena": "Sông Lena", "Syr Darya": "Sông Syr Darya", "Amu  Darya": "Sông Amu Darya",
    "Amu Darya": "Sông Amu Darya", "Orinoco": "Sông Orinoco", "Paraná": "Sông Paraná",
    "Parana": "Sông Paraná", "Yukon": "Sông Yukon", "Mackenzie": "Sông Mackenzie",
    "Colorado": "Sông Colorado", "St. Lawrence": "Sông St. Lawrence", "Ural": "Sông Ural",
    "Irtysh": "Sông Irtysh", "Elbe": "Sông Elbe", "Vistula": "Sông Vistula", "Oder": "Sông Oder",
    "Loire": "Sông Loire", "Seine": "Sông Seine", "Thames": "Sông Thames", "Rio Grande": "Sông Rio Grande",
    "Murray": "Sông Murray", "Darling": "Sông Darling", "Orange": "Sông Orange", "Limpopo": "Sông Limpopo",
    "Senegal": "Sông Sénégal", "Kolyma": "Sông Kolyma", "Indigirka": "Sông Indigirka",
    "Dniester": "Sông Dniester", "Kama": "Sông Kama", "Helmand": "Sông Helmand", "Sutlej": "Sông Sutlej",
    "Yamuna": "Sông Yamuna", "Godavari": "Sông Godavari", "Krishna": "Sông Krishna",
}
# sông bắt buộc giữ ở bản 110m (nhẹ)
RIVER_MAJOR = {"Sông Mê Kông", "Sông Hồng", "Sông Dương Tử", "Sông Dương Tử (Kim Sa)", "Hoàng Hà", "Sông Nin",
               "Sông Nin Trắng", "Sông Nin Xanh", "Sông Ấn", "Sông Hằng", "Sông Brahmaputra",
               "Sông Brahmaputra (Yarlung Tsangpo)", "Sông Irrawaddy", "Sông Salween",
               "Sông Salween (Nộ Giang)", "Sông Amur (Hắc Long Giang)", "Sông Volga", "Sông Danube",
               "Sông Rhine", "Sông Dnepr", "Sông Tigris", "Sông Euphrates", "Sông Amazon", "Sông Mississippi",
               "Sông Congo", "Sông Niger", "Sông Zambezi", "Sông Ob", "Sông Yenisei", "Sông Lena",
               "Sông Chao Phraya", "Sông Jordan", "Tây Giang", "Sông Don", "Sông Syr Darya", "Sông Amu Darya"}

LAKE_VI = {"Lake Superior": "Hồ Superior", "Great Bear Lake": "Hồ Gấu Lớn", "Great Slave Lake": "Hồ Nô Lệ Lớn",
           "Tonle Sap": "Biển Hồ (Tonlé Sap)", "Tonlé Sap": "Biển Hồ (Tonlé Sap)", "Aral Sea": "Biển Aral",
           "North Aral Sea": "Biển Aral", "Qinghai Hu": "Hồ Thanh Hải", "Qinghai": "Hồ Thanh Hải",
           "Dongting Hu": "Hồ Động Đình", "Poyang Hu": "Hồ Bà Dương", "Tai Hu": "Thái Hồ", "Dead Sea": "Biển Chết",
           "Sea of Galilee": "Biển hồ Galilee", "Lago Titicaca": "Hồ Titicaca", "Lago de Nicaragua": "Hồ Nicaragua",
           "Lake Chad": "Hồ Chad", "Issyk-Kul": "Hồ Issyk-Kul", "Vänern": "Hồ Vänern"}

# ---------------------------------------------------------------- thành phố: ghi đè tên Việt
CITY_VI = {
    "Ho Chi Minh City": "TP. Hồ Chí Minh", "Hanoi": "Hà Nội", "Haiphong": "Hải Phòng", "Da Nang": "Đà Nẵng",
    "Can Tho": "Cần Thơ", "Changsha": "Changsha",  # tránh trùng tên "Trường Sa" với quần đảo
    "New York": "New York", "Washington, D.C.": "Washington", "Taipei": "Đài Bắc",
    "Moscow": "Moskva", "Bangkok": "Bangkok", "Vientiane": "Viêng Chăn", "Phnom Penh": "Phnôm Pênh",
    "Pyongyang": "Bình Nhưỡng", "Seoul": "Seoul", "Tokyo": "Tokyo", "Beijing": "Bắc Kinh",
    "Shanghai": "Thượng Hải", "Hong Kong": "Hồng Kông", "Macau": "Ma Cao", "London": "Luân Đôn",
    "Paris": "Paris", "Yangon": "Yangon", "Naypyidaw": "Naypyidaw", "Singapore": "Singapore",
    "Kuala Lumpur": "Kuala Lumpur", "Jakarta": "Jakarta", "Manila": "Manila", "New Delhi": "New Delhi",
    "Kyiv": "Kiev", "Kiev": "Kiev", "Warsaw": "Warszawa", "Vienna": "Viên", "Rome": "Roma",
    "Athens": "Athens", "Lisbon": "Lisboa", "Brussels": "Brussels", "Copenhagen": "Copenhagen",
    "Prague": "Praha", "Geneva": "Genève", "Cairo": "Cairo", "Tehran": "Tehran", "Baghdad": "Baghdad",
    "Riyadh": "Riyadh", "Jerusalem": "Jerusalem", "Tel Aviv-Yafo": "Tel Aviv", "Istanbul": "Istanbul",
    "Ankara": "Ankara", "Mexico City": "Thành phố Mexico", "Kuwait": "Thành phố Kuwait",
    "Damascus": "Damascus", "St.  Petersburg": "St. Petersburg", "St. Petersburg": "St. Petersburg",
    "Algiers": "Alger", "Nur-Sultan": "Astana", "Astana": "Astana", "The Hague": "La Hay",
    "Vatican City": "Vatican", "Ōsaka": "Osaka", "Osaka": "Osaka", "Kyoto": "Kyoto", "Santiago": "Santiago",
    "Brasília": "Brasília", "Bucharest": "Bucharest", "Sanaa": "Sanaa",
}
# thủ đô không coi là "thủ đô quốc gia" theo lập trường VN (giữ điểm, bỏ cờ cap)
CITY_NOT_CAPITAL = {"Taipei", "Pristina", "Hargeisa", "North Nicosia", "Jerusalem", "Laayoune", "Bir Lehlou"}

# ---------------------------------------------------------------- nhãn biển / eo biển (tiếng Việt)
# kind: ocean | sea | gulf | strait | canal ; rank 1 (luôn hiện) → 3 (chỉ khi zoom gần)
SEAS = [
    ("pacific_e", "Thái Bình Dương", "Pacific Ocean", "ocean", 1, 165, 22),
    ("pacific_w", "Thái Bình Dương", "Pacific Ocean", "ocean", 1, -140, 5),
    ("atlantic_n", "Đại Tây Dương", "Atlantic Ocean", "ocean", 1, -42, 30),
    ("atlantic_s", "Đại Tây Dương", "Atlantic Ocean", "ocean", 1, -18, -25),
    ("indian", "Ấn Độ Dương", "Indian Ocean", "ocean", 1, 80, -20),
    ("arctic", "Bắc Băng Dương", "Arctic Ocean", "ocean", 1, 0, 84),
    ("southern", "Nam Đại Dương", "Southern Ocean", "ocean", 1, 60, -58),
    ("bien_dong", "Biển Đông", "Bien Dong (East Sea of Viet Nam)", "sea", 1, 113.6, 13.6),
    ("vinh_bac_bo", "Vịnh Bắc Bộ", "Gulf of Tonkin", "gulf", 2, 107.6, 20.2),
    ("vinh_thai_lan", "Vịnh Thái Lan", "Gulf of Thailand", "gulf", 2, 101.6, 9.6),
    ("hoa_dong", "Biển Hoa Đông", "East China Sea", "sea", 2, 126.0, 29.0),
    ("hoang_hai", "Hoàng Hải", "Yellow Sea", "sea", 2, 123.5, 35.8),
    ("nhat_ban", "Biển Nhật Bản", "Sea of Japan", "sea", 2, 135.0, 40.5),
    ("philippines", "Biển Philippines", "Philippine Sea", "sea", 2, 131.0, 19.0),
    ("sulu", "Biển Sulu", "Sulu Sea", "sea", 3, 120.3, 8.6),
    ("celebes", "Biển Celebes", "Celebes Sea", "sea", 3, 122.5, 4.0),
    ("java", "Biển Java", "Java Sea", "sea", 2, 111.0, -5.0),
    ("banda", "Biển Banda", "Banda Sea", "sea", 3, 127.5, -5.5),
    ("arafura", "Biển Arafura", "Arafura Sea", "sea", 3, 135.5, -9.5),
    ("timor", "Biển Timor", "Timor Sea", "sea", 3, 127.0, -11.5),
    ("san_ho", "Biển San Hô", "Coral Sea", "sea", 2, 155.0, -17.0),
    ("tasman", "Biển Tasman", "Tasman Sea", "sea", 2, 160.0, -38.0),
    ("andaman", "Biển Andaman", "Andaman Sea", "sea", 2, 96.0, 11.0),
    ("bengal", "Vịnh Bengal", "Bay of Bengal", "gulf", 2, 88.5, 15.0),
    ("a_rap", "Biển Ả Rập", "Arabian Sea", "sea", 2, 64.0, 15.0),
    ("vinh_oman", "Vịnh Oman", "Gulf of Oman", "gulf", 3, 58.8, 24.6),
    ("ba_tu", "Vịnh Ba Tư", "Persian Gulf", "gulf", 2, 51.4, 27.0),
    ("bien_do", "Biển Đỏ", "Red Sea", "sea", 2, 38.6, 20.0),
    ("vinh_aden", "Vịnh Aden", "Gulf of Aden", "gulf", 3, 48.0, 12.6),
    ("dia_trung_hai", "Địa Trung Hải", "Mediterranean Sea", "sea", 1, 18.0, 34.5),
    ("aegea", "Biển Aegea", "Aegean Sea", "sea", 3, 25.0, 38.6),
    ("bien_den", "Biển Đen", "Black Sea", "sea", 2, 34.0, 43.3),
    ("azov", "Biển Azov", "Sea of Azov", "sea", 3, 36.6, 46.1),
    ("caspi", "Biển Caspi", "Caspian Sea", "sea", 2, 50.6, 42.0),
    ("baltic", "Biển Baltic", "Baltic Sea", "sea", 2, 19.5, 57.0),
    ("bien_bac", "Biển Bắc", "North Sea", "sea", 2, 3.0, 56.0),
    ("barents", "Biển Barents", "Barents Sea", "sea", 2, 40.0, 73.0),
    ("okhotsk", "Biển Okhotsk", "Sea of Okhotsk", "sea", 2, 150.0, 54.0),
    ("bering", "Biển Bering", "Bering Sea", "sea", 2, -178.0, 58.0),
    ("caribe", "Biển Caribe", "Caribbean Sea", "sea", 2, -75.0, 15.0),
    ("vinh_mexico", "Vịnh Mexico", "Gulf of Mexico", "gulf", 2, -90.0, 25.0),
    # eo biển / kênh đào
    ("malacca", "Eo biển Malacca", "Strait of Malacca", "strait", 1, 99.7, 3.9),
    ("singapore", "Eo biển Singapore", "Singapore Strait", "strait", 3, 104.0, 1.2),
    ("hormuz", "Eo biển Hormuz", "Strait of Hormuz", "strait", 1, 56.45, 26.55),
    ("dai_loan", "Eo biển Đài Loan", "Taiwan Strait", "strait", 1, 119.2, 23.7),
    ("luzon", "Eo biển Luzon", "Luzon Strait", "strait", 2, 121.0, 20.6),
    ("trieu_tien", "Eo biển Triều Tiên", "Korea Strait", "strait", 2, 129.0, 34.4),
    ("bosphorus", "Eo biển Bosphorus", "Bosphorus", "strait", 1, 29.05, 41.12),
    ("dardanelles", "Eo biển Dardanelles", "Dardanelles", "strait", 2, 26.4, 40.2),
    ("kerch", "Eo biển Kerch", "Kerch Strait", "strait", 2, 36.55, 45.3),
    ("bab_el_mandeb", "Eo biển Bab-el-Mandeb", "Bab-el-Mandeb", "strait", 1, 43.4, 12.6),
    ("suez", "Kênh đào Suez", "Suez Canal", "canal", 1, 32.35, 30.6),
    ("panama", "Kênh đào Panama", "Panama Canal", "canal", 1, -79.7, 9.1),
    ("gibraltar", "Eo biển Gibraltar", "Strait of Gibraltar", "strait", 1, -5.6, 35.95),
    ("manche", "Eo biển Manche", "English Channel", "strait", 2, -1.0, 50.2),
    ("sunda", "Eo biển Sunda", "Sunda Strait", "strait", 3, 105.8, -6.0),
    ("lombok", "Eo biển Lombok", "Lombok Strait", "strait", 3, 115.7, -8.6),
    ("bering_strait", "Eo biển Bering", "Bering Strait", "strait", 2, -169.0, 65.8),
    ("drake", "Eo biển Drake", "Drake Passage", "strait", 3, -65.0, -58.0),
]

# ---------------------------------------------------------------- đảo chính của 2 quần đảo (toạ độ gần đúng, ±2 km)
VN_NAMED_ISLANDS = [
    # Hoàng Sa
    ("hoang_sa", "Đảo Hoàng Sa", 16.533, 111.608), ("hoang_sa", "Đảo Hữu Nhật", 16.507, 111.578),
    ("hoang_sa", "Đảo Quang Ảnh", 16.450, 111.507), ("hoang_sa", "Đảo Quang Hòa", 16.450, 111.712),
    ("hoang_sa", "Đảo Duy Mộng", 16.466, 111.740), ("hoang_sa", "Đảo Tri Tôn", 15.783, 111.205),
    ("hoang_sa", "Đảo Phú Lâm", 16.834, 112.339), ("hoang_sa", "Đảo Cây", 16.980, 112.265),
    ("hoang_sa", "Đảo Linh Côn", 16.667, 112.733), ("hoang_sa", "Đảo Bạch Quy", 16.056, 111.764),
    # Trường Sa
    ("truong_sa", "Đảo Song Tử Tây", 11.430, 114.330), ("truong_sa", "Đảo Song Tử Đông", 11.453, 114.356),
    ("truong_sa", "Đảo Thị Tứ", 11.055, 114.284), ("truong_sa", "Đảo Loại Ta", 10.680, 114.420),
    ("truong_sa", "Đảo Ba Bình", 10.377, 114.365), ("truong_sa", "Đảo Sơn Ca", 10.378, 114.479),
    ("truong_sa", "Đảo Nam Yết", 10.180, 114.362), ("truong_sa", "Đảo Sinh Tồn", 9.885, 114.329),
    ("truong_sa", "Đảo Sinh Tồn Đông", 9.890, 114.558), ("truong_sa", "Đảo Trường Sa", 8.645, 111.919),
    ("truong_sa", "Đảo Trường Sa Đông", 8.930, 112.350), ("truong_sa", "Đảo An Bang", 7.867, 112.917),
    ("truong_sa", "Đảo Phan Vinh", 8.957, 113.690), ("truong_sa", "Đảo Bình Nguyên", 10.810, 115.830),
    ("truong_sa", "Đảo Vĩnh Viễn", 10.730, 115.800), ("truong_sa", "Đảo Bến Lạc", 11.080, 115.020),
]
VN_GROUPS = {
    "hoang_sa": dict(name_vi="Quần đảo Hoàng Sa", label_vi="QĐ. Hoàng Sa", name_en="Hoang Sa Archipelago",
                     admin_vi="Đặc khu Hoàng Sa, TP. Đà Nẵng", center=(111.95, 16.45)),
    "truong_sa": dict(name_vi="Quần đảo Trường Sa", label_vi="QĐ. Trường Sa", name_en="Truong Sa Archipelago",
                      admin_vi="Đặc khu Trường Sa, tỉnh Khánh Hòa", center=(113.9, 9.8)),
}


def km2(geom):
    """diện tích xấp xỉ (km²) cho polygon lon/lat."""
    c = geom.representative_point()
    return geom.area * (111.32 ** 2) * math.cos(math.radians(c.y))


def r(x, n=4):
    return round(x, n)


def load(src, name):
    p = os.path.join(src, name + ".geojson")
    if not os.path.exists(p):
        print("  tải", name)
        urllib.request.urlretrieve(NE_RAW + name + ".geojson", p)
    with open(p, encoding="utf-8") as f:
        return json.load(f)["features"]


def in_vn_archipelago(g):
    pt = g.representative_point()
    return PARACEL_BOX.contains(pt) or SPRATLY_BOX.contains(pt)


# ================================================================= countries
def build_countries(src, min_km2):
    feats = load(src, "ne_10m_admin_0_countries_vnm")
    adm_by_admin = {f["properties"]["ADMIN"]: f["properties"]["ADM0_A3"] for f in feats}
    out = []
    for f in feats:
        p = f["properties"]
        iso = p["ISO_A3"]
        if iso == "-99":   # FRA, NOR có ISO_A3=-99 nhưng ISO_A3_EH đúng; vùng lẻ (CLP, BRI, IOA…) dùng ADM0_A3
            iso = p["ISO_A3_EH"] if p["ISO_A3_EH"] == p["ADM0_A3"] else p["ADM0_A3"]
        g = shape(f["geometry"])
        parts = list(getattr(g, "geoms", [g]))
        largest = max(parts, key=lambda q: q.area)
        keep = []
        for q in parts:
            if p["ADM0_A3"] != "VNM" and in_vn_archipelago(q):
                # an toàn pháp lý: không nước nào khác được có đảo trong 2 quần đảo
                print("  !! bỏ đảo của", p["ADM0_A3"], "trong vùng Hoàng Sa/Trường Sa", q.representative_point())
                continue
            thr = min(min_km2, 50) if p["ADM0_A3"] == "VNM" else min_km2   # giữ Phú Quốc, Côn Đảo... ở mọi mức
            if q is largest or km2(q) >= thr or (p["ADM0_A3"] == "VNM" and in_vn_archipelago(q)):
                keep.append(q)
        geom = keep[0] if len(keep) == 1 else MultiPolygon(keep)
        adm = p["ADM0_A3"]
        name_vi = NAME_VI_SHORT.get(adm) or p["NAME_VI"] or p["NAME"]
        sov = adm_by_admin.get(p["SOVEREIGNT"], adm)
        props = dict(
            iso_a3=iso, adm0_a3=adm if adm != iso else None,
            name_vi=name_vi, name_vi_full=p["NAME_VI"] or name_vi, name_en=p["NAME"],
            name_vi_alt=NAME_VI_ALT.get(adm),
            continent=p["CONTINENT"],
            subregion=p["SUBREGION"], type=p["TYPE"], sov=sov if sov != adm else None,
            label=[r(p["LABEL_X"], 3), r(p["LABEL_Y"], 3)],
            pop_est=int(p["POP_EST"]) if p["POP_EST"] else None, pop_year=p["POP_YEAR"],
            gdp_md=int(p["GDP_MD"]) if p["GDP_MD"] else None, gdp_year=p["GDP_YEAR"],
            color7=p["MAPCOLOR7"],
        )
        if adm == "TWN":
            props["vn_policy"] = "Việt Nam theo chính sách một Trung Quốc; tuỳ kịch bản ghi 'Đài Loan (Trung Quốc)'."
        if adm in ("HKG", "MAC"):
            props["vn_policy"] = "Đặc khu hành chính của Trung Quốc."
        props = {k: v for k, v in props.items() if v is not None}
        out.append(dict(type="Feature", properties=props, geometry=mapping(geom)))
    isos = [f["properties"]["iso_a3"] for f in out]
    assert len(isos) == len(set(isos)), "iso_a3 trùng"
    return out


# ================================================================= vn_islands
def build_vn_islands(src):
    pts = []  # (group, lon, lat, name, source)
    for f in load(src, "ne_10m_admin_0_countries_vnm"):
        if f["properties"]["ADM0_A3"] != "VNM":
            continue
        g = shape(f["geometry"])
        for q in getattr(g, "geoms", [g]):
            if in_vn_archipelago(q):
                c = q.representative_point()
                grp = "hoang_sa" if PARACEL_BOX.contains(c) else "truong_sa"
                pts.append((grp, c.x, c.y, None, "ne_10m_admin_0_countries_vnm"))
    for f in load(src, "ne_10m_minor_islands"):
        g = shape(f["geometry"])
        c = g.representative_point()
        if PARACEL_BOX.contains(c) or SPRATLY_BOX.contains(c):
            grp = "hoang_sa" if PARACEL_BOX.contains(c) else "truong_sa"
            pts.append((grp, c.x, c.y, None, "ne_10m_minor_islands"))
    named = [(g, lon, lat, n, "curated") for (g, n, lat, lon) in VN_NAMED_ISLANDS]
    # gộp chấm trùng (< ~3 km), ưu tiên chấm có tên
    final = list(named)
    for p in pts:
        if all(math.hypot(p[1] - q[1], p[2] - q[2]) > 0.027 for q in final):
            final.append(p)
    feats = []
    for key, gdef in VN_GROUPS.items():
        feats.append(dict(type="Feature", geometry=dict(type="Point", coordinates=[r(gdef["center"][0], 3), r(gdef["center"][1], 3)]),
                          properties=dict(kind="group", group=key, name_vi=gdef["name_vi"], label_vi=gdef["label_vi"],
                                          name_en=gdef["name_en"], admin_vi=gdef["admin_vi"], belongs_to="Việt Nam",
                                          belongs_iso="VNM")))
    for (grp, lon, lat, name, srcname) in final:
        pr = dict(kind="island", group=grp, belongs_to="Việt Nam", belongs_iso="VNM", src=srcname)
        if name:
            pr["name_vi"] = name
        feats.append(dict(type="Feature", geometry=dict(type="Point", coordinates=[r(lon, 3), r(lat, 3)]), properties=pr))
    return feats


# ================================================================= rivers / lakes
def build_rivers(src, major_only):
    out = []
    feats = load(src, "ne_50m_rivers_lake_centerlines")
    extra = [f for f in load(src, "ne_10m_rivers_lake_centerlines") if f["properties"].get("name") == "Chao Phraya"]
    for f in feats + extra:
        p = f["properties"]
        n = p.get("name")
        g = shape(f["geometry"])
        if not n:
            # đoạn hạ lưu Mê Kông không tên trong NE 50m (≈ 105.9–106.7°E, 9.9–10.3°N)
            if box(105.5, 9.5, 107, 10.6).contains(g.centroid):
                n = "Mekong"
            else:
                continue
        nvi = RIVER_VI.get(n)
        if major_only and nvi not in RIVER_MAJOR:
            continue
        props = dict(name_en=n, name_vi=nvi or n, rank=int(p.get("scalerank") or 9))
        out.append(dict(type="Feature", properties=props, geometry=f["geometry"]))
    return out


def lake_vi(n):
    if not n:
        return None
    if n in LAKE_VI:
        return LAKE_VI[n]
    m = re.match(r"^(Lake|Lago|Lac|Lough)\s+(of\s+the\s+)?(.+)$", n)
    if m:
        return "Hồ " + m.group(3)
    m = re.match(r"^(.+?)\s+(Lake|Hu)$", n)
    if m:
        return "Hồ " + m.group(1)
    m = re.match(r"^(.+?)\s+Reservoir$", n)
    if m:
        return "Hồ chứa " + m.group(1)
    return "Hồ " + n if not n.lower().startswith(("sea", "biển")) else n


def build_lakes(src, min_km2):
    out = []
    for f in load(src, "ne_50m_lakes"):
        p = f["properties"]
        g = shape(f["geometry"])
        if km2(g) < min_km2:
            continue
        n = p.get("name")
        props = dict(name_en=n, name_vi=lake_vi(n), rank=int(p.get("scalerank") or 9))
        out.append(dict(type="Feature", properties={k: v for k, v in props.items() if v}, geometry=f["geometry"]))
    return out


# ================================================================= cities
def build_cities(src, min_pop):
    out = []
    for f in load(src, "ne_10m_populated_places"):
        p = f["properties"]
        cap = p["FEATURECLA"] in ("Admin-0 capital", "Admin-0 capital alt")
        pop = p.get("POP_MAX") or 0
        if not (cap or pop >= min_pop):
            continue
        lon, lat = f["geometry"]["coordinates"]
        if PARACEL_BOX.contains(Point(lon, lat)) or SPRATLY_BOX.contains(Point(lon, lat)):
            continue  # (không có đô thị nào hợp lệ ở đây; loại mọi "Tam Sa"...)
        n = p["NAME"]
        nvi = CITY_VI.get(n) or p.get("NAME_VI") or n
        nvi = re.sub(r"^Thành phố\s+(?!Mexico|Kuwait|Hồ)", "", nvi)
        if n == "Changsha":
            nvi = "Changsha"
        # cap: 1 = thủ đô, 2 = thủ đô phụ/hành chính (Admin-0 capital alt), 0 = không
        is_cap = 0 if (not cap or n in CITY_NOT_CAPITAL) else (1 if p["FEATURECLA"] == "Admin-0 capital" else 2)
        props = dict(name_vi=nvi, name_en=n, adm0_a3=p["ADM0_A3"], cap=is_cap,
                     pop=int(pop))
        out.append(dict(type="Feature", properties=props, geometry=dict(type="Point", coordinates=[r(lon, 3), r(lat, 3)])))
    out.sort(key=lambda f: -f["properties"]["pop"])
    return out


# góc xoay nhãn (độ, chiều kim đồng hồ trên màn hình, ước lượng cho Mercator/khung khu vực)
SEA_ANGLE = {"malacca": 38, "dai_loan": -45, "bien_do": 55, "vinh_bac_bo": 0, "ba_tu": 25, "manche": -10}


def build_seas():
    out = []
    for (i, nvi, nen, k, rk, lon, lat) in SEAS:
        pr = dict(id=i, name_vi=nvi, name_en=nen, kind=k, rank=rk)
        if SEA_ANGLE.get(i):
            pr["angle"] = SEA_ANGLE[i]
        out.append(dict(type="Feature", geometry=dict(type="Point", coordinates=[lon, lat]), properties=pr))
    return out


# ================================================================= legal checks
def legal_checks(topo_path):
    """Kiểm tra trên GeoJSON trung gian: không nước nào ngoài VNM chạm 2 quần đảo; không chuỗi cấm."""
    with open(topo_path, encoding="utf-8") as f:
        txt = f.read()
    banned = ["South China Sea", "Nine-dash", "nine-dash", "Biển Nam Trung Hoa", "Nam Hải", "Sansha", "Tam Sa",
              "Xisha", "Nansha", "Paracel", "Spratly"]
    for b in banned:
        assert b not in txt, f"chuỗi cấm xuất hiện trong dữ liệu: {b}"


def write_geojson(path, feats):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dict(type="FeatureCollection", features=feats), f, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--out", default=os.path.join(here, "..", "maps_world"))
    ap.add_argument("--src", default=os.path.join(here, "ne_cache"))
    ap.add_argument("--node-dir", default=here, help="thư mục có node_modules (mapshaper, d3-geo...)")
    ap.add_argument("--work", default=os.path.join(here, "_build"))
    a = ap.parse_args()
    os.makedirs(a.src, exist_ok=True); os.makedirs(a.work, exist_ok=True); os.makedirs(a.out, exist_ok=True)
    mapshaper = os.path.join(a.node_dir, "node_modules", ".bin", "mapshaper")

    seas = build_seas()
    vn = build_vn_islands(a.src)
    configs = {
        # res: (min_km2 đảo giữ lại, interval simplify (m), quantization, sông chỉ chính, hồ min km², dân số TP min)
        "110m": dict(min_km2=1500, interval=12000, q=30000, major=True, lake=8000, pop=5_000_000, river_iv=12000),
        "50m": dict(min_km2=40, interval=1800, q=200000, major=False, lake=300, pop=2_000_000, river_iv=2500),
    }
    meta_common = dict(
        source="Natural Earth (public domain) — github.com/nvkelso/natural-earth-vector @ master (VERSION 5.2.0-pre)",
        countries_source="ne_10m_admin_0_countries_vnm (point-of-view Việt Nam), đơn giản hoá bằng mapshaper",
        pop_gdp="POP_EST/GDP_MD lấy từ Natural Earth; phần lớn năm 2019 (xem pop_year/gdp_year từng nước). GDP_MD: triệu USD danh nghĩa.",
        crs="EPSG:4326 lon/lat — CHƯA chiếu; cảnh tự chọn phép chiếu (d3-geo)",
        legal="Hoàng Sa, Trường Sa thuộc Việt Nam (lớp vn_islands + đảo trong polygon VNM). KHÔNG đường chín đoạn. Gọi 'Biển Đông'.",
        layers=["countries", "vn_islands", "rivers", "lakes", "cities", "seas"],
    )
    for res, c in configs.items():
        print("==", res)
        files = {}
        files["countries"] = build_countries(a.src, c["min_km2"])
        files["rivers"] = build_rivers(a.src, c["major"])
        files["lakes"] = build_lakes(a.src, c["lake"])
        files["cities"] = build_cities(a.src, c["pop"])
        files["seas"] = seas
        files["vn_islands"] = vn
        paths = {}
        for k, feats in files.items():
            paths[k] = os.path.join(a.work, f"{k}.geojson")
            write_geojson(paths[k], feats)
            print(f"  {k}: {len(feats)}")
        tmp = os.path.join(a.work, f"world-{res}.topo.json")
        cmd = [mapshaper, "-i", paths["countries"], paths["rivers"], paths["lakes"], paths["cities"],
               paths["seas"], paths["vn_islands"], "combine-files",
               # 1 lệnh simplify áp cho mọi lớp đường/vùng cùng dataset (countries, rivers, lakes)
               "-simplify", f"interval={c['interval']}", "keep-shapes",
               "-o", "format=topojson", f"quantization={c['q']}", "target=*", tmp]
        subprocess.run(cmd, check=True)
        with open(tmp, encoding="utf-8") as f:
            topo = json.load(f)
        topo["meta"] = dict(meta_common, resolution=res, simplify_interval_m=c["interval"],
                            min_island_km2=c["min_km2"], city_min_pop=c["pop"])
        js = json.dumps(topo, ensure_ascii=False, separators=(",", ":"))
        jpath = os.path.join(a.out, f"world-{res}.json")
        with open(jpath, "w", encoding="utf-8") as f:
            f.write(js)
        var = "WORLD_" + res.upper()
        with open(os.path.join(a.out, f"world-{res}.js"), "w", encoding="utf-8") as f:
            f.write(f"window.{var}=" + js + ";\n")
        legal_checks(jpath)
        print(f"  -> {jpath} {os.path.getsize(jpath)/1024:.0f} KB")

    # vendor
    nm = os.path.join(a.node_dir, "node_modules")
    vend = os.path.join(a.out, "vendor")
    os.makedirs(vend, exist_ok=True)
    for pkg, fn in [("d3-array", "d3-array.min.js"), ("d3-geo", "d3-geo.min.js"),
                    ("d3-geo-projection", "d3-geo-projection.min.js"), ("topojson-client", "topojson-client.min.js")]:
        s = os.path.join(nm, pkg, "dist", fn)
        if os.path.exists(s):
            shutil.copy(s, os.path.join(vend, fn))
            ver = json.load(open(os.path.join(nm, pkg, "package.json")))["version"]
            lic = os.path.join(nm, pkg, "LICENSE")
            if os.path.exists(lic):
                with open(lic) as fi, open(os.path.join(vend, f"LICENSE.{pkg}.txt"), "w") as fo:
                    fo.write(f"{pkg}@{ver}\n\n" + fi.read())
    print("xong.")


if __name__ == "__main__":
    main()

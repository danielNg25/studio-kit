#!/usr/bin/env python3
"""Vỏ gọi QA dùng chung: bản thật ở studio-kit/tools/qa.py (chuyển 13/11/2026). Lệnh cũ `python3 tools/qa.py …` vẫn chạy như trước."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__)); os.environ.setdefault('QA_CHANNEL', os.path.dirname(here))
real = os.path.abspath(os.path.join(here, '..', '..', 'studio-kit', 'tools', 'qa.py'))
os.execv(sys.executable, [sys.executable, real] + sys.argv[1:])

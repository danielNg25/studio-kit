#!/usr/bin/env python3
"""Chụp preview_world.png và preview_sea.png từ maps_world/preview.html bằng Playwright Chromium."""
import os, sys
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
mw = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "..", "maps_world"))
chrome = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome, args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    for view in ("world", "sea"):
        pg.goto("file://" + os.path.join(mw, "preview.html") + "?view=" + view)
        pg.wait_for_selector("body[data-ready='1']", timeout=30000)
        pg.screenshot(path=os.path.join(mw, f"preview_{view}.png"), clip=dict(x=0, y=0, width=1920, height=1080))
        print(view, "ok", pg.evaluate("document.querySelectorAll('.vn-islands circle').length"), "chấm đảo")
    b.close()
    if errs:
        print("LỖI:", errs); sys.exit(1)

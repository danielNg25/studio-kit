// Chụp toàn trang bằng Chrome DevTools Protocol (giống "Capture full size screenshot" trong DevTools) — 1 cú bấm.
// Reddit: chỉ chụp cột chính (bài + bình luận), bỏ thanh bên. Trang khác: chụp cả trang.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const send = (t, m, p) => chrome.debugger.sendCommand(t, m, p || {});

async function chup(tab) {
  if (!tab || !tab.id || !/^https?:/.test(tab.url || '')) return;
  const t = { tabId: tab.id };
  let gan = false;
  try {
    await chrome.action.setBadgeText({ tabId: tab.id, text: '...' });
    await chrome.debugger.attach(t, '1.3');   // lỗi nếu tab đang mở DevTools → báo LỖI bên dưới
    gan = true;
    const m = await send(t, 'Page.getLayoutMetrics');
    const cs = m.cssContentSize || m.contentSize;
    const W = Math.ceil(cs.width), H = Math.min(Math.ceil(cs.height), 30000);
    // ảnh rất dài thì giảm độ phân giải để Chrome không bị lỗi bộ nhớ
    const scale = H > 12000 ? 1 : 2;
    await send(t, 'Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: scale, mobile: false });
    await sleep(1200); // chờ ảnh / avatar tải
    const r = await send(t, 'Runtime.evaluate', { returnByValue: true, expression: `(() => {
      if (!/reddit\\.com$/.test(location.hostname)) return null;
      const el = document.querySelector('main#main-content') || document.querySelector('main');
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: el.scrollHeight || b.height };
    })()` });
    const c = r && r.result && r.result.value;
    // ảnh rất dài → JPEG chất lượng 92 để file nhỏ (data: URL quá lớn có thể tải hỏng; service worker MV3 không có URL.createObjectURL nên không dùng blob URL được)
    const jpg = H > 12000;
    const opt = jpg ? { format: 'jpeg', quality: 92, captureBeyondViewport: true, fromSurface: true } : { format: 'png', captureBeyondViewport: true, fromSurface: true };
    if (c && c.w > 200) opt.clip = { x: Math.max(0, c.x), y: Math.max(0, c.y), width: c.w, height: Math.min(c.h, H), scale: 1 };
    const shot = await send(t, 'Page.captureScreenshot', opt);
    const d = new Date(), pad = (n) => String(n).padStart(2, '0');
    const ten = (tab.title || 'trang').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'trang';
    const file = `chup-toan-trang/${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}_${ten}.${jpg ? 'jpg' : 'png'}`;
    await chrome.downloads.download({ url: `data:image/${jpg ? 'jpeg' : 'png'};base64,` + shot.data, filename: file, saveAs: false });
    await chrome.action.setBadgeText({ tabId: tab.id, text: 'OK' });
  } catch (e) {
    console.error(e);
    await chrome.action.setBadgeText({ tabId: tab.id, text: 'LỖI' });
  } finally {
    if (gan) {
      try { await send(t, 'Emulation.clearDeviceMetricsOverride'); } catch (e) {}
      try { await chrome.debugger.detach(t); } catch (e) {}
    }
    setTimeout(() => chrome.action.setBadgeText({ tabId: tab.id, text: '' }), 2500);
  }
}

chrome.action.onClicked.addListener(chup);
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd !== 'chup') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chup(tab);
});

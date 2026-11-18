// 말문 서비스 워커: 앱 파일을 모두 저장해서 인터넷 없이 열리게 한다.
const VERSION = "malmun-v11";
const FILES = [
  "./", "index.html", "manifest.webmanifest", "app.css", "app.js",
  "phrases.js", "patterns.js", "dialogs.js", "listening.js", "leveltest.js",
  "pretendard-500.woff2", "pretendard-800.woff2",
  "icon-180.png", "icon-192.png", "icon-512.png", "maskable-512.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // AI 요청 등 외부는 건드리지 않음
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); } return r; }).catch(() => hit || caches.match("index.html"));
    return hit || net;
  }));
});

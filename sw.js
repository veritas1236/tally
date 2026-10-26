// Keeps Tally opening when you're offline. Pages are fetched fresh when online, so updates arrive right away.
const CACHE = "tally-67380f8e42";
const SHELL = ["./", "index.html", "cloud.js?v=67380f8e42", "firebase-config.js?v=67380f8e42", "fonts.css", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/favicon.png", "fonts/instrument-sans-latin-400-normal.woff2", "fonts/instrument-sans-latin-500-normal.woff2", "fonts/instrument-sans-latin-600-normal.woff2", "fonts/instrument-sans-latin-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;     // Firebase traffic goes straight through
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});

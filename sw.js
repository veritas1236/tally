// Keeps Orbit opening when you're offline. The page is always fetched fresh when online, so updates arrive on the next reload.
const CACHE = "orbit-96da702fd9";
const SHELL = ["./", "index.html", "cloud.js?v=96da702fd9", "firebase-config.js?v=96da702fd9", "fonts.css", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/favicon.png", "fonts/plus-jakarta-sans-latin-400-normal.woff2", "fonts/plus-jakarta-sans-latin-500-normal.woff2", "fonts/plus-jakarta-sans-latin-600-normal.woff2", "fonts/plus-jakarta-sans-latin-700-normal.woff2", "fonts/plus-jakarta-sans-latin-800-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;     // Firebase traffic goes straight through
  if (url.pathname.endsWith("/version.json")) return;                      // update checks always go to the network
  if (req.mode === "navigate") {
    e.respondWith(fetch(req.url, { cache: "no-store", credentials: "same-origin" }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});

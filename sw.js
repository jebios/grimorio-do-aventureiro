const CACHE = "grimorio-v7";
const PRECACHE = [
  "./index.html","icon-192.png","icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(fetch(e.request).then(res => { const clone = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", clone)); return res; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => { if (e.request.method === "GET" && res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); } return res; }).catch(() => caches.match("./index.html"))));
});

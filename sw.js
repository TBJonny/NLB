/* Next Level Barbershop — Service Worker (2025 clean) */
const CACHE = "nlb-v14"; // bump this any time you ship changes

const ASSETS = [
  "/", "/index.html", "/style.css", "/app.js",
  "/offline.html", "/site.webmanifest",
  "/favicon.ico", "/apple-touch-icon.png",
  "/icon-32.png", "/icon-48.png", "/icon-64.png",
  "/icon-180.png", "/icon-192.png", "/icon-512.png",
  "/nlbs.vcf"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // HTML navigations: network-first, fallback to offline page
  const isNav = req.mode === "navigate" ||
                (req.method === "GET" && req.headers.get("accept")?.includes("text/html"));

  if (isNav) {
    e.respondWith(
      fetch(req).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Static assets: cache-first
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Optionally stash same-origin GETs
        const copy = res.clone();
        if (req.method === "GET" && req.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
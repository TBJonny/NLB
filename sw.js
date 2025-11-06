// Lightweight SW: no fetch hijack, no stale caches.
// Only ensures fast activation so updates show immediately.
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
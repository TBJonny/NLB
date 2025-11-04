// Minimal service worker just to pass PWA install and keep things stable.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evt) => evt.waitUntil(self.clients.claim()));

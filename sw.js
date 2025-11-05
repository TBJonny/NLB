
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('nlb-v10').then(cache=>cache.addAll([
    '/', '/index.html','/style.css','/app.js','/site.webmanifest','/og-image.png','/apple-touch-icon.png',
  ])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(res=>res || fetch(e.request)));
});


self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      const res = await fetch(event.request);
      return res;
    } catch (e) {
      const cache = await caches.open('nlb-v8');
      const offline = await cache.match('/offline.html');
      return offline || new Response('Offline', {status: 503, headers: {'Content-Type': 'text/plain'}});
    }
  })());
});

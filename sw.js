/* MarlyLabs home — network-first shell so every open gets the latest. */
const V = 'marlylabs-home-v1.0.1';
self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const fresh = await fetch(e.request, { cache: 'no-store' });
      if (fresh && fresh.ok) {
        const c = await caches.open(V);
        try { await c.put(e.request, fresh.clone()); } catch (_) {}
      }
      return fresh;
    } catch (_) {
      const hit = await caches.match(e.request);
      if (hit) return hit;
      if (url.pathname === '/' || url.pathname.endsWith('/index.html')) {
        return caches.match('/index.html');
      }
      throw _;
    }
  })());
});
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

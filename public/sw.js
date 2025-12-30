// Service Worker for PWA support
const CACHE_NAME = 'kelime-pusula-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: cache core assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch: prefer network, fallback to cache (ensures newest files used when available)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; let other methods pass through
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(request);

      // Cache only same-origin successful GET responses
      if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
      }

      return networkResponse;
    } catch (err) {
      const cached = await caches.match(request, { ignoreSearch: true });

      if (cached) return cached;

      // Fallback to app shell for navigations when offline
      if (request.mode === 'navigate') {
        const offlineShell = await caches.match('./index.html');
        if (offlineShell) return offlineShell;
      }

      throw err;
    }
  })());
});

// Activate: clear old caches and take control of clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});

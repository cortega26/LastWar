/* LastWar Tools Service Worker */
const VERSION = 'v1-20250828';
const STATIC_CACHE = `static-${VERSION}`;
const HTML_CACHE = `html-${VERSION}`;

// URLs to precache (add critical assets with versioned URLs)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/fonts.css',
  '/assets/js/visual-interactions-optimized.js',
  '/assets/js/theme.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => ![STATIC_CACHE, HTML_CACHE].includes(k)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper: decide strategy by request
function isHTML(req) {
  return req.destination === 'document' || (req.headers.get('accept') || '').includes('text/html');
}
function isAsset(req) {
  return req.url.includes('/assets/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Bypass non-GET
  if (request.method !== 'GET') return;

  if (isHTML(request)) {
    // Network-first for HTML (fallback to cache)
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(HTML_CACHE).then((cache) => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (isAsset(request)) {
    // Stale-while-revalidate for assets
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((resp) => {
            if (resp && resp.status === 200) {
              const copy = resp.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return resp;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});


// Service Worker for Performance Caching
const CACHE_NAME = 'lastwar-tools-v1.2.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/assets/css/styles-optimized.css',
    '/assets/css/search.css',
    '/assets/js/search.js',
    '/partials/nav-menu.html',
    '/partials/footer.html',
    '/assets/images/favicon.ico'
];

const DYNAMIC_CACHE_URLS = [
    '/tools/',
    '/guides/',
    '/community/'
];

// Install event - Cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - Cache strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external domains (except fonts)
    if (url.origin !== location.origin && !url.hostname.includes('fonts.g')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    // For dynamic content, fetch in background for next time
                    if (DYNAMIC_CACHE_URLS.some(pattern => url.pathname.startsWith(pattern))) {
                        event.waitUntil(updateCache(request));
                    }
                    return cachedResponse;
                }

                // Fetch and cache new content
                return fetch(request)
                    .then(response => {
                        // Don't cache error responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache successful responses
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Background cache update function
function updateCache(request) {
    return fetch(request)
        .then(response => {
            if (response && response.status === 200 && response.type === 'basic') {
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
            }
            return response;
        });
}

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
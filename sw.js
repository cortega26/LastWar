// Service Worker for Last War Tools PWA
const CACHE_NAME = 'last-war-tools-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Critical resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/script.js',
    '/pages/protein-farm-calculator.html',
    '/pages/T10-calculator.html',
    '/pages/heroes.html',
    '/pages/base-building.html',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => console.error('[SW] Failed to cache static assets:', err))
    );

    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    return self.clients.claim();
});

// Fetch event - serving strategy
self.addEventListener('fetch', event => {
    const { request } = event;

    // Handle navigation requests (pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            networkFirstWithFallback(request)
        );
        return;
    }

    // Handle static assets (CSS, JS, images)
    if (request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image') {
        event.respondWith(
            cacheFirstWithUpdate(request)
        );
        return;
    }

    // Default: network first
    event.respondWith(
        networkFirstWithFallback(request)
    );
});

// Cache strategies
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        if (request.mode === 'navigate') {
            return new Response('Offline - Last War Tools', {
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        throw error;
    }
}

async function cacheFirstWithUpdate(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        updateCache(request);
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        throw error;
    }
}

async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        console.log('[SW] Background update failed:', error);
    }
}

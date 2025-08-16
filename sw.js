// Service Worker for Last War Tools PWA
importScripts('/assets/js/sw.version.js');

const STATIC_CACHE = `static-${self.SW_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${self.SW_VERSION}`;

// Critical resources to precache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/assets/css/styles.css',
    '/assets/js/script.js',
    '/manifest.json',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    '/assets/images/favicon.ico'
];

// App shell for top pages to warm cache
const APP_SHELL = [
    '/',
    '/offline.html',
    '/assets/pages.json',
    '/pages/alliances.html',
    '/pages/base-building.html',
    '/pages/heroes.html'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets and app shell...');
                return Promise.all([
                    cache.addAll(STATIC_ASSETS),
                    cache.addAll(APP_SHELL)
                ]);
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
        event.respondWith(networkFirstWithFallback(request));
        return;
    }

    // Handle static assets (CSS, JS, images, manifest)
    if (request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'manifest') {
        event.respondWith(cacheFirstWithUpdate(request));
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
            return caches.match('/offline.html');
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
            const cache = await caches.open(STATIC_CACHE);
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
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        console.log('[SW] Background update failed:', error);
    }
}

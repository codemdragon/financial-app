const CACHE_NAME = 'bachat-static-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './tailwind.min.js',
    './lucide.min.js',
    './fonts.css',
    './fonts/latin-300-normal.woff2',
    './fonts/latin-400-normal.woff2',
    './fonts/latin-500-normal.woff2',
    './fonts/latin-600-normal.woff2',
    './fonts/latin-700-normal.woff2'
];

// 1. Install Event: Pre-cache static assets
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching shell assets');
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: Cache-first strategy for reliability offline
self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then((cacheRes) => {
            // If the resource is in the cache, return it immediately.
            if (cacheRes) {
                return cacheRes;
            }
            // If not, fetch from network.
            return fetch(evt.request);
        })
    );
});
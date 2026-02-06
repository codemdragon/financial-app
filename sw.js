const CACHE_NAME = 'bachat-v5';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/tailwind.min.js',
    '/lucide.min.js',
    '/fonts.css',
    '/fonts/latin-300-normal.woff2',
    '/fonts/latin-400-normal.woff2',
    '/fonts/latin-500-normal.woff2',
    '/fonts/latin-600-normal.woff2',
    '/fonts/latin-700-normal.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// 1. Install Event: Pre-cache static assets
self.addEventListener('install', (evt) => {
    evt.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        console.log('Caching shell assets');
        const results = await Promise.allSettled(
            ASSETS.map((asset) => cache.add(asset))
        );
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn('Failed to cache', ASSETS[index], result.reason);
            }
        });
    })());
    self.skipWaiting(); // Force active SW
});

// 2. Activate Event: Clean up old caches and claim clients
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        Promise.all([
            caches.keys().then((keys) => {
                return Promise.all(keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
                );
            }),
            self.clients.claim() // Take control immediately
        ])
    );
});

// 3. Fetch Event: Cache-first with index.html fallback for navigation
self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then((cacheRes) => {
            // Return cached resource if found
            if (cacheRes) {
                return cacheRes;
            }

            // Fallback to network
            return fetch(evt.request).catch(() => {
                // If network fails and it's a navigation request, return index.html
                if (evt.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

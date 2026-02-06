const CACHE_NAME = 'bachat-v6'; // <-- Incremented version
const ASSETS_TO_CACHE = [
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

// Install event: cache the "app shell"
self.addEventListener('install', (evt) => {
    evt.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        console.log('Caching shell assets');
        await cache.addAll(ASSETS_TO_CACHE);
    })());
    self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: serve from cache, with network fallback and offline support
self.addEventListener('fetch', (evt) => {
    // For navigation requests, use a network-first strategy, falling back to cache
    if (evt.request.mode === 'navigate') {
        evt.respondWith(
            (async () => {
                try {
                    // Try the network first
                    const networkResponse = await fetch(evt.request);
                    return networkResponse;
                } catch (error) {
                    // If the network fails, serve the offline page from the cache
                    console.log('Network request failed, serving offline page from cache.');
                    const cache = await caches.open(CACHE_NAME);
                    return await cache.match('/index.html');
                }
            })()
        );
        return; // End execution for navigation requests
    }

    // For other requests (CSS, JS, images), use a cache-first strategy
    evt.respondWith(
        caches.match(evt.request).then((cacheRes) => {
            return cacheRes || fetch(evt.request).catch(() => {
                // This part is crucial for non-navigation offline fallbacks.
                // If you have a placeholder for images or data, you can return it here.
                // For now, we simply let the request fail, which is often acceptable for non-critical assets.
                console.warn('Failed to fetch from network and not in cache:', evt.request.url);
            });
        })
    );
});

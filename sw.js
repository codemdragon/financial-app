const CACHE_NAME = 'bachat-static-v1';
const ASSETS = [
    './', // Alias for index
    './bachat_app.html',
    './manifest.json',
    // External CDNs (Critical for functionality)
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 1. Install Event: Pre-cache static assets
self.addEventListener('install', (evt) => {
    // console.log('Service worker installed');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching shell assets');
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (evt) => {
    // console.log('Service worker activated');
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: Network-first strategy for flexibility, fallback to cache
self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        fetch(evt.request)
            .then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Update cache with new version if network succeeds
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                });
            })
            .catch(() => {
                // If offline, return from cache
                return caches.match(evt.request);
            })
    );
});

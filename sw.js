const CACHE_NAME = 'bachat-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/bachat_app.html',
  '/manifest.json',
  // Tailwind CSS (CDN)
  'https://cdn.tailwindcss.com',
  // Lucide Icons (CDN)
  'https://unpkg.com/lucide@latest',
  // Google Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) return response;

        // Otherwise fetch from network
        return fetch(event.request).then((networkResponse) => {
          // If the request is for an external asset (fonts, cdn), cache it dynamically
          if (event.request.url.startsWith('http')) {
             return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
             });
          }
          return networkResponse;
        });
      })
  );
});

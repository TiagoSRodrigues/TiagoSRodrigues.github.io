const CURRENT_CACHE_VERSION = 'v1';
const CACHE_NAME = `tiago-rodrigues-page-cache-${CURRENT_CACHE_VERSION}`;
const OK_STATUS = 200;
const BASIC_TYPE = 'basic';

const urlsToCache = [
    '/',
    '/index.html',
    '/configs/scripts.js',
    '/configs/config.json',
    // ... other URLs to cache ...
];

// ----- INSTALLATION -----
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(error => console.error("Error during cache installation:", error))
    );
});

// ----- FETCHING -----
self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if available
                if (cachedResponse) return cachedResponse;

                // Otherwise fetch, cache, and return the request
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a good response or non-basic response type
                        if (!response || response.status !== OK_STATUS || response.type !== BASIC_TYPE) {
                            return response;
                        }

                        let responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseToCache));

                        return response;
                    })
                    .catch(error => { // Handle network errors
                        console.error("Network fetch failed:", error);
                    });
            })
    );
});

// ----- ACTIVATION & CLEAN UP -----
self.addEventListener('activate', event => {
    const allowedCaches = [CACHE_NAME];

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!allowedCaches.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .catch(error => console.error("Cache clean up failed:", error))
    );
});

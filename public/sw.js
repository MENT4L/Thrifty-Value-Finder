const CACHE_NAME = 'resale-value-finder-v3'; // Incremented cache version
// Pre-cache only the essential app shell. The build assets (JS, CSS) will be cached dynamically.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/apple-touch-icon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Opened cache and caching app shell');
        // Add CDN scripts to cache as well
        const cdnUrls = [
          'https://cdn.tailwindcss.com',
          'https://aistudiocdn.com/react@^19.2.0',
          'https://aistudiocdn.com/react-dom@^19.2.0/',
          'https://aistudiocdn.com/@google/genai@^1.28.0'
        ];
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        requests.push(...cdnUrls.map(url => new Request(url, { mode: 'no-cors' })));
        await cache.addAll(requests);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request to use it both for fetching and caching
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || (response.status !== 200 && response.type !== 'opaque')) {
              return response;
            }
            
            // Clone the response to put it in the cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
const CACHE_NAME = 'nutritrack-cache-v1';
const ASSET_CACHE_NAME = `${CACHE_NAME}-assets`; // Separate cache for assets

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/192x192.png',
  '/512x512.png',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(CORE_ASSETS);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, ASSET_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Skip non-HTTP/HTTPS requests and browser extensions
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Handle API requests - don't cache
  if (event.request.url.includes('/api/')) {
    return fetch(event.request);
  }

  // Define a function to handle asset caching
  const handleAssetCaching = async () => {
    const cache = await caches.open(ASSET_CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(event.request);
    if (networkResponse.ok) {
      cache.put(event.request, networkResponse.clone());
    }
    return networkResponse;
  };

  // Check if the request is for an asset in the /assets/ directory
  if (event.request.url.includes('/assets/')) {
    event.respondWith(handleAssetCaching());
    return;
  }

  // For other requests, try the cache first, then network
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

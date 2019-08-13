// Sources: https://developers.google.com/web/fundamentals/primers/service-workers/ 
var CACHE_NAME = 'lexie-logger-cache-v1';
var urlsToCache = [
  '/LexieIcon_1024.png',
  '/LexieIcon_512.png',
  '/LexieIcon_256.png',
  '/LexieIcon_192.png',
  '/LexieIcon_180.png',
  '/LexieIcon_128.png',
  '/LexieIcon_96.png',
  '/LexieIcon_64.png',
  '/LexieIcon_48.png',
  '/LexieIcon_32.png',
  '/LexieIcon_16.png',
  '/bootswatch-lumen_bootstrap.min.css',
  '/customizations.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});


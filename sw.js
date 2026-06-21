./css/styles.css?v=110236
./js/app.js?v=110236

const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css?v=110227',
  './js/app.js?v=110227',
  './assets/icon-mor-192.png',
  './assets/icon-mor-512.png',
  './assets/Logo_Mor.png',
  './assets/Logo_MORENA_Qro.png',
  './assets/icon-192.png',
  './assets/iphone-install.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

/**
 * Happy Hour Slot - PWA Service Worker
 */
const CACHE_NAME = 'slot-3d-v20';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/audio.js',
  './js/i18n.js',
  './js/particles.js',
  './js/slot.js',
  './js/app.js',
  './manifest.webmanifest',
  './assets/logo.svg',
  './assets/symbols/logo-flower.svg',
  './assets/symbols/diamond.svg',
  './assets/symbols/bar.svg',
  './assets/symbols/coin.svg',
  './assets/symbols/seven.svg',
  './assets/symbols/bell.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback or offline support
      });
    })
  );
});

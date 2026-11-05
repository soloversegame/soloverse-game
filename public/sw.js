// public/sw.js

const ASSET_CACHE_VERSION = 'soloverse-v1-engine';

// 1. CRITICAL ASSETS RUNTIME PIPELINE
// All game rules and card text are baked directly into '/' by Astro. 
const CRITICAL_STATIC_MANIFEST = [
  '/',
  '/manifest.webmanifest',
  '/assets/images/layouts/soloverse-logo.png'
];

// Installation Lifecycle: Force cache deployment immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(ASSET_CACHE_VERSION).then((cache) => {
      return cache.addAll(CRITICAL_STATIC_MANIFEST);
    }).then(() => self.skipWaiting())
  );
});

// Activation Lifecycle: Flush outdated runtime layers safely
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if (k !== ASSET_CACHE_VERSION) return caches.delete(k);
      })
    )).then(() => self.clients.claim())
  );
});

// public/sw.js - Listen for the skip-waiting message event payload
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 2. UNIFIED HIGH-PERFORMANCE CACHE STRATEGY ENGINE
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // STRATEGY A: For your core layout, static files, and media assets
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(e.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Cache image modifications and lazy-loaded assets seamlessly on the fly
          const responseClone = networkResponse.clone();
          caches.open(ASSET_CACHE_VERSION).then((cache) => {
            cache.put(e.request, responseClone);
          });

          return networkResponse;
        }).catch(() => {
          // Fallback anchor frame for broken native elements can go here
        });
      })
    );
  } 
  // STRATEGY B: Cleaned-up fallback for External Asset Streams or External API Calls
  else {
    // Equivalent to your old NetworkFirst approach with an immediate offline sandbox backup
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open('api-data-cache').then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request);
      })
    );
  }
});
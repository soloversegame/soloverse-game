// public/sw.js

const ASSET_CACHE_VERSION = 'soloverse-v1-engine';

// 1. CRITICAL ASSETS RUNTIME PIPELINE
// All game rules and card text are baked directly into '/' by Astro. 
const CRITICAL_STATIC_MANIFEST = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/images/layouts/soloverse-logo.png' // 🚀 Kept exactly as your project has it!
];

// Installation Lifecycle: Force cache deployment immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(ASSET_CACHE_VERSION).then((cache) => {
      console.log('Soloverse Cache Engine: Initializing secure offline core...');
      return cache.addAll(CRITICAL_STATIC_MANIFEST);
    }).then(() => self.skipWaiting())
  );
});

// Activation Lifecycle: Flush outdated runtime layers safely
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if (k !== ASSET_CACHE_VERSION) {
          console.log('Soloverse Cache Engine: Purging legacy asset manifests:', k);
          return caches.delete(k);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// Listen for the skip-waiting message event payload from update-sync-action-btn
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 2. UNIFIED HIGH-PERFORMANCE CACHE STRATEGY ENGINE
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Filter requests: Handle internal application assets
  if (url.origin === self.location.origin) {
    
    // 🖼️ SUB-STRATEGY A1: Media, Images & Design Assets (Cache-First)
    // Fast local reads for images so they load instantly from your device grids
    if (url.pathname.includes('/assets/') || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
      e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(e.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const responseClone = networkResponse.clone();
            caches.open(ASSET_CACHE_VERSION).then((cache) => {
              cache.put(e.request, responseClone);
            });

            return networkResponse;
          }).catch(() => {
            // Quietly fail or return a broken asset block if offline and not cached yet
          });
        })
      );
      return;
    }

    // 📄 SUB-STRATEGY A2: The Live Webpage Page Shell, Code Framework, and Manifest (Network-First)
    // Guarantees updates are checked online immediately before ever falling back to offline records
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(ASSET_CACHE_VERSION).then((cache) => {
              cache.put(e.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If the network channel is dead or offline, look up the offline page cache anchor frame
          return caches.match(e.request).then((fallbackResponse) => {
            if (fallbackResponse) return fallbackResponse;
            
            // Catch-all mapping fallback rules for deep navigation items if offline
            if (e.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
        })
    );
  } 
  
  // STRATEGY B: Fallback for External Asset Streams or External API Calls
  else {
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
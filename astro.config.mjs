import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://vercel.app',
  trailingSlash: 'never',
  integrations: [
    AstroPWA({
      selfDestroying: false,
      registerType: 'autoUpdate',
      manifest: {
        name: 'Soloverse Rulebook Vault',
        short_name: 'Soloverse',
        description: 'Instant tabletop rulebook stream and variant index layers',
        theme_color: '#0f1015',
        background_color: '#0f1015',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        
        // Match clean production build files
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,pdf,webmanifest}'],
        
        // Ensure index acts as a safety route shell offline
        navigateFallback: '/index.html',
        
        globIgnores: ['**/data.json', '**/version.json'],
        runtimeCaching: [ /* ... include the fix from step 1 here ... */ ]
      }

        runtimeCaching: [
          {
            // FIX: Explicitly match the clean pathname, instantly ignoring '?t=' parameters!
            urlPattern: ({ url }) => url.pathname === '/data.json' || url.pathname === '/version.json',
            handler: 'NetworkFirst', 
            options: {
              cacheName: 'offline-info-data-v1',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
              },
              networkTimeoutSeconds: 3 // Fallback to cache immediately if network hangs
            }
          },
        ]
      }
    })
  ]
});
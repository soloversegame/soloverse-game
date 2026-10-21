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
        maximumFileSizeToCacheInBytes: 5000000, // Increased to 5MB to safely fit heavy rulebook pages/PDFs
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        
        // FIX 1: Ensure html pages and web manifests are locked locally
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,pdf,webmanifest}'],
        
        // FIX 2: Prevents Vercel/Astro internal cache-busting query strings from breaking layout lookups
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^t$/, /^v$/],

        // FIX 3: Ignore your specific public data and version files from the *automatic* build precache.
        // We do this because your new button component manually fetches and version-controls them.
        globIgnores: ['**/data.json', '**/version.json'],

        runtimeCaching: [
          {
            // FIX 4: Secure any external assets or runtime rules
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') || url.origin !== self.location.origin,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ]
});
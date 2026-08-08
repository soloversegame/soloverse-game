import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://vercel.app',
  trailingSlash: 'never',
  integrations: [
    AstroPWA({
      selfDestroying: true,
      registerType: 'autoUpdate',
      injectRegister: 'inline', // Safely injects the registration script
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
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // CRITICAL FIX: Added 'html' so the app shell and pages cache locally
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,pdf,webmanifest,json}'],
        // OPTIONAL: Strategy for external API data or live streams

        // CRITICAL FIX: Direct Workbox to allow direct navigation to PDF files
        // This stops the PWA from treating the PDF link as an Astro web route
        navigateFallbackDenylist: [/.*\.pdf$/],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'NetworkFirst', // Tries network first so updates pull instantly from Vercel
            options: {
              cacheName: 'soloverse-pdf-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache for 30 days maximum
              }
            }
          },
          {
          urlPattern: ({ url }) => url.pathname.startsWith('/api/') || url.origin !== self.location.origin,
            handler: 'NetworkFirst', // Tries network first so updates pull instantly from Vercel
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ]
});
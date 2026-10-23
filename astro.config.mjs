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
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // Keep this at 5MB so large card image assets fit!
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Astro builds your markdown into regular HTML pages, so this caches everything perfectly
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,pdf,webmanifest}'],
        navigateFallback: '/index.html'
      }
    })
  ]
});
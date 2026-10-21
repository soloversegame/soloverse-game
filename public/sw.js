        runtimeCaching: [
          // RULE 1: Handle your specific rulebook data file for true offline access
          {
            urlPattern: ({ url }) => url.pathname === '/data.json' || url.pathname === '/version.json',
            // Try network first to get new info, but instantly fall back to cache when offline
            handler: 'NetworkFirst', 
            options: {
              cacheName: 'offline-info-data-v1', // Matches the name used by your button
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              networkTimeoutSeconds: 3 // If network is slow/dead, switch to offline data within 3 seconds
            }
          },
          // RULE 2: Keep your existing rule for other APIs or external streams
          {
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
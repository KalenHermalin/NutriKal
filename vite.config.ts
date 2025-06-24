import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Manifest configuration
      manifest: {
        name: "NutriKal | Nutrition Tracking App",
        short_name: "NutriKal",
        icons: [
          {
            "src": "192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#09090b",
        background_color: "#09090b"
      },
      injectRegister: null,
      // Disable service worker generation
      strategies: 'injectManifest',
      registerType: 'prompt',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: ['192x192.png', '512x512.png'],


      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      }
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

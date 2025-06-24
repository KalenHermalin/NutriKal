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
      // Disable auto-injection of service worker
      injectRegister: null,
      // Disable service worker generation
      disable: false,
      // Still generate manifest
      includeManifestIcons: true,
      includeAssets: ['favicon.ico', '192x192.png', '512x512.png'],
      // Development options
      devOptions: {
        enabled: true,
        type: 'module'
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

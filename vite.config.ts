import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ve core dependencies
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // TanStack tools
          if (id.includes('@tanstack/react-query') || id.includes('@tanstack/react-router')) {
            return 'tanstack-vendor';
          }
          
          // UI libraries
          if (id.includes('styled-components') || id.includes('@heroicons/react')) {
            return 'ui-vendor';
          }
          
          // Map libraries
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'map-vendor';
          }
          
          // Form ve validation
          if (id.includes('zod')) {
            return 'form-vendor';
          }
          
          // Mock server - büyük ama gerekli
          if (id.includes('msw') || id.includes('@faker-js/faker')) {
            return 'mock-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 3500, // Mock vendor için limit artır
  },
})
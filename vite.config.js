import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2020',
    // Warn if any chunk exceeds 400KB
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy animation libraries into their own cached chunks
          if (id.includes('framer-motion')) return 'framer-motion'
          if (id.includes('lenis')) return 'lenis'
          if (id.includes('gsap')) return 'gsap'
          // Split React itself so it's cached independently
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor'
        },
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/BRush-Online',
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  }
})

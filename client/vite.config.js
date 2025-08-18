import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Tüm IP'lerden erişim
    open: true, // Otomatik tarayıcı açma
    watch: {
      usePolling: true, // Windows için polling
      interval: 1000 // 1 saniye aralıkla kontrol
    },
    hmr: {
      overlay: true // Hata overlay'i
    },
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animation: ['framer-motion'],
          state: ['zustand']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand']
  }
}) 
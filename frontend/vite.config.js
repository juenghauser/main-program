import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/auth/, '/api/auth'),
      },
      '/api/media': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/media/, '/api/media'),
      },
      '/api/collection': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/collection/, '/api/collection'),
      },
      '/api/collections': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/collections/, '/api/collections'),
      },
      '/api/collection-media': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/collection-media/, '/api/collection-media'),
      },
    },
    fs: {
      strict: false,
    },

    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      rewrites: [
        { from: /^\/media$/, to: '/index.html' },
        { from: /^\/media\/$/, to: '/index.html' },
        { from: /^\/collections$/, to: '/index.html' },
        { from: /^\/collections\/$/, to: '/index.html' },
        { from: /^\/users$/, to: '/index.html' },
        { from: /^\/users\/$/, to: '/index.html' },
      ],
    },
  },
})

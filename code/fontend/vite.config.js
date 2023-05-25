import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bj.bcebos.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/v1/did-blockchain'
        },
        headers: {
          Referer: 'https://bj.bcebos.com'
        }
      }
    }
  },
})

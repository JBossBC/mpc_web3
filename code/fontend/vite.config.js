import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default {
  server: {
    proxy: {
      '/v1': {
        target: 'https://bj.bcebos.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: 'https://bj.bcebos.com',
        },
      },
    },
  },
  plugins: [react()],
}

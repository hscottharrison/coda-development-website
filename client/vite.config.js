// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        construction: resolve(__dirname, 'construction/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        login: resolve(__dirname, 'login/index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
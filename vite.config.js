import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/today-content',  // GitHub Pages にデプロイする際の base パス
  server: {
    proxy: {
      // 開発中にブラウザから外部 API へ直接アクセスすると CORS / mixed-content に引っかかるため、
      // /api/horoscope/* を https://api.jugemkey.jp/api/horoscope/* にプロキシします。
      '/api/horoscope': {
        target: 'https://api.jugemkey.jp',
        changeOrigin: true,
        secure: true,
        // パスはそのまま転送する
      },
    },
  },
})

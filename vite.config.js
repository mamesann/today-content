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
      // '/api-flower': {
      //   target: 'http://api.whatistoday.cyou',
      //   changeOrigin: true,
      //   // 先頭の '/api-flower' を消して、後ろのパスをターゲットに渡す
      //   rewrite: (path) => path.replace(/^\/api-flower/, ''),
      //   // http と https の混在によるエラーを防ぐための設定
      //   secure: false,
      //   followRedirects: true,
      // }
      // birthflower API 用プロキシ: /api/whatistoday/* -> https://api.whatistoday.cyou/*
      // '/api/whatistoday': {
      //   target: 'https://api.whatistoday.cyou',
      //   changeOrigin: true,
      //   secure: true,
      //   // proxy 経由で /api/whatistoday/v3/... を呼ぶと
      //   // https://api.whatistoday.cyou/api/whatistoday/v3/... になってしまうため
      //   // 先頭の /api/whatistoday を取り除くようにリライトします。
      //   rewrite: (path) => path.replace(/^\/api\/whatistoday/, ''),
      // },
    },
  },
})

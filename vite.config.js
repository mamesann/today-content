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
      '/api': { // Any request starting with /api will be proxied
        target: 'https://meigen.doodlenote.net',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: true,
        // Forward paths under /api directly to https://meigen.doodlenote.net/api/...
      },
      '/api/flower': { // Any request starting with /api will be proxied
        target: 'https://api.whatistoday.cyou/index.cgi',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: true,
      }
    },
  },
})

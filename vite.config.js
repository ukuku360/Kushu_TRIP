import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.search.brave.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Brave Search API 키 추가
            proxyReq.setHeader('X-Subscription-Token', process.env.VITE_BRAVE_SEARCH_API_KEY || '');
          });
        },
      },
      '/api/places': {
        target: 'https://maps.googleapis.com/maps/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/places/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Google Places API용 설정
            proxyReq.setHeader('Accept', 'application/json');
          });
        }
      }
    }
  },
  define: {
    'import.meta.env.VITE_GOOGLE_PLACES_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_PLACES_API_KEY || ''),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || ''),
    'import.meta.env.VITE_BRAVE_SEARCH_API_KEY': JSON.stringify(process.env.VITE_BRAVE_SEARCH_API_KEY || ''),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'),
    'import.meta.env.VITE_USE_MOCK_API': JSON.stringify(process.env.VITE_USE_MOCK_API || 'false'),
    'import.meta.env.VITE_USE_REAL_SCRAPING': JSON.stringify(process.env.VITE_USE_REAL_SCRAPING || 'true'),
  }
})

// 여러 소스에서 데이터 수집
const DATA_SOURCES = {
  naver: 'https://search.naver.com/search.naver?query=',
  google: 'https://www.google.com/search?q=',
  tabelog: 'https://tabelog.com/search/',
  retty: 'https://retty.me/search/',
  instagram: '#규슈맛집 #후쿠오카맛집'
}; 
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 환경 변수를 올바르게 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      open: true,
      proxy: {
        // Google Places API 프록시 (CORS 우회)
        '/maps/api': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/maps\/api/, '/maps/api'),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // API 키를 환경변수에서 자동으로 추가
              const url = new URL(req.url, `http://${req.headers.host}`)
              if (!url.searchParams.has('key') && env.VITE_GOOGLE_PLACES_API_KEY) {
                url.searchParams.set('key', env.VITE_GOOGLE_PLACES_API_KEY)
                proxyReq.path = url.pathname + url.search
              }
            })
          }
        },
        
        // Gemini AI API 프록시
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, '/v1beta'),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Authorization 헤더 추가
              if (env.VITE_GEMINI_API_KEY) {
                proxyReq.setHeader('x-goog-api-key', env.VITE_GEMINI_API_KEY)
              }
            })
          }
        },
        
        // Brave Search API 프록시
        '/api/search': {
          target: 'https://api.search.brave.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/search/, '/res/v1'),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              if (env.VITE_BRAVE_SEARCH_API_KEY) {
                proxyReq.setHeader('X-Subscription-Token', env.VITE_BRAVE_SEARCH_API_KEY)
              }
            })
          }
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'framer-motion': ['framer-motion'],
            'maps-vendor': ['@googlemaps/js-api-loader']
          }
        }
      }
    }
  }
})


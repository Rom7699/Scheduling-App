import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd())
  
  // Choose API URL based on mode
  const apiUrl = mode === 'production' 
    ? env.VITE_API_PRODUCTION_URL 
    : env.VITE_API_DEVELOPMENT_URL

  console.log(`Running in ${mode} mode with API URL: ${apiUrl}`)
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl || 'http://localhost:5500',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
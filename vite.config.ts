import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { bonkuApiPlugin } from './server/vitePluginApi.ts'

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    bonkuApiPlugin(),
  ],
})

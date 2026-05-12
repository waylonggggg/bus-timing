import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: false, // to not conflict with hono cors middleware
  },
  plugins: [
    react(),
    tailwindcss()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/virtual-list/',
  plugins: [react()],
  server: {
    port: 5175
  }
})

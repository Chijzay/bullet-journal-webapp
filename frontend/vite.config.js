import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/bullet-journal-webapp/',
  plugins: [react()],
})

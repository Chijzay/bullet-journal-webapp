import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',          // <-- WICHTIG für chijzay.github.io (ohne /repo/)
  plugins: [react()],
})

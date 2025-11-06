import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // an empty outDir will build in the dist folder
    outDir: 'dist',
    assetsDir: 'assets',
    // Make sure the base is relative for deploying to a subdirectory
    base: './', 
  }
})

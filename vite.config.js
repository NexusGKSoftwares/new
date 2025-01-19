import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',  // Ensure this points to your 'src' folder
    },
  },
  css: {
    postcss: './postcss.config.js',  // Reference the PostCSS config file
    modules: {
      localsConvention: 'camelCase',  // Enable CSS Modules with camelCase
    },
  },
})

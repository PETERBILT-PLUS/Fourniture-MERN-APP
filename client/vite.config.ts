import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es', // Ensure the output is in ES module format
      },
      input: {
        main: './src/main.tsx', // Ensure this points to your main entry file
      },
    },
  },
})
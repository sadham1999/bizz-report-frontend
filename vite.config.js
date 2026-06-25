import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Set your desired IP address, '0.0.0.0' for external access
    port: 8070 // Set your desired port
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()], 
  server: {
    allowedHosts: ['f77eb4cd3d87.ngrok-free.app'],
    host: true // penting biar Vite bisa diakses via jaringan/public IP/ngrok
  }, proxy: {
    "/api/files": {
      target: "https://api-service-upload.palembang.go.id",
      changeOrigin: true,
      secure: false,
    },
  },
  
})

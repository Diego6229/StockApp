import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // El build se genera dentro del backend para que Spring Boot lo sirva en http://localhost:8080
  build: {
    outDir: "../backend_Java/src/main/resources/static",
    emptyOutDir: true,
  },
  // Modo desarrollo (npm run dev): las llamadas a /api se redirigen al backend
  server: {
    port: 1420,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});

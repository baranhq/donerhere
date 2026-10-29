import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.WEB_PORT || 5173),
    strictPort: true,
    proxy: {
      "/api": `http://127.0.0.1:${process.env.API_PORT || 3001}`,
      "/uploads": `http://127.0.0.1:${process.env.API_PORT || 3001}`,
    },
  },
});

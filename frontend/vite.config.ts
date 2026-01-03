import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    expressPlugin(),
  ],

  server: {
    port: 8080,
    fs: {
      allow: [
        ".",          // allow frontend root
        "./client",
        "./shared",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  build: {
    outDir: "dist/spa",
  },
});

// -----------------------------
// Express middleware plugin
// -----------------------------
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // dev mode only
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}

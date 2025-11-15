import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: isProduction
      ? {
          proxy: {
            "/api": {
              target: "http://72.61.171.104:3001",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : {
          proxy: {
            "/api": {
              target: "http://localhost:8080",
              changeOrigin: true,
              secure: false,
            },
          },
        },

    build: {
      minify: "esbuild",
      esbuild: {
        drop: ["console", "debugger"],
      },
    },
  };
});
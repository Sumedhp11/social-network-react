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
      ? undefined
      : {
          proxy: {
            "/api": {
              target: "http://localhost:8080",
              changeOrigin: true,
              secure: false,
            },
            "/socket.io": {
              target: "http://localhost:8080",
              ws: true,
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
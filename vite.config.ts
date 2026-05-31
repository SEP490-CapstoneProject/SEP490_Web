import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/applications": {
        target:
          "https://application-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/challenges": {
        target:
          "https://challenge-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/creator": {
        target:
          "https://challenge-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/submissions": {
        target:
          "https://challenge-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/follow-categories": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/follows": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/portfolio": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/feed/portfolio": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/points": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/portfolios": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/criteria": {
        target:
          "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api": {
        target:
          "https://gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/user-profile-api": {
        target:
          "https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-profile-api/, ""),
      },
      "/hubs": {
        target:
          "https://gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/hubs",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/hubs/, ""), // Strip /hubs prefix
      },
    },
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL || "/api",
    ),
    "import.meta.env.VITE_USER_PROFILE_API_BASE_URL": JSON.stringify(
      process.env.VITE_USER_PROFILE_API_BASE_URL || "/user-profile-api",
    ),
  },
});

import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import path from "path";

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  plugins: [
    devtools(),
    tsConfigPaths(),
    tanstackStart(),
    nitroV2Plugin(),
    viteReact({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
  ],
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src/client"),
      "@server": path.resolve(__dirname, "./src/server"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@controller": path.resolve(__dirname, "./src/controller"),
    },
  },
});

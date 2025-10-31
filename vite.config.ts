import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  plugins: [tsConfigPaths(), tanstackStart(), nitroV2Plugin(), viteReact()],
});

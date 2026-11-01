import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(here, "popup.html"),
        background: resolve(here, "src/background/service-worker.ts"),
        content: resolve(here, "src/content/content.ts")
      },
      output: { entryFileNames: "[name].js", chunkFileNames: "assets/[name].js", assetFileNames: "assets/[name][extname]" }
    }
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "ignore-worker-dynamic-import",
      enforce: "pre",
      transform(code) {
        // HACK: bypass static worker options. Need for nillion-client
        // Ex: Internal server error: Vite is unable to parse the worker options as the value is not static.
        // To ignore this error, please use /* @vite-ignore */ in the worker options.
        // Plugin: vite:worker-import-meta-url
        if (code.includes("new Worker(new URL")) {
          return code.replace(
            'new Worker(new URL("./worker.js", import.meta.url), opts)',
            'new Worker(new URL("./worker.js", import.meta.url), /* @vite-ignore */ opts)'
          );
        }

        return code;
      },
    },
    react(),
    tsconfigPaths(),
  ],
  // optimizeDeps: {
  //   exclude: ["@astral-sh/ruff-wasm-web"],
  // },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      "/nilchain-proxy": {
        target: "http://65.109.222.111:26657",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nilchain-proxy/, ""),
      },
    },
  },
});

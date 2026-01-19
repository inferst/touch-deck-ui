import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { build: true },
  minify: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  alias: {
    "@": "./src",
  },
});

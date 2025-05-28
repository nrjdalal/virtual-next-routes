import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "bin/index": "bin/index.ts",
  },
  format: ["esm"],
  minify: true,
  outDir: "dist",
})

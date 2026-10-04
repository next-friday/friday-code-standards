import {defineConfig} from "tsdown";

export default defineConfig({
  platform: "node",
  clean: true,
  dts: true,
  sourcemap: false,
  format: ["esm"],
  entry: {
    index: "src/index.ts",
  },
});

import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 60_000,
    fileParallelism: false,
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      },
      exclude: ["src/**/*.d.ts"],
      include: ["src/**/*.ts"],
      reporter: [
        "text",
        "html",
        [
          "lcov",
          {
            projectRoot: "../..",
          },
        ],
      ],
    },
  },
});

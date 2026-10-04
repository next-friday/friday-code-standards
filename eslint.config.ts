import {defineConfig, globalIgnores} from "eslint/config";
import friday from "@next-friday/eslint-config-friday";

export default defineConfig(
  globalIgnores([
    ".agents/**",
    ".claude/**",
    ".turbo/**",
    "**/dist/**",
    "**/fixtures/**",
    "**/build/**",
    "**/out/**",
    "**/coverage/**",
    "**/.next/**",
    "**/.turbo/**",
  ]),
  friday(),
  {
    name: "friday/dependency-cruiser-config",
    rules: {
      "sonarjs/file-name-differ-from-class": "off",
    },
    files: [".dependency-cruiser.ts"],
  },
);

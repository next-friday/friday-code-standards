---
"@next-friday/eslint-config-friday": patch
---

Turn off `unicorn/no-top-level-side-effects` for `**/*.config.{js,jsx,mjs,cjs,ts,tsx,mts,cts}` files. `eslint-plugin-unicorn` 77 reports `export default defineConfig(...)`, which is the standard form for ESLint, Vite, Vitest, and tsdown configuration files. Other modules still report top-level side effects.

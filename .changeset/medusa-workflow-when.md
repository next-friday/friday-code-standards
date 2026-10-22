---
"@next-friday/eslint-config-friday": patch
---

Turn off `promise/always-return`, `promise/catch-or-return`, and `unicorn/prefer-await` for `**/src/workflows/**/*.{js,ts}` under `medusa: true`, except `**/src/workflows/hooks/**`. Medusa workflow composition functions must stay synchronous, and the documented `when(...).then(...)` pattern registers a conditional branch rather than chaining a Promise, so these rules reported code that could not be rewritten. Workflow hook handlers keep all three rules.

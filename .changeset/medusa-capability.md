---
"@next-friday/eslint-config-friday": minor
---

Add the opt-in `medusa` capability. `medusa: true` bundles `@medusajs/eslint-plugin` and composes the rule blocks of its pinned official recommended preset, without the preset's global test ignores or parser block. Medusa convention files delegate to the framework:

- `**/src/modules/*/index.{js,ts}`: `friday/index-export-only` and `unicorn/no-top-level-side-effects` are off.
- `**/src/links/**/*.{js,ts}`: `unicorn/no-top-level-side-effects` is off.
- `**/src/modules/*/migrations/**/*.{js,ts}`: `unicorn/filename-case` is off.
- `**/src/modules/*/models/**/*.{js,ts}`: `unicorn/no-null` is off.

Consumers that composed `configs.recommended` from `@medusajs/eslint-plugin` themselves can replace it with `friday({medusa: true})`. Test files that the upstream preset ignored are now linted.

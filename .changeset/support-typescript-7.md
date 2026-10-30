---
"@next-friday/eslint-config-friday": minor
---

Support projects on TypeScript 7. `@next-friday/eslint-config-friday` now bundles TypeScript 6.0.3 for `typescript-eslint` and no longer takes `typescript` as a peer dependency, so a project's own `typescript` version does not reach the linter.

`typescript-eslint` still requires the TypeScript 6 compiler API, so type-aware rules resolve types with the bundled 6.0.3 while the project type-checks with its own `tsc`.

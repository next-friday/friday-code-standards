---
"@next-friday/eslint-config-friday": major
---

Remove the `nextjs`, `nestjs`, and `medusa` options from `FridayOptions`, together with their bundled plugins (`@next/eslint-plugin-next`, `@darraghor/eslint-plugin-nestjs-typed` with its `class-validator` peer, and `@medusajs/eslint-plugin`) and their framework-convention overrides. The package now covers languages, runtimes, and React; framework plugins are consumer-owned.

Migration: drop these options from `friday()`, install the framework's ESLint plugin, and append its config after `friday()`. Re-add any framework-convention overrides your project needs, for example `friday/component-module: "off"` for Next.js `app/**` route files, `unicorn/no-null: "off"` for NestJS or Medusa data models, or `unicorn/filename-case: "off"` for generated Medusa migrations.

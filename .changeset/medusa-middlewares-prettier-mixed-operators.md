---
"@next-friday/eslint-config-friday": patch
---

Turn off `unicorn/no-top-level-side-effects` for `**/src/api/middlewares.{js,ts}` under `medusa: true`. Medusa loads middlewares only from a default export of `defineMiddlewares(...)`, which `@medusajs/middlewares-file-location-and-name` requires and the Unicorn rule rejected, so the file could not pass lint.

Remove the `["%", "**"]` group from `@stylistic/no-mixed-operators`. Prettier removes the parentheses in `x % (2 ** 31)` and `(x ** 2) % 31`, so the group reported every Prettier-formatted file that mixes the two operators. The other operator groups are unchanged.

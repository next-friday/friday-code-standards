# @next-friday/eslint-config-friday

## 2.1.1

### Patch Changes

- 56a932f: Turn off `unicorn/no-top-level-side-effects` for `**/src/api/middlewares.{js,ts}` under `medusa: true`. Medusa loads middlewares only from a default export of `defineMiddlewares(...)`, which `@medusajs/middlewares-file-location-and-name` requires and the Unicorn rule rejected, so the file could not pass lint.

  Remove the `["%", "**"]` group from `@stylistic/no-mixed-operators`. Prettier removes the parentheses in `x % (2 ** 31)` and `(x ** 2) % 31`, so the group reported every Prettier-formatted file that mixes the two operators. The other operator groups are unchanged.

## 2.1.0

### Minor Changes

- c40684e: Add the opt-in `medusa` capability. `medusa: true` bundles `@medusajs/eslint-plugin` and composes the rule blocks of its pinned official recommended preset, without the preset's global test ignores or parser block. Medusa convention files delegate to the framework:

  - `**/src/modules/*/index.{js,ts}`: `friday/index-export-only` and `unicorn/no-top-level-side-effects` are off.
  - `**/src/links/**/*.{js,ts}`: `unicorn/no-top-level-side-effects` is off.
  - `**/src/modules/*/migrations/**/*.{js,ts}`: `unicorn/filename-case` is off.
  - `**/src/modules/*/models/**/*.{js,ts}`: `unicorn/no-null` is off.

  Consumers that composed `configs.recommended` from `@medusajs/eslint-plugin` themselves can replace it with `friday({medusa: true})`. Test files that the upstream preset ignored are now linted.

## 2.0.5

### Patch Changes

- 03e0c37: Stop enabling `sonarjs/no-wildcard-import`. The rule flagged `export * from` in library entrypoints, a standard public-API pattern for UI libraries, and its namespace-pollution concern does not apply to ES modules. Consumers that relied on the `error` severity can enable the rule in their own config.

## 2.0.4

### Patch Changes

- 03db25c: Keep source order inside each value group of `perfectionist/sort-objects` for generic object literals. The rule still groups properties by value kind (plain, string, number, boolean, array, object, other), but it no longer sorts keys alphabetically inside a group. An intentional scale such as `sm`, `md`, `lg` now stays in its declared order. Destructuring patterns, ESLint rule metadata, and ESLint Flat Config objects keep their existing order.

## 2.0.3

### Patch Changes

- 8959fe1: Turn off `unicorn/no-top-level-side-effects` for `**/*.config.{js,jsx,mjs,cjs,ts,tsx,mts,cts}` files. `eslint-plugin-unicorn` 77 reports `export default defineConfig(...)`, which is the standard form for ESLint, Vite, Vitest, and tsdown configuration files. Other modules still report top-level side effects.

## 2.0.2

### Patch Changes

- 5c12062: Scope NestJS provider registration checks to production files so test controllers no longer produce inconsistent findings, allow stateless injectable class methods and existing `ConfigurationService` names, preserve SQL `null` in NestJS contracts, and accept PascalCase React components returning Base UI `useRender()` while retaining naming checks outside React files.

## 2.0.1

### Patch Changes

- 813b4db: Resolve conflicting ESLint policies without requiring consumer suppressions: allow established `.utils.ts` filenames while retaining identifier replacements, allow React `null` contracts, align class sorting policies, permit hoisted function declarations with module ordering, and support statement-form `void` for intentionally discarded promises.

## 2.0.0

### Major Changes

- ef98fa0: Group relative imports by folder depth in `perfectionist/sort-imports`, from deepest parent paths to sibling paths. Within each depth, value imports come before type-only imports, and each depth is separated by one blank line. Existing consumers may need import ordering autofixes after upgrading.

  Add explicit file scopes for React, Next.js, NestJS, browser, and Node.js capabilities. Each capability now accepts either the existing boolean form or `{files: [...]}` so polyglot monorepos can prevent framework and runtime policy from leaking across workspace boundaries. Next.js and React compatibility rules intersect both scopes when both capabilities are enabled.

  Apply React-specific policy to JavaScript and TypeScript React modules, including `.ts` files that contain React types or custom hooks. React vocabulary such as `IconProps` is preserved while non-React Unicorn name replacements remain enforced, and React imports use named imports instead of default or namespace imports.

  Update transitive dependency resolutions for patched security releases.

## 1.0.1

### Patch Changes

- 898f528: Compose the pinned official Next.js Core Web Vitals preset directly, delegate module-structure semantics to Next.js in framework convention files when React is enabled, keep ordinary React modules under the generic `friday/component-module` policy, and update the bundled Next Friday ESLint plugin to 1.0.1.

## 1.0.0

### Major Changes

- e8e82c8: First Release.

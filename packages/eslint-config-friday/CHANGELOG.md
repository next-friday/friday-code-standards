# @next-friday/eslint-config-friday

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

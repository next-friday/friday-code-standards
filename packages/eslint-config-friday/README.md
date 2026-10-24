# @next-friday/eslint-config-friday

[![npm version](https://img.shields.io/npm/v/%40next-friday%2Feslint-config-friday.svg)](https://www.npmjs.com/package/@next-friday/eslint-config-friday) [![CI](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/next-friday/friday-code-standards/branch/main/graph/badge.svg)](https://codecov.io/gh/next-friday/friday-code-standards/branch/main) [![License](https://img.shields.io/github/license/next-friday/friday-code-standards.svg)](../../LICENSE)

One strict Flat Config for JavaScript, TypeScript, React, Node.js, tests, and structured data—with project context explicit instead of inferred.

- Strict and type-aware by default.
- Project context is opt-in and visible in configuration.
- One policy surface covers source code, tests, package manifests, and common data formats.

## Usage

```js
import friday from "@next-friday/eslint-config-friday";

export default friday();
```

Browser and Node globals are available by default.

### React context

| Option  | Default | Contract                                                       |
| :------ | :------ | :------------------------------------------------------------- |
| `react` | `false` | Enable Next Friday React, JSX accessibility, and Hooks policy. |

```js
import friday from "@next-friday/eslint-config-friday";

export default friday({
  react: true,
});
```

### Monorepo scopes

Runtime and React capabilities can be scoped to workspace paths with `files`. The scope is intersected with each capability's own file patterns, so React, browser, and Node.js policy do not leak across applications. Boolean options remain supported for single-context projects.

```js
import friday from "@next-friday/eslint-config-friday";

export default friday({
  browser: {files: ["apps/web/**"]},
  node: {files: ["apps/api/**"]},
  react: {files: ["apps/web/**"]},
});
```

With `react: true`, Next Friday also enforces deterministic component contracts: named components use function declarations, component props use the canonical `props` parameter and `rest` rest binding, and TypeScript `index.*` component entrypoints expose the canonical compound API and matching `ComponentProps` namespace.

### Frameworks

This package covers languages, runtimes, and React. Framework plugins such as Next.js, NestJS, or Medusa are consumer-owned: install the framework's ESLint plugin and append its config after `friday()`, followed by any overrides your framework's file conventions need.

```js
import nextPlugin from "@next/eslint-plugin-next";
import {defineConfig} from "eslint/config";
import friday from "@next-friday/eslint-config-friday";

export default defineConfig(
  friday({react: true}),
  {
    plugins: {"@next/next": nextPlugin},
    rules: nextPlugin.configs["core-web-vitals"].rules,
  },
  {
    files: ["app/**/{page,layout}.tsx"],
    rules: {"friday/component-module": "off"},
  },
);
```

## Policy coverage

| Area                                    | Enabled by default |
| :-------------------------------------- | :----------------: |
| JavaScript and TypeScript correctness   |         ✅         |
| Type-aware TypeScript rules             |         ✅         |
| Node.js runtime rules                   |         ✅         |
| Imports and deterministic ordering      |         ✅         |
| Promise, RegExp, and code-quality rules |         ✅         |
| JSDoc and ESLint directive governance   |         ✅         |
| Vitest test files                       |         ✅         |
| JSON / JSONC / JSON5                    |         ✅         |
| YAML and TOML                           |         ✅         |
| Markdown                                |         ✅         |
| `package.json`                          |         ✅         |
| React / JSX accessibility / Hooks       |    with `react`    |
| Browser globals                         |         ✅         |

Targeted `eslint-disable` directives are allowed when narrow and described. Unused suppression directives are reported.

## Project-specific ignores

Use ESLint's `globalIgnores()` for generated, vendor, or project-owned paths:

```js
import {defineConfig, globalIgnores} from "eslint/config";
import friday from "@next-friday/eslint-config-friday";

export default defineConfig(globalIgnores(["dist/**", "coverage/**"]), friday());
```

## Formatting boundary

ESLint owns diagnostics, semantic fixes, code quality, and non-conflicting structural rules.

[`@next-friday/prettier-config-friday`](../prettier-config-friday) owns layout formatting such as indentation, quotes, wrapping, and semicolons.

## Compatibility

| Surface                   | Supported contract |
| :------------------------ | :----------------- |
| Node.js                   | `>=24.15.0`        |
| ESLint                    | `^10.4.0`          |
| TypeScript                | `>=4.8.4 <6.1.0`   |
| Module format             | ESM only           |
| ESLint configuration      | Flat Config        |
| `eslint.config.ts` loader | `jiti >=2.2.0`     |

## Troubleshooting

### TypeScript files are outside the project

Run ESLint from the project root and ensure the files are included by the controlling `tsconfig.json`.

### Generated files keep reporting diagnostics

Add project-owned generated paths with `globalIgnores()` rather than file-local suppression comments.

## License

[MIT](../../LICENSE) © Next Friday

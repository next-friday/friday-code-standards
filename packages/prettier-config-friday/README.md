# @next-friday/prettier-config-friday

[![npm version](https://img.shields.io/npm/v/%40next-friday%2Fprettier-config-friday.svg)](https://www.npmjs.com/package/@next-friday/prettier-config-friday) [![CI](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/next-friday/friday-code-standards/branch/main/graph/badge.svg)](https://codecov.io/gh/next-friday/friday-code-standards/branch/main) [![License](https://img.shields.io/github/license/next-friday/friday-code-standards.svg)](../../LICENSE)

One deterministic formatting contract for application code and shell scripts—no per-repository style drift.

- Stable formatting decisions are encoded once.
- Shell formatting ships with the same contract.
- Layout stays separate from ESLint diagnostics and semantic policy.

## Usage

Reference the package directly:

```json
{
  "prettier": "@next-friday/prettier-config-friday"
}
```

A standalone Prettier config can reference the same package:

```json
"@next-friday/prettier-config-friday"
```

Or re-export it from an ESM config:

```js
import fridayPrettier from "@next-friday/prettier-config-friday";

export default fridayPrettier;
```

## Formatting contract

| Option            | Value                       |
| :---------------- | :-------------------------- |
| Arrow parameters  | Omit parentheses when valid |
| Bracket same line | `false`                     |
| Bracket spacing   | `false`                     |
| End of line       | `lf`                        |
| JSX quotes        | Double                      |
| Print width       | `100`                       |
| Semicolons        | Enabled                     |
| String quotes     | Double                      |
| Tab width         | `2`                         |
| Trailing commas   | Wherever valid              |
| Tabs              | Spaces                      |

The package bundles `prettier-plugin-sh`, so shell scripts and Husky hook files use the same formatting contract.

## ESLint boundary

[`@next-friday/eslint-config-friday`](../eslint-config-friday) is designed to work alongside this config.

Prettier owns layout formatting. ESLint owns diagnostics, code quality, semantic fixes, and non-conflicting structural rules. Run them as independent tools.

## Compatibility

| Surface       | Supported contract |
| :------------ | :----------------- |
| Node.js       | `>=24.15.0`        |
| Prettier      | `>=3.6.0 <4.0.0`   |
| Module format | ESM                |

## License

[MIT](../../LICENSE) © Next Friday

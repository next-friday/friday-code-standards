# @next-friday/commitlint-config-friday

[![npm version](https://img.shields.io/npm/v/%40next-friday%2Fcommitlint-config-friday.svg)](https://www.npmjs.com/package/@next-friday/commitlint-config-friday) [![CI](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/next-friday/friday-code-standards/branch/main/graph/badge.svg)](https://codecov.io/gh/next-friday/friday-code-standards/branch/main) [![License](https://img.shields.io/github/license/next-friday/friday-code-standards.svg)](../../LICENSE)

One strict Conventional Commit contract that keeps repository history predictable, machine-readable, and automation-friendly.

- Scope is explicit and required.
- Commit shape is deterministic instead of team-dependent.
- The package owns policy; repositories remain free to choose their hook and CI integration.

## Usage

Extend the config directly:

```json
{
  "extends": ["@next-friday/commitlint-config-friday"]
}
```

Or re-export it from an ESM config:

```js
import fridayCommitlint from "@next-friday/commitlint-config-friday";

export default fridayCommitlint;
```

The package defines policy only. Hook and CI integration remain owned by the consuming repository.

## Commit contract

```text
<type>(<scope>): <subject>
```

Examples:

```text
feat(api): add booking endpoint
fix(ui): handle empty state
docs(readme): clarify usage
```

Scope is required and lowercase. Subject is required, limited to 50 characters, may not end in a period, and may not use `!` breaking-change syntax.

Allowed types:

`build` · `chore` · `ci` · `docs` · `feat` · `fix` · `perf` · `refactor` · `revert` · `style` · `test`

Commit bodies and footers are not allowed.

## Enforced rules

| Rule                       | Requirement                              |
| :------------------------- | :--------------------------------------- |
| `body-empty`               | Commit body must be empty                |
| `footer-empty`             | Commit footer must be empty              |
| `scope-case`               | Scope must be lowercase                  |
| `scope-empty`              | Scope is required                        |
| `subject-empty`            | Subject is required                      |
| `subject-exclamation-mark` | `!` breaking-change syntax is prohibited |
| `subject-max-length`       | Subject is at most 50 characters         |
| `type-case`                | Type must be lowercase                   |
| `type-empty`               | Type is required                         |
| `type-enum`                | Type must be one of the allowed values   |

The extended Conventional Commits preset also rejects disallowed subject capitalization, trailing periods, oversized headers, and leading or trailing header whitespace.

## Compatibility

| Surface         | Supported contract |
| :-------------- | :----------------- |
| Node.js         | `>=24.15.0`        |
| @commitlint/cli | `>=19.0.0`         |
| Module format   | ESM                |

## License

[MIT](../../LICENSE) © Next Friday

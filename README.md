# Next Friday Code Standards

[![CI](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-code-standards/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/next-friday/friday-code-standards/branch/main/graph/badge.svg)](https://codecov.io/gh/next-friday/friday-code-standards/branch/main) [![License](https://img.shields.io/github/license/next-friday/friday-code-standards.svg)](LICENSE)

One shared engineering contract for linting, formatting, and commit history across Next Friday JavaScript and TypeScript repositories.

Encode policy once. Keep repository behavior deterministic without rebuilding the same standards in every codebase.

## Packages

| Package                                                                      | Purpose                                                                                                                                  |
| :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| [`@next-friday/eslint-config-friday`](packages/eslint-config-friday)         | Strict ESLint Flat Config for JavaScript, TypeScript, React, Next.js, NestJS, Node.js, browser projects, tests, and common data formats. |
| [`@next-friday/prettier-config-friday`](packages/prettier-config-friday)     | Shared Prettier configuration, including shell formatting.                                                                               |
| [`@next-friday/commitlint-config-friday`](packages/commitlint-config-friday) | Conventional Commit policy for commit messages.                                                                                          |

## Usage

### ESLint

```js
import friday from "@next-friday/eslint-config-friday";

export default friday();
```

Browser and Node globals are available by default. Opt into framework policy explicitly:

```js
export default friday({
  react: true,
  nextjs: true,
});
```

`nextjs: true` composes the bundled official Next.js Core Web Vitals policy. When `react: true` and `nextjs: true` are enabled together, Next.js convention files delegate module-structure semantics to Next.js while ordinary React modules keep the strict `friday/component-module` policy. `nestjs: true` adds the bundled NestJS typed recommended policy. React remains a separate explicit capability.

### Prettier

```json
{
  "prettier": "@next-friday/prettier-config-friday"
}
```

The package can also be referenced from a Prettier config file.

### Commitlint

```json
{
  "extends": ["@next-friday/commitlint-config-friday"]
}
```

The commit contract is `<type>(<scope>): <subject>`; scope is required and lowercase.

## Compatibility

| Tool            | Supported range  |
| :-------------- | :--------------- |
| Node.js         | `>=24.15.0 <25`  |
| ESLint          | `^10.4.0`        |
| TypeScript      | `>=4.8.4 <6.1.0` |
| Prettier        | `>=3.6.0 <4.0.0` |
| @commitlint/cli | `>=19.0.0`       |

See each package README for its complete public contract and behavior.

## License

[MIT](LICENSE) © Next Friday

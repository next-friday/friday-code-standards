# Contributing to Next Friday Code Standards

Use this guide to prepare changes to the Next Friday code standards packages.

This workspace contains three packages: `@next-friday/eslint-config-friday`, `@next-friday/prettier-config-friday`, and `@next-friday/commitlint-config-friday`.

## Code of conduct

Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites

- Use the Node.js version declared by `.nvmrc` and `package.json#engines`.
- Use the pnpm version declared by `package.json#packageManager` through Corepack.

From the repository root:

```sh
corepack enable
pnpm install
```

## Quality standards

- Fix lint, type, test, formatting, and packaging failures at their root cause.
- Keep exports, dependencies, and implementation live. Remove dead code instead of retaining placeholders.
- Edit package source under `packages/*/src/` and tests under each package's existing `test/` directory.
- Keep ESLint fixtures under `packages/eslint-config-friday/fixtures/`.
- Treat `packages/*/dist/` as generated output.
- Keep dependency upgrades separate from policy changes. An upstream preset update must not silently enable new rules.

## Verification

Run the narrowest check that covers the change. Run `pnpm verify` before submitting package-wide changes.

Common checks:

- `pnpm lint:check`: lint
- `pnpm typecheck`: type checking
- `pnpm test`: unit and behavior tests
- `pnpm format:check`: formatting and EditorConfig
- `pnpm knip`: dead-code analysis
- `pnpm depcruise`: dependency architecture
- `pnpm peers:check`: peer dependency contract
- `pnpm check:publint`: package manifest and file validation
- `pnpm check:attw`: package type-resolution validation

For documentation-only changes, check local links and anchors manually and run `pnpm format:check`. Do not report CI-owned checks as local successes.

## Release intent

Use [`.changeset/README.md`](.changeset/README.md) to determine whether the change needs a changeset.

## Pull requests

- Use `<type>(<scope>): <subject>` for commit messages and pull request titles.
- Keep each pull request focused on one cohesive change.
- Describe observable package or policy effects.
- Report only checks that actually ran and include their results.
- Keep squash-merge subjects within the shared Commitlint contract.
- Add the `preview` label only when you want the Preview workflow to publish preview builds.

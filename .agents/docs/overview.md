# Next Friday Code Standards: Overview

Purpose, audience, and design stance of the Next Friday Code Standards repository.

## What This Repository Is

`friday-code-standards` is a public repository with a private root pnpm workspace containing three packages:

- [`@next-friday/eslint-config-friday`](../../packages/eslint-config-friday/README.md) — ESLint 10 Flat Config standard for JavaScript, TypeScript, React, Next.js, NestJS, Node.js, browser, tests, and supported data/document formats.
- [`@next-friday/prettier-config-friday`](../../packages/prettier-config-friday/README.md) — shared Prettier configuration.
- [`@next-friday/commitlint-config-friday`](../../packages/commitlint-config-friday/README.md) — Commitlint configuration for Next Friday commit-message policy.

The repository keeps shared engineering standards authored once and consumed by multiple projects.

| Surface                    | Consumed by                      | Source entrypoint                                |
| :------------------------- | :------------------------------- | :----------------------------------------------- |
| ESLint package             | JavaScript / TypeScript projects | `packages/eslint-config-friday/src/index.ts`     |
| Prettier package           | Projects using Prettier          | `packages/prettier-config-friday/src/index.ts`   |
| Commitlint package         | Projects validating commits      | `packages/commitlint-config-friday/src/index.ts` |
| Repository operating rules | Contributors and coding agents   | `AGENTS.md`, `.agents/rules/`                    |

Each package manifest's `exports` map defines the supported consumer boundary and exposes the built `dist/` entrypoint; the source entrypoints above stay inside the workspace. Root self-lint exercises the built workspace package but is not byte-for-byte identical to a consumer calling `friday()`; the root-only differences are in [`architecture.md`](architecture.md).

## Who Consumes It

- Application and service repositories that need a shared JavaScript/TypeScript policy.
- React, Next.js, and NestJS projects that enable the relevant factory context.
- Projects that need shared formatting or commit-message policy.
- This repository itself, which uses the packages as part of its local and CI toolchain.

Consumer usage and compatibility live in the package READMEs. This document describes repository intent.

## Design Stance

| Commitment                            | Consequence                                                                                                                                      |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Explicit ESLint policy**            | Enabled diagnostic rules, severities, options, and scopes are selected in Next Friday source rather than inherited from upstream plugin presets. |
| **Dependency update ≠ policy update** | A plugin upgrade must not silently enable a new rule. New policy requires an explicit source diff.                                               |
| **Plugin-first implementation**       | Use maintained plugin rules before custom implementations.                                                                                       |
| **Type-aware TypeScript**             | Type-aware diagnostics use TypeScript `projectService`.                                                                                          |
| **Governed suppression**              | Targeted ESLint suppressions may be used when justified and described; stale or broad suppressions are rejected.                                 |
| **Private internals**                 | Consumers receive supported package entrypoints, not internal config modules or implementation details.                                          |
| **Deterministic ordering policy**     | Perfectionist owns configured import/object/type ordering rather than leaving ordering to review preference.                                     |

The policy stance protects consumers from silent policy expansion when a dependency release adds a rule to its preset. For shared vocabulary, see [`CONTEXT.md`](../../CONTEXT.md); the policy mechanism and the `eslint-config-prettier/flat` exception are in [`architecture.md`](architecture.md).

## Verification

Runtime and peer ranges are declared in each package manifest. Repository Node and pnpm pins live in [`.nvmrc`](../../.nvmrc), root `package.json#engines`, `package.json#devEngines`, and `package.json#packageManager`.

The repository provides `pnpm verify` as the complete local verification contract: root and package lint/typecheck, Prettier and EditorConfig formatting, manifest ordering, peer dependency contracts, coverage tests, dead-code analysis, dependency architecture, builds, Publint, and AreTheTypesWrong. For material pushes, pre-push scans outgoing commits with Gitleaks and then runs `pnpm verify`. CI uses full verification for normal code/configuration pull requests and a narrower Release Integrity path for Changesets version pull requests; Zizmor is advisory for workflow changes. The publish path runs `pnpm verify` before packing and publishing. PR-title validation runs on `pull_request` for both human and Changesets-generated PRs.

Architecture and exact ESLint evaluation order live in [`architecture.md`](architecture.md).

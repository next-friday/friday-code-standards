# Repository Guidelines

## Agent Guidelines

- **Command Authority**: Read-only inspection and non-mutating verification commands needed to complete a requested task are permitted, including file reads/searches, `git status`, `git diff`, build, lint checks, type checks, tests, formatting checks, Knip, Publint, and AreTheTypesWrong. Dependency installation, network-dependent commands, destructive commands, and other state-changing CLI actions require explicit authorization.
- **Git Authority**: Never stage, commit, push, publish, or rewrite Git state without explicit authorization.
- **Diagnostics & Reporting**: Report the exact scope and checks that actually ran. Distinguish verified results from unverified assumptions. Do not report Git hooks or CI as local successes.
- **Working-Tree Authority**: Explicit current user requirements come first. Otherwise inspect the current working tree immediately before editing; do not infer current behavior from memory or Git history.
- **History Boundary**: Do not inspect Git history during ordinary audits or implementation work unless the user explicitly asks for historical investigation or history is required to answer the request. A current-tree audit must stay current-tree only.
- **Rule Preflight**: Before choosing an implementation or editing, identify affected paths and read the applicable repository rules below. If an applicable rule conflicts with an explicit current requirement, the current requirement wins.
- **Workflow Pointers**: PRs → [CONTRIBUTING.md](CONTRIBUTING.md), releases → [`.changeset/README.md`](.changeset/README.md), documentation → [`.agents/docs/index.md`](.agents/docs/index.md).

## Always-On Invariants

- **Direct & Minimal**: YAGNI and SSOT first. Prefer one concrete implementation over speculative wrappers or fallback branches. Fix root causes.
- **Platform First**: Native APIs and stdlib before external packages. Reuse existing lockfile dependencies.
- **Intentional Internal Barrels Only**: Do not create convenience public barrels. The ESLint package intentionally uses private `src/configs/index.ts` as the factory import boundary; keep it private.
- **Sibling Symmetry**: Sibling packages and modules should use consistent naming, structure, lifecycle scripts, and manifest conventions unless a verified technical requirement requires a difference.

## Source & Architecture

- **Source files**: `packages/*/src/` builds to generated `dist/` via `tsdown`. Edit source and tests; keep `dist/` generated.
- **Root lint**: `eslint.config.ts` consumes the built ESLint package. Turbo makes root lint depend on package build.
- **Shared ESLint patterns**: Keep cross-cutting extensions and file globs in `packages/eslint-config-friday/src/globs.ts`.
- **Explicit ESLint policy**: Next Friday config modules own the policy surface (see [CONTEXT.md](CONTEXT.md)). Upstream presets are references, never policy authority; a dependency update must not silently enable a new rule.
- **Plugin-first implementation**: Prefer existing maintained plugin rules when they correctly enforce a requirement. This repository owns rule enablement, severity, options, and file scopes.
- **Policy Changes**: Newly enabled rules, stricter severities/options, and wider lint scope are breaking consumer changes under the ESLint package versioning policy.
- **Architecture**: For package topology, ESLint composition, evaluation order, policy ownership, or distribution, read [`.agents/docs/architecture.md`](.agents/docs/architecture.md). Review [`.agents/adr/`](.agents/adr/) before recording a durable architecture decision.
- **Shared vocabulary**: Read [CONTEXT.md](CONTEXT.md) when defining or changing terms, or when wording standards or policy for consumers.

## Rule Files & Skills

Repository invariants live in [`.agents/rules/`](.agents/rules/); use the task-trigger table to select rules for each change (`.claude/rules/` is a symlink):

| Trigger                    | Rule files                                                                                                                          |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| Package or module creation | `new-component.md`, `single-author-style.md`; `export-boundaries.md` for the ESLint package                                         |
| Source files or exports    | `diagnostics-and-error-handling.md`, `typescript-first.md`, `single-author-style.md`; `export-boundaries.md` for the ESLint package |
| Tests or fixtures          | `deterministic-testing.md`                                                                                                          |
| Manifests or dependencies  | `dependency-security.md`, `demand-driven-configuration.md`                                                                          |
| Configuration files        | `demand-driven-configuration.md`                                                                                                    |
| Hooks or workflows         | `toolchain-and-runtime.md`                                                                                                          |
| Implementation choices     | `current-state-authority.md`, `typescript-first.md`                                                                                 |

Repository skills → [`.agents/skills/`](.agents/skills/) when a skill description matches the task (`.claude/skills/` is a symlink).

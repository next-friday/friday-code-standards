# AI Agent Repository Context

Internal reference documents for AI coding agents working in this repository. Follow [`AGENTS.md`](../../AGENTS.md) for binding instructions. These files provide repository context and do not define public package usage documentation.

| Branch trigger                                      | Document                                                                                                       | Scope                                                          |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| Purpose, audience, package boundaries               | [`overview.md`](overview.md)                                                                                   | What this workspace contains and how responsibility is divided |
| Monorepo topology, composition, build, verification | [`architecture.md`](architecture.md)                                                                           | Workspace structure and distribution                           |
| Shared vocabulary                                   | [`../../CONTEXT.md`](../../CONTEXT.md)                                                                         | Terms used across the standards packages                       |
| Package source-layout decision                      | [`../adr/0001-flat-symmetric-package-config-sources.md`](../adr/0001-flat-symmetric-package-config-sources.md) | Why public symmetry does not require identical internals       |

Adjacent owners:

- Package-user documentation: [`../../packages/eslint-config-friday/README.md`](../../packages/eslint-config-friday/README.md), [`../../packages/prettier-config-friday/README.md`](../../packages/prettier-config-friday/README.md), [`../../packages/commitlint-config-friday/README.md`](../../packages/commitlint-config-friday/README.md)
- Contributor workflow: [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)
- Repository invariants: [`.agents/rules/`](../../.agents/rules/)
- Release flow: [`.changeset/README.md`](../../.changeset/README.md)
- Security and conduct: [`SECURITY.md`](../../SECURITY.md), [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md)

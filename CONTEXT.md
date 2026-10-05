# Next Friday Code Standards Vocabulary

Shared vocabulary for the expectations Next Friday projects adopt for code diagnostics, file formatting, and commit messages.

## Language

**Standard**

The shared requirements for lint findings, file presentation, or commit-message acceptance that a consumer project adopts.

_Avoid_: Preset, unless referring specifically to an upstream tool's named preset.

**Consumer project**

A repository that adopts one or more standards maintained by Next Friday in its development workflow.

_Avoid_: Downstream repository, which implies repository topology rather than adoption.

**Policy**

The expectations that determine acceptance within one standard area: lint findings, file formatting, or commit messages.

_Avoid_: Rule, when referring to the complete policy rather than one individual check.

**Policy surface**

The exact enabled rule IDs, severities, options, and file scopes that a Next Friday configuration exposes to consumers.

**Upstream preset**

A plugin- or tool-maintained configuration such as `recommended`, `strict`, or `all`.

**Explicit ESLint policy**

Next Friday config modules are the policy authority for capability selection, file scopes, severities, options, and local overrides. A capability may intentionally compose a pinned official framework preset when tracking that preset is the contract; Next Friday-specific deltas remain explicit in source.

**Plugin-first implementation**

Maintained plugin rules are preferred before custom implementations.

**Capability config**

A private module under the ESLint package's `src/configs/` that owns one linting concern and is composed by the package factory.

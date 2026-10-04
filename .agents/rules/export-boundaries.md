# Export Boundaries Rules

Keep supported interfaces explicit and stable at real consumer boundaries while preserving encapsulation inside the project that owns them.

## Canonical Public Contract

- Maintain designated public entrypoints as the canonical contract for each published package, application interface, or module intentionally consumed outside its owner.
- Apply export rules at declared boundaries; keep internal-only modules governed by their local conventions.
- Export complete, supported interfaces that consumers can rely on; keep implementation details private.
- Keep internal helpers, registries, third-party implementation objects, and private sibling symbols out of public interfaces unless consumers need them as part of the documented contract.

## Package Manifest Boundaries

- Where package metadata controls a public surface, declare supported entrypoints and map them to the appropriate build outputs using the ecosystem's conventions.
- Keep internal directories private; use wildcard exports only when they are an intentional, supported part of the public contract.
- Publish type information when a TypeScript package or another consumer contract requires it.

## Module Encapsulation

- Keep internal types, constants, and utilities close to the implementation that owns them.
- Share values across package or application boundaries through an intentional interface rather than importing another project's private source files.
- Encapsulate third-party dependencies behind the project boundary that owns their use.

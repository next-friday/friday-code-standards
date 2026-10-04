# Keep package entrypoints explicit and capability configs private

## Context

The workspace contains ESLint, Prettier, and Commitlint configuration packages with different internal complexity. ESLint needs a factory and capability-specific modules, while Prettier and Commitlint expose smaller static configuration objects. Requiring identical internal directory shapes would add structure without improving the public contract.

## Decision

Keep each package's source layout proportional to its implementation while preserving one public `dist/index` entrypoint per package. ESLint keeps `src/index.ts`, `src/factory.ts`, and private capability modules under `src/configs/`; Prettier and Commitlint keep `src/index.ts` with their static configuration in `src/config.ts`. Internal configuration modules remain private.

## Consequences

- Public package entrypoints stay symmetric even when internal complexity differs.
- Internal config modules can evolve without becoming supported consumer imports.
- Sibling packages share lifecycle and distribution conventions without artificial directory symmetry.

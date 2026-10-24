# Keep framework plugins consumer-owned

## Context

`@next-friday/eslint-config-friday` bundled framework capabilities for Next.js, NestJS, and Medusa. Each one added a framework plugin dependency, file globs, compatibility overrides for Friday rules, tests, and documentation that had to track upstream releases. The set of frameworks is unbounded, and maintaining each capability delayed consumers waiting for Friday releases to adopt framework plugin updates.

## Decision

Scope the package to languages, runtimes, and the UI layer: JavaScript, TypeScript, Node.js, browser globals, React and JSX, tests, and supported data formats. Framework plugins, their presets, and the overrides their file conventions need are consumer-owned and composed after `friday()` in the consumer's config. React stays in scope because Next Friday's own plugin enforces React policy and React underlies many frameworks.

## Consequences

- Requests to add a framework capability are out of scope.
- The package no longer depends on framework plugins or tracks their releases.
- Consumers configure framework plugins and resolve framework-convention conflicts with Friday rules in their own config.

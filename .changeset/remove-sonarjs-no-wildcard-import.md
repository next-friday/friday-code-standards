---
"@next-friday/eslint-config-friday": patch
---

Stop enabling `sonarjs/no-wildcard-import`. The rule flagged `export * from` in library entrypoints, a standard public-API pattern for UI libraries, and its namespace-pollution concern does not apply to ES modules. Consumers that relied on the `error` severity can enable the rule in their own config.

---
"@next-friday/eslint-config-friday": patch
---

Scope NestJS provider registration checks to production files so test controllers no longer produce inconsistent findings, allow stateless injectable class methods and existing `ConfigurationService` names, preserve SQL `null` in NestJS contracts, and accept PascalCase React components returning Base UI `useRender()` while retaining naming checks outside React files.

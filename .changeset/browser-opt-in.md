---
"@next-friday/eslint-config-friday": major
---

Make browser globals opt-in: `friday()` no longer enables the `friday/browser/globals` config, so `window`, `document`, and other browser globals report `no-undef`. Node globals stay enabled by default.

Migration: pass `browser: true` (or `browser: {files: [...]}` to scope it to workspace paths) to `friday()` in projects that run in the browser.

Remove `sonarjs/no-os-command-from-path` from the enabled SonarJS policy.

Remove the SonarJS rules that `eslint-plugin-sonarjs` 4.2.2 marks as deprecated: `sonarjs/conditional-indentation`, `sonarjs/confidential-information-logging`, `sonarjs/frame-ancestors`, `sonarjs/hidden-files`, `sonarjs/no-intrusive-permissions`, `sonarjs/no-ip-forward`, `sonarjs/no-mixed-content`, `sonarjs/no-redundant-parentheses`, `sonarjs/no-tab`, `sonarjs/no-unsafe-unzip`, `sonarjs/os-command`, `sonarjs/useless-string-operation`, and `sonarjs/web-sql-database`.

Update `eslint-plugin-unicorn` to 79.0.0. `unicorn/no-top-level-side-effects` now reports mutations of globals, such as `document.title = "x"` and `Object.assign(globalThis, …)`, including in declarations and default exports, and no longer reports unknown top-level calls. Several Unicorn autofixes that could change behavior are now suggestions.

Update `eslint-plugin-antfu` to 3.3.1, `eslint-plugin-package-json` to 1.12.0, `@eslint-react/eslint-plugin` to 5.28.8, `typescript-eslint` and `@typescript-eslint/parser` to 8.72.1, `@vitest/eslint-plugin` to 1.6.28, and `eslint-plugin-jsdoc` to 65.4.2. New upstream rules stay disabled.

Enable `@eslint-community/eslint-comments/no-use` with `allow: ["eslint-disable", "eslint-disable-line", "eslint-disable-next-line", "eslint-enable"]`, so inline configuration comments such as `/* eslint */`, `/* global */`, `/* exported */`, and `/* eslint-env */` are reported. Enable `@eslint-community/eslint-comments/no-restricted-disable` with `@eslint-community/eslint-comments/*`, so directive-policy rules cannot be disabled. Remove `unicorn/no-abusive-eslint-disable`, which duplicates `@eslint-community/eslint-comments/no-unlimited-disable`.

Migration: replace inline configuration comments with flat config entries in `eslint.config.*`, such as `languageOptions.globals` for `/* global */`.

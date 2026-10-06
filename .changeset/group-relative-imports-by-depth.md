---
"@next-friday/eslint-config-friday": major
---

Group relative imports by folder depth in `perfectionist/sort-imports`, from deepest parent paths to sibling paths. Within each depth, value imports come before type-only imports, and each depth is separated by one blank line. Existing consumers may need import ordering autofixes after upgrading.

Add explicit file scopes for React, Next.js, NestJS, browser, and Node.js capabilities. Each capability now accepts either the existing boolean form or `{files: [...]}` so polyglot monorepos can prevent framework and runtime policy from leaking across workspace boundaries. Next.js and React compatibility rules intersect both scopes when both capabilities are enabled.

Apply React-specific policy to JavaScript and TypeScript React modules, including `.ts` files that contain React types or custom hooks. React vocabulary such as `IconProps` is preserved while non-React Unicorn name replacements remain enforced, and React imports use named imports instead of default or namespace imports.

Update transitive dependency resolutions for patched security releases.

---
"@next-friday/eslint-config-friday": patch
---

Update `@next-friday/eslint-plugin-friday` to 1.1.3. `friday/jsx-newline-between-elements` no longer requires empty lines around Prettier's inline JSX whitespace separator `{" "}`, so inline text with multi-line links (for example `Head over to{" "}<a>…</a>{" "}center.`) passes both ESLint and Prettier instead of oscillating between their fixes.

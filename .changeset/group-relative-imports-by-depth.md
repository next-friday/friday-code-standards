---
"@next-friday/eslint-config-friday": major
---

Group relative imports by folder depth in `perfectionist/sort-imports`, from deepest parent paths to sibling paths. Within each depth, value imports come before type-only imports, and each depth is separated by one blank line. Existing consumers may need import ordering autofixes after upgrading.

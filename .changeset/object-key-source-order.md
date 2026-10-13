---
"@next-friday/eslint-config-friday": patch
---

Keep source order inside each value group of `perfectionist/sort-objects` for generic object literals. The rule still groups properties by value kind (plain, string, number, boolean, array, object, other), but it no longer sorts keys alphabetically inside a group. An intentional scale such as `sm`, `md`, `lg` now stays in its declared order. Destructuring patterns, ESLint rule metadata, and ESLint Flat Config objects keep their existing order.

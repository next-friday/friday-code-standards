---
"@next-friday/commitlint-config-friday": minor
---

Align the commit contract with agent workflows such as pstack:

- A footer may contain `Co-Authored-By: Name <email>` trailers. The new `footer-co-authored-by-only` rule replaces `footer-empty` and still rejects any other footer line, such as `BREAKING CHANGE:` or `Refs:`.
- A body is allowed up to 100 characters. `body-max-length` replaces `body-empty`, so a one-line note passes and a long body fails.
- `wip` is an allowed type, and a `wip` commit may omit the scope. `scope-empty-except-wip` replaces `scope-empty`.

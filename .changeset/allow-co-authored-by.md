---
"@next-friday/commitlint-config-friday": major
---

Allow co-author trailers, one-line bodies, and `wip` commits, and require `@commitlint/cli` 21 or later.

- Breaking: the `@commitlint/cli` peer range is now `>=21.0.0`. Earlier versions parse a `Co-Authored-By` trailer as body text, so the footer rule cannot check it. Upgrade `@commitlint/cli` to 21 before you upgrade this package.
- A footer may contain `Co-Authored-By: Name <email>` trailers. The new `footer-co-authored-by-only` rule replaces `footer-empty` and still rejects any other footer line, such as `BREAKING CHANGE:` or `Refs:`.
- A body is allowed up to 100 characters. `body-max-length` replaces `body-empty`, so a one-line note passes and a long body fails.
- `wip` is an allowed type for checkpoint commits, such as `wip(api): save progress`.

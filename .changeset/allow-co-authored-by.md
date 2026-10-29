---
"@next-friday/commitlint-config-friday": minor
---

Allow `Co-Authored-By: Name <email>` trailers in the commit footer. The new `footer-co-authored-by-only` rule replaces `footer-empty` and rejects any other footer line, such as `BREAKING CHANGE:` or `Refs:`. Commit bodies stay disallowed.

---
"@next-friday/commitlint-config-friday": minor
---

Stop restricting the commit body and footer beyond the Conventional Commits preset. Remove `body-max-length` and `footer-co-authored-by-only`; `@commitlint/config-conventional` now alone governs the body and footer, including its 100-character line limit. Any footer trailer now passes, including the `Claude-Session: https://…` trailer that Claude Code on the web appends. Header rules are unchanged.

# @next-friday/commitlint-config-friday

## 5.2.0

### Minor Changes

- 0568672: Stop restricting the commit body and footer beyond the Conventional Commits preset. Remove `body-max-length` and `footer-co-authored-by-only`; `@commitlint/config-conventional` now alone governs the body and footer, including its 100-character line limit. Any footer trailer now passes, including the `Claude-Session: https://…` trailer that Claude Code on the web appends. Header rules are unchanged.

## 4.0.0

### Major Changes

- e88ca9a: Allow co-author trailers, one-line bodies, and `wip` commits, and require `@commitlint/cli` 21 or later.

  - Breaking: the `@commitlint/cli` peer range is now `>=21.0.0`. Earlier versions parse a `Co-Authored-By` trailer as body text, so the footer rule cannot check it. Upgrade `@commitlint/cli` to 21 before you upgrade this package.
  - A footer may contain `Co-Authored-By: Name <email>` trailers. The new `footer-co-authored-by-only` rule replaces `footer-empty` and still rejects any other footer line, such as `BREAKING CHANGE:` or `Refs:`.
  - A body is allowed up to 100 characters. `body-max-length` replaces `body-empty`, so a one-line note passes and a long body fails.
  - `wip` is an allowed type for checkpoint commits, such as `wip(api): save progress`.

## 3.0.1

No changes in this release.

## 3.0.0

No changes in this release.

## 2.1.2

No changes in this release.

## 2.1.1

No changes in this release.

## 2.1.0

No changes in this release.

## 2.0.5

No changes in this release.

## 2.0.4

No changes in this release.

## 2.0.3

No changes in this release.

## 2.0.2

No changes in this release.

## 2.0.1

No changes in this release.

## 2.0.0

No changes in this release.

## 1.0.1

No changes in this release.

## 1.0.0

### Major Changes

- e8e82c8: First Release.

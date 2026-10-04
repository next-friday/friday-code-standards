# Changesets

Use a changeset for every publishable package change with external impact. Do not add a changeset for changes that do not affect a package release.

All three publishable packages currently start at `0.0.0`. `.changeset/first-release.md` is the pending shared First Release; do not create a second initial-release changeset.

## Add a changeset

From the repository root:

```sh
pnpm changeset
```

Check pending `.changeset/*.md` files first. Do not record the same unreleased change twice.

## Choose a release type

- Use `patch` for backward-compatible fixes.
- Use `minor` for new backward-compatible capabilities.
- Use `major` for breaking consumer changes, including stricter policy that can make previously accepted code fail.

The packages are a fixed group in `config.json`. They share one version, so the highest required bump applies to all packages.

## Write release notes

Write each entry so it stands on its own:

- Name the affected package behavior directly.
- Include rule names, severities, options, or file patterns when they matter.
- Include migration guidance for breaking changes.
- Do not rely on an issue, pull request, or commit link to explain the change.

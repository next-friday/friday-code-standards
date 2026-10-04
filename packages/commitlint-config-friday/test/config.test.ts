import {describe, expect, it} from "vitest";
import lint from "@commitlint/lint";
import load from "@commitlint/load";
import type {LintOptions} from "@commitlint/types";

import config from "../src/index.ts";

/**
 * Lint a commit message with the resolved Next Friday commitlint configuration.
 * @param commit Commit message to validate.
 * @returns Commitlint validation result.
 */
async function lintWithConfig(commit: string) {
  const resolved = await load(config);
  const parserOptions = resolved.parserPreset?.parserOpts as LintOptions["parserOpts"];

  return lint(commit, resolved.rules, {
    parserOpts: parserOptions,
  });
}

describe("commitlint-config-friday", () => {
  it("passes for a valid conventional commit with scope and short subject", async () => {
    const result = await lintWithConfig("feat(api): add auth endpoint");

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it.each([
    {
      commit: "feat: add auth endpoint",
      description: "fails when scope is empty",
      expectedRule: "scope-empty",
    },
    {
      commit: "feat(API): add auth endpoint",
      description: "fails when scope is upper-case",
      expectedRule: "scope-case",
    },
    {
      commit: "unknown(api): add auth endpoint",
      description: "fails when type is unknown",
      expectedRule: "type-enum",
    },
    {
      commit: "Feat(api): add auth endpoint",
      description: "fails when type is not lower-case",
      expectedRule: "type-case",
    },
    {
      commit: "(api): add auth endpoint",
      description: "fails when type is empty",
      expectedRule: "type-empty",
    },
    {
      commit: "feat(api):",
      description: "fails when subject is empty",
      expectedRule: "subject-empty",
    },
    {
      commit: "feat(api)!: add auth endpoint",
      description: "fails when subject uses breaking-change syntax",
      expectedRule: "subject-exclamation-mark",
    },
    {
      description: "fails when subject length exceeds 50 characters",
      expectedRule: "subject-max-length",
      commit: `feat(api): ${"a".repeat(51)}`,
    },
    {
      commit: "feat(api): add auth endpoint.",
      description: "fails when the conventional preset rejects a trailing period",
      expectedRule: "subject-full-stop",
    },
    {
      commit: "feat(api): add auth endpoint\n\nThis is a body",
      description: "fails when commit has a non-empty body",
      expectedRule: "body-empty",
    },
    {
      commit: "feat(api): add auth endpoint\n\nBREAKING CHANGE: details",
      description: "fails when commit has a non-empty footer",
      expectedRule: "footer-empty",
    },
  ])("$description", async ({commit, expectedRule}) => {
    const result = await lintWithConfig(commit);

    expect(result.valid).toBe(false);
    expect(result.errors.some(error => error.name === expectedRule)).toBe(true);
  });
});

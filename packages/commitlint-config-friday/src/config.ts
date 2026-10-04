import {RuleConfigSeverity} from "@commitlint/types";
import type {UserConfig} from "@commitlint/types";

export const commitlintConfig = {
  helpUrl: "https://www.conventionalcommits.org/en/v1.0.0",
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-empty": [RuleConfigSeverity.Error, "always"],
    "footer-empty": [RuleConfigSeverity.Error, "always"],
    "scope-case": [RuleConfigSeverity.Error, "always", "lower-case"],
    "scope-empty": [RuleConfigSeverity.Error, "never"],
    "subject-empty": [RuleConfigSeverity.Error, "never"],
    "subject-exclamation-mark": [RuleConfigSeverity.Error, "never"],
    "subject-max-length": [RuleConfigSeverity.Error, "always", 50],
    "type-case": [RuleConfigSeverity.Error, "always", "lower-case"],
    "type-empty": [RuleConfigSeverity.Error, "never"],
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
} satisfies UserConfig;

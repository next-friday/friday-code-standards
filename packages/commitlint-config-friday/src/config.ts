import {RuleConfigSeverity} from "@commitlint/types";
import type {SyncRule, UserConfig} from "@commitlint/types";

const coAuthoredByTrailer = /^Co-authored-by: \S.* <[^<>\s@]+@[^<>\s@]+>$/i;

/**
 * Accept a footer only when every line is a `Co-Authored-By` trailer.
 * @param commit Parsed commit.
 * @param commit.footer Commit footer, or null when the commit has none.
 * @returns The rule outcome and its message.
 */
const footerCoAuthoredByOnly: SyncRule = ({footer}) => [
  footer === null || footer.split("\n").every(line => coAuthoredByTrailer.test(line)),
  "footer may only contain Co-Authored-By: Name <email> trailers",
];

export const commitlintConfig = {
  helpUrl: "https://www.conventionalcommits.org/en/v1.0.0",
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "footer-co-authored-by-only": footerCoAuthoredByOnly,
      },
    },
  ],
  rules: {
    "body-max-length": [RuleConfigSeverity.Error, "always", 100],
    "footer-co-authored-by-only": [RuleConfigSeverity.Error, "always"],
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
        "wip",
      ],
    ],
  },
} satisfies UserConfig;

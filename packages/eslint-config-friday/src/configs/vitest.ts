import vitestPlugin from "@vitest/eslint-plugin";
import type {Linter} from "eslint";

import {TYPESCRIPT_TEST_FILES} from "../globs";

const vitestRules: Linter.RulesRecord = {
  "vitest/expect-expect": "error",
  "vitest/no-commented-out-tests": "error",
  "vitest/no-conditional-expect": "error",
  "vitest/no-disabled-tests": "error",
  "vitest/no-focused-tests": "error",
  "vitest/no-identical-title": "error",
  "vitest/no-import-node-test": "error",
  "vitest/no-interpolation-in-snapshots": "error",
  "vitest/no-mocks-import": "error",
  "vitest/no-standalone-expect": "error",
  "vitest/no-unneeded-async-expect-function": "error",
  "vitest/prefer-called-exactly-once-with": "error",
  "vitest/require-local-test-context-for-concurrent-snapshots": "error",
  "vitest/valid-describe-callback": "error",
  "vitest/valid-expect": "error",
  "vitest/valid-expect-in-promise": "error",
  "vitest/valid-title": "error",
  "vitest/consistent-test-filename": [
    "error",
    {
      allTestPattern: String.raw`.*\.(?:test|spec)\.(?:[cm]?ts|tsx)$`,
      pattern: String.raw`.*\.test\.(?:[cm]?ts|tsx)$`,
    },
  ],
};

export const vitest: Linter.Config[] = [
  {
    files: TYPESCRIPT_TEST_FILES,
    name: "friday/vitest",
    plugins: {
      vitest: vitestPlugin,
    },
    rules: vitestRules,
  },
];

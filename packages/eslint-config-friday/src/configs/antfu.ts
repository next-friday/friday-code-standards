import antfuPlugin from "eslint-plugin-antfu";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

const antfuRules: Linter.RulesRecord = {
  "antfu/consistent-chaining": "error",
  "antfu/consistent-list-newline": "error",
  "antfu/curly": "error",
  "antfu/import-dedupe": "error",
  "antfu/indent-unindent": "error",
  "antfu/no-import-dist": "error",
  "antfu/no-import-node-modules-by-path": "error",
  "antfu/no-top-level-await": "error",
  "antfu/no-ts-export-equal": "error",
  "antfu/top-level-function": "error",
};

export const antfu: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/antfu/setup",
    plugins: {
      antfu: antfuPlugin,
    },
    rules: antfuRules,
  },
];

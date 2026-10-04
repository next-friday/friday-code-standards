import commentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

const commentsRules: Linter.RulesRecord = {
  "@eslint-community/eslint-comments/disable-enable-pair": "error",
  "@eslint-community/eslint-comments/no-aggregating-enable": "error",
  "@eslint-community/eslint-comments/no-duplicate-disable": "error",
  "@eslint-community/eslint-comments/no-unlimited-disable": "error",
  "@eslint-community/eslint-comments/no-unused-disable": "error",
  "@eslint-community/eslint-comments/no-unused-enable": "error",
  "@eslint-community/eslint-comments/require-description": "error",
};

export const eslintComments: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/eslint-comments",
    plugins: {
      "@eslint-community/eslint-comments": commentsPlugin,
    },
    rules: commentsRules,
  },
];

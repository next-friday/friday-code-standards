import fridayPlugin from "@next-friday/eslint-plugin-friday";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES, REACT_FILES} from "../globs";

const fridayRules: Linter.RulesRecord = {
  "friday/index-export-only": "error",
  "friday/no-lazy-identifiers": "error",
  "friday/object-curly-newline": "error",
};

const fridayReactRules: Linter.RulesRecord = {
  "friday/component-module": "error",
  "friday/jsx-newline-between-elements": "error",
  "friday/jsx-no-newline-single-line-elements": "error",
  "friday/named-props": "error",
  "friday/props-in-body": "error",
};

export const friday: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/policy",
    plugins: {
      friday: fridayPlugin,
    },
    rules: fridayRules,
  },
];

export const fridayReact: Linter.Config[] = [
  {
    files: REACT_FILES,
    name: "friday/policy/react",
    plugins: {
      friday: fridayPlugin,
    },
    rules: fridayReactRules,
  },
];

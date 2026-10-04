import promisePlugin from "eslint-plugin-promise";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

const promiseRules: Linter.RulesRecord = {
  "promise/always-return": "error",
  "promise/catch-or-return": "error",
  "promise/no-callback-in-promise": "error",
  "promise/no-nesting": "error",
  "promise/no-new-statics": "error",
  "promise/no-promise-in-callback": "error",
  "promise/no-return-in-finally": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/valid-params": "error",
};

export const promise: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/promise",
    plugins: {
      promise: promisePlugin,
    },
    rules: promiseRules,
  },
];

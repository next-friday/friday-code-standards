import jsdocPlugin from "eslint-plugin-jsdoc";
import type {Linter} from "eslint";

import {
  JAVASCRIPT_AND_TYPESCRIPT_FILES,
  JAVASCRIPT_FILES,
  REACT_FILES,
  TYPESCRIPT_FILES,
} from "../globs";

const jsdocCommonRules: Linter.RulesRecord = {
  "jsdoc/check-access": "error",
  "jsdoc/check-alignment": "error",
  "jsdoc/check-param-names": "error",
  "jsdoc/check-property-names": "error",
  "jsdoc/check-types": "error",
  "jsdoc/check-values": "error",
  "jsdoc/empty-tags": "error",
  "jsdoc/escape-inline-tags": "error",
  "jsdoc/implements-on-classes": "error",
  "jsdoc/multiline-blocks": "error",
  "jsdoc/no-defaults": "error",
  "jsdoc/no-multi-asterisks": "error",
  "jsdoc/reject-any-type": "error",
  "jsdoc/reject-function-type": "error",
  "jsdoc/require-next-type": "error",
  "jsdoc/require-param": "error",
  "jsdoc/require-param-description": "error",
  "jsdoc/require-param-name": "error",
  "jsdoc/require-property": "error",
  "jsdoc/require-property-description": "error",
  "jsdoc/require-property-name": "error",
  "jsdoc/require-returns": "error",
  "jsdoc/require-returns-check": "error",
  "jsdoc/require-returns-description": "error",
  "jsdoc/require-throws-type": "error",
  "jsdoc/require-yields": "error",
  "jsdoc/require-yields-check": "error",
  "jsdoc/require-yields-type": "error",
  "jsdoc/tag-lines": "error",
  "jsdoc/ts-no-empty-object-type": "error",
  "jsdoc/valid-types": "error",
};

const jsdocRequiredRules: Linter.RulesRecord = {
  "jsdoc/require-jsdoc": "error",
};

const jsdocJavaScriptRules: Linter.RulesRecord = {
  ...jsdocCommonRules,
  "jsdoc/check-tag-names": "error",
  "jsdoc/no-undefined-types": "error",
  "jsdoc/require-param-type": "error",
  "jsdoc/require-property-type": "error",
  "jsdoc/require-returns-type": "error",
};

const jsdocTypeScriptRules: Linter.RulesRecord = {
  ...jsdocCommonRules,
  "jsdoc/no-types": "error",
  "jsdoc/check-tag-names": [
    "error",
    {
      typed: true,
    },
  ],
};

export const jsdoc: Linter.Config[] = [
  {
    files: JAVASCRIPT_FILES,
    name: "friday/jsdoc/javascript",
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: jsdocJavaScriptRules,
  },
  {
    files: TYPESCRIPT_FILES,
    name: "friday/jsdoc/typescript",
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: jsdocTypeScriptRules,
  },
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    ignores: REACT_FILES,
    name: "friday/jsdoc/required",
    rules: jsdocRequiredRules,
  },
];

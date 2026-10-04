import stylisticPlugin from "@stylistic/eslint-plugin";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES, REACT_FILES} from "../globs";

const SINGLELINE_VARS = ["singleline-const", "singleline-let", "singleline-var"] as const;
const MULTILINE_VARS = ["multiline-const", "multiline-let", "multiline-var"] as const;
const SINGLELINE_EXPRESSION = "singleline-expression" as const;
const MULTILINE_EXPRESSION = "multiline-expression" as const;
const SINGLELINE_EXPORT = "singleline-export" as const;
const MULTILINE_EXPORT = "multiline-export" as const;
const SINGLELINE_TYPE = "singleline-type" as const;
const MULTILINE_TYPE = "multiline-type" as const;

const PADDING_LINE_BETWEEN_STATEMENTS = [
  {
    blankLine: "always",
    next: "*",
    prev: "directive",
  },
  {
    blankLine: "any",
    next: "directive",
    prev: "directive",
  },
  {
    blankLine: "always",
    next: "*",
    prev: "import",
  },
  {
    blankLine: "any",
    next: "import",
    prev: "import",
  },
  {
    next: SINGLELINE_VARS,
    prev: SINGLELINE_VARS,
    blankLine: "never",
  },
  {
    next: MULTILINE_VARS,
    blankLine: "always",
    prev: "*",
  },
  {
    prev: MULTILINE_VARS,
    blankLine: "always",
    next: "*",
  },
  {
    next: SINGLELINE_EXPORT,
    prev: SINGLELINE_EXPORT,
    blankLine: "never",
  },
  {
    next: MULTILINE_EXPORT,
    blankLine: "always",
    prev: "*",
  },
  {
    prev: MULTILINE_EXPORT,
    blankLine: "always",
    next: "*",
  },
  {
    next: SINGLELINE_TYPE,
    prev: SINGLELINE_TYPE,
    blankLine: "never",
  },
  {
    next: MULTILINE_TYPE,
    blankLine: "always",
    prev: "*",
  },
  {
    prev: MULTILINE_TYPE,
    blankLine: "always",
    next: "*",
  },
  {
    prev: SINGLELINE_VARS,
    blankLine: "always",
    next: "export",
  },
  {
    next: SINGLELINE_VARS,
    blankLine: "always",
    prev: "export",
  },
  {
    prev: SINGLELINE_VARS,
    blankLine: "always",
    next: "type",
  },
  {
    next: SINGLELINE_VARS,
    blankLine: "always",
    prev: "type",
  },
  {
    blankLine: "always",
    next: "export",
    prev: "type",
  },
  {
    blankLine: "always",
    next: "type",
    prev: "export",
  },
  {
    next: SINGLELINE_EXPRESSION,
    prev: SINGLELINE_EXPRESSION,
    blankLine: "never",
  },
  {
    next: SINGLELINE_EXPRESSION,
    prev: SINGLELINE_VARS,
    blankLine: "always",
  },
  {
    next: SINGLELINE_VARS,
    prev: SINGLELINE_EXPRESSION,
    blankLine: "always",
  },
  {
    next: MULTILINE_EXPRESSION,
    blankLine: "always",
    prev: "*",
  },
  {
    prev: MULTILINE_EXPRESSION,
    blankLine: "always",
    next: "*",
  },
  {
    blankLine: "always",
    next: "block-like",
    prev: "*",
  },
  {
    blankLine: "always",
    next: "*",
    prev: "block-like",
  },
  {
    blankLine: "always",
    prev: "*",
    next: ["return", "throw"],
  },
];

const stylisticRules: Linter.RulesRecord = {
  "no-unexpected-multiline": "error",
  "@stylistic/lines-between-class-members": [
    "error",
    "always",
    {
      exceptAfterSingleLine: false,
    },
  ],
  "@stylistic/no-confusing-arrow": [
    "error",
    {
      allowParens: false,
    },
  ],
  "@stylistic/no-mixed-operators": [
    "error",
    {
      allowSamePrecedence: false,
      groups: [
        ["%", "**"],
        ["%", "+"],
        ["%", "-"],
        ["%", "*"],
        ["%", "/"],
        ["/", "*"],
        ["&", "|", "<<", ">>", ">>>"],
        ["==", "!=", "===", "!=="],
        ["&&", "||"],
      ],
    },
  ],
  "@stylistic/spaced-comment": [
    "error",
    "always",
    {
      block: {
        balanced: true,
        exceptions: ["-", "+", "*"],
        markers: ["=", "!", ":", "::"],
      },
      line: {
        exceptions: ["-", "+"],
        markers: ["=", "!", "/"],
      },
    },
  ],
  "@stylistic/padding-line-between-statements": ["error", ...PADDING_LINE_BETWEEN_STATEMENTS],
};

const reactStylisticRules: Linter.RulesRecord = {
  "@stylistic/jsx-self-closing-comp": "error",
  "@stylistic/jsx-curly-brace-presence": [
    "error",
    {
      children: "never",
      props: "never",
    },
  ],
};

export const stylistic: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/stylistic",
    plugins: {
      "@stylistic": stylisticPlugin,
    },
    rules: stylisticRules,
  },
];

export const reactStylistic: Linter.Config[] = [
  {
    files: REACT_FILES,
    name: "friday/stylistic/react",
    rules: reactStylisticRules,
  },
];

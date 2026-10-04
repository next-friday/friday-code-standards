import markdownPlugin from "@eslint/markdown";
import type {Linter} from "eslint";

import {MARKDOWN_FILES} from "../globs";

const markdownRules: Linter.RulesRecord = {
  "markdown/fenced-code-language": "error",
  "markdown/heading-increment": "error",
  "markdown/no-duplicate-definitions": "error",
  "markdown/no-empty-definitions": "error",
  "markdown/no-empty-images": "error",
  "markdown/no-empty-links": "error",
  "markdown/no-invalid-label-refs": "error",
  "markdown/no-missing-atx-heading-space": "error",
  "markdown/no-missing-label-refs": "error",
  "markdown/no-missing-link-fragments": "error",
  "markdown/no-multiple-h1": "error",
  "markdown/no-reference-like-urls": "error",
  "markdown/no-reversed-media-syntax": "error",
  "markdown/no-space-in-emphasis": "error",
  "markdown/no-unused-definitions": "error",
  "markdown/require-alt-text": "error",
  "markdown/table-column-count": "error",
};

export const markdown: Linter.Config[] = [
  {
    files: MARKDOWN_FILES,
    name: "friday/markdown",
    language: "markdown/gfm",
    languageOptions: {
      frontmatter: "yaml",
    },
    plugins: {
      markdown: markdownPlugin,
    },
    rules: markdownRules,
  },
];

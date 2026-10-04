import yamlPlugin from "eslint-plugin-yml";
import type {Linter} from "eslint";

import {YAML_FILES} from "../globs";

const yamlRules: Linter.RulesRecord = {
  "yml/no-empty-document": "error",
  "yml/no-empty-key": "error",
  "yml/no-empty-mapping-value": "error",
  "yml/no-empty-sequence-entry": "error",
  "yml/no-irregular-whitespace": "error",
  "yml/no-tab-indent": "error",
  "yml/vue-custom-block/no-parsing-error": "error",
};

export const yaml: Linter.Config[] = [
  {
    files: YAML_FILES,
    name: "friday/yaml",
    language: "yml/yaml",
    plugins: {
      yml: yamlPlugin,
    },
    rules: yamlRules,
  },
];

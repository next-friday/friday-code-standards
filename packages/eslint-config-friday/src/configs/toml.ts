import tomlPlugin from "eslint-plugin-toml";
import type {Linter} from "eslint";

import {TOML_FILES} from "../globs";

const tomlRules: Linter.RulesRecord = {
  "toml/no-unreadable-number-separator": "error",
  "toml/precision-of-fractional-seconds": "error",
  "toml/precision-of-integer": "error",
  "toml/vue-custom-block/no-parsing-error": "error",
};

export const toml: Linter.Config[] = [
  {
    files: TOML_FILES,
    name: "friday/toml",
    language: "toml/toml",
    plugins: {
      toml: tomlPlugin,
    },
    rules: tomlRules,
  },
];

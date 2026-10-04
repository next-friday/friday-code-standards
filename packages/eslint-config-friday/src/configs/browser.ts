import globals from "globals";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

export const browser: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/browser/globals",
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

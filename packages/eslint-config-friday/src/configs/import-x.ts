import importXPlugin from "eslint-plugin-import-x";
import type {Linter} from "eslint";

import {
  JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  JAVASCRIPT_AND_TYPESCRIPT_FILES,
  TYPESCRIPT_EXTENSIONS,
} from "../globs";

const IMPORT_X_SETTINGS: Record<string, unknown> = {
  "import-x/extensions": JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS,
  "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
  "import-x/parsers": {
    "@typescript-eslint/parser": TYPESCRIPT_EXTENSIONS,
  },
  "import-x/resolver": {
    typescript: true,
  },
};

const importXRules: Linter.RulesRecord = {
  "import-x/default": "error",
  "import-x/export": "error",
  "import-x/named": "error",
  "import-x/namespace": "error",
  "import-x/no-duplicates": "error",
  "import-x/no-named-as-default": "error",
  "import-x/no-named-as-default-member": "error",
  "import-x/no-unresolved": "error",
  "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
};

export const importX: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/import-x",
    plugins: {
      "import-x": importXPlugin,
    },
    settings: IMPORT_X_SETTINGS,
    rules: importXRules,
  },
];

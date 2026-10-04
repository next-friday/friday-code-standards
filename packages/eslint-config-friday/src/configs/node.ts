import globals from "globals";
import nPlugin from "eslint-plugin-n";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS, JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

const NODE_RESOLUTION_EXTENSIONS = [...JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS, ".json", ".node"];
const NODE_MAIN_FILES = JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS.map(extension => `index${extension}`);

const NODE_SETTINGS: Record<string, unknown> = {
  node: {
    tryExtensions: NODE_RESOLUTION_EXTENSIONS,
    resolverConfig: {
      mainFiles: NODE_MAIN_FILES,
    },
  },
};

const nodeRules: Linter.RulesRecord = {
  "n/global-require": "error",
  "n/hashbang": "error",
  "n/no-deprecated-api": "error",
  "n/no-exports-assign": "error",
  "n/no-extraneous-import": "error",
  "n/no-extraneous-require": "error",
  "n/no-missing-import": "error",
  "n/no-missing-require": "error",
  "n/no-new-require": "error",
  "n/no-path-concat": "error",
  "n/no-process-exit": "error",
  "n/no-unpublished-import": "error",
  "n/no-unpublished-require": "error",
  "n/no-unsupported-features/es-builtins": "error",
  "n/no-unsupported-features/node-builtins": "error",
  "n/process-exit-as-throw": "error",
  "n/no-unsupported-features/es-syntax": [
    "error",
    {
      ignores: ["modules"],
    },
  ],
};

export const node: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/node",
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: nPlugin,
    },
    settings: NODE_SETTINGS,
    rules: nodeRules,
  },
];

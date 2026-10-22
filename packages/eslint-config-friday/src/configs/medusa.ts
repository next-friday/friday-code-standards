import {configs as medusaConfigs} from "@medusajs/eslint-plugin";
import type {Linter} from "eslint";

import {
  MEDUSA_DATA_MODEL_FILES,
  MEDUSA_LINK_FILES,
  MEDUSA_MIDDLEWARE_FILES,
  MEDUSA_MIGRATION_FILES,
  MEDUSA_MODULE_DEFINITION_FILES,
  MEDUSA_WORKFLOW_FILES,
  MEDUSA_WORKFLOW_HOOK_FILES,
} from "../globs";

// The upstream preset also ships global test ignores and its own TypeScript parser; Friday owns both.
const medusaRecommended = medusaConfigs.recommended
  .filter(config => config.plugins !== undefined || Object.keys(config.rules ?? {}).length > 0)
  .map(config => ({
    ...config,
    name: "friday/medusa/recommended",
  }));

export const medusa: Linter.Config[] = [
  ...medusaRecommended,
  {
    files: MEDUSA_MODULE_DEFINITION_FILES,
    name: "friday/medusa/module-definitions",
    rules: {
      // Medusa loads a module only from the default `Module(...)` export of its index file.
      "friday/index-export-only": "off",
      "unicorn/no-top-level-side-effects": "off",
    },
  },
  {
    files: MEDUSA_LINK_FILES,
    name: "friday/medusa/link-definitions",
    rules: {
      // Medusa loads links only from the default `defineLink(...)` export.
      "unicorn/no-top-level-side-effects": "off",
    },
  },
  {
    files: MEDUSA_MIDDLEWARE_FILES,
    name: "friday/medusa/middleware-definitions",
    rules: {
      "unicorn/no-top-level-side-effects": "off",
    },
  },
  {
    files: MEDUSA_MIGRATION_FILES,
    name: "friday/medusa/migrations",
    rules: {
      // Medusa generates `Migration<timestamp>` filenames.
      "unicorn/filename-case": "off",
    },
  },
  {
    files: MEDUSA_DATA_MODEL_FILES,
    name: "friday/medusa/data-models",
    rules: {
      // SQL NULL is part of database contracts, not undefined.
      "unicorn/no-null": "off",
    },
  },
  {
    files: MEDUSA_WORKFLOW_FILES,
    ignores: MEDUSA_WORKFLOW_HOOK_FILES,
    name: "friday/medusa/workflows",
    rules: {
      // Composition functions run synchronously; `when(...).then(...)` registers a branch, not a Promise.
      "promise/always-return": "off",
      "promise/catch-or-return": "off",
      "unicorn/prefer-await": "off",
    },
  },
];

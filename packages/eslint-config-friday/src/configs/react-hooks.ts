import reactHooksPlugin from "eslint-plugin-react-hooks";
import type {ESLint, Linter} from "eslint";

import {REACT_FILES} from "../globs";

const reactHooksPluginForConfig: ESLint.Plugin = {
  meta: reactHooksPlugin.meta,
  rules: reactHooksPlugin.rules,
};

const reactHooksRules: Linter.RulesRecord = {
  "react-hooks/config": "error",
  "react-hooks/error-boundaries": "error",
  "react-hooks/exhaustive-deps": "error",
  "react-hooks/gating": "error",
  "react-hooks/globals": "error",
  "react-hooks/immutability": "error",
  "react-hooks/incompatible-library": "error",
  "react-hooks/preserve-manual-memoization": "error",
  "react-hooks/purity": "error",
  "react-hooks/refs": "error",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/set-state-in-effect": "error",
  "react-hooks/set-state-in-render": "error",
  "react-hooks/static-components": "error",
  "react-hooks/unsupported-syntax": "error",
  "react-hooks/use-memo": "error",
};

export const reactHooks: Linter.Config[] = [
  {
    files: REACT_FILES,
    name: "friday/react-hooks",
    plugins: {
      "react-hooks": reactHooksPluginForConfig,
    },
    rules: reactHooksRules,
  },
];

import nextPlugin, {configs as nextConfigs} from "@next/eslint-plugin-next";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES, NEXTJS_FRAMEWORK_FILES} from "../globs";

const nextjsRules = Object.fromEntries(
  Object.entries({
    ...nextConfigs.recommended.rules,
    ...nextConfigs["core-web-vitals"].rules,
  }).filter(([, rule]) => rule !== undefined),
) as Linter.RulesRecord;

export const nextjs: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/nextjs/core-web-vitals",
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: nextjsRules,
  },
  {
    files: NEXTJS_FRAMEWORK_FILES,
    name: "friday/nextjs/framework-files",
    rules: {
      "sonarjs/file-name-differ-from-class": "off",
    },
  },
];

export const nextjsReact: Linter.Config[] = [
  {
    files: NEXTJS_FRAMEWORK_FILES,
    name: "friday/nextjs/react-framework-files",
    rules: {
      "friday/component-module": "off",
    },
  },
];

import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {packageRoot} from "../helpers";

import {eslint, projectRoot} from "./behavior.helper";

const UNUSED_IMPORT = 'import {readFile} from "node:fs";';
const JS_SOURCE = [UNUSED_IMPORT, "const unused = 1;", ""].join("\n");

const JSX_SOURCE = [
  UNUSED_IMPORT,
  "const unused = 1;",
  "export const App = () => <div />;",
  "",
].join("\n");

const TS_SOURCE = [UNUSED_IMPORT, "const unused: number = 1;", ""].join("\n");

const TSX_SOURCE = [
  UNUSED_IMPORT,
  "const unused: number = 1;",
  "export const App = () => <div />;",
  "",
].join("\n");

const CASES = [
  ["JavaScript", "no-unused-vars", path.resolve(packageRoot, "fixtures/unused.js"), JS_SOURCE],
  ["JSX", "no-unused-vars", path.resolve(packageRoot, "fixtures/unused.jsx"), JSX_SOURCE],
  [
    "TypeScript",
    "@typescript-eslint/no-unused-vars",
    path.resolve(projectRoot, "src/valid.ts"),
    TS_SOURCE,
  ],
  [
    "TSX",
    "@typescript-eslint/no-unused-vars",
    path.resolve(projectRoot, "src/component.tsx"),
    TSX_SOURCE,
  ],
] as const;

describe("unused binding policy", () => {
  it.each(CASES)(
    "reports unused imports and variables in %s",
    async (_name, ruleId, filePath, source) => {
      const [result] = await eslint.lintText(source, {
        filePath,
      });

      assert(result);

      const messages = result.messages.filter(message => message.ruleId === ruleId);

      expect(messages.some(message => message.message.includes("'readFile'"))).toBe(true);
      expect(messages.some(message => message.message.includes("'unused'"))).toBe(true);
    },
  );
});

import assert from "node:assert/strict";
import {describe, expect, it} from "vitest";
import path from "node:path";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

const RULE_ID = "unicorn/name-replacements";
const projectRoot = path.resolve(packageRoot, "fixtures/projects/typed");
const tsFixture = path.resolve(projectRoot, "src/valid.ts");
const tsxFixture = path.resolve(projectRoot, "src/component.tsx");

describe("React name replacements", () => {
  it("rejects props in TypeScript even when React mode is enabled", async () => {
    const eslint = eslintForConfigs(
      friday({
        react: true,
      }),
    );

    const [result] = await eslint.lintText("export const props = {};\n", {
      filePath: tsFixture,
    });

    expect(result?.messages.map(message => message.ruleId)).toContain(RULE_ID);
  });

  it("allows React vocabulary in TSX", async () => {
    const eslint = eslintForConfigs(
      friday({
        react: true,
      }),
    );

    const [result] = await eslint.lintText(
      "export function Component(props: {value: string}) { return <div>{props.value}</div>; }\n",
      {
        filePath: tsxFixture,
      },
    );

    assert.ok(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(RULE_ID);
  });

  it("keeps non-React replacements enabled in TSX", async () => {
    const eslint = eslintForConfigs(
      friday({
        react: true,
      }),
    );

    const [result] = await eslint.lintText(
      "export function Component() { const btn = 1; return <div>{btn}</div>; }\n",
      {
        filePath: tsxFixture,
      },
    );

    expect(result?.messages.map(message => message.ruleId)).toContain(RULE_ID);
  });
});

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
  it.each([
    {
      filePath: tsFixture,
      name: "TypeScript",
      source: "export type IconProps = {value: string};\n",
    },
    {
      filePath: tsxFixture,
      name: "TSX",
      source:
        "export function Component(props: {value: string}) { return <div>{props.value}</div>; }\n",
    },
  ])("allows React vocabulary in $name", async ({filePath, source}) => {
    const eslint = eslintForConfigs(
      friday({
        react: true,
      }),
    );

    const [result] = await eslint.lintText(source, {
      filePath,
    });

    assert.ok(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(RULE_ID);
  });

  it.each([
    {
      filePath: tsFixture,
      name: "TypeScript",
      source: "export const btn = 1;\n",
    },
    {
      filePath: tsxFixture,
      name: "TSX",
      source: "export function Component() { const btn = 1; return <div>{btn}</div>; }\n",
    },
  ])("keeps non-React replacements enabled in $name", async ({filePath, source}) => {
    const eslint = eslintForConfigs(
      friday({
        react: true,
      }),
    );

    const [result] = await eslint.lintText(source, {
      filePath,
    });

    expect(result?.messages.map(message => message.ruleId)).toContain(RULE_ID);
  });
});

import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {packageRoot} from "../helpers";

import {eslint, projectRoot} from "./behavior.helper";

const TYPESCRIPT_POLICY_FIXTURE = path.resolve(projectRoot, "src/valid.ts");
const BAN_TS_COMMENT_RULE = "@typescript-eslint/ban-ts-comment";

describe("test policy behavior", () => {
  it("reports focused test violations through friday vitest policy", async () => {
    const testSource = 'describe.only("sample", () => {});\n';

    const [result] = await eslint.lintText(testSource, {
      filePath: path.resolve(packageRoot, "test/behavior/behavior-test-policy.test.ts"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("vitest/no-focused-tests");
  });

  it("allows ts-expect-error comments with a description", async () => {
    const [result] = await eslint.lintText(
      "// @ts-expect-error -- upstream typing mismatch\nexport const value = 1;\n",
      {
        filePath: TYPESCRIPT_POLICY_FIXTURE,
      },
    );

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(BAN_TS_COMMENT_RULE);
  });

  it("reports ts-expect-error comments without a description", async () => {
    const [result] = await eslint.lintText("// @ts-expect-error\nexport const value = 1;\n", {
      filePath: TYPESCRIPT_POLICY_FIXTURE,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(BAN_TS_COMMENT_RULE);
  });

  it("continues to report ts-ignore comments", async () => {
    const [result] = await eslint.lintText(
      "// @ts-ignore -- upstream typing mismatch\nexport const value = 1;\n",
      {
        filePath: TYPESCRIPT_POLICY_FIXTURE,
      },
    );

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(BAN_TS_COMMENT_RULE);
  });

  it("allows a targeted eslint-disable directive with a description", async () => {
    const [result] = await eslint.lintText(
      "// eslint-disable-next-line no-debugger -- required for legacy interoperability\ndebugger;\nexport const value = 1;\n",
      {
        filePath: path.resolve(packageRoot, "fixtures/sample.js"),
      },
    );

    assert(result);

    expect(
      result.messages
        .map(message => message.ruleId)
        .filter(ruleId => ruleId?.startsWith("@eslint-community/eslint-comments/")),
    ).toEqual([]);
  });

  it("reports unused eslint-disable directives", async () => {
    const [result] = await eslint.lintText(
      "// eslint-disable-next-line no-debugger -- required for legacy interoperability\nexport const value = 1;\n",
      {
        filePath: path.resolve(packageRoot, "fixtures/sample.js"),
      },
    );

    assert(result);

    expect(
      result.messages.some(message => message.message.includes("Unused eslint-disable directive")),
    ).toBe(true);
  });
});

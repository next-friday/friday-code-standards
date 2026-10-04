import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslint, javascriptFixture, projectRoot} from "./behavior.helper";

const PADDING_RULE = "@stylistic/padding-line-between-statements";
const FIRST_EXPRESSION = 'console.log("first");';
const SECOND_EXPRESSION = 'console.log("second");';
const THIRD_EXPRESSION = 'console.log("third");';
const FIRST_EXPORT = "export const first = 1;";
const SECOND_EXPORT = "export const second = 2;";
const THIRD_EXPORT = "export const third = 3;";
const FIRST_TYPE = "type First = 1;";
const SECOND_TYPE = "type Second = 2;";
const THIRD_TYPE = "type Third = 3;";
const LOCAL_VARIABLE = "const local = 1;";
const MULTILINE_EXPRESSION = ["console.log([", '  "first",', '  "second",', "]);"].join("\n");
const MULTILINE_EXPORT = ["export const multiline = [", "  1,", "  2,", "];"].join("\n");
const MULTILINE_TYPE = ["type Multiline = {", "  value: number;", "};"].join("\n");
const typeFixture = path.resolve(projectRoot, "src/sample.type.ts");

describe("padding-line-between-statements behavior", () => {
  it("reports missing blank line around multiline variable declarations", async () => {
    const source = [
      "const first = 1;",
      "const second = [",
      "  1,",
      "  2,",
      "];",
      "const third = 3;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(PADDING_RULE);
  });

  it("reports unexpected blank line between adjacent single-line variable declarations", async () => {
    const source = ["const first = 1;", "", "const second = 2;", ""].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(PADDING_RULE);
  });

  it("reports missing blank line before block statements", async () => {
    const source = ["const value = 1;", "if (value) {", "  console.log(value);", "}", ""].join(
      "\n",
    );

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(PADDING_RULE);
  });

  it("reports missing blank line between variable declaration and expression", async () => {
    const badSource = ["const summary = 1;", "expect(summary).toEqual(1);", ""].join("\n");
    const goodSource = ["const summary = 1;", "", "expect(summary).toEqual(1);", ""].join("\n");

    const [badResult] = await eslint.lintText(badSource, {
      filePath: javascriptFixture,
    });

    const [goodResult] = await eslint.lintText(goodSource, {
      filePath: javascriptFixture,
    });

    assert(badResult);
    assert(goodResult);
    expect(badResult.messages.map(message => message.ruleId)).toContain(PADDING_RULE);
    expect(goodResult.messages.map(message => message.ruleId)).not.toContain(PADDING_RULE);
  });

  it.each([
    {
      filePath: javascriptFixture,
      name: "requires padding around a multiline expression",
      badSource: [FIRST_EXPRESSION, MULTILINE_EXPRESSION, SECOND_EXPRESSION, ""].join("\n"),
      goodSource: [FIRST_EXPRESSION, "", MULTILINE_EXPRESSION, "", SECOND_EXPRESSION, ""].join(
        "\n",
      ),
    },
    {
      filePath: javascriptFixture,
      name: "groups adjacent single-line expressions",
      badSource: [FIRST_EXPRESSION, "", SECOND_EXPRESSION, "", THIRD_EXPRESSION, ""].join("\n"),
      goodSource: [FIRST_EXPRESSION, SECOND_EXPRESSION, THIRD_EXPRESSION, ""].join("\n"),
    },
    {
      filePath: javascriptFixture,
      name: "requires padding around a multiline export",
      badSource: [FIRST_EXPORT, MULTILINE_EXPORT, SECOND_EXPORT, ""].join("\n"),
      goodSource: [FIRST_EXPORT, "", MULTILINE_EXPORT, "", SECOND_EXPORT, ""].join("\n"),
    },
    {
      filePath: javascriptFixture,
      name: "groups adjacent single-line exports",
      badSource: [FIRST_EXPORT, "", SECOND_EXPORT, "", THIRD_EXPORT, ""].join("\n"),
      goodSource: [FIRST_EXPORT, SECOND_EXPORT, THIRD_EXPORT, ""].join("\n"),
    },
    {
      filePath: javascriptFixture,
      name: "requires padding between variable declaration and export",
      badSource: [LOCAL_VARIABLE, FIRST_EXPORT, ""].join("\n"),
      goodSource: [LOCAL_VARIABLE, "", FIRST_EXPORT, ""].join("\n"),
    },
    {
      filePath: javascriptFixture,
      name: "requires padding between export and variable declaration",
      badSource: [FIRST_EXPORT, LOCAL_VARIABLE, ""].join("\n"),
      goodSource: [FIRST_EXPORT, "", LOCAL_VARIABLE, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "groups adjacent single-line types",
      badSource: [FIRST_TYPE, "", SECOND_TYPE, "", THIRD_TYPE, ""].join("\n"),
      goodSource: [FIRST_TYPE, SECOND_TYPE, THIRD_TYPE, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "requires padding around a multiline type",
      badSource: [FIRST_TYPE, MULTILINE_TYPE, SECOND_TYPE, ""].join("\n"),
      goodSource: [FIRST_TYPE, "", MULTILINE_TYPE, "", SECOND_TYPE, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "requires padding between type declaration and variable",
      badSource: [FIRST_TYPE, LOCAL_VARIABLE, ""].join("\n"),
      goodSource: [FIRST_TYPE, "", LOCAL_VARIABLE, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "requires padding between variable and type declaration",
      badSource: [LOCAL_VARIABLE, FIRST_TYPE, ""].join("\n"),
      goodSource: [LOCAL_VARIABLE, "", FIRST_TYPE, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "requires padding between type declaration and export",
      badSource: [FIRST_TYPE, FIRST_EXPORT, ""].join("\n"),
      goodSource: [FIRST_TYPE, "", FIRST_EXPORT, ""].join("\n"),
    },
    {
      filePath: typeFixture,
      name: "requires padding between export and type declaration",
      badSource: [FIRST_EXPORT, FIRST_TYPE, ""].join("\n"),
      goodSource: [FIRST_EXPORT, "", FIRST_TYPE, ""].join("\n"),
    },
  ])("$name", async ({badSource, filePath, goodSource}) => {
    const [badResult] = await eslint.lintText(badSource, {
      filePath,
    });

    const [goodResult] = await eslint.lintText(goodSource, {
      filePath,
    });

    assert(badResult);
    assert(goodResult);

    const badRules = badResult.messages.map(message => message.ruleId);
    const goodRules = goodResult.messages.map(message => message.ruleId);

    expect(badRules).toContain(PADDING_RULE);
    expect(goodRules).not.toContain(PADDING_RULE);
  });
});

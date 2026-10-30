import assert from "node:assert/strict";
import {describe, expect, it} from "vitest";
import path from "node:path";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

const untypedFixture = path.resolve(packageRoot, "fixtures/projects/untyped/index.js");

describe("runtime globals", () => {
  it("provides Node globals by default and browser globals with browser: true", async () => {
    const eslint = eslintForConfigs(friday());

    const browserEslint = eslintForConfigs(
      friday({
        browser: true,
      }),
    );

    const [bufferResult] = await eslint.lintText(
      'export const encoded = Buffer.from("value").toString("base64");\n',
      {
        filePath: untypedFixture,
      },
    );

    const [defaultDocumentResult] = await eslint.lintText(
      'export const found = document.querySelector("main");\n',
      {
        filePath: untypedFixture,
      },
    );

    const [documentResult] = await browserEslint.lintText(
      'export const found = document.querySelector("main");\n',
      {
        filePath: untypedFixture,
      },
    );

    assert.ok(bufferResult);
    assert.ok(defaultDocumentResult);
    assert.ok(documentResult);
    expect(bufferResult.messages.map(message => message.ruleId)).not.toContain("no-undef");
    expect(defaultDocumentResult.messages.map(message => message.ruleId)).toContain("no-undef");
    expect(documentResult.messages.map(message => message.ruleId)).not.toContain("no-undef");
  });
});

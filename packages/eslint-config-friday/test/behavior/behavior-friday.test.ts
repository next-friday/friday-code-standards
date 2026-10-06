import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {base, friday, vitest} from "../../src/configs";

import {eslintForConfigs, packageRoot} from "../helpers";

const eslint = eslintForConfigs([...base, ...friday, ...vitest]);
const JAVASCRIPT_FILE = path.resolve(packageRoot, "fixtures/friday.js");
const TEST_FILENAME_RULE = "vitest/consistent-test-filename";
const TEST_SOURCE = 'it("works", () => {});\n';

describe("Next Friday behavior", () => {
  it("reports environment fallbacks through core policy", async () => {
    const [result] = await eslint.lintText(
      [
        'const apiUrl = process.env.API_URL ?? "http://localhost";',
        'const mode = import.meta.env.MODE || "development";',
        "",
      ].join("\n"),
      {
        filePath: JAVASCRIPT_FILE,
      },
    );

    assert(result);

    expect(
      result.messages.filter(message => message.ruleId === "no-restricted-syntax"),
    ).toHaveLength(2);
  });

  it("allows direct environment access without a fallback", async () => {
    const [result] = await eslint.lintText(
      ["const apiUrl = process.env.API_URL;", "const mode = import.meta.env.MODE;", ""].join("\n"),
      {
        filePath: JAVASCRIPT_FILE,
      },
    );

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain("no-restricted-syntax");
  });

  it("reports spec test filenames through the Vitest plugin", async () => {
    const [result] = await eslint.lintText(TEST_SOURCE, {
      filePath: path.resolve(packageRoot, "fixtures/friday.spec.ts"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(TEST_FILENAME_RULE);
  });

  it("allows test filenames through the Vitest plugin", async () => {
    const [result] = await eslint.lintText(TEST_SOURCE, {
      filePath: path.resolve(packageRoot, "fixtures/friday.test.ts"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(TEST_FILENAME_RULE);
  });

  it("applies the filename policy to module TypeScript tests", async () => {
    const [result] = await eslint.lintText(TEST_SOURCE, {
      filePath: path.resolve(packageRoot, "fixtures/friday.spec.mts"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(TEST_FILENAME_RULE);

    const [allowedResult] = await eslint.lintText(TEST_SOURCE, {
      filePath: path.resolve(packageRoot, "fixtures/friday.test.mts"),
    });

    assert(allowedResult);
    expect(allowedResult.messages.map(message => message.ruleId)).not.toContain(TEST_FILENAME_RULE);
  });
});

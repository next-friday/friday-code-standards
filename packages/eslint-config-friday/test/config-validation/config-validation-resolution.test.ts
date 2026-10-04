import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslintForConfigs, fullConfig, packageRoot} from "../helpers";

import {SAMPLE_FILES} from "./config-validation.helper";

describe("Flat Config validation", () => {
  const eslint = eslintForConfigs(fullConfig);

  it.each(SAMPLE_FILES)("lints %s", async sampleFile => {
    await expect(eslint.lintFiles(path.resolve(packageRoot, sampleFile))).resolves.toHaveLength(1);
  });

  it("resolves preserved TSX output extensions from the consumer tsconfig", async () => {
    const sourcePath = path.resolve(packageRoot, "fixtures/projects/typed/src/valid.ts");

    const [result] = await eslint.lintText('import "./component.jsx";\n', {
      filePath: sourcePath,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain("n/no-missing-import");
  });

  it("isolates source and JSON rule scopes", async () => {
    const jsonPath = path.resolve(packageRoot, "fixtures/sample.json");
    const sourcePath = path.resolve(packageRoot, SAMPLE_FILES[0]);

    const [sourceResult] = await eslint.lintText("Promise.resolve().then(() => 1);\n", {
      filePath: sourcePath,
    });

    const [jsonResult] = await eslint.lintText('{\n  "name": "one",\n  "name": "two"\n}\n', {
      filePath: jsonPath,
    });

    assert(sourceResult);
    assert(jsonResult);

    const sourceRules = sourceResult.messages.map(message => message.ruleId);
    const jsonRules = jsonResult.messages.map(message => message.ruleId);

    expect(sourceRules).toContain("promise/catch-or-return");
    expect(sourceRules).not.toContain("jsonc/no-dupe-keys");
    expect(jsonRules).toContain("jsonc/no-dupe-keys");
    expect(jsonRules).not.toContain("promise/catch-or-return");
  });
});

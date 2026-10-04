import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {packageRoot} from "../helpers";

import {eslint} from "./behavior.helper";

describe("data format behavior", () => {
  it("reports duplicate keys in JSON files", async () => {
    const source = '{\n  "name": "one",\n  "name": "two"\n}\n';

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/sample.json"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("jsonc/no-dupe-keys");
  });

  it("reports comments in standard JSON files", async () => {
    const source = '{\n  // comment\n  "name": "one"\n}\n';

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/sample.json"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("jsonc/no-comments");
  });

  it("accepts valid YAML files", async () => {
    const [result] = await eslint.lintText("name: friday\nitems:\n  - one\n", {
      filePath: path.resolve(packageRoot, "fixtures/sample.yaml"),
    });

    assert(result);
    expect(result.messages).toEqual([]);
  });

  it("reports empty YAML keys", async () => {
    const [result] = await eslint.lintText(": value\n", {
      filePath: path.resolve(packageRoot, "fixtures/sample.yaml"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("yml/no-empty-key");
  });

  it("accepts valid TOML files", async () => {
    const [result] = await eslint.lintText('name = "friday"\n', {
      filePath: path.resolve(packageRoot, "fixtures/sample.toml"),
    });

    assert(result);
    expect(result.messages).toEqual([]);
  });

  it("reports unreadable TOML number separators", async () => {
    const [result] = await eslint.lintText("value = 1_2\n", {
      filePath: path.resolve(packageRoot, "fixtures/sample.toml"),
    });

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "toml/no-unreadable-number-separator",
    );
  });

  it("reports missing package manifest names", async () => {
    const [result] = await eslint.lintText('{"version":"1.0.0"}\n', {
      filePath: path.resolve(packageRoot, "fixtures/package.json"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("package-json/require-name");
  });
});

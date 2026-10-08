import assert from "node:assert/strict";
import {describe, expect, it} from "vitest";
import nestjsPackage from "@darraghor/eslint-plugin-nestjs-typed";
import path from "node:path";
import type {Linter} from "eslint";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

const typedFixture = path.resolve(packageRoot, "fixtures/projects/typed/src/valid.ts");

const nestjsConfigs = Reflect.get(nestjsPackage, "configs") as {
  flatRecommended: Linter.Config[];
};

describe("NestJS config", () => {
  it("mirrors the bundled official recommended rule set behind nestjs: true", () => {
    const defaultConfigs = friday();

    const enabledConfigs = friday({
      nestjs: true,
    });

    const defaultNestjs = defaultConfigs.find(
      config => config.name === "friday/nestjs/recommended",
    );

    const nestjs = enabledConfigs.find(config => config.name === "friday/nestjs/recommended");

    const recommended = nestjsConfigs.flatRecommended.find(
      config => config.name === "@darraghor/nestjs-typed/recommended",
    );

    expect(defaultNestjs).toBeUndefined();
    expect(nestjs).toBeDefined();
    expect(nestjs?.plugins).toHaveProperty("@darraghor/nestjs-typed");
    expect(nestjs?.rules).toEqual(recommended?.rules);
  });

  it("isolates provider-registration scanning from test modules and files", async () => {
    const eslint = eslintForConfigs(friday({nestjs: true}));
    const rule = "@darraghor/nestjs-typed/injectable-should-be-provided";
    const files = [
      "fixtures/projects/typed/test/error-model/throw.controller.ts",
      "fixtures/projects/typed/test/error-model/throw.module.ts",
      "fixtures/projects/typed/src/example.spec.ts",
    ];

    const productionConfig = await eslint.calculateConfigForFile(typedFixture);

    expect(productionConfig?.rules?.[rule]).toEqual([
      2,
      {
        src: ["src/**/*.ts"],
        filterFromPaths: ["node_modules", ".test.", ".spec."],
      },
    ]);

    for (const file of files) {
      const config = await eslint.calculateConfigForFile(path.resolve(packageRoot, file));

      expect(config?.rules?.[rule]).toEqual([0]);
    }
  });

  it("allows stateless NestJS services and framework terminology without weakening Node", async () => {
    const source = [
      "export class ConfigurationService {",
      "  get(): number { return 1; }",
      "}",
    ].join("\n");
    const [nestjsResult] = await eslintForConfigs(friday({nestjs: true})).lintText(source, {
      filePath: typedFixture,
    });
    const [defaultResult] = await eslintForConfigs(friday()).lintText(source, {
      filePath: typedFixture,
    });

    assert(nestjsResult);
    assert(defaultResult);
    const nestjsRuleIds = nestjsResult.messages.map(message => message.ruleId);
    const defaultRuleIds = defaultResult.messages.map(message => message.ruleId);

    expect(nestjsRuleIds).not.toContain("class-methods-use-this");
    expect(nestjsRuleIds).not.toContain("unicorn/name-replacements");
    expect(defaultRuleIds).toContain("class-methods-use-this");
    expect(defaultRuleIds).toContain("unicorn/name-replacements");
  });

  it("preserves legitimate SQL NULL contracts only in the NestJS scope", async () => {
    const source = "export const row = {total: null};\n";
    const [nestjsResult] = await eslintForConfigs(friday({nestjs: true})).lintText(source, {
      filePath: typedFixture,
    });
    const [defaultResult] = await eslintForConfigs(friday()).lintText(source, {
      filePath: typedFixture,
    });

    assert(nestjsResult);
    assert(defaultResult);
    expect(nestjsResult.messages.map(message => message.ruleId)).not.toContain("unicorn/no-null");
    expect(defaultResult.messages.map(message => message.ruleId)).toContain("unicorn/no-null");
  });

  it("continues reporting unrelated Unicorn name replacements in NestJS", async () => {
    const [result] = await eslintForConfigs(friday({nestjs: true})).lintText(
      "export const btn = 1;\n",
      {filePath: typedFixture},
    );

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("unicorn/name-replacements");
  });

  it("does not leak NestJS compatibility rules into adjacent applications", async () => {
    const eslint = eslintForConfigs(
      friday({
        nestjs: {files: ["apps/api/**"]},
      }),
    );

    const apiConfig = await eslint.calculateConfigForFile(
      path.resolve(packageRoot, "apps/api/src/service.ts"),
    );
    const webConfig = await eslint.calculateConfigForFile(
      path.resolve(packageRoot, "apps/web/src/service.ts"),
    );

    expect(apiConfig?.rules?.["unicorn/no-null"]).toEqual([0]);
    expect(webConfig?.rules?.["unicorn/no-null"]).toEqual([2]);
  });
});

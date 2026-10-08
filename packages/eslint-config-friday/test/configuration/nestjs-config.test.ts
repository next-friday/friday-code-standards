import assert from "node:assert/strict";
import {describe, expect, it} from "vitest";
import {ESLint} from "eslint";
import nestjsPackage from "@darraghor/eslint-plugin-nestjs-typed";
import path from "node:path";
import type {Linter} from "eslint";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

const typedFixture = path.resolve(packageRoot, "fixtures/projects/typed/src/valid.ts");
const PROVIDER_RULE = "@darraghor/nestjs-typed/injectable-should-be-provided";
const NULL_RULE = "unicorn/no-null";
const REPLACEMENTS_RULE = "unicorn/name-replacements";
const NESTJS_CONFIG_NAME = "friday/nestjs/recommended";

const nestjsConfigs = Reflect.get(nestjsPackage, "configs") as {
  flatRecommended: Linter.Config[];
};

describe("NestJS config", () => {
  it("mirrors the bundled official recommended rule set behind nestjs: true", () => {
    const defaultConfigs = friday();

    const enabledConfigs = friday({
      nestjs: true,
    });

    const defaultNestjs = defaultConfigs.find(config => config.name === NESTJS_CONFIG_NAME);
    const nestjs = enabledConfigs.find(config => config.name === NESTJS_CONFIG_NAME);

    const recommended = nestjsConfigs.flatRecommended.find(
      config => config.name === "@darraghor/nestjs-typed/recommended",
    );

    expect(defaultNestjs).toBeUndefined();
    expect(nestjs).toBeDefined();
    expect(nestjs?.plugins).toHaveProperty("@darraghor/nestjs-typed");

    expect(nestjs?.rules).toEqual({
      ...recommended?.rules,
      [PROVIDER_RULE]: [
        "error",
        {
          src: ["src/**/*.ts"],
          filterFromPaths: [
            "node_modules",
            ".test.",
            ".spec.",
            String.raw`[/\\](?:test|tests|__tests__)[/\\]`,
          ],
        },
      ],
    });
  });

  it("preserves production provider checks while excluding test modules", async () => {
    const eslint = eslintForConfigs(
      friday({
        nestjs: true,
      }),
    );

    const files = [
      "fixtures/projects/typed/test/error-model/throw.controller.ts",
      "fixtures/projects/typed/test/error-model/throw.module.ts",
      "fixtures/projects/typed/src/example.spec.ts",
    ];

    const productionConfig = (await eslint.calculateConfigForFile(typedFixture)) as
      Linter.Config | undefined;

    const testConfigs = (await Promise.all(
      files.map(file => eslint.calculateConfigForFile(path.resolve(packageRoot, file))),
    )) as (Linter.Config | undefined)[];

    expect(productionConfig?.rules?.[PROVIDER_RULE]).toEqual([
      2,
      {
        src: ["src/**/*.ts"],
        filterFromPaths: [
          "node_modules",
          ".test.",
          ".spec.",
          String.raw`[/\\](?:test|tests|__tests__)[/\\]`,
        ],
      },
    ]);

    for (const config of testConfigs) {
      expect(config?.rules?.[PROVIDER_RULE]).toEqual(expect.arrayContaining([0]));
    }
  });

  it.each([
    {
      cache: false,
      reverse: false,
    },
    {
      cache: false,
      reverse: true,
    },
    {
      cache: true,
      reverse: false,
    },
    {
      cache: true,
      reverse: true,
    },
  ])(
    "does not treat test module registrations as production providers ($cache, $reverse)",
    async ({cache, reverse}) => {
      const sourceFile = path.resolve(
        packageRoot,
        "fixtures/projects/typed/src/test-only-provider.ts",
      );

      const testModule = path.resolve(
        packageRoot,
        "fixtures/projects/typed/src/test/test-only.module.ts",
      );

      const config = friday({
        nestjs: true,
      }).map(entry => {
        if (entry.name !== NESTJS_CONFIG_NAME) {
          return entry;
        }

        const overrides: Linter.RulesRecord = {
          [PROVIDER_RULE]: [
            "error",
            {
              src: ["fixtures/projects/typed/src/**/*.ts"],
              filterFromPaths: [
                "node_modules",
                ".test.",
                ".spec.",
                String.raw`[/\\](?:test|tests|__tests__)[/\\]`,
              ],
            },
          ],
        };

        return {
          ...entry,
          rules: {
            ...entry.rules,
            ...overrides,
          },
        };
      });

      const eslint = new ESLint({
        cache,
        cwd: packageRoot,
        overrideConfig: config,
        overrideConfigFile: true,
        cacheLocation: path.resolve(packageRoot, "node_modules/.cache/nestjs-provider-order"),
      });

      const files = reverse ? [testModule, sourceFile] : [sourceFile, testModule];
      const results = await eslint.lintFiles(files);
      const providerResult = results.find(result => result.filePath === sourceFile);

      expect(providerResult).toBeDefined();
      expect(providerResult?.messages.map(message => message.ruleId)).toContain(PROVIDER_RULE);
    },
  );
});

describe("NestJS scope policy", () => {
  it("preserves ConfigurationService naming across overlapping NestJS and React", async () => {
    const eslint = eslintForConfigs(
      friday({
        nestjs: true,
        react: true,
      }),
    );

    const source = "export class ConfigurationService {}";

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/projects/typed/src/component.tsx"),
    });

    assert.ok(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(REPLACEMENTS_RULE);
  });

  it("allows stateless NestJS providers and framework names without weakening Node", async () => {
    const source = [
      "export class ConfigurationService {",
      "  get(): number { return 1; }",
      "}",
    ].join("\n");

    const [nestjsResult] = await eslintForConfigs(
      friday({
        nestjs: true,
      }),
    ).lintText(source, {
      filePath: typedFixture,
    });

    const [defaultResult] = await eslintForConfigs(friday()).lintText(source, {
      filePath: typedFixture,
    });

    assert.ok(nestjsResult);
    assert.ok(defaultResult);

    const nestjsRuleIds = nestjsResult.messages.map(message => message.ruleId);
    const defaultRuleIds = defaultResult.messages.map(message => message.ruleId);

    expect(nestjsRuleIds).not.toContain("class-methods-use-this");
    expect(nestjsRuleIds).not.toContain(REPLACEMENTS_RULE);
    expect(defaultRuleIds).toContain("class-methods-use-this");
    expect(defaultRuleIds).toContain(REPLACEMENTS_RULE);
  });

  it("preserves SQL NULL only in NestJS code", async () => {
    const source = "export const row = {total: null};\n";

    const [nestjsResult] = await eslintForConfigs(
      friday({
        nestjs: true,
      }),
    ).lintText(source, {
      filePath: typedFixture,
    });

    const [defaultResult] = await eslintForConfigs(friday()).lintText(source, {
      filePath: typedFixture,
    });

    assert.ok(nestjsResult);
    assert.ok(defaultResult);
    expect(nestjsResult.messages.map(message => message.ruleId)).not.toContain(NULL_RULE);
    expect(defaultResult.messages.map(message => message.ruleId)).toContain(NULL_RULE);
  });

  it("continues reporting unrelated Unicorn replacements in NestJS", async () => {
    const [result] = await eslintForConfigs(
      friday({
        nestjs: true,
      }),
    ).lintText("export const btn = 1;\n", {
      filePath: typedFixture,
    });

    assert.ok(result);
    expect(result.messages.map(message => message.ruleId)).toContain(REPLACEMENTS_RULE);
  });

  it("does not leak NestJS policy into adjacent monorepo applications", async () => {
    const eslint = eslintForConfigs(
      friday({
        nestjs: {
          files: ["apps/api/**"],
        },
      }),
    );

    const apiConfig = (await eslint.calculateConfigForFile(
      path.resolve(packageRoot, "apps/api/src/service.ts"),
    )) as Linter.Config | undefined;

    const webConfig = (await eslint.calculateConfigForFile(
      path.resolve(packageRoot, "apps/web/src/service.ts"),
    )) as Linter.Config | undefined;

    expect(apiConfig?.rules?.[NULL_RULE]).toEqual(expect.arrayContaining([0]));
    expect(webConfig?.rules?.[NULL_RULE]).toEqual(expect.arrayContaining([2]));
  });
});

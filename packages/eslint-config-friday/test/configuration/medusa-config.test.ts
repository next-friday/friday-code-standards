import {describe, expect, it} from "vitest";
import {configs as medusaConfigs} from "@medusajs/eslint-plugin";
import path from "node:path";
import type {Linter} from "eslint";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

const MEDUSA_RECOMMENDED_CONFIG = "friday/medusa/recommended";
const INDEX_EXPORT_RULE = "friday/index-export-only";
const SIDE_EFFECTS_RULE = "unicorn/no-top-level-side-effects";
const WORKFLOW_RULES = ["promise/always-return", "promise/catch-or-return", "unicorn/prefer-await"];

/**
 * Resolve the effective config ESLint applies to a project file.
 * @param configs Composed Friday configs.
 * @param file Project-relative file path.
 * @returns The effective config for the file.
 */
async function configForFile(configs: Linter.Config[], file: string) {
  return (await eslintForConfigs(configs).calculateConfigForFile(
    path.resolve(packageRoot, file),
  )) as Linter.Config | undefined;
}

describe("Medusa config", () => {
  it("composes the bundled official recommended rule set behind medusa: true", () => {
    const upstreamRules = medusaConfigs.recommended.flatMap(config =>
      Object.keys(config.rules ?? {}),
    );

    const fridayRules = friday({
      medusa: true,
    })
      .filter(config => config.name === MEDUSA_RECOMMENDED_CONFIG)
      .flatMap(config => Object.keys(config.rules ?? {}));

    expect(friday().map(config => config.name)).not.toContain(MEDUSA_RECOMMENDED_CONFIG);
    expect(fridayRules).toEqual(upstreamRules);
  });

  it("keeps test files linted despite the upstream preset ignores", async () => {
    const eslint = eslintForConfigs(
      friday({
        medusa: true,
      }),
    );

    await expect(
      eslint.isPathIgnored(path.resolve(packageRoot, "src/modules/produce/__tests__/unit.test.ts")),
    ).resolves.toBe(false);
  });

  it.each([
    {
      file: "src/modules/produce/index.ts",
      rules: [INDEX_EXPORT_RULE, SIDE_EFFECTS_RULE],
    },
    {
      file: "src/modules/produce/index.js",
      rules: [INDEX_EXPORT_RULE, SIDE_EFFECTS_RULE],
    },
    {
      file: "src/links/product-produce.ts",
      rules: [SIDE_EFFECTS_RULE],
    },
    {
      file: "src/links/product-produce.js",
      rules: [SIDE_EFFECTS_RULE],
    },
    {
      file: "src/api/middlewares.ts",
      rules: [SIDE_EFFECTS_RULE],
    },
    {
      file: "src/api/middlewares.js",
      rules: [SIDE_EFFECTS_RULE],
    },
    {
      file: "src/modules/produce/migrations/Migration20261019192044.ts",
      rules: ["unicorn/filename-case"],
    },
    {
      file: "src/modules/produce/models/produce-product.ts",
      rules: ["unicorn/no-null"],
    },
    {
      rules: WORKFLOW_RULES,
      file: "src/workflows/conditional.ts",
    },
    {
      rules: WORKFLOW_RULES,
      file: "src/workflows/steps/notify.js",
    },
  ])("delegates Medusa conventions in $file", async ({file, rules}) => {
    const medusaConfig = await configForFile(
      friday({
        medusa: true,
      }),
      file,
    );

    const defaultConfig = await configForFile(friday(), file);

    for (const rule of rules) {
      expect(medusaConfig?.rules?.[rule]).toEqual(expect.arrayContaining([0]));
      expect(defaultConfig?.rules?.[rule]).toEqual(expect.arrayContaining([2]));
    }
  });

  it.each([
    {
      file: "src/modules/produce/service.ts",
      rules: [
        INDEX_EXPORT_RULE,
        "unicorn/filename-case",
        "unicorn/no-null",
        SIDE_EFFECTS_RULE,
        ...WORKFLOW_RULES,
      ],
    },
    {
      rules: WORKFLOW_RULES,
      file: "src/workflows/hooks/product-created.ts",
    },
  ])("keeps Friday policy in ordinary Medusa file $file", async ({file, rules}) => {
    const config = await configForFile(
      friday({
        medusa: true,
      }),
      file,
    );

    for (const rule of rules) {
      expect(config?.rules?.[rule]).toEqual(expect.arrayContaining([2]));
    }
  });
});

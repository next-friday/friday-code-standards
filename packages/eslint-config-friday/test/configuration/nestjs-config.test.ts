import {describe, expect, it} from "vitest";
import nestjsPackage from "@darraghor/eslint-plugin-nestjs-typed";
import type {Linter} from "eslint";

import friday from "../../src/index";

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
});

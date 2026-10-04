import {describe, expect, it} from "vitest";
import nextPlugin from "@next/eslint-plugin-next";
import type {Linter} from "eslint";

import friday from "../../src/index";

const nextConfigs = Reflect.get(nextPlugin, "configs") as Record<
  string,
  {rules?: Linter.RulesRecord}
>;

describe("Next.js config", () => {
  it("mirrors the bundled official Core Web Vitals rule set behind nextjs: true", () => {
    const defaultConfigs = friday();

    const enabledConfigs = friday({
      nextjs: true,
    });

    const defaultNext = defaultConfigs.find(
      config => config.name === "friday/nextjs/core-web-vitals",
    );

    const next = enabledConfigs.find(config => config.name === "friday/nextjs/core-web-vitals");

    expect(defaultNext).toBeUndefined();
    expect(next).toBeDefined();
    expect(next?.plugins).toHaveProperty("@next/next");
    expect(next?.rules).toEqual(nextConfigs["core-web-vitals"]?.rules);
  });

  it("adds a narrow filename compatibility override for Next.js convention files", () => {
    const defaultConfigs = friday();

    const enabledConfigs = friday({
      nextjs: true,
    });

    const defaultFramework = defaultConfigs.find(
      config => config.name === "friday/nextjs/framework-files",
    );

    const frameworkIndex = enabledConfigs.findIndex(
      config => config.name === "friday/nextjs/framework-files",
    );

    const sonarIndex = enabledConfigs.findIndex(config => config.name === "friday/sonarjs");
    const framework = enabledConfigs[frameworkIndex];

    expect(defaultFramework).toBeUndefined();
    expect(sonarIndex).toBeGreaterThanOrEqual(0);
    expect(frameworkIndex).toBeGreaterThan(sonarIndex);
    expect(framework?.rules?.["sonarjs/file-name-differ-from-class"]).toBe("off");

    expect(framework?.files).toEqual(
      expect.arrayContaining([
        expect.stringContaining("**/app/**/"),
        expect.stringContaining("**/pages/**/"),
      ]),
    );
  });

  it("keeps React opt-in independent from Next.js like the Antfu surface", () => {
    const names = friday({
      nextjs: true,
    }).map(config => config.name);

    expect(names).not.toContain("friday/react");
    expect(names).not.toContain("friday/policy/react");
  });
});

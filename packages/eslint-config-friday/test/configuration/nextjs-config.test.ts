import {describe, expect, it} from "vitest";
import nextPlugin from "@next/eslint-plugin-next";
import type {Linter} from "eslint";

import friday from "../../src/index";

const NEXTJS_REACT_CONFIG = "friday/nextjs/react-framework-files";

const nextConfigs = Reflect.get(nextPlugin, "configs") as {
  "core-web-vitals": {
    rules: Linter.RulesRecord;
  };
};

describe("Next.js config", () => {
  it("composes the bundled official Core Web Vitals rule set", () => {
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
    expect(next?.rules).toEqual(nextConfigs["core-web-vitals"].rules);
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

  it("delegates module structure in Next.js convention files only when React and Next.js are enabled", () => {
    const nextOnly = friday({
      nextjs: true,
    });

    const reactOnly = friday({
      react: true,
    });

    const combined = friday({
      nextjs: true,
      react: true,
    });

    expect(nextOnly.find(config => config.name === NEXTJS_REACT_CONFIG)).toBeUndefined();
    expect(reactOnly.find(config => config.name === NEXTJS_REACT_CONFIG)).toBeUndefined();

    const fridayReactIndex = combined.findIndex(config => config.name === "friday/policy/react");
    const nextjsReactIndex = combined.findIndex(config => config.name === NEXTJS_REACT_CONFIG);
    const nextjsReact = combined[nextjsReactIndex];

    expect(nextjsReactIndex).toBeGreaterThan(fridayReactIndex);
    expect(nextjsReact?.rules?.["friday/component-module"]).toBe("off");

    expect(nextjsReact?.files).toEqual(
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
    expect(names).not.toContain("friday/policy/react-entrypoint");
    expect(names).not.toContain(NEXTJS_REACT_CONFIG);
  });
});

import {describe, expect, it} from "vitest";

describe("public API", () => {
  it("exports the canonical config factory", async () => {
    const module = await import("../../src/index.ts");

    expect(Object.keys(module)).toEqual(["default"]);
    expect(module.default).toEqual(expect.any(Function));
    expect(module.default()).toEqual(expect.any(Array));
  });

  it("keeps company policy mandatory and framework contexts explicit", async () => {
    const {default: friday} = await import("../../src/index.ts");
    const defaultNames = friday().map(config => config.name);

    const nestjsNames = friday({
      nestjs: true,
    }).map(config => config.name);

    const reactNames = friday({
      react: true,
    }).map(config => config.name);

    const nextjsNames = friday({
      nextjs: true,
    }).map(config => config.name);

    expect(defaultNames).toContain("friday/browser/globals");
    expect(defaultNames).toContain("friday/node");
    expect(defaultNames).toContain("friday/vitest");
    expect(defaultNames).toContain("friday/json");
    expect(defaultNames).toContain("friday/markdown");
    expect(defaultNames).toContain("friday/package-json");
    expect(defaultNames).toContain("friday/yaml");
    expect(defaultNames).toContain("friday/toml");
    expect(defaultNames).not.toContain("friday/nestjs/recommended");
    expect(defaultNames).not.toContain("friday/react");
    expect(defaultNames).not.toContain("friday/policy/react");
    expect(defaultNames).not.toContain("friday/jsx-a11y");
    expect(defaultNames).not.toContain("friday/react-hooks");
    expect(defaultNames).not.toContain("friday/nextjs/core-web-vitals");
    expect(nestjsNames).toContain("friday/nestjs/recommended");
    expect(reactNames).toContain("friday/react");
    expect(reactNames).toContain("friday/policy/react");
    expect(reactNames).toContain("friday/jsx-a11y");
    expect(reactNames).toContain("friday/react-hooks");
    expect(nextjsNames).toContain("friday/nextjs/core-web-vitals");
  });
});

import {describe, expect, it} from "vitest";

import friday from "../../src/index";

const WEB_FILES = ["apps/web/**"];
const API_FILES = ["apps/api/**"];
const TYPESCRIPT_FILE = "**/*.ts";

/**
 * Find a named config and assert that it exists.
 * @param configs Composed Friday configs.
 * @param name Config name to locate.
 * @returns The matching config.
 */
function configByName(configs: ReturnType<typeof friday>, name: string) {
  const config = configs.find(candidate => candidate.name === name);

  expect(config).toBeDefined();

  return config;
}

describe("framework and runtime scopes", () => {
  it("intersects React config file types with the consumer boundary", () => {
    const configs = friday({
      react: {
        files: WEB_FILES,
      },
    });

    expect(configByName(configs, "friday/unicorn/react")?.files).toContainEqual([
      ...WEB_FILES,
      TYPESCRIPT_FILE,
    ]);

    expect(configByName(configs, "friday/react-hooks")?.files).toContainEqual([
      ...WEB_FILES,
      TYPESCRIPT_FILE,
    ]);
  });

  it("keeps framework capabilities inside independent monorepo boundaries", () => {
    const configs = friday({
      nestjs: {
        files: API_FILES,
      },
      nextjs: {
        files: WEB_FILES,
      },
      react: {
        files: WEB_FILES,
      },
    });

    expect(configByName(configs, "friday/nestjs/recommended")?.files).toContainEqual([
      ...API_FILES,
      TYPESCRIPT_FILE,
    ]);

    expect(configByName(configs, "friday/nextjs/core-web-vitals")?.files).toContainEqual([
      ...WEB_FILES,
      TYPESCRIPT_FILE,
    ]);
  });

  it("intersects Next.js and React boundaries for shared compatibility rules", () => {
    const reactFiles = ["apps/**"];

    const configs = friday({
      nextjs: {
        files: WEB_FILES,
      },
      react: {
        files: reactFiles,
      },
    });

    const files = configByName(configs, "friday/nextjs/react-framework-files")?.files;

    expect(files).toBeDefined();
    expect(files).not.toHaveLength(0);

    expect(files).toEqual(
      expect.arrayContaining([expect.arrayContaining([...reactFiles, ...WEB_FILES])]),
    );

    expect(files?.every(pattern => Array.isArray(pattern) && pattern.length === 3)).toBe(true);
  });

  it("allows browser and Node runtimes to be scoped independently", () => {
    const configs = friday({
      browser: {
        files: WEB_FILES,
      },
      node: {
        files: API_FILES,
      },
    });

    expect(configByName(configs, "friday/browser/globals")?.files).toContainEqual([
      ...WEB_FILES,
      TYPESCRIPT_FILE,
    ]);

    expect(configByName(configs, "friday/node")?.files).toContainEqual([
      ...API_FILES,
      TYPESCRIPT_FILE,
    ]);
  });

  it("preserves boolean capability behavior for existing consumers", () => {
    const configs = friday({
      react: true,
    });

    expect(configByName(configs, "friday/unicorn/react")?.files).toContain(TYPESCRIPT_FILE);
  });
});

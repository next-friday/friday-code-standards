import {describe, expect, it} from "vitest";
import {format} from "prettier";

import config from "../src/index.ts";

describe("prettier-config-friday", () => {
  it("exports the deterministic formatting policy", () => {
    expect(config).toMatchObject({
      endOfLine: "lf",
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: false,
      semi: true,
      singleQuote: false,
      useTabs: false,
    });

    expect(config.plugins).toHaveLength(1);

    const serializedPlugins = JSON.stringify(config.plugins);

    expect(serializedPlugins).toContain('"languages":[');
    expect(serializedPlugins).toContain('"name":"husky"');
  });

  it("normalizes JavaScript and line endings", async () => {
    const formatted = await format('const value={a:"x"}\r\n', {
      ...config,
      parser: "babel",
    });

    expect(formatted).toBe('const value = {a: "x"};\n');
  });

  it("formats shell through the bundled plugin", async () => {
    const formatted = await format(
      '#!/usr/bin/env sh\nif [ "$value" = "1" ]; then\n\techo yes\nfi\n',
      {
        ...config,
        parser: "sh",
      },
    );

    expect(formatted).toContain("  echo yes");
    expect(formatted).not.toContain("\techo yes");
  });
});

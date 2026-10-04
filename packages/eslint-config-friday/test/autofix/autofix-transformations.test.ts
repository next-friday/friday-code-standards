import {describe, expect, it} from "vitest";

import {fullConfig} from "../helpers";

import {fixTwice} from "./autofix.helper";

describe("autofix safety and idempotence", () => {
  it("normalizes representative stylistic source once", async () => {
    const output = await fixTwice(
      fullConfig,
      "//comment without space\nexport const value = 1;\n",
      "fixtures/autofix/stylistic.js",
    );

    expect(output).toBe("// comment without space\nexport const value = 1;\n");
  });

  it("expands multi-property object literal braces idempotently", async () => {
    const output = await fixTwice(
      fullConfig,
      "export const value = {first: 1, second: 2};\n",
      "fixtures/autofix/object-layout.js",
    );

    expect(output).toContain("export const value = {\n");
    expect(output).toContain("first: 1");
    expect(output).toContain("second: 2");
    expect(output.endsWith("\n};\n")).toBe(true);
  });

  it("does not auto-remove an unused import", async () => {
    const output = await fixTwice(
      fullConfig,
      'import { readFileSync } from "node:fs";\nexport const value = 1;\n',
      "fixtures/autofix/unused-import.js",
    );

    expect(output).toContain("readFileSync");
    expect(output).toContain("export const value = 1;");
  });

  it("normalizes top-level single-parameter arrows idempotently", async () => {
    const output = await fixTwice(
      fullConfig,
      "export const identity = (value) => { return value; };\n",
      "fixtures/autofix/arrow-parens.js",
    );

    expect(output).toContain("export function identity");
  });

  it("orders imports deterministically", async () => {
    const output = await fixTwice(
      fullConfig,
      'import z from "z";\nimport a from "a";\n\nexport { a, z };\n',
      "fixtures/autofix/import-order.js",
    );

    expect(output.indexOf("default as a")).toBeLessThan(output.indexOf("default as z"));
  });

  it("sorts explicitly sortable arrays by natural order", async () => {
    const output = await fixTwice(
      fullConfig,
      'export const sortedValues = ["item10", "item2", "item1"];\n',
      "fixtures/autofix/array.js",
    );

    expect(output.indexOf("item1")).toBeLessThan(output.indexOf("item2"));
    expect(output.indexOf("item2")).toBeLessThan(output.indexOf("item10"));
  });

  it("preserves semantic array order without explicit opt-in", async () => {
    const output = await fixTwice(
      fullConfig,
      'export const rule = ["error", "always"];\n',
      "fixtures/autofix/array.js",
    );

    expect(output.indexOf("error")).toBeLessThan(output.indexOf("always"));
  });

  it("normalizes template strings and object shorthand once", async () => {
    const output = await fixTwice(
      fullConfig,
      'export const greet = (name) => {\n  const value = "Hello "+name;\n\n  return { value: value };\n};\n',
      "fixtures/autofix/modern-js.js",
    );

    expect(output).toContain("export function greet");
    expect(output).toContain(`const value = \`Hello \${name}\`;`);
    expect(output).toContain("return {\n");
    expect(output).not.toContain("value: value");
  });
});

import {assert, describe, expect, it} from "vitest";

import {eslintForConfigs} from "../helpers";
import {perfectionist} from "../../src/configs/perfectionist";

const FUNCTION_OPEN = "export function sample(input) {";
const OBJECT_OPEN = "  const {";
const REST_PROPERTIES = "    ...properties";
const OBJECT_CLOSE = "  } = input;";
const FUNCTION_CLOSE = "}";

const eslint = eslintForConfigs(perfectionist, {
  fix: true,
});

describe("object value order", () => {
  it("groups destructured defaults by value kind without blank lines", async () => {
    const source = [
      FUNCTION_OPEN,
      OBJECT_OPEN,
      "    xxxx = 5,",
      "    children,",
      '    side = "right",',
      "    showCloseButton = false,",
      "    className,",
      '    foo = "bar",',
      "    exampleNumber = 1,",
      REST_PROPERTIES,
      OBJECT_CLOSE,
      "",
      "  return [children, className, showCloseButton, exampleNumber, xxxx, foo, side, properties];",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const expected = [
      FUNCTION_OPEN,
      OBJECT_OPEN,
      '    foo = "bar",',
      '    side = "right",',
      "    exampleNumber = 1,",
      "    xxxx = 5,",
      "    showCloseButton = false,",
      "    children,",
      "    className,",
      REST_PROPERTIES,
      OBJECT_CLOSE,
      "",
      "  return [children, className, showCloseButton, exampleNumber, xxxx, foo, side, properties];",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });

  it("groups returned object values by value kind", async () => {
    const source = [
      FUNCTION_OPEN,
      "  return {",
      "    children: input.children,",
      "    showCloseButton: false,",
      '    side: "right",',
      "    xxxx: 5,",
      "    className: input.className,",
      '    foo: "bar",',
      "    exampleNumber: 1,",
      "  };",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const expected = [
      FUNCTION_OPEN,
      "  return {",
      '    foo: "bar",',
      '    side: "right",',
      "    exampleNumber: 1,",
      "    xxxx: 5,",
      "    showCloseButton: false,",
      "    children: input.children,",
      "    className: input.className,",
      "  };",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });

  it("normalizes generic object groups without blank lines or group comments", async () => {
    const source = [
      "export const sample = {",
      "  options,",
      "  mapped: sourceData,",
      '  title: "bar",',
      "",
      "  visible: false,",
      '  config: {mode: "strict"},',
      "",
      "  limit: 10,",
      "  data,",
      '  name: "foo",',
      "",
      "  handler: () => {},",
      "  enabled: true,",
      "  count: 1,",
      "};",
      "",
    ].join("\n");

    const expected = [
      "export const sample = {",
      "  data,",
      "  mapped: sourceData,",
      "  options,",
      '  name: "foo",',
      '  title: "bar",',
      "  count: 1,",
      "  limit: 10,",
      "  enabled: true,",
      "  visible: false,",
      '  config: {mode: "strict"},',
      "  handler: () => {},",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });

  it("uses semantic order for ESLint rule metadata", async () => {
    const source = [
      "export const rule = {",
      "  meta: {",
      '    messages: {problem: "Problem"},',
      "",
      '    fixable: "whitespace",',
      "    schema: [],",
      "",
      '    docs: {description: "Description"},',
      '    type: "layout",',
      "  },",
      "  create() { return {}; },",
      "};",
      "",
    ].join("\n");

    const expected = [
      "export const rule = {",
      "  create() { return {}; },",
      "  meta: {",
      '    type: "layout",',
      '    docs: {description: "Description"},',
      '    fixable: "whitespace",',
      '    messages: {problem: "Problem"},',
      "    schema: [],",
      "  },",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });

  it("keeps dependency order ahead of natural sorting", async () => {
    const source = [
      FUNCTION_OPEN,
      OBJECT_OPEN,
      "    a = z,",
      "    z = input.value,",
      REST_PROPERTIES,
      OBJECT_CLOSE,
      "",
      "  return [a, z, properties];",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const expected = [
      FUNCTION_OPEN,
      OBJECT_OPEN,
      "    z = input.value,",
      "    a = z,",
      REST_PROPERTIES,
      OBJECT_CLOSE,
      "",
      "  return [a, z, properties];",
      FUNCTION_CLOSE,
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });
});

describe("generic configuration object order", () => {
  it("orders arrays before nested objects", async () => {
    const source = [
      "export const config = {",
      '  platform: "node",',
      "  clean: true,",
      "  dts: true,",
      "  sourcemap: false,",
      "  entry: {",
      '    index: "src/index.ts",',
      "  },",
      '  format: ["esm"],',
      "};",
      "",
    ].join("\n");

    const expected = [
      "export const config = {",
      '  platform: "node",',
      "  clean: true,",
      "  dts: true,",
      "  sourcemap: false,",
      '  format: ["esm"],',
      "  entry: {",
      '    index: "src/index.ts",',
      "  },",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "tsdown.config.ts",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });
});

describe("ESLint config object order", () => {
  it("uses semantic Flat Config order instead of generic value order", async () => {
    const source = [
      "const files = [];",
      "const rules = {};",
      "const plugin = {};",
      "",
      "export const config = [{",
      "  rules,",
      "  plugins: {example: plugin},",
      '  name: "friday/example",',
      "  files,",
      "}];",
      "",
    ].join("\n");

    const expected = [
      "const files = [];",
      "const rules = {};",
      "const plugin = {};",
      "",
      "export const config = [{",
      "  files,",
      '  name: "friday/example",',
      "  plugins: {example: plugin},",
      "  rules,",
      "}];",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: "sample.js",
    });

    assert(result);
    expect(result.output).toBe(expected);
  });
});

import {assert, describe, expect, it} from "vitest";

import {perfectionist} from "../../src/configs/perfectionist";

import {eslintForConfigs} from "../helpers";

const eslint = eslintForConfigs(perfectionist, {
  fix: true,
});

const VALUE_OPEN = "export const value = {";
const FIRST_CALL = "z: first()";
const STATIC_VALUE = 'a: "static"';
const SECOND_CALL = "y: second()";
const OBJECT_CLOSE = "};";
const EMPTY_LINE = "";

/**
 * Apply the isolated Perfectionist config with autofix enabled.
 * @param source Source text to normalize.
 * @param filePath Virtual filename used for config matching.
 * @returns Autofixed source text.
 */
async function fix(source: string, filePath = "sample.js"): Promise<string> {
  const [result] = await eslint.lintText(source, {
    filePath,
  });

  assert(result);

  return result.output ?? source;
}

describe("object ordering safety", () => {
  it("preserves relative order of side-effecting values inside the fallback group", async () => {
    const output = await fix(
      [
        VALUE_OPEN,
        `  ${FIRST_CALL},`,
        `  ${STATIC_VALUE},`,
        `  ${SECOND_CALL},`,
        OBJECT_CLOSE,
        EMPTY_LINE,
      ].join("\n"),
    );

    expect(output.indexOf(STATIC_VALUE)).toBeLessThan(output.indexOf(FIRST_CALL));
    expect(output.indexOf(FIRST_CALL)).toBeLessThan(output.indexOf(SECOND_CALL));
  });

  it.each([
    ["interpolated template literal", ["a: `value $", "{second()}`"].join("")],
    ["quote-prefixed concatenation", 'a: "x" + second()'],
    ["quote-prefixed call expression", 'a: "x".concat(second())'],
    ["array value containing a call", "a: [second()]"],
    ["object value containing a call", "a: {x: second()}"],
  ])("preserves side-effect order for %s", async (_description, unsafeValue) => {
    const output = await fix(
      [VALUE_OPEN, `  ${FIRST_CALL},`, `  ${unsafeValue},`, OBJECT_CLOSE, EMPTY_LINE].join("\n"),
    );

    expect(output.indexOf(FIRST_CALL)).toBeLessThan(output.indexOf(unsafeValue));
  });

  it("keeps side-effect order across a computed-key partition", async () => {
    const output = await fix(
      [
        VALUE_OPEN,
        `  ${FIRST_CALL},`,
        "  [key()]: middle(),",
        `  ${STATIC_VALUE},`,
        `  ${SECOND_CALL},`,
        OBJECT_CLOSE,
        EMPTY_LINE,
      ].join("\n"),
    );

    expect(output.indexOf(FIRST_CALL)).toBeLessThan(output.indexOf("[key()]: middle()"));
    expect(output.indexOf("[key()]: middle()")).toBeLessThan(output.indexOf(SECOND_CALL));
  });

  it("keeps spread elements as ordering boundaries", async () => {
    const output = await fix(
      [
        VALUE_OPEN,
        `  ${FIRST_CALL},`,
        "  ...base,",
        `  ${STATIC_VALUE},`,
        `  ${SECOND_CALL},`,
        OBJECT_CLOSE,
        EMPTY_LINE,
      ].join("\n"),
    );

    expect(output.indexOf(FIRST_CALL)).toBeLessThan(output.indexOf("...base"));
    expect(output.indexOf("...base")).toBeLessThan(output.indexOf(SECOND_CALL));
  });

  it("does not treat an ordinary create-meta object as an ESLint rule", async () => {
    const output = await fix(
      [
        "export const service = {",
        "  create() { return {}; },",
        '  meta: {status: "ready"},',
        '  label: "service",',
        "};",
        "",
      ].join("\n"),
    );

    expect(output.indexOf("meta:")).toBeLessThan(output.indexOf("create()"));
  });

  it("does not treat generic array data as ESLint Flat Config", async () => {
    const output = await fix(
      [
        "export const data = [{",
        "  settings: {a: 1},",
        "  rules: {b: 2},",
        '  name: "not-eslint",',
        "}];",
        "",
      ].join("\n"),
    );

    expect(output.indexOf('name: "not-eslint"')).toBeLessThan(output.indexOf("rules:"));
    expect(output.indexOf("rules:")).toBeLessThan(output.indexOf("settings:"));
  });
});

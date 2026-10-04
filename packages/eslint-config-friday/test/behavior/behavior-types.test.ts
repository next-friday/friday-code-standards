import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslint, projectRoot} from "./behavior.helper";

const TYPE_SPECIFIER_STYLE = "import-x/consistent-type-specifier-style";
const VALID_TS = "src/valid.ts";

describe("type-aware behavior", () => {
  it("loads a typed project source file without parser failures", async () => {
    const [result] = await eslint.lintFiles(path.resolve(projectRoot, VALID_TS));

    assert(result);
    expect(result.fatalErrorCount).toBe(0);
  });

  it("reports explicit any types", async () => {
    const [result] = await eslint.lintText("export const value: any = 1;\n", {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-explicit-any",
    );
  });

  it("reports a floating promise with type information", async () => {
    const [result] = await eslint.lintFiles(path.resolve(projectRoot, "src/invalid.ts"));

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-floating-promises",
    );
  });

  it("permits empty interfaces in declaration files but reports them in source", async () => {
    const declarationSource = "export interface Marker {}\n";

    const [dtsResult] = await eslint.lintText(declarationSource, {
      filePath: path.resolve(projectRoot, "src/types.d.ts"),
    });

    assert(dtsResult);

    expect(dtsResult.messages.map(message => message.ruleId)).not.toContain(
      "@typescript-eslint/no-empty-object-type",
    );

    const [tsResult] = await eslint.lintText(declarationSource, {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(tsResult);

    expect(tsResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-empty-object-type",
    );
  });

  it("allows TypeScript overloads without core duplicate diagnostics", async () => {
    const source = [
      "/** Parses a number. */",
      "export function parse(value: number): number;",
      "/** Parses a string. */",
      "export function parse(value: string): string;",
      "/** Parses a supported value. */",
      "export function parse(value: number | string): number | string {",
      "  return value;",
      "}",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(result);

    const ruleIds = result.messages.map(message => message.ruleId);

    expect(ruleIds).not.toContain("no-redeclare");
    expect(ruleIds).not.toContain("@typescript-eslint/no-redeclare");
  });

  it("treats type-only references as used without duplicate unused-variable diagnostics", async () => {
    const source = [
      "interface User {",
      "  id: string;",
      "}",
      "export const getId = (user: User): string => user.id;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(result);

    const ruleIds = result.messages.map(message => message.ruleId);

    expect(ruleIds).not.toContain("no-unused-vars");
    expect(ruleIds).not.toContain("@typescript-eslint/no-unused-vars");
  });

  it("rejects inline type import specifiers", async () => {
    const source = [
      'import {type Sample} from "./sample.type";',
      'import {type Foo, bar} from "./import-sample";',
      "export type SampleAlias = Sample;",
      "export type FooAlias = Foo;",
      "export const value = bar;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(result);

    expect(result.messages.filter(message => message.ruleId === TYPE_SPECIFIER_STYLE)).toHaveLength(
      2,
    );
  });

  it("allows separate top-level type imports", async () => {
    const source = [
      'import type {Sample} from "./sample.type";',
      'import {bar} from "./import-sample";',
      'import type {Foo} from "./import-sample";',
      "export type SampleAlias = Sample;",
      "export type FooAlias = Foo;",
      "export const value = bar;",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, VALID_TS),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(TYPE_SPECIFIER_STYLE);
  });
});

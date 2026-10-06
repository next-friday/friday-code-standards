import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslintForConfigs, fullConfig, packageRoot} from "../helpers";

import {eslint, javascriptFixture, projectRoot} from "./behavior.helper";

const PERFECTIONIST_SORT_IMPORTS = "perfectionist/sort-imports";
const NAME_REPLACEMENTS = "unicorn/name-replacements";
const REACT_SOURCE = "src/component.tsx";
const SONARJS_DUPLICATE_STRING = "sonarjs/no-duplicate-string";
const VALID_SOURCE = "src/valid.ts";

const eslintWithFix = eslintForConfigs(fullConfig, {
  fix: true,
});

describe("Import ordering behavior", () => {
  it("groups relative imports by path depth with type imports last in each layer", async () => {
    const source = [
      'import type {SiblingType} from "./sibling-type";',
      'import {siblingValue} from "./sibling-value";',
      'import type {ParentTwoType} from "../../parent-two-type";',
      'import {zValue} from "../../a-path";',
      'import {aValue} from "../../z-path";',
      'import {parentTwoValue} from "../../parent-two-value";',
      'import {indexValue} from "./index";',
      'import type {IndexType} from "./index.ts";',
      'import {parentFourValue} from "../../../../parent-four-value";',
      'import type {ParentFourType} from "../../../../parent-four-type";',
      'import {parentOneValue} from "../parent-one-value";',
      'import type {ParentOneType} from "../parent-one-type";',
      'import type {ParentThreeType} from "../../../parent-three-type";',
      'import {parentThreeValue} from "../../../parent-three-value";',
      "",
    ].join("\n");

    const expected = [
      'import {parentFourValue} from "../../../../parent-four-value";',
      'import type {ParentFourType} from "../../../../parent-four-type";',
      "",
      'import {parentThreeValue} from "../../../parent-three-value";',
      'import type {ParentThreeType} from "../../../parent-three-type";',
      "",
      'import {aValue} from "../../z-path";',
      'import {parentTwoValue} from "../../parent-two-value";',
      'import {zValue} from "../../a-path";',
      'import type {ParentTwoType} from "../../parent-two-type";',
      "",
      'import {parentOneValue} from "../parent-one-value";',
      'import type {ParentOneType} from "../parent-one-type";',
      "",
      'import {siblingValue} from "./sibling-value";',
      'import type {SiblingType} from "./sibling-type";',
      "",
      'import {indexValue} from "./index";',
      'import type {IndexType} from "./index.ts";',
      "",
    ].join("\n");

    const [result] = await eslintWithFix.lintText(source, {
      filePath: path.resolve(projectRoot, VALID_SOURCE),
    });

    assert(result);
    expect(result.output).toBe(expected);
  });
});

describe("JavaScript policy behavior", () => {
  it.each([
    {
      expectedRule: "no-unused-vars",
      name: "unused JavaScript variables",
      source: "const unused = 1;\n",
    },
    {
      expectedRule: "no-var",
      name: "var in shared JavaScript handwriting",
      source: "export function increment(value) { var next = value + 1; return next; }\n",
    },
    {
      expectedRule: "eqeqeq",
      name: "loose equality in shared JavaScript handwriting",
      source: "export const equivalent = (left, right) => left == right;\n",
    },
    {
      expectedRule: "max-classes-per-file",
      name: "multiple classes in one file",
      source: "export class First {}\nexport class Second {}\n",
    },
    {
      expectedRule: "sonarjs/no-parameter-reassignment",
      name: "parameter reassignment",
      source: "export function reset(value) { value = 0; return value; }\n",
    },
    {
      expectedRule: "prefer-destructuring",
      name: "property access without destructuring",
      source: "export function read(source) { const value = source.value; return value; }\n",
    },
    {
      expectedRule: "vars-on-top",
      name: "variable declarations below statements",
      source: "export function compute() { doWork(); var result = 1; return result; }\n",
    },
    {
      expectedRule: "one-var",
      name: "multiple declarations in one statement",
      source: "export const first = 1, second = 2;\n",
    },
    {
      expectedRule: "consistent-return",
      name: "inconsistent return values",
      source:
        "export function pick(flag) { if (flag) { return 1; } return; }\nexport function doWork() {}\n",
    },
    {
      expectedRule: "no-plusplus",
      name: "increment operators",
      source: "export function advance(index) { index++; return index; }\n",
    },
    {
      expectedRule: "no-underscore-dangle",
      name: "unprefixed private member access",
      source: "export const instance = {};\nexport const value = instance._internal;\n",
    },
  ])("rejects $name", async ({expectedRule, source}) => {
    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(expectedRule);
  });

  it("prefers literal constructors and dot property access", async () => {
    const source = [
      "export const build = value => {",
      "  const object = new Object();",
      "  const items = new Array(value, value);",
      '  object["value"] = items[0];',
      "  return object;",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);

    const ruleIds = result.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("no-object-constructor");
    expect(ruleIds).toContain("no-array-constructor");
    expect(ruleIds).toContain("dot-notation");
  });

  it("prefers rest/spread and default parameters last", async () => {
    const source = [
      "export const call = (fallback = 0, action, args) =>",
      "  action.apply(undefined, args) ?? fallback;",
      "export function collect() { return Array.from(arguments); }",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);

    const ruleIds = result.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("default-param-last");
    expect(ruleIds).toContain("unicorn/prefer-spread");
    expect(ruleIds).toContain("prefer-rest-params");
  });

  it("allows for-of as the loop form recommended by Unicorn", async () => {
    const source = [
      "export function collect(items) {",
      "  const output = [];",
      "  for (const item of items) {",
      "    output.push(item);",
      "  }",
      "  return output;",
      "}",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/loop.js"),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain("no-restricted-syntax");
  });

  it("requires an explicit parseInt radix", async () => {
    const source = [
      "export const parse = (object, key, value) => {",
      "  if (object) return Object.prototype.hasOwnProperty.call(object, key);",
      "  return parseInt(value);",
      "};",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);

    const ruleIds = result.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("radix");
  });

  it("reports the third repetition of a duplicated string", async () => {
    const source = [
      'const first = "repeated-value";',
      'const second = "repeated-value";',
      'const third = "repeated-value";',
      "export { first, second, third };",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(SONARJS_DUPLICATE_STRING);
  });

  it("accepts the exempted application/json literal", async () => {
    const source = [
      'const first = "application/json";',
      'const second = "application/json";',
      'const third = "application/json";',
      "export { first, second, third };",
      "",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).not.toContain(SONARJS_DUPLICATE_STRING);
  });

  it("reports hard-coded passwords through friday sonarjs policy", async () => {
    const [result] = await eslint.lintText('const password = "NotARealCredential1234";\n', {
      filePath: javascriptFixture,
    });

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "sonarjs/no-hardcoded-passwords",
    );
  });

  it("reports unresolved imports through friday import-x policy", async () => {
    const [result] = await eslint.lintText(
      'import missing from "./does-not-exist";\nexport { missing };\n',
      {
        filePath: path.resolve(packageRoot, "fixtures/import-resolution.js"),
      },
    );

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("import-x/no-unresolved");
  });

  it("reports node protocol violations through friday unicorn policy", async () => {
    const [result] = await eslint.lintText('import fs from "fs";\nexport { fs };\n', {
      filePath: path.resolve(packageRoot, "fixtures/unicorn-sample.js"),
    });

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "unicorn/prefer-node-protocol",
    );
  });
});

describe("abbreviation policy behavior", () => {
  it.each([
    {
      filePath: VALID_SOURCE,
      source: "export function normalize(arg: unknown): unknown { return arg; }\n",
    },
    {
      filePath: REACT_SOURCE,
      source: "export function Component(opts: unknown): unknown { return opts; }\n",
    },
  ])("reports unrelated abbreviations in $filePath", async ({filePath, source}) => {
    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(projectRoot, filePath),
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(NAME_REPLACEMENTS);
  });

  it.each([
    {
      expectedRule: "promise/catch-or-return",
      name: "unhandled promises",
      source: "export function wait() { Promise.resolve().then(() => 1); }\n",
    },
    {
      expectedRule: "regexp/no-dupe-characters-character-class",
      name: "duplicate characters in regular expression character classes",
      source: "export const pattern = /[aa]/;\n",
    },
    {
      expectedRule: "n/no-deprecated-api",
      name: "deprecated Node.js APIs",
      source: 'import buffer from "node:buffer";\nexport const b = new buffer.Buffer(10);\n',
    },
    {
      expectedRule: "jsdoc/check-alignment",
      name: "misaligned JSDoc comment blocks",
      source: "/**\n* missing space\n */\nexport const documented = 1;\n",
    },
    {
      expectedRule: PERFECTIONIST_SORT_IMPORTS,
      name: "unsorted imports through perfectionist policy",
      source: 'import z from "z";\nimport a from "a";\nexport { a, z };\n',
    },
    {
      expectedRule: PERFECTIONIST_SORT_IMPORTS,
      name: "specifier sort order ahead of module path order",
      source:
        'import nPlugin from "eslint-plugin-n";\nimport globals from "globals";\nexport { globals, nPlugin };\n',
    },
    {
      expectedRule: PERFECTIONIST_SORT_IMPORTS,
      filePath: VALID_SOURCE,
      name: "blank line splitting a parent tier from its type import",
      source:
        'import type {A} from "../a";\n\nimport {b} from "../b";\nexport { b };\nexport type { A };\n',
    },
    {
      expectedRule: "@stylistic/spaced-comment",
      name: "unspaced comments in shared stylistic handwriting",
      source: "//comment without space\nexport const value = 1;\n",
    },
    {
      expectedRule: "sonarjs/code-eval",
      name: "eval invocations in shared JavaScript handwriting",
      source: "export const evaluate = code => eval(code);\n",
    },
    {
      expectedRule: "n/no-path-concat",
      name: "string path concatenation in Node.js handwriting",
      source: 'export const destination = __dirname + "/target.js";\n',
    },
  ])("reports $name in shared JavaScript handwriting", async ({expectedRule, filePath, source}) => {
    const [result] = await eslint.lintText(source, {
      filePath: filePath ? path.resolve(projectRoot, filePath) : javascriptFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(expectedRule);
  });
});

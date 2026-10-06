import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslint, projectRoot} from "./behavior.helper";

/**
 * Lint a TypeScript snippet with the complete Friday configuration.
 * @param source Source text to lint.
 * @param filename Fixture filename used to resolve filename-sensitive rules.
 * @returns Rule identifiers reported by ESLint.
 */
async function lintTypeScript(source: string, filename = "valid.ts") {
  const [result] = await eslint.lintText(source, {
    filePath: path.resolve(projectRoot, `src/${filename}`),
  });

  assert(result);

  return result.messages.map(message => message.ruleId);
}

describe("conflicting rule policies", () => {
  it("keeps filename naming separate from identifier replacements", async () => {
    const validRules = await lintTypeScript("export const value = 1;\n", "drawer.utils.ts");
    const invalidRules = await lintTypeScript("export const foo_bar = 1;\n", "drawer.utils.ts");

    expect(validRules).not.toContain("unicorn/name-replacements");
    expect(invalidRules.length).toBeGreaterThan(0);
  });

  it("uses null for explicit empty assignments while rejecting explicit undefined assignments", async () => {
    const nullRules = await lintTypeScript("export let value: string | null = null;\n");

    const undefinedRules = await lintTypeScript(
      "export let value: string | undefined = undefined;\n",
    );

    expect(nullRules).not.toContain("unicorn/no-null");
    expect(undefinedRules).toContain("sonarjs/no-undefined-assignment");
  });

  it("keeps class grouping and deterministic ordering compatible", async () => {
    const validSource = [
      "export class Queue {",
      "  private queue = 1;",
      "  public get visibleToasts(): number { return this.queue; }",
      "}",
      "",
    ].join("\n");

    const invalidSource = [
      "export class Queue {",
      "  public get visibleToasts(): number { return this.queue; }",
      "  private queue = 1;",
      "}",
      "",
    ].join("\n");

    const validRules = await lintTypeScript(validSource);
    const invalidRules = await lintTypeScript(invalidSource);

    expect(validRules).not.toContain("unicorn/consistent-class-member-order");
    expect(validRules).not.toContain("perfectionist/sort-classes");
    expect(invalidRules).toContain("unicorn/consistent-class-member-order");
    expect(invalidRules).toContain("perfectionist/sort-classes");
  });

  it("sorts module declarations without breaking dependency order", async () => {
    const source = [
      "function Code(): number { return TypographyRoot(); }",
      "function Heading(): number { return TypographyRoot(); }",
      "function TypographyRoot(): number { return 1; }",
      "export {Code, Heading, TypographyRoot};",
      "",
    ].join("\n");

    const ruleIds = await lintTypeScript(source);

    expect(ruleIds).not.toContain("perfectionist/sort-modules");
    expect(ruleIds).not.toContain("@typescript-eslint/no-use-before-define");
  });

  it("does not weaken Sonar identifier naming without a reproduced conflict", async () => {
    const ruleIds = await lintTypeScript("export const bad_name = 1;\n");

    expect(ruleIds).toContain("sonarjs/variable-name");
  });

  it("allows only statement-form void for intentionally discarded promises", async () => {
    const fireAndForget = await lintTypeScript(
      [
        "const run = async (): Promise<void> => Promise.resolve();",
        "void run();",
        "export {run};",
        "",
      ].join("\n"),
    );

    const expressionVoid = await lintTypeScript("export const value = void 0;\n");

    expect(fireAndForget).not.toContain("no-void");
    expect(fireAndForget).not.toContain("@typescript-eslint/no-floating-promises");
    expect(expressionVoid).toContain("no-void");
  });
});

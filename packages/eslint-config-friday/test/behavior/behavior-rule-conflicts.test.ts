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

/**
 * Lint a React paragraph whose multi-line link is followed by the given JSX lines.
 * @param afterLink JSX source that closes the link and follows it.
 * @returns Rule identifiers reported by ESLint.
 */
async function lintInlineLink(afterLink: string) {
  const source = [
    "export function Intro() {",
    "  return (",
    "    <p>",
    '      Head over to{" "}',
    '      <a className="font-medium" href="https://vercel.com/templates">',
    "        Templates",
    afterLink,
    "    </p>",
    "  );",
    "}",
    "",
  ].join("\n");

  return lintTypeScript(source, "component.tsx");
}

describe("conflicting rule policies", () => {
  it("keeps filename naming separate from identifier replacements", async () => {
    const validRules = await lintTypeScript("export const value = 1;\n", "drawer.utils.ts");

    const [invalidFilenameResult] = await eslint.lintFiles(
      path.resolve(projectRoot, "src/Invalid_File.ts"),
    );

    assert(invalidFilenameResult);
    expect(validRules).not.toContain("unicorn/name-replacements");

    expect(invalidFilenameResult.messages.map(message => message.ruleId)).toContain(
      "unicorn/filename-case",
    );
  });

  it("accepts Prettier output for exponent under modulo while still reporting other mixed groups", async () => {
    const prettierOutputRules = await lintTypeScript(
      "export const seed = (x: number): number => x % 2 ** 31;\n",
    );

    const mixedGroupRules = await lintTypeScript(
      "export const sum = (a: number, b: number, c: number): number => a % b + c;\n",
    );

    expect(prettierOutputRules).not.toContain("@stylistic/no-mixed-operators");
    expect(mixedGroupRules).toContain("@stylistic/no-mixed-operators");
  });

  it("accepts Prettier inline JSX whitespace around multi-line links while still separating sibling elements", async () => {
    const inlineLinkRules = await lintInlineLink('      </a>{" "}\n      center.');
    const adjacentElementRules = await lintInlineLink("      </a>\n      <span>center.</span>");

    expect(inlineLinkRules).not.toContain("friday/jsx-newline-between-elements");
    expect(adjacentElementRules).toContain("friday/jsx-newline-between-elements");
  });

  it("allows React null contracts without weakening non-React files", async () => {
    const reactNullRules = await lintTypeScript(
      "export function Component(): null { return null; }\n",
      "component.tsx",
    );

    const nonReactNullRules = await lintTypeScript("export const value: string | null = null;\n");

    const undefinedRules = await lintTypeScript(
      "export let value: string | undefined = undefined;\n",
    );

    expect(reactNullRules).not.toContain("unicorn/no-null");
    expect(nonReactNullRules).toContain("unicorn/no-null");
    expect(undefinedRules).toContain("sonarjs/no-undefined-assignment");
  });

  it("keeps class grouping and deterministic ordering compatible", async () => {
    const validSource = [
      "export class Queue {",
      "  static create = (): Queue => new Queue();",
      "  static { void Queue.create; }",
      "  private queue = 1;",
      "  private settle = (): void => { this.queue += 1; };",
      "  public render = (): number => this.queue;",
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

  it("keeps module declaration order while enforcing dependencies", async () => {
    const reverseAlphabetical = await lintTypeScript(
      ["export const zebra = 1;", "export const alpha = 2;", ""].join("\n"),
    );

    const source = [
      "function Code(): number { return TypographyRoot(); }",
      "function Heading(): number { return TypographyRoot(); }",
      "function TypographyRoot(): number { return 1; }",
      "export {Code, Heading, TypographyRoot};",
      "",
    ].join("\n");

    const ruleIds = await lintTypeScript(source);

    expect(reverseAlphabetical).not.toContain("perfectionist/sort-modules");
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

    const floatingPromise = await lintTypeScript(
      [
        "const run = async (): Promise<void> => Promise.resolve();",
        "run();",
        "export {run};",
        "",
      ].join("\n"),
    );

    const expressionVoid = await lintTypeScript("export const value = void 0;\n");

    expect(fireAndForget).not.toContain("no-void");
    expect(fireAndForget).not.toContain("@typescript-eslint/no-floating-promises");
    expect(floatingPromise).toContain("@typescript-eslint/no-floating-promises");
    expect(expressionVoid).toContain("no-void");
  });
});

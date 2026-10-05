import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslintForConfigs, packageRoot} from "../helpers";
import friday from "../../src/index";

import {eslint, projectRoot} from "./behavior.helper";

const COMPONENT_MODULE_RULE = "friday/component-module";
const COMPONENT_UNKNOWN = "export function Component(): unknown {";

const nextjsReactEslint = eslintForConfigs(
  friday({
    nextjs: true,
    react: true,
  }),
);

const genericJsxFixture = path.resolve(packageRoot, "fixtures/projects/untyped/component.jsx");
const nextjsPageFixture = path.resolve(packageRoot, "fixtures/projects/untyped/app/page.jsx");
const tsxFixture = path.resolve(projectRoot, "src/component.tsx");

describe("React behavior", () => {
  it.each([
    {
      name: "enforces the Rules of Hooks",
      rule: "react-hooks/rules-of-hooks",
      source: [
        "declare function useState(value: number): [number, (value: number) => void];",
        "export function Component({enabled}: {enabled: boolean}): null {",
        "  if (enabled) {",
        "    useState(0);",
        "  }",
        "  return null;",
        "}",
        "",
      ].join("\n"),
    },
    {
      name: "requires complete Hook dependency arrays",
      rule: "react-hooks/exhaustive-deps",
      source: [
        "declare function useEffect(effect: () => void, dependencies: readonly unknown[]): void;",
        "export function Component({value}: {value: string}): null {",
        "  useEffect(() => {",
        "    console.log(value);",
        "  }, []);",
        "  return null;",
        "}",
        "",
      ].join("\n"),
    },
    {
      name: "rejects array indexes as React keys",
      rule: "@eslint-react/no-array-index-key",
      source: [
        COMPONENT_UNKNOWN,
        "  return <div>{[1, 2].map((value, index) => <span key={index}>{value}</span>)}</div>;",
        "}",
        "",
      ].join("\n"),
    },
    {
      name: "rejects unknown React DOM properties",
      rule: "@eslint-react/dom-no-unknown-property",
      source: [COMPONENT_UNKNOWN, '  return <div class="content" />;', "}", ""].join("\n"),
    },
    {
      name: "requires alt text for images",
      rule: "jsx-a11y-x/alt-text",
      source: [COMPONENT_UNKNOWN, "  return <img />;", "}", ""].join("\n"),
    },
  ])("$name", async ({rule, source}) => {
    const [result] = await eslint.lintText(source, {
      filePath: tsxFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(rule);
  });

  it("allows Next.js framework declarations only in Next.js framework files", async () => {
    const source = [
      'export const metadata = {title: "Example"};',
      "export default function Page() { return <main />; }",
    ].join("\n");

    const [frameworkResult] = await nextjsReactEslint.lintText(source, {
      filePath: nextjsPageFixture,
    });

    const [genericResult] = await nextjsReactEslint.lintText(source, {
      filePath: genericJsxFixture,
    });

    assert(frameworkResult);
    assert(genericResult);

    expect(frameworkResult.messages.map(message => message.ruleId)).not.toContain(
      COMPONENT_MODULE_RULE,
    );

    expect(genericResult.messages.map(message => message.ruleId)).toContain(COMPONENT_MODULE_RULE);
  });
});

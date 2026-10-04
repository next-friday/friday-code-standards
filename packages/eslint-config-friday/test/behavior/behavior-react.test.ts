import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {eslint, projectRoot} from "./behavior.helper";

const COMPONENT_UNKNOWN = "export function Component(): unknown {";
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
});

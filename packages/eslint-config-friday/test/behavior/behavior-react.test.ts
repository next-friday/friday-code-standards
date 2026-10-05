import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import friday from "../../src/index";

import {eslintForConfigs, packageRoot} from "../helpers";

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
const nextjsPagesFixture = path.resolve(packageRoot, "fixtures/projects/untyped/pages/index.jsx");
const tsxFixture = path.resolve(projectRoot, "src/component.tsx");
const typescriptIndexFixture = path.resolve(projectRoot, "src/index.ts");

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
    {
      name: "requires named components to use function declarations",
      rule: "friday/component-definition-style",
      source: [
        "export const Component = (props: {label: string}) => <div>{props.label}</div>;",
      ].join("\n"),
    },
    {
      name: "requires the canonical props parameter name",
      rule: "friday/props-in-body",
      source: [
        "export function Component(properties: {label: string}) {",
        "  return <div>{properties.label}</div>;",
        "}",
      ].join("\n"),
    },
    {
      name: "requires the canonical props rest binding name",
      rule: "friday/props-in-body",
      source: [
        "export function Component(props: {id: string; label: string}) {",
        "  const {label, ...restProps} = props;",
        "  return <div {...restProps}>{label}</div>;",
        "}",
      ].join("\n"),
    },
  ])("$name", async ({rule, source}) => {
    const [result] = await eslint.lintText(source, {
      filePath: tsxFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain(rule);
  });

  it("enforces the canonical TypeScript component entrypoint contract", async () => {
    const source = [
      'import type {ComponentProps} from "react";',
      'import {ButtonRoot} from "./button";',
      "export const Button = ButtonRoot;",
      "export type Button = {",
      "  Props: ComponentProps<typeof ButtonRoot>;",
      "  RootProps: ComponentProps<typeof ButtonRoot>;",
      "};",
    ].join("\n");

    const [result] = await eslint.lintText(source, {
      filePath: typescriptIndexFixture,
    });

    assert(result);
    expect(result.messages.map(message => message.ruleId)).toContain("friday/component-entrypoint");
  });

  it("allows Next.js framework declarations only in Next.js framework files", async () => {
    const appSource = [
      'export const metadata = {title: "Example"};',
      "export default function Page() { return <main />; }",
    ].join("\n");

    const pagesSource = [
      "export async function getStaticProps() { return {props: {}}; }",
      "export default function Page() { return <main />; }",
    ].join("\n");

    const [appResult] = await nextjsReactEslint.lintText(appSource, {
      filePath: nextjsPageFixture,
    });

    const [pagesResult] = await nextjsReactEslint.lintText(pagesSource, {
      filePath: nextjsPagesFixture,
    });

    const [genericResult] = await nextjsReactEslint.lintText(appSource, {
      filePath: genericJsxFixture,
    });

    assert(appResult);
    assert(pagesResult);
    assert(genericResult);
    expect(appResult.messages.map(message => message.ruleId)).not.toContain(COMPONENT_MODULE_RULE);

    expect(pagesResult.messages.map(message => message.ruleId)).not.toContain(
      COMPONENT_MODULE_RULE,
    );

    expect(genericResult.messages.map(message => message.ruleId)).toContain(COMPONENT_MODULE_RULE);
  });
});

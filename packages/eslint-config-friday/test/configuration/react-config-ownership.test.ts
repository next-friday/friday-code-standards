import {describe, expect, it} from "vitest";

import {fridayReact} from "../../src/configs/friday";
import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../../src/globs";
import {jsxA11y} from "../../src/configs/jsx-a11y";
import {react} from "../../src/configs/react";
import {reactHooks} from "../../src/configs/react-hooks";

describe("React config ownership", () => {
  it.each([
    {
      name: "React semantics",
      plugins: ["@eslint-react"],
      config: react.filter(config => config.name !== "friday/react-imports"),
    },
    {
      config: fridayReact,
      name: "Next Friday React policy",
      plugins: ["friday"],
    },
    {
      config: jsxA11y,
      name: "JSX accessibility",
      plugins: ["jsx-a11y-x"],
    },
    {
      config: reactHooks,
      name: "React Hooks",
      plugins: ["react-hooks"],
    },
  ])("keeps $name on its intended plugin", ({config, plugins}) => {
    expect(config.length).toBeGreaterThan(0);

    for (const entry of config) {
      expect(Object.keys(entry.plugins ?? {})).toEqual(plugins);
    }
  });

  it("applies the React import policy across JavaScript and TypeScript", () => {
    const importPolicy = react.find(config => config.name === "friday/react-imports");

    expect(importPolicy?.files).toEqual(JAVASCRIPT_AND_TYPESCRIPT_FILES);
    expect(importPolicy?.plugins).toBeUndefined();

    expect(importPolicy?.rules?.["no-restricted-imports"]).toEqual([
      "error",
      {
        paths: [
          {
            message: "Use named imports from react instead.",
            name: "react",
            allowTypeImports: true,
            importNames: ["default"],
          },
        ],
      },
    ]);
  });

  it("enables deterministic Friday component contracts in the React context", () => {
    const reactPolicy = fridayReact.find(config => config.name === "friday/policy/react");

    const entrypointPolicy = fridayReact.find(
      config => config.name === "friday/policy/react-entrypoint",
    );

    expect(reactPolicy?.rules?.["friday/component-definition-style"]).toBe("error");

    expect(reactPolicy?.rules?.["friday/props-in-body"]).toEqual([
      "error",
      {
        parameterName: "props",
        restName: "rest",
      },
    ]);

    expect(entrypointPolicy?.rules?.["friday/component-entrypoint"]).toBe("error");

    expect(entrypointPolicy?.files).toEqual(
      expect.arrayContaining(["**/index.ts", "**/index.tsx", "**/index.mts", "**/index.cts"]),
    );
  });
});

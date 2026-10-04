import {describe, expect, it} from "vitest";

import {fridayReact} from "../../src/configs/friday";
import {jsxA11y} from "../../src/configs/jsx-a11y";
import {react} from "../../src/configs/react";
import {reactHooks} from "../../src/configs/react-hooks";

describe("React config ownership", () => {
  it.each([
    {
      config: react,
      name: "React semantics",
      plugins: ["@eslint-react"],
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
    expect(config).toHaveLength(1);

    const [entry] = config;

    expect(Object.keys(entry?.plugins ?? {})).toEqual(plugins);
  });
});

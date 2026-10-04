import jsxA11yPlugin from "eslint-plugin-jsx-a11y-x";
import type {Linter} from "eslint";

import {REACT_FILES} from "../globs";

const jsxA11yRules: Linter.RulesRecord = {
  "jsx-a11y-x/aria-activedescendant-has-tabindex": "error",
  "jsx-a11y-x/aria-props": "error",
  "jsx-a11y-x/aria-proptypes": "error",
  "jsx-a11y-x/aria-unsupported-elements": "error",
  "jsx-a11y-x/click-events-have-key-events": "error",
  "jsx-a11y-x/html-has-lang": "error",
  "jsx-a11y-x/iframe-has-title": "error",
  "jsx-a11y-x/img-redundant-alt": "error",
  "jsx-a11y-x/interactive-supports-focus": "error",
  "jsx-a11y-x/lang": "error",
  "jsx-a11y-x/mouse-events-have-key-events": "error",
  "jsx-a11y-x/no-access-key": "error",
  "jsx-a11y-x/no-redundant-roles": "error",
  "jsx-a11y-x/role-has-required-aria-props": "error",
  "jsx-a11y-x/role-supports-aria-props": "error",
  "jsx-a11y-x/scope": "error",
  "jsx-a11y-x/tabindex-no-positive": "error",
  "jsx-a11y-x/alt-text": [
    "error",
    {
      area: [],
      elements: ["img", "object", "area", 'input[type="image"]'],
      img: [],
      'input[type="image"]': [],
      object: [],
    },
  ],
  "jsx-a11y-x/anchor-has-content": [
    "error",
    {
      components: [],
    },
  ],
  "jsx-a11y-x/anchor-is-valid": [
    "error",
    {
      aspects: ["noHref", "invalidHref", "preferButton"],
      components: ["Link"],
      specialLink: ["to"],
    },
  ],
  "jsx-a11y-x/aria-role": [
    "error",
    {
      ignoreNonDOM: false,
    },
  ],
  "jsx-a11y-x/control-has-associated-label": [
    "error",
    {
      depth: 5,
      controlComponents: [],
      ignoreElements: ["audio", "canvas", "embed", "input", "textarea", "tr", "video"],
      ignoreRoles: [
        "grid",
        "listbox",
        "menu",
        "menubar",
        "radiogroup",
        "row",
        "tablist",
        "toolbar",
        "tree",
        "treegrid",
      ],
      labelAttributes: ["label"],
    },
  ],
  "jsx-a11y-x/heading-has-content": [
    "error",
    {
      components: [""],
    },
  ],
  "jsx-a11y-x/label-has-associated-control": [
    "error",
    {
      assert: "both",
      depth: 25,
      controlComponents: [],
      labelAttributes: [],
      labelComponents: [],
    },
  ],
  "jsx-a11y-x/media-has-caption": [
    "error",
    {
      audio: [],
      track: [],
      video: [],
    },
  ],
  "jsx-a11y-x/no-autofocus": [
    "error",
    {
      ignoreNonDOM: true,
    },
  ],
  "jsx-a11y-x/no-distracting-elements": [
    "error",
    {
      elements: ["marquee", "blink"],
    },
  ],
  "jsx-a11y-x/no-interactive-element-to-noninteractive-role": [
    "error",
    {
      tr: ["none", "presentation"],
    },
  ],
  "jsx-a11y-x/no-noninteractive-element-interactions": [
    "error",
    {
      handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
    },
  ],
  "jsx-a11y-x/no-noninteractive-element-to-interactive-role": [
    "error",
    {
      li: ["menuitem", "option", "row", "tab", "treeitem"],
      ol: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
      table: ["grid"],
      td: ["gridcell"],
      ul: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
    },
  ],
  "jsx-a11y-x/no-noninteractive-tabindex": [
    "error",
    {
      roles: ["tabpanel"],
      tags: [],
    },
  ],
  "jsx-a11y-x/no-static-element-interactions": [
    "error",
    {
      handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
    },
  ],
};

export const jsxA11y: Linter.Config[] = [
  {
    files: REACT_FILES,
    name: "friday/jsx-a11y",
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "jsx-a11y-x": jsxA11yPlugin,
    },
    rules: jsxA11yRules,
  },
];

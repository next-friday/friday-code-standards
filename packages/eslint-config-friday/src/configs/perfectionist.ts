import perfectionistPlugin from "eslint-plugin-perfectionist";
import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES} from "../globs";

const OTHER_VALUE_GROUP = "other-value";

const genericObjectCustomGroups = [
  {
    elementValuePattern: "^(?:true|false)$",
    groupName: "boolean",
  },
  {
    groupName: "number",
    elementValuePattern: String.raw`^[+-]?(?:(?:0[xX][0-9a-fA-F_]+)|(?:0[bB][01_]+)|(?:0[oO][0-7_]+)|(?:[0-9][0-9_]*(?:\.[0-9_]*)?|\.[0-9_]+)(?:[eE][+-]?[0-9][0-9_]*)?)(?:n)?$`,
  },
  {
    groupName: "string",
    elementValuePattern: String.raw`^(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\u0060[^$\u0060\\]*(?:\\.[^$\u0060\\]*)*\u0060)$`,
  },
  {
    groupName: "plain",
    selector: "property",
    elementValuePattern: {
      flags: "u",
      pattern: String.raw`^(?:$|[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*)$`,
    },
  },
  {
    groupName: "array",
    elementValuePattern: String.raw`^\[[^().\u0060]*\]$`,
  },
  {
    groupName: "object",
    elementValuePattern: String.raw`^\{[^().\u0060]*\}$`,
  },
  {
    groupName: OTHER_VALUE_GROUP,
    selector: "method",
  },
  {
    groupName: OTHER_VALUE_GROUP,
    elementValuePattern: ".+",
  },
];

const naturalAscendingRule: Linter.RuleEntry = [
  "error",
  {
    order: "asc",
    type: "natural",
  },
];

const objectOrderRule: Linter.RuleEntry = [
  "error",
  {
    order: "asc",
    type: "natural",
    newlinesBetween: 0,
    newlinesInside: 0,
    groups: ["type", "docs", "fix", "messages", "schema", "default-options", "unknown"],
    customGroups: [
      {
        elementNamePattern: "^type$",
        groupName: "type",
      },
      {
        elementNamePattern: "^docs$",
        groupName: "docs",
      },
      {
        elementNamePattern: "^(?:fixable|hasSuggestions)$",
        groupName: "fix",
      },
      {
        elementNamePattern: "^messages$",
        groupName: "messages",
      },
      {
        elementNamePattern: "^schema$",
        groupName: "schema",
      },
      {
        elementNamePattern: "^defaultOptions$",
        groupName: "default-options",
      },
    ],
    useConfigurationIf: {
      matchesAstSelector:
        "ObjectExpression:has(> Property[key.name='create']):has(> Property[key.name='meta']) > Property[key.name='meta'] > ObjectExpression",
    },
  },
  {
    order: "asc",
    type: "natural",
    newlinesBetween: 0,
    newlinesInside: 0,
    customGroups: [
      {
        elementNamePattern: "^create$",
        groupName: "create",
      },
      {
        elementNamePattern: "^meta$",
        groupName: "meta",
      },
    ],
    groups: ["create", "meta", "unknown"],
    useConfigurationIf: {
      allNamesMatchPattern: "^(?:create|meta)$",
      matchesAstSelector:
        "ObjectExpression:has(> Property[key.name='create']):has(> Property[key.name='meta'])",
    },
  },
  {
    order: "asc",
    type: "natural",
    newlinesBetween: 0,
    newlinesInside: 0,
    customGroups: [
      {
        elementNamePattern: "^files$",
        groupName: "files",
      },
      {
        elementNamePattern: "^ignores$",
        groupName: "ignores",
      },
      {
        elementNamePattern: "^name$",
        groupName: "name",
      },
      {
        elementNamePattern: "^basePath$",
        groupName: "base-path",
      },
      {
        elementNamePattern: "^extends$",
        groupName: "extends",
      },
      {
        elementNamePattern: "^language$",
        groupName: "language",
      },
      {
        elementNamePattern: "^languageOptions$",
        groupName: "language-options",
      },
      {
        elementNamePattern: "^linterOptions$",
        groupName: "linter-options",
      },
      {
        elementNamePattern: "^processor$",
        groupName: "processor",
      },
      {
        elementNamePattern: "^plugins$",
        groupName: "plugins",
      },
      {
        elementNamePattern: "^settings$",
        groupName: "settings",
      },
      {
        elementNamePattern: "^rules$",
        groupName: "rules",
      },
    ],
    groups: [
      "files",
      "ignores",
      "name",
      "base-path",
      "extends",
      "language",
      "language-options",
      "linter-options",
      "processor",
      "plugins",
      "settings",
      "rules",
      "unknown",
    ],
    useConfigurationIf: {
      allNamesMatchPattern:
        "^(?:basePath|extends|files|ignores|language|languageOptions|linterOptions|name|plugins|processor|rules|settings)$",
      matchesAstSelector:
        "ArrayExpression > ObjectExpression:matches(:has(> Property[key.name='files']), :has(> Property[key.name='ignores']), :has(> Property[key.name='plugins']), :has(> Property[key.name='languageOptions']), :has(> Property[key.name='linterOptions']), :has(> Property[key.name='processor']))",
    },
  },
  {
    customGroups: genericObjectCustomGroups,
    order: "asc",
    type: "natural",
    newlinesBetween: 0,
    newlinesInside: 0,
    partitionByComputedKey: true,
    groups: [
      "plain",
      "string",
      "number",
      "boolean",
      "array",
      "object",
      {
        group: OTHER_VALUE_GROUP,
        type: "unsorted",
      },
    ],
    useConfigurationIf: {
      objectType: "non-destructured",
    },
  },
  {
    customGroups: genericObjectCustomGroups,
    order: "asc",
    type: "natural",
    newlinesBetween: 0,
    newlinesInside: 0,
    partitionByComputedKey: true,
    groups: [
      "string",
      "number",
      "boolean",
      "plain",
      "array",
      "object",
      {
        group: OTHER_VALUE_GROUP,
        type: "unsorted",
      },
    ],
  },
];

const perfectionistRules: Linter.RulesRecord = {
  "perfectionist/sort-array-includes": naturalAscendingRule,
  "perfectionist/sort-classes": naturalAscendingRule,
  "perfectionist/sort-decorators": naturalAscendingRule,
  "perfectionist/sort-enums": naturalAscendingRule,
  "perfectionist/sort-export-attributes": naturalAscendingRule,
  "perfectionist/sort-exports": naturalAscendingRule,
  "perfectionist/sort-heritage-clauses": naturalAscendingRule,
  "perfectionist/sort-import-attributes": naturalAscendingRule,
  "perfectionist/sort-interfaces": naturalAscendingRule,
  "perfectionist/sort-intersection-types": naturalAscendingRule,
  "perfectionist/sort-jsx-props": naturalAscendingRule,
  "perfectionist/sort-maps": naturalAscendingRule,
  "perfectionist/sort-modules": naturalAscendingRule,
  "perfectionist/sort-named-exports": naturalAscendingRule,
  "perfectionist/sort-named-imports": naturalAscendingRule,
  "perfectionist/sort-object-types": naturalAscendingRule,
  "perfectionist/sort-objects": objectOrderRule,
  "perfectionist/sort-sets": naturalAscendingRule,
  "perfectionist/sort-switch-case": naturalAscendingRule,
  "perfectionist/sort-union-types": naturalAscendingRule,
  "perfectionist/sort-variable-declarations": naturalAscendingRule,
  "perfectionist/sort-imports": [
    "error",
    {
      order: "asc",
      sortBy: "specifier",
      type: "natural",
      newlinesBetween: 1,
      groups: [
        ["value-builtin", "value-external"],
        {
          newlinesBetween: 0,
        },
        "type-import",
        "value-internal",
        {
          newlinesBetween: 0,
        },
        "type-internal",
        "value-parent",
        {
          newlinesBetween: 0,
        },
        "type-parent",
        "value-sibling",
        {
          newlinesBetween: 0,
        },
        "type-sibling",
        "value-index",
        {
          newlinesBetween: 0,
        },
        "type-index",
        "unknown",
      ],
    },
  ],
  "perfectionist/sort-arrays": [
    "error",
    {
      order: "asc",
      type: "natural",
      useConfigurationIf: {
        matchesAstSelector: "VariableDeclarator[id.name=/^(SORTED_|sorted)/] > ArrayExpression",
      },
    },
  ],
};

export const perfectionist: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/perfectionist",
    plugins: {
      perfectionist: perfectionistPlugin,
    },
    rules: perfectionistRules,
  },
];

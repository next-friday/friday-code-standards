import type {Linter} from "eslint";

import {JAVASCRIPT_AND_TYPESCRIPT_FILES, JAVASCRIPT_FILES} from "../globs";

const NO_ENVIRONMENT_FALLBACK_MESSAGE =
  "Environment variables must fail explicitly when missing; do not provide a fallback value.";

const USE_NUMBER_IS_FINITE_MESSAGE = "Please use Number.isFinite instead";
const USE_NUMBER_IS_NAN_MESSAGE = "Please use Number.isNaN instead";

const javascriptRules: Linter.RulesRecord = {
  "constructor-super": "error",
  "default-param-last": "error",
  "getter-return": "error",
  "no-array-constructor": "error",
  "no-class-assign": "error",
  "no-const-assign": "error",
  "no-dupe-args": "error",
  "no-dupe-class-members": "error",
  "no-dupe-keys": "error",
  "no-func-assign": "error",
  "no-implied-eval": "error",
  "no-import-assign": "error",
  "no-new-native-nonconstructor": "error",
  "no-obj-calls": "error",
  "no-redeclare": "error",
  "no-setter-return": "error",
  "no-shadow": "error",
  "no-this-before-super": "error",
  "no-throw-literal": "error",
  "no-undef": "error",
  "no-unreachable": "error",
  "no-unsafe-negation": "error",
  "no-unused-vars": "error",
  "no-useless-constructor": "error",
  "no-var": "error",
  "no-with": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  camelcase: [
    "error",
    {
      properties: "never",
      ignoreDestructuring: false,
    },
  ],
  "dot-notation": [
    "error",
    {
      allowKeywords: true,
    },
  ],
  "no-empty-function": [
    "error",
    {
      allow: ["arrowFunctions", "functions", "methods"],
    },
  ],
  "no-unused-expressions": [
    "error",
    {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false,
    },
  ],
  "no-use-before-define": [
    "error",
    {
      classes: true,
      functions: true,
      variables: true,
    },
  ],
  "prefer-const": [
    "error",
    {
      destructuring: "any",
      ignoreReadBeforeAssign: true,
    },
  ],
  "prefer-promise-reject-errors": [
    "error",
    {
      allowEmptyReject: true,
    },
  ],
};

const baseRules: Linter.RulesRecord = {
  "block-scoped-var": "error",
  "consistent-return": "error",
  "default-case-last": "error",
  "for-direction": "error",
  "func-names": "error",
  "grouped-accessor-pairs": "error",
  "guard-for-in": "error",
  "no-alert": "error",
  "no-async-promise-executor": "error",
  "no-await-in-loop": "error",
  "no-bitwise": "error",
  "no-caller": "error",
  "no-case-declarations": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  "no-console": "error",
  "no-constant-binary-expression": "error",
  "no-constant-condition": "error",
  "no-constructor-return": "error",
  "no-continue": "error",
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-else-if": "error",
  "no-duplicate-case": "error",
  "no-empty": "error",
  "no-empty-character-class": "error",
  "no-empty-pattern": "error",
  "no-empty-static-block": "error",
  "no-eval": "error",
  "no-ex-assign": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-extra-boolean-cast": "error",
  "no-extra-label": "error",
  "no-fallthrough": "error",
  "no-global-assign": "error",
  "no-inner-declarations": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  "no-iterator": "error",
  "no-label-var": "error",
  "no-lone-blocks": "error",
  "no-lonely-if": "error",
  "no-loop-func": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-multi-str": "error",
  "no-nested-ternary": "error",
  "no-new": "error",
  "no-new-func": "error",
  "no-new-wrappers": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-object-constructor": "error",
  "no-octal": "error",
  "no-octal-escape": "error",
  "no-plusplus": "error",
  "no-promise-executor-return": "error",
  "no-proto": "error",
  "no-prototype-builtins": "error",
  "no-regex-spaces": "error",
  "no-script-url": "error",
  "no-self-assign": "error",
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-template-curly-in-string": "error",
  "no-unassigned-vars": "error",
  "no-undef-init": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-labels": "error",
  "no-unused-private-class-members": "error",
  "no-useless-assignment": "error",
  "no-useless-backreference": "error",
  "no-useless-catch": "error",
  "no-useless-computed-key": "error",
  "no-useless-concat": "error",
  "no-useless-escape": "error",
  "no-useless-return": "error",
  "no-void": "error",
  "prefer-exponentiation-operator": "error",
  "prefer-numeric-literals": "error",
  "prefer-object-spread": "error",
  "prefer-template": "error",
  "preserve-caught-error": "error",
  radix: "error",
  "require-yield": "error",
  "symbol-description": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
  "vars-on-top": "error",
  yoda: "error",
  "array-callback-return": [
    "error",
    {
      allowImplicit: true,
    },
  ],
  "arrow-body-style": [
    "error",
    "as-needed",
    {
      requireReturnForObjectLiteral: false,
    },
  ],
  "class-methods-use-this": [
    "error",
    {
      exceptMethods: [],
    },
  ],
  curly: ["error", "multi-line"],
  "default-case": [
    "error",
    {
      commentPattern: "^no default$",
    },
  ],
  eqeqeq: [
    "error",
    "always",
    {
      null: "ignore",
    },
  ],
  "max-classes-per-file": ["error", 1],
  "no-else-return": [
    "error",
    {
      allowElseIf: false,
    },
  ],
  "no-labels": [
    "error",
    {
      allowLoop: false,
      allowSwitch: false,
    },
  ],
  "no-multi-assign": ["error"],
  "no-param-reassign": [
    "error",
    {
      props: true,
      ignorePropertyModificationsFor: [
        "acc",
        "accumulator",
        "e",
        "ctx",
        "context",
        "req",
        "request",
        "res",
        "response",
        "$scope",
        "staticContext",
      ],
    },
  ],
  "no-restricted-exports": [
    "error",
    {
      restrictedNamedExports: ["then"],
    },
  ],
  "no-return-assign": ["error", "always"],
  "no-underscore-dangle": [
    "error",
    {
      allowAfterSuper: false,
      allowAfterThis: false,
      enforceInMethodNames: true,
      allow: [],
    },
  ],
  "no-unneeded-ternary": [
    "error",
    {
      defaultAssignment: false,
    },
  ],
  "no-unreachable-loop": [
    "error",
    {
      ignore: [],
    },
  ],
  "no-useless-rename": [
    "error",
    {
      ignoreDestructuring: false,
      ignoreExport: false,
      ignoreImport: false,
    },
  ],
  "object-shorthand": [
    "error",
    "always",
    {
      avoidQuotes: true,
      ignoreConstructors: false,
    },
  ],
  "one-var": ["error", "never"],
  "operator-assignment": ["error", "always"],
  "prefer-arrow-callback": [
    "error",
    {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    },
  ],
  "prefer-destructuring": [
    "error",
    {
      AssignmentExpression: {
        array: true,
        object: false,
      },
      VariableDeclarator: {
        array: false,
        object: true,
      },
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  "prefer-regex-literals": [
    "error",
    {
      disallowRedundantWrapping: true,
    },
  ],
  strict: ["error", "never"],
  "unicode-bom": ["error", "never"],
  "new-cap": [
    "error",
    {
      capIsNew: false,
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNewExceptions: ["Immutable.Map", "Immutable.Set", "Immutable.List"],
    },
  ],
  "no-restricted-globals": [
    "error",
    {
      message:
        "Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite",
      name: "isFinite",
    },
    {
      message:
        "Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan",
      name: "isNaN",
    },
    {
      message:
        "Use window.addEventListener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "addEventListener",
    },
    {
      message:
        "Use window.blur instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "blur",
    },
    {
      message:
        "Use window.close instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "close",
    },
    {
      message:
        "Use window.closed instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "closed",
    },
    {
      message:
        "Use window.confirm instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "confirm",
    },
    {
      message:
        "Use window.defaultStatus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "defaultStatus",
    },
    {
      message:
        "Use window.defaultstatus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "defaultstatus",
    },
    {
      message:
        "Use window.event instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "event",
    },
    {
      message:
        "Use window.external instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "external",
    },
    {
      message:
        "Use window.find instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "find",
    },
    {
      message:
        "Use window.focus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "focus",
    },
    {
      message:
        "Use window.frameElement instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "frameElement",
    },
    {
      message:
        "Use window.frames instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "frames",
    },
    {
      message:
        "Use window.history instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "history",
    },
    {
      message:
        "Use window.innerHeight instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "innerHeight",
    },
    {
      message:
        "Use window.innerWidth instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "innerWidth",
    },
    {
      message:
        "Use window.length instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "length",
    },
    {
      message:
        "Use window.location instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "location",
    },
    {
      message:
        "Use window.locationbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "locationbar",
    },
    {
      message:
        "Use window.menubar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "menubar",
    },
    {
      message:
        "Use window.moveBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "moveBy",
    },
    {
      message:
        "Use window.moveTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "moveTo",
    },
    {
      message:
        "Use window.name instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "name",
    },
    {
      message:
        "Use window.onblur instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onblur",
    },
    {
      message:
        "Use window.onerror instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onerror",
    },
    {
      message:
        "Use window.onfocus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onfocus",
    },
    {
      message:
        "Use window.onload instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onload",
    },
    {
      message:
        "Use window.onresize instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onresize",
    },
    {
      message:
        "Use window.onunload instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "onunload",
    },
    {
      message:
        "Use window.open instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "open",
    },
    {
      message:
        "Use window.opener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "opener",
    },
    {
      message:
        "Use window.opera instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "opera",
    },
    {
      message:
        "Use window.outerHeight instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "outerHeight",
    },
    {
      message:
        "Use window.outerWidth instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "outerWidth",
    },
    {
      message:
        "Use window.pageXOffset instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "pageXOffset",
    },
    {
      message:
        "Use window.pageYOffset instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "pageYOffset",
    },
    {
      message:
        "Use window.parent instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "parent",
    },
    {
      message:
        "Use window.print instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "print",
    },
    {
      message:
        "Use window.removeEventListener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "removeEventListener",
    },
    {
      message:
        "Use window.resizeBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "resizeBy",
    },
    {
      message:
        "Use window.resizeTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "resizeTo",
    },
    {
      message:
        "Use window.screen instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "screen",
    },
    {
      message:
        "Use window.screenLeft instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "screenLeft",
    },
    {
      message:
        "Use window.screenTop instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "screenTop",
    },
    {
      message:
        "Use window.screenX instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "screenX",
    },
    {
      message:
        "Use window.screenY instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "screenY",
    },
    {
      message:
        "Use window.scroll instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scroll",
    },
    {
      message:
        "Use window.scrollbars instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scrollbars",
    },
    {
      message:
        "Use window.scrollBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scrollBy",
    },
    {
      message:
        "Use window.scrollTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scrollTo",
    },
    {
      message:
        "Use window.scrollX instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scrollX",
    },
    {
      message:
        "Use window.scrollY instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "scrollY",
    },
    {
      message:
        "Use window.self instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "self",
    },
    {
      message:
        "Use window.status instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "status",
    },
    {
      message:
        "Use window.statusbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "statusbar",
    },
    {
      message:
        "Use window.stop instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "stop",
    },
    {
      message:
        "Use window.toolbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "toolbar",
    },
    {
      message:
        "Use window.top instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md",
      name: "top",
    },
  ],
  "no-restricted-properties": [
    "error",
    {
      message: "arguments.callee is deprecated",
      object: "arguments",
      property: "callee",
    },
    {
      message: USE_NUMBER_IS_FINITE_MESSAGE,
      object: "global",
      property: "isFinite",
    },
    {
      message: USE_NUMBER_IS_FINITE_MESSAGE,
      object: "self",
      property: "isFinite",
    },
    {
      message: USE_NUMBER_IS_FINITE_MESSAGE,
      object: "window",
      property: "isFinite",
    },
    {
      message: USE_NUMBER_IS_NAN_MESSAGE,
      object: "global",
      property: "isNaN",
    },
    {
      message: USE_NUMBER_IS_NAN_MESSAGE,
      object: "self",
      property: "isNaN",
    },
    {
      message: USE_NUMBER_IS_NAN_MESSAGE,
      object: "window",
      property: "isNaN",
    },
    {
      message: "Please use Object.defineProperty instead.",
      property: "__defineGetter__",
    },
    {
      message: "Please use Object.defineProperty instead.",
      property: "__defineSetter__",
    },
    {
      message: "Use the exponentiation operator (**) instead.",
      object: "Math",
      property: "pow",
    },
  ],
  "no-restricted-syntax": [
    "error",
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "LogicalExpression[operator='||'][left.object.object.name='process'][left.object.property.name='env']",
    },
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "LogicalExpression[operator='??'][left.object.object.name='process'][left.object.property.name='env']",
    },
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "ConditionalExpression[test.object.object.name='process'][test.object.property.name='env']",
    },
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "LogicalExpression[operator='||'][left.object.object.type='MetaProperty'][left.object.object.meta.name='import'][left.object.object.property.name='meta'][left.object.property.name='env']",
    },
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "LogicalExpression[operator='??'][left.object.object.type='MetaProperty'][left.object.object.meta.name='import'][left.object.object.property.name='meta'][left.object.property.name='env']",
    },
    {
      message: NO_ENVIRONMENT_FALLBACK_MESSAGE,
      selector:
        "ConditionalExpression[test.object.object.type='MetaProperty'][test.object.object.meta.name='import'][test.object.object.property.name='meta'][test.object.property.name='env']",
    },
    {
      message:
        "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      selector: "ForInStatement",
    },
    {
      message:
        "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      selector: "LabeledStatement",
    },
    {
      message:
        "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      selector: "WithStatement",
    },
  ],
};

export const base: Linter.Config[] = [
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "friday/base",
    rules: baseRules,
  },
  {
    files: JAVASCRIPT_FILES,
    name: "friday/base/javascript",
    rules: javascriptRules,
  },
];

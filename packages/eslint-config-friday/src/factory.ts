import type {Linter} from "eslint";

import {
  antfu,
  base,
  browser,
  eslintComments,
  friday,
  fridayReact,
  importX,
  jsdoc,
  json,
  jsxA11y,
  markdown,
  node,
  packageJson,
  perfectionist,
  promise,
  react,
  reactHooks,
  reactStylistic,
  regexp,
  sonarjs,
  sonarjsReact,
  stylistic,
  toml,
  typeChecked,
  typescript,
  unicorn,
  unicornReact,
  vitest,
  yaml,
} from "./configs";
import {scopeConfigs} from "./scope-configs";
import type {FridayOptions} from "./factory.type";

/**
 * Compose the public Next Friday ESLint Flat Config.
 * Config capabilities stay independent; this factory owns their evaluation order.
 * @param options Runtime and React contexts, optionally scoped by file globs.
 * @returns The composed ESLint Flat Config array.
 */
export function createFridayConfig(options: FridayOptions = {}): Linter.Config[] {
  const reactConfigs = scopeConfigs(
    [...unicornReact, ...react, ...fridayReact, ...jsxA11y, ...reactHooks, ...sonarjsReact],
    options.react,
  );

  const reactStylisticConfigs = scopeConfigs(reactStylistic, options.react);
  const browserConfigs = scopeConfigs(browser, options.browser);
  const nodeConfigs = scopeConfigs(node, options.node, true);

  return [
    ...antfu,
    ...base,
    ...friday,
    ...eslintComments,
    ...promise,
    ...regexp,
    ...typescript,
    ...typeChecked,
    ...importX,
    ...sonarjs,
    ...jsdoc,
    ...unicorn,
    ...perfectionist,
    ...browserConfigs,
    ...nodeConfigs,
    ...reactConfigs,
    ...vitest,
    ...json,
    ...markdown,
    ...packageJson,
    ...yaml,
    ...toml,
    ...stylistic,
    ...reactStylisticConfigs,
  ];
}

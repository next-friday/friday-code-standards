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
  nestjs,
  nextjs,
  node,
  packageJson,
  perfectionist,
  promise,
  react,
  reactHooks,
  reactStylistic,
  regexp,
  sonarjs,
  stylistic,
  toml,
  typeChecked,
  typescript,
  unicorn,
  unicornReact,
  vitest,
  yaml,
} from "./configs";
import type {FridayOptions} from "./factory.type";

/**
 * Compose the public Next Friday ESLint Flat Config.
 * Config capabilities stay independent; this factory owns their evaluation order.
 * @param options Framework-context switches.
 * @returns The composed ESLint Flat Config array.
 */
export function createFridayConfig(options: FridayOptions = {}): Linter.Config[] {
  const {
    nestjs: isNestjsEnabled = false,
    nextjs: isNextjsEnabled = false,
    react: isReactEnabled = false,
  } = options;

  const reactConfigs = isReactEnabled
    ? [...unicornReact, ...react, ...fridayReact, ...jsxA11y, ...reactHooks]
    : [];

  const nestjsConfigs = isNestjsEnabled ? nestjs : [];
  const nextjsConfigs = isNextjsEnabled ? nextjs : [];
  const reactStylisticConfigs = isReactEnabled ? reactStylistic : [];

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
    ...browser,
    ...node,
    ...nestjsConfigs,
    ...reactConfigs,
    ...nextjsConfigs,
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

import {assert, expect} from "vitest";
import path from "node:path";
import type {Linter} from "eslint";

import {eslintForConfigs, packageRoot} from "../helpers";

/**
 * Apply an ESLint fixer twice and verify idempotence.
 * @param config Flat Config entries under test.
 * @param code Source text to fix.
 * @param filename Virtual fixture path used for config matching.
 * @returns Output from the first fix pass.
 */
export async function fixTwice(
  config: Linter.Config[],
  code: string,
  filename: string,
): Promise<string> {
  const eslint = eslintForConfigs(config, {
    fix: true,
  });

  const [first] = await eslint.lintText(code, {
    filePath: path.resolve(packageRoot, filename),
  });

  assert(first);
  expect(first.fatalErrorCount).toBe(0);

  const output1 = first.output ?? code;

  const [second] = await eslint.lintText(output1, {
    filePath: path.resolve(packageRoot, filename),
  });

  assert(second);
  expect(second.fatalErrorCount).toBe(0);

  const output2 = second.output ?? output1;

  expect(output2).toBe(output1);

  return output1;
}

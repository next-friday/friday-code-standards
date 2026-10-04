import type {Linter} from "eslint";

import friday from "../../src/index.ts";

export const fullConfig: Linter.Config[] = friday({
  react: true,
});

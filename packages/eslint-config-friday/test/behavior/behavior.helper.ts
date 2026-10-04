import path from "node:path";

import {eslintForConfigs, fullConfig, packageRoot} from "../helpers";

export const eslint = eslintForConfigs(fullConfig);
export const javascriptFixture = path.resolve(packageRoot, "fixtures/projects/untyped/index.js");
export const projectRoot = path.resolve(packageRoot, "fixtures/projects/typed");

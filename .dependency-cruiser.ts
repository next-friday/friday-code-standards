import type {IConfiguration} from "dependency-cruiser";

const config = {
  extends: "dependency-cruiser/configs/recommended-strict",
  forbidden: [
    {
      name: "no-orphans",
      to: {},
      from: {
        orphan: true,
        pathNot: [
          String.raw`(^|/)\.[^/]+\.(js|cjs|mjs|ts|json)$`,
          String.raw`\.d\.(c|m)?ts$`,
          String.raw`(^|/)tsconfig\.json$`,
          String.raw`(^|/)(?:babel|webpack|tsdown|vitest)\.config\.(?:js|cjs|mjs|ts|json)$`,
        ],
      },
    },
    {
      name: "no-duplicate-dep-types",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
        pathNot: [
          "(^|/)node_modules/eslint/",
          String.raw`(^|/)node_modules/\.pnpm/eslint@`,
          "(^|/)node_modules/prettier/",
          String.raw`(^|/)node_modules/\.pnpm/prettier@`,
        ],
      },
    },
  ],
  options: {
    exclude: "(^|/)(?:dist|coverage|fixtures)/",
    skipAnalysisNotInRules: true,
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      conditionNames: ["import", "require", "node", "default"],
      exportsFields: ["exports"],
    },
    tsConfig: {
      fileName: "./tsconfig.json",
    },
  },
} satisfies IConfiguration;

export default config;

const JAVASCRIPT_EXTENSIONS = [".js", ".jsx", ".mjs", ".cjs"];

export const TYPESCRIPT_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];

export const JAVASCRIPT_AND_TYPESCRIPT_EXTENSIONS = [
  ...JAVASCRIPT_EXTENSIONS,
  ...TYPESCRIPT_EXTENSIONS,
];

export const JAVASCRIPT_FILES = JAVASCRIPT_EXTENSIONS.map(extension => `**/*${extension}`);
export const TYPESCRIPT_FILES = TYPESCRIPT_EXTENSIONS.map(extension => `**/*${extension}`);
export const JAVASCRIPT_AND_TYPESCRIPT_FILES = [...JAVASCRIPT_FILES, ...TYPESCRIPT_FILES];
export const REACT_FILES = ["**/*.jsx", "**/*.tsx"];

export const NEXTJS_FRAMEWORK_FILES = [
  "**/app/**/{page,layout,template,default,loading,error,global-error,global-not-found,not-found,forbidden,unauthorized,route,icon,apple-icon,opengraph-image,twitter-image,sitemap,robots,manifest}.{js,jsx,ts,tsx}",
  "**/app/**/{icon,apple-icon,opengraph-image,twitter-image}{0,1,2,3,4,5,6,7,8,9}.{js,jsx,ts,tsx}",
  "**/{middleware,proxy,instrumentation,instrumentation-client,mdx-components}.{js,jsx,ts,tsx}",
  "**/pages/**/*.{js,jsx,ts,tsx}",
];

export const TYPESCRIPT_TEST_FILES = TYPESCRIPT_EXTENSIONS.flatMap(extension => [
  `**/*.test${extension}`,
  `**/*.spec${extension}`,
]);

export const JSON_FILES = ["**/*.json", "**/*.json5", "**/*.jsonc"];
export const JSON5_FILES = ["**/*.json5"];
export const JSONC_FILES = ["**/*.jsonc"];
export const PACKAGE_JSON_FILES = ["**/package.json"];
export const MARKDOWN_FILES = ["**/*.md"];
export const TOML_FILES = ["**/*.toml"];
export const YAML_FILES = ["**/*.yaml", "**/*.yml"];

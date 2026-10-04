import {languages, options, parsers, printers} from "prettier-plugin-sh";
import type {Config} from "prettier";

const shellLanguages = languages.filter(
  language =>
    language.vscodeLanguageIds?.includes("shellscript") === true || language.name === "husky",
);

export const prettierConfig: Config = {
  arrowParens: "avoid",
  endOfLine: "lf",
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  bracketSameLine: false,
  bracketSpacing: false,
  jsxSingleQuote: false,
  semi: true,
  singleQuote: false,
  useTabs: false,
  plugins: [
    {
      languages: shellLanguages,
      options,
      parsers,
      printers,
    },
  ],
};

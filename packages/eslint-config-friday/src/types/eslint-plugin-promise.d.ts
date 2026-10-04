declare module "eslint-plugin-promise" {
  import type {Linter} from "eslint";

  const eslintPluginPromise: {
    rules: NonNullable<Linter.Config["plugins"]>[string]["rules"];
  };

  export default eslintPluginPromise;
}

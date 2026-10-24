export type FridayCapability =
  | boolean
  | {
      files: string[];
    };

export type FridayOptions = {
  browser?: FridayCapability;
  node?: FridayCapability;
  react?: FridayCapability;
};

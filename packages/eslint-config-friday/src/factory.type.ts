export type FridayCapability =
  | boolean
  | {
      files: string[];
    };

export type FridayOptions = {
  browser?: FridayCapability;
  nestjs?: FridayCapability;
  nextjs?: FridayCapability;
  node?: FridayCapability;
  react?: FridayCapability;
};

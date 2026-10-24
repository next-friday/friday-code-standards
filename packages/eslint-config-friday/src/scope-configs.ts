import type {Linter} from "eslint";

import type {FridayCapability} from "./factory.type";

/**
 * Apply an optional consumer file boundary to a set of flat configs.
 * Existing config file patterns are intersected with the consumer boundary.
 * @param configs Flat configs owned by one capability.
 * @param capability Capability state and optional file boundary.
 * @param isEnabledByDefault Default state when the capability is omitted.
 * @returns Disabled, unmodified, or file-scoped configs.
 */
export function scopeConfigs(
  configs: Linter.Config[],
  capability: FridayCapability | undefined,
  isEnabledByDefault = false,
): Linter.Config[] {
  const enabled = capability ?? isEnabledByDefault;

  if (enabled === false) {
    return [];
  }

  if (enabled === true) {
    return configs;
  }

  return configs.map(config => {
    const configFiles = config.files;

    return {
      ...config,
      files: configFiles
        ? enabled.files.flatMap(scope => configFiles.map(pattern => [scope, pattern].flat()))
        : enabled.files,
    };
  });
}

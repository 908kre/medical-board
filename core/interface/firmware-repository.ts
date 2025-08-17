import { Result } from "@md/core/result";
import { Firmware } from "@md/core/domain/firmware";
import { FirmwarePackage } from "@md/core/domain/firmware-package";
import { FirmwareId } from "@md/core/domain/firmware-id";
export type FirmwareRepository = {
  save: (args: Firmware) => Promise<Result<void>>;
  find: (
    query:
      | { id: FirmwareId }
      | {
          pkg: FirmwarePackage;
          version: Firmware["version"];
          model: Firmware["model"];
        },
  ) => Promise<Result<Firmware>>;
  filter: (query: {
    packages?: FirmwarePackage[];
  }) => Promise<Result<Firmware[]>>;
  delete: (query: { id: FirmwareId }) => Promise<Result<void>>;
};

import { Device } from "@md/core/domain/device";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";

export type DeviceRepository = {
  filter: (args: {
    organizationId: OrganizationId;
  }) => Promise<Result<Device[]>>;
  save: (args: Device[]) => Promise<Result<void>>;
};

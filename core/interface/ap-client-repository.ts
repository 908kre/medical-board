import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { MacAddress } from "@md/core/domain/mac-address";
import { ApClient } from "@md/core/domain/ap-client";

export type ApClientRepository = {
  filter: (args: {
    organizationId?: OrganizationId;
    macAddresses?: MacAddress[];
    connection?: {
      macAddresses?: MacAddress[];
    };
    occurredAt?: Date;
    isOnline?: boolean;
    expiredAt?: Date;
  }) => Promise<Result<ApClient[]>>;
  save: (args: ApClient[]) => Promise<Result<void>>;
};

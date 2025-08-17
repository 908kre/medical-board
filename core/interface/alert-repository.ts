import { Result } from "@md/core/result";
import { MacAddress } from "@md/core/domain/mac-address";
import { Alert } from "@md/core/domain/alert";
import { AlertKind } from "@md/core/domain/alert-kind";
import { OrganizationId } from "@md/core/domain/organization-id";

export type AlertRepository = {
  save: (args: Alert[]) => Promise<Result<void>>;
  filter: (args: {
    organizationId?: OrganizationId;
    macAddresses?: MacAddress[];
    kinds?: AlertKind[];
    range: {
      from: Date;
      to: Date;
    };
    limit?: number;
  }) => Promise<Result<Alert[]>>;
};

import { NodeEvent } from "@md/core/domain/node-event";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { MacAddress } from "@md/core/domain/mac-address";

export type NodeEventRepository = {
  filter: (args: {
    organizationId: OrganizationId;
    macAddresses?: MacAddress[];
    range: {
      from: Date;
      to: Date;
    };
    limit?: number;
  }) => Promise<Result<NodeEvent[]>>;
  save: (v: NodeEvent[]) => Promise<Result<void>>;
};

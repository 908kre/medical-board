import { Node } from "@md/core/domain/node";
import { LocalMapId } from "@md/core/domain/local-map-id";
import { MacAddress } from "@md/core/domain/mac-address";
import { OrganizationId } from "@md/core/domain/organization-id";

type FilterArgs = {
  cursor?: MacAddress;
  macAddresses?: MacAddress[];
  organizationId?: OrganizationId;
  localMapIds?: LocalMapId[];
  limit?: number;
  isOnline?: boolean;
  isLocated?: boolean;
  occurredAt?: Date;
};

export type NodeRepository = {
  filter: (args: FilterArgs) => Promise<Node[] | Error>;
  find: (args: {
    macAddress: MacAddress;
    organizationId?: OrganizationId;
  }) => Promise<Node | Error>;
  save: (args: Node[]) => Promise<void | Error>;
  delete: (args: { macAddresses: MacAddress[] }) => Promise<void | Error>;
};

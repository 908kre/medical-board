import { LocalMapId } from "@md/core/domain/local-map-id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { Webp } from "@md/core/domain/webp";

export type LocalMapImageFs = {
  read: (props: {
    id: LocalMapId;
    organizationId: OrganizationId;
  }) => Promise<Result<Webp>>;
  write: (props: {
    id: LocalMapId;
    organizationId: OrganizationId;
    data: Webp;
  }) => Promise<Result<void>>;
  delete: (props: {
    id: LocalMapId;
    organizationId: OrganizationId;
  }) => Promise<Result<void>>;
};

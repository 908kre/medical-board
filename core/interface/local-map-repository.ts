import { LocalMap } from "@md/core/domain/local-map";
import { TagId } from "@md/core/domain/tag-id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { LocalMapId } from "@md/core/domain/local-map-id";
import { SiteId } from "@md/core/domain/site-id";

export type LocalMapRepository = {
  save: (row: LocalMap[]) => Promise<Result<void>>;
  find: (args: {
    id: LocalMapId;
    organizationId?: OrganizationId;
  }) => Promise<Result<LocalMap>>;
  filter: (args: {
    organizationId?: OrganizationId;
    siteId?: SiteId;
    tagIds?: TagId[];
  }) => Promise<Result<LocalMap[]>>;
  delete: (args: {
    id: LocalMapId;
    organizationId?: OrganizationId;
  }) => Promise<Result<void>>;
};

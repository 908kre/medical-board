import { Site } from "@md/core/domain/site";
import { TagId } from "@md/core/domain/tag-id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { SiteId } from "@md/core/domain/site-id";
import { Result } from "@md/core/result";

export type SiteRepository = {
  find: (args: {
    id: SiteId;
    organizationId: OrganizationId;
  }) => Promise<Result<Site>>;
  filter: (args: {
    organizationId?: OrganizationId;
    ids?: SiteId[];
    tagIds?: TagId[];
  }) => Promise<Result<Site[]>>;
  save: (args: Site[]) => Promise<Result<void>>;
  delete: (args: {
    id: SiteId;
    organizationId: OrganizationId;
  }) => Promise<Result<void>>;
};

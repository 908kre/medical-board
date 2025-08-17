import { Tag } from "@md/core/domain/tag";
import { TagId } from "@md/core/domain/tag-id";
import { Result } from "@md/core/result";

import { OrganizationId } from "@md/core/domain/organization-id";

export type TagRepository = {
  find: (args: {
    id: TagId;
    organizationId?: OrganizationId;
  }) => Promise<Tag | Error>;
  filter: (args: {
    organizationId?: OrganizationId;
    ids?: TagId[];
  }) => Promise<Tag[] | Error>;
  save: (args: Tag[]) => Promise<Result<void>>;
  delete: (args: {
    id: TagId;
    organizationId?: OrganizationId;
  }) => Promise<void | Error>;
};

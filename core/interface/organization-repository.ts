import { Organization } from "@md/core/domain/organization";
import { OrganizationId } from "@md/core/domain/organization-id";
import { OrganizationName } from "@md/core/domain/organization-name";
import { Result } from "@md/core/result";

export type OrganizationRepository = {
  create: (organization: Organization) => Promise<Result<void>>;
  update: (organization: Organization) => Promise<Result<void>>;
  find: (args: {
    id?: OrganizationId;
    name?: OrganizationName;
  }) => Promise<Result<Organization>>;
  filter: (args: {
    cursor?: OrganizationId;
    limit?: number;
    ids?: OrganizationId[];
    names?: OrganizationName[];
    createdBy?: OrganizationId;
  }) => Promise<Result<Organization[]>>;
};

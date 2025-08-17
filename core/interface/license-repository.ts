import { License } from "@md/core/domain/license";

import { LicenseCode } from "@md/core/domain/license-code";

import { LicenseId } from "@md/core/domain/license-id";

import { LicenseStatus } from "@md/core/domain/license-status";

import { OrganizationId } from "@md/core/domain/organization-id";

export type LicenseRepository = {
  create: (license: License) => Promise<void | Error>;
  find: (args: {
    code?: LicenseCode;
    id?: LicenseId;
    organizationId?: OrganizationId;
  }) => Promise<License | Error>;
  update: (license: License) => Promise<void | Error>;
  filter: (args: {
    organizationId?: OrganizationId;
    codes?: LicenseCode[];
    ids?: LicenseId[];
    statuses?: LicenseStatus[];
  }) => Promise<License[] | Error>;
};

import { Account } from "@md/core/domain/account";
import { Email } from "@md/core/domain/email";
import { OrganizationId } from "@md/core/domain/organization-id";
import { UserId } from "@md/core/domain/user-id";

export type IdentityProvider = {
  verify: (args: {
    accessToken?: string;
  }) => Promise<Pick<Account, "id"> | Error>;
  delete: (args: { id: UserId }) => Promise<void | Error>;
  exists: (args: { email: Email }) => Promise<boolean | Error>;
  find: (args: { email?: Email; id?: UserId }) => Promise<Account | Error>;
  signUp: (args: {
    email: Email;
    organizationId: OrganizationId;
  }) => Promise<Account | Error>;
  updateUserAttributes: (args: {
    email: Email;
    attributes: {
      email?: Email;
      organizationId?: OrganizationId;
    };
  }) => Promise<void | Error>;
};

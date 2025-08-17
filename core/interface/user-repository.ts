import { User } from "@md/core/domain/user";

export type UserRepository = {
  create: (user: User) => Promise<void | Error>;
  update: (user: User) => Promise<void | Error>;
  delete: (args: { id: User["id"] }) => Promise<void | Error>;
  exists: (query: {
    id?: User["id"];
    organizationId?: User["organizationId"];
    role?: User["role"];
  }) => Promise<boolean | Error>;
  filter: (query: {
    organizationId?: User["organizationId"];
    roles?: User["role"][];
    ids?: User["id"][];
  }) => Promise<User[] | Error>;
  find: (query: {
    id?: User["id"];
    organizationId?: User["organizationId"];
    role?: User["role"];
  }) => Promise<User | Error>;
};

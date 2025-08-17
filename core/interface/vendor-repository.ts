import { Vendor } from "@md/core/domain/vendor";

export type VendorRepository = {
  filter: (args: { codes?: string[] }) => Promise<Vendor[] | Error>;
  create: (args: { vendors: Vendor[] }) => Promise<void | Error>;
};

import { Vendor } from "@md/core/domain/vendor";

export type VendorProvider = {
  filter: () => Promise<Vendor[] | Error>;
};

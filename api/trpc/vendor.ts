import { Router } from "./create-router";
import { Result } from "@md/core/result";
import { FilterVendors } from "@md/core/usecase/filter-vendors";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { z } from "zod";
import { VendorTuples } from "@md/core-api/dto/vendor-tuple";

export const VendorRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterVendors = FilterVendors(props);
  return t.router({
    filter: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(async ({ ctx, input }) => {
        const vendors = await props.runner.run({
          action: filterVendors,
          input,
          ctx,
        });
        if (Result.isErr(vendors)) {
          return vendors;
        }
        return VendorTuples.fromVendors(vendors);
      }),
  });
};

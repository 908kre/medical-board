import { TagId } from "@md/core/domain/tag-id";
import { z } from "zod";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { FilterAlerts } from "@md/core/usecase/filter-alerts";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const AlertRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterAlerts = FilterAlerts(props);
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            tagIds: z.array(z.string()).optional(),
            range: z.object({
              from: z.date(),
              to: z.date(),
            }),
            limit: z.number().optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          range: parsed.range,
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
          ...(parsed.limit && { limit: parsed.limit }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({ action: filterAlerts, input, ctx }),
      ),
  });
};

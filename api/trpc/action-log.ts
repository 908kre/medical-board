import { z } from "zod";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { FilterActionLogs } from "@md/core/usecase/filter-action-logs";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const ActionLogRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterActionLogs = FilterActionLogs(props);
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            limit: z.number().optional(),
            range: z.object({
              from: z.date(),
              to: z.date(),
            }),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          range: parsed.range,
          ...(parsed.limit && { limit: parsed.limit }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterActionLogs,
          input,
          ctx,
        }),
      ),
  });
};

import { z } from "zod";
import { TagId } from "@md/core/domain/tag-id";
import { Router } from "./create-router";
import { OrganizationId } from "@md/core/domain/organization-id";
import { FilterApClients } from "@md/core/usecase/filter-ap-clients";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { FilterNodes } from "@md/core/usecase/filter-nodes";

export const ApClientRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterNodes = FilterNodes(props);
  const filterApClients = FilterApClients({
    ...props,
    filterNodes,
  });
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            tagIds: z.array(z.string()).optional(),
            isOnline: z.boolean().optional(),
            occurredAt: z.date().optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          ...(parsed.occurredAt && { occurredAt: parsed.occurredAt }),
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
          ...(parsed.isOnline && { isOnline: parsed.isOnline }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterApClients,
          input,
          ctx,
        }),
      ),
  });
};

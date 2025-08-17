import { TagId } from "@md/core/domain/tag-id";
import { z } from "zod";
import { MacAddress } from "@md/core/domain/mac-address";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { FilterNodeEvents } from "@md/core/usecase/filter-node-events";
import { SyncNodeEvents } from "@md/core/usecase/sync-node-events";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const NodeEventRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterNodeEvents = FilterNodeEvents(props);
  const syncNodeEvents = SyncNodeEvents(props);
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            macAddresses: z.array(z.string()).optional(),
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
          ...(parsed.macAddresses && {
            macAddresses: parsed.macAddresses.map((x) => MacAddress(x)),
          }),
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
          range: parsed.range,
          ...(parsed.limit && { limit: parsed.limit }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterNodeEvents,
          input,
          ctx,
        }),
      ),

    sync: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            macAddresses: z.array(z.string()),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          macAddresses: parsed.macAddresses.map((x) => MacAddress(x)),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: syncNodeEvents,
          input,
          ctx,
        }),
      ),
  });
};

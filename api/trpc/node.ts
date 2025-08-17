import { z } from "zod";
import { TagId } from "@md/core/domain/tag-id";
import { Router } from "./create-router";
import { LocalMapId } from "@md/core/domain/local-map-id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { MacAddress } from "@md/core/domain/mac-address";
import { CreateNodes } from "@md/core/usecase/create-nodes";
import { FilterNodes } from "@md/core/usecase/filter-nodes";
import { RerouteNodes } from "@md/core/usecase/reroute-nodes";
import { DeleteNodes } from "@md/core/usecase/delete-nodes";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { SaveNodes } from "@md/core/usecase/save-nodes";
import { RelocateNodes } from "@md/core/usecase/relocate-nodes";
import { DeleteNodesPosition } from "@md/core/usecase/delete-nodes-position";
import { SyncNodeSignals } from "@md/core/usecase/sync-node-signals";
import { MeasureNodeThroughput } from "@md/core/usecase/measure-node-throughput";
import { MeasureInternetThroughput } from "@md/core/usecase/measure-internet-throughput";

export const NodeRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const rerouteNodes = RerouteNodes(props);
  const deleteNodes = DeleteNodes(props);
  const saveNodes = SaveNodes(props);
  const filterNodes = FilterNodes(props);
  const measureNodeThroughput = MeasureNodeThroughput({
    ...props,
  });
  const measureInternetThroughput = MeasureInternetThroughput({
    ...props,
  });
  const relocateNodes = RelocateNodes({
    ...props,
    saveNodes,
  });
  const createNodes = CreateNodes({
    ...props,
    relocateNodes,
  });
  const deleteNodesPosition = DeleteNodesPosition({
    ...props,
    saveNodes,
  });
  const syncNodeSignals = SyncNodeSignals({
    ...props,
    saveNodes,
  });
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            tagIds: z.array(z.string()).optional(),
            occurredAt: z.date().optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          ...(parsed.occurredAt && { occurredAt: parsed.occurredAt }),
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterNodes,
          input,
          ctx,
        }),
      ),

    reroute: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            macAddress: z.array(z.string()),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          macAddresses: parsed.macAddress.map(MacAddress),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: rerouteNodes,
          input,
          ctx,
        }),
      ),
    create: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            macAddresses: z.array(z.string()),
            organizationId: z.string(),
            localMapId: z.string().optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          macAddresses: parsed.macAddresses.map((x) => MacAddress(x)),
          ...(parsed.localMapId && {
            localMapId: LocalMapId(parsed.localMapId),
          }),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({ action: createNodes, input, ctx }),
      ),

    relocates: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            nodes: z.array(
              z.object({
                macAddress: z.string(),
                localMapId: z.string(),
                x: z.number().optional(),
                y: z.number().optional(),
              }),
            ),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          nodes: parsed.nodes.map((node) => ({
            macAddress: MacAddress(node.macAddress),
            localMapId: LocalMapId(node.localMapId),
            ...(node.x && { x: node.x }),
            ...(node.y && { y: node.y }),
          })),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: relocateNodes,
          input,
          ctx,
        }),
      ),

    deletePositions: t.withAuth
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
          action: deleteNodesPosition,
          input,
          ctx,
        }),
      ),
    syncSignals: t.withAuth
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
          action: syncNodeSignals,
          input,
          ctx,
        }),
      ),
    measureNodeThroughput: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            client: z.string(),
            server: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          client: MacAddress(parsed.client),
          server: MacAddress(parsed.server),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: measureNodeThroughput,
          input,
          ctx,
        }),
      ),
    measureInternetThroughput: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            macAddress: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          macAddress: MacAddress(parsed.macAddress),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: measureInternetThroughput,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            macAddresses: z.array(z.string()),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          macAddresses: parsed.macAddresses.map((x) => MacAddress(x)),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteNodes,
          input,
          ctx,
        }),
      ),
  });
};

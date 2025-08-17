import { z } from "zod";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { MacAddress } from "@md/core/domain/mac-address";
import { NodeConfig } from "@md/core/domain/node-config";
import { FindNodeConfig } from "@md/core/usecase/find-node-config";
import { SaveNodeConfig } from "@md/core/usecase/save-node-config";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const NodeConfigRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const findNodeConfig = FindNodeConfig(props);
  const saveNodeConfig = SaveNodeConfig({
    ...props,
  });
  return t.router({
    find: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            macAddress: z.string(),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          macAddress: MacAddress(parsed.macAddress),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: findNodeConfig,
          input,
          ctx,
        }),
      ),
    // TODO: validate input
    update: t.withAuth
      .input(
        (x) =>
          x as NodeConfig & {
            organizationId: OrganizationId;
          },
      )
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: saveNodeConfig,
          input,
          ctx,
        }),
      ),
  });
};

import { z } from "zod";
import { AlertKinds } from "@md/core/domain/alert-kind";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { SiteId } from "@md/core/domain/site-id";
import { NotificationConfigId } from "@md/core/domain/notification-config/id";
import { UserId } from "@md/core/domain/user-id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { SaveNotificationConfig } from "@md/core/usecase/save-notification-config";
import { DeleteNotificationConfig } from "@md/core/usecase/delete-notification-config";
import { FilterNotificationConfigs } from "@md/core/usecase/filter-notification-configs";
import { MacAddress } from "@md/core/domain/mac-address";

export const NotificationConfigRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const deleteNotificationConfig = DeleteNotificationConfig(props);
  const filterNotificationConfigs = FilterNotificationConfigs(props);
  const saveNotificationConfig = SaveNotificationConfig(props);

  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterNotificationConfigs,
          input,
          ctx,
        }),
      ),
    save: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.optional(z.string()),
            organizationId: z.string(),
            userId: z.string(),
            enabled: z.optional(z.boolean()),
            siteId: z.optional(z.string()),
            mutedMacAddresses: z.optional(z.set(z.string())),
            alerts: z.optional(
              z.array(
                z.object({
                  kind: z.enum(AlertKinds),
                  enabled: z.boolean(),
                }),
              ),
            ),
          })
          .parse(v);
        return {
          ...(parsed.id && { id: NotificationConfigId(parsed.id) }),
          organizationId: OrganizationId(parsed.organizationId),
          userId: UserId(parsed.userId),
          ...(parsed.siteId && {
            siteId: SiteId(parsed.siteId),
          }),
          ...(parsed.enabled !== undefined && {
            enabled: parsed.enabled,
          }),
          ...(parsed.mutedMacAddresses && {
            mutedMacAddresses: new Set(
              Array.from(parsed.mutedMacAddresses).map(MacAddress),
            ),
          }),
          ...(parsed.alerts && {
            alerts: parsed.alerts,
          }),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: saveNotificationConfig,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          id: NotificationConfigId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteNotificationConfig,
          input,
          ctx,
        }),
      ),
  });
};

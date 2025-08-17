import { UserRoles } from "@md/core/domain/user-role";
import { Email } from "@md/core/domain/email";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { UserName } from "@md/core/domain/user-name";
import { CreateAdminUser } from "@md/core/usecase/create-admin-user";
import { FindLatestTermsOfUse } from "@md/core/usecase/find-latest-terms-of-use";
import { Invite } from "@md/core/usecase/invite";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { z } from "zod";
import { ActionLogRoutes } from "./action-log";
import { CreateContext } from "./context";
import { Router } from "./create-router";
import { LicenseRoutes } from "./license";
import { LocalMapRoutes } from "./local-map";
import { NodeRoutes } from "./node";
import { NodeConfigRoutes } from "./node-config";
import { NotificationConfigRoutes } from "./notification-config";
import { OrganizationRoutes } from "./organization";
import { SiteRoutes } from "./site";
import { TagRoutes } from "./tag";
import { UserRoutes } from "./user";
import { FirmwareRoutes } from "./firmware";
import { JobRoutes } from "./job";
import { VendorRoutes } from "./vendor";
import { AnnouncementRoutes } from "./announcement";
import { DeviceRoutes } from "./device";
import { ApClientRoutes } from "./ap-client";
import { FindCaller } from "@md/core/usecase/find-caller";
import { MetricRoutes } from "./metric";
import { NodeEventRoutes } from "./node-event";
import { AlertRoutes } from "./alert";

export const TrpcOptions = (props: Infrastructure) => {
  const t = Router();
  const { withAuth } = t;
  const invite = Invite(props);
  const findLatestTermsOfUse = FindLatestTermsOfUse(props);
  const createAdminUser = CreateAdminUser(props);
  const findCaller = FindCaller(props);
  const router = t.router({
    createAdminUser: t.procedure
      .input((v) => {
        const parsed = z
          .object({
            email: z.string().refine(Email.validate),
            organizationId: z.string(),
            name: z.string().refine(UserName.validate),
          })
          .parse(v);
        return {
          email: Email(parsed.email),
          organizationId: OrganizationId(parsed.organizationId),
          name: UserName(parsed.name),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: createAdminUser,
          input: {
            ...ctx,
            ...input,
          },
        }),
      ),
    findLatestTermsOfUse: withAuth
      .input(() => {
        return {};
      })
      .query(({ input, ctx }) =>
        props.runner.run({
          action: findLatestTermsOfUse,
          input,
          ctx,
        }),
      ),
    findCaller: withAuth.query(({ ctx }) => {
      return props.runner.run({
        action: findCaller,
        input: {
          id: ctx.userId,
        },
        ctx,
      });
    }),
    invite: withAuth
      .input((x) => {
        const parsed = z
          .object({
            role: z.enum(UserRoles),
            email: z.string(),
            allowedOrganizationIds: z.array(z.string()),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          role: parsed.role,
          email: Result.unwrap(Email(parsed.email)),
          allowedOrganizationIds:
            parsed.allowedOrganizationIds.map(OrganizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({ action: invite, input, ctx }),
      ),
    organization: OrganizationRoutes({
      ...props,
      t,
    }),
    node: NodeRoutes({ ...props, t }),
    license: LicenseRoutes({ ...props, t }),
    user: UserRoutes({ ...props, t }),
    localMap: LocalMapRoutes({ ...props, t }),
    site: SiteRoutes({ ...props, t }),
    actionLog: ActionLogRoutes({ ...props, t }),
    vendor: VendorRoutes({ ...props, t }),
    tag: TagRoutes({ ...props, t }),
    notificationConfig: NotificationConfigRoutes({ ...props, t }),
    nodeConfig: NodeConfigRoutes({ ...props, t }),
    firmware: FirmwareRoutes({ ...props, t }),
    job: JobRoutes({ ...props, t }),
    announcement: AnnouncementRoutes({ ...props, t }),
    device: DeviceRoutes({ ...props, t }),
    apClient: ApClientRoutes({ ...props, t }),
    metric: MetricRoutes({ ...props, t }),
    nodeEvent: NodeEventRoutes({ ...props, t }),
    alert: AlertRoutes({ ...props, t }),
  });
  const createContext = CreateContext(props);
  return { router, createContext };
};
export type AppRouter = ReturnType<typeof TrpcOptions>["router"];

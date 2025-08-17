import { z } from "zod";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { LicenseId } from "@md/core/domain/license-id";
import { LicenseCode } from "@md/core/domain/license-code";
import { OrganizationId } from "@md/core/domain/organization-id";
import { UseLicense } from "@md/core/usecase/use-license";
import { FilterLicenses } from "@md/core/usecase/filter-licenses";
import { UpdateLicense } from "@md/core/usecase/update-license";
import { CreateLicense } from "@md/core/usecase/create-license";
import { ReceiveLicense } from "@md/core/usecase/receive-license";
import { SendLicense } from "@md/core/usecase/send-license";
import { DeleteLicense } from "@md/core/usecase/delete-license";
import { CancelSendingLicense } from "@md/core/usecase/cancel-sending-license";
import { ActionInput } from "@md/core/action";

export const LicenseRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const useLicense = UseLicense(props);
  const filterLicenses = FilterLicenses(props);
  const updateLicense = UpdateLicense(props);
  const createLicense = CreateLicense(props);
  const receiveLicense = ReceiveLicense(props);
  const sendLicense = SendLicense(props);
  const deleteLicense = DeleteLicense(props);
  const cancelSendingLicense = CancelSendingLicense(props);
  return t.router({
    filter: t.withAuth
      .input((x) => {
        const { organizationId } = z
          .object({ organizationId: z.string() })
          .parse(x);
        return {
          organizationId: OrganizationId(organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterLicenses,
          input,
          ctx,
        }),
      ),
    update: t.withAuth
      .input((x) => {
        return x as ActionInput<"UpdateLicense">;
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: updateLicense,
          input,
          ctx,
        }),
      ),
    create: t.withAuth
      .input((x) => x as ActionInput<"CreateLicense">)
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: createLicense,
          input,
          ctx,
        }),
      ),
    receive: t.withAuth
      .input((x) => {
        const parsed = z
          .object({ code: z.string(), organizationId: z.string() })
          .parse(x);
        return {
          code: LicenseCode(parsed.code),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: receiveLicense,
          input,
          ctx,
        }),
      ),
    send: t.withAuth
      .input((x) => {
        const parsed = z
          .object({ id: z.string(), organizationId: z.string() })
          .parse(x);
        return {
          id: LicenseId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: sendLicense,
          input,
          ctx,
        }),
      ),
    use: t.withAuth
      .input((x) => {
        const parsed = z
          .object({ id: z.string(), organizationId: z.string() })
          .parse(x);
        return {
          id: LicenseId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: useLicense,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((x) => {
        const parsed = z
          .object({ id: z.string(), organizationId: z.string() })
          .parse(x);
        return {
          id: LicenseId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteLicense,
          input,
          ctx,
        }),
      ),
    cancelSending: t.withAuth
      .input((x) => {
        const parsed = z
          .object({ id: z.string(), organizationId: z.string() })
          .parse(x);
        return {
          id: LicenseId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: cancelSendingLicense,
          input,
          ctx,
        }),
      ),
  });
};

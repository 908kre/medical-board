import { z } from "zod";
import { Router } from "./create-router";
import { Result } from "@md/core/result";
import { OrganizationId } from "@md/core/domain/organization-id";
import { OrganizationName } from "@md/core/domain/organization-name";
import { OrganizationKinds } from "@md/core/domain/organization-kind";
import { TermsOfUseId } from "@md/core/domain/terms-of-use/id";
import { FirmwarePackage } from "@md/core/domain/firmware-package";
import { SetFirmwarePackages } from "@md/core/usecase/set-firmware-packages";
import { SetOfflineDetectionTime } from "@md/core/usecase/set-offline-detection-time";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { CreateOrganization } from "@md/core/usecase/create-organization";
import { DeleteOrganization } from "@md/core/usecase/delete-organization";
import { FilterOrganizations } from "@md/core/usecase/filter-organizations";
import { FindOrganization } from "@md/core/usecase/find-organization";
import { UpdateOrganization } from "@md/core/usecase/update-organization";
import { IsDuplicatedOrganizationName } from "@md/core/usecase/is-duplicated-organization-name";
import { SetupOrganization } from "@md/core/usecase/setup-organization";
import { FilterUsers } from "@md/core/usecase/filter-users";
import { FilterNodes } from "@md/core/usecase/filter-nodes";
import { Topic } from "@md/core/domain/topic";
import { SetTopics } from "@md/core/usecase/set-topics";
import { Milliseconds } from "@md/core/domain/milliseconds";

export const OrganizationRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const findOrganization = FindOrganization(props);
  const filterOrganizations = FilterOrganizations(props);
  const filterUsers = FilterUsers(props);
  const filterNodes = FilterNodes(props);
  const isDuplicatedOrganizationName = IsDuplicatedOrganizationName(props);
  const createOrganization = CreateOrganization({
    ...props,
    isDuplicatedOrganizationName,
  });
  const setupOrganization = SetupOrganization({
    ...props,
    isDuplicatedOrganizationName,
  });
  const updateOrganization = UpdateOrganization({
    ...props,
    isDuplicatedOrganizationName,
  });
  const deleteOrganization = DeleteOrganization({
    ...props,
    filterNodes,
    filterUsers,
  });
  const setFirmwarePackages = SetFirmwarePackages(props);
  const setTopics = SetTopics(props);
  const setOfflineDetectionTime = SetOfflineDetectionTime(props);
  return t.router({
    setup: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organization: z.object({
              name: z.string(),
            }),
            termsOfUseIds: z.array(z.string()),
          })
          .parse(v);
        return {
          organization: {
            name: OrganizationName(parsed.organization.name),
          },
          termsOfUseIds: parsed.termsOfUseIds.map((id) =>
            Result.unwrap(TermsOfUseId(id)),
          ),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: setupOrganization,
          input: {
            ...input,
            userId: ctx.userId,
          },
          ctx,
        }),
      ),
    find: t.withAuth
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
      .query(({ ctx, input }) =>
        props.runner.run({
          action: findOrganization,
          input,
          ctx,
        }),
      ),

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
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterOrganizations,
          input,
          ctx,
        }),
      ),

    isDuplicatedName: t.procedure
      .input((x) => {
        const parsed = z
          .object({
            name: z.string(),
            excludeId: z.optional(z.string()),
          })
          .parse(x);
        return {
          name: Result.unwrap(OrganizationName(parsed.name)),
          ...(parsed.excludeId && {
            excludeId: Result.unwrap(OrganizationId(parsed.excludeId)),
          }),
        };
      })
      .query(({ input }) =>
        props.runner.run({
          action: isDuplicatedOrganizationName,
          input,
        }),
      ),

    setFirmwarePackages: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            firmwarePackages: z.array(z.string()),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          firmwarePackages: parsed.firmwarePackages.map((x) =>
            FirmwarePackage(x),
          ),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: setFirmwarePackages,
          input,
          ctx,
        }),
      ),

    setTopics: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            topics: z.array(z.string()),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          topics: parsed.topics.map((x) => Topic(x)),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: setTopics,
          input,
          ctx,
        }),
      ),
    setOfflineDetectionTime: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            offlineDetectionTime: z.number(),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          offlineDetectionTime: Milliseconds(parsed.offlineDetectionTime),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: setOfflineDetectionTime,
          input,
          ctx,
        }),
      ),
    update: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            name: z.string(),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          name: OrganizationName(parsed.name),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: updateOrganization,
          input,
          ctx,
        }),
      ),
    create: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            name: z.string(),
            kind: z.enum(OrganizationKinds),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          name: Result.unwrap(OrganizationName(parsed.name)),
          kind: parsed.kind,
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: createOrganization,
          input,
          ctx,
        }),
      ),

    delete: t.withAuth
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
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteOrganization,
          input,
          ctx,
        }),
      ),
  });
};

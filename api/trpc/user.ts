import { OrganizationId } from "@md/core/domain/organization-id";
import { UserId } from "@md/core/domain/user-id";
import { UserName } from "@md/core/domain/user-name";
import { TagId } from "@md/core/domain/tag-id";
import { FilterUsers } from "@md/core/usecase/filter-users";
import { FindUser } from "@md/core/usecase/find-user";
import { UpdateUser } from "@md/core/usecase/update-user";
import { UserRoles } from "@md/core/domain/user-role";
import { UpdateSelfUser } from "@md/core/usecase/update-self-user";
import { DeleteUser } from "@md/core/usecase/delete-user";
import { z } from "zod";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const UserRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const findUser = FindUser(props);
  const filterUsers = FilterUsers(props);
  const updateUser = UpdateUser(props);
  const updateSelfUser = UpdateSelfUser(props);
  const deleteUser = DeleteUser(props);
  return t.router({
    find: t.withAuth
      .input(() => {
        return {};
      })
      .query(({ ctx }) =>
        props.runner.run({
          action: findUser,
          input: {
            userId: ctx.userId,
          },
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
          action: filterUsers,
          input,
          ctx,
        }),
      ),
    update: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            userId: z.string(),
            name: z.string().optional(),
            organizationId: z.string(),
            role: z.enum(UserRoles),
            allowedOrganizationIds: z.array(z.string()).optional(),
            tagIds: z.array(z.string()),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          userId: UserId(parsed.userId),
          role: parsed.role,
          ...(parsed.name && { name: UserName(parsed.name) }),
          tagIds: parsed.tagIds.map(TagId),
          ...(parsed.allowedOrganizationIds && {
            allowedOrganizationIds:
              parsed.allowedOrganizationIds.map(OrganizationId),
          }),
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: updateUser,
          input,
          ctx,
        }),
      ),
    updateSelf: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            userId: z.string(),
            name: z.string().optional(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          userId: UserId(parsed.userId),
          ...(parsed.name && { name: UserName(parsed.name) }),
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: updateSelfUser,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            userId: z.string(),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          userId: UserId(parsed.userId),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: deleteUser,
          input,
          ctx,
        }),
      ),
  });
};

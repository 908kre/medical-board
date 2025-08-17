import { z } from "zod";
import { Router } from "./create-router";
import { OrganizationId } from "@md/core/domain/organization-id";
import { TagId } from "@md/core/domain/tag-id";
import { TagName } from "@md/core/domain/tag-name";
import { TagMemo } from "@md/core/domain/tag-memo";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { DeleteTag } from "@md/core/usecase/delete-tag";
import { FilterTags } from "@md/core/usecase/filter-tags";
import { FindTag } from "@md/core/usecase/find-tag";
import { SaveTag } from "@md/core/usecase/save-tag";

export const TagRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const deleteTag = DeleteTag(props);
  const filterTags = FilterTags(props);
  const findTag = FindTag(props);
  const saveTag = SaveTag(props);
  return t.router({
    find: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            id: z.string(),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          id: TagId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({ action: findTag, input, ctx }),
      ),

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
          action: filterTags,
          input,
          ctx,
        }),
      ),
    save: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string().optional(),
            name: z.string(),
            memo: z.string(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          name: TagName(parsed.name),
          memo: TagMemo(parsed.memo),
          organizationId: OrganizationId(parsed.organizationId),
          ...(parsed.id && { id: TagId(parsed.id) }),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: saveTag,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            id: z.string(),
            organizationId: z.string(),
          })
          .parse(x);
        return {
          id: TagId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteTag,
          input,
          ctx,
        }),
      ),
  });
};

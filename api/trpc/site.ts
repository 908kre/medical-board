import { z } from "zod";
import { Router } from "./create-router";
import { TagId } from "@md/core/domain/tag-id";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { SiteId } from "@md/core/domain/site-id";
import { SiteName } from "@md/core/domain/site-name";
import { SiteMemo } from "@md/core/domain/site-memo";
import { OrganizationId } from "@md/core/domain/organization-id";
import { SaveSite } from "@md/core/usecase/save-site";
import { DeleteSite } from "@md/core/usecase/delete-site";
import { FilterSites } from "@md/core/usecase/filter-sites";
import { FindSite } from "@md/core/usecase/find-site";

export const SiteRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const findSite = FindSite(props);
  const saveSite = SaveSite(props);
  const deleteSite = DeleteSite(props);
  const filterSites = FilterSites(props);

  return t.router({
    find: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          id: SiteId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({ action: findSite, input, ctx }),
      ),
    save: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string().optional(),
            name: z.string(),
            memo: z.string(),
            organizationId: z.string(),
            tagIds: z.array(z.string()),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          name: SiteName(parsed.name),
          memo: SiteMemo(parsed.memo),
          tagIds: parsed.tagIds.map(TagId),
          ...(parsed.id && { id: SiteId(parsed.id) }),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: saveSite,
          input,
          ctx,
        }),
      ),
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            tagIds: z.array(z.string()).optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterSites,
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
          id: SiteId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteSite,
          input,
          ctx,
        }),
      ),
  });
};

import { FilterAnnouncements } from "@md/core/usecase/filter-announcements";
import { SaveAnnouncement } from "@md/core/usecase/save-announcement";
import { DeleteAnnouncement } from "@md/core/usecase/delete-announcement";
import { z } from "zod";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { Topic } from "@md/core/domain/topic";
import { OrganizationId } from "@md/core/domain/organization-id";
import { AnnouncementId } from "@md/core/domain/announcement/id";

export const AnnouncementRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterAnnouncements = FilterAnnouncements(props);
  const saveAnnouncement = SaveAnnouncement(props);
  const deleteAnnouncement = DeleteAnnouncement(props);
  return t.router({
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
          action: filterAnnouncements,
          input,
          ctx,
        }),
      ),
    save: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            id: z.string().optional(),
            title: z.string(),
            content: z.string(),
            topic: z.string(),
            isPublic: z.boolean().optional(),
          })
          .parse(x);
        return {
          ...(parsed.id && { id: AnnouncementId(parsed.id) }),
          title: parsed.title,
          content: parsed.content,
          topic: Topic(parsed.topic),
          isPublic: parsed.isPublic,
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: saveAnnouncement,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((x) => {
        const parsed = z.object({ id: z.string() }).parse(x);
        return { id: AnnouncementId(parsed.id) };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: deleteAnnouncement,
          input,
          ctx,
        }),
      ),
  });
};

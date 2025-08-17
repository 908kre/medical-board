import { Announcement } from "@md/core/domain/announcement";

import { OrganizationId } from "@md/core/domain/organization-id";

import { Topic } from "@md/core/domain/topic";

import { Result } from "../result";

import { AnnouncementId } from "../domain/announcement/id";

export type AnnouncementRepository = {
  save: (announcement: Announcement) => Promise<Result<void>>;
  delete: (args: { id: AnnouncementId }) => Promise<Result<void>>;
  filter: (query: {
    organizationId?: OrganizationId;
    topics?: Topic[];
    isPublic?: boolean;
  }) => Promise<Result<Announcement[]>>;
};

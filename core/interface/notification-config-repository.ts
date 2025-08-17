import { NotificationConfig } from "@md/core/domain/notification-config";
import { NotificationConfigId } from "@md/core/domain/notification-config/id";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";

export type NotificationConfigRepository = {
  find: (args: {
    id: NotificationConfigId;
  }) => Promise<Result<NotificationConfig>>;
  filter: (args: {
    organizationId?: OrganizationId;
    ids?: NotificationConfigId[];
    enabled?: boolean;
  }) => Promise<Result<NotificationConfig[]>>;
  save: (args: NotificationConfig[]) => Promise<Result<void>>;
  delete: (args: { id: NotificationConfigId }) => Promise<Result<void>>;
};

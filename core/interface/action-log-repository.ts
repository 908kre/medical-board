import { ActionLog } from "@md/core/domain/action-log";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";

export type ActionLogRepository = {
  filter: (args: {
    organizationId: OrganizationId;
    range?: {
      from: Date;
      to: Date;
    };
    limit?: number;
  }) => Promise<ActionLog[] | Error>;
  create: (args: ActionLog) => Promise<Result<void>>;
};

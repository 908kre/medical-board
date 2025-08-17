import { Result } from "@md/core/result";
import { Job } from "@md/core/domain/job";
import { ExecutionStatus } from "@md/core/domain/execution";
import { JobId } from "@md/core/domain/job-id";
import { OrganizationId } from "@md/core/domain/organization-id";

export type JobRepository = {
  save: (args: Job[]) => Promise<Result<void>>;
  filter: (args: {
    organizationId?: OrganizationId;
    execution?: {
      status?: ExecutionStatus;
    };
    limit?: number;
  }) => Promise<Result<Job[]>>;
  find: (args: {
    id: JobId;
    organizationId: OrganizationId;
  }) => Promise<Result<Job>>;
};

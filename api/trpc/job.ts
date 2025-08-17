import { z } from "zod";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { FilterJobs } from "@md/core/usecase/filter-jobs";
import { FindJob } from "@md/core/usecase/find-job";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { CreateJob } from "@md/core/usecase/create-job";
import { JobId } from "@md/core/domain/job-id";

export const JobRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t, messageQueue } = props;
  const findJob = FindJob(props);
  const createJob = CreateJob(props);
  const filterJobs = FilterJobs(props);
  return t.router({
    find: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            id: z.string(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          id: JobId(parsed.id),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({ action: findJob, input, ctx }),
      ),
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            limit: z.number().optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          limit: parsed.limit,
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({ action: filterJobs, input, ctx }),
      ),
    cancel: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            jobId: z.string(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          jobId: JobId(parsed.jobId),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(async ({ input }) => {
        return await messageQueue.push([
          {
            kind: "cancel-job",
            payload: input,
          },
        ]);
      }),

    create: t.withAuth
      .input((v) => {
        return v as Parameters<CreateJob["run"]>[0];
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({ action: createJob, input, ctx }),
      ),
  });
};

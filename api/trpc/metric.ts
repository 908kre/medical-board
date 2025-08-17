import { z } from "zod";
import { MetricsTuples } from "@md/core-api/dto/metrics-tuple";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Router } from "./create-router";
import { FilterMetrics } from "@md/core/usecase/filter-metrics";
import { Result } from "@md/core/result";
import { MetricName } from "@md/core/domain/metric";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const MetricRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterMetric = FilterMetrics(props);
  return t.router({
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            names: z.string().array(),
            range: z.object({
              from: z.date(),
              to: z.date(),
            }),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          names: parsed.names as MetricName[],
          range: parsed.range,
        };
      })
      .query(async ({ ctx, input }) => {
        const metrics = await props.runner.run({
          action: filterMetric,
          input,
          ctx,
        });
        if (Result.isErr(metrics)) {
          return metrics;
        }
        return MetricsTuples.fromMetrics(metrics);
      }),
  });
};

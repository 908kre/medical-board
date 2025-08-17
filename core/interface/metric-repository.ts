import { Metric, MetricName } from "@md/core/domain/metric";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";

export type MetricRepository = {
  filter: (args: {
    organizationId: OrganizationId;
    names: MetricName[];
    range: {
      from: Date;
      to: Date;
    };
  }) => Promise<Metric[] | Error>;
  save: (args: Metric[]) => Promise<Result<void>>;
};

import { Result } from "../result";
import { Cron } from "../domain/cron";
type Handler = (date: Date) => Promise<void>;
export type Scheduler = {
  schedule: (args: {
    scheduledAt: Date;
    id: string;
    handler: Handler;
  }) => Promise<Result<void>>;
  repeat: (args: { cron: Cron; handler: Handler }) => Promise<Result<void>>;
  cancel: (args: { id: string }) => Promise<Result<void>>;
};

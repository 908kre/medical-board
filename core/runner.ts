import { Runner as _Runner } from "@md/core/interface/runner";
import { Caller } from "@md/core/domain/caller";
import { Access } from "@md/core/domain/access";
import { UserId } from "@md/core/domain/user-id";
import { ErrorName, Err } from "@md/core/domain/error";
import { ActionKind, ActionInput, ActionRun } from "@md/core/action";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { ActionLog } from "@md/core/domain/action-log";
import { FindCaller } from "@md/core/usecase/find-caller";
import { Result } from "@md/core/result";
import { Dispatcher } from "./dispatcher";

export const Runner = (
  props: Pick<
    Infrastructure,
    | "lock"
    | "logger"
    | "actionLogRepository"
    | "organizationRepository"
    | "userRepository"
  >,
): _Runner => {
  const { lock, logger } = props;
  const dispatcher = Dispatcher(props);
  const findCaller = FindCaller(props);
  const run = async <K extends ActionKind>(args: {
    action: ActionRun<K>;
    input: ActionInput<K>;
    validate?: (input: ActionInput<K>, caller?: Caller) => Result<void>;
    ctx?: {
      userId: UserId;
    };
  }) => {
    const { action, input, ctx } = args;
    const { kind, saveLog, access } = action;
    const startAt = new Date();
    const startPerf = performance.now();
    const log = {
      kind,
      input,
    };
    logger?.info({
      ...log,
      status: "InProgress",
    });
    const caller = await (async () => {
      if (!ctx?.userId) {
        return;
      }
      return await findCaller.run({ id: ctx.userId });
    })();
    if (Result.isErr(caller)) {
      return caller;
    }
    const organization = await (async () => {
      const organizationId =
        "organizationId" in input ? input.organizationId : undefined;
      return await props.organizationRepository.find({ id: organizationId });
    })();
    if (Result.isErr(organization)) {
      return organization;
    }

    const accessErr = await (async () => {
      if (!access || !caller) {
        return;
      }
      if (!Access.has(access, caller, organization)) {
        return Err({
          name: ErrorName.Forbidden,
          message: `User ${caller?.user.id} does not have permission to run action ${kind}`,
        });
      }
    })();
    if (Result.isErr(accessErr)) {
      return accessErr;
    }

    const valErr = await args.validate?.(input, caller);
    if (Result.isErr(valErr)) {
      return valErr;
    }

    const locks = action.locks?.(input);

    const res = locks
      ? await lock.auto(locks, () => dispatcher.dispatch({ action, input }))
      : await dispatcher.dispatch({ action, input });
    const endAt = new Date();
    const endPerf = performance.now();
    const elapsed = endPerf - startPerf;
    const status = Result.isErr(res) ? "Failed" : "Done";

    if (saveLog && caller && organization) {
      const actionLog = ActionLog({
        startAt,
        endAt,
        organizationId: organization.id,
        userId: caller.user.id,
        input,
        kind,
        status,
      });
      const err = await props.actionLogRepository.create(actionLog);
      if (Result.isErr(err)) {
        logger.info({
          ...log,
          status: "Failed",
          error: {
            name: err.name,
            message: err.message,
          },
        });
        return err;
      }
    }
    logger.info({
      ...log,
      status,
      elapsed,
      ...(Result.isErr(res) && {
        error: res,
      }),
    });
    return res;
  };
  return {
    run,
  };
};

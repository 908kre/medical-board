import { ActionKind, ActionInput, ActionRun } from "@md/core/action";
import { Result } from "@md/core/result";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { WorkflowId } from "@md/core/domain/workflow-id";

const omitBuffer = <K extends ActionKind>(
  input: Parameters<ActionRun<K>["run"]>[0],
) => {
  if ("bytes" in input && Buffer.isBuffer(input.bytes)) {
    return { ...input, bytes: `Buffer<${input.bytes.length}>` };
  }
  return input;
};

export const Dispatcher = (props: Pick<Infrastructure, "logger">) => {
  const { logger } = props;
  const dispatch = async <K extends ActionKind>(args: {
    action: ActionRun<K>;
    input: ActionInput<K>;
    workflowId?: WorkflowId;
  }) => {
    const workflowId = args.workflowId ?? WorkflowId.random();
    const { input, action } = args;
    const { kind } = action;
    const startPerf = performance.now();
    const log = {
      kind,
      status: "InProgress",
      workflowId,
      input: omitBuffer(input),
    };
    logger?.info({
      ...log,
    });
    const res = await action.run(input, workflowId);
    const endPerf = performance.now();
    const elapsed = endPerf - startPerf;
    logger.info({
      kind,
      status: Result.isErr(res) ? "Failed" : "Done",
      input,
      workflowId,
      elapsed,
      ...(Result.isErr(res) && {
        error: {
          name: res.name,
          message: res.message,
        },
      }),
    });
    return res;
  };
  return { dispatch };
};
export type Dispatcher = ReturnType<typeof Dispatcher>;

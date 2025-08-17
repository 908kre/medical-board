import {
  ActionKind,
  ActionInput,
  ActionRun,
  ActionOutput,
} from "@md/core/action";
import { Result } from "@md/core/result";
import { WorkflowId } from "@md/core/domain/workflow-id";
export type Dispatcher = {
  dispatch: <K extends ActionKind>(args: {
    action: ActionRun<K>;
    input: ActionInput<K>;
    workflowId?: WorkflowId;
  }) => Promise<Result<ActionOutput<K>>>;
};

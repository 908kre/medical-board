import {
  ActionKind,
  ActionInput,
  ActionOutput,
  ActionRun,
} from "@md/core/action";

import { Result } from "@md/core/result";
import { UserId } from "@md/core/domain/user-id";

export type Runner = {
  run: <K extends ActionKind>(args: {
    action: ActionRun<K>;
    input: ActionInput<K>;
    ctx?: {
      userId: UserId;
    };
  }) => Promise<Result<ActionOutput<K>>>;
};

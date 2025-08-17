import { Result } from "@md/core/result";
import { Message, MessageKind } from "@md/core/domain/message";

export type Handler<K extends MessageKind> = (
  args: Extract<Message, { kind: K }>["payload"],
) => Promise<Result>;
export type Handlers = Partial<{ [K in MessageKind]: Handler<K> }>;

export type MessageQueue = {
  push: (args: Message[]) => Promise<Result<void>>;
  start: (args: Handlers) => Promise<void>;
  stop: () => Promise<void>;
};

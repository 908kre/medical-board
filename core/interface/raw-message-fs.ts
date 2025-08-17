import { FileMeta } from "@md/core/domain/file-meta";

import { RawMessage } from "@md/core/domain/raw-message";

import { Result } from "@md/core/result";

export type RawMessageFs = {
  filter: (args: { prefix: string }) => Promise<Result<FileMeta[]>>;
  write: (args: RawMessage) => Promise<Result<void>>;
};

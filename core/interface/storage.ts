import { FileMeta } from "@md/core/domain/file-meta";
import { Result } from "@md/core/result";
import { Readable } from "stream";

export type Storage = {
  read: (props: { path: string }) => Promise<Result<Buffer>>;
  filter: (props: { prefix: string }) => Promise<Result<FileMeta[]>>;
  exists: (props: { path: string }) => Promise<Result<boolean>>;
  write: (props: {
    path: string;
    data: Buffer | Readable;
  }) => Promise<Result<void>>;
  delete: (props: { path: string }) => Promise<Result<void>>;
};

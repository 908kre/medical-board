import { Result } from "@md/core/result";
import { Webp } from "@md/core/domain/webp";
import { Pixel } from "@md/core/domain/pixel";

export type ImageTransformer = {
  toWebp: (buffer: Buffer) => Promise<Result<Webp>>;
  getMetadata: (
    buffer: Buffer,
  ) => Promise<Result<{ width: Pixel; height: Pixel }>>;
};

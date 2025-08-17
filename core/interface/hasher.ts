import { Result } from "@md/core/result";
import { Checksum } from "@md/core/domain/checksum";

export type Hasher = {
  md5: (buffer: Buffer) => Result<Checksum>;
};

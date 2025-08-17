import { FirmwareImage } from "@md/core/domain/firmware-image";
import { Result } from "@md/core/result";
import { Readable } from "stream";
import { FirmwareId } from "@md/core/domain/firmware-id";

export type FirmwareImageFs = {
  read: (props: { id: FirmwareId }) => Promise<Result<FirmwareImage>>;
  write: (props: {
    id: FirmwareId;
    data: Readable | FirmwareImage;
  }) => Promise<Result<void>>;
  delete: (props: { id: FirmwareId }) => Promise<Result<void>>;
};

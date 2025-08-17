import { z } from "zod";
import { Result } from "@md/core/result";
import { Err, ErrorName } from "@md/core/domain/error";
import { Router } from "./create-router";
import { OrganizationId } from "@md/core/domain/organization-id";
import { FilterFirmwares } from "@md/core/usecase/filter-firmwares";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { DeleteFirmware } from "@md/core/usecase/delete-firmware";
import { FirmwareId } from "@md/core/domain/firmware-id";
import { SaveFirmware } from "@md/core/usecase/save-firmware";
import { FirmwareVersion } from "@md/core/domain/firmware-version";
import superjson from "superjson";
import { FirmwarePackage } from "@md/core/domain/firmware-package";
import { NodeModel } from "@md/core/domain/node-model";
import { FirmwareImage } from "@md/core/domain/firmware-image";

export const FirmwareRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterFirmwares = FilterFirmwares(props);
  const deleteFirmware = DeleteFirmware(props);
  const saveFirmware = SaveFirmware(props);
  return t.router({
    save: t.withAuth
      .input(z.instanceof(FormData))
      .mutation(async ({ input, ctx }) => {
        const payload = (() => {
          const value = input.get("payload");
          if (typeof value !== "string")
            return Err({
              name: ErrorName.InvalidArgument,
              message: "Invalid payload",
            });
          const parsed = z
            .object({
              version: z.string(),
              model: z.string(),
              pkg: z.string(),
              isPublished: z.boolean(),
              id: z.string().optional(),
              fileName: z.string().optional(),
            })
            .safeParse(superjson.deserialize(JSON.parse(value)));
          if (!parsed.success)
            return Err({
              name: ErrorName.InvalidArgument,
              message: "Invalid payload",
            });
          return {
            ...(parsed.data.id && { id: FirmwareId(parsed.data.id) }),
            version: FirmwareVersion(parsed.data.version),
            pkg: FirmwarePackage(parsed.data.pkg),
            model: NodeModel(parsed.data.model),
            isPublished: parsed.data.isPublished,
          };
        })();
        if (Result.isErr(payload)) return payload;
        const maxSize = 1024 * 1024 * 200; // 200MB
        const file = await (async () => {
          const value = input.get("file");
          if (value instanceof File) {
            if (value.size > maxSize) {
              return Err({
                name: ErrorName.InvalidArgument,
                message: `File size exceeds maximum limit of ${maxSize} bytes (${value.size})`,
              });
            }
            return {
              fileName: value.name,
              bytes: FirmwareImage(Buffer.from(await value.arrayBuffer())),
            };
          }
          return undefined;
        })();
        if (Result.isErr(file)) return file;
        return props.runner.run({
          action: saveFirmware,
          input: {
            ...payload,
            ...file,
          },
          ctx,
        });
      }),
    filter: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
          })
          .parse(x);
        return {
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterFirmwares,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            id: z.string(),
          })
          .parse(x);
        return {
          id: FirmwareId(parsed.id),
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: deleteFirmware,
          input,
          ctx,
        }),
      ),
  });
};

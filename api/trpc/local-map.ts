import { LocalMapId } from "@md/core/domain/local-map-id";
import { Count } from "@md/core/domain/count";
import { DBm } from "@md/core/domain/dbm";
import { Milliseconds } from "@md/core/domain/milliseconds";
import { AlertConfig } from "@md/core/domain/alert-config";
import { LocalMapMemo } from "@md/core/domain/local-map-memo";
import { LocalMapName } from "@md/core/domain/local-map-name";
import { OrganizationId } from "@md/core/domain/organization-id";
import { PixelScale } from "@md/core/domain/pixel-scale";
import { TagId } from "@md/core/domain/tag-id";
import { Result } from "@md/core/result";
import { SaveLocalMap } from "@md/core/usecase/save-local-map";
import { DeleteLocalMap } from "@md/core/usecase/delete-local-map";
import { FilterLocalMaps } from "@md/core/usecase/filter-local-maps";
import { FindImage } from "@md/core/usecase/find-image";
import { RelocateLocalMap } from "@md/core/usecase/relocate-local-map";
import { SetAlertConfigs } from "@md/core/usecase/set-alert-configs";
import { Meter } from "@md/core/domain/meter";
import { z } from "zod";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";

export const LocalMapRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const saveLocalMap = SaveLocalMap(props);
  const deleteLocalMap = DeleteLocalMap(props);
  const filterLocalMaps = FilterLocalMaps(props);
  const relocateLocalMap = RelocateLocalMap(props);
  const setAlertConfigs = SetAlertConfigs(props);
  const findImage = FindImage(props);
  return t.router({
    save: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string().optional(),
            organizationId: z.string(),
            name: z.string(),
            memo: z.string(),
            scale: z.number(),
            bytes: z.optional(z.instanceof(Buffer)),
            siteId: z.optional(z.string()),
            width: z.optional(z.number()),
            height: z.optional(z.number()),
            tagIds: z.array(z.string()),
          })
          .parse(v);
        return {
          ...(parsed.id && { id: LocalMapId(parsed.id) }),
          organizationId: Result.unwrap(OrganizationId(parsed.organizationId)),
          name: LocalMapName(parsed.name),
          memo: LocalMapMemo(parsed.memo),
          scale: PixelScale(parsed.scale),
          ...(parsed.bytes && { bytes: parsed.bytes }),
          ...(parsed.width && { width: Meter(parsed.width) }),
          ...(parsed.height && { height: Meter(parsed.height) }),
          tagIds: parsed.tagIds.map((tagId) => Result.unwrap(TagId(tagId))),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({ action: saveLocalMap, input, ctx }),
      ),
    filter: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            tagIds: z.array(z.string()).optional(),
          })
          .parse(v);
        return {
          organizationId: OrganizationId(parsed.organizationId),
          ...(parsed.tagIds && { tagIds: parsed.tagIds.map(TagId) }),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterLocalMaps,
          input,
          ctx,
        }),
      ),
    findImage: t.withAuth
      .input((v) => {
        const parsed = z
          .object({ id: z.string(), organizationId: z.string() })
          .parse(v);
        return {
          id: LocalMapId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .query(({ input, ctx }) =>
        props.runner.run({ action: findImage, input, ctx }),
      ),
    relocate: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string(),
            x: z.number(),
            y: z.number(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          id: LocalMapId(parsed.id),
          x: Meter(parsed.x),
          y: Meter(parsed.y),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: relocateLocalMap,
          input,
          ctx,
        }),
      ),
    setAlertConfigs: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            localMapId: z.string(),
            alertConfigs: z
              .union([
                z.object({
                  kind: z.literal("RttExceeded"),
                  threshold: z.number(),
                }),
                z.object({
                  kind: z.literal("RssiExceeded"),
                  threshold: z.number(),
                }),
                z.object({
                  kind: z.literal("ApClientCountExceeded"),
                  threshold: z.number(),
                }),
              ])
              .array(),
          })
          .parse(v);
        return {
          localMapId: LocalMapId(parsed.localMapId),
          organizationId: OrganizationId(parsed.organizationId),
          alertConfigs: parsed.alertConfigs.flatMap((x) => {
            if (x.kind === "RttExceeded") {
              return [
                AlertConfig({
                  kind: "RttExceeded",
                  threshold: Milliseconds(x.threshold),
                }),
              ];
            }
            if (x.kind === "RssiExceeded") {
              return [
                AlertConfig({
                  kind: "RssiExceeded",
                  threshold: DBm(x.threshold),
                }),
              ];
            }
            if (x.kind === "ApClientCountExceeded") {
              return [
                AlertConfig({
                  kind: "ApClientCountExceeded",
                  threshold: Count(x.threshold),
                }),
              ];
            }
            return [];
          }),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: setAlertConfigs,
          input,
          ctx,
        }),
      ),
    delete: t.withAuth
      .input((v) => {
        const parsed = z
          .object({
            id: z.string(),
            organizationId: z.string(),
          })
          .parse(v);
        return {
          id: LocalMapId(parsed.id),
          organizationId: OrganizationId(parsed.organizationId),
        };
      })
      .mutation(({ input, ctx }) =>
        props.runner.run({
          action: deleteLocalMap,
          input,
          ctx,
        }),
      ),
  });
};

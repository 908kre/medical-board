import { FilterDevices } from "@md/core/usecase/filter-devices";
import { SaveDevices } from "@md/core/usecase/save-devices";
import { z } from "zod";
import { Router } from "./create-router";
import { Infrastructure } from "@md/core/interface/infrastructure";
import { DeviceName } from "@md/core/domain/device-name";
import { OrganizationId } from "@md/core/domain/organization-id";
import { Result } from "@md/core/result";
import { MacAddress } from "@md/core/domain/mac-address";
import { Memo } from "@md/core/domain/memo";

export const DeviceRoutes = (
  props: Infrastructure & {
    t: Router;
  },
) => {
  const { t } = props;
  const filterDevices = FilterDevices(props);
  const saveDevices = SaveDevices(props);
  return t.router({
    filter: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
          })
          .parse(x);
        return {
          organizationId: Result.unwrap(OrganizationId(parsed.organizationId)),
        };
      })
      .query(({ ctx, input }) =>
        props.runner.run({
          action: filterDevices,
          input,
          ctx,
        }),
      ),
    save: t.withAuth
      .input((x) => {
        const parsed = z
          .object({
            organizationId: z.string(),
            devices: z.array(
              z.object({
                name: z.string(),
                macAddress: z.string(),
                memo: z.string(),
              }),
            ),
          })
          .parse(x);
        return {
          organizationId: Result.unwrap(OrganizationId(parsed.organizationId)),
          devices: parsed.devices.map((device) => {
            return {
              macAddress: Result.unwrap(MacAddress(device.macAddress)),
              name: DeviceName(device.name),
              memo: Memo(device.memo),
            };
          }),
        };
      })
      .mutation(({ ctx, input }) =>
        props.runner.run({
          action: saveDevices,
          input,
          ctx,
        }),
      ),
  });
};

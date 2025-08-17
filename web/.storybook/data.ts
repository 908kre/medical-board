import map5m from "@md/web-console/test-data/map1.jpeg";
import { Duration } from "@md/core/domain/duration";
import { Percentage } from "@md/core/domain/percentage";
import { Alert } from "@md/core/domain/alert";
import { OrganizationName } from "@md/core/domain/organization-name";
import { NodeEvent } from "@md/core/domain/node-event";
import { Frequency } from "@md/core/domain/frequency";
import { BandWidth } from "@md/core/domain/band-width";
import { AccessPointSignal } from "@md/core/domain/access-point-signal";
import { SSID } from "@md/core/domain/ssid";
import { Packets } from "@md/core/domain/packets";
import { Webp } from "@md/core/domain/webp";
import { Count } from "@md/core/domain/count";
import { BitsPerSecond } from "@md/core/domain/bits-per-second";
import { Bytes } from "@md/core/domain/bytes";
import { mutate } from "swr";
import map10m from "@md/web-console/test-data/office1.jpeg";
import { Metric } from "@md/core/domain/metric";
import { ActionLog } from "@md/core/domain/action-log";
import { client } from "@md/web-console/client/client-v1";
import { User } from "@md/core/domain/user";
import { Email } from "@md/core/domain/email";
import { UserName } from "@md/core/domain/user-name";
import { UserId } from "@md/core/domain/user-id";
import { NotificationConfig } from "@md/core/domain/notification-config";
import { SiteMemo } from "@md/core/domain/site-memo";
import { SiteName } from "@md/core/domain/site-name";
import { Site } from "@md/core/domain/site";
import { NodeModel, NodeModels } from "@md/core/domain/node-model";
import { Firmware } from "@md/core/domain/firmware";
import { Milliseconds } from "@md/core/domain/milliseconds";
import { Channel } from "@md/core/domain/channel";
import { FirmwarePackage } from "@md/core/domain/firmware-package";
import { Checksum } from "@md/core/domain/checksum";
import { ErrorName, Err } from "@md/core/domain/error";
import { Job } from "@md/core/domain/job";
import { OrderNumber } from "@md/core/domain/order-number";
import { Meter } from "@md/core/domain/meter";
import { DBm } from "@md/core/domain/dbm";
import { Announcement } from "@md/core/domain/announcement";
import { LocalMap } from "@md/core/domain/local-map";
import { LocalMapName } from "@md/core/domain/local-map-name";
import { LocalMapMemo } from "@md/core/domain/local-map-memo";
import { addSeconds, addDays } from "date-fns";
import { ApClient } from "@md/core/domain/ap-client";
import { Vendor } from "@md/core/domain/vendor";
import { Organization } from "@md/core/domain/organization";
import { FuelTank } from "@md/core/domain/fuel-tank";
import { Fuel } from "@md/core/domain/fuel";
import { OrganizationId } from "@md/core/domain/organization-id";
import { OrganizationKinds } from "@md/core/domain/organization-kind";
import { Result } from "@md/core/result";
import { action } from "storybook/actions";
import { MacAddress } from "@md/core/domain/mac-address";
import { VendorCode } from "@md/core/domain/vendor/code";
import { Device } from "@md/core/domain/device";
import { DeviceName } from "@md/core/domain/device-name";
import { Caller } from "@md/core/domain/caller";
import { Tag } from "@md/core/domain/tag";
import { TagName } from "@md/core/domain/tag-name";
import { TagMemo } from "@md/core/domain/tag-memo";
import { Point3D } from "@md/core/domain/point-3d";
import { FirmwareVersion } from "@md/core/domain/firmware-version";
import { Node } from "@md/core/domain/node";
import { NodeConfig } from "@md/core/domain/node-config";
import { Order } from "@md/core/domain/order";
import { LicenseCode } from "@md/core/domain/license-code";
import { License } from "@md/core/domain/license";
import { LicenseStatus } from "@md/core/domain/license-status";
import { FirmwareId } from "@md/core/domain/firmware-id";
import { RecurringSchedule } from "@md/core/domain/recurring-schedule";
import { Hours } from "@md/core/domain/hours";
import { Minutes } from "@md/core/domain/minutes";
import { DayOfWeek } from "@md/core/domain/day-of-week";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const organizations = Array.from({ length: 10 }).map((_, x) => {
  return Organization.default({
    id: OrganizationId(
      `ORG-XXXXXX${String(x).padStart(2, "0")}`,
    ) as OrganizationId,
    name:
      Array.from({ length: x + 5 })
        .map(() => "organization name")
        .join(" ") + x.toString(),
    kind: OrganizationKinds[x % OrganizationKinds.length],
    fuelTank: FuelTank({
      ...FuelTank.default(),
      total: Fuel(x * 8640000),
    }),
    createdAt: new Date(`2021-01-${String(x + 1).padStart(2, "0")}T00:00:00Z`),
    offlineDetectionTime: Milliseconds(300000),
  });
});
export const organization = organizations[0];
export const organizationId = organization.id;

export const tags = Array.from({ length: 10 }).map((_, i) => {
  return Tag.default({
    name: TagName(
      Array.from({ length: 10 * i })
        .map(() => "long")
        .join(" ") + `tag-${i}`,
    ),
    memo: TagMemo(`memo-${10 - i}`),
    organizationId,
  });
});

export const users = Array.from({ length: 10 }).map((_, i) => {
  return User.default({
    id: UserId.random(),
    organizationId,
    role: i % 2 === 0 ? "Admin" : "Staff",
    name: UserName(
      Array.from({ length: i + 10 })
        .map(() => "long user name")
        .join(" "),
    ),
    email: Result.unwrap(Email(`user-${i}@picocela.com`)),
    allowedOrganizationIds: [
      organizations[0].id,
      organizations[1].id,
      organizations[2].id,
    ],
    tagIds: [tags[0].id],
  });
});
export const user = users[0];
export const range = {
  from: new Date("2021-01-01"),
  to: new Date("2021-01-02"),
};

export const caller = Caller({
  organization,
  user,
});

export const licenses = Array.from({ length: 20 }).map((_, x) => {
  return License({
    organizationId,
    code:
      x % 2
        ? (LicenseCode("PM-00000000") as LicenseCode)
        : (LicenseCode("PM-000") as LicenseCode),
    status: ["Ready", "Used", "Deleted", "WaitingReceive"][
      x % 4
    ] as LicenseStatus,
    order: Order.default({
      number: x % 2 ? OrderNumber(`PM-00000000${x}`) : undefined,
      duration: Duration.default({ months: x }),
      plan: "Standard",
      nodeCount: Count(x + 1),
      distributorId: organizations[x % 3].id,
      customerId: organizations[(x + 1) % 3].id,
      orderedAt: new Date("2021-01-01T00:00:00Z"),
    }),
  });
});
export const license = licenses[0];

export const devices = Array.from({ length: 10 }).map((_, i) => {
  return Device({
    macAddress: MacAddress(i.toString(16).padStart(12, "0")),
    name: DeviceName(
      `Device-${i}` +
        Array.from({ length: i + 10 })
          .map(() => "long")
          .join(" "),
    ),
    organizationId,
  });
});
export const vendors = Array.from({ length: 10 }).map((_, i) => {
  return Vendor({
    code: Result.unwrap(VendorCode(`00000${i}`)),
    name: `Vendor ${i}`,
  });
});

export const announcements = Array.from({ length: 20 }).map((_, i) => {
  return Announcement({
    title: `title-${i}`,
    content: `content-${i}`,
    createdAt: addDays(new Date("2024-07-25T00:00:00Z"), i),
  });
});

export const localMaps = Array.from({ length: 5 }).map((_, i) => {
  return LocalMap.default({
    organizationId,
    name:
      i % 2
        ? LocalMapName(`map-${i}`)
        : LocalMapName(
            `long long long long long long long long long long long long long long long long long long map-${i}`,
          ),
    memo:
      i % 2
        ? LocalMapMemo(`memo-${i}`)
        : LocalMapMemo(
            `long long long long long long long long long long long long long long long long long long memo-${i}`,
          ),
    hasImage: i % 2 === 0,
    x: Meter(i * 5),
    y: Meter(i % 2 === 0 ? 5 : 0),
    width: Meter(5),
    height: Meter(5),
    tagIds: [tags[0].id, tags[1].id],
  });
});

export const nodes = Array.from({ length: 100 }).map((_, i) => {
  return Node.random({
    organizationId,
    macAddress: Result.unwrap(MacAddress(i.toString(16).padStart(12, "0"))),
    backhaul: {
      channel: Channel(i + 100),
      frequency: Frequency(i * 40 + 5000),
      bandWidth: BandWidth(i % 2 === 0 ? 20 : 40),
      connection:
        i % 3 === 0
          ? {
              macAddress: Result.unwrap(
                MacAddress((i % 3).toString(16).padStart(12, "0")),
              ),
              rssi: DBm(-100 + i * 5),
              tx: {
                bytes: Bytes(8 ** (i % 9)),
                throughput: BitsPerSecond(10 ** (i % 6)),
              },
              rx: {
                bytes: Bytes(8 ** (i % 9)),
                throughput: BitsPerSecond(10 ** (i % 6)),
              },
              uptime: Milliseconds(10 * (i % 9)),
            }
          : undefined,
    },
    isOnline: i % 2 === 0,
    kind: i % 4 === 0 ? "branch" : "core",
    version: i % 2 === 0 ? undefined : FirmwareVersion(`1.0.${i}`),
    model: i % 2 === 0 ? undefined : NodeModels[i % NodeModels.length],
    uptime: i % 2 === 0 ? Milliseconds(10000000 * (i % 9)) : undefined,
    position:
      i % 3 === 0
        ? {
            localMapId: localMaps[i % 2].id,
            ...Point3D({ x: i / 10 + 0.2, y: i / 10 + 0.2 }),
          }
        : undefined,
    ap2g:
      i % 4 === 0
        ? {
            channel: Channel(i + 100),
            frequency: Frequency(i * 40 + 2400),
            bandWidth: BandWidth(i % 2 === 0 ? 20 : 40),
            accessPoints: [
              {
                bssid: MacAddress((i % 3).toString(16).padStart(12, "0")),
                ssid: SSID(
                  `2ghz-SSID ${i}` +
                    Array.from({ length: i }).map(() => "long"),
                ),
                rx: {
                  bytes: Bytes(8 ** (i % 9)),
                  throughput: BitsPerSecond(10 ** (i % 9)),
                },
                tx: {
                  bytes: Bytes(8 ** (i % 9)),
                  throughput: BitsPerSecond(10 ** (i % 9)),
                },
              },
            ],
          }
        : undefined,
    ap5g:
      i % 4 === 0
        ? {
            channel: Channel(i + 100),
            bandWidth: BandWidth(i % 2 === 0 ? 20 : 40),
            frequency: Frequency(i * 40 + 5000),
            accessPoints: [
              {
                bssid: MacAddress((i % 3).toString(16).padStart(12, "0")),
                ssid: SSID(
                  `5ghz-SSID ${i}` +
                    Array.from({ length: i }).map(() => "long"),
                ),
                rx: {
                  bytes: Bytes(8 ** (i % 9)),
                  throughput: BitsPerSecond(10 ** (i % 9)),
                },
                tx: {
                  bytes: Bytes(8 ** (i % 9)),
                  throughput: BitsPerSecond(10 ** (i % 9)),
                },
              },
            ],
          }
        : undefined,
    signals: [
      ...Array.from({ length: 5 }).map((_, i) => {
        return AccessPointSignal({
          bssid: MacAddress((i % 3).toString(16).padStart(12, "0")),
          ssid: SSID(`SSID ${i}`),
          rssi: DBm(-30 + i),
          bandWidth: BandWidth(i % 2 === 0 ? 20 : 40),
          frequency: Frequency(i * 40 + 5000),
          channel: Channel(i % 14),
        });
      }),
      ...[
        AccessPointSignal({
          bssid: MacAddress((3).toString(16).padStart(12, "0")),
          ssid: SSID(`\x00\x00\x00`),
          rssi: DBm(-60),
          bandWidth: BandWidth(40),
          frequency: Frequency(5200),
          channel: Channel(48),
        }),
      ],
    ],
  });
});

export const apClients = Array.from({ length: 100 }).map((_, i) => {
  return ApClient({
    macAddress: MacAddress((100 + i).toString(16).padStart(12, "0")),
    organizationId,
    occurredAt: addSeconds(range.from, i * 60 * 10),
    connection: {
      macAddress: nodes[i % 10].macAddress,
      rssi: [-30, -40, -50, -60, -70, -80, -90].map(DBm)[i % 7],
      bssid: nodes[i % 10].ap2g?.accessPoints?.[0]?.bssid,
      tx: {
        bytes: Bytes(8 ** (i % 9)),
        packets: Packets(6 ** (i % 9)),
        throughput: BitsPerSecond(10 ** (i % 9)),
        maxThroughput: BitsPerSecond(10 ** (i % 9)),
        dropped: Packets(i % 9),
      },
      rx: {
        bytes: Bytes(8 ** (i % 9)),
        packets: Packets(6 ** (i % 9)),
        dropped: Packets(i % 9),
        maxThroughput: BitsPerSecond(10 ** (i % 9)),
        retries: Packets(i % 9),
      },
      uptime: Milliseconds(10000000 * (i % 9)),
    },
  });
});

export const metrics = Array.from({ length: 24 }).flatMap((_, i) => {
  const occurredAt = addSeconds(range.from, i * 60 * 60);
  return [
    ...Array.from({ length: 10 }).map(() => {
      return Metric({
        name: `node/${nodes[0].macAddress}`,
        occurredAt,
        organizationId,
        value: {
          backhaul: {
            macAddress: nodes[i].macAddress,
            rssi: DBm(-30 + i),
            tx: {
              throughput: BitsPerSecond(10 ** (i % 6)),
              maxThroughput: BitsPerSecond(20 ** (i % 6)),
            },
            rx: {
              throughput: BitsPerSecond(10 ** (i % 6)),
              maxThroughput: BitsPerSecond(20 ** (i % 6)),
            },
          },
          ap2g: {
            tx: { throughput: BitsPerSecond(10 ** (i % 6)) },
            rx: { throughput: BitsPerSecond(10 ** (i % 6)) },
          },
          ap5g: {
            tx: { throughput: BitsPerSecond(10 ** (i % 6)) },
            rx: { throughput: BitsPerSecond(10 ** (i % 6)) },
          },
          apClient: {
            tx: { throughput: BitsPerSecond(10 ** (i % 6)) },
            rx: { throughput: BitsPerSecond(10 ** (i % 6)) },
            distribution: [Count(1), Count(2), Count(3), Count(4), Count(5)],
            count: Count(10),
          },
          pings: [
            {
              destination: "example.com",
              rtt: Milliseconds(10 * (i % 6)),
              packetLoss: Percentage((i % 10) / 10),
            },
            {
              destination: "example.org",
              rtt: Milliseconds(20 * (i % 6)),
              packetLoss: Percentage((i % 10) / 10),
            },
          ],
        },
      });
    }),
    Metric({
      organizationId,
      occurredAt,
      name: `local-map/${localMaps[0].id}/node/rssi-set`,
      value: nodes.flatMap((node) => {
        if (node.backhaul?.connection?.rssi) {
          return [
            {
              macAddress: node.macAddress,
              rssi: DBm(node.backhaul.connection.rssi - i),
            },
          ];
        }
        return [];
      }),
    }),
  ];
});

export const jobs: Job[] = [
  Job.default({
    organizationId,
    execution: {
      status: "pending",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
    },
    trigger: {
      kind: "recurring",
      recurringSchedule: RecurringSchedule({
        hours: Hours(0),
        minutes: Minutes(0),
      }),
    },
    kind: "RestartNodes",
    input: {
      macAddresses: nodes.slice(0, 1).map((node) => node.macAddress),
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "pending",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
    },
    trigger: {
      kind: "scheduled",
      scheduledAt: new Date("2021-01-02T00:00:00Z"),
    },
    kind: "RestartNodes",
    input: {
      macAddresses: nodes.slice(0, 1).map((node) => node.macAddress),
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "pending",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
    },
    kind: "RestartNodes",
    input: {
      macAddresses: nodes.slice(0, 10).map((node) => node.macAddress),
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "pending",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
    },
    kind: "RerouteNodes",
    input: {
      macAddresses: nodes.slice(0, 10).map((node) => node.macAddress),
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "in-progress",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
      startedAt: new Date("2021-01-02T00:00:00Z"),
    },
    kind: "UpdateFirmware",
    input: {
      macAddress: nodes[0].macAddress,
      id: FirmwareId("firmware-id"),
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "in-progress",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
      startedAt: new Date("2021-01-02T00:00:00Z"),
    },
    kind: "RestartNodes",
    input: {
      macAddresses: [nodes[0].macAddress],
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "done",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
      startedAt: new Date("2021-01-02T00:00:00Z"),
      endedAt: new Date("2021-01-03T00:00:00Z"),
      elapsed: 100,
    },
    kind: "RestartNodes",
    input: {
      macAddresses: [nodes[0].macAddress],
      organizationId,
    },
  }),
  Job.default({
    organizationId,
    execution: {
      status: "failed",
      queuedAt: new Date("2021-01-01T00:00:00Z"),
      startedAt: new Date("2021-01-02T00:00:00Z"),
      endedAt: new Date("2021-01-03T00:00:00Z"),
      elapsed: 100,
    },
    kind: "RestartNodes",
    input: {
      macAddresses: [nodes[0].macAddress],
      organizationId,
    },
  }),
];

export const nodeConfigs = NodeModels.map((model, i) => {
  return NodeConfig.merge(NodeConfig.default(), {
    macAddress: nodes[i].macAddress,
    system: {
      model,
    },
  });
});
export const nodeConfig = nodeConfigs[0];

export const firmwares = Array.from({ length: 20 }).map((_, i) => {
  return Firmware.default({
    pkg: FirmwarePackage("pkg1"),
    model: NodeModel("PCWL-0500"),
    version: FirmwareVersion(`1.0.${i}`),
    checksum: Checksum("checksum"),
    fileName: `firmware-${i}.tar.gz`,
    isPublished: i % 2 === 0,
  });
});

export const sites = Array.from({ length: 10 }).map((_, i) => {
  return Site.default({
    organizationId,
    name: SiteName(
      `Site ${i}` +
        Array.from({ length: i })
          .map(() => "long")
          .join(" "),
    ),
    memo: SiteMemo(
      `Memo ${i}` +
        Array.from({ length: i })
          .map(() => "long")
          .join(" "),
    ),
  });
});
export const notificationConfigs = Array.from({ length: 10 }).map((_, i) => {
  return NotificationConfig.default({
    organizationId,
    enabled: i % 2 === 0,
    userId: users[i].id,
    siteId: i % 2 === 0 ? sites[sites.length - 1 - i].id : undefined,
    mutedMacAddresses: new Set([nodes[0].macAddress]),
  });
});

export const nodeEvents = Array.from({ length: 30 }).map((_, i) => {
  return NodeEvent({
    macAddress: nodes[0].macAddress,
    organizationId,
    category: i % 2 ? "Syslog" : "System",
    kind: i % 2 ? "NORMAL_REBOOT" : "HealSwitch",
    message:
      i % 2
        ? `Normal reboot ${i}`
        : Array.from({ length: i })
            .map(() => "long message")
            .join(" "),
    occurredAt: addSeconds(range.from, i * 60 * 10),
  });
});

const actionLogs = Array.from({ length: 30 }).map((_, x) => {
  if (x % 2 === 0) {
    return ActionLog({
      organizationId,
      userId: users[x % 10].id,
      kind: "CreateOrganization",
      input: {
        kind: "Customer",
        name: OrganizationName(`Organization ${x + 1}`),
        organizationId,
      },
      startAt: new Date(`2021-01-${String(x + 1).padStart(2, "0")}T00:00:00Z`),
      endAt: new Date(`2021-01-${String(x + 1).padStart(2, "0")}T00:00:00Z`),
      status: (["Done", "Failed"] as const)[x % 2],
    });
  }
  return ActionLog({
    organizationId,
    userId: users[x % 10].id,
    kind: "MeasureInternetThroughput",
    input: {
      organizationId,
      macAddress: nodes[x % 10].macAddress,
    },
    startAt: new Date(`2021-01-${String(x + 1).padStart(2, "0")}T00:00:00Z`),
    endAt: new Date(`2021-01-${String(x + 1).padStart(2, "0")}T00:00:00Z`),
    status: (["Done", "Failed"] as const)[x % 2],
  });
});

export const alerts = [
  ...Array.from({ length: 2 }).map((_, i) => {
    return Alert({
      organizationId,
      kind: "RttExceeded",
      details: {
        macAddress: nodes[0].macAddress,
        value: Milliseconds(100),
        threshold: Milliseconds(200),
      },
      occurredAt: addSeconds(range.from, i),
    });
  }),
  ...Array.from({ length: 2 }).map((_, i) => {
    return Alert({
      organizationId,
      kind: "RssiExceeded",
      details: {
        macAddress: nodes[0].macAddress,
        value: DBm(-50),
        threshold: DBm(-60),
      },
      occurredAt: addSeconds(range.from, i),
    });
  }),
  ...Array.from({ length: 2 }).map((_, i) => {
    return Alert({
      organizationId,
      kind: "ApClientCountExceeded",
      details: {
        macAddress: nodes[0].macAddress,
        value: Count(70),
        threshold: Count(60),
      },
      occurredAt: addSeconds(range.from, i),
    });
  }),
];

export const recurringSchedules = [
  RecurringSchedule.default({
    hours: Hours(0),
    minutes: Minutes(0),
  }),
  RecurringSchedule.default({
    hours: Hours(1),
    minutes: Minutes(2),
    dayOfWeek: DayOfWeek(3),
  }),
];
export const recurringSchedule = recurringSchedules[0];

// --- Mock API ---
export const replace = () => {
  client.filterDevices = async (x) => {
    action("FilterDevices")(x);
    return devices;
  };
  client.filterLocalMaps = async (x) => {
    action("FilterLocalMaps")(x);
    return localMaps;
  };
  client.filterLicenses = async (x) => {
    action("FilterLicenses")(x);
    return licenses;
  };
  client.filterVendors = async (x) => {
    action("FilterVendors")(x);
    return vendors;
  };
  client.filterJobs = async (x) => {
    action("FilterJobs")(x);
    return jobs;
  };
  client.filterNodes = async (x) => {
    action("FilterNodes")(x);
    return nodes;
  };
  client.filterTags = async (x) => {
    action("FilterTags")(x);
    return tags;
  };
  client.findOrganization = async () => {
    action("FindOrganization")();
    return organization;
  };
  client.filterAnnouncements = async (x) => {
    action("FilterAnnouncements")(x);
    return announcements;
  };

  client.filterAlerts = async (x) => {
    action("FilterAlerts")(x);
    return alerts;
  };

  client.saveDevices = async (x) => {
    await sleep(1000);
    action("SaveDevices")(x);
  };
  client.saveLocalMap = async (x) => {
    action("SaveLocalMap")(x);
    await sleep(1000);
    return localMaps[0];
  };
  client.relocateLocalMap = async (x) => action("RelocateLocalMap")(x);
  client.deleteLocalMap = async (x) => action("DeleteLocalMap")(x);
  client.rerouteNode = async (x) => action("RerouteNode")(x);
  client.createNodes = async (x) => {
    action("CreateNodes")(x);
    return {
      added: 1,
      skipped: 0,
    };
  };

  client.createJob = async (x) => {
    await sleep(1000);
    action("CreateJob")(x);
    return jobs[0];
  };
  client.deleteNodes = async (x) => action("DeleteNodes")(x);
  client.saveTag = async (x) => {
    action("SaveTag")(x);
    return tags[0];
  };
  client.deleteTag = async (x) => action("DeleteTag")(x);
  client.updateOrganization = async (x) => {
    action("UpdateOrganization")(x);
    return organization;
  };
  client.relocateNodes = async (x) => action("RelocateNodes")(x);
  client.saveAnnouncement = async (x) => {
    action("SaveAnnouncement")(x);
    await sleep(1000);
  };
  client.deleteAnnouncement = async (x) => action("DeleteAnnouncement")(x);
  client.saveNotificationConfig = async (x) =>
    action("SaveNotificationConfig")(x);
  client.deleteNotificationConfig = async (x) =>
    action("DeleteNotificationConfig")(x);
  client.saveNodeConfig = async (x) => {
    action("SaveNodeConfig")(x);
    await sleep(1000);
  };
  client.saveFirmware = async (x) => {
    action("SaveFirmware")(x);
    return firmwares[0];
  };
  client.saveUser = async (x) => action("SaveUser")(x);
  client.saveSite = async (x) => action("SaveSite")(x);

  client.filterApClients = async (x) => {
    action("FilterApClients")(x);
    return apClients;
  };
  client.filterNotificationConfigs = async (x) => {
    action("FilterNotificationConfigs")(x);
    return notificationConfigs;
  };
  client.filterUsers = async (x) => {
    action("FilterUsers")(x);
    return users;
  };
  client.filterSites = async (x) => {
    action("FilterSites")(x);
    return sites;
  };
  client.findLocalMapImage = async (x) => {
    action("FindLocalMapImage")(x);
    if (x.id === localMaps[0].id) {
      const res = await fetch(map5m.src);
      const arrayBuffer = await res.arrayBuffer();
      return Webp(Buffer.from(arrayBuffer));
    }
    if (x.id === localMaps[2].id) {
      const res = await fetch(map10m.src);
      const arrayBuffer = await res.arrayBuffer();
      return Webp(Buffer.from(arrayBuffer));
    }
  };
  client.filterMetrics = async (x) => {
    action("FilterMetrics")(x);
    return metrics.filter((metric) => {
      return x.names.includes(metric.name);
    });
  };
  client.filterActionLogs = async (x) => {
    action("FilterActionLogs")(x);
    return actionLogs;
  };

  client.findNodeConfig = async (x) => {
    action("FindNodeConfig")(x);
    const nodeConfig = nodeConfigs.find((nc) => nc.macAddress === x.macAddress);
    if (!nodeConfig) {
      throw Err({
        name: ErrorName.NotFound,
      });
    }
    return nodeConfig;
  };

  client.filterNodeEvents = async (x) => {
    action("FilterNodeEvents")(x);
    return nodeEvents;
  };

  client.filterFirmwares = async (x) => {
    action("FilterFirmwares")(x);
    return firmwares;
  };
  client.findCaller = async () => {
    action("FindCaller")();
    return caller;
  };
  client.filterOrganizations = async (x) => {
    action("FilterOrganizations")(x);
    return organizations;
  };
  client.createLicense = async (x) => {
    action("CreateLicense")(x);
    return license;
  };

  client.receiveLicense = async (x) => {
    action("ReceiveLicense")(x);
    return license;
  };

  client.createOrganization = async (x) => {
    action("CreateOrganization")(x);
    return organization;
  };

  client.measureInternetThroughput = async (x) => {
    action("MeasureInternetThroughput")(x);
    await sleep(1000);
    return {
      macAddress: x.macAddress,
      tx: BitsPerSecond(1000000),
      rx: BitsPerSecond(2000000),
      ping: Milliseconds(100),
    };
  };
  client.setAlertConfigs = async (x) => {
    action("SetAlertConfigs")(x);
    await sleep(1000);
    return localMaps[0];
  };
  client.measureNodeThroughput = async (x) => {
    action("MeasureNodeThroughput")(x);
    await sleep(3000);
    return {
      server: x.server,
      client: x.client,
      tx: BitsPerSecond(1000000),
      rx: BitsPerSecond(2000000),
    };
  };
};

mutate("search", {
  cursor: new Date("2021-01-02"),
  isLatest: true,
  range,
});

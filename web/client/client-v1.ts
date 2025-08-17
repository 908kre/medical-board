import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { Result } from "@md/core/result";
import { MetricsTuples } from "@md/core-api/dto/metrics-tuple";
import superjson from "superjson";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@md/core-api/trpc";
import { VendorTuples } from "@md/core-api/dto/vendor-tuple";

superjson.registerCustom<Buffer, string>(
  {
    isApplicable: (value): value is Buffer => value instanceof Buffer,
    serialize: (value) => value.toString("base64"),
    deserialize: (value) => Buffer.from(value, "base64"),
  },
  "Buffer",
);

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const CoreApiClient = () => {
  const client: {
    trpc?: ReturnType<typeof createTRPCProxyClient<AppRouter>>;
    publicTrpc: ReturnType<typeof createTRPCProxyClient<AppRouter>>;
  } = {
    trpc: undefined,
    publicTrpc: createTRPCProxyClient<AppRouter>({
      links: [
        httpLink({
          url: "/api/proxy",
          transformer: superjson,
        }),
      ],
    }),
  };
  const setAccessToken = (accessToken?: string) => {
    if (!accessToken) {
      client.trpc = undefined;
      return;
    }
    client.trpc = createTRPCProxyClient<AppRouter>({
      links: [
        httpLink({
          url: "/api/proxy",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          transformer: superjson,
        }),
      ],
    });
  };

  const saveFirmware = async (args: {
    version: string;
    model: string;
    pkg: string;
    isPublished: boolean;
    file: File | undefined;
    id?: string;
    onProgress?: (progress: number) => void;
  }) => {
    const fd = new FormData();
    fd.set(
      "payload",
      JSON.stringify(
        superjson.serialize({
          version: args.version,
          model: args.model,
          pkg: args.pkg,
          isPublished: args.isPublished,
          id: args.id,
        }),
      ),
    );
    if (args.file) {
      fd.set("file", args.file);
    }
    const result = await client.trpc?.firmware.save.mutate(fd);
    args.onProgress?.(100);
    return result;
  };

  const hasAccessToken = () => {
    return !!client.trpc;
  };

  // read
  const filterLicenses = async (args: RouterInput["license"]["filter"]) => {
    return (await client.trpc?.license.filter.query(args)) ?? [];
  };
  const filterDevices = async (args: RouterInput["device"]["filter"]) => {
    return (await client.trpc?.device.filter.query(args)) ?? [];
  };
  const filterLocalMaps = async (args: RouterInput["localMap"]["filter"]) => {
    return (await client.trpc?.localMap.filter.query(args)) ?? [];
  };
  const filterVendors = async (args: RouterInput["vendor"]["filter"]) => {
    const tuples = (await client.trpc?.vendor.filter.query(args)) ?? [];
    if (Result.isErr(tuples)) {
      return tuples;
    }
    return VendorTuples.toVendors(tuples);
  };
  const filterJobs = async (args: RouterInput["job"]["filter"]) => {
    return (await client.trpc?.job.filter.query(args)) ?? [];
  };
  const filterNodes = async (args: RouterInput["node"]["filter"]) => {
    return (await client.trpc?.node.filter.query(args)) ?? [];
  };
  const findNodeConfig = async (args: RouterInput["nodeConfig"]["find"]) => {
    return await client.trpc?.nodeConfig.find.query(args);
  };

  const findUser = async (args: RouterInput["user"]["find"]) => {
    return await client.trpc?.user.find.query(args);
  };

  const filterApClients = async (args: RouterInput["apClient"]["filter"]) => {
    return (await client.trpc?.apClient.filter.query(args)) ?? [];
  };
  const filterTags = async (args: RouterInput["tag"]["filter"]) => {
    return (await client.trpc?.tag.filter.query(args)) ?? [];
  };
  const findOrganization = async (
    args: RouterInput["organization"]["find"],
  ) => {
    return await client.trpc?.organization.find.query(args);
  };
  const findCaller = async (args: RouterInput["findCaller"]) => {
    return await client.trpc?.findCaller.query(args);
  };
  const findLocalMapImage = async (
    args: RouterInput["localMap"]["findImage"],
  ) => {
    const image = await client.trpc?.localMap.findImage.query(args);
    if (!image) {
      return;
    }
    if (Result.isErr(image)) {
      return image;
    }
    return image;
  };

  const filterMetrics = async (args: RouterInput["metric"]["filter"]) => {
    if (!client.trpc) {
      return [];
    }
    const tuples = await client.trpc.metric.filter.query(args);
    if (Result.isErr(tuples)) {
      return tuples;
    }
    return MetricsTuples.toMetrics(tuples);
  };
  const filterNodeEvents = async (args: RouterInput["nodeEvent"]["filter"]) => {
    return await client.trpc?.nodeEvent.filter.query(args);
  };

  const filterAnnouncements = async (
    args: RouterInput["announcement"]["filter"],
  ) => {
    return (await client.trpc?.announcement.filter.query(args)) ?? [];
  };

  const filterNotificationConfigs = async (
    args: RouterInput["notificationConfig"]["filter"],
  ) => {
    return (await client.trpc?.notificationConfig.filter.query(args)) ?? [];
  };
  const filterUsers = async (args: RouterInput["user"]["filter"]) => {
    return (await client.trpc?.user.filter.query(args)) ?? [];
  };
  const filterSites = async (args: RouterInput["site"]["filter"]) => {
    return (await client.trpc?.site.filter.query(args)) ?? [];
  };
  const filterActionLogs = async (args: RouterInput["actionLog"]["filter"]) => {
    return await client.trpc?.actionLog.filter.query(args);
  };
  const filterFirmwares = async (args: RouterInput["firmware"]["filter"]) => {
    return await client.trpc?.firmware.filter.query(args);
  };
  const filterOrganizations = async (
    args: RouterInput["organization"]["filter"],
  ) => {
    return await client.trpc?.organization.filter.query(args);
  };
  const findLatestTermsOfUse = async (
    args: RouterInput["findLatestTermsOfUse"],
  ) => {
    return await client.trpc?.findLatestTermsOfUse.query(args);
  };

  // write
  const saveDevices = async (args: RouterInput["device"]["save"]) => {
    await client.trpc?.device.save.mutate(args);
  };
  const saveLocalMap = async (args: RouterInput["localMap"]["save"]) => {
    return await client.trpc?.localMap.save.mutate(args);
  };
  const relocateLocalMap = async (
    args: RouterInput["localMap"]["relocate"],
  ) => {
    await client.trpc?.localMap.relocate.mutate(args);
  };
  const deleteLocalMap = async (args: RouterInput["localMap"]["delete"]) => {
    await client.trpc?.localMap.delete.mutate(args);
  };
  const cancelJob = async (args: RouterInput["job"]["cancel"]) => {
    await client.trpc?.job.cancel.mutate(args);
  };
  const rerouteNode = async (args: RouterInput["node"]["reroute"]) => {
    await client.trpc?.node.reroute.mutate(args);
  };
  const deleteNodes = async (args: RouterInput["node"]["delete"]) => {
    await client.trpc?.node.delete.mutate(args);
  };
  const deleteNodesPosition = async (
    args: RouterInput["node"]["deletePositions"],
  ) => {
    await client.trpc?.node.deletePositions.mutate(args);
  };
  const createNodes = async (args: RouterInput["node"]["create"]) => {
    return await client.trpc?.node.create.mutate(args);
  };
  const saveNodeConfig = async (args: RouterInput["nodeConfig"]["update"]) => {
    await client.trpc?.nodeConfig.update.mutate(args);
  };
  const deleteTag = async (args: RouterInput["tag"]["delete"]) => {
    return await client.trpc?.tag.delete.mutate(args);
  };
  const saveTag = async (args: RouterInput["tag"]["save"]) => {
    return await client.trpc?.tag.save.mutate(args);
  };
  const relocateNodes = async (args: RouterInput["node"]["relocates"]) => {
    await client.trpc?.node.relocates.mutate(args);
  };
  const saveAnnouncement = async (
    args: RouterInput["announcement"]["save"],
  ) => {
    await client.trpc?.announcement.save.mutate(args);
  };
  const deleteAnnouncement = async (
    args: RouterInput["announcement"]["delete"],
  ) => {
    await client.trpc?.announcement.delete.mutate(args);
  };
  const saveNotificationConfig = async (
    args: RouterInput["notificationConfig"]["save"],
  ) => {
    await client.trpc?.notificationConfig.save.mutate(args);
  };
  const deleteNotificationConfig = async (
    args: RouterInput["notificationConfig"]["delete"],
  ) => {
    await client.trpc?.notificationConfig.delete.mutate(args);
  };
  const saveUser = async (args: RouterInput["user"]["update"]) => {
    await client.trpc?.user.update.mutate(args);
  };
  const deleteUser = async (args: RouterInput["user"]["delete"]) => {
    await client.trpc?.user.delete.mutate(args);
  };
  const deleteSite = async (args: RouterInput["site"]["delete"]) => {
    await client.trpc?.site.delete.mutate(args);
  };
  const saveSite = async (args: RouterInput["site"]["save"]) => {
    await client.trpc?.site.save.mutate(args);
  };
  const useLicense = async (args: RouterInput["license"]["use"]) => {
    return await client.trpc?.license.use.mutate(args);
  };
  const deleteLicense = async (args: RouterInput["license"]["delete"]) => {
    return await client.trpc?.license.delete.mutate(args);
  };
  const cancelSendingLicense = async (
    args: RouterInput["license"]["cancelSending"],
  ) => {
    return await client.trpc?.license.cancelSending.mutate(args);
  };
  const createLicense = async (args: RouterInput["license"]["create"]) => {
    return await client.trpc?.license.create.mutate(args);
  };
  const updateLicense = async (args: RouterInput["license"]["update"]) => {
    return await client.trpc?.license.update.mutate(args);
  };
  const syncNodeSignals = async (args: RouterInput["node"]["syncSignals"]) => {
    return await client.trpc?.node.syncSignals.mutate(args);
  };
  const updateOrganization = async (
    args: RouterInput["organization"]["update"],
  ) => {
    return await client.trpc?.organization.update.mutate(args);
  };
  const setupOrganization = async (
    args: RouterInput["organization"]["setup"],
  ) => {
    return await client.trpc?.organization.setup.mutate(args);
  };
  const invite = async (args: RouterInput["invite"]) => {
    return await client.trpc?.invite.mutate(args);
  };
  const deleteFirmware = async (args: RouterInput["firmware"]["delete"]) => {
    return await client.trpc?.firmware.delete.mutate(args);
  };
  const receiveLicense = async (args: RouterInput["license"]["receive"]) => {
    return await client.trpc?.license.receive.mutate(args);
  };
  const syncNodeEvents = async (args: RouterInput["nodeEvent"]["sync"]) => {
    await client.trpc?.nodeEvent.sync.mutate(args);
  };
  const createOrganization = async (
    args: RouterInput["organization"]["create"],
  ) => {
    return await client.trpc?.organization.create.mutate(args);
  };
  const measureNodeThroughput = async (
    args: RouterInput["node"]["measureNodeThroughput"],
  ) => {
    return await client.trpc?.node.measureNodeThroughput.mutate(args);
  };
  const measureInternetThroughput = async (
    args: RouterInput["node"]["measureInternetThroughput"],
  ) => {
    return await client.trpc?.node.measureInternetThroughput.mutate(args);
  };

  const createJob = async (args: RouterInput["job"]["create"]) => {
    return await client.trpc?.job.create.mutate(args);
  };

  const findJob = async (args: RouterInput["job"]["find"]) => {
    return await client.trpc?.job.find.query(args);
  };
  const setTopics = async (args: RouterInput["organization"]["setTopics"]) => {
    return await client.trpc?.organization.setTopics.mutate(args);
  };
  const setOfflineDetectionTime = async (
    args: RouterInput["organization"]["setOfflineDetectionTime"],
  ) => {
    return await client.trpc?.organization.setOfflineDetectionTime.mutate(args);
  };
  const setFirmwarePackages = async (
    args: RouterInput["organization"]["setFirmwarePackages"],
  ) => {
    return await client.trpc?.organization.setFirmwarePackages.mutate(args);
  };
  const sendLicense = async (args: RouterInput["license"]["send"]) => {
    return await client.trpc?.license.send.mutate(args);
  };
  const updateSelfUser = async (args: RouterInput["user"]["updateSelf"]) => {
    return await client.trpc?.user.updateSelf.mutate(args);
  };
  const filterAlerts = async (args: RouterInput["alert"]["filter"]) => {
    return await client.trpc?.alert.filter.query(args);
  };
  const setAlertConfigs = async (
    args: RouterInput["localMap"]["setAlertConfigs"],
  ) => {
    return await client.trpc?.localMap.setAlertConfigs.mutate(args);
  };

  // public endpoint
  const createAdminUser = async (args: RouterInput["createAdminUser"]) => {
    return await client.publicTrpc.createAdminUser.mutate(args);
  };
  const isDuplicatedOrganizationName = async (
    args: RouterInput["organization"]["isDuplicatedName"],
  ) => {
    return await client.publicTrpc.organization.isDuplicatedName.query(args);
  };
  return {
    cancelJob,
    setAccessToken,
    filterDevices,
    filterLocalMaps,
    filterVendors,
    filterJobs,
    filterNodes,
    findNodeConfig,
    filterApClients,
    filterTags,
    filterAnnouncements,
    filterUsers,
    filterNotificationConfigs,
    filterSites,
    filterActionLogs,
    filterFirmwares,
    filterOrganizations,
    findOrganization,
    findCaller,
    filterMetrics,
    filterNodeEvents,
    filterLicenses,
    findLocalMapImage,
    findLatestTermsOfUse,
    findUser,
    saveFirmware,
    saveDevices,
    saveLocalMap,
    relocateLocalMap,
    deleteLocalMap,
    rerouteNode,
    deleteNodes,
    createNodes,
    saveNodeConfig,
    updateOrganization,
    setupOrganization,
    deleteTag,
    saveTag,
    relocateNodes,
    deleteNodesPosition,
    saveAnnouncement,
    deleteAnnouncement,
    saveNotificationConfig,
    deleteNotificationConfig,
    hasAccessToken,
    saveUser,
    updateSelfUser,
    deleteUser,
    deleteSite,
    syncNodeSignals,
    saveSite,
    useLicense,
    deleteLicense,
    cancelSendingLicense,
    createLicense,
    updateLicense,
    receiveLicense,
    invite,
    deleteFirmware,
    syncNodeEvents,
    createAdminUser,
    createOrganization,
    measureNodeThroughput,
    measureInternetThroughput,
    createJob,
    findJob,
    setTopics,
    setFirmwarePackages,
    setOfflineDetectionTime,
    sendLicense,
    filterAlerts,
    setAlertConfigs,
    isDuplicatedOrganizationName,
  };
};
export type CoreApiClient = ReturnType<typeof CoreApiClient>;
export const client = CoreApiClient();

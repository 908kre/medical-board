import { Result } from "@md/core/result";
import { BitsPerSecond } from "@md/core/domain/bits-per-second";
import { Checksum } from "@md/core/domain/checksum";
import { MacAddress } from "@md/core/domain/mac-address";
import { Milliseconds } from "@md/core/domain/milliseconds";
import { Message } from "@md/core/domain/message";
import { FirmwareId } from "@md/core/domain/firmware-id";
export type NodeController = {
  restart: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  reroute: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  startMonitoring: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  stopMonitoring: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  waitForOnline: (args: {
    macAddress: MacAddress;
    timeout?: Milliseconds;
  }) => Promise<Result<void>>;
  waitForOffline: (args: {
    macAddress: MacAddress;
    timeout?: Milliseconds;
  }) => Promise<Result<void>>;
  updateFirmware: (args: {
    id: FirmwareId;
    macAddress: MacAddress;
    checksum: Checksum;
  }) => Promise<Result<void>>;
  measureNodeThroughput: (args: {
    client: MacAddress;
    server: MacAddress;
  }) => Promise<
    Result<{
      tx: BitsPerSecond;
      rx: BitsPerSecond;
    }>
  >;
  startAp: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  stopAp: (args: { macAddress: MacAddress }) => Promise<Result<void>>;
  measureInternetThroughput: (args: { macAddress: MacAddress }) => Promise<
    Result<{
      tx: BitsPerSecond;
      rx: BitsPerSecond;
      ping: Milliseconds;
    }>
  >;
  apScan: (args: {
    macAddress: MacAddress;
  }) => Promise<Result<Message & { kind: "monitor" }>>;
  getEvents: (args: {
    macAddress: MacAddress;
  }) => Promise<Result<Message & { kind: "node-event" }>>;
};

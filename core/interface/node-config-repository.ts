import { NodeConfig } from "@md/core/domain/node-config";
import { MacAddress } from "@md/core/domain/mac-address";
import { Result } from "@md/core/result";

export type NodeConfigRepository = {
  find: (args: { macAddress: MacAddress }) => Promise<Result<NodeConfig>>;
  update: (args: NodeConfig) => Promise<Result<NodeConfig>>;
};

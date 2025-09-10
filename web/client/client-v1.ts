import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { Result } from "@md/core/result";
import type { AppRouter } from "@md/api/trpc";

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

  const mock = async (args: RouterInput["mock"]["find"]) => {
    return ;
  };


  return {
    mock,
  };
};
export type CoreApiClient = ReturnType<typeof CoreApiClient>;
export const client = CoreApiClient();

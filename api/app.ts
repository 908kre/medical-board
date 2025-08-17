import { TrpcOptions } from "./trpc";
import { IdentityProvider } from "@md/core/interface/identity-provider";
import { UserRepository } from "@md/core/interface/user-repository";
import { Infrastructure } from "@md/infrastructure";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

export const App = (props?: {
  identityProvider?: IdentityProvider;
  userRepository?: UserRepository;
}) => {
  const infrastructure = Infrastructure(props);
  const { router, createContext } = TrpcOptions(infrastructure);
  return createHTTPServer({
    router,
    createContext,
  });
};

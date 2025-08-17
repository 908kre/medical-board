import { IdentityProvider } from "@md/core/interface/identity-provider";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { mapError } from "./error";
import { Result } from "@md/core/result";

export const CreateContext = (props: {
  identityProvider: Pick<IdentityProvider, "verify">;
}) => {
  return async ({ req }: CreateHTTPContextOptions) => {
    const { headers } = req;
    const { authorization } = headers;
    if (!authorization) {
      // for public api
      return {};
    }
    const accessToken = authorization.replace("Bearer ", "");
    const account = await props.identityProvider.verify({ accessToken });
    if (Result.isErr(account)) throw mapError(account);
    return {
      account,
    };
  };
};

export type Context = Awaited<ReturnType<ReturnType<typeof CreateContext>>>;

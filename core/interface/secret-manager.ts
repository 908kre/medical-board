import { Result } from "@md/core/result";

export type SecretManager = {
  find: (args: { secretName: string }) => Promise<Result<string>>;
};

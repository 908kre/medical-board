import { TRPCError } from "@trpc/server";
import { ErrorName } from "@md/core/domain/error";

export const mapError = (err: Error) => {
  const code = (() => {
    if (err.name === ErrorName.Unauthorized) {
      return "UNAUTHORIZED";
    }
    if (err.name === ErrorName.NotFound) {
      return "NOT_FOUND";
    }
    if (err.name === ErrorName.AlreadyExists) {
      return "BAD_REQUEST";
    }
    if (err.name === ErrorName.InvalidArgument) {
      return "BAD_REQUEST";
    }
    if (err.name === ErrorName.Forbidden) {
      return "FORBIDDEN";
    }
    if (err.name === ErrorName.BelowSafetyMargin) {
      return "BAD_REQUEST";
    }
    return "INTERNAL_SERVER_ERROR";
  })();
  return new TRPCError({
    code,
    cause: err,
  });
};

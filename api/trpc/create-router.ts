import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import { Err, ErrorName } from "@md/core/domain/error";

superjson.registerCustom<Buffer, string>(
  {
    isApplicable: (value): value is Buffer => value instanceof Buffer,
    serialize: (value) => value.toString("base64"),
    deserialize: (value) => Buffer.from(value, "base64"),
  },
  "Buffer",
);

export const Router = () => {
  const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter: ({ error, shape }) => {
      return {
        ...shape,
        data: {
          ...shape.data,
          name: error.cause?.name,
          message: error.cause?.message,
        },
      };
    },
  });
  const withAuth = t.procedure.use(async (opts) => {
    const { ctx, next } = opts;
    const { account } = ctx;
    if (!account) throw Err({ name: ErrorName.Unauthorized });
    return next({
      ctx: {
        userId: account.id,
      },
    });
  });
  return {
    ...t,
    withAuth,
  };
};
export type Router = ReturnType<typeof Router>;

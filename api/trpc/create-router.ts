import { initTRPC } from "@trpc/server";
import { Err, ErrorName } from "@md/core/error";
import superjson from "superjson";

superjson.registerCustom<Buffer, string>(
  { isApplicable: (value): value is Buffer => value instanceof Buffer,
    serialize: (value) => value.toString("base64"),
    deserialize: (value) => Buffer.from(value, "base64"),
  },
  "Buffer",
);

export const Router = () => {
  const t = initTRPC.context().create({
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
  });
  return {
    ...t,
    withAuth,
  };
};
export type Router = ReturnType<typeof Router>;


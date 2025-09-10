import { z } from "zod";
import { Router } from "./create-router";

export const TrpcOptions = (props: Infrastructure) => {
  const t = Router();
  const { withAuth } = t;
  const router = t.router({
  });

  return { router, createContext };
};

export type AppRouter = ReturnType<typeof TrpcOptions>["router"];

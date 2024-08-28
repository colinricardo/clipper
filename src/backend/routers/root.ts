
import { createCallerFactory, createTRPCRouter } from "@/backend/routers/trpc";
import { userRouter } from "@/backend/routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

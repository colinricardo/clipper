import { createTRPCRouter, privateProcedure } from "@/backend/routers/trpc";

export const userRouter = createTRPCRouter({
  current: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return { user };
  }),
});

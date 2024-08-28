/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

// import { db } from "@/backend/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    // db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// For server-side callers.
export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

// Middleware for authentication.
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { userId } = { userId: null };

  // if (!userId) {
  // throw new TRPCError({ code: "UNAUTHORIZED" });
  // }

  const user = null;

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

// Middleware for admin authorization.
// NOTE: in future we probably want to use user roles or something here.
const isAdmin = t.middleware(async ({ ctx, next }) => {
  const { userId } = { userId: null };

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = null;

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const privateProcedure = t.procedure.use(isAuthenticated);

export const adminProcedure = t.procedure.use(isAdmin);

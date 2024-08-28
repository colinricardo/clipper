import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@/backend/routers/root";
import { createTRPCContext } from "@/backend/routers/trpc";
import { errorHandler } from "@/backend/services/error";
import { correlationIdBinder, store } from "@/backend/services/store";
import { CustomNextApiHandler } from "@/backend/types";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const routeWrapper = (route: CustomNextApiHandler): CustomNextApiHandler => {
  return correlationIdBinder(store)(errorHandler(route));
};

// @ts-ignore
const handler = routeWrapper((req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
});

export { handler as GET, handler as POST };

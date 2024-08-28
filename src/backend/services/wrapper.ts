import { errorHandler } from "@/backend/services/error";
import { correlationIdBinder, store } from "@/backend/services/store";
import { CustomNextApiHandler } from "@/backend/types";

export const routeWrapper = (
  route: CustomNextApiHandler
): CustomNextApiHandler => {
  return correlationIdBinder(store)(errorHandler(route));
};

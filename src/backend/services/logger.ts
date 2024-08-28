import { GIT_COMMIT_SHA, LOGTAIL_TOKEN, isProduction } from "@/backend/config";
import { getFromStore } from "@/backend/services/store";
import { Logtail } from "@logtail/node";
import { Context } from "@logtail/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { HttpError } from "http-errors";

const token = LOGTAIL_TOKEN!;

const logger = new Logtail(token, {
  sendLogsToConsoleOutput: !isProduction,
  sendLogsToBetterStack: isProduction,
});

const commit = GIT_COMMIT_SHA?.slice(0, 7);

const stringifyError = (err: any) => {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  } else {
    return err;
  }
};

export const log = (s: string, extra?: object) => {
  const ctx = getFromStore("context");
  const { correlationId, userId } = ctx;
  const context = {
    context: {
      correlationId,
      userId,
      commit,
      source: "api",
    },
    extra: {
      ...extra,
    },
  };

  logger.info(s, context as Context);
};

export const logError = (
  s: string,
  err?: Error | null | unknown,
  extra?: object
) => {
  const ctx = getFromStore("context");
  const { correlationId, userId } = ctx;
  const context = {
    context: {
      ...extra,
      correlationId,
      userId,
      commit,
      source: "api",
    },
    extra: {
      ...extra,
    },
  };

  if (err) {
    const errString = stringifyError(err);
    // @ts-ignore
    context.error = errString;
  }

  logger.error(`Error: ${s}`, context as Context);
};

export const logWarning = (
  s: string,
  err?: Error | null | unknown,
  extra?: object
) => {
  const ctx = getFromStore("context");
  const { correlationId, userId } = ctx;
  const context = {
    context: {
      ...extra,
      correlationId,
      userId,
      commit,
      source: "api",
    },
    extra: {
      ...extra,
    },
  };

  if (err) {
    const errString = stringifyError(err);
    // @ts-ignore
    context.error = errString;
  }

  logger.warn(`Warning: ${s}`, context as Context);
};

export const functionLogger = <ArgType extends object | undefined, ReturnType>(
  fn: (arg: ArgType) => Promise<ReturnType>,
  infoMessage: string,
  successMessage: string,
  errorMessage: string
): ((arg: ArgType) => Promise<ReturnType>) => {
  return async (arg: ArgType) => {
    log(infoMessage, arg);
    try {
      const result = await fn(arg);
      log(successMessage, { input: arg, output: result });
      return result;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        logError(errorMessage, err, { input: arg });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create duplicate record.",
        });
      }

      if (err instanceof TRPCError) {
        if (err.code === "BAD_REQUEST") {
          logWarning(errorMessage, err, { input: arg });
          throw err;
        } else {
          logError(errorMessage, err, { input: arg });
          throw err;
        }
      } else if (err instanceof HttpError) {
        logError(errorMessage, err, { input: arg });
        throw err;
      } else {
        logError(errorMessage, err, { input: arg });
        throw err;
      }
    }
  };
};

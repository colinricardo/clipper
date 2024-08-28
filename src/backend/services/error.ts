import { log, logError, logWarning } from "@/backend/services/logger";
import { CustomNextApiHandler } from "@/backend/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { HttpError } from "http-errors";
import { NextResponse } from "next/server";

export const httpErrorHandler = (
  route: CustomNextApiHandler
): CustomNextApiHandler => {
  return async (req, res) => {
    try {
      return await route(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status !== 500) {
          return NextResponse.json(
            { message: err.message },
            { status: err.status }
          );
        }
      } else {
        logError("Something went wrong", err);
        return NextResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      }
    }
  };
};

export const errorHandler = (
  route: CustomNextApiHandler
): CustomNextApiHandler => {
  return async (req, res) => {
    try {
      return await route(req, res);
    } catch (err) {
      const isHttpError = err instanceof HttpError;
      const isTrpcError = err instanceof TRPCError;

      if (isTrpcError) {
        const errorMessage = err.message;
        const status = err.code === "BAD_REQUEST" ? 400 : 500;
        logError(errorMessage, err);
        return NextResponse.json({ message: errorMessage }, { status });
      } else if (isHttpError) {
        const errorMessage = err.message;
        const status = err.status || 500;
        return NextResponse.json({ message: errorMessage }, { status });
      } else {
        logError("Something went wrong.", err);
        return NextResponse.json(
          {
            message: "Something went wrong.",
          },
          {
            status: 500,
          }
        );
      }
    }
  };
};

// NOTE: this assumes the function passed in has a single argument, which is an object with stuff in it.
export const functionHandler = <ArgType extends object | undefined, ReturnType>(
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

export const functionHandlerSync = <
  ArgType extends object | undefined,
  ReturnType
>(
  fn: (arg: ArgType) => ReturnType,
  infoMessage: string,
  successMessage: string,
  errorMessage: string
): ((arg: ArgType) => ReturnType) => {
  return (arg: ArgType) => {
    log(infoMessage, arg);
    try {
      const result = fn(arg);
      log(successMessage, { input: arg, output: result });
      return result;
    } catch (err) {
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

export const throwAndLog = (
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
) => {
  if (status === 400) {
    logWarning(s, err, extra);
  } else {
    logError(s, err, extra);
  }

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: s,
  });
};

export const throwAndLogIf = (
  thing: any,
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
) => {
  if (thing) {
    if (status === 400) {
      logWarning(s, err, extra);
    } else {
      logError(s, err, extra);
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: s,
    });
  }
};

export const throwAndLogIfNot = (
  thing: any,
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
) => {
  if (!thing) {
    if (status === 400) {
      logWarning(s, err, extra);
    } else {
      logError(s, err, extra);
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: s,
    });
  }
};

export const throwHuman = (
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
) => {
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: s,
  });
};

export const throwIf = (
  thing: any,
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
) => {
  if (thing) {
    logWarning(s, err, extra);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: s,
    });
  }
};

export const throwIfNot = <T>(
  thing: T | null | undefined,
  s: string,
  err: Error | null | unknown,
  extra: object,
  status: number
): T => {
  if (!thing) {
    logWarning(s, err, extra);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: s,
    });
  }
  return thing;
};

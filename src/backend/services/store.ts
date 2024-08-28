import { CustomNextApiHandler } from "@/backend/types";
import { IdPrefix, randomId } from "@/backend/utils/ids";

import cls from "cls-hooked";

export const store = cls.createNamespace("store-namespace");

export const setToStore = (key: string, obj: object) => {
  const old = getFromStore(key);

  if (!old) {
    const data = JSON.stringify(obj);
    store.set(key, data);
  } else {
    const data = JSON.stringify({ ...old, ...obj });
    store.set(key, data);
  }
};

export const getFromStore = (key: string) => {
  const _ = store.get(key);

  if (!_) {
    return {};
  }
  const obj = JSON.parse(_);
  return obj;
};

export const correlationIdBinder = (ns: any) => {
  if (!ns) throw new Error("CLS namespace required.");

  return function applyMiddleware(
    route: CustomNextApiHandler
  ): CustomNextApiHandler {
    return async (req, res): Promise<Response | void> => {
      return new Promise<Response | void>(async (resolve, reject) => {
        const { userId } = { userId: null };

        await ns.run(async () => {
          const correlationId = randomId({ prefix: IdPrefix.Correlation });
          setToStore("context", { correlationId, userId });
          try {
            const r: Response | void = await route(req, res);
            resolve(r);
          } catch (error) {
            reject(error);
          }
        });
      });
    };
  };
};

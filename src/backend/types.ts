export type CustomNextApiHandler = (
  req: Request,
  res: Response
) => Promise<Response | void>;

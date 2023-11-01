import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../error/customError";

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new NotFoundError("Route Not Found");
};

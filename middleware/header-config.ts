import { Request, Response, NextFunction } from "express";

export const headerConfig = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
};

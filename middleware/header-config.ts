import { NextFunction, Request, Response } from "express";

export const headerConfig = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Origin-Cross-Resource-Policy", "cross-origin");
  next();
};

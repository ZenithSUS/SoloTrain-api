import { NextFunction, Request, Response } from "express";
import config from "../config.js";

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];

  // Check if the API key is valid
  if (apiKey === config.apiKey) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized Access to the server" });
  }
};

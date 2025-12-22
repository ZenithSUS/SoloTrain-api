import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtLoad } from "../types/jwt-load.js";

// Add the user to the request object
declare global {
  namespace Express {
    interface Request {
      user: JwtLoad;
    }
  }
}

// Load environment variables
dotenv.config({ quiet: true });

export function verifyJwtKey(req: Request, res: Response, next: NextFunction) {
  // JWT token
  const secret = process.env.JWT_SECRET as string;

  // Get the token from the request headers
  const authHeader = req.headers["authorization"];

  // Get the Bearer token value
  const token = authHeader && authHeader.split(" ")[1];

  // Check if the token is valid and not expired
  if (!token) {
    return res.status(401).json({ error: "Access denied, No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Invalid token, Unauthorized Access to the server" });
    }

    // Add the account to the request object
    req.user = decoded as JwtLoad;
    next();
  });
}

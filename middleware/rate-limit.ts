import { NextFunction, Request, Response } from "express";
import redis from "../lib/redis.js";

interface RateLimitOptions {
  prefix: string;
  limit: number;
  windowSeconds: number;
  keyBuilder: (req: Request) => string;
}

const ratelimit = ({
  prefix,
  limit,
  windowSeconds,
  keyBuilder,
}: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key =
        typeof keyBuilder === "function"
          ? keyBuilder(req)
          : `${prefix}:${req.ip}`;

      const count = await redis.incr(key);

      // if the count is 1, set the key to expire in windowSeconds
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      // if the count is greater than the limit, return 429
      if (count > limit) {
        return res.status(429).json({
          error: "Too many requests",
          route: prefix,
          retryAfter: windowSeconds,
        });
      }

      next();
    } catch {
      // if the rate limit goes wrong allow the request
      next();
    }
  };
};

export default ratelimit;

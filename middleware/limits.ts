import { Request } from "express";
import ratelimit from "./rate-limit.js";

const loginLimit = ratelimit({
  prefix: "login",
  limit: 10,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.ip || "unknown",
});

const registerLimit = ratelimit({
  prefix: "register",
  limit: 5,
  windowSeconds: 60,
  keyBuilder: (req: Request) => req.ip || "unknown",
});

const resetPasswordLimit = ratelimit({
  prefix: "reset-password",
  limit: 5,
  windowSeconds: 900, // 15 minutes
  keyBuilder: (req) => req.ip || "unknown",
});

const initiateResetPasswordLimit = ratelimit({
  prefix: "initiate-reset-password",
  limit: 5,
  windowSeconds: 900, // 15 minutes
  keyBuilder: (req) => req.ip || "unknown",
});

const changePasswordLimit = ratelimit({
  prefix: "change-password",
  limit: 3,
  windowSeconds: 600, // 10 minutes
  keyBuilder: (req) => req.user?.id || "unknown",
});

const usersLimit = ratelimit({
  prefix: "users",
  limit: 30,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const accountLimit = ratelimit({
  prefix: "account",
  limit: 60,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const workoutsLimit = ratelimit({
  prefix: "workouts",
  limit: 60,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const missionsLimit = ratelimit({
  prefix: "missions",
  limit: 120,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const recentsLimit = ratelimit({
  prefix: "recents",
  limit: 60,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const skillsLimit = ratelimit({
  prefix: "skills",
  limit: 60,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const progressLimit = ratelimit({
  prefix: "progress",
  limit: 60,
  windowSeconds: 60, // 1 minute
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const adventureLimit = ratelimit({
  prefix: "adventure",
  limit: 60,
  windowSeconds: 60,
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const trialsLimit = ratelimit({
  prefix: "trials",
  limit: 60,
  windowSeconds: 60,
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

const statsLimit = ratelimit({
  prefix: "stats",
  limit: 60,
  windowSeconds: 60,
  keyBuilder: (req: Request) => req.user?.id || req.ip || "unknown",
});

export {
  loginLimit,
  registerLimit,
  initiateResetPasswordLimit,
  resetPasswordLimit,
  changePasswordLimit,
  usersLimit,
  accountLimit,
  workoutsLimit,
  missionsLimit,
  recentsLimit,
  skillsLimit,
  adventureLimit,
  trialsLimit,
  statsLimit,
  progressLimit,
};

import express, { Router } from "express";
import passport from "../lib/passport.js";
import { AuthController } from "../controllers/auth-controller.js";
import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import { AuthService } from "../services/auth-service.js";

const router: Router = express.Router();

const repo = new AuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

router.get("/google", controller.oauthRedirect);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  controller.oauthCallback
);

export default router;

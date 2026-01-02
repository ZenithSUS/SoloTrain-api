import express, { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import { AuthService } from "../services/auth-service.js";
import {
  changePasswordLimit,
  initiateResetPasswordLimit,
  loginLimit,
  registerLimit,
  resetPasswordLimit,
} from "../middleware/limits.js";
import { verifyJwtKey } from "../middleware/verify-jwt-key.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new AuthRepository();
const authService = new AuthService(repo);
const authController = new AuthController(authService);

// Post Routes
router.post("/login", loginLimit, authController.login);
router.post("/register", registerLimit, authController.register);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.post(
  "/reset-password",
  resetPasswordLimit,
  authController.resetPassword
);
router.post(
  "/initiate-password-reset",
  initiateResetPasswordLimit,
  authController.initiatePasswordReset
);
router.post(
  "/change-password",
  verifyJwtKey,
  changePasswordLimit,
  authController.changePassword
);

// Get Routes
router.get("/recover", authController.redirectRecovery);
router.get("/recover/email/:token", authController.getResetEmail);

export default router;

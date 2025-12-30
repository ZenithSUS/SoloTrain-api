import express, { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import { AuthService } from "../services/auth-service.js";
import { loginLimit, registerLimit } from "../middleware/limits.js";

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

export default router;

import express, { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import { AuthService } from "../services/auth-service.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new AuthRepository();
const authService = new AuthService(repo);
const authController = new AuthController(authService);

// Auth Routes
router.post("/login", authController.login);
router.post("/register", authController.register);

export default router;

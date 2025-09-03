import express, { Router } from "express";
import { UserController } from "../controllers/user-controller.js";
import { UserRepository } from "../repositories/mongoDb/user-repository.js";
import { UserService } from "../services/user-service.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new UserRepository();
const userService = new UserService(repo);
const userController = new UserController(userService);

// Get Routes
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.get("/:id/stats", userController.getOneWithStats);

// Post Routes
router.post("/", userController.create);

// Delete Routes
router.delete("/:id", userController.delete);

// Put Routes
router.put("/:id", userController.update);

export default router;

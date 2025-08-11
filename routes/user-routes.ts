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

// User Routes
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.get("/stats/:id", userController.getOneWithStats);

router.post("/", userController.create);
router.delete("/:id", userController.delete);
router.put("/:id", userController.update);

export default router;

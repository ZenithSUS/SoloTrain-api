import express, { Router } from "express";
import UserController from "../controllers/user-controller.js";

// Initialize router
const router: Router = express.Router();

// User Routes
router.get("/", UserController.getAll.bind(UserController));
router.get("/:id", UserController.getOne.bind(UserController));
router.post("/", UserController.create.bind(UserController));
router.delete("/:id", UserController.delete.bind(UserController));
router.put("/:id", UserController.update.bind(UserController));

export default router;

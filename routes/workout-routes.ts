import express from "express";
import { WorkoutController } from "../controllers/workout-controller.js";
import { WorkoutService } from "../services/workout-service.js";
import { WorkoutRepository } from "../repositories/mongoDb/workout-repository.js";

// Initialize router
const router: express.Router = express.Router();

// Create Instance of classes
const repo = new WorkoutRepository();
const workoutService = new WorkoutService(repo);
const workoutController = new WorkoutController(workoutService);

// User Routes
router.get("/:id/:dayNumber", workoutController.getAllByUserId);

export default router;

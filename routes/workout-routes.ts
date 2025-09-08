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

// Get Routes
router.get(
  "/:id/set/:workoutId/day/:dayNumber",
  workoutController.getAllByUserId
);
router.get("/:id/total/:workoutId", workoutController.getTotalWorkoutsByUserId);

// Post Routes
router.put("/:id/:dayNumber", workoutController.updateWorkout);

// Delete Routes
router.delete("/:id/set/:workoutId", workoutController.deleteWorkoutSet);

export default router;

import { Request, Response } from "express";
import { WorkoutService } from "../services/workout-service.js";

export class WorkoutController {
  // Dependency injection
  constructor(private workoutService: WorkoutService) {}

  // Get all workouts by user id
  getAllByUserId = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.params ||
        typeof req.params !== "object" ||
        Object.keys(req.params).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id and date from the request params
      const { id, workoutId, dayNumber } = req.params;

      // Check if the id and date are valid
      if (
        !id ||
        !dayNumber ||
        !workoutId ||
        typeof id !== "string" ||
        typeof dayNumber !== "string" ||
        typeof workoutId !== "string"
      ) {
        return res.status(400).json({ error: "Invalid data" });
      }

      // Check if the logged in user is the owner of the workout
      if (req.user?.id !== id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get the workouts
      const workouts = await this.workoutService.getAllByUserId(
        id,
        workoutId,
        Number(dayNumber)
      );

      // Check if the workouts were found
      if (!workouts) {
        return res.status(404).json({ error: "Workouts not found" });
      }

      res.status(200).json(workouts);
    } catch (error) {
      console.error("Error getting workouts:", error);
      res.status(500).json({ error: "Error getting workouts" });
    }
  };

  getTotalWorkoutsByUserId = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.params ||
        typeof req.params !== "object" ||
        Object.keys(req.params).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id and workoutId from the request params
      const { id, workoutId } = req.params;

      // Check if the id and workoutId are valid
      if (
        !id ||
        !workoutId ||
        typeof id !== "string" ||
        typeof workoutId !== "string"
      ) {
        return res.status(400).json({ error: "Invalid id or workoutId" });
      }

      // Check if the logged in user is the owner of the workout
      if (req.user?.id !== id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get the total workouts
      const totalWorkouts = await this.workoutService.getTotalWorkoutsByUserId(
        id,
        workoutId
      );

      // Check if the total workouts were found
      if (!totalWorkouts) {
        return res.status(404).json({ error: "Total workouts not found" });
      }

      res.status(200).json(totalWorkouts);
    } catch (error) {
      console.error("Error getting total workouts:", error);
      res.status(500).json({ error: "Error getting total workouts" });
    }
  };

  // Update workout by user id
  updateWorkout = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id and date from the request params
      const { id, dayNumber } = req.params;

      // Check if the id and date are valid
      if (!id || !dayNumber) {
        return res.status(400).json({ error: "Invalid id or dayNumber" });
      }

      // Update the workout
      const updatedWorkout = await this.workoutService.update(
        req.body,
        id,
        Number(dayNumber)
      );

      // Check if the workout was updated
      if (!updatedWorkout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      return res.status(200).json({ message: "Workout updated" });
    } catch (error) {
      console.error("Error updating workout:", error);
      res.status(500).json({ error: "Error updating workout" });
    }
  };

  /**
   * Delete a set workout
   * @param req
   * @param res
   * @returns
   */
  deleteWorkoutSet = async (req: Request, res: Response) => {
    try {
      // Get the id and workoutId from the request params
      const { id, workoutId } = req.params;

      // Check if the id and workoutId are valid
      if (
        !id ||
        !workoutId ||
        typeof id !== "string" ||
        typeof workoutId !== "string"
      ) {
        return res.status(400).json({ error: "Invalid id or workoutId" });
      }

      // Delete the set workout
      const deletedWorkout = await this.workoutService.deleteSet(id, workoutId);

      // Check if the set workout was deleted
      if (!deletedWorkout) {
        return res.status(404).json({ error: "Set workout not found" });
      }

      return res.status(200).json({ message: "Set workout deleted" });
    } catch (error) {
      console.error("Error deleting set workout:", error);
      res.status(500).json({ error: "Error deleting set workout" });
    }
  };
}

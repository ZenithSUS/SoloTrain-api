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
      const { id, dayNumber } = req.params;

      // Check if the id and date are valid
      if (!id || !dayNumber) {
        return res.status(400).json({ error: "Invalid id or dayNumber" });
      }

      // Get the workouts
      const workouts = await this.workoutService.getAllByUserId(
        id,
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
}

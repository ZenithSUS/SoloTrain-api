import { Request, Response } from "express";
import { WorkoutCustomization } from "../types/workout";
import { GroqService } from "../services/groq-service";

export class GroqController {
  // Dependency injection
  constructor(private mistralService: GroqService) {}

  // Generate a workout plan
  generateWorkOutPlan = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Add a type to the request body
      const data: WorkoutCustomization = req.body;

      // Check all required fields are present
      if (
        !data.goal ||
        !data.userId ||
        !data.hasEquipment ||
        !data.difficulty ||
        !data.workoutsPerWeek
      ) {
        return res.status(400).json({ error: "Unprocessable entity" });
      }

      // Generate the workout plan
      const workoutPlan = await this.mistralService.generateWorkOutPlan(data);

      // Check if the workout plan was generated
      if (!workoutPlan)
        return res.status(500).json({ error: "There is no workout plan" });

      return res.status(200).json({ message: "Workout plan generated" });
    } catch (error) {
      console.error("Error generating workout plan:", error);
      return res.status(500).json({ error: "Error generating workout plan" });
    }
  };
}

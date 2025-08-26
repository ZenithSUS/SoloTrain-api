import { Request, Response } from "express";
import { StatService } from "../services/stat-service.js";
import { Stat } from "../types/stats.js";

export class StatController {
  // Dependency injection
  constructor(private statService: StatService) {}

  create = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }
      // Get only the userId from the request body
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
      }

      // Create a new stat
      const stat = await this.statService.createStat(userId);

      // Return the created stat
      return res
        .status(201)
        .json({ message: "Stat created successfully", data: stat });
    } catch (error) {
      console.error("Error creating stat:", error);
      return res.status(500).json({ error: "Error creating stat" });
    }
  };

  update = async (req: Request, res: Response) => {
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
      const data: Partial<Stat> = req.body;

      // Get the userId from the params
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "UserId is required" });
      }

      // Update the stat
      const stat = await this.statService.updateStat(data, id);

      // Check if the stat was updated
      if (!stat) {
        return res.status(404).json({ error: "Stat not found" });
      }

      // Return the updated stat
      return res
        .status(200)
        .json({ message: "Stat updated successfully", data: stat });
    } catch (error) {
      console.error("Error updating stat:", error);
      return res.status(500).json({ error: "Error updating stat" });
    }
  };
}

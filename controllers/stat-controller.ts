import { Request, Response } from "express";
import { StatService } from "../services/stat-service.js";
import { Stat } from "../types/stats.js";

export class StatController {
  // Dependency injection
  constructor(private statService: StatService) {}

  /**
   * Create a new stat
   * @param req
   * @param res
   * @returns Created stat
   */
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

      // Check if the logged in user is the owner of the stat
      if (req.user.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
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

  /**
   * Update a stat
   * @param req
   * @param res
   * @returns Message of success or error
   */
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

      // Check if the logged in user is the owner of the stat
      if (req.user.id !== id) {
        return res.status(401).json({ error: "Unauthorized" });
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

  reset = async (req: Request, res: Response) => {
    try {
      // Get the id from the params
      const { id } = req.params;

      // Validate the id
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      if (req.user.id !== id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Reset the stat
      const stat = await this.statService.resetStat(id);

      // Check if the stat was reset
      if (!stat) {
        return res.status(404).json({ error: "Stat not found" });
      }

      // Return the reset stat
      return res
        .status(200)
        .json({ message: "Stat reset successfully", data: stat });
    } catch (error) {
      console.error("Error resetting stat:", error);
      return res.status(500).json({ error: "Error resetting stat" });
    }
  };
}

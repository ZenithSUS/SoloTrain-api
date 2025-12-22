import { Request, Response } from "express";
import { RecentService } from "../services/recent-service.js";
import { Recent } from "../types/recent.js";

export class RecentController {
  // Dependency Injection
  constructor(private recentService: RecentService) {}

  /**
   * Create recent
   * @param req
   * @param res
   * @returns Success or error
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

      // Add type to the request body
      const data: Recent = req.body;

      // Check all required fields are present
      if (
        (!data.userId || !data.difficulty || !data.reward || !data.type) &&
        (!data.time || !data.reps)
      ) {
        return res.status(400).json({ error: "Unprocessable entity" });
      }

      // Check the logged in user is the owner of the recent
      if (req.user.id !== data.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Create a new recent
      const recent = await this.recentService.createRecent(data);

      // Return the created recent
      return res
        .status(201)
        .json({ message: "Recent created successfully", data: recent });
    } catch (error) {
      console.error("Error creating recent:", error);
      return res.status(500).json({ error: "Error creating recent" });
    }
  };

  /**
   * Delete recent
   * @param req
   * @param res
   * @returns Success or error
   */
  delete = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request params
      const id = req.params.id as string;

      // Check if the id is valid
      if (!id) {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Delete the recent
      await this.recentService.deleteRecent(id);

      // Return the deleted recent
      return res.status(200).json({ message: "Recent deleted successfully" });
    } catch (error) {
      console.error("Error deleting recent:", error);
      return res.status(500).json({ error: "Error deleting recent" });
    }
  };

  /**
   * Get all recent by user id paginated
   * @param req
   * @param res
   * @returns Paginated recents or error
   */
  getAllByUserIdPaginated = async (req: Request, res: Response) => {
    try {
      // Get the user id from the request params
      const userId = req.params.id as string;

      // Check if the user id is valid
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid user id" });
      }

      // Get the page and limit from the request query
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      // Get all recent by user id paginated
      const recent = await this.recentService.getAllRecentByUserIdPaginated(
        userId,
        page,
        limit
      );

      // Return the recent
      return res.status(200).json(recent);
    } catch (error) {
      console.error("Error getting recent:", error);
      return res.status(500).json({ error: "Error getting recent" });
    }
  };
}

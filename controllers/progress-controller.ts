import { Request, Response } from "express";
import { ProgressService } from "../services/progress.service.js";
import { Progress } from "../types/progess.js";

export class ProgressController {
  // Dependency injection to access the progress service
  constructor(private progressService: ProgressService) {}

  /**
   *
   * @param req
   * @param res
   * @returns message and data of the progress
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

      // Create new progress
      const progress = await this.progressService.createProgress(req.body);

      // Check if the progress was created
      if (!progress) {
        return res.status(500).json({ error: "Error creating progress" });
      }

      // Return the created progress
      return res.status(201).json({
        message: "Progress created successfully",
        data: progress,
      });
    } catch (error) {
      console.error("Error creating progress:", error);
      res.status(500).json({ error: "Error creating progress" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns message and data of the progress
   */
  delete = async (req: Request, res: Response) => {
    try {
      // Check if the request params is valid
      if (
        !req.params ||
        typeof req.params !== "object" ||
        Object.keys(req.params).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request params" });
      }

      // Delete progress
      const progress = await this.progressService.deleteProgress(req.params.id);

      // Check if the progress was deleted
      if (!progress) {
        return res.status(500).json({ error: "Error deleting progress" });
      }

      // Return the deleted progress
      return res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
      console.error("Error deleting progress:", error);
      res.status(500).json({ error: "Error deleting progress" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns message and data of the progress
   */
  update = async (req: Request, res: Response) => {
    try {
      // Get the progress id from the request params
      const { id } = req.params;

      // Check if the progress id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid progress id" });
      }

      // Get the progress data from the request body
      const data: Partial<Progress> = req.body;

      // Check if the progress data is valid
      if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Update the progress
      const progress = await this.progressService.updateProgress(data, id);

      // Check if the progress was updated
      if (!progress) {
        return res.status(500).json({ error: "Error updating progress" });
      }

      // Return the updated progress
      return res
        .status(200)
        .json({ message: "Progress updated successfully", data: progress });
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Error updating progress" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      // Get all progress
      const progress = await this.progressService.getAllProgress();

      // Return the progress
      return res
        .status(200)
        .json({ message: "Progress retrieved successfully", data: progress });
    } catch (error) {
      console.error("Error retrieving progress:", error);
      res.status(500).json({ error: "Error retrieving progress" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      // Get the progress id from the request params
      const { id } = req.params;

      // Check if the progress id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid progress id" });
      }

      // Get the progress
      const progress = await this.progressService.getOneProgress(id);

      // Check if the progress was found
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      // Return the progress
      return res
        .status(200)
        .json({ message: "Progress retrieved successfully", data: progress });
    } catch (error) {
      console.error("Error retrieving progress:", error);
      res.status(500).json({ error: "Error retrieving progress" });
    }
  };
}

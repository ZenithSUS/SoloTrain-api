import { Request, Response } from "express";
import { MissionService } from "../services/mission-service";
import { Mission } from "../types/mission";

export class MissionController {
  // Dependency Injection
  constructor(private missionService: MissionService) {}

  /**
   * Create a new mission
   * @param req
   * @param res
   * @returns Promise<Response<any, Record<string, any>>>
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

      // Separate the userId and type from the request body
      const { userId, ...rest } = req.body;

      // Create a new mission
      const mission = await this.missionService.createMission(rest, userId);

      // Return the created mission
      return res
        .status(201)
        .json({ message: "Mission created successfully", data: mission });
    } catch (error) {
      console.error("Error creating mission:", error);
      return res.status(500).json({ error: "Error creating mission" });
    }
  };

  /**
   * Get all the missions base on type
   * @param req
   * @param res
   * @returns Promise<Response<any, Record<string, any>>>
   */
  getByUserIdAndType = async (req: Request, res: Response) => {
    try {
      // Get the id from the request params
      const { id, type } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string" || !type || typeof type !== "string") {
        return res.status(400).json({ error: "Params are not valid" });
      }

      // Get all the missions
      const missions = await this.missionService.getByUserIdAndType(
        id,
        type as "daily" | "weekly" | "special"
      );

      // Return the missions
      return res.status(200).json(missions);
    } catch (error) {
      console.error("Error getting missions:", error);
      return res.status(500).json({ error: "Error getting missions" });
    }
  };

  getAllByUserId = async (req: Request, res: Response) => {
    try {
      // Get the id from the request params
      const { id } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Get all the missions
      const missions = await this.missionService.getAllByUserId(id);

      // Return the missions
      return res.status(200).json(missions);
    } catch (error) {
      console.error("Error getting missions:", error);
      return res.status(500).json({ error: "Error getting missions" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      // Get the id from the request params
      const { id } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Get the mission
      const mission = await this.missionService.getOne(id);

      // Check if the mission was found
      if (!mission) {
        return res.status(404).json({ error: "Mission not found" });
      }

      // Return the mission
      return res.status(200).json(mission);
    } catch (error) {
      console.error("Error getting mission:", error);
      return res.status(500).json({ error: "Error getting mission" });
    }
  };

  /**
   * Update a mission
   * @param req
   * @param res
   * @returns Promise<Response<any, Record<string, any>>>
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

      // Create a type on the request body
      const data: Partial<Mission> = req.body;

      // Get the id from the request params
      const { id } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Update the mission
      const mission = await this.missionService.update(data, id);

      // Check if the mission was updated
      if (!mission) {
        return res.status(404).json({ error: "Mission not found" });
      }

      // Return the updated mission
      return res
        .status(200)
        .json({ message: "Mission updated successfully", data: mission });
    } catch (error) {
      console.error("Error updating mission:", error);
      return res.status(500).json({ error: "Error updating mission" });
    }
  };

  /**
   * Delete a Mission
   * @param req
   * @param res
   * @returns Promise<Response<any, Record<string, any>>>
   */
  delete = async (req: Request, res: Response) => {
    try {
      // Get the id from the request params
      const { id } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Delete the mission
      const mission = await this.missionService.delete(id);

      // Check if the mission was deleted
      if (!mission) {
        return res.status(404).json({ error: "Mission not found" });
      }

      // Return the deleted mission
      return res
        .status(200)
        .json({ message: "Mission deleted successfully", data: mission });
    } catch (error) {
      console.error("Error deleting mission:", error);
      return res.status(500).json({ error: "Error deleting mission" });
    }
  };

  /**
   * Delete all missions by user id
   * @param req
   * @param res
   * @returns Promise<Response<any, Record<string, any>>>
   */
  deleteByUserId = async (req: Request, res: Response) => {
    try {
      // Get the id from the request params
      const { id } = req.params;

      // Check if the id is valid
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Delete the missions
      const missions = await this.missionService.deleteByUserId(id);

      // Return the deleted missions
      return res
        .status(200)
        .json({ message: "Missions deleted successfully", data: missions });
    } catch (error) {
      console.error("Error deleting missions:", error);
      return res.status(500).json({ error: "Error deleting missions" });
    }
  };
}

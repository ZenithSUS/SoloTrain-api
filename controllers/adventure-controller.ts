import { Request, Response } from "express";
import { AdventureService } from "../services/adventure-service.js";
import { AdventureCompletion } from "../types/adventure.js";

export class AdventureController {
  // Dependency injection
  constructor(private adventureService: AdventureService) {}

  syncCompletion = async (req: Request, res: Response) => {
    try {
      const data: AdventureCompletion[] = req.body;

      if (!Array.isArray(data)) {
        res.status(400).json({ message: "Invalid data format" });
        return;
      }

      if (req.user?.id !== data[0]?.userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      if (data.length === 0) {
        res.status(400).json({ message: "No data provided" });
        return;
      }

      const updatedCompletions = await this.adventureService.syncCompletion(
        req.user.id,
        data
      );

      res.status(200).json({
        message: "Adventure completions synced successfully",
        data: updatedCompletions,
      });
    } catch (error) {
      console.error("Error syncing adventure completions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  claimRewards = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const adventureId = parseInt(req.params.adventureId, 10);
      const { xp, points } = req.body;

      if (req.user?.id !== userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      await this.adventureService.claimRewards(userId, adventureId, xp, points);

      res.status(200).json({ message: "Rewards claimed successfully" });
    } catch (error) {
      console.error("Error claiming rewards:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getAdventureCompletionByUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const adventureId = parseInt(req.params.adventureId, 10);

      if (req.user?.id !== userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const completion = await this.adventureService.getCompletionByUserId(
        userId,
        adventureId
      );

      res.status(200).json(completion);
    } catch (error) {
      console.error("Error getting adventure completion:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllAdventuresByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (req.user?.id !== userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const completions = await this.adventureService.getAllCompletionsByUserId(
        userId
      );

      res.status(200).json(completions);
    } catch (error) {
      console.error("Error getting adventure completions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

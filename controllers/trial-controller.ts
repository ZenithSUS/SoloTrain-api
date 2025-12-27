import { Request, Response } from "express";
import { TrialService } from "../services/trial-service.js";
import { Trials } from "../types/trials.js";

export class TrialController {
  constructor(private trialService: TrialService) {}

  getTodayCompletions = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }

      if (req.user.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const completions = await this.trialService.getTodayCompletions(userId);
      return res.status(200).json(completions);
    } catch (error) {
      console.error("Error getting today's completions:", error);
      return res
        .status(500)
        .json({ error: "Error getting today's completions" });
    }
  };

  getTrialCompletionsByUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }

      if (req.user.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const completions = await this.trialService.getTrialsByUserId(userId);
      return res.status(200).json(completions);
    } catch (error) {
      console.error("Error getting completions:", error);
      return res.status(500).json({ error: "Error getting completions" });
    }
  };

  getTrialByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const trialId = Number(req.params.trialId);

      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }

      if (req.user.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const trial = await this.trialService.getTrialByUserId(userId, trialId);
      return res.status(200).json(trial);
    } catch (error) {
      console.error("Error getting trial:", error);
      return res.status(500).json({ error: "Error getting trial" });
    }
  };

  syncCompletion = async (req: Request, res: Response) => {
    try {
      const data: Trials[] = req.body;

      if (!Array.isArray(data)) {
        return res.status(400).json({ message: "Invalid data format" });
      }

      if (req.user.id !== data[0]?.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (data.length === 0) {
        return res.status(400).json({ message: "No data provided" });
      }

      const updatedCompletions = await this.trialService.sync(
        req.user.id,
        data
      );

      return res.status(200).json({
        message: "Completions synced successfully",
        data: updatedCompletions,
      });
    } catch (error) {
      console.error("Error syncing completions:", error);
      return res.status(500).json({ error: "Error syncing completions" });
    }
  };

  claimRewards = async (req: Request, res: Response) => {
    try {
      const data: Trials = req.body;

      if (!data) {
        return res.status(400).json({ error: "Data is required" });
      }

      if (req.user.id !== data.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const reward = await this.trialService.claimReward(data);
      return res.status(200).json(reward);
    } catch (error) {
      console.error("Error claiming reward:", error);
      return res.status(500).json({ error: "Error claiming reward" });
    }
  };
}

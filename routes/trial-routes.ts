import express from "express";
import { TrialController } from "../controllers/trial-controller.js";
import { TrialRepository } from "../repositories/mongoDb/trials-repository.js";
import { TrialService } from "../services/trial-service.js";

// Create Instance of classes
const repo = new TrialRepository();
const trialService = new TrialService(repo);
const trialController = new TrialController(trialService);

// Initialize router
const router: express.Router = express.Router();

// Get Routes
router.get("/today/:id", trialController.getTodayCompletions);
router.get("/:id", trialController.getTrialCompletionsByUser);
router.get("/user/:id/trial/:trialId", trialController.getTrialByUserId);

// Post Routes
router.post("/", trialController.syncCompletion);
router.post("/claim", trialController.claimRewards);

export default router;

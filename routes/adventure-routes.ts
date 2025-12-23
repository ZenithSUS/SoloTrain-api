import express, { Router } from "express";
import { AdventureController } from "../controllers/adventure-controller.js";
import { AdventureRepository } from "../repositories/mongoDb/adventure-repository.js";
import { AdventureService } from "../services/adventure-service.js";

const repo = new AdventureRepository();
const adventureService = new AdventureService(repo);
const adventureController = new AdventureController(adventureService);

const router: Router = express.Router();

// Routes
router.post("/", adventureController.syncCompletion);
router.post(
  "/claim/user/:userId/adventure/:adventureId",
  adventureController.claimRewards
);
router.get("/user/:userId", adventureController.getAllAdventuresByUserId);
router.get(
  "/user/:userId/adventure/:id",
  adventureController.getAdventureCompletionByUser
);

export default router;

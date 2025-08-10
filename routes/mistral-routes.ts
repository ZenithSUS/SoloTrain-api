import express from "express";
import { MistralController } from "../controllers/mistral-controller.js";
import { MistralService } from "../services/mistral-service.js";
import { MistralRepository } from "../repositories/AI/mistral-repository.js";

// Initialize router
const router: express.Router = express.Router();

// Create Instance of classes
const repo = new MistralRepository();
const mistralService = new MistralService(repo);
const mistralController = new MistralController(mistralService);

// User Routes
router.post("/generateWorkOutPlan", mistralController.generateWorkOutPlan);

export default router;

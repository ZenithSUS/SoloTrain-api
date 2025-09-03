import express from "express";
import { GroqController } from "../controllers/groq-controller.js";
import { GroqService } from "../services/groq-service.js";
import { GroqRepository } from "../repositories/AI/groq-repository.js";

// Initialize router
const router: express.Router = express.Router();

// Create Instance of classes
const repo = new GroqRepository();
const groqService = new GroqService(repo);
const groqController = new GroqController(groqService);

// Post Routes
router.post("/generateWorkOutPlan", groqController.generateWorkOutPlan);

export default router;

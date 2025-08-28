import express from "express";
import { StatController } from "../controllers/stat-controller.js";
import { StatService } from "../services/stat-service.js";
import { StatRepository } from "../repositories/mongoDb/stat-repository.js";

// Initialize router
const router: express.Router = express.Router();

// Create Instance of classes
const repo = new StatRepository();
const statService = new StatService(repo);
const statController = new StatController(statService);

// Stat Routes
router.post("/", statController.create);
router.put("/:id", statController.update);
router.put("/reset/:id", statController.reset);

export default router;

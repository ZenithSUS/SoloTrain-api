import express, { Router } from "express";
import { ProgressController } from "../controllers/progress-controller.js";
import { ProgressService } from "../services/progress.service.js";
import { ProgressRepository } from "../repositories/mongoDb/progress-repository.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new ProgressRepository();
const progressService = new ProgressService(repo);
const progressController = new ProgressController(progressService);

// Progress Routes
router.get("/", progressController.getAll);
router.get("/:id", progressController.getOne);
router.post("/", progressController.create);
router.delete("/:id", progressController.delete);
router.put("/:id", progressController.update);

export default router;

import express, { Router } from "express";

import { MissionController } from "../controllers/mission-controller.js";
import { MissionService } from "../services/mission-service.js";
import { MissionRepository } from "../repositories/mongoDb/mission-repository.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new MissionRepository();
const missionService = new MissionService(repo);
const missionController = new MissionController(missionService);

// Mission Routes
router.get("/all/:id/:type", missionController.getAllByUserId);
router.get("/one/:id", missionController.getOne);
router.post("/", missionController.create);
router.delete("/:id", missionController.delete);
router.put("/:id", missionController.update);

export default router;

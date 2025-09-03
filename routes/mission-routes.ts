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

// Get Routes
router.get("/all/:id", missionController.getAllByUserId);
router.get("/all/:id/:type", missionController.getByUserIdAndType);
router.get("/one/:id", missionController.getOne);

// Post Routes
router.post("/", missionController.create);

// Delete Routes
router.delete("/:id", missionController.delete);
router.delete("/user/:id", missionController.deleteByUserId);

// Put Routes
router.put("/:id", missionController.update);

export default router;

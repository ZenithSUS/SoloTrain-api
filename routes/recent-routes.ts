import express from "express";

import { RecentController } from "../controllers/recent-controller.js";
import { RecentService } from "../services/recent-service.js";
import { RecentRepository } from "../repositories/mongoDb/recent-repository.js";

// Intialize Router
const router: express.Router = express.Router();

// Create Instance of classes
const repo = new RecentRepository();
const recentService = new RecentService(repo);
const recentController = new RecentController(recentService);

// Post Routes
router.post("/", recentController.create);

// Get Routes
router.get("/:id", recentController.getAllByUserIdPaginated);

// Delete Routes
router.delete("/:id", recentController.delete);

export default router;

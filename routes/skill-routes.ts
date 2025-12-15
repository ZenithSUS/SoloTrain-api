import express from "express";
import { SkillRepository } from "../repositories/static/skill-repository.js";
import { SkillService } from "../services/skill-service.js";
import { SkillController } from "../controllers/skill-controller.js";

const repo = new SkillRepository();
const skillService = new SkillService(repo);
const skillController = new SkillController(skillService);

// Initialize router
const router: express.Router = express.Router();

// Get Routes
router.get("/", skillController.getSkills);
router.get("/:id", skillController.getSkillById);
router.get("/name/:id", skillController.getSkillByName);

export default router;

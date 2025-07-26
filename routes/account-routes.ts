import express, { Router } from "express";
import { AccountController } from "../controllers/account-controller.js";
import { AccountService } from "../services/account-service.js";
import { AccountRepository } from "../repositories/account-repository.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new AccountRepository();
const accountService = new AccountService(repo);
const accountController = new AccountController(accountService);

// User Routes
router.get("/", accountController.getAll);
router.get("/:id", accountController.getOne);
router.post("/", accountController.create);
router.delete("/:id", accountController.delete);
router.put("/:id", accountController.update);

export default router;

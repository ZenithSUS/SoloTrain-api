import express, { Router } from "express";
import { AccountController } from "../controllers/account-controller.js";
import { AccountService } from "../services/account-service.js";
import { AccountRepository } from "../repositories/mongoDb/account-repository.js";

// Initialize router
const router: Router = express.Router();

// Create Instance of classes
const repo = new AccountRepository();
const accountService = new AccountService(repo);
const accountController = new AccountController(accountService);

// Get Routes
router.get("/", accountController.getAll);
router.get("/:id", accountController.getOne);

// Post Routes
router.post("/", accountController.create);

// Delete Routes
router.delete("/:id", accountController.delete);

// Put Routes
router.put("/:id", accountController.update);

export default router;

import express, { Router } from "express";
import AccountController from "../controllers/account-controller.js";

// Initialize router
const router: Router = express.Router();

// User Routes
router.get("/", AccountController.getAll.bind(AccountController));
router.get("/:id", AccountController.getOne.bind(AccountController));
router.post("/", AccountController.create.bind(AccountController));
router.delete("/:id", AccountController.delete.bind(AccountController));
router.put("/:id", AccountController.update.bind(AccountController));

export default router;

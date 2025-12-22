import dotenv from "dotenv";
import { Request, Response } from "express";
import { AccountService } from "../services/account-service.js";
import { UpdateAccount } from "../types/account.js";

// Load environment variables
dotenv.config({ quiet: true });

export class AccountController {
  // Dependency injection to access the account service
  constructor(private accountService: AccountService) {}

  /**
   * Create a new user
   * @param req
   * @param res
   * @returns new user
   */
  create = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Create new user
      const user = await this.accountService.createAccount(req.body);

      // Check if the user was created
      if (!user) {
        return res.status(500).json({ error: "Error creating user" });
      }

      return res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns message and deleted user
   */
  delete = async (req: Request, res: Response) => {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Delete the user
      const user = await this.accountService.deleteAccount(req.params.id);

      // Check if the user was deleted
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User deleted successfully", data: user });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Error deleting user" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns message and updated user
   */
  update = async (req: Request, res: Response) => {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Get the user data from the request body
      const data: UpdateAccount = req.body;

      // Check if the user data is valid
      if (!data) {
        return res.status(400).json({ error: "User data is required" });
      }

      // Check if the data belongs to the user
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Update the user
      const user = await this.accountService.updateAccount(data, req.params.id);

      // Check if the user was updated
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns all users
   */
  getAll = async (req: Request, res: Response) => {
    try {
      // Get all users
      const users = await this.accountService.getAllAccounts();
      return res.status(200).json({ data: users });
    } catch (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Error getting all users" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns single user
   */
  getOne = async (req: Request, res: Response) => {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Check if the user id belongs to the user
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Get a user
      const user = await this.accountService.getAccount(req.params.id);

      // Check if the user was found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ data: user });
    } catch (error) {
      console.error("Error getting user:", error);
      return res.status(500).json({ error: "Error getting user" });
    }
  };
}

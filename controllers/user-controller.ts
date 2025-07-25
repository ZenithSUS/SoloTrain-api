import dotenv from "dotenv";
import { Request, Response } from "express";
import { UserService } from "../services/user-service.js";
import { UpdateUser } from "../types/user.js";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

class UserController extends UserService {
  /**
   *
   * @param req
   * @param res
   * @returns message and new user
   */
  async create(req: Request, res: Response) {
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
      const user = await this.createUser(req.body);

      // Check if the user was created
      if (!user) {
        return res.status(500).json({ error: "Error creating user" });
      }

      // Return the created user
      return res
        .status(201)
        .json({ message: "User created successfully", data: user });
    } catch (error) {
      return res.status(500).json({ error: "Error creating user" });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns message and deleted user
   */
  async delete(req: Request, res: Response) {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Delete the user
      const user = await this.deleteUser(req.params.id);

      // Check if the user was deleted
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the deleted user
      return res
        .status(200)
        .json({ message: "User deleted successfully", data: user });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting user" });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns message and updated user
   */
  async update(req: Request, res: Response) {
    try {
      // Define the request body
      const data: UpdateUser = req.body;

      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Update the user
      const user = await this.updateUser(data, req.params.id);

      // Check if the user was updated
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns single user
   */
  async getOne(req: Request, res: Response) {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Get a user
      const user = await this.getUser(req.params.id);

      // Check if the user was found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ error: "Error getting user" });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns all users
   */
  async getAll(req: Request, res: Response) {
    try {
      // Get all users
      const users = await this.getAllUsers();
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ error: "Error getting all users" });
    }
  }
}

export default new UserController();

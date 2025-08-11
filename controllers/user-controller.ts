import { Request, Response } from "express";
import { UserService } from "../services/user-service.js";
import { UpdateUser } from "../types/user.js";

export class UserController {
  // Dependency Injection to access the user service
  constructor(private userService: UserService) {}

  /**
   *
   * @param req
   * @param res
   * @returns message and new user
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
      const user = await this.userService.createUser(req.body);

      // Check if the user was created
      if (!user) {
        return res.status(500).json({ error: "Error creating user" });
      }

      // Return the created user
      return res
        .status(201)
        .json({ message: "User created successfully", data: user });
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
      const user = await this.userService.deleteUser(req.params.id);

      // Check if the user was deleted
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the deleted user
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
      // Define the request body
      const data: UpdateUser = req.body;

      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Update the user
      const user = await this.userService.updateUser(data, req.params.id);

      // Check if the user was updated
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Error updating user" });
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

      // Get a user
      const user = await this.userService.getUser(req.params.id);

      // Check if the user was found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      return res.status(500).json({ error: "Error getting user" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns all users with stats
   */
  getOneWithStats = async (req: Request, res: Response) => {
    try {
      // Get the user id from the request params
      if (!req.params.id) {
        return res.status(400).json({ error: "User id is required" });
      }

      // Get all users
      const user = await this.userService.getUserWithStats(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Error getting all users" });
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
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Error getting all users" });
    }
  };
}

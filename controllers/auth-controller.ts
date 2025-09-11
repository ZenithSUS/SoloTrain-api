import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthService } from "../services/auth-service.js";
import { TokenAccount } from "../types/account.js";

// Load environment variables
dotenv.config({ quiet: true });

export class AuthController {
  // Dependency injection
  constructor(private authService: AuthService) {}

  // JWT variables
  private secret = process.env.JWT_SECRET as string;

  // JWT token
  private generateToken(user: TokenAccount) {
    const token = jwt.sign(
      { id: user._id, status: user.status },
      this.secret as string,
      {
        expiresIn: "7d",
      }
    );
    return token;
  }

  login = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the email and password from the request body
      const { email, password } = req.body;

      // Login the user
      const user = await this.authService.loginUser(email, password);

      // Check if the user was logged in
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = this.generateToken(user);

      // Return the user
      return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: { ...user, password: undefined },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Error logging in" });
    }
  };

  /**
   * Create a new user
   * @param req
   * @param res
   * @returns new user
   */
  register = async (req: Request, res: Response) => {
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
      const user = await this.authService.registerUser(req.body);

      // Check if the user was created
      if (!user) {
        return res.status(500).json({ error: "Error creating user" });
      }

      if (user === "Email already exists") {
        return res.status(400).json({ message: "Email already exists" });
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
   * Logout a user
   * @param req
   * @param res
   * @returns user logged out
   */
  logout = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { id } = req.body;

      // Check if the id is valid
      if (!id && typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      const token = req.headers.authorization?.split(" ")[1] as string;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
      await this.authService.logoutUser(id);

      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      return res.status(500).json({ error: "Error logging out" });
    }
  };

  /**
   * Refresh token if the user is logged in and token expires
   * @param req
   * @param res
   */
  refreshToken = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { id } = req.body;

      // Check if the id is valid
      if (!id && typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      let token = req.headers.authorization?.split(" ")[1] as string;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      await this.authService.refreshToken(id);

      // Generate a JWT token
      token = this.generateToken({ _id: id, status: "active" });

      return res
        .status(200)
        .json({ message: "Token refreshed successfully", token });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(500).json({ error: "Error refreshing token" });
    }
  };
}

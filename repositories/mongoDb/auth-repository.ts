import { initializeDatabase } from "../../mongodb.js";
import { Account, CreateAccount } from "../../types/account.js";
import { ObjectId } from "mongodb";
import { comparePassword, hashPassword } from "../../utils/bcyrpt.js";

import crypto from "crypto";
import tokenRecoveryService from "../../services/token-recovery-service.js";
import sendPasswordRecoveryEmail from "../../templates/password-recovery.js";

export class AuthRepository {
  // Collection name
  private collectionName = "accounts";

  // Token recovery service
  private tokenRecoveryService = tokenRecoveryService;

  private generateRecoveryToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Function to call the collection
  async collection<T extends Account | CreateAccount>() {
    const connection = await initializeDatabase();

    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }

    return connection.collection<T>(this.collectionName);
  }

  // Login function
  async login(email: string, password: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        email,
      });

      // Check if the user exists
      if (!account || !account.password) {
        return null;
      }

      // Verify password in bycrypt
      const isValid = await comparePassword(password, account.password);

      // Check if the password is valid
      if (!isValid) {
        return null;
      }

      // Update the last login
      await collection.updateOne(
        { _id: new ObjectId(account._id) },
        { $set: { lastLogin: new Date() } }
      );

      return {
        _id: account._id.toString(),
        status: account.status,
      };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Register function
  async register(data: CreateAccount) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Check if the user already exists
      const existingUser = await collection.findOne({ email: data.email });
      if (existingUser) {
        return "Email already exists";
      }

      if (!data.password) {
        return "Password is required";
      }

      // Encrypt the password
      data.password = await hashPassword(data.password);

      // Store default values
      data.createdAt = new Date();
      data.isOauth = false;
      data.lastLogin = null;
      data.status = "active";

      // Create a new user
      const account = await collection.insertOne({ ...data });

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Oauth function
  async oauth(email: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        email,
      });

      // Check if the user exists
      if (!account) {
        // Register the user
        const result = await collection.insertOne({
          email,
          password: null,
          createdAt: new Date(),
          lastLogin: new Date(),
          isOauth: true,
          status: "active",
        });

        return {
          _id: result.insertedId.toString(),
          status: "active",
        };
      }

      // Update the last login
      await collection.updateOne(
        { _id: new ObjectId(account._id) },
        { $set: { lastLogin: new Date() } }
      );

      return {
        _id: account._id.toString(),
        status: account.status,
      };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Logout function
  async logout(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Update the last login
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastLogin: new Date() } }
      );

      return result;
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  async getUserEmail(email: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        email,
      });

      return account;
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  // Refresh token function
  async refreshToken(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Update the last login
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastLogin: new Date() } }
      );

      return result;
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  // Reset password function
  async resetPassword(email: string, token: string, password: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        email,
      });

      // Check if the user exists
      if (!account) {
        return null;
      }

      // Encrypt the password
      password = await hashPassword(password);

      // Update the password
      const result = await collection.updateOne(
        { _id: new ObjectId(account._id) },
        { $set: { password } }
      );

      // delete the redis token
      await this.tokenRecoveryService.deleteToken(token);

      return result;
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  // Initiate password reset function
  async initiatePasswordReset(email: string, baseUrl: string) {
    try {
      const token = this.generateRecoveryToken();

      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        email,
      });

      // Check if the user exists
      if (!account) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      const tokenData = {
        email: account.email,
        token,
      };

      // Save token to redis
      await this.tokenRecoveryService.saveToken(token, tokenData);

      try {
        // Send password reset email
        await sendPasswordRecoveryEmail(email, token, baseUrl);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        return {
          success: false,
          message: "Error sending password reset email.",
        };
      }

      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      console.error("Error initiating password reset:", error);
    }
  }

  // Change password function
  async changePassword(id: string, password: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the account
      const account = await collection.findOne<Account>({
        _id: new ObjectId(id),
      });

      // Check if the user exists
      if (!account || !account.password) {
        throw new Error("User not found.");
      }

      // Encrypt the password
      password = await hashPassword(password);

      // Update the password
      const result = await collection.updateOne(
        { _id: new ObjectId(account._id) },
        { $set: { password } }
      );

      return result;
    } catch (error) {
      console.error("Error changing password:", error);
    }
  }
}

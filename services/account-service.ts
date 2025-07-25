import dotenv from "dotenv";
import initializeDatabase from "../mongodb.js";
import { ObjectId } from "mongodb";
import { ShowAccount, UpdateAccount, CreateAccount } from "../types/account.js";
import { hashPassword } from "../utils/bcyrpt.js";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

export class AccountService {
  // Create a new account
  async createAccount(data: CreateAccount) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("accounts");

      // Encrypt the password
      data.password = await hashPassword(data.password);

      // Store default values
      data.createdAt = new Date();
      data.lastLogin = null;

      // Create a new user
      const account = await collection.insertOne({ ...data });

      // Close the connection
      await connection.close();

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  // Delete an account
  async deleteAccount(id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("accounts");

      // Delete an account
      const account = await collection.deleteOne({ _id: new ObjectId(id) });

      // Close the connection
      await connection.close();

      return account;
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // Update a user
  async updateAccount(data: UpdateAccount, id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("accounts");

      // Update an account
      const account = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      // Close the connection
      await connection.close();

      return account;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  // Get all accounts
  async getAllAccounts() {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("accounts");

      // Get all accounts
      const account = await collection
        .find<ShowAccount>({}, { projection: { password: 0 } })
        .toArray();

      //Check if there are no accounts
      if (account.length === 0) {
        return [];
      }

      // Close the connection
      await connection.close();

      return account;
    } catch (error) {
      console.error("Error getting all users:", error);
    }
  }

  async getAccount(id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("accounts");

      // Get an account
      const account = await collection.findOne<ShowAccount>(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );

      // Close the connection
      await connection.close();

      return account;
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }
}

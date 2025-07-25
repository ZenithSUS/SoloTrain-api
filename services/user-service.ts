import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { ShowUser, UpdateUser, User } from "../types/user.js";
import initializeDatabase from "../mongodb.js";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

export class UserService {
  // Create an account
  async createUser(data: User) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("users");

      // Create a new user
      const user = await collection.insertOne({ ...data });

      // Close the connection
      await connection.close();

      return user;
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  // Delete an account
  async deleteUser(id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("users");

      // Delete the user
      const user = await collection.deleteOne({ _id: new ObjectId(id) });

      // Close the connection
      await connection.close();
      return user;
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  // Update an account
  async updateUser(data: UpdateUser, id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("users");

      // Update the user
      const user = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      // Close the connection
      await connection.close();

      return user;
    } catch (error) {
      console.error("Error updating account:", error);
    }
  }

  // Get all accounts
  async getAllUsers() {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("users");

      // Get all users
      const users = await collection.find<ShowUser>({}).toArray();

      // Close the connection
      await connection.close();

      return users;
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  }

  // Get a single account
  async getUser(id: string) {
    try {
      // Connect to the MongoDB database
      const connection = await initializeDatabase();

      // Check if connection is successful
      if (!connection) {
        throw new Error("Error connecting to MongoDB");
      }

      // Get DB and Collection
      const db = connection.db(process.env.MONGO_DB_NAME);
      const collection = db.collection("users");

      // Get the user
      const user = await collection.findOne<ShowUser>({
        _id: new ObjectId(id),
      });

      // Close the connection
      await connection.close();

      return user;
    } catch (error) {
      console.error("Error getting account:", error);
    }
  }
}

import { initializeDatabase } from "../../mongodb.js";
import { ObjectId } from "mongodb";
import {
  CreateAccount,
  ShowAccount,
  UpdateAccount,
} from "../../types/account.js";
import { hashPassword } from "../../utils/bcyrpt.js";

export class AccountRepository {
  // Collection name
  private collectionName = "accounts";

  // Function to call the collection
  private async collection() {
    const connection = await initializeDatabase();

    // Check if connection is successful
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }

    return connection.collection(this.collectionName);
  }

  // Create a new account
  async create(data: CreateAccount) {
    try {
      // Encrypt the password
      data.password = await hashPassword(data.password);

      // Store default values
      data.createdAt = new Date();
      data.lastLogin = null;

      // Call the collection
      const collection = await this.collection();

      // Create a new user
      const account = await collection.insertOne({ ...data });

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  // Delete an account
  async delete(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Delete an account
      const account = await collection.deleteOne({ _id: new ObjectId(id) });

      return account;
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // Update a user
  async update(data: UpdateAccount, id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Update an account
      const account = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      return account;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  // Get all accounts
  async getAll() {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get all accounts
      const account = await collection
        .find<ShowAccount>({}, { projection: { password: 0 } })
        .toArray();

      //Check if there are no accounts
      if (account.length === 0) {
        return [];
      }

      return account;
    } catch (error) {
      console.error("Error getting all users:", error);
    }
  }

  async getOne(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get an account
      const account = await collection.findOne<ShowAccount>(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );

      return account;
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }
}

import { closeDatabase, initializeDatabase } from "../../mongodb.js";
import { Account, CreateAccount } from "../../types/account.js";
import { ObjectId } from "mongodb";
import { comparePassword, hashPassword } from "../../utils/bcyrpt.js";

export class AuthRepository {
  // Collection name
  private collectionName = "accounts";

  // Function to call the collection
  async collection() {
    const connection = await initializeDatabase();

    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }

    return connection.collection(this.collectionName);
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
      if (!account) {
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
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }

  // Register function
  async register(data: CreateAccount) {
    try {
      // Encrypt the password
      data.password = await hashPassword(data.password);

      // Store default values
      data.createdAt = new Date();
      data.lastLogin = null;
      data.status = "active";

      // Call the collection
      const collection = await this.collection();

      // Create a new user
      const account = await collection.insertOne({ ...data });

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }
}

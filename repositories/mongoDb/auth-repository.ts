import { initializeDatabase } from "../../mongodb.js";
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
          status: "active",
        });

        console.log("Inserted ID:", result.insertedId);

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
}

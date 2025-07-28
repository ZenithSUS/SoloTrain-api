import { closeDatabase, initializeDatabase } from "../../mongodb.js";
import { Account } from "../../types/account.js";
import { comparePassword } from "../../utils/bcyrpt.js";

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
}

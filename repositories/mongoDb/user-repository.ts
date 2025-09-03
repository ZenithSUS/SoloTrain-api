import { ObjectId } from "mongodb";
import { initializeDatabase } from "../../mongodb.js";
import { ShowUser, UpdateUser, User, UserWithStats } from "../../types/user.js";

export class UserRepository {
  // Collection name for users
  private collectionName = "users";

  // Function to call the collection
  private async collection() {
    const connection = await initializeDatabase();

    // Check if connection is successful
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }

    // Get Connection
    return connection.collection(this.collectionName);
  }

  // Create a new user
  async create(data: User) {
    try {
      // Get Collection
      const collection = await this.collection();

      // Create a new user
      const user = await collection.insertOne({ ...data });

      return user;
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  // Delete a user
  async delete(id: string) {
    try {
      // Get Collection
      const collection = await this.collection();

      // Delete the user
      const user = await collection.deleteOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  // Update a user
  async update(data: UpdateUser, id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Update the user
      const user = await collection.updateOne(
        { accountId: id },
        { $set: data }
      );

      return user;
    } catch (error) {
      console.error("Error updating account:", error);
    }
  }

  // Get all users
  async getAll() {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get all users
      const users = await collection.find<ShowUser>({}).toArray();

      if (users.length === 0) {
        return [];
      }

      return users;
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  }

  // Get a single user
  async getOne(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the user
      const user = await collection.findOne<ShowUser>(
        {
          accountId: id,
        },
        { projection: { _id: 0 } }
      );

      // Check if the user exists
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting account:", error);
    }
  }

  async getOneWithStats(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the user with stats
      const user = await collection
        .aggregate<UserWithStats>([
          {
            $match: { accountId: id },
          },
          {
            $lookup: {
              from: "stats",
              let: { userId: "$accountId" }, // pass user _id into the lookup
              pipeline: [
                { $match: { $expr: { $eq: ["$userId", "$$userId"] } } }, // match userId
                { $sort: { createdAt: -1 } }, // latest first
                { $limit: 1 }, // only the newest stat
              ],
              as: "stats",
            },
          },
          {
            $unwind: "$stats",
          },
        ])
        .next();

      return user || null;
    } catch (error) {
      console.error("Error getting account:", error);
    }
  }
}

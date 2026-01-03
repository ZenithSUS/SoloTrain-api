import { initializeDatabase } from "../../mongodb.js";
import { Recent } from "../../types/recent.js";
import { ObjectId } from "mongodb";
import colors from "../../utils/log-colors.js";

export class RecentRepository {
  // Collection name
  private collectionName = "recent";

  // Function to call the collection
  private async collection() {
    const connection = await initializeDatabase();
    if (!connection) throw new Error("Error connecting to MongoDB");
    return connection.collection<Recent>(this.collectionName);
  }

  // Create a new recent workout
  async create(data: Recent) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Create a new recent workout
      const recent = await collection.insertOne({ ...data });

      return recent;
    } catch (error) {
      console.error("Error creating recent:", error);
      throw error;
    }
  }

  // Delete a recent workout
  async delete(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Delete the recent workout
      const recent = await collection.deleteOne({ _id: new ObjectId(id) });

      return recent;
    } catch (error) {
      console.error("Error deleting recent:", error);
      throw error;
    }
  }

  // Get all recent workouts by user id paginated
  async getAllByUserIdPaginated(
    id: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      // Call the collection
      const collection = await this.collection();

      const offset = (page - 1) * limit;
      const skip = offset > 0 ? offset : 0;

      // Get all recent workouts by user id
      const recent = await collection
        .find({ userId: id }, { skip: skip, limit: limit })
        .sort({ createdAt: -1 })
        .toArray();

      return recent;
    } catch (error) {
      console.error("Error getting recent:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collection = await this.collection();
      await collection.createIndex({ _id: 1, userId: 1 }, { unique: true });

      console.log(
        `MongoDB: ${colors.cyan}Recent indexes created successfully${colors.reset}`
      );
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }
}

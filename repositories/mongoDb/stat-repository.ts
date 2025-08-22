import { initializeDatabase } from "../../mongodb.js";
import { Stat } from "../../types/stats.js";

export class StatRepository {
  private collectionName = "stats";

  // Function to call the collection
  private async collection() {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }
    return connection.collection(this.collectionName);
  }

  // Create Stat
  async create(userId: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Create a new stat
      const data: Stat = {
        userId,
        level: 1,
        exp: 0,
        currentMaxExp: 1000,
        strength: 5,
        agility: 5,
        stamina: 5,
        intelligence: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create a new stat
      const stat = await collection.insertOne({ ...data });

      return stat;
    } catch (error) {
      console.error("Error creating stat:", error);
    }
  }
}

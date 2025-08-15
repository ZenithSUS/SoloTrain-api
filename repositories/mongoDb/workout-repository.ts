import { closeDatabase, initializeDatabase } from "../../mongodb.js";

export class WorkoutRepository {
  private collectionName = "workout";

  async collection() {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }
    return connection.collection(this.collectionName);
  }

  async getAllByUserId(id: string, dayNumber: number) {
    try {
      const collection = await this.collection();

      const workout = await collection.findOne(
        {
          $and: [{ userId: id }, { dayNumber: { $eq: dayNumber } }],
        },
        { sort: { dayNumber: 1 } }
      );

      return workout || null;
    } catch (error) {
      console.error("Error getting workout:", error);
      return null;
    } finally {
      await closeDatabase();
    }
  }
}

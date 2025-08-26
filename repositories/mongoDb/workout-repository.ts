import { closeDatabase, initializeDatabase } from "../../mongodb.js";
import { Workout } from "../../types/workout.js";

export class WorkoutRepository {
  private collectionName = "workout";

  async collection() {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }
    return connection.collection(this.collectionName);
  }

  // Get all workouts by user id and day number
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
    }
  }

  // Update a workout by id
  async update(data: Partial<Workout>, id: string, dayNumber: number) {
    try {
      const collection = await this.collection();

      const result = await collection.updateOne(
        {
          $and: [{ userId: id }, { dayNumber: { $eq: dayNumber } }],
        },
        { $set: data }
      );

      return result || null;
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  }
}

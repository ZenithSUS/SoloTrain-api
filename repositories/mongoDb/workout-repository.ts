import { closeDatabase, initializeDatabase } from "../../mongodb.js";
import { Workout } from "../../types/workout.js";
import colors from "../../utils/log-colors.js";

export class WorkoutRepository {
  private collectionName = "workout";

  async collection() {
    const connection = await initializeDatabase();
    if (!connection) throw new Error("Error connecting to MongoDB");
    return connection.collection(this.collectionName);
  }

  // Get all workouts by user id and day number
  async getAllByUserId(id: string, workoutId: string, dayNumber: number) {
    try {
      const collection = await this.collection();

      const workout = await collection.findOne(
        {
          $and: [
            { userId: id },
            { dayNumber: { $eq: dayNumber }, workoutId: { $eq: workoutId } },
          ],
        },
        { sort: { dayNumber: 1 } }
      );

      return workout || null;
    } catch (error) {
      console.error("Error getting workout:", error);
      return null;
    }
  }

  // Get total workouts by user id and workout number
  async getTotalWorkoutsByUserId(id: string, workoutId: string) {
    try {
      const collection = await this.collection();

      const totalWorkouts = await collection.countDocuments({
        $and: [{ userId: id }, { workoutId: { $eq: workoutId } }],
      });

      return { data: totalWorkouts };
    } catch (error) {
      console.error("Error getting total workouts:", error);
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

  // Delete a set of workouts base on workout id
  async deleteSet(id: string, workoutId: string) {
    try {
      const collection = await this.collection();

      const result = await collection.deleteMany({
        $and: [{ userId: id }, { workoutId: { $eq: workoutId } }],
      });

      return result || null;
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  }
  async createIndexes() {
    try {
      const collection = await this.collection();

      await collection.createIndex(
        { _id: 1, userId: 1, workoutId: 1 },
        { unique: true }
      );

      console.log(
        `MongoDB: ${colors.cyan}Workout indexes created successfully${colors.reset}`
      );
    } catch (error) {
      console.error("Error creating index:", error);
    }
  }
}

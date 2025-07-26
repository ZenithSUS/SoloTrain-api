import { ObjectId } from "mongodb";
import { closeDatabase, initializeDatabase } from "../../mongodb.js";
import { CreateProgress, Progress } from "../../types/progess.js";

export class ProgressRepository {
  // Collection name
  private collectionName = "progress";

  // Function to call the collection
  async collection() {
    const connection = await initializeDatabase();

    // Check if connection is successful
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }

    return connection.collection(this.collectionName);
  }

  // Create a new progress
  async create(data: CreateProgress) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Create a new progress
      const progress = await collection.insertOne({ ...data });

      return progress;
    } catch (error) {
      console.error("Error creating progress:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }

  // Delete a progress
  async delete(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Delete the progress
      const progress = await collection.deleteOne({ _id: new ObjectId(id) });

      return progress;
    } catch (error) {
      console.error("Error deleting progress:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }

  // Update a progress
  async update(data: Partial<Progress>, id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Update the progress
      const progess = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      return progess;
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }

  // Get a single progress
  async getOne(id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get the progress
      const progress = await collection.findOne<Progress>({
        _id: new ObjectId(id),
      });

      return progress;
    } catch (error) {
      console.error("Error getting progress:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }

  // Get all progress
  async getAll() {
    try {
      // Call the collection
      const collection = await this.collection();

      // Get all progress
      const progess = await collection.find<Progress>({}).toArray();

      // Check if there are no progress
      if (progess.length === 0) {
        return [];
      }

      return progess;
    } catch (error) {
      console.error("Error getting progress:", error);
    } finally {
      // Close the connection
      await closeDatabase();
    }
  }
}

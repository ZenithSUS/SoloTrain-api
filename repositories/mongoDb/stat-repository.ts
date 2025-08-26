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

  async update(data: Partial<Stat>, id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Convert the exp into a number type to avoid errors
      const expReward = Number(data.exp) || 0;

      // Only proceed if there's exp to add
      if (expReward <= 0) {
        return null;
      }

      // Update other data fields
      const { exp, ...otherData } = data;
      if (Object.keys(otherData).length > 0) {
        await collection.updateOne({ userId: id }, { $set: otherData });
      }

      // Fetch current stats
      const currentStat = await collection.findOne<Stat>({ userId: id });
      if (!currentStat) {
        throw new Error("User stat not found");
      }

      let remainingExp = expReward;
      let currentExp = currentStat.exp || 0;
      let currentLevel = currentStat.level || 1;
      let maxExpForCurrentLevel = currentStat.currentMaxExp || 1000;

      // Process level ups
      while (remainingExp > 0) {
        const expNeededForNextLevel = maxExpForCurrentLevel - currentExp;

        // If remaining exp is greater than or equal to exp needed for next level
        if (remainingExp >= expNeededForNextLevel) {
          remainingExp -= expNeededForNextLevel;
          currentLevel += 1;
          currentExp = 0;
          maxExpForCurrentLevel += 1000;
        } else {
          // Add remaining exp to current level
          currentExp += remainingExp;
          remainingExp = 0;
        }
      }

      // Update the database with final values
      const finalUpdate = await collection.updateOne(
        { userId: id },
        {
          $set: {
            exp: currentExp,
            level: currentLevel,
            currentMaxExp: maxExpForCurrentLevel,
          },
        }
      );

      return finalUpdate;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }
}

import { initializeDatabase } from "../../mongodb.js";
import { Stat } from "../../types/stats.js";
import colors from "../../utils/log-colors.js";

export class StatRepository {
  private collectionName = "stats";

  private defaultStats = {
    level: 1,
    exp: 0,
    currentMaxExp: 1000,
    strength: 5,
    agility: 5,
    stamina: 5,
    intelligence: 5,
    missionsCompleted: 0,
    missionsFailed: 0,
    totalXP: 0,
  };

  // Function to call the collection
  private async collection(otherCollection?: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }
    return connection.collection(
      otherCollection ? otherCollection : this.collectionName
    );
  }

  // Create Stat
  async create(userId: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Create a new stat
      const data: Stat = {
        userId,
        ...this.defaultStats,
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

  // Reset Stat
  async reset(userId: string) {
    try {
      const collection = await this.collection();

      // Fetch current stats
      const currentStat = await collection.findOne<Stat>({ userId });

      if (!currentStat) {
        throw new Error("User stat not found");
      }
      const result = await collection.updateOne(
        { userId },
        { $set: { ...this.defaultStats, updatedAt: new Date() } }
      );

      return result || null;
    } catch (error) {
      console.error("Error resetting stat:", error);
      throw error;
    }
  }

  async update(data: Partial<Stat>, id: string) {
    try {
      // Call the collection
      const collection = await this.collection();

      // Convert the exp into a number type to avoid errors
      const expReward = Number(data.exp) || 0;

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

      const MAX_LEVEL = 100;
      const MAX_LEVELS_PER_ACTION = 1;

      let isLevelUp = false;
      let points = 0;
      let remainingExp = expReward;
      let currentExp = currentStat.exp || 0;
      let currentLevel = currentStat.level || 1;
      let maxExpForCurrentLevel =
        currentStat.currentMaxExp || 1000 + currentLevel * 500;
      let levelsGained = 0;

      // Process level ups
      while (
        remainingExp > 0 &&
        currentLevel < MAX_LEVEL &&
        levelsGained < MAX_LEVELS_PER_ACTION
      ) {
        const needed = maxExpForCurrentLevel - currentExp;

        if (remainingExp >= needed) {
          isLevelUp = true;
          remainingExp -= needed;

          currentLevel += 1;
          levelsGained += 1;
          points += 5;

          currentExp = Math.min(remainingExp, maxExpForCurrentLevel);

          maxExpForCurrentLevel = 1000 + currentLevel * 500;
        } else {
          currentExp += remainingExp;
          remainingExp = 0;
        }
      }

      // Update the user collection if level up
      if (isLevelUp) {
        const collection = await this.collection("users");

        // Get current user points
        const userPoints = await collection.findOne(
          { accountId: id },
          { projection: { points: 1 } }
        );

        const data = { isLevelUp, points: (userPoints?.points ?? 0) + points };

        const user = await collection.updateOne(
          { accountId: id },
          { $set: data }
        );

        if (!user) {
          throw new Error("User not found");
        }
      }

      // Update the database with final values
      const finalUpdate = await collection.findOneAndUpdate(
        { userId: id },
        {
          $set: {
            exp: currentExp,
            level: currentLevel,
            currentMaxExp: maxExpForCurrentLevel,
            totalXP: currentStat.totalXP + expReward,
            missionsCompleted: currentStat.missionsCompleted + 1,
            updatedAt: new Date(),
          },
        }
      );

      return finalUpdate;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collection = await this.collection();
      await collection.createIndex({ _id: 1, userId: 1 }, { unique: true });

      console.log(
        `MongoDB: ${colors.cyan}Stat indexes created successfully${colors.reset}`
      );
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }
}

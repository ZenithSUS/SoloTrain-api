import { initializeDatabase } from "../../mongodb.js";
import { AdventureCompletion } from "../../types/adventure.js";
import colors from "../../utils/log-colors.js";

export class AdventureRepository {
  private collectionName = "adventure_completions";

  async collection(databaseName?: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Error connecting to MongoDB");
    }
    return connection.collection(databaseName || this.collectionName);
  }

  async getAllCompletionsByUserId(userId: string) {
    try {
      const collection = await this.collection();
      const completions = await collection.find({ userId }).toArray();
      return completions;
    } catch (error) {
      console.error("Error getting adventure completions:", error);
      throw error;
    }
  }

  async getCompletionByUserId(userId: string, adventureId: number) {
    try {
      const collection = await this.collection();
      const result = await collection.findOne({ userId, adventureId });
      return result;
    } catch (error) {
      console.error("Error getting adventure completion:", error);
      throw error;
    }
  }

  async syncCompletion(userId: string, data: AdventureCompletion[]) {
    try {
      const collection = await this.collection();

      const bulkOps = data.map((comp) => ({
        updateOne: {
          filter: { userId, adventureId: comp.adventureId },
          update: {
            $setOnInsert: {
              userId,
              adventureId: comp.adventureId,
              completedAt: new Date(comp.completedAt),
              rewardsClaimed: comp.rewardsClaimed,
              rewardsXP: comp.rewardsXP,
              rewardsPoints: comp.rewardsPoints,
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
      }

      const updatedCompletions = await collection
        .find({ userId, adventureId: { $in: data.map((d) => d.adventureId) } })
        .toArray();

      return updatedCompletions;
    } catch (error) {
      console.error("Error syncing adventure completions:", error);
      throw error;
    }
  }

  async claimRewards(
    userId: string,
    adventureId: number,
    xp: number,
    points: number
  ) {
    try {
      const collection = await this.collection();

      const existing = await collection.findOne({
        userId,
        adventureId,
      });

      console.log("Existing:", existing);

      if (existing?.rewardsClaimed) {
        throw new Error("Rewards already claimed for this adventure");
      }

      // Mark as claimed (atomic operation with upsert)
      const result = await collection.updateOne(
        {
          userId,
          adventureId,
          $or: [
            { rewardsClaimed: { $ne: true } },
            { rewardsClaimed: { $exists: false } },
          ],
        },
        {
          $set: {
            userId,
            adventureId,
            completedAt: new Date(),
            rewardsClaimed: true,
            rewardsXP: xp,
            rewardsPoints: points,
          },
        },
        { upsert: true }
      );

      // If no document was modified, it means rewards were already claimed
      if (result.matchedCount === 0 && result.upsertedCount === 0) {
        throw new Error("Rewards already claimed for this adventure");
      }

      return {
        success: true,
        message: "Rewards claimed successfully",
        xp,
        points,
      };
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collection = await this.collection();

      await collection.createIndex(
        { userId: 1, adventureId: 1 },
        { unique: true }
      );

      console.log(
        `MongoDB: ${colors.cyan}Adventure indexes created successfully ${colors.reset}`
      );
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }
}

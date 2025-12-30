import { initializeDatabase } from "../../mongodb.js";
import { Trials } from "../../types/trials.js";
import colors from "../../utils/log-colors.js";
import getPHDayRange from "../../utils/ph-time-range.js";
import phTime from "../../utils/ph-time.js";

export class TrialRepository {
  private collectionName = "trials";

  private async collection() {
    const connection = await initializeDatabase();
    if (!connection) throw Error("Error Connecting to MongoDB");
    return connection.collection<Trials>(this.collectionName);
  }

  // Check if completed within the same day (NOT more than 1 day)
  private isCompletedToday(newDate: Date, existingDate: Date): boolean {
    const newDay = new Date(newDate).setHours(0, 0, 0, 0);
    const existingDay = new Date(existingDate).setHours(0, 0, 0, 0);
    return newDay === existingDay;
  }

  async claimReward(data: Trials) {
    try {
      const collection = await this.collection();
      const existing = await collection.findOne({
        userId: data.userId,
        trialId: data.trialId,
      });

      //  Prevent claiming if already completed TODAY
      if (
        existing &&
        this.isCompletedToday(data.completedAt, existing.completedAt)
      ) {
        throw new Error("You have already completed this trial today");
      }

      // Use upsert to create or update
      const result = await collection.updateOne(
        {
          userId: data.userId,
          trialId: data.trialId,
        },
        {
          $set: {
            userId: data.userId,
            trialId: data.trialId,
            completedAt: new Date(data.completedAt),
            xpGained: data.xpGained,
            statsGained: data.statsGained,
          },
        },
        { upsert: true }
      );

      if (!result.acknowledged) throw new Error("Error claiming trial reward");

      return {
        userId: data.userId,
        trialId: data.trialId,
        completedAt: data.completedAt,
        xpGained: data.xpGained,
        statsGained: data.statsGained,
      };
    } catch (error) {
      console.error("Error claiming trial reward:", error);
      throw error;
    }
  }

  async sync(userId: string, data: Trials[]) {
    try {
      const collection = await this.collection();
      const bulkOps = data.map((trial) => ({
        updateOne: {
          filter: { trialId: trial.trialId, userId: userId },
          update: {
            $set: {
              trialId: trial.trialId,
              userId: userId,
              completedAt: new Date(trial.completedAt),
              xpGained: trial.xpGained,
              statsGained: trial.statsGained,
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
      }

      const updatedTrials = await collection
        .find({
          userId: data[0]?.userId,
          trialId: { $in: data.map((d) => d.trialId) },
        })
        .toArray();

      return updatedTrials;
    } catch (error) {
      console.error("Error syncing trials:", error);
      throw error;
    }
  }

  async getTrialsByUserId(userId: string) {
    try {
      const collection = await this.collection();
      const results = await collection.find({ userId }).toArray();
      return results;
    } catch (error) {
      console.error("Error getting trials:", error);
      throw error;
    }
  }

  async getTrialByUserId(userId: string, trialId: number) {
    try {
      const collection = await this.collection();
      const result = await collection.findOne({ userId, trialId });
      return result;
    } catch (error) {
      console.error("Error getting trial:", error);
      throw error;
    }
  }

  async getTodayCompletions(userId: string) {
    try {
      const collection = await this.collection();

      const { startOfDayPH, endOfDayPH } = getPHDayRange();

      const results = await collection
        .find({
          userId,
          completedAt: {
            $gte: startOfDayPH,
            $lte: endOfDayPH,
          },
        })
        .toArray();

      return results;
    } catch (error) {
      console.error("Error getting today's completions:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collection = await this.collection();
      await collection.createIndex({ userId: 1, trialId: 1 }, { unique: true });
      await collection.createIndex({ userId: 1, completedAt: -1 });
      console.log(
        `MongoDB: ${colors.cyan}Trial indexes created successfully${colors.reset}`
      );
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }
}

import { initializeDatabase } from "../../mongodb";
import { ObjectId } from "mongodb";
import { Mission } from "../../types/mission";
import { missions } from "../../data/missions";

export class MissionRepository {
  private collectionName = "missions";

  // Call MongoDB collection
  private async collection() {
    const connection = await initializeDatabase();
    if (!connection) throw new Error("Error connecting to MongoDB");
    return connection.collection<Mission>(this.collectionName);
  }

  // Pick a random mission
  private getRandomMission(
    type: "daily" | "weekly" | "special",
    assignedTo: string
  ): Mission {
    const specificMission = missions.filter((m) => m.type === type);
    const selectedMission =
      specificMission[Math.floor(Math.random() * specificMission.length)];

    return {
      ...selectedMission,
      assignedTo,
    };
  }

  // Create missions (3 at a time)
  async create(type: "daily" | "weekly" | "special", assignedTo: string) {
    try {
      const collection = await this.collection();

      const selectedMissions: Mission[] = [];
      for (let i = 0; i < 3; i++) {
        selectedMissions.push(this.getRandomMission(type, assignedTo));
      }

      await collection.insertMany(selectedMissions);
      return selectedMissions;
    } catch (error) {
      console.error("Error creating mission:", error);
      return [];
    }
  }

  // Get missions by user id (auto-handle expired + regenerate cycle)
  async getByUserId(id: string, type: "daily" | "weekly") {
    try {
      const collection = await this.collection();
      const now = new Date();

      // Get user's missions
      let userMissions: Mission[] = await collection
        .find({ assignedTo: id, type })
        .toArray();

      // If no missions (new user or cleared), create new ones
      if (userMissions.length === 0) {
        userMissions = await this.create(type, id);
        return userMissions;
      }

      let needsNewCycle = false;

      // Mark expired ones
      await Promise.all(
        userMissions.map(async (mission) => {
          if (
            mission.status === "pending" &&
            mission.deadline &&
            new Date(mission.deadline) < now
          ) {
            mission.status = "failed";
            await collection.updateOne(
              { _id: new ObjectId(mission._id) },
              { $set: { status: "failed" } }
            );
            needsNewCycle = true;
          }
        })
      );

      // If expired → generate new set
      if (needsNewCycle) {
        await collection.deleteMany({ assignedTo: id, type });
        userMissions = await this.create(type, id);
      }

      return userMissions;
    } catch (error) {
      console.error("Error getting mission:", error);
      return [];
    }
  }

  async getOne(id: string) {
    try {
      const collection = await this.collection();
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error getting mission:", error);
    }
  }

  async update(data: Partial<Mission>, id: string) {
    try {
      const collection = await this.collection();
      return await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
    } catch (error) {
      console.error("Error updating mission:", error);
    }
  }

  async delete(id: string) {
    try {
      const collection = await this.collection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error deleting mission:", error);
    }
  }
}

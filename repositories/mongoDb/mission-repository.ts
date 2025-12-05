import { initializeDatabase } from "../../mongodb.js";
import { ObjectId } from "mongodb";
import { Mission } from "../../types/mission.js";
import { missions } from "../../data/missions.js";

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
  async create(
    type: "daily" | "weekly" | "special",
    assignedTo: string,
    noOfMissions = 3
  ) {
    try {
      const collection = await this.collection();

      const selectedMissions: Mission[] = [];
      for (let i = 0; i < noOfMissions; i++) {
        selectedMissions.push(this.getRandomMission(type, assignedTo));
      }

      await collection.insertMany(selectedMissions);
      return selectedMissions;
    } catch (error) {
      console.error("Error creating mission:", error);
      return [];
    }
  }

  // Create new special mission if any mission is completed
  async createNewSpecialMission() {
    try {
      const collection = await this.collection();

      const specialMissions: Mission[] = await collection
        .find({ type: "special", status: "completed" })
        .toArray();

      // Get users who completed special missions
      const usersCompletedSpecialMissions = specialMissions.map((mission) => {
        const noOfMissionsCompleted = specialMissions.filter(
          (m) => m.assignedTo === mission.assignedTo
        ).length;

        return {
          userId: mission.assignedTo,
          noOfMissionsCompleted,
        };
      });

      // Delete the completed special missions
      await Promise.all(
        specialMissions.map(async (mission) => {
          await collection.deleteOne({ _id: mission._id });
        })
      );

      // Create new special mission based on the current users completed special missions
      const createdSpecialMissions = await Promise.all(
        usersCompletedSpecialMissions.map(async (user) => {
          // Check if there is a user
          if (user.userId)
            return await this.create(
              "special",
              user.userId,
              user.noOfMissionsCompleted
            );
        })
      );

      if (
        !createdSpecialMissions.length ||
        createdSpecialMissions.length === 0
      ) {
        return [];
      }

      return createdSpecialMissions || [];
    } catch (error) {
      console.error("Error creating special mission:", error);
    }
  }

  // Get missions by user id and type (auto-handle expired + regenerate cycle)
  async getByUserIdAndType(id: string, type: "daily" | "weekly" | "special") {
    try {
      const collection = await this.collection();
      const now = new Date();

      // Query
      const query = { assignedTo: id, type };

      // Get user's missions
      let userMissions: Mission[] = await collection.find(query).toArray();

      // If no missions (new user or cleared), create new ones
      if (userMissions.length === 0) {
        userMissions = await this.create(type, id);
        return userMissions;
      }

      let needsNewCycle = false;
      let completedSpecialMissionsId: ObjectId[] = [];

      // Mark expired ones
      await Promise.all(
        userMissions.map(async (mission) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (mission.deadline) {
            const deadline = new Date(mission.deadline);
            deadline.setHours(0, 0, 0, 0);

            // Expire only if the day/week is REALLY over
            if (
              (mission.status === "pending" ||
                mission.status === "completed") &&
              deadline < today
            ) {
              await collection.updateOne(
                { _id: new ObjectId(mission._id) },
                { $set: { status: "failed" } }
              );
              needsNewCycle = true;
            }
          }

          // Special missions
          if (
            mission.type === "special" &&
            mission.status === "completed" &&
            mission._id
          ) {
            completedSpecialMissionsId.push(mission._id);
          }
        })
      );

      // If expired → generate new set
      if (needsNewCycle) {
        await collection.deleteMany({ assignedTo: id, type });
        userMissions = await this.create(type, id);
      }

      // If any special mission is completed, replace the completed ones
      if (completedSpecialMissionsId.length > 0) {
        await collection.deleteMany({
          _id: { $in: completedSpecialMissionsId },
          type: "special",
        });

        await this.create("special", id, completedSpecialMissionsId.length);
      }

      return userMissions;
    } catch (error) {
      console.error("Error getting mission:", error);
      return [];
    }
  }

  // Get all missions by user id
  async getAllByUserId(id: string) {
    try {
      // Get user's missions
      const [daily, weekly, special] = await Promise.all([
        this.getByUserIdAndType(id, "daily"),
        this.getByUserIdAndType(id, "weekly"),
        this.getByUserIdAndType(id, "special"),
      ]);

      return [...daily, ...weekly, ...special];
    } catch (error) {
      console.error("Error getting mission:", error);
      return [];
    }
  }

  // Get a single mission
  async getOne(id: string) {
    try {
      const collection = await this.collection();
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error getting mission:", error);
    }
  }

  // Update a mission
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

  // Delete a mission
  async delete(id: string) {
    try {
      const collection = await this.collection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error deleting mission:", error);
    }
  }

  // Delete all missions by user id
  async deleteByUserId(id: string) {
    try {
      const collection = await this.collection();
      return await collection.deleteMany({ assignedTo: id });
    } catch (error) {
      console.error("Error deleting mission:", error);
    }
  }
}

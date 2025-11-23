import { MissionRepository } from "../repositories/mongoDb/mission-repository.js";
import { CreateMission } from "../types/mission.js";

export class MissionService {
  // Dependency injection
  constructor(private missionRepo: MissionRepository) {}

  // Create a mission
  async createMission(
    type: "daily" | "weekly" | "special",
    assignedTo: string
  ) {
    return await this.missionRepo.create(type, assignedTo);
  }

  // Create new special mission if any mission is completed
  async createNewSpecialMission() {
    return await this.missionRepo.createNewSpecialMission();
  }

  // Get a single mission
  async getOne(id: string) {
    return await this.missionRepo.getOne(id);
  }

  // Get by user's id
  async getByUserIdAndType(id: string, type: "daily" | "weekly" | "special") {
    return await this.missionRepo.getByUserIdAndType(id, type);
  }

  // Get all by user's id
  async getAllByUserId(id: string) {
    return await this.missionRepo.getAllByUserId(id);
  }

  // Delete a mission
  async delete(id: string) {
    return await this.missionRepo.delete(id);
  }

  // Delete by user's id
  async deleteByUserId(id: string) {
    return await this.missionRepo.deleteByUserId(id);
  }

  // Update a mission
  async update(data: Partial<CreateMission>, id: string) {
    return await this.missionRepo.update(data, id);
  }
}

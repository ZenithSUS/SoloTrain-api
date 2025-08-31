import { MissionRepository } from "../repositories/mongoDb/mission-repository";
import { CreateMission } from "../types/mission";

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

  // Get a single mission
  async getOne(id: string) {
    return await this.missionRepo.getOne(id);
  }

  // Get by user's id
  async getAll(id: string, type: "daily" | "weekly") {
    return await this.missionRepo.getByUserId(id, type);
  }

  // Delete a mission
  async delete(id: string) {
    return await this.missionRepo.delete(id);
  }

  // Update a mission
  async update(data: Partial<CreateMission>, id: string) {
    return await this.missionRepo.update(data, id);
  }
}

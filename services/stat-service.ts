import { StatRepository } from "../repositories/mongoDb/stat-repository.js";
import { Stat } from "../types/stats.js";

export class StatService {
  // Dependency injection
  constructor(private statRepo: StatRepository) {}

  // Create a new stat
  async createStat(userId: string) {
    return this.statRepo.create(userId);
  }

  // Update a stat
  async updateStat(data: Partial<Stat>, id: string) {
    return this.statRepo.update(data, id);
  }

  // Reset a stat
  async resetStat(userId: string) {
    return this.statRepo.reset(userId);
  }
}

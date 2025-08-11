import { StatRepository } from "../repositories/mongoDb/stat-repository.js";

export class StatService {
  // Dependency injection
  constructor(private statRepo: StatRepository) {}

  // Create a new stat
  async createStat(userId: string) {
    return this.statRepo.create(userId);
  }
}

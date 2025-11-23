import { RecentRepository } from "../repositories/mongoDb/recent-repository.js";
import { Recent } from "../types/recent.js";

export class RecentService {
  // Dependency injection
  constructor(private recentRepo: RecentRepository) {}

  // Create recent
  async createRecent(data: Recent) {
    return this.recentRepo.create(data);
  }

  // Delete recent
  async deleteRecent(id: string) {
    return this.recentRepo.delete(id);
  }

  // Get all recent by user id paginated
  async getAllRecentByUserIdPaginated(
    id: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.recentRepo.getAllByUserIdPaginated(id, page, limit);
  }
}

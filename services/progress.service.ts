import { ProgressRepository } from "../repositories/mongoDb/progress-repository";
import { CreateProgress } from "../types/progess.js";

export class ProgressService {
  // Dependency injection
  constructor(private progressRepo: ProgressRepository) {}

  // Create a new progress
  async createProgress(data: CreateProgress) {
    return await this.progressRepo.create(data);
  }

  // Delete a progress
  async deleteProgress(id: string) {
    return await this.progressRepo.delete(id);
  }

  // Update a progress
  async updateProgress(data: Partial<CreateProgress>, id: string) {
    return await this.progressRepo.update(data, id);
  }

  // Get all progress
  async getAllProgress() {
    return await this.progressRepo.getAll();
  }

  // Get a single progress
  async getOneProgress(id: string) {
    return await this.progressRepo.getOne(id);
  }
}

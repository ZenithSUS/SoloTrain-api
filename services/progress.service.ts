import { ProgressRepository } from "../repositories/progress-repository";
import { CreateProgress } from "../types/progess";

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
  // Get all progress
  async getAllProgress() {
    return await this.progressRepo.getAll();
  }

  // Get a single progress
  async getOneProgress(id: string) {
    return await this.progressRepo.getOne(id);
  }
}

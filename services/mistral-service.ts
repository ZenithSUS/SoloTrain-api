import { MistralRepository } from "../repositories/AI/mistral-repository.js";
import { WorkoutCustomization } from "../types/workout.js";

export class MistralService {
  // Dependency injection
  constructor(private mistralRepo: MistralRepository) {}

  generateWorkOutPlan(data: WorkoutCustomization) {
    return this.mistralRepo.useGenerateWorkOutPlan(data);
  }
}

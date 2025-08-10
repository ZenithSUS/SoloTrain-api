import { MistralRepository } from "../repositories/AI/mistral-repository";
import { WorkoutCustomization } from "../types/workout";

export class MistralService {
  // Dependency injection
  constructor(private mistralRepo: MistralRepository) {}

  generateWorkOutPlan(data: WorkoutCustomization) {
    return this.mistralRepo.useGenerateWorkOutPlan(data);
  }
}

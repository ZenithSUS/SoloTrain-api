import { GroqRepository } from "../repositories/AI/groq-repository.js";
import { WorkoutCustomization } from "../types/workout.js";

export class GroqService {
  // Dependency injection
  constructor(private groqRepo: GroqRepository) {}

  // Generate workout plan
  generateWorkOutPlan(data: WorkoutCustomization) {
    return this.groqRepo.useGenerateWorkOutPlan(data);
  }
}

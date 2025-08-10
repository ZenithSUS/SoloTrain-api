import { GroqRepository } from "../repositories/AI/groq-repository.js";

export class GroqService {
  // Dependency injection
  constructor(private groqRepo: GroqRepository) {}

  // Generate workout plan
  generateWorkOutPlan(data: any) {
    return this.groqRepo.useGenerateWorkOutPlan(data);
  }
}

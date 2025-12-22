import { AdventureRepository } from "../repositories/mongoDb/adventure-repository.js";
import { AdventureCompletion } from "../types/adventure.js";

export class AdventureService {
  // Dependency injection
  constructor(private adventureRepository: AdventureRepository) {}

  async getAllCompletionsByUserId(userId: string) {
    return this.adventureRepository.getAllCompletionsByUserId(userId);
  }

  async getCompletionByUserId(userId: string, adventureId: number) {
    return this.adventureRepository.getCompletionByUserId(userId, adventureId);
  }

  async syncCompletion(userId: string, data: AdventureCompletion[]) {
    return this.adventureRepository.syncCompletion(userId, data);
  }

  async claimRewards(
    userId: string,
    adventureId: number,
    xp: number,
    points: number
  ) {
    return this.adventureRepository.claimRewards(
      userId,
      adventureId,
      xp,
      points
    );
  }
}

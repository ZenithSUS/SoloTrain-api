import { WithId } from "mongodb";
import { TrialRepository } from "../repositories/mongoDb/trials-repository.js";
import { Trials } from "../types/trials.js";

export class TrialService {
  constructor(private trialRepo: TrialRepository) {}

  async getTodayCompletions(userId: string) {
    return this.trialRepo.getTodayCompletions(userId);
  }

  async getTrialsByUserId(userId: string) {
    return this.trialRepo.getTrialsByUserId(userId);
  }

  async claimReward(data: Trials) {
    return this.trialRepo.claimReward(data);
  }

  async sync(userId: string, data: Trials[]): Promise<WithId<Trials>[]> {
    return this.trialRepo.sync(userId, data);
  }

  async getTrialByUserId(userId: string, trialId: number) {
    return this.trialRepo.getTrialByUserId(userId, trialId);
  }
}

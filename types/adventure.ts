import { ObjectId } from "mongodb";

export interface AdventureCompletion {
  userId: string;
  adventureId: number;
  completedAt: Date;
  rewardsClaimed: boolean;
  rewardsXP: number;
  rewardsPoints: number;
}

export interface AdventureCompletionDocument {
  _id: ObjectId;
  userId: string;
  adventureId: number;
  completedAt: Date;
  rewardsClaimed: boolean;
  rewardsXP: number;
  rewardsPoints: number;
}

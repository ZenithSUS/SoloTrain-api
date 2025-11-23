import { Stat } from "./stats.js";

// User interface
export type User = {
  accountId: string;
  fullName: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  isLevelUp: boolean;
  points: number;
  createdAt: Date;
  currentWorkoutPlan: string;
  currentWorkoutDay: number;
};

export type ShowUser = Omit<User, "accountId">;

export type UpdateUser = Partial<User>;

export type UserWithStats = ShowUser & {
  stats: Stat;
};

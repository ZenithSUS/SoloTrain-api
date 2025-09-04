import { Stat } from "./stats";

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
};

export type ShowUser = Omit<User, "accountId">;

export type UpdateUser = Partial<User>;

export type UserWithStats = ShowUser & {
  stats: Stat;
};

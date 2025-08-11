import { Stat } from "./stats";

// User interface
export type User = {
  accountId: string;
  fullName: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goal: string;
};

export type ShowUser = Omit<User, "accountId">;

export type UpdateUser = Partial<User>;

export type UserWithStats = ShowUser & {
  stats: Stat;
};

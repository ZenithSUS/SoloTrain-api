import { ObjectId } from "mongodb";

// Account interface
export type Account = {
  _id: string | ObjectId;
  email: string;
  password?: string | null; // Optional
  status: "active" | "inactive" | "deleted";
  isOauth: boolean;
  createdAt: Date;
  lastLogin?: Date | null;
};

export type CreateAccount = Omit<Account, "_id">;

export type UpdateAccount = {
  email?: string;
  password?: string;
  status?: "active" | "inactive" | "deleted";
};

export type ShowAccount = Omit<Account, "password">;

export type TokenAccount = Pick<Account, "_id" | "status">;

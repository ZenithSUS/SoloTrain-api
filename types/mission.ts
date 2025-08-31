import { ObjectId } from "mongodb";

// Mission interface
export type Mission = {
  _id?: ObjectId;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special";
  goal: {
    type: string; // e.g. "do_pushups", "run_km"
    initialValue?: number;
    value: number;
  };
  rank: "E" | "D" | "C" | "B" | "A";
  rewardXP: number;
  deadline?: Date;
  status: "pending" | "completed" | "failed";
  assignedTo?: string; // userId if personalized
};

export type CreateMission = Omit<Mission, "_id">;

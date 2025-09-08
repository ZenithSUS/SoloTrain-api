import { ObjectId } from "mongodb";

type MissionMode =
  | "reps" // push-ups, sit-ups, jumping jacks
  | "timer" // plank_seconds, stretch_minutes
  | "streak" // daily_streak, workout_sessions
  | "accumulate"; // xp_total, total pushups

// Mission interface
export type Mission = {
  _id?: ObjectId;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special";
  goal: {
    type: string; // e.g. "do_pushups", "run_km"
    value: number;
    unit: "reps" | "seconds" | "minutes" | "sessions" | "days" | "xp";
  };
  progress?: number;
  missionMode: MissionMode;
  instructions: string[];
  rank: "E" | "D" | "C" | "B" | "A" | "S";
  rewardXP: number;
  deadline?: Date;
  status: "pending" | "completed" | "failed";
  assignedTo?: string; // userId if personalized
};

export type CreateMission = Omit<Mission, "_id">;

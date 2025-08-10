// Mission interface
export type Mission = {
  title: string;
  description: string;
  type: "daily" | "weekly" | "custom";
  goal: {
    type: string; // e.g. "do_pushups", "run_km"
    value: number;
  };
  rewardXP: number;
  deadline: Date;
  status?: "active" | "completed" | "failed";
  assignedTo?: string; // userId if personalized
};

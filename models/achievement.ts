import mongoose from "mongoose";
import { Achievement } from "../types/achievement";

const achievementSchema = new mongoose.Schema<Achievement>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    criteria: {
      type: {
        type: String,
        required: true,
        enum: ["workout_count", "weight_lifted", "streak_days"],
      },
      value: { type: Number, required: true },
    },
    rewardXP: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);

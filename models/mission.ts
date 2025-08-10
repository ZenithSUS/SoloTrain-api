import mongoose from "mongoose";
import { Mission } from "../types/mission";

const missionSchema = new mongoose.Schema<Mission>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "custom"],
    },
    goal: {
      type: { type: String, required: true },
      value: { type: Number, required: true },
    },
    rewardXP: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "failed"],
      default: "active",
    },
    assignedTo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Mission", missionSchema);

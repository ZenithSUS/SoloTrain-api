import mongoose from "mongoose";
import { Mission } from "../types/mission.js";

const missionSchema = new mongoose.Schema<Mission>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "special"],
    },
    goal: {
      type: { type: String, required: true },
      value: { type: Number, required: true },
    },
    rewardXP: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    assignedTo: { type: String },
    missionMode: { type: String, required: true },
    rank: { type: String, required: true },
    progress: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Mission", missionSchema);

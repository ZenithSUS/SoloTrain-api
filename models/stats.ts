import mongoose, { Schema } from "mongoose";
import { Stat } from "../types/stats";

const StatSchema = new Schema<Stat>(
  {
    userId: { type: String, ref: "User", required: true },
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    currentMaxExp: { type: Number, default: 1000 },
    strength: { type: Number, default: 5 },
    agility: { type: Number, default: 5 },
    stamina: { type: Number, default: 5 },
    intelligence: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<Stat>("Stat", StatSchema);

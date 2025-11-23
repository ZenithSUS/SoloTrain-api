import mongoose from "mongoose";
import { Ranking } from "../types/ranking.js";

const rankingSchema = new mongoose.Schema<Ranking>(
  {
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    rankPosition: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Ranking", rankingSchema);

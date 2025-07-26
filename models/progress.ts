import mongoose from "mongoose";
import { Progess } from "../types/progess";

const progressSchema = new mongoose.Schema<Progess>({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  weight_kg: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Progress", progressSchema);

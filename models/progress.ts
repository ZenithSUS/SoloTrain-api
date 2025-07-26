import mongoose from "mongoose";
import { Progress } from "../types/progess";

const progressSchema = new mongoose.Schema<Progress>({
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

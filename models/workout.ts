import mongoose from "mongoose";
import { Workout } from "../types/workout";

const workoutSchema = new mongoose.Schema<Workout>({
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
  exercises: {
    type: Array,
    required: true,
  },
  duration_min: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Workout", workoutSchema);
